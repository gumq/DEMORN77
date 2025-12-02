import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { stylesDetail } from "../styles";
import { translateLang } from "store/accLanguages/slide";
import { AttachManyFile, Button, NotifierAlert, RadioButton } from "components";
import { ApiGeneralApprovals_ApprovalList } from "action/Api";
import routes from "modules/routes";

const ModalStepFive = ({ setShowForm, isShowInforApproval, initalValue }) => {
    const languageKey = useSelector(translateLang);
    const navigation = useNavigation();
    const { detailCusRequirement } = useSelector(state => state.CusRequirement);
    const [contentApproval, onChangeContentApproval] = useState('');

    const [linkImage, setLinkImage] = useState(
        detailCusRequirement && detailCusRequirement?.BusinessResponseLink && detailCusRequirement?.BusinessResponseLink.trim() !== ''
            ? detailCusRequirement?.BusinessResponseLink
            : ''
    );

    const [images, setDataImages] = useState([])

    const dataCheckbox = [
        { id: 1, value: languageKey('_argee'), key: 1 },
        { id: 2, value: languageKey('_refuse'), key: 0 }
    ]

    const [isApproval, setIsApproval] = useState(initalValue ? dataCheckbox[1] : dataCheckbox[0]);

    const submitApproval = async () => {
        const linkArray = typeof linkImage === 'string' ? linkImage.split(';') : Array.isArray(linkImage) ? linkImage : [];
        const linkString = linkArray.join(';');
        const stringObject = JSON.stringify({
            Link: linkString || ""
        });
        const body = {
            dataJson: [
                {
                    OID: detailCusRequirement?.OID,
                    FactorID: detailCusRequirement?.FactorID,
                    EntryID: detailCusRequirement?.EntryID,
                    ApprovalProcessID: detailCusRequirement?.ApprovalProcessID,
                    ApprovalStatusID: isApproval?.key,
                    ApprovalNote: contentApproval,
                    Extention1: 0,
                    Extention2: new Date().toISOString(),
                    Extention3: "",
                    Extention4: "",
                    Extention5: "",
                    StringObject: stringObject
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
                    <Text style={stylesDetail.headerProgram}>{languageKey('_feedback_results')}</Text>
                    <RadioButton
                        data={dataCheckbox}
                        setValue={setIsApproval}
                        initialValue={isApproval}
                        disable={initalValue}
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
                    <Button style={stylesDetail.btnFooter} onPress={submitApproval}>
                        <Text style={stylesDetail.txtBtnFooter}>{languageKey('_confirm')}</Text>
                    </Button>

                </View>
            )}
        </>
    )
}

export default ModalStepFive;