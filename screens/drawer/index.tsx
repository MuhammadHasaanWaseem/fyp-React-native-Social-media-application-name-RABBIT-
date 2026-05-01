import { Text, TouchableOpacity, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { router } from 'expo-router';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { HStack } from '@/components/ui/hstack';
import { useAuth } from '@/providers/AuthProviders';
import { DeleteAccountModal } from '@/components/shared/DeleteAccountModal';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { getFileUrl } from '@/lib/supabase';
import { drawerStyles } from './styles';

type Row = { id: string; title: string; action: () => void; danger?: boolean };

const MenuRow = ({
  title,
  action,
  danger,
  showDivider,
}: {
  title: string;
  action: () => void;
  danger?: boolean;
  showDivider: boolean;
}) => (
  <TouchableOpacity
    style={[drawerStyles.menuRow, showDivider && drawerStyles.menuRowDivider]}
    onPress={action}
    activeOpacity={0.55}
  >
    <Text style={[drawerStyles.menuText, danger && drawerStyles.menuTextDanger]} numberOfLines={1}>
      {title}
    </Text>
    <ChevronRight color="#FFFFFF" size={18} style={drawerStyles.chevron} strokeWidth={2} />
  </TouchableOpacity>
);

const MenuGroup = ({ rows }: { rows: Row[] }) => (
  <View style={drawerStyles.group}>
    {rows.map((row, i) => (
      <MenuRow
        key={row.id}
        title={row.title}
        action={row.action}
        danger={row.danger}
        showDivider={i < rows.length - 1}
      />
    ))}
  </View>
);

const Section = ({ label, rows }: { label: string; rows: Row[] }) => (
  <View style={drawerStyles.sectionBlock}>
    <Text style={drawerStyles.sectionLabel}>{label}</Text>
    <MenuGroup rows={rows} />
  </View>
);

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

  const exploreRows: Row[] = [
    { id: 'createPost', title: 'Create post', action: () => router.push('/post') },
    { id: 'worldChat', title: 'World chat', action: () => router.push('/worldchat') },
    { id: 'blocked', title: 'Blocked & reported', action: () => router.push('/blocked') },
  ];
  const legalRows: Row[] = [
    { id: 'terms', title: 'Terms of service', action: () => router.push('/useterms') },
    { id: 'privacy', title: 'Privacy policy', action: () => router.push('/policies') },
  ];
  const accountRows: Row[] = [
    { id: 'logout', title: 'Log out', action: logOut },
    {
      id: 'deleteAccount',
      title: 'Delete account',
      danger: true,
      action: () => setDeleteModalVisible(true),
    },
  ];

  const avatarUri = `${(user as any)?.avatar || getFileUrl(user?.id || '', 'avatar.jpeg')}?t=${Date.now()}`;
  const memberSince =
    (user as any)?.created_at != null
      ? `Member since ${new Date((user as any).created_at).getFullYear()}`
      : null;

  return (
    <SafeAreaView style={drawerStyles.container} edges={['top']}>
      <HStack style={drawerStyles.header}>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)')}
          style={drawerStyles.backButton}
          activeOpacity={0.65}
        >
          <ArrowLeft color="rgba(255,255,255,0.85)" size={22} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={drawerStyles.headerTitle}>Settings</Text>
      </HStack>

      <View style={drawerStyles.profileRow}>
        <View style={drawerStyles.profileAvatarWrap}>
          <Avatar size="md">
            <AvatarFallbackText style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
              {user?.username?.slice(0, 2)?.toUpperCase() || '—'}
            </AvatarFallbackText>
            <AvatarImage source={{ uri: avatarUri }} />
          </Avatar>
        </View>
        <View style={drawerStyles.profileTextCol}>
          <Text style={drawerStyles.profileName} numberOfLines={1}>
            {user?.username || 'Account'}
          </Text>
          <Text style={drawerStyles.profileMeta} numberOfLines={1}>
            {localbio ? localbio : memberSince || ' '}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={drawerStyles.menuItemsContainer} showsVerticalScrollIndicator={false}>
        <Section label="General" rows={exploreRows} />
        <Section label="Legal" rows={legalRows} />
        <Section label="Session" rows={accountRows} />
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
