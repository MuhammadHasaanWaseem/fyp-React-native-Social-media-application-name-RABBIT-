import { HStack } from "@/components/ui/hstack";
import { AudioLines, Circle, CirclePause, CirclePlay } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import * as Crypto from "expo-crypto";
import { usePost } from "@/providers/PostProvider";
import { useAuth } from "@/providers/AuthProviders";

export default ({ id, uri,userid }: { id: string; uri?: string ,userid?:string}) => {
  const { user } = useAuth();
  const { uploadFile } = usePost();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    requestAudioPermissions();
  }, []);
  useEffect(()=>{
    if(uri) setRecordingUri(uri)
  },[uri])

  // Request Audio Permissions
  const requestAudioPermissions = async () => {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission to access microphone was denied");
    }
  };

  // Start Recording
  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  };

  // Stop Recording & Upload
  const stopRecording = async () => {
    if (!recording) return;

    setRecording(null);
    await recording.stopAndUnloadAsync();

    const uri = recording.getURI();
    if (!uri) return;

    setRecordingUri(uri);
    
    let filename = `${Crypto.randomUUID()}.m4a`;
    await uploadFile(id, uri, "audio/m4a", filename);

    let url = `${process.env.EXPO_PUBLIC_BUCKET_URL}/${user?.id}/${filename}`;
    setRecordingUri(url);
  };

  // Play Audio
  const playAudio = async () => {
    if (!recordingUri) return;

    const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
    setSound(sound);

    await sound.playAsync();
    setIsPlaying(true);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded || status.didJustFinish) {
        setIsPlaying(false);
        sound.unloadAsync();
      }
    });
  };

  // Pause Audio
  const pauseAudio = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  // UI for Playing Audio
  if (recordingUri) {
    return (
      <HStack
        space="3xl"
        style={{ backgroundColor: "lightgrey", width: "65%" }}
        className="rounded-full items-center p-2"
      >
        <HStack className="items-center">
          <TouchableOpacity onPress={isPlaying ? pauseAudio : playAudio}>
            {isPlaying ? (
              <CirclePause color={"green"} size={20} />
            ) : (
              <CirclePlay color={"blue"} size={20} />
            )}
          </TouchableOpacity>
          {Array.from({ length: 7 }).map((_, index) => (
            <AudioLines key={index} size={24} color={"black"} />
          ))}
        </HStack>
      </HStack>
    );
  }

  // UI for Recording Audio
  return (
    <HStack
      space="3xl"
      style={{ backgroundColor: "lightgrey", width: "65%" }}
      className="rounded-full items-center p-2"
    >
      <HStack className="items-center">
        <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
          {recording ? (
            <Circle fill={"red"} color={"green"} size={20} />
          ) : (
            <Circle color={"red"} fill={"red"} size={20} />
          )}
        </TouchableOpacity>
        {Array.from({ length: 7 }).map((_, index) => (
          <AudioLines key={index} size={24} color={"black"} />
        ))}
      </HStack>
    </HStack>
  );
};
