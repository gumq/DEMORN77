import React, { useState } from "react";
import moment from "moment";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, ScrollView, FlatList, RefreshControl, Dimensions } from 'react-native';

import { stylesAllApproval } from "../styles";
import { noData } from "@svgImg";
import { Button, CardItemRenderFlat } from "@components";
import { translateLang } from "@store/accLanguages/slide";
import { fetchListPlanVisitCustomer } from "@store/accVisit_Customer/thunk";
import { useNavigation } from "@react-navigation/native";
import routes from "@routes";

const { height } = Dimensions.get('window');
const WaitingApprovalProcess = ({ listPlanVisitCustomer }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang);
    const [isRefreshing, setRefresh] = useState(false);
    const listWaitingApproval = listPlanVisitCustomer.filter((approval) => approval.ApprovalStatusCode === 0)

    const refreshEvent = () => {
        setRefresh(true);
        dispatch(fetchListPlanVisitCustomer())
        setRefresh(false);
    };

    const goToEditPlanEvent = (item) => {
        navigation.navigate(routes.DetailPlanVisitCustomer, { item: item })
    }

    const itemHeight = 8 + 30 + 24 + 30 + 30;
    const numberOfItemsInScreen = Math.ceil(height / itemHeight);
    const windowSize = numberOfItemsInScreen * 2;

    const _keyExtractor = (item, index) => `${item.OID}-${index}`;
    const _renderItem = ({ item }) => {
        return (
            <Button onPress={() => goToEditPlanEvent(item)}>
                <CardItemRenderFlat
                    header={item?.PlanName}
                    status={item?.ApprovalStatusName}
                    oid={item?.OID + ' - ' + moment(item?.CreateDate).format('DD/MM/YYYY')}
                    date={moment(item?.ChangeDate).format('HH:mm DD/MM/YYYY')}
                    fromDate={moment(item?.FromDate).format('DD/MM/YYYY')}
                    toDate={moment(item?.ToDate).format('DD/MM/YYYY')}
                    userName={item?.UserFullName}
                    customers={item?.TotalCustomers}
                    planName={item?.PlanName}
                    note={item?.Note}
                    entryName={item?.EntryName}
                    routeName={item?.CustomerSupportLineName}
                    bgColor={item?.ApprovalStatusColor}
                    txtColor={item?.ApprovalStatusTextColor}
                />
            </Button>
        );
    };

    return (
        <View>
            {listWaitingApproval?.length > 0 ? (
                <FlatList
                    data={listWaitingApproval}
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

export default WaitingApprovalProcess;