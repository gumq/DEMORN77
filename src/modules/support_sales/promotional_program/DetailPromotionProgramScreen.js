import React, { useEffect } from "react";
import moment from "moment";
import RenderHTML from 'react-native-render-html';
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, Image, Text, ScrollView, Dimensions } from "react-native";

import { styles } from './styles'
import { translateLang } from "store/accLanguages/slide";
import { HeaderBack, LoadingModal } from "@components";
import { fetchDetailPromotionPrograms } from "store/accPromotion_Program/thunk";
import { colors, fontSize } from "themes";

const { width } = Dimensions.get('window')

const DetailPromotionProgramScreen = ({ route }) => {
    const item = route?.params?.item;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang)
    const { isSubmitting, detailPromotionPrograms } = useSelector(state => state.PromotionPrograms);

    useEffect(() => {
        const body = { OID: item?.OID }
        dispatch(fetchDetailPromotionPrograms(body))
    }, [item])

    const source = {
        html: detailPromotionPrograms?.FullContent || '',
    };

    return (
        <LinearGradient style={styles.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView style={styles.container}>
                <HeaderBack
                    title={languageKey('_promotion_details')}
                    onPress={() => navigation.goBack()}
                />
                <ScrollView style={styles.scrollView}>
                    {detailPromotionPrograms?.Thumbnail ?
                        <Image source={{ uri: detailPromotionPrograms?.Thumbnail }} style={styles.imgDetail} />
                        :
                        <View style={styles.noImageDetail} />
                    }

                    <View style={styles.contentDetail}>
                        <Text style={styles.headerProgram}>{detailPromotionPrograms?.PromotionName}</Text>
                        <Text style={styles.contentTime}>{moment(detailPromotionPrograms?.FromDate).format('DD/MM/YYYY')} - {moment(detailPromotionPrograms?.ToDate).format('DD/MM/YYYY')}</Text>
                        <RenderHTML
                            contentWidth={width}
                            source={source}
                            baseStyle={{
                                color: colors.black,
                                fontSize: fontSize.size14,
                                lineHeight: 22,
                                fontFamily: 'Inter-Regular',
                                fontWeight: '400'
                            }}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    )
}

export default DetailPromotionProgramScreen;