// PostCard.tsx
import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Camera, Mic, ImageIcon, Hash, ImagePlay, LockIcon } from 'lucide-react-native';
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

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const { threadId } = useLocalSearchParams();
  const regex = /([#@]\w+)|([^#@]+)/g;
  const textArray = post.text?.match(regex) || [];
  const [showaudio, setShowaudio] = useState(false);
  const router = useRouter();
  const { uploadFile, updatepost, Photo, MediaType, setMediaType, setPhoto } = usePost();
  const videoRef = useRef<Video>(null);
  const { playVideo } = useVideoPlayer();

  // Spoiler state
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);

  // Toggle spoiler on lock icon press
  const handleSpoilerToggle = () => {
    const newState = !isSpoiler;
    setIsSpoiler(newState);
    // Update the post tag with "spoiler" if enabled; otherwise, clear it.
    updatepost(post.id, 'tag_name', newState ? 'spoiler' : '');
  };

  // Image/Video picker
  const addPhotoAndVideo = async () => {
    setPhoto('');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [6, 5],
      quality: 0.5,
    });
    setShowaudio(false);
    if (!result.assets?.[0]?.uri) return;
    let uri = result.assets[0].uri;
    let type = result.assets[0].mimeType;
    let name = uri.split('/').pop();
    setPhoto(uri);
    setMediaType(type);
    uploadFile(post.id, uri, type, name);
  };

  return (
    <HStack className="items-center p-0">
      <VStack className="items-center">
        <Avatar size="md" style={{ marginLeft: 20, backgroundColor: 'white' }}>
          <AvatarFallbackText style={{ color: '#141414' }}>{user?.username}</AvatarFallbackText>
          <AvatarImage source={{ uri: user?.avatar }} />
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
              {Photo && MediaType?.startsWith("image/") && (
                <View style={{ position: 'relative' }}>
                  <Image source={{ uri: Photo }} style={{ height: 150, width: 150, borderRadius: 10 }} />
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
              {Photo && MediaType?.startsWith("video/") && (
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
            <HStack className="items-center gap-7">
              <TouchableOpacity onPress={addPhotoAndVideo}>
                <ImageIcon color="white" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setPhoto('');
                router.push({ pathname: '/camera', params: { threadId: post.id } });
              }}>
                <Camera color="white" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/gif')}>
                <ImagePlay color="white" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Hash color="white" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSpoilerToggle}>
                <LockIcon color="white" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowaudio(!showaudio)}>
                <Mic color="white" size={20} strokeWidth={1.5} />
              </TouchableOpacity>
            </HStack>
          </VStack>
        </Card>
      </VStack>
    </HStack>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewSpoilerButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 5,
  },
  viewSpoilerText: {
    color: '#141414',
  },
});
