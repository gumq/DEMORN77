import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, ScrollView, Text } from "react-native";
import Modal from 'react-native-modal';
import _ from 'lodash';

import { styles, stylesDetail } from './styles'
import { Customers, Details, Progress } from "./componentDetail";
import { translateLang } from "@store/accLanguages/slide";
import { Button, HeaderBack, LoadingModal, NotifierAlert, TabsHeaderDevices } from "@components";
import { fetchDetailGiftPrograms } from "@store/accGift_Program/thunk";
import { plus_white } from "@svgImg";
import { SvgXml } from "react-native-svg";
import CurrentCustomer from "./componentDetail/CurrentCustomer";
import NewCustomer from "./componentDetail/NewCustomer";
import { ApiPromotionGifts_Edit } from "@api";

const DetailGiftProgram = ({ route }) => {
    const item = route?.params?.item;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang)
    const { isSubmitting, detailGiftPrograms } = useSelector(state => state.GiftProgram);
    const [isShowModalAddCustomer, setIsShowModalAddCustomer] = useState(false);
    const [customerEdit, setCustomerEdit] = useState([]);
    const [indexEdit, setIndexEdit] = useState(null)

    const TAB_DETAILS_PROGRAM = [
        { id: 1, label: languageKey('_details') },
        { id: 2, label: languageKey('_customer_approval') },
        { id: 3, label: languageKey('_progress') }
    ]

    const [selectedTab, setSelectTab] = useState(TAB_DETAILS_PROGRAM[0]);

    const selectTabEvent = item => {
        setSelectTab(item);
    };;

    useEffect(() => {
        const body = { OID: item?.OID }
        dispatch(fetchDetailGiftPrograms(body))
    }, [item])

    const TAB_ADD_CUSTOMER = [
        { id: 1, label: languageKey('_current_customer') },
        { id: 2, label: languageKey('_add_new_customer') },
    ]

    const [selectedTabCustomer, setSelectTabCustomer] = useState(TAB_ADD_CUSTOMER[0]);

    const openModalAddCustomer = () => {
        setIsShowModalAddCustomer(!isShowModalAddCustomer)
        setIndexEdit(null)
    }

    const closeModalAddCustomer = () => {
        setIsShowModalAddCustomer(false)
    }

    const handleConfirm = _.debounce(async () => {
        try {
            const body = {
                "OID": detailGiftPrograms?.OID || "",
                "SAPID": detailGiftPrograms?.SAPID || "",
                "LemonID": detailGiftPrograms?.LemonID || "",
                "ODate": detailGiftPrograms?.ODate || new Date(),
                "FactorID": detailGiftPrograms?.FactorID || "",
                "EntryID": detailGiftPrograms?.EntryID || "",
                "CmpnID": String(detailGiftPrograms?.CmpnID || ""),
                "ReferenceID": detailGiftPrograms?.ReferenceID || "",
                "EventTypeID": detailGiftPrograms?.EventTypeID || 0,
                "GiftID": Number(detailGiftPrograms?.GiftID || 0),
                "UserID": detailGiftPrograms?.UserID || 0,
                "FromDate": detailGiftPrograms?.FromDate || new Date(),
                "ToDate": detailGiftPrograms?.ToDate || new Date(),
                "IsPlanned": detailGiftPrograms?.IsPlanned || 0,
                "IsRequiredImage": detailGiftPrograms?.IsRequiredImage || 0,
                "IsRegistered": detailGiftPrograms?.IsRegistered || 0,
                "ExpirationDate": detailGiftPrograms?.ExpirationDate || new Date(),
                "GiftQuantity": detailGiftPrograms?.GiftQuantity || 0,
                "Name": detailGiftPrograms?.Name || "",
                "NameExtention1": detailGiftPrograms?.NameExtention1 || "",
                "NameExtention2": detailGiftPrograms?.NameExtention2 || "",
                "NameExtention3": detailGiftPrograms?.NameExtention3 || "",
                "NameExtention4": detailGiftPrograms?.NameExtention4 || "",
                "NameExtention5": detailGiftPrograms?.NameExtention5 || "",
                "NameExtention6": detailGiftPrograms?.NameExtention6 || "",
                "NameExtention7": detailGiftPrograms?.NameExtention7 || "",
                "NameExtention8": detailGiftPrograms?.NameExtention8 || "",
                "NameExtention9": detailGiftPrograms?.NameExtention9 || "",
                "TargetNote": detailGiftPrograms?.TargetNote || "",
                "Note": detailGiftPrograms?.Note || "",
                "Link": detailGiftPrograms?.Link || "",
                "Extention1": detailGiftPrograms?.Extention1 || "",
                "Extention2": detailGiftPrograms?.Extention2 || "",
                "Extention3": detailGiftPrograms?.Extention3 || "",
                "Extention4": detailGiftPrograms?.Extention4 || "",
                "Extention5": detailGiftPrograms?.Extention5 || "",
                "Extention6": detailGiftPrograms?.Extention6 || "",
                "Extention7": detailGiftPrograms?.Extention7 || "",
                "Extention8": detailGiftPrograms?.Extention8 || "",
                "Extention9": detailGiftPrograms?.Extention9 || "",
                "Extention10": detailGiftPrograms?.Extention10 || "",
                "Extention11": detailGiftPrograms?.Extention11 || "",
                "Extention12": detailGiftPrograms?.Extention12 || "",
                "Extention13": detailGiftPrograms?.Extention13 || "",
                "Extention14": detailGiftPrograms?.Extention14 || "",
                "Extention15": detailGiftPrograms?.Extention15 || "",
                "Extention16": detailGiftPrograms?.Extention16 || "",
                "Extention17": detailGiftPrograms?.Extention17 || "",
                "Extention18": detailGiftPrograms?.Extention18 || "",
                "Extention19": detailGiftPrograms?.Extention19 || "",
                "Extention20": detailGiftPrograms?.Extention20 || "",
                Details: listValueCustomerByGift || []
            };
            const result = await ApiPromotionGifts_Edit(body);
            const data = result.data;
            if (data.StatusCode === 200 && data.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${data.Message}`,
                    'success',
                );
                const bodyDetail = { OID: detailGiftPrograms?.OID }
                dispatch(fetchDetailGiftPrograms(bodyDetail))
                closeModalAddCustomer()
            } else {
                closeModalAddCustomer()
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${data.Message}`,
                    'error',
                );
            }
        } catch (error) {
            closeModalAddCustomer()
            NotifierAlert(
                3000,
                `${languageKey('_notification')}`,
                `${error}`,
                'error',
            );
        }
    }, 2000, { leading: true, trailing: false })

    return (
        <LinearGradient style={styles.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView style={styles.container}>
                <HeaderBack
                    title={languageKey('_gift_giving_program')}
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
                        {selectedTab.id === 1 && <Details {...{ detailGiftPrograms }} />}
                        {selectedTab.id === 2 && <Customers {...{ detailGiftPrograms }} />}
                        {selectedTab.id === 3 && <Progress {...{ detailGiftPrograms }} />}
                    </ScrollView>
                </View>
            </SafeAreaView>
            <Button
                style={styles.btnAdd}
                onPress={openModalAddCustomer}
            >
                <SvgXml xml={plus_white} />
            </Button>

            <Modal
                useNativeDriver
                backdropOpacity={0.5}
                isVisible={isShowModalAddCustomer}
                style={stylesDetail.optionsModal}
                onBackButtonPress={closeModalAddCustomer}
                onBackdropPress={closeModalAddCustomer}
                avoidKeyboard={true}
                hideModalContentWhileAnimating>
                <View style={stylesDetail.optionsModalContainerAdd}>
                    <View style={stylesDetail.headerContentAdd}>
                        <Text style={stylesDetail.titleModal}>{languageKey('_add_customer')}</Text>
                    </View>
                    <View style={stylesDetail.contentContainerAdd}>
                        <TabsHeaderDevices
                            data={TAB_ADD_CUSTOMER}
                            selected={selectedTabCustomer}
                            onSelect={setSelectTabCustomer}
                            tabWidth={2}
                        />
                        <ScrollView style={stylesDetail.containerBody} showsVerticalScrollIndicator={false}>
                            {selectedTabCustomer.id === 1 &&
                                <CurrentCustomer
                                    closeModal={closeModalAddCustomer}
                                    // setData={setListValueCustomerByGift}
                                    dataEdit={customerEdit}
                                    indexEdit={indexEdit}
                                    parentID={detailGiftPrograms?.OID}
                                    factorID={detailGiftPrograms?.FactorID}
                                    cmpnID={detailGiftPrograms?.CmpnID}
                                    listCustomer={detailGiftPrograms?.ListRegistration}
                                />
                            }
                            {selectedTabCustomer.id === 2 && <NewCustomer closeModal={closeModalAddCustomer} reason={false} />}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    )
}

export default DetailGiftProgram;