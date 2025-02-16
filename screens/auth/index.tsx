import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/AuthProviders';
import React, { useState } from 'react';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { View, Text } from 'react-native';
import Layout from './_layout';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function SignIn() {
  const [phone, setPhone] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: `+1${phone}`,
    });
    if (!error) {
      router.push({
        pathname: '/(auth)/verify',
        params: { phone: `+1${phone}` },
      });
    }
    console.log(data, error);
  };

  return (
    <Layout onPress={handleSignIn} buttonText='sign in'>
      
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', backgroundColor: 'black', paddingHorizontal: 20 }}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>
            Enter your phone number
          </Text>
        </View>

        <Input 
          variant="outline" 
          size="md" 
          style={{ borderColor: 'white', borderWidth: 1, borderRadius: 10, marginBottom: 20 }}
        >
          <InputField 
            placeholder="Enter phone no. here..." 
            style={{ textAlign: 'left', color: 'white', paddingTop: 10 ,paddingBottom:10}} 
            value={phone} 
            onChangeText={setPhone} 
            keyboardType="phone-pad" 
            secureTextEntry={true}
          />
        </Input>

      </SafeAreaView>   
    </Layout>
  );
}
