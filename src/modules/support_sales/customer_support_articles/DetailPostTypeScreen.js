import React, { useEffect, useState } from "react";
import { SvgUri, SvgXml } from "react-native-svg";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, Text, TouchableOpacity, FlatList, Image, ScrollView, Dimensions } from "react-native";

import { colors } from "@themes";
import { styles } from "./styles";
import { translateLang } from "@store/accLanguages/slide";
import { Button, HeaderBack, LoadingModal, SearchBar, SearchModal } from "@components";
import { arrow_right_blue } from "@svgImg";
import routes from "@routes";
import { scale } from "@resolutions";

const DetailPostTypeScreen = ({ route }) => {
    const item = route?.params?.item;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { isSubmitting, listSupportArticles, listPostType } = useSelector(state => state.SupportArticles);

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

    const renderItem = ({ item }) => {
        const screenWidth = Dimensions.get('window').width;
        const isTwoItems = listPostType.length === 2;

        const cardWidth = isTwoItems
            ? (screenWidth - scale(8) * 3) / 2
            : screenWidth * 0.3;

        return (
            <TouchableOpacity
                style={[styles.card, { width: cardWidth }]}
                onPress={() => handleDetailPostType(item)}
            >
                <View style={styles.iconWrapper}>
                    <SvgUri uri={item.Link} width={32} height={32} />
                </View>
                <Text style={styles.title}>{item.Name}</Text>
            </TouchableOpacity>
        );
    };

    const moveToDetailProgram = (item) => {
        navigation.navigate(routes.DetailArticles, { item: item })
    }

    const handleDetailPostType = (item) => {
        navigation.navigate(routes.DetailPostTypeDetailScreen, { item: item })
    }

    const renderArticlesByType = () => {
        if (!listPostType || listPostType.length === 0) return null;

        if (listPostType.length === 1) {
            const postType = listPostType[0];
            const articles = searchResults.filter(article => {
                const codes = article.PostTypeDetailCode?.split(',').map(c => c.trim());
                return codes?.includes(postType.Code);
            });

            return (
                <View>
                    {articles.map(article => (
                        <Button key={article.ID} onPress={() => moveToDetailProgram(article)} style={styles.cardArticles}>
                            <View style={styles.cardProgram}>
                                {article?.Avatar ? (
                                    <Image source={{ uri: article?.Avatar }} style={styles.img} />
                                ) : (
                                    <View style={styles.noImage} />
                                )}
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
        }

        return listPostType.map(menu => {
            const articles = listSupportArticles
                .filter(article => {
                    const codes = article.PostTypeDetailCode?.split(',').map(c => c.trim());
                    return codes.includes(menu.Code);
                })
                .slice(0, 2);

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
                        <Button key={article.ID} onPress={() => moveToDetailProgram(article)} style={styles.cardArticles}>
                            <View style={styles.cardProgram}>
                                {article?.Avatar ? (
                                    <Image source={{ uri: article?.Avatar }} style={styles.img} />
                                ) : (
                                    <View style={styles.noImage} />
                                )}
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
            <SafeAreaView style={styles.container}>
                <HeaderBack
                    title={item?.Name}
                    onPress={() => navigation.goBack()}
                />
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
                <View style={styles.containerMenu}>

                </View>
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    {listPostType.length > 1 && (
                        <FlatList
                            data={listPostType}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => `${item.ID}-${index}`}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.row}
                        />
                    )}
                    {renderArticlesByType()}
                </ScrollView>
            </SafeAreaView>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    );
}

export default DetailPostTypeScreen;
