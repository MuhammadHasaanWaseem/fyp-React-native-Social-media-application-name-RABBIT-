import { View, Text, StatusBar, Image, StyleSheet, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';

const Splash = () => {
  // Animation values
  const fadeIn = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const textFadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo animation sequence
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Text animation after logo completes
      Animated.timing(textFadeIn, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Animated.View style={{ opacity: fadeIn, transform: [{ scale }] }}>
        <Image style={styles.logo} source={require('../../assets/images/splash-icon.png')} />
      </Animated.View>

      <Animated.View style={[styles.bottomBranding, { opacity: textFadeIn }]}>
        <Text style={[styles.brandText, { textAlign: 'center' }]}>From Minoqtopus</Text>
        <Animated.Text 
          style={[styles.brandText, {
            transform: [{
              translateY: textFadeIn.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              })
            }]
          }]}
        >
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  bottomBranding: {
    position: 'absolute',
    bottom: '5%',
    alignSelf: 'center',
  },
  brandText: {
    fontSize: 12,
    color: '#374151',
    marginBottom: '5%',
    fontWeight: '500',
  },
});

export default Splash;