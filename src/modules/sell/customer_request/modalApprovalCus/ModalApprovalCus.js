import React, { useMemo, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { stylesDetail, stylesFormOrderRequest } from "../styles";
import { translateLang } from "@store/accLanguages/slide";
import { AttachManyFile, Button, CardModalSelect, ModalSelectDate, NotifierAlert, RadioButton } from "@components";
import { ApiCustomerRequests_Submit } from "@api";
import routes from "@routes";

const ModalApprovalCus = ({ setShowForm, isShowInforApproval }) => {
    const languageKey = useSelector(translateLang);
    const navigation = useNavigation();
    const { listUser } = useSelector(state => state.ApprovalProcess);
    const { detailCusRequirement, listDepartment } = useSelector(state => state.CusRequirement);
    const [contentApproval, onChangeContentApproval] = useState('');
    const [linkImage, setLinkImage] = useState('');
    const [images, setDataImages] = useState([]);
    const [contentTransfer, onChangeContentTransfer] = useState('');
    const department = listDepartment?.filter(item => item?.Extention4 === "1")
    const [valueDepartment, setValueDepartMent] = useState(null);
    const listUserByDepartment = useMemo(() => {
        return listUser
            ? listUser.filter(user => Number(user?.DepartmentID) === valueDepartment?.ID)
            : [];
    }, [listUser, valueDepartment]);

    const [valueUser, setValueUser] = useState(null);
    const [dateStates, setDateStates] = useState({
        requestDate: {
            selected: null,
            submit: null,
            visible: false,
        },
    });
    const [linkImageTransfer, setLinkImageTransfer] = useState('');
    const [imagesTransfer, setDataImagesTransfer] = useState([])

    const updateDateState = (key, newValues) => {
        setDateStates(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                ...newValues,
            },
        }));
    };

    const dataCheckbox = [
        { id: 1, value: languageKey('_reception'), key: 0 },
        { id: 2, value: languageKey('_refuse'), key: 1 }
    ]

    const [isApproval, setIsApproval] = useState(dataCheckbox[0]);

    const submitApproval = async () => {
        const linkArray = typeof linkImage === 'string' ? linkImage.split(';') : Array.isArray(linkImage) ? linkImage : [];
        const linkString = linkArray.join(';');
        const linkArrayTransfer = typeof linkImageTransfer === 'string' ? linkImageTransfer.split(';') : Array.isArray(linkImageTransfer) ? linkImageTransfer : [];
        const linkStringTransfer = linkArrayTransfer.join(';');
        const body = {
            OID: detailCusRequirement?.OID,
            IsRejected: isApproval?.key || 0,
            IsLock: 1,
            ConfirmNote: contentApproval,
            ConfirmLink: linkString || '',
            TransferDepartmentID: valueDepartment?.ID || 0,
            ResponsibleEmployeeID: valueUser?.UserID || 0,
            RequestDueDate: dateStates.requestDate.submit,
            TransferNote: contentTransfer,
            TransferLink: linkStringTransfer || ""
        }
        try {
            const { data } = await ApiCustomerRequests_Submit(body);
            if (data.StatusCode === 200 && data.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${data.Message}`,
                    'success',
                );
                setShowForm(false)
                navigation.navigate(routes.CustomerRequirementScreen)
            } else {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${data.Message}`,
                    'error',
                );
            }
        } catch (error) {
            console.log('ApprovalList', error);
        }
    }

    return (
        <>
            {isShowInforApproval && (
                <View style={stylesDetail.cardProgram}>
                    <Text style={stylesDetail.headerProgram}>{languageKey('_customer_reception_information')}</Text>
                    <RadioButton
                        data={dataCheckbox}
                        setValue={setIsApproval}
                        initialValue={isApproval}
                    />
                    <Text style={stylesDetail.headerInput}>{languageKey('_confirmation_content')}</Text>
                    <TextInput
                        style={stylesDetail.inputContent}
                        onChangeText={onChangeContentApproval}
                        value={contentApproval}
                        numberOfLines={4}
                        multiline={true}
                        placeholder={languageKey('_enter_content')}
                    />
                    <Text style={stylesDetail.headerBoxImage}>{languageKey('_image')}</Text>
                    <View style={stylesDetail.imgBox}>
                        <AttachManyFile
                            OID={detailCusRequirement?.OID}
                            images={images}
                            setDataImages={setDataImages}
                            setLinkImage={setLinkImage}
                            dataLink={linkImage}
                        />
                    </View>
                    {isApproval?.key === 0 ?
                        <>
                            <View style={stylesDetail.line} />
                            <Text style={stylesDetail.headerProgram}>{languageKey('_processing_forwarding_information')}</Text>
                            <View style={stylesFormOrderRequest.inputForm}>
                                <CardModalSelect
                                    title={languageKey('_forwarding_department')}
                                    data={department}
                                    setValue={setValueDepartMent}
                                    value={valueDepartment?.Name}
                                    bgColor={'#FAFAFA'}
                                />
                            </View>
                            <View style={stylesFormOrderRequest.inputForm}>
                                <CardModalSelect
                                    title={languageKey('_officer_in_charge')}
                                    data={listUserByDepartment}
                                    setValue={setValueUser}
                                    value={valueUser?.UserFullName}
                                    bgColor={'#FAFAFA'}
                                />
                            </View>
                            <View style={stylesFormOrderRequest.inputForm}>
                                <ModalSelectDate
                                    title={languageKey('_processing_time_limit')}
                                    showDatePicker={() => updateDateState('requestDate', { visible: true })}
                                    hideDatePicker={() => updateDateState('requestDate', { visible: false })}
                                    initialValue={dateStates.requestDate.selected}
                                    selectedValueSelected={(val) => updateDateState('requestDate', { selected: val })}
                                    isDatePickerVisible={dateStates.requestDate.visible}
                                    selectSubmitForm={(val) => updateDateState('requestDate', { submit: val })}
                                    bgColor={'#FAFAFA'}
                                    minimumDate={new Date()}
                                    margin={true}
                                />
                            </View>
                            <Text style={stylesDetail.headerInput}>{languageKey('_confirmation_content')}</Text>
                            <TextInput
                                style={stylesDetail.inputContent}
                                onChangeText={onChangeContentTransfer}
                                value={contentTransfer}
                                numberOfLines={4}
                                multiline={true}
                                placeholder={languageKey('_enter_content')}
                            />
                            <Text style={stylesDetail.headerBoxImage}>{languageKey('_image')}</Text>
                            <View style={stylesDetail.imgBox}>
                                <AttachManyFile
                                    OID={detailCusRequirement?.OID}
                                    images={imagesTransfer}
                                    setDataImages={setDataImagesTransfer}
                                    setLinkImage={setLinkImageTransfer}
                                    dataLink={linkImage}
                                />
                            </View>
                        </>
                        : null
                    }

                    <View style={stylesDetail.containerFooter}>
                        <Button style={stylesDetail.btnFooter} onPress={submitApproval}>
                            <Text style={stylesDetail.txtBtnFooter}>{languageKey('_confirm')}</Text>
                        </Button>
                    </View>
                </View>
            )}
        </>
    )
}

export default ModalApprovalCus;