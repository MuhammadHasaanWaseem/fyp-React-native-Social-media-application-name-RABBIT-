import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

const PAGE_SIZE = 15;

interface PostProps {
  key: string;
  value: string | null;
  type: 'is' | 'eq';
}

export const getPosts = async ({ key, value, type }: PostProps) => {
  const { data, error } = await supabase
    .from('Post')
    .select('*, User!user_id(*), Like(*), Comment(id)')
    .filter(key, type, value)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
};

export const getPostsPaginated = async ({ key, value, type }: PostProps, page: number) => {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const { data, error } = await supabase
    .from('Post')
    .select('*, User!user_id(*), Like(*), Comment(id)')
    .filter(key, type, value)
    .order('created_at', { ascending: false })
    .range(from, to);
  if (error) throw new Error(error.message);
  return data || [];
};

export const usePosts = ({ key, value, type }: PostProps) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["Posts", key, value, type],
    queryFn: () => getPosts({ key, value, type })
  });
  return { data, isLoading, error, refetch };
};

export const usePostsInfinite = ({ key, value, type }: PostProps) => {
  const { data, isLoading, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: ["PostsInfinite", key, value, type],
    queryFn: ({ pageParam }) => getPostsPaginated({ key, value, type }, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length < PAGE_SIZE ? undefined : pages.length,
  });
  const allPosts = data?.pages.flat() ?? [];
  return { data: allPosts, isLoading, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage, refetch };
};