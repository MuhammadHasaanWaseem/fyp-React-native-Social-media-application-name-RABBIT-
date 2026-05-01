import { StyleSheet } from 'react-native';

export const policyStyles = StyleSheet.create({
  scroll: { backgroundColor: '#010118' },
  content: { padding: 20, paddingBottom: 20 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 30,
  },
  headerTitle: {
    color: '#FF4500',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sectionCard: {
    backgroundColor: '#010118',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  sectionTitleActive: { fontWeight: 'bold' as const },
  sectionBody: { color: '#FF4500', marginTop: 10, lineHeight: 22 },
  contactCard: {
    backgroundColor: '#010118',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  contactTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: '80%',
    textAlign: 'center',
  },
  contactBody: { color: 'white', lineHeight: 22, textAlign: 'center' },
});
