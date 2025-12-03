import React, { useState } from "react";
import moment from "moment";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, ScrollView, FlatList, RefreshControl, Dimensions } from 'react-native';

import routes from "@routes";
import { styles } from "../styles";
import { cancel_plan, noData } from "@svgImg";
import { Button } from "@components";
import { translateLang } from "@store/accLanguages/slide";
import { useNavigation } from "@react-navigation/native";
import { fetchListVisitCustomer } from "@store/accVisit_Customer/thunk";
import ModalCancelCustomer from "../componentTab/ModalCancelCustomer";

const { height } = Dimensions.get('window');
const AllPlan = ({ searchResults, selectedItem, dateStates }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang)
    const [isRefreshing, setRefresh] = useState(false);
    const [isShowModal, setIsShowModal] = useState(false);
    const [itemSelected, setItemSelected] = useState(null);

    const refreshEvent = () => {
        setRefresh(true);
        const body = {
            Option: selectedItem?.key ?? 0,
            FromDate: dateStates?.fromDate?.submit ?? new Date(),
            ToDate: dateStates?.toDate?.submit ?? new Date(),
        }
        dispatch(fetchListVisitCustomer(body))
        setRefresh(false);
    };

    const handleDetailVisitCustomer = (item) => {
        navigation.navigate(routes.DetailVisitCustomer, { item: item })
    }

    const openModalCancel = (item) => {
        setItemSelected(item)
        setIsShowModal(!isShowModal)
    }

    const closeModalCancel = () => {
        setIsShowModal(!isShowModal)
    }

    const itemHeight = 8 + 30 + 24 + 30 + 30;
    const numberOfItemsInScreen = Math.ceil(height / itemHeight);
    const windowSize = numberOfItemsInScreen * 2;

    const _keyExtractor = (item, index) => `${item.ID}-${index}`;
    const _renderItem = ({ item }) => {
        return (
            <Button style={styles.containerCard} onPress={() => handleDetailVisitCustomer(item)}>
                <View style={styles.headerCard}>
                    <Text
                        style={styles.contentHeader}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {item?.CustomerName}
                    </Text>
                    <Button onPress={() => openModalCancel(item)}>
                        <SvgXml xml={cancel_plan} />
                    </Button>
                </View>
                <View style={styles.containerStatus}>
                    <View style={[styles.bodyStatusType, { backgroundColor: item?.VisitTypeCode === 'OnRouteVisit' ? '#DCFCE7' : '#FEE2E2' }]}>
                        <Text style={[styles.txtStatus, { color: item?.VisitTypeCode === 'OnRouteVisit' ? '#166534' : '#991B1B' }]}>
                            {item?.VisitTypeName}
                        </Text>
                    </View>
                    <View style={[styles.bodyStatus, { backgroundColor: item?.VisitStatusColor }]}>
                        <Text style={[styles.txtStatus, { color: item?.VisitStatusTextColor }]}>
                            {item?.VisitStatusName}
                        </Text>
                    </View>
                </View>
                <View style={styles.viewDate}>
                    <Text style={styles.txtDate}>{languageKey('_visit_time')}</Text>
                    <Text style={styles.contentDate}>
                        {moment(item?.CheckInTime).format('HH:mm') === '00:00' ? (
                            `${languageKey('_wait_for_update')}`
                        ) : (
                            `${moment(item?.CheckInTime).format('HH:mm DD/MM/YYYY')} - ${moment(item?.CheckOutTime).format('HH:mm DD/MM/YYYY')} (${item?.TotalTime} ${languageKey('_minute')})`
                        )}
                    </Text>
                </View>
                <View style={styles.containerContent}>
                    <View style={styles.viewDate}>
                        <Text style={styles.txtDate}>{languageKey('_order')}</Text>
                        <Text style={styles.contentDate}>
                            {item?.OrderQuantity != "0" ? item?.OrderQuantity : languageKey('_wait_for_update')} {languageKey('_unit_order')}
                        </Text>
                    </View>
                    <View style={styles.viewDate}>
                        <Text style={styles.txtDate}>{languageKey('_revenue')}</Text>
                        <Text style={styles.contentDate}>
                            {item?.SalesRevenue != "0.0" ? item.SalesRevenue : languageKey('_wait_for_update')}
                        </Text>
                    </View>
                </View>
            </Button>
        );
    };

    return (
        <View style={styles.container}>
            {searchResults?.length > 0 ? (
                <FlatList
                    data={searchResults}
                    renderItem={_renderItem}
                    keyExtractor={_keyExtractor}
                    contentContainerStyle={styles.flatScroll}
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
                        <Text style={styles.txtHeaderNodata}>{languageKey('_no_data')}</Text>
                        <Text style={styles.txtContent}>{languageKey('_we_will_back')}</Text>
                        <SvgXml xml={noData} style={styles.imgEmpty} />
                    </View>
                </ScrollView>
            )}
            <ModalCancelCustomer
                parentID={itemSelected?.ID}
                showModal={isShowModal}
                closeModal={closeModalCancel}
                selectedItem={selectedItem}
                dateStates={dateStates}
            />
        </View>
    )
}

export default AllPlan;