import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Camera, Mic, MapPin, Image, Hash, ImagePlay } from 'lucide-react-native';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Heading } from '@/components/ui/heading';
import { useAuth } from '@/providers/AuthProviders';
import { Input, InputField } from '@/components/ui/input';
import { View } from '@/components/ui/view';

export default ({post,updatepost}:{post:any,updatepost:any}) => {
  const { user } = useAuth();

  
  return (
    
     

              <HStack className="items-center p-0">
                <VStack className="items-center">
                  <Avatar size="md" style={{ marginLeft: 20 }}>
                    <AvatarFallbackText>{user?.username}</AvatarFallbackText>
                    <AvatarImage  source={{ uri: user?.avatar }} />
                  </Avatar>
                  <View style={{ height: 40, borderLeftWidth: 1, borderColor: '#e2e8f0' }} />
                </VStack>

                <VStack space="md" className="flex-1">
                  <Card size="sm" className="m-1 bg-transparent ">
                   
                    
                    <VStack space="md" className="p-2">
                      <VStack>
                        <Heading size="md" className="mb-1">
                          {user?.username}
                        </Heading>
                        <Input className="border-0" size="md">
                          <InputField
                            value={post.text}
                            onChangeText={(text)=>updatepost(post.id,text)}
                            className="p-0 m-0"
                            placeholder="What's new?"
                            placeholderTextColor="#64748b"
                          />
                        </Input>
                      </VStack>
                      <HStack className="items-center justify-between">
                      <Image color="#64748b" size={20} strokeWidth={1.5}/>
              <Camera color="#64748b" size={20} strokeWidth={1.5}/>
              <ImagePlay color="#64748b" size={20} strokeWidth={1.5}/>
              <Hash color="#64748b" size={20} strokeWidth={1.5}/>
              <MapPin color="#64748b" size={20} strokeWidth={1.5}/>
              <Mic color="#64748b" size={20} strokeWidth={1.5}/>
                      </HStack>
                    </VStack>
                  </Card>
                  

  </VStack>
  </HStack>              

  );
};