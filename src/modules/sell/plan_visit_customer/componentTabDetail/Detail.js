import React, { useMemo } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';

import { colors, fontSize } from 'themes';
import { scale } from '@resolutions';
import { translateLang } from 'store/accLanguages/slide';
import { RenderImage } from 'components';

const Detail = ({ detailApprovalListProcess }) => {
    const languageKey = useSelector(translateLang);
    const { listSalesRoutes } = useSelector(state => state.VisitCustomer);
    const { listUserByUserID, listCustomerByUserID } = useSelector(state => state.Login);
    const listCustomerApproval = listCustomerByUserID?.filter(item => item.IsCompleted === 1 && item.IsClosed === 0);
    const linkImgArray = useMemo(() => {
        return detailApprovalListProcess?.Link
            ? detailApprovalListProcess.Link.split(';').filter(Boolean)
            : [];
    }, [detailApprovalListProcess?.Link]);

    const userCreate = useMemo(() => {
        return listUserByUserID.find(user => user.UserID === detailApprovalListProcess?.UserID);
    }, [listUserByUserID, detailApprovalListProcess]);


    const customerSupportLine = useMemo(() => {
        return listSalesRoutes.find(line => Number(line.ID) === Number(detailApprovalListProcess?.CustomerSupportLineID));
    }, [listSalesRoutes, detailApprovalListProcess]);

    const groupedPlans = useMemo(() => {
        return detailApprovalListProcess?.Plan.reduce((acc, plan) => {
            const relatedSchedules = detailApprovalListProcess?.Schedule.filter(
                schedule => schedule.PlanScheduleID === plan.ID
            );

            if (relatedSchedules.length === 0) {
                const planDate = moment(plan.PlanDate).format('YYYY-MM-DD');
                if (!acc[planDate]) {
                    acc[planDate] = [];
                }
            }

            relatedSchedules.forEach(relatedSchedule => {
                const customerName = listCustomerApproval.find(customer => customer.ID === relatedSchedule.CustomerID);

                const planDate = moment(plan.PlanDate).format('YYYY-MM-DD');

                if (!acc[planDate]) {
                    acc[planDate] = [];
                }

                acc[planDate].push({
                    PlanDate: planDate,
                    Name: customerName?.Name || 'Unknown Customer',
                    PlanID: plan.ID,
                    CustomerGroupCode: customerName?.CustomerGroupCode,
                    NumberOfVisits_ByGroup: customerName?.NumberOfVisits_ByGroup,
                    Visited_Actual: customerName?.Visited_Actual
                });
            });

            return acc;
        }, {});
    }, [detailApprovalListProcess, listCustomerApproval]);

    const transformedPlans = useMemo(() => {
        if (!groupedPlans || typeof groupedPlans !== 'object') {
            return [];
        }

        return Object.keys(groupedPlans).map(planDate => {
            const customers = Array.isArray(groupedPlans[planDate]) ? groupedPlans[planDate] : []

            return {
                PlanDate: planDate,
                customers: customers,
            };
        });
    }, [groupedPlans]);

    const renderPlanItem = ({ item }) => (
        <View style={styles.cardPlan}>
            <View style={styles.headerCardPlan}>
                <Text style={styles.txtPlanDate}>{moment(item.PlanDate).format('DD/MM/YYYY')}</Text>
            </View>
            {item.customers.map((customer, index) => (
                <Text
                    key={index}
                    style={[
                        styles.txtCustomer,
                        index === item.customers.length - 1 ? { borderBottomWidth: 0 } : {}
                    ]}
                >
                    {customer.Name} - {customer?.CustomerGroupCode} ({customer.Visited_Actual}/{customer.NumberOfVisits_ByGroup})
                </Text>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{languageKey('_information_general')}</Text>
            <View style={styles.card}>
                <View style={styles.containerPlan}>
                    <InfoRow label={languageKey('_plan_code')} content={detailApprovalListProcess?.OID} half />
                    <InfoRow
                        label={languageKey('_plan_date')}
                        content={moment(detailApprovalListProcess?.ODate).format('DD/MM/YYYY')}
                        half
                    />
                </View>
                <InfoRow label={languageKey('_employee')} content={userCreate?.UserFullName} />
                <InfoRow label={languageKey('_customer_care_route')} content={customerSupportLine?.Name} />
                <InfoRow label={languageKey('_plan_name')} content={detailApprovalListProcess?.PlanName} />
                <View style={styles.containerPlan}>
                    <InfoRow
                        label={languageKey('_fromdate')}
                        content={moment(detailApprovalListProcess?.FromDate).format('DD/MM/YYYY')}
                        half
                    />
                    <InfoRow
                        label={languageKey('_toDate')}
                        content={moment(detailApprovalListProcess?.ToDate).format('DD/MM/YYYY')}
                        half
                    />
                </View>
                {detailApprovalListProcess?.Note && (
                    <InfoRow label={languageKey('_note')} content={detailApprovalListProcess.Note} />
                )}
                {linkImgArray.length > 0 && (
                    <View style={styles.containerTableFileItem}>
                        <Text style={styles.txtHeaderBody}>{languageKey('_image')}</Text>
                        <RenderImage urls={linkImgArray} />
                    </View>
                )}
            </View>
            <Text style={styles.header}>{languageKey('_detail_schedule_plans')}</Text>
            <ScrollView style={styles.card} showsVerticalScrollIndicator={false}>
                <FlatList
                    data={transformedPlans}
                    renderItem={renderPlanItem}
                    keyExtractor={(item, index) => `${item.PlanDate}-${index}`}
                    contentContainerStyle={styles.containerFlatlist}
                    showsVerticalScrollIndicator={false}
                />
            </ScrollView>
        </View>
    );
};

const InfoRow = ({ label, content, half }) => (
    <View style={[styles.containerBody, half && styles.halfWidth]}>
        <Text style={styles.txtLabel}>{label}</Text>
        <Text style={styles.txtContent}>{content}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        fontSize: fontSize.size16,
        fontWeight: '600',
        lineHeight: scale(24),
        fontFamily: 'Inter-SemiBold',
        color: colors.black,
        marginTop: scale(12),
        marginHorizontal: scale(12),
        marginBottom: scale(4),
    },
    card: {
        backgroundColor: colors.white,
        paddingBottom: scale(8),
    },
    containerFlatlist: {
        marginBottom: scale(400),
        paddingHorizontal: scale(12),
        marginTop: scale(8)
    },
    containerBody: {
        paddingVertical: scale(4),
        paddingHorizontal: scale(12),
    },
    containerPlan: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '50%',
    },
    txtLabel: {
        color: colors.gray600,
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Regular',
        fontWeight: '400',
    },
    txtContent: {
        color: colors.black,
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        fontWeight: '500',
    },
    scrollView: {
        paddingVertical: scale(8),
        paddingHorizontal: scale(12)
    },
    cardPlan: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        marginBottom: scale(8),
        borderRadius: scale(8),
    },
    headerCardPlan: {
        backgroundColor: '#F9FAFB',
        borderTopLeftRadius: scale(8),
        borderTopRightRadius: scale(8),
        justifyContent: 'center',
    },
    txtPlanDate: {
        borderBottomWidth: scale(1),
        borderBottomColor: colors.borderColor,
        paddingHorizontal: scale(8),
        paddingVertical: scale(4),
        fontSize: fontSize.size12,
        lineHeight: scale(18),
        fontFamily: 'Inter-Semibold',
        fontWeight: '600',
        color: '#6B7280',
        paddingVertical: scale(8),
    },
    txtCustomer: {
        fontSize: fontSize.size12,
        lineHeight: scale(18),
        fontFamily: 'Inter-Regular',
        fontWeight: '400',
        color: colors.black,
        paddingHorizontal: scale(8),
        paddingVertical: scale(8),
        borderBottomWidth: scale(1),
        borderBottomColor: colors.borderColor,
    },
    containerTableFileItem: {
        marginHorizontal: scale(12)
    }
});

export default Detail;