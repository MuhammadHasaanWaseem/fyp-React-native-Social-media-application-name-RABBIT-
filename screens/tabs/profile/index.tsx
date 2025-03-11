import { useAuth } from '@/providers/AuthProviders';
import User from '@/components/shared/user';




export default () => {

const {user} = useAuth();
  return (
    
    <User user={user}/>
  );
}
