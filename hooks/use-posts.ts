import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
interface PostProps {
  key: string,
  value: string | null
  type: 'is' | 'eq'
}

export const getPosts = async ({ key, value, type }: PostProps) => {
  console.log('[usePosts] Fetching - key:', key, 'value:', value, 'type:', type);
  const { data, error } = await supabase
    .from('Post')
    .select('*, User!user_id(*), Like(*), Comment(id)')
    .filter(key, type, value)
    .order('created_at', { ascending: false });
  console.log('[usePosts] Result - data count:', data?.length ?? 0, 'error:', error?.message ?? null);
  if (error) throw new Error(error.message);
  return data || [];
};


export const usePosts = ({ key, value, type }: PostProps) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["Posts", key, value, type],
    queryFn: () => getPosts({ key, value, type })
  });
  return { data, isLoading, error, refetch }
}