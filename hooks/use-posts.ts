import {useQuery} from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
interface PostProps {
key : string,
value :string |null
type : 'is' | 'eq'
}

export const getPosts = async ({key,value,type}:PostProps) => {
        const { data, error } = await supabase
          .from('Post')
          .select('*, User(*),Like(*),Comment(id)')
          //.is('parent_id', null)
          //.filter('parent_id','is', null)
          .filter(key,type,value)
          .order('created_at', { ascending: false });
        
        if (error) {
          throw new Error(error.message);
        }
        return data || [];
      };
      
      
  export const usePosts =({key,value,type}:PostProps)=>{
         const{data,isLoading,error,refetch} =useQuery({
        queryKey:["Posts",key,value,type],
        queryFn:()=>getPosts({key,value,type})      
                    });
             return {data,isLoading,error,refetch}
    }