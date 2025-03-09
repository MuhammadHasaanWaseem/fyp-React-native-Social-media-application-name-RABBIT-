import {useQuery} from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export const getfollowing = async (userid: string) => {
    if(!userid) return null
        const { data, error } = await supabase
              .from('Followers')
              .select('*,following_user:User!following_user_id(*)')
              .eq('user_id', userid);
              const following =data?.map((follower)=>follower?.following_user_id)
              console.log(following)
              console.log(data)
              if(!error) return following
      };
      
      
  export const usefollowing =(userid:string)=>{
         const{data,isLoading,error,refetch} =useQuery({
        queryKey:["following",userid],
        queryFn:()=>getfollowing(userid)      
                    });
             return {data,isLoading,error,refetch}
    }