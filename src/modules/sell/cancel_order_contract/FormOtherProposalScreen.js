import React, { useEffect, useMemo, useState } from "react";
import _ from 'lodash';
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, StatusBar, Alert, } from "react-native";

import routes from "@routes";
import { translateLang } from "store/accLanguages/slide";
import { stylesFormOtherProposal, stylesDetail } from "./styles";
import { fetchListDepartment, fetchListEntry } from "store/accCus_Requirement/thunk";
import { close_blue } from "svgImg";
import { ApiOtherProposals_Add, ApiOtherProposals_Edit, ApiOtherProposals_Submit } from "action/Api";
import { Button, CardModalSelect, HeaderBack, InputDefault, ModalNotify, NotifierAlert, ModalSelectDate, AttachManyFile } from "components";
import { fetchListDocumentTypes, fetchListReference } from "store/accHand_Over_Doc/thunk";
import { fetchListUser } from "store/accApproval_Signature/thunk";

const FormOtherProposaltScreen = ({ route }) => {
    const editProposal = route?.params?.editProposal
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const languageKey = useSelector(translateLang);
    const { detailMenu } = useSelector(state => state.Home);
      const {userInfo} = useSelector(state => state.Login);
    const { listEntry, listDepartment } = useSelector(state => state.CusRequirement);
    const { listUser } = useSelector(state => state.ApprovalProcess);
    const { listCustomerByUserID } = useSelector(state => state.Login);
    const { listDocumentTypes, listReference } = useSelector(state => state.HandOverDoc);
    const { detailOtherProposal, listReasonProposal } = useSelector(state => state.OtherProposal);
    const [valueDocumentType, setValueDocumentType] = useState(editProposal ? listDocumentTypes?.find(doc => doc.ID === detailOtherProposal?.DocumentTypeID) : null);
    const [valueReference, setValueReference] = useState(editProposal ? listReference?.find(refer => refer.OID === detailOtherProposal?.ReferenceID) : null);
    const listCustomerApproval = listCustomerByUserID?.filter(item => item.IsClosed === 0);
    const [isShowOptionsModalCancel, setShowOptionsModalCancel] = useState(false);
    const [valueReasonProposal, setValueReasonProposal] = useState(editProposal ? listReasonProposal?.find(item => item.ID === detailOtherProposal?.ReasonID) : null);
    const [valueCustomer, setValueCustomer] = useState(editProposal ? listCustomerApproval?.find(customer => customer.ID === detailOtherProposal?.CustomerID) :  null);
    const [linkImage, setLinkImage] = useState(
        editProposal && detailOtherProposal?.Link?.trim() !== ''
            ? detailOtherProposal.Link
            : ''
    );
    const linkImgArray = linkImage ? linkImage.split(';').filter(Boolean) : [];
    const [images, setDataImages] = useState(linkImgArray)
    const [valueEntry, setValueEntry] = useState(editProposal ? listEntry?.find(item => item?.EntryID === detailOtherProposal?.EntryID) : null);
    const department = listDepartment?.filter(item => item?.Extention4 === "1")
    const [valueDepartment, setValueDepartMent] = useState(editProposal ? department?.find(item => item.ID === detailOtherProposal?.DepartmentID) : null);

    const listUserByDepartment = useMemo(() => {
        return listUser
            ? listUser.filter(user => Number(user?.DepartmentID) === valueDepartment?.ID)
            : [];
    }, [listUser, valueDepartment]);

    const [valueUserByDepartment, setValueUserByDepartment] = useState(editProposal ? listUserByDepartment?.find(item => item.UserID === detailOtherProposal?.ResponsibleUser) : null);

    const [dateStates, setDateStates] = useState({
        planDate: {
            selected: null,
            submit: null,
            visible: false,
        },
        extenDate: {
            selected: null,
            submit: null,
            visible: false,
        },
        deadlineDate: {
            selected: null,
            submit: null,
            visible: false,
        },
    });

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
        const body = {
            FactorID: detailMenu?.factorId,
            EntryID: detailMenu?.entryId
        }
        dispatch(fetchListEntry(body))
    }, [])

    const openModalOptionsCancel = (item) => {
        setShowOptionsModalCancel(true);
    };

    const handleCloseOptionsMoalCancel = () => {
        setShowOptionsModalCancel(false);
    };

    const initialValues = {
        CustomerID: editProposal ? valueCustomer : '',
        ReferenceID: editProposal ? valueReference : '',
        ReasonID: editProposal ? valueReasonProposal : '',
        Reason: editProposal ? detailOtherProposal?.Reason : "",
        Proposal: editProposal ? detailOtherProposal?.Proposal : "",
        DepartmentID: '',
        ResponsibleUser: '',
        ProcessingDeadline: "",
        RequestContent: editProposal ? detailOtherProposal?.RequestContent : "",
        Note: editProposal ? detailOtherProposal?.Note : "",
        Link: '',
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

    const handleSave = _.debounce(async () => {
        const errors = [];

        if (!valueEntry?.EntryID) {
            errors.push(languageKey('_please_select_function'));
        }

        if (!valueEntry?.EntryID) {
            errors.push(languageKey('_please_select_function'));
        }
        if (!valueEntry?.EntryID) {
            errors.push(languageKey('_please_select_function'));
        }
        if (!valueEntry?.EntryID) {
            errors.push(languageKey('_please_select_function'));
        }
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
            FactorID: detailMenu?.factorId,
            EntryID: valueEntry?.EntryID,
            ODate: dateStates?.planDate?.submit,
            CustomerID: valueCustomer?.ID || 0,
            DocumentTypeID: valueDocumentType?.ID || 0,
            ReferenceID: valueReference?.OID || 0,
            ReasonID: valueReasonProposal?.ID || 0,
            ExtendDate: dateStates?.extenDate?.submit,
            Reason: values?.Reason || "",
            Proposal: values?.Proposal,
            DepartmentID: valueDepartment?.ID || 0,
            ResponsibleUser: valueUserByDepartment?.UserID || 0,
            ProcessingDeadline: dateStates?.deadlineDate?.submit,
            RequestContent: values?.RequestContent || "",
            Note: values?.Note || '',
            Link: linkString || '',
            OID: editProposal ? detailOtherProposal?.OID : '',
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
            "Extention20": ""
        }
        try {
            const result = editProposal ? await ApiOtherProposals_Edit(body) : await ApiOtherProposals_Add(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                navigation.navigate(routes.OtherProposalScreen)
            } else {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'error',
                );
            }
        } catch (error) {
            console.log('handleSave', error);
        }
    }, 2000, { leading: true, trailing: false });

    const handleConfirm = _.debounce(async () => {
        const body = {
            OID: detailOtherProposal?.OID,
            IsLock: detailOtherProposal?.IsLock === 0 ? 1 : 0,
        }
        try {
            const result = await ApiOtherProposals_Submit(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                navigation.navigate(routes.OtherProposalScreen)
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
            EntryID: valueEntry?.EntryID
        }
        dispatch(fetchListDocumentTypes(body))
        dispatch(fetchListDepartment())
        dispatch(fetchListUser({CmpnID: userInfo?.CmpnID}));
    }, [valueEntry])

    useEffect(() => {
        if (valueDocumentType && valueCustomer) {
            const body = {
                ID: valueDocumentType?.ID,
                CustomerID: valueCustomer?.ID
            }
            dispatch(fetchListReference(body))
        }
    }, [valueDocumentType, valueCustomer]);
    return (
        <LinearGradient style={stylesFormOtherProposal.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView style={stylesFormOtherProposal.container}>
                <HeaderBack
                    title={editProposal ? languageKey('_proposal_edit') : languageKey('_new_proposal')}
                    onPress={() => navigation.goBack()}
                    btn={true}
                    iconBtn={close_blue}
                    onPressBtn={openModalOptionsCancel}
                />
                <ScrollView
                    style={stylesFormOtherProposal.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={stylesFormOtherProposal.flatScroll}
                >
                    <View style={stylesDetail.line} />
                    <View style={stylesFormOtherProposal.card}>
                        <View style={stylesFormOtherProposal.input}>
                            <CardModalSelect
                                title={languageKey('_function')}
                                data={listEntry}
                                setValue={setValueEntry}
                                value={valueEntry?.EntryName}
                                bgColor={editProposal ? '#E5E7EB' : '#FAFAFA'}
                                require={true}
                                disabled={editProposal}
                            />
                        </View>
                        <View style={stylesFormOtherProposal.inputAuto}>
                            <View style={stylesFormOtherProposal.inputRead}>
                                <Text style={stylesFormOtherProposal.txtHeaderInputView}>{languageKey('_ct_code')}</Text>
                                <Text
                                    style={stylesFormOtherProposal.inputView}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {editProposal ? detailOtherProposal?.OID : "Auto"}
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
                                />
                            </View>
                        </View>
                        <View style={stylesFormOtherProposal.input}>
                            <CardModalSelect
                                title={languageKey('_customer')}
                                data={listCustomerApproval}
                                setValue={setValueCustomer}
                                value={valueCustomer?.Name}
                                bgColor={'#F9FAFB'}
                                require={true}
                            />
                        </View>
                        <View style={stylesFormOtherProposal.input}>
                            <CardModalSelect
                                title={languageKey('_document_type')}
                                data={listDocumentTypes}
                                setValue={setValueDocumentType}
                                value={valueDocumentType?.Name}
                                bgColor={'#F9FAFB'}
                                require={true}
                            />
                        </View>
                        <View style={stylesFormOtherProposal.input}>
                            <CardModalSelect
                                title={languageKey('_select_document_number')}
                                data={listReference}
                                setValue={setValueReference}
                                value={valueReference?.OID}
                                bgColor={'#F9FAFB'}
                                require={true}
                            />
                        </View>
                        {valueEntry?.EntryID === 'OrderExtension' || valueEntry?.EntryID === 'ContractExtension' ?
                            <View style={{ marginTop: 4 }}>
                                <ModalSelectDate
                                    title={languageKey('_extended_to_date')}
                                    showDatePicker={() => updateDateState('extenDate', { visible: true })}
                                    hideDatePicker={() => updateDateState('extenDate', { visible: false })}
                                    initialValue={dateStates.extenDate.selected}
                                    selectedValueSelected={(val) => updateDateState('extenDate', { selected: val })}
                                    isDatePickerVisible={dateStates.extenDate.visible}
                                    selectSubmitForm={(val) => updateDateState('extenDate', { submit: val })}
                                    bgColor="#FAFAFA"
                                    minimumDate={new Date()}
                                />
                            </View>
                            : null
                        }
                        <View style={stylesFormOtherProposal.input}>
                            <CardModalSelect
                                title={languageKey('_suggested_reason')}
                                data={listReasonProposal}
                                setValue={setValueReasonProposal}
                                value={valueReasonProposal?.Name}
                                bgColor={'#F9FAFB'}
                                require={true}
                            />
                        </View>
                        <InputDefault
                            name="Reason"
                            returnKeyType="next"
                            style={stylesFormOtherProposal.input}
                            value={values?.Reason}
                            label={languageKey('_explain_the_reason')}
                            placeholderInput={true}
                            isEdit={true}
                            bgColor={'#F9FAFB'}
                            labelHolder={languageKey('_enter_content')}
                            {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                        />
                        <InputDefault
                            name="Proposal"
                            returnKeyType="next"
                            style={stylesFormOtherProposal.input}
                            value={values?.Proposal}
                            label={languageKey('_proposal_interpretaion')}
                            placeholderInput={true}
                            isEdit={true}
                            bgColor={'#F9FAFB'}
                            labelHolder={languageKey('_enter_content')}
                            {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                        />
                        <InputDefault
                            name="Note"
                            returnKeyType="next"
                            style={stylesFormOtherProposal.input}
                            value={values?.Note}
                            label={languageKey('_note')}
                            placeholderInput={true}
                            isEdit={true}
                            bgColor={'#F9FAFB'}
                            labelHolder={languageKey('_enter_notes')}
                            {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                        />
                        <View style={stylesFormOtherProposal.imgBox}>
                            <Text style={stylesFormOtherProposal.headerBoxImage}>{languageKey('_image')}</Text>
                            <AttachManyFile
                                OID={detailOtherProposal?.OID}
                                images={images}
                                setDataImages={setDataImages}
                                setLinkImage={setLinkImage}
                                dataLink={linkImage}
                            />
                        </View>
                    </View>
                    {valueEntry?.EntryID === "ContractAdjust" || valueEntry?.EntryID === "OrderAdjust" ?
                        <View style={stylesFormOtherProposal.card}>
                            <Text style={stylesFormOtherProposal.headerCard}>{languageKey('_information_required_confirm')}</Text>
                            <View style={stylesFormOtherProposal.input}>
                                <CardModalSelect
                                    title={languageKey('_department_request_confirm')}
                                    data={department}
                                    setValue={setValueDepartMent}
                                    value={valueDepartment?.Name}
                                    bgColor={'#FAFAFA'}
                                />
                            </View>
                            <View style={stylesFormOtherProposal.input}>
                                <CardModalSelect
                                    title={languageKey('_officer_in_charge')}
                                    data={listUserByDepartment}
                                    setValue={setValueUserByDepartment}
                                    value={valueUserByDepartment?.UserFullName}
                                    bgColor={'#FAFAFA'}
                                />
                            </View>
                            <View style={{ marginTop: 4 }}>
                                <ModalSelectDate
                                    title={languageKey('_processing_deadline')}
                                    showDatePicker={() => updateDateState('deadlineDate', { visible: true })}
                                    hideDatePicker={() => updateDateState('deadlineDate', { visible: false })}
                                    initialValue={dateStates.deadlineDate.selected}
                                    selectedValueSelected={(val) => updateDateState('deadlineDate', { selected: val })}
                                    isDatePickerVisible={dateStates.deadlineDate.visible}
                                    selectSubmitForm={(val) => updateDateState('deadlineDate', { submit: val })}
                                    bgColor="#FAFAFA"
                                    minimumDate={new Date()}
                                />
                            </View>
                            <InputDefault
                                name="RequestContent"
                                returnKeyType="next"
                                style={stylesFormOtherProposal.input}
                                value={values?.RequestContent}
                                label={languageKey('_request_content')}
                                placeholderInput={true}
                                isEdit={true}
                                bgColor={'#F9FAFB'}
                                labelHolder={languageKey('_enter_content')}
                                {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                            />
                        </View>
                        : null}

                </ScrollView>
                <View style={stylesFormOtherProposal.containerFooter}>
                    <Button
                        style={stylesFormOtherProposal.btnSave}
                        onPress={handleSave}
                    >
                        <Text style={stylesFormOtherProposal.txtBtnSave}>{languageKey('_save')}</Text>
                    </Button>
                    <Button
                        style={stylesFormOtherProposal.btnConfirm}
                        disabled={detailOtherProposal ? false : true}
                        onPress={handleConfirm}
                    >
                        <Text style={stylesFormOtherProposal.txtBtnConfirm}>{languageKey('_confirm')}</Text>
                    </Button>
                </View>
                <ModalNotify
                    isShowOptions={isShowOptionsModalCancel}
                    handleClose={handleCloseOptionsMoalCancel}
                    handleAccept={() => navigation.goBack()}
                    handleCancel={handleCloseOptionsMoalCancel}
                    btnNameAccept={languageKey('_argee')}
                    btnCancel={languageKey('_cancel')}
                    content={languageKey('_cancel_order_contract_content')}
                />
            </SafeAreaView>
        </LinearGradient>
    )
}

export default FormOtherProposaltScreen;