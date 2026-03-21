import React, { useState, useCallback, memo } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Button, ButtonText } from '@/components/ui/button';

interface PrivatePostActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (password: string, hint: string) => Promise<void>;
}

const PrivatePostActionSheet: React.FC<PrivatePostActionSheetProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [password, setPassword] = useState('');
  const [hint, setHint] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (password.length !== 8) {
      setError('Password must be 8 characters long');
      return;
    }
    if (!hint.trim()) {
      setError('Hint is required');
      return;
    }
    setError(null);
    try {
      await onSubmit(password, hint);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Upload failed.');
    }
  }, [password, hint, onSubmit, onClose]);

  const handleClose = () => {
    setPassword('');
    setHint('');
    setError(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose}>
        <TouchableOpacity style={styles.sheet} activeOpacity={1} onPress={() => {}}>
          <Text style={styles.title}>Private Post Settings</Text>
          <TextInput
            style={styles.input}
            placeholder="8-digit Password"
            placeholderTextColor="#888"
            value={password}
            maxLength={8}
            onChangeText={(t) => { setPassword(t); setError(null); }}
          />
          <TextInput
            style={styles.input}
            placeholder="Hint"
            placeholderTextColor="#888"
            value={hint}
            onChangeText={(t) => { setHint(t); setError(null); }}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <View style={styles.buttons}>
            <Button onPress={handleSubmit} style={styles.btnPrimary}>
              <ButtonText style={styles.btnPrimaryText}>Submit</ButtonText>
            </Button>
            <Button onPress={handleClose} style={styles.btnSecondary}>
              <ButtonText style={styles.btnSecondaryText}>Cancel</ButtonText>
            </Button>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default memo(PrivatePostActionSheet);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#010118',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderColor: '#666',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: '#ff4d4d',
    marginBottom: 12,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#ff4500',
    borderRadius: 10,
    justifyContent: 'center',
  },
  btnPrimaryText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
  },
  btnSecondaryText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
