// Mention.tsx
import React, { useState } from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProviders';
import { HStack } from '@/components/ui/hstack';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { router, useLocalSearchParams } from 'expo-router';
import { Divider } from '@/components/ui/divider';
import { Spinner } from '@/components/ui/spinner';

const fetchMentions = async (username: string) => {
  const { data, error } = await supabase
    .from('Post')
    .select('id, text, user:User(id, username, avatar), created_at')
    .textSearch('text', `'@${username}'`) // Assuming mentions are stored as @username in text
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export default function Mention() {
  const { user } = useAuth();
  const { data: mentions, isLoading, refetch } = useQuery({
    queryKey: ['mentions', user?.username],
    queryFn: () => fetchMentions(user?.username || ''),
    enabled: !!user?.username
  });
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/user', params: { userid: item.user.id } })}
    >
      <HStack space="md" className="items-center p-3">
        <Avatar size="md">
          <AvatarFallbackText>{item.user.username[0]}</AvatarFallbackText>
          {item.user.avatar && <AvatarImage source={{ uri: item.user.avatar }} />}
        </Avatar>
        <Text style={{ color: 'white', flex: 1 }}>
          <Text style={{ fontWeight: 'bold' }}>{item.user.username}</Text> mentioned you in a post captioned as "{item.text}"
        </Text>
      </HStack>
      <Divider />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#010118' }}>
      <FlatList
        data={mentions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
        
          isLoading ? (
            <Spinner color={'white'} size={24} />
          ) : (
            <Text style={{ color: 'white', textAlign: 'center', padding: 20 }}>
              No mentions yet.
            </Text>
          )
        }
      />
    </SafeAreaView>
  );
}
