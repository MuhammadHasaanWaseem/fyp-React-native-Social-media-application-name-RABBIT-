import User from '@/components/shared/user';
import { useUser } from '@/hooks/use-user';
import { useLocalSearchParams } from 'expo-router';

export default () => {
  const {userid} =useLocalSearchParams();
 const {data:user}=useUser(userid as string);
 
  return (
    
    <User user={user}/>
  );
}
