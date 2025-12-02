import React from 'react';
import {View, StyleSheet, TextInput, Text, Platform} from 'react-native';
import {SvgXml} from 'react-native-svg';

import {gps} from '@svgImg';
import Button from '../buttons/Button';
import {colors, fontSize} from '@themes';
import {hScale, scale} from '@resolutions';

const InputLocation = (
  {
    label,
    name,
    value,
    style,
    errors,
    touched,
    handleChange,
    handleBlur,
    placeholderInput,
    labelHolder,
    onPress,
    bgColor,
    height,
    textColor,
    disable,
    ...rest
  },
  ref,
) => {
  return (
    <View {...{style}}>
      {label && (
        <Text bold style={styles.label}>
          {label}
        </Text>
      )}
      <View>
        <TextInput
          ref={ref}
          {...rest}
          multiline={true}
          editable={!disable}
          value={value?.toString() || ''}
          autoCapitalize="none"
          style={styles.input}
          placeholder={placeholderInput ? labelHolder : ''}
          placeholderTextColor={colors.graySystem}
        />
        {placeholderInput && (
          <View style={styles.placeholder}>
            <Button
              disabled={disable}
              onPress={onPress}
              style={styles.btnShowPW}>
              <SvgXml width="16" height="16" xml={gps} />
            </Button>
          </View>
        )}
      </View>
      {errors && touched && touched[name] && errors[name] ? (
        <Text style={styles.error}>{errors[name]}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    color: colors.black,
    borderRadius: scale(8),
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
    height: hScale(Platform.OS==='android'?46: 38),
    marginTop: scale(8),
    borderWidth: scale(1),
    borderColor: '#D1D3DB',
    backgroundColor: colors.white,
    paddingHorizontal: scale(16),paddingTop:scale(Platform.OS==='android'?0: 8)
  },
  btnShowPW: {
    right: 0,
    bottom: Platform.OS === 'ios' ? -4 : -4,
    position: 'absolute',
    paddingVertical: scale(6),
    paddingHorizontal: scale(10),
  },
  label: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    fontSize: fontSize.size14,
    lineHeight: scale(22),
  },
  error: {
    fontSize: fontSize.size12,
    color: colors.redSystem,
    marginTop: scale(8),
  },
  placeholder: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    paddingHorizontal: scale(8),
    bottom: scale(8),
    width: '100%',
  },
});

export default InputLocation;
