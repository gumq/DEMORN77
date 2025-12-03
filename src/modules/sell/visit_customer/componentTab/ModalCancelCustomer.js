import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from "react-redux";
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from "react-native";

import { colors, fontSize } from "@themes";
import { hScale, scale } from "@resolutions";
import { ApiVisitForUsers_Cancel } from "@api";
import { translateLang } from "@store/accLanguages/slide";
import { fetchListCancelReason, fetchListVisitCustomer } from "@store/accVisit_Customer/thunk";
import { InputDefault, CardModalSelect, Button, AttachManyFile, NotifierAlert } from "@components";

const ModalCancelCustomer = ({
    parentID,
    showModal,
    closeModal,
    selectedItem,
    dateStates
}) => {
    const languageKey = useSelector(translateLang);
    const dispatch = useDispatch()
    const [valueCancelReason, setValueCancelReason] = useState(null);
    const { listCancelReason } = useSelector(state => state.VisitCustomer);
    const [linkImage, setLinkImage] = useState('');
    const [images, setDataImages] = useState([])

    const initialValues = {
        StatisticReason: ""
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
    } = useFormik({
        initialValues
    });

    const handleCancel = async () => {
        const errors = [];
        if (!valueCancelReason?.ID) {
            errors.push(languageKey('_please_select_reason_cancel'));
        }
        if (errors.length > 0) {
            Alert.alert(errors[0]);
            return;
        }

        const linkArray = typeof linkImage === 'string' ? linkImage.split(';') : Array.isArray(linkImage) ? linkImage : [];
        const linkString = linkArray.join(';');
        const body = {
            ID: parentID || 0,
            StatusID: valueCancelReason?.ID || 0,
            StatisticReason: values?.StatisticReason || '',
            Link: linkString || ''
        }
        try {
            const result = await ApiVisitForUsers_Cancel(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                const body = {
                    Option: selectedItem?.key ?? 0,
                    FromDate: dateStates?.fromDate?.submit ?? new Date(),
                    ToDate: dateStates?.toDate?.submit ?? new Date(),
                }
                dispatch(fetchListVisitCustomer(body))
                closeModal()
            } else {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'error',
                );
            }
        } catch (error) {
            console.log('handleOrderRequest', error);
        }
    }

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
                                <Text style={styles.titleModal}>{languageKey('_cancel_visit')}</Text>
                            </View>
                            <ScrollView style={styles.modalContainer} showsVerticalScrollIndicator={false}>
                                <View style={styles.input}>
                                    <CardModalSelect
                                        title={languageKey('_reason_for_cancel')}
                                        data={listCancelReason}
                                        setValue={setValueCancelReason}
                                        value={valueCancelReason?.Name}
                                        bgColor={'#F9FAFB'}
                                        require={true}
                                    />
                                </View>
                                <InputDefault
                                    name="StatisticReason"
                                    returnKeyType="next"
                                    style={styles.input}
                                    value={values?.StatisticReason}
                                    label={languageKey('_explain')}
                                    isEdit={true}
                                    placeholderInput={true}
                                    labelHolder={languageKey('_enter_content')}
                                    bgColor={'#F9FAFB'}
                                    {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                                />
                                <Text style={styles.headerBoxImage}>{languageKey('_image')}</Text>
                                <View style={styles.imgBox}>
                                    <AttachManyFile
                                        OID={parentID}
                                        images={images}
                                        setDataImages={setDataImages}
                                        setLinkImage={setLinkImage}
                                        dataLink={linkImage}
                                    />
                                </View>
                            </ScrollView>
                            <View style={styles.footer}>
                                <Button
                                    style={styles.btnFooterCancel}
                                    onPress={closeModal}
                                >
                                    <Text style={styles.txtBtnFooterCancel}>{languageKey('_cancel')}</Text>
                                </Button>
                                <Button
                                    style={styles.btnFooterApproval}
                                    onPress={handleCancel}
                                >
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
    label: {
        color: colors.black,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        marginHorizontal: scale(16),
        marginTop: scale(4)
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    optionsModalContainer: {
        height: 'auto',
    },
    modalContainer: {
        overflow: 'hidden',
        backgroundColor: colors.white,
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
        marginLeft: scale(4)
    },
    txtBtnFooterApproval: {
        color: colors.white,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    headerBoxImage: {
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        color: colors.black,
        marginLeft: scale(12),
        marginTop: scale(8)
    },
    imgBox: {
        marginLeft: scale(12),
    },
})

export default ModalCancelCustomer;