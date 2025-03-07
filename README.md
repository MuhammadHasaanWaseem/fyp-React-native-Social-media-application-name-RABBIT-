# Rabbit - Social Media App

## 🚀 Starter Features

### 🏁 Splash + Onboarding Screen
- Welcomes users and provides an introduction to the app.

### 🔐 Authentication using Supabase
- Secure login/signup functionality.
- Users can set unique usernames during sign-up.

## 📢 Posting & Content

### 📝 Post Screen
- Users can upload **audio, video, images, text, and GIFs**.
- Tagging: Mention users **(@username)** and use **hashtags (#topic)**.

### 🏷️ Post Types
- **Spoiler Blur** – Posts can be marked as spoilers and will appear blurred until clicked.
- **Premier Post** – Scheduled post releases for followers.
- **Time Capsule** – Users can set posts to unlock after a specific time (locked media).

## 📣 User Interaction & Engagement

### 🏡 Home Feed
- View posts, **like, comment, and share**.
- External post sharing support.

### 🔎 Search & Discovery
- Search for users, **follow/unfollow**, and navigate to their profiles.

### 🏠 Profile Screen
- **Three privacy modes**: Public, Private, Capsule (time-locked posts).
- Users can share their profiles externally.
- **Edit profile details**.

### 🔔 Notifications
- **Real-time notifications** for likes, comments, and mentions.

## 💬 Messaging & AI Integration

### 💌 Messaging
- **Real-time chat feature** with global users.

### 🤖 AI Integration
- **DeepSeek Llama R1 chatbot integration via OpenRouter API**.

## 🛡️ Privacy & Contextual Features

### 🔏 Context-Based Privacy
- Users can customize privacy settings **based on context** (e.g., specific audiences for certain posts).

---

## 🛠 Technologies Used
- **React Native Expo Router**
- **Prisma**
- **Supabase**
- **Gluestack Library**
- **TanStack Query**
- **Twilio Verify** for user authentication

---

## 🔄 Cloning & Database Setup

### 🔹 Cloning with Database
1. Clone the repository:
   ```sh
   git clone <repo-url>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Setup Supabase server.
4. Run the Prisma command:
   ```sh
   npx prisma db push
   ```
5. Setup authentication using **Twilio Verify**:
   - Ensure phone number authentication is enabled.
   - Create an account and enter required details.
6. Run the following SQL commands in the **Supabase SQL Editor**:
   ```sql
   GRANT USAGE ON SCHEMA public TO anon;
   GRANT USAGE ON SCHEMA public TO authenticated;
   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon;
   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
   ```
7. Create a storage folder:
   - Folder name should be **"files"**.

### 🔹 Cloning Without Database
- If you **don't want to set up the database**, simply run:
   ```sh
   npm install
   npm start
   ```
- Note: **Prisma will not work** without a database, even with correct credentials. You can still adjust the UI or create a build.

---

## 📲 App Usage

1. Install the APK file.
2. Use the following credentials:
   - **Phone number:** `+18043698202`
   - **SMS Code:** `123456`

---

## 🗄️ Database Commands
```sql
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO authenticated;
```

---

## 🔌 Prisma Setup
```sh
npx prisma db push
```

---

## 📚 Libraries Used
1. **TanStack Query** – For data caching.
2. **Date-fns** ([URL](https://date-fns.org/)) – Formatting dates (e.g., "6 days ago").
3. **Gluestack UI** – For better UI components.
4. **Lucide-react-native** – For icons.
5. **Image Picker** – For selecting media (images/videos).

### Install all Node modules:
```sh
npm install
```

### If needed, install dependencies manually:
```sh
npm install @tanstack/react-query date-fns lucide-react-native @gluestack-ui/accordion @gluestack-ui/button
```

---

## 📌 Rough Work (Ignore Below)
```js
 //  { item?.repost_user && <HStack className="items-center" style={{gap:5}} >
 // <Text style={{color:'grey',fontWeight:'400'}}>Reposted by {item?.repost_user?.username}</Text>

 // <Repeat color="white" size={15} strokeWidth={1} />
 // <Pressable onPress={()=>router.push({
 //   pathname:'/profile',
 //   params:{id:item?.repost_user_id}
 // })}>

 // </Pressable>

 // </HStack>}
```

```js
 const {uploadFile,Photo,setPhoto,updatepost} = usePost()
  const addPhoto = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Fix: Use proper mediaType
        allowsEditing: true,
        aspect: [6, 5],
        quality: 0.2,
      });
  if(!result.assets?.[0]?.uri) return;
      let uri = result.assets?.[0]?.uri;
      let type = result.assets?.[0]?.mimeType;
      let name = uri?.split('/').pop();
      uploadFile(post.id, uri, type, name);
  };
```

---

🚀 **Enjoy building with Rabbit!** 🐰

