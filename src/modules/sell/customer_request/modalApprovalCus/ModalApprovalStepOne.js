import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { stylesDetail } from "../styles";
import { translateLang } from "@store/accLanguages/slide";
import { AttachManyFile, Button, CardModalSelect, ModalSelectDate, NotifierAlert } from "@components";
import { ApiCustomerRequests_Response } from "@api";
import routes from "@routes";

const ModalApprovalStepOne = ({ setShowForm, isShowInforApproval }) => {
    const languageKey = useSelector(translateLang);
    const navigation = useNavigation();
    const { listUserByUserID } = useSelector(state => state.Login);
    const { detailCusRequirement } = useSelector(state => state.CusRequirement);
    const [contentApproval, onChangeContentApproval] = useState('');
    // const listUserResponsible = listUserByUserID.filter(user => Number(user.DepartmentID) === valueDepartment?.ID)
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
            OID: detailCusRequirement?.OID,
            IsCompleted: 0,
            ResponseUser: valueUser?.UserID || 0,
            ResponseDate: dateStates?.requestDate.submit,
            Note: contentApproval,
            Link: linkString || ""
        }
        try {
            const { data } = await ApiCustomerRequests_Response(body);
            if (data.StatusCode === 200 && data.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${data.Message}`,
                    'success',
                );
                setShowForm(false)
                navigation.navigate(routes.OrderRequestScreen)
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
                    <Text style={stylesDetail.headerProgram}>{languageKey('_feedback_from_department')}</Text>
                    <View style={stylesDetail.inputForm}>
                        <CardModalSelect
                            title={languageKey('_officer_in_charge')}
                            data={listUserByUserID}
                            setValue={setValueUser}
                            value={valueUser?.UserFullName}
                            bgColor={'#FAFAFA'}
                        />
                    </View>
                    <View style={stylesDetail.inputForm}>
                        <ModalSelectDate
                            mode={true}
                            title={languageKey('_time')}
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

export default ModalApprovalStepOne;