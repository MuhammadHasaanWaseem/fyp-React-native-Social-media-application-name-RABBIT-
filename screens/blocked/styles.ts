import { StyleSheet } from 'react-native';
import { wp, hp } from '@/lib/helper';

export const blockedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010118',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backBtn: {
    padding: wp(2),
    marginRight: wp(2),
  },
  title: {
    color: 'white',
    fontSize: hp(2.5),
    fontWeight: '700',
  },
  tabContainer: {
    flexGrow: 0,
  },
  tabList: {
    gap: 9,
    padding: 7,
    margin: 3,
  },
  sectionTitle: {
    color: '#FF4500',
    fontSize: hp(2),
    fontWeight: '600',
    marginHorizontal: wp(4),
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  emptyText: {
    color: '#888',
    fontSize: hp(2),
    textAlign: 'center',
    marginTop: hp(3),
  },
  listContent: {
    paddingBottom: hp(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  avatar: {
    marginRight: wp(3),
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: 'white',
    fontSize: hp(2),
    fontWeight: '600',
  },
  subText: {
    color: '#888',
    fontSize: hp(1.6),
    marginTop: 2,
  },
  unblockBtn: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    backgroundColor: '#333',
    borderRadius: wp(2),
  },
  unblockText: {
    color: 'white',
    fontSize: hp(1.8),
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  reportText: {
    color: 'white',
    fontSize: hp(1.8),
    flex: 1,
  },
  reportReason: {
    color: '#FF4500',
    fontSize: hp(1.6),
  },
});
