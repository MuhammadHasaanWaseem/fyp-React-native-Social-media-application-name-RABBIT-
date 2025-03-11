import {useQuery} from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const getfollowers = async (userid: string) => {
    if(!userid) return null
        const { data, error } = await supabase
              .from('Followers')
              .select('*,user:User!user_id(*)')
              .eq('following_user_id', userid);

              if(!error) return data
      };
      
      
  export const usefollowers =(userid:string)=>{
         const{data,isLoading,error,refetch} =useQuery({
        queryKey:["followers",userid],
        queryFn:()=>getfollowers(userid)      
                    });
             return {data,isLoading,error,refetch}
    }