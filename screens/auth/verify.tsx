import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { View, StyleSheet } from "react-native";
import Layout from "./_layout";
import { OtpInput } from "react-native-otp-entry";
import { Spinner } from "@/components/ui/spinner";
import { HStack } from "@/components/ui/hstack";

export default function VerifyScreen() {
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { phone } = useLocalSearchParams();
  const router = useRouter();

  const handleVerify = async () => {
    console.log("Entered OTP:", token);

    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone as string,
      token,
      type: "sms",
    });
    

    if (!error) {
      setErrorMessage("Verified Successfully!"); // Green success message
      router.push("/(auth)/username");
    } else {
      setErrorMessage(" OTP is incorrect. Please try again.");
    }
  };

  return (
    <Layout onPress={handleVerify} buttonText="Verify OTP">
      <SafeAreaView style={styles.container}>
        <OtpInput
          focusColor="green"
          numberOfDigits={6}
          type="numeric"
          placeholder="__________"
          onTextChange={setToken}
          autoFocus
          secureTextEntry={false}
          theme={{
            containerStyle: { marginBottom:20}, 
            inputsContainerStyle: { margin:2,padding:20},
            
            pinCodeContainerStyle: {
              backgroundColor:'transparent',
              borderColor: "#1f1f1f",
              borderWidth: 1, 
              borderRadius: 10
              
            },
            pinCodeTextStyle: {
              color: "white", 
              fontSize: 24, 
              
              
            },
          }}/>
        <View>
          
         <Spinner color={'darkgreen'} size={24}/>
         <Text>{""}</Text>
         <Text style={{color:'white',marginBottom:10,textAlign:'center'}}>Verification in progress</Text>
         
        {errorMessage ? (
    <Text style={errorMessage.includes("Verified") ? styles.successText : styles.errorText}>
      {errorMessage}
    </Text>  ) : null}
        </View>
      </SafeAreaView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  successText: {
    color: "lightgreen",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 2,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
    marginTop:2
  },
});
