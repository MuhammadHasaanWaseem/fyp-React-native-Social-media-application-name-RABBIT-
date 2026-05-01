import { StyleSheet, Dimensions, Platform } from 'react-native';
import { wp, hp } from '@/lib/helper';

const { width } = Dimensions.get('window');

const hairline = StyleSheet.hairlineWidth;

export const drawerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08080f',
    paddingHorizontal: wp(5),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.75),
    marginTop: hp(1),
    marginBottom: hp(0.5),
    borderBottomWidth: hairline,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backButton: {
    padding: wp(2.25),
    borderRadius: wp(3),
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  headerTitle: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: hp(2.35),
    fontWeight: '600',
    marginLeft: wp(3),
    letterSpacing: -0.2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    marginBottom: hp(1.5),
    borderBottomWidth: hairline,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  profileAvatarWrap: {
    marginRight: wp(3.5),
  },
  profileTextCol: {
    flex: 1,
    minWidth: 0,
  },
  profileName: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: hp(2.05),
    fontWeight: '600',
    letterSpacing: -0.15,
  },
  profileMeta: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: hp(1.55),
    marginTop: hp(0.35),
    fontWeight: '400',
  },
  sectionBlock: {
    marginBottom: hp(2.75),
  },
  sectionLabel: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: hp(1.25),
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
    marginBottom: hp(1),
    marginLeft: wp(0.5),
  },
  group: {
    borderRadius: wp(3),
    backgroundColor: 'rgba(255,255,255,0.035)',
    borderWidth: hairline,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(1.85),
    paddingHorizontal: wp(4),
    minHeight: hp(5.5),
  },
  menuRowDivider: {
    borderBottomWidth: hairline,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  menuText: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: hp(1.95),
    fontWeight: '500',
    letterSpacing: -0.1,
    flex: 1,
    paddingRight: wp(2),
  },
  menuTextDanger: {
    color: 'rgba(248,113,113,0.92)',
  },
  chevron: {
    opacity: 0.28,
  },
  menuItemsContainer: {
    paddingBottom: hp(10),
    paddingTop: hp(0.5),
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
