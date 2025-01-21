import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';

import { Button } from '../ui/button';
import { Text } from '../ui/text';
import { COLORS } from '@/constants/Colors';

interface YearPickerProps {
  value: number;
  onChangeValue: (year: number) => void;
  isVisible: boolean;
  onBackdropPress: () => void;
  minYear?: number;
}

const YearPicker: React.FC<YearPickerProps> = ({
  value,
  onChangeValue,
  isVisible,
  onBackdropPress,
  minYear = 1900,
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - minYear + 1 },
    (_, i) => (minYear + i).toString(), // Convert years to strings
  );

  const [selectedYear, setSelectedYear] = useState(value.toString()); // Store as string

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      animationIn="zoomIn"
      animationOut="zoomOut"
    >
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Select a Year</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedYear}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            {years.map((year) => (
              <Picker.Item key={year} label={year} value={year} />
            ))}
          </Picker>
        </View>
        <View className="flex-row flex gap-2 mt-8 justify-end">
          <Button onPress={onBackdropPress} variant="outline">
            <Text>Cancel</Text>
          </Button>
          <Button
            onPress={() => {
              onChangeValue(Number(selectedYear)); // Convert back to number
              onBackdropPress();
            }}
          >
            <Text className="text-secondary">Confirm</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: COLORS.dark.muted,
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 15,
  },
  pickerContainer: {
    width: Dimensions.get('window').width * 0.8,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.dark.muted,
    borderRadius: 10,
  },
  picker: {
    width: '100%',
    height: '100%',
  },
  pickerItem: {
    fontSize: 16,
    color: COLORS.dark.muted_foreground,
  },
});

export default YearPicker;
