import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { StatusBar } from 'react-native';
import { useAuth } from '@/providers/AuthProviders';


export default () => {
  const{user} =useAuth();
  return (
    < SafeAreaView className='bg-white flex-1'>

  
  <Text className='text-4xl text-black' >{user.username}</Text>
    </SafeAreaView>
  );
}
