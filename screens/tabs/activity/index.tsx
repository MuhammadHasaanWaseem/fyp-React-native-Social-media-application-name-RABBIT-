import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator, TouchableOpacity, Image, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProviders';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { Text as CustomText } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export default() => {
  const { user } = useAuth();
  const [likesNotifications, setLikesNotifications] = useState<any[]>([]);
  const [commentsNotifications, setCommentsNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'likes' | 'comments'>('likes');

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      setLoading(true);
      // Fetch like notifications for posts owned by the current user
      const { data: likesData, error: likesError } = await supabase
        .from('Like')
        .select('*, post:Post!post_id(*), user:User!user_id(*)')
        .eq('post.user_id', user.id);
      if (likesError) console.error('Error fetching like notifications:', likesError);

      // Fetch comment notifications for posts owned by the current user
      const { data: commentsData, error: commentsError } = await supabase
        .from('Comment')
        .select('*, post:Post!post_id(*), user:User!user_id(*)')
        .eq('post.user_id', user.id);
      if (commentsError) console.error('Error fetching comment notifications:', commentsError);

      // Sort each array by created_at descending
      const sortedLikes = (likesData || []).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const sortedComments = (commentsData || []).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setLikesNotifications(sortedLikes);
      setCommentsNotifications(sortedComments);
      setLoading(false);
    };

    fetchNotifications();
  }, [user]);

  const renderLikeItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#333' }}>
      <HStack style={{ alignItems: 'center' }}>
        {item.user?.avatar ? (
          <Image
            source={{ uri: item.user.avatar }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          />
        ) : (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#555',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
            }}
          >
            <Text style={{ color: 'white' }}>{item.user?.username?.charAt(0)}</Text>
          </View>
        )}
        <VStack>
          <CustomText style={{ color: 'white', fontWeight: 'bold' }}>
            {item.user?.username} liked your post
          </CustomText>
          <CustomText style={{ color: 'grey', fontSize: 12 }}>
            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
          </CustomText>
        </VStack>
      </HStack>
    </TouchableOpacity>
  );

  const renderCommentItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#333' }}>
      <HStack style={{ alignItems: 'center' }}>
        {item.user?.avatar ? (
          <Image
            source={{ uri: item.user.avatar }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          />
        ) : (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#555',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
            }}
          >
            <Text style={{ color: 'white' }}>{item.user?.username?.charAt(0)}</Text>
          </View>
        )}
        <VStack>
          <CustomText style={{ color: 'white', fontWeight: 'bold' }}>
            {item.user?.username} commented on your post
          </CustomText>
          <CustomText style={{ color: 'grey', fontSize: 12 }}>
            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
          </CustomText>
          <CustomText style={{ color: 'white', marginTop: 4 }}>
            {item.text}
          </CustomText>
        </VStack>
      </HStack>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (activeTab === 'likes') {
      if (likesNotifications.length === 0) {
        return (
          <CustomText style={{ color: 'grey', textAlign: 'center', marginVertical: 20 }}>
            No likes yet
          </CustomText>
        );
      }
      return (
        <FlatList
          data={likesNotifications}
          keyExtractor={(item, index) => item.id + index.toString()}
          renderItem={renderLikeItem}
          contentContainerStyle={{ paddingHorizontal: 14 }}
        />
      );
    } else {
      if (commentsNotifications.length === 0) {
        return (
          <CustomText style={{ color: 'grey', textAlign: 'center', marginVertical: 20 }}>
            No comments yet
          </CustomText>
        );
      }
      return (
        <FlatList
          data={commentsNotifications}
          keyExtractor={(item, index) => item.id + index.toString()}
          renderItem={renderCommentItem}
          contentContainerStyle={{ paddingHorizontal: 14 }}
        />
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#141414' }}>
      {/* Header */}
      <HStack style={{ marginTop: 10, marginHorizontal: 14, alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="white" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', position: 'absolute', left: 0, right: 0 }}>
          <CustomText style={{ color: 'white', fontWeight: '900', fontSize: 16 }}>
            Activity
          </CustomText>
        </View>
      </HStack>
      <Divider style={{ marginVertical: 10, backgroundColor: '#333' }} />

      {/* Tab Buttons */}
      <HStack style={{ justifyContent: 'center', marginBottom: 10 }}>
        <TouchableOpacity onPress={() => setActiveTab('likes')} style={{ padding:4,paddingHorizontal:30,borderRadius:18,marginHorizontal: 40 }}>
          <CustomText style={{ 
            color: activeTab === 'likes' ? 'white' : 'grey', 
            fontWeight: activeTab === 'likes' ? 'bold' : 'bold', 
            fontSize: 16 
          }}>
            Likes
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('comments')} style={{padding:4,paddingHorizontal:10,borderRadius:18, marginHorizontal: 20 }}>
          <CustomText style={{ 
            color: activeTab === 'comments' ? 'white' : 'grey', 
            fontWeight: activeTab === 'comments' ? 'bold' : 'bold', 
            fontSize: 16 
          }}>
            Comments
          </CustomText>
        </TouchableOpacity>
      </HStack>

      {/* Notifications Content */}
      {loading ? (
        <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
      ) : (
        renderContent()
      )}
    </SafeAreaView>
  );
};

