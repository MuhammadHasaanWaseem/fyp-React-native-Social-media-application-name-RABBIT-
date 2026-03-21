//timepicker
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Button, Platform, View } from 'react-native';

export const TimePicker = ({ onSelect, onCancel }) => {
  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    if (Platform.OS === 'android' && event.type === 'set') {
      onSelect(currentDate);
    }
  };

  return (
    <View style={{ backgroundColor: '#010118', padding: 20 }}>
      <DateTimePicker
        value={date}
        mode="datetime"
        display="spinner"
        themeVariant="dark"
        textColor="#FFFFFF"
        onChange={onChange}
        minimumDate={new Date()}
      />
      {Platform.OS === 'ios' && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button title="Cancel" onPress={onCancel} />
          <Button title="Confirm" onPress={() => onSelect(date)} />
        </View>
      )}
    </View>
  );
};