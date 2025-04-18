// import React, { useState, ReactNode, useEffect } from 'react';
// import { Session } from '@supabase/supabase-js';
// import { supabase } from '@/lib/supabase';
// import { router } from 'expo-router';

// // Define the user type with correct types
// export type User = {
//   username: string;
//   name?: string;
//   email?: string;
// };

// // Define the context with a default value and updated types
// export const AuthContext = React.createContext<{
//   user: User | null;
//   setuser: React.Dispatch<React.SetStateAction<User | null>>;
//   logOut: () => Promise<void>;
//   createUser: (username: string) => Promise<boolean>;
// }>({
//   user: null, // Default null for user
//   setuser: () => { },
//   logOut: async () => { },
//   createUser: async (username: string) => false,
// });

// // Custom hook to use the AuthContext
// export const useAuth = () => React.useContext(AuthContext);

// type AuthProviderProps = {
//   children: ReactNode;
// };

// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [user, setuser] = useState<User | null>(null);
//   const [session, setSession] = useState<Session | null>(null);

//   const createUser = async (username: string) => {
//     const { data, error } = await supabase
//       .from('User')
//       .insert({
//         id: session?.user.id,
//         username,
//       })
//       .select();

//     if (error) {
//       console.error(error);
//       return false;
//     }

//     const newUser = data[0];
//     setuser(newUser);
//     return true;
//   };

//   const getUser = async (session: Session | null) => {
//     if (session) {
//       const { data, error } = await supabase
//         .from('User')
//         .select()
//         .eq('id', session.user.id);

//       if (error) {
//         console.error(error);
//         return;
//       }

//       if (data && data.length > 0) {
//         // Check if the user already has a username set
//         if (data[0].username) {
//           setuser(data[0]);
//           router.push('/(tabs)'); // Navigate to home if username exists
        
//         } else {
//           router.push('/(auth)/username'); // Stay on username screen if username is missing
//         }
//       } else {
//         // If no user record exists, navigate to the username screen
//         router.push('/(auth)/username');
//       }
//     }
//   };

//   const logOut = async () => {
//     await supabase.auth.signOut();
//     router.push('/(auth)');
//   };

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//       getUser(session);
//     });

//     supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//       getUser(session);
//     });
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setuser, logOut, createUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
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
  createUser: (username: string) => Promise<boolean>;
}>({
  user: null,
  setuser: () => {},
  logOut: async () => {},
  createUser: async () => false,
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
    if (!session) return false;
    const { data, error } = await supabase
      .from('User')
      .insert({
        id: session.user.id,
        username,
      })
      .select();

    if (error) {
      console.error('Create user error:', error);
      return false;
    }

    const newUser = data[0];
    setuser(newUser);
    return true;
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