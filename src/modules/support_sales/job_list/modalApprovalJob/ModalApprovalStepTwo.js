import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { stylesDetail } from "../styles";
import { translateLang } from "@store/accLanguages/slide";
import { AttachManyFile, Button, NotifierAlert, RadioButton } from "@components";
import routes from "@routes";
import { ApiTaskFuncs_Approval } from "@api";

const ModalApprovalStepTwo = ({ setShowForm, isShowInforApproval }) => {
    const languageKey = useSelector(translateLang);
    const navigation = useNavigation();
    const { detailJob } = useSelector(state => state.JobList);
    const [contentApproval, onChangeContentApproval] = useState('');
    const [linkImage, setLinkImage] = useState('');
    const [images, setDataImages] = useState([])

    const dataCheckbox = [
        { id: 1, value: languageKey('_argee'), key: 1 },
        { id: 2, value: languageKey('_refuse'), key: 0 }
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
            ReceiveLink: "",
            ReceiveContent: '',
            FinalLink: linkString || "",
            FinalDate: new Date(),
            FinalContent: contentApproval || 0,
            OwnerID: isApproval?.id === 3 ? valueUser?.UserID : 0,
            OwnerDeparment: 0,
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

    return (
        <>
            {isShowInforApproval && (
                <View style={stylesDetail.cardProgram}>
                    <Text style={stylesDetail.headerProgram}>{languageKey('_confirm_completion')}</Text>
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

export default ModalApprovalStepTwo;