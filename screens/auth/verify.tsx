import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/ui/input";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Image, View, StyleSheet, TouchableOpacity, Alert } from "react-native";

export default function VerifyScreen() {
  const [token, setToken] = useState("");
  const { phone } = useLocalSearchParams();
  const router =useRouter();

  const handleVerify = async () => {
    
    console.log(token);
    const { data, error } = await supabase.auth.verifyOtp({ phone:phone as string, token, type: 'sms'})


    console.log(data, error);
    if(!error){
      router.push('/(auth)/username')
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Input Field */}
      <Input variant="outline" size="md">
        <InputField
          placeholder="Enter OTP here..."
          style={styles.inputField}
          value={token}
          onChangeText={setToken}
          keyboardType="phone-pad"
          secureTextEntry={true}
        />
      </Input>

      {/* Verify Button */}
      <Button style={{marginTop:4,borderRadius:4,height:40,width:'50%'}} size="md" variant="solid" action="primary" onPress={handleVerify}>
        <ButtonText>Verify!</ButtonText>
      </Button>

      {/* Bottom Logo & Text */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity>
          <Image source={require("../../assets/logo/i.png")} style={styles.logo} />
        </TouchableOpacity>
        <Text style={styles.brandText}>Rabbit</Text>
      </View>
    </SafeAreaView>
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
  },
 
  bottomContainer: {
    position: "absolute",
    bottom: 20, // Adjust as needed
    alignItems: "center",
  },
  logo: {
    height: 20,
    width: 20,
    marginBottom: 5,
  },
  brandText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});
