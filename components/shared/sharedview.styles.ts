import { StyleSheet } from 'react-native';
import { wp, hp } from '@/lib/helper';

export const sharedViewStyles = StyleSheet.create({
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: wp(2.5),
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    marginTop: hp(1.25),
    borderRadius: wp(2.5),
  },
  audiospoiler: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  videoControls: {
    position: 'absolute',
    gap: wp(1.5),
    left: wp(30),
    bottom: hp(0.75),
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  controlButton: {
    backgroundColor: '#2f2f2f',
    borderRadius: wp(12.5),
    padding: wp(0.5)
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBlur: {
    width: '90%',
    padding: wp(5),
    borderRadius: wp(5)
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: wp(5),
    padding: wp(5),
    alignItems: 'center'
  },
  modalTitle: {
    color: '#FF4500',
    fontSize: hp(2.75),
    fontWeight: 'bold',
    marginBottom: hp(1.25)
  },
  modalMessage: {
    color: 'white',
    fontSize: hp(2),
    textAlign: 'center',
    marginBottom: hp(2.5)
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  cancelButton: {
    paddingVertical: hp(1.25),
    paddingHorizontal: wp(5),
    borderRadius: wp(2.5),
    backgroundColor: '#444'
  },
  cancelButtonText: {
    color: 'white',
    fontSize: hp(2)
  },
  deleteButton: {
    paddingVertical: hp(1.25),
    paddingHorizontal: wp(5),
    borderRadius: wp(2.5),
    backgroundColor: '#FF4500'
  },
  deleteButtonText: {
    color: 'white',
    fontSize: hp(2),
    fontWeight: 'bold'
  },
  reportModalContainer: {
    backgroundColor: '#1a1a2e',
    borderRadius: wp(4),
    padding: wp(6),
    width: '100%',
    maxWidth: wp(85),
    borderWidth: 1,
    borderColor: 'rgba(255,69,0,0.3)',
  },
  reportModalHeader: {
    alignItems: 'center',
    marginBottom: hp(2.5),
  },
  reportModalIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: 'rgba(255,69,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  reportReasonButton: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    borderRadius: wp(2.5),
    backgroundColor: '#2d2d44',
    marginBottom: hp(1),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  reportReasonText: {
    color: 'white',
    fontSize: hp(2),
    fontWeight: '500',
  },
  reportCancelButton: {
    marginTop: hp(1.5),
    paddingVertical: hp(1.25),
    paddingHorizontal: wp(5),
    borderRadius: wp(2.5),
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#555',
    width: '100%',
    alignItems: 'center',
  },
});
