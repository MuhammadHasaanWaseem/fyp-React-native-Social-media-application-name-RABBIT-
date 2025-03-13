import {  SafeAreaView,Text, TouchableOpacity, View } from "react-native"
import { useAuth } from "@/providers/AuthProviders";
import { HStack } from "@/components/ui/hstack";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { User } from "@/lib/type";
// export default ({user,followingdata,refetchfollowing}:{user:User,followingdata:string[],refetchfollowing:()=>void})=>{
    export default ({user,followingdata,refetchfollowing}:{user:User,followingdata:string[],refetchfollowing:()=>void})=>{
    
    // //follow function
      const followuser =async(following_user_id:string)=>{
        const {error}= await supabase.from('Followers').insert({
          user_id:userauth?.id,
          following_user_id
        })
        if(!error) refetchfollowing();

    }
    //   //unfollow function
      const unfollowuser =async(following_user_id:string)=>{
        const {error}= await supabase.from('Followers').delete().eq('user_id',userauth?.id).eq('following_user_id',following_user_id);
        if(!error) refetchfollowing();

      }
      const { user: userauth } = useAuth();

return(




    <SafeAreaView>

<HStack style={{marginTop:10}} space="md" className="items-center justify-between">
<HStack space="md" className="items-center">
    
<Avatar size="lg">
  <AvatarFallbackText style={{ color: "white" }}>
    {user?.username}
  </AvatarFallbackText>
  <AvatarImage source={{ uri: user?.avatar  }} />
</Avatar>
<VStack>
<TouchableOpacity onPress={()=>router.push({
pathname:'/user',
params:{userid:user?.id}
})}>
    
<Text style={{color:'white',fontWeight:'700'}}>
    {user?.username} 
</Text>
</TouchableOpacity>

<Text style={{color:'white',fontSize:10}}>
user id : {user?.id}</Text>
</VStack>
</HStack>
{  followingdata?.includes( user?.id)   ?(
<Button onPress={()=>unfollowuser(user.id)} variant="outline" className=" rounded-lg ">
    <ButtonText style={{color:'white',fontWeight:'900'}}>
Unfollow</ButtonText>
</Button>):(
    <Button onPress={()=>followuser(user.id)} className="bg-white rounded-lg ">
    <ButtonText style={{color:'#141414',fontWeight:'900'}}>
        Follow Back
    </ButtonText>
</Button>
)} 

</HStack>
<Divider  style={{borderWidth:1,borderColor:'grey',marginTop:5}}/>




  
</SafeAreaView>

)
}