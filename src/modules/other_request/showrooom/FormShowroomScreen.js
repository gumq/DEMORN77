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
import { translateLang } from "@store/accLanguages/slide";
import { arrow_down_big, arrow_next_gray, close_blue, trash_22 } from "@svgImg";
import { ApiDisplayCabinets_Add, ApiDisplayCabinets_Edit, ApiDisplayCabinets_Submit, ApiDisplayMaterials_Add, ApiDisplayMaterials_Edit, ApiDisplayMaterials_Submit } from "@api";
import { Button, CardModalSelect, HeaderBack, InputDefault, ModalNotify, ModalSelectDate, NotifierAlert, RadioButton, AttachManyFile, ModalGoodsProposal, ModalGoodsProposalShowroom } from "@components";
import { fetchListCustomerByUserID } from "@store/accAuth/thunk";
import { fetchListProgramShowroom } from "@store/accOther_Proposal/thunk";

const FormShowroomScreen = ({ route }) => {
    const item = route?.params?.item;
    const editProposal = route?.params?.editProposal
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const languageKey = useSelector(translateLang);
    const { userInfo, listCustomerByUserID } = useSelector(state => state.Login);
    const { detailMenu } = useSelector(state => state.Home);
    const { listEntry } = useSelector(state => state.CusRequirement);
    const { detailShowroom, listProgramShowroom } = useSelector(state => state.OtherProposal);
    const [isShowOptionsModalCancel, setShowOptionsModalCancel] = useState(false);
    const [valueRecommendedType, setValueRecommendedType] = useState(editProposal ? listEntry?.find(item => item?.EntryID === detailShowroom?.EntryID) : null);
    const [valueProgram, setValueProgram] = useState(editProposal ? listProgramShowroom?.find(item => item?.OID === detailShowroom?.ReferenceID) : null);
    const [valueCustomer, setValueCustomer] = useState(editProposal ? listCustomerByUserID?.find(item => item?.ID === detailShowroom?.CustomerID) : null);
    const [dateStates, setDateStates] = useState({
        planDate: {
            selected: null,
            submit: null,
            visible: false,
        },
        deadlineDate: {
            selected: null,
            submit: null,
            visible: false,
        }
    });

    const [isShowModalGoods, setIsShowModalGoods] = useState(false);
    const [recommendedGood, setValueGoodRecommended] = useState(editProposal ? detailShowroom?.ListItems : []);
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
        editProposal && detailShowroom?.Link?.trim() !== ''
            ? detailShowroom.Link
            : ''
    );
    const linkImgArray = linkImage ? linkImage.split(';').filter(Boolean) : [];
    const [images, setDataImages] = useState(linkImgArray);

    const [linkImageSale, setLinkImageSale] = useState(
        editProposal && detailShowroom?.SalesLink?.trim() !== ''
            ? detailShowroom.SalesLink
            : ''
    );
    const linkImgArraySale = linkImageSale ? linkImageSale.split(';').filter(Boolean) : [];
    const [imagesSale, setDataImagesSale] = useState(linkImgArraySale);

    const dataCheckbox = [
        { id: 1, value: languageKey('_according_to_the_program'), key: 1 },
        { id: 2, value: languageKey('_outside_program'), key: 0 }
    ]

    const [isProgram, setIsProgram] = useState(editProposal && detailShowroom?.InProgram === 1 ? dataCheckbox[0] : dataCheckbox[1]);

    const [showInformation, setShowInformation] = useState({
        general: true,
        potential: false
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
        setIsShowModalGoods(true);
    };

    const handleCloseModalProducts = () => {
        setIsShowModalGoods(false);
    };

    const initialValues = {
        FactorID: detailMenu?.factorId || '',
        EntryID: "",
        ReferenceID: "",
        InProgram: 0,
        OutProgram: 0,
        EventTypeID: 0,
        RequestUserID: userInfo?.UserID || 0,
        Content: editProposal ? detailShowroom?.Content : "",
        Link: "",
        Note: editProposal ? detailShowroom?.Note : "",
        SalesCurrent: editProposal ? detailShowroom?.SalesCurrent : 0,
        SalesVolume: editProposal ? String(detailShowroom?.SalesVolume) : 0,
        SalesContent: editProposal ? detailShowroom?.SalesContent : "",
        SalesLink: "",
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

    const totalAmount = recommendedGood?.reduce((sum, good) => {
        return sum + good?.TotalAmount;
    }, 0);

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
        const linkArraySale = typeof linkImageSale === 'string' ? linkImageSale.split(';') : Array.isArray(linkImageSale) ? linkImageSale : [];
        const linkStringSale = linkArraySale.join(';');
        const body = {
            FactorID: detailMenu?.factorId || '',
            EntryID: valueRecommendedType?.EntryID || "",
            Odate: dateStates?.planDate?.submit,
            "SAPID": "string",
            "LemonID": "string",
            CustomerID: valueCustomer?.ID || 0,
            ReferenceID: valueProgram?.OID || "",
            InProgram: isProgram?.key === 1 ? 1 : 0,
            OutProgram: isProgram?.key === 1 ? 0 : 1,
            RequestUserID: String(userInfo?.UserID || 0),
            RequestDate: dateStates?.deadlineDate?.submit,
            Content: values.Content || "",
            Link: linkString || "",
            Note: values?.Note || '',
            SalesCurrent: valueCustomer?.Revenue,
            SalesVolume: Number(values?.SalesVolume),
            SalesContent: values?.SalesContent || '',
            SalesLink: linkStringSale || '',
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
            DisplayCabinetsJson: recommendedGood || [],
            OID: editProposal ? detailShowroom?.OID : ''
        }
        try {
            const result = editProposal ? await ApiDisplayCabinets_Edit(body) : await ApiDisplayCabinets_Add(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                navigation.navigate(routes.ShowroomScreen)
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
            OID: detailShowroom?.OID,
            IsLock: detailShowroom?.IsLock === 0 ? 1 : 0,
        }
        try {
            const result = await ApiDisplayCabinets_Submit(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                navigation.navigate(routes.ShowroomScreen)
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
            updateDateState('planDate', {
                selected: item.ODate,
                submit: item.ODate,
            });
            updateDateState('deadlineDate', {
                selected: item.RequestDate,
                submit: item.RequestDate,
            });
        } else {
            const now = new Date();
            updateDateState('planDate', { selected: now });
            updateDateState('deadlineDate', { selected: now });
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
        dispatch(fetchListProgramShowroom());
    }, []);

    const handleDelete = (itemToDelete) => {
        const dataGood = recommendedGood?.filter(item => item !== itemToDelete)
        setValueGoodRecommended(dataGood);
    };

    const handleEditItem = (itemToEdit) => {
        setEditingItem(itemToEdit)
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

                    {detailShowroom?.IsLock === 1 ? null :
                        <Button onPress={() => handleDelete(item)}>
                            <SvgXml xml={trash_22} />
                        </Button>
                    }
                </View>
                <View style={stylesFormProposal.bodyCard}>
                    {item?.ItemType ? (
                        <View style={stylesFormProposal.contentCard}>
                            <Text style={stylesFormProposal.txtHeaderBody}>{languageKey('_product_type')}</Text>
                            <Text style={stylesFormProposal.contentBody}>{item?.ItemType === 'GIFT' ? languageKey('_gift') : languageKey('_consignment')}</Text>
                        </View>
                    ) : null}
                    {item?.ItemQty ? (
                        <View style={stylesFormProposal.contentCard}>
                            <Text style={stylesFormProposal.txtHeaderBody}>{languageKey('_quantity')}</Text>
                            <Text style={stylesFormProposal.contentBody}>{item?.ItemQty}</Text>
                        </View>
                    ) : null}
                </View>
                <View style={stylesFormProposal.bodyCard}>
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
                    <Text style={stylesFormProposal.txtHeaderBody}>{languageKey('_note')}</Text>
                    <Text style={stylesFormProposal.contentBody}>{item?.Note}</Text>
                </View>
            </Button>
        );
    };

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
                                    value={editProposal ? detailShowroom?.OID : "Auto"}
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
                                    data={listProgramShowroom}
                                    setValue={setValueProgram}
                                    value={valueProgram?.Name}
                                    bgColor={'#FAFAFA'}
                                />
                            </View>
                            <View style={stylesFormProposal.input}>
                                <CardModalSelect
                                    title={languageKey('_customer')}
                                    data={listCustomerByUserID}
                                    setValue={setValueCustomer}
                                    value={valueCustomer?.Name}
                                    bgColor={'#FAFAFA'}
                                />
                            </View>
                            {valueCustomer ?
                                <View style={stylesFormProposal.containerReadOnly}>
                                    <Text style={stylesFormProposal.txtReadOnly}>{languageKey('_total_cost')}</Text>
                                    <Text
                                        style={stylesFormProposal.txtValueOnly}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {valueCustomer ? valueCustomer.FullAddress : ''}
                                    </Text>
                                    <Text style={stylesFormProposal.txtReadOnly}>{languageKey('_business_partner_type')}</Text>
                                    <Text
                                        style={stylesFormProposal.txtValueOnly}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {valueCustomer ? valueCustomer.PartnerTypeName : ''}
                                    </Text>
                                    <Text style={stylesFormProposal.txtReadOnly}>{languageKey('_phone')}</Text>
                                    <Text
                                        style={stylesFormProposal.txtValueOnly}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {valueCustomer ? valueCustomer.Phone : ''}
                                    </Text>
                                </View>
                                : null
                            }

                            <View style={stylesFormProposal.inputAuto}>
                                <View style={{ flex: 1, marginRight: 12 }}>
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
                                    OID={detailShowroom?.OID}
                                    images={images}
                                    setDataImages={setDataImages}
                                    setLinkImage={setLinkImage}
                                    dataLink={linkImage}
                                />
                            </View>
                        </View>
                    )}
                    <View style={stylesDetail.containerHeader}>
                        <View style={stylesFormProposal.containerRadio}>
                            <Text style={stylesDetail.header}>{languageKey('_potential_analysis')}</Text>
                        </View>
                        <Button style={stylesDetail.btnShowInfor} onPress={() => toggleInformation("potential")}>
                            <SvgXml xml={showInformation.potential ? arrow_down_big : arrow_next_gray} />
                        </Button>
                    </View>
                    {showInformation.potential && (
                        <View style={stylesFormProposal.card}>
                            <View style={[stylesFormProposal.widthInput, { marginVertical: 8 }]}>
                                <Text style={stylesFormProposal.txtHeaderInputView}>{languageKey('_current_sales')}</Text>
                                <Text
                                    style={stylesFormProposal.inputView}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {valueCustomer ? valueCustomer.Revenue : 0}
                                </Text>
                            </View>
                            <InputDefault
                                name="SalesVolume"
                                returnKeyType="next"
                                style={stylesFormProposal.input}
                                value={values?.SalesVolume}
                                label={languageKey('_traffic_volumne/minute')}
                                placeholderInput={true}
                                isEdit={true}
                                bgColor={'#FAFAFA'}
                                labelHolder={languageKey('_enter_content')}
                                keyboardType={'numeric'}
                                {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                            />
                            <InputDefault
                                name="SalesContent"
                                returnKeyType="next"
                                style={stylesFormProposal.input}
                                value={values?.SalesContent}
                                label={languageKey('_location_potential_analysis')}
                                placeholderInput={true}
                                isEdit={true}
                                bgColor={'#FAFAFA'}
                                labelHolder={languageKey('_enter_notes')}
                                {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                            />
                            <View style={stylesFormProposal.imgBox}>
                                <Text style={stylesFormProposal.headerBoxImage}>{languageKey('_image')}</Text>
                                <AttachManyFile
                                    OID={detailShowroom?.OID}
                                    images={imagesSale}
                                    setDataImages={setDataImagesSale}
                                    setLinkImage={setLinkImageSale}
                                    dataLink={linkImageSale}
                                />
                            </View>
                        </View>
                    )}
                    <View style={stylesFormProposal.containerAdd}>
                        <Text style={stylesFormProposal.header}>{languageKey('_recommended_list')}</Text>
                        <Button
                            style={stylesFormProposal.btnUploadFile}
                            onPress={() => openModalAddProducts('donated')}
                        >
                            <Text style={stylesFormProposal.txtBtnUploadFile}>{languageKey('_add')}</Text>
                        </Button>
                    </View>
                    {recommendedGood?.length > 0 ?
                        <View style={stylesFormProposal.card}>
                            <FlatList
                                data={recommendedGood}
                                renderItem={_renderItemGood}
                                keyExtractor={_keyExtractorGood}
                            />
                        </View>
                        : null
                    }
                    <ModalGoodsProposalShowroom
                        setValueGoods={setValueGoodRecommended}
                        showModalGoods={isShowModalGoods}
                        closeModalGoods={handleCloseModalProducts}
                        factorID={detailMenu?.factorId}
                        entryID={valueRecommendedType?.EntryID}
                        parentOID={detailShowroom?.OID}
                        editingItem={editingItem}
                        setEditingItem={setEditingItem}
                        customerID={valueCustomer?.ID}
                    />
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
                        disabled={detailShowroom ? false : true}
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

export default FormShowroomScreen;