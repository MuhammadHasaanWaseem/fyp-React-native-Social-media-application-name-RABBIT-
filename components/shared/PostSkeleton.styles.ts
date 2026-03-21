import { StyleSheet } from 'react-native';
import { wp, hp } from '@/lib/helper';

export const postSkeletonStyles = StyleSheet.create({
  card: {
    backgroundColor: '#010118',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: wp(2.5),
    padding: wp(4),
    marginHorizontal: wp(2),
    marginVertical: hp(1),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  avatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: '#1a1a2e',
  },
  headerText: {
    marginLeft: wp(3),
    flex: 1,
  },
  line1: {
    height: 14,
    width: '40%',
    borderRadius: 4,
    backgroundColor: '#1a1a2e',
    marginBottom: hp(0.6),
  },
  line2: {
    height: 10,
    width: '25%',
    borderRadius: 4,
    backgroundColor: '#1a1a2e',
  },
  content: {
    marginLeft: wp(15),
    marginBottom: hp(2),
  },
  contentLine1: {
    height: 12,
    width: '90%',
    borderRadius: 4,
    backgroundColor: '#1a1a2e',
    marginBottom: hp(0.6),
  },
  contentLine2: {
    height: 12,
    width: '60%',
    borderRadius: 4,
    backgroundColor: '#1a1a2e',
  },
  media: {
    height: hp(20),
    width: '100%',
    borderRadius: wp(2.5),
    backgroundColor: '#1a1a2e',
    marginBottom: hp(1.5),
  },
  actions: {
    flexDirection: 'row',
    gap: wp(4),
    marginTop: hp(1),
  },
  actionBtn: {
    width: wp(8),
    height: 16,
    borderRadius: 4,
    backgroundColor: '#1a1a2e',
  },
  listContainer: {
    paddingBottom: hp(10),
  },
});
