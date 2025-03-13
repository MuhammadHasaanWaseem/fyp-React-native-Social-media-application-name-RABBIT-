import { VStack } from "@/components/ui/vstack";
import { FlatList } from "react-native";
import { useUser } from "@/hooks/use-user";
import UserRow from "@/components/shared/user-row";
import { usefollowing } from "@/hooks/use-following";
import { useAuth } from "@/providers/AuthProviders";

export default () => {
  const { data, refetch, isLoading } = useUser();
  const { user: loggedInUser } = useAuth();
  const { data: followingdata, refetch: refetchfollowing } = usefollowing(loggedInUser?.id);

  // Filter out the logged in user from the list
  const filteredData = data?.filter((u) => u.id !== loggedInUser?.id) || [];

  return (
    <VStack>
      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <UserRow user={item} followingdata={followingdata} refetchfollowing={refetchfollowing} />
        )}
      />
    </VStack>
  );
};
