import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usefollowers } from "@/hooks/use-followers";
import { useAuth } from "@/providers/AuthProviders";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { router } from "expo-router";
import { usefollowing } from "@/hooks/use-following";
import { supabase } from "@/lib/supabase";
import { followsStyles as s } from "./follows.styles";

export default () => {
  const { user } = useAuth();
  const { data, isLoading, refetch: refetchfollowers } = usefollowers(user?.id);
  const { data: followingdata, refetch: refetchfollowing } = usefollowing(user?.id);

  const followuser = async (following_user_id: string) => {
    const { error } = await supabase.from("Followers").insert({
      user_id: user?.id,
      following_user_id,
    });
    if (!error) {
      refetchfollowers();
      refetchfollowing();
    }
  };

  const unfollowuser = async (following_user_id: string) => {
    const { error } = await supabase
      .from("Followers")
      .delete()
      .eq("user_id", user?.id)
      .eq("following_user_id", following_user_id);
    if (!error) {
      refetchfollowing();
      refetchfollowers();
    }
  };

  if (isLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="small" color="rgba(255,255,255,0.5)" />
      </View>
    );
  }

  if (!data?.length) {
    return (
      <View style={s.center}>
        <Text style={s.emptyTitle}>No new followers yet</Text>
        <Text style={s.emptyHint}>When someone follows you, they will show up here.</Text>
      </View>
    );
  }

  return (
    <View style={s.flex}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => String(item?.user_id ?? item?.user?.id)}
        contentContainerStyle={s.list}
        renderItem={({ item }) => {
          const isFollowing = followingdata?.includes(item?.user?.id);
          return (
            <View style={s.row}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={s.left}
                onPress={() =>
                  router.push({ pathname: "/user", params: { userid: item?.user_id } })
                }
              >
                <Avatar size="md">
                  <AvatarFallbackText style={{ color: "rgba(255,255,255,0.7)" }}>
                    {item?.user?.username}
                  </AvatarFallbackText>
                  <AvatarImage source={{ uri: item.user?.avatar }} />
                </Avatar>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={s.name} numberOfLines={1}>
                    {item?.user?.username}
                  </Text>
                  <Text style={s.meta}>Started following you</Text>
                </View>
              </TouchableOpacity>
              {isFollowing ? (
                <Pressable onPress={() => unfollowuser(item.user.id)} style={s.btnGhost}>
                  <Text style={s.btnGhostText}>Unfollow</Text>
                </Pressable>
              ) : (
                <Pressable onPress={() => followuser(item.user.id)} style={s.btnPrimary}>
                  <Text style={s.btnPrimaryText}>Follow back</Text>
                </Pressable>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};
