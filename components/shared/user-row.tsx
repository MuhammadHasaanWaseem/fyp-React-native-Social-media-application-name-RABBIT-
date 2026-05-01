import { Text, Pressable, View } from 'react-native';
import { useAuth } from '@/providers/AuthProviders';
import { HStack } from '@/components/ui/hstack';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonText } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/type';
import { userRowStyles } from './user-row.styles';

export default ({
  user,
  followingdata,
  refetchfollowing,
}: {
  user: User;
  followingdata: string[];
  refetchfollowing: () => void;
}) => {
  const { user: userauth } = useAuth();

  const followuser = async (following_user_id: string) => {
    const { error } = await supabase.from('Followers').insert({
      user_id: userauth?.id,
      following_user_id,
    });
    if (!error) refetchfollowing();
  };

  const unfollowuser = async (following_user_id: string) => {
    const { error } = await supabase
      .from('Followers')
      .delete()
      .eq('user_id', userauth?.id)
      .eq('following_user_id', following_user_id);
    if (!error) refetchfollowing();
  };

  const goProfile = () => {
    router.push({ pathname: '/user', params: { userid: user?.id } });
  };

  return (
    <View>
      <HStack style={userRowStyles.row} space="md" className="items-center justify-between">
        <Pressable style={userRowStyles.pressable} onPress={goProfile}>
          <HStack space="md" style={userRowStyles.left} className="items-center">
            <Avatar size="md">
              <AvatarFallbackText style={{ color: 'white' }}>{user?.username}</AvatarFallbackText>
              <AvatarImage source={{ uri: user?.avatar }} />
            </Avatar>
            <VStack>
              <Text style={userRowStyles.username}>{user?.username}</Text>
              <Text style={userRowStyles.nickname}>
                nickname{user?.nickname != null && user.nickname !== '' ? ` @${user.nickname}` : ''}
              </Text>
            </VStack>
          </HStack>
        </Pressable>
        {followingdata?.includes(user?.id) ? (
          <Button
            onPress={() => unfollowuser(user.id)}
            variant="outline"
            className="rounded-lg"
            style={{ marginLeft: 4 }}
          >
            <ButtonText style={{ color: 'white', fontWeight: '900' }}>Unfollow</ButtonText>
          </Button>
        ) : (
          <Button onPress={() => followuser(user.id)} className="bg-white rounded-lg" style={{ marginLeft: 4 }}>
            <ButtonText style={{ color: '#141414', fontWeight: '900' }}>Follow</ButtonText>
          </Button>
        )}
      </HStack>
      <Divider style={userRowStyles.divider} />
    </View>
  );
};
