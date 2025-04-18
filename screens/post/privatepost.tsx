import React, { useState, useCallback, memo } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from '@/components/ui/actionsheet';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
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
  const [showPrompt, setShowPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [hint, setHint] = useState('');
  const [error, setError] = useState<string | null>(null);

  const openPrompt = () => {
    setPassword('');
    setHint('');
    setError(null);
    setShowPrompt(true);
  };

  const closePrompt = () => {
    setShowPrompt(false);
  };

  const handlePromptSubmit = useCallback(async () => {
    if (password.length !== 8) {
      setError('Password must be 8 characters long');
      return;
    }
    if (!hint.trim()) {
      setError('Hint is required');
      return;
    }
    try {
      await onSubmit(password, hint);
      closePrompt();
    } catch (err) {
      console.error(err);
      setError('Upload failed.');
    }
  }, [password, hint, onSubmit]);

  return (
    <>
      <Actionsheet isOpen={visible} onClose={onClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent style={styles.sheetContent}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack space="md" style={styles.sheetContainer}>
            <Text style={styles.sheetTitle}>Set Private Post</Text>
            <Button onPress={openPrompt} style={styles.button}>
              <ButtonText style={styles.buttonText}>Set Password & Hint</ButtonText>
            </Button>
            <Button onPress={onClose} style={styles.button}>
              <ButtonText style={styles.buttonText}>Cancel</ButtonText>
            </Button>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>

      {/* Prompt Modal */}
      <Modal visible={showPrompt} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.promptBox}>
            <Text style={styles.promptTitle}>Private Post Settings</Text>
            <TextInput
              style={styles.input}
              placeholder="8-digit Password"
              placeholderTextColor="#ccc"
              value={password}
              maxLength={8}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Hint"
              placeholderTextColor="#ccc"
              value={hint}
              onChangeText={setHint}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <View style={styles.promptButtons}>
              <TouchableOpacity onPress={handlePromptSubmit} style={styles.promptButton}>
                <Text style={styles.promptButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closePrompt} style={styles.promptButton}>
                <Text style={styles.promptButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default memo(PrivatePostActionSheet);

const styles = StyleSheet.create({
  sheetContent: {
    backgroundColor: '#010118',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  sheetContainer: {
    width: '100%',
    gap: 12,
  },
  sheetTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptBox: {
    width: '85%',
    backgroundColor: '#121212',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderColor: '#fff',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: {
    color: '#ff4d4d',
    marginBottom: 10,
    textAlign: 'center',
  },
  promptButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  promptButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom:'30%',
    alignItems: 'center',
  },
  promptButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
