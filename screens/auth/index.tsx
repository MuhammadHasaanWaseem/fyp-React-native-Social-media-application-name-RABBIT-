import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Text, StyleSheet, Keyboard, TextInput, View, Platform, Alert } from 'react-native';
import { wp, hp } from '@/lib/helper';
import Layout from './_layout';
import { VStack } from '@/components/ui/vstack';
import { signInWithApple } from '@/lib/apple-sign-in';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [appleAvailable, setAppleAvailable] = useState(false);
  const [appleBusy, setAppleBusy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    void AppleAuthentication.isAvailableAsync().then(setAppleAvailable);
  }, []);

  const handleSignIn = async () => {
    Keyboard.dismiss();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (!error) {
      router.push({
        pathname: '/(auth)/verify',
        params: { input: email, type: 'email' },
      });
    } else {
      console.error('Email OTP error:', error.message);
    }
  };

  const handleApple = async () => {
    setAppleBusy(true);
    try {
      const { error } = await signInWithApple();
      if (error) {
        console.error('Apple sign in error:', error);
        if (
          error.includes('Unacceptable audience') ||
          error.includes('host.exp.Exponent')
        ) {
          Alert.alert(
            'Apple sign-in (Expo Go)',
            'Supabase must allow Expo Go’s Apple audience.\n\nDashboard → Authentication → Providers → Apple → Client IDs: add host.exp.Exponent (comma-separated with com.hasaan.Rabbit).\n\nFor production, use a dev build; tokens will use your bundle id only.',
          );
        }
      }
    } finally {
      setAppleBusy(false);
    }
  };

  const appleFooter =
    Platform.OS === 'ios' && appleAvailable ? (
      <View
        pointerEvents={appleBusy ? 'none' : 'auto'}
        style={[styles.appleWrap, appleBusy && styles.appleWrapBusy]}
      >
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
          cornerRadius={wp(3.5)}
          style={styles.appleButton}
          onPress={() => {
            void handleApple();
          }}
        />
      </View>
    ) : null;

  return (
    <Layout
      onPress={handleSignIn}
      buttonText="Continue"
      buttonDisabled={appleBusy}
      footerExtra={appleFooter}
    >
      <SafeAreaView style={styles.container}>
        <VStack style={styles.content}>

          <VStack style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              placeholder="example@domain.com"
              style={styles.inputField}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#6B7280"
              autoFocus={true}
              autoCorrect={false}
              returnKeyType="done"
            />
          </VStack>

          <Text style={styles.note}>We'll send you a verification code via email</Text>
        </VStack>
      </SafeAreaView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(6),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: hp(3),
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: hp(7),
  },
  inputContainer: {
    marginBottom: hp(2),
  },
  label: {
    fontSize: hp(1.8),
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: hp(1),
  },
  inputField: {
    fontSize: hp(2),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    color: 'white',
    backgroundColor: '#1F2937',
    borderRadius: wp(4.5),
  },
  note: {
    color: '#6B7280',
    fontSize: hp(1.5),
    marginTop: hp(1.5),
  },
  appleWrap: {
    width: '100%',
  },
  appleWrapBusy: {
    opacity: 0.65,
  },
  appleButton: {
    width: '100%',
    height: hp(5.25),
  },
});