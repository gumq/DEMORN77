import React from 'react';
import {View, StyleSheet, TextInput, Text} from 'react-native';

import {colors, fontSize} from '@themes';
import {scale} from '@resolutions';

const InputLogin = (
  {
    value,
    label,
    name,
    style,
    errors,
    touched,
    handleChange,
    handleBlur,
    placeholderInput,
    labelHolder,
    ...rest
  },
  ref,
) => {
  return (
    <View {...{style}}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View>
        <TextInput
          ref={ref}
          {...rest}
          value={value}
          autoCapitalize="none"
          style={styles.input}
          onBlur={handleBlur(name)}
          onChangeText={handleChange(name)}
          placeholder={placeholderInput ? labelHolder : ''}
          placeholderTextColor={colors.graySystem}
        />
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
    marginTop: scale(8),
    borderWidth: scale(1),
    borderColor: '#D1D3DB',
    backgroundColor: '#F9F9FB',
    paddingHorizontal: scale(16),
    paddingVertical: scale(5),
    textAlignVertical: 'center',
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
});

export default React.forwardRef(InputLogin);
