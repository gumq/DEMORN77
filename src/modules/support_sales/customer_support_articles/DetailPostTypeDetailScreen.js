import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, Text, Image, ScrollView } from "react-native";

import { colors } from "@themes";
import { styles } from "./styles";
import routes from "@routes";
import { Button, HeaderBack, LoadingModal, SearchBar, SearchModal } from "@components";

const DetailPostTypeDetailScreen = ({ route }) => {
    const item = route?.params?.item;
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { isSubmitting, listSupportArticles } = useSelector(state => state.SupportArticles);

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

    const moveToDetailProgram = (item) => {
        navigation.navigate(routes.DetailArticles, { item: item })
    }

    const renderArticlesByType = () => {
        const articles = searchResults.filter(article => {
            const codes = article.PostTypeDetailCode?.split(',').map(c => c.trim());
            return codes?.includes(item.Code);
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
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    {renderArticlesByType()}
                </ScrollView>
            </SafeAreaView>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    );
}

export default DetailPostTypeDetailScreen;
