import React, { useEffect } from "react";
import RenderHTML from 'react-native-render-html';
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, Image, Text, ScrollView, Dimensions } from "react-native";

import { styles } from './styles'
import { translateLang } from "store/accLanguages/slide";
import { HeaderBack, LoadingModal } from "@components";
import { fetchDetailSupportArticles } from "store/accCustomer_Support_Articles/thunk";
import moment from "moment";
import { colors, fontSize } from "themes";

const { width } = Dimensions.get('window')

const DetailArticles = ({ route }) => {
    const item = route?.params?.item;
    const detailBanner = route?.params?.detailBanner;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang)
    const { isSubmitting, detailSupportArticles } = useSelector(state => state.SupportArticles);

    useEffect(() => {
        const body = { ID: detailBanner ? Number(item?.Extention1) : item?.ID }
        dispatch(fetchDetailSupportArticles(body))
    }, [item])

    const source = {
        html: detailSupportArticles?.FullContent || '',
    };

    return (
        <LinearGradient style={styles.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView style={styles.container}>
                <HeaderBack
                    title={languageKey('_article_details')}
                    onPress={() => navigation.goBack()}
                />
                <ScrollView style={styles.scrollView}>
                    {detailSupportArticles?.Avatar ?
                        <Image source={{ uri: detailSupportArticles?.Avatar }} style={styles.imgDetail} />
                        :
                        <View style={styles.noImageDetail} />
                    }

                    <View style={styles.contentDetail}>
                        <Text style={styles.headerProgram}>{detailSupportArticles?.Title}</Text>
                        <Text style={styles.contentTime}>{moment(detailSupportArticles?.CreateDate).format('HH:mm DD/MM/YYYY')}</Text>
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

export default DetailArticles;