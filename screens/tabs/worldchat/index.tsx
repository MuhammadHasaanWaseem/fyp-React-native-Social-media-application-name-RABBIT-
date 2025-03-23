import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Animated,
} from 'react-native';
import { Text as RNText } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProviders';
import { ArrowLeft, Trash2Icon, ArrowDownCircle, SendIcon } from 'lucide-react-native';
import { router } from 'expo-router';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogBackdrop,
} from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

// AnimatedMessage component jo messages ko animation ke saath render karta hai
const AnimatedMessage = ({ item, isCurrentUser, setMessageToDelete, setDeleteAlertVisible }) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(animation, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.messageContainer,
        isCurrentUser ? styles.messageCurrent : styles.messageOther,
        {
          opacity: animation,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <HStack style={isCurrentUser ? styles.hStackCurrent : styles.hStackOther}>
        <Avatar size="md" style={styles.avatar}>
          <AvatarImage source={{ uri: item.user?.avatar }} />
        </Avatar>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/user', params: { userid: item?.user_id } })}
        >
          <RNText style={styles.username}>{item.user?.username}</RNText>
        </TouchableOpacity>
      </HStack>
      <RNText style={styles.messageText}>{item.text}</RNText>
      <View style={styles.messageFooter}>
        <RNText style={styles.timestamp}>{new Date(item.created_at).toLocaleTimeString()}</RNText>
        {isCurrentUser && (
          <TouchableOpacity
            onPress={() => {
              setMessageToDelete(item);
              setDeleteAlertVisible(true);
            }}
          >
            <Trash2Icon color={'white'} size={16} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

// Main Worldchat component
const Worldchat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [chatCleared, setChatCleared] = useState(false);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [inputAnimation] = useState(new Animated.Value(1));

  const flatListRef = useRef(null);

  // Chat cleared check aur messages fetch karna
  useEffect(() => {
    const checkChatCleared = async () => {
      const flag = await AsyncStorage.getItem('chatCleared');
      if (flag === 'true') {
        setChatCleared(true);
        setMessages([]);
        setLoading(false);
      } else {
        setChatCleared(false);
        fetchMessages();
      }
    };
    checkChatCleared();
  }, []);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('WorldChatMessage')
      .select('*, user:User!user_id(id, username, avatar)')
      .order('created_at', { ascending: true });
    if (error) console.error('Error fetching messages:', error);
    else setMessages(data);
    setLoading(false);
  }, []);

  // Real-time messages ke liye Supabase channel
  useEffect(() => {
    const channel = supabase
      .channel('worldchat-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'WorldChatMessage' },
        async (payload) => {
          const { data: userData, error: userError } = await supabase
            .from('User')
            .select('id, username, avatar')
            .eq('id', payload.new.user_id)
            .single();
          if (userError) {
            console.error('Error fetching user data:', userError);
            return;
          }
          const newMessage = { ...payload.new, user: userData };
          setMessages((prev) => {
            if (prev.find((msg) => msg.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Messages ke update hone par list ko scroll karna
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Naya message bhejne ka function
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (chatCleared) {
      await AsyncStorage.removeItem('chatCleared');
      setChatCleared(false);
    }
    const tempId = `temp-${Math.random().toString()}`;
    const optimisticMessage = {
      id: tempId,
      user_id: user?.id,
      text: newMessage,
      created_at: new Date().toISOString(),
      user: { id: user?.id, username: user?.username, avatar: user?.avatar },
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage('');

    const { data, error } = await supabase
      .from('WorldChatMessage')
      .insert({
        user_id: user?.id,
        text: newMessage,
      })
      .select();

    if (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    } else {
      const actualMessage = data[0];
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? { ...actualMessage, user: optimisticMessage.user }
            : msg
        )
      );
    }
  };

  // Message delete karna
  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;
    const { error } = await supabase
      .from('WorldChatMessage')
      .delete()
      .eq('id', messageToDelete.id);
    if (error) {
      console.error('Error deleting message:', error);
    } else {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageToDelete.id));
    }
    setDeleteAlertVisible(false);
    setMessageToDelete(null);
  };

  const cancelDeleteAlert = () => {
    setDeleteAlertVisible(false);
    setMessageToDelete(null);
  };

  // Back button ka logic
  const handleBack = () => {
    setShowAlertDialog(true);
  };

  const handleClearAndBack = async () => {
    const { error } = await supabase
      .from('WorldChatMessage')
      .delete()
      .eq('user_id', user?.id);
    if (error) {
      console.error('Error clearing chat:', error);
    } else {
      setMessages([]);
      setChatCleared(true);
      await AsyncStorage.setItem('chatCleared', 'true');
    }
    setShowAlertDialog(false);
    router.back();
  };

  const handleBackWithoutClearing = () => {
    setShowAlertDialog(false);
    router.back();
  };

  // Input area ke liye animation
  const handleInputFocus = () => {
    Animated.spring(inputAnimation, {
      toValue: 1.05,
      tension: 20,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleInputBlur = () => {
    Animated.spring(inputAnimation, {
      toValue: 1,
      tension: 20,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const renderItem = ({ item }) => {
    const isCurrentUser = item.user_id === user?.id;
    return (
      <AnimatedMessage
        item={item}
        isCurrentUser={isCurrentUser}
        setMessageToDelete={setMessageToDelete}
        setDeleteAlertVisible={setDeleteAlertVisible}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack}>
              <ArrowLeft color={'white'} size={24} />
            </TouchableOpacity>
            <RNText style={styles.headerTitle}>Worldchat</RNText>
            <TouchableOpacity onPress={scrollToBottom}>
              <ArrowDownCircle color={'white'} size={24} />
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="white" style={styles.loading} />
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.flatListContent}
              style={styles.flatList}
            />
          )}
          <Animated.View style={[styles.inputContainer, { transform: [{ scale: inputAnimation }] }]}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="grey"
              value={newMessage}
              onChangeText={setNewMessage}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            <TouchableOpacity onPress={sendMessage}>
              <SendIcon color={'#4FC3F7'} />
            </TouchableOpacity>
          </Animated.View>
          <AlertDialog isOpen={showAlertDialog} onClose={handleBackWithoutClearing} size="lg">
            <AlertDialogBackdrop />
            <AlertDialogContent>
              <AlertDialogHeader>
                <Heading size="lg" className="font-semibold">
                  Clear Chat?
                </Heading>
              </AlertDialogHeader>
              <AlertDialogBody className="mt-3 mb-4">
                <Text size="sm">
                  Are you sure you want to permanently delete your chat history? This will only affect your messages.
                </Text>
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button variant="outline" action="secondary" onPress={handleBackWithoutClearing} size="sm">
                  <ButtonText>Cancel</ButtonText>
                </Button>
                <Button onPress={handleClearAndBack} size="sm">
                  <ButtonText>Confirm</ButtonText>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog isOpen={deleteAlertVisible} onClose={cancelDeleteAlert} size="lg">
            <AlertDialogBackdrop />
            <AlertDialogContent>
              <AlertDialogHeader>
                <Heading size="lg" className="font-semibold">
                  Delete Message?
                </Heading>
              </AlertDialogHeader>
              <AlertDialogBody className="mt-3 mb-4">
                <Text size="sm">Are you sure you want to delete this message?</Text>
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button variant="outline" action="secondary" onPress={cancelDeleteAlert} size="sm">
                  <ButtonText>No</ButtonText>
                </Button>
                <Button onPress={handleDeleteMessage} size="sm">
                  <ButtonText>Yes</ButtonText>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles for the UI
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  keyboardAvoiding: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2D2D2D',
    backgroundColor: '#0a0a0a',
  },
  headerTitle: {
    fontSize: 20,
    color: '#F0F0F0',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  loading: {
    flex: 1,
    alignSelf: 'center',
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 0.5,
    borderTopColor: '#2D2D2D',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    gap: 12,
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#262626',
    color: '#F0F0F0',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    includeFontPadding: false,
  },
  messageContainer: {
    padding: 14,
    marginVertical: 6,
    maxWidth: '80%',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  messageCurrent: {
    backgroundColor: '#2B2B2B',
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
  },
  messageOther: {
    backgroundColor: '#004080',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
  },
  hStackCurrent: {
    gap: 8,
    alignItems: 'center',
    marginBottom: 6,
  },
  hStackOther: {
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row-reverse',
    marginBottom: 6,
  },
  username: {
    fontWeight: '500',
    color: '#E0E0E0',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  timestamp: {
    color: '#B0B0B0',
    fontSize: 12,
    marginTop: 4,
    includeFontPadding: false,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  avatar: {
    borderColor: '#404040',
    borderWidth: 1,
    backgroundColor: '#262626',
    overflow: 'hidden',
  },
});

export default Worldchat; 