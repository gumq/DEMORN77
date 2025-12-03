import React from "react";
import moment from "moment";
import { colors } from "@themes";
import { stylesProgress, styles } from "../styles";
import { View, Text, FlatList } from "react-native";
import { noData } from "@svgImg";
import { SvgXml } from "react-native-svg";
import { useSelector } from "react-redux";
import { translateLang } from "@store/accLanguages/slide";

const ProgressTab = ({ detailCostProposal }) => {
    const languageKey = useSelector(translateLang)
    const latestItem = detailCostProposal?.Progress?.reduce((latest, current) => {
        return moment(current.CreateDate).isAfter(moment(latest.CreateDate)) ? current : latest;
    }, detailCostProposal?.Progress?.[0]);

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
                        {item.StatusName}
                    </Text>
                </View>
                <Text style={stylesProgress.txtDate}>{moment(item.CreateDate).format('HH:mm DD/MM/YYYY')}</Text>
                {item?.ApprovalNote ? <Text style={stylesProgress.txtApprove}>{item?.ApprovalNote}</Text> : null}
            </View>
        );
    };

    return (
        <View style={stylesProgress.container}>
            {detailCostProposal?.Progress?.length > 0 ? (
                <FlatList
                    data={detailCostProposal?.Progress}
                    renderItem={renderStopItem}
                    keyExtractor={(item) => item.StationID}
                    contentContainerStyle={stylesProgress.list}
                    ItemSeparatorComponent={() => <View style={stylesProgress.separator} />}
                />
            ) : (

                <View>
                    <Text style={styles.txtHeaderNodata}>{languageKey('_no_data')}</Text>
                    <Text style={styles.txtContent}>{languageKey('_we_will_back')}</Text>
                    <SvgXml xml={noData} style={styles.imgEmpty} />
                </View>

            )}
        </View>
    );
};

export default ProgressTab;
