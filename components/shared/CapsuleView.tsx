import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Share,
} from "react-native";
import { supabase, getFileUrl } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { BlurView } from "expo-blur";
import { Timer, EyeOff, ThumbsUp, MessageCircle, Send, Trash2 } from "lucide-react-native";
import { formatDistanceToNowStrict } from "date-fns";
import { rendertext } from "@/screens/post/input";
import Audio from "@/screens/post/audio";
import { Video } from "expo-av";
import ImageViewing from "react-native-image-viewing";
import { Spinner } from "../ui/spinner";
import * as Haptics from "expo-haptics";
import { useAuth } from "@/providers/AuthProviders";
import { router } from "expo-router";

interface CapsuleViewProps {
  userId: string;
}

export default function CapsuleView({ userId }: CapsuleViewProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["capsulePosts", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Post")
        .select("*, User(username, avatar), Like(user_id)")
        .eq("status", "time_capsule")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const [postStates, setPostStates] = useState(() => new Map());
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const getPostState = useCallback(
    (postId) => {
      if (!postStates.has(postId)) {
        postStates.set(postId, {
          isLocked: false,
          timeLeft: "",
          isImageVisible: false,
          spoilerRevealed: false,
          isMediaLoaded: false,
        });
      }
      return postStates.get(postId);
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
      const fileUrl = `getFileUrl(item.user_id, item.file)`;
      shareMessage += `\n\nView media: ${fileUrl}`;
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
      const state = getPostState(item.id);
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

      const content = (
        <VStack style={{ marginLeft: 60, marginBottom: 20 }}>
          {rendertext(item.text?.match(/([#@]\w+)|([^#@]+)/g) || [])}
          {item.file && item.file.match(/\.(mp3|m4a)$/i) && (
            <View style={{ marginTop: 3 }}>
              <Audio
                userId={item.user_id}
                id={item.id}
                uri={`getFileUrl(item.user_id, item.file)`}
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
                      style={styles.viewSpoilerButton}
                    >
                      <EyeOff color="white" size={24} />
                      <Text style={styles.viewSpoilerText}>Spoiler</Text>
                    </TouchableOpacity>
                  </BlurView>
                )}
            </View>
          )}
          {item.file && item.file.match(/\.(jpeg|jpg|png|gif)$/i) && (
            <View style={{ position: "relative" }}>
              {!state.isMediaLoaded && (
                <View
                  style={[styles.imagePlaceholder, { height: 150, width: 200 }]}
                >
                  <Spinner color="white" size={24} />
                </View>
              )}
              <Image
                source={{
                  uri: `getFileUrl(item.user_id, item.file)`,
                }}
                style={[
                  {
                    height: 150,
                    width: 200,
                    marginTop: 5,
                    borderRadius: 10,
                  },
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
                      style={styles.viewSpoilerButton}
                    >
                      <EyeOff color="white" size={24} />
                      <Text style={styles.viewSpoilerText}>View Spoiler</Text>
                    </TouchableOpacity>
                  </BlurView>
                )}
              <ImageViewing
                images={[
                  {
                    uri: `getFileUrl(item.user_id, item.file)`,
                  },
                ]}
                imageIndex={0}
                visible={state.isImageVisible}
                onRequestClose={handleCloseImage}
              />
            </View>
          )}
          {item.file && item.file.match(/\.(mp4|mov|avi|mkv)$/i) && (
            <View style={{ position: "relative" }}>
              {!state.isMediaLoaded && (
                <View
                  style={[styles.imagePlaceholder, { height: 300, width: 200 }]}
                >
                  <Spinner color="white" size={24} />
                </View>
              )}
              <Video
                source={{
                  uri: `getFileUrl(item.user_id, item.file)`,
                }}
                style={[
                  {
                    height: 300,
                    width: 200,
                    marginTop: 5,
                    borderRadius: 10,
                  },
                  !state.isMediaLoaded && { opacity: 0 },
                ]}
                useNativeControls
                resizeMode="cover"
                onLoad={() => handleMediaLoad()}
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
                      style={styles.viewSpoilerButton}
                    >
                      <EyeOff color="white" size={24} />
                      <Text style={styles.viewSpoilerText}>View Spoiler</Text>
                    </TouchableOpacity>
                  </BlurView>
                )}
            </View>
          )}
          <VStack style={{ paddingTop: 16 }}>
            <HStack style={{ alignItems: "center", gap: 8 }} space={24}>
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
                  <Text style={{ color: "white", marginLeft: 4 }}>
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
                  <Text style={{ color: "white", marginLeft: 4 }}>
                    {item.Comment ? item.Comment.length : 0}
                  </Text>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleShare(item)}>
                <Send color="white" size={20} strokeWidth={1} />
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
        </VStack>
      );

      return (
        <Card
          style={{
            backgroundColor: "#010118",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.1)",
            borderRadius: 10,
          }}
        >
          <HStack style={{ alignItems: "center" }} space="lg">
            <Avatar style={{ backgroundColor: "white" }} size="md">
              {item.User?.avatar ? (
                <AvatarImage source={{ uri: item.User.avatar }} />
              ) : (
                <AvatarFallbackText
                  style={{ color: "black", fontWeight: "700" }}
                >
                  {item.User?.username?.charAt(0) || ""}
                </AvatarFallbackText>
              )}
            </Avatar>
            <VStack style={{ flex: 1 }}>
              <HStack className="items-center" space="lg">
                <Text
                  style={{ fontWeight: "bold", color: "white", fontSize: 17 }}
                >
                  {item.User?.username || ""}
                </Text>
                <Text style={{ color: "white", fontSize: 12 }}>
                  {item.created_at &&
                    formatDistanceToNowStrict(new Date(item.created_at)) +
                      " ago"}
                </Text>
              </HStack>
            </VStack>
          </HStack>
          <View>
            {content}
            {state.isLocked && state.isMediaLoaded && (
              <BlurView intensity={50} tint="dark" style={styles.blurOverlay}>
                <VStack style={styles.blurContent}>
                  <Text style={styles.blurText}>{item.User?.username}</Text>
                  <Text style={styles.blurText}>
                    has set this post as a time capsule.
                  </Text>
                  <HStack space="sm">
                    <Timer color="white" size={18} />
                    <Text style={styles.blurText}>{state.timeLeft} left.</Text>
                  </HStack>
                </VStack>
              </BlurView>
            )}
          </View>
        </Card>
      );
    },
    [getPostState, posts, user?.id]
  );

  if (isLoading) return <Spinner color="white" size={24} />;

  return (
    <>
      <FlatList
        data={posts}
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

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#010118",
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#010118",
  },
  blurContent: {
    padding: 10,
    backgroundColor: "#FF4500",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  blurText: {
    color: "white",
    fontSize: 10,
    fontWeight: "800",
    fontStyle: "italic",
  },
  viewSpoilerButton: {
    padding: 8,
    backgroundColor: "#FF4500",
    borderRadius: 5,
    alignItems: "center",
  },
  viewSpoilerText: {
    color: "white",
    fontWeight: "900",
    fontSize: 11,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#010118",
    borderRadius: 10,
    marginTop: 5,
  },
  audiospoiler: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#010118",
  },
  noPostsText: {
    color: "white",
    textAlign: "center",
    marginTop: "60%",
    justifyContent: "center",
    alignContent: "center",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBlur: {
    width: "90%",
    padding: 20,
    borderRadius: 20,
  },
  modalContainer: {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    color: "#FF4500",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#444",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
  },
  deleteButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#FF4500",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
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
//           {item.file && item.file.match(/\.(jpeg|jpg|png|gif)$/i) && (
//             <View style={{ position: "relative" }}>
//               {!state.isMediaLoaded && (
//                 <View style={[styles.imagePlaceholder, { height: 150, width: 200 }]}>
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
//           {item.file && item.file.match(/\.(mp4|mov|avi|mkv)$/i) && (
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
//                 <Text style={{ color: "white", fontSize: 12 }}>
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
