import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { Heart, Home, Plus, Search, User } from 'lucide-react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

export default function TabLayout() {
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarActiveBackgroundColor: '#010118',
        headerShown: false,
        tabBarStyle: [styles.tabBar,Platform.select({
          
          ios: { position: 'absolute' },
          default: { backgroundColor: '#010118' },
        }),]
      }}
    >
    
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Home fill={focused ? '#FF4500' : ''} color={'#FF4500'} size={24} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Search strokeWidth={focused ? 3 : 2} color={'#FF4500'} size={24} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="empty"
        options={{ 
          
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', backgroundColor:'#E56713',padding:10,top:-6,borderRadius:30 }}>
              <Plus  strokeWidth={focused ? 4  : 2} color={'white'} size={34} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/post');
          },
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Heart fill={focused ? '#FF4500'  : ''} color={'#FF4500'} size={24} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <User fill={focused ? '#FF4500'  : ''} color={'#FF4500'} size={24} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
    </Tabs>
    </QueryClientProvider>
  );
}

const styles = {
  activeIndicator: {
    width: 70,
    height: 1,
    backgroundColor: 'white',
    marginTop: 2,
    borderRadius: 3,
  },
  tabBar: {
    backgroundColor: '#010118',
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    height: 60,
    paddingBottom: Platform.OS === 'ios' ? 20 : 5,
    paddingTop: 5,
  },
};
