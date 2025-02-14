import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/AuthProviders';
import React, { useState } from 'react';
import { Input,InputField } from '@/components/ui/input';
// import { TouchableOpacity ,Text} from 'react-native';
import { Button, ButtonText } from "@/components/ui/button"
import { supabase } from '@/lib/supabase';
import {  useRouter } from 'expo-router';
import{View,TouchableOpacity,StyleSheet,Image,Text} from 'react-native'

export default () => {
  const [phone,setphone]=useState('');
  const {user}=useAuth();
  const router =useRouter();
  const handlesignin= async ()=> {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: `+1${phone}`,
    })
    if (!error){
      router.push({
        pathname:'/(auth)/verify',
        params:{
          phone:`+1${phone}`,
        },
      }
      )
    }
    console.log(data,error)
  };
  return (
    < SafeAreaView style={{justifyContent:'center',flex:1,alignContent:'center',alignItems:'center'}}>

<Input
      variant="outline"
      size="md"
      
    
    >
      <InputField placeholder="Enter Text here..." 
      style={{textAlign:'center',borderRadius:9}}
      value={phone}
      onChangeText={setphone}
      keyboardType='phone-pad'
      secureTextEntry={true}
      />
    </Input>
    {/* sample auth button */}
    {/* <TouchableOpacity className=" bg-primary-500" style={{marginTop:4,borderRadius:4,height:40,width:'50%'}}  onPress={handlesignin} >
      <Text  style={{color:'white',fontSize:16,textAlign:'center',borderRadius:17,fontWeight:'900',padding:8
      }}>SIgn in</Text>
    </TouchableOpacity> */}
    <Button style={{marginTop:4,borderRadius:4,height:40,width:'50%'}} size="md" variant="solid" action="primary" onPress={handlesignin}>
      <ButtonText>Sign in to Rabbit!</ButtonText>
    </Button>
    
      {/* Bottom Logo & Text */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity>
          <Image source={require("../../assets/logo/i.png")} style={styles.logo} />
        </TouchableOpacity>
        <Text style={styles.brandText}>Rabbit</Text>
      </View>
</SafeAreaView>
  );
}


const styles = StyleSheet.create({
  
  
  bottomContainer: {
    position: "absolute",
    bottom: 20, // Adjust as needed
    alignItems: "center",
  },
  logo: {
    height: 20,
    width: 20,
    marginBottom: 5,
  },
  brandText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});
