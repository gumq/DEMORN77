import React, { useEffect, useState } from "react";
import moment from "moment";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, ScrollView, LogBox, RefreshControl, FlatList, Dimensions, Text } from "react-native";

import { styles } from './styles'
import routes from "modules/routes";
import { noData, plus_white } from "svgImg";
import { translateLang } from "store/accLanguages/slide";
import { Button, HeaderBack, LoadingModal, SearchBar, SearchModal } from "components";
import { fetchListJob } from "store/accJob_List/thunk";

const { height } = Dimensions.get('window')
const JobListScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang)
    const [isRefreshing, setRefresh] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { detailMenu } = useSelector(state => state.Home);
    const { isSubmitting, listJob } = useSelector(state => state.JobList);

    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"])

        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(fetchListJob())
        });
        return unsubscribe;
    }, [navigation])

    const refreshEvent = () => {
        setRefresh(true);
        dispatch(fetchListJob())
        setRefresh(false);
    };

    const onChangeText = textSearch => {
        if (textSearch?.length) {
            setSearchText(textSearch);
            const resultsData = SearchModal(listJob, textSearch);
            setSearchResults(resultsData);
        } else {
            setSearchResults(listJob);
        }
    };

    const moveToDetailJob = (item) => {
        navigation.navigate(routes.DetailJobListScreen, { item: item })
    }

    const itemHeight = 30 + 22 + 46 + 22 + 110 + 30;
    const numberOfItemsInScreen = Math.ceil(height / itemHeight);
    const windowSize = numberOfItemsInScreen * 2;

    const _keyExtractor = (item, index) => `${item.OID}-${index}`;
    const _renderItem = ({ item }) => {
        return (
            <Button onPress={() => moveToDetailJob(item)}>
                <View style={styles.cardProgram}>
                    <Text style={styles.headerProgram}>{item?.OID} - {moment(item?.ODate).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.txtProposal}>{item?.CustomerRequestTypeName}</Text>
                    <View style={styles.bodyCard}>
                        {item?.OwnerContent ?
                            <View style={styles.containerBody}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_request_content')}</Text>
                                <Text
                                    style={styles.contentBody}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {item?.OwnerContent}
                                </Text>
                            </View>
                            : null
                        }
                        {item?.CustomerName ?
                            <View style={styles.containerBody}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_customer')}</Text>
                                <Text
                                    style={styles.contentBody}
                                    numberOfLines={3}
                                    ellipsizeMode="tail"
                                >
                                    {item?.CustomerName}
                                </Text>
                            </View>
                            : null
                        }
                        <View style={styles.containerGeneralInfor} >
                            <View style={styles.containerBody}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_request_creator')}</Text>
                                <Text style={styles.contentBodyKes}>{item?.CreateUserFullName}</Text>
                            </View>
                            <View style={styles.containerBody}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_department')}</Text>
                                <Text style={styles.contentBodyKes}>{item?.OwnerDeparmentName}</Text>
                            </View>
                        </View>
                        <View style={styles.containerGeneralInfor} >
                            <View style={styles.containerBody}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_implementer')}</Text>
                                <Text style={styles.contentBodyKes}>{item?.OwnerName}</Text>
                            </View>
                            <View style={styles.containerBody}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_requested_time')}</Text>
                                <Text style={styles.contentBodyKes}>{moment(item?.CreateDate).format('HH:mm DD/MM/YYYY')}</Text>
                            </View>
                        </View>
                        {item?.OwnerNote ?
                            <View style={styles.containerBody}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_note')}</Text>
                                <Text style={styles.contentBody}>{item?.OwnerNote}</Text>
                            </View>
                            : null
                        }
                    </View>
                    <View style={styles.containerFooterCard}>
                        <Text style={styles.contentTimeApproval}>{languageKey('_update')} {moment(item?.ChangeDate).format('HH:mm DD/MM/YYYY')}</Text>
                        <View style={[styles.bodyStatus, { backgroundColor: item?.StatusColor }]}>
                            <Text style={[styles.txtStatus, { color: item?.StatusTextColor }]}>
                                {item?.StatusName}
                            </Text>
                        </View>
                    </View>

                </View>
            </Button>
        );
    };

    useEffect(() => {
        setSearchResults(listJob)
    }, [listJob])

    return (
        <LinearGradient style={styles.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView>
                <HeaderBack
                    title={languageKey('_job_list')}
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
                            contentContainerStyle={styles.flatListContainer}
                            showsVerticalScrollIndicator={false}
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
            <Button
                style={styles.btnAdd}
                disabled={detailMenu?.accessAdd === 0}
            >
                <SvgXml xml={plus_white} />
            </Button>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    )
}

export default JobListScreen;