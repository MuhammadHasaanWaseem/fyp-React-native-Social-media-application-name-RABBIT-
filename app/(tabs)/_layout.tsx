import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { Heart, Home, Plus, Search, User } from 'lucide-react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import {
  tabBarColors,
  tabBarStyles,
  TAB_ICON_SIZE,
  TAB_COMPOSE_ICON_SIZE,
} from './tabBar.styles';

const TabIcon = ({
  focused,
  children,
}: {
  focused: boolean;
  children: React.ReactNode;
}) => (
  <View style={tabBarStyles.iconWrap}>
    {children}
    {focused ? <View style={tabBarStyles.activeIndicator} /> : <View style={{ height: 9 }} />}
  </View>
);

export default function TabLayout() {
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: tabBarColors.active,
          tabBarInactiveTintColor: tabBarColors.inactive,
          tabBarStyle: [
            tabBarStyles.tabBar,
            Platform.select({
              ios: { position: 'absolute' },
              default: {},
            }),
          ],
          tabBarItemStyle: tabBarStyles.tabBarItem,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '',
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused}>
                <Home
                  size={TAB_ICON_SIZE}
                  color={focused ? tabBarColors.active : tabBarColors.inactive}
                  strokeWidth={focused ? 2.25 : 1.75}
                  fill={focused ? tabBarColors.active : 'transparent'}
                />
              </TabIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: '',
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused}>
                <Search
                  size={TAB_ICON_SIZE}
                  color={focused ? tabBarColors.active : tabBarColors.inactive}
                  strokeWidth={focused ? 2.25 : 1.75}
                />
              </TabIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="empty"
          options={{
            title: '',
            tabBarIcon: ({ focused }) => (
              <View style={tabBarStyles.composeOuter}>
                <View style={tabBarStyles.composeBtn}>
                  <Plus
                    size={TAB_COMPOSE_ICON_SIZE}
                    color={tabBarColors.composeIcon}
                    strokeWidth={focused ? 2.5 : 2}
                  />
                </View>
                {focused ? <View style={tabBarStyles.activeIndicator} /> : <View style={{ height: 9 }} />}
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
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused}>
                <Heart
                  size={TAB_ICON_SIZE}
                  color={focused ? tabBarColors.active : tabBarColors.inactive}
                  strokeWidth={focused ? 2.25 : 1.75}
                  fill={focused ? tabBarColors.active : 'transparent'}
                />
              </TabIcon>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: '',
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused}>
                <User
                  size={TAB_ICON_SIZE}
                  color={focused ? tabBarColors.active : tabBarColors.inactive}
                  strokeWidth={focused ? 2.25 : 1.75}
                  fill={focused ? tabBarColors.active : 'transparent'}
                />
              </TabIcon>
            ),
          }}
        />
      </Tabs>
    </QueryClientProvider>
  );
}
