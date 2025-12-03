import React, { useEffect, useState } from "react";
import Swiper from 'react-native-swiper';
import { SvgUri, SvgXml } from "react-native-svg";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, LogBox, Text, TouchableOpacity, FlatList, Image, ScrollView } from "react-native";

import { colors } from "@themes";
import { styles } from "./styles";
import { translateLang } from "@store/accLanguages/slide";
import { Button, HeaderBack, LoadingModal, SearchBar, SearchModal } from "@components";
import { fetchListMenu, fetchListPostType, fetchListSupportArticles } from "@store/accCustomer_Support_Articles/thunk";
import { arrow_right_blue } from "@svgImg";
import routes from "@routes";
import { hScale } from "@resolutions";

const CustomerSupportArticlesScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { isSubmitting, listSupportArticles, listMenuParent, listBanner } = useSelector(state => state.SupportArticles);

    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
        const unsubscribe = navigation.addListener('focus', () => {
            const body = {
                "CategoryType": "Posts"
            };
            dispatch(fetchListSupportArticles(body));
            dispatch(fetchListMenu());
        });
        return unsubscribe;
    }, [navigation]);

    const onChangeText = textSearch => {
        if (textSearch?.length) {
            setSearchText(textSearch);
            const resultsData = SearchModal(listSupportArticles, textSearch);
            setSearchResults(resultsData);
        } else {
            setSearchResults(listSupportArticles);
        }
    };

    useEffect(() => {
        setSearchResults(listSupportArticles);
    }, [listSupportArticles]);

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleDetailPostType(item)}>
            <View style={styles.iconWrapper}>
                <SvgUri uri={item.Link} width={32} height={32} />
            </View>
            <Text style={styles.title}>{item.Name}</Text>
        </TouchableOpacity>
    );

    const moveToDetailProgram = (item) => {
        navigation.navigate(routes.DetailArticles, { item: item })
    }

    const moveToDetailBanner = (item) => {
        navigation.navigate(routes.DetailArticles, { item: item, detailBanner: true })
    }

    const handleDetailPostType = (item) => {
        const body = {
            CategoryType: "PostTypeDetail",
            CategoryGeneralsID: item?.ID
        }
        dispatch(fetchListPostType(body))
        navigation.navigate(routes.DetailPostTypeScreen, { item: item })
    }

    const renderArticlesByType = () => {
        return listMenuParent.map(menu => {
            const articles = searchResults.filter(article => article.PostTypeID === menu.ID).slice(0, 2);

            if (articles.length === 0) return null;

            return (
                <View key={menu.ID} style={styles.sectionContainer}>
                    <View style={styles.containerHeader}>
                        <Text style={styles.sectionTitle}>{menu.Name}</Text>
                        <Button style={styles.headerSee} onPress={() => handleDetailPostType(menu)}>
                            <Text style={styles.txtSee}>{languageKey('_see_all')}</Text>
                            <SvgXml xml={arrow_right_blue} />
                        </Button>
                    </View>
                    {articles.map(article => (
                        <Button onPress={() => moveToDetailProgram(article)} style={styles.cardArticles} key={article?.ID}>
                            <View style={styles.cardProgram}>
                                {article?.Avatar ?
                                    <Image source={{ uri: article?.Avatar }} style={styles.img} />
                                    :
                                    <View style={styles.noImage} />
                                }

                                <View style={styles.containerContent}>
                                    <Text style={styles.headerProgram}>{article?.Title}</Text>
                                    <Text style={styles.contentTime}>{moment(article?.CreateDate).format('HH:mm DD/MM/YYYY')}</Text>
                                    <View style={styles.badgeContainer}>
                                        {article?.PostTypeDetailName?.split(',').map((typeName, index) => (
                                            <View
                                                key={index}
                                                style={[styles.bodyStatus, { backgroundColor: '#DBEAFE', marginRight: 4 }]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.txtStatus,
                                                        { color: '#1E40AF' }
                                                    ]}
                                                >
                                                    {typeName.trim()}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </Button>
                    ))}
                </View>
            );
        });
    };

    return (
        <LinearGradient
            style={styles.container}
            start={{ x: 0.44, y: 0.45 }}
            end={{ x: 1.22, y: 0.25 }}
            colors={['#FFFFFF', '#FFFFFF']}
            pointerEvents="box-none"
        >
            <StatusBar
                animated={true}
                backgroundColor={colors.white}
                barStyle={'dark-content'}
                translucent={true}
            />
            <SafeAreaView style={{ flex: 1 }}>
                <HeaderBack
                    title={languageKey('_sales_support_articles')}
                    onPress={() => navigation.goBack()}
                />
                <View>
                    <View style={styles.containerSearch}>
                        <View style={styles.search}>
                            <SearchBar
                                value={searchText}
                                onChangeText={(text) => {
                                    setSearchText(text);
                                    onChangeText(text);
                                }}
                            />
                        </View>
                    </View>
                </View>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ height: hScale(200) }}>
                        <Swiper
                            autoplay
                            autoplayTimeout={3}
                            showsPagination
                            loop
                        >
                            {listBanner.map((item, index) => (
                                <TouchableOpacity key={item?.ID || index} onPress={() => moveToDetailBanner(item)}>
                                    <Image
                                        source={{ uri: item?.Link }}
                                        style={styles.slide}
                                    />
                                </TouchableOpacity>
                            ))}
                        </Swiper>
                    </View>
                    <FlatList
                        data={listMenuParent}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `${item.ID}-${index}`}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.row}
                    />
                    {renderArticlesByType()}
                </ScrollView>
            </SafeAreaView>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    );
}

export default CustomerSupportArticlesScreen;
