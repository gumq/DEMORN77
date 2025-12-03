import {Dimensions, StyleSheet} from 'react-native';
import {hScale, scale, wScale} from '@resolutions';
import {colors, fontSize} from '@themes';

const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: colors.graySystem2,
  },
  containerBody: {
    height: '100%',
  },
  btnAdd: {
    position: 'absolute',
    zIndex: 1,
    bottom: scale(16),
    right: scale(10),
    height: hScale(38),
    width: wScale(38),
    backgroundColor: colors.blue,
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const stylesAllApproval = StyleSheet.create({
  scrollview: {
    marginBottom: scale(120),
  },
  imgEmpty: {
    alignSelf: 'center',
    marginTop: scale(24),
  },
  txtHeaderNodata: {
    color: colors.black,
    fontSize: fontSize.size16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    alignSelf: 'center',
    fontStyle: 'normal',
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
    color: '#525252',
  },
  imgEmpty: {
    alignSelf: 'center',
    marginTop: scale(24),
  },
});

const stylesAddPlan = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: colors.graySystem2,
    height: height,
  },
  header: {
    fontSize: fontSize.size16,
    fontWeight: '600',
    lineHeight: scale(24),
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
    marginTop: scale(12),
    marginHorizontal: scale(12),
    marginBottom: scale(4),
  },
  card: {
    backgroundColor: colors.graySystem2,
    paddingBottom: scale(8),
  },
  inputAuto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: scale(4),
  },
  widthInput: {
    flex: 1,
    marginHorizontal: scale(12),
  },
  input: {
    marginHorizontal: scale(12),
    marginVertical: scale(4),
  },
  inputFormDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: scale(4),
  },
  btnConfirm: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
    borderRadius: scale(8),
    height: hScale(38),
    marginTop: scale(12),
    marginBottom: scale(12),
    marginHorizontal: scale(12),
  },
  txtBtnConfirm: {
    color: colors.white,
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(22),
  },
  imgBox: {
    marginLeft: scale(12),
    marginTop: scale(8),
  },
  headerBoxImage: {
    fontSize: fontSize.size14,
    lineHeight: scale(22),
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: colors.black,
  },
});

const stylesFormDetail = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: colors.graySystem2,
    height: height,
  },
  containerFlat: {
    paddingBottom: scale(100),
  },
  header: {
    fontSize: fontSize.size16,
    fontWeight: '600',
    lineHeight: scale(24),
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
    marginTop: scale(12),
    marginHorizontal: scale(12),
    marginBottom: scale(4),
  },
  card: {
    paddingBottom: scale(8),
    marginHorizontal: scale(12),
    marginTop: scale(8),
    borderRadius: scale(8),
  },
  row: {
    borderColor: colors.borderColor,
    borderWidth: scale(1),
    width: '100%',
    borderRadius: scale(8),
    marginBottom: scale(8),
    backgroundColor: colors.white,
    marginBottom: scale(8),
  },
  cellDate: {
    fontSize: fontSize.size14,
    fontWeight: '700',
    lineHeight: scale(20),
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    backgroundColor: '#E5E7EB',
    padding: scale(8),
    borderTopLeftRadius: scale(8),
    borderTopRightRadius: scale(8),
  },
  cellPicker: {
    fontSize: fontSize.size12,
    fontWeight: '400',
    lineHeight: scale(18),
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    backgroundColor: colors.white,
    padding: scale(8),
    borderTopWidth: scale(1),
    borderBottomWidth: scale(1),
    borderColor: colors.borderColor,
    alignContent: 'center',
  },
  cellCustomers: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: scale(4),
    borderBottomLeftRadius: scale(8),
    borderBottomRightRadius: scale(8),
  },
  customerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  customerText: {
    fontSize: fontSize.size12,
    fontWeight: '400',
    lineHeight: scale(18),
    fontFamily: 'Inter-Regular',
    color: colors.black,
    paddingLeft: scale(8),
    width: '80%',
    overflow: 'hidden',
  },
  btnRemove: {
    paddingRight: scale(8),
  },
  containerBtnConfirm: {
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: 0,
    paddingTop: scale(8),
    paddingHorizontal: scale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: scale(1),
    borderTopColor: colors.borderColor,
    paddingBottom: scale(8),
    width: '100%',
  },
  btnSave: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: scale(1),
    borderColor: colors.borderColor,
    borderRadius: scale(8),
    borderRadius: scale(8),
    height: hScale(38),
    width: '48%',
  },
  txtBtnSave: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(22),
  },
  btnConfirm: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
    borderRadius: scale(8),
    height: hScale(38),
    width: '48%',
  },
  txtBtnConfirm: {
    color: colors.white,
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(22),
  },
});

export {styles, stylesAllApproval, stylesAddPlan, stylesFormDetail};
