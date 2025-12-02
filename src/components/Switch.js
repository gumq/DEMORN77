import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { hScale, scale, wScale } from '@resolutions';

const defaultStyles = {
    bgGradientColors: ['#E5E6EB', '#E5E6EB'],
    headGradientColors: ['#ffffff', '#ffffff'],
};

const activeStyles = {
    bgGradientColors: ['#3B82F6', '#3B82F6'],
    headGradientColors: ['#ffffff', '#ffffff'],
};

const Switch = ({ value, onValueChange }) => {
    const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: value ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [value]);

    const translateX = animatedValue.interpolate({
        inputRange: [-0.1, 1],
        outputRange: [6, 28],
    });

    const toggleSwitch = () => {
        const newValue = !value;
        onValueChange(newValue);
    };

    const currentStyles = value ? activeStyles : defaultStyles;

    return (
        <Pressable onPress={toggleSwitch} style={styles.pressable}>
            <LinearGradient
                colors={currentStyles.bgGradientColors}
                style={styles.backgroundGradient}
                start={{
                    x: 0,
                    y: 0.5,
                }}>
                <View style={styles.innerContainer}>
                    <Animated.View
                        style={{
                            transform: [{ translateX }],
                        }}>
                        <LinearGradient
                            colors={currentStyles.headGradientColors}
                            style={styles.headGradient}
                        />
                    </Animated.View>
                </View>
            </LinearGradient>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressable: {
        width: wScale(44),
        height: hScale(24),
        borderRadius: scale(16),
    },
    backgroundGradient: {
        borderRadius: scale(16),
        flex: 1,
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        position: 'relative',
    },
    headGradient: {
        width: wScale(20),
        height: hScale(20),
        borderRadius: scale(100),
        right: 6
    },
});

export default Switch;

