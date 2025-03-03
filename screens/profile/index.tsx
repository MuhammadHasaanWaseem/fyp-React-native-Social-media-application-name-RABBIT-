import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/AuthProviders';
import { TouchableOpacity,Text } from 'react-native';




export default () => {
  const {logOut} =useAuth();
  return (
    
    < SafeAreaView  style={{backgroundColor:'#141414',alignItems:'center',justifyContent:'center'}} className='flex-1'>
<TouchableOpacity onPress={logOut} style={{width:150,backgroundColor:'white',borderRadius:10}}>
<Text style={{color:'#141414',textAlign:'center',padding:8}}>
    Log out</Text>
</TouchableOpacity>

 </SafeAreaView>
  );
}
