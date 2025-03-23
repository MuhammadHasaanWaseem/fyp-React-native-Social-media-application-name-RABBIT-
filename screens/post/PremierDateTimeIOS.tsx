// PremierDateTimeIOS.tsx
import React, { useState } from 'react';
import { Modal, View, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface PremierDateTimeIOSProps {
  visible: boolean;
  initialDate: Date;
  onConfirm: (selectedDate: Date) => void;
  onCancel: () => void;
}

const PremierDateTimeIOS: React.FC<PremierDateTimeIOSProps> = ({
  visible,
  initialDate,
  onConfirm,
  onCancel,
}) => {
  const [date, setDate] = useState<Date>(initialDate);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 8 }}>
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={(event, selectedDate) => {
              setDate(selectedDate || date);
            }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <Button title="Cancel" onPress={onCancel} />
            <Button title="Confirm" onPress={() => onConfirm(date)} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PremierDateTimeIOS;
