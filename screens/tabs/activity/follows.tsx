import { FlatList, SafeAreaView, Text, TouchableOpacity, ActivityIndicator, View } from "react-native";
import { usefollowers } from "@/hooks/use-followers";
import { useAuth } from "@/providers/AuthProviders";
import { HStack } from "@/components/ui/hstack";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { usefollowing } from "@/hooks/use-following";
import { supabase } from "@/lib/supabase";

export default () => {
  const { user } = useAuth();
  const { data, isLoading, refetch: refetchfollowers } = usefollowers(user?.id);
  const { data: followingdata, refetch: refetchfollowing } = usefollowing(user?.id);

  // Follow a user
  const followuser = async (following_user_id: string) => {
    const { error } = await supabase.from('Followers').insert({
      user_id: user?.id,
      following_user_id
    });
    if (!error) refetchfollowers();
  };

  // Unfollow a user
  const unfollowuser = async (following_user_id: string) => {
    const { error } = await supabase.from('Followers').delete()
      .eq('user_id', user?.id)
      .eq('following_user_id', following_user_id);
    if (!error) refetchfollowing();
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </SafeAreaView>
    );
  }

  // No followers message
  if (!isLoading && (!data || data.length === 0)) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>No followers yet</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <FlatList
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ gap: 9, padding: 7, margin: 3, paddingBottom: 500 }}
        data={data}
        renderItem={({ item }) => (
          <SafeAreaView>
            <HStack style={{ marginTop: 10 }} space="md" className="items-center justify-between">
              <HStack space="md" className="items-center">
                <Avatar size="lg">
                  <AvatarFallbackText style={{ color: "white" }}>
                    {item?.user?.username}
                  </AvatarFallbackText>
                  <AvatarImage source={{ uri: item.user?.avatar }} />
                </Avatar>
                <VStack>
                  <TouchableOpacity onPress={() => router.push({
                    pathname: '/user',
                    params: { userid: item?.user_id }
                  })}>
                    <Text style={{ color: 'white', fontWeight: '700' }}>
                      {item?.user?.username}
                    </Text>
                  </TouchableOpacity>
                  <Text style={{ color: 'white' }}>Started following you</Text>
                </VStack>
              </HStack>
              {followingdata?.includes(item?.user?.id) ? (
                <Button onPress={() => unfollowuser(item.user.id)} variant="outline" className="rounded-lg">
                  <ButtonText style={{ color: 'white', fontWeight: '900' }}>Unfollow</ButtonText>
                </Button>
              ) : (
                <Button onPress={() => followuser(item.user.id)} className="bg-white rounded-lg">
                  <ButtonText style={{ color: '#141414', fontWeight: '900' }}>Follow Back</ButtonText>
                </Button>
              )}
            </HStack>
            <Divider style={{ borderWidth: 1, borderColor: 'grey', marginTop: 5 }} />
          </SafeAreaView>
        )}
      />
    </SafeAreaView>
  );
};
