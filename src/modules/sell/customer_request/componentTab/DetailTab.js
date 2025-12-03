import React, { useEffect, useMemo, useState } from "react";
import _ from 'lodash';
import moment from "moment";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { View, Text } from 'react-native';

import routes from "@routes";
import { stylesDetail } from "../styles";
import { Button, NotifierAlert, RenderImage } from "@components";
import DynamicGeneralInfo from "./DynamicGeneralInfo";
import { translateLang } from "@store/accLanguages/slide";
import { ModalStepFive, ModalStepThree, ModalStepTwo } from "../modalApproval";
import { ApiCustomerRequests_Delete, ApiCustomerRequests_Submit } from "@api";

const DetailTab = ({ detailCusRequirement, itemData }) => {
    const languageKey = useSelector(translateLang);
    const navigation = useNavigation();
    const { userInfo } = useSelector(state => state.Login);
    const linkImgArray = useMemo(() => {
        return detailCusRequirement?.RequestLink
            ? detailCusRequirement.RequestLink.split(';').filter(Boolean)
            : [];
    }, [detailCusRequirement?.RequestLink]);

    const getLatestStepData = (step) => {
        if (!detailCusRequirement?.Progress || detailCusRequirement.Progress.length === 0) return null;

        const lastResetIndex = detailCusRequirement.Progress.findIndex(
            (item) => item.ApprovalStep === 0
        );

        const validProgress = lastResetIndex !== -1
            ? detailCusRequirement.Progress.slice(0, lastResetIndex)
            : detailCusRequirement.Progress;

        const stepData = validProgress.find(
            (item) => item.Step === step
        );

        return stepData || null;
    };

    const inforApprovalsStepTwo = getLatestStepData(2);
    const inforApprovalsStepThree = getLatestStepData(3);
    const inforResponse = getLatestStepData(6);

    const [showFormStepTwo, setShowFormStepTwo] = useState(false);
    const [showFormStepThree, setShowFormStepThree] = useState(false);
    const [showFormResponse, setShowFormResponse] = useState(false);

    const itemLinksStepTwo = useMemo(() => {
        return detailCusRequirement?.FactoryLink
            ? detailCusRequirement.FactoryLink.split(';').filter(Boolean)
            : [];
    }, [detailCusRequirement?.FactoryLink]);

    const itemLinksStepThree = useMemo(() => {
        return detailCusRequirement?.PlanningLink
            ? detailCusRequirement.PlanningLink.split(';').filter(Boolean)
            : [];
    }, [detailCusRequirement?.PlanningLink]);

    const itemLinksStepFive = useMemo(() => {
        return detailCusRequirement?.BusinessResponseLink
            ? detailCusRequirement.BusinessResponseLink.split(';').filter(Boolean)
            : [];
    }, [detailCusRequirement?.BusinessResponseLink]);

    const handleDelete = async () => {
        try {
            const body = {
                OID: itemData?.OID,
            };

            const result = await ApiCustomerRequests_Delete(body);
            const data = result.data;
            if (data.StatusCode === 200 && data.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${data.Message}`,
                    'success',
                );
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
            console.log(error);
        }
    };

    const handleConfirm = _.debounce(async () => {
        const body = {
            OID: detailCusRequirement?.OID,
            IsLock: detailCusRequirement?.IsLock === 0 ? 1 : 0,
            IsRejected: 0
        }
        try {
            const result = await ApiCustomerRequests_Submit(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                navigation.navigate(routes.CustomerRequirementScreen)
            } else {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'error',
                );
            }
        } catch (error) {
            console.log('handleConfirm', error);
        }
    }, 2000, { leading: true, trailing: false });

    const handleReject = _.debounce(async () => {
        const body = {
            OID: detailCusRequirement?.OID,
            IsLock: 0,
            IsRejected: 1
        }
        try {
            const result = await ApiCustomerRequests_Submit(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                navigation.navigate(routes.CustomerRequirementScreen)
            } else {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'error',
                );
            }
        } catch (error) {
            console.log('handleConfirm', error);
        }
    }, 2000, { leading: true, trailing: false });

    useEffect(() => {
        const currentStep = detailCusRequirement?.Step;
        const appliedToArray = detailCusRequirement?.AppliedToID?.split(",").map(Number);
        const isPermission = appliedToArray?.includes(userInfo?.UserID);
        const isUnlocked = detailCusRequirement?.IsLock !== 0;

        const canEdit = isPermission && isUnlocked;

        setShowFormStepTwo(currentStep === 2 && canEdit);
        setShowFormStepThree(currentStep === 3 && canEdit)
        setShowFormResponse(currentStep === 6 && canEdit);
    }, [detailCusRequirement, userInfo]);

    return (
        <View style={stylesDetail.container}>
            <View style={stylesDetail.cardProgram}>
                <View style={stylesDetail.containerHeader}>
                    <Text style={stylesDetail.headerProgram}>{languageKey('_information_general')}</Text>
                    <View style={[stylesDetail.bodyStatus, { backgroundColor: detailCusRequirement?.ApprovalStatusColor }]}>
                        <Text style={[stylesDetail.txtStatus, { color: detailCusRequirement?.ApprovalStatusTextColor }]}>
                            {detailCusRequirement?.ApprovalStatusName}
                        </Text>
                    </View>
                </View>
                <View style={stylesDetail.bodyCard}>
                    {detailCusRequirement?.EntryName ?
                        <View style={stylesDetail.containerBodyCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_function')}</Text>
                            <Text style={stylesDetail.contentBody}>{detailCusRequirement?.EntryName}</Text>
                        </View>
                        : null
                    }
                    <View style={stylesDetail.containerGeneralInfor}>
                        <View style={[stylesDetail.containerBodyCard, { flex: 1 }]}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_ct_code')}</Text>
                            <Text style={stylesDetail.contentBody}>{detailCusRequirement?.OID}</Text>
                        </View>
                        <View style={[stylesDetail.containerBodyCard, { flex: 1 }]}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_ct_day')}</Text>
                            <Text style={stylesDetail.contentBody}>{moment(detailCusRequirement?.ODate).format('DD/MM/YYYY')}</Text>
                        </View>
                    </View>
                    {detailCusRequirement?.CustomerName ?
                        <View style={stylesDetail.containerBodyCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_customer')}</Text>
                            <Text style={stylesDetail.contentBody}>{detailCusRequirement?.CustomerName}</Text>
                        </View>
                        : null
                    }
                    <DynamicGeneralInfo detailCusRequirement={detailCusRequirement} languageKey={languageKey} />
                    {detailCusRequirement?.Content ?
                        <View style={stylesDetail.containerBody}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_product_required')}</Text>
                            <Text
                                style={stylesDetail.contentBody}
                                numberOfLines={3}
                                ellipsizeMode="tail"
                            >
                                {detailCusRequirement?.Content}
                            </Text>
                        </View>
                        : null
                    }
                    <View style={stylesDetail.containerGeneralInfor}>
                        <View style={[stylesDetail.containerBodyCard, { flex: 1 }]}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_product_code')}</Text>
                            <Text style={stylesDetail.contentBody}>{detailCusRequirement?.SKU ? detailCusRequirement?.SKU : languageKey('_no_product_code')}</Text>
                        </View>
                        <View style={[stylesDetail.containerBodyCard, { flex: 1 }]}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_quantity_required')}</Text>
                            <Text style={stylesDetail.contentBody}>{detailCusRequirement?.Quantity}</Text>
                        </View>
                    </View>
                    {detailCusRequirement?.CustomerRequest ?
                        <View style={stylesDetail.containerBody}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_detailed_description_of_requirement')}</Text>
                            <Text
                                style={stylesDetail.contentBody}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >
                                {detailCusRequirement?.CustomerRequest}
                            </Text>
                        </View>
                        : null
                    }

                    {detailCusRequirement?.BusinessRequest ?
                        <View style={stylesDetail.containerBody}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_business_requirements')}</Text>
                            <Text
                                style={stylesDetail.contentBody}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >
                                {detailCusRequirement?.BusinessRequest}
                            </Text>
                        </View>
                        : null
                    }
                    {detailCusRequirement?.Note ?
                        <View style={stylesDetail.containerBody}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_note')}</Text>
                            <Text style={stylesDetail.contentBody}>{detailCusRequirement?.Note}</Text>
                        </View>
                        : null
                    }
                </View>
                {linkImgArray.length > 0 && (
                    <View style={stylesDetail.containerTableFileItem}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_image')}</Text>
                        <RenderImage urls={linkImgArray} />
                    </View>
                )}

                {detailCusRequirement?.IsLock === 1 ? null :
                    <View style={stylesDetail.containerGeneralInfor}>
                        {detailCusRequirement?.IsCustomer === 1 ?
                            <Button
                                style={stylesDetail.btnDelete}
                                onPress={handleReject}
                            >
                                <Text style={stylesDetail.txtBtnDelete}>{languageKey('_refuse')}</Text>
                            </Button>
                            :
                            <Button
                                style={stylesDetail.btnDelete}
                                onPress={handleDelete}
                            >
                                <Text style={stylesDetail.txtBtnDelete}>{languageKey('_cancel_request')}</Text>
                            </Button>
                        }
                        <Button
                            style={stylesDetail.btnConfirm}
                            onPress={handleConfirm}
                        >
                            <Text style={stylesDetail.txtBtnConfirm}>{languageKey('_confirm')}</Text>
                        </Button>
                    </View>
                }
            </View>
            {showFormStepTwo && (
                <ModalStepTwo
                    isShowInforApproval={showFormStepTwo}
                    setShowForm={setShowFormStepTwo}
                />
            )}
            {inforApprovalsStepTwo && (
                <View style={stylesDetail.cardProgram}>
                    <Text style={stylesDetail.headerProgram}>{languageKey('factory_confirm')}</Text>
                    <View style={stylesDetail.containerInfor}>
                        <View >
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_factory_capacity')}</Text>
                            <Text style={stylesDetail.contentBodyColumn}>{detailCusRequirement?.FactoryCapacity === 1 ? languageKey('_can_be_done') : languageKey('_can_not_be_performed')}</Text>
                        </View>
                        <View >
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_content')}</Text>
                            <Text style={stylesDetail.contentBodyColumn}>{inforApprovalsStepTwo?.ApprovalNote}</Text>
                        </View>
                    </View>
                    {itemLinksStepTwo.length > 0 && (
                        <View>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_image')}</Text>
                            <RenderImage urls={itemLinksStepTwo} />
                        </View>
                    )}
                </View>
            )}
            {showFormStepThree && (
                <ModalStepThree
                    isShowInforApproval={showFormStepThree}
                    setShowForm={setShowFormStepThree}
                />
            )}
            {inforApprovalsStepThree && (
                <View style={stylesDetail.cardProgram}>
                    <Text style={stylesDetail.headerProgram}>{languageKey('_planning_confirm')}</Text>
                    <View style={stylesDetail.containerInfor}>
                        <View >
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_estimated_time')}</Text>
                            <Text style={stylesDetail.contentBodyColumn}>{moment(detailCusRequirement?.EstimatedDate).format('DD/MM/YYYY')}</Text>
                        </View>
                        <View >
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_content')}</Text>
                            <Text style={stylesDetail.contentBodyColumn}>{inforApprovalsStepThree?.ApprovalNote}</Text>
                        </View>
                    </View>
                    {itemLinksStepThree.length > 0 && (
                        <View>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_image')}</Text>
                            <RenderImage urls={itemLinksStepThree} />
                        </View>
                    )}
                </View>
            )}
            {showFormResponse && (
                <ModalStepFive
                    isShowInforApproval={showFormResponse}
                    setShowForm={setShowFormResponse}
                    initalValue={detailCusRequirement?.FactoryCapacity === 0 || detailCusRequirement?.IsPlanningApproved === 0}
                />
            )}
            {inforResponse && (
                <View style={stylesDetail.cardProgram}>
                    <Text style={stylesDetail.headerProgram}>{languageKey('_feedback_results')}</Text>
                    <View style={stylesDetail.containerInfor}>
                        <View style={stylesDetail.containerHeaderColumn}>
                            <View style={{ flex: 1 }}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_confirmer')}</Text>
                                <Text style={stylesDetail.contentBodyColumn}>{inforResponse?.UserFullName}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_confirmer')}</Text>
                                <Text style={stylesDetail.contentBodyColumn}>{moment(inforResponse?.CreateDate).format('HH:mm DD/MM/YYYY')}</Text>
                            </View>
                        </View>
                        <View style={stylesDetail.containerBodyCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_content')}</Text>
                            <Text style={stylesDetail.contentBody}>{inforResponse?.ApprovalNote}</Text>
                        </View>
                    </View>
                    {itemLinksStepFive.length > 0 && (
                        <View>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_image')}</Text>
                            <RenderImage urls={itemLinksStepFive} />
                        </View>
                    )}
                </View>
            )}
            {/* </>
            } */}
        </View>
    )
}

export default DetailTab;