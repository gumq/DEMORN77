import {Dimensions, StyleSheet} from 'react-native';

import {scale} from '@resolutions';
import {colors, fontSize} from '@themes';

const {width} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  headerKPI: {
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginBottom: scale(8),
    lineHeight: scale(22),
    color: colors.black,
  },
  containerKPI: {
    marginHorizontal: scale(12),
    backgroundColor: colors.white,
    borderRadius: scale(12),
    padding: scale(8),
    shadowColor: colors.black,
    shadowRadius: scale(6),
    marginBottom: scale(8),
  },
  containerSearch: {
    width: '100%',
    marginVertical: scale(12),
  },
  search: {
    marginHorizontal: scale(12),
  },
  scrollView: {
    height: '100%',
  },
  parentMenuContainer: {
    marginHorizontal: scale(12),
    marginBottom: scale(12),
  },
  parentMenuTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: fontSize.size18,
    fontWeight: '600',
    lineHeight: scale(24),
    color: colors.black,
    marginBottom: scale(12),
  },
  childMenuList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  childMenuItem: {
    width: (width - 12) / 3 - 12,
    alignItems: 'center',
    backgroundColor: colors.white,
    marginBottom: scale(8),
    padding: scale(8),
    borderWidth: scale(1),
    borderColor: colors.borderColor,
    borderRadius: scale(8),
  },
  txtMenu: {
    fontFamily: 'Inter-SemiBold',
    fontSize: fontSize.size10,
    fontWeight: '600',
    lineHeight: scale(15),
    marginTop: scale(6),
    textAlign: 'center',
    color: colors.black,
  },
  rowStyle: {
    justifyContent: 'flex-start',
    gap: scale(12),
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: scale(12),
    paddingTop: scale(12),
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: scale(1),
    borderBottomColor: colors.graySystem2,
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(8),
    borderTopRightRadius: scale(8),
    paddingVertical: scale(10),
    paddingHorizontal: scale(12),
  },
  titleModal: {
    fontFamily: 'Inter-SemiBold',
    fontSize: fontSize.size16,
    lineHeight: scale(24),
    fontWeight: '600',
    color: colors.black,
    flex: 1,
    textAlign: 'center',
  },
  mrh8: {
    height: scale(40),
    width: '100%',
  },
});
