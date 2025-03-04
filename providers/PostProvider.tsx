import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProviders';
import { supabase } from '@/lib/supabase';
import * as Crypto from 'expo-crypto';
import { Post } from '@/lib/type';
import { Alert } from 'react-native';
import { router } from 'expo-router';

export const Postcontext = React.createContext({
  PostCard: [] as Post[],
  updatepost: (id: string, key: string, value: string) => {},
  uploadpost: () => {},
  clearpost: () => {},
  addthreads:()=>{},
  uploadFile : ( id:string,uri: string, type: string,name: string) => {},
  MediaType:'', 
  setMediaType:(uri:string)=>{},
  setPhoto:(uri:string)=>{},
  Photo:'',
});

export const usePost = () => React.useContext(Postcontext);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  // Ensure that user exists before creating a default post.
  const defaultpost: Post = {
    id: Crypto.randomUUID(),
    user_id: user?.id || '',
    parent_id: null,
    text: '',
    
  };

  const [PostCard, SetPostCard] = useState<Post[]>([]);
  const [Photo, setPhoto] = useState('');
  const [MediaType, setMediaType] = useState('');


  useEffect(() => {
    if (user) {
      SetPostCard([defaultpost]);
    }
  }, [user]);

  const uploadpost = async () => {
    const { data, error } = await supabase
    
      .from('Post')
      .insert(PostCard)
      .order('created_at', { ascending: false });
      clearpost()

      router.back();

    if (!error) 
      clearpost(),
      setPhoto('')
      return data;    
    
   
  };
  //...............
  const uploadFile = async ( id:string,uri: string, type: string,name: string) => {
         
      // Extract filename from URI
      // const fileName = uri.split('/').pop() || `upload_${Date.now()}`;
  
      let newFormData = new FormData();
      newFormData.append('file', {
        uri,
        name,
        type,
      } ); // Adding `as any` to satisfy TypeScript FormData type
  
      const { data, error } = await supabase.storage
        .from(`files/${user?.id}`)
        .upload(name, newFormData);
  if(data) updatepost(id,'file',data?.path);
      console.log(data, error);
    };
 

  const updatepost = async (id: string, key: string, value: string) => {

    SetPostCard(PostCard.map((p: Post) => (p.id === id ? { ...p, [key]: value } : p)));
    const { data, error } = await supabase
      .from('Post')
      .update({ [key]: value })
      .eq('id', id);
    // Optionally handle data and error
  };

  const clearpost = () => {
    
    SetPostCard([defaultpost]);
    setPhoto('')
    setMediaType('')
    
    
  };
  const addthreads =()=>{
    SetPostCard([...PostCard,{...defaultpost,parent_id: PostCard[0].id}])
  }

  return (
    <Postcontext.Provider value={{ PostCard,MediaType, setMediaType,addthreads, updatepost, uploadpost, clearpost ,uploadFile,Photo,setPhoto}}>
      {children}
    </Postcontext.Provider>
  );
};