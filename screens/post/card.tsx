// import React, { useState, useRef } from 'react';
// import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
// import { HStack } from '@/components/ui/hstack';
// import { VStack } from '@/components/ui/vstack';
// import { Camera, Mic, ImageIcon, Hash, ImagePlay, LockIcon, AtSignIcon, Timer } from 'lucide-react-native';
// import { Card } from '@/components/ui/card';
// import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
// import { Heading } from '@/components/ui/heading';
// import { useAuth } from '@/providers/AuthProviders';
// import * as ImagePicker from 'expo-image-picker';
// import Input from './input';
// import { Post } from '@/lib/type';
// import { Video, ResizeMode } from 'expo-av';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { usePost } from '@/providers/PostProvider';
// import { useVideoPlayer } from '@/providers/VideoPlayerProvider';
// import Audio from './audio';
// import { BlurView } from 'expo-blur';

// interface PostCardProps {
//   post: Post;
// }

// export default function PostCard({ post }: PostCardProps) {
//   const { user } = useAuth();
//   const { threadId } = useLocalSearchParams();
//   const regex = /([#@]\w+)|([^#@]+)/g;
//   const textArray = post.text?.match(regex) || [];
//   const [showaudio, setShowaudio] = useState(false);
//   const router = useRouter();
//   const { uploadFile, updatepost, Photo, MediaType, setMediaType, setPhoto } = usePost();
//   const videoRef = useRef<Video>(null);
//   const { playVideo } = useVideoPlayer();

//   // Spoiler state
//   const [isSpoiler, setIsSpoiler] = useState(false);
//   const [spoilerRevealed, setSpoilerRevealed] = useState(false);

//   // Toggle spoiler on lock icon press
//   const handleSpoilerToggle = () => {
//     const newState = !isSpoiler;
//     setIsSpoiler(newState);
//     // Update the post tag with "spoiler" if enabled; otherwise, clear it.
//     updatepost(post.id, 'tag_name', newState ? 'spoiler' : '');
//   };

//   // Image/Video picker
//   const addPhotoAndVideo = async () => {
//     setPhoto('');
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [6, 5],
//       quality: 0.5,
//     });
//     setShowaudio(false);
//     if (!result.assets?.[0]?.uri) return;
//     let uri = result.assets[0].uri;
//     let type = result.assets[0].mimeType;
//     let name = uri.split('/').pop();
//     setPhoto(uri);
//     setMediaType(type);
//     uploadFile(post.id, uri, type, name);
//   };

//   return (
//     <HStack className="items-center p-0">
//       <VStack className="items-center">
//         <Avatar size="md" style={{ marginLeft: 20, backgroundColor: 'white' }}>
//           <AvatarFallbackText style={{ color: '#141414' }}>{user?.username}</AvatarFallbackText>
//           <AvatarImage source={{ uri: user?.avatar }} />
//         </Avatar>
//         <View style={{ height: 40, borderLeftWidth: 1, borderColor: '#e2e8f0' }} />
//       </VStack>

//       <VStack space="md" className="flex-1">
//         <Card size="sm" className="m-1 bg-transparent">
//           <VStack space="md" className="p-2">
//             <VStack>
//               <Heading style={{ color: 'white' }} size="md" className="mb-1">
//                 {user?.username}
//               </Heading>
//               <Input post={post} updatePost={updatepost} textArray={textArray} />

//               {/* Render image with spoiler overlay */}
//               {Photo && MediaType?.startsWith("image/") && (
//                 <View style={{ position: 'relative' }}>
//                   <Image source={{ uri: Photo }} style={{ height: 150, width: 150, borderRadius: 10 }} />
//                   {isSpoiler && !spoilerRevealed && (
//                     <BlurView
//                       intensity={50}
//                       tint="dark"
//                       style={[StyleSheet.absoluteFill, styles.blurContainer]}
//                     >
//                       <TouchableOpacity
//                         onPress={() => setSpoilerRevealed(true)}
//                         style={styles.viewSpoilerButton}
//                       >
//                         <Text style={styles.viewSpoilerText}>View Spoiler</Text>
//                       </TouchableOpacity>
//                     </BlurView>
//                   )}
//                 </View>
//               )}

//               {/* Render video with spoiler overlay */}
//               {Photo && MediaType?.startsWith("video/") && (
//                 <View style={{ position: 'relative' }}>
//                   <Video
//                     ref={videoRef}
//                     source={{ uri: Photo }}
//                     style={{ height: 150, width: 150, borderRadius: 10 }}
//                     useNativeControls
//                     resizeMode={ResizeMode.CONTAIN}
//                     onPlaybackStatusUpdate={(status) => {
//                       if (status.isLoaded && status.isPlaying && videoRef.current) {
//                         playVideo(videoRef.current);
//                       }
//                     }}
//                   />
//                   {isSpoiler && !spoilerRevealed && (
//                     <BlurView
//                       intensity={100}
//                       tint="dark"
//                       style={[StyleSheet.absoluteFill, styles.blurContainer]}
//                     >
//                       <TouchableOpacity
//                         onPress={() => setSpoilerRevealed(true)}
//                         style={styles.viewSpoilerButton}
//                       >
//                         <Text style={styles.viewSpoilerText}>View Spoiler</Text>
//                       </TouchableOpacity>
//                     </BlurView>
//                   )}
//                 </View>
//               )}

//               {showaudio && <Audio id={post.id} />}
//             </VStack>
//             <HStack className="items-center gap-7">
//               {/* select media from local storage */}
//               <TouchableOpacity onPress={addPhotoAndVideo}>
//                 <ImageIcon color="white" size={20} strokeWidth={1.5} />
//               </TouchableOpacity>
//               {/* capture from camera */}
//               <TouchableOpacity onPress={() => {
//                 setPhoto('');
//                 router.push({ pathname: '/camera', params: { threadId: post.id } });
//               }}>
//                 <Camera color="white" size={20} strokeWidth={1.5} />
//               </TouchableOpacity>
//               {/* towards gifs */}
//               <TouchableOpacity onPress={() => router.push('/gif')}>
//                 <ImagePlay color="white" size={20} strokeWidth={1.5} />
//               </TouchableOpacity>
//               {/* mention */}
//               <TouchableOpacity>
//                 <AtSignIcon color="white" size={20} strokeWidth={1.5} />
//               </TouchableOpacity>

//               {/* spolier alert */}
//               <TouchableOpacity onPress={handleSpoilerToggle}>
//                 <LockIcon color="white" size={20} strokeWidth={1.5} />
//               </TouchableOpacity>
//               {/* music record */}
//               <TouchableOpacity onPress={() => setShowaudio(!showaudio)}>
//                 <Mic color="white" size={20} strokeWidth={1.5} />
//               </TouchableOpacity>
//             </HStack>
//           </VStack>
//         </Card>
//       </VStack>
//     </HStack>
//   );
// }


// const styles = StyleSheet.create({
//   blurContainer: {
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   viewSpoilerButton: {
//     padding: 8,
//     backgroundColor: 'rgba(255,255,255,0.7)',
//     borderRadius: 5,
//   },
//   viewSpoilerText: {
//     color: '#141414',
//   },
// });
import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Platform
} from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import {
  Camera,
  Mic,
  ImageIcon,
  ImagePlay,
  LockIcon,
  AtSignIcon,
  Timer
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

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const { threadId } = useLocalSearchParams();
  const router = useRouter();
  const regex = /([#@]\w+)|([^#@]+)/g;
  const textArray = post.text?.match(regex) || [];
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

  // Timer (premiere) state
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // ----- Function to toggle spoiler
  const handleSpoilerToggle = () => {
    const newState = !isSpoiler;
    setIsSpoiler(newState);
    updatepost(post.id, 'tag_name', newState ? 'spoiler' : '');
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

  return (
    <HStack className="items-center p-0">
      <VStack className="items-center">
        <Avatar size="md" style={{ marginLeft: 20, backgroundColor: 'white' }}>
          <AvatarFallbackText style={{ color: '#141414' }}>
            {user?.username}
          </AvatarFallbackText>
          {/* <AvatarImage source={{ uri: user?.avatar }} /> */}
          <AvatarImage source={{ uri: `${user?.avatar}?t=${new Date().getTime()}` }}/>
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
            <HStack className="items-center gap-5">
              {/* Select media from local storage */}
              <TouchableOpacity onPress={addPhotoAndVideo}>
                <ImageIcon color="white" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              {/* Capture from camera */}
              <TouchableOpacity
                onPress={() => {
                  setPhoto('');
                  router.push({ pathname: '/camera', params: { threadId: post.id } });
                }}
              >
                <Camera color="white" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              {/* Choose GIF */}
              <TouchableOpacity onPress={() => router.push('/gif')}>
                <ImagePlay color="white" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              {/* Mention */}
              <TouchableOpacity>
                <AtSignIcon color="white" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              {/* Spoiler toggle */}
              <TouchableOpacity onPress={handleSpoilerToggle}>
                <LockIcon color="white" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              {/* Audio record */}
              <TouchableOpacity onPress={() => setShowaudio(!showaudio)}>
                <Mic color="white" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              {/* Timer (premiere) icon */}
              <TouchableOpacity onPress={handleTimerPress}>
                <Timer color={scheduledTime ? 'green' : 'white'} size={20} strokeWidth={1.5} />
              </TouchableOpacity>
            </HStack>
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
          {/* New button for uploading premier posts */}
          {post.text && post.text.trim().length > 0 && (
            <TouchableOpacity
              style={{ backgroundColor: 'white', marginTop: 17, borderRadius: 10, width: '50%' }}
              onPress={uploadPremierPost}
            >
              <Text style={{ color: 'black', padding: 7, textAlign: 'center', fontWeight: '500',fontSize:12 }}>
                Upload Premier Post
              </Text>
            </TouchableOpacity>
          )}
        </Card>
      </VStack>
    </HStack>
  );
}

const styles = StyleSheet.create({
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
  scheduledText: {
    color: 'lightgreen',
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
