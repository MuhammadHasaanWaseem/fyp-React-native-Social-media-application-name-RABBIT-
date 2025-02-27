import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/providers/AuthProviders';
import { Alert, BackHandler, Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Divider } from '@/components/ui/divider';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Button, ButtonText } from '@/components/ui/button';
import { useCallback } from 'react';
import Card from './card';
import { FlatList } from 'react-native';
import { usePost } from '@/providers/PostProvider'
import { SquareArrowLeft } from 'lucide-react-native';



export default () => {
  const { user } = useAuth();
  const{threadId} =useLocalSearchParams();
  const {clearpost,PostCard,uploadpost,addthreads}=usePost();

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
  /// 
  const backwithpostclear =()=>{
    clearpost();
    router.push('/(tabs)')
    
  }
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        backwithpostclear();
        return true; // Prevent default behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );
  return (
    <SafeAreaView style={{backgroundColor:'#141414'}} className=" flex-1">
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <VStack space="md" className="flex-1">
            {/* Header */}
            <HStack className="items-center justify-between p-6">
              {/* back button */}
              <TouchableOpacity onPress={backwithpostclear}>
                
                <SquareArrowLeft color={'white'} size={20}/>

              </TouchableOpacity>
              <Text style={{color:'white'}} className="text-2xl font-bold">ɴᴇᴡ ᴘᴏꜱᴛ</Text>
              
              <View style={{ width: 1 }} />
              {/* clear button */}
            
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
                  <Avatar  size="sm" style={{ marginLeft: 20,backgroundColor:'white' }}>
                    <AvatarFallbackText style={{color:'#141414',fontWeight:'700'}}>{user?.username}</AvatarFallbackText>
                    <AvatarImage  source={{ uri: user?.avatar }} />
                  </Avatar>
                  <Button variant="link" onPress={()=>Alert.alert('non functional') }>
                    <ButtonText style={{color:'white'}}>Add to Premire</ButtonText>
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
              <HStack className="items-center justify-between p-3  ">
                <Text style={{color:'white'}} className="text-gray-500">ᴬⁿʸᵒⁿᵉ ᶜᵃⁿ ʳᵉᵖˡʸ & qᵘᵒᵗᵉ!</Text>
                <Button style={{ borderRadius: 9, width: 88 ,backgroundColor:'white'}} onPress={uploadpost}>
                  <ButtonText style={{color:'#141414'}}>Post</ButtonText>
                </Button>
              </HStack>
            </View>
          </VStack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};