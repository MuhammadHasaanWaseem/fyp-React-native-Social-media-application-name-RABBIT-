import { ActivityIndicator, Image, TouchableOpacity, View, Modal } from "react-native";
import { useState, useRef } from "react";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Heart, Send, MessageCircle, Repeat, Volume2, VolumeX, Pause, Play, RotateCcw } from "lucide-react-native";
import { formatDistanceToNow } from "date-fns";
import { Post } from "@/lib/type";
import { Video } from "expo-av";
import ImageViewing from "react-native-image-viewing";
import { useRouter } from "expo-router";
import Audio from '@/screens/post/audio';

export default ({ item }: { item: Post }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageVisible, setImageVisible] = useState(false);
  
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
    await videoRef.current.setPositionAsync(0);
    await videoRef.current.playAsync();
    setIsPlaying(true);
    setVideoFinished(false);
  };
  

  return (
     <Card style={{backgroundColor:'#141414'}}>
      <HStack space="md">
        {/* user logo/icon */}
        <Avatar style={{borderWidth:1,borderColor:'white',backgroundColor:'white'}} size="sm">
          {item.User?.avatar ? (
            <AvatarImage source={{ uri: item.User.avatar }} />
          ) : (
            <AvatarFallbackText size={17}  style={{color:'black',fontWeight:'700'}}>{item.User?.username?.charAt(0) || ""}</AvatarFallbackText>
          )}
        </Avatar>
        {/* username */}
        <VStack className="flex-1">
          <HStack className="items-center" space="md">
            <Text style={{ fontWeight: "bold",color:'white', fontSize: 17 }}>{item.User?.username || ""}</Text>
            <Text style={{ color:'white', fontSize: 12 }}>
              {item?.created_at &&
              // efficeint time zone format
                formatDistanceToNow(
                  new Date(new Date(item.created_at).getTime() - new Date().getTimezoneOffset() * 60000),
                  { addSuffix: true }
                )}
                
            </Text>
            {/* {item?.place?.name && <Text style={{color:'white',fontSize:8}} >lahore , {item?.place?.name}</Text>} */}
{/* <Text style={{color:'white', fontSize:8}}>, CHICAGO</Text> */}
          </HStack>
          {/* uploading or displaying text uploaded by the user */}
          <Text className="text-black" style={{color:'white'}}>{item.text}</Text>
          <Text>{""}</Text>
          {/* AUDIO */}
          <Text>{""}</Text>
          {item?.file && (item?.file.match(/\.(mp3|m4a)$/i)?( <Audio userId={item?.user_id} id ={item.id} uri={`https://wjfmftrlgfpvqdvasdhf.supabase.co/storage/v1/object/public/files/${item.user_id}/${item.file}`}/>):null)}

          {/* images and vedios upload note this file doen'nt effect db functionlity */}
          <HStack>
            {item.file &&
              (item.file.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                <>
                  {/* images */}
                  <TouchableOpacity onPress={() => setImageVisible(true)}>
                    {/* IMAGES */}
                    <Image
                      source={{
                        uri: `https://wjfmftrlgfpvqdvasdhf.supabase.co/storage/v1/object/public/files/${item.user_id}/${item.file}`,
                      }}
                      style={{ height: 150, width: 200, borderWidth:1,borderColor:'black',borderRadius: 10 }}
                      resizeMode="cover"
                    />  
                </TouchableOpacity>
                      {/* Modal that will allow user to zoom images */}
                  <Modal visible={isImageVisible} transparent={true} onRequestClose={() => setImageVisible(false)}>
                 
                    <ImageViewing
                      images={[{ uri: `https://wjfmftrlgfpvqdvasdhf.supabase.co/storage/v1/object/public/files/${item.user_id}/${item.file}` }]}
                      imageIndex={0}
                      visible={isImageVisible}
                      onRequestClose={() => setImageVisible(false)}
                    />
                  </Modal>
                </>
              ) : item.file.match(/\.(mp4|mov|avi|mkv)$/i) ? (
                <>
                  {isLoading && (
                    // if the image is not loaded yet
                    <ActivityIndicator size="large" color="white" style={{ height: 300, width: 200 }} />
                  )}

                  {/* vedio uploading or displaying */}
                  <Video
                    ref={videoRef}
                    source={{
                      uri: `https://wjfmftrlgfpvqdvasdhf.supabase.co/storage/v1/object/public/files/${item.user_id}/${item.file}`,
                    }}
                    style={{ height: 300, width: 200,borderWidth:0.5,borderColor:'black', borderRadius: 10 }}
                    useNativeControls={false}
                    
                    isMuted={isMuted}
                    isLooping={false}
                    resizeMode="cover"
                    onLoad={() => setIsLoading(false)}
                  />
                  <View style={{
  position: "absolute",
  gap:6,
  left:120,
  bottom:6,
  flexDirection: "row",
  justifyContent: "space-between"
}}>
                    {/* shows only when the vedio played fully */}
                    {videoFinished && (
                   <TouchableOpacity style={{backgroundColor:'#2f2f2f',borderRadius:50,padding:2}}  onPress={handleReplay}>
                   <RotateCcw size={15} color="grey" />
                 </TouchableOpacity>
                  )}    
                 {/* pause play button */}
                    <TouchableOpacity style={{backgroundColor:'#2f2f2f',borderRadius:50,padding:2}}  onPress={handlePlayPause}>
                      {isPlaying ? <Pause size={15} color="grey" /> : <Play size={15} color="grey" />}
                    </TouchableOpacity>
                    {/* mute un mute button */}
                    <TouchableOpacity style={{ backgroundColor:'#2f2f2f',borderRadius:50,padding:2}} onPress={() => setIsMuted(!isMuted)}>
                      {isMuted ? <VolumeX size={15} color="grey" /> : <Volume2 size={15} color="grey" />}
                    </TouchableOpacity>
                    {/* replay button */}
                   </View>
                  
                </>
              ) : null)}
          </HStack>
          <VStack style={{ paddingTop: 16 }}>
            <HStack space="lg" className="items-center pt-1">
              {/* like */}
              <Heart color="white" size={20} strokeWidth={1} />
              {/* comment */}
              <TouchableOpacity >
              <MessageCircle color="white" size={20} strokeWidth={1}  />
              </TouchableOpacity>
              {/* repost */}
              <Repeat color="white" size={20} strokeWidth={1} />
              {/* send */}
              <Send color="white" size={20} strokeWidth={1} />
            </HStack>
          </VStack>
        </VStack>
      </HStack>
      {/* horizontally underluned underline */}
      {/* <Divider orientation="horizontal" style={{ marginTop: 30,width:'190%' }} /> */}
      
    </Card>
  );
};
