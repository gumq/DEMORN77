import React, { useEffect, useMemo, useState } from "react";
import _ from 'lodash';
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, ScrollView, Text } from "react-native";

import { stylesDetail } from './styles';
import { HeaderBack, LoadingModal, RenderImage } from "@components";
import { translateLang } from "@store/accLanguages/slide";
import { ModalApprovalStepOne, ModalApprovalStepTwo } from "./modalApprovalJob";
import { fetchDetailJob } from "@store/accJob_List/thunk";

const DetailJobListScreen = ({ route, item }) => {
    const itemData = item || route?.params?.item;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang);
    const { userInfo } = useSelector(state => state.Login);
    const { isSubmitting, detailJob } = useSelector(state => state.JobList);
    const [showFormStepOne, setShowFormStepOne] = useState(false);
    const [showFormStepTwo, setShowFormStepTwo] = useState(false);
    const linkImgArray = useMemo(() => {
        return detailJob?.CustomerLink
            ? detailJob.CustomerLink.split(';').filter(Boolean)
            : [];
    }, [detailJob?.CustomerLink]);

    useEffect(() => {
        const body = { OID: itemData?.OID }
        dispatch(fetchDetailJob(body))
    }, [itemData])

    const itemLinksStepOne = useMemo(() => {
        return detailJob?.ReceiveLink
            ? detailJob.ReceiveLink.split(';').filter(Boolean)
            : [];
    }, [detailJob?.ReceiveLink]);

    const itemLinksStepTwo = useMemo(() => {
        return detailJob?.FinalLink
            ? detailJob.FinalLink.split(';').filter(Boolean)
            : [];
    }, [detailJob?.FinalLink]);


    useEffect(() => {
        const appliedToArray = detailJob?.ResponsibleEmployeeID;
        const isPermission = appliedToArray === userInfo?.UserID;
        const isStatus = detailJob?.Status === 0 || detailJob?.Status === 1;
        const canEdit = isPermission && isStatus;

        setShowFormStepOne(canEdit && detailJob?.ReceiveStatus === 0 || detailJob?.ReceiveStatus === 3);

        setShowFormStepTwo(
            canEdit &&
            detailJob?.ReceiveStatus > 0 &&
            detailJob?.ReceiveStatus < 3
        );
    }, [detailJob, userInfo]);

    return (
        <LinearGradient style={stylesDetail.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView style={stylesDetail.container}>
                <HeaderBack
                    title={languageKey('_job_details')}
                    onPress={() => navigation.goBack()}
                />
                <ScrollView
                    style={stylesDetail.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={stylesDetail.footerScroll}
                >
                    <View style={stylesDetail.cardProgram}>
                        <Text style={stylesDetail.headerProgram}>{languageKey('_requested_information')}</Text>
                        <View style={stylesDetail.bodyCard}>
                            <View style={stylesDetail.containerGeneralInfor} >
                                <View style={stylesDetail.containerBody}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_ct_code')}</Text>
                                    <Text style={stylesDetail.contentBody}>{itemData?.OID}</Text>
                                </View>
                                <View style={stylesDetail.containerBody}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_ct_day')}</Text>
                                    <Text style={stylesDetail.contentBody}>{moment(itemData?.ODate).format('DD/MM/YYYY')}</Text>
                                </View>
                            </View>
                            {itemData?.CustomerRequestTypeName ?
                                <View style={stylesDetail.containerBody}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_type_of_request')}</Text>
                                    <Text style={stylesDetail.contentBody}>{itemData?.CustomerRequestTypeName}</Text>
                                </View>
                                : null
                            }
                            {itemData?.CustomerName ?
                                <View style={stylesDetail.containerBody}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_customer')}</Text>
                                    <Text
                                        style={stylesDetail.contentBody}
                                        numberOfLines={3}
                                        ellipsizeMode="tail"
                                    >
                                        {itemData?.CustomerName}
                                    </Text>
                                </View>
                                : null
                            }
                            {itemData?.CustomerContent ?
                                <View style={stylesDetail.containerBody}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_request_content')}</Text>
                                    <Text style={stylesDetail.contentBody}>{itemData?.CustomerContent}</Text>
                                </View>
                                : null
                            }
                            {itemData?.OwnerNote ?
                                <View style={stylesDetail.containerBody}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_note')}</Text>
                                    <Text style={stylesDetail.contentBody}>{itemData?.OwnerNote}</Text>
                                </View>
                                : null
                            }
                        </View>
                        {linkImgArray.length > 0 && (
                            <View style={stylesDetail.containerImage}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_image')}</Text>
                                <RenderImage urls={linkImgArray} />
                            </View>
                        )}
                        <View style={stylesDetail.line} />
                        <Text style={stylesDetail.headerProgram}>{languageKey('_job_creator_information')}</Text>
                        <View style={stylesDetail.bodyCard}>

                            <View style={stylesDetail.containerBody}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_job_creator')}</Text>
                                <Text style={stylesDetail.contentBody}>{detailJob?.CreateUserFullName} - {detailJob?.CreateUserDepartmentName}</Text>
                            </View>

                            <View style={stylesDetail.containerBody}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_job_creation_date')}</Text>
                                <Text style={stylesDetail.contentBody}>{moment(detailJob?.CreateDate).format('HH:mm DD/MM/YYYY')}</Text>
                            </View>
                            {detailJob?.CreateUserNote ?
                                <View style={stylesDetail.containerBody}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_request_content')}</Text>
                                    <Text style={stylesDetail.contentBody}>{detailJob?.CreateUserNote}</Text>
                                </View>
                                : null
                            }
                        </View>

                        {detailJob?.OwnerDeparment !== 0 ?
                            <>
                                <View style={stylesDetail.line} />
                                <Text style={stylesDetail.headerProgram}>{languageKey('_processing_forwarding_information')}</Text>
                                <View style={stylesDetail.bodyCard}>
                                    <View style={stylesDetail.containerBody}>
                                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_trainsitioner')}</Text>
                                        <Text style={stylesDetail.contentBody}>{detailJob?.TransferName} - {detailJob?.TransferDepartmentName}</Text>
                                    </View>
                                    <View style={stylesDetail.containerBody}>
                                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_officer_in_charge')}</Text>
                                        <Text style={stylesDetail.contentBody}>{detailJob?.OwnerName} - {detailJob?.OwnerDeparmentName}</Text>
                                    </View>
                                    <View style={stylesDetail.containerBody}>
                                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_processing_time_limit')}</Text>
                                        <Text style={stylesDetail.contentBody}>{moment(detailJob?.OwnerDeadline).format('DD/MM/YYYY')}</Text>
                                    </View>
                                    {detailJob?.TransferNote ?
                                        <View style={stylesDetail.containerBody}>
                                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_request_content')}</Text>
                                            <Text style={stylesDetail.contentBody}>{detailJob?.TransferNote}</Text>
                                        </View>
                                        : null
                                    }
                                </View>
                                {itemLinksStepOne.length > 0 && (
                                    <View style={stylesDetail.containerImage}>
                                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_image')}</Text>
                                        <RenderImage urls={itemLinksStepOne} />
                                    </View>
                                )}
                            </>
                            : null
                        }
                    </View>
                    {showFormStepOne && (
                        <ModalApprovalStepOne
                            isShowInforApproval={showFormStepOne}
                            setShowForm={setShowFormStepOne}
                        />
                    )}
                    {detailJob?.ReceiveStatus !== 0 && detailJob?.ReceiveStatus !== 3 && (
                        <View style={stylesDetail.cardProgram}>
                            <Text style={stylesDetail.headerProgram}>{languageKey('_feedback_from_department')}</Text>
                            <View style={stylesDetail.containerInfor}>
                                <View style={stylesDetail.containerInforForm}>
                                    <View style={stylesDetail.containerBody}>
                                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_status')}</Text>
                                        <Text style={stylesDetail.contentBody}>{detailJob?.ReceiveStatus === 1 ? languageKey('_argee') : languageKey('_refuse')}</Text>
                                    </View>
                                    <View style={stylesDetail.containerBody}>
                                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_time')}</Text>
                                        <Text style={stylesDetail.contentBody}>{moment(detailJob?.ReceiveDate).format('HH:mm DD/MM/YYYY')}</Text>
                                    </View>
                                </View>
                                <View style={stylesDetail.containerBody}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_reception_content')}</Text>
                                    <Text style={stylesDetail.contentBody}>{detailJob?.ReceiveContent}</Text>
                                </View>
                            </View>
                            {itemLinksStepOne.length > 0 && (
                                <View style={stylesDetail.containerImage}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_image')}</Text>
                                    <RenderImage urls={itemLinksStepOne} />
                                </View>
                            )}
                        </View>
                    )}

                    {showFormStepTwo && (
                        <ModalApprovalStepTwo
                            isShowInforApproval={showFormStepTwo}
                            setShowForm={setShowFormStepTwo}
                        />
                    )}
                    {detailJob?.FinalContent !== "" && (
                        <View style={stylesDetail.cardProgram}>
                            <Text style={stylesDetail.headerProgram}>{languageKey('_confirm_completion')}</Text>
                            <View style={stylesDetail.containerInfor}>
                                <View style={stylesDetail.containerBody}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_reception_content')}</Text>
                                    <Text style={stylesDetail.contentBody}>{detailJob?.FinalContent}</Text>
                                </View>
                            </View>
                            {itemLinksStepTwo.length > 0 && (
                                <View style={stylesDetail.containerImage}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_image')}</Text>
                                    <RenderImage urls={itemLinksStepTwo} />
                                </View>
                            )}
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    )
}

export default DetailJobListScreen;