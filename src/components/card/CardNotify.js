import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';

import { scale } from "../../utils/resolutions";
import { colors, fontSize } from "../../themes";
import { Button } from '../buttons';
import { SvgXml } from 'react-native-svg';
import { close } from 'svgImg';
import {
    cancel_contract_order,
    catalogue, cost_proposal,
    customer_profiles,
    customer_request,
    exhibition_program,
    gift_program,
    inventory,
    limit_credit,
    order,
    other_cost,
    paint_the_car,
    plan_visit_customer,
    prices,
    promotion_program,
    requirement_deposit,
    sample_cabinet_shelves,
    setup_pi,
    support_articles,
    survey_program,
    training_testing,
    view_more,
    visit_customer,
    customer_closed,
    handover_doc,
    job_list
} from 'svgImg';
import moment from 'moment';

const CardNotify = ({ style, icon, content, statuscolorTilte, statuscolorContent, statuscolorTime, title, time, isView, onPressDelete }) => {

    const icons = {
        customer_profiles: customer_profiles,
        limit_credit: limit_credit,
        plan_visit_customer: plan_visit_customer,
        visit_customer: visit_customer,
        customer_request: customer_request,
        prices: prices,
        order: order,
        requirement_deposit: requirement_deposit,
        cost_proposal: cost_proposal,
        cancel_contract_order: cancel_contract_order,
        inventory: inventory,
        promotion_program: promotion_program,
        gift_program: gift_program,
        exhibition_program: exhibition_program,
        survey_program: survey_program,
        support_articles: support_articles,
        training_testing: training_testing,
        setup_pi: setup_pi,
        catalogue: catalogue,
        sample_cabinet_shelves: sample_cabinet_shelves,
        paint_the_car: paint_the_car,
        other_cost: other_cost,
        view_more: view_more,
        customer_closed: customer_closed,
        handover_doc: handover_doc,
        job_list: job_list
    };

    const iconName = icon ? icons[icon] : null;

    return (
        <View style={[styles.container, style]}>
            <View style={styles.row}>
                <Button style={styles.iconWrapper} disabled={isView === 1 ? true : false}>
                    <SvgXml xml={iconName} />
                </Button>

                <View style={styles.textWrapper}>
                    <View style={styles.header}>
                        <Text numberOfLines={2} style={[styles.title, { color: statuscolorTilte }]}>
                            {title}
                        </Text>
                        <Button style={styles.btnClose} onPress={onPressDelete}>
                            <SvgXml xml={close} />
                        </Button>
                    </View>

                    <Text numberOfLines={4} style={[styles.content, { color: statuscolorContent }]}>
                        {content}
                    </Text>

                    <Text style={[styles.time, { color: statuscolorTime }]}>{moment(time).format('HH:mm DD/MM/YYYY')}</Text>
                </View>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: scale(12),
        padding: scale(12),
        borderWidth: scale(1),
        borderColor: colors.borderColor
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconWrapper: {
        paddingRight: scale(12),
    },
    textWrapper: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: fontSize.size14,
        fontFamily: 'Inter-SemiBold',
        fontWeight: '600',
        lineHeight: scale(22),
        flex: 1,
        marginRight: scale(8),
    },
    btnClose: {
    },
    content: {
        fontSize: fontSize.size14,
        fontFamily: 'Inter-Regular',
        fontWeight: '400',
        lineHeight: scale(22),
        marginTop: scale(4),
    },
    time: {
        fontSize: fontSize.size12,
        fontFamily: 'Inter-SemiBold',
        fontWeight: '600',
        lineHeight: scale(18),
        marginTop: scale(8),
    },
});

export default CardNotify;
