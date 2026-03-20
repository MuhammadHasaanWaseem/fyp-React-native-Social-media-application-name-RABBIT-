
// };
import React, { useState, ReactNode, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

// Define the user type with correct types
export type User = {
  username: string;
  name?: string;
  email?: string;
};

// Define the context with a default value and updated types
export const AuthContext = React.createContext<{
  user: User | null;
  setuser: React.Dispatch<React.SetStateAction<User | null>>;
  logOut: () => Promise<void>;
  createUser: (username: string) => Promise<{ success: boolean; error?: string }>;
}>({
  user: null,
  setuser: () => {},
  logOut: async () => {},
  createUser: async () => ({ success: false }),
});

// Custom hook to use the AuthContext
export const useAuth = () => React.useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setuser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

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
    if (session) {
      const { data, error } = await supabase
        .from('User')
        .select()
        .eq('id', session.user.id);

      if (error) {
        console.error('Get user error:', error);
        return;
      }

      if (data && data.length > 0) {
        if (data[0].username) {
          setuser(data[0]);
          router.push('/(tabs)');
        } else {
          router.push('/(auth)/username');
        }
      } else {
        router.push('/(auth)/username');
      }
    } else {
      router.push('/(auth)');
    }
  };

  const logOut = async () => {
    await supabase.auth.signOut();
    setuser(null);
    setSession(null);
    router.push('/(auth)');
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      getUser(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      getUser(session);
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setuser, logOut, createUser }}>
      {children}
    </AuthContext.Provider>
  );
};