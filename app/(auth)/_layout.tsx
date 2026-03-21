import { Stack } from "expo-router";

/** Used by the sign-in screen; routing after success is handled in `AuthProvider` via `getUser`. */
export { signInWithApple } from "@/lib/apple-sign-in";

export default function AuthGroupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="username" />
    </Stack>
  );
}