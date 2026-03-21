import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/providers/AuthProviders';
import { useQueryClient } from '@tanstack/react-query';
import { useBlockedUsers, useMyReports } from '@/hooks/use-blocked';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonText } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { supabase } from '@/lib/supabase';
import { getFileUrl } from '@/lib/supabase';
import { blockedStyles } from './styles';

const TABS = ['Blocked', 'Reported'];

export default function BlockedScreen() {
  const [selectedTab, setSelectedTab] = useState('Blocked');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { blockedUsers, refetch: refetchBlocked } = useBlockedUsers(user?.id);
  const { reports } = useMyReports(user?.id);

  const unblockUser = async (blockedUserId: string) => {
    const { error } = await supabase.from('Block').delete().eq('user_id', user?.id).eq('blocked_user_id', blockedUserId);
    if (!error) {
      await refetchBlocked();
      queryClient.invalidateQueries({ queryKey: ['blocked', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['blockedUsers', user?.id] });
    }
  };

  const renderBlocked = () => (
    <ScrollView contentContainerStyle={blockedStyles.listContent}>
      {!blockedUsers?.length ? (
        <Text style={blockedStyles.emptyText}>No blocked users</Text>
      ) : (
        blockedUsers.map((item: any) => (
          <View key={item.id} style={blockedStyles.row}>
            <Avatar size="md" style={blockedStyles.avatar}>
              <AvatarFallbackText style={{ color: 'black' }}>{item.username?.[0] || ''}</AvatarFallbackText>
              <AvatarImage source={{ uri: `${getFileUrl(item.id, 'avatar.jpeg')}?t=${Date.now()}` }} />
            </Avatar>
            <View style={blockedStyles.userInfo}>
              <Text style={blockedStyles.username}>{item.username}</Text>
            </View>
            <TouchableOpacity style={blockedStyles.unblockBtn} onPress={() => unblockUser(item.id)}>
              <Text style={blockedStyles.unblockText}>Unblock</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );

  const renderReported = () => (
    <ScrollView contentContainerStyle={blockedStyles.listContent}>
      {!reports?.length ? (
        <Text style={blockedStyles.emptyText}>No reported posts</Text>
      ) : (
        reports.map((item) => (
          <View key={item.post_id} style={blockedStyles.reportRow}>
            <View style={{ flex: 1 }}>
              <Text style={blockedStyles.reportText} numberOfLines={2}>
                {(item as any).post?.text || 'Post'}
              </Text>
              <Text style={blockedStyles.subText}>
                by @{(item as any).post?.User?.username || 'unknown'} • {item.reason}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );

  return (
    <SafeAreaView style={blockedStyles.container} edges={['top']}>
      <View style={blockedStyles.header}>
        <TouchableOpacity onPress={() => router.back()} style={blockedStyles.backBtn}>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text style={blockedStyles.title}>Blocked & Reported</Text>
      </View>
      <Divider style={{ marginBottom: 10 }} />
      <View style={blockedStyles.tabContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={blockedStyles.tabList}
          data={TABS}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isSelected = selectedTab === item;
            return (
              <Button
                onPress={() => setSelectedTab(item)}
                className={`${isSelected ? 'bg-white rounded-lg' : 'rounded-lg bg-transparent'}`}
                size="md"
                variant={isSelected ? 'solid' : 'outline'}
              >
                <ButtonText style={{ color: isSelected ? 'black' : 'white' }}>{item}</ButtonText>
              </Button>
            );
          }}
        />
      </View>
      {selectedTab === 'Blocked' ? renderBlocked() : renderReported()}
    </SafeAreaView>
  );
}
