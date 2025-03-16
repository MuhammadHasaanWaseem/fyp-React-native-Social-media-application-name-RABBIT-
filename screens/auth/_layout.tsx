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
  Text
} from 'react-native';
import { router } from 'expo-router';
import { HStack } from '@/components/ui/hstack';

export default ({ children, onPress, buttonText }: { 
  children: React.ReactNode, 
  onPress: () => void,
  buttonText: string 
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <VStack style={styles.header}>
              <HStack style={{alignItems:'center'}} space='md'>
              <RabbitIcon size={60}/>
              <VStack>
                <Text></Text>
              <Text style={{color:'white',fontSize:20,fontWeight:'900'}}>Rabbit</Text>
              <Text style={{color:'white',fontSize:20,fontWeight:'900'}}>Innovation of a new era</Text>

              </VStack>
              </HStack>
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
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
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
    backgroundColor: '#3B82F6',
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
});