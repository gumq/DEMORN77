import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import routes from "modules/routes";
import { translateLang } from "store/accLanguages/slide";
import { stylesDetail, stylesFormOrderRequest } from "../styles";
import { fetchDetailCusRequirement } from "store/accCus_Requirement/thunk";
import { ApiCustomerRequests_Edit, ApiCustomerRequests_Submit } from "action/Api";
import { AttachManyFile, Button, CardModalSelect, ModalSelectDate, NotifierAlert } from "components";

const ModalApprovalEdit = ({ isShowInforApproval }) => {
    const languageKey = useSelector(translateLang);
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const { listUserByUserID } = useSelector(state => state.Login);
    const { detailCusRequirement, listDepartment } = useSelector(state => state.CusRequirement);
    const [contentApproval, onChangeContentApproval] = useState('');
    const [valueDepartment, setValueDepartMent] = useState(null);
    const listUserResponsible = listUserByUserID.filter(user => Number(user.DepartmentID) === valueDepartment?.ID)
    const [valueUser, setValueUser] = useState(null);
    const [dateStates, setDateStates] = useState({
        requestDate: {
            selected: null,
            submit: null,
            visible: false,
        },
    });
    const [linkImage, setLinkImage] = useState('');
    const [images, setDataImages] = useState([])

    const updateDateState = (key, newValues) => {
        setDateStates(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                ...newValues,
            },
        }));
    };

    const submitApproval = async () => {
        const linkArray = typeof linkImage === 'string' ? linkImage.split(';') : Array.isArray(linkImage) ? linkImage : [];
        const linkString = linkArray.join(';');
        const body = {
            FactorID: "CustomerRequest",
            EntryID: detailCusRequirement?.EntryID,
            OID: detailCusRequirement?.OID,
            ODate: detailCusRequirement?.ODate,
            CustomerID: detailCusRequirement?.CustomerID || 0,
            GoodsTypeID: detailCusRequirement?.GoodsTypeID || 0,
            ItemID: detailCusRequirement?.ItemID || 0,
            Quantity: detailCusRequirement?.Quantity || 0,
            CustomerRequest: detailCusRequirement?.CustomerRequest || "",
            BusinessRequest: detailCusRequirement?.BusinessRequest || "",
            CustomerRequestTypeID: detailCusRequirement?.CustomerRequestTypeID || 0,
            TransferDepartmentID: valueDepartment?.ID || 0,
            ResponsibleEmployeeID: valueUser?.UserID || 0,
            RequestDueDate: dateStates?.requestDate.submit,
            IsCustomer: 0,
            RequestLink: detailCusRequirement?.RequestLink || "",
            ItemName: detailCusRequirement?.ItemName || '',
            Note: detailCusRequirement?.Note || "",
            TransferNote: contentApproval,
            TransferLink: linkString || '',
        }
        try {
            const result = await ApiCustomerRequests_Edit(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                const bodyDetail = { OID: responeData?.Result[0]?.OID }
                dispatch(fetchDetailCusRequirement(bodyDetail))
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
    }

    const handleConfirm = async () => {
        const body = {
            OID: detailCusRequirement?.OID,
            IsLock: detailCusRequirement?.IsLock === 0 ? 1 : 0,
        }
        try {
            const result = await ApiCustomerRequests_Submit(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                navigation.navigate(routes.OrderRequestScreen)
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
    };

    return (
        <>
            {isShowInforApproval && (
                <View style={stylesDetail.cardProgram}>
                    <Text style={stylesDetail.headerProgram}>{languageKey('_processing_forwarding_information')}</Text>
                    <View style={stylesFormOrderRequest.inputForm}>
                        <CardModalSelect
                            title={languageKey('_forwarding_department')}
                            data={listDepartment}
                            setValue={setValueDepartMent}
                            value={valueDepartment?.Name}
                            bgColor={'#FAFAFA'}
                        />
                    </View>
                    <View style={stylesFormOrderRequest.inputForm}>
                        <CardModalSelect
                            title={languageKey('_officer_in_charge')}
                            data={listUserResponsible}
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
                    <View style={stylesFormOrderRequest.containerFooterForm}>
                        <Button style={stylesFormOrderRequest.btnSave} onPress={submitApproval}>
                            <Text style={stylesFormOrderRequest.txtBtnSave}>{languageKey('_save')}</Text>
                        </Button>
                        <Button style={stylesFormOrderRequest.btnConfirm} onPress={handleConfirm}>
                            <Text style={stylesFormOrderRequest.txtBtnConfirm}>{languageKey('_confirm')}</Text>
                        </Button>
                    </View>
                </View>
            )}

        </>
    )
}

export default ModalApprovalEdit;