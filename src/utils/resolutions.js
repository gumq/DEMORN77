import { StatusBar, Platform, Dimensions } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';

const { height, width } = Dimensions.get('window');
const guidelineBaseWidth = width;
const guidelineBaseHeight = height;
const standardLength = width > height ? width : height;
const offset =
  width > height ? 0 : Platform.OS === 'ios' ? 78 : StatusBar.currentHeight;

const deviceHeight =
  isIphoneX() || Platform.OS === 'android'
    ? standardLength - offset
    : standardLength;

export const RFPercentage = percent => {
  const heightPercent = (percent * deviceHeight) / 100;
  return Math.round(heightPercent);
};

// fontSize,...
export const RFValue = (fontSize, standardScreenHeight = height) => {
  const heightPercent = (fontSize * deviceHeight) / standardScreenHeight;
  return Math.round(heightPercent);
};

// padding, margin, fontSize, ...
export const scale = size => (width / guidelineBaseWidth) * size;

// width
export const wScale = size => (height / guidelineBaseHeight) * size;

// height
export const hScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;
