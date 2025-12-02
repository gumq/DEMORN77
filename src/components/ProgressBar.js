/* eslint-disable prettier/prettier */
import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ProgressBar = ({
  value = 0,
  total = 0,
  color = '#007AFF',
  height = 8,
  duration = 800,
  style,
}) => {
  const percent = total > 0 ? Math.max(0, Math.min(1, value / total)) : 0;

  // Animated value cho width
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Animated value cho sóng
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate tiến độ
    Animated.timing(animatedValue, {
      toValue: percent,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Loop animation sóng
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [percent]);

  // Translate sóng qua lại
  const translateX = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 50],
  });

  return (
    <View style={[styles.wrapper, {height, borderRadius: height / 2}, style]}>
      <Animated.View
        style={[
          styles.filler,
          {
            height,
            borderRadius: height / 2,
            backgroundColor: color,
            width: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
            overflow: 'hidden',
          },
        ]}>
        {/* Sóng gradient */}
        <Animated.View
          style={{
            flex: 1,
            transform: [{translateX}],
          }}>
          <LinearGradient
            colors={[color, `${color}99`, color]}
            start={{x: 0, y: 0.5}}
            end={{x: 1, y: 0.5}}
            style={{flex: 1}}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  filler: {
    height: '100%',
  },
});

export default ProgressBar;
