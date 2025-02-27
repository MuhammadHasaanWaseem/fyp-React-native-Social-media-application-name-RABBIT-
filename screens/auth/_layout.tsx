import { SafeAreaView } from 'react-native-safe-area-context';
import Rabbiticon from '@/assets/logo/Rabbitlogo';
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
            <VStack style={styles.header} space="sm">
            <Rabbiticon size={299} />
            <Text style={{color:'white', fontSize:18,fontWeight:'600'}}>Ａｕｔｈｅｎｔｉｃａｔｉｏｎ</Text>
            
           
              
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
                <Image source={require("../../assets/logo/Rabbit.png")} style={styles.logo} />
              </TouchableOpacity>
            </View>
       
             <Text style={[styles.brandText,{textAlign:'center'}]}>Contact on instagram @im_hasaan_</Text></View>
            
          
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
   marginTop:40
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 26,
    borderRadius: 10,
    width:300,


  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize:17,
    paddingBottom:1
  },
  logo: {
    height: 20,
    width: 20,
    marginBottom: 5,
    marginTop: 15,
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
