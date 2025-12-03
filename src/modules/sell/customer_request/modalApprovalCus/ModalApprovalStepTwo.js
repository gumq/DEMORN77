import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import { stylesDetail } from "../styles";
import { translateLang } from "@store/accLanguages/slide";
import { AttachManyFile, Button, NotifierAlert } from "@components";
import { ApiCustomerRequests_Response } from "@api";
import routes from "@routes";

const ModalApprovalStepTwo = ({ setShowForm, isShowInforApproval }) => {
    const languageKey = useSelector(translateLang);
    const navigation = useNavigation();
    const { detailCusRequirement } = useSelector(state => state.CusRequirement);
    const [contentApproval, onChangeContentApproval] = useState('');
    const [linkImage, setLinkImage] = useState('');
    const [images, setDataImages] = useState([])

    const submitApproval = async () => {
        const linkArray = typeof linkImage === 'string' ? linkImage.split(';') : Array.isArray(linkImage) ? linkImage : [];
        const linkString = linkArray.join(';');
        const body = {
            OID: detailCusRequirement?.OID,
            IsCompleted: 1,
            ResponseUser: 0,
            ResponseDate: new Date(),
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
                    <Text style={stylesDetail.headerInput}>{languageKey('_response_content')}</Text>
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
                        // disable={btnDisable}
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