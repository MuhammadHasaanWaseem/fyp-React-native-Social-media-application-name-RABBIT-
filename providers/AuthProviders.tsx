
// };
import React, { useState, ReactNode, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

// Define the user type with correct types
export type User = {
  id?: string;
  username?: string | null;
  name?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  created_at?: string;
};

// Define the context with a default value and updated types
export const AuthContext = React.createContext<{
  user: User | null;
  setuser: React.Dispatch<React.SetStateAction<User | null>>;
  logOut: () => Promise<void>;
  createUser: (username: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  isSignedIn: boolean;
  isUsernameSkipped: boolean;
  authHydrated: boolean;
}>({
  user: null,
  setuser: () => {},
  logOut: async () => {},
  createUser: async () => ({ success: false }),
  deleteAccount: async () => ({ success: false }),
  isSignedIn: false,
  isUsernameSkipped: false,
  authHydrated: false,
});

// Custom hook to use the AuthContext
export const useAuth = () => React.useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setuser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authHydrated, setAuthHydrated] = useState(false);

  const createUser = async (username: string) => {
    console.log('[createUser] start', { username });
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (!currentSession) {
      console.log('[createUser] no session');
      return { success: false, error: 'No session. Please sign in again.' };
    }
    console.log('[createUser] session ok', currentSession.user.id);

    const normalized = username.trim().toLowerCase();

    const { data: taken, error: takenErr } = await supabase
      .from('User')
      .select('id')
      .ilike('username', normalized)
      .neq('id', currentSession.user.id)
      .maybeSingle();

    if (takenErr) {
      console.log('[createUser] taken check err', takenErr);
      return { success: false, error: `Check error: ${takenErr.message}` };
    }
    if (taken) {
      console.log('[createUser] username taken');
      return { success: false, error: 'Username taken by another user' };
    }

    const { data: existing } = await supabase
      .from('User')
      .select('id')
      .eq('id', currentSession.user.id)
      .maybeSingle();

    if (existing) {
      console.log('[createUser] updating existing');
      const { data, error } = await supabase
        .from('User')
        .update({ username: normalized })
        .eq('id', currentSession.user.id)
        .select()
        .single();
      if (error) {
        console.log('[createUser] update err', error);
        return { success: false, error: `Update: ${error.message}` };
      }
      setuser(data);
      console.log('[createUser] update success');
      return { success: true };
    }

    console.log('[createUser] inserting new');
    const { data, error } = await supabase
      .from('User')
      .insert({ id: currentSession.user.id, username: normalized })
      .select()
      .single();

    if (error) {
      console.log('[createUser] insert err', error);
      return { success: false, error: `Insert: ${error.message} (${error.code})` };
    }
    setuser(data);
    console.log('[createUser] insert success');
    return { success: true };
  };

  const getUser = async (session: Session | null) => {
    try {
      if (!session) {
        setuser(null);
        router.replace('/(auth)');
        return;
      }

      const { data, error } = await supabase
        .from('User')
        .select()
        .eq('id', session.user.id);

      if (error) {
        console.error('Get user error:', error);
        return;
      }

      if (data && data.length > 0) {
        const row = data[0];
        if (row.username?.trim()) {
          setuser(row);
          router.replace('/(tabs)');
        } else {
          setuser(row);
          router.replace('/(auth)/username');
        }
      } else {
        setuser(null);
        router.replace('/(auth)/username');
      }
    } finally {
      setAuthHydrated(true);
    }
  };

  const logOut = async () => {
    await supabase.auth.signOut();
    setuser(null);
    setSession(null);
    router.push('/(auth)');
  };

  const deleteAccount = async () => {
    const { data: { session: s } } = await supabase.auth.getSession();
    if (!s?.user?.id) return { success: false, error: 'Not signed in' };
    const uid = s.user.id;

    try {
      const { data: files } = await supabase.storage.from('files').list(uid);
      if (files?.length) {
        const paths = files.filter((f) => f.name).map((f) => `${uid}/${f.name}`);
        if (paths.length) await supabase.storage.from('files').remove(paths);
      }
    } catch (_) {}

    const { error } = await supabase.rpc('delete_own_account');
    if (error) return { success: false, error: error.message };

    setuser(null);
    setSession(null);
    try {
      await supabase.auth.signOut();
    } catch (_) {}
    router.replace('/(auth)');
    return { success: true };
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      getUser(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Defer so we never call Supabase auth (e.g. getSession) synchronously inside this callback (Supabase guidance).
      queueMicrotask(() => {
        getUser(session);
      });
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  const isSignedIn = !!session;
  const isUsernameSkipped = !!user?.username?.trim();

  return (
    <AuthContext.Provider value={{ user, setuser, logOut, createUser, deleteAccount, isSignedIn, isUsernameSkipped, authHydrated }}>
      {children}
    </AuthContext.Provider>
  );
};