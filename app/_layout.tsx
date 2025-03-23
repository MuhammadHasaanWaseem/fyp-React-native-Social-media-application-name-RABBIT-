import { useFonts } from 'expo-font';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { AuthProvider } from '@/providers/AuthProviders';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostProvider } from '@/providers/PostProvider';
import { canGoBack } from 'expo-router/build/global-state/routing';
import { Pressable } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from './(onboarding)';

const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isReady, setIsReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const value = await AsyncStorage.getItem('hasCompletedOnboarding');
      setShowOnboarding(value !== 'true');
      setIsReady(true);
    };

    if (loaded) {
      SplashScreen.hideAsync();
      checkOnboarding();
    }
  }, [loaded]);

  // This callback will be passed to the OnboardingScreen.
  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (!loaded || !isReady) {
    return null;
  }

  // If onboarding hasn't been completed, show the onboarding screen.
  if (showOnboarding) {
    return (
      <GluestackUIProvider mode="light">
        <OnboardingScreen onDone={handleOnboardingComplete} />
      </GluestackUIProvider>
    );
  }

  // Once onboarding is done, render your main navigation.
  return (

    <GluestackUIProvider mode="light">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PostProvider>
            <Stack initialRouteName='(auth)' screenOptions={{
              headerTransparent: true, headerLeft: ({ canGoBack }) => (
                <Pressable onPress={canGoBack ? () => router.back() : undefined}>
                  <ArrowLeft color={'white'} />
                </Pressable>
              )
            }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="post" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="camera" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="gif" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="chatbot" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="comments" options={{ headerShown: false, headerTitle: 'Add to comment', headerTitleAlign: 'center', presentation: 'modal', animation: 'slide_from_left' }} />
              <Stack.Screen name="user" options={{ headerTitle: '', presentation: 'modal', animation: 'slide_from_left' }} />
              <Stack.Screen name="worldchat" options={{ headerShown: false, headerTitleAlign: 'center', presentation: 'modal', animation: 'slide_from_left' }} />
              <Stack.Screen name="followsheet" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="followingsheet" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }} />
              <Stack.Screen name="drawer" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_left' }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </PostProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}
