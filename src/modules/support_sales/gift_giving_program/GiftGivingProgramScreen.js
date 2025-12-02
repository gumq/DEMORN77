import React, { useEffect, useState } from "react";
import moment from "moment";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, ScrollView, LogBox, RefreshControl, FlatList, Dimensions, Text, Image } from "react-native";

import { noData } from "svgImg";
import { styles } from './styles'
import routes from "modules/routes";
import { translateLang } from "store/accLanguages/slide";
import { Button, HeaderBack, LoadingModal, SearchBar, SearchModal } from "components";
import { fetchListGiftPrograms } from "store/accGift_Program/thunk";
import { fetchListCustomerByUserID } from "store/accAuth/thunk";

const { height } = Dimensions.get('window')
const GiftGivingProgramScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang)
    const [isRefreshing, setRefresh] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { userInfo } = useSelector(state => state.Login);
    const { isSubmitting, listGiftPrograms } = useSelector(state => state.GiftProgram);

    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"])

        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(fetchListGiftPrograms())
        });
        return unsubscribe;
    }, [navigation])

    const refreshEvent = () => {
        setRefresh(true);
        dispatch(fetchListGiftPrograms())
        setRefresh(false);
    };

    const onChangeText = textSearch => {
        if (textSearch?.length) {
            setSearchText(textSearch);
            const resultsData = SearchModal(listGiftPrograms, textSearch);
            setSearchResults(resultsData);
        } else {
            setSearchResults(listGiftPrograms);
        }
    };

    const moveToDetailProgram = (item) => {
        navigation.navigate(routes.DetailGiftProgram, { item: item })
    }

    const itemHeight = 30 + 8 + 22;
    const numberOfItemsInScreen = Math.ceil(height / itemHeight);
    const windowSize = numberOfItemsInScreen * 2;

    const _keyExtractor = (item, index) => `${item.OID}-${index}`;
    const _renderItem = ({ item }) => {
        return (
            <Button onPress={() => moveToDetailProgram(item)}>
                <View style={styles.cardProgram}>
                    <Image source={{ uri: item?.Link }} style={styles.img} />
                    <View style={styles.containerContent}>
                        <Text style={styles.headerProgram}>{item?.Name}</Text>
                        <Text style={styles.contentTime}>{moment(item?.FromDate).format('DD/MM/YYYY')} - {moment(item?.ToDate).format('DD/MM/YYYY')}</Text>

                        <View style={styles.timeProgram}>
                            <Text style={styles.txtHeaderTime}>{item?.TargetNote}</Text>
                        </View>
                    </View>
                </View>
            </Button>
        );
    };

    useEffect(() => {
        setSearchResults(listGiftPrograms)
    }, [listGiftPrograms])

    useEffect(() => {
        const bodyCustomer = {
            CustomerRepresentativeID: userInfo?.UserID || 0,
            // SalesStaffID: null,
            // Function: 'Default'
              CmpnID:userInfo?.CmpnID,
        }
        dispatch(fetchListCustomerByUserID(bodyCustomer))
    }, [])

    return (
        <LinearGradient style={styles.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView style={styles.container}>
                <HeaderBack
                    title={languageKey('_gift_giving_program')}
                    onPress={() => navigation.goBack()}
                />
                <View style={styles.scrollView}>
                    <View style={styles.containerSearch}>
                        <View style={styles.search}>
                            <SearchBar
                                value={searchText}
                                onChangeText={text => {
                                    setSearchText(text);
                                    onChangeText(text);
                                }}
                            />
                        </View>
                    </View>
                    {searchResults?.length > 0 ? (
                        <FlatList
                            data={searchResults}
                            renderItem={_renderItem}
                            keyExtractor={_keyExtractor}
                            contentContainerStyle={styles.flatFooter}
                            initialNumToRender={numberOfItemsInScreen}
                            maxToRenderPerBatch={numberOfItemsInScreen}
                            windowSize={windowSize}
                            removeClippedSubviews={true}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl refreshing={isRefreshing} onRefresh={refreshEvent} />
                            }
                        />
                    ) : (
                        <ScrollView
                            refreshControl={
                                <RefreshControl refreshing={isRefreshing} onRefresh={refreshEvent} />
                            }
                        >
                            <View>
                                <Text style={styles.txtHeaderNodata}>{languageKey('_no_data')}</Text>
                                <Text style={styles.txtContent}>{languageKey('_we_will_back')}</Text>
                                <SvgXml xml={noData} style={styles.imgEmpty} />
                            </View>
                        </ScrollView>
                    )}
                </View>
            </SafeAreaView>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    )
}

export default GiftGivingProgramScreen;