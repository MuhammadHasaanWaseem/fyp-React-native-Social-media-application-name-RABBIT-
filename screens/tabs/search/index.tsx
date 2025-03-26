import { SearchIcon } from "lucide-react-native";
import { SafeAreaView, Text } from "react-native";
import Users from "./users";
import { VStack } from "@/components/ui/vstack";
import { Input, InputSlot, InputIcon, InputField } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";

export default () => {
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 500);

  return (
    <SafeAreaView style={{ backgroundColor: "#010118" }} className="flex-1">
      <VStack space="md" style={{ marginTop: 30 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "900",
            marginBottom: 3,
            marginLeft: '5%',
            color: "#ff4500",
          }}
        >
          Search
        </Text>
        <Input className="rounded-lg" style={{ backgroundColor: "#141414", margin: 5 }}>
          <InputSlot style={{ paddingLeft: 6 }}>
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField
            style={{ color: "white" }}
            placeholder="Search Users"
            onChangeText={setSearch}
            value={search}
          />
        </Input>
      </VStack>
      {/* Pass the debounced search query to the Users component */}
      <Users search={debounceSearch} />
    </SafeAreaView>
  );
};
