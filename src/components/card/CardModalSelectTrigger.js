import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {arrow_down} from 'svgImg';
import {colors, fontSize} from 'themes';
import {hScale, scale} from '@resolutions';

const CardModalSelectTrigger = ({
  title,
  value,
  onPress,
  bgColor = '#FFFFFF',
  require = false,
  disabled = false,
}) => {
  return (
    <View>
      {require ? (
        <View style={styles.containerRequire}>
          <Text style={styles.label}>{title}</Text>
          <Text style={styles.txtRequire}>*</Text>
        </View>
      ) : (
        <Text style={styles.label}>{title}</Text>
      )}

      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: bgColor,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}>
        <View style={styles.content}>
          <Text
            style={value ? styles.valueText : styles.placeholderText}
            numberOfLines={2}
            ellipsizeMode="tail">
            {value || title}
          </Text>
          <SvgXml xml={arrow_down} width={14} height={14} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontFamily: 'Inter-Medium',
    lineHeight: scale(22),
    marginBottom: scale(8),
  },
  container: {
    height: hScale(42),
    borderWidth: scale(1),
    borderColor: '#D1D3DB',
    borderRadius: scale(8),
    paddingHorizontal: scale(16),
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#9E9E9E',
    fontSize: fontSize.size14,
    fontFamily: 'Inter-Regular',
    flex: 1,
    marginRight: scale(8),
  },
  valueText: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontFamily: 'Inter-Regular',
    flex: 1,
    marginRight: scale(8),
  },
  containerRequire: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtRequire: {
    color: colors.red,
    marginLeft: scale(2),
    bottom: 4,
  },
});

export default React.memo(CardModalSelectTrigger);
