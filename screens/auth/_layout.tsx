import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import {
  StyleSheet,
  View,
  StatusBar,
  Image,
  Text,
} from 'react-native';
import { wp, hp } from '@/lib/helper';

export default ({ children, onPress, buttonText, buttonDisabled }: {
  children: React.ReactNode,
  onPress: () => void,
  buttonText: React.ReactNode,
  buttonDisabled?: boolean
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'#010118'}/>
      
          <View style={styles.innerContainer}>
            

            <View style={styles.content}>
              {children}
            </View>

            <VStack style={styles.footer}>
              <Button onPress={onPress} style={styles.mainButton} disabled={buttonDisabled}>
                <ButtonText style={styles.buttonText}>{buttonText}</ButtonText>
              </Button>

             
            </VStack>

            <View style={styles.bottomBranding}>
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
    gap: hp(2),
  },
  brandTitle: {
    fontSize: hp(2.5),
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    paddingTop: hp(40),
    paddingBottom: hp(20),
    gap: hp(2),
  },
  mainButton: {
    backgroundColor: '#FF4500',
    borderRadius: wp(3.5),
    height: hp(5),
    bottom: hp(2.5),
    position: 'absolute',
    alignSelf: 'center',
    width: '100%',
    zIndex: 1000,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: hp(2),
  },
  backButton: {
    alignSelf: 'center',
    padding: wp(2),
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
    fontSize: hp(1.5),
    color: '#374151',
    fontWeight: '500',
  },
  image: {
    width: wp(15),
    height: wp(15),
  }
});

