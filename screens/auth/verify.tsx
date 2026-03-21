
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { View, StyleSheet, Text, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { wp, hp } from '@/lib/helper';
import Layout from './_layout';
import { OtpInput } from 'react-native-otp-entry';
import { Spinner } from '@/components/ui/spinner';
import { HStack } from '@/components/ui/hstack';

export default function VerifyScreen() {
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { input, type } = useLocalSearchParams();

  const handleVerify = async () => {
    const verifyParams =
      type === 'phone'
        ? { phone: input, token, type: 'sms' }
        : { email: input, token, type: 'email' };

    const { data, error } = await supabase.auth.verifyOtp(verifyParams);

    if (!error) {
      setErrorMessage('Verified Successfully!');
    } else {
      setErrorMessage('OTP is incorrect. Please try again.');
    }
  };

  return (
    <Layout onPress={handleVerify} buttonText="Verify OTP">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <SafeAreaView style={styles.innerContainer}>
            <View style={styles.content}>
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
        </View>
      </TouchableWithoutFeedback>
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
    paddingHorizontal: wp(6),
    justifyContent: 'center',
  },
  content: {
  },
  title: {
    fontSize: hp(3),
    fontWeight: '700',
    color: 'white',
    marginBottom: hp(1),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: hp(1.5),
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: hp(2),
  },
  otpContainer: {
    marginBottom: hp(1.5),
  },
  otpInputsContainer: {
    gap: wp(1.5),
  },
  pinCodeContainer: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: wp(2),
    height: hp(5),
    width: wp(10),
  },
  pinCodeText: {
    color: 'white',
    fontSize: hp(2.5),
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
    gap: hp(1.5),
    marginBottom: hp(3),
  },
  progressText: {
    color: '#9CA3AF',
    fontSize: hp(1.8),
    fontWeight: '500',
  },
  successText: {
    color: '#10B981',
    fontSize: hp(1.8),
    fontWeight: '600',
    textAlign: 'center',
    marginTop: hp(2),
  },
  errorText: {
    color: '#EF4444',
    fontSize: hp(1.8),
    fontWeight: '600',
    textAlign: 'center',
    marginTop: hp(2),
    marginBottom: hp(10),
  },
});