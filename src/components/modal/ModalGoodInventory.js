import React, { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from "react-redux";
import { SvgXml } from "react-native-svg";
import { View, Text, StyleSheet, Platform, ScrollView, Dimensions, FlatList } from "react-native";

import { Button } from "../buttons";
import { colors, fontSize } from "@themes";
import { hScale, scale } from "@resolutions";
import { translateLang } from "@store/accLanguages/slide";
import { InputDefault, CardModalSelect } from "@components";
import { close_red, close_white } from "@svgImg";
import { fetchListItems, fetchListWarehouseFactory } from "@store/accInventory/thunk";

const { height } = Dimensions.get('window');

const ModalGoodInventory = ({
    setValueGoods,
    dataEdit,
    parentID,
    showModalGoods,
    closeModalGoods,
}) => {
    const languageKey = useSelector(translateLang);
    const dispatch = useDispatch();
    const { listGoodsTypes, listItem, listFactory, listWarehouse } = useSelector(state => state.Inventory);
    const [listGoods, setListGoods] = useState([]);
    const [selectedValueGoodType, setSelectedValueGoodType] = useState(null);
    const [selectedValueItems, setSelectedValueItems] = useState(null);
    const [selectedValueFactory, setSelectedValueFactory] = useState(null);
    const [selectedValueWarehouse, setSelectedValueWarehouse] = useState(null);

    const initialValues = {
        ID: 0,
        OID: "",
        Note: "",
        ItemID: 0,
        ItemName: "",
        FactoryID: 0,
        WarehouseID: 0,
        Quantity: 0
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

    const handleAddNewProduct = () => {
        const product = {
            ID: 0,
            OID: parentID || "",
            Note: values?.Note,
            ItemID: selectedValueItems?.ID || 0,
            ItemName: selectedValueItems?.Name || "",
            FactoryID: selectedValueFactory?.ID || 0,
            FactoryName: selectedValueFactory?.Name || "",
            WarehouseID: selectedValueWarehouse?.ID || 0,
            WarehouseName: selectedValueWarehouse?.Name || "",
            Quantity: values?.Quantity
        }
        setListGoods(prevProduct => [...prevProduct, product])
        setValueGoods(prevProduct => [...prevProduct, product]);
        setSelectedValueGoodType(null);
        setSelectedValueItems(null);
        setSelectedValueFactory(null);
        setSelectedValueWarehouse(null);
        resetForm();
        closeModalGoods();
    }

    useEffect(() => {
        if (dataEdit && dataEdit.length > 0) {
            const convertedData = dataEdit.map(item => ({
                ID: item?.ID,
                OID: parentID || "",
                ItemID: item.ItemID || 0,
                ItemName: item.ItemName || "",
                FactoryID: item.FactoryID || 0,
                FactoryName: item.FactoryName || "",
                WarehouseID: item.WarehouseID || 0,
                WarehouseName: item.WarehouseName || "",
                Quantity: item.Quantity || "",
                Note: item.Note || "",
            }));
            setListGoods(convertedData);
            setValueGoods(convertedData);
        }
    }, [dataEdit]);

    useEffect(() => {
        const body = { ID: selectedValueGoodType?.ID }
        dispatch(fetchListItems(body))
        dispatch(fetchListWarehouseFactory())
    }, [selectedValueGoodType])

    const _keyExtractor = (item, index) => `${item.ItemID}-${index}`;

    const _renderItem = useCallback(({ item }) => (
        <View style={styles.cardProgram}>
            <Text style={styles.headerProgram}>{item?.ItemName}</Text>

            <View style={styles.containerBodyCard}>
                <View style={styles.bodyCard}>

                    <View style={styles.contentCard}>
                        <Text style={styles.txtHeaderBody}>{languageKey('_quantity')}</Text>
                        <Text style={styles.contentBody}>{item.Quantity}</Text>
                    </View>

                    <View style={styles.contentCard}>
                        <Text style={styles.txtHeaderBody}>{languageKey('_factory')}</Text>
                        <Text style={styles.ellipsisText}>{item.WarehouseName}</Text>
                    </View>

                    <View style={styles.contentCard}>
                        <Text style={styles.txtHeaderBody}>{languageKey('_warehouse_holds_goods')}</Text>
                        <Text style={styles.ellipsisText}>{item.FactoryName}</Text>
                    </View>

                </View>
            </View>
        </View>
    ), [languageKey]);

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
                                <View style={styles.btnClose} >
                                    <SvgXml xml={close_white} />
                                </View>
                                <Text style={styles.titleModal}>{languageKey('_add_new_goods')}</Text>
                                <Button onPress={closeModalGoods} style={styles.btnClose} >
                                    <SvgXml xml={close_red} />
                                </Button>
                            </View>
                            <ScrollView style={styles.modalContainer} showsVerticalScrollIndicator={false}>
                                <View style={styles.input}>
                                    <CardModalSelect
                                        title={languageKey('_product_industry')}
                                        data={listGoodsTypes}
                                        setValue={setSelectedValueGoodType}
                                        value={selectedValueGoodType?.Name}
                                        bgColor={'#F9FAFB'}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <CardModalSelect
                                        title={languageKey('_product')}
                                        data={listItem}
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
                                        {selectedValueItems ? selectedValueItems?.ID : 0}
                                    </Text>
                                </View>

                                <View style={styles.inputAuto}>
                                    <InputDefault
                                        name="Quantity"
                                        returnKeyType="next"
                                        style={styles.widthInput}
                                        value={values?.Quantity}
                                        label={languageKey('_quantity')}
                                        isEdit={true}
                                        placeholderInput={true}
                                        labelHolder={'0'}
                                        keyboardType={'numeric'}
                                        bgColor={'#F9FAFB'}
                                        {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                                    />
                                    <View style={styles.inputRead}>
                                        <Text style={styles.txtHeaderInputView}>{languageKey('_unit_price')}</Text>
                                        <Text
                                            style={styles.inputView}
                                            numberOfLines={2}
                                            ellipsizeMode="tail"
                                        >
                                            {selectedValueItems ? selectedValueItems?.UnitSaleName : 0}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.input}>
                                    <CardModalSelect
                                        title={languageKey('_factory')}
                                        data={listFactory}
                                        setValue={setSelectedValueFactory}
                                        value={selectedValueFactory?.Name}
                                        bgColor={'#F9FAFB'}
                                    />
                                </View>
                                <View style={styles.input}>
                                    <CardModalSelect
                                        title={languageKey('_warehouse_holds_goods')}
                                        data={listWarehouse}
                                        setValue={setSelectedValueWarehouse}
                                        value={selectedValueWarehouse?.Name}
                                        bgColor={'#F9FAFB'}
                                    />
                                </View>
                                <InputDefault
                                    name="Note"
                                    returnKeyType="next"
                                    style={styles.input}
                                    value={values?.Note}
                                    label={languageKey('_note')}
                                    isEdit={true}
                                    placeholderInput={true}
                                    labelHolder={languageKey('_enter_notes')}
                                    bgColor={'#F9FAFB'}
                                    {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                                />
                            </ScrollView>
                            <View style={styles.footer}>
                                <Button style={styles.btnFooterCancel} onPress={closeModalGoods}>
                                    <Text style={styles.txtBtnFooterCancel}>{languageKey('_cancel')}</Text>
                                </Button>
                                <Button style={styles.btnFooterApproval} onPress={handleAddNewProduct}>
                                    <Text style={styles.txtBtnFooterApproval}>{languageKey('_add')}</Text>
                                </Button>
                            </View>
                        </View>
                    </Modal>
                </View>
            )}
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
    widthInput: {
        flex: 1,
        marginHorizontal: scale(12),
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
        color: colors.black,
        height: hScale(42)
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
    }
})

export default ModalGoodInventory;