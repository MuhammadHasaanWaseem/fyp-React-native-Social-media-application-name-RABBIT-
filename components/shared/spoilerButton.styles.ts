import { StyleSheet } from 'react-native';
import { wp, hp } from '@/lib/helper';

export const spoilerButtonColors = {
  bg: '#E5E7EB',
  text: '#1F2937',
  icon: '#4B5563',
} as const;

export const spoilerButtonStyles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.1),
    backgroundColor: spoilerButtonColors.bg,
    borderRadius: wp(3),
    borderWidth: 0,
  },
  iconGap: {
    marginRight: wp(2),
  },
  text: {
    color: spoilerButtonColors.text,
    fontWeight: '600',
    fontSize: hp(1.5),
  },
});
