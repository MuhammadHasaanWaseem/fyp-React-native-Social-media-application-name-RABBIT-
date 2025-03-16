import { VStack } from "@/components/ui/vstack";
import { FlatList } from "react-native";
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

  return (
    <VStack>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserRow user={item} followingdata={followingdata} refetchfollowing={refetchfollowing} />
        )}
      />
    </VStack>
  );
};
