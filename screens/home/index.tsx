import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/AuthProviders';
import Rabbiticon from '@/assets/logo/Rabbitlogo';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Image, Camera, ImagePlay, Mic, Hash, MapPin } from 'lucide-react-native';
import { Pressable, FlatList, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Divider } from '@/components/ui/divider';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

export default () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // setLoading(true);

    if (pathname === '/') {
      getThreads();
      setLoading(false);
    }
  }, [pathname]);

  // Fetch posts along with their associated user data via the join
  const getThreads = async () => {
    const { data, error } = await supabase
      .from('Post')
      .select('*, User(*)')
       .is('parent_id',null)
      .order('created_at', { ascending: false });
    console.log(data, error);
    if (!error && data) setThreads(data);
  };

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
              <Image color="#64748b" size={20} strokeWidth={1.5}/>
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
      {loading ? (
              <View className="flex-1 justify-center items-center">
                <Spinner size="large" color={'black'} />
              </View>
            ) : (
      <FlatList 
        data={threads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HStack space="md" className="p-3">
            <Avatar size="sm">
              {item.User?.avatar ? (
                <AvatarImage source={{ uri: item.User.avatar }} />
              ) : (
                <AvatarFallbackText>
                  {item.User?.username ? item.User.username.charAt(0) : ''}
                </AvatarFallbackText>
              )}
            </Avatar>
            <VStack className="flex-1">
              <HStack>
                <Text style={{ fontWeight: 'bold', fontSize: 17 }}>
                  {item.User?.username || ''},{" "}
                </Text>
                <Text>{new Date(item.created_at).toLocaleDateString()}</Text>
              </HStack>
              <Text>{item.text}</Text>
            </VStack>
          </HStack>
        )}
      />  )}
    </SafeAreaView>
  );
}; 