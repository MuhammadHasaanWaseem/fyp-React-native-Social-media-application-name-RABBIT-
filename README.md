
**Starter Features**
***Splash + Onboarding Screen – Welcomes users and provides an introduction to the app.
Authentication using Supabase – Secure login/signup functionality.
Create Username – Users can set unique usernames during sign-up.***
**Posting & Content**
***Post Screen – Users can upload audio, video, images, text, and GIFs.
Tagging: Mention users (@username) and use hashtags (#topic).***
**Post Types**
***Spoiler Blur – Posts can be marked as spoilers and will appear blurred until clicked.
Premier Post – Scheduled post releases for followers.
Time Capsule – Users can set posts to unlock after a specific time (locked media).***
**User Interaction & Engagement**
**Home Feed**
***View posts, like, comment, and share.
External post sharing support.***
**Search & Discovery**
***Search for users, follow/unfollow, and navigate to their profiles.***
**Profile Screen**
***Three privacy modes: Public, Private, Capsule (time-locked posts).
Users can share their profiles externally.***
**Edit profile details**.
**Notifications**
***Real-time notifications for likes, comments, and mentions.***
**Messaging & AI Integration**
**Messaging**
***Real-time chat feature with global users.***
**AI Integration**
***DeepSeek Llama R1 chatbot integration via OpenRouter API.
Privacy & Contextual Features***
**Context-Based Privacy**
*****Users can customize privacy settings based on context (e.g., specific audiences for certain posts).*****


**technologies**
***React native expo router
prisma
supabase
gluestack library
tanstack query
twillo verify for user authentication
etc***
**Clonning with database**
***1-clone the repository
2-run command npm i
3-settup supabase server
4 run command prisma db push on vs code terminal
5-setup authentication using twiilo verify phone number should be enabled create account and deatils that are required
run this on sql editor of upabae GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE,DELETE ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE,DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
 6-create a storage folder name should be as "files"****

***if u dont have twillo premium then add testing phone no. and apis***
***clonig without database then just run npm i and start developemnt but prisma will not work even with right creditals of db connectivity you cannot add further tables etc but you can adjust ui or create its build***

 **app usage**
***install apk file
eneter these credential phone number : +18043698202
sms code :123456***













db pass reactnativenerd


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

rough worm
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
