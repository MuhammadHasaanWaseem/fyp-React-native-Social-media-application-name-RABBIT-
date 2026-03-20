import { Stack } from "expo-router";

export default () => (
  <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name="index" />
    <Stack.Screen name="verify" />
    <Stack.Screen name="username" />
  </Stack>
);