import { usePost } from '@/providers/PostProvider';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { CheckCircle, Circle, CircleX, SwitchCameraIcon, X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Button, Image, Text, TouchableOpacity, View, StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import { HStack } from '@/components/ui/hstack';
import { router, useLocalSearchParams } from 'expo-router';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const { uploadFile, Photo, MediaType, setMediaType, setPhoto } = usePost();
  const { threadId } = useLocalSearchParams();

  const onConfirm = () => router.back();

  const takePicture = async () => {
    if (!cameraRef.current || !threadId) return;
    const photo = await cameraRef.current.takePictureAsync();
    if (!photo) return;

    setPhoto(photo.uri);
    setMediaType('image/jpg');

    const filename = photo.uri.split('/').pop();
    if (!filename) return;
    uploadFile(threadId, photo.uri, `image/${filename.split('.').pop()}`, filename);
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>
          We need your permission to access the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  // Preview mode
  if (Photo) {
    return (
      <View style={styles.previewContainer}>
        {MediaType?.startsWith('image/') && (
          <Image source={{ uri: Photo }} style={StyleSheet.absoluteFill} />
        )}
        <View style={styles.previewActions}>
          <TouchableOpacity onPress={onConfirm} style={styles.actionButton}>
            <CheckCircle size={32} strokeWidth={2} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPhoto('')} style={styles.actionButton}>
            <CircleX size={32} strokeWidth={2} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        {/* Top bar */}
        <SafeAreaView style={styles.topBar}>
          <TouchableOpacity onPress={() => router.push('/post')} style={styles.topButton}>
            <X size={28} strokeWidth={2} color="white" />
          </TouchableOpacity>
        </SafeAreaView>

        {/* Bottom toolbar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={toggleCameraFacing} style={styles.iconButton}>
            <SwitchCameraIcon size={36} strokeWidth={1} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
            <Circle size={36} strokeWidth={1} color="red" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );

  function toggleCameraFacing() {
    setFacing((f) => (f === 'back' ? 'front' : 'back'));
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  topButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 24,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 30,
  },
  captureButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  permissionText: { textAlign: 'center', fontSize: 18, marginBottom: 12 },
  previewContainer: { flex: 1, backgroundColor: 'black', justifyContent: 'flex-end' },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  actionButton: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 40,
  },
});
