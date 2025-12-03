import React, { useState } from "react";
import { View, Text, TextInput, } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { stylesDetail } from "../styles";
import { useSelector } from "react-redux";
import routes from "@routes";
import { translateLang } from "@store/accLanguages/slide";
import { AttachManyFile, Button, NotifierAlert, RadioButton } from "@components";
import { ApiGeneralApprovals_ApprovalList } from "@api";

const ModalStepTwo = ({ isShowInforApproval, setShowForm }) => {
    const languageKey = useSelector(translateLang);
    const navigation = useNavigation();
    const [contentApproval, onChangeContentApproval] = useState('');
    const { detailHandOverDoc } = useSelector(state => state.HandOverDoc);
    const [linkImage, setLinkImage] = useState('');
    const [images, setDataImages] = useState([])

    const dataCheckbox = [
        { id: 1, value: languageKey('_argee'), key: 1 },
        { id: 2, value: languageKey('_refuse'), key: 0 }
    ]

    const [isApproval, setIsApproval] = useState(dataCheckbox[0]);

    const submitApproval = async () => {
        const stringObject = JSON.stringify({
            Link: linkImage || "",
        });
        const body = {
            dataJson: [
                {
                    OID: detailHandOverDoc?.OID,
                    FactorID: detailHandOverDoc?.FactorID,
                    EntryID: detailHandOverDoc?.EntryID,
                    ApprovalProcessID: detailHandOverDoc?.ApprovalProcessID,
                    ApprovalStatusID: isApproval?.key,
                    ApprovalNote: contentApproval,
                    Extention1: 0,
                    Extention2: new Date().toISOString(),
                    Extention3: "",
                    Extention4: "",
                    Extention5: "",
                    StringObject: stringObject,
                }
            ]
        }
        try {
            const { data } = await ApiGeneralApprovals_ApprovalList(body);
            if (data.StatusCode === 200 && data.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${data.Message}`,
                    'success',
                );
                setShowForm(false)
                navigation.navigate(routes.HandOverDocumentScreen)
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
                    <Text style={stylesDetail.headerProgram}>{languageKey('_confirmed_delivery_to_customer')}</Text>
                    <RadioButton
                        initialValue={isApproval}
                        data={dataCheckbox}
                        setValue={setIsApproval}
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
                            OID={detailHandOverDoc?.OID}
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

export default ModalStepTwo;