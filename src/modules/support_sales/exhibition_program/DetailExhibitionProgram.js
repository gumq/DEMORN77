import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, ScrollView } from "react-native";

import { styles } from './styles'
import { Customers, Details, EvaluationResult } from "./componentDetail";
import { translateLang } from "@store/accLanguages/slide";
import { fetchDetailExhibitionPrograms } from "@store/accExhibition_Programs/thunk";
import {  HeaderBack, LoadingModal, TabsHeaderDevices } from "@components";

const DetailExhibitionProgram = ({ route }) => {
    const item = route?.params?.item;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang)
    const { isSubmitting, detailExhibitionPrograms } = useSelector(state => state.ExhibitionPrograms);
   
    const TAB_DETAILS_PROGRAM = [
        { id: 1, label: languageKey('_details') },
        { id: 2, label: languageKey('_customer_approval') },
        { id: 3, label: languageKey('_evaluation_result') }
    ]

    const [selectedTab, setSelectTab] = useState(TAB_DETAILS_PROGRAM[0]);

    const selectTabEvent = item => {
        setSelectTab(item);
    };;

    useEffect(() => {
        const body = { OID: item?.OID }
        dispatch(fetchDetailExhibitionPrograms(body))
    }, [item])

    return (
        <LinearGradient style={styles.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView style={styles.container}>
                <HeaderBack
                    title={languageKey('_details_exhibition')}
                    onPress={() => navigation.goBack()}
                />
                <View style={styles.scrollView}>
                    <TabsHeaderDevices
                        data={TAB_DETAILS_PROGRAM}
                        selected={selectedTab}
                        onSelect={selectTabEvent}
                        tabWidth={3}
                    />

                    <ScrollView style={styles.containerBody} showsVerticalScrollIndicator={false}>
                        {selectedTab.id === 1 && <Details {...{ detailExhibitionPrograms }} />}
                        {selectedTab.id === 2 && <Customers {...{ detailExhibitionPrograms }} />}
                        {selectedTab.id === 3 && <EvaluationResult {...{ detailExhibitionPrograms }} />}
                    </ScrollView>
                </View>
            </SafeAreaView>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    )
}

export default DetailExhibitionProgram;