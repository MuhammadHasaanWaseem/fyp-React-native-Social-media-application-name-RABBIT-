import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/AuthProviders';
import React, { useState } from 'react';
import { Input, InputField } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import Layout from './_layout';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';

export default function SignIn() {
  const [phone, setPhone] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    Keyboard.dismiss();
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: `+92${phone}`
    });
    if (!error) {
      router.push({
        pathname: '/(auth)/verify',
        params: { phone: `+92${phone}` },
      });
    }
  };

  return (
    <Layout onPress={handleSignIn} buttonText='Continue'>
      <SafeAreaView style={styles.container}>
        <VStack style={styles.content}>
          <Text style={styles.title}>Enter your phone number</Text>
          
          <VStack style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <HStack style={styles.phoneInput}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+92</Text>
              </View>
              <Input variant="outline" size="md" style={styles.input}>
                <InputField 
                  placeholder="300 1234567" 
                  style={styles.inputField}
                  value={phone} 
                  onChangeText={setPhone} 
                  keyboardType="phone-pad"
                  placeholderTextColor="#6B7280"
                />
              </Input>
            </HStack>
          </VStack>

          <Text style={styles.note}>
            We'll send you a verification code via SMS
          </Text>
        </VStack>
      </SafeAreaView>   
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  phoneInput: {
    alignItems: 'center',
    gap: 8,
  },
  countryCode: {
    backgroundColor: '#1F2937',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  countryCodeText: {
    color: 'white',
    fontWeight: '500',
  },
  input: {
    flex: 1,
    borderColor: '#374151',
    backgroundColor: '#1F2937',
  },
  inputField: {
    color: 'white',
    fontSize: 16,
  },
  note: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 12,
  },
});