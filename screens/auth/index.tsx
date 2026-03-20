
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Text, StyleSheet, Keyboard, TextInput } from 'react-native';
import { wp, hp } from '@/lib/helper';
import Layout from './_layout';
import { VStack } from '@/components/ui/vstack';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const router = useRouter();

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

  return (
    <Layout onPress={handleSignIn} buttonText="Continue">
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
});