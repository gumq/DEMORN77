/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {checkbox, checkbox_active} from 'svgImg';
import {colors, fontSize} from 'themes';
import {scale} from 'utils/resolutions';

const ToggleCheckBox = ({label, value, onChange, disable = false}) => {
  return (
    <TouchableOpacity
      disabled={disable}
      onPress={() => onChange(!value)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scale(8),
      }}>
      <SvgXml
        xml={
          value
            ? checkbox_active
            : disable === false
            ? checkbox
            : checkbox?.replace('white', colors.gray300)
        }
        width={scale(22)}
        height={scale(22)}
      />
      <Text
        style={{
          marginLeft: scale(10),
          fontSize: fontSize.size14,
          color: '#000',
          lineHeight: scale(22),
          fontWeight: '500',
          fontFamily: 'Semi-Medium',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default ToggleCheckBox;
