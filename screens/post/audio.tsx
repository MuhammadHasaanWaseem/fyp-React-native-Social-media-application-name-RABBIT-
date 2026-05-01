//-->post/audio.tsx
import { HStack } from "@/components/ui/hstack";
import { AudioLines, Circle, CirclePause, CirclePlay } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import * as Crypto from "expo-crypto";
import { usePost } from "@/providers/PostProvider";
import { useAuth } from "@/providers/AuthProviders";
import { useVideoPlayer } from "@/providers/VideoPlayerProvider";

export default ({ id, uri, userid }: { id: string; uri?: string, userid?: string }) => {
  const { user } = useAuth();
  const { uploadFile } = usePost();
  const { notifyAudioPlaying, releaseAudio } = useVideoPlayer();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    requestAudioPermissions();
  }, []);
  useEffect(() => {
    if (uri) setRecordingUri(uri)
  }, [uri])

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync().catch(() => {});
        releaseAudio(sound);
      }
    };
  }, [sound, releaseAudio]);

  const playbackAudioMode = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      shouldDuckAndroid: false,
      playThroughEarpieceAndroid: false,
    });
  };

  // Request Audio Permissions
  const requestAudioPermissions = async () => {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission to access microphone was denied");
    }
    await playbackAudioMode();
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
    await playbackAudioMode();

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
    if (sound) {
      await sound.unloadAsync().catch(() => {});
      releaseAudio(sound);
      setSound(null);
    }

    await playbackAudioMode();
    const { sound: next } = await Audio.Sound.createAsync(
      { uri: recordingUri },
      { volume: 1, isMuted: false, shouldPlay: false }
    );
    await next.setVolumeAsync(1);
    setSound(next);
    await notifyAudioPlaying(next);
    await next.playAsync();
    setIsPlaying(true);

    next.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded || status.didJustFinish) {
        setIsPlaying(false);
        releaseAudio(next);
        next.unloadAsync().catch(() => {});
      }
    });
  };

  // Pause Audio
  const pauseAudio = async () => {
    if (sound) {
      await sound.pauseAsync();
      releaseAudio(sound);
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
            <Circle fill={"blue"} color={"green"} size={20} />
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
