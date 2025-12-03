import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { View, StatusBar, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { stylesDetail } from './styles'
import { DetailTab, ProgressTab } from "./componentTab";
import { translateLang } from "@store/accLanguages/slide";
import { HeaderBack, LoadingModal, TabsHeaderDevices } from "@components";
import { edit } from "@svgImg";
import routes from "@routes";
import { fetchDetailConfirmRequest, fetchDetailPaymentRequest } from "@store/accDeposit_Payment/thunk";

const DetailPaymentRequestScreen = ({ route, item }) => {
    const itemData = item || route?.params?.item;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang);
    const { isSubmitting, detailPaymentRequest, detailConfirmRequest } = useSelector(state => state.Payments);

    const TAB_DETAILS_PROGRAM = [
        { id: 1, label: languageKey('_details') },
        { id: 2, label: languageKey('_approval_information') },
    ]

    const [selectedTab, setSelectTab] = useState(TAB_DETAILS_PROGRAM[0]);

    const selectTabEvent = item => {
        setSelectTab(item);
    };;

    useEffect(() => {
        const body = { OID: itemData?.ReferenceID && itemData?.ReferenceID !== "" ? itemData?.ReferenceID : itemData?.OID }
        dispatch(fetchDetailPaymentRequest(body))
    }, [itemData])

    const handleFormEdit = () => {
        navigation.navigate(routes.FormPaymentRequestScreen, { item: detailPaymentRequest, editPayment: true })
    }

    useEffect(() => {
        if (detailPaymentRequest?.ConfirmationID !== null && detailPaymentRequest?.IsLock === 1) {
            const body = { OID: detailPaymentRequest?.ConfirmationID }
            dispatch(fetchDetailConfirmRequest(body))
        }
    }, [detailPaymentRequest])

    return (
        <LinearGradient style={stylesDetail.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView >
                <HeaderBack
                    title={languageKey('_request_details')}
                    onPress={() => navigation.goBack()}
                    btn={detailPaymentRequest?.IsLock === 0 ? true : false}
                    onPressBtn={handleFormEdit}
                    iconBtn={edit}
                />
                <View style={stylesDetail.scrollView}>
                    <TabsHeaderDevices
                        data={TAB_DETAILS_PROGRAM}
                        selected={selectedTab}
                        onSelect={selectTabEvent}
                        tabWidth={2}
                    />
                    <ScrollView
                        style={stylesDetail.containerBody}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={stylesDetail.footerScroll}
                    >
                        {selectedTab.id === 1 && <DetailTab {...{ detailPaymentRequest, itemData }} />}
                        {selectedTab.id === 2 && <ProgressTab {...{ detailConfirmRequest, itemData }} />}
                    </ScrollView>
                </View>
            </SafeAreaView>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    )
}

export default DetailPaymentRequestScreen;