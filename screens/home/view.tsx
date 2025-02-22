
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Heart,Send,MessageCircle, Repeat } from 'lucide-react-native';
import { Divider } from '@/components/ui/divider';
import { formatDistanceToNow } from 'date-fns'
import { Post } from '@/lib/type';
import { Image } from 'react-native';
import { Video } from 'expo-av';

export default ({item}:{item:Post}) => {

 
  return (
    <Card>
          <HStack space="md" >
            <Avatar size="sm">
              {item.User?.avatar ? (
                <AvatarImage source={{ uri: item.User.avatar }} />
              ) : (
                <AvatarFallbackText>
                  {item.User?.username ? item.User.username.charAt(0) : ''}
                </AvatarFallbackText>
              )}
                       

            </Avatar>
            <VStack className="flex-1">
              <HStack className='items-center' space='md'>
                <Text style={{ fontWeight: 'bold', fontSize: 17 }}>
                  {item.User?.username || ''}
                </Text>
                <Text style={{fontSize: 12 }}>{item?.created_at && formatDistanceToNow(new Date(new Date(item.created_at).getTime() - new Date().getTimezoneOffset() * 60000), { addSuffix: true })}
                </Text>
              </HStack>
              <Text className='text-black '>{item.text}</Text>
              <Text>{""}</Text>
             {item?.file && <Image source={{ uri:`https://wjfmftrlgfpvqdvasdhf.supabase.co/storage/v1/object/public/files/2f1d613f-5740-4c08-ac80-a5792b0f098e/${item.file}` }} style={{ height: 150,borderColor:'black',borderWidth:1, width: 200, borderRadius: 10 }} />}

             {/* {item?.file && <Image source={{ uri:`https://wjfmftrlgfpvqdvasdhf.supabase.co/storage/v1/object/public/files/2f1d613f-5740-4c08-ac80-a5792b0f098e/${item.file}` }} style={{ height: 150,borderColor:'black',borderWidth:1, width: 200, borderRadius: 10 }} />} */}


              <VStack><Text>{''}</Text></VStack>
              <HStack space='lg' className='items-center pt-1 '>
                <Heart color="black" size={20} strokeWidth={1}/>
                <MessageCircle color="black" size={20} strokeWidth={1}/>
                <Repeat color="black" size={20} strokeWidth={1}/>
                <Send color="black" size={20} strokeWidth={1}/>
              </HStack>
            </VStack>
          </HStack>
          <Divider className='w-full' style={{ marginTop:30}}/>
          </Card>
    
  );
}; 