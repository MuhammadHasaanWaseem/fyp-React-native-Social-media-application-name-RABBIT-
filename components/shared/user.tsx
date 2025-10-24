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
import PrivatePostView from "@/components/shared/PrivatePostView";
import CapsuleView from "@/components/shared/CapsuleView";
import {
  Avatar,
  AvatarImage,
  AvatarFallbackText,
  AvatarGroup,
} from "../ui/avatar";
import { Button, ButtonText } from "../ui/button";
import { Divider } from "../ui/divider";
import { useEffect, useState } from "react";
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
import { Spinner } from "../ui/spinner";

enum Tab {
  PUBLIC = "Public",
  PRIVATE = "Private",
  CAPSULE = "Capsule",
}

const tabs = [
  { name: Tab.PUBLIC, key: "user_id" },
  { name: Tab.PRIVATE, key: "user_id" },
  { name: Tab.CAPSULE, key: "user_id" },
];

export default ({ user }: { user: User }) => {
useEffect(() => {
  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from("User")
      .select("username, nickname, bio")
      .eq("id", user?.id) // assuming you have the user id

    if (error) {
      Alert.alert("Error fetching user data ", error.message);
    } else if (data && data.length > 0) {
      const userData = data[0];
      setlocalnickname(userData.nickname);
      setlocalbio(userData.bio);
      // setLocalAvatar(userData.avatar); // if you want avatar too
    }
  };

  if (user?.id) {
    fetchUserData();
  }
}, [user?.id]);

  const [tab, setTab] = useState<typeof tabs[number]>(tabs[0]);
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [localnickname, setlocalnickname] = useState<string>(user?.nickname || '');
  const [localbio, setlocalbio] = useState<string>(user?.bio || '');
  const { data, refetch, isLoading } = usePosts({
    key: "user_id",
    value: user?.id,
    type: "eq",
  });
  const [isImageVisible, setImageVisible] = useState(false);
  const [editSheet, setEditSheet] = useState(false);
  const handleClose = () => setEditSheet(false);
  const [localAvatar, setLocalAvatar] = useState<string>(user?.avatar || "");
  const { data: followers } = usefollowers(user?.id);
  const { user: userauth } = useAuth();
  const [loader, setloader] = useState(false)
  const { data: followingData, refetch: refetchFollowing } = usefollowing(
    userauth?.id
  );
  const isOwner = userauth?.id === user?.id;
  const isFollowing = followingData?.includes(user?.id);

  const isFollower = followers?.some((f: any) => f.user.id === userauth?.id);
  const followButtonText = isFollowing
    ? "Unfollow"
    : isFollower
      ? "Follow Back"
      : "Follow";

  // Filter posts based on the current tab
  const filteredPosts = data?.filter((item) => {
    if (tab.name === Tab.PUBLIC) return item.Availablity !== "private";
    if (tab.name === Tab.PRIVATE) return item.Availablity === "private";
    return false;
  }) || [];

  const functionloader = () => {
    if (!loader)
      setTimeout(() => {
        setloader(true)
        return <Spinner color={'white'} />
      }, 3000);
    else if (loader)
      setTimeout(() => {
        setloader(false)
      }, 3000);
  }
  const followUser = async () => {
    try {
      const { error } = await supabase
        .from("Followers")
        .insert({ user_id: userauth?.id, following_user_id: user?.id });
      if (error) Alert.alert("Error", "Could not follow user.");
      else refetchFollowing();
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred while following the user.");
    }
  };

  const unfollowUser = async () => {
    try {
      const { error } = await supabase
        .from("Followers")
        .delete()
        .eq("user_id", userauth?.id)
        .eq("following_user_id", user?.id);
      if (error) Alert.alert("Error", "Could not unfollow user.");
      else refetchFollowing();
    } catch (err) {
      Alert.alert(
        "Error",
        "An unexpected error occurred while unfollowing the user."
      );
    }
  };

  const handleAvatarPress = async () => {
    setImageVisible(true);
  };

  const handleBio = async (newBio: string, userId: string) => {
    try {
      const { error } = await supabase
        .from("User")
        .update({ bio: newBio })
        .eq("id", userId);
      if (error) Alert.alert("Error", error.message);
      else {
        setlocalbio(newBio)
        Alert.alert("Success", "Bio updated successfully!");
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred while updating the bio.");
    }
  };

  const handleNickname = async (newNickname: string, userId: string) => {
    try {
      const { error } = await supabase
        .from("User")
        .update({ nickname: newNickname })
        .eq("id", userId);
      if (error) Alert.alert("Error", error.message);
      else {
        setlocalnickname(newNickname)
        Alert.alert("Success", "Nickname updated successfully!");
      }
    } catch (err) {
      Alert.alert(
        "Error",
        "An unexpected error occurred while updating the nickname."
      );
    }
  };

  const [showBioModal, setShowBioModal] = useState(false);
  const [bioInput, setBioInput] = useState(user?.bio || "");
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(user?.nickname || "");

  const openBioPrompt = () => {
    if (Platform.OS === "ios") {
      Alert.prompt(
        "Edit Bio",
        "Enter your new bio:",
        (newBio) => {
          if (newBio !== undefined) handleBio(newBio, user.id);
        },
        "plain-text",
        user?.bio || ""
      );
    } else {
      setBioInput(user?.bio || "");
      setShowBioModal(true);
    }
  };

  const openNicknamePrompt = () => {
    if (Platform.OS === "ios") {
      Alert.prompt(
        "Edit Nickname",
        "Enter your new nickname:",
        (newNickname) => {
          if (newNickname !== undefined) handleNickname(newNickname, user.id);
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
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Permission to access media library is required!");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.2,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const uri = asset.uri;
        const mimeType = asset.mimeType || "image/jpeg";
        const extension = mimeType.split("/")[1];
        const name = `avatar.${extension}`;
        const filePath = `${user.id}/${name}`;
        const { error: uploadError } = await supabase.storage
          .from("files")
          .upload(filePath, { uri, name, type: mimeType }, { cacheControl: "3600", upsert: true });
        if (uploadError) {
          Alert.alert("Error", `Error uploading avatar: ${uploadError.message}`);
          return;
        }
        const { data: urlData, error: urlError } = supabase.storage
          .from("files")
          .getPublicUrl(filePath);
        if (urlError) {
          Alert.alert("Error", `Error getting public URL: ${urlError.message}`);
          return;
        }
        const publicUrl = urlData.publicUrl;
        const avatarUrlWithCacheBuster = `${publicUrl}?t=${Date.now()}`;
        const { error: updateError } = await supabase
          .from("User")
          .update({ avatar: avatarUrlWithCacheBuster })
          .eq("id", user.id);
        if (updateError)
          Alert.alert("Error", `Error updating avatar: ${updateError.message}`);
        else {
          setLocalAvatar(avatarUrlWithCacheBuster);
          Alert.alert("Success", "Avatar updated successfully!");
        }
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred while updating the avatar.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#010118" }}>
      <Text></Text>
      <Text></Text>
      <HStack className="items-center justify-between p-6">
        <VStack>
          <Text style={{ fontSize: 24, marginLeft: 8, fontWeight: "bold", color: "white" }}>
            {user?.username}
          </Text>
          <HStack className="items-center" style={{ marginTop: 5 }}>
            <Text style={{ color: "white", fontSize: 12, fontWeight: "900" }}>Bio: </Text>
            <Text style={{ color: "white", fontSize: 12 }}>{localbio || "Not set"}</Text>
          </HStack>
          <HStack className="items-center" style={{ marginTop: 5 }}>
            <Text style={{ color: "white", fontSize: 12, fontWeight: "900" }}>
              Nickname:{" "}
            </Text>
            <Text style={{ color: "white", fontSize: 12 }}>
              {localnickname || "Not set"}
            </Text>
          </HStack>
        </VStack>
        <Pressable onPress={handleAvatarPress}>
          <Avatar size="lg">
            <AvatarFallbackText style={{ color: "white" }}>{user?.username}</AvatarFallbackText>
            <AvatarImage source={{ uri: `${localAvatar || user?.avatar} ?t=${new Date().getTime()}` }} />
          </Avatar>
        </Pressable>
      </HStack>
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
        <Pressable
          onPress={() => router.push({ pathname: "/followsheet", params: { userid: user?.id } })}
        >
          <Text style={{ color: "grey" }}>Follower {followers?.length}</Text>
        </Pressable>
        {isOwner && (
          <Pressable
            onPress={() =>
              router.push({ pathname: "/followingsheet", params: { userid: user?.id } })
            }
          >
            <Text style={{ color: "grey" }}>Following {followingData?.length}</Text>
          </Pressable>
        )}
      </HStack>
      <SafeAreaView className="justify-start" />
      {isOwner ? (
        <HStack space="md" className="items-center justify-between p-6">
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onPress={() => setEditSheet(true)}
          >
            <ButtonText style={{ color: "white" }}>Edit Profile</ButtonText>
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onPress={() => setShowActionsheet(true)}
          >
            <ButtonText style={{ color: "white" }}>More</ButtonText>
          </Button>
        </HStack>
      ) : (
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
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onPress={() => onShareProfile(user?.username)}
          >
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
            <ButtonText style={{ color: t.name === tab.name ? "#141414" : "white" }}>
              {t.name}
            </ButtonText>
          </Button>
        ))}
      </HStack>
      <VStack style={{ flex: 1 }}>
        {tab.name === Tab.CAPSULE ? (
          <CapsuleView userId={user?.id} />
        ) : filteredPosts.length === 0 ? (
          <VStack style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: "white", fontSize: 16 }}>
              {tab.name === Tab.PUBLIC ? "No public post" : "No private post"}
            </Text>
          </VStack>
        ) : (
          <FlatList
            data={filteredPosts}
            refreshing={isLoading}
            onRefresh={refetch}
            contentContainerStyle={{ paddingBottom: 200 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              tab.name === Tab.PRIVATE ? (
                <PrivatePostView item={item} refetch={refetch} />
              ) : (
                <View item={item} refetch={refetch} />
              )
            }
          />
        )}
      </VStack>
      <BottomSheet showActionsheet={showActionsheet} setShowActionsheet={setShowActionsheet} />
      <Actionsheet isOpen={editSheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ backgroundColor: "#141414" }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem onPress={openBioPrompt}>
            <ActionsheetIcon color="white" as={EditIcon} />
            <ActionsheetItemText style={{ color: "white" }}>Update Bio</ActionsheetItemText>
          </ActionsheetItem>
          <Divider />
          <ActionsheetItem onPress={openNicknamePrompt}>
            <ActionsheetIcon color="white" as={EditIcon} />
            <ActionsheetItemText style={{ color: "white" }}>Update Nickname</ActionsheetItemText>
          </ActionsheetItem>
          <Divider />
          <ActionsheetItem onPress={handleavatarupload}>
            <ActionsheetIcon color="white" as={DownloadIcon} />
            <ActionsheetItemText style={{ color: "white" }}>
              Update Profile Picture
            </ActionsheetItemText>
          </ActionsheetItem>
          <Divider />
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetIcon color="white" as={CloseCircleIcon} />
            <ActionsheetItemText style={{ color: "white" }}>Close</ActionsheetItemText>
          </ActionsheetItem>
          <Divider />
        </ActionsheetContent>
      </Actionsheet>
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
                    functionloader;
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
                onChangeText={setNicknameInput}
              />
              <HStack style={styles.modalButtons}>
                <Button variant="outline" onPress={() => setShowNicknameModal(false)}>
                  <ButtonText style={{ color: "white" }}>Cancel</ButtonText>
                </Button>
                <Button
                  variant="outline"
                  onPress={() => {
                    handleNickname(nicknameInput, user.id);
                    functionloader;
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
  // stripe secret key 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
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
