import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Camera, Mic, MapPin, ImageIcon, Hash, ImagePlay, ToyBrick, Eraser } from 'lucide-react-native';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Heading } from '@/components/ui/heading';
import { useAuth } from '@/providers/AuthProviders';
import { Input, InputField } from '@/components/ui/input';
import { View } from '@/components/ui/view';
import { FlatList, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';
import { Image } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Post } from '@/lib/type';
import { Video, ResizeMode } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePost } from '@/providers/PostProvider';
import { useVideoPlayer } from '@/providers/VideoPlayerProvider';
import Audio from './audio';
interface PostCardprops {

  post:Post,

}
export default ({ post }:  PostCardprops) => {
  
  const { user } = useAuth();
  const {threadId} =useLocalSearchParams();
const[showaudio,setshowaudio]= useState(false)
 const router = useRouter();
 const{uploadFile,updatepost,Photo,MediaType,setMediaType,setPhoto} =usePost();
 const videoRef = useRef<Video>(null); // Create a ref for the video
 //vedio provider
 const { playVideo } = useVideoPlayer();  
  // Photo and Video Picker Function
  const addPhotoAndVideo = async () => {
   
    setPhoto('');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.All,// Fix: Use proper mediaType
      allowsEditing: true,
      aspect: [6, 5],
      quality: 0.5,
      
    });
 setshowaudio(false);
if(!result.assets?.[0]?.uri) return;
    let uri = result.assets?.[0]?.uri;
    let type = result.assets?.[0]?.mimeType;
let name =uri?.split('/').pop();
    console.log(uri, type);
    setPhoto(uri);
    setMediaType(type)
uploadFile(post.id,uri,type,name);
  
  };
const musicplayer =()=>{
  setPhoto('');
setMediaType('')
  setshowaudio(!showaudio)
}
  return (
    <HStack className="items-center p-0">
      <VStack className="items-center">
        <Avatar  size="md" style={{ marginLeft: 20,backgroundColor:'white' }}>
          <AvatarFallbackText     style={{color:'#141414'}} >{user?.username}</AvatarFallbackText>
          <AvatarImage source={{ uri: user?.avatar }} />
        </Avatar>
        <View style={{ height: 40, borderLeftWidth: 1, borderColor: '#e2e8f0' }} />
      </VStack>

      <VStack space="md" className="flex-1">
        <Card size="sm" className="m-1 bg-transparent">
          <VStack space="md" className="p-2">
            <VStack>
              <Heading  style={{color:'white'}} size="md" className="mb-1">
                {user?.username}
              </Heading>
              <Input className="border-0" size="md">
                <InputField
                  value={post.text}
                  onChangeText={(text) => updatepost(post.id, "text",text)}
                  className="p-0 m-0"
                  placeholder="What's new?"
                  placeholderTextColor="#64748b"
                  style={{color:'white'}}
                />
              </Input>
              {Photo && MediaType?.startsWith("image/") ? (
  <Image source={{ uri: Photo }} style={{ height: 150, width: 150, borderRadius: 10 }} />
) : null} 
{/* // something is wrong here */}
{showaudio && <Audio id ={post.id}/>}

{Photo && MediaType?.startsWith("video/") ? (
  <Video
  ref={videoRef}
    source={{ uri: Photo }}
    style={{ height: 150, width: 150, borderRadius: 10 }}
    useNativeControls
    resizeMode={ResizeMode.CONTAIN}
    onPlaybackStatusUpdate={(status) => {
      if (status.isLoaded && status.isPlaying && videoRef.current) {
        playVideo(videoRef.current);
      }
    }}
  />
) : null}

             
            </VStack>
            <HStack className="items-center gap-7">
              <TouchableOpacity onPress={addPhotoAndVideo}>
                <ImageIcon color="white" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{
                
                setPhoto('');
                router.push({
                pathname:'/camera',
                params:{threadId:post.id}
              })}}>
                <Camera color="white" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity>
                <ImagePlay onPress={()=>router.push('/gif')}color="white" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Hash color="white" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity>
                <MapPin color="white" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Mic color="white" size={20} strokeWidth={1.5} onPress={()=>setshowaudio(!showaudio)}/>
              </TouchableOpacity>
            </HStack>
          </VStack>
        </Card>
      </VStack>
    </HStack>
  );
};