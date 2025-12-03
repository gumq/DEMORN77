import React, { useEffect, useState } from "react";
import moment from "moment";
import Modal from 'react-native-modal';
import { SvgXml } from "react-native-svg";
import { View, Text, TextInput, FlatList, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { trash } from "@svgImg";
import { stylesDetail } from "../styles";
import { ApiVisitForUsers_AddInventory } from "@api";
import { translateLang } from "@store/accLanguages/slide";
import { Button, CardModalSelect, NotifierAlert } from "@components";
import { fetchDetailVisitCustomer, fetchListProducts, fetchListUnitProducts } from "@store/accVisit_Customer/thunk";
import { colors } from "@themes";

const TabInventory = ({ item }) => {
    const languageKey = useSelector(translateLang);
    const dispatch = useDispatch();
    const { detailVisitCustomer, listProducts, listUnitProducts } = useSelector(state => state.VisitCustomer);
    const [isSubmit, setIsSubmit] = useState(true);
    const [quantity, onChangeQuantity] = useState('');
    const [valueProduct, setValueProduct] = useState(null);
    const [valueUnit, setValueUnit] = useState(null);
    const [addedProducts, setAddedProducts] = useState([]);
    const [isOpenModalAddInventory, setIsOpenModalAddInventory] = useState(false);

    const openModalAddInventory = () => {
        setIsOpenModalAddInventory(!isOpenModalAddInventory);
    }

    const closeModalAddInventory = () => {
        setIsOpenModalAddInventory(!isOpenModalAddInventory);
    }

    useEffect(() => {
        dispatch(fetchListProducts());
        dispatch(fetchListUnitProducts());
    }, [])

    useEffect(() => {
        if (detailVisitCustomer?.inventory) {
            const convertedProducts = detailVisitCustomer.inventory.map(inv => {
                const unit = listUnitProducts.find(unit => unit.ID === inv.UnitID);
                const product = listProducts.find(prod => prod.ID === inv.ProductID);

                return {
                    id: Date.now() + Math.random(),
                    name: product?.Name || 'Unknown Product',
                    quantity: inv.Quantity.toString(),
                    unit: unit?.Name || 'Unknown Unit',
                    idProduct: inv.ProductID,
                    idUnit: inv.UnitID,
                    PlanScheduleDetailID: inv.PlanScheduleDetailID,
                    ID: inv.ID,
                };
            });
            setAddedProducts(convertedProducts);
        }
    }, [detailVisitCustomer?.inventory, listProducts, listUnitProducts]);

    const handleAddProduct = () => {
        if (!valueProduct || !quantity || !valueUnit) {
            Alert.alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        const newProduct = {
            id: Date.now(),
            name: valueProduct.Name,
            quantity,
            unit: valueUnit.Name,
            idProduct: valueProduct.ID,
            idUnit: valueUnit.ID,
            PlanScheduleDetailID: detailVisitCustomer?.ID || item?.ID,
            ID: 0,
        };

        setAddedProducts((prev) => [...prev, newProduct]);
        setValueProduct(null);
        onChangeQuantity('');
        setValueUnit(null);
        closeModalAddInventory();
    };

    const handleDeleteProduct = (id) => {
        setAddedProducts((prev) => prev.filter((item) => item.id !== id));
    };

    const inventoryAddEvent = async () => {

        const inventoryList = addedProducts.map(product => ({
            PlanScheduleDetailID: product?.PlanScheduleDetailID,
            ProductID: product.idProduct,
            Quantity: parseInt(product.quantity, 10),
            UnitID: product.idUnit,
            ID: product.ID,
        }));

        const body = { inventoryList };
        try {
            const response = await ApiVisitForUsers_AddInventory(body);
            const result = response.data;

            if (result?.StatusCode === 200 && result?.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${result?.Message}`,
                    'success',
                );
                setIsSubmit(false)
                const bodyDetail = {
                    ID: item?.ID
                };
                dispatch(fetchDetailVisitCustomer(bodyDetail));
            } else {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${result?.Message}`,
                    'error',
                );
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    const shouldShowCheckInButton =
        item?.PlanDate &&
        moment(item.PlanDate).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY');

    const btnDisable =
        item?.PlanDate &&
        detailVisitCustomer?.CheckOutTime &&
        moment(item.PlanDate).format('DD/MM/YYYY') === moment(detailVisitCustomer.CheckOutTime).format('DD/MM/YYYY');

    return (
        <>
            <View style={stylesDetail.cardProgram}>
                <View style={stylesDetail.containerHeaderInventory}>
                    <Text style={stylesDetail.headerProgram}>{languageKey('inventory')}</Text>
                    {isSubmit && !btnDisable ? (
                        <Button style={stylesDetail.btnAddInventory} onPress={openModalAddInventory}>
                            <Text style={stylesDetail.txtBtnAddInventory}>{languageKey('_add')}</Text>
                        </Button>) : null
                    }
                </View>
                <FlatList
                    data={addedProducts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={stylesDetail.containerProduct}>
                            <View style={stylesDetail.productCard}>
                                <View style={stylesDetail.productItem}>
                                    <Text style={stylesDetail.productTitle}>{languageKey('_product')}</Text>
                                    <Text
                                        style={stylesDetail.productName}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {item.name}
                                    </Text>
                                </View>
                                {isSubmit && !btnDisable ? (
                                    <Button
                                        style={stylesDetail.deleteButton}
                                        onPress={() => handleDeleteProduct(item.id)}>
                                        <SvgXml xml={trash} />
                                    </Button>
                                ) : null}
                            </View>
                            <View style={stylesDetail.productItem}>
                                <Text style={stylesDetail.productTitle}>{languageKey('_quantity')}</Text>
                                <Text style={stylesDetail.productName}>{item.quantity} {item.unit}</Text>
                            </View>
                        </View>
                    )}
                />
                {isSubmit && !btnDisable ? (
                    <View style={stylesDetail.footer}>
                        <Button
                            style={[stylesDetail.btnConfirmCheck, { borderColor: colors.borderColor }]}
                            onPress={inventoryAddEvent}
                            disabled={!shouldShowCheckInButton}
                        >
                            <Text style={[stylesDetail.txtBtnConfirm, { color: colors.black }]}>{languageKey('_skip')}</Text>
                        </Button>


                        <Button
                            style={stylesDetail.btnConfirmCheck}
                            onPress={inventoryAddEvent}
                            disabled={!shouldShowCheckInButton}
                        >
                            <Text style={stylesDetail.txtBtnConfirm}>{languageKey('_confirm')}</Text>
                        </Button>
                    </View>
                ) : null}
            </View>
            <Modal
                useNativeDriver
                backdropOpacity={0.5}
                isVisible={isOpenModalAddInventory}
                style={stylesDetail.optionsModal}
                onBackButtonPress={closeModalAddInventory}
                onBackdropPress={closeModalAddInventory}
                hideModalContentWhileAnimating>
                <View style={stylesDetail.optionsModalContainer}>
                    <View style={stylesDetail.headerContent_gray}>
                        <Text style={stylesDetail.titleModal}>{languageKey('_add_inventory_products')}</Text>
                    </View>
                    <View style={stylesDetail.contentContainer}>
                        <View style={stylesDetail.input}>
                            <CardModalSelect
                                title={languageKey('_product')}
                                data={listProducts}
                                setValue={setValueProduct}
                                value={valueProduct?.Name}
                            />
                        </View>
                        <View style={stylesDetail.input}>
                            <Text style={stylesDetail.headerInput}>{languageKey('_quantity')}</Text>
                            <TextInput
                                style={stylesDetail.inputContent}
                                onChangeText={onChangeQuantity}
                                value={quantity}
                                multiline={true}
                                placeholder={languageKey('_enter_content')}
                            />
                        </View>
                        <View style={stylesDetail.input}>
                            <CardModalSelect
                                title={languageKey('_unit')}
                                data={listUnitProducts}
                                setValue={setValueUnit}
                                value={valueUnit?.Name}
                            />
                        </View>
                        <View style={stylesDetail.footerModal}>
                            <Button style={stylesDetail.btnAddProduct} onPress={handleAddProduct}>
                                <Text style={stylesDetail.txtAddProduct}>{languageKey('_add_products')}</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </>

    )
}

export default TabInventory;