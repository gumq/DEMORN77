import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity,Text } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { colors, fontSize } from '@themes';
import { scale } from '@resolutions';
import { radio, radio_active } from '@svgImg';

const RadioButton = ({
    data,
    style,
    setValue,
    initialValue,
    column,
    disable
}) => {
    const [selectedItem, setSelectedItem] = useState(initialValue);

    const handleSelection = (item) => {
        setValue(item)
        setSelectedItem(item);
    };

    return (
        <View {...{ style }}>
            <View style={
                [
                    styles.row,
                    {
                        flexDirection: column ? 'column' : 'row'
                    }
                ]
            }>
                {data.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={
                            [
                                styles.card,
                                {
                                    paddingVertical: column ? scale(4) : scale(8)
                                }
                            ]
                        }
                        onPress={() => handleSelection(item)}
                        disabled={disable}
                    >
                        {selectedItem?.id === item?.id ? (
                            <SvgXml xml={radio_active} />
                        ) : (
                            <SvgXml xml={radio} />
                        )}
                        <Text bold style={styles.title}>
                            {item.value}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        borderRadius: scale(12),
        backgroundColor: colors.white,
        flexDirection: 'row',
    },
    card: {
        flexDirection: 'row',
        paddingVertical: scale(8),
        flex: 1
    },
    title: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        marginLeft: scale(4),
    },
});

export default RadioButton;
