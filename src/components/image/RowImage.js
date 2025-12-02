import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';

import { Button } from '../buttons';
import { colors } from '@themes';
import { hScale, scale } from '@resolutions';

const { width } = Dimensions.get('window');

const RowImage = ({ item, hasRemove, pressImage }) => {

    return (
        <View style={styles.boxImage}>
            <Button style={styles.viewImage} onPress={pressImage}>
                {item ? (
                    <Image
                        source={{ uri: item }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.mockupImage} />
                )}
            </Button>
            {hasRemove ? (
                <View style={styles.infoImage}>
                    <Button style={styles.btnRemove} onPress={alertDelete}>
                    </Button>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    boxImage: {
        width: width / 3 - 22,
        height: hScale(98),
        marginTop: scale(6),
        backgroundColor: colors.white,
        borderRadius: scale(8)
    },
    viewImage: {
        width: '100%',
        height: hScale(98),
    },
    image: {
        width: width / 3 - 22,
        height: hScale(98),
        borderRadius: scale(8)
    },
    mockupImage: {
        width: width / 3 - 22,
        height: hScale(98),
        borderRadius: scale(8),
        backgroundColor: colors.systemGray2_1,
    },
    infoImage: {
        alignItems: 'flex-end',
    },
    btnRemove: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(8),
        paddingTop: scale(8),
        paddingBottom: scale(4),
    },
});

export default RowImage;

