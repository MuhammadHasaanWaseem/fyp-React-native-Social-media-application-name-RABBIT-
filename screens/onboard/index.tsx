import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

type OnboardingScreenProps = {
  onDone: () => void;
};

export default function OnboardingScreen({ onDone }: OnboardingScreenProps) {
  return (
    <Onboarding
      pages={[
        {
          backgroundColor: '#000',
          image: (
            <Image
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
            <Image
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
            <Image
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
      DoneButtonComponent={({ isLight, ...props }) => (

        <TouchableOpacity style={{ backgroundColor: '#FFE87c', padding: 7, borderRadius: 10 }} onPress={props.onPress}>
          <Text style={{ fontSize: 13, fontWeight: '900' }}>
            Getting Started ?
          </Text>
        </TouchableOpacity>
      )}
      bottomBarColor="#000"
    />
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
  button: {
    marginRight: 16,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingHorizontal: 24,
  },
});
