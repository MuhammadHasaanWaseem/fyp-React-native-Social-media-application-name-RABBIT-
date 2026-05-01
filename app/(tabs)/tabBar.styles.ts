import { Platform, StyleSheet } from 'react-native';

/** Lucide icon size for side tabs */
export const TAB_ICON_SIZE = 26;
/** Plus icon inside compose */
export const TAB_COMPOSE_ICON_SIZE = 26;
/** Compose circle diameter */
export const TAB_COMPOSE_BTN_SIZE = 52;

export const tabBarColors = {
  bg: '#010118',
  border: 'rgba(255,255,255,0.07)',
  inactive: 'rgba(255,255,255,0.38)',
  active: 'rgba(255,255,255,0.92)',
  composeBg: 'rgba(255,255,255,0.06)',
  composeBorder: 'rgba(255,255,255,0.14)',
  composeIcon: 'rgba(255,255,255,0.88)',
  indicator: 'rgba(255,255,255,0.35)',
};

export const tabBarStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: tabBarColors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: tabBarColors.border,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 14,
    paddingHorizontal: 4,
    minHeight: Platform.OS === 'ios' ? 64 : 62,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  activeIndicator: {
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: tabBarColors.indicator,
    marginTop: 6,
  },
  tabBarItem: {
    paddingVertical: 6,
  },
  composeOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  composeBtn: {
    width: TAB_COMPOSE_BTN_SIZE,
    height: TAB_COMPOSE_BTN_SIZE,
    borderRadius: TAB_COMPOSE_BTN_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: tabBarColors.composeBorder,
    backgroundColor: tabBarColors.composeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
