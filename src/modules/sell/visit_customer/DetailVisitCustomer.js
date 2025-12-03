import React, { useEffect } from "react";
import { StatusBar, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import { stylesDetail } from "./styles";
import { HeaderBack, LoadingModal } from "@components";
import { fetchDetailVisitCustomer } from "@store/accVisit_Customer/thunk";
import { TabCheckIn, TabCheckOut, TabInforBussiness, TabInforCompetitor, TabInventory, TabOpinionCustomer } from "./componentTab";

const DetailVisitCustomer = ({ route }) => {
    const item = route?.params?.item;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { isSubmitting } = useSelector(state => state.VisitCustomer);

    useEffect(() => {
        const body = {
            ID: item?.ID
        }
        dispatch(fetchDetailVisitCustomer(body))

    }, [item])

    return (
        <LinearGradient style={stylesDetail.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView style={stylesDetail.safe}>
                <HeaderBack
                    title={item?.CustomerName}
                    onPress={() => navigation.goBack()}
                />
                <ScrollView style={stylesDetail.scrollView}>
                    <TabCheckIn {...{ item }} />
                    <TabOpinionCustomer {...{ item }} />
                    <TabInforCompetitor {...{ item }} />
                    <TabInventory {...{ item }} />
                    <TabInforBussiness {...{ item }} />
                    <TabCheckOut {...{ item }} />
                </ScrollView>
            </SafeAreaView>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    )
}

export default DetailVisitCustomer;