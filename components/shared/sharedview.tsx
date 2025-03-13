// shareview.tsx
import React, { useState, useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  TouchableOpacity,
  View,
  Modal,
  Share,
  StyleSheet
} from 'react-native';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import {
  Heart,
  Send,
  MessageCircle,
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  CopyPlusIcon
} from 'lucide-react-native';
import { formatDistanceToNow } from 'date-fns';
import { Video } from 'expo-av';
import ImageViewing from 'react-native-image-viewing';
import { rendertext } from '@/screens/post/input';
import Audio from '@/screens/post/audio';
import { supabase } from '@/lib/supabase';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/providers/AuthProviders';
import { router } from 'expo-router';
import { usefollowing } from '@/hooks/use-following';
import { BlurView } from 'expo-blur';

export default function ShareView({ item, refetch }: { item: any, refetch: () => void }) {
  const { user } = useAuth();
  const isliked = item?.Like?.some((like: { user_id: string }) => like.user_id === user?.id);
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageVisible, setImageVisible] = useState(false);
  // Local state to reveal spoiler in share view
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);

  const { data: following, refetch: refetchfollowing } = usefollowing(user?.id || '');
  const regex = /([#@]\w+)|([^#@]+)/g;
  const textArray = item.text?.match(regex) || [];

  const handlePlayPause = async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { error } = await supabase.from('Like').insert({
      user_id: user?.id,
      post_id: item.id,
    });
    if (!error) refetch();
  };

  const handleShare = async () => {
    let shareMessage = item.text || "";
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

  const removelike = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { error } = await supabase
      .from('Like')
      .delete()
      .eq('user_id', user?.id)
      .eq('post_id', item.id);
    if (!error) refetch();
  };

  const followuser = async () => {
    const { error } = await supabase.from('Followers').insert({
      user_id: user?.id,
      following_user_id: item?.user_id,
    });
    if (!error) refetchfollowing();
  };

  return (
    <Card style={{ backgroundColor: '#141414' }}>
      <HStack space="md">
        <Avatar style={{ borderColor: 'white', backgroundColor: 'white' }} size="md">
          {item.User?.avatar ? (
            <AvatarImage source={{ uri: item.User.avatar }} />
          ) : (
            <AvatarFallbackText size={17} style={{ color: 'black', fontWeight: '700' }}>
              {item.User?.username?.charAt(0) || ""}
            </AvatarFallbackText>
          )}
        </Avatar>
        <VStack className="flex-1">
          <HStack className="items-center" space="md">
            <TouchableOpacity onPress={() => router.push({ pathname: '/user', params: { userid: item?.user_id } })}>
              <Text style={{ fontWeight: "bold", color: 'white', fontSize: 17 }}>
                {item.User?.username || ""}
              </Text>
            </TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 12 }}>
              {item?.created_at &&
                formatDistanceToNow(
                  new Date(new Date(item.created_at).getTime() - new Date().getTimezoneOffset() * 60000),
                  { addSuffix: true }
                )}
            </Text>
            {!following?.includes(item?.user_id) && user?.id !== item?.user_id && (
              <TouchableOpacity onPress={followuser}>
                <CopyPlusIcon color={'white'} size={16} />
              </TouchableOpacity>
            )}
          </HStack>

          {rendertext(textArray)}

          {/* Render audio if applicable */}
          {item?.file && item.file.match(/\.(mp3|m4a)$/i) && (
            <Audio
              userId={item?.user_id}
              id={item.id}
              uri={`https://wjfmftrlgfpvqdvasdhf.supabase.co/storage/v1/object/public/files/${item.user_id}/${item.file}`}
            />
          )}

          <HStack>
            {/* For images */}
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
                {/* {isLoading && (
                  <ActivityIndicator size="large" color="white" style={{ height: 300, width: 200 }} />
                )} */}
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
                  onLoad={() => setIsLoading(false)}
                />
                {item.tag_name === 'spoiler' && !spoilerRevealed && (
                  <><Text style={{color:'white'}}>This post migh consist spoler</Text><BlurView intensity={50} tint="dark" style={[StyleSheet.absoluteFill, styles.blurContainer]}>
                      <TouchableOpacity onPress={() => setSpoilerRevealed(true)} style={styles.viewSpoilerButton}>
                        <Text style={styles.viewSpoilerText}>View Spoiler</Text>
                      </TouchableOpacity>
                    </BlurView></>
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
            <HStack space="lg" className="items-center pt-1">
              <TouchableOpacity onPress={isliked ? removelike : addlike}>
                <HStack>
                  <Heart color={isliked ? 'red' : 'white'} size={20} strokeWidth={1} fill={isliked ? 'red' : 'transparent'} />
                  <Text style={{ color: "white", marginLeft: 4 }}>
                    {item.Like ? item.Like.length : 0}
                  </Text>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push({ pathname: '/comments', params: { id: item.id } })}>
                <HStack>
                  <MessageCircle color="white" size={20} strokeWidth={1} />
                  <Text style={{ color: "white", marginLeft: 4 }}>
                    {item.Comment ? item.Comment.length : 0}
                  </Text>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare}>
                <Send color="white" size={20} strokeWidth={1} />
              </TouchableOpacity>
            </HStack>
          </VStack>
        </VStack>
      </HStack>
    </Card>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'black'
  },
  viewSpoilerButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 5,
  },
  viewSpoilerText: {
    color: '#141414',
  },
  videoControls: {
    position: "absolute",
    gap: 6,
    left: 120,
    bottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  controlButton: {
    backgroundColor: '#2f2f2f',
    borderRadius: 50,
    padding: 2,
  },
});
