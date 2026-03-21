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
  Share,
  KeyboardAvoidingView,
} from 'react-native';
import { wp, hp } from '@/lib/helper';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonText } from '@/components/ui/button';
import { BlurView } from 'expo-blur';
import { Lock, ThumbsUp, MessageCircle, Send, Trash2, Play, Pause, Volume2, VolumeX, RotateCcw, Eye, Share2 } from 'lucide-react-native';
import { Video } from 'expo-av';
import ImageViewing from 'react-native-image-viewing';
import { formatDistanceToNowStrict } from 'date-fns';
import { supabase, getFileUrl } from '@/lib/supabase';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/providers/AuthProviders';
import { router } from 'expo-router';
import Audio from '@/screens/post/audio';
import { rendertext } from '@/screens/post/input';
import { Spinner } from '../ui/spinner';
import { spoilerButtonColors, spoilerButtonStyles } from '@/components/shared/spoilerButton.styles';

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

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Video states
  const videoRef = useRef<Video>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  // Image states
  const [isImageVisible, setImageVisible] = useState(false);
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);

  const isliked = item?.Like?.some((like: { user_id: string }) => like.user_id === user?.id);
  const file = item?.file ? (Array.isArray(item.file) ? item.file[0] : item.file) : null;
  const fileStr = file ? String(file) : '';

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
    if (fileStr) {
      shareMessage += `\n\nView media: ${getFileUrl(item.user_id, fileStr)}`;
    }
    try {
      await Share.share({ message: shareMessage });
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Instead of Alert.alert, we open our custom modal
  const deletePost = () => {
    setShowDeleteModal(true);
  };

  // Function to actually delete the post
  const confirmDeletePost = async () => {
    const { error } = await supabase.from('Post').delete().eq('id', item.id);
    if (!error) {
      refetch();
      setShowDeleteModal(false);
    } else {
      // Optional: you can display an error message in the modal or use alert if needed.
      setShowDeleteModal(false);
      alert('Error: Failed to delete post.');
    }
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
        <HStack style={{ marginBottom: hp(1.25) }}>
          
          <Text style={{ color: 'white', fontSize: 12 }}>Passcode HInt : {item.hint}</Text>
        </HStack>
      </VStack>
    </HStack>
  );

  const lockedContent = (
    
    <VStack style={{ marginLeft: wp(15), marginBottom: hp(2.5) }}>
      <BlurView 
      intensity={50} tint="dark" style={styles.blurContainer}>
        <VStack style={{ padding: wp(2.5), alignItems: 'center' }}>
          <Lock color="white" size={24} />
          <Text style={{ color: 'white', marginTop: hp(1.25) }}>This post is private</Text>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter 8-digit password"
            placeholderTextColor="#ccc"
            value={passwordInput}
            onChangeText={setPasswordInput}
            maxLength={8}
          />
          {error && <Text style={{ color: '#ff4500', marginTop: hp(0.6) }}>{error}</Text>}
          {loading ? (
            <Spinner color={'white'} style={{ marginTop: hp(1.25) }} />
          ) : (
            <Button onPress={handleUnlock} style={{ flexDirection: 'row', alignItems: 'center', gap: wp(1.5), paddingVertical: hp(0.75), paddingHorizontal: wp(3), borderRadius: wp(5), backgroundColor: '#ff4500', marginTop: hp(1.25) }}>
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
      <VStack style={{ marginLeft: wp(15), marginBottom: hp(2.5) }}>
        {fileStr && fileStr.match(/\.(mp3|m4a)$/i) && (
          <View style={{ marginTop: 3 }}>
            <Audio
              userId={item?.user_id}
              id={item.id}
              uri={getFileUrl(item.user_id, fileStr)}
            />
          </View>
        )}
        <HStack>
          {fileStr && fileStr.match(/\.(jpeg|jpg|png|gif)$/i) ? (
            <View style={{ position: 'relative' }}>
              <TouchableOpacity onPress={() => setImageVisible(true)}>
                <Image
                  source={{ uri: getFileUrl(item.user_id, fileStr) }}
                  style={{ height: hp(18.5), width: wp(50), marginTop: hp(0.6), borderWidth: 1, borderColor: 'black', borderRadius: wp(2.5) }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              {item.tag_name === 'spoiler' && !spoilerRevealed && (
                <BlurView intensity={50} tint="dark" style={[StyleSheet.absoluteFill, styles.blurContainer]}>
                  <TouchableOpacity onPress={() => setSpoilerRevealed(true)} style={spoilerButtonStyles.button}>
                    <Eye color={spoilerButtonColors.icon} size={20} strokeWidth={2} />
                    <Text style={[spoilerButtonStyles.text, { marginLeft: wp(2) }]}>View Spoiler</Text>
                  </TouchableOpacity>
                </BlurView>
              )}
              <Modal visible={isImageVisible} transparent={true} onRequestClose={() => setImageVisible(false)}>
                <ImageViewing
                  images={[{ uri: getFileUrl(item.user_id, fileStr) }]}
                  imageIndex={0}
                  visible={isImageVisible}
                  onRequestClose={() => setImageVisible(false)}
                />
              </Modal>
            </View>
          ) : fileStr && fileStr.match(/\.(mp4|mov|avi|mkv)$/i) ? (
            <View style={{ position: 'relative' }}>
              <Video
                ref={videoRef}
                source={{ uri: getFileUrl(item.user_id, fileStr) }}
                style={{ height: hp(37), marginTop: hp(0.6), width: wp(50), borderWidth: 0.5, borderColor: 'black', borderRadius: wp(2.5) }}
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
                  <TouchableOpacity onPress={() => setSpoilerRevealed(true)} style={spoilerButtonStyles.button}>
                    <Eye color={spoilerButtonColors.icon} size={20} strokeWidth={2} />
                    <Text style={[spoilerButtonStyles.text, { marginLeft: wp(2) }]}>Spoiler</Text>
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
        <VStack style={{ paddingTop: hp(2) }}>
          <HStack style={{ alignItems: 'center', gap: wp(2) }} space={24}>
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
              <Share2 color="white" size={20} strokeWidth={1} />
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
    <Card style={{ backgroundColor: '#010118' , borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: wp(2.5)}}>
      {isPrivate ? (
        <>
          {!unlocked && header}
          {unlocked ? unlockedContent : lockedContent}
        </>
      ) : (
        noPrivateContent
      )}

      {/* Delete Confirmation Modal */}
      <Modal visible={showDeleteModal} transparent animationType="fade" onRequestClose={() => setShowDeleteModal(false)}>
        <View style={styles.modalOverlay}>
          <BlurView intensity={100} tint="dark" style={styles.modalBlur}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Delete Post</Text>
              <Text style={styles.modalMessage}>Are you sure you want to delete this post? This action cannot be undone.</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowDeleteModal(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={confirmDeletePost}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>
      </Modal>
    </Card>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    borderRadius: wp(4),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.3)',
    backgroundColor: '#010118',
  },
  passwordInput: {
    backgroundColor: '#0A0A0A',
    color: 'white',
    padding: hp(1.75),
    borderRadius: wp(3),
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  noPrivateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(5),
  },
  videoControls: {
    position: 'absolute',
    gap: wp(1.5),
    left: wp(30),
    bottom: hp(0.75),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    backgroundColor: '#2f2f2f',
    borderRadius: wp(12.5),
    padding: wp(0.5),
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBlur: {
    width: '90%',
    padding: wp(5),
    borderRadius: wp(5),
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: wp(5),
    padding: wp(5),
    alignItems: 'center',
  },
  modalTitle: {
    color: '#FF4500',
    fontSize: hp(2.75),
    fontWeight: 'bold',
    marginBottom: hp(1.25),
  },
  modalMessage: {
    color: 'white',
    fontSize: hp(2),
    textAlign: 'center',
    marginBottom: hp(2.5),
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cancelButton: {
    paddingVertical: hp(1.25),
    paddingHorizontal: wp(5),
    borderRadius: wp(2.5),
    backgroundColor: '#444',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: hp(2),
  },
  deleteButton: {
    paddingVertical: hp(1.25),
    paddingHorizontal: wp(5),
    borderRadius: wp(2.5),
    backgroundColor: '#FF4500',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: hp(2),
    fontWeight: 'bold',
  },
});

