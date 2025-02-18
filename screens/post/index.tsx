import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Camera, Mic, MapPin, Image, Hash, ImagePlay } from 'lucide-react-native';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Heading } from '@/components/ui/heading';
import { useAuth } from '@/providers/AuthProviders';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Divider } from '@/components/ui/divider';
import { router } from 'expo-router';
import { Button, ButtonText } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import * as Crypto from 'expo-crypto';
import { Input, InputField } from '@/components/ui/input';
import { useState } from 'react';

export default () => {
  const { user } = useAuth();
  const [text, setText] = useState('');

  const onPress = async () => {
    console.log(text)
    if (!user) return;
    const { error } = await supabase.from('Post').insert({
      id: Crypto.randomUUID(),
      user_id: user.id,
      text,
    });  
    if (!error) router.back();
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <VStack space="lg" className="flex-1 justify-between">
            <VStack className="flex-1">
              <HStack className="items-center justify-between p-3">
                <TouchableOpacity onPress={() => router.back()}>
                  <Text className="font-bold text-2xl">close</Text>
                </TouchableOpacity>
                <Text className="text-2xl font-bold">New Post</Text>
                <View style={{ width: 10 }} />
              </HStack>
              <Divider />

              <HStack className="items-center p-4">
                <VStack className="items-center">
                  <Avatar size="md">
                    <AvatarFallbackText>{user?.username}</AvatarFallbackText>
                    <AvatarImage source={{ uri: user?.avatar }} />
                  </Avatar>
                  <View style={{ height: 40, borderLeftWidth: 1, borderColor: '#e2e8f0' }} />
                </VStack>

                <VStack space="md" className="flex-1">
                  <Card size="lg" className="m-3 bg-transparent">
                    <VStack space="md" className="p-2">
                      <VStack>
                        <Heading size="md" className="mb-1">
                          {user?.username}
                        </Heading>
                        <Input className="border-0" size="md">
                          <InputField
                            value={text}
                            onChangeText={setText}
                            className="p-0 m-0"
                            placeholder="What's new?"
                            placeholderTextColor="#64748b"
                          />
                        </Input>
                      </VStack>
                      <HStack className="items-center justify-between">
                        {[Image, Camera, ImagePlay, Hash, MapPin, Mic].map((Icon, index) => (
                          <Icon
                            key={index}
                            color="#64748b"
                            size={20}
                            strokeWidth={1.5}
                          />
                        ))}
                      </HStack>
                    </VStack>
                  </Card>

                  <HStack className="gap-6 items-center">
                    <Avatar size="sm">
                      <AvatarFallbackText>{user?.username}</AvatarFallbackText>
                      <AvatarImage source={{ uri: user?.avatar }} />
                    </Avatar>
                    <Button variant="link" onPress={() => console.log('clicked')}>
                      <ButtonText>Add to post</ButtonText>
                    </Button>
                  </HStack>
                </VStack>
              </HStack>
            </VStack>

            <HStack className="items-center justify-between p-3 border-t border-gray-200">
              <Text className="text-gray-500">Anyone can reply & quote!</Text>
              <Button style={{ borderRadius: 9, width: 88 }} onPress={onPress}>
                <ButtonText>Post</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};