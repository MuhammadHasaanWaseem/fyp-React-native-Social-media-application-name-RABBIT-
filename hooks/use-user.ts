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
      export const getSearchUsers = async () => {
            const { data, error } = await supabase
                  .from('User')
                  .select()
                  .order('created_at',{ascending:true}).limit(50);
                  if(!error) return data;
          };
      
  export const useUser =(userid?:string)=>{
         const{data,isLoading,error,refetch} =useQuery({
        queryKey:["user",userid],
        queryFn:()=>userid ? getUser(userid):getSearchUsers()      
                    });
             return {data,isLoading,error,refetch}
    }