// NewPostScreen.tsx
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/providers/AuthProviders';
import {
  Alert,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Divider } from '@/components/ui/divider';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Button, ButtonText } from '@/components/ui/button';
import { useCallback } from 'react';
import Card from './card';
import { FlatList } from 'react-native';
import { usePost } from '@/providers/PostProvider';
import { ArrowLeft } from 'lucide-react-native';

export default () => {
  const { user } = useAuth();
  const { threadId } = useLocalSearchParams();
  // Assuming usePost now provides: 
  // - PostCard: an array of post objects with a "text" field,
  // - Photo and MediaType: for image/video selections,
  // - audio: a string representing the selected audio file URI.
  const { clearpost, PostCard, uploadpost, Photo, MediaType, audio } = usePost();

  // Function to clear the post and navigate back
  const backwithpostclear = () => {
    clearpost();
    router.push('/(tabs)');
  };

  // Determine if at least one type of content is present:
  // 1. Text: Check if any post in the PostCard array has nonempty text.
  const hasText = PostCard.some(post => post.text && post.text.trim().length > 0);
  // 2. Media: Check if a photo/video is selected.
  const hasMedia = Photo && MediaType;
  // 3. Audio: Check if an audio file (or corresponding flag) is set.
  const hasAudio = audio && audio.trim().length > 0;

  // The Post button should be enabled if any of the above is true.
  const isValid = hasText || hasMedia || hasAudio;

  // Optionally update the button style based on isValid.
  const postButtonStyle = {
    borderRadius: 9,
    width: 88,
    backgroundColor: isValid ? 'white' : '#ccc' // Gray when disabled
  };

  // Handle Android hardware back button press
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        backwithpostclear();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  return (
    <SafeAreaView style={{ backgroundColor: '#141414' }} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <VStack space="md" className="flex-1">
            {/* Header */}
            <HStack className="items-center justify-between p-6">
              <TouchableOpacity onPress={backwithpostclear}>
                <ArrowLeft color="white" size={20} />
              </TouchableOpacity>
              <Text style={{ color: 'white' }} className="text-2xl font-bold">
                ɴᴇᴡ ᴘᴏꜱᴛ
              </Text>
              <View style={{ width: 1 }} />
            </HStack>
            <Divider />

            {/* List of Post Cards */}
            <FlatList
              data={PostCard}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <Card post={item} />}
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
              ListFooterComponent={
                <HStack className="gap-6 items-center p-3">
                  <Avatar size="sm" style={{ marginLeft: 20, backgroundColor: 'white' }}>
                    <AvatarFallbackText style={{ color: '#141414', fontWeight: '700' }}>
                      {user?.username}
                    </AvatarFallbackText>
                    <AvatarImage source={{ uri: user?.avatar }} />
                  </Avatar>
                  <Button variant="link" onPress={() => Alert.alert('non functional')}>
                    <ButtonText style={{ color: 'white' }}>Add to Premire</ButtonText>
                  </Button>
                </HStack>
              }
            />

            {/* Fixed "Post" Button */}
            <View
              style={{
                position: 'absolute',
                bottom: 1,
                left: 0,
                right: 0,
                paddingHorizontal: 16,
              }}
            >
              <HStack className="items-center justify-between p-3">
                <Text style={{ color: 'white' }} className="text-gray-500">
                  ᴬⁿʸᵒⁿᵉ ᶜᵃⁿ ʳᵉᵖˡʸ & qᵘᵒᵗᵉ!
                </Text>
                <Button
                  disabled={!isValid}
                  style={postButtonStyle}
                  onPress={uploadpost}
                >
                  <ButtonText style={{ color: '#141414' }}>Post</ButtonText>
                </Button>
              </HStack>
            </View>
          </VStack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
