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
                 
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: '900' }}>Welcome to Rabbit

                  </Text>

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
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 16,
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
    paddingBottom: 40,
    gap: 16,
  },
  mainButton: {
    backgroundColor: '#FF4500',
    borderRadius: 14,
    height: 56,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
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
    bottom: 20,
    alignSelf: 'center',
  },
  brandText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  image: {
    width: width * 0.15,  // 15% of the screen width
    height: width * 0.15, // 15% of the screen width
  }
});

