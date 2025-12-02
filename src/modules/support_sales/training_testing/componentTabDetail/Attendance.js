import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, Platform, PermissionsAndroid, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import Geolocation from 'react-native-geolocation-service';

import { AttachManyFile, Button, NotifierAlert, RenderImage } from "components";
import { stylesAttendance } from "../styles";
import { translateLang } from "store/accLanguages/slide";
import moment from "moment";
import { ApiTrainings_CheckIn, ApiTrainings_CheckOut } from "action/Api";
import { fetchDetailTraining } from "store/accTraining_Testing/thunk";

const Attendance = () => {
    const languageKey = useSelector(translateLang);
    const dispatch = useDispatch();
    const [isVisible, setIsVisible] = useState(false);
    const [linkImage, setLinkImage] = useState('');
    const [images, setDataImages] = useState([]);
    const [valueLocation, setValueLocation] = useState("0,0");
    const [modalTitle, setModalTitle] = useState('');
    const [keyValueCheck, setKeyValueCheck] = useState(null);
    const { detailTraining } = useSelector(state => state.TrainingTesting);

    const openModal = ({ title, key }) => {
        setKeyValueCheck(key)
        setModalTitle(title);
        setIsVisible(!isVisible)
    }

    const closeModal = () => {
        setIsVisible(!isVisible)
    }

    useEffect(() => {
        const requestLocationPermission = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Location permission denied');
                    return;
                }
            }

            Geolocation.getCurrentPosition((position) => {
                if (position) {
                    let location = {
                        latitude: `${Number(position.coords.latitude).toFixed(7)}`,
                        longitude: `${Number(position.coords.longitude).toFixed(8)}`
                    }
                    setValueLocation(`${location?.longitude}, ${location?.latitude}`);
                }
            }, (error) => {
                console.log(error.code, error.message);
            }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000, },
            );
        };

        requestLocationPermission();
    }, []);

    const getDistanceFromLatLonInMeters = (lat1, lon1, lat2, lon2) => {
        const R = 6371000;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleCheckIn = async () => {
        const [currentLong, currentLat] = valueLocation.split(',').map(val => parseFloat(val.trim()));
        const scope = detailTraining?.AttendanceScope || 0;
        const targetLat = parseFloat(detailTraining?.Lat || 0);
        const targetLong = parseFloat(detailTraining?.Long || 0);

        const distance = getDistanceFromLatLonInMeters(currentLat, currentLong, targetLat, targetLong);

        if (distance > scope) {
            closeModal();
            NotifierAlert(
                3000,
                `${languageKey('_notification')}`,
                `${languageKey('_your_location')} ${Math.round(distance)}m, ${languageKey('_beyond_allowable')} (${scope}m)`,
                'error',
            );
            return;
        }

        const linkArray = typeof linkImage === 'string'
            ? linkImage.split(';')
            : Array.isArray(linkImage)
                ? linkImage.map(item => item.Link)
                : [];

        const linkString = linkArray.join(';');

        const body = {
            OID: detailTraining?.OID,
            CheckInLat: currentLat.toString(),
            CheckInLong: currentLong.toString(),
            CheckInNote: "",
            CheckInLink: linkString || ""
        };

        try {
            const result = await ApiTrainings_CheckIn(body);
            const responseData = result.data;
            if (responseData.StatusCode === 200 && responseData.ErrorCode === '0') {
                NotifierAlert(3000, `${languageKey('_notification')}`, `${responseData.Message}`, 'success');
                dispatch(fetchDetailTraining({ OID: responseData?.Result[0]?.OID }));
                closeModal();
                setDataImages([]);
            } else {
                NotifierAlert(3000, `${languageKey('_notification')}`, `${responseData.Message}`, 'error');
            }
        } catch (error) {
            console.log('handleCheckIn', error);
        }
    };


    const handleCheckIOut = async () => {
        const [currentLong, currentLat] = valueLocation.split(',').map(val => parseFloat(val.trim()));
        const scope = detailTraining?.AttendanceScope || 0;
        const targetLat = parseFloat(detailTraining?.Lat || 0);
        const targetLong = parseFloat(detailTraining?.Long || 0);

        const distance = getDistanceFromLatLonInMeters(currentLat, currentLong, targetLat, targetLong);

        if (distance > scope) {
            NotifierAlert(
                3000,
                `${languageKey('_notification')}`,
                `Vị trí của bạn đang cách ${Math.round(distance)}m, vượt quá phạm vi cho phép (${scope}m)`,
                'error',
            );
            return;
        }

        const linkArray = typeof linkImage === 'string'
            ? linkImage.split(';')
            : Array.isArray(linkImage)
                ? linkImage.map(item => item.Link)
                : [];

        const linkString = linkArray.join(';');

        const body = {
            OID: detailTraining?.OID,
            CheckOutLat: currentLat.toString(),
            CheckOutLong: currentLong.toString(),
            CheckOutNote: "",
            CheckOutLink: linkString || ""
        };

        try {
            const result = await ApiTrainings_CheckOut(body);
            const responseData = result.data;
            if (responseData.StatusCode === 200 && responseData.ErrorCode === '0') {
                NotifierAlert(3000, `${languageKey('_notification')}`, `${responseData.Message}`, 'success');
                dispatch(fetchDetailTraining({ OID: responseData?.Result[0]?.OID }));
                closeModal();
                setDataImages([]);
            } else {
                NotifierAlert(3000, `${languageKey('_notification')}`, `${responseData.Message}`, 'error');
            }
        } catch (error) {
            console.log('handleCheckIOut', error);
        }
    };


    const _keyExtractor = (item, index) => `${item.OID}-${index}`;
    const _renderItem = ({ item }) => {
        const linkImgArrayCheckIn = item?.CheckInLink.split(';').filter(Boolean)
        const linkImgArrayCheckOut = item?.CheckOutLink.split(';').filter(Boolean)

        return (
            <View style={stylesAttendance.cardProgram}>
                <Text style={stylesAttendance.headerProgram}>{languageKey('_checkin_information')}</Text>
                <View style={stylesAttendance.timeProgram}>
                    <Text style={stylesAttendance.txtHeaderTime}>{languageKey('_time')}</Text>
                    <Text style={stylesAttendance.contentTime}>{moment(item?.CheckInTime).format('HH:mm DD/MM/YYYY')}</Text>
                </View>
                <View style={stylesAttendance.timeProgram}>
                    <Text style={stylesAttendance.txtHeaderTime}>{languageKey('_address')}</Text>
                    <Text style={stylesAttendance.contentTime}>{item?.TrainingLocation}</Text>
                </View>
                {linkImgArrayCheckIn.length > 0 && (
                    <View style={stylesAttendance.containerTableFileItem}>
                        <Text style={stylesAttendance.txtHeaderBody}>{languageKey('_image')}</Text>
                        <RenderImage urls={linkImgArrayCheckIn} />
                    </View>
                )}
                <View style={stylesAttendance.line} />
                {item?.CheckOutLat != 0 ?
                    <>

                        <Text style={stylesAttendance.headerProgram}>{languageKey('_checkout_information')}</Text>
                        <View style={stylesAttendance.timeProgram}>
                            <Text style={stylesAttendance.txtHeaderTime}>{languageKey('_time')}</Text>
                            <Text style={stylesAttendance.contentTime}>{moment(item?.CheckOutTime).format('HH:mm DD/MM/YYYY')}</Text>
                        </View>
                        <View style={stylesAttendance.timeProgram}>
                            <Text style={stylesAttendance.txtHeaderTime}>{languageKey('_address')}</Text>
                            <Text style={stylesAttendance.contentTime}>{item?.TrainingLocation}</Text>
                        </View>
                        {linkImgArrayCheckOut.length > 0 && (
                            <View style={stylesAttendance.containerTableFileItem}>
                                <Text style={stylesAttendance.txtHeaderBody}>{languageKey('_image')}</Text>
                                <RenderImage urls={linkImgArrayCheckOut} />
                            </View>
                        )}
                    </>
                    :
                    <Button style={stylesAttendance.btnCheck} onPress={() => openModal({ title: 'Check out', key: 1 })}>
                        <Text style={stylesAttendance.txtBtnCheck}>Check out</Text>
                    </Button>
                }

            </View>
        );
    };

    const attendances = detailTraining?.Attendances || [];
    const requiredSessions = detailTraining?.RequiredNumberSessions || 0;

    const lastAttendance = attendances[attendances.length - 1] || null;

    const hasCompletedLastSession = lastAttendance
        ? lastAttendance.CheckInLat !== 0 && lastAttendance.CheckOutLat !== 0
        : true;

    const canCheckIn = attendances.length < requiredSessions && hasCompletedLastSession;

    return (
        <View style={stylesAttendance.container}>
            {detailTraining?.Attendances?.length > 0 ?
                <FlatList
                    data={detailTraining?.Attendances}
                    renderItem={_renderItem}
                    keyExtractor={_keyExtractor}
                    style={stylesAttendance.scrollView}
                />
                : null
            }
            {canCheckIn && (
                <View style={stylesAttendance.containerAttendance}>
                    <Text style={stylesAttendance.headerProgram}>
                        {languageKey('_attendance_information')}
                    </Text>
                    <Button style={stylesAttendance.btnCheck} onPress={() => openModal({ title: 'Check in', key: 0 })}>
                        <Text style={stylesAttendance.txtBtnCheck}>Check in</Text>
                    </Button>
                </View>
            )}

            <Modal
                isVisible={isVisible}
                useNativeDriver={true}
                onBackdropPress={closeModal}
                onBackButtonPress={closeModal}
                backdropTransitionOutTiming={450}
                avoidKeyboard={true}
                style={stylesAttendance.modal}>
                <View style={stylesAttendance.headerModal}>
                    <Text style={stylesAttendance.titleModal}>{modalTitle}</Text>
                </View>
                <View style={stylesAttendance.modalContainer}>
                    <View style={stylesAttendance.inputRead}>
                        <Text style={stylesAttendance.txtHeaderInputView}>{languageKey('_time')}</Text>
                        <Text
                            style={stylesAttendance.inputView}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {moment(new Date).format('HH:mm DD/MM/YYYY')}
                        </Text>
                    </View>
                    <View style={stylesAttendance.inputRead}>
                        <Text style={stylesAttendance.txtHeaderInputView}>{languageKey('_address')}</Text>
                        <Text
                            style={stylesAttendance.inputView}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {detailTraining?.TrainingLocation}
                        </Text>
                    </View>
                    <View style={stylesAttendance.imgBox}>
                        <Text style={stylesAttendance.headerBoxImage}>{languageKey('_image')}</Text>
                        <AttachManyFile
                            OID={detailTraining?.OID}
                            images={images}
                            setDataImages={setDataImages}
                            setImageArray={setLinkImage}
                        />
                    </View>
                </View>
                <View style={stylesAttendance.footer}>
                    <Button
                        style={stylesAttendance.btnFooterCancel}
                        onPress={closeModal}
                    >
                        <Text style={stylesAttendance.txtBtnFooterCancel}>{languageKey('_cancel')}</Text>
                    </Button>
                    <Button
                        style={stylesAttendance.btnFooterApproval}
                        onPress={keyValueCheck === 0 ? handleCheckIn : handleCheckIOut}
                    >
                        <Text style={stylesAttendance.txtBtnFooterApproval}>{languageKey('_confirm')}</Text>
                    </Button>
                </View>
            </Modal>
        </View>
    )
}

export default Attendance;