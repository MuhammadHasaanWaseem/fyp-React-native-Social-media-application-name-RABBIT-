import React from "react";
import {
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { ArrowLeft } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { usefollowing } from "@/hooks/use-following";
import { useAuth } from "@/providers/AuthProviders";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { useQueries } from "@tanstack/react-query";
import { getUser } from "@/hooks/use-user";
import { supabase } from "@/lib/supabase";

export default function Followingsheet() {
  const { user: authUser } = useAuth();
  // Get following IDs of the logged-in user
  const { data: followingIDs, isLoading, error, refetch } = usefollowing(
    authUser?.id
  );
  // Remove duplicates (if any)
  const uniqueFollowingIDs = Array.from(new Set(followingIDs || []));

  // Use useQueries to fetch detailed user data for each following ID
  const userQueries = useQueries({
    queries: uniqueFollowingIDs.map((id) => ({
      queryKey: ["user", id],
      queryFn: () => getUser(id),
      enabled: !!id,
    })),
  });

  // Check if any queries are loading
  const queriesLoading = userQueries.some((q) => q.isLoading);
  const users = userQueries.map((q) => q.data).filter(Boolean);

  // Function to unfollow a user (remove from your following list)
  const handleUnfollow = async (targetId: string) => {
    const { error } = await supabase
      .from("Followers")
      .delete()
      .eq("user_id", authUser?.id)
      .eq("following_user_id", targetId);
    if (!error) {
      refetch();
    } else {
      console.error("Error unfollowing:", error);
    }
  };

  if (isLoading || queriesLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
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

  const renderItem = ({ item }: { item: any }) => (
    <SafeAreaView style={styles.itemContainer}>
      <HStack style={styles.itemRow} space="md">
        <HStack style={styles.userInfo} space="md">
          <Avatar size="lg">
            <AvatarFallbackText style={styles.avatarFallback}>
              {item?.username ? item.username.charAt(0).toUpperCase() : "?"}
            </AvatarFallbackText>
            <AvatarImage source={{ uri: item?.avatar }} />
          </Avatar>
          <VStack>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/user",
                  params: { userid: item.id },
                })
              }
            >
              <Text style={styles.usernameText}>
                {item?.username || "Unknown User"}
              </Text>
            </TouchableOpacity>
          </VStack>
        </HStack>
        <Button
          onPress={() => handleUnfollow(item.id)}
          variant="outline"
          style={styles.button}
        >
          <ButtonText style={styles.buttonTextOutline}>Unfollow</ButtonText>
        </Button>
      </HStack>
      <Divider style={styles.itemDivider} />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HStack style={styles.header} space="md">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={"white"} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Following</Text>
      </HStack>
      <Divider style={styles.divider} />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshing={!!isLoading}
        onRefresh={refetch}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
  },
  centered: {
    flex: 1,
    backgroundColor: "#141414",
    justifyContent: "center",
    alignItems: "center",
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
  button: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
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
