import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { hScale, scale } from "@resolutions";
import { colors, fontSize } from "@themes";
import moment from "moment";

const ApprovalProgress = ({ detailApprovalListProcess }) => {
    const latestItem = detailApprovalListProcess?.Progress?.reduce((latest, current) => {
        return moment(current.CreateDate).isAfter(moment(latest.CreateDate)) ? current : latest;
    }, detailApprovalListProcess?.Progress?.[0]);

    const renderStopItem = ({ item }) => {
        const isLatest = item?.CreateDate === latestItem?.CreateDate;

        return (
            <View>
                <View style={styles.itemContainer}>
                    <View style={[styles.circle, {
                        backgroundColor: isLatest ? colors.blue : '#D1D3DB',
                    }]} />
                    <View style={styles.line} />
                    <Text style={[styles.stopText, {
                        fontWeight: isLatest ? 'bold' : 'normal',
                    }]}>
                       {item?.Description} - {item?.StatusName}
                    </Text>
                </View>
                <Text style={styles.txtDate}>{moment(item.CreateDate).format('HH:mm DD/MM/YYYY')}</Text>
                {item?.ApprovalNote ? <Text style={styles.txtApprove}>{item?.ApprovalNote}</Text> : null}
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <FlatList
                data={detailApprovalListProcess?.Progress}
                renderItem={({ item }) => renderStopItem({ item })}
                keyExtractor={(item) => item.StationID}
                contentContainerStyle={styles.list}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: scale(16),
        backgroundColor: '#fff',
    },
    list: {
        paddingBottom: scale(16),
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    circle: {
        width: scale(16),
        height: scale(16),
        borderRadius: 10,
        backgroundColor: '#D1D3DB',
        position: 'absolute',
    },
    redCircle: {
        backgroundColor: 'red',
    },
    line: {
        width: scale(4),
        height: scale(40),
        backgroundColor: '#D1D3DB',
        position: 'absolute',
        left: scale(6),
        top: scale(22),
    },
    stopText: {
        marginLeft: scale(30),
        fontSize: fontSize.size14,
        fontWeight: '600',
        lineHeight: scale(22),
        fontFamily: 'Inter-Regular',
        color: colors.black,
    },
    boldText: {
        fontWeight: 'bold',
    },
    separator: {
        height: hScale(4),
    },
    txtDate: {
        marginTop: scale(8),
        fontSize: fontSize.size12,
        lineHeight: scale(18),
        fontFamily: 'Inter-Regular',
        color: colors.gray600,
        fontWeight: '400',
        marginLeft: scale(30),
        marginBottom: scale(8),
    },
    txtApprove: {
        marginTop: scale(4),
        fontSize: fontSize.size12,
        lineHeight: scale(18),
        fontFamily: 'Inter-Regular',
        color: colors.black,
        fontWeight: '400',
        marginLeft: scale(30),
    }
});

export default ApprovalProgress;
