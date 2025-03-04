import React, { useState, useEffect } from 'react';
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
  SafeAreaView
} from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Divider } from '@/components/ui/divider';
import { ArrowLeft } from 'lucide-react-native';
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

  const fetchComments = async () => {
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
  };

  const addComment = async () => {
    if (!id) {
      console.error("Error: post_id is missing");
      return;
    }
    if (!newComment.trim()) return;
    const { error } = await supabase
      .from('Comment')
      .insert({
        post_id: id,
        user_id: user?.id,
        text: newComment,
      });
    if (error) {
      console.error('Error adding comment:', error);
    } else {
      setNewComment('');
      fetchComments();
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  const renderItem = ({ item }) => (
    <VStack style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#333' }}>
      <HStack style={{ alignItems: 'center', marginBottom: 4 }}>
        {item.user?.avatar ? (
          <Image
            source={{ uri: item.user.avatar }}
            style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}
          />
        ) : (
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: '#555',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
            }}
          >
            <Text style={{ color: 'white' }}>{item.user?.username?.charAt(0)}</Text>
          </View>
        )}
        <Text style={{ color: 'white', fontWeight: 'bold', marginRight: 10 }}>
          {item.user?.username}
        </Text>
        <Text style={{ color: 'grey', fontSize: 12 }}>
          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
        </Text>
      </HStack>
      <Text style={{ color: 'white' }}>{item.text}</Text>
    </VStack>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#141414' }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#141414' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 20}
      >
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
          {loading ? (
            <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingHorizontal: 14 }}
            />
          )}
          <HStack style={{ padding: 14, borderTopWidth: 1, borderTopColor: '#333', marginBottom: 45 }}>
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment..."
              placeholderTextColor="grey"
              style={{
                flex: 1,
                backgroundColor: '#1f1f1f',
                color: 'white',
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 8,
              }}
            />
            <TouchableOpacity
              onPress={addComment}
              style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Post</Text>
            </TouchableOpacity>
          </HStack>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Comments;
