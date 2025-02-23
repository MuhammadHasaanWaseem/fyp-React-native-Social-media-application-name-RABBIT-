import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/AuthProviders';
import Rabbiticon from '@/assets/logo/Rabbiticon';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { ImageIcon, Camera, ImagePlay, Mic, Hash, MapPin,Heart,Send,MessageCircle, Repeat } from 'lucide-react-native';
import { Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Divider } from '@/components/ui/divider';
import { usePosts } from '@/hooks/use-posts';
import View from './view';
// import { useEffect } from 'react';


export default () => {
  const { user } = useAuth();
  const router = useRouter();
  const{data,refetch,isLoading} =usePosts();
  // const pathname = usePathname();  
  // useEffect(() => {
  //   if (pathname === '/') {
  //   refetch();
  //   }
  // }, [pathname]);

  
 
  return (
    <SafeAreaView style={{backgroundColor:'#141414'}} className=" flex-1">
      
      {/* Top Logo */}
      <HStack className=" justify-center items-center">
        <Rabbiticon size={40} />
        <VStack>
        <Text style={{color:'#FF5700',fontWeight:700}}></Text>
        {/* <Text style={{color:'#FF5700',fontWeight:700,fontSize:20}}> ☠ 𝕽𝖆𝖇𝖇𝖎𝖙 ◔◔</Text> */}
        <Text style={{color:'white',fontWeight:700,fontSize:20}}> 𝕽𝖆𝖇𝖇𝖎𝖙 </Text>

        </VStack>
      </HStack>
      
      {/* "What's New?" Card for the logged-in user */}
      <Pressable onPress={() => router.push('/post')}>
        <HStack className="items-center p-4">
          <Avatar size="md" style={{borderWidth:1,borderColor:'white',backgroundColor:'white'}}>
            <AvatarFallbackText style={{color:'black'}} >{user?.username || ''}</AvatarFallbackText>
            <AvatarImage  source={{ uri: user?.avatar }} />
          </Avatar>

          <Card size="lg" className="m-3 bg-transparent">
            <VStack space="sm" className="p-2">
              <VStack>
                <Text style={{color:'white'}} className="mb-1 font-bold text-lg">
                  {user?.username || 'User'}
                </Text>
                <Text style={{color:'white'}}  size="md">What's new?</Text>
              </VStack>
              <HStack className="items-center" space="3xl">
              <ImageIcon color="white" size={20} strokeWidth={1.5}/>
              <Camera color="white" size={20} strokeWidth={1.5}/>
              <ImagePlay color="white" size={20} strokeWidth={1.5}/>
              <Hash color="white" size={20} strokeWidth={1.5}/>
              <MapPin color="white" size={20} strokeWidth={1.5}/>
              <Mic color="white" size={20} strokeWidth={1.5}/>
              </HStack>
            </VStack>
          </Card>
          
        </HStack>
        
        <Divider />
      </Pressable>
      
      <FlatList  
        data={data}
        refreshing={isLoading}
        onRefresh={refetch}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          
          <><View item={item} />
          {/* <Divider orientation="horizontal" style={{ marginTop: 20, width: '190%' }} /> */}
          </>
          
        )}
        
      />  
     

    </SafeAreaView>
  );
}; 