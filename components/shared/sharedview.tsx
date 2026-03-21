import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Image, TouchableOpacity, View, Modal, Share, Alert, ScrollView } from 'react-native';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetIcon,
} from '@/components/ui/actionsheet';
import { Divider } from '@/components/ui/divider';
import { wp, hp } from '@/lib/helper'; //native components
import { formatDistanceToNowStrict } from 'date-fns'; // formating time
import { HStack } from '@/components/ui/hstack'; // horizontal voew
import { Card } from '@/components/ui/card'; //card view
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text'; // text
import { VStack } from '@/components/ui/vstack'; //vertical view 
import {  MessageCircle, Volume2, VolumeX, Pause, Play, RotateCcw, Trash2, Timer, Eye, ThumbsUp, Share2, LucideTrash2, Flag, MessageCircleOff, ShieldAlert, Ban, HelpCircle } from 'lucide-react-native';
import { Video } from 'expo-av'; //video
import ImageViewing from 'react-native-image-viewing'; // image zoom
import { rendertext } from '@/screens/post/input'; //text
import Audio from '@/screens/post/audio'; // Audio
import { supabase, getFileUrl } from '@/lib/supabase';
import * as Haptics from 'expo-haptics'; //vibration
import { useAuth } from '@/providers/AuthProviders'; 
import { router } from 'expo-router'; //navigation
import { BlurView } from 'expo-blur'; // blur effect
import { sharedViewStyles } from './sharedview.styles';
import { spoilerButtonColors, spoilerButtonStyles } from './spoilerButton.styles';
import { StyleSheet } from 'react-native';
import { PostSkeletonItem } from '@/components/shared/PostSkeleton';

export default function ShareView({ item, refetch }: { item: any; refetch: () => void }) {
  const { user } = useAuth();

  const imageFiles = useMemo(() => {
    if (!item?.file) return [] as string[];
    const raw = Array.isArray(item.file) ? item.file : [item.file];
    return raw
      .map((f: string) => String(f).trim())
      .filter(Boolean)
      .filter((f: string) => /\.(jpeg|jpg|png|gif|webp)$/i.test(f));
  }, [item.id, item.file]);

  const isImagePost = imageFiles.length > 0;
  const [mediaReady, setMediaReady] = useState(!isImagePost);

  useEffect(() => {
    if (!isImagePost) {
      setMediaReady(true);
      return;
    }
    setMediaReady(false);
    const urls = imageFiles.map((f: string) => getFileUrl(item.user_id, f));
    let cancelled = false;
    Promise.all(urls.map((u: string) => Image.prefetch(u).catch(() => undefined))).then(() => {
      if (!cancelled) setMediaReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [item.id, item.user_id, isImagePost, imageFiles.join('|')]);

  const isliked = item?.Like?.some((like: { user_id: string }) => like.user_id === user?.id);
  const videoRef = useRef<Video>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageVisible, setImageVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

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
      const first = Array.isArray(item.file) ? item.file[0] : item.file;
      if (first) shareMessage += `\n\nView media: ${getFileUrl(item.user_id, first)}`;
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

  const reportPost = async (reason: string) => {
    const { error } = await supabase.from('Report').insert({ user_id: user?.id, post_id: item.id, reason });
    setShowReportModal(false);
    if (!error) Alert.alert('Reported', 'Post reported successfully.');
    else Alert.alert('Error', 'Already reported or failed.');
  };

  const REPORT_REASONS: { label: string; Icon: typeof Flag }[] = [
    { label: 'Spam', Icon: MessageCircleOff },
    { label: 'Harassment', Icon: ShieldAlert },
    { label: 'Inappropriate', Icon: Ban },
    { label: 'Other', Icon: HelpCircle },
  ];

  if (item.status === 'time_capsule' || item.Availablity === 'private') {
    return null;
  }
  if (!mediaReady) {
    return <PostSkeletonItem />;
  }

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
        {item.tag_name === 'spoiler' && !spoilerRevealed ? (
          item.text?.trim() ? (
            <HStack>
              <Text style={{ color: 'white', fontWeight: '700' }}>Post Captions : </Text>
              <>{rendertext(item.text?.match(/([#@]\w+)|([^#@]+)/g) || [])}</>
            </HStack>
          ) : null
        ) : (
          <>{rendertext(item.text?.match(/([#@]\w+)|([^#@]+)/g) || [])}</>
        )}
        
      </VStack>
    </HStack>
  );

  const content = (
    <VStack style={{ marginLeft: wp(15), marginBottom: hp(2.5) }}>
      {item?.file && (() => {
        const f = Array.isArray(item.file) ? item.file[0] : item.file;
        return f && String(f).match(/\.(mp3|m4a)$/i);
      })() && (
        <View style={{ marginTop: 3, position: 'relative' }}>
          <Audio userid={item?.user_id} id={item.id} uri={getFileUrl(item.user_id, Array.isArray(item.file) ? item.file[0] : item.file)} />
          {item.tag_name === 'spoiler' && !spoilerRevealed && (
              <BlurView intensity={80} tint="dark" style={sharedViewStyles.audiospoiler}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => setSpoilerRevealed(true)} style={spoilerButtonStyles.button}>
                  <View style={spoilerButtonStyles.iconGap}>
                    <Eye color={spoilerButtonColors.icon} size={20} strokeWidth={2} />
                  </View>
                  <Text style={spoilerButtonStyles.text}>Spoiler</Text>
                </TouchableOpacity>
              </BlurView>
            )}
        </View>
      )}
      <HStack>
        {item.file && (() => {
          const raw = Array.isArray(item.file) ? item.file : [item.file];
          const files = raw.map((f: string) => String(f).trim()).filter(Boolean);
          const imageFiles = files.filter((f: string) => f.match(/\.(jpeg|jpg|png|gif|webp)$/i));
          if (imageFiles.length > 0) {
            const imageUris = imageFiles.map((f: string) => ({ uri: getFileUrl(item.user_id, f) }));
            return (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: hp(1.25) }}>
                  {imageFiles.map((f: string, idx: number) => (
                    <View key={f} style={{ position: 'relative', marginRight: wp(2) }}>
                      <TouchableOpacity onPress={() => { setImageIndex(idx); setImageVisible(true); }}>
                        <Image
                          source={{ uri: getFileUrl(item.user_id, f) }}
                          style={{ height: hp(18.5), width: wp(50), borderWidth: 1, borderColor: 'black', borderRadius: wp(2.5) }}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                      {item.tag_name === 'spoiler' && !spoilerRevealed && (
                        <BlurView intensity={80} tint="dark" style={sharedViewStyles.blurContainer}>
                          <TouchableOpacity activeOpacity={0.8} onPress={() => setSpoilerRevealed(true)} style={spoilerButtonStyles.button}>
                            <View style={spoilerButtonStyles.iconGap}>
                              <Eye color={spoilerButtonColors.icon} size={20} strokeWidth={2} />
                            </View>
                            <Text style={spoilerButtonStyles.text}>{item.text?.trim() ? 'View Spoiler' : 'Spoiler'}</Text>
                          </TouchableOpacity>
                        </BlurView>
                      )}
                    </View>
                  ))}
                </ScrollView>
                <Modal visible={isImageVisible} transparent onRequestClose={() => setImageVisible(false)}>
                  <ImageViewing
                    images={imageUris}
                    imageIndex={imageIndex}
                    visible={isImageVisible}
                    onRequestClose={() => setImageVisible(false)}
                  />
                </Modal>
              </>
            );
          }
          return null;
        })()}
        {item.file && (() => {
          const first = Array.isArray(item.file) ? item.file[0] : item.file;
          return first && String(first).match(/\.(mp4|mov|avi|mkv)$/i);
        })() ? (
          <View style={{ position: 'relative' }}>
            <Video
              ref={videoRef}
              source={{ uri: getFileUrl(item.user_id, Array.isArray(item.file) ? item.file[0] : item.file) }}
              style={{ height: hp(37), marginTop: hp(1.25), width: wp(50), borderWidth: 0.5, borderColor: 'black', borderRadius: wp(2.5) }}
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
              <BlurView intensity={80} tint="dark" style={sharedViewStyles.blurContainer}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => setSpoilerRevealed(true)} style={spoilerButtonStyles.button}>
                  <View style={spoilerButtonStyles.iconGap}>
                    <Eye color={spoilerButtonColors.icon} size={20} strokeWidth={2} />
                  </View>
                  <Text style={spoilerButtonStyles.text}>{item.text?.trim() ? 'View Spoiler' : 'Spoiler'}</Text>
                </TouchableOpacity>
              </BlurView>
            )}
            <View style={sharedViewStyles.videoControls}>
              {videoFinished && (
                <TouchableOpacity style={sharedViewStyles.controlButton} onPress={handleReplay}>
                  <RotateCcw size={15} color="grey" />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={sharedViewStyles.controlButton} onPress={handlePlayPause}>
                {isPlaying ? <Pause size={15} color="grey" /> : <Play size={15} color="grey" />}
              </TouchableOpacity>
              <TouchableOpacity style={sharedViewStyles.controlButton} onPress={() => setIsMuted(!isMuted)}>
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
          {user?.id !== item.user_id && (
            <TouchableOpacity onPress={() => setShowReportModal(true)}>
              <Flag color="white" size={20} strokeWidth={1} />
            </TouchableOpacity>
          )}
          {user?.id === item.user_id && (
            <TouchableOpacity onPress={deletePost}>
              <LucideTrash2 color="#ff4500" size={20} strokeWidth={1} />
            </TouchableOpacity>
          )}
        </HStack>
      </VStack>
    </VStack>
  );

  return (
    <Card style={{ backgroundColor: '#010118', borderRadius: wp(2.5) }}>
      {header}
      <View>
        {content}
        {isScheduled && (
          <BlurView intensity={50} tint="dark" style={sharedViewStyles.blurOverlay}>
            <VStack style={{ padding: wp(1.25), backgroundColor: '#FF4500',borderWidth:2,borderColor:'white', justifyContent: 'center', alignItems: 'center', borderRadius: wp(2) }}>
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

      {/* Delete Confirmation Modal */}
      <Modal visible={showDeleteModal} transparent animationType="fade" onRequestClose={() => setShowDeleteModal(false)}>
        <View style={sharedViewStyles.modalOverlay}>
          <BlurView intensity={100} tint="dark" style={sharedViewStyles.modalBlur}>
            <View style={sharedViewStyles.modalContainer}>
              <Text style={sharedViewStyles.modalTitle}>Delete Post</Text>
              <Text style={sharedViewStyles.modalMessage}>Are you sure you want to delete this post? This action cannot be undone.</Text>
              <View style={sharedViewStyles.modalButtons}>
                <TouchableOpacity style={sharedViewStyles.cancelButton} onPress={() => setShowDeleteModal(false)}>
                  <Text style={sharedViewStyles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={sharedViewStyles.deleteButton} onPress={confirmDeletePost}>
                  <Text style={sharedViewStyles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>
      </Modal>

      {/* Report Bottom Sheet */}
      <Actionsheet isOpen={showReportModal} onClose={() => setShowReportModal(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ backgroundColor: '#010118', borderTopWidth: 1, borderTopColor: 'rgba(255,69,0,0.2)' }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem disabled>
            <ActionsheetItemText style={{ color: '#9CA3AF', fontSize: 14 }}>
              Why are you reporting this post?
            </ActionsheetItemText>
          </ActionsheetItem>
          <Divider />
          {REPORT_REASONS.map(({ label, Icon }) => (
            <ActionsheetItem key={label} onPress={() => reportPost(label)}>
              <ActionsheetIcon color="#FF4500" as={Icon} />
              <ActionsheetItemText style={{ color: 'white' }}>{label}</ActionsheetItemText>
            </ActionsheetItem>
          ))}
          <Divider />
          <ActionsheetItem onPress={() => setShowReportModal(false)}>
            <ActionsheetItemText style={{ color: '#9CA3AF' }}>Cancel</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </Card>
  );
}

