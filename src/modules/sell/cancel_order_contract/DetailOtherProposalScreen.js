import React, { useEffect, useMemo } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { View, StatusBar, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { edit } from "svgImg";
import routes from "modules/routes";
import { stylesDetail } from './styles'
import { translateLang } from "store/accLanguages/slide";
import { HeaderBack, LoadingModal, RenderImage } from "@components";
import { fetchDetailOtherProposal } from "store/accOther_Proposal/thunk";

const DetailOtherProposalScreen = ({ route, item }) => {
    const itemData = item || route?.params?.item;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang)
    const { isSubmitting, detailOtherProposal } = useSelector(state => state.OtherProposal);

    useEffect(() => {
        const body = { OID: itemData?.OID }
        dispatch(fetchDetailOtherProposal(body))
    }, [itemData])

    const handleFormEdit = () => {
        navigation.navigate(routes.FormOtherProposalScreen, { item: detailOtherProposal, editProposal: true })
    }

    const linkImgArray = useMemo(() => {
        return detailOtherProposal?.Link
            ? detailOtherProposal.Link.split(';').filter(Boolean)
            : [];
    }, [detailOtherProposal?.Link]);

    const itemLinksCofirmComplete = useMemo(() => {
        return detailOtherProposal?.ConfirmCompleteLink
            ? detailOtherProposal.ConfirmCompleteLink.split(';').filter(Boolean)
            : [];
    }, [detailOtherProposal?.ConfirmCompleteLink]);

    return (
        <LinearGradient style={stylesDetail.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView style={stylesDetail.container}>
                <HeaderBack
                    title={detailOtherProposal?.OID}
                    onPress={() => navigation.goBack()}
                    btn={detailOtherProposal?.IsLock === 0 ? true : false}
                    onPressBtn={handleFormEdit}
                    iconBtn={edit}
                />
                <ScrollView
                    style={stylesDetail.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={stylesDetail.flatScroll}
                >
                    <View style={stylesDetail.cardProgram}>
                        <View style={stylesDetail.containerHeader}>
                            <Text style={stylesDetail.headerProgram}>{languageKey('_information_general')}</Text>
                            <View style={[stylesDetail.bodyStatus, { backgroundColor: detailOtherProposal?.ApprovalStatusColor?.toLowerCase() }]}>
                                <Text style={[stylesDetail.txtStatus, { color: detailOtherProposal?.ApprovalStatusTextColor?.toLowerCase() }]}>
                                    {detailOtherProposal?.ApprovalStatusName}
                                </Text>
                            </View>
                        </View>
                        <View style={stylesDetail.bodyCard}>
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_function')}</Text>
                                <Text style={stylesDetail.contentBody}>{detailOtherProposal?.EntryName}</Text>
                            </View>
                            <View style={stylesDetail.containerGeneralInfor}>
                                <View style={stylesDetail.containerBodyCard}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_ct_code')}</Text>
                                    <Text style={stylesDetail.contentBody}>{detailOtherProposal?.OID}</Text>
                                </View>
                                <View style={stylesDetail.containerBodyCard}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_ct_day')}</Text>
                                    <Text style={stylesDetail.contentBody}>{moment(detailOtherProposal?.ODate).format('DD/MM/YYYY')}</Text>
                                </View>
                            </View>
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_customer')}</Text>
                                <Text style={stylesDetail.contentBody}>{detailOtherProposal?.CustomerName}</Text>
                            </View>
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_document_type')}</Text>
                                <Text style={stylesDetail.contentBody}>{detailOtherProposal?.DocumentTypeName}</Text>
                            </View>
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_select_document_number')}</Text>
                                <Text style={stylesDetail.contentBody}>{detailOtherProposal?.ReferenceID}</Text>
                            </View>
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_explain_the_reason')}</Text>
                                <Text style={stylesDetail.contentBody}>{detailOtherProposal?.Reason}</Text>
                            </View>
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_proposal_interpretaion')}</Text>
                                <Text style={stylesDetail.contentBody}>{detailOtherProposal?.Proposal}</Text>
                            </View>
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_note')}</Text>
                                <Text style={stylesDetail.contentBody}>{detailOtherProposal?.Note}</Text>
                            </View>
                            {linkImgArray.length > 0 && (
                                <View style={stylesDetail.containerImage}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_image')}</Text>
                                    <RenderImage urls={linkImgArray} />
                                </View>
                            )}
                        </View>
                    </View>
                    {detailOtherProposal?.EntryID === "ContractAdjust" || detailOtherProposal?.EntryID === "OrderAdjust" ?
                        <View style={stylesDetail.cardProgram}>
                            <View style={stylesDetail.containerHeader}>
                                <Text style={stylesDetail.headerProgram}>{languageKey('_information_required_confirm')}</Text>
                            </View>
                            <View style={stylesDetail.bodyCard}>
                                <View style={stylesDetail.containerBodyCard}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_department_request_confirm')}</Text>
                                    <Text style={stylesDetail.contentBody}>{detailOtherProposal?.DepartmentName}</Text>
                                </View>
                                <View style={stylesDetail.containerBodyCard}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_officer_in_charge')}</Text>
                                    <Text style={stylesDetail.contentBody}>{detailOtherProposal?.ResponsibleUserName}</Text>
                                </View>
                                <View style={stylesDetail.containerBodyCard}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_request_content')}</Text>
                                    <Text style={stylesDetail.contentBody}>{detailOtherProposal?.RequestContent}</Text>
                                </View>
                                <View style={stylesDetail.containerBodyCard}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_processing_deadline')}</Text>
                                    <Text style={stylesDetail.contentBody}>{moment(detailOtherProposal?.ProcessingDeadline).format('DD/MM/YYYY')}</Text>
                                </View>
                            </View>
                        </View>
                        : null
                    }
                    {detailOtherProposal?.ConfirmCompleteUser !== 0 && (
                        <View style={stylesDetail.cardProgram}>
                            <Text style={stylesDetail.headerProgram}>{languageKey('_confirm_completion')}</Text>
                            <View style={stylesDetail.containerInforForm}>
                                <View style={stylesDetail.containerBodyCard}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_confirmer')}</Text>
                                    <Text style={stylesDetail.contentBody}>{detailOtherProposal?.ConfirmCompleteUserName}</Text>
                                </View>
                                <View style={stylesDetail.containerBodyCard}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_estimated_time')}</Text>
                                    <Text style={stylesDetail.contentBody}>{moment(detailOtherProposal?.ConfirmCompleteDate).format("DD/MM/YYYY")}</Text>
                                </View>
                            </View>
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_content')}</Text>
                                <Text style={stylesDetail.contentBody}>{detailOtherProposal?.ConfirmCompleteNote}</Text>
                            </View>
                            {itemLinksCofirmComplete.length > 0 && (
                                <View style={stylesDetail.containerImage}>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_image')}</Text>
                                    <RenderImage urls={itemLinksCofirmComplete} />
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

export default DetailOtherProposalScreen;