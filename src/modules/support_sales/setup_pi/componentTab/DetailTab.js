import React, { useState } from "react";
import _ from 'lodash';
import moment from "moment";
import { SvgXml } from "react-native-svg";
import { useSelector } from "react-redux";
import { View, Text, FlatList, ScrollView } from 'react-native';

import { stylesDetail } from "../styles";
import { translateLang } from "@store/accLanguages/slide";
import { Button } from "@components";
import { arrow_down_big, arrow_next_gray } from "@svgImg";
import { scale } from "@resolutions";

const DetailTab = ({ detailPI }) => {
    const languageKey = useSelector(translateLang);

    const [showInformation, setShowInformation] = useState({
        information: true,
        criteria: false,
        plans: false
    });

    const toggleInformation = (key) => {
        setShowInformation((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const _keyExtractorCriteria = (item, index) => `${item.Content}-${index}`;
    const _renderItemCriteria = ({ item }) => {
        return (
            <Button style={stylesDetail.cardProgramCriteria} onPress={() => onEditPlan(item)} >
                <View style={stylesDetail.contentPlan}>
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_time')}</Text>
                    <Text style={stylesDetail.contentTime}>{moment(item?.FromDate).format('DD/MM/YYY')} - {moment(item?.ToDate).format('DD/MM/YYY')}</Text>
                </View>
                <View style={stylesDetail.contentPlan}>
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_estimated_costs')}</Text>
                    <Text style={stylesDetail.contentTime}>{Number(item?.Value).toLocaleString('vi-VN')} VND</Text>
                </View>
                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_work_perdormed')}</Text>
                <Text style={stylesDetail.contentTime}>{item?.Content}</Text>
            </Button>
        );
    };

    const _keyExtractor = (item, index) => `${item.ID}-${index}`;
    const _renderItem = ({ item }) => {
        const plans = item?.Plans ? JSON.parse(item?.Plans) : []
        const difference = item.AssignedValue - item.ProposalValue;
        return (
            <View style={stylesDetail.cardProgram}>
                <View style={stylesDetail.containerHeader}>
                    <Text style={stylesDetail.headerProgram}>{item?.WorkCriteriaName}</Text>
                    <View style={stylesDetail.contentCard}>
                        <Text style={[stylesDetail.txtHeaderBody, { marginRight: scale(4) }]}>{languageKey('_assigned')}</Text>
                        <Text style={stylesDetail.contentTime}>{item?.AssignedValue}</Text>
                    </View>
                </View>
                <View style={stylesDetail.containerHeaderShow}>
                    <Text style={stylesDetail.headerShowPlan}>{languageKey('_details_plan')}</Text>
                    <Button style={stylesDetail.btnShowInfor} onPress={() => toggleInformation("plans")}>
                        <SvgXml xml={showInformation.plans ? arrow_down_big : arrow_next_gray} />
                    </Button>
                </View>
                {showInformation.plans && (
                    <FlatList
                        data={plans}
                        renderItem={_renderItemCriteria}
                        keyExtractor={_keyExtractorCriteria}
                    />
                )}
                {item.ProposalValue !== 0 ?
                    <>
                        <Text style={stylesDetail.headerShowPlan}>{languageKey('_adjustment_details')}</Text>
                        <View style={stylesDetail.cardProgramCriteria}>
                            <View style={stylesDetail.contentPlan}>
                                <View>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_assigned')}</Text>
                                    <Text style={stylesDetail.contentTime}>{item.AssignedValue}</Text>
                                </View>
                                <View>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_propose')}</Text>
                                    <Text style={stylesDetail.contentTime}>{item.ProposalValue}</Text>
                                </View>
                                <View>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_difference')}</Text>
                                    <Text style={stylesDetail.contentTime}>{difference}</Text>
                                </View>
                            </View>
                            <View >
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_suggested_reason')}</Text>
                                <Text style={stylesDetail.contentTime}>{item.Reason}</Text>
                            </View>


                        </View>
                    </>
                    : null
                }
            </View>
        );
    };

    return (
        <ScrollView style={stylesDetail.footerFlat} >
            <View style={stylesDetail.containerHeaderShow}>
                {detailPI?.HasPlans === 1 ?
                    <View style={stylesDetail.containerItemStatus}>
                        <Text style={stylesDetail.headerShow}>{languageKey('_information_general')}</Text>
                        <View style={[stylesDetail.bodyStatus, { backgroundColor: detailPI?.ApprovalStatusColor, marginTop: 8 }]}>
                            <Text style={[stylesDetail.txtStatus, { color: detailPI?.ApprovalStatusTextColor }]}>
                                {detailPI?.ApprovalStatusName}
                            </Text>
                        </View>
                    </View>
                    :
                    <View style={stylesDetail.containerItemStatus}>
                        <Text style={stylesDetail.headerShow}>{languageKey('_information_general')}</Text>
                        <View style={[stylesDetail.bodyStatus, { backgroundColor: detailPI?.ProposalStatusColor, marginTop: 8 }]}>
                            <Text style={[stylesDetail.txtStatus, { color: detailPI?.ProposalStatusTextColor }]}>
                                {detailPI?.ProposalStatusName}
                            </Text>
                        </View>
                    </View>
                }
                <Button style={stylesDetail.btnShowInfor} onPress={() => toggleInformation("information")}>
                    <SvgXml xml={showInformation.information ? arrow_down_big : arrow_next_gray} />
                </Button>
            </View>
            {showInformation.information && (
                <View style={stylesDetail.cardProgram}>
                    <View style={stylesDetail.containerTime}>
                        <Text style={[stylesDetail.txtHeaderTime, { marginRight: scale(4) }]}>{languageKey('_application_period')}</Text>
                        <Text style={stylesDetail.contentTime}>{detailPI?.Month}</Text>
                    </View>
                    {detailPI?.Note ?
                        <View style={stylesDetail.containerTime}>
                            <Text style={stylesDetail.txtHeaderTime}>{languageKey('_note')}</Text>
                            <Text style={stylesDetail.contentTime}>{detailPI?.Note}</Text>
                        </View>
                        : null
                    }
                </View>
            )}
            <View style={stylesDetail.containerHeaderShow}>
                <Text style={stylesDetail.headerShow}>{languageKey('_list_of_criteria')}</Text>
                <Button style={stylesDetail.btnShowInfor} onPress={() => toggleInformation("criteria")}>
                    <SvgXml xml={showInformation.criteria ? arrow_down_big : arrow_next_gray} />
                </Button>
            </View>
            {showInformation.criteria && (
                <FlatList
                    data={detailPI?.Details}
                    renderItem={_renderItem}
                    keyExtractor={_keyExtractor}
                    contentContainerStyle={stylesDetail.footerFlat}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </ScrollView>
    );
}

export default DetailTab;