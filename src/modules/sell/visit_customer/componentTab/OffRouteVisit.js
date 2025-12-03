import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, StyleSheet, Dimensions, Alert, Platform } from "react-native";

import { colors, fontSize } from "@themes";
import { hScale, scale } from "@resolutions";
import { translateLang } from "@store/accLanguages/slide";
import { InputDefault, CardModalSelect, Button, AttachManyFile, NotifierAlert } from "@components";
import { fetchListCancelReason, fetchListVisitCustomer } from "@store/accVisit_Customer/thunk";
import { ApiPlanForUsers_AddDetail, ApiVisitForUsers_OFFRoute } from "@api";

const { height } = Dimensions.get('window')

const OffRouteVisit = ({ parentID, closeModal, data }) => {
    const languageKey = useSelector(translateLang);
    const dispatch = useDispatch()
    const [valueCustomer, setValueCustomer] = useState(null);
    const { listCustomerForPlan } = useSelector(state => state.VisitCustomer);
    const [linkImage, setLinkImage] = useState('');
    const [images, setDataImages] = useState([])

    const initialValues = {
        Reason: ""
    }

    useEffect(() => {
        dispatch(fetchListCancelReason())
    }, [])

    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
    } = useFormik({
        initialValues
    });

    const handleAdd = async () => {
        const errors = [];

        if (!valueCustomer?.ID) {
            errors.push(languageKey('_please_select_reason_cancel'));
        }

        if (!values?.Reason) {
            errors.push(languageKey('_please_select_reason_cancel'));
        }

        if (errors.length > 0) {
            Alert.alert(errors[0]);
            return;
        }

        const linkArray = typeof linkImage === 'string'
            ? linkImage.split(';')
            : Array.isArray(linkImage)
                ? linkImage
                : [];

        const linkString = linkArray.join(';');
        let body = null;
        let apiFn = null;

        if (data?.Visit?.length > 0) {
            body = {
                dataJson: [
                    {
                        PlanScheduleID: data?.Visit[0]?.PlanScheduleID,
                        CustomerID: valueCustomer?.ID,
                        VisitTypeCode: "OFFRouteVisit",
                        Link: linkString || "",
                        CheckIn_Lat: 1,
                        CheckIn_Long: 1,
                        CheckInTime: "",
                        CheckOut_Lat: 1,
                        CheckOut_Long: 1,
                        CheckOutTime: "",
                        TotalTime: 0,
                        FeedBack: "",
                        Rival: "1",
                        Status: "1",
                        StationNote: "",
                        StatisticReason: values?.Reason || '',
                        Note: "",
                        Extention1: "",
                        Extention2: "",
                        Extention3: "",
                        Extention4: "",
                        Extention5: "",
                        Extention6: "",
                        Extention7: "",
                        Extention8: "",
                        Extention9: "",
                        Extention10: "",
                        ID: "1"
                    }
                ]
            };
            apiFn = ApiPlanForUsers_AddDetail;
        } else {
            body = {
                ID: 0,
                CustomerID: valueCustomer?.ID,
                Reason: values?.Reason || '',
                Link: linkString || "",
            };
            apiFn = ApiVisitForUsers_OFFRoute;
        }

        try {
            const result = await apiFn(body);
            const responseData = result.data;

            if (responseData.StatusCode === 200 && responseData.ErrorCode === '0') {
                const body = {
                    Option: 0,
                    FromDate: new Date(),
                    ToDate: new Date(),
                };
                dispatch(fetchListVisitCustomer(body));
                NotifierAlert(3000, languageKey('_notification'), responseData.Message, 'success');
                closeModal();
            } else {
                NotifierAlert(3000, languageKey('_notification'), responseData.Message, 'error');
            }
        } catch (error) {
            console.log('handleAdd error', error);
            NotifierAlert(3000, languageKey('_notification'), error.message || 'Error occurred', 'error');
        }
    };

    const filteredCustomerList = listCustomerForPlan.filter(customer => {
        return !data?.Visit?.some(visit => visit.CustomerID === customer.ID);
    });

    return (
        <View style={styles.container}>
            <View style={styles.input}>
                <CardModalSelect
                    title={languageKey('_customer')}
                    data={filteredCustomerList}
                    setValue={setValueCustomer}
                    value={valueCustomer?.Name}
                    bgColor={'#F9FAFB'}
                    require={true}
                />
            </View>
            <InputDefault
                name="Reason"
                returnKeyType="next"
                style={styles.input}
                value={values?.Reason}
                label={languageKey('_reason_for_visit')}
                isEdit={true}
                placeholderInput={true}
                labelHolder={languageKey('_enter_content')}
                bgColor={'#F9FAFB'}
                require={true}
                {...{ touched, errors, handleBlur, handleChange, setFieldValue }}
            />
            <Text style={styles.headerBoxImage}>{languageKey('_image')}</Text>
            <View style={styles.imgBox}>
                <AttachManyFile
                    OID={parentID}
                    images={images}
                    setDataImages={setDataImages}
                    setLinkImage={setLinkImage}
                    dataLink={linkImage}
                />
            </View>

            <View style={styles.footer}>
                <Button
                    style={styles.btnFooterCancel}
                    onPress={closeModal}
                >
                    <Text style={styles.txtBtnFooterCancel}>{languageKey('_cancel')}</Text>
                </Button>
                <Button
                    style={styles.btnFooterApproval}
                    onPress={handleAdd}
                >
                    <Text style={styles.txtBtnFooterApproval}>{languageKey('_add')}</Text>
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        height: height
    },
    input: {
        marginHorizontal: scale(12),
        marginVertical: scale(4),
    },
    footer: {
        flexDirection: 'row',
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    btnFooterCancel: {
        flex: 1,
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        height: hScale(38),
        borderRadius: scale(8),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(4),
         marginBottom: scale(Platform.OS === 'android' ? 0 : 16),
    },
    txtBtnFooterCancel: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    btnFooterApproval: {
        flex: 1,
        backgroundColor: colors.blue,
        height: hScale(38),
        borderRadius: scale(8),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: scale(4)
    },
    txtBtnFooterApproval: {
        color: colors.white,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22)
    },
    headerBoxImage: {
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
        color: colors.black,
        marginLeft: scale(12),
        marginTop: scale(8)
    },
    imgBox: {
        marginLeft: scale(12),
    },
})

export default OffRouteVisit;