import React from "react";
import {
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
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

  const confirmUnfollow = (targetId: string) => {
    Alert.alert(
      "Unfollow Confirmation",
      "Are you sure you want to unfollow this user?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Unfollow", style: "destructive", onPress: () => handleUnfollow(targetId) },
      ]
    );
  };

  const AnimatedListItem = ({ item, index }) => {
    const opacity = React.useRef(new Animated.Value(0)).current;
    const buttonScale = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    const handlePressIn = () => {
      Animated.spring(buttonScale, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(buttonScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View style={[styles.itemContainer, { opacity }]}>
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
              <Text style={{ color: "white", fontSize: 12 }}>You are Following</Text>
            </VStack>
          </HStack>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <Button
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => confirmUnfollow(item.id)}
              variant="outline"
              style={styles.button}
            >
              <ButtonText style={styles.buttonTextOutline}>Unfollow</ButtonText>
            </Button>
          </Animated.View>
        </HStack>
        <Divider style={styles.itemDivider} />
      </Animated.View>
    );
  };

  const renderItem = ({ item, index }) => (
    <AnimatedListItem item={item} index={index} />
  );

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
    backgroundColor: "#0A0A0A",
  },
  centered: {
    flex: 1,
    backgroundColor: "#0A0A0A",
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
