import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/AuthProviders';
import Rabbiticon from '@/assets/logo/Rabbiticon';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { ImageIcon, Camera, ImagePlay, Mic, Hash ,Globe, LockIcon, MessageCircleCodeIcon } from 'lucide-react-native';
import { Pressable, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Divider } from '@/components/ui/divider';
import { usePosts } from '@/hooks/use-posts';
import View from '@/components/shared/sharedview'
// import { useEffect } from 'react';


export default () => {
  const { user } = useAuth();
  const router = useRouter();
  const{data,refetch,isLoading} =usePosts({key:'parent_id',value:null,type:'is'});

  
 
  return (
    <SafeAreaView style={{backgroundColor:'#141414'}} className=" flex-1">
      {/* Top Logo */}
      <HStack className="justify-between items-center ">
<TouchableOpacity onPress={()=>router.push('/worldchat')}>
<Globe style={{marginTop:20,marginLeft:10}} size={25} color={'white'}/>

</TouchableOpacity>
  <TouchableOpacity onPress={()=>router.reload()}>
  <Rabbiticon size={40} />

  </TouchableOpacity>
  <TouchableOpacity onPress={()=>router.push('/chatbot')} >
    <MessageCircleCodeIcon style={{marginTop:20,marginRight:10}} size={25} color={'white'} />
  </TouchableOpacity>
  
</HStack>

      
      {/* "What's New?" Card for the logged-in user */}
      <Pressable onPress={() => router.push('/post')}>
        <HStack className="items-center p-4">
          <Avatar size="md" style={{borderColor:'white',backgroundColor:'white'}}>
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
              <LockIcon color="white" size={20} strokeWidth={1.5}/>
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
          
          <><View item={item} refetch={refetch} />
          </>
          
        )}
        
      />  
     

    </SafeAreaView>
  );
}; 