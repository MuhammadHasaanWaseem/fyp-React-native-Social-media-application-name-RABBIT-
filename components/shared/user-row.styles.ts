import { StyleSheet } from 'react-native';

export const userRowStyles = StyleSheet.create({
  row: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressable: {
    flex: 1,
    minWidth: 0,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    gap: 12,
  },
  username: {
    color: 'white',
    fontWeight: '700',
  },
  nickname: {
    color: 'white',
    fontSize: 10,
  },
  divider: {
    borderWidth: 1,
    borderColor: 'grey',
    marginTop: 5,
  },
});
