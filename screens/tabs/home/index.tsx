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
  AtSignIcon,
  MenuIcon,
  EyeOff,
  CalendarClock,
  Hourglass
} from 'lucide-react-native';
import { Pressable, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Divider } from '@/components/ui/divider';
import { usePostsInfinite } from '@/hooks/use-posts';
import { useBlocked } from '@/hooks/use-blocked';
import View from '@/components/shared/sharedview';
import { getFileUrl } from '@/lib/supabase';
import { wp, hp } from '@/lib/helper';
import { homeStyles } from './styles';
import { PostSkeletonList, PostSkeletonFooter } from '@/components/shared/PostSkeleton';
export default () => {
  const { user } = useAuth();
  const router = useRouter();
  const { data, refetch, isLoading, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } = usePostsInfinite({ key: 'parent_id', value: null, type: 'is' });
  const { blockedIds = [] } = useBlocked(user?.id);
  const filteredData = data?.filter((p) => !blockedIds.includes(p.user_id)) ?? [];

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
      <HStack className="justify-between items-center">
        
        <TouchableOpacity onPress={() => router.push('/drawer')}>
          <MenuIcon style={{ marginTop: hp(2.5), marginLeft: wp(2.5) }} size={25} color={'white'} />
        </TouchableOpacity>
        <Image
          source={require('../../../assets/gif/RAB.gif')}
          style={homeStyles.image}
        />

        <TouchableOpacity onPress={() => {}}>
        </TouchableOpacity>
      </HStack>
      {/* "What's New?" Card for the logged-in user */}
      <Pressable onPress={() => router.push('/post')}>
        <HStack className="items-center " style={{ paddingHorizontal: wp(5) }}>
          <Avatar size="md" style={{ borderColor: 'white', backgroundColor: 'white' }}>
            <AvatarFallbackText style={{ color: 'black' }}>{user?.username || ''}</AvatarFallbackText>
            {/* <AvatarImage source={{ uri: user?.avatar }} /> */}
            <AvatarImage source={{ uri: `${user?.avatar || getFileUrl(user?.id || '', 'avatar.jpeg')}?t=${Date.now()}` }} />
          </Avatar>

          <Card size="lg" className=" bg-transparent">
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
        data={filteredData}
        refreshing={isRefetching}
        onRefresh={refetch}
        onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        onEndReachedThreshold={0.3}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={isLoading ? <PostSkeletonList count={4} /> : null}
        ListFooterComponent={isFetchingNextPage ? <PostSkeletonFooter /> : null}
        renderItem={({ item }) => <View item={item} refetch={refetch} />}
      />
    </SafeAreaView>
  );
};

