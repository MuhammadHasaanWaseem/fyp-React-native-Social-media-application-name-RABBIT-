import React, { useState, useRef, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, 
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, 
  Keyboard, Animated, Easing 
} from "react-native";
import { useRouter } from "expo-router";
import { Divider } from "@/components/ui/divider";
import { Brain, Globe, Home, LoaderCircle } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import Rabbiticon from "@/assets/logo/Rabbitlogo";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = "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";

export default () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Animated spinner setup
  const spinValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [loading]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Add a role property so we can style user messages differently.
    const userMessage = { role: "user", content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-distill-llama-70b:free",
          messages: [...messages, { role: "user", content: currentInput }],
        }),
      });
      
      const data = await response.json();
      console.log("API Response:", data);
      if (data.choices && data.choices.length > 0) {
        // Set role to "bot" for the chatbot response.
        const botReply = { role: "bot", content: data.choices[0].message?.content || "No response." };
        setMessages(prevMessages => [...prevMessages, botReply]);
      } else {
        console.error("Invalid API response structure:", data);
      }
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1, backgroundColor: '#141414', padding: 20 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <HStack className=" justify-between items-center">
            <TouchableOpacity>
              <Globe color={'white'} size={23} />
            </TouchableOpacity>
            <Text style={{ color: 'white', fontWeight: '100', fontSize: 22 }}>ʀᴀʙʙɪᴛ ᴀɪ</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)')}>
              <Home size={23} color={'white'} />
            </TouchableOpacity>      
          </HStack>
          <Divider style={{ marginTop: 4 }}/>
          <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 10 }}>
                <Text 
                  style={
                    item.role === "user" 
                      ? { color: "yellow",marginTop:5,fontSize:15, fontWeight: "800" } 
                      : { color: "white" }
                  }
                >
                  {item.content}
                </Text>
              </View>
            )}
          />
          {loading && (
            <Animated.View 
              style={{ transform: [{ rotate: spin }], alignSelf: 'center', marginVertical: 10 }}
            >
              <LoaderCircle size={40} color="white" />
            </Animated.View>
          )}
          {/* Input and Send Button */}
          <View style={{ marginBottom: 10 }}>
            <TextInput
              style={{ backgroundColor: "#333", color: "white", padding: 10, borderRadius: 5, marginBottom: 10 }}
              placeholder="Type a message..."
              multiline={true}
              placeholderTextColor="gray"
              value={input}
              onChangeText={setInput}
            />
            <TouchableOpacity 
              onPress={sendMessage} 
              style={{ backgroundColor: "white", padding: 10, borderRadius: 5, marginBottom: 14 }}
            >
              <Text style={{ color: "#141414", textAlign: "center" }}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
