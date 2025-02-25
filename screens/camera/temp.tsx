import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import React, { useState } from "react";
import { SafeAreaView,Text } from "react-native";
import { Input,InputField } from "@/components/ui/input";
import { Button ,ButtonText} from "@/components/ui/button";

export default () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleLogin = () => {
    console.log("Logging in with:", phoneNumber);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000", padding: 20 }}>
      <Box flex={1} justifyContent="center" alignItems="center">
        <VStack space="lg" width="100%" maxWidth={350}>
          <Text fontSize="2xl" fontWeight="bold" color="white" textAlign="center">
            Login with Phone
          </Text>

          <Input borderColor="white" borderWidth={2} borderRadius={8} p={3}>
            <InputField
              placeholder="+1 Enter your phone number"
              placeholderTextColor="gray"
              color="white"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </Input>

          <Button bg="white" onPress={handleLogin} py={3} borderRadius={8}>
            <ButtonText color="black" fontWeight="bold">Continue</ButtonText>
          </Button>
        </VStack>
      </Box>
    </SafeAreaView>
  );
};

