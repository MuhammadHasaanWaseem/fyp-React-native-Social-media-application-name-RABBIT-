import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Camera, Mic, MapPin, ImageIcon, Hash, ImagePlay, ToyBrick } from 'lucide-react-native';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Heading } from '@/components/ui/heading';
import { useAuth } from '@/providers/AuthProviders';
import { Input, InputField } from '@/components/ui/input';
import { View } from '@/components/ui/view';
import { FlatList, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Post } from '@/lib/type';
import { Video, ResizeMode } from 'expo-av';
interface PostCardprops {

  post:Post,
  updatepost: (id: string, key: string, value: string) => void

}
export default ({ post, updatepost }:  PostCardprops) => {
  const { user } = useAuth();
  const [Photo, setPhoto] = useState('');

  // Upload file function
  const uploadFile = async (uri: string, type: string,name: string) => {
   
    // Extract filename from URI
    // const fileName = uri.split('/').pop() || `upload_${Date.now()}`;

    let newFormData = new FormData();
    newFormData.append('file', {
      uri,
      name,
      type,
    } ); // Adding `as any` to satisfy TypeScript FormData type

    const { data, error } = await supabase.storage
      .from(`files/${user?.id}`)
      .upload(name, newFormData);
if(data) updatepost(post.id,'file',data?.path);
    console.log(data, error);
  };

  // Photo and Video Picker Function
  const addPhotoAndVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'] ,// Fix: Use proper mediaType
      allowsEditing: true,
      allowsMultipleSelection:true,
      aspect: [4, 3],
      quality: 1,
    });


    let uri = result.assets?.[0]?.uri;
    let type = result.assets?.[0]?.mimeType;
let name =uri?.split('/').pop();
    console.log(uri, type);
    setPhoto(uri);
uploadFile(uri,type,name);
  
  };

  return (
    <HStack className="items-center p-0">
      <VStack className="items-center">
        <Avatar size="md" style={{ marginLeft: 20 }}>
          <AvatarFallbackText>{user?.username}</AvatarFallbackText>
          <AvatarImage source={{ uri: user?.avatar }} />
        </Avatar>
        <View style={{ height: 40, borderLeftWidth: 1, borderColor: '#e2e8f0' }} />
      </VStack>

      <VStack space="md" className="flex-1">
        <Card size="sm" className="m-1 bg-transparent">
          <VStack space="md" className="p-2">
            <VStack>
              <Heading size="md" className="mb-1">
                {user?.username}
              </Heading>
              <Input className="border-0" size="md">
                <InputField
                  value={post.text}
                  onChangeText={(text) => updatepost(post.id, "text",text)}
                  className="p-0 m-0"
                  placeholder="What's new?"
                  placeholderTextColor="#64748b"
                />
              </Input>
              {/* {Photo &&
                (Photo.toLowerCase().endsWith('.mp4') ? (
                  <Video
                    source={{ uri: Photo }}
                    style={{ height: 200, width: 200, borderRadius: 10 }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                  />
                ) : (
                  <Image
                    source={{ uri: Photo }}
                    style={{ height: 100, width: 100, borderRadius: 10 }}
                  />
                ))}
              */}
 <Image
                    source={{ uri: Photo }}
                    style={{ height: 100, width: 100, borderRadius: 10 }}
                  /> 
                  {/* {Photo.length > 0 && (
                <FlatList
                  data={Photo}
                  horizontal
                  keyExtractor={(item, index) => item + index}
                  renderItem={({ item }) => (
                    <Image
                      source={{ uri: item }}
                      style={{
                        height: 100,
                        width: 100,
                        borderRadius: 10,
                        marginRight: 10,
                      }}
                    />
                  )}
                />
              )} */}
             
            </VStack>
            <HStack className="items-center gap-7">
              <TouchableOpacity onPress={addPhotoAndVideo}>
                <ImageIcon color="#64748b" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Camera color="#64748b" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity>
                <ImagePlay color="#64748b" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Hash color="#64748b" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity>
                <MapPin color="#64748b" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Mic color="#64748b" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
            </HStack>
          </VStack>
        </Card>
      </VStack>
    </HStack>
  );
};
