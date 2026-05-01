import { StyleSheet } from 'react-native';
import { wp } from '@/lib/helper';

export const usersStyles = StyleSheet.create({
  empty: { flex: 1 },
  listContent: {
    paddingBottom: 50,
    paddingHorizontal: wp(5),
  },
  noResults: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: wp(5),
  },
  noResultsText: { color: 'white', fontSize: 16, textAlign: 'center' },
  listWrap: { flex: 1 },
});
