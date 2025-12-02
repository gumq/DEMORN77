import { Platform } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { isTablet } from 'react-native-device-info';

/**
 * @param {Object} styles - StyleProp
 * @param {ViewStyle} styles.tablet - Styles for tablet
 * @param {ViewStyle} styles.iPad - Styles for iPad
 * @param {ViewStyle} styles.iPhoneX - Styles for iPhoneX
 * @param {ViewStyle} styles.base - Styles for base
 */
const StylePlatforms = styles => {
  let style = null;
  if (isTablet()) {
    style = styles?.tablet;
  }
  if (Platform.isPad) {
    style = styles?.iPad;
  }
  if (isIphoneX()) {
    style = styles?.iPhoneX;
  }
  return style || styles?.base || {};
};

export default StylePlatforms;
