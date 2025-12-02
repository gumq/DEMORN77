import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import _ from 'lodash';
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "react-native-gesture-handler";
import { View, Text } from 'react-native';

import { stylesDetail, stylesFormCredit } from "../styles";
import { translateLang } from "store/accLanguages/slide";
import { fetchDetailConfirmRequest } from "store/accDeposit_Payment/thunk";
import { AttachManyFile, Button, ModalSelectDate, NotifierAlert, RenderImage } from "components";
import { ApiPaymentConfirmations_Add, ApiPaymentConfirmations_Edit, ApiPaymentConfirmations_Submit } from "action/Api"

const DetailTab = ({ detailPaymentRequest, itemData }) => {
    const languageKey = useSelector(translateLang);
    const dispatch = useDispatch();
    const { detailConfirmRequest } = useSelector(state => state.Payments);
    const linkImgArray = useMemo(() => {
        return detailPaymentRequest?.Link
            ? detailPaymentRequest.Link.split(';').filter(Boolean)
            : [];
    }, [detailPaymentRequest?.Link]);
    const [dateStates, setDateStates] = useState({
        planDate: {
            selected: null,
            submit: null,
            visible: false,
        },
    });
    const [contentApproval, onChangeContentApproval] = useState('');
    const [valueRequest, onChangeValue] = useState(0);
    const [linkImage, setLinkImage] = useState(detailConfirmRequest?.Link);
    const linkImgArrayApproval = linkImage ? linkImage.split(';').filter(Boolean) : [];
    const [images, setDataImages] = useState(linkImgArrayApproval);
    const linkImgConfirmRequest = useMemo(() => {
        return detailConfirmRequest?.Link
            ? detailConfirmRequest.Link.split(';').filter(Boolean)
            : [];
    }, [detailConfirmRequest?.Link]);
    const [visibleFormEdit, setVisibleFormEdit] = useState(false);

    const handleShow = () => {
        setVisibleFormEdit(!visibleFormEdit)
    }

    const updateDateState = (key, newValues) => {
        setDateStates(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                ...newValues,
            },
        }));
    };

    const formatNumber = (value) => {
        if (!value) return '';
        return parseFloat(value.replace(/,/g, '')).toLocaleString('en-US');
    };

    const handlePaymentRequest = _.debounce(async () => {
        const linkArray = typeof linkImage === 'string' ? linkImage.split(';') : Array.isArray(filesForm) ? filesForm : [];
        const linkString = linkArray.join(';');
        const body = {
            FactorID: "Payments",
            EntryID: "PaymentConfirmation",
            OID: detailConfirmRequest?.OID || "",
            ODate: dateStates?.planDate.submit,
            SAPID: "",
            LemonID: "",
            PaymentRequestID: detailPaymentRequest?.OID || "",
            PaymentAmount: valueRequest,
            Content: contentApproval,
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
            Note: "",
            Link: linkString || "",
        }
        try {
            const result = detailConfirmRequest ? await ApiPaymentConfirmations_Edit(body) : await ApiPaymentConfirmations_Add(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                const body = { OID: responeData?.Result[0]?.OID }
                dispatch(fetchDetailConfirmRequest(body))
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
            OID: detailConfirmRequest?.OID,
            IsLock: 1,
        }
        try {
            const result = await ApiPaymentConfirmations_Submit(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                const body = { OID: detailConfirmRequest?.OID }
                dispatch(fetchDetailConfirmRequest(body))
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
        onChangeContentApproval(detailConfirmRequest?.Content ?? '')
        onChangeValue(String(detailConfirmRequest?.PaymentAmount ?? ''))
        const linkImgArrayApproval = detailConfirmRequest?.Link ? detailConfirmRequest?.Link.split(';').filter(Boolean) : [];
        setDataImages(linkImgArrayApproval)
        setSelectedValueFromDate(detailConfirmRequest?.ODate ?? '')
        setSelectedValueFromDateSubmitForm(detailConfirmRequest?.ODate ?? '')
    }, [detailConfirmRequest])

    return (
        <View style={stylesDetail.container} >
            <View style={stylesDetail.cardProgram}>
                <View style={stylesDetail.containerHeader}>
                    <Text style={stylesDetail.headerProgram}>{languageKey('_information_general')}</Text>
                    <View style={[stylesDetail.bodyStatus, { backgroundColor: itemData?.ApprovalStatusColor }]}>
                        <Text style={[stylesDetail.txtStatus, { color: itemData?.ApprovalStatusTextColor }]}>
                            {itemData?.ApprovalStatusName}
                        </Text>
                    </View>
                </View>
                <View style={stylesDetail.bodyCard}>
                    {detailPaymentRequest?.EntryName ?
                        <View style={stylesDetail.containerBodyCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_function')}</Text>
                            <Text style={stylesDetail.contentBody}>{detailPaymentRequest?.EntryName}</Text>
                        </View>
                        : null
                    }
                    <View style={stylesDetail.containerContent}>
                        <View style={stylesDetail.containerBodyCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_ct_code')}</Text>
                            <Text style={stylesDetail.contentBody}>{itemData?.OID}</Text>
                        </View>
                        <View style={stylesDetail.containerBodyCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_ct_day')}</Text>
                            <Text style={stylesDetail.contentBody}>{moment(itemData?.ODate).format('DD/MM/YYYY')}</Text>
                        </View>
                    </View>
                    {itemData?.CustomerName ?
                        <View style={stylesDetail.containerBodyCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_customer')}</Text>
                            <Text
                                style={stylesDetail.contentBody}
                                numberOfLines={3}
                                ellipsizeMode="tail"
                            >
                                {itemData?.CustomerName}
                            </Text>
                        </View>
                        : null
                    }
                    {itemData?.SaleOrder ?
                        <View style={stylesDetail.containerBodyCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_order')}</Text>
                            <Text
                                style={stylesDetail.contentBody}
                                numberOfLines={3}
                                ellipsizeMode="tail"
                            >
                                {itemData?.SaleOrder}
                            </Text>
                        </View>
                        : null
                    }
                    <View style={stylesDetail.containerContent}>
                        {detailPaymentRequest?.IsPercent ?
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_classify')}</Text>
                                <Text style={stylesDetail.contentBody}>{detailPaymentRequest?.IsPercent === 1 ? languageKey('_according_percent') : languageKey('_by_value')}</Text>
                            </View>
                            : null
                        }
                        {detailPaymentRequest?.RequestValue ?
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_value')}</Text>
                                <Text style={stylesDetail.contentBody}>{detailPaymentRequest?.RequestValue}</Text>
                            </View>
                            : null
                        }
                    </View>

                    {itemData?.RequestAmount ?
                        <View style={stylesDetail.containerBodyCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_convert_the_request_amount')}</Text>
                            <Text style={stylesDetail.contentBody}>{Number(itemData?.RequestAmount || 0).toLocaleString('en-US')}</Text>
                        </View>
                        : null
                    }
                    <View style={stylesDetail.containerContent}>
                        {detailPaymentRequest?.Currency ?
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_currency_unit')}</Text>
                                <Text style={stylesDetail.contentBody}>{detailPaymentRequest?.Currency} - {detailPaymentRequest?.CurrencyRate}</Text>
                            </View>
                            : null
                        }
                        {detailPaymentRequest?.CurrencyDate ?
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_exchange_rate_date')}</Text>
                                <Text style={stylesDetail.contentBody}>{moment(detailPaymentRequest?.CurrencyDate).format('DD/MM/YYYY')}</Text>
                            </View>
                            : null
                        }
                    </View>
                    {itemData?.CompanyName ?
                        <View style={stylesDetail.containerBodyCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_company_receives')}</Text>
                            <Text
                                style={stylesDetail.contentBody}
                                numberOfLines={3}
                                ellipsizeMode="tail"
                            >
                                {itemData?.CompanyName}
                            </Text>
                        </View>
                        : null
                    }
                    {itemData?.BankAccount ?
                        <View style={stylesDetail.containerBodyCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_receiving_account')}</Text>
                            <Text
                                style={stylesDetail.contentBody}
                                numberOfLines={3}
                                ellipsizeMode="tail"
                            >
                                {itemData?.BankAccount}
                            </Text>
                        </View>
                        : null
                    }
                    {itemData?.Content ?
                        <View style={stylesDetail.containerBodyCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_request_content')}</Text>
                            <Text
                                style={stylesDetail.contentBody}
                                numberOfLines={3}
                                ellipsizeMode="tail"
                            >
                                {itemData?.Content}
                            </Text>
                        </View>
                        : null
                    }
                    {linkImgArray.length > 0 && (
                        <View style={stylesDetail.containerTableFileItem}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_image')}</Text>
                            <RenderImage urls={linkImgArray} />
                        </View>
                    )}
                </View>
            </View>
            {detailConfirmRequest?.IsLock === 1 ? (
                <View style={stylesDetail.cardProgram}>
                    <View style={stylesDetail.containerHeader}>
                        <Text style={stylesDetail.headerProgram}>{languageKey('_deposit_payment_proposal')}</Text>
                        <View style={[stylesDetail.bodyStatus, { backgroundColor: detailConfirmRequest?.ApprovalStatusColor }]}>
                            <Text style={[stylesDetail.txtStatus, { color: detailConfirmRequest?.ApprovalStatusTextColor }]}>
                                {detailConfirmRequest?.ApprovalStatusName}
                            </Text>
                        </View>
                    </View>
                    <View style={stylesDetail.bodyCard}>
                        <View style={stylesDetail.containerContent}>
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_payment_deposit_date')}</Text>
                                <Text style={stylesDetail.contentBody}>{moment(detailConfirmRequest?.ODate).format('DD/MM/YYYY')}</Text>
                            </View>
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_deposit_payment_amount')}</Text>
                                <Text style={stylesDetail.contentBody}>
                                    {Number(detailConfirmRequest?.PaymentAmount || 0).toLocaleString('en-US')}
                                </Text>
                            </View>
                        </View>
                        {detailConfirmRequest?.Content ? (
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_request_content')}</Text>
                                <Text style={stylesDetail.contentBody} numberOfLines={3} ellipsizeMode="tail">
                                    {detailConfirmRequest?.Content}
                                </Text>
                            </View>
                        ) : null}
                        {linkImgConfirmRequest.length > 0 && (
                            <View style={stylesDetail.containerTableFileItem}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_image')}</Text>
                                <RenderImage urls={linkImgConfirmRequest} />
                            </View>
                        )}
                    </View>
                </View>
            ) : detailPaymentRequest?.IsLock === 1 && detailConfirmRequest?.ApprovalStatusCode !== -1 ? (
                <View style={stylesDetail.cardProgram}>
                    <View style={stylesDetail.containerHeader}>
                        <Text style={stylesDetail.headerProgram}>{languageKey('_deposit_payment_proposal')}</Text>
                        <View style={[stylesDetail.bodyStatus, { backgroundColor: detailConfirmRequest?.ApprovalStatusColor }]}>
                            <Text style={[stylesDetail.txtStatus, { color: detailConfirmRequest?.ApprovalStatusTextColor }]}>
                                {detailConfirmRequest?.ApprovalStatusName}
                            </Text>
                        </View>
                    </View>
                    <View style={stylesDetail.bodyCard}>
                        <View style={stylesFormCredit.inputFormDate}>
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
                                    margin={true}
                                />
                            </View>
                            <View style={stylesDetail.input}>
                                <Text style={stylesFormCredit.txtHeaderInputView}>{languageKey('_deposit_payment_amount')}</Text>
                                <TextInput
                                    multiline={true}
                                    style={stylesDetail.inputContent}
                                    onChangeText={(text) => onChangeValue(text.replace(/[^0-9]/g, ''))}
                                    value={formatNumber(valueRequest)}
                                    placeholder={'0'}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                        <Text style={stylesDetail.headerInput}>{languageKey('_content')}</Text>
                        <TextInput
                            multiline={true}
                            style={stylesDetail.inputNote}
                            onChangeText={onChangeContentApproval}
                            value={contentApproval}
                            numberOfLines={4}
                            placeholder={languageKey('_enter_content')}
                        />

                        <Text style={stylesFormCredit.headerBoxImage}>{languageKey('_image')}</Text>
                        <AttachManyFile
                            OID={detailConfirmRequest?.OID}
                            images={images}
                            setDataImages={setDataImages}
                            setLinkImage={setLinkImage}
                            dataLink={linkImage}
                            form={true}
                        />
                    </View>

                    <View style={stylesFormCredit.containerFooterConfirm}>
                        <Button
                            style={stylesFormCredit.btnSave}
                            onPress={handlePaymentRequest}
                        >
                            <Text style={stylesFormCredit.txtBtnSave}>{languageKey('_save')}</Text>
                        </Button>
                        <Button
                            style={stylesFormCredit.btnConfirm}
                            disabled={!detailConfirmRequest?.OID}
                            onPress={handleConfirm}
                        >
                            <Text style={stylesFormCredit.txtBtnConfirm}>{languageKey('_confirm')}</Text>
                        </Button>
                    </View>
                </View>
            ) : visibleFormEdit ? (
                <View style={stylesDetail.cardProgram}>
                    <View style={stylesDetail.containerHeader}>
                        <Text style={stylesDetail.headerProgram}>{languageKey('_deposit_payment_proposal')}</Text>
                        <View style={[stylesDetail.bodyStatus, { backgroundColor: detailConfirmRequest?.ApprovalStatusColor }]}>
                            <Text style={[stylesDetail.txtStatus, { color: detailConfirmRequest?.ApprovalStatusTextColor }]}>
                                {detailConfirmRequest?.ApprovalStatusName}
                            </Text>
                        </View>
                    </View>
                    <View style={stylesDetail.bodyCard}>
                        <View style={stylesFormCredit.inputFormDate}>
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
                                    margin={true}
                                />
                            </View>
                            <View style={stylesDetail.input}>
                                <Text style={stylesFormCredit.txtHeaderInputView}>{languageKey('_deposit_payment_amount')}</Text>
                                <TextInput
                                    multiline={true}
                                    style={stylesDetail.inputContent}
                                    onChangeText={(text) => onChangeValue(text.replace(/[^0-9]/g, ''))}
                                    value={formatNumber(valueRequest)}
                                    placeholder={'0'}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                        <Text style={stylesDetail.headerInput}>{languageKey('_content')}</Text>
                        <TextInput
                            multiline={true}
                            style={stylesDetail.inputNote}
                            onChangeText={onChangeContentApproval}
                            value={contentApproval}
                            numberOfLines={4}
                            placeholder={languageKey('_enter_content')}
                        />

                        <Text style={stylesFormCredit.headerBoxImage}>{languageKey('_image')}</Text>
                        <AttachManyFile
                            OID={detailConfirmRequest?.OID}
                            images={images}
                            setDataImages={setDataImages}
                            setLinkImage={setLinkImage}
                            dataLink={linkImage}
                            form={true}
                        />
                    </View>

                    <View style={stylesFormCredit.containerFooterConfirm}>
                        <Button
                            style={stylesFormCredit.btnSave}
                            onPress={handlePaymentRequest}
                        >
                            <Text style={stylesFormCredit.txtBtnSave}>{languageKey('_save')}</Text>
                        </Button>
                        <Button
                            style={stylesFormCredit.btnConfirm}
                            disabled={!detailConfirmRequest?.OID}
                            onPress={handleConfirm}
                        >
                            <Text style={stylesFormCredit.txtBtnConfirm}>{languageKey('_confirm')}</Text>
                        </Button>
                    </View>
                </View>
            )
                :
                <View style={stylesDetail.cardProgram}>
                    <View style={stylesDetail.containerHeader}>
                        <Text style={stylesDetail.headerProgram}>{languageKey('_deposit_payment_proposal')}</Text>
                        <View style={[stylesDetail.bodyStatus, { backgroundColor: detailConfirmRequest?.ApprovalStatusColor }]}>
                            <Text style={[stylesDetail.txtStatus, { color: detailConfirmRequest?.ApprovalStatusTextColor }]}>
                                {detailConfirmRequest?.ApprovalStatusName}
                            </Text>
                        </View>
                    </View>
                    <View style={stylesDetail.bodyCard}>
                        <View style={stylesDetail.containerContent}>
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_payment_deposit_date')}</Text>
                                <Text style={stylesDetail.contentBody}>{moment(detailConfirmRequest?.ODate).format('DD/MM/YYYY')}</Text>
                            </View>
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_deposit_payment_amount')}</Text>
                                <Text style={stylesDetail.contentBody}>
                                    {Number(detailConfirmRequest?.PaymentAmount || 0).toLocaleString('en-US')}
                                </Text>
                            </View>
                        </View>
                        {detailConfirmRequest?.Content ? (
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_request_content')}</Text>
                                <Text style={stylesDetail.contentBody} numberOfLines={3} ellipsizeMode="tail">
                                    {detailConfirmRequest?.Content}
                                </Text>
                            </View>
                        ) : null}
                        {linkImgConfirmRequest.length > 0 && (
                            <View style={stylesDetail.containerTableFileItem}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_image')}</Text>
                                <RenderImage urls={linkImgConfirmRequest} />
                            </View>
                        )}
                        <Button
                            style={stylesFormCredit.editBtn}
                            onPress={handleShow}
                        >
                            <Text style={stylesFormCredit.txtBtnConfirm}>{languageKey('_edit')}</Text>
                        </Button>
                    </View>
                </View>
            }
            {detailConfirmRequest?.Progress.length > 0 ?
                <View style={stylesDetail.cardProgram}>
                    <Text style={stylesDetail.headerProgram}>{languageKey('_accounting_information_confirmation')}</Text>

                    <View style={stylesDetail.bodyCard}>
                        <View style={stylesDetail.containerContent}>
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_confirmer')}</Text>
                                <Text style={stylesDetail.contentBody}>{detailConfirmRequest?.Progress[0]?.UserFullName}</Text>
                            </View>
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_deposit_payment_amount')}</Text>
                                <Text style={stylesDetail.contentBody}>{moment(detailConfirmRequest?.Progress[0]?.CreateDate).format('DD/MM/YYYY')}</Text>
                            </View>
                        </View>
                        {detailConfirmRequest?.Progress[0]?.ApprovalNote ?
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_content')}</Text>
                                <Text
                                    style={stylesDetail.contentBody}
                                    numberOfLines={3}
                                    ellipsizeMode="tail"
                                >
                                    {detailConfirmRequest?.Progress[0]?.ApprovalNote}
                                </Text>
                            </View>
                            : null
                        }
                        {linkImgArray.length > 0 && (
                            <View style={stylesDetail.containerTableFileItem}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_image')}</Text>
                                <RenderImage urls={linkImgArray} />
                            </View>
                        )}
                    </View>
                </View>
                : null
            }

        </View>
    )
}

export default DetailTab;