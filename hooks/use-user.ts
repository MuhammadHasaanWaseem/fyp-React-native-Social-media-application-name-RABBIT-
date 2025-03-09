import {useQuery} from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const getUser = async (userid: string) => {
    if(!userid) return null
        const { data, error } = await supabase
              .from('User')
              .select()
              .eq('id', userid);
              if(!error) return data[0]
      };
      
      
  export const useUser =(userid:string)=>{
         const{data,isLoading,error,refetch} =useQuery({
        queryKey:["user",userid],
        queryFn:()=>getUser(userid)      
                    });
             return {data,isLoading,error,refetch}
    }