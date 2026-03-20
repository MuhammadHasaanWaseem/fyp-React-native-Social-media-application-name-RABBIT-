
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import Layout from './_layout';
import { OtpInput } from 'react-native-otp-entry';
import { Spinner } from '@/components/ui/spinner';
import { HStack } from '@/components/ui/hstack';

export default function VerifyScreen() {
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { input, type } = useLocalSearchParams();
  const router = useRouter();

  const handleVerify = async () => {
    const verifyParams =
      type === 'phone'
        ? { phone: input, token, type: 'sms' }
        : { email: input, token, type: 'email' };

    const { data, error } = await supabase.auth.verifyOtp(verifyParams);

    if (!error) {
      setErrorMessage('Verified Successfully!');
      router.push('/(auth)/username');
    } else {
      setErrorMessage('OTP is incorrect. Please try again.');
    }
  };

  return (
    <Layout onPress={handleVerify} buttonText="Verify OTP">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <SafeAreaView style={styles.innerContainer}>
          <View style={styles.content}>
            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.subtitle}>Sent to {input}</Text>

            <OtpInput
              numberOfDigits={6}
              autoFocus
              onTextChange={setToken}
              theme={{
                containerStyle: styles.otpContainer,
                inputsContainerStyle: styles.otpInputsContainer,
                pinCodeContainerStyle: styles.pinCodeContainer,
                pinCodeTextStyle: styles.pinCodeText,
                focusStickStyle: styles.focusStick,
                focusedPinCodeContainerStyle: styles.focusedPinCodeContainer,
              }}
            />

            <HStack style={styles.statusContainer}>
              <Spinner color="#3B82F6" size={24} />
              <Text style={styles.progressText}>Verification in progress</Text>
            </HStack>

            {errorMessage && (
              <Text style={errorMessage.includes('Verified') ? styles.successText : styles.errorText}>
                {errorMessage}
              </Text>
            )}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010118',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  content: {
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  otpContainer: {
    marginBottom: 12,
  },
  otpInputsContainer: {
    gap: 6,
  },
  pinCodeContainer: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    height: 40,
    width: 40,
  },
  pinCodeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  focusStick: {
    backgroundColor: '#3B82F6',
    width: 2,
  },
  focusedPinCodeContainer: {
    borderColor: '#3B82F6',
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  progressText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  successText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: '10%',
  },
});