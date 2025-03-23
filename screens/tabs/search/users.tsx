import { VStack } from "@/components/ui/vstack";
import { FlatList, Text } from "react-native";
import { useUser } from "@/hooks/use-user";
import UserRow from "@/components/shared/user-row";
import { usefollowing } from "@/hooks/use-following";
import { useAuth } from "@/providers/AuthProviders";

interface UsersProps {
  search?: string;
}

export default ({ search = "" }: UsersProps) => {
  const { data } = useUser();
  const { user: loggedInUser } = useAuth();
  const { data: followingdata, refetch: refetchfollowing } = usefollowing(loggedInUser?.id);

  // Filter out the logged in user from the list
  let filteredData = data?.filter((u) => u.id !== loggedInUser?.id) || [];

  // Apply search filter if search text exists
  if (search.trim() !== "") {
    filteredData = filteredData.filter((u) =>
      u.username.toLowerCase().includes(search.toLowerCase())
    );
  }

  // If there are no users after filtering, show a message
  if (filteredData.length === 0) {
    return (
      <VStack style={{ alignItems: "center", marginTop: 20 }}>
        <Text style={{ color: "white", fontSize: 16 }}>
          No user available with name {search ? `"${search}"` : ""}
        </Text>
      </VStack>
    );
  }

  return (
    <VStack>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 50 }}
        renderItem={({ item }) => (
          <UserRow user={item} followingdata={followingdata} refetchfollowing={refetchfollowing} />
        )}
      />
    </VStack>
  );
};
