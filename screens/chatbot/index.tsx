import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, 
  ActivityIndicator, KeyboardAvoidingView, Platform, 
  TouchableWithoutFeedback, Keyboard 
} from "react-native";
import { useRouter } from "expo-router";
import { Divider } from "@/components/ui/divider";
import { Brain, Home } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import { isLoading } from "expo-font";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = "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";

export default () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
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
          messages: [...messages, { role: "user", content: input }],
        }),
      });
      
      const data = await response.json();
      console.log("API Response:", data);
      if (data.choices && data.choices.length > 0) {
        const botReply = { content: data.choices[0].message?.content || "No response." };
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
      style={{ flex: 1, backgroundColor: '#141414', padding: 30 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <HStack className="align-middle justify-between">
            <TouchableOpacity>
              <Brain color={'white'} size={33} style={{ gap: 4, marginBottom: 30 }} />
            </TouchableOpacity>
            <Text style={{ color: 'white',fontWeight: '800', fontSize: 22, padding: 4 }}>ʀᴀʙʙɪᴛ ᴀɪ</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)')}>
              <Home size={33} color={'white'} />
            </TouchableOpacity>      
          </HStack>
          <Divider style={{ padding: 1.5 }} />
          
          <FlatList
          
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 10 }}>
                <Text style={{ color: "white" }}>{item.content}</Text>
              </View>
            )}
          />
          {loading && <ActivityIndicator size="large" color="white" />}

          {/* Input and Send Button in Keyboard-Aware Container */}
          <View style={{ marginBottom: 10 }}>
            <TextInput
              style={{ backgroundColor: "#333", color: "white", padding: 10, borderRadius: 5, marginBottom: 10 }}
              placeholder="Type a message..."
              placeholderTextColor="gray"
              value={input}
              onChangeText={setInput}
            />
            <TouchableOpacity 
              onPress={sendMessage} 
              style={{ backgroundColor: "white", padding: 10, borderRadius: 5 }}
            >
              <Text style={{ color: "#141414", textAlign: "center" }}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
