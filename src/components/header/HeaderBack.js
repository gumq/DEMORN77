import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { scale, hScale } from '@resolutions';
import { colors, fontSize } from 'themes';
import { arrow_blue } from '@svgImg';
import { Button } from '../buttons';
import { isIphoneX } from 'react-native-iphone-x-helper';

const HeaderBack = ({
    title,
    onPress,
    btn,
    iconBtn,
    titleBtn,
    onPressBtn,
}) => {

    return (
        <View style={[styles.container, {height: title?.length > 30 ? hScale(80) : hScale(54)}]}>
            {onPress ?
                <Button onPress={onPress} style={styles.btnMenu}>
                    <SvgXml xml={arrow_blue} />
                </Button> :
                <View style={styles.btnMenu} />
            }

            <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={styles.title}>
                {title}
            </Text>
            {btn ?
                <Button onPress={onPressBtn} style={styles.btnMenu}>
                    {titleBtn ?
                        <Text style={titleBtn ? styles.txtBtn : styles.txtBtn24}>{titleBtn}</Text>
                        :
                        <SvgXml xml={iconBtn} />
                    }
                </Button>
                : <View style={styles.btnMenu} />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: scale(5),
        paddingRight: scale(10),
        marginTop: isIphoneX ? scale(0) : scale(40),
        height: hScale(54),
        backgroundColor: colors.white
    },
    title: {
        color: colors.black,
        fontSize: fontSize.size16,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(24),
        textAlign: 'center',
        overflow: 'hidden',
        width: '80%'
    },
    btnMenu: {
        padding: scale(10),
    },
    txtBtn: {
        color: colors.white,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        textAlign: 'center',
        overflow: 'hidden',
        width: '80%'
    },
    txtBtn24: {
        width: scale(24)
    }
});

export default HeaderBack;
