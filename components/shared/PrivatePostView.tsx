// PrivatePostView.tsx
import React, { useState, useRef } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Alert,
  Share,
} from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonText } from '@/components/ui/button';
import { BlurView } from 'expo-blur';
import { Lock, ThumbsUp, MessageCircle, Send, Trash2, Play, Pause, Volume2, VolumeX, RotateCcw, EyeOff } from 'lucide-react-native';
import { Video } from 'expo-av';
import ImageViewing from 'react-native-image-viewing';
import { formatDistanceToNowStrict } from 'date-fns';
import { supabase } from '@/lib/supabase';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/providers/AuthProviders';
import { router } from 'expo-router';
import Audio from '@/screens/post/audio';
import { rendertext } from '@/screens/post/input';

interface PrivatePostViewProps {
  item: any;
  refetch: () => void;
}

export default function PrivatePostView({ item, refetch }: PrivatePostViewProps) {
  const { user } = useAuth();
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Video states
  const videoRef = useRef<Video>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  // Image states
  const [isImageVisible, setImageVisible] = useState(false);
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);

  const isliked = item?.Like?.some((like: { user_id: string }) => like.user_id === user?.id);

  const handleUnlock = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (passwordInput === item.password) {
        setUnlocked(true);
        setError(null);
      } else {
        setError('Incorrect password');
      }
      setLoading(false);
    }, 1000);
  };

  const handlePlayPause = async () => {
    if (!videoRef.current) return;
    if (isPlaying) await videoRef.current.pauseAsync();
    else await videoRef.current.playAsync();
    setIsPlaying(!isPlaying);
  };

  const handleReplay = async () => {
    if (!videoRef.current) return;
    await videoRef.current.setPositionAsync(0);
    await videoRef.current.playAsync();
    setIsPlaying(true);
    setVideoFinished(false);
  };

  const addlike = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { error } = await supabase.from('Like').insert({ user_id: user?.id, post_id: item.id });
    if (!error) refetch();
  };

  const removelike = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { error } = await supabase.from('Like').delete().eq('user_id', user?.id).eq('post_id', item.id);
    if (!error) refetch();
  };

  const handleShare = async () => {
    let shareMessage = item.text || '';
    if (item.file) {
      const fileUrl = `https://wjfmftrlgfpvqdvasdhf.supabase.co/storage/v1/object/public/files/${item.user_id}/${item.file}`;
      shareMessage += `\n\nView media: ${fileUrl}`;
    }
    try {
      await Share.share({ message: shareMessage });
    } catch (error: any) {
      alert(error.message);
    }
  };

  const deletePost = () => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('Post').delete().eq('id', item.id);
          if (!error) refetch();
          else Alert.alert('Error', 'Failed to delete post.');
        },
      },
    ]);
  };

  const header = (
    <HStack style={{ alignItems: 'center' }} space="lg">
      <Avatar style={{ borderColor: 'white', backgroundColor: 'white' }} size="md">
        {item.User?.avatar ? (
          <AvatarImage source={{ uri: item.User.avatar }} />
        ) : (
          <AvatarFallbackText size={17} style={{ color: 'black', fontWeight: '700' }}>
            {item.User?.username?.charAt(0) || ''}
          </AvatarFallbackText>
        )}
      </Avatar>
      <VStack style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 17 }}>{item.User?.username || ''}</Text>
        <HStack style={{ marginBottom: 10 }}>
          <Text style={{ color: 'white', fontSize: 12 }}>Password hint: </Text>
          <Text style={{ color: 'white', fontSize: 12 }}>{item.hint}</Text>
        </HStack>
      </VStack>
    </HStack>
  );

  const lockedContent = (
    <VStack style={{ marginLeft: 60, marginBottom: 20 }}>
      <BlurView intensity={50} tint="dark" style={styles.blurContainer}>
        <VStack style={{ padding: 10, alignItems: 'center' }}>
          <Lock color="white" size={24} />
          <Text style={{ color: 'white', marginTop: 10 }}>This post is private</Text>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter 6-digit password"
            placeholderTextColor="#ccc"
            value={passwordInput}
            onChangeText={setPasswordInput}
            maxLength={6}
            keyboardType="numeric"
            secureTextEntry
          />
          {error && <Text style={{ color: '#ff4500', marginTop: 5 }}>{error}</Text>}
          {loading ? (
            <Text style={{ color: 'white', marginTop: 10 }}>Loading...</Text>
          ) : (
            <Button onPress={handleUnlock} style={{ marginTop: 10 }}>
              <ButtonText>Unlock</ButtonText>
            </Button>
          )}
        </VStack>
      </BlurView>
    </VStack>
  );

  const unlockedContent = (
    <>
      <HStack style={{ alignItems: 'center' }} space="lg">
        <Avatar style={{ borderColor: 'white', backgroundColor: 'white' }} size="md">
          {item.User?.avatar ? (
            <AvatarImage source={{ uri: item.User.avatar }} />
          ) : (
            <AvatarFallbackText size={17} style={{ color: 'black', fontWeight: '700' }}>
              {item.User?.username?.charAt(0) || ''}
            </AvatarFallbackText>
          )}
        </Avatar>
        <VStack style={{ flex: 1 }}>
          <HStack style={{ alignItems: 'center', gap: 8 }}>
            <TouchableOpacity onPress={() => router.push({ pathname: '/user', params: { userid: item?.user_id } })}>
              <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 17 }}>{item.User?.username || ''}</Text>
            </TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 12 }}>
              {item?.created_at && formatDistanceToNowStrict(new Date(new Date(item.created_at).getTime() - new Date().getTimezoneOffset() * 60000)) + ' ago'}
            </Text>
          </HStack>
          {rendertext(item.text?.match(/([#@]\w+)|([^#@]+)/g) || [])}
        </VStack>
      </HStack>
      <VStack style={{ marginLeft: 60, marginBottom: 20 }}>
        {item?.file && item.file.match(/\.(mp3|m4a)$/i) && (
          <View style={{ marginTop: 3 }}>
            <Audio
              userId={item?.user_id}
              id={item.id}
              uri={`https://wjfmftrlgfpvqdvasdhf.supabase.co/storage/v1/object/public/files/${item.user_id}/${item.file}`}
            />
          </View>
        )}
        <HStack>
          {item.file && item.file.match(/\.(jpeg|jpg|png|gif)$/i) ? (
            <View style={{ position: 'relative' }}>
              <TouchableOpacity onPress={() => setImageVisible(true)}>
                <Image
                  source={{ uri: `https://wjfmftrlgfpvqdvasdhf.supabase.co/storage/v1/object/public/files/${item.user_id}/${item.file}` }}
                  style={{ height: 150, width: 200, marginTop: 5, borderWidth: 1, borderColor: 'black', borderRadius: 10 }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              {item.tag_name === 'spoiler' && !spoilerRevealed && (
                <BlurView intensity={50} tint="dark" style={[StyleSheet.absoluteFill, styles.blurContainer]}>
                  <TouchableOpacity onPress={() => setSpoilerRevealed(true)} style={styles.viewSpoilerButton}>
                    <EyeOff color={'white'} size={24} />
                    <Text style={styles.viewSpoilerText}>View Spoiler</Text>
                  </TouchableOpacity>
                </BlurView>
              )}
              <Modal visible={isImageVisible} transparent={true} onRequestClose={() => setImageVisible(false)}>
                <ImageViewing
                  images={[{ uri: `https://wjfmftrlgfpvqdvasdhf.supabase.co/storage/v1/object/public/files/${item.user_id}/${item.file}` }]}
                  imageIndex={0}
                  visible={isImageVisible}
                  onRequestClose={() => setImageVisible(false)}
                />
              </Modal>
            </View>
          ) : item.file && item.file.match(/\.(mp4|mov|avi|mkv)$/i) ? (
            <View style={{ position: 'relative' }}>
              <Video
                ref={videoRef}
                source={{ uri: `https://wjfmftrlgfpvqdvasdhf.supabase.co/storage/v1/object/public/files/${item.user_id}/${item.file}` }}
                style={{ height: 300, marginTop: 5, width: 200, borderWidth: 0.5, borderColor: 'black', borderRadius: 10 }}
                useNativeControls={false}
                onPlaybackStatusUpdate={(status) => {
                  if (status.didJustFinish) {
                    setIsPlaying(false);
                    setVideoFinished(true);
                  }
                }}
                isMuted={isMuted}
                isLooping={false}
                resizeMode="cover"
              />
              {item.tag_name === 'spoiler' && !spoilerRevealed && (
                <BlurView intensity={50} tint="dark" style={[StyleSheet.absoluteFill, styles.blurContainer]}>
                  <TouchableOpacity onPress={() => setSpoilerRevealed(true)} style={styles.viewSpoilerButton}>
                    <EyeOff color={'white'} size={24} />
                    <Text style={styles.viewSpoilerText}>Spoiler</Text>
                  </TouchableOpacity>
                </BlurView>
              )}
              <View style={styles.videoControls}>
                {videoFinished && (
                  <TouchableOpacity style={styles.controlButton} onPress={handleReplay}>
                    <RotateCcw size={15} color="grey" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.controlButton} onPress={handlePlayPause}>
                  {isPlaying ? <Pause size={15} color="grey" /> : <Play size={15} color="grey" />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX size={15} color="grey" /> : <Volume2 size={15} color="grey" />}
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </HStack>
        <VStack style={{ paddingTop: 16 }}>
          <HStack style={{ alignItems: 'center', gap: 8 }} space={24}>
            <TouchableOpacity onPress={isliked ? removelike : addlike}>
              <HStack>
                <ThumbsUp color={isliked ? '#ff4500' : '#ff4500'} size={20} strokeWidth={1} fill={isliked ? '#ff4500' : 'transparent'} />
                <Text style={{ color: 'white', marginLeft: 4 }}>{item.Like ? item.Like.length : 0}</Text>
              </HStack>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push({ pathname: '/comments', params: { id: item.id } })}>
              <HStack>
                <MessageCircle color="#ff4500" size={20} strokeWidth={2} />
                <Text style={{ color: 'white', marginLeft: 4 }}>{item.Comment ? item.Comment.length : 0}</Text>
              </HStack>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare}>
              <Send color="white" size={20} strokeWidth={1} />
            </TouchableOpacity>
            {user?.id === item.user_id && (
              <TouchableOpacity onPress={deletePost}>
                <Trash2 color="#ff4500" size={20} strokeWidth={1} />
              </TouchableOpacity>
            )}
          </HStack>
        </VStack>
      </VStack>
    </>
  );

  const noPrivateContent = (
    <VStack style={styles.noPrivateContainer}>
      <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>No private post</Text>
    </VStack>
  );

  const isPrivate = item.Availablity === 'private';

  return (
    <Card style={{ backgroundColor: '#010118' }}>
      {isPrivate ? (
        <>
          {!unlocked && header}
          {unlocked ? unlockedContent : lockedContent}
        </>
      ) : (
        noPrivateContent
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 20,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: '#fff',
    color: 'white',
    padding: 8,
    borderRadius: 5,
    width: 150,
    textAlign: 'center',
    marginTop: 10,
  },
  noPrivateContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  viewSpoilerButton: {
    padding: 8,
    backgroundColor: '#FF4500',
    borderRadius: 5,
    alignContent: 'center',
    alignItems: 'center',
  },
  viewSpoilerText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 11,
    marginBottom: 3,
  },
  videoControls: {
    position: 'absolute',
    gap: 6,
    left: 120,
    bottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    backgroundColor: '#2f2f2f',
    borderRadius: 50,
    padding: 2,
  },
});