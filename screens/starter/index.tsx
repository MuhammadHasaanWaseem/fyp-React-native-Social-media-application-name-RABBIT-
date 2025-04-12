import React, { useEffect } from 'react';
import {
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const Starter = () => {
  // Check if a user session exists then navigate accordingly
  

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" />
      <Image
        source={require('../../assets/gif/RAB.gif')}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.15,  // 15% of the screen width
    height: width * 0.15, // 15% of the screen width
  },
});

export default Starter;
