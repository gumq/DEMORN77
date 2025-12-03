import React, { useEffect, useState } from "react";
import _ from 'lodash';
import Modal from 'react-native-modal';
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, StyleSheet, ScrollView, Dimensions, FlatList } from "react-native";

import ModalGoods from "./ModalGoods";
import { colors, fontSize } from "@themes";
import { hScale, scale } from "@resolutions";
import { close_red, close_white, trash_22 } from "@svgImg";
import { translateLang } from "@store/accLanguages/slide";
import { CardModalSelect, Button, ModalSelectDate, NotifierAlert } from "@components";
import { fetchDetailComplaintWarranties, fetchListItemBySO, fetchListNotOD, fetchListODBySO } from "@store/acc_Complaint_Warranties/thunk";
import moment from "moment";
import { ApiComplaints_AddProfile, ApiComplaints_EditProfile, ApiComplaints_SubmitProfile } from "@api";

const { height } = Dimensions.get('window');

const ModalAddSO = ({
    isLock,
    dataEdit,
    editSO,
    showModal,
    closeModal,
    OID,
}) => {
    const languageKey = useSelector(translateLang);
    const dispatch = useDispatch();
    const { listSOByCustomer, listODBySO, listNotOD } = useSelector(state => state.ComplaintWarranties);
    const [listGoods, setListGoods] = useState([]);
    const [selectedSO, setValueSO] = useState(null);
    const [selectedOD, setSelectedOD] = useState(null);
    const [selectedNotOD, setSelectedNotOD] = useState(null);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [selectedValueSubmitForm, setSelectedValueSubmitForm] = useState();
    const [selectedValue, setSelectedValue] = useState();
    const [isShowModalGood, setIsShowModalGood] = useState(false);
    const [itemEdit, setItemEdit] = useState(null);

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const showModalGood = () => {
        setIsShowModalGood(true);
    };

    const closeModalGood = () => {
        setIsShowModalGood(false);
    };

    const handleAddNewSO = _.debounce(async () => {
        const body = {
            ID: editSO ? dataEdit?.ID : 0,
            OID: OID || '',
            ReferenceID: selectedSO?.OID || '',
            ODReferenceID: selectedOD?.OID || '',
            NotSOReferenceID: selectedNotOD?.OID || '',
            "DocumentTypeID": 0,
            "DocumentNumberID": 0,
            "DocumentNote": "string",
            "PhoneHotLine": "string",
            "SalesOrg": "string",
            "SalesArea": 0,
            "SalesRegion": 0,
            "SalesChannelID": 0,
            "SalesUserID": "string",
            "QtySO": 0,
            "QtyReturn": 0,
            "QtyFault": 0,
            "QtyAtCustomer": 0,
            "QtyReceived": 0,
            "FaultValue": 0,
            ReturnDate: selectedValueSubmitForm,
            "Extention1": "",
            "Extention2": "",
            "Extention3": "",
            "Extention4": "",
            "Extention5": "",
            "Extention6": "",
            "Extention7": "",
            "Extention8": "",
            "Extention9": "",
            "Extention10": "",
            ListItem: listGoods || []
        }
        try {
            const result = editSO ? await ApiComplaints_EditProfile(body) : await ApiComplaints_AddProfile(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                const bodyDetail = { OID: OID }
                dispatch(fetchDetailComplaintWarranties(bodyDetail))
            } else {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'error',
                );
            }
        } catch (error) {
            console.log('handleCreditRequest', error);
        }
    }, 2000, { leading: true, trailing: false });

    const handleConfirm = _.debounce(async () => {
        const body = {
            OID: OID,
            ReferenceID: selectedSO?.OID,
        }
        try {
            const result = await ApiComplaints_SubmitProfile(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                const bodyDetail = { OID: OID }
                dispatch(fetchDetailComplaintWarranties(bodyDetail))
                setValueSO(null);
                setSelectedOD(null)
                setSelectedValue(new Date());
                setSelectedNotOD(null)
                setListGoods([])
                closeModal();
            } else {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'error',
                );
            }
        } catch (error) {
            console.log('handleConfirm', error);
        }
    }, 2000, { leading: true, trailing: false });

    useEffect(() => {
        if (dataEdit) {
            setSelectedValue(dataEdit?.ReturnDate)
            const numberSO = listSOByCustomer?.find(item => item?.OID === dataEdit?.ReferenceID)
            setValueSO(numberSO);
            const numberOD = listODBySO?.find(item => item?.OID === dataEdit?.ODReferenceID)
            setSelectedOD(numberOD);
            const notNumberOD = listNotOD?.find(item => item?.OID === dataEdit?.NotSOReferenceID)
            setSelectedNotOD(notNumberOD);
            setListGoods(dataEdit?.ListItem);
        }
    }, [dataEdit]);

    useEffect(() => {
        const bodyItem = {
            OID: selectedSO?.OID
        }
        dispatch(fetchListItemBySO(bodyItem))
        const bodyOD = {
            ReferenceID: selectedSO?.OID
        }
        dispatch(fetchListODBySO(bodyOD))
        dispatch(fetchListNotOD())
    }, [selectedSO])

    const handleDelete = (item) => {
        setListGoods(listGoods?.filter(good => good?.ItemID !== item?.ItemID))
    }

    const handleEditGood = (good) => {
        setItemEdit(good)
        setIsShowModalGood(true)
    };

    const _keyExtractor = (item, index) => `${item.ID}-${index}`;
    const _renderItem = ({ item }) => {
        return (
            <Button style={styles.cardProgram} onPress={() => handleEditGood(item)}>
                <View style={styles.row}>
                    <Text style={styles.headerProgram}>{item?.Name}</Text>
                    {isLock ? null :
                        <Button onPress={() => handleDelete(item)}>
                            <SvgXml xml={trash_22} />
                        </Button>
                    }
                </View>
                <Text style={styles.txtDescription}>{item?.SKU}</Text>
                <View style={styles.containerBodyCard}>
                    <View style={styles.bodyCard}>
                        <View style={styles.contentCard}>
                            <Text style={styles.txtHeaderBody}>{languageKey('_describle_reason')}</Text>
                            <Text style={styles.contentBody}>{item.ErrorDescription}</Text>
                        </View>
                        <View style={styles.contentCard}>
                            <Text style={styles.txtHeaderBody}>{languageKey('_forwarding_department')}</Text>
                            <Text style={styles.contentBody}>{item.ErrorDepartmentName}</Text>
                        </View>
                        <View style={styles.contentCard}>
                            <Text style={styles.txtHeaderBody}>{languageKey('_request_from_date')}</Text>
                            <Text style={styles.contentBody}>{moment(item.RequestFromDate).format('DD/MM/YYYY')}</Text>
                        </View>
                        <View style={styles.contentCard}>
                            <Text style={styles.txtHeaderBody}>{languageKey('_request_to_date')}</Text>
                            <Text style={styles.contentBody}>{moment(item.RequestToDate).format('DD/MM/YYYY')}</Text>
                        </View>
                    </View>
                </View>
            </Button>
        );
    };

    return (
        <View>
            {showModal && (
                <View >
                    <Modal
                        isVisible={showModal}
                        useNativeDriver={true}
                        onBackdropPress={closeModal}
                        onBackButtonPress={closeModal}
                        backdropTransitionOutTiming={450}
                        avoidKeyboard={true}
                        style={styles.modal}>
                        <View style={styles.optionsModalContainer}>
                            <View style={styles.headerModal}>
                                <View style={styles.btnClose} >
                                    <SvgXml xml={close_white} />
                                </View>
                                <Text style={styles.titleModal}>{languageKey('_add_new_so')}</Text>
                                <Button onPress={closeModal} style={styles.btnClose} >
                                    <SvgXml xml={close_red} />
                                </Button>
                            </View>
                            <ScrollView style={styles.modalContainer} showsVerticalScrollIndicator={false}>
                                <Text style={styles.header}>{languageKey('_information_general')}</Text>
                                <View style={styles.input}>
                                    <CardModalSelect
                                        title={languageKey('_so_number')}
                                        data={listSOByCustomer}
                                        setValue={setValueSO}
                                        value={selectedSO?.OID}
                                        bgColor={'#F9FAFB'}
                                        disabled={isLock}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <CardModalSelect
                                        title={languageKey('_od_information')}
                                        data={listODBySO}
                                        setValue={setSelectedOD}
                                        value={selectedOD?.OID}
                                        bgColor={'#F9FAFB'}
                                        disabled={isLock}
                                    />
                                </View>
                                <View style={{ width: '100%' }}>
                                    <ModalSelectDate
                                        title={languageKey('_return_date')}
                                        showDatePicker={showDatePicker}
                                        hideDatePicker={hideDatePicker}
                                        initialValue={selectedValue}
                                        selectedValueSelected={setSelectedValue}
                                        isDatePickerVisible={isDatePickerVisible}
                                        selectSubmitForm={setSelectedValueSubmitForm}
                                        bgColor={'#F9FAFB'}
                                        disabled={isLock}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <CardModalSelect
                                        title={languageKey('outward_delivery_so')}
                                        data={listNotOD}
                                        setValue={setSelectedNotOD}
                                        value={selectedNotOD?.OID}
                                        bgColor={'#F9FAFB'}
                                        disabled={isLock}
                                        keyOID={true}
                                    />
                                </View>
                                <View style={styles.line} />
                                <View style={styles.containerAdd}>
                                    <Text style={styles.header}>{languageKey('_product_list')}</Text>
                                    <Button style={styles.btnUploadItem} onPress={showModalGood} disabled={isLock}>
                                        <Text style={styles.txtBtnUploadItem}>{languageKey('_add')}</Text>
                                    </Button>
                                </View>
                                <ModalGoods
                                    setValue={setListGoods}
                                    showModal={isShowModalGood}
                                    closeModal={closeModalGood}
                                    OID={OID}
                                    itemEditGood={itemEdit}
                                    dataEdit={listGoods}
                                    isLock={isLock}
                                />
                                {listGoods?.length > 0 ?
                                    <View style={styles.card}>
                                        <FlatList
                                            data={listGoods}
                                            renderItem={_renderItem}
                                            keyExtractor={_keyExtractor}
                                            contentContainerStyle={styles.containerFlat}
                                        />
                                    </View>
                                    : null
                                }

                            </ScrollView>
                            <View style={styles.footer}>
                                <Button style={styles.btnFooterCancel} onPress={handleAddNewSO} disabled={isLock}>
                                    <Text style={styles.txtBtnFooterCancel}>{languageKey('_save')}</Text>
                                </Button>
                                <Button style={styles.btnFooterApproval} onPress={handleConfirm} disabled={isLock}>
                                    <Text style={styles.txtBtnFooterApproval}>{languageKey('_confirm')}</Text>
                                </Button>
                            </View>
                        </View>
                    </Modal>
                </View>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: fontSize.size16,
        fontWeight: '600',
        lineHeight: scale(24),
        fontFamily: 'Inter-SemiBold',
        color: colors.black,
        marginHorizontal: scale(8)
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    optionsModalContainer: {
        height: height / 1.2,
    },
    modalContainer: {
        overflow: 'hidden',
        backgroundColor: colors.white,
        maxHeight: height / 1.2,
    },
    headerModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: scale(1),
        borderBottomColor: colors.graySystem2,
        backgroundColor: colors.white,
        borderTopLeftRadius: scale(12),
        borderTopRightRadius: scale(12),
        paddingVertical: scale(10),
        paddingHorizontal: scale(12),
    },
    titleModal: {
        fontFamily: 'Inter-SemiBold',
        fontSize: fontSize.size16,
        lineHeight: scale(24),
        fontWeight: '600',
        color: colors.black,
        flex: 1,
        textAlign: 'center',
    },
    input: {
        marginHorizontal: scale(12),
        marginVertical: scale(4),
    },
    cardProgram: {
        backgroundColor: colors.white,
        marginHorizontal: scale(12),
        marginTop: scale(8),
        borderRadius: scale(8),
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        paddingHorizontal: scale(8),
    },
    contentBody: {
        fontSize: fontSize.size14,
        fontWeight: '400',
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        color: colors.black,
        overflow: 'hidden',
        width: '90%'
    },
    containerBody: {
        flexDirection: 'row',
        marginHorizontal: scale(8),
        alignItems: 'center',
        marginBottom: scale(4)
    },
    footer: {
        backgroundColor: colors.white,
        borderTopColor: colors.borderColor,
        borderTopWidth: scale(1),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: scale(12),
        paddingVertical: scale(8)
    },
    btnFooterCancel: {
        flex: 1,
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        height: hScale(38),
        borderRadius: scale(8),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(4)
    },
    txtBtnFooterCancel: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    btnFooterApproval: {
        flex: 1,
        backgroundColor: colors.blue,
        height: hScale(38),
        borderRadius: scale(8),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: scale(4)
    },
    txtBtnFooterApproval: {
        color: colors.white,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    containerBodyCard: {
        marginVertical: scale(8)
    },
    headerProgram: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        marginTop: scale(8),
    },
    contentCard: {
        marginBottom: scale(4),
        flex: 1
    },
    txtHeaderBody: {
        color: '#525252',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    card: {
        backgroundColor: colors.white,
        paddingBottom: scale(8)
    },
    containerFlat: {
        marginBottom: scale(200)
    },
    containerAdd: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: scale(12)
    },
    btnUploadItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: scale(6),
        borderWidth: scale(1),
        borderColor: colors.blue,
        width: 'auto',
    },
    txtBtnUploadItem: {
        color: colors.blue,
        fontSize: fontSize.size12,
        fontWeight: '400',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        marginLeft: scale(4),
        paddingHorizontal:scale(4)
    },
    line: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        marginVertical: scale(16),
        marginHorizontal: scale(12)
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    txtDescription: {
        fontFamily: 'Inter-Regular',
        fontWeight: '400',
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        color: '#525252',
    },
})

export default ModalAddSO;