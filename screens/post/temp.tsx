import { FlatList, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { ImageIcon } from 'lucide-react-native';
import { Post } from '@/lib/type';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
export default ({ post, updatepost }) => {
  const [photos, setPhotos] = useState([]);

  const uploadFile = async (uri, type, name) => {
    let newFormData = new FormData();
    newFormData.append('file', {
      uri,
      name,
      type,
    });

    const { data, error } = await supabase.storage.from(`files`).upload(name, newFormData);
    if (data) updatepost(post.id, 'file', data?.path);
    console.log(data, error);
  };

  const addPhotos = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      let selectedPhotos = result.assets.map(asset => ({ uri: asset.uri, name: asset.uri.split('/').pop(), type: asset.mimeType }));
      setPhotos(selectedPhotos);
      selectedPhotos.forEach(photo => uploadFile(photo.uri, photo.type, photo.name));
    }
  };

  return (
    <VStack>
      <HStack>
        <TouchableOpacity onPress={addPhotos}>
          <ImageIcon color="#64748b" size={20} strokeWidth={1.5} />
        </TouchableOpacity>
      </HStack>
      <FlatList
        data={photos}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={{ height: 100, width: 100, margin: 5, borderRadius: 10 }} />
        )}
      />
    </VStack>
  );
};
