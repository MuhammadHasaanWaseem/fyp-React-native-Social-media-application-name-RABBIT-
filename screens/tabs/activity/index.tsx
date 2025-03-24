import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { BellIcon } from "lucide-react-native";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import React, { useState } from "react";
import Follows from "./follows";
import CommentsNotification from "./CommentsNotification"; // Newly created
import LikesNotification from "./LikesNotification";
import Mention from "./Mention";

const tabs = ['Follows', 'Likes', 'Mentions', 'Comments'];

export default () => {
  const [selectedTab, setSelectedTab] = useState('Follows');

  // Renders the component corresponding to the active tab
  const renderTabComponent = () => {
    switch(selectedTab) {
      case 'Follows':
        return <Follows />;
      case 'Comments':
        return <CommentsNotification />;
        case 'Likes':
          return <LikesNotification/>;
          case 'Mentions':
            return <Mention/>
        default:
        return <Follows />;
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#0A0A0A' }} className="flex-1">
      <HStack space="md" style={{ marginTop: 10 }} className="p-3 items-center">
        <BellIcon color={'grey'} size={24} />
        <Text style={{ color: 'white', fontSize: 22, fontWeight: '600' }}>Notifications</Text>
      </HStack>
      <Divider style={{ marginBottom: 10 }} />
      {/* Tab header */}
      <View className="flex-grow-0">
        <FlatList
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 9, padding: 7, margin: 3 }}
          data={tabs}
          horizontal
          renderItem={({ item }) => {
            const isSelected = selectedTab === item;
            return (
              <Button
                onPress={() => setSelectedTab(item)}
                className={`${isSelected ? "bg-white rounded-lg" : "rounded-lg bg-transparent"}`}
                size="md"
                variant={isSelected ? "solid" : "outline"}
                action="primary"
              >
                <ButtonText style={{ color: isSelected ? "black" : "white" }}>
                  {item}
                </ButtonText>
              </Button>
            );
          }}
        />
      </View>
      {renderTabComponent()}
    </SafeAreaView>
  );
};
