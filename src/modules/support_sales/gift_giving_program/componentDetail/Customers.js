import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import _ from 'lodash';
import { View, Text, FlatList} from 'react-native';

import { stylesCustomers, stylesDetail } from "../styles";
import { translateLang } from "store/accLanguages/slide";
import { Button, NotifierAlert } from "components";
import { ApiPromotionGifts_Edit } from "action/Api";
import { noData, trash_22 } from "svgImg";
import { fetchDetailGiftPrograms } from "store/accGift_Program/thunk";

const Customers = () => {
    const languageKey = useSelector(translateLang)
    const dispatch = useDispatch();
    const { detailGiftPrograms } = useSelector(state => state.GiftProgram);
    const customerData = detailGiftPrograms?.ListRegistration || []

    const dataTab = [
        { id: 1, name: languageKey('_all'), key: 'all' },
        { id: 2, name: languageKey('_wait'), key: '-2' },
        { id: 3, name: languageKey('_waiting_approval'), key: '0' },
        { id: 4, name: languageKey('_approved'), key: '1' },
        { id: 5, name: languageKey('_refuse'), key: '-1' }
    ];

    const [selectedTab, setSelectedTab] = useState(dataTab[0]);
    const [dataItem, setDataItem] = useState([]);

    const flatListRef = useRef(null);

    const filterDataByTab = (tabKey) => {
        if (tabKey === 'all') {
            setDataItem(customerData);
        } else {
            const filtered = customerData.filter((item) => String(item.ApprovalStatusCode) === tabKey);
            setDataItem(filtered);
        }
    };

    useEffect(() => {
        filterDataByTab(selectedTab.key);
    }, [customerData, selectedTab]);

    const handleTabPress = (item) => {
        setSelectedTab(item);
        const index = dataTab.findIndex((i) => i.id === item.id);
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ index, animated: true });
        }
    };

    const _keyExtractorTab = (item) => `${item.id}`;
    const _renderItemTab = ({ item }) => {
        const isSelected = item.id === selectedTab.id;

        return (
            <Button
                key={item.id}
                style={[stylesCustomers.btn, isSelected && stylesCustomers.btnActive]}
                onPress={() => handleTabPress(item)}
            >
                <Text style={isSelected ? stylesCustomers.textActive : stylesCustomers.text}>
                    {item.name}
                </Text>
            </Button>
        );
    };

    const handleDelete = _.debounce(async (customerDel) => {
        const listCustomer = customerData?.filter(cus => cus?.CustomerID !== customerDel?.CustomerID)
        try {
            const body = {
                "OID": detailGiftPrograms?.OID || "",
                "SAPID": detailGiftPrograms?.SAPID || "",
                "LemonID": detailGiftPrograms?.LemonID || "",
                "ODate": detailGiftPrograms?.ODate || new Date(),
                "FactorID": detailGiftPrograms?.FactorID || "",
                "EntryID": detailGiftPrograms?.EntryID || "",
                "CmpnID": String(detailGiftPrograms?.CmpnID || ""),
                "ReferenceID": detailGiftPrograms?.ReferenceID || "",
                "EventTypeID": detailGiftPrograms?.EventTypeID || 0,
                "GiftID": Number(detailGiftPrograms?.GiftID || 0),
                "UserID": detailGiftPrograms?.UserID || 0,
                "FromDate": detailGiftPrograms?.FromDate || new Date(),
                "ToDate": detailGiftPrograms?.ToDate || new Date(),
                "IsPlanned": detailGiftPrograms?.IsPlanned || 0,
                "IsRequiredImage": detailGiftPrograms?.IsRequiredImage || 0,
                "IsRegistered": detailGiftPrograms?.IsRegistered || 0,
                "ExpirationDate": detailGiftPrograms?.ExpirationDate || new Date(),
                "GiftQuantity": detailGiftPrograms?.GiftQuantity || 0,
                "Name": detailGiftPrograms?.Name || "",
                "NameExtention1": detailGiftPrograms?.NameExtention1 || "",
                "NameExtention2": detailGiftPrograms?.NameExtention2 || "",
                "NameExtention3": detailGiftPrograms?.NameExtention3 || "",
                "NameExtention4": detailGiftPrograms?.NameExtention4 || "",
                "NameExtention5": detailGiftPrograms?.NameExtention5 || "",
                "NameExtention6": detailGiftPrograms?.NameExtention6 || "",
                "NameExtention7": detailGiftPrograms?.NameExtention7 || "",
                "NameExtention8": detailGiftPrograms?.NameExtention8 || "",
                "NameExtention9": detailGiftPrograms?.NameExtention9 || "",
                "TargetNote": detailGiftPrograms?.TargetNote || "",
                "Note": detailGiftPrograms?.Note || "",
                "Link": detailGiftPrograms?.Link || "",
                "Extention1": detailGiftPrograms?.Extention1 || "",
                "Extention2": detailGiftPrograms?.Extention2 || "",
                "Extention3": detailGiftPrograms?.Extention3 || "",
                "Extention4": detailGiftPrograms?.Extention4 || "",
                "Extention5": detailGiftPrograms?.Extention5 || "",
                "Extention6": detailGiftPrograms?.Extention6 || "",
                "Extention7": detailGiftPrograms?.Extention7 || "",
                "Extention8": detailGiftPrograms?.Extention8 || "",
                "Extention9": detailGiftPrograms?.Extention9 || "",
                "Extention10": detailGiftPrograms?.Extention10 || "",
                "Extention11": detailGiftPrograms?.Extention11 || "",
                "Extention12": detailGiftPrograms?.Extention12 || "",
                "Extention13": detailGiftPrograms?.Extention13 || "",
                "Extention14": detailGiftPrograms?.Extention14 || "",
                "Extention15": detailGiftPrograms?.Extention15 || "",
                "Extention16": detailGiftPrograms?.Extention16 || "",
                "Extention17": detailGiftPrograms?.Extention17 || "",
                "Extention18": detailGiftPrograms?.Extention18 || "",
                "Extention19": detailGiftPrograms?.Extention19 || "",
                "Extention20": detailGiftPrograms?.Extention20 || "",
                Details: listCustomer || []
            };
            const result = await ApiPromotionGifts_Edit(body);
            const data = result.data;
            if (data.StatusCode === 200 && data.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${data.Message}`,
                    'success',
                );
                const bodyDetail = { OID: detailGiftPrograms?.OID }
                dispatch(fetchDetailGiftPrograms(bodyDetail))
            } else {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${data.Message}`,
                    'error',
                );
            }
        } catch (error) {
            NotifierAlert(
                3000,
                `${languageKey('_notification')}`,
                `${error}`,
                'error',
            );
        }
    }, 2000, { leading: true, trailing: false })

    const _keyExtractor = (item, index) => `${item.CustomerID}-${index}`;
    const _renderItem = ({ item, index }) => {
        return (
            <View style={stylesDetail.cardCustomer}>
                <View style={stylesDetail.itemBody_two}>
                    <View style={stylesDetail.containerItem}>
                        <View style={stylesDetail.containerHeader}>
                            <Text
                                style={stylesDetail.txtTitleItem}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >
                                {item?.CustomerName}
                            </Text>
                            {item?.ApprovalStatusCode === 1 ? null :
                                <Button onPress={() => handleDelete(item)}>
                                    <SvgXml xml={trash_22} />
                                </Button>
                            }
                        </View>
                        <Text style={stylesDetail.txtTime}>{moment(item?.ReRegistrationTime).format('DD/MM/YYYY')}</Text>
                        <View style={stylesDetail.containerText}>
                            <Text style={stylesDetail.txtHeader}>{languageKey('_address')}</Text>
                            <Text style={stylesDetail.content}>{item?.Address || item?.Extention1}</Text>
                        </View>
                        <View style={stylesDetail.containerHeader}>
                            <View style={stylesDetail.containerText}>
                                <Text style={stylesDetail.txtHeader}>{languageKey('_allocated')}</Text>
                                <Text style={stylesDetail.content}>{item?.AllocatedQuantity}</Text>
                            </View>
                            <View style={stylesDetail.containerText}>
                                <Text style={stylesDetail.txtHeader}>{languageKey('_recommended_quantity')}</Text>
                                <Text style={stylesDetail.content}>{item?.RequestedQuantity}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={stylesCustomers.containerFooterCard}>
                    <Text style={stylesCustomers.contentTimeApproval}>{languageKey('_update')} {moment(item?.ApprovalDate).format('HH:mm DD/MM/YYYY')}</Text>
                    <View style={[stylesCustomers.bodyStatus, { backgroundColor: item?.ApprovalStatusColor }]}>
                        <Text style={[stylesCustomers.txtStatus, { color: item?.ApprovalStatusTextColor }]}>
                            {item?.ApprovalStatusName}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={stylesCustomers.container}>
            <View style={stylesCustomers.containerTab}>
                <FlatList
                    ref={flatListRef}
                    data={dataTab}
                    horizontal
                    keyExtractor={_keyExtractorTab}
                    renderItem={_renderItemTab}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            {dataItem?.length > 0 ? (
                <FlatList
                    data={dataItem}
                    renderItem={_renderItem}
                    keyExtractor={_keyExtractor}
                    style={stylesCustomers.scrollview}
                />
            ) : (
                <View >
                    <Text style={stylesCustomers.txtHeaderNodata}>{languageKey('_no_data')}</Text>
                    <Text style={stylesCustomers.txtContent}>{languageKey('_we_will_back')}</Text>
                    <SvgXml xml={noData} style={stylesCustomers.imgEmpty} />
                </View>

            )}
        </View>
    )
}

export default Customers;