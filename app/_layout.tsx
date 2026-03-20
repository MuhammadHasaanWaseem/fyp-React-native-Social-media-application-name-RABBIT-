import { useFonts } from 'expo-font';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '@/providers/AuthProviders';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { PostProvider } from '@/providers/PostProvider';
import { Pressable } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from './(onboarding)';
import Starter from './starter';
import { AudioProvider } from '@/providers/AudioProvider';

// Prevent the splash screen from auto-hiding before assets load
SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const { isSignedIn, isUsernameSkipped } = useAuth();
  const initialRoute = isSignedIn && isUsernameSkipped ? '(tabs)' : isSignedIn ? '(auth)/username' : '(auth)';
  return (
    <Stack
      initialRouteName={initialRoute}
      screenOptions={{
        headerTransparent: true,
        headerLeft: ({ canGoBack }) => (
          <Pressable onPress={canGoBack ? () => router.back() : undefined}>
            <ArrowLeft color={'white'} />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'slide_from_left' }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false, animation: 'slide_from_left' }} />
      <Stack.Screen name="post" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="camera" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
      <Stack.Screen name="gif" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
      <Stack.Screen name="comments" options={{ headerShown: false, headerTitle: 'Add to comment', headerTitleAlign: 'center', animation: 'slide_from_left' }} />
      <Stack.Screen name="user" options={{ headerTitle: '', animation: 'slide_from_left' }} />
      <Stack.Screen name="worldchat" options={{ headerShown: false, headerTitleAlign: 'center', animation: 'slide_from_left' }} />
      <Stack.Screen name="followsheet" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
      <Stack.Screen name="followingsheet" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
      <Stack.Screen name="drawer" options={{ headerShown: false, animation: 'slide_from_left' }} />
      <Stack.Screen name="policies" options={{ headerShown: false, animation: 'slide_from_left' }} />
      <Stack.Screen name="useterms" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
      <Stack.Screen name="starter" options={{ headerShown: false, animation: 'slide_from_right' }} />
      <Stack.Screen name="introduction" options={{ headerShown: false, animation: 'slide_from_left' }} />
      <Stack.Screen name="display" options={{ headerShown: true, headerTitle: '', headerTintColor: 'black', animation: 'slide_from_right' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isReady, setIsReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showStarter, setShowStarter] = useState(false);

  // Called by OnboardingScreen when the user finishes onboarding
  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    setShowOnboarding(false);
  };

  // 1) Once fonts load, hide the splash and show Starter, then check onboarding
  useEffect(() => {
    if (fontsLoaded) {
      (async () => {
        await SplashScreen.hideAsync();
        setShowStarter(true);

        const completed = await AsyncStorage.getItem('hasCompletedOnboarding');
        setShowOnboarding(completed !== 'true');
        setIsReady(true);
      })();
    }
  }, [fontsLoaded]);

  // 2) After Starter appears, wait 6 seconds then dismiss it
  useEffect(() => {
    if (showStarter) {
      const timer = setTimeout(() => {
        setShowStarter(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showStarter]);

  // 3) While loading or checking AsyncStorage, render nothing
  if (!fontsLoaded || !isReady) {
   return null;
   }

  // 4) If the Starter screen is active, render it
  if (showStarter) {
    return (
      <QueryClientProvider client={queryClient}>
        <Starter />
      </QueryClientProvider>
    );
  }

  
  // 5) If onboarding hasn’t been completed, show onboarding
  if (showOnboarding) {
    return (
      <QueryClientProvider client={queryClient}>
        <GluestackUIProvider mode="light">
          <OnboardingScreen onDone={handleOnboardingComplete} />
        </GluestackUIProvider>
      </QueryClientProvider>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <GluestackUIProvider mode="light">
        <PostProvider>
          <AudioProvider>
            <AppNavigator />
            </AudioProvider>
        </PostProvider>
    </GluestackUIProvider>
    </AuthProvider>
    </QueryClientProvider>
  );
}
