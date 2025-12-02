/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import moment from "moment";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, ScrollView, FlatList, RefreshControl, Dimensions } from 'react-native';

import { stylesAllApproval } from "../styles";
import { noData } from "svgImg";
import { Button, CardItemRenderFlat } from "@components";
import { translateLang } from "store/accLanguages/slide";
import { fetchApprovalListProcess } from "store/accApproval_Signature/thunk";
import { useNavigation } from "@react-navigation/native";
import routes from "modules/routes";

const { height } = Dimensions.get('window');
const Approved = ({ filterApprovalList }) => {
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang)
    const [isRefreshing, setRefresh] = useState(false);
    const listApproved = filterApprovalList.filter((approval) => approval.Status === 1||approval.Status === '1')

    const refreshEvent = () => {
        setRefresh(true);

         const today = new Date();
    const toDateObj = new Date(today);
    toDateObj.setDate(toDateObj.getDate() + 1);
    const toDate = toDateObj.toISOString().split('T')[0];
    const fromDateObj = new Date(today);
    fromDateObj.setDate(fromDateObj.getDate() - 60);
    const fromDate = fromDateObj.toISOString().split('T')[0];
    const body = {FromDate: fromDate, ToDate: toDate};
        dispatch(fetchApprovalListProcess(body))
        setRefresh(false);
    };

    const moveToDetailApproval = (item) => {
        navigation.navigate(routes.DetailApprovalScreen, { item: item })
    }

    const itemHeight = 8 + 30 + 24 + 30 + 30;
    const numberOfItemsInScreen = Math.ceil(height / itemHeight);
    const windowSize = numberOfItemsInScreen * 2;

    const _keyExtractor = (item, index) => `${item.OID}-${index}`;
    const _renderItem = ({ item }) => {
        return (
            <Button onPress={() => moveToDetailApproval(item)}>
                <CardItemRenderFlat
                    oid={item?.OID}
                    entryName={item?.EntryName}
                    customerName={item?.Name}
                    userName={item?.UserFullName}
                    step={item?.StepName}
                    value={item?.Values}
                    status={item?.ApprovalStatusName}
                    content={item?.PlanName}
                    note={item?.Note}
                    date={moment(item?.CreateDate).format('HH:mm DD/MM/YYYY')}
                    fromDate={moment(item?.FromDate).format('DD/MM/YYYY')}
                    toDate={moment(item?.ToDate).format('DD/MM/YYYY')}
                    bgColor={item?.ApprovalStatusColor}
                    txtColor={item?.ApprovalStatusTextColor}
                />
            </Button>
        );
    };

    return (
        <View>
            {listApproved?.length > 0 ? (
                <FlatList
                    data={listApproved}
                    renderItem={_renderItem}
                    keyExtractor={_keyExtractor}
                    style={stylesAllApproval.scrollview}
                    initialNumToRender={numberOfItemsInScreen}
                    maxToRenderPerBatch={numberOfItemsInScreen}
                    windowSize={windowSize}
                    removeClippedSubviews={true}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={refreshEvent} />
                    }
                />
            ) : (
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={refreshEvent} />
                    }
                >
                    <View>
                        <Text style={stylesAllApproval.txtHeaderNodata}>{languageKey('_no_data')}</Text>
                        <Text style={stylesAllApproval.txtContent}>{languageKey('_we_will_back')}</Text>
                        <SvgXml xml={noData} style={stylesAllApproval.imgEmpty} />
                    </View>
                </ScrollView>
            )}
        </View>
    )
}

export default Approved;