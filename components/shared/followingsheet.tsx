import React, { useState } from "react";
import { SafeAreaView, FlatList, TouchableOpacity } from "react-native";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { ArrowLeft } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { usefollowing } from "@/hooks/use-following";
import { useAuth } from "@/providers/AuthProviders";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { useQueries } from "@tanstack/react-query";
import { getUser } from "@/hooks/use-user";
import { supabase } from "@/lib/supabase";
import { getFileUrl } from "@/lib/supabase";
import { Spinner } from "../ui/spinner";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "../ui/actionsheet";
import { followingSheetStyles as styles } from "./followingsheet.styles";

export default function Followingsheet() {
  const { user: authUser } = useAuth();
  const { data: followingIDs, isLoading, error, refetch } = usefollowing(
    authUser?.id
  );
  const uniqueFollowingIDs = Array.from(new Set(followingIDs || []));

  const userQueries = useQueries({
    queries: uniqueFollowingIDs.map((id) => ({
      queryKey: ["user", id],
      queryFn: () => getUser(id),
      enabled: !!id,
    })),
  });

  const queriesLoading = userQueries.some((q) => q.isLoading);
  const users = userQueries.map((q) => q.data).filter(Boolean);

  const [unfollowSheet, setUnfollowSheet] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; username: string } | null>(null);

  const handleUnfollow = async (targetId: string) => {
    const { error } = await supabase
      .from("Followers")
      .delete()
      .eq("user_id", authUser?.id)
      .eq("following_user_id", targetId);
    if (!error) refetch();
    else console.error("Error unfollowing:", error);
    setUnfollowSheet(false);
    setSelectedUser(null);
  };

  const openUnfollowSheet = (item: { id: string; username: string }) => {
    setSelectedUser(item);
    setUnfollowSheet(true);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.itemCard}
      onPress={() => router.push({ pathname: "/user", params: { userid: item.id } })}
    >
      <HStack style={styles.userRow} space="md">
        <Avatar size="lg" style={styles.avatar}>
          <AvatarFallbackText style={{ color: "white" }}>
            {item?.username ? item.username.charAt(0).toUpperCase() : "?"}
          </AvatarFallbackText>
          <AvatarImage source={{ uri: item?.avatar || getFileUrl(item?.id || "", "avatar.jpeg") }} />
        </Avatar>
        <VStack style={styles.userInfo}>
          <Text style={styles.usernameText}>{item?.username || "Unknown User"}</Text>
          <Text style={styles.subText}>@{(item?.username || "").toLowerCase()}</Text>
        </VStack>
      </HStack>
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          openUnfollowSheet({ id: item.id, username: item.username });
        }}
        style={styles.unfollowBtn}
      >
        <Text style={styles.btnTextOutline}>Unfollow</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (isLoading || queriesLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <Spinner color="white" size={24} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Error loading followings.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HStack style={styles.header} space="md">
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <ArrowLeft color="white" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Following</Text>
      </HStack>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshing={!!isLoading}
        onRefresh={refetch}
        contentContainerStyle={[styles.listContent, !users?.length && { flex: 1 }]}
        ListEmptyComponent={!isLoading ? <Text style={styles.emptyText}>Not following anyone yet</Text> : null}
      />
      <Actionsheet isOpen={unfollowSheet} onClose={() => setUnfollowSheet(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ backgroundColor: "#141414" }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem disabled>
            <ActionsheetItemText style={{ color: "#9CA3AF", fontSize: 14 }}>
              Unfollow @{selectedUser?.username || ""}?
            </ActionsheetItemText>
          </ActionsheetItem>
          <Divider />
          <ActionsheetItem onPress={() => selectedUser && handleUnfollow(selectedUser.id)}>
            <ActionsheetItemText style={{ color: "#EF4444", fontWeight: "700" }}>
              Unfollow
            </ActionsheetItemText>
          </ActionsheetItem>
          <Divider />
          <ActionsheetItem onPress={() => setUnfollowSheet(false)}>
            <ActionsheetItemText style={{ color: "white" }}>Cancel</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </SafeAreaView>
  );
}
