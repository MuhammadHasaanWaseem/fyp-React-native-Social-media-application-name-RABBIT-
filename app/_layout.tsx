import { useFonts } from 'expo-font';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider } from '@/providers/AuthProviders';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostProvider } from '@/providers/PostProvider';
import { StatusBar } from 'react-native';

const queryClient =new QueryClient();
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    
    <GluestackUIProvider mode="light">
      <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PostProvider>
        <Stack initialRouteName='(auth)'>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="post" options={{ headerShown: false,presentation:'modal', animation:'slide_from_bottom' }} />
        <Stack.Screen name="camera" options={{ headerShown: false,presentation:'modal', animation:'slide_from_bottom' }} />
        <Stack.Screen name="gif" options={{ headerShown: false,presentation:'modal', animation:'slide_from_bottom' }} />
        <Stack.Screen name="chatbot" options={{ headerShown: false,presentation:'modal', animation:'slide_from_bottom' }} />
        <Stack.Screen name="places" options={{ headerShown: false,presentation:'modal', animation:'slide_from_bottom' }} />
        <Stack.Screen name="thread" options={{headerShown: false,headerTitle:'Create a threads here,',headerTitleAlign: 'center',presentation:'modal', animation:'slide_from_bottom' }} />
        <Stack.Screen name="comments" options={{headerShown: false,headerTitle:'Add to comment',headerTitleAlign: 'center',presentation:'modal', animation:'slide_from_left' }} />
        <Stack.Screen name="user" options={{headerShown:false,headerTitleAlign: 'center',presentation:'modal', animation:'slide_from_left' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      </PostProvider>
      </AuthProvider>
      </QueryClientProvider>
     </GluestackUIProvider>
  );
}
