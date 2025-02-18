import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { View, StyleSheet } from "react-native";
import Layout from "./_layout";
import { OtpInput } from "react-native-otp-entry";

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
          numberOfDigits={8}
          type="numeric"
          placeholder="***********"
          onTextChange={setToken}
          autoFocus
          secureTextEntry={false}
          theme={{
            containerStyle: { marginTop: 20}, 
            inputsContainerStyle: { margin:2,padding:20},
            
            pinCodeContainerStyle: {
              backgroundColor:'transparent',
              borderColor: "white",
              borderWidth: 1, 
              borderRadius: 10
              
            },
            pinCodeTextStyle: {
              color: "white", 
              fontSize: 24, 
              
              
            },
          }}/>
        <View>
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
