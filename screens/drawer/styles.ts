import { StyleSheet, Dimensions, Platform } from 'react-native';
import { wp, hp } from '@/lib/helper';

const { width } = Dimensions.get('window');

export const drawerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a14',
    paddingHorizontal: wp(5),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    marginBottom: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backButton: {
    padding: wp(2.5),
    borderRadius: wp(4),
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: hp(2.8),
    fontWeight: '800',
    marginLeft: wp(3),
    letterSpacing: 0.3,
  },
  profileCard: {
    backgroundColor: 'rgba(26,26,46,0.6)',
    borderRadius: wp(5),
    padding: wp(6),
    alignItems: 'center',
    marginBottom: hp(2.5),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  avatar: {
    borderWidth: 2,
    borderColor: '#FF4500',
  },
  username: {
    color: '#FFFFFF',
    fontSize: hp(2.4),
    fontWeight: '700',
    marginTop: hp(1.5),
  },
  infoText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: hp(1.7),
    marginTop: hp(0.5),
    textAlign: 'center',
    paddingHorizontal: wp(2),
  },
  sectionLabel: {
    color: 'rgba(255,69,0,0.9)',
    fontSize: hp(1.4),
    fontWeight: '700',
    marginTop: hp(2.5),
    marginBottom: hp(1.2),
    marginLeft: wp(1),
    letterSpacing: 1.2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderRadius: wp(4),
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: hp(1),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: hp(2),
    fontWeight: '600',
    marginLeft: wp(3),
  },
  menuItemsContainer: {
    paddingBottom: hp(10),
  },
  footer: {
    alignItems: 'center',
    paddingVertical: hp(4),
  },
  image: {
    width: width * 0.1,
    height: width * 0.1,
    opacity: 0.8,
  },
});
