import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { stylesDetail } from "../styles";
import { translateLang } from "@store/accLanguages/slide";
import { AttachManyFile, Button, CardModalSelect, NotifierAlert, RadioButton } from "@components";
import { ApiTaskFuncs_Approval } from "@api";
import routes from "@routes";
import { fetchListUser } from "@store/accApproval_Signature/thunk";
import { fetchListDepartment } from "@store/accCus_Requirement/thunk";

const ModalApprovalStepOne = ({ setShowForm, isShowInforApproval }) => {
    const languageKey = useSelector(translateLang);
    const navigation = useNavigation();
    const dispatch = useDispatch();
      const {userInfo} = useSelector(state => state.Login);
    const { detailJob } = useSelector(state => state.JobList);
    const { listUser } = useSelector(state => state.ApprovalProcess);
    const { listDepartment } = useSelector(state => state.CusRequirement);
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

    const dataCheckbox = [
        { id: 1, value: languageKey('_argee'), key: 1 },
        { id: 2, value: languageKey('_refuse'), key: -1 },
        { id: 3, value: languageKey('_forward'), key: 0 }
    ]

    const [isApproval, setIsApproval] = useState(dataCheckbox[0]);

    const submitApproval = async () => {
        const linkArray = typeof linkImage === 'string' ? linkImage.split(';') : Array.isArray(linkImage) ? linkImage : [];
        const linkString = linkArray.join(';');
        const body = {
            FactorID: detailJob?.FactorID,
            EntryID: detailJob?.EntryID,
            OID: detailJob?.OID,
            ReceiveStatus: isApproval?.key || 0,
            ReceiveLink: linkString || "",
            ReceiveContent: contentApproval,
            FinalLink: "",
            FinalDate: new Date(),
            FinalContent: "",
            OwnerID: isApproval?.id === 3 ? valueUser?.UserID : 0,
            OwnerDeparment: valueDepartment?.ID,
        }
        try {
            const { data } = await ApiTaskFuncs_Approval(body);
            if (data.StatusCode === 200 && data.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${data.Message}`,
                    'success',
                );
                setShowForm(false)
                navigation.navigate(routes.JobListScreen)
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

    useEffect(() => {
       dispatch(fetchListUser({CmpnID: userInfo?.CmpnID}));
        dispatch(fetchListDepartment())
    }, [])

    return (
        <>
            {isShowInforApproval && (
                <View style={stylesDetail.cardProgram}>
                    <Text style={stylesDetail.headerProgram}>{languageKey('_feedback_from_department')}</Text>
                    <RadioButton
                        data={dataCheckbox}
                        setValue={setIsApproval}
                        initialValue={isApproval}
                    />
                    {isApproval.id === 3 ?
                        <>
                            <View style={stylesDetail.inputForm}>
                                <CardModalSelect
                                    title={languageKey('_forwarding_department')}
                                    data={department}
                                    setValue={setValueDepartMent}
                                    value={valueDepartment?.Name}
                                    bgColor={'#FAFAFA'}
                                />
                            </View>
                            <View style={stylesDetail.inputForm}>
                                <CardModalSelect
                                    title={languageKey('_officer_in_charge')}
                                    data={listUserByDepartment}
                                    setValue={setValueUser}
                                    value={valueUser?.UserFullName}
                                    bgColor={'#FAFAFA'}
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
                        </>
                        :
                        <>
                            <Text style={stylesDetail.headerInput}>{languageKey('_confirmation_content')}</Text>
                            <TextInput
                                style={stylesDetail.inputContent}
                                onChangeText={onChangeContentApproval}
                                value={contentApproval}
                                numberOfLines={4}
                                multiline={true}
                                placeholder={languageKey('_enter_content')}
                            />

                        </>
                    }
                    <Text style={stylesDetail.headerBoxImage}>{languageKey('_image')}</Text>
                    <View style={stylesDetail.imgBox}>
                        <AttachManyFile
                            OID={detailJob?.OID}
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