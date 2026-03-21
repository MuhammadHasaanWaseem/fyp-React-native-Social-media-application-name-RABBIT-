import React from 'react';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

type DeleteAccountModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
};

export function DeleteAccountModal({
  visible,
  onClose,
  onConfirm,
  loading = false,
}: DeleteAccountModalProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (_) {}
  };

  return (
    <AlertDialog isOpen={visible} onClose={onClose} size="lg">
      <AlertDialogBackdrop />
      <AlertDialogContent className="bg-white border-neutral-200">
        <AlertDialogHeader>
          <Heading size="lg" className="font-semibold text-black">
            Delete Account?
          </Heading>
        </AlertDialogHeader>
        <AlertDialogBody className="mt-3 mb-4">
          <Text size="sm" className="text-black">
            Are you sure you want to permanently delete your account? Your username and all data will be removed. This cannot be undone.
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button variant="outline" action="secondary" onPress={onClose} size="sm">
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            onPress={handleConfirm}
            size="sm"
            disabled={loading}
            style={{ backgroundColor: '#DC2626' }}
          >
            <ButtonText>{loading ? 'Deleting...' : 'Delete Account'}</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
