import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { colors, fontSize } from '@themes';
import { scale } from '@resolutions';
import { radio, radio_active } from '@svgImg';

const RadioCompany = ({
    data,
    style,
    isDisabled,
    handleCloseModal,
    setValue
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
            <View >
                {data.map((item, index) => (
                    <TouchableOpacity
                        key={`${item.CmpnID || item?.CollectFromServer || 'item'}_${index}`}
                        disabled={isDisabled}
                        style={index === data.length - 1 ? styles.cardNoBorder : styles.card}
                        onPress={() => handleSelection(item)}
                    >
                        {selectedItem === item ? (
                            <SvgXml xml={radio_active} />
                        ) : (
                            <SvgXml xml={radio} />
                        )}
                        <Text bold style={styles.title}>
                            {item?.CompanyName || item?.ServerName}
                        </Text>

                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: scale(10),
        alignItems: 'center'
    },
    cardNoBorder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: scale(10),
    },
    title: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        borderBottomWidth: 1,
        borderBottomColor: '#D1D3DB',
        width: '90%',
        paddingBottom: scale(8)
    },
});

export default RadioCompany;
