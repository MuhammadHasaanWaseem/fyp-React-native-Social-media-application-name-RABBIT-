import { StyleSheet } from 'react-native';
import { wp, hp } from '@/lib/helper';

export const gifPickerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010118',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingTop: hp(4),
    paddingBottom: hp(2),
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: wp(2),
  },
  closeBtn: {
    marginLeft: wp(3),
    padding: wp(2),
  },
  loadingContainer: {
    padding: hp(2),
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: hp(1),
  },
  gifItem: {
    width: wp(30),
    height: 100,
    margin: wp(1.5),
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  listContent: {
    paddingBottom: hp(15),
  },
});
