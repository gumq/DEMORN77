import React, { useEffect, useState } from "react";
import _ from 'lodash';
import moment from "moment";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, StatusBar, Alert } from "react-native";

import routes from "@routes";
import { close_blue, } from "@svgImg";
import { stylesFormCredit } from "./styles";
import { translateLang } from "@store/accLanguages/slide";
import { fetchListEntryPayment, fetchListOrder } from "@store/accDeposit_Payment/thunk";
import { ApiPaymentRequests_Add, ApiPaymentRequests_Edit, ApiPaymentRequests_Submit } from "@api";
import { Button, CardModalSelect, HeaderBack, InputDefault, ModalSelectDate, NotifierAlert, AttachManyFile } from "@components";

const FormPaymentRequestScreen = ({ route }) => {
    const item = route?.params?.item;
    const editPayment = route?.params?.editPayment
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const languageKey = useSelector(translateLang);
    const { detailMenu } = useSelector(state => state.Home);
    const { userInfo, listCustomerByUserID } = useSelector(state => state.Login);
    const dataClassify = [
        { ID: 1, Name: languageKey('_according_percent'), Key: 1 },
        { ID: 2, Name: languageKey('_by_value'), Key: 0 }
    ]

    const { listOrder, listAccountReceiver, listEntryPayment, detailPaymentRequest } = useSelector(state => state.Payments);
    const listCustomerApproval = listCustomerByUserID?.filter(item => item.IsClosed === 0);
    const [valueEntry, setValueEntry] = useState(editPayment ? listEntryPayment?.find(item => item?.EntryID === detailPaymentRequest?.EntryID) : null);
    const [valueCustomer, setValueCustomer] = useState(editPayment ? listCustomerApproval?.find(cus => cus?.ID === detailPaymentRequest?.CustomerID) : null);
    const [valueOrder, setValueOrder] = useState(editPayment ? listOrder?.find(order => order?.OID === detailPaymentRequest?.OrderID) : null);
    const [valueAccountBank, setValueAccountBank] = useState(editPayment ? listAccountReceiver?.find(bank => bank?.ID === detailPaymentRequest?.BankAccountID) : null);
    const [valueClassify, setValueClassify] = useState(editPayment ? dataClassify?.find(item => item?.ID === detailPaymentRequest?.IsPercent) : null);
    const [dateStates, setDateStates] = useState({
        planDate: {
            selected: null,
            submit: null,
            visible: false,
        },
    });
    const [valueRequestConvert, setRequestConvert] = useState(0);
    const [linkImage, setLinkImage] = useState(
        editPayment && detailPaymentRequest?.Link?.trim() !== ''
            ? detailPaymentRequest.Link
            : ''
    );
    const linkImgArray = linkImage ? linkImage.split(';').filter(Boolean) : [];
    const [images, setDataImages] = useState(linkImgArray);

    const updateDateState = (key, newValues) => {
        setDateStates(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                ...newValues,
            },
        }));
    };

    const openModalOptionsCancel = () => {
        setShowOptionsModalCancel(true);
    };

    const initialValues = {
        CustomerID: editPayment ? valueCustomer : null,
        OrderID: editPayment ? valueOrder : null,
        IsPercent: editPayment ? valueClassify : null,
        RequestValue: editPayment ? detailPaymentRequest?.RequestValue : 0,
        RequestAmount: editPayment ? detailPaymentRequest?.RequestAmount : 0,
        CurrencyID: editPayment ? detailPaymentRequest?.CurrencyID : 0,
        CurrencyRate: editPayment ? detailPaymentRequest?.CurrencyRate : 0,
        CurrencyDate: editPayment ? detailPaymentRequest?.CurrencyDate : "",
        BankAccountID: editPayment ? valueAccountBank : null,
        Content: editPayment ? detailPaymentRequest?.Content : "",
        Note: editPayment ? item?.Note : "",
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

    const handlePaymentRequest = _.debounce(async () => {
        const errors = [];
        if (!valueEntry?.EntryID) {
            errors.push(languageKey('_please_select_function'));
        }

        if (errors.length > 0) {
            Alert.alert(errors[0]);
            return;
        }

        const linkArray = typeof linkImage === 'string' ? linkImage.split(';') : Array.isArray(linkImage) ? linkImage : [];
        const linkString = linkArray.join(';');
        const body = {
            FactorID: "Payments",
            EntryID: valueEntry?.EntryID,
            ODate: dateStates?.planDate.submit,
            OID: editPayment ? detailPaymentRequest?.OID : '',
            "SAPID": "",
            "LemonID": "",
            CustomerID: valueCustomer?.ID || 0,
            OrderID: valueOrder?.OID || "",
            IsPercent: valueClassify?.Key,
            RequestValue: Number(values?.RequestValue) || 0,
            RequestAmount: valueRequestConvert,
            CurrencyID: valueOrder?.CurrencyID || 0,
            CurrencyRate: valueOrder?.CurrencyRate || 0,
            CurrencyDate: valueOrder?.CurrencyDate,
            BankAccountID: valueAccountBank?.ID || 0,
            Content: values?.Content || "",
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
            Note: values?.Note || "",
            Link: linkString || "",
        }
        try {
            const result = editPayment ? await ApiPaymentRequests_Edit(body) : await ApiPaymentRequests_Add(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                navigation.navigate(routes.DepositPaymentScreen)
            } else {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'error',
                );
            }
        } catch (error) {
            console.log('handlePaymentRequest', error);
        }
    }, 2000, { leading: true, trailing: false });

    const handleConfirm = _.debounce(async () => {
        const body = {
            OID: detailPaymentRequest?.OID,
            IsLock: detailPaymentRequest?.IsLock === 0 ? 1 : 0,
        }
        try {
            const result = await ApiPaymentRequests_Submit(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                navigation.navigate(routes.DepositPaymentScreen)
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
        const body = {
            FactorID: detailMenu?.factorId,
            EntryID: detailMenu?.entryId
        }
        dispatch(fetchListEntryPayment(body))
    }, [])

    useEffect(() => {
        if (valueCustomer) {
            const body = {
                CustomerID: valueCustomer?.ID,
            }
            dispatch(fetchListOrder(body))
        }
    }, [valueCustomer])

    const isValidDecimal30_6 = (value) => {
        const stringValue = String(value).replace(/,/g, '').trim();
        if (!stringValue) return true;

        const [integerPart, decimalPart] = stringValue.split('.');

        const integerLen = integerPart?.length || 0;
        const decimalLen = decimalPart?.length || 0;
        const totalLen = integerLen + decimalLen;

        return integerLen <= 24 && decimalLen <= 6 && totalLen <= 30;
    };

    useEffect(() => {
        const requestValue = values?.RequestValue;
        const paidAmount = valueOrder ? valueOrder?.PaidAmount : 0;

        if (!isValidDecimal30_6(requestValue)) {
            Alert.alert(languageKey('_notification'), languageKey('_noti_money'));
            return;
        }

        let convertRequest = 0;
        if (valueClassify?.Key === 1) {
            convertRequest = paidAmount * (requestValue / 100);
        } else {
            convertRequest = requestValue;
        }

        setRequestConvert(convertRequest);
    }, [values.RequestValue, valueClassify]);

    return (
        <LinearGradient style={stylesFormCredit.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView style={stylesFormCredit.container}>
                <HeaderBack
                    title={languageKey('_deposit_payment_requried')}
                    onPress={() => navigation.goBack()}
                    btn={true}
                    iconBtn={close_blue}
                    onPressBtn={openModalOptionsCancel}
                />
                <ScrollView
                    style={stylesFormCredit.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={stylesFormCredit.footerScroll}
                >
                    <View style={stylesFormCredit.card}>
                        <View style={stylesFormCredit.input}>
                            <CardModalSelect
                                title={languageKey('_function')}
                                data={listEntryPayment}
                                setValue={setValueEntry}
                                value={valueEntry?.EntryName}
                                bgColor={editPayment ? '#E5E7EB' : '#FAFAFA'}
                                require={true}
                                disabled={editPayment}
                            />
                        </View>
                        <View style={stylesFormCredit.inputAuto}>
                            <InputDefault
                                name="OID"
                                returnKeyType="next"
                                style={stylesFormCredit.widthInput}
                                value={editPayment ? detailPaymentRequest?.OID : "Auto"}
                                label={languageKey('_ct_code')}
                                isEdit={false}
                                placeholderInput={true}
                                bgColor={'#E5E5E5'}
                                labelHolder={'Auto'}
                                {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                            />
                            <View style={{ flex: 1 }}>
                                <ModalSelectDate
                                    title={languageKey('_ct_day')}
                                    showDatePicker={() => updateDateState('planDate', { visible: true })}
                                    hideDatePicker={() => updateDateState('planDate', { visible: false })}
                                    initialValue={dateStates.planDate.selected}
                                    selectedValueSelected={(val) => updateDateState('planDate', { selected: val })}
                                    isDatePickerVisible={dateStates.planDate.visible}
                                    selectSubmitForm={(val) => updateDateState('planDate', { submit: val })}
                                    bgColor={'#FAFAFA'}
                                    minimumDate={new Date()}
                                />
                            </View>
                        </View>
                        <View style={stylesFormCredit.input}>
                            <CardModalSelect
                                title={languageKey('_customer')}
                                data={listCustomerApproval}
                                setValue={setValueCustomer}
                                value={valueCustomer?.Name}
                                bgColor={'#FAFAFA'}
                            />
                        </View>
                        <View style={stylesFormCredit.input}>
                            <CardModalSelect
                                title={languageKey('_order')}
                                data={listOrder}
                                setValue={setValueOrder}
                                value={
                                    valueOrder
                                        ? `${valueOrder.OID ?? ''} - ${moment(valueOrder.ODate).format('DD/MM/YYYY')} - TC: ${valueOrder.PaidAmount ?? ''} - CL: ${valueOrder.RemainAmount ?? ''}`
                                        : ''
                                }
                                bgColor={'#FAFAFA'}
                            />
                        </View>
                        <View style={stylesFormCredit.inputAuto}>
                            <View style={stylesFormCredit.widthInput}>
                                <CardModalSelect
                                    title={languageKey('_classify')}
                                    data={dataClassify}
                                    setValue={setValueClassify}
                                    value={valueClassify?.Name}
                                    bgColor={'#FAFAFA'}
                                />
                            </View>
                            <InputDefault
                                name="RequestValue"
                                returnKeyType="next"
                                style={stylesFormCredit.widthInput}
                                value={Number(values.RequestValue).toLocaleString('en-US')}
                                label={languageKey('_value')}
                                isEdit={true}
                                placeholderInput={true}
                                labelHolder={'0'}
                                bgColor={'#FAFAFA'}
                                {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                            />
                        </View>

                        <View style={stylesFormCredit.input}>
                            <Text style={stylesFormCredit.txtHeaderInputView}>{languageKey('_convert_the_request_amount')}</Text>
                            <Text
                                style={stylesFormCredit.inputView}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >
                                {Number(valueRequestConvert || 0).toLocaleString('en-US')}
                            </Text>
                        </View>
                        <View style={stylesFormCredit.inputAuto}>
                            <View style={stylesFormCredit.widthInput}>
                                <Text style={stylesFormCredit.txtHeaderInputView}>{languageKey('_currency_unit')}</Text>
                                <Text
                                    style={stylesFormCredit.inputView}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {valueOrder?.Currency}
                                </Text>
                            </View>
                            <View style={stylesFormCredit.widthInput}>
                                <Text style={stylesFormCredit.txtHeaderInputView}>{languageKey('_exchange_rate_by_day_two')}</Text>
                                <Text
                                    style={stylesFormCredit.inputView}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {valueOrder?.CurrencyRate}
                                </Text>
                            </View>
                        </View>
                        <View style={stylesFormCredit.input}>
                            <Text style={stylesFormCredit.txtHeaderInputView}>{languageKey('_exchange_rate_date')}</Text>
                            <Text
                                style={stylesFormCredit.inputView}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >
                                {moment(valueOrder?.CurrencyDate).format('DD/MM/YYYY')}
                            </Text>
                        </View>
                        <View style={stylesFormCredit.input}>
                            <Text style={stylesFormCredit.txtHeaderInputView}>{languageKey('_company_receives')}</Text>
                            <Text
                                style={stylesFormCredit.inputView}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >
                                {userInfo?.CompanyName}
                            </Text>
                        </View>
                        <View style={stylesFormCredit.input}>
                            <CardModalSelect
                                title={languageKey('_receiving_account')}
                                data={listAccountReceiver}
                                setValue={setValueAccountBank}
                                value={
                                    valueAccountBank
                                        ? `${valueAccountBank?.Extention3 ?? ''} - ${valueAccountBank?.Name ?? ""} - ${valueAccountBank.Address ?? ''}`
                                        : ''
                                }
                                bgColor={'#FAFAFA'}
                            />
                        </View>
                        <InputDefault
                            name="Content"
                            returnKeyType="next"
                            style={stylesFormCredit.input}
                            value={values?.Content}
                            label={languageKey('_request_content')}
                            placeholderInput={true}
                            isEdit={true}
                            bgColor={'#FAFAFA'}
                            labelHolder={languageKey('_enter_content')}
                            {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                        />
                        <InputDefault
                            name="Note"
                            returnKeyType="next"
                            style={stylesFormCredit.input}
                            value={values?.Note}
                            label={languageKey('_note')}
                            placeholderInput={true}
                            isEdit={true}
                            bgColor={'#FAFAFA'}
                            labelHolder={languageKey('_enter_notes')}
                            {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                        />
                        <View style={stylesFormCredit.imgBox}>
                            <Text style={stylesFormCredit.headerBoxImage}>{languageKey('_image')}</Text>
                            <AttachManyFile
                                OID={detailPaymentRequest?.OID}
                                images={images}
                                setDataImages={setDataImages}
                                setLinkImage={setLinkImage}
                                dataLink={linkImage}
                            />
                        </View>
                    </View>
                </ScrollView>

                <View style={stylesFormCredit.containerFooter}>
                    <Button
                        style={stylesFormCredit.btnSave}
                        onPress={handlePaymentRequest}
                    >
                        <Text style={stylesFormCredit.txtBtnSave}>{languageKey('_save')}</Text>
                    </Button>
                    <Button
                        style={stylesFormCredit.btnConfirm}
                        disabled={detailPaymentRequest ? false : true}
                        onPress={handleConfirm}
                    >
                        <Text style={stylesFormCredit.txtBtnConfirm}>{languageKey('_confirm')}</Text>
                    </Button>
                </View>
            </SafeAreaView>
        </LinearGradient>
    )
}

export default FormPaymentRequestScreen;