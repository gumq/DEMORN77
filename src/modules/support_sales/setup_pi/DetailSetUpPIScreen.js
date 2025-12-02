import React, {  useState } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { View, StatusBar, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from './styles'
import { translateLang } from "store/accLanguages/slide";
import { HeaderBack, LoadingModal, TabsHeaderDevices } from "@components";
import { DetailTab, ProgressTab } from "./componentTab";

const DetailSetUpPIScreen = ({ route }) => {
    const item = route?.params?.item;
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang)
    const { isSubmitting, detailPI } = useSelector(state => state.SetUpDetailPI);

    const TAB_DETAILS_PI = [
        { id: 1, label: languageKey('_details') },
        { id: 2, label: languageKey('_progress') },
    ]

    const [selectedTab, setSelectTab] = useState(TAB_DETAILS_PI[0]);

    const selectTabEvent = item => {
        setSelectTab(item);
    };;

    return (
        <LinearGradient style={styles.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
             <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView style={styles.container}>
                <HeaderBack
                    title={item?.Name}
                    onPress={() => navigation.goBack()}
                />
                <View style={styles.scrollView}>
                    <TabsHeaderDevices
                        data={TAB_DETAILS_PI}
                        selected={selectedTab}
                        onSelect={selectTabEvent}
                        tabWidth={2}
                    />
                    <ScrollView style={styles.containerBody} showsVerticalScrollIndicator={false}>
                        {selectedTab.id === 1 && <DetailTab {...{ detailPI }} />}
                        {selectedTab.id === 2 && <ProgressTab {...{ detailPI }} />}
                    </ScrollView>
                </View>
            </SafeAreaView>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    )
}

export default DetailSetUpPIScreen;