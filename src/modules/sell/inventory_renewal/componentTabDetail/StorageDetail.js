import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { translateLang } from 'store/accLanguages/slide';

import { stylesStorageDetail } from '../styles';
import { Button } from 'components';
import { noData } from 'svgImg';
import { SvgXml } from 'react-native-svg';
import moment from 'moment';

const { height } = Dimensions.get('window')

const StorageDetail = ({ detailInventory }) => {
    const languageKey = useSelector(translateLang);

    const dataTab = [
        { id: 1, name: languageKey('_keep_selling'), key: 'KeepSales' },
        { id: 2, name: languageKey('_so_keep'), key: 'KeepSO' },
        { id: 3, name: languageKey('_od_keep'), key: 'KeepOD' },
        { id: 4, name: languageKey('_warehouse_transfer'), key: 'KeepTransferQuantity' }
    ];

    const [selectedTab, setSelectedTab] = useState(dataTab[0]);
    const [dataItem, setDataItem] = useState([]);

    const flatListRef = useRef(null);

    const handleTabPress = (item) => {
        setSelectedTab(item);
        setDataItem(detailInventory[item.key] || []);

        const index = dataTab.findIndex((i) => i.id === item.id);
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ index, animated: true });
        }
    };

    const _keyExtractor = (item) => `${item.id}`;

    const _renderItem = ({ item }) => {
        const isSelected = item.id === selectedTab.id;

        return (
            <Button
                key={item.id}
                style={[stylesStorageDetail.btn, isSelected && stylesStorageDetail.btnActive]}
                onPress={() => handleTabPress(item)}
            >
                <Text style={isSelected ? stylesStorageDetail.textActive : stylesStorageDetail.text}>
                    {item.name}
                </Text>
            </Button>
        );
    };

    const _keyExtractorList = (item) => `${item.ID}`;
    const _renderItemList = ({ item }) => {
        return (
            <View style={stylesStorageDetail.cardProgram}>
                <Text style={stylesStorageDetail.headerProgram}>{selectedTab?.key === 'KeepSales' ? item?.UserFullName : item?.CustomerName}</Text>
                <View style={stylesStorageDetail.containerBodyCard}>
                    <View style={stylesStorageDetail.bodyCard}>
                        {selectedTab.key === 'KeepTransferQuantity' ? (
                            <>
                                <View style={stylesStorageDetail.contentCard}>
                                    <Text style={stylesStorageDetail.txtHeaderBody}>{languageKey('_export_factory')}</Text>
                                    <Text style={stylesStorageDetail.contentBody}>{item.FactoryOut}</Text>
                                </View>
                                <View style={stylesStorageDetail.contentCard}>
                                    <Text style={stylesStorageDetail.txtHeaderBody}>{languageKey('_export_warehouse')}</Text>
                                    <Text style={stylesStorageDetail.contentBody}>{item.WarehouseOut}</Text>
                                </View>
                                <View style={stylesStorageDetail.contentCard}>
                                    <Text style={stylesStorageDetail.txtHeaderBody}>{languageKey('_import_factory')}</Text>
                                    <Text style={stylesStorageDetail.contentBody}>{item.FactoryIn}</Text>
                                </View>
                                <View style={stylesStorageDetail.contentCard}>
                                    <Text style={stylesStorageDetail.txtHeaderBody}>{languageKey('_import_warehouse')}</Text>
                                    <Text style={stylesStorageDetail.contentBody}>{item.WarehouseIn}</Text>
                                </View>
                                {item.Order && (
                                    <View style={stylesStorageDetail.contentCard}>
                                        <Text style={stylesStorageDetail.txtHeaderBody}>{languageKey('_order')}</Text>
                                        <Text style={stylesStorageDetail.contentBody}>{item.Order}</Text>
                                    </View>
                                )}
                                <View style={stylesStorageDetail.contentCard}>
                                    <Text style={stylesStorageDetail.txtHeaderBody}>{languageKey('_purpose')}</Text>
                                    <Text style={stylesStorageDetail.contentBody}>{item.Purpose}</Text>
                                </View>
                            </>
                        ) : (
                            <>
                                {item.OID && (
                                    <View style={stylesStorageDetail.contentCard}>
                                        <Text style={stylesStorageDetail.txtHeaderBody}>{selectedTab?.key === 'KeepOD' ? languageKey('_od_number') : languageKey('_so_number')}</Text>
                                        <Text style={stylesStorageDetail.contentBody}>{item.OID}</Text>
                                    </View>
                                )}

                                <View style={stylesStorageDetail.contentCard}>
                                    <Text style={stylesStorageDetail.txtHeaderBody}>{languageKey('_quantity')}</Text>
                                    <Text style={stylesStorageDetail.contentBody}>{item.Quantity} - {item?.UnitName}</Text>
                                </View>
                                <View style={stylesStorageDetail.contentCard}>
                                    <Text style={stylesStorageDetail.txtHeaderBody}>{languageKey('_warehouse_holds_goods')}</Text>
                                    <Text style={stylesStorageDetail.contentBody}>{item.WarehouseName}</Text>
                                </View>
                                <View style={stylesStorageDetail.contentCard}>
                                    <Text style={stylesStorageDetail.txtHeaderBody}>{languageKey('_goods_retention_period')}</Text>
                                    <Text style={stylesStorageDetail.contentBody}>{moment(item.HoldDueTime).format('DD/MM/YYYY')}</Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    useEffect(() => {
        setDataItem(detailInventory[selectedTab.key] || []);
    }, []);

    return (
        <View style={stylesStorageDetail.container}>
            <View style={stylesStorageDetail.containerTab}>
                <FlatList
                    ref={flatListRef}
                    data={dataTab}
                    horizontal
                    keyExtractor={_keyExtractor}
                    renderItem={_renderItem}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <View style={stylesStorageDetail.scrollView}>
                {dataItem.length > 0 ? (
                    <FlatList
                        data={dataItem}
                        renderItem={_renderItemList}
                        keyExtractor={_keyExtractorList}
                        contentContainerStyle={stylesStorageDetail.flatListContainer}
                    />
                ) : (
                    <View>
                        <Text style={stylesStorageDetail.txtHeaderNodata}>{languageKey('_no_data')}</Text>
                        <Text style={stylesStorageDetail.txtContent}>{languageKey('_we_will_back')}</Text>
                        <SvgXml xml={noData} style={stylesStorageDetail.imgEmpty} />
                    </View>
                )}
            </View>
        </View>
    );
};

export default StorageDetail;

