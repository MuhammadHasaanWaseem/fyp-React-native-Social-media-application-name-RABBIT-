import { Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

/** Resolve @username to User row and open `/user`. */
export async function openProfileByMentionUsername(raw: string) {
  const username = raw.replace(/^@/, '').trim();
  if (!username) return;
  const { data, error } = await supabase.from('User').select('id').ilike('username', username).maybeSingle();
  if (error || !data?.id) {
    Alert.alert('User not found', `@${username} was not found.`);
    return;
  }
  router.push({ pathname: '/user', params: { userid: data.id } });
}
