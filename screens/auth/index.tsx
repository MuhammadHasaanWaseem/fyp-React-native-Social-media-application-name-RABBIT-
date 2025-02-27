import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/AuthProviders';
import React, { useState } from 'react';
import { Input, InputField } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { View, Text } from 'react-native';
import Layout from './_layout';

export default function SignIn() {
  const [phone, setPhone] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOtp({
      // phone: `+92${phone}
      phone:phone
    });
    if (!error) {
      router.push({
        pathname: '/(auth)/verify',
        // params: { phone: `+92${phone}` },
        params:{phone:phone}
      });
    }
    console.log(data, error);
  };

  return (
    <Layout onPress={handleSignIn} buttonText='sign in'>
      
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', backgroundColor: 'black', paddingHorizontal: 20 }}>
      <View style={{ alignItems: 'left', marginBottom: 10 }}>
        <Text style={{ fontSize: 14, fontWeight: '900', color: 'white' }}>
          Enter your phone number
          </Text>
        </View>

        <Input 
          variant="outline" 
          size="sm" 
          style={{ borderColor: 'white', borderWidth: 1, borderRadius: 10, marginBottom: 20 }}
        >
          <Text  style={{color:'white', fontSize:14 ,borderColor:'white' }}>{" "}+92</Text>
          <InputField 
            placeholder="Enter phone no. here..." 
            style={{ textAlign: 'left', color: 'white', paddingTop: 10 ,paddingBottom:7.5}} 
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