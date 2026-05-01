import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Share,
} from "react-native";
import { wp, hp } from "@/lib/helper";
import { supabase, getFileUrl } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { BlurView } from "expo-blur";
import { Timer, Eye, ThumbsUp, MessageCircle, Share2, Trash2, Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react-native";
import { formatDistanceToNowStrict } from "date-fns";
import { rendertext } from "@/screens/post/input";
import { openProfileByMentionUsername } from "@/lib/mention-nav";
import Audio from "@/screens/post/audio";
import { Video } from "expo-av";
import ImageViewing from "react-native-image-viewing";
import { Spinner } from "../ui/spinner";
import * as Haptics from "expo-haptics";
import { useAuth } from "@/providers/AuthProviders";
import { router, useFocusEffect } from "expo-router";
import { useVideoPlayer } from "@/providers/VideoPlayerProvider";
import { capsuleViewStyles as styles } from "./CapsuleView.styles";
import { spoilerButtonColors, spoilerButtonStyles } from "./spoilerButton.styles";

interface CapsuleViewProps {
  userId: string;
}

export default function CapsuleView({ userId }: CapsuleViewProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { playVideo, releaseVideo, pauseAllMedia } = useVideoPlayer();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["capsulePosts", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Post")
        .select("*, User!user_id(username, avatar), Like(*), Comment(id)")
        .eq("status", "time_capsule")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId,
  });

  const [postStates, setPostStates] = useState(() => new Map());
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const videoRefs = useRef<Map<string, Video>>(new Map());

  useFocusEffect(
    useCallback(() => {
      return () => {
        void pauseAllMedia();
        videoRefs.current.forEach((ref) => {
          ref.pauseAsync().catch(() => {});
        });
        setPostStates((prev) => {
          const next = new Map(prev);
          next.forEach((s, id) => {
            if (s?.isPlaying) next.set(id, { ...s, isPlaying: false });
          });
          return next;
        });
      };
    }, [pauseAllMedia]),
  );

  const getPostState = useCallback(
    (postId: string, post?: { unlock_at?: string }) => {
      if (postStates.has(postId)) return postStates.get(postId);
      const unlock = post?.unlock_at ? new Date(post.unlock_at) : null;
      const locked = !!(unlock && unlock > new Date());
      return {
        isLocked: locked,
        timeLeft: locked ? formatDistanceToNowStrict(unlock!) : "",
        isImageVisible: false,
        spoilerRevealed: false,
        isMediaLoaded: false,
        isPlaying: false,
        isMuted: false,
        videoFinished: false,
      };
    },
    [postStates]
  );

  useEffect(() => {
    const intervals = new Map();
    posts?.forEach((post) => {
      if (post.unlock_at) {
        const unlock = new Date(post.unlock_at);
        const now = new Date();
        if (unlock > now) {
          const interval = setInterval(() => {
            const currentTime = new Date();
            if (unlock > currentTime) {
              setPostStates((prev) => {
                const newStates = new Map(prev);
                const state = newStates.get(post.id) || {
                  isLocked: true,
                  timeLeft: "",
                  isImageVisible: false,
                  spoilerRevealed: false,
                  isMediaLoaded: false,
                  isPlaying: false,
                  isMuted: false,
                  videoFinished: false,
                };
                state.isLocked = true;
                state.timeLeft = formatDistanceToNowStrict(unlock);
                newStates.set(post.id, state);
                return newStates;
              });
            } else {
              setPostStates((prev) => {
                const newStates = new Map(prev);
                const state = newStates.get(post.id) || {
                  isLocked: false,
                  timeLeft: "",
                  isImageVisible: false,
                  spoilerRevealed: false,
                  isMediaLoaded: false,
                  isPlaying: false,
                  isMuted: false,
                  videoFinished: false,
                };
                state.isLocked = false;
                state.timeLeft = "";
                newStates.set(post.id, state);
                return newStates;
              });
              clearInterval(interval);
            }
          }, 1000);
          intervals.set(post.id, interval);
        }
      }
    });

    return () => {
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, [posts]);

  const addLike = async (postId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { error } = await supabase
      .from("Like")
      .insert({ user_id: user?.id, post_id: postId });
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["capsulePosts", userId] });
    }
  };

  const removeLike = async (postId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { error } = await supabase
      .from("Like")
      .delete()
      .eq("user_id", user?.id)
      .eq("post_id", postId);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["capsulePosts", userId] });
    }
  };

  const handleShare = async (item: any) => {
    let shareMessage = item.text || "";
    if (item.file) {
      const f = Array.isArray(item.file) ? item.file[0] : item.file;
      if (f) shareMessage += `\n\nView media: ${getFileUrl(item.user_id, f)}`;
    }
    try {
      await Share.share({ message: shareMessage });
    } catch (error: any) {
      alert(error.message);
    }
  };

  const confirmDeletePost = async (postId: string) => {
    const { error } = await supabase.from("Post").delete().eq("id", postId);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["capsulePosts", userId] });
      setShowDeleteModal(null);
    } else {
      setShowDeleteModal(null);
      alert("Error: Failed to delete post.");
    }
  };

  const renderCapsulePost = useCallback(
    ({ item }) => {
      const state = getPostState(item.id, item);
      const isLiked = item?.Like?.some(
        (like: { user_id: string }) => like.user_id === user?.id
      );

      const handleSpoilerReveal = () => {
        setPostStates((prev) => {
          const newStates = new Map(prev);
          const currentState = newStates.get(item.id) || {};
          currentState.spoilerRevealed = true;
          newStates.set(item.id, currentState);
          return newStates;
        });
      };

      const handleImagePress = () => {
        setPostStates((prev) => {
          const newStates = new Map(prev);
          const currentState = newStates.get(item.id) || {};
          currentState.isImageVisible = true;
          newStates.set(item.id, currentState);
          return newStates;
        });
      };

      const handleCloseImage = () => {
        setPostStates((prev) => {
          const newStates = new Map(prev);
          const currentState = newStates.get(item.id) || {};
          currentState.isImageVisible = false;
          newStates.set(item.id, currentState);
          return newStates;
        });
      };

      const handleMediaLoad = () => {
        setPostStates((prev) => {
          const newStates = new Map(prev);
          const currentState = newStates.get(item.id) || {};
          currentState.isMediaLoaded = true;
          newStates.set(item.id, currentState);
          return newStates;
        });
      };

      const handlePlayPause = async () => {
        const ref = videoRefs.current.get(item.id);
        if (!ref) return;
        if (state.isPlaying) {
          await ref.pauseAsync();
          releaseVideo(ref);
        } else {
          await playVideo(ref);
          await ref.playAsync();
        }
        setPostStates((prev) => {
          const next = new Map(prev);
          const s = next.get(item.id) || {};
          s.isPlaying = !state.isPlaying;
          next.set(item.id, s);
          return next;
        });
      };

      const handleReplay = async () => {
        const ref = videoRefs.current.get(item.id);
        if (!ref) return;
        await playVideo(ref);
        await ref.setPositionAsync(0);
        await ref.playAsync();
        setPostStates((prev) => {
          const next = new Map(prev);
          const s = next.get(item.id) || {};
          s.isPlaying = true;
          s.videoFinished = false;
          next.set(item.id, s);
          return next;
        });
      };

      const content = (
        <VStack style={styles.contentArea}>
          {rendertext(item.text?.match(/([#@]\w+)|([^#@]+)/g) || [], { onMentionPress: openProfileByMentionUsername })}
          {item.file && String(item.file).match(/\.(mp3|m4a)$/i) && (
            <View style={{ marginTop: 3 }}>
              <Audio
                userId={item.user_id}
                id={item.id}
                uri={getFileUrl(item.user_id, Array.isArray(item.file) ? item.file[0] : item.file)}
              />
              {state.isMediaLoaded &&
                item.tag_name === "spoiler" &&
                !state.spoilerRevealed &&
                !state.isLocked && (
                  <BlurView
                    intensity={50}
                    tint="dark"
                    style={styles.audiospoiler}
                  >
                    <TouchableOpacity
                      onPress={handleSpoilerReveal}
                      style={spoilerButtonStyles.button}
                    >
                      <Eye color={spoilerButtonColors.icon} size={20} strokeWidth={2} />
                      <Text style={[spoilerButtonStyles.text, { marginLeft: wp(2) }]}>Spoiler</Text>
                    </TouchableOpacity>
                  </BlurView>
                )}
            </View>
          )}
          {item.file && String(item.file).match(/\.(jpeg|jpg|png|gif)$/i) && (
            <View style={{ position: "relative" }}>
              {!state.isMediaLoaded && (
                <View
                  style={[styles.imagePlaceholder, { height: hp(18.5), width: wp(50) }]}
                >
                  <Spinner color="white" size={24} />
                </View>
              )}
              <Image
                source={{
                  uri: getFileUrl(item.user_id, Array.isArray(item.file) ? item.file[0] : item.file),
                }}
                style={[
                  styles.image,
                  !state.isMediaLoaded && { opacity: 0 },
                ]}
                resizeMode="cover"
                onLoad={handleMediaLoad}
              />
              {state.isMediaLoaded &&
                item.tag_name === "spoiler" &&
                !state.spoilerRevealed &&
                !state.isLocked && (
                  <BlurView
                    intensity={50}
                    tint="dark"
                    style={styles.absoluteFill}
                  >
                    <TouchableOpacity
                      onPress={handleSpoilerReveal}
                      style={spoilerButtonStyles.button}
                    >
                      <Eye color={spoilerButtonColors.icon} size={20} strokeWidth={2} />
                      <Text style={[spoilerButtonStyles.text, { marginLeft: wp(2) }]}>View Spoiler</Text>
                    </TouchableOpacity>
                  </BlurView>
                )}
              <ImageViewing
                images={[
                  {
                    uri: getFileUrl(item.user_id, Array.isArray(item.file) ? item.file[0] : item.file),
                  },
                ]}
                imageIndex={0}
                visible={state.isImageVisible}
                onRequestClose={handleCloseImage}
              />
            </View>
          )}
          {item.file && String(item.file).match(/\.(mp4|mov|avi|mkv)$/i) && (
            <View style={{ position: "relative" }}>
              {!state.isMediaLoaded && (
                <View
                  style={[styles.imagePlaceholder, { height: hp(37), width: wp(50) }]}
                >
                  <Spinner color="white" size={24} />
                </View>
              )}
              <Video
                ref={(el) => { if (el) videoRefs.current.set(item.id, el); }}
                source={{
                  uri: getFileUrl(item.user_id, Array.isArray(item.file) ? item.file[0] : item.file),
                }}
                style={[
                  styles.video,
                  !state.isMediaLoaded && { opacity: 0 },
                ]}
                useNativeControls={false}
                resizeMode="cover"
                onLoad={() => handleMediaLoad()}
                onPlaybackStatusUpdate={(status) => {
                  if (!status.isLoaded) return;
                  if (status.didJustFinish) {
                    const r = videoRefs.current.get(item.id);
                    if (r) releaseVideo(r);
                    setPostStates((prev) => {
                      const next = new Map(prev);
                      const s = next.get(item.id) || {};
                      s.isPlaying = false;
                      s.videoFinished = true;
                      next.set(item.id, s);
                      return next;
                    });
                  }
                }}
                isMuted={state.isMuted}
                isLooping={false}
              />
              {state.isMediaLoaded && (
                <View style={styles.videoControls}>
                  {state.videoFinished && (
                    <TouchableOpacity style={styles.controlButton} onPress={handleReplay}>
                      <RotateCcw size={15} color="grey" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.controlButton} onPress={handlePlayPause}>
                    {state.isPlaying ? <Pause size={15} color="grey" /> : <Play size={15} color="grey" />}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() =>
                      setPostStates((prev) => {
                        const next = new Map(prev);
                        const s = next.get(item.id) || {};
                        s.isMuted = !state.isMuted;
                        next.set(item.id, s);
                        return next;
                      })
                    }
                  >
                    {state.isMuted ? <VolumeX size={15} color="grey" /> : <Volume2 size={15} color="grey" />}
                  </TouchableOpacity>
                </View>
              )}
              {state.isMediaLoaded &&
                item.tag_name === "spoiler" &&
                !state.spoilerRevealed &&
                !state.isLocked && (
                  <BlurView
                    intensity={50}
                    tint="dark"
                    style={styles.absoluteFill}
                  >
                    <TouchableOpacity
                      onPress={handleSpoilerReveal}
                      style={spoilerButtonStyles.button}
                    >
                      <Eye color={spoilerButtonColors.icon} size={20} strokeWidth={2} />
                      <Text style={[spoilerButtonStyles.text, { marginLeft: wp(2) }]}>View Spoiler</Text>
                    </TouchableOpacity>
                  </BlurView>
                )}
            </View>
          )}
          {!state.isLocked && (
          <VStack style={{ paddingTop: hp(2) }}>
            <HStack style={[styles.actionsRow, { flexDirection: "row" }]} space={24}>
              <TouchableOpacity
                onPress={() => (isLiked ? removeLike(item.id) : addLike(item.id))}
              >
                <HStack>
                  <ThumbsUp
                    color="#ff4500"
                    size={20}
                    strokeWidth={1}
                    fill={isLiked ? "#ff4500" : "transparent"}
                  />
                  <Text style={styles.actionText}>
                    {item.Like ? item.Like.length : 0}
                  </Text>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push({ pathname: "/comments", params: { id: item.id } })
                }
              >
                <HStack>
                  <MessageCircle
                    color="#ff4500"
                    size={20}
                    strokeWidth={2}
                  />
                  <Text style={styles.actionText}>
                    {item.Comment ? (Array.isArray(item.Comment) ? item.Comment.length : 0) : 0}
                  </Text>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleShare(item)}>
                <Share2 color="white" size={20} strokeWidth={1} />
              </TouchableOpacity>
              {user?.id === item.user_id && (
                <TouchableOpacity
                  onPress={() => setShowDeleteModal(item.id)}
                >
                  <Trash2 color="#ff4500" size={20} strokeWidth={1} />
                </TouchableOpacity>
              )}
            </HStack>
          </VStack>
          )}
        </VStack>
      );

      const header = (
        <HStack style={styles.header} space="lg">
          <Avatar style={[styles.avatar, { backgroundColor: "white" }]} size="md">
            {item.User?.avatar ? (
              <AvatarImage source={{ uri: item.User.avatar }} />
            ) : (
              <AvatarFallbackText size={17} style={{ color: "black", fontWeight: "700" }}>
                {item.User?.username?.charAt(0) || ""}
              </AvatarFallbackText>
            )}
          </Avatar>
          <VStack style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => router.push({ pathname: "/user", params: { userid: item?.user_id } })}>
              <Text style={styles.username}>{item.User?.username || ""}</Text>
            </TouchableOpacity>
            <Text style={styles.timeText}>
              {state.isLocked
                ? `Unlocks in ${state.timeLeft}`
                : item.created_at &&
                  formatDistanceToNowStrict(new Date(item.created_at)) + " ago"}
            </Text>
          </VStack>
        </HStack>
      );

      const lockedContent = (
        <VStack style={styles.lockedContent}>
          <BlurView intensity={50} tint="dark" style={styles.blurContainer}>
            <VStack style={styles.blurInner}>
              <Timer color="white" size={28} />
              <Text style={styles.blurTitle}>This post is a time capsule</Text>
              <Text style={styles.blurSubtext}>
                {item.User?.username} has set this to unlock later
              </Text>
              <HStack style={styles.timeLeftRow}>
                <Timer color="#FF4500" size={20} />
                <Text style={{ color: "white", fontWeight: "700", fontSize: 15 }}>
                  {state.timeLeft} left
                </Text>
              </HStack>
            </VStack>
          </BlurView>
        </VStack>
      );

      return (
        <Card style={styles.card}>
          {header}
          {state.isLocked ? lockedContent : content}
        </Card>
      );
    },
    [getPostState, posts, user?.id, playVideo, releaseVideo]
  );

  if (isLoading) return <Spinner color="white" size={24} />;

  return (
    <>
      <FlatList
        data={posts ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderCapsulePost}
        contentContainerStyle={styles.container}
        ListEmptyComponent={
          <Text style={styles.noPostsText}>No time capsules yet.</Text>
        }
      />
      <Modal
        visible={!!showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(null)}
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
                  onPress={() => setShowDeleteModal(null)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => confirmDeletePost(showDeleteModal!)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>
      </Modal>
    </>
  );
}
// import React, { useState, useEffect, useCallback } from "react";
// import { FlatList, StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
// import { supabase, getFileUrl } from "@/lib/supabase";
// import { useQuery } from "@tanstack/react-query";
// import { HStack } from "@/components/ui/hstack";
// import { VStack } from "@/components/ui/vstack";
// import { Card } from "@/components/ui/card";
// import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
// import { BlurView } from "expo-blur";
// import { Timer, EyeOff } from "lucide-react-native";
// import { formatDistanceToNowStrict } from "date-fns";
// import { rendertext } from "@/screens/post/input";
// import Audio from "@/screens/post/audio";
// import { Video } from "expo-av";
// import ImageViewing from "react-native-image-viewing";
// import { Spinner } from "../ui/spinner";

// interface CapsuleViewProps {
//   userId: string;
// }

// export default function CapsuleView({ userId }: CapsuleViewProps) {
//   const { data: posts, isLoading } = useQuery({
//     queryKey: ["capsulePosts", userId],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("Post")
//         .select("*, User(username, avatar)")
//         .eq("status", "time_capsule")
//         .eq("user_id", userId) // Filter by userId
//         .order("created_at", { ascending: false });
//       if (error) throw error;
//       return data;
//     },
//   });

//   // State to manage all posts' lock status, time left, image visibility, spoiler status, and media loading
//   const [postStates, setPostStates] = useState(() => new Map());

//   // Helper to get or initialize state for a specific post
//   const getPostState = useCallback(
//     (postId) => {
//       if (!postStates.has(postId)) {
//         postStates.set(postId, {
//           isLocked: false,
//           timeLeft: "",
//           isImageVisible: false,
//           spoilerRevealed: false,
//           isMediaLoaded: false,
//         });
//       }
//       return postStates.get(postId);
//     },
//     [postStates]
//   );

//   // Effect to check lock status for all posts
//   useEffect(() => {
//     const intervals = new Map();
//     posts?.forEach((post) => {
//       if (post.unlock_at) {
//         const unlock = new Date(post.unlock_at);
//         const now = new Date();
//         if (unlock > now) {
//           const interval = setInterval(() => {
//             const currentTime = new Date();
//             if (unlock > currentTime) {
//               setPostStates((prev) => {
//                 const newStates = new Map(prev);
//                 const state = newStates.get(post.id) || {
//                   isLocked: true,
//                   timeLeft: "",
//                   isImageVisible: false,
//                   spoilerRevealed: false,
//                   isMediaLoaded: false,
//                 };
//                 state.isLocked = true;
//                 state.timeLeft = formatDistanceToNowStrict(unlock);
//                 newStates.set(post.id, state);
//                 return newStates;
//               });
//             } else {
//               setPostStates((prev) => {
//                 const newStates = new Map(prev);
//                 const state = newStates.get(post.id) || {
//                   isLocked: false,
//                   timeLeft: "",
//                   isImageVisible: false,
//                   spoilerRevealed: false,
//                   isMediaLoaded: false,
//                 };
//                 state.isLocked = false;
//                 state.timeLeft = "";
//                 newStates.set(post.id, state);
//                 return newStates;
//               });
//               clearInterval(interval);
//             }
//           }, 1000);
//           intervals.set(post.id, interval);
//         }
//       }
//     });

//     return () => {
//       intervals.forEach((interval) => clearInterval(interval));
//     };
//   }, [posts]);

//   const renderCapsulePost = useCallback(
//     ({ item }) => {
//       const state = getPostState(item.id);

//       const handleSpoilerReveal = () => {
//         setPostStates((prev) => {
//           const newStates = new Map(prev);
//           const currentState = newStates.get(item.id) || {};
//           currentState.spoilerRevealed = true;
//           newStates.set(item.id, currentState);
//           return newStates;
//         });
//       };

//       const handleImagePress = () => {
//         setPostStates((prev) => {
//           const newStates = new Map(prev);
//           const currentState = newStates.get(item.id) || {};
//           currentState.isImageVisible = true;
//           newStates.set(item.id, currentState);
//           return newStates;
//         });
//       };

//       const handleCloseImage = () => {
//         setPostStates((prev) => {
//           const newStates = new Map(prev);
//           const currentState = newStates.get(item.id) || {};
//           currentState.isImageVisible = false;
//           newStates.set(item.id, currentState);
//           return newStates;
//         });
//       };

//       const handleMediaLoad = () => {
//         setPostStates((prev) => {
//           const newStates = new Map(prev);
//           const currentState = newStates.get(item.id) || {};
//           currentState.isMediaLoaded = true;
//           newStates.set(item.id, currentState);
//           return newStates;
//         });
//       };

//       const content = (
//         <VStack style={{ marginLeft: 60, marginBottom: 20 }}>
//           {rendertext(item.text?.match(/([#@]\w+)|([^#@]+)/g) || [])}
//           {item.file && item.file.match(/\.(mp3|m4a)$/i) && (
//             <Audio
//               userId={item.user_id}
//               id={item.id}
//               uri={`getFileUrl(item.user_id, item.file)`}
//             />
//           )}
//           {item.file && String(item.file).match(/\.(jpeg|jpg|png|gif)$/i) && (
//             <View style={{ position: "relative" }}>
//               {!state.isMediaLoaded && (
//                 <View style={[styles.imagePlaceholder, { height: hp(18.5), width: wp(50) }]}>
//                   <Spinner color="white" size={24} />
//                 </View>
//               )}
//               <Image
//                 source={{
//                   uri: `getFileUrl(item.user_id, item.file)`,
//                 }}
//                 style={[
//                   { height: 150, width: 200, marginTop: 5, borderRadius: 10 },
//                   !state.isMediaLoaded && { opacity: 0 },
//                 ]}
//                 resizeMode="cover"
//                 onLoad={handleMediaLoad}
//               />
//               {state.isMediaLoaded && item.tag_name === "spoiler" && !state.spoilerRevealed && !state.isLocked && (
//                 <BlurView intensity={50} tint="dark" style={styles.absoluteFill}>
//                   <TouchableOpacity onPress={handleSpoilerReveal} style={styles.viewSpoilerButton}>
//                     <EyeOff color="white" size={24} />
//                     <Text style={styles.viewSpoilerText}>View Spoiler</Text>
//                   </TouchableOpacity>
//                 </BlurView>
//               )}
//               <ImageViewing
//                 images={[
//                   {
//                     uri: `getFileUrl(item.user_id, item.file)`,
//                   },
//                 ]}
//                 imageIndex={0}
//                 visible={state.isImageVisible}
//                 onRequestClose={handleCloseImage}
//               />
//             </View>
//           )}
//           {item.file && String(item.file).match(/\.(mp4|mov|avi|mkv)$/i) && (
//             <View style={{ position: "relative" }}>
//               {!state.isMediaLoaded && (
//                 <View style={[styles.imagePlaceholder, { height: 300, width: 200 }]}>
//                   <Spinner color="white" size={24} />
//                 </View>
//               )}
//               <Video
//                 source={{
//                   uri: `getFileUrl(item.user_id, item.file)`,
//                 }}
//                 style={[
//                   { height: 300, width: 200, marginTop: 5, borderRadius: 10 },
//                   !state.isMediaLoaded && { opacity: 0 },
//                 ]}
//                 useNativeControls
//                 resizeMode="cover"
//                 onLoad={() => handleMediaLoad()}
//               />
//               {state.isMediaLoaded && item.tag_name === "spoiler" && !state.spoilerRevealed && !state.isLocked && (
//                 <BlurView intensity={50} tint="dark" style={styles.absoluteFill}>
//                   <TouchableOpacity onPress={handleSpoilerReveal} style={styles.viewSpoilerButton}>
//                     <EyeOff color="white" size={24} />
//                     <Text style={styles.viewSpoilerText}>View Spoiler</Text>
//                   </TouchableOpacity>
//                 </BlurView>
//               )}
//             </View>
//           )}
//         </VStack>
//       );

//       return (
//         <Card
//           style={{
//             backgroundColor: "#010118",
//             borderWidth: 1,
//             borderColor: "rgba(255,255,255,0.1)",
//             borderRadius: 10,
//           }}
//         >
//           <HStack style={{ alignItems: "center" }} space="lg">
//             <Avatar style={{ backgroundColor: "white" }} size="md">
//               {item.User?.avatar ? (
//                 <AvatarImage source={{ uri: item.User.avatar }} />
//               ) : (
//                 <AvatarFallbackText style={{ color: "black", fontWeight: "700" }}>
//                   {item.User?.username?.charAt(0) || ""}
//                 </AvatarFallbackText>
//               )}
//             </Avatar>
//             <VStack style={{ flex: 1 }}>
//               <HStack className="items-center" space="lg">
//                 <Text style={{ fontWeight: "bold", color: "white", fontSize: 17 }}>
//                   {item.User?.username || ""}
//                 </Text>
//                 <Text style={{ color: "white", fontSize: hp(1.5) }}>
//                   {item.created_at && formatDistanceToNowStrict(new Date(item.created_at)) + " ago"}
//                 </Text>
//               </HStack>
//             </VStack>
//           </HStack>
//           <View>
//             {content}
//             {state.isLocked && state.isMediaLoaded && (
//               <BlurView intensity={50} tint="dark" style={styles.blurOverlay}>
//                 <VStack style={styles.blurContent}>
//                   <Text style={styles.blurText}>{item.User?.username}</Text>
//                   <Text style={styles.blurText}>has set this post as a time capsule.</Text>
//                   <HStack space="sm">
//                     <Timer color="white" size={18} />
//                     <Text style={styles.blurText}>{state.timeLeft} left.</Text>
//                   </HStack>
//                 </VStack>
//               </BlurView>
//             )}
//           </View>
//         </Card>
//       );
//     },
//     [getPostState, posts]
//   );

//   if (isLoading) return <Spinner color="white" size={24} />;

//   return (
//     <FlatList
//       data={posts}
//       keyExtractor={(item) => item.id}
//       renderItem={renderCapsulePost}
//       contentContainerStyle={styles.container}
//       ListEmptyComponent={<Text style={styles.noPostsText}>No time capsules yet.</Text>}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//     backgroundColor: "#010118",
//   },
//   absoluteFill: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   blurOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#010118",
//   },
//   blurContent: {
//     padding: 10,
//     backgroundColor: "#FF4500",
//     borderWidth: 2,
//     borderColor: "white",
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   blurText: {
//     color: "white",
//     fontSize: 10,
//     fontWeight: "800",
//     fontStyle: "italic",
//   },
//   viewSpoilerButton: {
//     padding: 8,
//     backgroundColor: "#FF4500",
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   viewSpoilerText: {
//     color: "white",
//     fontWeight: "900",
//     fontSize: 11,
//   },
//   imagePlaceholder: {
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#010118",
//     borderRadius: 10,
//     marginTop: 5,
//   },
//   noPostsText: {
//     color: "white",
//     textAlign: "center",
//     marginTop: '60%',
//     justifyContent:'center',
//     alignContent:'center',
//     fontSize: 16,
//   },
// });
