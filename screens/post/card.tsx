import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Platform,
  TextInput
} from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import PrivatePostActionSheet from './privatepost';
import {
  Camera,
  Mic,
  Hourglass,
  ImageIcon,
  ImagePlay,
  AtSignIcon,
  Lock,
  EyeOff,
  CalendarClock
} from 'lucide-react-native';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Heading } from '@/components/ui/heading';
import { useAuth } from '@/providers/AuthProviders';
import * as ImagePicker from 'expo-image-picker';
import Input from './input';
import { Post } from '@/lib/type';
import { Video, ResizeMode } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePost } from '@/providers/PostProvider';
import { useVideoPlayer } from '@/providers/VideoPlayerProvider';
import Audio from './audio';
import { BlurView } from 'expo-blur';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { supabase } from '@/lib/supabase';
//mention feture imports
import MentionActionSheet from '../tabs/activity/MentionActionSheet';
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet"
import { Button, ButtonText } from "@/components/ui/button"
import { Alert } from 'react-native';
interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const { threadId } = useLocalSearchParams();
  const router = useRouter();
  const regex = /([#@]\w+)|([^#@]+)/g;
  const textArray = post.text?.match(regex) || [];
  const [showMentionSheet, setShowMentionSheet] = useState(false); // State for mention action sheet
  const [showprivateActionsheet, setShowprivateActionsheet] = useState(false); //private post action sheet --> imported
  const [showaudio, setShowaudio] = useState(false);
  const {
    updatepost,
    uploadFile,
    Photo,
    MediaType,
    setMediaType,
    setPhoto
  } = usePost();
  const videoRef = useRef<Video>(null);
  const { playVideo } = useVideoPlayer();

  // Spoiler state
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);
  //private post action sheet
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [password, setPassword] = useState('');
  const [hint, setHint] = useState('');
  const [error, setError] = useState<string | null>(null);
  const handleClose = () => {
    setShowActionsheet(false);
    setPassword('');
    setHint('');
    setError(null);
  };


  const uploadPrivatePost = async () => {
    if (password.length !== 8) {
      setError('Password must be exactly 8 characters long.');
      return;
    }
    if (!hint.trim()) {
      setError('Hint is required.');
      return;
    }

    updatepost(post.id, 'password', password);
    updatepost(post.id, 'hint', hint);
    updatepost(post.id, 'Availablity', 'private');

    const { data, error } = await supabase
      .from('Post')
      .insert({
        ...post,
        password,
        hint,
        Availablity: 'private',
      });

    if (error) {
      console.error('Error uploading private post:', error);
      setError('Failed to upload private post.');
    } else {
      handleClose();
      // Navigate back or clear post as needed
      router.back();
    }
  };
  // Timer (premiere) state
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  //mention-sheet
  // ----- Function to toggle spoiler
  const handleSpoilerToggle = () => {
    const newState = !isSpoiler;
    setIsSpoiler(newState);
    updatepost(post.id, 'tag_name', newState ? 'spoiler' : '');
  };
  //handle priavte post separetley for action sheat
  const handlePrivatePostSubmit = async (password: string, hint: string) => {
    // Update post fields locally
    updatepost(post.id, 'password', password);
    updatepost(post.id, 'hint', hint);
    updatepost(post.id, 'Availablity', 'private');

    const { data, error } = await supabase
      .from('Post')
      .insert({
        ...post,
        password,
        hint,
        Availablity: 'private',
      });

    if (error) {
      console.error('Error uploading private post:', error);
      throw new Error('Failed to upload private post.');
    } else {
      handleClose();
      router.back();
    }
  };
  // ----- Image/Video picker
  const addPhotoAndVideo = async () => {
    setPhoto('');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [6, 5],
      quality: 0.5
    });
    setShowaudio(false);
    if (!result.assets?.[0]?.uri) return;
    const uri = result.assets[0].uri;
    const type = result.assets[0].mimeType;
    const name = uri.split('/').pop();
    setPhoto(uri);
    setMediaType(type);
    uploadFile(post.id, uri, type, name!);
  };

  // ----- Handle Timer icon press (opens date picker)
  const handleTimerPress = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: scheduledTime || new Date(),
        mode: 'datetime',
        is24Hour: true,
        onChange: (event, selectedDate) => {
          if (event.type === 'set' && selectedDate) {
            setScheduledTime(selectedDate);
            // Optionally update locally now; final update will happen on upload
            updatepost(post.id, 'unlock_at', selectedDate.toISOString());
            updatepost(post.id, 'status', 'scheduled');
          }
        }
      });
    } else {
      setShowDatePicker(true);
    }
  };

  // ----- Separate upload function for premier posts
  const uploadPremierPost = async () => {
    // If a scheduled time is set, update the post with unlock_at and scheduled status.
    if (scheduledTime) {
      updatepost(post.id, 'unlock_at', scheduledTime.toISOString());
      updatepost(post.id, 'status', 'scheduled');
    }
    // Insert the post into the database
    const { data, error } = await supabase
      .from('Post')
      .insert({
        ...post,
        unlock_at: scheduledTime ? scheduledTime.toISOString() : null,
        status: scheduledTime ? 'scheduled' : null
      })
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error uploading premier post:', error);
    } else {
      // Optionally clear local state and navigate back
      router.back();
    }
  };
  //handle time capsule
  const uploadTimeCapsulePost = async () => {
    if (!scheduledTime) {
      Alert.alert('Error', 'Please set a time for the time capsule.');
      return;
    }
    updatepost(post.id, 'unlock_at', scheduledTime.toISOString());
    updatepost(post.id, 'status', 'time_capsule');

    const { data, error } = await supabase
      .from('Post')
      .insert({
        ...post,
        unlock_at: scheduledTime.toISOString(),
        status: 'time_capsule',
      });

    if (error) {
      console.error('Error uploading time capsule post:', error);
      Alert.alert('Error', 'Failed to upload time capsule post.');
    } else {
      router.back();
    }
  };
  return (
    <HStack className="items-center p-0">
      <VStack className="items-center">
        <Avatar size="md" style={{ marginLeft: 20, backgroundColor: 'white' }}>
          <AvatarFallbackText style={{ color: '#141414' }}>
            {user?.username}
          </AvatarFallbackText>
          {/* <AvatarImage source={{ uri: user?.avatar }} /> */}
          <AvatarImage source={{ uri: `${user?.avatar}?t=${new Date().getTime()}` }} />
        </Avatar>
        <View style={{ height: 40, borderLeftWidth: 1, borderColor: '#e2e8f0' }} />
      </VStack>

      <VStack space="md" className="flex-1">
        <Card size="sm" className="m-1 bg-transparent">
          <VStack space="md" className="p-2">
            <VStack>
              <Heading style={{ color: 'white' }} size="md" className="mb-1">
                {user?.username}
              </Heading>
              <Input post={post} updatePost={updatepost} textArray={textArray} />

              {/* Render image with spoiler overlay */}
              {Photo && MediaType?.startsWith('image/') && (
                <View style={{ position: 'relative' }}>
                  <Image
                    source={{ uri: Photo }}
                    style={{ height: 150, width: 150, borderRadius: 10 }}
                  />
                  {isSpoiler && !spoilerRevealed && (
                    <BlurView
                      intensity={50}
                      tint="dark"
                      style={[StyleSheet.absoluteFill, styles.blurContainer]}
                    >
                      <TouchableOpacity
                        onPress={() => setSpoilerRevealed(true)}
                        style={styles.viewSpoilerButton}
                      >
                        <Text style={styles.viewSpoilerText}>View Spoiler</Text>
                      </TouchableOpacity>
                    </BlurView>
                  )}
                </View>
              )}

              {/* Render video with spoiler overlay */}
              {Photo && MediaType?.startsWith('video/') && (
                <View style={{ position: 'relative' }}>
                  <Video
                    ref={videoRef}
                    source={{ uri: Photo }}
                    style={{ height: 150, width: 150, borderRadius: 10 }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    onPlaybackStatusUpdate={(status) => {
                      if (status.isLoaded && status.isPlaying && videoRef.current) {
                        playVideo(videoRef.current);
                      }
                    }}
                  />
                  {isSpoiler && !spoilerRevealed && (
                    <BlurView
                      intensity={100}
                      tint="dark"
                      style={[StyleSheet.absoluteFill, styles.blurContainer]}
                    >
                      <TouchableOpacity
                        onPress={() => setSpoilerRevealed(true)}
                        style={styles.viewSpoilerButton}
                      >
                        <Text style={styles.viewSpoilerText}>View Spoiler</Text>
                      </TouchableOpacity>
                    </BlurView>
                  )}
                </View>
              )}

              {showaudio && <Audio id={post.id} />}
            </VStack>
            <VStack space='lg'>
              <HStack className="items-center " space='lg'>
                {/* Select media from local storage */}
                <TouchableOpacity style={styles.igniteicon} onPress={addPhotoAndVideo}>
                  <ImageIcon color="white" size={20} strokeWidth={1.5} />
                </TouchableOpacity>
                {/* Capture from camera */}
                <TouchableOpacity style={styles.igniteicon}
                  onPress={() => {
                    setPhoto('');
                    router.push({ pathname: '/camera', params: { threadId: post.id } });
                  }}
                >
                  <Camera color="white" size={20} strokeWidth={1.5} />
                </TouchableOpacity >
                {/* Choose GIF */}
                <TouchableOpacity style={styles.igniteicon} onPress={() => router.push('/gif')}>
                  <ImagePlay color="white" size={20} strokeWidth={1.5} />
                </TouchableOpacity>
                {/* Mention */}
                <TouchableOpacity style={styles.igniteicon}>
                  <AtSignIcon color="white" size={20} strokeWidth={1.5} onPress={() => setShowMentionSheet(true)} />
                </TouchableOpacity>
                {/* Spoiler toggle */}
                <TouchableOpacity style={styles.igniteicon} onPress={handleSpoilerToggle}>
                  <EyeOff color="white" size={20} strokeWidth={1.5} />
                </TouchableOpacity>
                {/* Audio record */}
                <TouchableOpacity onPress={() => setShowaudio(!showaudio)}
                  style={styles.igniteicon}>
                  <Mic color="white" size={20} strokeWidth={1.5} />
                </TouchableOpacity>
              </HStack>
              <HStack space='lg'>
                {/* time capsule with conditions */}
                {post.text && post.text.trim().length > 0 && (
                  <TouchableOpacity style={styles.igniteicon} onPress={handleTimerPress}>

                    <Hourglass color={'white'} size={20} strokeWidth={1.5} />
                  </TouchableOpacity>)}
                {post.text === '' && (<TouchableOpacity style={styles.igniteicon} onPress={() => Alert.alert('Add captions to use this feature')}>
                  <Hourglass color={'grey'} size={20} strokeWidth={1.5} />
                </TouchableOpacity>)}

                {/* private post icon with conditions*/}
                {post.text && post.text.trim().length > 0 && (<TouchableOpacity style={styles.igniteicon} onPress={() => setShowActionsheet(true)}>

                  <Lock color={'white'} size={20} strokeWidth={1.5} />
                </TouchableOpacity>)}
                {post.text === '' && (<TouchableOpacity style={styles.igniteicon} onPress={() => Alert.alert('Add captions to use this feature')}>
                  <Lock color={'grey'} size={20} strokeWidth={1.5} />
                </TouchableOpacity>)}
                {/*  (premiere) icon */}
                <TouchableOpacity style={styles.igniteicon} onPress={handleTimerPress}>
                  <CalendarClock color={scheduledTime ? '#ff4500' : 'white'} size={20} strokeWidth={1.5} />
                </TouchableOpacity>
              </HStack>
            </VStack>
            {/* Conditionally render DateTimePicker for iOS */}
            {Platform.OS === 'ios' && showDatePicker && (
              <DateTimePicker
                value={scheduledTime || new Date()}
                mode="datetime"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (event.type === 'set' && selectedDate) {
                    setScheduledTime(selectedDate);
                    updatepost(post.id, 'unlock_at', selectedDate.toISOString());
                    updatepost(post.id, 'status', 'scheduled');
                  }
                  setShowDatePicker(false);
                }}
              />
            )}
          </VStack>
          {scheduledTime && (
            <Text style={styles.scheduledText}>
              Premiere at: {scheduledTime.toLocaleString()}
            </Text>
          )}
          <HStack space='lg'>
            {/* New button for uploading premier posts */}
            {scheduledTime && (
              (Photo && post.text && post.text.trim().length > 0) ? (
                <TouchableOpacity
                  style={{ backgroundColor: 'white', marginTop: 17, borderRadius: 6, width: '45%' }}
                  onPress={uploadPremierPost}
                >
                  <Text style={styles.buttonText}>
                    Premier
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{ backgroundColor: 'grey', marginTop: 17, borderRadius: 6, width: '45%' }}
                  onPress={() => Alert.alert('Can not proceed', 'Select a file & Catch title first')}
                >
                  <Text style={styles.buttonText}>
                    Premier
                  </Text>
                </TouchableOpacity>
              )
            )}
            {/* New button for Time capsule posts */}
            {scheduledTime && (
              (Photo && post.text && post.text.trim().length > 0) ? (
                <TouchableOpacity
                  style={{ backgroundColor: 'white', marginTop: 17, borderRadius: 6, width: '45%' }}
                  onPress={uploadTimeCapsulePost}
                >
                  <Text style={styles.buttonText}>
                    Time Capsule
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{ backgroundColor: 'grey', marginTop: 17, borderRadius: 6, width: '45%' }}
                  onPress={() => Alert.alert('Can not proceed', 'Select a file & Catch title first')}
                >
                  <Text style={styles.buttonText}>
                    Time Capsule
                  </Text>
                </TouchableOpacity>
              )
            )}
          </HStack>
        </Card>
        <PrivatePostActionSheet
          visible={showActionsheet}
          onClose={handleClose}
          onSubmit={handlePrivatePostSubmit}
        />
        {/* <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
          <ActionsheetBackdrop />
          <ActionsheetContent style={styles.sheetContent}>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <VStack space="md" style={styles.sheetContainer}>
              <Text style={styles.sheetTitle}>Set Private Post</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 8-digit password"
                placeholderTextColor="#ccc"
                value={password}
                onChangeText={setPassword}
                maxLength={8}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter hint (required)"
                placeholderTextColor="#ccc"
                value={hint}
                onChangeText={setHint}
              />
              {error && <Text style={styles.errorText}>{error}</Text>}
              <HStack space="md">
                <Button style={styles.button} onPress={uploadPrivatePost}>
                  <ButtonText style={styles.buttonText}>Post</ButtonText>
                </Button>
                <Button style={styles.button} onPress={handleClose}>
                  <ButtonText style={styles.buttonText}>Cancel</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </ActionsheetContent>
        </Actionsheet> */}
        {/* action sheet for mentions */}
        <MentionActionSheet
          visible={showMentionSheet}
          onClose={() => setShowMentionSheet(false)}
          onMention={(username) => {
            const newText = `${post.text || ''} @${username}`;
            updatepost(post.id, 'text', newText);
          }}
        />
      </VStack>
    </HStack>
  );
}

const styles = StyleSheet.create({
  sheetContent: {
    backgroundColor: '#010118',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  sheetContainer: {
    width: '100%',
  },
  sheetTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    color: 'white',
    borderWidth: 1,
    borderColor: '#fff',
    padding: 12,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#010118'
  },
  errorText: {
    color: '#ff4500',
    textAlign: 'center',
    marginBottom: 12,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 8,
  },
  blurContainer: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewSpoilerButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 5
  },
  viewSpoilerText: {
    color: '#141414'
  },
  igniteicon: {
    borderRadius: 30,
    padding: 4,
    backgroundColor: 'black',
    borderWidth: 0.5,
    borderColor: 'grey'
  },
  scheduledText: {
    color: '#ff4500',
    textAlign: 'center',
    marginTop: 4,
    fontSize: 12
  },
  uploadButton: {
    backgroundColor: '#3f3f3f',
    borderRadius: 9,
    marginTop: 10,
    paddingVertical: 8,
    alignItems: 'center'
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: '600'
  }
});

