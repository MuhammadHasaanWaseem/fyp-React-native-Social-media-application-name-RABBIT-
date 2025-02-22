import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/AuthProviders';
import Rabbiticon from '@/assets/logo/Rabbitlogo';
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
    <SafeAreaView className="bg-white flex-1">
      
      {/* Top Logo */}
      <HStack className="justify-center items-center">
        <Rabbiticon size={33} />
      </HStack>
      
      {/* "What's New?" Card for the logged-in user */}
      <Pressable onPress={() => router.push('/post')}>
        <HStack className="items-center p-4">
          <Avatar size="md">
            <AvatarFallbackText>{user?.username || ''}</AvatarFallbackText>
            <AvatarImage source={{ uri: user?.avatar }} />
          </Avatar>

          <Card size="lg" className="m-3 bg-transparent">
            <VStack space="sm" className="p-2">
              <VStack>
                <Text className="mb-1 font-bold text-lg">
                  {user?.username || 'User'}
                </Text>
                <Text size="md">What's new?</Text>
              </VStack>
              <HStack className="items-center" space="3xl">
              <ImageIcon color="#64748b" size={20} strokeWidth={1.5}/>
              <Camera color="#64748b" size={20} strokeWidth={1.5}/>
              <ImagePlay color="#64748b" size={20} strokeWidth={1.5}/>
              <Hash color="#64748b" size={20} strokeWidth={1.5}/>
              <MapPin color="#64748b" size={20} strokeWidth={1.5}/>
              <Mic color="#64748b" size={20} strokeWidth={1.5}/>
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
          <View item={item}/>
        )}
      />  
    </SafeAreaView>
  );
}; 