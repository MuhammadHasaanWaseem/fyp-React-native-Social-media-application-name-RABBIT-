import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, ActivityIndicator, View, Alert } from 'react-native';
import { useAuth } from '@/providers/AuthProviders';
import { supabase } from '@/lib/supabase';
import { HStack } from '@/components/ui/hstack';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Divider } from '@/components/ui/divider';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react-native';

const CommentsNotification = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    // First, fetch the IDs of posts created by the user.
    const postsRes = await supabase
      .from('Post')
      .select('id')
      .eq('user_id', user.id);
      
    if (postsRes.error) {
      console.error("Error fetching posts:", postsRes.error);
      setLoading(false);
      return;
    }
    
    const postIds = postsRes.data.map(post => post.id);
    if (postIds.length === 0) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    
    // Then, fetch comments for those posts where the commenter is not the user.
    const { data, error } = await supabase
      .from('Comment')
      .select(`
         id,
         text,
         created_at,
         user:User!user_id ( id, username, avatar )
      `)
      .in('post_id', postIds)
      .neq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching comment notifications:", error);
    } else {
      setNotifications(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [user, fetchNotifications]);

  const deleteComment = async (commentId) => {
    Alert.alert(
      "Delete Comment",
      "Are you sure you want to delete this comment?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from('Comment')
              .delete()
              .eq('id', commentId);
            if (error) {
              console.error("Error deleting comment:", error);
              Alert.alert("Error", "Could not delete the comment. Please try again.");
            } else {
              // Refresh notifications after deletion.
              fetchNotifications();
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <SafeAreaView>
      <HStack style={{ marginTop: 10 }} space="md" className="items-center">
        <Avatar size="lg">
          <AvatarFallbackText style={{ color: "white" }}>
            {item.user.username.charAt(0)}
          </AvatarFallbackText>
          <AvatarImage source={{ uri: item.user.avatar }} />
        </Avatar>
        <VStack style={{ flex: 1 }}>
          <HStack space='md' >
            <TouchableOpacity onPress={() => router.push({
                pathname: '/user',
                params: { userid: item.user.id }
              })}>
              <Text style={{ color: 'white', fontWeight: '700' }}>
                {item.user.username}
              </Text>
            </TouchableOpacity>
            <Text style={{ color: 'grey', fontSize: 12 }}>
              {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
            </Text>
          </HStack>
          <Text style={{ color: 'white', marginTop: 4 }}>
            commented: "{item.text.length > 50 ? item.text.substring(0, 50) + '...' : item.text}" on your post
          </Text>
        </VStack>
        <TouchableOpacity onPress={() => deleteComment(item.id)} style={{ padding: 4 }}>
          <Trash2 color="white" size={18} />
        </TouchableOpacity>
      </HStack>
      <Divider style={{ borderWidth: 1, borderColor: 'grey', marginTop: 5 }} />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
      ) : notifications.length === 0 ? (
        <View style={{ padding: 14, alignItems:'center', justifyContent:'center', flex:1 }}>
          <Text style={{ color: 'grey' }}>No comments yet!</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 14 }}
          refreshing={loading}
          onRefresh={fetchNotifications}
        />
      )}
    </SafeAreaView>
  );
};

export default CommentsNotification;
