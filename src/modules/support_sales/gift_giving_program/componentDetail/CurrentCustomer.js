import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import _ from 'lodash';
import { useDispatch, useSelector } from "react-redux";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";

import { colors, fontSize } from "@themes";
import { hScale, scale } from "@resolutions";
import { translateLang } from "@store/accLanguages/slide";
import { InputDefault, CardModalSelect, Button, NotifierAlert, } from "@components";
import { fetchListCancelReason } from "@store/accVisit_Customer/thunk";
import { fetchDetailGiftPrograms } from "@store/accGift_Program/thunk";
import { ApiPromotionGifts_Edit } from "@api";

const { height } = Dimensions.get('window')

const CurrentCustomer = ({ closeModal, listCustomer }) => {
    const languageKey = useSelector(translateLang);
    const dispatch = useDispatch()
    const [valueCustomer, setValueCustomer] = useState(null);
    const { listCustomerByUserID } = useSelector(state => state.Login);
    const { detailGiftPrograms } = useSelector(state => state.GiftProgram);

    const initialValues = {
        Quantity: "0"
    }

    useEffect(() => {
        dispatch(fetchListCancelReason())
    }, [])

    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        resetForm
    } = useFormik({
        initialValues
    });

    const mergedDetails = [...listCustomer];

    const newDetail = {
        OID: '',
        ReferenceID: detailGiftPrograms?.OID || '',
        FactorID: detailGiftPrograms?.FactorID || '',
        EntryID: "PromotionGiftDetails",
        CmpnID: String(detailGiftPrograms?.CmpnID || 0),
        CustomerID: valueCustomer?.ID || 0,
        CustomerName: valueCustomer?.Name || '',
        Address: valueCustomer?.FullAddress || '',
        Extention1: valueCustomer?.FullAddress || '',
        Extention2: "",
        Extention3: "",
        Extention4: "",
        Extention5: "",
        Extention6: "",
        Extention7: "",
        Extention8: "",
        Extention9: "",
        AllocatedQuantity: 0,
        ODate: new Date(),
        RequestedQuantity: Number(values?.RequestedQuantity || 0),
        RegistrationTime: new Date(),
        Note: "",
        Link: ""
    };


    const exists = mergedDetails.some(item => item.CustomerID === newDetail.CustomerID);
    if (!exists) {
        mergedDetails.push(newDetail);
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
                Details: mergedDetails || []
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
                closeModal()
            } else {
                closeModal()
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${data.Message}`,
                    'error',
                );
            }
        } catch (error) {
            closeModal()
            NotifierAlert(
                3000,
                `${languageKey('_notification')}`,
                `${error}`,
                'error',
            );
        }
    }, 2000, { leading: true, trailing: false })

    // useEffect(() => {
    //     if (dataEdit && indexEdit !== null) {
    //         setFieldValue("RequestedQuantity", dataEdit?.RequestedQuantity || "");
    //         setValueCustomer(listCustomerByUserID?.find(r => r.ID === dataEdit?.CustomerID));
    //         setEditingIndex(indexEdit)
    //     }
    // }, [dataEdit, indexEdit]);

    return (
        <View style={styles.container}>
            <View style={styles.input}>
                <CardModalSelect
                    title={languageKey('_customer')}
                    data={listCustomerByUserID}
                    setValue={setValueCustomer}
                    value={valueCustomer?.Name}
                    bgColor={'#F9FAFB'}
                />
            </View>
            <View style={styles.inputRead}>
                <Text style={styles.txtHeaderInputView}>{languageKey('_address')}</Text>
                <Text
                    style={styles.inputView}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {valueCustomer ? valueCustomer?.FullAddress : 'Chưa có thông tin'}
                </Text>
            </View>

            <View style={styles.inputAuto}>
                <View style={styles.inputRead}>
                    <Text style={styles.txtHeaderInputView}>{languageKey('_phone')}</Text>
                    <Text
                        style={styles.inputView}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {valueCustomer ? valueCustomer?.Phone : 'Chưa có thông tin'}
                    </Text>
                </View>
                <View style={styles.inputRead}>
                    <InputDefault
                        name="RequestedQuantity"
                        returnKeyType="next"
                        value={values?.RequestedQuantity}
                        label={languageKey('_recommended_quantity')}
                        isEdit={true}
                        placeholderInput={true}
                        labelHolder={languageKey('_enter_content')}
                        bgColor={'#F9FAFB'}
                        {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                    />
                </View>
            </View>

            <View style={styles.footer}>
                <Button
                    style={styles.btnFooterCancel}
                    onPress={closeModal}
                >
                    <Text style={styles.txtBtnFooterCancel}>{languageKey('_cancel')}</Text>
                </Button>
                <Button
                    style={styles.btnFooterApproval}
                    onPress={handleConfirm}
                >
                    <Text style={styles.txtBtnFooterApproval}>{languageKey('_add')}</Text>
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        height: height
    },
    input: {
        marginHorizontal: scale(12),
        marginVertical: scale(4),
    },
    footer: {
        flexDirection: 'row',
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    btnFooterCancel: {
        flex: 1,
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        height: hScale(38),
        borderRadius: scale(8),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(4),
         marginBottom: scale(Platform.OS === 'android' ? 0 : 16),
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
        marginLeft: scale(4),
         marginBottom: scale(Platform.OS === 'android' ? 0 : 16),
    },
    txtBtnFooterApproval: {
        color: colors.white,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    inputAuto: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: scale(8)
    },
    inputRead: {
        flex: 1,
        marginHorizontal: scale(12)
    },
    txtHeaderInputView: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
        lineHeight: scale(22),
    },
    inputView: {
        borderRadius: scale(8),
        paddingLeft: scale(10),
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
        marginTop: scale(8),
        borderWidth: scale(1),
        borderColor: '#D1D3DB',
        backgroundColor: '#E5E7EB',
        paddingVertical: scale(7),
        color: colors.black
    },
})

export default CurrentCustomer;