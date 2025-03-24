import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { ArrowLeft } from "lucide-react-native";
import { FlatList, SafeAreaView, Text, TouchableOpacity, StyleSheet } from "react-native";
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
        <Text style={styles.loadingText}>Loading...</Text>
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

  const renderItem = ({ item }: { item: any }) => {
    return (
      <SafeAreaView style={styles.itemContainer}>
        <HStack style={styles.itemRow} space="md">
          <HStack style={styles.userInfo} space="md">
            <Avatar size="lg">
              <AvatarFallbackText style={styles.avatarFallback}>
                {item?.user?.username ? item.user.username.charAt(0).toUpperCase() : "?"}
              </AvatarFallbackText>
              <AvatarImage source={{ uri: item.user?.avatar }} />
            </Avatar>
            <VStack>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/user",
                    params: { userid: item?.user?.id },
                  })
                }
              >
                <Text style={styles.usernameText}>
                  {item?.user?.username || "Unknown User"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.subText}>Started following</Text>
            </VStack>
          </HStack>
          {isOwner ? (
            // For your own followers, show a "Remove" button that triggers a confirmation dialog.
            <Button
              onPress={() => {
                setSelectedFollowerId(item.user.id);
                setShowAlertDialog(true);
              }}
              variant="outline"
              style={styles.button}
            >
              <ButtonText style={styles.buttonTextOutline}>Remove</ButtonText>
            </Button>
          ) : (
            // For non-owner view, show follow/unfollow buttons.
            authUser?.id !== item.user.id &&
            (followingData?.includes(item.user.id) ? (
              <Button
                onPress={() => unfollowUser(item.user.id)}
                variant="outline"
                style={styles.button}
              >
                <ButtonText style={styles.buttonTextOutline}>Unfollow</ButtonText>
              </Button>
            ) : (
              <Button onPress={() => followUser(item.user.id)} style={styles.button}>
                <ButtonText style={styles.buttonText}>Follow</ButtonText>
              </Button>
            ))
          )}
        </HStack>
        <Divider style={styles.itemDivider} />
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HStack style={styles.header} space="md">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={"white"} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {isOwner ? "Your Followers" : "Followers"}
        </Text>
      </HStack>
      <Divider style={styles.divider} />
      <FlatList
        data={followers}
        keyExtractor={(item) => item.user.id}
        renderItem={renderItem}
        refreshing={!!isLoading}
        onRefresh={refetchFollowers}
        contentContainerStyle={styles.listContent}
      />

      {/* Confirmation Dialog for Removing a Follower */}
      <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Confirmation
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm">
              Are you sure you want to remove this follower?
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button variant="outline" action="secondary" onPress={handleClose} size="sm">
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              size="sm"
              onPress={async () => {
                if (selectedFollowerId) {
                  await removeFollower(selectedFollowerId);
                }
                handleClose();
              }}
            >
              <ButtonText>Delete</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0A0A0A",
    flex: 1,
  },
  centered: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  header: {
    marginTop: 10,
    padding: 12,
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
    marginLeft: 10,
  },
  divider: {
    marginBottom: 10,
  },
  listContent: {
    gap: 9,
    padding: 7,
    margin: 3,
  },
  itemContainer: {
    marginVertical: 5,
    paddingHorizontal: 8,
  },
  itemRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarFallback: {
    color: "white",
  },
  usernameText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  subText: {
    color: "white",
    fontSize: 10,
  },
  button: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  buttonText: {
    color: "#141414",
    fontWeight: "900",
  },
  buttonTextOutline: {
    color: "white",
    fontWeight: "900",
  },
  itemDivider: {
    borderWidth: 1,
    borderColor: "grey",
    marginTop: 5,
  },
});
