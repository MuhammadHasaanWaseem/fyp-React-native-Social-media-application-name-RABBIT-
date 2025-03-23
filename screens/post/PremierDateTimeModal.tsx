// PremierDateTimeModal.tsx
import React from 'react';
import { Platform } from 'react-native';
import PremierDateTimeAndroid from './PremierDateTimeAndroid';
import PremierDateTimeIOS from './PremierDateTimeIOS';

interface PremierDateTimeModalProps {
  visible: boolean;
  initialDate: Date;
  onConfirm: (selectedDate: Date) => void;
  onCancel: () => void;
}

const PremierDateTimeModal: React.FC<PremierDateTimeModalProps> = (props) => {
  if (Platform.OS === 'android') {
    return <PremierDateTimeAndroid {...props} />;
  }
  return <PremierDateTimeIOS {...props} />;
};

export default PremierDateTimeModal;

