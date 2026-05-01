import { VStack } from "@/components/ui/vstack";
import { FlatList, Text, View } from "react-native";
import { useUser } from "@/hooks/use-user";
import UserRow from "@/components/shared/user-row";
import { usefollowing } from "@/hooks/use-following";
import { useAuth } from "@/providers/AuthProviders";
import { usersStyles } from "./users.styles";

interface UsersProps {
  search?: string;
}

export default ({ search = "" }: UsersProps) => {
  const { data } = useUser();
  const { user: loggedInUser } = useAuth();
  const { data: followingdata, refetch: refetchfollowing } = usefollowing(loggedInUser?.id);

  // Filter out the logged in user from the list
  let filteredData = data?.filter((u) => u.id !== loggedInUser?.id) || [];

  const q = search.trim();
  if (q === "") {
    return <View style={usersStyles.empty} />;
  }

  filteredData = filteredData.filter((u) =>
    u.username.toLowerCase().includes(q.toLowerCase())
  );

  if (filteredData.length === 0) {
    return (
      <VStack style={usersStyles.noResults}>
        <Text style={usersStyles.noResultsText}>
          No user found for &quot;{q}&quot;
        </Text>
      </VStack>
    );
  }

  return (
    <View style={usersStyles.listWrap}>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={usersStyles.listContent}
        renderItem={({ item }) => (
          <UserRow user={item} followingdata={followingdata} refetchfollowing={refetchfollowing} />
        )}
      />
    </View>
  );
};
