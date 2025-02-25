import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthProviders';




export default () => {
  const {logOut} =useAuth();
  return (
    
    < SafeAreaView className='bg-white flex-1'>

<Text className='text-4xl text-black ' >profile</Text>
<Button onPress={logOut}>
  <ButtonText>
    Log out
  </ButtonText>
</Button>
 </SafeAreaView>
  );
}
