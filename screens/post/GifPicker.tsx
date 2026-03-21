import React, { useState } from 'react';
import { Modal, FlatList, Image, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { usegif } from '@/hooks/use-gif';
import { useDebounce } from '@/hooks/use-debounce';
import { Search, X } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import { gifPickerStyles } from './GifPicker.styles';

interface GifPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (localUri: string, mimeType: string, name: string) => Promise<void>;
}

export default function GifPicker({ visible, onClose, onSelect }: GifPickerProps) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const debounceSearch = useDebounce(search, 500);
  const { data } = usegif(debounceSearch);

  const handleSelect = async (imageUrl: string) => {
    setLoading(true);
    try {
      const name = `${Date.now()}.gif`;
      const localUri = `${FileSystem.cacheDirectory}${name}`;
      await FileSystem.downloadAsync(imageUrl, localUri);
      await onSelect(localUri, 'image/gif', name);
      onClose();
    } catch (e) {
      console.error('GIF download error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={gifPickerStyles.container}>
        <View style={gifPickerStyles.header}>
          <Input className="flex-1 p-2 rounded-lg" style={gifPickerStyles.input}>
            <InputSlot className="pt-3">
              <InputIcon as={Search} color="white" />
            </InputSlot>
            <InputField
              style={{ color: 'white' }}
              onChangeText={setSearch}
              value={search}
              placeholder="Search GIFs"
              placeholderTextColor="#666"
            />
          </Input>
          <TouchableOpacity onPress={onClose} style={gifPickerStyles.closeBtn}>
            <X color="white" size={24} />
          </TouchableOpacity>
        </View>
        {loading && (
          <View style={gifPickerStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF4500" />
            <Text style={gifPickerStyles.loadingText}>Adding GIF...</Text>
          </View>
        )}
        <FlatList
          data={data?.data || []}
          numColumns={3}
          keyExtractor={(item) => item.id}
          contentContainerStyle={gifPickerStyles.listContent}
          renderItem={({ item }) => {
            const imageUrl = item.images.fixed_height?.url || item.images.original?.url;
            return (
              <TouchableOpacity
                onPress={() => !loading && handleSelect(imageUrl)}
                disabled={loading}
                style={gifPickerStyles.gifItem}
              >
                <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </Modal>
  );
}
