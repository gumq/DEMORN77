import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { translateLang } from '@store/accLanguages/slide';

import { stylesInventoryDetail } from '../styles';

const InventoryDetail = ({ detailInventory }) => {
    const languageKey = useSelector(translateLang);

    return (
        <View style={stylesInventoryDetail.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={[stylesInventoryDetail.containerTable]}>
                    <View style={stylesInventoryDetail.tableWrapper}>
                        <View style={stylesInventoryDetail.row}>
                            <View style={stylesInventoryDetail.cell_40}>
                                <Text style={stylesInventoryDetail.txtHeaderTable}>{languageKey('_warehouse')}</Text>
                            </View>
                            <View style={stylesInventoryDetail.cell_20}>
                                <Text style={stylesInventoryDetail.txtHeaderTable}>{languageKey('_inventory')}</Text>
                            </View>
                            <View style={stylesInventoryDetail.cell_20}>
                                <Text style={stylesInventoryDetail.txtHeaderTable}>{languageKey('_keep_so')}</Text>
                            </View>
                            <View style={stylesInventoryDetail.cell_20}>
                                <Text style={stylesInventoryDetail.txtHeaderTable}>{languageKey('_keep_od')}</Text>
                            </View>
                            <View style={stylesInventoryDetail.cell_20}>
                                <Text style={stylesInventoryDetail.txtHeaderTable}>{languageKey('_keep_selling')}</Text>
                            </View>
                            <View style={stylesInventoryDetail.cell_20}>
                                <Text style={stylesInventoryDetail.txtHeaderTable}>{languageKey('_in_stock_for_sale')}</Text>
                            </View>
                        </View>
                        {detailInventory?.Warehhouses?.map((item, index) => (
                            <View
                                style={[
                                    stylesInventoryDetail.cellResponse,
                                    index === detailInventory?.Warehhouses.length - 1 && stylesInventoryDetail.lastCell
                                ]}
                                key={index}
                            >
                                <View style={stylesInventoryDetail.cell_40}>
                                    <Text style={stylesInventoryDetail.valueRow}>{item?.WarehouseName}</Text>
                                </View>
                                <View style={stylesInventoryDetail.cell_20}>
                                    <Text style={stylesInventoryDetail.valueRow}>{item?.Quantity}</Text>
                                </View>
                                <View style={stylesInventoryDetail.cell_20}>
                                    <Text style={stylesInventoryDetail.valueRow}>{item?.KeepSOQuantity}</Text>
                                </View>
                                <View style={stylesInventoryDetail.cell_20}>
                                    <Text style={stylesInventoryDetail.valueRow}>{item?.KeepODQuantity}</Text>
                                </View>
                                <View style={stylesInventoryDetail.cell_20}>
                                    <Text style={stylesInventoryDetail.valueRow}>{item?.KeepSaleQuantity}</Text>
                                </View>
                                <View style={stylesInventoryDetail.cell_20}>
                                    <Text style={stylesInventoryDetail.valueRow}>{item?.KeepTransferQuantity}</Text>
                                </View>
                            </View>

                        ))}

                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default InventoryDetail;
