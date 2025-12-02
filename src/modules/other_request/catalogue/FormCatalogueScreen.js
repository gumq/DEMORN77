import React, { useEffect, useState } from "react";
import _ from 'lodash';
import { useFormik } from "formik";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, StatusBar, Alert, FlatList } from "react-native";

import routes from "@routes";
import { stylesDetail, stylesFormProposal } from "./styles";
import { translateLang } from "store/accLanguages/slide";
import { arrow_down_big, arrow_next_gray, close_blue, trash_22 } from "svgImg";
import {  ApiDisplayMaterials_Add, ApiDisplayMaterials_Edit, ApiDisplayMaterials_Submit } from "action/Api";
import { Button, CardModalSelect, HeaderBack, InputDefault, ModalNotify, ModalSelectDate, NotifierAlert, RadioButton, AttachManyFile, ModalGoodsProposal } from "components";
import { fetchListCustomerByUserID } from "store/accAuth/thunk";
import { fetchListEventGift, fetchListPromotionGift } from "store/accOther_Proposal/thunk";

const FormCatalogueScreen = ({ route }) => {
    const item = route?.params?.item;
    const editProposal = route?.params?.editProposal
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const languageKey = useSelector(translateLang);
    const { userInfo } = useSelector(state => state.Login);
    const { detailMenu } = useSelector(state => state.Home);
    const { listEntry } = useSelector(state => state.CusRequirement);
    const { detailCatalogue, listProgram, listEvent } = useSelector(state => state.OtherProposal);
    const [isShowOptionsModalCancel, setShowOptionsModalCancel] = useState(false);
    const [valueRecommendedType, setValueRecommendedType] = useState(editProposal ? listEntry?.find(item => item?.EntryID === detailCatalogue?.EntryID) : null);
    const [valueProgram, setValueProgram] = useState(editProposal ? listProgram?.find(item => item?.OID === detailCatalogue?.ReferenceID) : null);
    const [valueEvent, setValueEvent] = useState(editProposal ? listEvent?.find(item => item?.ID === detailCatalogue?.EventTypeID) : null);
    const [dateStates, setDateStates] = useState({
        planDate: {
            selected: editProposal ? detailCatalogue?.ODate : null,
            submit: editProposal ? detailCatalogue?.ODate : null,
            visible: false,
        },
        deadlineDate: {
            selected: editProposal ? detailCatalogue?.RequestDate : null,
            submit: editProposal ? detailCatalogue?.RequestDate : null,
            visible: false,
        }
    });

    const [isShowModalGoods, setIsShowModalGoods] = useState(false);
    const [modalSource, setModalSource] = useState(null);
    const [donatedGoods, setDonatedGoods] = useState([]);
    const [consignmentGoods, setConsignmentGoods] = useState([]);
    const [editingItem, setEditingItem] = useState(null);

    const updateDateState = (key, newValues) => {
        setDateStates(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                ...newValues
            }
        }));
    };

    const [linkImage, setLinkImage] = useState(
        editProposal && detailCatalogue?.Link?.trim() !== ''
            ? detailCatalogue.Link
            : ''
    );
    const linkImgArray = linkImage ? linkImage.split(';').filter(Boolean) : [];
    const [images, setDataImages] = useState(linkImgArray)
    const dataCheckbox = [
        { id: 1, value: languageKey('_according_to_the_program'), key: 1 },
        { id: 2, value: languageKey('_outside_program'), key: 0 }
    ]

    const [isProgram, setIsProgram] = useState(editProposal && detailCatalogue?.InProgram === 1 ? dataCheckbox[0] : dataCheckbox[1]);

    const [showInformation, setShowInformation] = useState({
        general: true,
        customer: true,
        reference: false,
    });

    const toggleInformation = (key) => {
        setShowInformation((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const openModalOptionsCancel = () => {
        setShowOptionsModalCancel(true);
    };

    const handleCloseOptionsMoalCancel = () => {
        setShowOptionsModalCancel(false);
    };

    const openModalAddProducts = (source) => {
        setModalSource(source);
        setIsShowModalGoods(true);
    };

    const handleCloseModalProducts = () => {
        setIsShowModalGoods(false);
        setModalSource(null);
    };

    const handleSetValueGoods = (data) => {
        if (modalSource === 'donated') {
            setDonatedGoods(data);
        } else if (modalSource === 'consignment') {
            setConsignmentGoods(data);
        }
        setIsShowModalGoods(false);
        setModalSource(null);
    };

    const initialValues = {
        FactorID: detailMenu?.factorId || '',
        EntryID: "",
        ReferenceID: "",
        InProgram: 0,
        OutProgram: 0,
        EventTypeID: 0,
        RequestUserID: userInfo?.UserID || 0,
        Content: editProposal ? detailCatalogue?.Content : "",
        Link: "",
        Note: editProposal ? detailCatalogue?.Note : "",
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


    const giftAmount = donatedGoods?.reduce((sum, entry) => {
        return sum + entry.ItemDetails.reduce((itemSum, item) => itemSum + (item?.TotalAmount || 0), 0);
    }, 0);

    const consignmentAmount = consignmentGoods?.reduce((sum, entry) => {
        return sum + entry.ItemDetails.reduce((itemSum, item) => itemSum + (item?.TotalAmount || 0), 0);
    }, 0);

    const totalAmount = giftAmount + consignmentAmount;

    const handleProposalOrther = _.debounce(async () => {
        const errors = [];

        if (!valueRecommendedType?.EntryID) {
            errors.push(languageKey('_please_select_function'));
        }

        if (errors.length > 0) {
            Alert.alert(errors[0]);
            return;
        }
        const linkArray = typeof linkImage === 'string' ? linkImage.split(';') : Array.isArray(linkImage) ? linkImage : [];
        const linkString = linkArray.join(';');
        const body = {
            FactorID: detailMenu?.factorId || '',
            EntryID: valueRecommendedType?.EntryID || "",
            Odate: dateStates?.planDate?.submit,
            "SAPID": "string",
            "LemonID": "string",
            ReferenceID: valueProgram?.OID || "",
            InProgram: isProgram?.key === 1 ? 1 : 0,
            OutProgram: isProgram?.key === 1 ? 0 : 1,
            EventTypeID: valueEvent?.ID || 0,
            RequestUserID: userInfo?.UserID || 0,
            RequestDate: dateStates?.deadlineDate?.submit,
            Content: values.Content || "",
            Link: linkString || "",
            Note: values?.Note || '',
            GiftAmount: giftAmount || 0,
            ConsignmentAmount: consignmentAmount || 0,
            TotalAmount: totalAmount || 0,
            "Extention1": "string",
            "Extention2": "string",
            "Extention3": "string",
            "Extention4": "string",
            "Extention5": "string",
            "Extention6": "string",
            "Extention7": "string",
            "Extention8": "string",
            "Extention9": "string",
            "Extention10": "string",
            "Extention11": "string",
            "Extention12": "string",
            "Extention13": "string",
            "Extention14": "string",
            "Extention15": "string",
            "Extention16": "string",
            "Extention17": "string",
            "Extention18": "string",
            "Extention19": "string",
            "Extention20": "string",
            DisplayMaterialsJson: [...donatedGoods, ...consignmentGoods],
            OID: editProposal ? detailCatalogue?.OID : ''
        }
        try {
            const result = editProposal ? await ApiDisplayMaterials_Edit(body) : await ApiDisplayMaterials_Add(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                navigation.navigate(routes.CatalogueScreen)
            } else {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'error',
                );
            }
        } catch (error) {
            console.log('handleProposalOrther', error);
        }
    }, 2000, { leading: true, trailing: false });

    const handleConfirm = _.debounce(async () => {
        const body = {
            OID: detailCatalogue?.OID,
            IsLock: detailCatalogue?.IsLock === 0 ? 1 : 0,
        }
        try {
            const result = await ApiDisplayMaterials_Submit(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                navigation.navigate(routes.CatalogueScreen)
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
        if (item) {
            updateDateState('fromDate', {
                selected: item.EffectiveDateFrom,
                submit: item.EffectiveDateFrom,
            });
            updateDateState('toDate', {
                selected: item.EffectiveDateTo,
                submit: item.EffectiveDateTo,
            });
        } else {
            const now = new Date();
            updateDateState('fromDate', { selected: now });
            updateDateState('toDate', { selected: now });
        }
    }, [item]);

    useEffect(() => {
        const bodyCustomer = {
            CustomerRepresentativeID: userInfo?.UserID || 0,
            // SalesStaffID: null,
            // Function: 'Default'
              CmpnID:userInfo?.CmpnID,
        }
        dispatch(fetchListCustomerByUserID(bodyCustomer));
        dispatch(fetchListPromotionGift());
    }, []);

    useEffect(() => {
        const body = {
            OID: valueProgram?.ReferenceID
        }
        dispatch(fetchListEventGift(body));
    }, [valueProgram]);

    const getRenderDataBySource = (source) => {
        const goodsList = source === 'donated' ? donatedGoods : consignmentGoods;

        return goodsList?.flatMap(entry => {
            return entry.ItemDetails.map(detail => ({
                CustomerID: entry.CustomerID,
                CustomerName: entry.CustomerName,
                EntryID: entry.EntryID,
                ItemID: detail.ItemID,
                ItemName: detail.ItemName,
                ItemPrice: detail.ItemPrice,
                ItemQty: detail?.ItemQty,
                TotalAmount: detail.TotalAmount,
                Note: detail.Note
            }));
        });
    };
    const handleDelete = (itemToDelete) => {
        const updateGoods = (prevGoodsSetter) => {
            return prevGoodsSetter(prevGoods =>
                prevGoods
                    .map(entry => {
                        if (entry.CustomerID === itemToDelete.CustomerID && entry.EntryID === itemToDelete.EntryID) {
                            const filtered = entry.ItemDetails.filter(i => i.ItemID !== itemToDelete.ItemID);
                            return { ...entry, ItemDetails: filtered };
                        }
                        return entry;
                    })
                    .filter(entry => entry.ItemDetails.length > 0)
            );
        };

        if (itemToDelete.EntryID === 'RequestGifts') {
            updateGoods(setDonatedGoods);
        } else if (itemToDelete.EntryID === 'RequestConsignment') {
            updateGoods(setConsignmentGoods);
        }
    };

    const handleEditItem = (itemToEdit) => {
        setEditingItem(itemToEdit);
        setModalSource(itemToEdit.EntryID === 'RequestGifts' ? 'donated' : 'consignment');
        setIsShowModalGoods(true);
    };

    const _keyExtractorGood = (item, index) => `${item.ItemID}-${index}`;
    const _renderItemGood = ({ item }) => {
        const totalAmount = item?.ItemQty * item?.ItemPrice
        return (
            <Button style={stylesFormProposal.cardProgramDetail} onPress={() => handleEditItem(item)}>
                <View style={stylesFormProposal.row}>
                    <View style={{ marginBottom: 8 }}>
                        <Text style={stylesFormProposal.headerProgramItem}>{item?.ItemName}</Text>
                        <Text style={stylesFormProposal.txtHeaderBody}>{item?.ItemID}</Text>
                    </View>

                    {detailCatalogue?.IsLock === 1 ? null :
                        <Button onPress={() => handleDelete(item)}>
                            <SvgXml xml={trash_22} />
                        </Button>
                    }
                </View>
                <View style={stylesFormProposal.bodyCard}>
                    {item?.ItemQty ? (
                        <View style={stylesFormProposal.contentCard}>
                            <Text style={stylesFormProposal.txtHeaderBody}>{languageKey('_quantity')}</Text>
                            <Text style={stylesFormProposal.contentBody}>{item?.ItemQty}</Text>
                        </View>
                    ) : null}
                    {item?.ItemPrice ? (
                        <View style={stylesFormProposal.contentCard}>
                            <Text style={stylesFormProposal.txtHeaderBody}>{languageKey('_unit_price')}</Text>
                            <Text style={stylesFormProposal.contentBody}>{item?.ItemPrice?.toLocaleString()}</Text>
                        </View>
                    ) : null}
                    {totalAmount ? (
                        <View style={stylesFormProposal.contentCard}>
                            <Text style={stylesFormProposal.txtHeaderBody}>{languageKey('_money')}</Text>
                            <Text style={stylesFormProposal.contentBody}>{totalAmount?.toLocaleString()}</Text>
                        </View>
                    ) : null}
                </View>
                <View style={stylesFormProposal.contentCard}>
                    <Text style={stylesFormProposal.txtHeaderBody}>{languageKey('_customer')}</Text>
                    <Text style={stylesFormProposal.contentBody}>{item?.CustomerName}</Text>
                </View>
                <View style={stylesFormProposal.contentCard}>
                    <Text style={stylesFormProposal.txtHeaderBody}>{languageKey('_note')}</Text>
                    <Text style={stylesFormProposal.contentBody}>{item?.Note}</Text>
                </View>
            </Button>
        );
    };

    const groupItemsByCustomer = (items, entryID) => {
        return detailCatalogue?.Customer?.map(customer => {
            const matchedItems = items?.filter(item => item?.OID === customer?.OID);
            if (matchedItems === 0) return null;
            return {
                CustomerID: customer.CustomerID,
                CustomerName: customer.CustomerName,
                OID: customer.OID,
                EntryID: entryID,
                ItemDetails: matchedItems
            }
        }).filter(entry => entry.ItemDetails.length > 0);
    };

    useEffect(() => {
        if (editProposal && detailCatalogue) {
            const donated = groupItemsByCustomer(detailCatalogue?.ListItemGift, 'RequestGifts');
            const consignment = groupItemsByCustomer(detailCatalogue?.ListItemConsignment, 'RequestConsignment');

            setDonatedGoods(donated);
            setConsignmentGoods(consignment);
        }
    }, [editProposal, detailCatalogue]);

    return (
        <LinearGradient style={stylesFormProposal.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView style={stylesFormProposal.container}>
                <HeaderBack
                    title={editProposal ? languageKey('_proposal_edit') : languageKey('_new_proposal')}
                    onPress={() => navigation.goBack()}
                    btn={true}
                    iconBtn={close_blue}
                    onPressBtn={openModalOptionsCancel}
                />
                <ScrollView
                    style={stylesFormProposal.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={stylesFormProposal.footerScroll}
                >
                    <View style={stylesDetail.containerHeader}>
                        <View style={stylesFormProposal.containerRadio}>
                            <Text style={stylesDetail.header}>{languageKey('_information_general')}</Text>
                        </View>
                        <Button style={stylesDetail.btnShowInfor} onPress={() => toggleInformation("general")}>
                            <SvgXml xml={showInformation.general ? arrow_down_big : arrow_next_gray} />
                        </Button>
                    </View>
                    {showInformation.general && (
                        <View style={stylesFormProposal.card}>
                            <View style={stylesFormProposal.input}>
                                <CardModalSelect
                                    title={languageKey('_function')}
                                    data={listEntry}
                                    setValue={setValueRecommendedType}
                                    value={valueRecommendedType?.EntryName}
                                    bgColor={editProposal ? '#E5E7EB' : '#FAFAFA'}
                                    require={true}
                                    disabled={editProposal}
                                />
                            </View>
                            <View style={stylesFormProposal.inputAuto}>
                                <InputDefault
                                    name="OID"
                                    returnKeyType="next"
                                    style={stylesFormProposal.widthInput}
                                    value={editProposal ? detailCatalogue?.OID : "Auto"}
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
                                        require={true}
                                        minimumDate={new Date()}
                                    />
                                </View>
                            </View>
                            <View style={stylesFormProposal.input}>
                                <RadioButton
                                    initialValue={isProgram}
                                    data={dataCheckbox}
                                    setValue={setIsProgram}
                                />
                            </View>

                            <View style={stylesFormProposal.input}>
                                <CardModalSelect
                                    title={languageKey('_program')}
                                    data={listProgram}
                                    setValue={setValueProgram}
                                    value={valueProgram?.Name}
                                    bgColor={'#FAFAFA'}
                                />
                            </View>
                            <View style={stylesFormProposal.input}>
                                <CardModalSelect
                                    title={languageKey('_reason_event_for_gift')}
                                    data={listEvent}
                                    setValue={setValueEvent}
                                    value={valueEvent?.ProposedReason}
                                    bgColor={'#FAFAFA'}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <ModalSelectDate
                                    title={languageKey('_request_deadline')}
                                    showDatePicker={() => updateDateState('deadlineDate', { visible: true })}
                                    hideDatePicker={() => updateDateState('deadlineDate', { visible: false })}
                                    initialValue={dateStates.deadlineDate.selected}
                                    selectedValueSelected={(val) => updateDateState('deadlineDate', { selected: val })}
                                    isDatePickerVisible={dateStates.deadlineDate.visible}
                                    selectSubmitForm={(val) => updateDateState('deadlineDate', { submit: val })}
                                    bgColor={'#FAFAFA'}
                                    require={true}
                                    minimumDate={new Date()}
                                />
                            </View>
                            <View style={stylesFormProposal.inputAuto}>
                                <View style={stylesFormProposal.widthInput}>
                                    <Text style={stylesFormProposal.txtHeaderInputView}>{languageKey('_donation_costs')}</Text>
                                    <Text
                                        style={stylesFormProposal.inputView}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {giftAmount ? giftAmount.toLocaleString() : 0}
                                    </Text>
                                </View>
                                <View style={stylesFormProposal.widthInput}>
                                    <Text style={stylesFormProposal.txtHeaderInputView}>{languageKey('_consignment_fees')}</Text>
                                    <Text
                                        style={stylesFormProposal.inputView}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {consignmentAmount ? consignmentAmount.toLocaleString() : 0}
                                    </Text>
                                </View>
                                <View style={stylesFormProposal.widthInput}>
                                    <Text style={stylesFormProposal.txtHeaderInputView}>{languageKey('_total_cost')}</Text>
                                    <Text
                                        style={stylesFormProposal.inputView}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {totalAmount ? totalAmount.toLocaleString() : 0}
                                    </Text>
                                </View>
                            </View>
                            <InputDefault
                                name="Content"
                                returnKeyType="next"
                                style={stylesFormProposal.input}
                                value={values?.Content}
                                label={languageKey('_proposed_purpose')}
                                placeholderInput={true}
                                isEdit={true}
                                bgColor={'#FAFAFA'}
                                labelHolder={languageKey('_enter_content')}
                                {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                            />
                            <InputDefault
                                name="Note"
                                returnKeyType="next"
                                style={stylesFormProposal.input}
                                value={values?.Note}
                                label={languageKey('_note')}
                                placeholderInput={true}
                                isEdit={true}
                                bgColor={'#FAFAFA'}
                                labelHolder={languageKey('_enter_notes')}
                                {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                            />
                            <View style={stylesFormProposal.imgBox}>
                                <Text style={stylesFormProposal.headerBoxImage}>{languageKey('_image')}</Text>
                                <AttachManyFile
                                    OID={detailCatalogue?.OID}
                                    images={images}
                                    setDataImages={setDataImages}
                                    setLinkImage={setLinkImage}
                                    dataLink={linkImage}
                                />
                            </View>
                        </View>
                    )}
                    <View style={stylesFormProposal.containerAdd}>
                        <Text style={stylesFormProposal.header}>{languageKey('_donated_goods_and_materials')}</Text>
                        <Button
                            style={stylesFormProposal.btnUploadFile}
                            onPress={() => openModalAddProducts('donated')}
                        >
                            <Text style={stylesFormProposal.txtBtnUploadFile}>{languageKey('_add')}</Text>
                        </Button>
                    </View>
                    {getRenderDataBySource('donated')?.length > 0 && (
                        <View style={[stylesDetail.cardProgram, { paddingTop: 8 }]}>
                            <FlatList
                                data={getRenderDataBySource('donated')}
                                renderItem={_renderItemGood}
                                keyExtractor={_keyExtractorGood}
                            />
                        </View>
                    )}

                    <ModalGoodsProposal
                        setValueGoods={handleSetValueGoods}
                        showModalGoods={isShowModalGoods}
                        closeModalGoods={handleCloseModalProducts}
                        factorID={detailMenu?.factorId}
                        entryID={modalSource === 'donated' ? 'RequestGifts' : 'RequestConsignment'}
                        parentOID={detailCatalogue?.OID}
                        editingItem={editingItem}
                        setEditingItem={setEditingItem}
                    />

                    <View style={stylesFormProposal.containerAdd}>
                        <Text style={stylesFormProposal.header}>{languageKey('_consignment_good_and_material')}</Text>
                        <Button
                            style={stylesFormProposal.btnUploadFile}
                            onPress={() => openModalAddProducts('consignment')}
                        >
                            <Text style={stylesFormProposal.txtBtnUploadFile}>{languageKey('_add')}</Text>
                        </Button>
                    </View>
                    {getRenderDataBySource('consignment')?.length > 0 && (
                        <View style={[stylesDetail.cardProgram, { paddingTop: 8 }]}>
                            <FlatList
                                data={getRenderDataBySource('consignment')}
                                renderItem={_renderItemGood}
                                keyExtractor={_keyExtractorGood}
                            />
                        </View>
                    )}
                </ScrollView>

                <View style={stylesFormProposal.containerFooter}>
                    <Button
                        style={stylesFormProposal.btnSave}
                        onPress={handleProposalOrther}
                    >
                        <Text style={stylesFormProposal.txtBtnSave}>{languageKey('_save')}</Text>
                    </Button>
                    <Button
                        style={stylesFormProposal.btnConfirm}
                        disabled={detailCatalogue ? false : true}
                        onPress={handleConfirm}
                    >
                        <Text style={stylesFormProposal.txtBtnConfirm}>{languageKey('_confirm')}</Text>
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

export default FormCatalogueScreen;