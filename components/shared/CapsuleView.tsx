import React, { useState, useEffect, useCallback } from "react";
import { FlatList, StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { BlurView } from "expo-blur";
import { Timer, EyeOff } from "lucide-react-native";
import { formatDistanceToNowStrict } from "date-fns";
import { rendertext } from "@/screens/post/input";
import Audio from "@/screens/post/audio";
import { Video } from "expo-av";
import ImageViewing from "react-native-image-viewing";
import { Spinner } from "../ui/spinner";

interface CapsuleViewProps {
  userId: string;
}

export default function CapsuleView({ userId }: CapsuleViewProps) {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["capsulePosts", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Post")
        .select("*, User(username, avatar)")
        .eq("status", "time_capsule")
        .eq("user_id", userId) // Filter by userId
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // State to manage all posts' lock status, time left, image visibility, spoiler status, and media loading
  const [postStates, setPostStates] = useState(() => new Map());

  // Helper to get or initialize state for a specific post
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

  // Effect to check lock status for all posts
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

  const renderCapsulePost = useCallback(
    ({ item }) => {
      const state = getPostState(item.id);

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
            <Audio
              userId={item.user_id}
              id={item.id}
              uri={`https://wjfmftrlgfpvqdvasdhf.supabase.co/storage/v1/object/public/files/${item.user_id}/${item.file}`}
            />
          )}
          {item.file && item.file.match(/\.(jpeg|jpg|png|gif)$/i) && (
            <View style={{ position: "relative" }}>
              {!state.isMediaLoaded && (
                <View style={[styles.imagePlaceholder, { height: 150, width: 200 }]}>
                  <Spinner color="white" size={24} />
                </View>
              )}
              <Image
                source={{
                  uri: `https://wjfmftrlgfpvqdvasdhf.supabase.co/storage/v1/object/public/files/${item.user_id}/${item.file}`,
                }}
                style={[
                  { height: 150, width: 200, marginTop: 5, borderRadius: 10 },
                  !state.isMediaLoaded && { opacity: 0 },
                ]}
                resizeMode="cover"
                onLoad={handleMediaLoad}
              />
              {state.isMediaLoaded && item.tag_name === "spoiler" && !state.spoilerRevealed && !state.isLocked && (
                <BlurView intensity={50} tint="dark" style={styles.absoluteFill}>
                  <TouchableOpacity onPress={handleSpoilerReveal} style={styles.viewSpoilerButton}>
                    <EyeOff color="white" size={24} />
                    <Text style={styles.viewSpoilerText}>View Spoiler</Text>
                  </TouchableOpacity>
                </BlurView>
              )}
              <ImageViewing
                images={[
                  {
                    uri: `https://wjfmftrlgfpvqdvasdhf.supabase.co/storage/v1/object/public/files/${item.user_id}/${item.file}`,
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
                <View style={[styles.imagePlaceholder, { height: 300, width: 200 }]}>
                  <Spinner color="white" size={24} />
                </View>
              )}
              <Video
                source={{
                  uri: `https://wjfmftrlgfpvqdvasdhf.supabase.co/storage/v1/object/public/files/${item.user_id}/${item.file}`,
                }}
                style={[
                  { height: 300, width: 200, marginTop: 5, borderRadius: 10 },
                  !state.isMediaLoaded && { opacity: 0 },
                ]}
                useNativeControls
                resizeMode="cover"
                onLoad={() => handleMediaLoad()}
              />
              {state.isMediaLoaded && item.tag_name === "spoiler" && !state.spoilerRevealed && !state.isLocked && (
                <BlurView intensity={50} tint="dark" style={styles.absoluteFill}>
                  <TouchableOpacity onPress={handleSpoilerReveal} style={styles.viewSpoilerButton}>
                    <EyeOff color="white" size={24} />
                    <Text style={styles.viewSpoilerText}>View Spoiler</Text>
                  </TouchableOpacity>
                </BlurView>
              )}
            </View>
          )}
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
                <AvatarFallbackText style={{ color: "black", fontWeight: "700" }}>
                  {item.User?.username?.charAt(0) || ""}
                </AvatarFallbackText>
              )}
            </Avatar>
            <VStack style={{ flex: 1 }}>
              <HStack className="items-center" space="lg">
                <Text style={{ fontWeight: "bold", color: "white", fontSize: 17 }}>
                  {item.User?.username || ""}
                </Text>
                <Text style={{ color: "white", fontSize: 12 }}>
                  {item.created_at && formatDistanceToNowStrict(new Date(item.created_at)) + " ago"}
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
                  <Text style={styles.blurText}>has set this post as a time capsule.</Text>
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
    [getPostState, posts]
  );

  if (isLoading) return <Spinner color="white" size={24} />;

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={renderCapsulePost}
      contentContainerStyle={styles.container}
      ListEmptyComponent={<Text style={styles.noPostsText}>No time capsules yet.</Text>}
    />
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
  noPostsText: {
    color: "white",
    textAlign: "center",
    marginTop: '60%',
    justifyContent:'center',
    alignContent:'center',
    fontSize: 16,
  },
});