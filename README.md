phone number : +18043698202
sms code :123456
db pass 03224476937h
sms code :12345678


//database
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO authenticated;
// prisma
npx prisma db push



libraries
1-tanstack //for catching
2-data fns (url :'https://date-fns.org/') // date in the form of 6 days ago etc
3-gluestack ui // for better ui components
4-lucide-react-native // for icons
5-image picker // for selcting media i.e images and videos
//install all node mudules
run command :  npm install 
// and (if needed)
run command : npm install @tanstack/react-query date-fns lucide-react-native @gluestack-ui/accordion @gluestack-ui/button


    //  { item?.repost_user && <HStack className="items-center" style={{gap:5}} >
        // <Text style={{color:'grey',fontWeight:'400'}}>Reposted by {item?.repost_user?.username}</Text>

    // <Repeat color="white" size={15} strokeWidth={1} />
    // <Pressable onPress={()=>router.push({
    //   pathname:'/profile',
    //   params:{id:item?.repost_user_id}
    // })}>

    // </Pressable>
    
    // </HStack>}



 const {uploadFile,Photo,setPhoto,updatepost} =usePost()
  const addPhoto = async () => {
     
      // setPhoto('');
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:ImagePicker.MediaTypeOptions.Images,// Fix: Use proper mediaType
        allowsEditing: true,
        aspect: [6, 5],
        quality: 0.2,
        
      });
  if(!result.assets?.[0]?.uri) return;
      let uri = result.assets?.[0]?.uri;
      let type = result.assets?.[0]?.mimeType;
      let name =uri?.split('/').pop();
      // setPhoto(uri);
      uploadFile(post.id,uri,type,name);
    
    };
