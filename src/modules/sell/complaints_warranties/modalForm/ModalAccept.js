import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { stylesDetail } from "../styles";
import { translateLang } from "store/accLanguages/slide";
import { AttachManyFile, Button, NotifierAlert, RadioButton } from "components";
import { ApiComplaints_UpdateRequest } from "action/Api";
import { fetchDetailComplaintWarranties } from "store/acc_Complaint_Warranties/thunk";

const ModalAccept = ({ setShowForm, isShow, OID }) => {
    const languageKey = useSelector(translateLang);
    const dispatch = useDispatch();
    const [contentApproval, onChangeContentApproval] = useState('');
    const [linkImage, setLinkImage] = useState('');
    const [images, setDataImages] = useState([]);

    const dataCheckbox = [
        { id: 1, value: languageKey('_argee'), key: 1 },
        { id: 2, value: languageKey('_refuse'), key: -1 },
    ]

    const [isApproval, setIsApproval] = useState(dataCheckbox[0]);

    const submitApproval = async () => {
        const linkArray = typeof linkImage === 'string' ? linkImage.split(';') : Array.isArray(linkImage) ? linkImage : [];
        const linkString = linkArray.join(';');
        const body = {
            OID: OID,
            RequestDecision: isApproval?.key || 0,
            RequestLink: linkString || "",
            RequestNote: '',
            RequestContent: contentApproval
        }
        try {
            const { data } = await ApiComplaints_UpdateRequest(body);
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
                    <Text style={stylesDetail.headerProgram}>{languageKey('_request_reception_infor')}</Text>
                    <RadioButton
                        data={dataCheckbox}
                        setValue={setIsApproval}
                        initialValue={isApproval}
                    />
                    <Text style={stylesDetail.headerInputForm}>{languageKey('_content')}</Text>
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
                    <View >
                        <Button style={stylesDetail.btnFooter} onPress={submitApproval}>
                            <Text style={stylesDetail.txtBtnFooter}>{languageKey('_confirm')}</Text>
                        </Button>
                    </View>
                </View>
            )}
        </>
    )
}

export default ModalAccept;