import { User } from "@/lib/type";
import { useAuth } from "@/providers/AuthProviders";
import { View, Text, Pressable, Alert, TouchableOpacity } from "react-native";
import { HStack } from "../ui/hstack";
import {  Info, Power, UserCheck2 } from "lucide-react-native";
import { Avatar, AvatarBadge, AvatarImage, AvatarFallbackText } from "../ui/avatar";
import { Button, ButtonText } from "../ui/button";
import { Divider } from "../ui/divider";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { VStack } from "../ui/vstack";
import { supabase } from "@/lib/supabase";
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet"


enum Tab {
  PUBLIC = "Public",
  PRIVATE = "Private",
  CAPSULE = "Capsule",
}

export default ({ user }: { user: User }) => {
  const [showActionsheet, setShowActionsheet] = useState(false)
  const handleClose = () => setShowActionsheet(false)
  const [tab, setTab] = useState<Tab>(Tab.PUBLIC);
  const {logOut} =useAuth();
  //handle logout function
  const handlelogout =()=>{
    handleClose();
    logOut();
  }
  // Use local state to update avatar immediately on UI
  const [localAvatar, setLocalAvatar] = useState<string>(user?.avatar || "");

  const handleAvatarPress = async () => {
    try {
      // Request permission for accessing media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Permission to access media library is required!");
        return;
      }

      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newAvatarUri = result.assets[0].uri;
        // Update local state so UI reflects the change immediately
        setLocalAvatar(newAvatarUri);

        // Update the avatar column in the User table using Supabase
        const { data, error } = await supabase
          .from("User")
          .update({ avatar: newAvatarUri })
          .eq("id", user.id);

        if (error) {
          Alert.alert("Error", "Error updating avatar: " + error.message);
          // Revert local state if there is an error
          setLocalAvatar(user.avatar);
        } else {
          Alert.alert("Success", "Avatar updated successfully!");
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Error picking image.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#141414" }}>
      <Text></Text>
      <Text></Text>
<TouchableOpacity onPress={() => setShowActionsheet(true)}>
  <HStack space="md" className="justify-end">
  <Text style={{color:"white",fontWeight:'900'}}>User Info</Text>
  <Info style={{marginRight:23}} color={'#00ff00'}/>
  </HStack>
</TouchableOpacity>
      <HStack className="items-center justify-between p-6">
       <VStack>
       <Text style={{ fontSize: 24, marginLeft: 8, fontWeight: "bold", color: "white" }}>
          {user?.username}
        </Text>
       <HStack className="items-center" style={{marginTop:5}}>
       <Text style={{color:'white' ,fontSize:12,fontWeight:"900"}}>   User id : </Text>
       <Text style={{color:'white' ,fontSize:9}}>{user?.id}</Text>
       </HStack>

       </VStack>
        {/* Wrap the Avatar in a Pressable so it becomes clickable */}
        <Pressable onPress={handleAvatarPress}>
          <Avatar size="lg">
            <AvatarBadge
              size="lg"
              style={{
                backgroundColor: "transparent",
                borderWidth: 0,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UserCheck2 color={"white"} size={10} strokeWidth={4} />
            </AvatarBadge>
            <AvatarFallbackText style={{ color: "white" }}>
              {user?.username}
            </AvatarFallbackText>
            <AvatarImage source={{ uri: localAvatar }} />
          </Avatar>
        </Pressable>
      </HStack>

      <HStack space="md" className="items-center justify-between p-6">
        <Button variant="outline" className="flex-1 rounded-xl" onPress={() => {}}>
          <ButtonText style={{ color: "white" }}>Edit Profile</ButtonText>
        </Button>
        <Button variant="outline" className="flex-1 rounded-xl" onPress={() => {}}>
          <ButtonText style={{ color: "white" }}>Share Profile</ButtonText>
        </Button>
      </HStack>
      <Divider style={{ marginTop: 14, marginBottom: 10 }} />
      <HStack space="md" style={{ padding: 4 }}>
        {Object.values(Tab).map((t) => (
          <Button
            key={t}
            variant="outline"
            className={`flex-1 rounded-xl ${t === tab ? "bg-white " : "bg-transparent"}`}
            onPress={() => setTab(t)}
          >
            <ButtonText style={{ color: t === tab ? "#141414" : "white" }}>{t}</ButtonText>
          </Button>
        ))}
      </HStack>
      {/* user info action sheet here */}
      <Actionsheet  isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent style={{backgroundColor:'#141414',borderColor:'grey'}}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem >
            <ActionsheetItemText  style={{color:"white"}}>Username : {user?.username}</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem >
            <ActionsheetItemText style={{color:"white"}}>User id :{user?.id}</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem >
            <ActionsheetItemText style={{color:"white"}}>Account Created at :{user?.created_at}</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={handlelogout}>
            <ActionsheetItemText style={{color:'red'}}>Logout?</ActionsheetItemText>
          </ActionsheetItem>         
          <ActionsheetItem onPress={handleClose}>
            <ActionsheetItemText>Close</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </View>
  );
};
