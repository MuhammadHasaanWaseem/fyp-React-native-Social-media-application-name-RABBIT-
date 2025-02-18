import { SafeAreaView } from 'react-native-safe-area-context';
import Rabbiticon from '@/assets/logo/Rabbiticon';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { StyleSheet, Image, TouchableOpacity, View, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard, StatusBar } from 'react-native';
import { router } from 'expo-router';

export default ({ children, onPress,buttonText }: { children: React.ReactNode, onPress: () => void,buttonText:string }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar hidden={true}/>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <VStack style={styles.header} space="md">
            <Rabbiticon size={299} />
           
              
            </VStack>   

            {children}

            <VStack style={styles.footer} space="md">
              <Button onPress={onPress} style={styles.button}>
                <ButtonText style={styles.buttonText}>{buttonText}</ButtonText>
              </Button>
              <VStack>
              <Button  style={styles.button} onPress={()=>router.back()}>
              <ButtonText style={styles.buttonText}> Go back?</ButtonText></Button></VStack>
            </VStack>
{/* back and next buttonation */}


            <View style={styles.logoO}>
              <TouchableOpacity>
                <Image source={require("../../assets/logo/i.png")} style={styles.logo} />
              </TouchableOpacity>
            </View>
       
             <Text style={[styles.brandText,{textAlign:'center'}]}>Rabbit Authentication</Text></View>
            
          
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
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 26,
    borderRadius: 10,
    width:300


  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize:17,
    paddingBottom:1
  },
  logo: {
    height: 40,
    width: 40,
    marginBottom: 15,
  },
  logoO: {
    alignItems: 'center',
    justifyContent: 'center',

  },
  brandText: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: 'white',
  },
});
