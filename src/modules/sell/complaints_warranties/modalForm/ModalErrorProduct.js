import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from "react-redux";
import { SvgXml } from "react-native-svg";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { colors, fontSize } from "@themes";
import { hScale, scale } from "@resolutions";
import { translateLang } from "@store/accLanguages/slide";
import { CardModalSelect, Button, InputDefault } from "@components";
import { close_red, close_white } from "@svgImg";
import { fetchListProductError } from "@store/acc_Complaint_Warranties/thunk";

const { height } = Dimensions.get('window');

const ModalCoreProduct = ({
    setValue,
    dataEdit,
    showModal,
    closeModal,
    itemEdit,
    isLock
}) => {
    const dispatch = useDispatch();
    const languageKey = useSelector(translateLang);
    const { listProductError } = useSelector(state => state.ComplaintWarranties);
    const [selectedProductError, setSelectedProductError] = useState(null);

    const initialValues = {
        ErrorId: 0,
        ErrorDetails: "",
        CausalDetails: "",
        ReturnQuantity: 0,
        QtyCustomer: 0,
        QtyCompany: 0
    };

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

    const handleAddNewError = () => {
        const error = {
            ErrorId: selectedProductError?.ID || 0,
            ErrorName: selectedProductError?.Name || "",
            ErrorDetails: values?.ErrorDetails || "",
            CausalDetails: values?.CausalDetails || "",
            ReturnQuantity: Number(values?.ReturnQuantity || 0),
            QtyCustomer: Number(values?.QtyCustomer || 0),
            QtyCompany: Number(values?.QtyCompany || 0)
        };
        setValue(prevError => {
            if (itemEdit) {
                return prevError.map(item =>
                    item.ErrorId === itemEdit.ErrorId &&
                        item.ErrorDetails === itemEdit.ErrorDetails &&
                        item.CausalDetails === itemEdit.CausalDetails &&
                        item.ReturnQuantity === itemEdit.ReturnQuantity
                        ? error
                        : item
                );
            }
            return [...prevError, error];
        });


        setSelectedProductError(null);
        resetForm();
        closeModal();
    };

    useEffect(() => {
        if (itemEdit) {
            setFieldValue("CausalDetails", itemEdit?.CausalDetails || "");
            setFieldValue("ErrorDetails", itemEdit?.ErrorDetails || "");
            setFieldValue("ReturnQuantity", itemEdit?.ReturnQuantity || "");
            setFieldValue("QtyCompany", itemEdit?.QtyCompany || "");
            setFieldValue("QtyCustomer", itemEdit?.QtyCustomer || "");
            const error = listProductError?.find(item => item?.ID === itemEdit?.ErrorId)
            setSelectedProductError(error);
        }
    }, [itemEdit]);

    useEffect(() => {
        if (dataEdit && dataEdit.length > 0) {
            setValue(prev => {
                if (prev.length === 0) {
                    const convertedData = dataEdit.map(item => ({
                        ErrorId: item?.ErrorId || 0,
                        ErrorName: item?.ErrorName || "",
                        ErrorDetails: item?.ErrorDetails || "",
                        CausalDetails: item?.CausalDetails || "",
                        ReturnQuantity: Number(item?.ReturnQuantity || 0),
                        QtyCustomer: Number(item?.QtyCustomer || 0),
                        QtyCompany: Number(item?.QtyCompany || 0)
                    }));
                    return convertedData;
                }
                return prev;
            });
        }
    }, [dataEdit]);

    useEffect(() => {
        dispatch(fetchListProductError())
    }, [])

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
                                <Text style={styles.titleModal}>{languageKey('_add_product_core')}</Text>
                                <Button onPress={closeModal} style={styles.btnClose} >
                                    <SvgXml xml={close_red} />
                                </Button>
                            </View>
                            <ScrollView style={styles.modalContainer} showsVerticalScrollIndicator={false}>
                                <View style={styles.input}>
                                    <CardModalSelect
                                        title={languageKey('_product_core')}
                                        data={listProductError}
                                        setValue={setSelectedProductError}
                                        value={selectedProductError?.Name}
                                        bgColor={'#F9FAFB'}
                                        disabled={isLock}
                                    />
                                </View>
                                <InputDefault
                                    name="CausalDetails"
                                    returnKeyType="next"
                                    style={styles.input}
                                    value={values?.CausalDetails}
                                    label={languageKey('_reason')}
                                    isEdit={isLock ? false : true}
                                    placeholderInput={true}
                                    labelHolder={languageKey('_enter_content')}
                                    bgColor={'#F9FAFB'}
                                    {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                                />
                                <InputDefault
                                    name="ErrorDetails"
                                    returnKeyType="next"
                                    style={styles.input}
                                    value={values?.ErrorDetails}
                                    label={languageKey('_core_details')}
                                    isEdit={isLock ? false : true}
                                    placeholderInput={true}
                                    labelHolder={languageKey('_enter_content')}
                                    bgColor={'#F9FAFB'}
                                    {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                                />
                                <InputDefault
                                    name="ReturnQuantity"
                                    returnKeyType="next"
                                    style={styles.input}
                                    value={String(values?.ReturnQuantity)}
                                    label={languageKey('_quantity_returned')}
                                    isEdit={isLock ? false : true}
                                    placeholderInput={true}
                                    labelHolder={languageKey('_enter_content')}
                                    keyboardType={'numeric'}
                                    bgColor={'#F9FAFB'}
                                    {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                                />
                                <InputDefault
                                    name="QtyCustomer"
                                    returnKeyType="next"
                                    style={styles.input}
                                    value={String(values?.QtyCustomer)}
                                    label={languageKey('_quantiy_of_goods_in_customers_warehouse')}
                                    isEdit={isLock ? false : true}
                                    placeholderInput={true}
                                    labelHolder={languageKey('_enter_content')}
                                    keyboardType={'numeric'}
                                    bgColor={'#F9FAFB'}
                                    {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                                />
                                <InputDefault
                                    name="QtyCompany"
                                    returnKeyType="next"
                                    style={styles.input}
                                    value={String(values?.QtyCompany)}
                                    label={languageKey('_number_of_goods_in_stock')}
                                    isEdit={isLock ? false : true}
                                    placeholderInput={true}
                                    keyboardType={'numeric'}
                                    labelHolder={languageKey('_enter_content')}
                                    bgColor={'#F9FAFB'}
                                    {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                                />
                            </ScrollView>
                            <View style={styles.footer}>
                                <Button style={styles.btnFooterCancel} onPress={closeModal}>
                                    <Text style={styles.txtBtnFooterCancel}>{languageKey('_cancel')}</Text>
                                </Button>
                                <Button style={styles.btnFooterApproval} onPress={handleAddNewError} disabled={isLock}>
                                    <Text style={styles.txtBtnFooterApproval}>{languageKey('_add')}</Text>
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
    btnAddContact: {
        borderWidth: scale(1),
        borderColor: colors.blue,
        borderRadius: scale(12),
        height: hScale(38),
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: scale(12),
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    optionsModalContainer: {
        height: height / 1.7,
    },
    modalContainer: {
        overflow: 'hidden',
        backgroundColor: colors.white,
        maxHeight: height / 1.7,
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
        fontFamily: 'Inter-Regular',
        color: colors.black,
        marginLeft: scale(4),
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
        flexDirection: 'row',
        flex: 1
    },
    txtHeaderBody: {
        color: '#6B7280',
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
        paddingBottom: scale(100)
    },
    line: {
        borderWidth: scale(0.5),
        borderColor: colors.borderColor,
        marginVertical: scale(16),
        marginHorizontal: scale(12)
    },
})

export default ModalCoreProduct;