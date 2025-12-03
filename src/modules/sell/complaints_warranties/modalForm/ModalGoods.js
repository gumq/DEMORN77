import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from "react-redux";
import { SvgXml } from "react-native-svg";
import { View, Text, StyleSheet, ScrollView, Dimensions, FlatList } from "react-native";
import { colors, fontSize } from "@themes";
import { hScale, scale } from "@resolutions";
import { translateLang } from "@store/accLanguages/slide";
import { CardModalSelect, Button, ModalSelectDate, InputDefault, AttachManyFile } from "@components";
import { close_red, close_white, trash_22 } from "@svgImg";
import ModalErrorProduct from "./ModalErrorProduct";
import { fetchListDepartment } from "@store/accCus_Requirement/thunk";

const { height } = Dimensions.get('window');

const ModalGoods = ({
    setValue,
    dataEdit,
    showModal,
    closeModal,
    OID,
    itemEditGood,
    isLock
}) => {
    const languageKey = useSelector(translateLang);
    const dispatch = useDispatch();
    const { listItemBySO, listProductError } = useSelector(state => state.ComplaintWarranties);
    const { listDepartment } = useSelector(state => state.CusRequirement);
    const department = listDepartment?.filter(item => item?.Extention4 === "1")
    const [listErrorProduct, setListErrorProduct] = useState([]);
    const [selectedValueItem, setSelectedValueItem] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(department?.filter(depar => depar.Code === 'CSKH')[0]);
    const [isShowModalCore, setIsShowModalCore] = useState(false);
    const [linkImage, setLinkImage] = useState('');
    const [images, setDataImages] = useState([]);
    const [itemEdit, setItemEdit] = useState(null);
    const [dateStates, setDateStates] = useState({
        requestFromDate: {
            selected: null,
            submit: null,
            visible: false,
        },
        requestToDate: {
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

    const initialValues = {
        ID: 0,
        ItemID: 0,
        Name: '',
        RecordUnit: 0,
        ErrorType: 0,
        ErrorDepartmentID: 0,
        ErrorDepartmentName: '',
        FaultValue: 0,
        ErrorDescription: '',
        ErrorQuantity: 0,
        OrderedQuantity: 0,
        ItemErrorDescription: "",
        ForwardDeptID: 0,
        RequestFromDate: new Date(),
        RequestToDate: new Date(),
        Link: "",
        ItemListErrors: "",
        ListErrors: []
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

    const showModalCore = () => {
        setIsShowModalCore(true);
    };

    const closeModalCore = () => {
        setIsShowModalCore(false);
    };

    const handleAddNewProduct = () => {
        const isEditing = !!itemEditGood;

        const linkArray = typeof linkImage === 'string'
            ? linkImage.split(';')
            : Array.isArray(linkImage)
                ? linkImage
                : [];

        const linkString = linkArray.join(';');

        const product = {
            ID: itemEditGood?.ID || 0,
            ItemID: selectedValueItem?.ItemID || itemEditGood?.ItemID || 0,
            Name: selectedValueItem?.Name || itemEditGood?.Name || '',
            RecordUnit: 0,
            ErrorType: 0,
            ErrorDepartmentID: selectedDepartment?.ID || itemEditGood?.ErrorDepartmentID || 0,
            ErrorDepartmentName: selectedDepartment?.Name || itemEditGood?.ErrorDepartmentName || '',
            FaultValue: 0,
            ErrorDescription: values?.ErrorDescription || itemEditGood?.ErrorDescription || '',
            ErrorQuantity: 0,
            OrderedQuantity: 0,
            ItemErrorDescription: "",
            ForwardDeptID: 0,
            RequestFromDate: dateStates?.requestFromDate?.submit || itemEditGood?.RequestFromDate,
            RequestToDate: dateStates?.requestToDate?.submit || itemEditGood?.RequestToDate,
            Link: linkString || itemEditGood?.Link || "",
            ItemListErrors: "",
            ListErrors: listErrorProduct || itemEditGood?.ListErrors || [],
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
        };

        setValue(prevProduct => {
            if (isEditing) {
                return prevProduct.map(p =>
                    p.ID === itemEditGood.ID ? product : p
                );
            } else {
                return [...prevProduct, product];
            }
        });

        setItemEdit(null);
        setSelectedValueItem(null);
        setListErrorProduct([]);
        setSelectedDepartment(null);
        setDateStates({
            requestFromDate: {
                selected: new Date(),
                submit: new Date(),
                visible: false,
            },
            requestToDate: {
                selected: new Date(),
                submit: new Date(),
                visible: false,
            },
        });
        setDataImages([]);
        setLinkImage('');
        resetForm();
        closeModal();
    };

    useEffect(() => {
        if (itemEditGood) {
            setFieldValue("ErrorDescription", itemEditGood?.ErrorDescription || "");
            setDateStates({
                requestFromDate: {
                    selected: itemEditGood?.RequestFromDate
                },
                requestToDate: {
                    selected: itemEditGood?.RequestToDate
                }
            })
            const good = listItemBySO?.find(item => item?.ItemID === itemEditGood?.ItemID)
            setSelectedValueItem(good);
            const departmentError = listDepartment?.find(item => item?.ID === itemEditGood?.ErrorDepartmentID)
            setSelectedDepartment(departmentError);
            const linkArray = itemEditGood?.Link?.split(';')
            setDataImages(linkArray)
            const listError = JSON.parse(itemEditGood?.ItemListErrors)
            setListErrorProduct(listError)
        }
    }, [itemEditGood]);

    useEffect(() => {
        if (dataEdit && dataEdit.length > 0) {
            setValue(prev => {
                if (prev.length === 0) {
                    const convertedData = dataEdit.map(item => ({
                        ID: item?.ID || 0,
                        ItemID: item?.ItemID || 0,
                        Name: item?.Name || '',
                        RecordUnit: item?.RecordUnit || 0,
                        ErrorType: item?.ErrorType || 0,
                        ErrorDepartmentID: item?.ID || 0,
                        ErrorDepartmentName: item?.ErrorDepartmentName || '',
                        FaultValue: item?.FaultValue || 0,
                        ErrorDescription: item?.ErrorDescription || '',
                        ErrorQuantity: item?.ErrorQuantity || 0,
                        OrderedQuantity: item?.OrderedQuantity || 0,
                        ItemErrorDescription: item?.ItemErrorDescription || "",
                        ForwardDeptID: item?.ForwardDeptID,
                        RequestFromDate: item?.RequestFromDate,
                        RequestToDate: item?.RequestToDate,
                        Link: item?.Link,
                        ItemListErrors: item?.ItemListErrors,
                        ListErrors: item?.ListErrors || [],
                        "Extention1": item?.Extention1 || '',
                        "Extention2": item?.Extention2 || '',
                        "Extention3": item?.Extention3 || '',
                        "Extention4": item?.Extention4 || '',
                        "Extention5": item?.Extention5 || '',
                        "Extention6": item?.Extention6 || '',
                        "Extention7": item?.Extention7 || '',
                        "Extention8": item?.Extention8 || '',
                        "Extention9": item?.Extention9 || '',
                        "Extention10": item?.Extention10 || '',
                    }));
                    return convertedData;
                }
                return prev;
            });
        }
    }, [dataEdit]);

    const handleDelete = (item) => {
        setListErrorProduct(listErrorProduct?.filter(error => error?.ErrorId !== item?.ErrorId))
    }

    const handleEditGood = (errorEdit) => {
        setItemEdit(errorEdit)
        setIsShowModalCore(true)
    };

    const _keyExtractor = (item, index) => `${item.ErrorId}-${index}`;
    const _renderItem = ({ item }) => {
        const errorName = listProductError?.find(err => err?.ID === item?.ErrorId)?.Name;
        return (
            <Button style={styles.cardProgram} onPress={() => handleEditGood(item)}>
                <View style={styles.row}>
                    <Text style={styles.headerProgram}>{errorName}</Text>
                    {isLock ? null :
                        <Button onPress={() => handleDelete(item)}>
                            <SvgXml xml={trash_22} />
                        </Button>
                    }
                </View>
                <Text style={styles.txtDescription}>{item?.CausalDetails}</Text>
                <View style={styles.containerBodyCard}>
                    <View style={styles.bodyCard}>
                        <View style={styles.row}>
                            <View style={styles.contentCard}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_core_details')}</Text>
                                <Text style={styles.contentBody}>{item.ErrorDetails}</Text>
                            </View>
                            <View style={styles.contentCard}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_quantity_returned')}</Text>
                                <Text style={styles.contentBody}>{item.ReturnQuantity}</Text>
                            </View>
                        </View>
                        <View style={styles.contentCard}>
                            <Text style={styles.txtHeaderBody}>{languageKey('_quantiy_of_goods_in_customers_warehouse')}</Text>
                            <Text style={styles.contentBody}>{item.QtyCustomer}</Text>
                        </View>
                        <View style={styles.contentCard}>
                            <Text style={styles.txtHeaderBody}>{languageKey('_number_of_goods_in_stock')}</Text>
                            <Text style={styles.contentBody}>{item.QtyCompany}</Text>
                        </View>
                    </View>
                </View>
            </Button>
        );
    };

    useEffect(() => {
        dispatch(fetchListDepartment())
    }, [])

    return (
        <View>
            {showModal && (
                <View >
                    <Modal
                        isVisible={showModal}
                        useNativeDriver={true}
                        onBackdropPress={closeModalCore}
                        onBackButtonPress={closeModalCore}
                        backdropTransitionOutTiming={450}
                        avoidKeyboard={true}
                        style={styles.modal}>
                        <View style={styles.optionsModalContainer}>
                            <View style={styles.headerModal}>
                                <View style={styles.btnClose} >
                                    <SvgXml xml={close_white} />
                                </View>
                                <Text style={styles.titleModal}>{languageKey('_add_products')}</Text>
                                <Button onPress={closeModal} style={styles.btnClose} >
                                    <SvgXml xml={close_red} />
                                </Button>
                            </View>
                            <ScrollView style={styles.modalContainer} showsVerticalScrollIndicator={false}>
                                <View style={styles.input}>
                                    <CardModalSelect
                                        title={languageKey('_product')}
                                        data={listItemBySO}
                                        setValue={setSelectedValueItem}
                                        value={selectedValueItem?.Name}
                                        bgColor={'#F9FAFB'}
                                        disabled={isLock}
                                    />
                                </View>
                                <View style={styles.line} />
                                <View style={styles.containerAdd}>
                                    <Text style={styles.header}>{languageKey('_product_core')}</Text>
                                    <Button style={styles.btnUploadItem} onPress={showModalCore} disabled={isLock} >
                                        <Text style={styles.txtBtnUploadItem}>{languageKey('_add')}</Text>
                                    </Button>
                                </View>
                                {listErrorProduct?.length > 0 ?
                                    <View style={styles.card}>
                                        <FlatList
                                            data={listErrorProduct}
                                            renderItem={_renderItem}
                                            keyExtractor={_keyExtractor}
                                        />
                                    </View>
                                    : null
                                }
                                <View style={styles.line} />
                                <InputDefault
                                    name="ErrorDescription"
                                    returnKeyType="next"
                                    style={styles.input}
                                    value={values?.ErrorDescription}
                                    label={languageKey('_describle_reason')}
                                    isEdit={isLock ? false : true}
                                    placeholderInput={true}
                                    labelHolder={languageKey('_enter_a_detaied_description')}
                                    bgColor={'#F9FAFB'}
                                    {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                                />
                                <View style={styles.input}>
                                    <CardModalSelect
                                        title={languageKey('_forwarding_department')}
                                        data={department}
                                        setValue={setSelectedDepartment}
                                        value={selectedDepartment?.Name}
                                        bgColor={'#F9FAFB'}
                                        disabled={isLock}
                                    />
                                </View>
                                <View style={{ width: '100%' }}>
                                    <ModalSelectDate
                                        title={languageKey('_request_from_date')}
                                        showDatePicker={() => updateDateState('requestFromDate', { visible: true })}
                                        hideDatePicker={() => updateDateState('requestFromDate', { visible: false })}
                                        initialValue={dateStates.requestFromDate.selected}
                                        selectedValueSelected={(val) => updateDateState('requestFromDate', { selected: val })}
                                        isDatePickerVisible={dateStates.requestFromDate.visible}
                                        selectSubmitForm={(val) => updateDateState('requestFromDate', { submit: val })}
                                        bgColor={'#FAFAFA'}
                                        minimumDate={new Date()}
                                        disabled={isLock}
                                    />
                                </View>
                                <View style={{ width: '100%', marginTop: scale(8) }}>
                                    <ModalSelectDate
                                        title={languageKey('_request_from_date')}
                                        showDatePicker={() => updateDateState('requestToDate', { visible: true })}
                                        hideDatePicker={() => updateDateState('requestToDate', { visible: false })}
                                        initialValue={dateStates.requestToDate.selected}
                                        selectedValueSelected={(val) => updateDateState('requestToDate', { selected: val })}
                                        isDatePickerVisible={dateStates.requestToDate.visible}
                                        selectSubmitForm={(val) => updateDateState('requestToDate', { submit: val })}
                                        bgColor={'#FAFAFA'}
                                        minimumDate={new Date()}
                                        disabled={isLock}
                                    />
                                </View>
                                <Text style={styles.headerBoxImage}>{languageKey('_image')}</Text>
                                <View style={styles.imgBox}>
                                    <AttachManyFile
                                        OID={OID}
                                        images={images}
                                        setDataImages={setDataImages}
                                        setLinkImage={setLinkImage}
                                        dataLink={linkImage}
                                        disable={isLock}
                                    />
                                </View>
                                <ModalErrorProduct
                                    setValue={setListErrorProduct}
                                    showModal={isShowModalCore}
                                    closeModal={closeModalCore}
                                    OID={OID}
                                    itemEdit={itemEdit}
                                    dataEdit={listErrorProduct}
                                    isLock={isLock}
                                />

                            </ScrollView>
                            <View style={styles.footer}>
                                <Button style={styles.btnFooterCancel} onPress={closeModal}>
                                    <Text style={styles.txtBtnFooterCancel}>{languageKey('_cancel')}</Text>
                                </Button>
                                <Button style={styles.btnFooterApproval} onPress={handleAddNewProduct} disabled={isLock}>
                                    <Text style={styles.txtBtnFooterApproval}>{languageKey('_add')}</Text>
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
    header: {
        fontSize: fontSize.size16,
        fontWeight: '600',
        lineHeight: scale(24),
        fontFamily: 'Inter-SemiBold',
        color: colors.black,
        marginHorizontal: scale(8)
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    optionsModalContainer: {
        height: height / 1.3,
    },
    modalContainer: {
        overflow: 'hidden',
        backgroundColor: colors.white,
        maxHeight: height / 1.3,
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    txtDescription: {
        fontFamily: 'Inter-Regular',
        fontWeight: '400',
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        color: '#525252',
    },
    input: {
        marginHorizontal: scale(12),
        marginVertical: scale(4),
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
    contentBody: {
        fontSize: fontSize.size14,
        fontWeight: '400',
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        color: colors.black,
        overflow: 'hidden',
        width: '90%'
    },
    containerBody: {
        flexDirection: 'row',
        marginHorizontal: scale(8),
        alignItems: 'center',
        marginBottom: scale(4)
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
        flex: 1
    },
    txtHeaderBody: {
        color: '#525252',
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
    },
    containerAdd: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: scale(12)
    },
    btnUploadItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: scale(6),
        borderWidth: scale(1),
        borderColor: colors.blue,
        width: 'auto',
    },
    txtBtnUploadItem: {
        color: colors.blue,
        fontSize: fontSize.size12,
        fontWeight: '400',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        marginLeft: scale(4),
        paddingHorizontal:scale(4)
    },
    line: {
        borderWidth: scale(0.5),
        borderColor: colors.borderColor,
        marginVertical: scale(16),
        marginHorizontal: scale(12)
    },
    headerBoxImage: {
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        color: colors.black,
        marginLeft: scale(12),
        marginTop: scale(8),
    },
    imgBox: {
        marginLeft: scale(12)
    }
})

export default ModalGoods;