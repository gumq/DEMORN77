import React from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet, Text } from 'react-native';

import { scale } from "../../utils/resolutions";
import { colors, fontSize } from "../../themes";
import { translateLang } from 'store/accLanguages/slide';

const CardItemRenderFlat = ({
    status,
    style,
    oid,
    date,
    userName,
    bgColor,
    txtColor,
    entryName,
    content,
    step,
    note,
    customerName,
    value
}) => {
    const languageKey = useSelector(translateLang);
    return (
        <View style={[styles.container, style]}>
            <View style={styles.headerCard}>
                <Text
                    style={styles.contentHeader}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {oid}
                </Text>
                <Text style={styles.contentBody}>{entryName}</Text>
            </View>
            {customerName ?
                <View style={styles.containerBody}>
                    <Text style={styles.txtHeaderBody}>{languageKey('_customer')}</Text>
                    <Text style={styles.contentBody}>{customerName}</Text>
                </View>
                : null
            }
            <View style={styles.containerContent}>
                {step ?
                    <View style={styles.containerBody}>
                        <Text style={styles.txtHeaderBody}>{languageKey('_approval_step')}</Text>
                        <Text style={styles.contentBody}>{step}</Text>
                    </View>
                    : null
                }
                {value ?
                    <View style={styles.containerBody}>
                        <Text style={styles.txtHeaderBody}>{languageKey('_value')}</Text>
                        <Text style={styles.contentBody}>{value}</Text>
                    </View>
                    : null
                }
            </View>

            {content ?
                <View style={styles.containerBody}>
                    <Text style={styles.txtHeaderBody}>{languageKey('_recommended_content')}</Text>
                    <Text style={styles.contentBody}>{content}</Text>
                </View>
                : null
            }
            {userName ?
                <View style={styles.containerBody}>
                    <Text style={styles.txtHeaderBody}>{languageKey('_staff_recommneded')}</Text>
                    <Text style={styles.contentBody}>{userName}</Text>
                </View>
                : null
            }
            {note ?
                <View style={styles.containerBody}>
                    <Text style={styles.txtHeaderBody}>{languageKey('_note')}</Text>
                    <Text style={styles.contentBody}>{note}</Text>
                </View>
                : null
            }
            <View style={styles.containerFooterCard}>
                <Text style={styles.contentTimeApproval}>{languageKey('_recommneded_at')} {date}</Text>
                <View style={[styles.bodyStatus, { backgroundColor: bgColor ? bgColor : '#FFFFFF' }]}>
                    <Text style={[styles.txtStatus, { color: txtColor ? txtColor : '#000000' }]}>{status}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 'auto',
        backgroundColor: colors.white,
        marginTop: scale(8),
        marginHorizontal: scale(12),
        borderRadius: scale(8),
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        paddingHorizontal: scale(8)
    },
    headerCard: {
        paddingVertical: scale(8)
    },
    contentHeader: {
        fontSize: fontSize.size14,
        fontWeight: '600',
        lineHeight: scale(22),
        fontFamily: 'Inter-SemiBold',
        color: colors.black,
        maxWidth: '90%',
        overflow: 'hidden',
    },
    bodyStatus: {
        borderRadius: scale(4),
        paddingHorizontal: scale(6),
        paddingVertical: scale(2),
        width: 'auto',
    },
    txtStatus: {
        fontSize: fontSize.size12,
        fontWeight: '500',
        lineHeight: scale(18),
        fontFamily: 'Inter-Medium',
    },
    containerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    containerFooterCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scale(8),
    },
    contentTimeApproval: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    containerBody: {
        marginBottom: scale(8),
        flex: 1
    },
    txtHeaderBody: {
        color: '#6B7280',
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Regular',
        lineHeight: scale(22),
    },
    contentBody: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '500',
        fontFamily: 'Inter-Medium',
        lineHeight: scale(22),
        width: '80%',
        overflow: 'hidden'
    },
});

export default CardItemRenderFlat;