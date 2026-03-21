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
  updatepost: (id: string, key: string, value: string | string[]) => { },
  uploadpost: () => { },
  clearpost: () => { },
  addthreads: () => { },
  uploadFile: (id: string, uri: string, type: string, name: string, skipUpdate?: boolean) => { },
  MediaType: '',
  setMediaType: (type: string) => { },
  setPhoto: (uri: string) => { },
  setPhotos: (uris: string[]) => { },
  Photo: '',
  Photos: [] as string[],
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
  const [Photos, setPhotos] = useState<string[]>([]);
  const [MediaType, setMediaType] = useState('');


  useEffect(() => {
    if (user) {
      SetPostCard([defaultpost]);
    }
  }, [user]);

  const uploadpost = async () => {
    const payload = PostCard.map((p) => {
      const { file, ...rest } = p;
      const fileArr = !file ? [] : Array.isArray(file) ? file : [file];
      return { ...rest, ...(fileArr.length ? { file: fileArr } : {}) };
    });
    const { data, error } = await supabase
      .from('Post')
      .insert(payload)
      .order('created_at', { ascending: false });
    console.log('[PostProvider] Supabase insert result - data:', data, 'error:', error);
    if (!error) {
      clearpost();
      setPhoto('');
      setPhotos([]);
      console.log('[PostProvider] Post created successfully');
      router.back();
    } else {
      console.error('[PostProvider] Post creation failed:', error);
    }
    return data;
  };
  //...............
  const uploadFile = async (id: string, uri: string, type: string, name: string, skipUpdate?: boolean) => {
    if (!user?.id) return;
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      const arrayBuffer = decode(base64);
      const filePath = `${user.id}/${name}`;
      const { data, error } = await supabase.storage
        .from('files')
        .upload(filePath, arrayBuffer, { contentType: type, cacheControl: '3600', upsert: true });
      if (error) console.error('[PostProvider] uploadFile error:', error);
      else if (data && !skipUpdate) updatepost(id, 'file', name);
    } catch (e) {
      console.error('[PostProvider] uploadFile error:', e);
    }
  };


  const updatepost = async (id: string, key: string, value: string | string[]) => {
    const dbValue = key === 'file' ? (Array.isArray(value) ? value : value ? [value] : []) : value;
    SetPostCard(PostCard.map((p: Post) => (p.id === id ? { ...p, [key]: dbValue } : p)));
    const { data, error } = await supabase.from('Post').update({ [key]: dbValue }).eq('id', id);
  };

  const clearpost = () => {
    SetPostCard([defaultpost]);
    setPhoto('');
    setPhotos([]);
    setMediaType('');
  };
  const addthreads = () => {
    SetPostCard([...PostCard, { ...defaultpost, parent_id: PostCard[0].id }])
  }

  return (
    <Postcontext.Provider value={{ PostCard, MediaType, setMediaType, addthreads, updatepost, uploadpost, clearpost, uploadFile, Photo, setPhoto, Photos, setPhotos }}>
      {children}
    </Postcontext.Provider>
  );
};