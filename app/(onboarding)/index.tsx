import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ImageProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Create an AnimatedImage component that fades in on mount.
const AnimatedImage: React.FC<ImageProps> = (props) => {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);
  return <Animated.Image {...props} style={[props.style, { opacity }]} />;
};

// Custom Done button with animated scaling on press.
const CustomDoneButton = (props: { onPress: () => void }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={styles.doneButton}
        onPress={props.onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Text style={styles.doneText}>Onboard</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

type OnboardingScreenProps = {
  onDone: () => void;
};

export default function OnboardingScreen({ onDone }: OnboardingScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar hidden ={true}/>
      
      <Onboarding
        pages={[
          {
            backgroundColor: '#000',
            image: (
              <AnimatedImage
                source={require('@/assets/images/splash-icon.png')}
                style={styles.image}
              />
            ),
            title: 'Rabbit',
            subtitle: 'Leap Beyond the Ordinary',
            titleStyles: styles.title,
            subTitleStyles: styles.subtitle,
          },
          {
            backgroundColor: '#000',
            image: (
              <AnimatedImage
                source={require('@/assets/images/onboarding-img1.png')}
                style={styles.image1}
              />
            ),
            title: 'Express Yourself',
            subtitle: 'Share moments with mulitple features',
            titleStyles: styles.title,
            subTitleStyles: styles.subtitle,
          },
          {
            backgroundColor: '#000',
            image: (
              <AnimatedImage
                source={require('@/assets/images/onboarding-img2.png')}
                style={styles.image2}
              />
            ),
            title: 'Call to Action',
            subtitle: "Ready to Leap Into Authentic Sharing?",
            titleStyles: styles.title,
            subTitleStyles: styles.subtitle,
          },
        ]}
        onDone={onDone}
        onSkip={onDone}
        bottomBarHighlight={false}
        DoneButtonComponent={(buttonProps) => <CustomDoneButton onPress={buttonProps.onPress} />}
        bottomBarColor="#000"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 130,
    height: 130,
    marginBottom: 40,
  },
  image1: {
    width: 170,
    height: 170,
    marginBottom: 40,
  },
  image2: {
    width: 170,
    height: 170,
    marginBottom: 40,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 16,
    marginTop: 16,
    paddingHorizontal: 40,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  doneButton: {
    backgroundColor: '#FFE87c',
    padding: 7,
    borderRadius: 6,
    marginRight: 16,
  },
  doneText: {
    fontSize: 13,
    fontWeight: '900',
  },
});
