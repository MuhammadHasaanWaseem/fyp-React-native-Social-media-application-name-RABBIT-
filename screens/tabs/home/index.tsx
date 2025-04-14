import React, { useEffect, useRef } from 'react';
import { BackHandler, ToastAndroid, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/AuthProviders';
import Rabbiticon from '@/assets/logo/Rabbiticon';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import {
  ImageIcon,
  Camera,
  ImagePlay,
  Mic,
  LockIcon,
  MessageCircleCodeIcon,
  Timer,
  AtSignIcon,
  MenuIcon,
  EyeOff,
  CalendarClock,
  Hourglass
} from 'lucide-react-native';
import { Pressable, FlatList, Image,StyleSheet, TouchableOpacity,Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Divider } from '@/components/ui/divider';
import { usePosts } from '@/hooks/use-posts';
import View from '@/components/shared/sharedview';
import { Menu } from '@/components/ui/menu';
const { width } = Dimensions.get('window');
export default () => {
  const { user } = useAuth();
  const router = useRouter();
  const { data, refetch, isLoading } = usePosts({ key: 'parent_id', value: null, type: 'is' });

  const backPressTimeRef = useRef(0);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const backAction = () => {
        const now = Date.now();
        // Check if the last back press was within 2 seconds (2000 ms)
        if (backPressTimeRef.current && now - backPressTimeRef.current < 2000) {
          BackHandler.exitApp(); // Exit the app if back is pressed twice quickly
          return true;
        } else {
          backPressTimeRef.current = now;
          ToastAndroid.show("Press again to exit", ToastAndroid.SHORT);
          return true; // Prevent default behavior (do nothing on single press)
        }
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }
  }, []);


  return (
    <SafeAreaView style={{ backgroundColor: '#010118' }} className="flex-1">
      {/* Top Logo */}
      <HStack className="justify-between items-center">
        {/* <TouchableOpacity onPress={() => router.push('/worldchat')}>
          <Globe style={{ marginTop: 20, marginLeft: 10 }} size={25} color={'white'} />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => router.push('/drawer')}>
          <MenuIcon style={{ marginTop: 20, marginLeft: 10 }} size={25} color={'white'} />
        </TouchableOpacity>
        <Image
          source={require('../../../assets/gif/RAB.gif')}
          style={styles.image}
        />
        {/* <Rabbiticon size={40} /> */}

        <TouchableOpacity onPress={() => router.push('/chatbot')}>
          <MessageCircleCodeIcon style={{ marginTop: 20, marginRight: 10 }} size={25} color={'white'} />
        </TouchableOpacity>
      </HStack>

      {/* "What's New?" Card for the logged-in user */}
      <Pressable onPress={() => router.push('/post')}>
        <HStack className="items-center p-4">
          <Avatar size="md" style={{ borderColor: 'white', backgroundColor: 'white' }}>
            <AvatarFallbackText style={{ color: 'black' }}>{user?.username || ''}</AvatarFallbackText>
            {/* <AvatarImage source={{ uri: user?.avatar }} /> */}
            <AvatarImage
              source={{ uri: `${user?.avatar}?t=${new Date().getTime()}` }}

            />
          </Avatar>

          <Card size="lg" className="m-1 bg-transparent">
            <VStack space="sm" className="p-2">
              <VStack>
                <Text style={{ color: 'white' }} className="mb-1 font-bold text-lg">
                  {user?.username || 'User'}
                </Text>
                <Text style={{ color: 'white' }} size="md">
                  What's new?
                </Text>
              </VStack>
              <HStack className="items-center" space="sm">
                <ImageIcon color="white" size={20} strokeWidth={1.5} />
                <Camera color="white" size={20} strokeWidth={1.5} />
                <ImagePlay color="white" size={20} strokeWidth={1.5} />
                <LockIcon color="white" size={20} strokeWidth={1.5} />
                <Mic color="white" size={20} strokeWidth={1.5} />
                <EyeOff color="white" size={20} strokeWidth={1.5} />
                <CalendarClock color="white" size={20} strokeWidth={1.5} />
                <Hourglass color="white" size={20} strokeWidth={1.5} />
                <AtSignIcon color="white" size={20} strokeWidth={1.5} />
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
          <>
            <View item={item} refetch={refetch} />

          </>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  
  image: {
    width: width * 0.1,  // 10 of the screen width
    height: width * 0.1, // 10% of the screen width
    marginTop:'3%'
  },
});


