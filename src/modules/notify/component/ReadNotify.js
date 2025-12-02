import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, FlatList, RefreshControl } from 'react-native';
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { Button, CardNotify, NotifierAlert } from "@components";
import { noData } from '@svgImg'
import styles from '../styles';
import { colors } from "@themes";
import { ApiDeleteNoti } from "@api";
import { translateLang } from "store/accLanguages/slide";
import { fetchListNotify, fetchTotalNotify } from "store/accNotify/thunk";
import { useNavigation } from "@react-navigation/native";
import routes from "modules/routes";

const ReadNotify = ({ listNotify }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isRefreshing, setRefresh] = useState(false);
    const languageKey = useSelector(translateLang);
    const listNotiRead = listNotify?.filter(noti => noti.IsView === 1);

    const handleRefresh = useCallback(async () => {
        setRefresh(true);
        await dispatch(fetchListNotify());
        setRefresh(false);
    }, [dispatch]);

    const handleDeleNotify = useCallback(async (item) => {
        try {
            const data = { ListDetailID: String(item.DetailID) };
            const result = await ApiDeleteNoti(data);

            if (result.data.ErrorCode === "0") {
                await dispatch(fetchTotalNotify());
                await dispatch(fetchListNotify());
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${result.data.Message}`,
                    'success',
                );
            } else {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${result.data.Message}`,
                    'error',
                );
            }
        } catch (error) {
            NotifierAlert(
                3000,
                `${languageKey('_notification')}`,
                languageKey('_error_occurred'),
                'error',
            );
        }
    }, [dispatch, languageKey]);

    const handleViewNotify = useCallback((item) => {
        if (item?.MenuLink) {
            const firstLink = item?.MenuLink;
            switch (firstLink) {
                case "CustomerRequirementScreen":
                    if (item?.EntryID === 'OtherRequests') {
                        navigation.navigate(routes.DetailCusRequirementScreen, { item });
                    } else {
                        navigation.navigate(routes.DetailOrderRequestScreen, { item });
                    }
                    break;
                case "HandOverDocumentScreen":
                    navigation.navigate(routes.DetailHandOverDocScreen, { item });
                    break;
                case "DepositPaymentScreen":
                    navigation.navigate(routes.DetailPaymentRequestScreen, { item });
                    break;
                case "ProductQuoteScreen":
                    navigation.navigate(routes.DetailProductQuoteScreen, { item });
                    break;
                case "CreditLimitScreen":
                    navigation.navigate(routes.DetailCreditLimitScreen, { item });
                    break;
                default:
                    console.log("Unknown screen link:", firstLink);
                    break;
            }
        } else {
            console.log("No valid link to navigate.");
        }
    }, [navigation]);

    const _keyExtractor = useCallback((item, index) => `${item.DetailID}-${index}`, []);
    const _renderItem = useCallback(({ item }) => (
        <Button
            style={styles.rowContainer}
            onPress={() => handleViewNotify(item)}
        >
            <CardNotify
                isView={item?.IsView}
                title={item?.Title}
                content={item?.Body}
                icon={item?.MenuIcon}
                statuscolorTilte={item?.IsView === 0 ? colors.black : '#525252'}
                statuscolorContent={item?.IsView === 0 ? '#525252' : '#A3A3A3'}
                statuscolorTime={item?.IsView === 0 ? colors.black : '#525252'}
                date={item?.CreateDate}
                onPressDelete={() => handleDeleNotify(item)}
            />
        </Button>
    ), [handleViewNotify, handleDeleNotify]);

    return (
        <View style={styles.container}>
            {listNotiRead?.length > 0 ? (
                <FlatList
                    data={listNotiRead}
                    renderItem={_renderItem}
                    keyExtractor={_keyExtractor}
                    contentContainerStyle={styles.scroll}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                    }
                />
            ) : (
                <ScrollView
                    style={styles.scroll}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                    }
                >
                    <View>
                        <Text style={styles.txtHeaderNodata}>{languageKey('_no_data')}</Text>
                        <Text style={styles.txtContent}>{languageKey('_we_will_back')}</Text>
                        <SvgXml xml={noData} style={styles.imgEmpty} />
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

export default ReadNotify;