import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { ArrowLeft, Globe, LogOut, FileText, Shield, PenSquare, Ban, Trash2 } from 'lucide-react-native';
import { HStack } from '@/components/ui/hstack';
import { useAuth } from '@/providers/AuthProviders';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { DeleteAccountModal } from '@/components/shared/DeleteAccountModal';
import { getFileUrl } from '@/lib/supabase';
import { drawerStyles } from './styles';

const MenuItem = ({ item }: { item: { Icon: any; title: string; action: () => void } }) => {
  const { Icon, title, action } = item;
  return (
    <TouchableOpacity style={drawerStyles.menuItem} onPress={action} activeOpacity={0.6}>
      <Icon color="#FF4500" size={22} strokeWidth={2} />
      <Text style={drawerStyles.menuText}>{title}</Text>
    </TouchableOpacity>
  );
};

const Drawer = () => {
  const { logOut, user, deleteAccount } = useAuth();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [localbio] = useState<string>((user as any)?.bio || '');

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    const { success, error } = await deleteAccount();
    setDeleteLoading(false);
    if (!success && error) alert(error);
  };

  const exploreItems = [
    { id: 'createPost', title: 'Create a Post', Icon: PenSquare, action: () => router.push('/post') },
    { id: 'worldChat', title: 'World Chat', Icon: Globe, action: () => router.push('/worldchat') },
    { id: 'blocked', title: 'Blocked & Reported', Icon: Ban, action: () => router.push('/blocked') },
  ];
  const legalItems = [
    { id: 'terms', title: 'Terms of use', Icon: FileText, action: () => router.push('/useterms') },
    { id: 'privacy', title: 'Privacy Policies', Icon: Shield, action: () => router.push('/policies') },
  ];
  const accountItems = [
    { id: 'logout', title: 'Log Out', Icon: LogOut, action: logOut },
    { id: 'deleteAccount', title: 'Delete Account', Icon: Trash2, action: () => setDeleteModalVisible(true) },
  ];

  return (
    <SafeAreaView style={drawerStyles.container} edges={['top']}>
      <HStack style={drawerStyles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)')} style={drawerStyles.backButton} activeOpacity={0.7}>
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <Text style={drawerStyles.headerTitle}>Menu</Text>
      </HStack>

      <View style={drawerStyles.profileCard}>
        <Avatar size="xl">
          <AvatarFallbackText style={{ color: 'white' }}>{user?.username || ''}</AvatarFallbackText>
          <AvatarImage source={{ uri: `${(user as any)?.avatar || getFileUrl(user?.id || '', 'avatar.jpeg')}?t=${Date.now()}` }} style={drawerStyles.avatar} />
        </Avatar>
        <Text style={drawerStyles.username}>{user?.username}</Text>
        <Text style={drawerStyles.infoText}>
          {(user as any)?.created_at ? `Since ${new Date((user as any).created_at).getFullYear()}` : ''}
        </Text>
        <Text style={drawerStyles.infoText} numberOfLines={2}>"{localbio || 'No bio yet'}"</Text>
      </View>

      <ScrollView contentContainerStyle={drawerStyles.menuItemsContainer} showsVerticalScrollIndicator={false}>
        <Text style={drawerStyles.sectionLabel}>EXPLORE</Text>
        {exploreItems.map((item) => <MenuItem key={item.id} item={item} />)}

        <Text style={drawerStyles.sectionLabel}>LEGAL</Text>
        {legalItems.map((item) => <MenuItem key={item.id} item={item} />)}

        <Text style={drawerStyles.sectionLabel}>ACCOUNT</Text>
        {accountItems.map((item) => <MenuItem key={item.id} item={item} />)}

        <View style={drawerStyles.footer}>
          <Image source={require('../../assets/gif/RAB.gif')} style={drawerStyles.image} />
        </View>
      </ScrollView>

      <DeleteAccountModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteAccount}
        loading={deleteLoading}
      />
    </SafeAreaView>
  );
};

export default Drawer;
