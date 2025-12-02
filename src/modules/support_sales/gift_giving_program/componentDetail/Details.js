import React from "react";
import moment from "moment";
import { View, Text, Image, ScrollView } from 'react-native';

import { stylesDetail } from "../styles";

const Details = ({ detailGiftPrograms }) => {

    return (
        <ScrollView style={stylesDetail.container}>
            <Image source={{ uri: detailGiftPrograms?.Link }} style={stylesDetail.img} />
            <View style={stylesDetail.cardProgram}>
                <View style={stylesDetail.containerContent}>
                    <Text style={stylesDetail.headerProgram}>{detailGiftPrograms?.Name}</Text>
                    <Text style={stylesDetail.contentTime}>{moment(detailGiftPrograms?.FromDate).format('DD/MM/YYYY')} - {moment(detailGiftPrograms?.ToDate).format('DD/MM/YYYY')}</Text>

                    <View style={stylesDetail.timeProgram}>
                        <Text style={stylesDetail.txtHeaderTime}>{detailGiftPrograms?.TargetNote}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default Details;