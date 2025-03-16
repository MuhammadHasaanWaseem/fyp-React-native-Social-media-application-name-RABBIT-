import React, { useState, useRef, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, 
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, 
  Keyboard, Animated, Easing, StyleSheet 
} from "react-native";
import { useRouter } from "expo-router";
import { Divider } from "@/components/ui/divider";
import { ArrowLeft, Send, LoaderCircle } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = "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";

export default function ChatScreen() {
  const [messages, setMessages] = useState([]); // each message is { role, content }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const flatListRef = useRef(null);
  const spinValue = useRef(new Animated.Value(0)).current;

  // Spinner animation when loading
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
    outputRange: ["0deg", "360deg"],
  });

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add the user's message (internally with role "user")
    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
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
          model: "deepseek/deepseek-r1-distill-qwen-32b:free",
          // Prepend a system prompt instructing proper bullet formatting
          messages: [
            {
              role: "system",
              content: "Answer briefly & Do not use s*/ as bullets or headings. Instead, use numbers and dots (e.g., 1., 2., 3.) without headings.",
            },
            ...messages,
            { role: "user", content: currentInput }
          ],
        }),
      });
      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
        // Save the response as a "bot" message internally
        const botMessage = { role: "bot", content: data.choices[0].message.content };
        setMessages(prev => [...prev, botMessage]);
      } else {
        console.error("Invalid API response structure:", data);
      }
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    } finally {
      setLoading(false);
    }
  };

  // MessageBubble displays a label ("You" for user and "AI" for bot) with distinct background colors.
  const MessageBubble = ({ item }) => {
    const isUser = item.role === "user";
    const label = isUser ? "You" : "AI";
    return (
      <View style={styles.bubbleContainer}>
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={styles.labelText}>{label}</Text>
          <Text style={styles.messageText}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <HStack style={styles.header}>
            <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.backButton}>
              <ArrowLeft size={24} color={'white'} />
            </TouchableOpacity>
            <Text style={styles.title}>Rabbit AI</Text>
            <View style={styles.headerIconPlaceholder} />
          </HStack>
          <Divider style={styles.divider} />
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => <MessageBubble item={item} />}
            contentContainerStyle={styles.messagesContainer}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          />
          {loading && (
            <HStack style={styles.loadingContainer}>
              <Animated.View style={[styles.loading, { transform: [{ rotate: spin }] }]}>
                <LoaderCircle size={32} color="#4FC3F7" />
              </Animated.View>
              <Text style={styles.loadingText}>Analysing</Text>
            </HStack>
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Message Rabbit AI..."
              placeholderTextColor="#616161"
              value={input}
              onChangeText={setInput}
              multiline
              blurOnSubmit={false}
            />
            <TouchableOpacity 
              onPress={sendMessage} 
              style={styles.sendButton}
              disabled={loading}
            >
              <Send size={20} color={input.trim() ? "#4FC3F7" : "#616161"} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  backButton: {
    padding: 8,
  },
  title: {
    color: "#F5F5F5",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  headerIconPlaceholder: {
    width: 24,
  },
  divider: {
    marginBottom: 16,
  },
  messagesContainer: {
    paddingBottom: 16,
  },
  bubbleContainer: {
    marginVertical: 4,
    alignSelf: "stretch",
  },
  bubble: {
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 8,
  },
  userBubble: {
    backgroundColor: "#a54e32", // user message color
  },
  botBubble: {
    backgroundColor: "#263238", // AI message color
  },
  labelText: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    color: "#B0BEC5",
  },
  messageText: {
    color: "#F5F5F5",
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F1F1F",
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 50,
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    color: "#F5F5F5",
    fontSize: 16,
    paddingVertical: 12,
    maxHeight: 120,
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  loading: {
    marginRight: 8,
  },
  loadingText: {
    color: "white",
    fontSize: 14,
  },
});
