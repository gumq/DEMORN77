import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { View, StatusBar, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { edit } from "@svgImg";
import routes from "@routes";
import { stylesDetail } from './styles'
import { DetailTab, ProgressTab } from "./componentTab";
import { translateLang } from "@store/accLanguages/slide";
import { HeaderBack, LoadingModal, TabsHeaderDevices } from "@components";
import { fetchDetailShowroom } from "@store/accOther_Proposal/thunk";

const DetailShowroomScreen = ({ route, item }) => {
    const itemData = item || route?.params?.item;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang)
    const { isSubmitting, detailShowroom } = useSelector(state => state.OtherProposal);

    const TAB_DETAILS_PROGRAM = [
        { id: 1, label: languageKey('_details') },
        { id: 2, label: languageKey('_progress') },
    ]

    const [selectedTab, setSelectTab] = useState(TAB_DETAILS_PROGRAM[0]);

    const selectTabEvent = item => {
        setSelectTab(item);
    };;

    useEffect(() => {
        const body = { OID: itemData?.OID }
        dispatch(fetchDetailShowroom(body))
    }, [itemData])

    const handleFormEdit = () => {
        navigation.navigate(routes.FormShowroomScreen, { item: detailShowroom, editProposal: true })
    }

    return (
        <LinearGradient style={stylesDetail.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView style={stylesDetail.container}>
                <HeaderBack
                    title={languageKey('_proposal_detail')}
                    onPress={() => navigation.goBack()}
                    btn={detailShowroom?.IsLock === 0 ? true : false}
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
                    <ScrollView style={stylesDetail.containerBody} showsVerticalScrollIndicator={false}>
                        {selectedTab.id === 1 && <DetailTab {...{ detailShowroom, itemData }} />}
                        {selectedTab.id === 2 && <ProgressTab {...{ detailShowroom, itemData }} />}
                    </ScrollView>
                </View>
            </SafeAreaView>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    )
}

export default DetailShowroomScreen;