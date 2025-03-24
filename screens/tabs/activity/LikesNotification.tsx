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

const LikesNotification = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);

    // First, fetch the IDs of posts created by the current user.
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

    // Then, fetch likes for those posts where the liker is not the user.
    const { data, error } = await supabase
      .from('Like')
      .select(`
         id,
         created_at,
         user:User!user_id ( id, username, avatar ),
         post_id
      `)
      .in('post_id', postIds)
      .neq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching like notifications:", error);
    } else {
      setNotifications(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [user, fetchNotifications]);

  // Optionally allow the owner to remove the like notification.
  const deleteLike = async (likeId) => {
    Alert.alert(
      "Remove Like",
      "Are you sure you want to remove this like notification?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from('Like')
              .delete()
              .eq('id', likeId);
            if (error) {
              console.error("Error removing like:", error);
              Alert.alert("Error", "Could not remove the like. Please try again.");
            } else {
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
        <VStack space='md' style={{ flex: 1 }}>
          <HStack space="md" >
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
          <Text style={{ color: 'white'}}>
            liked your post.
          </Text>
        </VStack>
        {/* Optionally, show a delete button if you want the owner to remove the like notification */}
        {user?.id === item.post_id && (
          <TouchableOpacity onPress={() => deleteLike(item.id)} style={{ padding: 4 }}>
            <Trash2 color="white" size={18} />
          </TouchableOpacity>
        )}
      </HStack>
      <Divider style={{ borderWidth: 1, borderColor: 'grey', marginTop: '5%' }} />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
      ) : notifications.length === 0 ? (
        <View style={{ padding: 14, alignItems:'center', justifyContent:'center', flex:1 }}>
          <Text style={{ color: 'grey' }}>No like notifications yet!</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{}}
          refreshing={loading}
          onRefresh={fetchNotifications}
        />
      )}
    </SafeAreaView>
  );
};

export default LikesNotification;
