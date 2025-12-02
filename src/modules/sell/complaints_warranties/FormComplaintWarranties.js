import React, { useEffect, useState } from "react";
import _ from 'lodash';
import moment from "moment";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, StatusBar } from "react-native";

import routes from "@routes";
import { translateLang } from "store/accLanguages/slide";
import { stylesComplaintForm } from "./styles";
import { close_blue, } from "svgImg";
import { ApiComplaints_Add, ApiComplaints_Edit, ApiComplaints_Submit } from "action/Api";
import { Button, CardModalSelect, HeaderBack, InputDefault, ModalNotify, NotifierAlert, AttachManyFile } from "components";
import { updateListItemsProduct } from "store/accProduct_Quote/slide";
import { fetchListEntryComplaint } from "store/acc_Complaint_Warranties/thunk";

const FormComplaintWarranties = ({ route }) => {
    const item = route?.params?.item;
    const editComplaint = route?.params?.editComplaint;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang);
    const { detailMenu } = useSelector(state => state.Home);
    const { listEntryComplaint, listComplaintType, detailComplaintWarraties } = useSelector(state => state.ComplaintWarranties);
    const { listCustomerByUserID } = useSelector(state => state.Login);
    const [isShowOptionsModalCancel, setShowOptionsModalCancel] = useState(false);
    const [valueEntry, setValueEntry] = useState(editComplaint ? listEntryComplaint?.find(entry => entry.EntryID === detailComplaintWarraties?.EntryID) : null);
    const [valueCustomer, setValueCustomer] = useState(editComplaint ? listCustomerByUserID?.find(cus => cus?.ID === detailComplaintWarraties?.CustomerID) : null);
    const [valueTypeRequest, setValueTypeRequest] = useState(editComplaint ? listComplaintType?.find(item => item.ID === detailComplaintWarraties?.CustomerRequestTypeID) : null);
    const [linkImage, setLinkImage] = useState(
        editComplaint && detailComplaintWarraties?.Link?.trim() !== ''
            ? detailComplaintWarraties?.Link
            : ''
    );
    const linkImgArray = linkImage ? linkImage.split(';').filter(Boolean) : [];
    const [images, setDataImages] = useState(linkImgArray)

    const openModalOptionsCancel = (item) => {
        setShowOptionsModalCancel(true);
    };

    const handleCloseOptionsMoalCancel = () => {
        setShowOptionsModalCancel(false);
    };

    const initialValues = {
        OID: "",
        Note: editComplaint ? item?.Note : '',
        CustomerID: editComplaint ? valueCustomer : null,
        ReferenceID: "",
        RequestTypeID: editComplaint ? valueTypeRequest : null,
        Content: editComplaint ? item?.Content : '',
        Link: "",
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
        const linkArray = typeof linkImage === 'string' ? linkImage.split(';') : Array.isArray(linkImage) ? linkImage : [];
        const linkString = linkArray.join(';');

        const body = {
            FactorID: detailMenu?.factorId || '',
            EntryID: valueEntry?.EntryID || '',
            ODate: new Date(),
            SAPID: "",
            LemonID: "",
            CustomerID: valueCustomer?.ID || 0,
            ReferenceID: "",
            RequestTypeID: valueTypeRequest?.ID || 0,
            Content: values?.Content || '',
            Note: values?.Note || "",
            Link: linkString || "",
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
            OID: editComplaint ? detailComplaintWarraties?.OID : ''
        }
        try {
            const result = editComplaint ? await ApiComplaints_Edit(body) : await ApiComplaints_Add(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                dispatch(updateListItemsProduct([]))
                navigation.navigate(routes.ComplaintWarrantiesScreen)
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
            OID: item?.OID,
            IsLock: item?.IsLock === 0 ? 1 : 0,
        }
        try {
            const result = await ApiComplaints_Submit(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                navigation.navigate(routes.ComplaintWarrantiesScreen)
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
        dispatch(fetchListEntryComplaint(body))
    }, []);

    return (
        <LinearGradient style={stylesComplaintForm.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView style={stylesComplaintForm.container}>
                <HeaderBack
                    title={languageKey('_add_complaint_warranty')}
                    onPress={() => navigation.goBack()}
                    btn={true}
                    iconBtn={close_blue}
                    onPressBtn={openModalOptionsCancel}
                />
                <ScrollView style={stylesComplaintForm.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={stylesComplaintForm.card}>
                        <View style={stylesComplaintForm.inputAuto}>
                            <View style={stylesComplaintForm.inputRead}>
                                <Text style={stylesComplaintForm.txtHeaderInputView}>{languageKey('_ct_code')}</Text>
                                <Text
                                    style={stylesComplaintForm.inputView}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {editComplaint ? item?.OID : "Auto"}
                                </Text>
                            </View>
                            <View style={stylesComplaintForm.inputRead}>
                                <Text style={stylesComplaintForm.txtHeaderInputView}>{languageKey('_ct_code')}</Text>
                                <Text
                                    style={stylesComplaintForm.inputView}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {editComplaint ? moment(item?.ODate).format('DD/MM/YYYY') : moment(new Date()).format('DD/MM/YYYY')}
                                </Text>
                            </View>
                        </View>

                        <View style={stylesComplaintForm.input}>
                            <CardModalSelect
                                title={languageKey('_customer_name')}
                                data={listCustomerByUserID}
                                setValue={setValueCustomer}
                                value={valueCustomer?.Name}
                                bgColor={'#FAFAFA'}
                            />
                        </View>
                        <View style={stylesComplaintForm.input}>
                            <CardModalSelect
                                title={languageKey('_request')}
                                data={listEntryComplaint}
                                setValue={setValueEntry}
                                value={valueEntry?.EntryName}
                                bgColor={'#FAFAFA'}
                            />
                        </View>
                        {valueEntry?.EntryID === "Warranty" ? null :
                            <View style={stylesComplaintForm.input}>
                                <CardModalSelect
                                    title={languageKey('_type_of_request')}
                                    data={listComplaintType}
                                    setValue={setValueTypeRequest}
                                    value={valueTypeRequest?.Name}
                                    bgColor={'#FAFAFA'}
                                />
                            </View>
                        }
                        <InputDefault
                            name="Content"
                            returnKeyType="next"
                            style={stylesComplaintForm.input}
                            value={values?.Content}
                            label={languageKey('_content')}
                            isEdit={true}
                            bgColor={'#FAFAFA'}
                            labelHolder={languageKey('_enter_content')}
                            placeholderInput={true}
                            {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                        />
                        <InputDefault
                            name="Note"
                            returnKeyType="next"
                            style={stylesComplaintForm.input}
                            value={values?.Note}
                            label={languageKey('_note')}
                            placeholderInput={true}
                            isEdit={true}
                            bgColor={'#FAFAFA'}
                            labelHolder={languageKey('_enter_notes')}
                            {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                        />
                        <Text style={stylesComplaintForm.headerBoxImage}>{languageKey('_image')}</Text>
                        <View style={stylesComplaintForm.imgBox}>
                            <AttachManyFile
                                OID={''}
                                images={images}
                                setDataImages={setDataImages}
                                setLinkImage={setLinkImage}
                                dataLink={linkImage}
                            />
                        </View>
                    </View>
                </ScrollView>
                <View style={stylesComplaintForm.containerFooter}>
                    <Button
                        style={stylesComplaintForm.btnSave}
                        onPress={handleSave}
                    >
                        <Text style={stylesComplaintForm.txtBtnSave}>{languageKey('_save')}</Text>
                    </Button>
                    <Button
                        style={stylesComplaintForm.btnConfirm}
                        disabled={item ? false : true}
                        onPress={handleConfirm}
                    >
                        <Text style={stylesComplaintForm.txtBtnConfirm}>{languageKey('_confirm')}</Text>
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

export default FormComplaintWarranties;