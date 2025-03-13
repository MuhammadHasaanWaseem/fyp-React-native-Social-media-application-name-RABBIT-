import { User } from "@/lib/type";
import {  Text, Pressable, Alert, TouchableOpacity, FlatList, SafeAreaView } from "react-native";
import { HStack } from "../ui/hstack";
import {  Info, PlusSquareIcon, UserCheck2 } from "lucide-react-native";
import { Avatar, AvatarBadge, AvatarImage, AvatarFallbackText, AvatarGroup } from "../ui/avatar";
import { Button, ButtonText } from "../ui/button";
import { Divider } from "../ui/divider";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { VStack } from "../ui/vstack";
import { supabase } from "@/lib/supabase";
import View from '@/components/shared/sharedview'
import { usePosts } from "@/hooks/use-posts";
import BottomSheet from "./bottom-sheet";
import { useAuth } from "@/providers/AuthProviders";
import { usefollowers } from "@/hooks/use-followers";
import { usefollowing } from "@/hooks/use-following";
import { router } from "expo-router";


enum Tab {
  PUBLIC = "Public",
  PRIVATE = "Private",
  CAPSULE = "Capsule",
}

const tabs =[
{  
   name:Tab.PUBLIC,
  key:'user_id'},
{ 
   name:Tab.PRIVATE,
  key:'private_id'},
{  
  name:Tab.CAPSULE,
  key:'capsule_id'}
]
export default ({ user }: { user: User }) => {
 
  const [tab, setTab] = useState<typeof tabs[number]>(tabs[0]);
  const [showActionsheet, setShowActionsheet] = useState(false)
  const {data,refetch,isLoading} =usePosts({key:tab.key,value:user?.id,type:'eq'});
  //handle logout function

  // Use local state to update avatar immediately on UI
  const [localAvatar, setLocalAvatar] = useState<string>(user?.avatar || "");
  const {data:followers}= usefollowers(user?.id);
  const {data:following} =usefollowing(user?.id)
  const {user:userauth}=useAuth();
  const isOwner =userauth?.id==user?.id;
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#141414" }}>
      <Text></Text>
      <Text></Text>
 {
  isOwner &&  <HStack space="md" className="justify-end">
  <TouchableOpacity >
  <PlusSquareIcon color={'white'}/>
  </TouchableOpacity>
  <TouchableOpacity onPress={()=>setShowActionsheet(true)} >
  <Info style={{marginRight:23}} color={'white'}/>
  </TouchableOpacity>
</HStack>
 }

      <HStack className="items-center justify-between p-6">
       <VStack >
       <Text style={{ fontSize: 24, marginLeft: 8, fontWeight: "bold", color: "white" }}>
          {user?.username}
        </Text>
        
       <HStack className="items-center" style={{marginTop:5}}>
       <Text style={{color:'white' ,fontSize:12,fontWeight:"900"}}>   User id : </Text>
       <Text style={{color:'white' ,fontSize:9}}>{user?.id}</Text>
       </HStack>

       

       </VStack>
       
        {/* Wrap the Avatar in a Pressable so it becomes clickable */}
        <Pressable >
          <Avatar size="lg">
           
            <AvatarFallbackText style={{ color: "white" }}>
              {user?.username}
            </AvatarFallbackText>
            <AvatarImage source={{ uri: localAvatar }} />
          </Avatar>
        </Pressable>
        



        
      </HStack> 
      <HStack style={{marginLeft:40}} space="md"> 
      {followers &&
       <AvatarGroup >
       {followers.slice(0, 3).map((item, index) => {
         return (
           <Avatar
             key={index}
             size="sm"
             className={"border-1 border-outline-0 "}
           >
             <AvatarFallbackText className="text-white">
               {item?.user?.username}
             </AvatarFallbackText>
             <AvatarImage
            source={{ uri: item?.user?.avatar }}
              />
           </Avatar>
         )
       })}
       {followers.length >3 &&
        <Avatar size="sm">
        <AvatarFallbackText>{"+ " + (followers.length-3 )+ ""}</AvatarFallbackText>
      </Avatar>
       }
     </AvatarGroup>

       }
       {/* follower sheet */}
       <Pressable onPress={()=>router.push({
pathname:'/followsheet',
params:{userid:user?.id}

       })}>      
         <Text style={{color:'grey'}}>Follower {followers?.length}</Text>
       </Pressable>
       {/* following sheet */}
      {
        isOwner &&  <Pressable  onPress={()=>router.push({
          pathname:'/followingsheet',
          params:{userid:user?.id}
          
                 })}>    
                     <Text style={{color:'grey'}}>Following {following?.length}</Text>
                 </Pressable>
      }
        </HStack> 
      <SafeAreaView className="justify-start">
     
       </SafeAreaView>
     {
      isOwner &&  <HStack space="md" className="items-center justify-between p-6">
      <Button variant="outline" className="flex-1 rounded-xl" onPress={handleAvatarPress}>
        <ButtonText style={{ color: "white" }}>Edit Profile</ButtonText>
      </Button>
      <Button variant="outline" className="flex-1 rounded-xl" onPress={() => {}}>
        <ButtonText style={{ color: "white" }}>Share Profile</ButtonText>
      </Button>
    </HStack>
     }
      {
      !isOwner &&  <HStack space="md" className="items-center justify-between p-6">
      <Button variant="outline" className="flex-1 rounded-xl" onPress={handleAvatarPress}>
        <ButtonText style={{ color: "white" }}>Follow</ButtonText>
      </Button>
      <Button variant="outline" className="flex-1 rounded-xl" onPress={() => {}}>
        <ButtonText style={{ color: "white" }}>Share Profile</ButtonText>
      </Button>
    </HStack>
     }
      <Divider style={{ marginTop: 14, marginBottom: 10 }} />
      <HStack space="md" style={{ padding: 4 }}>
        {tabs.map((t) => (
          <Button
            key={t.name}
            variant="outline"
            className={`flex-1 rounded-xl ${t.name === tab.name ? "bg-white " : "bg-transparent"}`}
            onPress={() => setTab(t)}
          >
            <ButtonText style={{ color: t.name === tab.name ? "#141414" : "white" }}>{t.name}</ButtonText>
          </Button>
        ))}
      </HStack>
      <VStack>
         <FlatList  style={{marginBottom:150}}//margining from bottom to last rendered post full visiblity from flat list
                data={data}
                refreshing={isLoading}
                onRefresh={refetch}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  
                  <><View item={item} refetch={refetch} />
                  
                  </>
                  
                )}
                
              />  
              
      </VStack>
      <BottomSheet  showActionsheet={showActionsheet} setShowActionsheet={setShowActionsheet}/>
    </SafeAreaView>
  );
};
