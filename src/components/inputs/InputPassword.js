import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { eye, eye_off } from '@svgImg'
import Button from '../buttons/Button';
import { colors, fontSize } from '@themes';
import { hScale, scale } from '@resolutions';

const InputPassword = (
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
    height,
    ...rest
  },
  ref,
) => {
  const [secureText, setSecureText] = useState(true);

  const handleShowPassword = () => {
    setSecureText(prev => !prev);
  };

  return (
    <View {...{ style }}>
      {label && (
        <Text bold style={styles.label}>
          {label}
        </Text>
      )}
      <View>
        <TextInput
          ref={ref}
          {...rest}
          value={value}
          autoCapitalize="none"
          style={[styles.input, { height: height ? height : hScale(38) }]}
          onBlur={handleBlur(name)}
          secureTextEntry={secureText}
          onChangeText={handleChange(name)}
          placeholder={placeholderInput ? labelHolder : ''}
          placeholderTextColor={colors.graySystem}
        />
        {placeholderInput && (
          <View style={styles.placeholder}>
            <Button onPress={handleShowPassword} style={styles.btnShowPW}>
              <SvgXml width="16" height="16" xml={secureText ? eye_off : eye} />
            </Button>
          </View>

        )}
      </View>
      {errors && touched && touched[name] && errors[name] && (
        <Text style={styles.error}>{errors[name]}</Text>
      )}
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
    height: hScale(46),
    marginTop: scale(8),
    borderWidth: scale(1),
    borderColor: '#D1D3DB',
    backgroundColor: '#F9F9FB',
    paddingHorizontal: scale(16),
  },
  btnShowPW: {
    position: 'absolute',
    right: scale(4),
    top: '50%',
    transform: [{ translateY: -hScale(10) }],
    paddingVertical: scale(6),
    paddingHorizontal: scale(10),
  },
  label: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    lineHeight: scale(22),
  },
  error: {
    fontSize: fontSize.size12,
    color: colors.redSystem,
    marginTop: scale(8),
  },
  placeholder: {
    position: 'absolute',
    right: scale(4),
    top: '50%',
  },
});

export default React.forwardRef(InputPassword);
