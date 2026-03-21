import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  ActivityIndicator,
  SafeAreaView,
  Image,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  Share,
  StyleSheet,
} from 'react-native';
import { wp, hp } from '@/lib/helper';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { supabase, getFileUrl } from '@/lib/supabase';
import { Divider } from '@/components/ui/divider';
import { formatDistanceToNowStrict } from 'date-fns';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import {
  Lock,
  ThumbsUp,
  MessageCircle,
  Send,
  Trash2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Eye,
  Timer,
} from 'lucide-react-native';
import { Video } from 'expo-av';
import ImageViewing from 'react-native-image-viewing';
import { rendertext } from '@/screens/post/input';
import Audio from '@/screens/post/audio';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/providers/AuthProviders';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Spinner } from '@/components/ui/spinner';
import { spoilerButtonColors, spoilerButtonStyles } from '@/components/shared/spoilerButton.styles';

export default () => {
  // Local search params and auth
  const { postId } = useLocalSearchParams();
  const { user } = useAuth();

  // Query for fetching post data
  const { data: post, isLoading, error, refetch } = useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Post')
        .select('*, user:User(id, username, avatar), Like(*), Comment(*)')
        .eq('id', postId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // States for time capsule
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  // States for private post
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  // States for media
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [isImageVisible, setImageVisible] = useState(false);
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);

  // State for delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Check if post is liked
  const isliked = post?.Like?.some((like) => like.user_id === user?.id);

  // Effect for time capsule logic
  useEffect(() => {
    if (post?.status === 'time_capsule' && post?.unlock_at) {
      const unlock = new Date(post.unlock_at);
      const now = new Date();
      if (unlock > now) {
        setIsLocked(true);
        const interval = setInterval(() => {
          const currentTime = new Date();
          if (unlock > currentTime) {
            setTimeLeft(formatDistanceToNowStrict(unlock));
          } else {
            setIsLocked(false);
            setTimeLeft('');
            clearInterval(interval);
          }
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, [post]);

  // Media control functions
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

  // Interaction functions
  const addlike = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { error } = await supabase
      .from('Like')
      .insert({ user_id: user?.id, post_id: post.id });
    if (!error) refetch();
  };

  const removelike = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { error } = await supabase
      .from('Like')
      .delete()
      .eq('user_id', user?.id)
      .eq('post_id', post.id);
    if (!error) refetch();
  };

  const handleShare = async () => {
    let shareMessage = post.text || '';
    if (post.file) {
      const fileUrl = getFileUrl(post.user_id, post.file);
      shareMessage += `\n\nView media: ${fileUrl}`;
    }
    try {
      await Share.share({ message: shareMessage });
    } catch (error) {
      alert(error.message);
    }
  };

  const deletePost = () => {
    setShowDeleteModal(true);
  };

  const confirmDeletePost = async () => {
    const { error } = await supabase.from('Post').delete().eq('id', post.id);
    if (!error) {
      refetch();
      setShowDeleteModal(false);
      router.back(); // Navigate back after deletion
    } else {
      setShowDeleteModal(false);
      alert('Error: Failed to delete post.');
    }
  };

  const handleUnlock = () => {
    setLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      if (passwordInput === post.password) {
        setUnlocked(true);
        setErrorMessage(null);
      } else {
        setErrorMessage('Incorrect password');
      }
      setLoading(false);
    }, 1000);
  };

  // Header component
  const header = (
    <HStack style={{ alignItems: 'center' }} space="lg">
      <Avatar
        style={{ borderColor: 'white', backgroundColor: 'white' }}
        size="md"
      >
        {post?.user?.avatar ? (
          <AvatarImage source={{ uri: post.user.avatar }} />
        ) : (
          <AvatarFallbackText
            size={17}
            style={{ color: 'black', fontWeight: '700' }}
          >
            {post?.user?.username?.charAt(0) || ''}
          </AvatarFallbackText>
        )}
      </Avatar>
      <VStack style={{ flex: 1 }}>
        <HStack style={{ alignItems: 'center', gap: wp(2) }}>
          <TouchableOpacity
            onPress={() =>
              router.push({ pathname: '/user', params: { userid: post?.user_id } })
            }
          >
            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 17 }}>
              {post?.user?.username || ''}
            </Text>
          </TouchableOpacity>
          <Text style={{ color: 'white', fontSize: 12 }}>
            {post?.created_at &&
              formatDistanceToNowStrict(
                new Date(
                  new Date(post.created_at).getTime() -
                    new Date().getTimezoneOffset() * 60000
                )
              ) + ' ago'}
          </Text>
        </HStack>
        {post?.Availablity === 'private' && !unlocked ? (
          <Text style={{ color: 'white', fontSize: 12 }}>
            Solve this puzzle to unlock it: {post.hint}
          </Text>
        ) : (
          rendertext(post?.text?.match(/([#@]\w+)|([^#@]+)/g) || [])
        )}
      </VStack>
    </HStack>
  );

  // Media rendering function
  const renderMedia = () => {
    if (!post?.file) return null;
    if (post.file.match(/\.(mp3|m4a)$/i)) {
      return (
        <View style={{ marginTop: 3 }}>
          <Audio
            userId={post.user_id}
            id={post.id}
            uri={getFileUrl(post.user_id, post.file)}
          />
        </View>
      );
    } else if (post.file.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
      return (
        <View style={{ position: 'relative' }}>
          <TouchableOpacity onPress={() => setImageVisible(true)}>
            <Image
              source={{
                uri: getFileUrl(post.user_id, post.file),
              }}
              style={{
                height: hp(18.5),
                width: wp(50),
                marginTop: hp(1.25),
                borderWidth: 1,
                borderColor: 'black',
                borderRadius: wp(2.5),
              }}
              resizeMode="cover"
            />
          </TouchableOpacity>
          {post.tag_name === 'spoiler' && !spoilerRevealed && (
            <BlurView
              intensity={50}
              tint="dark"
              style={[StyleSheet.absoluteFill, styles.blurContainer]}
            >
              <TouchableOpacity
                onPress={() => setSpoilerRevealed(true)}
                style={spoilerButtonStyles.button}
              >
                <Eye color={spoilerButtonColors.icon} size={20} strokeWidth={2} />
                <Text style={[spoilerButtonStyles.text, { marginLeft: wp(2) }]}>View Spoiler</Text>
              </TouchableOpacity>
            </BlurView>
          )}
          <Modal
            visible={isImageVisible}
            transparent={true}
            onRequestClose={() => setImageVisible(false)}
          >
            <ImageViewing
              images={[
                {
                  uri: getFileUrl(post.user_id, post.file),
                },
              ]}
              imageIndex={0}
              visible={isImageVisible}
              onRequestClose={() => setImageVisible(false)}
            />
          </Modal>
        </View>
      );
    } else if (post.file.match(/\.(mp4|mov|avi|mkv)$/i)) {
      return (
        <View style={{ position: 'relative' }}>
          <Video
            ref={videoRef}
            source={{
              uri: getFileUrl(post.user_id, post.file),
            }}
            style={{
              height: hp(37),
              marginTop: hp(1.25),
              width: wp(50),
              borderWidth: 0.5,
              borderColor: 'black',
              borderRadius: wp(2.5),
            }}
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
          {post.tag_name === 'spoiler' && !spoilerRevealed && (
            <BlurView
              intensity={50}
              tint="dark"
              style={[StyleSheet.absoluteFill, styles.blurContainer]}
            >
              <TouchableOpacity
                onPress={() => setSpoilerRevealed(true)}
                style={spoilerButtonStyles.button}
              >
                <Eye color={spoilerButtonColors.icon} size={20} strokeWidth={2} />
                <Text style={[spoilerButtonStyles.text, { marginLeft: wp(2) }]}>Spoiler</Text>
              </TouchableOpacity>
            </BlurView>
          )}
          <View style={styles.videoControls}>
            {videoFinished && (
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleReplay}
              >
                <RotateCcw size={15} color="grey" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handlePlayPause}
            >
              {isPlaying ? (
                <Pause size={15} color="grey" />
              ) : (
                <Play size={15} color="grey" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <VolumeX size={15} color="grey" />
              ) : (
                <Volume2 size={15} color="grey" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return null;
  };

  // Actions rendering function
  const renderActions = () => (
    <VStack style={{ paddingTop: hp(2) }}>
      <HStack style={{ alignItems: 'center', gap: wp(2) }} space={24}>
        <TouchableOpacity onPress={isliked ? removelike : addlike}>
          <HStack>
            <ThumbsUp
              color={isliked ? '#ff4500' : '#ff4500'}
              size={20}
              strokeWidth={1}
              fill={isliked ? '#ff4500' : 'transparent'}
            />
            <Text style={{ color: 'white', marginLeft: 4 }}>
              {post?.Like ? post.Like.length : 0}
            </Text>
          </HStack>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            router.push({ pathname: '/comments', params: { id: post.id } })
          }
        >
          <HStack>
            <MessageCircle color="#ff4500" size={20} strokeWidth={2} />
            <Text style={{ color: 'white', marginLeft: 4 }}>
              {post?.Comment ? post.Comment.length : 0}
            </Text>
          </HStack>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare}>
          <Send color="white" size={20} strokeWidth={1} />
        </TouchableOpacity>
        {user?.id === post?.user_id && (
          <TouchableOpacity onPress={deletePost}>
            <Trash2 color="#ff4500" size={20} strokeWidth={1} />
          </TouchableOpacity>
        )}
      </HStack>
    </VStack>
  );

  // Conditional rendering
  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#010118',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#ff4500" />
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#010118',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white' }}>Post not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#010118' }}>
      <Divider style={{ marginTop: hp(10), marginBottom: hp(10) }} />
      <Text
        style={{
          fontSize: 16,
          fontWeight: '800',
          color: 'white',
          textAlign: 'center',
          marginBottom: 10,
        }}
      >
        You were Mentioned in this post
      </Text>
      <Card
        style={{
          backgroundColor: '#010118',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)',
          borderRadius: 10,
        }}
      >
        {header}
        {post.status === 'time_capsule' && isLocked ? (
          <View style={{ position: 'relative' }}>
            {renderMedia()}
            <BlurView
              intensity={50}
              tint="dark"
              style={styles.blurOverlay}
            >
              <VStack
                style={{
                  padding: 5,
                  backgroundColor: '#FF4500',
                  borderWidth: 2,
                  borderColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 14,
                    fontWeight: '400',
                    fontStyle: 'italic',
                  }}
                >
                  {post.user?.username}
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 14,
                    fontWeight: '400',
                  }}
                >
                  has set this post as a time capsule.
                </Text>
                <HStack className="items-center">
                  <Timer color={'white'} size={24} />
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 14,
                      fontWeight: '400',
                      fontStyle: 'italic',
                    }}
                  >
                    {timeLeft} left.
                  </Text>
                </HStack>
              </VStack>
            </BlurView>
          </View>
        ) : post.Availablity === 'private' && !unlocked ? (
          <VStack style={{ marginLeft: wp(15), marginBottom: hp(2.5) }}>
            <BlurView
              intensity={50}
              tint="dark"
              style={styles.blurContainer}
            >
              <VStack style={{ padding: wp(2.5), alignItems: 'center' }}>
                <Lock color="white" size={24} />
                <Text style={{ color: 'white', marginTop: hp(1.25) }}>
                  This post is private
                </Text>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter 8-digit password"
                  placeholderTextColor="#ccc"
                  value={passwordInput}
                  onChangeText={setPasswordInput}
                  maxLength={8}
                />
                {errorMessage && (
                  <Text style={{ color: '#ff4500', marginTop: hp(0.6) }}>
                    {errorMessage}
                  </Text>
                )}
                {loading ? (
                  <Spinner color={'white'} style={{ marginTop: hp(1.25) }} />
                ) : (
                  <Button
                    onPress={handleUnlock}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: wp(1.5),
                      paddingVertical: hp(0.75),
                      paddingHorizontal: wp(3),
                      borderRadius: wp(5),
                      backgroundColor: '#ff4500',
                      marginTop: hp(1.25),
                    }}
                  >
                    <ButtonText>Unlock</ButtonText>
                  </Button>
                )}
              </VStack>
            </BlurView>
          </VStack>
        ) : (
          <VStack style={{ marginLeft: wp(15), marginBottom: hp(2.5) }}>
            {renderMedia()}
            {renderActions()}
          </VStack>
        )}
        {/* Delete Confirmation Modal */}
        <Modal
          visible={showDeleteModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <View style={styles.modalOverlay}>
            <BlurView intensity={100} tint="dark" style={styles.modalBlur}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Delete Post</Text>
                <Text style={styles.modalMessage}>
                  Are you sure you want to delete this post? This action cannot be
                  undone.
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowDeleteModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={confirmDeletePost}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </View>
        </Modal>
      </Card>
    </SafeAreaView>
  );
};

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
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#010118',
  },
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