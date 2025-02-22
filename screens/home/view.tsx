import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import { useState, useRef } from "react";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Heart, Send, MessageCircle, Repeat, Volume2, VolumeX, Pause, Play, RotateCcw } from "lucide-react-native";
import { Divider } from "@/components/ui/divider";
import { formatDistanceToNow } from "date-fns";
import { Post } from "@/lib/type";
import { Video } from "expo-av";

export default ({ item }: { item: Post }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0); // Percentage (0 - 100)
const [currentTime, setCurrentTime] = useState(0); // Current time in seconds
const [duration, setDuration] = useState(0); // Total duration in seconds

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReplay = async () => {
    if (!videoRef.current) return;

    await videoRef.current.setPositionAsync(0); // Seek to start
    await videoRef.current.playAsync();
    setIsPlaying(true);
    setVideoFinished(false);
  };

  return (
    <Card>
      <HStack space="md">
        <Avatar size="sm">
          {item.User?.avatar ? (
            <AvatarImage source={{ uri: item.User.avatar }} />
          ) : (
            <AvatarFallbackText>{item.User?.username?.charAt(0) || ""}</AvatarFallbackText>
          )}
        </Avatar>
        <VStack className="flex-1">
          <HStack className="items-center" space="md">
            <Text style={{ fontWeight: "bold", fontSize: 17 }}>{item.User?.username || ""}</Text>
            <Text style={{ fontSize: 12 }}>
              {item?.created_at &&
                formatDistanceToNow(
                  new Date(new Date(item.created_at).getTime() - new Date().getTimezoneOffset() * 60000),
                  { addSuffix: true }
                )}
            </Text>
          </HStack>
          <Text className="text-black">{item.text}</Text>
          <Text>{""}</Text>

          <HStack>
            {item.file &&
              (item.file.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                <Image
                  source={{
                    uri: `https://wjfmftrlgfpvqdvasdhf.supabase.co/storage/v1/object/public/files/${item.user_id}/${item.file}`,
                  }}
                  style={{ height: 150, width: 200, borderRadius: 10 }}
                />
              ) : item.file.match(/\.(mp4|mov|avi|mkv)$/i) ? (
                <>
                  {/* Show loading spinner until the video is ready */}
                  {isLoading && (
                    <ActivityIndicator size="large" color="grey" style={{ height: 300, width: 200 }} />
                  )}

                  <Video
                    ref={videoRef}
                    source={{
                      uri: `https://wjfmftrlgfpvqdvasdhf.supabase.co/storage/v1/object/public/files/${item.user_id}/${item.file}`,
                    }}
                    style={[
                      { height: 300, width: 200, borderRadius: 10 },
                      isLoading ? { display: "none" } : {}, // Hide video while loading
                    ]}
                    useNativeControls={false}
                    onPlaybackStatusUpdate={(status) => {
                      if (status.positionMillis && duration) {
                        const progressPercentage = (status.positionMillis / (duration * 1000)) * 100;
                        setProgress(progressPercentage);
                        setCurrentTime(status.positionMillis / 1000);
                      }
                      if (status.didJustFinish) {
                        setIsPlaying(false);
                        setVideoFinished(true);
                      }
                    }}
                    isMuted={isMuted}
                    isLooping={false}
                    resizeMode="cover"
                    onLoad={() => setIsLoading(false)} // Video is ready
                    onPlaybackStatusUpdate={(status) => {
                      if (status.didJustFinish) {
                        setIsPlaying(false);
                        setVideoFinished(true);
                      }
                    }}
                  />

                  {/* Play, Pause, Mute, and Replay Buttons */}
                  <VStack>
                    <TouchableOpacity style={{ marginBottom: 4 }} onPress={handlePlayPause}>
                      {isPlaying ? <Pause size={20} color="grey" /> : <Play size={20} color="grey" />}
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginBottom: 4 }}  onPress={() => setIsMuted(!isMuted)}>
                      {isMuted ? <VolumeX size={20} color="grey" /> : <Volume2 size={20} color="grey" />}
                    </TouchableOpacity>

                    {videoFinished && (
                      <TouchableOpacity onPress={handleReplay}>
                        <RotateCcw size={20} color="grey" />
                      </TouchableOpacity>
                    )}
                  </VStack>
                  
                </>
              ) : null)}
          </HStack>
         

         <VStack style={{paddingTop:16}}>
         <HStack space="lg" className="items-center pt-1">
            <Heart color="black" size={20} strokeWidth={1} />
            <MessageCircle color="black" size={20} strokeWidth={1} />
            <Repeat color="black" size={20} strokeWidth={1} />
            <Send color="black" size={20} strokeWidth={1} />
          </HStack>
         </VStack>
        </VStack>
      </HStack>
      <Divider className="w-full" style={{ marginTop: 30 }} />
    </Card>
  );
};
