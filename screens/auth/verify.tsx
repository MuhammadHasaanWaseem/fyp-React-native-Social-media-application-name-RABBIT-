import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/ui/input";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { View, StyleSheet } from "react-native";
import Layout from './_layout';

export default function VerifyScreen() {
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const { phone } = useLocalSearchParams();
  const router = useRouter();

  const handleVerify = async () => {
    console.log(token);

    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone as string,
      token,
      type: "sms",
    });

    if (!error) {
      setErrorMessage("verified"); // Clear any previous errors
      router.push("/(auth)/username");
    } else {
      setErrorMessage("OTP is incorrect. Please try again."); // Show error message
    }
  };

  return (
    <Layout onPress={handleVerify} buttonText="Verify OTP code!">
      <SafeAreaView style={styles.container}>
        {/* Input Field */}
        <Input
          variant="outline"
          size="md"
          style={{
            borderColor: "white",
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: 20,
            marginTop: 20,
          }}
        >
          <InputField
            placeholderTextColor={"white"}
            placeholder="Enter OTP here..."
            style={styles.inputField}
            value={token}
            onChangeText={setToken}
            keyboardType="phone-pad"
            secureTextEntry={true}
          />
        </Input>

        {/* Error Message in Red */}
       

        {/* Bottom Text */}
        <View >
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : <Text style={styles.verifyerrorText}>{errorMessage}</Text>}
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
  inputField: {
    textAlign: "center",
    borderRadius: 9,
    color: "white",
  },
  bottomContainer: {
    bottom: 20, // Adjust as needed
    alignItems: "center",
  },
  brandText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  verifyerrorText: {
    color: "green",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
});
