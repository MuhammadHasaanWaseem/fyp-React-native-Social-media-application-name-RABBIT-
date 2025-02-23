import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface RabbitIconProps {
  size?: number;
}

export default function Rabbiticon({ size = 90 }: RabbitIconProps) {
  return (
    <View>
      <TouchableOpacity>
        <Image source={require("../../assets/logo/Rabbit.png")} style={[styles.logo, { width: size, height: size }]} />
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    marginTop: 26,
  },
});
