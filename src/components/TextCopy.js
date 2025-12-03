/* eslint-disable prettier/prettier */
/* eslint-disable quotes */

import React, {useRef, useCallback} from 'react';
import {
  Text as RNText,
  StyleSheet,
  Platform,
  Pressable,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {scale} from '@utils/resolutions';;
import {fontSize} from '@themes';
import NotifierAlert from './NotifierAlert';

const TextCopy = ({
  bold = false,
  style,
  children = '',
  copyText,
  delay = 800,
  ...rest
}) => {
  const timerRef = useRef(null);
  const handleLongPress = useCallback(() => {
    const textToCopy =
      typeof copyText === 'string' ? copyText : String(children ?? '');
    Clipboard.setString(textToCopy);

    // 🔔 Gọi NotifierAlert thông báo
     NotifierAlert(3000, children, 'Sao chép thành công', 'success');
  }, [children, copyText]);

  return (
    <Pressable style={{flex:0.9,alignItems:'flex-end'}}onLongPress={handleLongPress} delayLongPress={delay}>
      <RNText
        {...rest}
        style={style}
        selectable={true}
      >
        {children ?? ''}
      </RNText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: fontSize.size14,
    lineHeight: scale(20),
    color: '#000',
  },
  bold: {
    fontWeight: '600',
    ...Platform.select({
      android: {},
      ios: {},
    }),
  },
});

export default React.memo(TextCopy);
