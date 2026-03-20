import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProviders';
import { supabase } from '@/lib/supabase';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { Post } from '@/lib/type';
import { router } from 'expo-router';

export const Postcontext = React.createContext({
  PostCard: [] as Post[],
  updatepost: (id: string, key: string, value: string) => { },
  uploadpost: () => { },
  clearpost: () => { },
  addthreads: () => { },
  uploadFile: (id: string, uri: string, type: string, name: string) => { },
  MediaType: '',
  setMediaType: (uri: string) => { },
  setPhoto: (uri: string) => { },
  Photo: '',
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
    console.log('[PostProvider] uploadpost called, PostCard:', JSON.stringify(PostCard, null, 2));
    const { data, error } = await supabase
      .from('Post')
      .insert(PostCard)
      .order('created_at', { ascending: false });
    console.log('[PostProvider] Supabase insert result - data:', data, 'error:', error);
    clearpost();
    router.back();
    if (!error) {
      clearpost();
      setPhoto('');
      console.log('[PostProvider] Post created successfully');
    } else {
      console.error('[PostProvider] Post creation failed:', error);
    }
    return data;
  };
  //...............
  const uploadFile = async (id: string, uri: string, type: string, name: string) => {
    if (!user?.id) return;
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      const arrayBuffer = decode(base64);
      const filePath = `${user.id}/${name}`;
      const { data, error } = await supabase.storage
        .from('files')
        .upload(filePath, arrayBuffer, { contentType: type, cacheControl: '3600', upsert: true });
      if (error) console.error('[PostProvider] uploadFile error:', error);
      else if (data) updatepost(id, 'file', name);
    } catch (e) {
      console.error('[PostProvider] uploadFile error:', e);
    }
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
  const addthreads = () => {
    SetPostCard([...PostCard, { ...defaultpost, parent_id: PostCard[0].id }])
  }

  return (
    <Postcontext.Provider value={{ PostCard, MediaType, setMediaType, addthreads, updatepost, uploadpost, clearpost, uploadFile, Photo, setPhoto }}>
      {children}
    </Postcontext.Provider>
  );
};