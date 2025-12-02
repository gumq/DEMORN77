import { RFValue } from '@resolutions';
import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export default {
  size9: RFValue(9, height),
  size10: RFValue(10, height),
  size12: RFValue(12, height),
  size13: RFValue(13, height),
  size14: RFValue(14, height),
  size15: RFValue(15, height),
  size16: RFValue(16, height),
  size18: RFValue(18, height),
  size20: RFValue(20, height),
};

