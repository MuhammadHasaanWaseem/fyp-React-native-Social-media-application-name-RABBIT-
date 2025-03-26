// MentionActionSheet.tsx
import React, { useState } from 'react';
import {
  Modal,
  FlatList,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useAuth } from '@/providers/AuthProviders';
import { usemention } from '@/hooks/use-mentions';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { HStack } from '@/components/ui/hstack';

interface MentionActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onMention: (username: string) => void;
}

export default function MentionActionSheet({
  visible,
  onClose,
  onMention,
}: MentionActionSheetProps) {
  const { user } = useAuth();
  const { data: following, isLoading } = usemention(user?.id || '');
  const [search, setSearch] = useState('');

  const filteredFollowing = following?.filter((u) =>
    u && u.username && u.username.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const renderItem = ({ item }: { item: { id: string; username: string; avatar?: string } }) => (
    <TouchableOpacity
      onPress={() => {
        onMention(item.username);
        onClose();
      }}
      style={styles.item}
    >
      <HStack space="md" className="items-center">
        <Avatar size="sm">
          <AvatarFallbackText>{item.username[0]}</AvatarFallbackText>
          {item.avatar && <AvatarImage source={{ uri: item.avatar }} />}
        </Avatar>
        <Text style={styles.username}>{item.username}</Text>
      </HStack>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search followed users..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
          />
          {isLoading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : (
            <FlatList
              data={filteredFollowing}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
<Text style={styles.emptyText}>
    {following?.length === 0 ? 'You don’t follow anyone yet.' : 'No followed users found.'}
  </Text>              }
            />
          )}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  searchInput: {
    backgroundColor: '#333',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  item: {
    paddingVertical: 10,
  },
  username: {
    color: 'white',
    fontSize: 16,
  },
  loadingText: {
    color: 'white',
    textAlign: 'center',
    padding: 20,
  },
  emptyText: {
    color: 'white',
    textAlign: 'center',
    padding: 20,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#ff4500',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});