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

const Worldchat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [chatCleared, setChatCleared] = useState(false);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const flatListRef = useRef(null);

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

  useEffect(() => {
    const channel = supabase
      .channel('worldchat-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'WorldChatMessage' },
        (payload) => {
          setMessages((prev) => {
            if (prev.find((msg) => msg.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    if (chatCleared) {
      await AsyncStorage.removeItem('chatCleared');
      setChatCleared(false);
    }
    const optimisticMessage = {
      id: Math.random().toString(),
      user_id: user?.id,
      text: newMessage,
      created_at: new Date().toISOString(),
      user: { id: user?.id, username: user?.username, avatar: user?.avatar },
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage('');
    const { error } = await supabase.from('WorldChatMessage').insert({
      user_id: user?.id,
      text: newMessage,
    });

    if (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id));
    }
  };

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

  const renderItem = ({ item }) => {
    const isCurrentUser = item.user_id === user?.id;
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.messageCurrent : styles.messageOther,
        ]}
      >
        <HStack style={isCurrentUser ? styles.hStackCurrent : styles.hStackOther}>
          <Avatar size="md" style={styles.avatar}>
            <AvatarImage source={{ uri: item.user?.avatar }} />
          </Avatar>
          <TouchableOpacity
            onPress={() =>
              router.push({ pathname: '/user', params: { userid: item?.user_id } })
            }
          >
            <RNText style={styles.username}>{item.user?.username}</RNText>
          </TouchableOpacity>
        </HStack>
        <RNText style={styles.messageText}>{item.text}</RNText>
        <View style={styles.messageFooter}>
          <RNText style={styles.timestamp}>
            {new Date(item.created_at).toLocaleTimeString()}
          </RNText>
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
      </View>
    );
  };

  const handleCloseDialog = () => setShowAlertDialog(false);
  const handleBackWithoutClearing = () => {
    setShowAlertDialog(false);
    router.back();
  };
  const handleClearAndBack = async () => {
    await AsyncStorage.setItem('chatCleared', 'true');
    setChatCleared(true);
    setMessages([]);
    setShowAlertDialog(false);
    router.back();
  };
  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
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
            <TouchableOpacity onPress={() => setShowAlertDialog(true)}>
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
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.flatListContent}
              style={styles.flatList}
            />
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="grey"
              value={newMessage}
              onChangeText={setNewMessage}
            />
           <TouchableOpacity onPress={sendMessage}>
            <SendIcon color={'#4FC3F7'} />
           </TouchableOpacity>
          </View>
          <AlertDialog isOpen={showAlertDialog} onClose={handleCloseDialog} size="lg">
            <AlertDialogBackdrop />
            <AlertDialogContent>
              <AlertDialogHeader>
                <Heading size="lg" className="font-semibold">
                  Go Back?
                </Heading>
              </AlertDialogHeader>
              <AlertDialogBody className="mt-3 mb-4">
                <Text size="sm" style={{marginBottom:4}}>
                  Note ! going back will clear your chat screen permanently
                </Text>
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  variant="outline"
                  action="secondary"
                  
                  onPress={handleCloseDialog}
                  size="sm"
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>
               
                <Button onPress={handleClearAndBack} size="sm">
                  <ButtonText>Confirm</ButtonText>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog
            isOpen={deleteAlertVisible}
            onClose={cancelDeleteAlert}
            size="lg"
          >
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
                <Button
                  variant="outline"
                  action="secondary"
                  onPress={cancelDeleteAlert}
                  size="sm"
                >
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  keyboardAvoiding: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#0A0A0A',
  },
  headerTitle: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    alignSelf: 'center',
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    gap:7
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1f1f1f',
    color: 'white',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#444444',
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  messageCurrent: {
    backgroundColor: '#333333',
    alignSelf: 'flex-start',
  },
  messageOther: {
    backgroundColor: '#003366',
    alignSelf: 'flex-end',
  },
  hStackCurrent: {
    gap: 5,
    alignItems: 'center',
  },
  hStackOther: {
    gap: 5,
    alignItems: 'center',
    flexDirection: 'row-reverse',
  },
  username: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 14,
  },
  messageText: {
    color: 'white',
    fontSize: 15,
    lineHeight: 20,
  },
  timestamp: {
    color: '#AAAAAA',
    fontSize: 10,
    marginTop: 3,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  avatar: {
    borderColor: '#AAAAAA',
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
});

export default Worldchat;