import { StyleSheet } from 'react-native';
import { wp, hp } from '@/lib/helper';

export const homeStyles = StyleSheet.create({
  listHeaderWrap: {
    backgroundColor: '#010118',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  listContent: {
    paddingBottom: hp(2),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3.5),
    paddingTop: hp(0.5),
    paddingBottom: hp(1),
  },
  headerSlot: {
    width: wp(26),
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSlotRight: {
    width: wp(26),
    justifyContent: 'flex-end',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogo: {
    width: wp(11),
    height: wp(11),
  },
  menuHit: {
    padding: wp(2.5),
    marginLeft: -wp(1),
  },
  headerProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2.5),
    paddingVertical: hp(0.6),
    paddingLeft: wp(1.5),
    paddingRight: wp(2),
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    maxWidth: wp(28),
  },
  headerProfileName: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 13,
    fontWeight: '600',
    maxWidth: wp(16),
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
  },
  composerAvatar: {
    borderWidth: 0,
  },
  composerBody: {
    flex: 1,
    marginLeft: wp(4.5),
    minWidth: 0,
  },
  composerName: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 2,
  },
  composerHint: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
  },
});
