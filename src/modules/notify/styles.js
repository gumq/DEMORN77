import { StyleSheet, Dimensions } from 'react-native';

import { colors, fontSize } from '../../themes';
import { scale } from '../../utils/resolutions';

const { height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: colors.graySystem2
  },
  containerBody: {
    height: '100%',
  }, ingBottom: scale(100),

  rowContainer: {
    marginHorizontal: scale(16),
    marginTop: scale(8)
  },
  header: {
    marginTop: scale(16),
    marginLeft: scale(16)
  },
  txtHeader: {
    fontFamily: 'Inter-SemiBold',
    fontSize: fontSize.size16,
    lineHeight: scale(24),
    fontWeight: '600',
    color: colors.black
  },
  flatlist: {
    marginBottom: scale(200)
  },
  txtHeader_two: {
    color: colors.black,
    fontSize: scale(16),
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    alignSelf: 'center',
    fontStyle: 'normal',
    lineHeight: scale(24),
    marginTop: scale(16),
  },
  txtHeaderNodata: {
    color: colors.black,
    fontSize: fontSize.size16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    alignSelf: 'center',
    lineHeight: scale(24),
    marginTop: scale(16),
  },
  txtContent: {
    marginTop: scale(4),
    alignSelf: 'center',
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    fontSize: fontSize.size14,
    lineHeight: scale(22),
    color: '#525252'
  },
  imgEmpty: {
    alignSelf: 'center',
    marginTop: scale(24)
  },
  scroll: {
    marginBottom: scale(108)
  },
  modal: {
    margin: 0,
  },
  modalBody: {
    backgroundColor: colors.white,
    marginHorizontal: scale(10),
    paddingVertical: scale(8),
    borderRadius: scale(8),
    paddingHorizontal: scale(5),
  },
  labelModalContainer: {
    width: '78%',
  },
  contentModalContainer: {
    paddingHorizontal: scale(10),
  },
  closeModalBtn: {
    alignSelf: 'flex-end',
  },
  titleDetailNoti: {
    color: colors.red,
    fontSize: fontSize.size16,
  },
  timeDetailNoti: {
    color: colors.red,
    fontSize: fontSize.size14,
    fontStyle: 'italic',
  },
  titleContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(10),
  },
  imgContainer: {
    width: '20%',
    marginRight: scale(6),
  },
  iconDetail: {
    width: '100%',
    aspectRatio: 192 / 184,
  },
  contentDetailNoti: {
    color: colors.black,
    fontSize: fontSize.size14,
    marginVertical: scale(6),
  },
});
