import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import {Heart, Home, PersonStanding, Plus, Search, User, UserRound} from 'lucide-react-native';
export default function TabLayout() {
const router =useRouter();
  return (
    
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarActiveBackgroundColor:'black',
      
        headerShown:false,
     
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {  backgroundColor: 'black',},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
        tabBarActiveBackgroundColor:'black',
          tabBarIcon: ({ color,focused }) =>  <Home  strokeWidth={focused?3 :2} color={color} size={24} />,        }}
      />
       <Tabs.Screen
        name="search"
        options={{
          title: '',
        tabBarActiveBackgroundColor:'black',
          tabBarIcon: ({ color,focused }) =>  <Search strokeWidth={focused?3 :2}   color={color}  size={24} />,        }}
         
      /> <Tabs.Screen
      name="empty"
      options={{
        title: '',
      tabBarActiveBackgroundColor:'black',
        tabBarIcon: ({ color,focused }) =>  < Plus strokeWidth={focused?3 :2}  color={color} size={34}  />,        }}
        listeners={{tabPress:(e)=>{
          e.preventDefault();
          router.push('/post');
        }}}
    /> <Tabs.Screen
    name="activity"
    options={{
      title: '',
    tabBarActiveBackgroundColor:'black',
      tabBarIcon: ({ color,focused }) =>  <Heart strokeWidth={focused?3 :2}  color={color} size={24} />,        }}
  /> <Tabs.Screen
  name="profile"
  options={{
    title: '',
  tabBarActiveBackgroundColor:'black',
    tabBarIcon: ({ color,focused }) =>  <User strokeWidth={focused?3 :2}  color={color} size={24} />,        }}
/>
     
    </Tabs>
  );
}
