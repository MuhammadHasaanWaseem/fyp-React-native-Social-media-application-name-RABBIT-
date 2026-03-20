import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Animated,
  Dimensions,
  Image

} from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Globe,
  LogOut,
  MessageSquare,

  Timer,
  FileText,
  Shield,
  LucideAward,
  User
} from 'lucide-react-native';
import { HStack } from '@/components/ui/hstack';
import { Divider } from '@/components/ui/divider';
import { useAuth } from '@/providers/AuthProviders';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
const { width } = Dimensions.get('window');


// Extracted MenuItem component
const MenuItem = ({ item, index }) => {
  const { Icon, title, action } = item;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      delay: index * 100, // staggered appearance
      useNativeDriver: true,
    }).start();
  }, [index, opacity]);

  return (
    <Animated.View style={{ opacity }}>
      <TouchableOpacity style={styles.menuItem} onPress={action} activeOpacity={0.7}>
        <HStack space="md">
          <Icon color="#FF4500" size={24} style={{ marginRight: 10 }} />
          <Text style={styles.menuText}>{title}</Text>
        </HStack>
      </TouchableOpacity>
    </Animated.View>
  );
};

const Drawer = () => {
  const { logOut, user } = useAuth();

  // Define menu items with updated icons
  const menuItems = [
    {
      id: 'worldChat',
      title: 'World Chat',
      Icon: Globe,
      action: () => router.push('/worldchat'),
    },
    
    {
      id: 'logout',
      title: 'Log Out',
      Icon: LogOut,
      action: logOut,
    },
    
    {
      id: 'timeCapsule',
      title: `What's new introduced`,
      Icon: Timer,
      action: () => router.push('/introduction'),
    },
    {
      id: 'privateUpload',
      title: `Create a Post`,
      Icon: Shield,
      action: () => router.push('/post'),
    },
    {
      id: 'terms',
      title: 'Terms of use',
      Icon: FileText,
      action: () => router.push('/useterms'),
    },
    {
      id: 'privacy',
      title: 'Privacy Policies',
      Icon: LucideAward,
      action: () => router.push('/policies'),
    },
  ];

  // Footer component as FlatList ListFooterComponent
  const ListFooter = () => (
    <View style={styles.footer}>
      <View style={styles.footerIcon}>
        <Image
          source={require('../../assets/gif/RAB.gif')}
          style={styles.image}
        /> 
        </View>
    </View>
  );
const [localbio,setlocalbio] =useState<string>(user?.bio|| '');
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <HStack style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.backButton} activeOpacity={0.7}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explore</Text>
      </HStack>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Avatar size="xl">
              <AvatarFallbackText style={{ color: 'white' }}>{user?.username || ''}</AvatarFallbackText>
          
          <AvatarImage
            source={{ uri: `${user?.avatar}?t=${new Date().getTime()}` }}
            style={styles.avatar}
          />
          
        </Avatar>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.infoText}>
          Account created in {user?.created_at ? new Date(user.created_at).getFullYear() : 'Unknown'}
        </Text>
        <Text style={styles.infoText}>" {localbio || "not set yet"} "</Text>
      </View>

      <Divider style={styles.divider} />

      {/* Menu Items as a FlatList */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <MenuItem item={item} index={index} />}
        ItemSeparatorComponent={() => <Divider style={styles.divider} />}
        contentContainerStyle={styles.menuItemsContainer}
        ListFooterComponent={ListFooter}
      />
    </SafeAreaView>
  );
};

export default Drawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010118',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#0a0a0a',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    marginLeft: 10,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
    borderRadius: 10,
    padding: 10,
  },
  avatar: {
    borderWidth: 2,
    borderColor: '#BB86FC',
  },
  image: {
    width: width * 0.05,  // 15% of the screen width
    height: width * 0.05, // 15% of the screen width
  },
  username: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 8,
  },
  divider: {
    marginVertical: 10,
    backgroundColor: '#333333',
    height: 1,
  },
  menuItemsContainer: {
    marginTop: 20,
    paddingBottom: 50,
  },
  menuItem: {
    backgroundColor: '#010118',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    paddingBottom: 30,
  },
  footerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  brandText: {
    fontSize: 12,
    color: '#E0E0E0',
    fontWeight: '500',
  },
});
