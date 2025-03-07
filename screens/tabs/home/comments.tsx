import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  ActivityIndicator, 
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert
} from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Divider } from '@/components/ui/divider';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/providers/AuthProviders';

const Comments = () => {
  const { id } = useLocalSearchParams(); // Ensure the post ID is passed correctly
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  // Fetch comments
  const fetchComments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Comment')
      .select('*, user:User!user_id(*)')
      .eq('post_id', id)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments(data);
    }
    setLoading(false);
  }, [id]);

  const addComment = async () => {
    if (!id || !newComment.trim()) return;
    const commentToAdd = {
      id: Math.random().toString(), // Temporary ID
      post_id: id,
      user_id: user?.id,
      text: newComment,
      created_at: new Date().toISOString(),
      user: { id: user?.id, username: user?.username, avatar: user?.avatar },
    };

    setComments([commentToAdd, ...comments]);
    setNewComment('');

    const { error } = await supabase.from('Comment').insert({
      post_id: id,
      user_id: user?.id,
      text: newComment,
    });
    if (error) fetchComments();
  };

  const deleteComment = async (commentId) => {
    Alert.alert("Delete Comment", "Are you sure you want to delete this comment?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: async () => {
        setComments(comments.filter(comment => comment.id !== commentId));
        const { error } = await supabase.from('Comment').delete().eq('id', commentId);
        if (error) {
          console.error("Error deleting comment:", error);
          fetchComments();
        }
      }, style: "destructive" }
    ]);
  };

  useEffect(() => { fetchComments(); }, [id, fetchComments]);

  const renderItem = ({ item }) => (
    <VStack style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#333' }}>
      <HStack style={{ alignItems: 'center', marginBottom: 4, justifyContent: 'space-between' }}>
        <HStack style={{ alignItems: 'center' }}>
          {item.user?.avatar ? (
            <Image source={{ uri: item.user.avatar }} style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }} />
          ) : (
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#555', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
              <Text style={{ color: 'white' }}>{item.user?.username?.charAt(0)}</Text>
            </View>
          )}
          <Text style={{ color: 'white', fontWeight: 'bold', marginRight: 10 }}>{item.user?.username}</Text>
          <Text style={{ color: 'grey', fontSize: 12 }}>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</Text>
        </HStack>
        {item.user_id === user?.id && (
          <TouchableOpacity onPress={() => deleteComment(item.id)}>
            <Trash2 color='white' size={18} />
          </TouchableOpacity>
        )}
      </HStack>
      <Text style={{ color: 'white' }}>{item.text}</Text>
    </VStack>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#141414' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={80}>
        <View style={{ flex: 1, backgroundColor: '#141414' }}>
          <HStack style={{ marginTop: 43, marginHorizontal: 14, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft color='white' />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center', position: 'absolute', left: 0, right: 0 }}>
              <Text style={{ color: 'white', fontWeight: '900', fontSize: 16 }}>Comments</Text>
            </View>
          </HStack>
          <Divider style={{ marginVertical: 10, backgroundColor: '#333' }} />
          <View style={{ paddingHorizontal: 14, paddingVertical: 5 }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>{comments.length} Comments</Text>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
          ) : comments.length === 0 ? (
            <View style={{ padding: 14 }}>
              <Text style={{ color: 'grey' }}>No comments yet. Be the first to comment!</Text>
            </View>
          ) : (
            <FlatList data={comments} keyExtractor={(item) => item.id} renderItem={renderItem} contentContainerStyle={{ paddingHorizontal: 14 }} refreshing={loading} onRefresh={fetchComments} />
          )}
          <HStack style={{ padding: 14, borderTopWidth: 1, borderTopColor: '#333', marginBottom: 45 }}>
            <TextInput value={newComment} onChangeText={setNewComment} placeholder="Add a comment..." placeholderTextColor="grey" style={{ flex: 1, backgroundColor: '#1f1f1f', color: 'white', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 }} />
            <TouchableOpacity onPress={addComment} style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Post</Text>
            </TouchableOpacity>
          </HStack>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Comments;
