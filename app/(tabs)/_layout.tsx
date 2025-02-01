import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import {Heart, Home, PersonStanding, Plus, Search, User, UserRound} from 'lucide-react-native';
export default function TabLayout() {
const router =useRouter();
  return (
    
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor: '#031273',
        headerShown:false,
     
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
        tabBarActiveBackgroundColor:'white',
          tabBarIcon: ({ color,focused }) =>  <Home  color={color} size={24} />,        }}
      />
       <Tabs.Screen
        name="search"
        options={{
          title: '',
        tabBarActiveBackgroundColor:'white',
          tabBarIcon: ({ color,focused }) =>  <Search  color={color} size={24} />,        }}
         
      /> <Tabs.Screen
      name="empty"
      options={{
        title: '',
      tabBarActiveBackgroundColor:'white',
        tabBarIcon: ({ color,focused }) =>  < Plus  color={color} size={34}  />,        }}
        listeners={{tabPress:(e)=>{
          e.preventDefault();
          router.push('/post');
        }}}
    /> <Tabs.Screen
    name="activity"
    options={{
      title: '',
    tabBarActiveBackgroundColor:'white',
      tabBarIcon: ({ color,focused }) =>  <Heart  color={color} size={24} />,        }}
  /> <Tabs.Screen
  name="profile"
  options={{
    title: '',
  tabBarActiveBackgroundColor:'white',
    tabBarIcon: ({ color,focused }) =>  <User  color={color} size={24} />,        }}
/>
     
    </Tabs>
  );
}
