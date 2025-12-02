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
import { fetchListHandOverDoc } from "store/accHand_Over_Doc/thunk";
import { fetchListCustomerByUserID } from "store/accAuth/thunk";
import { fetchListUser } from "store/accApproval_Signature/thunk";

const { height } = Dimensions.get('window')
const HandOverDocumentScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang)
    const [isRefreshing, setRefresh] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { userInfo } = useSelector(state => state.Login);
    const { detailMenu } = useSelector(state => state.Home);
    const { isSubmitting, listHandOverDoc } = useSelector(state => state.HandOverDoc);

    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"])

        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(fetchListHandOverDoc())
        });
        return unsubscribe;
    }, [navigation])

    const refreshEvent = () => {
        setRefresh(true);
        dispatch(fetchListHandOverDoc())
        setRefresh(false);
    };

    const onChangeText = textSearch => {
        if (textSearch?.length) {
            setSearchText(textSearch);
            const resultsData = SearchModal(listHandOverDoc, textSearch);
            setSearchResults(resultsData);
        } else {
            setSearchResults(listHandOverDoc);
        }
    };

    const moveToDetailCusRequirement = (item) => {
        navigation.navigate(routes.DetailHandOverDocScreen, { item: item })
    }

    const itemHeight = 30 + 22 + 46 + 22 + 110 + 30;
    const numberOfItemsInScreen = Math.ceil(height / itemHeight);
    const windowSize = numberOfItemsInScreen * 2;

    const _keyExtractor = (item, index) => `${item.OID}-${index}`;
    const _renderItem = ({ item }) => {
        return (
            <Button onPress={() => moveToDetailCusRequirement(item)}>
                <View style={styles.cardProgram}>
                    <Text style={styles.headerProgram}>{item?.OID}</Text>
                    <Text style={styles.txtProposal}>{item?.EntryName}</Text>

                    <View style={styles.bodyCard}>
                        <View style={styles.itemBody}>
                            {item?.DelivererName ?
                                <View style={styles.containerBody}>
                                    <Text style={styles.txtHeaderBody}>{languageKey('_deliverer')}</Text>
                                    <Text
                                        style={styles.contentBody}
                                        numberOfLines={3}
                                        ellipsizeMode="tail"
                                    >
                                        {item?.DelivererName}
                                    </Text>
                                </View>
                                : null
                            }
                            {item?.RecipientName ?
                                <View style={styles.containerBody}>
                                    <Text style={styles.txtHeaderBody}>{languageKey('_receiver')}</Text>
                                    <Text style={styles.contentBody}>{item?.RecipientName}</Text>
                                </View>
                                : null
                            }
                        </View>
                        {item?.CustomerName ?
                            <View style={styles.containerBody}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_delivered_to_customers')}</Text>
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
                    </View>
                    <View style={styles.containerFooterCard}>
                        <Text style={styles.contentTimeApproval}>{languageKey('_update')} {moment(item?.ChangeDate).format('HH:mm DD/MM/YYYY')}</Text>
                        <View style={[styles.bodyStatus, { backgroundColor: item?.ApprovalStatusColor.toLowerCase() }]}>
                            <Text style={[styles.txtStatus, { color: item?.ApprovalStatusTextColor.toLowerCase() }]}>
                                {item?.ApprovalStatusName}
                            </Text>
                        </View>
                    </View>
                </View>
            </Button>
        );
    };

    useEffect(() => {
        setSearchResults(listHandOverDoc)
    }, [listHandOverDoc])

    useEffect(() => {
        const bodyCustomer = {
            CustomerRepresentativeID: userInfo?.UserID || 0,
            // SalesStaffID: null,
            // Function: 'Default'
              CmpnID:userInfo?.CmpnID,
        }
        dispatch(fetchListCustomerByUserID(bodyCustomer))
           dispatch(fetchListUser({CmpnID: userInfo?.CmpnID}));
    }, [])

    return (
        <LinearGradient style={styles.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView >
                <HeaderBack
                    title={languageKey('_hand_over_documents')}
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
                onPress={() => navigation.navigate(routes.FormHandOverDocument)}
                disabled={detailMenu?.accessAdd === 0}
            >
                <SvgXml xml={plus_white} />
            </Button>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    )
}

export default HandOverDocumentScreen;