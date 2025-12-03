import React, { useEffect, useState } from "react";
import moment from "moment";
import { View, Text, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { stylesDetail } from "../styles";
import { ApiVisitForUsers_Business } from "@api";
import { translateLang } from "@store/accLanguages/slide";
import { AttachManyFile, Button, NotifierAlert } from "@components";
import { fetchDetailVisitCustomer } from "@store/accVisit_Customer/thunk";
import { colors } from "@themes";

const TabInforBussiness = ({ item }) => {
    const languageKey = useSelector(translateLang);
    const dispatch = useDispatch();
    const { detailVisitCustomer } = useSelector(state => state.VisitCustomer);
    const [isSubmit, setIsSubmit] = useState(true);
    const [content, onChangeContent] = useState(detailVisitCustomer?.BusinessNote || "");
    const [linkImage, setLinkImage] = useState(
        detailVisitCustomer && detailVisitCustomer?.LinkBusiness && detailVisitCustomer?.LinkBusiness.trim() !== ''
            ? detailVisitCustomer?.LinkBusiness
            : ''
    );
    const [images, setDataImages] = useState([])

    const inforBussinessEvent = async () => {
        const linkArray = typeof linkImage === 'string' ? linkImage.split(';') : Array.isArray(linkImage) ? linkImage : [];
        const linkString = linkArray.join(';');
        const body = {
            ID: item?.ID,
            BusinessNote: content || "",
            LinkBusiness: linkString || "",
        };
        try {
            const response = await ApiVisitForUsers_Business(body);
            const result = response.data;
            if (result?.StatusCode === 200 && result?.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${result?.Message}`,
                    'success',
                );
                setIsSubmit(false);
                const bodyDetail = {
                    ID: item?.ID
                }
                dispatch(fetchDetailVisitCustomer(bodyDetail))
            } else {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${result?.Message}`,
                    'error',
                );
            }
        } catch (error) {
            console.error('Thêm thông tin kinh doanh', error);
        }
    };

    const shouldShowCheckInButton =
        item?.PlanDate &&
        moment(item.PlanDate).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY');

    const btnDisable = detailVisitCustomer?.BusinessNote !== '' || detailVisitCustomer?.LinkBusiness !== ''

    useEffect(() => {
        const linkImg = detailVisitCustomer?.LinkBusiness || '';
        const linkImgArray = linkImg ? linkImg.split(';').filter(Boolean) : [];
        setDataImages(linkImgArray);
    }, [detailVisitCustomer]);

    return (
        <View style={stylesDetail.cardProgram}>
            <Text style={stylesDetail.headerProgram}>{languageKey('_business_information')}</Text>
            {!btnDisable ?
                <>
                    <Text style={stylesDetail.headerInput}>{languageKey('_content')}</Text>
                    <TextInput
                        style={stylesDetail.inputContent}
                        onChangeText={onChangeContent}
                        value={content}
                        multiline={true}
                        placeholder={languageKey('_enter_content')}
                    />
                    <View >
                        <Text style={stylesDetail.headerBoxImage}>{languageKey('_image')}</Text>
                        <AttachManyFile
                            OID={item?.OID}
                            images={images}
                            setDataImages={setDataImages}
                            setLinkImage={setLinkImage}
                            dataLink={linkImage}
                            disable={btnDisable}
                        />
                    </View>
                </>
                :
                <>
                    <View style={stylesDetail.viewContentRow}>
                        <Text style={stylesDetail.txtTitle}>{languageKey('_content')}</Text>
                        <Text style={stylesDetail.txtValue}>{detailVisitCustomer?.BusinessNote}</Text>
                    </View>
                    <View>
                        <Text style={stylesDetail.headerBoxImage}>{languageKey('_image')}</Text>
                        <AttachManyFile
                            OID={item?.OID}
                            images={images}
                            setDataImages={setDataImages}
                            setLinkImage={setLinkImage}
                            dataLink={linkImage}
                            disable={btnDisable}
                        />

                    </View>
                </>
            }
            {isSubmit && !btnDisable ? (
                <View style={stylesDetail.footer}>
                    <Button
                        style={[stylesDetail.btnConfirmCheck, { borderColor: colors.borderColor }]}
                        onPress={inforBussinessEvent}
                        disabled={!shouldShowCheckInButton}
                    >
                        <Text style={[stylesDetail.txtBtnConfirm, { color: colors.black }]}>{languageKey('_skip')}</Text>
                    </Button>
                    <Button
                        style={stylesDetail.btnConfirmCheck}
                        onPress={inforBussinessEvent}
                        disabled={!shouldShowCheckInButton}
                    >
                        <Text style={stylesDetail.txtBtnConfirm}>{languageKey('_confirm')}</Text>
                    </Button>
                </View>
            ) : null}
        </View>

    )
}

export default TabInforBussiness;