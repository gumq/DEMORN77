import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { colors, fontSize } from '@themes';
import { scale } from '@resolutions';
import { radio, radio_active } from '@svgImg';

const RadioProvince = ({
    data,
    style,
    isDisabled,
    handleCloseModal,
    setValue,
    optree,
    optreeValue,
    opstreeNameStatus,
    cacheSelectTree,
    opreportDT
}) => {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleSelection = (item) => {
        if (!isDisabled) {
            setValue(item)
            handleCloseModal();
            setSelectedItem(item);
        }
    };

    return (
        <View {...{ style }}>
            <View style={styles.row}>
                {data.map((item, index) => (
                    <TouchableOpacity
                        key={item.ID || item?.Version}
                        disabled={isDisabled}
                        style={index === data.length - 1 ? styles.cardNoBorder : styles.card}
                        onPress={() => handleSelection(item)}
                    >
                        <Text bold style={styles.title}>
                            {opreportDT === true ? item?.EntryName : opstreeNameStatus === true ? item?.StatusName : optreeValue === true ? item?.Name : optree === true ? item?.TreeName : (item.nPLRegionsName || item?.Name || item?.Version)}
                        </Text>
                        {(opreportDT === true && cacheSelectTree === item?.EntryName) || (optree === true && cacheSelectTree === item?.TreeName) || (opstreeNameStatus === true && cacheSelectTree === item?.StatusName) || (cacheSelectTree && cacheSelectTree === item?.Name) || selectedItem === item ? (
                            <SvgXml xml={radio_active} style={{ marginTop: scale(2) }} />
                        ) : (
                            <SvgXml xml={radio} style={{ marginTop: scale(2) }} />
                        )}
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
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: scale(10),
        borderBottomWidth: 1,
        borderBottomColor: '#D1D3DB',
        marginHorizontal: scale(16),
        alignItems: 'center'
    },
    cardNoBorder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: scale(10),
        marginHorizontal: scale(16)
    },
    title: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22)
    },
});

export default RadioProvince;
