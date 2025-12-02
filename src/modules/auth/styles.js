import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors, fontSize } from '../../themes';
import { scale, hScale } from '../../utils/resolutions';

const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  imgBackground: {
    height: Platform.OS==='android'? height / 3.5:height/3.5,
    width: '100%',
    resizeMode: 'cover',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  labelHeader: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(46),
    marginHorizontal: scale(12),
    overflow: 'hidden',
    maxWidth: '65%', 
    marginBottom: scale(16),
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.white
  },
  inputContainer: {
     marginTop: scale(Platform.OS==='android'?0: -30),
  },
  bodyInput: {
    marginHorizontal: scale(16),
  },
  input: {
    marginBottom: scale(16),
  },
  btnLogin: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(8),
    height: hScale(38),
    backgroundColor: '#3B82F6',
  },
  textLoginBtn: {
    color: colors.white,
    fontWeight: '600',
    fontSize: fontSize.size16,
    fontFamily: 'Inter-SemiBold',
  },
  btnNext: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(8),
    height: hScale(38),
    marginTop: scale(16),
    backgroundColor: '#3B82F6',
  },
});
