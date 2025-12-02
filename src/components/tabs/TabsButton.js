import React, { useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Text } from 'react-native';

import { Button } from '../buttons';
import { scale } from '@resolutions';
import { colors, fontSize } from '@themes';

const { width } = Dimensions.get('window');

const TabsButton = ({ data, selected, onSelect, style, tabWidth }) => {
    const flatListRef = useRef(null);

    const _keyExtractor = (item, index) => `${item.id}-${index}`;

    const _renderItem = ({ item }) => {
        let isSelected = item.id === selected.id;
        return (
            <Button
                key={item.id}
                style={[styles.btn, { width: width / tabWidth }, isSelected && styles.btnActive]}
                onPress={() => {
                    onSelect(item);
                    const index = data.findIndex((i) => i.id === item.id);
                    flatListRef.current.scrollToIndex({ index, animated: true });
                }}
            >
                <Text style={isSelected ? styles.textActive : styles.text}>
                    {item.label}
                </Text>
            </Button>
        );
    };

    return (
        <View style={[styles.container, style]}>
            <FlatList
                ref={flatListRef}
                data={data}
                horizontal
                keyExtractor={_keyExtractor}
                renderItem={_renderItem}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: scale(8),
        backgroundColor: colors.white,
    },
    btn: {
        paddingHorizontal: scale(10),
        paddingVertical: scale(6)
    },
    btnActive: {
        backgroundColor: colors.blue,
        marginVertical: scale(2),
        borderRadius: scale(6),
        marginLeft: scale(2),
        paddingHorizontal: scale(8),
        paddingVertical: scale(6)
    },
    textActive: {
        fontFamily: 'Inter-SemiBold',
        fontWeight: '600',
        color: colors.white,
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        textAlign: 'center'
    },
    text: {
        fontWeight: '400',
        color: '#525252',
        fontSize: fontSize.size14,
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        textAlign: 'center'
    },
});

export default TabsButton;
