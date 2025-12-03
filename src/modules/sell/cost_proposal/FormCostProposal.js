import React, { useEffect, useState } from "react";
import moment from "moment";
import _ from 'lodash';
import { useFormik } from "formik";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, StatusBar, FlatList } from "react-native";

import routes from "@routes";
import { fetchListOrders } from "@store/accOrders/thunk";
import { translateLang } from "@store/accLanguages/slide";
import { stylesFormCostProposal } from "./styles";
import { arrow_down_big, close_blue, } from "@svgImg";
import { ApiBrandPromotionBudgets_Add, ApiBrandPromotionBudgets_Edit, ApiBrandPromotionBudgets_Submit } from "@api";
import { Button, CardModalSelect, HeaderBack, InputDefault, ModalNotify, NotifierAlert, ModalCostProposal, ModalSelectDate, AttachManyFile } from "@components";

const FormCostProposal = ({ route }) => {
    const item = route?.params?.item;
    const editCost = route?.params?.editCost;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang);
    const { userInfo } = useSelector(state => state.Login);
    const { listOrders } = useSelector(state => state.Orders);
    const { listCostProposalType, detailCostProposal, listExpenseType } = useSelector(state => state.CostProposal);
    const [isShowOptionsModalCancel, setShowOptionsModalCancel] = useState(false);
    const [valuesCostProposalType, setValueCostProposalType] = useState(editCost ? listCostProposalType?.find(costType => costType.ID === detailCostProposal?.ProposalTypeID) : null);
    const [valueSalesOrder, setValueSalesOrder] = useState(editCost ? listOrders?.find(item => item.OID === detailCostProposal?.ReferenceID) : null);
    const [isShowInforGeneral, setIsShowInforGeneral] = useState(true);
    const [isShowModalCostProposal, setIsShowModalCostProposal] = useState(false);
    const [selectListCostProposal, setSelectListCostProposal] = useState([]);
    const [dateStates, setDateStates] = useState({
        planDate: {
            selected: null,
            submit: null,
            visible: false,
        },
    });

    const [editItem, setEditItem] = useState(null)
    const [linkImage, setLinkImage] = useState(
        editCost && detailCostProposal?.Link?.trim() !== ''
            ? detailCostProposal.Link
            : ''
    );
    const linkImgArray = linkImage ? linkImage.split(';').filter(Boolean) : [];
    const [images, setDataImages] = useState(linkImgArray);

    const openModalOptionsCancel = (item) => {
        setShowOptionsModalCancel(true);
    };

    const handleCloseOptionsMoalCancel = () => {
        setShowOptionsModalCancel(false);
    };

    const handleShowInforGeneral = () => {
        setIsShowInforGeneral(!isShowInforGeneral);
    }

    const showModalCostProposal = () => {
        setIsShowModalCostProposal(true);
    };

    const closeModalCostProposal = () => {
        setIsShowModalCostProposal(false);
    };

    const updateDateState = (key, newValues) => {
        setDateStates(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                ...newValues,
            },
        }));
    };

    useEffect(() => {
        if (item) {
            updateDateState('planDate', {
                selected: item.ODate,
                submit: item.ODate,
            });
        } else {
            const now = new Date();

            updateDateState('planDate', { selected: now });
        }
    }, [item]);

    const initialValues = {
        OID: "",
        Note: editCost ? detailCostProposal?.Note : '',
        Link: '',
        ProposalTypeID: editCost ? valuesCostProposalType : null,
        UserID: 0,
        ReferenceID: editCost ? valueSalesOrder : null,
        ReferenceType: "",
        ReasonID: 0,
        Reason: editCost ? detailCostProposal?.Reason : '',
        Content: "",
        Details: []
    };

    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
    } = useFormik({
        initialValues,
    });

    const totalAmountProposal = selectListCostProposal?.reduce((sum, prop) => sum + prop.Amount, 0)

    const handleSave = _.debounce(async () => {
        const linkArray = typeof linkImage === 'string' ? linkImage.split(';') : Array.isArray(linkImage) ? linkImage : [];
        const linkString = linkArray.join(';');
        const body = {
            OID: editCost ? detailCostProposal.OID : "",
            Note: values?.Note || '',
            Link: linkString,
            FactorID: "FeeAllowances",
            EntryID: "BudgetProposals",
            "CmpnID": userInfo?.CmpnID || 0,
            ODate: dateStates?.planDate?.submit,
            "SAPID": "",
            "LemonID": "",
            ProposalTypeID: valuesCostProposalType?.ID || 0,
            UserID: userInfo?.UserID || 0,
            Reason: values?.Reason || '',
            "CurrencyTypeID": 0,
            "TotalAmount": 0,
            "NameExtention1": "",
            "NameExtention2": "",
            "NameExtention3": "",
            "NameExtention4": "",
            "NameExtention5": "",
            "NameExtention6": "",
            "NameExtention7": "",
            "NameExtention8": "",
            "NameExtention9": "",
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
            "Extention11": "",
            "Extention12": "",
            "Extention13": "",
            "Extention14": "",
            "Extention15": "",
            "Extention16": "",
            "Extention17": "",
            "Extention18": "",
            "Extention19": "",
            "Extention20": "",
            BudgetProposalJson: selectListCostProposal
        }
        try {
            const result = editCost ? await ApiBrandPromotionBudgets_Edit(body) : await ApiBrandPromotionBudgets_Add(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                navigation.navigate(routes.CostProposalScreen)
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
    }, 2000, { leading: true, trailing: false });

    const handleConfirm = _.debounce(async () => {
        const body = {
            OID: detailCostProposal?.OID,
            IsLock: detailCostProposal?.IsLock === 0 ? 1 : 0,
        }
        try {
            const result = await ApiBrandPromotionBudgets_Submit(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                navigation.navigate(routes.CostProposalScreen)
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
        dispatch(fetchListOrders())
    }, []);

    const handleEditItem = (item) => {
        setEditItem(item)
        setIsShowModalCostProposal(true)
    };

    const _keyExtractor = (item, index) => `${item.ExpenseTypeName}-${index}`;
    const _renderItem = ({ item }) => {
        const enxpenseType = listExpenseType.find(expense => expense?.ID === item.CostTypeID)
        return (
            <Button onPress={() => handleEditItem(item)} style={styles.cardProgram}>
                <Text style={styles.txtTitleItem}>{enxpenseType?.Name}</Text>
                <View style={styles.bodyCard}>
                    <View style={styles.containerContentCard}>
                        <Text style={styles.txtDescription}>{languageKey('_amount')}</Text>
                        <Text style={styles.txtItem}>{item?.Amount}</Text>
                    </View>
                    <View style={styles.containerContentCard}>
                        <Text style={styles.txtDescription}>{languageKey('_explain')}</Text>
                        <Text style={styles.txtItem}>{item?.Note}</Text>
                    </View>
                </View>
            </Button>
        );
    };

    return (
        <LinearGradient style={stylesFormCostProposal.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView style={stylesFormCostProposal.container}>
                <HeaderBack
                    title={editCost ? languageKey('_edit_cost_proposal') : languageKey('_new_cost_proposal')}
                    onPress={() => navigation.goBack()}
                    btn={true}
                    iconBtn={close_blue}
                    onPressBtn={openModalOptionsCancel}
                />
                <ScrollView style={stylesFormCostProposal.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={stylesFormCostProposal.containerHeader}>
                        <Text style={stylesFormCostProposal.header}>{languageKey('_information_general')}</Text>
                        <Button style={stylesFormCostProposal.btnShowInfor} onPress={handleShowInforGeneral}>
                            <SvgXml xml={arrow_down_big} />
                        </Button>
                    </View>
                    {isShowInforGeneral && (
                        <View style={stylesFormCostProposal.card}>
                            <View style={stylesFormCostProposal.inputAuto}>
                                <View style={stylesFormCostProposal.inputRead}>
                                    <Text style={stylesFormCostProposal.txtHeaderInputView}>{languageKey('_ct_code')}</Text>
                                    <Text
                                        style={stylesFormCostProposal.inputView}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {editCost ? item?.OID : "Auto"}
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <ModalSelectDate
                                        title={languageKey('_ct_day')}
                                        showDatePicker={() => updateDateState('planDate', { visible: true })}
                                        hideDatePicker={() => updateDateState('planDate', { visible: false })}
                                        initialValue={dateStates.planDate.selected}
                                        selectedValueSelected={(val) => updateDateState('planDate', { selected: val })}
                                        isDatePickerVisible={dateStates.planDate.visible}
                                        selectSubmitForm={(val) => updateDateState('planDate', { submit: val })}
                                        bgColor="#FAFAFA"
                                        minimumDate={new Date()}
                                        require={true}
                                    />
                                </View>
                            </View>
                            <View style={stylesFormCostProposal.input}>
                                <CardModalSelect
                                    title={languageKey('_recommended_type')}
                                    data={listCostProposalType}
                                    setValue={setValueCostProposalType}
                                    value={valuesCostProposalType?.Name}
                                    bgColor={'#FAFAFA'}
                                />
                            </View>
                            <View style={stylesFormCostProposal.input}>
                                <CardModalSelect
                                    title={languageKey('_order')}
                                    data={listOrders}
                                    setValue={setValueSalesOrder}
                                    value={valueSalesOrder ? `${valueSalesOrder?.OID} -  ${valueSalesOrder?.CustomerName}` : valueSalesOrder?.OID}
                                    bgColor={'#FAFAFA'}
                                />
                            </View>
                            <View style={stylesFormCostProposal.inputAuto}>
                                <View style={stylesFormCostProposal.inputRead}>
                                    <Text style={stylesFormCostProposal.txtHeaderInputView}>{languageKey('_quote_contract_date')}</Text>
                                    <Text
                                        style={stylesFormCostProposal.inputView}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {moment(valueSalesOrder?.ODate).format('DD/MM/YYYY')}
                                    </Text>
                                </View>
                                <View style={stylesFormCostProposal.inputRead}>
                                    <Text style={stylesFormCostProposal.txtHeaderInputView}>{languageKey('_effective_date')}</Text>
                                    <Text
                                        style={stylesFormCostProposal.inputView}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {moment(valueSalesOrder?.DeliveryDueDate).format('DD/MM/YYYY')}
                                    </Text>
                                </View>
                            </View>
                            <InputDefault
                                name="Reason"
                                returnKeyType="next"
                                style={stylesFormCostProposal.input}
                                value={values?.Reason}
                                label={languageKey('_suggested_reason')}
                                isEdit={true}
                                bgColor={'#FAFAFA'}
                                labelHolder={languageKey('_enter_the_product_name')}
                                placeholderInput={true}
                                {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                            />
                            <InputDefault
                                name="Note"
                                returnKeyType="next"
                                style={stylesFormCostProposal.input}
                                value={values?.Note}
                                label={languageKey('_note')}
                                placeholderInput={true}
                                isEdit={true}
                                bgColor={'#FAFAFA'}
                                labelHolder={languageKey('_enter_notes')}
                                {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                            />
                            <View style={stylesFormCostProposal.imgBox}>
                                <Text style={stylesFormCostProposal.headerBoxImage}>{languageKey('_image')}</Text>
                                <AttachManyFile
                                    OID={detailCostProposal?.OID}
                                    images={images}
                                    setDataImages={setDataImages}
                                    setLinkImage={setLinkImage}
                                    dataLink={linkImage}
                                />
                            </View>
                        </View>
                    )}
                    <View style={stylesFormCostProposal.containerAdd}>
                        <Text style={stylesFormCostProposal.header}>{languageKey('_proposed_cost')}</Text>
                        <Button style={stylesFormCostProposal.btnUploadFile} onPress={showModalCostProposal}>
                            <Text style={stylesFormCostProposal.txtBtnUploadFile}>{languageKey('_add')}</Text>
                        </Button>
                    </View>
                    <ModalCostProposal
                        setValueCostProposal={setSelectListCostProposal}
                        openModal={isShowModalCostProposal}
                        closeModal={closeModalCostProposal}
                        dataEdit={item?.Details}
                        editCost={editItem}
                        parentID={editCost ? detailCostProposal?.OID : ""}
                    />
                    <FlatList
                        data={selectListCostProposal}
                        renderItem={_renderItem}
                        keyExtractor={_keyExtractor}
                        showsVerticalScrollIndicator={false}
                    />
                </ScrollView>
                <View style={stylesFormCostProposal.containerFooter}>
                    <Button
                        style={stylesFormCostProposal.btnSave}
                        onPress={handleSave}
                    >
                        <Text style={stylesFormCostProposal.txtBtnSave}>{languageKey('_save')}</Text>
                    </Button>
                    <Button
                        style={stylesFormCostProposal.btnConfirm}
                        disabled={detailCostProposal ? false : true}
                        onPress={handleConfirm}
                    >
                        <Text style={stylesFormCostProposal.txtBtnConfirm}>{languageKey('_confirm')}</Text>
                    </Button>
                </View>
                <ModalNotify
                    isShowOptions={isShowOptionsModalCancel}
                    handleClose={handleCloseOptionsMoalCancel}
                    handleAccept={() => navigation.goBack()}
                    handleCancel={handleCloseOptionsMoalCancel}
                    btnNameAccept={languageKey('_argee')}
                    btnCancel={languageKey('_cancel')}
                    content={languageKey('_cancel_creating_proposal')}
                />
            </SafeAreaView>
        </LinearGradient>
    )
}

export default FormCostProposal;