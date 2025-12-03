import React, { useMemo } from 'react';
import { View, Text } from 'react-native';

import { stylesStorageDetail } from '../styles';
import { useSelector } from 'react-redux';
import { translateLang } from '@store/accLanguages/slide';
import { RenderImage } from '@components';

const ProductDetail = ({ detailInventory }) => {
    const languageKey = useSelector(translateLang);
    const propertyCodes = detailInventory?.PropertyCodes?.split('/') || [];
    const propertyNames = detailInventory?.PropertyNames?.split(';') || [];

    const itemLinks = useMemo(() => {
        return detailInventory?.LinkImg
            ? detailInventory.LinkImg.split(';').filter(Boolean)
            : [];
    }, [detailInventory?.LinkImg]);

    const dynamicProperties = propertyCodes.map((code, index) => {
        const name = propertyNames[index]?.trim();
        const key = code.replace('ID', 'Name');
        const value = detailInventory?.[key] || languageKey('_no_data');

        return { label: name, value };
    });

    return (
        <View style={stylesStorageDetail.container}>
            <View style={stylesStorageDetail.cardProgram}>
                <Text style={stylesStorageDetail.headerProgram}>{languageKey('_product_information')}</Text>
                <View style={stylesStorageDetail.containerBodyCard}>
                    <View style={stylesStorageDetail.bodyCard}>
                        <View style={stylesStorageDetail.contentCardProduct}>
                            <Text style={stylesStorageDetail.txtDetailProduct}>{languageKey('_size')}</Text>
                            <Text style={stylesStorageDetail.contentDetailProduct}>
                                {detailInventory.Dimension || languageKey('_no_data')}
                            </Text>
                        </View>

                        {dynamicProperties.map((item, index) => (
                            <View key={index} style={stylesStorageDetail.contentCardProduct}>
                                <Text style={stylesStorageDetail.txtDetailProduct}>{item.label}</Text>
                                <Text style={stylesStorageDetail.contentDetailProduct}>{item.value}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
            <View style={stylesStorageDetail.cardProgram}>
                <Text style={stylesStorageDetail.headerProgram}>{languageKey('_product_images')}</Text>
                {itemLinks.length > 0 && (
                    <View style={stylesStorageDetail.image}>
                        <RenderImage urls={itemLinks} />
                    </View>
                )}
            </View>
        </View>
    )
};

export default ProductDetail;