import React, { useEffect, useState } from "react";
import moment from "moment";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Geolocation from 'react-native-geolocation-service';

import { stylesDetail } from "../styles";
import { ApiVisitForUsers_CheckOut } from "@api";
import { translateLang } from "@store/accLanguages/slide";
import { AttachManyFile, Button, NotifierAlert } from "@components";
import { fetchDetailVisitCustomer } from "@store/accVisit_Customer/thunk";

const TabCheckOut = ({ item }) => {
    const languageKey = useSelector(translateLang);
    const dispatch = useDispatch();
    const { detailVisitCustomer } = useSelector(state => state.VisitCustomer);
    const [isSubmit, setIsSubmit] = useState(true)
    const [linkImage, setLinkImage] = useState(
        detailVisitCustomer && detailVisitCustomer?.LinkCheckOut && detailVisitCustomer?.LinkCheckOut.trim() !== ''
            ? detailVisitCustomer?.LinkCheckOut
            : ''
    );
    const [images, setDataImages] = useState([])

    const checkOutEvent = () => {
        const linkArray = typeof linkImage === 'string' ? linkImage.split(';') : Array.isArray(linkImage) ? linkImage : [];
        const linkString = linkArray.join(';');
        Geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const currentTime = moment().toISOString();

                const body = {
                    ID: item?.ID,
                    CheckOut_Lat: latitude,
                    CheckOut_Long: longitude,
                    CheckOutTime: currentTime,
                    LinkCheckOut: linkString || "",
                };

                try {
                    const response = await ApiVisitForUsers_CheckOut(body);
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
                    console.error('Check-out error:', error);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    };

    const shouldShowCheckInButton =
        item?.PlanDate &&
        moment(item.PlanDate).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY');

    const btnDisable =
        item?.PlanDate &&
        detailVisitCustomer?.CheckOutTime &&
        moment(item.PlanDate).format('DD/MM/YYYY') === moment(detailVisitCustomer.CheckOutTime).format('DD/MM/YYYY');

    useEffect(() => {
        const linkImg = detailVisitCustomer?.LinkCheckOut || '';
        const linkImgArray = linkImg ? linkImg.split(';').filter(Boolean) : [];
        setDataImages(linkImgArray);
    }, [detailVisitCustomer]);

    return (
        <View style={stylesDetail.cardProgramBottom}>
            <Text style={stylesDetail.headerProgram}>{languageKey('_checkout_information')}</Text>
            <View style={stylesDetail.timeProgram}>
                <Text style={stylesDetail.txtHeaderContent}>{languageKey('_time')}</Text>
                <Text style={stylesDetail.content}>
                    {detailVisitCustomer?.CheckOutTime &&
                        moment(detailVisitCustomer?.CheckOutTime).format('HH:mm') !== '00:00' ? (
                        moment(detailVisitCustomer?.CheckOutTime).format('HH:mm DD/MM/YYYY')
                    ) : (
                        `${languageKey('_wait_for_update')}`
                    )}
                </Text>
            </View>
            <View style={stylesDetail.timeProgram}>
                <Text style={stylesDetail.txtHeaderContent}>{languageKey('_address')}</Text>
                <Text
                    style={stylesDetail.content}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {detailVisitCustomer?.FullAddress}
                </Text>
            </View>
            <View >
                <Text style={stylesDetail.headerBoxImage}>{languageKey('_image')}</Text>
                <View style={stylesDetail.imgBox}>
                    <AttachManyFile
                        OID={item?.OID}
                        images={images}
                        setDataImages={setDataImages}
                        setLinkImage={setLinkImage}
                        dataLink={linkImage}
                        disable={btnDisable}
                    />
                </View>
                {isSubmit && !btnDisable ? (
                    <Button
                        style={stylesDetail.btnConfirm}
                        onPress={checkOutEvent}
                        disabled={!shouldShowCheckInButton}
                    >
                        <Text style={stylesDetail.txtBtnConfirm}>Check out</Text>
                    </Button>
                ) : null}

            </View>
        </View>
    )
}

export default TabCheckOut;