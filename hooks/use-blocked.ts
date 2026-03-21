import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const getBlockedIds = async (userId: string) => {
  if (!userId) return [];
  const { data } = await supabase.from('Block').select('blocked_user_id').eq('user_id', userId);
  return (data || []).map((r) => r.blocked_user_id);
};

export const getBlockedUsers = async (userId: string) => {
  if (!userId) return [];
  const { data } = await supabase
    .from('Block')
    .select('blocked_user_id, id')
    .eq('user_id', userId);
  if (!data?.length) return [];
  const ids = data.map((r) => r.blocked_user_id);
  const { data: users } = await supabase.from('User').select('id, username, avatar').in('id', ids);
  return (users || []).map((u) => ({ ...u, blockId: data.find((b) => b.blocked_user_id === u.id)?.id }));
};

export const getMyReports = async (userId: string) => {
  if (!userId) return [];
  const { data } = await supabase.from('Report').select('post_id, reason, created_at').eq('user_id', userId);
  if (!data?.length) return [];
  const postIds = data.map((r) => r.post_id);
  const { data: posts } = await supabase.from('Post').select('id, text, user_id, User!user_id(username, avatar)').in('id', postIds);
  return (data || []).map((r) => ({ ...r, post: posts?.find((p) => p.id === r.post_id) }));
};

export const useBlocked = (userId?: string) => {
  const queryClient = useQueryClient();
  const { data = [], refetch } = useQuery({
    queryKey: ['blocked', userId],
    queryFn: () => (userId ? getBlockedIds(userId) : []),
    enabled: !!userId
  });
  return { blockedIds: data, refetch, invalidate: () => queryClient.invalidateQueries({ queryKey: ['blocked', userId] }) };
};

export const useBlockedUsers = (userId?: string) => {
  const { data = [], refetch } = useQuery({
    queryKey: ['blockedUsers', userId],
    queryFn: () => (userId ? getBlockedUsers(userId) : []),
    enabled: !!userId
  });
  return { blockedUsers: data, refetch };
};

export const useMyReports = (userId?: string) => {
  const { data = [], refetch } = useQuery({
    queryKey: ['myReports', userId],
    queryFn: () => (userId ? getMyReports(userId) : []),
    enabled: !!userId
  });
  return { reports: data, refetch };
};
