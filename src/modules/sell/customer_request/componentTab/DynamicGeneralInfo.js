import React from 'react';
import { View, Text } from 'react-native';
import { stylesDetail } from '../styles';

const DynamicGeneralInfo = ({ detailCusRequirement, languageKey }) => {
    const PropertyCodes = detailCusRequirement?.PropertyCodes || '';
    const PropertyNames = detailCusRequirement?.PropertyNames || '';
    const codes = PropertyCodes.split('/');
    const names = PropertyNames.split(';');

    const infoItems = codes.map((code, index) => {
        const label = names[index] || code;
        const nameKey = code.replace(/ID$/, 'Name');
        const value = detailCusRequirement?.[nameKey];
        return { label, value };
    }).filter(item => item.value !== null && item.value !== undefined && item.value !== '');

    const firstRow = infoItems.slice(0, 1);
    const restRows = infoItems.slice(1);

    const restRowsFormatted = [];
    for (let i = 0; i < restRows.length; i += 2) {
        restRowsFormatted.push(restRows.slice(i, i + 2));
    }

    return (
        <View style={stylesDetail.containerGeneralInfor}>
            <View style={stylesDetail.containerBodyDynamic}>
                <View style={[stylesDetail.containerBodyCard, { flex: 1,  }]}>
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_product_industry')}</Text>
                    <Text style={stylesDetail.contentBody}>{detailCusRequirement?.GoodsTypeName}</Text>
                </View>
                {firstRow[0] ? (
                    <View style={[stylesDetail.containerBodyCard, { flex: 1 }]}>
                        <Text style={stylesDetail.txtHeaderBody}>{firstRow[0].label}</Text>
                        <Text style={stylesDetail.contentBody}>{firstRow[0].value}</Text>
                    </View>
                ) : <View style={{ flex: 1 }} />}
            </View>

            {restRowsFormatted.map((row, rowIndex) => (
                <View key={rowIndex} style={stylesDetail.containerBodyDynamic}>
                    {row.map((item, colIndex) => (
                        <View key={colIndex} style={[stylesDetail.containerBodyCard, { flex: 1 }]}>
                            <Text style={stylesDetail.txtHeaderBody}>{item.label}</Text>
                            <Text style={stylesDetail.contentBody}>{item.value}</Text>
                        </View>
                    ))}
                    {row.length === 1 && <View style={{ flex: 1 }} />}
                </View>
            ))}
        </View>
    );
};

export default DynamicGeneralInfo;
