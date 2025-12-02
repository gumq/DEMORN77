import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { Notifier } from 'react-native-notifier';
import { colors, fontSize } from 'themes';
import { scale } from 'utils/resolutions';

if (Platform.OS === 'android') {
  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor('transparent');
}

const NotifierAlert = (duration, title, message, type) => {
  const CustomComponent = ({ title, description }) => (
    <View
      style={[
        styles.container,
        {
          backgroundColor: type === 'error' ? '#f2230c' : '#56db09',
          paddingTop:
            Platform.OS === 'android'
              ? StatusBar.currentHeight || scale(24)
              : 44,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          paddingBottom: scale(16),
        },
      ]}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );

  Notifier.showNotification({
    duration,
    Component: CustomComponent,
    componentProps: {
      title,
      description: message,
    },
  });
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(16),
  },
  title: {
    color: colors.white,
    fontSize: fontSize.size16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(24),
    textAlign: 'center',
  },
  description: {
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    color: colors.white,
    fontSize: fontSize.size14,
    lineHeight: scale(22),
    textAlign: 'center',
    marginTop: scale(4),
  },
});

export default NotifierAlert;
