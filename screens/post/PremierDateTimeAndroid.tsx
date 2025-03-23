// PremierDateTimeAndroid.tsx
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

interface PremierDateTimeAndroidProps {
  visible: boolean;
  initialDate: Date;
  onConfirm: (selectedDate: Date) => void;
  onCancel: () => void;
}

const PremierDateTimeAndroid: React.FC<PremierDateTimeAndroidProps> = ({
  visible,
  initialDate,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (visible && Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: initialDate,
        mode: 'datetime',
        is24Hour: true,
        onChange: (event, selectedDate) => {
          if (event.type === 'dismissed') {
            onCancel();
          } else {
            const date = selectedDate || initialDate;
            onConfirm(date);
          }
        },
      });
    }
  }, [visible, initialDate, onConfirm, onCancel]);

  return null;
};

export default PremierDateTimeAndroid;
