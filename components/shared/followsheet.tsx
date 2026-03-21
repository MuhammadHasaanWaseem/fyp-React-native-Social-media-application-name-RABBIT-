import { HStack } from "@/components/ui/hstack";
import { ArrowLeft } from "lucide-react-native";
import { FlatList, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { usefollowers } from "@/hooks/use-followers";
import { usefollowing } from "@/hooks/use-following";
import { useAuth } from "@/providers/AuthProviders";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { VStack } from "@/components/ui/vstack";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Heading } from "@/components/ui/heading";
import React, { useState } from "react";
import { AlertDialog, AlertDialogBackdrop, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter } from "../ui/alert-dialog";
import { Spinner } from "../ui/spinner";
import { getFileUrl } from "@/lib/supabase";
import { followSheetStyles as styles } from "./followsheet.styles";

export default function FollowersScreen() {
  // Get optional userid from route parameters.
  // If not provided, we're viewing our own followers.
  const { userid } = useLocalSearchParams<{ userid?: string }>();
  const { user: authUser } = useAuth();
  const profileUserId = userid || authUser?.id;
  const isOwner = profileUserId === authUser?.id;

  // State to control the confirmation dialog and store the selected follower to remove.
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [selectedFollowerId, setSelectedFollowerId] = useState<string | null>(null);

  const handleClose = () => {
    setShowAlertDialog(false);
    setSelectedFollowerId(null);
  };

  // Fetch followers for the profile user.
  // The usefollowers hook returns rows where each row has:
  // { user: { id, username, avatar, ... } }
  const { data: followers, refetch: refetchFollowers, isLoading, error } = usefollowers(profileUserId);

  // Also fetch your own following list (for follow/unfollow status in non-owner view).
  const { data: followingData, refetch: refetchFollowing } = usefollowing(authUser?.id);

  // Remove follower function – only used when you're viewing your own followers.
  // This deletes the row where the follower's id is in user_id and your id is in following_user_id.
  const removeFollower = async (followerId: string) => {
    const { error } = await supabase
      .from("Followers")
      .delete()
      .eq("user_id", followerId)
      .eq("following_user_id", authUser?.id);
    if (!error) {
      refetchFollowers();
      refetchFollowing();
    } else {
      console.error("Error removing follower:", error);
    }
  };

  // Follow function (for non-owner view).
  const followUser = async (targetId: string) => {
    const { error } = await supabase.from("Followers").insert({
      user_id: authUser?.id,
      following_user_id: targetId,
    });
    if (!error) {
      refetchFollowing();
      refetchFollowers();
    } else {
      console.error("Error following:", error);
    }
  };

  // Unfollow function (for non-owner view).
  const unfollowUser = async (targetId: string) => {
    const { error } = await supabase
      .from("Followers")
      .delete()
      .eq("user_id", authUser?.id)
      .eq("following_user_id", targetId);
    if (!error) {
      refetchFollowing();
      refetchFollowers();
    } else {
      console.error("Error unfollowing:", error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
      <Spinner color={'white'} size={24}/>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Error loading followers.</Text>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.itemCard}
      onPress={() => router.push({ pathname: "/user", params: { userid: item?.user?.id } })}
    >
      <HStack style={styles.userRow} space="md">
        <Avatar size="lg" style={styles.avatar}>
          <AvatarFallbackText style={{ color: "white" }}>
            {item?.user?.username ? item.user.username.charAt(0).toUpperCase() : "?"}
          </AvatarFallbackText>
          <AvatarImage source={{ uri: item.user?.avatar || getFileUrl(item?.user?.id || "", "avatar.jpeg") }} />
        </Avatar>
        <VStack style={styles.userInfo}>
          <Text style={styles.usernameText}>{item?.user?.username || "Unknown User"}</Text>
          <Text style={styles.subText}>@{(item?.user?.username || "").toLowerCase()}</Text>
        </VStack>
      </HStack>
      {isOwner ? (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            setSelectedFollowerId(item.user.id);
            setShowAlertDialog(true);
          }}
          style={styles.removeBtn}
        >
          <Text style={styles.btnTextRemove}>Remove</Text>
        </TouchableOpacity>
      ) : (
        authUser?.id !== item.user.id &&
        (followingData?.includes(item.user.id) ? (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              unfollowUser(item.user.id);
            }}
            style={styles.unfollowBtn}
          >
            <Text style={styles.btnTextOutline}>Unfollow</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              followUser(item.user.id);
            }}
            style={styles.followBtn}
          >
            <Text style={styles.btnText}>Follow</Text>
          </TouchableOpacity>
        ))
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HStack style={styles.header} space="md">
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft color="white" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Followers</Text>
      </HStack>
      <FlatList
        data={followers || []}
        keyExtractor={(item) => item.user.id}
        renderItem={renderItem}
        refreshing={!!isLoading}
        onRefresh={refetchFollowers}
        contentContainerStyle={[styles.listContent, !followers?.length && { flex: 1 }]}
        ListEmptyComponent={!isLoading ? <Text style={styles.emptyText}>No followers yet</Text> : null}
      />

      {/* Confirmation Dialog for Removing a Follower */}
      <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent style={{ backgroundColor: "#1a1a2e" }}>
          <AlertDialogHeader>
            <Heading size="md" style={{ color: "white" }}>
              Remove follower?
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm" style={{ color: "#9CA3AF" }}>
              They can follow you again later.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button variant="outline" action="secondary" onPress={handleClose} size="sm">
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              size="sm"
              onPress={async () => {
                if (selectedFollowerId) await removeFollower(selectedFollowerId);
                handleClose();
              }}
              style={{ backgroundColor: "#EF4444" }}
            >
              <ButtonText>Remove</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SafeAreaView>
  );
}
