//use-Mentions.tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const getmention = async (userId: string) => {
    if (!userId) return [];
    const { data, error } = await supabase
      .from('Followers')
      .select('following_user:following_user_id (id, username, avatar)')
      .eq('user_id', userId);
  
    if (error) throw new Error(error.message);
    return data?.map((item) => item.following_user) || [];
  };

export const usemention = (userId: string) => {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: () => getmention(userId),
    enabled: !!userId, // Only run if userId exists
    // staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    
  });
};