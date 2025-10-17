import { SafeAreaView } from 'react-native-safe-area-context';
import RabbitIcon from '@/assets/logo/Rabbitlogo';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  StatusBar,
  Image,
  Text,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
//getting dimensions of the current screen
const { width } = Dimensions.get('window');
import responsive, { wp, hp, scale } from '@/lib/responsive';
import { colors, fonts } from '@/lib/theme';

export default ({ children, onPress, buttonText }: {
  children: React.ReactNode,
  onPress: () => void,
  buttonText: string
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#010118'}/>
      
          <View style={styles.innerContainer}>
            <VStack style={styles.header}>
                <Image
                      source={require('../../assets/gif/RAB.gif')}
                      style={styles.image}
                    />
                {/* <RabbitIcon size={60} /> */}
                <VStack>
                  <Text style={{ color: colors.text, fontSize: fonts.h2, fontWeight: '900' }}>Welcome to Rabbit</Text>
                </VStack>
            </VStack>

            <View style={styles.content}>
              {children}
            </View>

            <VStack style={styles.footer}>
              <Button onPress={onPress} style={styles.mainButton}>
                <ButtonText style={styles.buttonText}>{buttonText}</ButtonText>
              </Button>

              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Text style={styles.backButtonText}>Go back</Text>
              </TouchableOpacity>
            </VStack>

            <View style={styles.bottomBranding}>
              <Text style={styles.brandText}>Contact on instagram @im_hasaan_</Text>
            </View>
          </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010118',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: wp(6),
  },
  header: {
    alignItems: 'center',
    paddingTop: hp(10),
    gap: hp(2),
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    paddingTop: hp(2),
    paddingBottom: hp(6),
    gap: hp(1.5),
  },
  mainButton: {
    backgroundColor: '#FF4500',
    borderRadius: 14,
  height: hp(7),
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: fonts.body,
  },
  backButton: {
    alignSelf: 'center',
    padding: 12,
  },
  backButtonText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  bottomBranding: {
    position: 'absolute',
    bottom: hp(2.5),
    alignSelf: 'center',
  },
  brandText: {
    fontSize: fonts.small,
    color: colors.border,
    fontWeight: '500',
  },
  image: {
    width: wp(15),
    height: wp(15),
  }
});

