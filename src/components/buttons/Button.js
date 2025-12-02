import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

const Button = ({ children, style, opacity = 0.5, disabled = false, ...rest }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[style, disabled && styles.disabledBtn, { opacity: disabled ? opacity : 1 }]}
      accessibilityState={{ disabled: !!disabled }}
      disabled={!!disabled}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  disabledBtn: {
    opacity: 0.5,
  },
});

export default Button;
