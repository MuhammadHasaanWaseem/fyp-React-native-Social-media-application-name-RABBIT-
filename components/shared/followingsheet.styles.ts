import { StyleSheet } from 'react-native';
import { wp, hp } from '@/lib/helper';

export const followingSheetStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a14',
  },
  centered: {
    flex: 1,
    backgroundColor: '#0a0a14',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    paddingTop: hp(3),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: {
    padding: wp(2.5),
    borderRadius: wp(4),
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerText: {
    color: 'white',
    fontSize: hp(2.6),
    fontWeight: '800',
    marginLeft: wp(4),
    letterSpacing: 0.3,
  },
  listContent: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(12),
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(1),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  userInfo: {
    marginLeft: wp(4),
    flex: 1,
  },
  usernameText: {
    color: 'white',
    fontWeight: '700',
    fontSize: hp(2.1),
  },
  subText: {
    color: 'rgba(156,163,175,0.9)',
    fontSize: hp(1.6),
    marginTop: hp(0.2),
  },
  unfollowBtn: {
    borderRadius: wp(2.5),
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    backgroundColor: '#FFFFFF',
    minWidth: wp(22),
    alignItems: 'center',
  },
  btnTextOutline: {
    color: '#111111',
    fontWeight: '700',
    fontSize: hp(1.6),
  },
  emptyText: {
    color: 'rgba(156,163,175,0.8)',
    fontSize: hp(2.1),
    textAlign: 'center',
    marginTop: hp(15),
    lineHeight: hp(3),
  },
  errorText: {
    color: '#EF4444',
    fontSize: hp(2),
  },
});
