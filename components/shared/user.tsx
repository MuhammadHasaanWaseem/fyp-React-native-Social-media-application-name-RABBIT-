import { User } from "@/lib/type";
import {
  Text,
  Pressable,
  Alert,
  FlatList,
  SafeAreaView,
  Platform,
  Modal,
  TextInput,
  View as RNView,
  StyleSheet,
} from "react-native";
import { HStack } from "../ui/hstack";
import { Avatar, AvatarImage, AvatarFallbackText, AvatarGroup } from "../ui/avatar";
import { Button, ButtonText } from "../ui/button";
import { Divider } from "../ui/divider";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { VStack } from "../ui/vstack";
import { supabase } from "@/lib/supabase";
import View from "@/components/shared/sharedview";
import { usePosts } from "@/hooks/use-posts";
import BottomSheet from "./bottom-sheet";
import { useAuth } from "@/providers/AuthProviders";
import { usefollowers } from "@/hooks/use-followers";
import ImageViewing from "react-native-image-viewing";
import { usefollowing } from "@/hooks/use-following";
import { router } from "expo-router";
import { onShareProfile } from "@/lib/shareprofile";
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
  ActionsheetIcon,
} from "@/components/ui/actionsheet";
import { CloseCircleIcon, DownloadIcon, EditIcon } from "@/components/ui/icon";

enum Tab {
  PUBLIC = "Public",
  PRIVATE = "Private",
  CAPSULE = "Capsule",
}

const tabs = [
  { name: Tab.PUBLIC, key: "user_id" },
  { name: Tab.PRIVATE, key: "private_id" },
  { name: Tab.CAPSULE, key: "capsule_id" },
];

export default ({ user }: { user: User }) => {
  const [tab, setTab] = useState<typeof tabs[number]>(tabs[0]);
  const [showActionsheet, setShowActionsheet] = useState(false);
  const { data, refetch, isLoading } = usePosts({ key: tab.key, value: user?.id, type: "eq" });
  const [isImageVisible, setImageVisible] = useState(false);
  // For editing profile sheet (e.g., adding bio, nickname, upload profile picture)
  const [editSheet, setEditSheet] = useState(false);
  const handleClose = () => setEditSheet(false);
  const [localAvatar, setLocalAvatar] = useState<string>(user?.avatar || "");
  const { data: followers } = usefollowers(user?.id);
  const { user: userauth } = useAuth();
  const { data: followingData, refetch: refetchFollowing } = usefollowing(userauth?.id);
  const isOwner = userauth?.id === user?.id;
  const isFollowing = followingData?.includes(user?.id);

  // Check if the profile user is following you (i.e. you are in the profile's followers list)
  const isFollower = followers?.some((f: any) => f.user.id === userauth?.id);

  const followButtonText = isFollowing ? "Unfollow" : isFollower ? "Follow Back" : "Follow";

  // Follow the profile user (by inserting a row in the Followers table)
  const followUser = async () => {
    try {
      const { error } = await supabase.from("Followers").insert({
        user_id: userauth?.id,
        following_user_id: user?.id,
      });
      if (error) {
        console.error("Error following user:", error);
        Alert.alert("Error", "Could not follow user.");
      } else {
        refetchFollowing();
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "An unexpected error occurred while following the user.");
    }
  };

  // Unfollow the profile user
  const unfollowUser = async () => {
    try {
      const { error } = await supabase
        .from("Followers")
        .delete()
        .eq("user_id", userauth?.id)
        .eq("following_user_id", user?.id);
      if (error) {
        console.error("Error unfollowing user:", error);
        Alert.alert("Error", "Could not unfollow user.");
      } else {
        refetchFollowing();
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "An unexpected error occurred while unfollowing the user.");
    }
  };

  const handleAvatarPress = async () => {
    if (isOwner) {
      // If the owner taps, open the zoomable view
      setImageVisible(true);
    } else {
      // For non-owners, you can either open the zoomable view or do nothing
      setImageVisible(true);
    }
  };

  // Function to update the user's bio
  const handleBio = async (newBio: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from("User")
        .update({ bio: newBio })
        .eq("id", userId);
      if (error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Success", "Bio updated successfully!");
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred while updating the bio.");
    }
  };

  // Function to update the user's nickname
  const handleNickname = async (newNickname: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from("User")
        .update({ nickname: newNickname })
        .eq("id", userId);
      if (error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Success", "Nickname updated successfully!");
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred while updating the nickname.");
    }
  };

  // State for Android prompt modals
  const [showBioModal, setShowBioModal] = useState(false);
  const [bioInput, setBioInput] = useState(user?.bio || "");
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(user?.nickname || "");

  // Open a prompt to edit bio
  const openBioPrompt = () => {
    if (Platform.OS === "ios") {
      Alert.prompt(
        "Edit Bio",
        "Enter your new bio:",
        (newBio) => {
          if (newBio !== undefined) {
            handleBio(newBio, user.id);
          }
        },
        "plain-text",
        user?.bio || ""
      );
    } else {
      setBioInput(user?.bio || "");
      setShowBioModal(true);
    }
  };

  // Open a prompt to edit nickname
  const openNicknamePrompt = () => {
    if (Platform.OS === "ios") {
      Alert.prompt(
        "Edit Nickname",
        "Enter your new nickname:",
        (newNickname) => {
          if (newNickname !== undefined) {
            handleNickname(newNickname, user.id);
          }
        },
        "plain-text",
        user?.nickname || ""
      );
    } else {
      setNicknameInput(user?.nickname || "");
      setShowNicknameModal(true);
    }
  };
  const handleavatarupload = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Permission to access media library is required!");
        return;
      }

      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.2,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const uri = asset.uri;
        const mimeType = asset.mimeType || "image/jpeg"; // Fallback to JPEG
        const extension = mimeType.split("/")[1];
        const name = `avatar.${extension}`;
        const filePath = `${user.id}/${name}`;

        // Upload the image to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("files")
          .upload(filePath, { uri, name, type: mimeType }, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError) {
          Alert.alert("Error", `Error uploading avatar: ${uploadError.message}`);
          return;
        }

        // Get the public URL for the uploaded file
        const { data: urlData, error: urlError } = supabase.storage
          .from("files")
          .getPublicUrl(filePath);

        if (urlError) {
          Alert.alert("Error", `Error getting public URL: ${urlError.message}`);
          return;
        }

        const publicUrl = urlData.publicUrl;
        // Append a unique query parameter to bust the cache
        const avatarUrlWithCacheBuster = `${publicUrl}?t=${Date.now()}`;

        // Update the avatar field in the User table
        const { data: updateData, error: updateError } = await supabase
          .from("User")
          .update({ avatar: avatarUrlWithCacheBuster })
          .eq("id", user.id);

        if (updateError) {
          Alert.alert("Error", `Error updating avatar: ${updateError.message}`);
        } else {
          // Update local state to reflect the new avatar immediately
          setLocalAvatar(avatarUrlWithCacheBuster);
          Alert.alert("Success", "Avatar updated successfully!");
        }
      }
    } catch (error) {
      console.error("Error in handleAvatarPress:", error);
      Alert.alert("Error", "An unexpected error occurred while updating the avatar.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#010118" }}>
      <Text></Text>
      <Text></Text>
      <HStack className="items-center justify-between p-6">
        <VStack>
          <Text style={{ fontSize: 24, marginLeft: 8, fontWeight: "bold", color: "white" }}>{user?.username} </Text>
          <HStack className="items-center" style={{ marginTop: 5 }}>
            <Text style={{ color: "white", fontSize: 12, fontWeight: "900" }}>Bio : </Text>
            <Text style={{ color: "white", fontSize: 12 }}> {user?.bio || "Not set"}</Text>
          </HStack>
          <HStack className="items-center" style={{ marginTop: 5 }}>
            <Text style={{ color: "white", fontSize: 12, fontWeight: "900" }}>Nickname : </Text>
            <Text style={{ color: "white", fontSize: 12 }}>{user?.nickname || "Not set"}</Text>
          </HStack>
        </VStack>
        {/* Clickable, zoomable avatar */}
        <Pressable onPress={handleAvatarPress}>
          <Avatar size="lg">
            <AvatarFallbackText style={{ color: "white" }}>
              {user?.username}
            </AvatarFallbackText>
            <AvatarImage source={{ uri: localAvatar || user?.avatar }} />
          </Avatar>
        </Pressable>
      </HStack>
      {/* Zoomable Profile Avatar Modal */}
      <ImageViewing
        images={[{ uri: localAvatar || user?.avatar }]}
        imageIndex={0}
        visible={isImageVisible}
        onRequestClose={() => setImageVisible(false)}
      />
      <HStack style={{ marginLeft: 40 }} space="md">
        {followers && (
          <AvatarGroup>
            {followers.slice(0, 3).map((item, index) => (
              <Avatar key={index} size="sm" className="border-1 border-outline-0">
                <AvatarFallbackText className="text-white">
                  {item?.user?.username}
                </AvatarFallbackText>
                <AvatarImage source={{ uri: item?.user?.avatar }} />
              </Avatar>
            ))}
            {followers.length > 3 && (
              <Avatar size="sm">
                <AvatarFallbackText>{"+ " + (followers.length - 3)}</AvatarFallbackText>
              </Avatar>
            )}
          </AvatarGroup>
        )}
        {/* Navigate to follower sheet */}
        <Pressable onPress={() => router.push({ pathname: "/followsheet", params: { userid: user?.id } })}>
          <Text style={{ color: "grey" }}>Follower {followers?.length}</Text>
        </Pressable>
        {/* Navigate to following sheet */}
        {isOwner && (
          <Pressable onPress={() => router.push({ pathname: "/followingsheet", params: { userid: user?.id } })}>
            <Text style={{ color: "grey" }}>Following {followingData?.length}</Text>
          </Pressable>
        )}
      </HStack>
      <SafeAreaView className="justify-start" />
      {isOwner ? (
        <HStack space="md" className="items-center justify-between p-6">
          <Button variant="outline" className="flex-1 rounded-xl" onPress={() => setEditSheet(true)}>
            <ButtonText style={{ color: "white" }}>Edit Profile</ButtonText>
          </Button>
          <Button variant="outline" className="flex-1 rounded-xl" onPress={() => setShowActionsheet(true)}>
            <ButtonText style={{ color: "white" }}>More</ButtonText>
          </Button>
        </HStack>
      ) : (
        // For non-owner, show the follow/unfollow toggle button along with Share Profile.
        <HStack space="md" className="items-center justify-between p-6">
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            style={{ backgroundColor: isFollowing ? "black" : "white" }}
            onPress={isFollowing ? unfollowUser : followUser}
          >
            <ButtonText style={{ color: isFollowing ? "white" : "#141414", fontWeight: "900" }}>
              {followButtonText}
            </ButtonText>
          </Button>
          <Button variant="outline" className="flex-1 rounded-xl" onPress={() => onShareProfile(user?.username)}>
            <ButtonText style={{ color: "white" }}>Share Profile</ButtonText>
          </Button>
        </HStack>
      )}
      <Divider style={{ marginTop: 14, marginBottom: 10 }} />
      <HStack space="md" style={{ padding: 4 }}>
        {tabs.map((t) => (
          <Button
            key={t.name}
            variant="outline"
            className={`flex-1 rounded-xl ${t.name === tab.name ? "bg-white " : "bg-transparent"}`}
            onPress={() => setTab(t)}
          >
            <ButtonText style={{ color: t.name === tab.name ? "#141414" : "white" }}>{t.name}</ButtonText>
          </Button>
        ))}
      </HStack>
      <VStack>
        <FlatList
          style={{ marginBottom: 150 }}
          data={data}
          refreshing={isLoading}
          onRefresh={refetch}
          contentContainerStyle={{ paddingBottom: 200 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <>
              <View item={item} refetch={refetch} />
            </>
          )}
        />
      </VStack>
      <BottomSheet showActionsheet={showActionsheet} setShowActionsheet={setShowActionsheet} />
      {/* Edit Profile Actionsheet */}
      <Actionsheet isOpen={editSheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ backgroundColor: "#141414" }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem onPress={openBioPrompt}>
            <ActionsheetIcon color="white" as={EditIcon} />
            <ActionsheetItemText style={{ color: "white" }}>Add/change Bio</ActionsheetItemText>
          </ActionsheetItem>
          <Divider />
          <ActionsheetItem onPress={openNicknamePrompt}>
            <ActionsheetIcon color="white" as={EditIcon} />
            <ActionsheetItemText style={{ color: "white" }}>Add Nickname</ActionsheetItemText>
          </ActionsheetItem>
          <Divider />
          <ActionsheetItem onPress={handleavatarupload}>
            <ActionsheetIcon color="white" as={DownloadIcon} />
            <ActionsheetItemText style={{ color: "white" }}>Upload Profile Picture</ActionsheetItemText>
          </ActionsheetItem>
          <Divider />
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetIcon color="white" as={CloseCircleIcon} />
            <ActionsheetItemText style={{ color: "white" }}>Close</ActionsheetItemText>
          </ActionsheetItem>
          <Divider />
        </ActionsheetContent>
      </Actionsheet>
      {/* Android Bio Modal */}
      {Platform.OS !== "ios" && (
        <Modal transparent visible={showBioModal} animationType="slide">
          <RNView style={styles.modalContainer}>
            <RNView style={styles.modalContent}>
              <Text style={{ color: "white", marginBottom: 10 }}>Edit Bio</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your new bio"
                placeholderTextColor="#ccc"
                value={bioInput}
                onChangeText={setBioInput}
              />
              <HStack style={styles.modalButtons}>
                <Button variant="outline" onPress={() => setShowBioModal(false)}>
                  <ButtonText style={{ color: "white" }}>Cancel</ButtonText>
                </Button>
                <Button
                  variant="outline"
                  onPress={() => {
                    handleBio(bioInput, user.id);
                    setShowBioModal(false);
                  }}
                >
                  <ButtonText style={{ color: "white" }}>Submit</ButtonText>
                </Button>
              </HStack>
            </RNView>
          </RNView>
        </Modal>
      )}
      {/* Android Nickname Modal */}
      {Platform.OS !== "ios" && (
        <Modal transparent visible={showNicknameModal} animationType="slide">
          <RNView style={styles.modalContainer}>
            <RNView style={styles.modalContent}>
              <Text style={{ color: "white", marginBottom: 10 }}>Edit Nickname</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your new nickname"
                placeholderTextColor="#ccc"
                value={nicknameInput}
                onChangeText={(text) => {
                  console.log("Nickname input:", text);
                  setNicknameInput(text);
                }}
              />
              <HStack style={styles.modalButtons}>
                <Button variant="outline" onPress={() => setShowNicknameModal(false)}>
                  <ButtonText style={{ color: "white" }}>Cancel</ButtonText>
                </Button>
                <Button
                  variant="outline"
                  onPress={() => {
                    handleNickname(nicknameInput, user.id);
                    setShowNicknameModal(false);
                  }}
                >
                  <ButtonText style={{ color: "white" }}>Submit</ButtonText>
                </Button>
              </HStack>
            </RNView>
          </RNView>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#141414",
    padding: 20,
    borderRadius: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: "white",
  },
  modalButtons: {
    justifyContent: "space-between",
  },
});
