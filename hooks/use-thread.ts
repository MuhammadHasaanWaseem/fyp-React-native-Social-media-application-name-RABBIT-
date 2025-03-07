import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const getThread = async (id: string) => {
  const { data, error } = await supabase
    .from('Post')
    .select('*, User:User!:user_id(*),Post(*,User:User!user_id(*))')
    .filter('id','eq',id)
    .order('created_at', { ascending: false })

  if (!error) return data
}

export const useThread = (id: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['thread'],
    queryFn: () => getThread(id)
  })

  return { data, isLoading, error, refetch }
}
