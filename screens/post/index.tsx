import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/providers/AuthProviders';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Divider } from '@/components/ui/divider';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, ButtonText } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import * as Crypto from 'expo-crypto';
import { useState,useEffect } from 'react';
import Card from './card';
import { FlatList } from 'react-native';
import { Post } from '@/lib/type';
import { usePost } from '@/providers/PostProvider'
import { Eraser, SquareArrowLeft } from 'lucide-react-native';



export default () => {
  const { user } = useAuth();
  const{threadId} =useLocalSearchParams();
  const {updatepost,clearpost,PostCard,uploadpost,addthreads}=usePost();

  // const defaultpost:Post={
  //   id: Crypto.randomUUID(),
  //     user_id: user.id,
  //     parent_id:null,
  //     text:'',
  //   }
  //   useEffect(() => {
        
  //         SetPostCard([defaultpost]);
        
  //     }, []);
    
  // const [PostCard, SetPostCard] = useState<Post[]>([]);

  // const onPress = async () => {
  //   console.log(PostCard);
  //   if (!user) return;
  //    const { data,error } = await supabase.from('Post').insert(PostCard).order('created_at',{ascending:false});
  //    if (!error) router.back();
  //    console.log(data,error);
  // };
  // const updatepost = async (id:string,key:string , value:string) => {
  //   SetPostCard(PostCard.map((p:Post)=>p.id===id?{...p,[key]:value}:p));
  //   const { data, error } = await supabase
  //   .from('Post')             // Make sure this matches your actual table name
  //   .update({ [key]: value }) // e.g., { file: data.path } or { text: 'new text' }
  //   .eq('id', id);

 
  // };
  // const clearpost =()=>{
  //   SetPostCard([defaultpost]);
  // }
  return (
    <SafeAreaView className="bg-white flex-1">
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <VStack space="md" className="flex-1">
            {/* Header */}
            <HStack className="items-center justify-between p-6">
              {/* back button */}
              <TouchableOpacity onPress={() =>router.back()}>
                
                <SquareArrowLeft color={'black'} size={20}/>

              </TouchableOpacity>
              <Text></Text>
              <Text className="text-2xl font-bold">ɴᴇᴡ ᴘᴏꜱᴛ</Text>
              
              <View style={{ width: 1 }} />
              {/* clear button */}
            <TouchableOpacity onPress={() => {
                clearpost()}}>
                
                <Eraser color={'black'} size={20}/>

              </TouchableOpacity>
            </HStack>
            <Divider />

            {/* List of Posts with "Add to post" as the footer */}
            <FlatList
              data={PostCard}
              keyExtractor={(item)=>item.id}
              renderItem={({ item }) => <Card post={item} />}
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} // extra bottom padding so footer isn't hidden
              ListFooterComponent={
                <HStack className="gap-6 items-center p-3">
                  <Avatar size="sm" style={{ marginLeft: 20 }}>
                    <AvatarFallbackText>{user?.username}</AvatarFallbackText>
                    <AvatarImage source={{ uri: user?.avatar }} />
                  </Avatar>
                  <Button variant="link" onPress={addthreads }>
                    <ButtonText>Add to post</ButtonText>
                  </Button>
                </HStack>
              }
            />

            {/* Fixed "Post" Button */}
            <View
              style={{
                position: 'absolute',
                bottom:1,
                left: 0,
                right: 0,
                paddingHorizontal: 16,
              }}
            >
              <HStack className="items-center justify-between p-3  bg-white">
                <Text className="text-gray-500">ᴬⁿʸᵒⁿᵉ ᶜᵃⁿ ʳᵉᵖˡʸ & qᵘᵒᵗᵉ!</Text>
                <Button style={{ borderRadius: 9, width: 88 }} onPress={uploadpost}>
                  <ButtonText>Post</ButtonText>
                </Button>
              </HStack>
            </View>
          </VStack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
