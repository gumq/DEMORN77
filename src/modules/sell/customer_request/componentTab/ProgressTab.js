import React from "react";
import moment from "moment";
import { colors } from "@themes";
import { stylesProgress } from "../styles";
import { View, Text, FlatList } from "react-native";

const ProgressTab = ({ detailCusRequirement }) => {

    const latestItem = detailCusRequirement?.Progress?.reduce((latest, current) => {
        return moment(current.CreateDate).isAfter(moment(latest.CreateDate)) ? current : latest;
    }, detailCusRequirement?.Progress?.[0]);

    const renderStopItem = ({ item }) => {
        const isLatest = item?.CreateDate === latestItem?.CreateDate;

        return (
            <View>
                <View style={stylesProgress.itemContainer}>
                    <View style={[stylesProgress.circle, {
                        backgroundColor: isLatest ? colors.blue : '#D1D3DB',
                    }]} />
                    <View style={stylesProgress.line} />
                    <Text style={[stylesProgress.stopText, {
                        fontWeight: isLatest ? 'bold' : 'normal',
                    }]}>
                        {item.Description || item.StatusName}
                    </Text>
                </View>
                <Text style={stylesProgress.txtDate}>{moment(item.CreateDate).format('HH:mm DD/MM/YYYY')}</Text>
                {item?.ApprovalNote ? <Text style={stylesProgress.txtApprove}>{item?.ApprovalNote}</Text> : null}
            </View>
        );
    };

    return (
        <View style={stylesProgress.container}>
            <FlatList
                data={detailCusRequirement?.Progress}
                renderItem={renderStopItem}
                keyExtractor={(item) => item.StationID}
                contentContainerStyle={stylesProgress.list}
                ItemSeparatorComponent={() => <View style={stylesProgress.separator} />}
            />
        </View>
    );
};

export default ProgressTab;
