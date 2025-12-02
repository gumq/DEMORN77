import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { View, StatusBar, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from './styles'
import { translateLang } from "store/accLanguages/slide";
import {  HeaderBack, LoadingModal,TabsHeaderDevices } from "@components";
import { InventoryDetail, ProductDetail, StorageDetail } from "./componentTabDetail";
import { fetchDetailInventory } from "store/accInventory/thunk";

const DetailInventoryRenewalScreen = ({ route }) => {
    const item = route?.params?.item;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const languageKey = useSelector(translateLang);
    const { isSubmitting, detailInventory } = useSelector(state => state.Inventory);

    const TAB_DETAILS_PROGRAM = [
        { id: 1, label: languageKey('_inventory_detail') },
        { id: 2, label: languageKey('_storage_details') },
        { id: 3, label: languageKey('_product_details') },
    ]

    const [selectedTab, setSelectTab] = useState(TAB_DETAILS_PROGRAM[0]);

    const selectTabEvent = item => {
        setSelectTab(item);
    };

    useEffect(() => {
        if (item) {
            const body = { ItemID: String(item?.ItemID) }
            dispatch(fetchDetailInventory(body))
        }
    }, [item])

    return (
        <LinearGradient style={styles.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
             <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView style={styles.container}>
                <HeaderBack
                    title={item?.ItemName}
                    onPress={() => navigation.goBack()}
                />
                <View style={styles.scrollView}>
                    <TabsHeaderDevices
                        data={TAB_DETAILS_PROGRAM}
                        selected={selectedTab}
                        onSelect={selectTabEvent}
                        tabWidth={3}
                    />
                    <ScrollView style={styles.containerBody}>
                        {selectedTab.id === 1 && <InventoryDetail {...{ detailInventory }} />}
                        {selectedTab.id === 2 && <StorageDetail {...{ detailInventory }} />}
                        {selectedTab.id === 3 && <ProductDetail {...{ detailInventory }} />}
                    </ScrollView>

                </View>
            </SafeAreaView>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    )
}

export default DetailInventoryRenewalScreen;