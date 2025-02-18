import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/ui/input";
import React, { useState } from "react";
import { Image, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Layout from './_layout';
import { useAuth } from "@/providers/AuthProviders";
import { useRouter } from "expo-router";

export default function VerifyScreen() {
  const [username, setusername] = useState("");
  const{createUser} = useAuth();
  const router =useRouter();
const handleusername   = async()=> {
   createUser(username);
  
}

  return (
    <Layout onPress={handleusername} buttonText="Create Account">
    <SafeAreaView style={styles.container}>
       <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <Text className="font-roboto" style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                  SELECT USERNAME
                </Text>
              </View>
      {/* Input Field */}
      <Input variant="outline" size="md">
        <InputField
          placeholder="Enter username here..."
          placeholderTextColor={'white'}
          style={styles.inputField}
          value={username}
          onChangeText={setusername}
        />
      </Input>
      

    
    
    </SafeAreaView></Layout>
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
    color:'white'
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
