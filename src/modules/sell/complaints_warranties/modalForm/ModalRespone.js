import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useSelector } from "react-redux";

import { stylesDetail } from "../styles";
import { translateLang } from "store/accLanguages/slide";
import { AttachManyFile, Button, NotifierAlert } from "components";
import { ApiComplaints_UpdateResponse } from "action/Api";
import { fetchDetailComplaintWarranties } from "store/acc_Complaint_Warranties/thunk";

const ModalRespone = ({ setShowForm, isShow, OID }) => {
    const languageKey = useSelector(translateLang);
    const [contentApproval, onChangeContentApproval] = useState('');
    const [linkImage, setLinkImage] = useState('');
    const [images, setDataImages] = useState([])

    const submitApproval = async () => {
        const linkArray = typeof linkImage === 'string' ? linkImage.split(';') : Array.isArray(linkImage) ? linkImage : [];
        const linkString = linkArray.join(';');
        const body = {
            OID: OID,
            ResponseContent: contentApproval,
            ResponseNote: "",
            ResponseLink: linkString || ""
        }
        try {
            const { data } = await ApiComplaints_UpdateResponse(body);
            if (data.StatusCode === 200 && data.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${data.Message}`,
                    'success',
                );
                setShowForm(false)
                const body = { OID: OID }
                dispatch(fetchDetailComplaintWarranties(body))
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
            {isShow && (
                <View style={stylesDetail.cardProgram}>
                    <Text style={stylesDetail.headerProgramForm}>{languageKey('_feedback_results')}</Text>
                    <Text style={stylesDetail.headerInput}>{languageKey('_content')}</Text>
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
                            OID={OID}
                            images={images}
                            setDataImages={setDataImages}
                            setLinkImage={setLinkImage}
                            dataLink={linkImage}
                        />
                    </View>
                    <View>
                        <Button style={stylesDetail.btnFooter} onPress={submitApproval}>
                            <Text style={stylesDetail.txtBtnFooter}>{languageKey('_confirm')}</Text>
                        </Button>
                    </View>
                </View>
            )}
        </>
    )
}

export default ModalRespone;