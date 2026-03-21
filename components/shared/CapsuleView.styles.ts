import { StyleSheet } from 'react-native';
import { wp, hp } from '@/lib/helper';

export const capsuleViewStyles = StyleSheet.create({
  container: {
    padding: wp(2.5),
    paddingBottom: hp(25),
    backgroundColor: '#010118',
  },
  card: {
    backgroundColor: '#010118',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: wp(2.5),
  },
  header: {
    alignItems: 'center',
  },
  avatar: {
    borderColor: 'white',
    backgroundColor: 'white',
  },
  username: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 17,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
  },
  blurContainer: {
    borderRadius: wp(4),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.3)',
    backgroundColor: '#010118',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(4),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.3)',
    backgroundColor: 'rgba(1,1,24,0.5)',
  },
  lockedContent: {
    marginLeft: wp(15),
    marginBottom: hp(2.5),
  },
  blurInner: {
    padding: wp(2.5),
    alignItems: 'center',
  },
  blurTitle: {
    color: 'white',
    marginTop: hp(1.25),
    fontSize: 16,
    fontWeight: '600',
  },
  blurSubtext: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: hp(0.6),
    fontSize: 14,
  },
  timeLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginTop: hp(1.25),
  },
  contentArea: {
    marginLeft: wp(15),
    marginBottom: hp(2.5),
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#010118',
    borderRadius: wp(2.5),
    marginTop: hp(0.6),
  },
  audiospoiler: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#010118',
  },
  image: {
    height: hp(18.5),
    width: wp(50),
    marginTop: hp(0.6),
    borderRadius: wp(2.5),
    borderWidth: 1,
    borderColor: 'black',
  },
  video: {
    height: hp(37),
    marginTop: hp(0.6),
    width: wp(50),
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: wp(2.5),
  },
  videoControls: {
    position: 'absolute',
    gap: wp(1.5),
    left: wp(30),
    bottom: hp(0.75),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    backgroundColor: '#2f2f2f',
    borderRadius: wp(12.5),
    padding: wp(0.5),
  },
  actionsRow: {
    paddingTop: hp(2),
    alignItems: 'center',
    gap: wp(2),
  },
  actionText: {
    color: 'white',
    marginLeft: 4,
  },
  noPostsText: {
    color: 'white',
    textAlign: 'center',
    marginTop: hp(60),
    fontSize: hp(2),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBlur: {
    width: '90%',
    padding: wp(5),
    borderRadius: wp(5),
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: wp(5),
    padding: wp(5),
    alignItems: 'center',
  },
  modalTitle: {
    color: '#FF4500',
    fontSize: hp(2.75),
    fontWeight: 'bold',
    marginBottom: hp(1.25),
  },
  modalMessage: {
    color: 'white',
    fontSize: hp(2),
    textAlign: 'center',
    marginBottom: hp(2.5),
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cancelButton: {
    paddingVertical: hp(1.25),
    paddingHorizontal: wp(5),
    borderRadius: wp(2.5),
    backgroundColor: '#444',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: hp(2),
  },
  deleteButton: {
    paddingVertical: hp(1.25),
    paddingHorizontal: wp(5),
    borderRadius: wp(2.5),
    backgroundColor: '#FF4500',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: hp(2),
    fontWeight: 'bold',
  },
});
