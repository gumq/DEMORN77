import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from "react-redux";
import { View, Text, StyleSheet, Platform, ScrollView, Dimensions } from "react-native";

import { Button } from "../buttons";
import { colors, fontSize } from "@themes";
import { hScale, scale } from "@resolutions";
import { translateLang } from "@store/accLanguages/slide";
import { InputDefault, CardModalSelect } from "@components";
import { ApiOrders_EditPrices } from "@api";
import { fetchListItem } from "@store/accOther_Proposal/thunk";

const { height } = Dimensions.get('window');
const ModalGoodsProposalShowroom = ({
    setValueGoods,
    showModalGoods,
    closeModalGoods,
    factorID,
    entryID,
    editingItem,
    customerID
}) => {
    const dispatch = useDispatch();
    const languageKey = useSelector(translateLang);
    const { listItems } = useSelector(state => state.OtherProposal);
    const [selectedValueItems, setSelectedValueItems] = useState(null);
    const [selectedValueItemsPrice, setSelectedValueItemsPrice] = useState(null);
    const [selectedItemType, setSelectItemType] = useState(null);

    const dataItemType = [
        { Code: 'GIFT', Name: languageKey('_gift'), ID: 1 },
        { Code: 'CONSIGNMENT', Name: languageKey('_consignment'), ID: 2 }
    ]

    useEffect(() => {
        dispatch(fetchListItem());
    }, [])

    const initialValues = {
        ItemQty: "",
        Note: ""
    }

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

    const handleAddNewProduct = () => {
        const newItemDetail = {
            ID: editingItem?.ID || 0,
            ItemType: selectedItemType?.Code || '',
            ItemID: selectedValueItems?.ID,
            ItemName: selectedValueItems?.Name || '',
            OID: "",
            ItemQty: values?.ItemQty || 0,
            ItemUnit: selectedValueItems?.UnitSaleID,
            ItemPrice: selectedValueItemsPrice?.Price || 0,
            TotalAmount: selectedValueItemsPrice?.TotalAmount || 0,
            Note: values?.Note || '',
            Link: "",
            VehicleTypeID: 0,
            IsGiftCompleted: 0,
            IsConsigned: 0,
            Extention1: "",
            Extention2: "",
            Extention3: "",
            Extention4: "",
            Extention5: "",
            Extention6: "",
            Extention7: "",
            Extention8: "",
            Extention9: "",
            Extention10: ""
        };

        setValueGoods(prev => {
            if (editingItem) {
                return prev.map(item =>
                    item.ItemID === editingItem.ItemID ? newItemDetail : item
                );
            } else {
                return [...(Array.isArray(prev) ? prev : []), newItemDetail];
            }
        });

        setSelectedValueItems(null);
        resetForm();
        setSelectedValueItemsPrice(null);
        setSelectItemType(null);
        closeModalGoods();
    };

    useEffect(() => {
        if (editingItem) {
            console.log('editingItem',editingItem);
            setSelectedValueItems({
                ID: editingItem.ItemID,
                Name: editingItem.ItemName,
                UnitSale: editingItem.ItemUnit
            });
            setFieldValue('ItemQty', editingItem?.ItemQty);
            setFieldValue('Note', editingItem.Note);
            setSelectedValueItemsPrice({
                Price: editingItem.ItemPrice,
                TotalAmount: editingItem.TotalAmount
            });
            const type = dataItemType?.filter(item => item?.Code === editingItem?.ItemType);
            setSelectItemType(type[0])
        }
    }, [editingItem]);

    const handleGetPriceItemByQuantity = async () => {
        const body = {
            FactorID: factorID || 0,
            EntryID: entryID || 0,
            CustomerID: customerID || 0,
            PriceGroupID: 0,
            Items: [{
                ID: 0,
                ItemID: selectedValueItems?.ID || 0,
                VAT: Number(selectedValueItems?.VATValue || 0),
                ApprovedQuantity: values?.ItemQty || 0,
                ApplyDiscount: 0,
                ApplyPromotion: 0,
                ApplyExhibition: 0,
                ApplyShipping: 0,
                Details: "[]"
            }]
        }
        try {
            const result = await ApiOrders_EditPrices(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                setSelectedValueItemsPrice(responeData?.Result[0])
            } else {
                setSelectedValueItemsPrice(null)
            }
        } catch (error) {
            console.log('handleGetPriceItemByQuantity', error);
        }
    }

    useEffect(() => {
        if (values?.ItemQty) {
            handleGetPriceItemByQuantity();
        }
    }, [values?.ItemQty]);

    return (
        <View>
            {showModalGoods && (
                <View >
                    <Modal
                        isVisible={showModalGoods}
                        useNativeDriver={true}
                        onBackdropPress={closeModalGoods}
                        onBackButtonPress={closeModalGoods}
                        backdropTransitionOutTiming={450}
                        avoidKeyboard={true}
                        style={styles.modal}>
                        <View style={styles.optionsModalContainer}>
                            <View style={styles.headerModal}>
                                <Text style={styles.titleModal}>{languageKey('_add_products')}</Text>
                            </View>
                            <ScrollView style={styles.modalContainer} showsVerticalScrollIndicator={false}>
                                <View style={styles.input}>
                                    <CardModalSelect
                                        title={languageKey('_product')}
                                        data={listItems}
                                        setValue={setSelectedValueItems}
                                        value={selectedValueItems?.Name}
                                        bgColor={'#F9FAFB'}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <Text style={styles.txtHeaderInputView}>{languageKey('_product_code')}</Text>
                                    <Text
                                        style={styles.inputView}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {selectedValueItemsPrice ? selectedValueItemsPrice?.ItemID : 'Chưa có mã'}
                                    </Text>
                                </View>
                                <View style={styles.inputAuto}>
                                    <View style={styles.widthInput}>
                                        <CardModalSelect
                                            title={languageKey('_product_type')}
                                            data={dataItemType}
                                            setValue={setSelectItemType}
                                            value={selectedItemType?.Name}
                                            bgColor={'#F9FAFB'}
                                        />
                                    </View>
                                    <InputDefault
                                        name="ItemQty"
                                        returnKeyType="next"
                                        style={styles.widthInput}
                                        value={values?.ItemQty}
                                        label={languageKey('_quantity')}
                                        isEdit={true}
                                        placeholderInput={true}
                                        labelHolder={'1'}
                                        bgColor={'#F9FAFB'}
                                        {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                                    />
                                </View>
                                <View style={styles.inputAuto}>
                                    <View style={styles.inputRead}>
                                        <Text style={styles.txtHeaderInputView}>{languageKey('_unit_price')}</Text>
                                        <Text
                                            style={styles.inputView}
                                            numberOfLines={2}
                                            ellipsizeMode="tail"
                                        >
                                            {selectedValueItemsPrice?.Price ? Number(selectedValueItemsPrice?.Price).toLocaleString('vi-VN') : 0}
                                        </Text>
                                    </View>
                                    <View style={styles.inputRead}>
                                        <Text style={styles.txtHeaderInputView}>{languageKey('_money')}</Text>
                                        <Text
                                            style={styles.inputView}
                                            numberOfLines={2}
                                            ellipsizeMode="tail"
                                        >
                                            {selectedValueItemsPrice?.TotalAmount ? Number(selectedValueItemsPrice?.TotalAmount).toLocaleString('vi-VN') : 0}
                                        </Text>
                                    </View>
                                </View>
                                <InputDefault
                                    name="Note"
                                    returnKeyType="next"
                                    style={styles.input}
                                    value={values?.Note}
                                    label={languageKey('_note')}
                                    isEdit={true}
                                    placeholderInput={true}
                                    labelHolder={languageKey('_enter_content')}
                                    bgColor={'#F9FAFB'}
                                    {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                                />
                            </ScrollView>
                            <View style={styles.footer}>
                                <Button style={styles.btnFooterCancel} onPress={closeModalGoods}>
                                    <Text style={styles.txtBtnFooterCancel}>{languageKey('_cancel')}</Text>
                                </Button>
                                <Button style={styles.btnFooterApproval} onPress={handleAddNewProduct}>
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
    txtBtnAdd: {
        color: colors.blue,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
        fontSize: fontSize.size14,
    },
    label: {
        color: colors.black,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        marginHorizontal: scale(16),
        marginTop: scale(4)
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
        height: height / 2,
    },
    modalContainer: {
        overflow: 'hidden',
        backgroundColor: colors.white,
        maxHeight: height / 2
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
    btnFooterModal: {
        alignItems: 'center',
        backgroundColor: colors.blue,
        borderRadius: scale(12),
        height: hScale(38),
        paddingVertical: scale(Platform.OS === "android" ? 6 : 8),
        marginTop: scale(12),
        marginBottom: scale(12),
        marginHorizontal: scale(12)
    },
    txtBtnFooterModal: {
        color: colors.white,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: scale(12),
        marginTop: scale(12),
        backgroundColor: colors.white
    },
    txtItem: {
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        color: colors.black
    },
    txtDescription: {
        fontFamily: 'Inter-Regular',
        fontWeight: '400',
        fontSize: fontSize.size12,
        lineHeight: scale(18),
        color: '#6B6F80',
    },
    input: {
        marginHorizontal: scale(12),
        marginVertical: scale(4),
    },
    cardProgram: {
        backgroundColor: colors.white,
        marginHorizontal: scale(12),
        marginTop: scale(12),
        borderRadius: scale(8),
        borderWidth: scale(1),
        borderColor: colors.borderColor,
    },
    itemBody_two: {
        flexDirection: 'row',
        borderRadius: scale(12),
        padding: scale(8)
    },
    containerItem: {
        justifyContent: 'flex-end',
        flex: 1
    },
    containerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    containerStatus: {
        flexDirection: 'row',
    },
    txtTitleItem: {
        fontSize: fontSize.size16,
        fontWeight: '600',
        lineHeight: scale(24),
        fontFamily: 'Inter-SemiBold',
        color: colors.black,
    },
    bodyStatus: {
        borderRadius: scale(4),
        paddingHorizontal: scale(6),
        paddingVertical: scale(2),
        marginRight: scale(8),
        width: 'auto',
    },
    txtStatus: {
        fontSize: fontSize.size12,
        fontWeight: '500',
        lineHeight: scale(18),
        fontFamily: 'Inter-Medium',
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
    inputAuto: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: scale(4)
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
    widthInput: {
        flex: 1,
        marginHorizontal: scale(12)
    },
})

export default ModalGoodsProposalShowroom;