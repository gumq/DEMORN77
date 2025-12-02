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
import { fetchListExhibitionPrograms } from "store/accExhibition_Programs/thunk";
import { fetchListCustomerByUserID } from "store/accAuth/thunk";

const { height } = Dimensions.get('window')
const ExhibitionProgramScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang)
    const [isRefreshing, setRefresh] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { userInfo } = useSelector(state => state.Login);
    const { isSubmitting, listExhibitionPrograms } = useSelector(state => state.ExhibitionPrograms);

    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"])

        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(fetchListExhibitionPrograms())
        });
        return unsubscribe;
    }, [navigation])

    const refreshEvent = () => {
        setRefresh(true);
        dispatch(fetchListExhibitionPrograms())
        setRefresh(false);
    };

    const onChangeText = textSearch => {
        if (textSearch?.length) {
            setSearchText(textSearch);
            const resultsData = SearchModal(listExhibitionPrograms, textSearch);
            setSearchResults(resultsData);
        } else {
            setSearchResults(listExhibitionPrograms);
        }
    };

    const moveToDetailProgram = (item) => {
        navigation.navigate(routes.DetailExhibitionProgram, { item: item })
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
                            <Text style={styles.txtHeaderTime}>{item?.Interpretation}</Text>
                        </View>
                    </View>
                </View>
            </Button>
        );
    };

    useEffect(() => {
        setSearchResults(listExhibitionPrograms)
    }, [listExhibitionPrograms])

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
            <SafeAreaView>
                <HeaderBack
                    title={languageKey('_exhibition_program')}
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
                            initialNumToRender={numberOfItemsInScreen}
                            maxToRenderPerBatch={numberOfItemsInScreen}
                            windowSize={windowSize}
                            removeClippedSubviews={true}
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

export default ExhibitionProgramScreen;