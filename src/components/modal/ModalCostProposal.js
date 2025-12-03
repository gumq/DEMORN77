import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Modal from 'react-native-modal';
import { useSelector } from "react-redux";
import { View, Text, StyleSheet, Dimensions, ScrollView} from "react-native";

import { Button } from "../buttons";
import { colors, fontSize } from "@themes";
import { hScale, scale } from "@resolutions";
import { translateLang } from "@store/accLanguages/slide";
import { InputDefault, CardModalSelect, AttachManyFile } from "@components";

const { height } = Dimensions.get('window');
const ModalCostProposal = ({
    setValueCostProposal,
    openModal,
    closeModal,
    editCost,
    parentID
}) => {
    const languageKey = useSelector(translateLang);
    const { listExpenseType } = useSelector(state => state.CostProposal);
    const [selectedExpenseType, setSelectedExpenseType] = useState();
    const [filesForm, setFilesForm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [linkImage, setLinkImage] = useState('');
    const [images, setDataImages] = useState([]);

    const initialValues = {
        ReferenceID: "",
        Note: "",
        Link: "",
        IsActive: 1,
        ID: 0,
        CostTypeID: 0,
        Amount: 0,
        Note: "",
        ODate: new Date(),
        "Extention1": "",
        "Extention2": "",
        "Extention3": "",
        "Extention4": "",
        "Extention5": "",
        "Extention6": "",
        "Extention7": "",
        "Extention8": "",
        "Extention9": ""
    };

    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        resetForm,
    } = useFormik({
        initialValues,
    });

    const handleUpdateCosts = () => {
        if (!selectedItem) return;

        const linkArray = typeof linkImage === 'string' ? linkImage.split(';') : Array.isArray(linkImage) ? linkImage : [];
        const linkString = linkArray.join(';');

        const updatedItem = {
            ...selectedItem,
            Amount: values?.Amount || 0,
            Note: values?.Note || '',
            Link: linkString || '',
            CostTypeID: selectedExpenseType?.ID || 0,
        };
        setValueCostProposal(prevCosts =>
            prevCosts.map(cost => (cost.ID === selectedItem.ID ? updatedItem : cost))
        );

        setSelectedItem(null);
        resetForm();
        setFilesForm('')
        closeModal();
    };

    const handleAddNewCosts = () => {
        const linkArray = typeof linkImage === 'string'
            ? linkImage.split(';')
            : Array.isArray(linkImage)
                ? linkImage
                : [];

        const linkString = linkArray.join(';');

        const updatedCost = {
            ...editCost, 
            ReferenceID: "",
            Note: values?.Note || '',
            Link: linkString || "",
            IsActive: 1,
            ID: editCost?.ID || 0,
            CostTypeID: selectedExpenseType?.ID || 0,
            Amount: values?.Amount || 0,
            Extention1: "",
            Extention2: "",
            Extention3: "",
            Extention4: "",
            Extention5: "",
            Extention6: "",
            Extention7: "",
            Extention8: "",
            Extention9: ""
        };

        if (editCost) {
            setValueCostProposal(prev =>
                prev.map(item => item.ID === editCost.ID ? updatedCost : item)
            );
        } else {
            setValueCostProposal(prev => [...prev, updatedCost]);
        }

        setFilesForm('');
        setSelectedExpenseType(null);
        resetForm();
        closeModal();
    };


    useEffect(() => {
        if (editCost) {
            setFieldValue("Amount", editCost.Amount);
            setFieldValue("Note", editCost.Note);
            setSelectedExpenseType(listExpenseType.find(expenseType => expenseType.ID === editCost.CostTypeID));
            setFilesForm(editCost.Link);
        }
    }, [editCost]);

    return (
        <View>
            {openModal && (
                <Modal
                    isVisible={openModal}
                    useNativeDriver={true}
                    onBackdropPress={closeModal}
                    onBackButtonPress={closeModal}
                    backdropTransitionOutTiming={450}
                    avoidKeyboard={true}
                    style={styles.modal}>
                    <View style={styles.optionsModalContainer}>
                        <View style={styles.headerModal}>
                            <Text style={styles.titleModal}>{languageKey('_add_new_costs')}</Text>
                        </View>
                        <ScrollView style={styles.modalContainer} showsVerticalScrollIndicator={false}>
                            <View style={styles.input}>
                                <CardModalSelect
                                    title={languageKey('_expense_type')}
                                    data={listExpenseType}
                                    setValue={setSelectedExpenseType}
                                    value={selectedExpenseType?.Name}
                                    bgColor={'#F9FAFB'}
                                />
                            </View>
                            <InputDefault
                                name="Amount"
                                returnKeyType="next"
                                style={styles.input}
                                value={String(values?.Amount)}
                                label={languageKey('_amount')}
                                isEdit={true}
                                placeholderInput={true}
                                labelHolder={languageKey('_enter_content')}
                                bgColor={'#F9FAFB'}
                                {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                            />
                            <InputDefault
                                name="Note"
                                returnKeyType="next"
                                style={styles.input}
                                value={values?.Note}
                                label={languageKey('_explain')}
                                isEdit={true}
                                placeholderInput={true}
                                labelHolder={languageKey('_enter_content')}
                                bgColor={'#F9FAFB'}
                                {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
                            />

                            <Text style={styles.headerBoxImage}>{languageKey('_image')}</Text>
                            <View style={styles.imgBox}>
                                <AttachManyFile
                                    OID={parentID}
                                    images={images}
                                    setDataImages={setDataImages}
                                    setLinkImage={setLinkImage}
                                    dataLink={linkImage}
                                />
                            </View>
                            <View style={styles.footer}>
                                <Button style={styles.btnFooterCancel} onPress={closeModal}>
                                    <Text style={styles.txtBtnFooterCancel}>{languageKey('_cancel')}</Text>
                                </Button>
                                {selectedItem ?
                                    <Button style={styles.btnFooterSave} onPress={handleUpdateCosts}>
                                        <Text style={styles.txtBtnFooterSave}>{languageKey('_save')}</Text>
                                    </Button>
                                    :
                                    <Button style={styles.btnFooterApproval} onPress={handleAddNewCosts}>
                                        <Text style={styles.txtBtnFooterApproval}>{languageKey('_confirm')}</Text>
                                    </Button>
                                }
                            </View>
                        </ScrollView>
                    </View>
                </Modal>
            )}
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
        height: height / 1.5,
    },
    modalContainer: {
        overflow: 'hidden',
        backgroundColor: colors.white,
        maxHeight: height / 1.5
    },
    headerModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: scale(1),
        borderBottomColor: colors.graySystem2,
        backgroundColor: colors.white,
        borderTopLeftRadius: scale(8),
        borderTopRightRadius: scale(8),
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
        backgroundColor: '#F9F9FB',
        borderBottomWidth: scale(1),
        borderBottomColor: colors.borderColor
    },
    txtItem: {
        fontFamily: 'Inter-Regular',
        fontWeight: '400',
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        color: colors.black,
        marginLeft: scale(3)
    },
    txtDescription: {
        fontFamily: 'Inter-Regular',
        fontWeight: '400',
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        color: '#6B6F80',
    },
    input: {
        marginHorizontal: scale(12),
        marginVertical: scale(4),
    },
    cardProgram: {
        backgroundColor: colors.white,
        marginHorizontal: scale(12),
        borderRadius: scale(8),
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        marginTop: scale(8)
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
        padding: scale(8)
    },
    optionsModal: {
        margin: 0,
        justifyContent: 'flex-end',
        borderTopRightRadius: scale(8),
        borderTopLeftRadius: scale(8)
    },
    optionsModalContainer: {
        backgroundColor: colors.white,
        height: 'auto',
        borderTopRightRadius: scale(12),
        borderTopLeftRadius: scale(12)
    },
    contentContainer: {
        height: 'auto',
    },
    containerFile: {
        // padding: scale(8),
    },
    tableWrapper: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        borderRadius: scale(8),
        overflow: 'hidden',
        marginTop: scale(8)
    },
    containerFileUpload: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: scale(12)
    },
    txtHeaderFile: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Medium',
        lineHeight: scale(22),
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
    btnFooterSave: {
        flex: 1,
        backgroundColor: colors.green,
        height: hScale(38),
        borderRadius: scale(8),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: scale(4)
    },
    txtBtnFooterSave: {
        color: colors.white,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    containerContentCard: {
        flexDirection: 'row',
        alignContent: 'center',
        paddingHorizontal: scale(8)
    },
    bodyCard: {
        paddingBottom: scale(8)
    },
    containerFlatlist: {
        paddingBottom: scale(100),
        backgroundColor: colors.white,
        marginTop: scale(4)
    },
    contentTime: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    headerBoxImage: {
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        color: colors.black,
        marginLeft: scale(12),
        marginTop: scale(8)
    },
    imgBox: {
        marginLeft: scale(12),
    },
})

export default ModalCostProposal;