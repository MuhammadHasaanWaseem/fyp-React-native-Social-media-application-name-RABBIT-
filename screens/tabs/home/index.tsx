import React, { useEffect, useRef, useCallback } from 'react';
import { BackHandler, ToastAndroid, Platform, FlatList, View, Image, TouchableOpacity, Text as RNText } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/AuthProviders';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { MenuIcon, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { usePostsInfinite } from '@/hooks/use-posts';
import { useBlocked } from '@/hooks/use-blocked';
import PostRow from '@/components/shared/sharedview';
import { getFileUrl } from '@/lib/supabase';
import { homeStyles } from './styles';
import { PostSkeletonList, PostSkeletonFooter } from '@/components/shared/PostSkeleton';

export default () => {
  const { user } = useAuth();
  const router = useRouter();
  const { data, refetch, isLoading, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } = usePostsInfinite({ key: 'parent_id', value: null, type: 'is' });
  const { blockedIds = [] } = useBlocked(user?.id);
  const filteredData = data?.filter((p) => !blockedIds.includes(p.user_id)) ?? [];
  const avatarUri = `${user?.avatar || getFileUrl(user?.id || '', 'avatar.jpeg')}`;

  const backPressTimeRef = useRef(0);

  const listHeader = useCallback(
    () => (
      <View style={homeStyles.listHeaderWrap}>
        <View style={homeStyles.headerRow}>
          <View style={homeStyles.headerSlot}>
            <TouchableOpacity onPress={() => router.push('/drawer')} style={homeStyles.menuHit} hitSlop={12}>
              <MenuIcon size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={homeStyles.headerCenter}>
            <Image source={require('../../../assets/gif/RAB.gif')} style={homeStyles.headerLogo} />
          </View>
          <View style={[homeStyles.headerSlot, homeStyles.headerSlotRight]}>
            <TouchableOpacity
              style={homeStyles.headerProfileBtn}
              onPress={() => router.push('/profile')}
              activeOpacity={0.7}
            >
              <Avatar size="sm" style={{ borderWidth: 0, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                <AvatarFallbackText style={{ color: '#fff', fontSize: 12 }}>{user?.username || '?'}</AvatarFallbackText>
                <AvatarImage source={{ uri: avatarUri }} />
              </Avatar>
              <RNText numberOfLines={1} ellipsizeMode="tail" style={homeStyles.headerProfileName}>
                {user?.username || 'Profile'}
              </RNText>
              <ChevronRight size={16} color="rgba(255,255,255,0.45)" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [router, user?.username, avatarUri]
  );

  const renderPost = useCallback(
    ({ item }: { item: { id: string } }) => <PostRow item={item} refetch={refetch} />,
    [refetch]
  );

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const backAction = () => {
      if (router.canGoBack()) return false;
      const now = Date.now();
      if (backPressTimeRef.current && now - backPressTimeRef.current < 2000) {
        BackHandler.exitApp();
        return true;
      }
      backPressTimeRef.current = now;
      ToastAndroid.show('Press again to exit', ToastAndroid.SHORT);
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => sub.remove();
  }, [router]);

  return (
    <SafeAreaView style={{ backgroundColor: '#010118' }} className="flex-1">
      <FlatList
        data={filteredData}
        refreshing={isRefetching}
        onRefresh={refetch}
        onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        onEndReachedThreshold={0.3}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={isLoading ? <PostSkeletonList count={4} /> : null}
        ListFooterComponent={isFetchingNextPage ? <PostSkeletonFooter /> : null}
        renderItem={renderPost}
        contentContainerStyle={homeStyles.listContent}
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={5}
        windowSize={7}
        initialNumToRender={4}
      />
    </SafeAreaView>
  );
};
