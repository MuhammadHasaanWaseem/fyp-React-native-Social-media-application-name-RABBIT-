import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
  Keyboard, Animated, Easing, StyleSheet, LayoutAnimation, UIManager,
  Image, ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { Divider } from "@/components/ui/divider";
import { ArrowLeft, Send, Image as ImageIcon } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import * as ImagePicker from 'expo-image-picker';

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = "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";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();
  const flatListRef = useRef(null);
  const sendScale = useRef(new Animated.Value(1)).current;

  // Request permission for image picker
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const addMessage = (message) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMessages((prev) => [...prev, message]);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && !selectedImage) return;

    let userMessage;
    if (selectedImage) {
      userMessage = {
        role: "user",
        content: [
          { type: "text", text: input || "Analyze this image" },
          { 
            type: "image_url", 
            image_url: { 
              url: `data:image/jpeg;base64,${selectedImage.base64}`
            }
          }
        ]
      };
    } else {
      userMessage = { role: "user", content: input };
    }

    addMessage(userMessage);
    const currentInput = input;
    setInput("");
    setSelectedImage(null);
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemma-3-1b-it:free", // Changed to a model that might support images
          messages: [
            {
              role: "system",
              content: "Answer briefly & Do not use s*/ as bullets or headings. Instead, use numbers and dots (e.g., 1., 2., 3.) without headings.",
            },
            ...messages,
            userMessage
          ],
        }),
      });
      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
        const botMessage = { role: "bot", content: data.choices[0].message.content };
        addMessage(botMessage);
      } else {
        console.error("Invalid API response structure:", data);
      }
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    } finally {
      setLoading(false);
    }

    Animated.sequence([
      Animated.spring(sendScale, { toValue: 0.8, friction: 3, useNativeDriver: true }),
      Animated.spring(sendScale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
  };

  const MessageBubble = ({ item }) => {
    const isUser = item.role === "user";
    const label = isUser ? "You" : "AI";
    const hasImage = Array.isArray(item.content) && item.content.some(c => c.type === "image_url");

    return (
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={styles.labelText}>{label}</Text>
        {hasImage && (
          <Image
            source={{ uri: item.content.find(c => c.type === "image_url").image_url.url }}
            style={styles.messageImage}
          />
        )}
        <Text style={styles.messageText}>
          {Array.isArray(item.content) 
            ? item.content.find(c => c.type === "text")?.text || ""
            : item.content}
        </Text>
      </View>
    );
  };

  const TypingIndicator = () => {
    const dot1 = useRef(new Animated.Value(0.5)).current;
    const dot2 = useRef(new Animated.Value(0.5)).current;
    const dot3 = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
      const animateDot = (dot, delay) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(dot, { toValue: 1, duration: 300, delay, useNativeDriver: true }),
            Animated.timing(dot, { toValue: 0.5, duration: 300, useNativeDriver: true }),
          ])
        ).start();
      };
      animateDot(dot1, 0);
      animateDot(dot2, 150);
      animateDot(dot3, 300);
    }, []);

    return (
      <View style={styles.typingContainer}>
        <Animated.View style={[styles.dot, { transform: [{ scale: dot1 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ scale: dot2 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ scale: dot3 }] }]} />
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
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={"#E0E0E0"} />
            </TouchableOpacity>
            <Text style={styles.title}>Rabbit AI</Text>
            <View style={styles.headerIconPlaceholder} />
          </HStack>
          <Divider style={styles.divider} />
          <View style={{ flex: 1 }}>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => <MessageBubble item={item} />}
              contentContainerStyle={styles.messagesContainer}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
              ListFooterComponent={loading ? <TypingIndicator /> : null}
              keyboardShouldPersistTaps="always"
            />
          </View>
          {selectedImage && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setSelectedImage(null)}
              >
                <Text style={styles.removeImageText}>×</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
              <ImageIcon size={20} color="#E0E0E0" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Message Rabbit AI..."
              placeholderTextColor="#616161"
              value={input}
              onChangeText={setInput}
              multiline
              blurOnSubmit={false}
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Animated.View style={{ transform: [{ scale: sendScale }] }}>
                <Send size={20} color={input.trim() || selectedImage ? "#BB86FC" : "#616161"} />
              </Animated.View>
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
    backgroundColor: "#010118",
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
    color: "#E0E0E0",
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
  bubble: {
    borderRadius: 20,
    padding: 12,
    marginVertical: 4,
    maxWidth: "75%",
  },
  userBubble: {
    backgroundColor: "#BB86FC",
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: "#03DAC6",
    alignSelf: "flex-start",
  },
  labelText: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    color: "#121212",
  },
  messageText: {
    color: "#121212",
    fontSize: 16,
    lineHeight: 22,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 24,
    paddingHorizontal: 8,
    marginBottom: "3%",
    marginHorizontal: 8,
  },
  imageButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    color: "#E0E0E0",
    fontSize: 16,
    paddingVertical: 12,
    maxHeight: 120,
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
  },
  typingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 8,
    alignSelf: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: '#BB86FC',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: 'bold',
  },
});