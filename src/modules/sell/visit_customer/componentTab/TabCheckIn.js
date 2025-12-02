import React, { useEffect, useState } from "react";
import moment from "moment";
import { View, Text, PermissionsAndroid, Platform, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Geolocation from 'react-native-geolocation-service';

import { stylesDetail } from "../styles";
import { ApiVisitForUsers_CheckIn } from "action/Api";
import { translateLang } from "store/accLanguages/slide";
import { AttachManyFile, Button, NotifierAlert } from "components";
import { fetchDetailVisitCustomer } from "store/accVisit_Customer/thunk";
import { PERMISSIONS, RESULTS, request, check, openSettings } from 'react-native-permissions';

const TabCheckIn = ({ item }) => {
    const languageKey = useSelector(translateLang);
    const dispatch = useDispatch();
    const { detailVisitCustomer } = useSelector(state => state.VisitCustomer);
    const [isSubmit, setIsSubmit] = useState(true)
    const [linkImage, setLinkImage] = useState(
        detailVisitCustomer && detailVisitCustomer?.LinkCheckIn && detailVisitCustomer?.LinkCheckIn.trim() !== ''
            ? detailVisitCustomer?.LinkCheckIn
            : ''
    );
    const [images, setDataImages] = useState([])

    const showAlertPermission = () => {
        Alert.alert(
            'Permission Required',
            'This app needs access to your location to perform check-in.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Go to Settings', onPress: () => openSettings() },
            ]
        );
    };
    
    const requestPermissionFineLocation = () => {
        request(
            Platform.OS === 'android'
                ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
                : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        ).then(result => {
            if (result === RESULTS.GRANTED) {
                checkPermissionCoarseLocation(); 
            } else {
                showAlertPermission();
            }
        });
    };
    
    const checkPermissionFineLocation = () => {
        check(
            Platform.OS === 'android'
                ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
                : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        ).then(result => {
            switch (result) {
                case RESULTS.GRANTED:
                    checkPermissionCoarseLocation();
                    break;
                case RESULTS.UNAVAILABLE:
                case RESULTS.DENIED:
                case RESULTS.LIMITED:
                    requestPermissionFineLocation();
                    break;
                case RESULTS.BLOCKED:
                    showAlertPermission();
                    break;
            }
        });
    };
    
    const requestPermissionCoarseLocation = () => {
        request(
            Platform.OS === 'android'
                ? PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
                : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        ).then(result => {
            if (result === RESULTS.GRANTED) {
                console.log('Coarse Location permission granted');
            } else {
                showAlertPermission();
            }
        });
    };
    
    const checkPermissionCoarseLocation = () => {
        check(
            Platform.OS === 'android'
                ? PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
                : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        ).then(result => {
            switch (result) {
                case RESULTS.GRANTED:
                    console.log('Coarse Location permission already granted');
                    break;
                case RESULTS.UNAVAILABLE:
                case RESULTS.DENIED:
                case RESULTS.LIMITED:
                    requestPermissionCoarseLocation();
                    break;
                case RESULTS.BLOCKED:
                    showAlertPermission();
                    break;
            }
        });
    };

    const checkInEvent = () => {
        const linkArray = typeof linkImage === 'string' ? linkImage.split(';') : Array.isArray(linkImage) ? linkImage : [];
        const linkString = linkArray.join(';');
        Geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const currentTime = moment().toISOString();

                const body = {
                    ID: item?.ID,
                    CheckIn_Lat: latitude,
                    CheckIn_Long: longitude,
                    CheckInTime: currentTime,
                    LinkCheckIn: linkString || "",
                };

                try {
                    const response = await ApiVisitForUsers_CheckIn(body);
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
                    console.error('Check-in error:', error);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                NotifierAlert(
                    3000,
                    'Error',
                    `Geolocation error: ${error.message}`,
                    'error',
                );
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    };

    const shouldShowCheckInButton =
        item?.PlanDate &&
        moment(item.PlanDate).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY');

    const btnDisable =
        item?.PlanDate &&
        detailVisitCustomer?.CheckInTime &&
        moment(item.PlanDate).format('DD/MM/YYYY') === moment(detailVisitCustomer.CheckInTime).format('DD/MM/YYYY');

    useEffect(() => {
        const linkImg = detailVisitCustomer?.LinkCheckIn || '';
        const linkImgArray = linkImg ? linkImg.split(';').filter(Boolean) : [];
        setDataImages(linkImgArray);
    }, [detailVisitCustomer]);

    useEffect(() => {
        const checkPermissions = async () => {
            const permissionGranted = await requestLocationPermission();
            if (!permissionGranted) {
                console.error("Location permission not granted");
            }
        };
        checkPermissions();
    }, []);

    return (
        <View style={stylesDetail.cardProgram}>
            <Text style={stylesDetail.headerProgram}>{languageKey('_checkin_information')}</Text>
            <View style={stylesDetail.timeProgram}>
                <Text style={stylesDetail.txtHeaderContent}>{languageKey('_time')}</Text>
                <Text style={stylesDetail.content}>
                    {detailVisitCustomer?.CheckInTime &&
                        moment(detailVisitCustomer?.CheckInTime).format('HH:mm') !== '00:00' ? (
                        moment(detailVisitCustomer?.CheckInTime).format('HH:mm DD/MM/YYYY')
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
                        onPress={checkInEvent}
                        disabled={!shouldShowCheckInButton}
                    >
                        <Text style={stylesDetail.txtBtnConfirm}>Check in</Text>
                    </Button>
                ) : null}
            </View>
        </View>
    )
}

export default TabCheckIn;