import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase } from '@/lib/supabase';

function isAppleSignInCanceled(e: unknown): boolean {
  return (
    typeof e === 'object' &&
    e !== null &&
    'code' in e &&
    (e as { code: string }).code === 'ERR_REQUEST_CANCELED'
  );
}

export type AppleSignInResult = { error?: string };

function explainAppleIdTokenError(message: string): string {
  if (
    message.includes('Unacceptable audience') ||
    message.includes('host.exp.Exponent')
  ) {
    return (
      `${message} — In Supabase: Authentication → Providers → Apple → Client IDs, add ` +
      `host.exp.Exponent next to your app bundle id (e.g. com.hasaan.Rabbit), comma-separated. ` +
      `Expo Go always uses that audience; a dev/production build uses your real bundle id only.`
    );
  }
  return message;
}

/**
 * Native Sign in with Apple → Supabase `signInWithIdToken`.
 * After success, `AuthProvider`’s `onAuthStateChange` runs `getUser` → `/(auth)/username` or `/(tabs)`.
 */
export async function signInWithApple(): Promise<AppleSignInResult> {
  if (Platform.OS !== 'ios') {
    return { error: 'Sign in with Apple is only available on iOS.' };
  }

  try {
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      return { error: 'Sign in with Apple is not available on this device.' };
    }

    // Skip nonce: Supabase id_token check uses hex vs Apple’s base64url claim (auth#2378).
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      return { error: 'Could not get an Apple identity token.' };
    }

    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
    });

    if (error) {
      return { error: explainAppleIdTokenError(error.message) };
    }

    return {};
  } catch (e: unknown) {
    if (isAppleSignInCanceled(e)) {
      return {};
    }
    const message = e instanceof Error ? e.message : 'Apple sign in failed';
    return { error: message };
  }
}
