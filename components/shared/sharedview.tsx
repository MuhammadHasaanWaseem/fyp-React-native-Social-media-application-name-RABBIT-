import React, { useState, useRef, useEffect } from 'react'; //hooks
import { Image, TouchableOpacity, View, Modal, Share, StyleSheet, Alert } from 'react-native'; //native components
import { formatDistanceToNowStrict } from 'date-fns'; // formating time
import { HStack } from '@/components/ui/hstack'; // horizontal voew
import { Card } from '@/components/ui/card'; //card view
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text'; // text
import { VStack } from '@/components/ui/vstack'; //vertical view 
import { Heart, Send, MessageCircle, Volume2, VolumeX, Pause, Play, RotateCcw, Trash2, Timer, EyeOff, ThumbsUp } from 'lucide-react-native'; //lucid icons
import { Video } from 'expo-av'; //video
import ImageViewing from 'react-native-image-viewing'; // image zoom
import { rendertext } from '@/screens/post/input'; //text
import Audio from '@/screens/post/audio'; // Audio
import { supabase } from '@/lib/supabase'; //database
import * as Haptics from 'expo-haptics'; //vibration
import { useAuth } from '@/providers/AuthProviders'; 
import { router } from 'expo-router'; //navigation
import { BlurView } from 'expo-blur'; // blur effect

export default function ShareView({ item, refetch }: { item: any; refetch: () => void }) {
  const { user } = useAuth();

  // Prevent rendering if the post is private
  if (item.status === 'time_capsule' || item.Availablity === 'private') {
    return null; // Private posts should not appear in ShareView
  }

  const isliked = item?.Like?.some((like: { user_id: string }) => like.user_id === user?.id);
  const videoRef = useRef<Video>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageVisible, setImageVisible] = useState(false);
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (item.unlock_at) {
      const unlock = new Date(item.unlock_at);
      if (unlock > new Date()) {
        setIsScheduled(true);
        const interval = setInterval(() => {
          const now = new Date();
          if (unlock > now) {
            setTimeLeft(formatDistanceToNowStrict(unlock));
          } else {
            setIsScheduled(false);
            clearInterval(interval);
          }
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, [item.unlock_at]);

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

  const followuser = async () => {
    const { error } = await supabase.from('Followers').insert({ user_id: user?.id, following_user_id: item?.user_id });
    if (!error) refetch();
  };

  // Remove Alert and use our custom modal instead
  const deletePost = () => {
    setShowDeleteModal(true);
  };

  const confirmDeletePost = async () => {
    const { error } = await supabase.from('Post').delete().eq('id', item.id);
    if (!error) {
      refetch();
      setShowDeleteModal(false);
    } else {
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
  );

  const content = (
    <VStack style={{ marginLeft: 60, marginBottom: 20 }}>
      {item?.file && item.file.match(/\.(mp3|m4a)$/i) && (
        <View style={{ marginTop: 3 }}>
          <Audio userId={item?.user_id} id={item.id} uri={`https://wjfmftrlgfpvqdvasdhf.supabase.co/storage/v1/object/public/files/${item.user_id}/${item.file}`} />
        </View>
      )}
      <HStack>
        {item.file && item.file.match(/\.(jpeg|jpg|png|gif)$/i) ? (
          <View style={{ position: 'relative' }}>
            <TouchableOpacity onPress={() => setImageVisible(true)}>
              <Image
                source={{ uri: `https://wjfmftrlgfpvqdvasdhf.supabase.co/storage/v1/object/public/files/${item.user_id}/${item.file}` }}
                style={{ height: 150, width: 200, marginTop: 10, borderWidth: 1, borderColor: 'black', borderRadius: 10 }}
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
              style={{ height: 300, marginTop: 10, width: 200, borderWidth: 0.5, borderColor: 'black', borderRadius: 10 }}
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
              onLoad={() => setIsLoading(false)}
            />
            {item.tag_name === 'spoiler' && !spoilerRevealed && (
              <BlurView intensity={50} tint="dark" style={[StyleSheet.absoluteFill, styles.blurContainer]}>
                <TouchableOpacity  onPress={() => setSpoilerRevealed(true)} style={styles.viewSpoilerButton}>
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
  );

  return (
    <Card style={{ backgroundColor: '#010118' , borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 10}}>
      {header}
      <View>
        {content}
        {isScheduled && (
          <BlurView intensity={50} tint="dark" style={styles.blurOverlay}>
            <VStack style={{ padding: 5, backgroundColor: '#FF4500',borderWidth:2,borderColor:'white', justifyContent: 'center', alignItems: 'center', borderRadius: 8 }}>
              <Text style={{ color: 'white', fontSize: 14, fontWeight: '400' ,fontStyle:'italic'}}>{item.User?.username}</Text>
              <Text style={{ color: 'white', fontSize: 14, fontWeight: '400' }}>𝘩𝘢𝘴 𝘴𝘦𝘵 𝘵𝘩𝘪𝘴 𝘗𝘰𝘴𝘵 𝘢𝘴 𝘱𝘳𝘦𝘮𝘪𝘦𝘳.
              </Text>
              <HStack className='items-center'>
                <Timer color={'white'} size={24} />
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '400',fontStyle:'italic' }}>{timeLeft} left.</Text>
              </HStack>
            </VStack>
          </BlurView>
        )}
      </View>

      {/* Custom Delete Confirmation Modal */}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#010122',
    borderWidth: 2,
    marginTop: 5,
    borderColor: 'rgba(255,107,53,0.3)'
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    marginTop:10,
    borderRadius:10

    
  },
  viewSpoilerButton: {
    paddingHorizontal: 17,
    paddingVertical:7,
    backgroundColor: '#FF4500',
    borderRadius: 25, 
    borderColor:'white',
    borderWidth:2,
    alignContent: 'center',
    alignItems: 'center'
  },
  viewSpoilerText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 11,
    marginBottom: 3
  },
  videoControls: {
    position: 'absolute',
    gap: 6,
    left: 120,
    bottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  controlButton: {
    backgroundColor: '#2f2f2f',
    borderRadius: 50,
    padding: 2
  },
  // Modal styles for deletion confirmation
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBlur: {
    width: '90%',
    padding: 20,
    borderRadius: 20
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center'
  },
  modalTitle: {
    color: '#FF4500',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },
  modalMessage: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#444'
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#FF4500'
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
