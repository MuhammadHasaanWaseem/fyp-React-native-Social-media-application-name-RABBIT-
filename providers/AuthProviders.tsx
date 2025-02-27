import React, { useState, ReactNode,useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import username from '@/app/(auth)/username';
// Define the user type (optional, but recommended)
type User = {
  name?: string;
  email?: string;
  // Add any other fields your user object might have
};

// Define the context with a default value
export const AuthContext = React.createContext<{
  user: User;
  
  setuser: React.Dispatch<React.SetStateAction<User>>;
  logOut: () => Promise<void>;
  createUser:(username:string)=> Promise<void>;
  
}>({
  user: {}, // Default empty object for user
  setuser: () => {}, // Default no-op function for setuser
  logOut: async() => {},
  createUser:async(username:string)=>{},
});

// Custom hook to use the AuthContext
export const useAuth = () => React.useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode; // Correctly typed children prop
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setuser] = useState<User>({}); // State with typed user
  const [session, setSession] = useState<Session | null>(null)
  


  // const createUser = async (username:string)=>{
  //   const{data,error}= await supabase.from('User').insert({
  //   id:session?.user.id,
  //   username,

  //   }).select() 
  // if(error) return console.error(error)
  // const user=data[0]
  //   setuser(user)
  // }
  const createUser = async (username: string) => {
    const { data, error } = await supabase
      .from('User')
      .insert({
        id: session?.user.id,
        username,
      })
      .select();
    
    if (error) {
      console.error(error);
      return false;
    }
    
    const user = data[0];
    setuser(user);
    return true;
  };
  
// const  getUser = async (session:Session | null)=>{
  
//   if(session){
//     const{data,error}= await supabase.from('User').select().eq('id',session?.user.id)
//     if(!error){setuser(data[0])}
//     router.push('/(tabs)')
//   }
// }
const getUser = async (session: Session | null) => {
  if (session) {
    const { data, error } = await supabase
      .from('User')
      .select()
      .eq('id', session.user.id);

    if (error) {
      console.error(error);
      return;
    }

    if (data && data.length > 0) {
      // Check if the user already has a username set
      if (data[0].username) {
        setuser(data[0]);
        router.push('/(tabs)'); // Navigate to home if username exists
      } else {
        router.push('/(auth)/username'); // Stay on username screen if username is missing
      }
    } else {
      // If no user record exists, navigate to the username screen
      router.push('/(auth)/username');
    }
  }
};

const logOut = async ()=>{
  await supabase.auth.signOut();
  router.push('/(auth)')
}
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
    
      setSession(session)
      getUser(session);
      
    })

    supabase.auth.onAuthStateChange((_event, session) => {
  
      setSession(session)
      getUser(session);

    })
  }, [])
  return (
    <AuthContext.Provider value={{ user, setuser,logOut,createUser }}>
      {children}
    </AuthContext.Provider>
  );
};