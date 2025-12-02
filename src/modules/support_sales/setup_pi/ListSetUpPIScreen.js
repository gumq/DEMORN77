import React, { useEffect, useState } from "react";
import moment from "moment";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, ScrollView, RefreshControl, FlatList, Dimensions, Text } from "react-native";

import { noData } from "svgImg";
import { styles } from './styles'
import routes from "modules/routes";
import { translateLang } from "store/accLanguages/slide";
import { fetchDetailPI, fetchListSetUpPI } from "store/accSetup_PI/thunk";
import { Button, HeaderBack, LoadingModal, SearchBar, SearchModal } from "components";
import { scale } from "utils/resolutions";

const { height } = Dimensions.get('window')

const ListSetUpPIScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang)
    const [isRefreshing, setRefresh] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { isSubmitting, detailSetUpPI } = useSelector(state => state.SetUpDetailPI);

    const refreshEvent = () => {
        setRefresh(true);
        dispatch(fetchListSetUpPI())
        setRefresh(false);
    };

    const onChangeText = textSearch => {
        if (textSearch?.length) {
            setSearchText(textSearch);
            const resultsData = SearchModal(detailSetUpPI?.Allocations, textSearch);
            setSearchResults(resultsData);
        } else {
            setSearchResults(detailSetUpPI?.Allocations);
        }
    };

    const navigateDetailPI = async (item) => {
        const body = {
            ID: item.ID
        }
        dispatch(fetchDetailPI(body));
        if (item?.IsLock === 1) {
            navigation.navigate(routes.DetailSetUpPIScreen, { item: item })
        } else {
            navigation.navigate(routes.FormSetUpPIScreen, { item: item })
        }
    }

    const itemHeight = 30 + 8 + 22;
    const numberOfItemsInScreen = Math.ceil(height / itemHeight);
    const windowSize = numberOfItemsInScreen * 2;

    const _keyExtractor = (item, index) => `${item.OID}-${index}`;
    const _renderItem = ({ item }) => {
        return (
            <Button onPress={() => navigateDetailPI(item)}>
                <View style={styles.cardProgram}>
                    <Text style={styles.headerProgramPI}>{item?.Name}</Text>
                    {item?.Note ?
                        <View style={styles.timeProgram}>
                            <Text style={styles.txtHeaderTime}>{languageKey('_note')}</Text>
                            <Text style={styles.contentTime}>{item?.Note}</Text>
                        </View>
                        : null
                    }
                    <View style={styles.containerHeader}>
                        <View style={styles.containerTime}>
                            <Text style={[styles.txtHeaderTime, { marginRight: scale(4) }]}>{languageKey('_update')}</Text>
                            <Text style={styles.contentTime}>{moment(item?.ChangeDate).format('HH:mm DD/MM/YYYY')}</Text>
                        </View>
                        <View style={[styles.bodyStatus, { backgroundColor: item?.ApprovalStatusColor }]}>
                            <Text style={[styles.txtStatus, { color: item?.ApprovalStatusTextColor }]}>
                                {item?.ApprovalStatusName}
                            </Text>
                        </View>
                    </View>
                </View>
            </Button>
        );
    };

    useEffect(() => {
        setSearchResults(detailSetUpPI?.Allocations)
    }, [detailSetUpPI?.Allocations])

    return (
        <LinearGradient style={styles.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView>
                <HeaderBack
                    title={languageKey('_set_up_pi_details')}
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
                            style={styles.flatScroll}
                            getItemLayout={(index) => ({
                                length: itemHeight,
                                offset: itemHeight * index,
                                index,
                            })}
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

export default ListSetUpPIScreen;