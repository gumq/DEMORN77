import React, { useEffect, useState } from "react";
import moment from "moment";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, ScrollView, LogBox, RefreshControl, FlatList, Dimensions, Text } from "react-native";

import { styles } from './styles'
import routes from "@routes";
import { noData, plus_white } from "@svgImg";
import { translateLang } from "@store/accLanguages/slide";
import { Button, HeaderBack, LoadingModal, SearchBar, SearchModal } from "@components";
import { fetchListCatalogue } from "@store/accOther_Proposal/thunk";
import { fetchListEntry } from "@store/accCus_Requirement/thunk";

const { height } = Dimensions.get('window')
const FormShowrooomScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang)
    const [isRefreshing, setRefresh] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { detailMenu } = useSelector(state => state.Home);
    const { isSubmitting, listCatalogue } = useSelector(state => state.OtherProposal);

    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"])

        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(fetchListCatalogue())
        });
        return unsubscribe;
    }, [navigation])

    const refreshEvent = () => {
        setRefresh(true);
        dispatch(fetchListCatalogue())
        setRefresh(false);
    };

    const onChangeText = textSearch => {
        if (textSearch?.length) {
            setSearchText(textSearch);
            const resultsData = SearchModal(listCatalogue, textSearch);
            setSearchResults(resultsData);
        } else {
            setSearchResults(listCatalogue);
        }
    };

    const moveToDetailProgram = (item) => {
        navigation.navigate(routes.DetailCatalogueScreen, { item: item });
    }

    const itemHeight = 30 + 22 + 48 + 48 + 48 + 26;
    const numberOfItemsInScreen = Math.ceil(height / itemHeight);
    const windowSize = numberOfItemsInScreen * 2;

    const _keyExtractor = (item, index) => `${item.OID}-${index}`;
    const _renderItem = ({ item }) => {
        return (
            <Button onPress={() => moveToDetailProgram(item)}>
                <View style={styles.cardProgram}>
                    <Text style={styles.headerProgram}>{item?.OID} - {moment(item?.ODate).format('DD/MM/YYYY')}</Text>
                    {item?.IsCustomer === 1 ?
                        <Text style={styles.txtProposalCustomer}>{item?.EntryName} - {languageKey('_customer_suggested')}</Text>
                        :
                        <Text style={styles.txtProposal}>{item?.EntryName}</Text>
                    }

                    <View style={styles.bodyCard}>
                        <View style={styles.containerContent}>
                            {item?.RequestDate ?
                                <View style={styles.containerBody}>
                                    <Text style={styles.txtHeaderBody}>{languageKey('_request_deadline')}</Text>
                                    <Text style={styles.contentBody}>{moment(item?.RequestDate).format('DD/MM/YYYY')}</Text>
                                </View>
                                : null
                            }
                            {item?.GiftAmount ?
                                <View style={styles.containerBody}>
                                    <Text style={styles.txtHeaderBody}>{languageKey('_donation_costs')}</Text>
                                    <Text style={styles.contentBody}>{item?.GiftAmount.toLocaleString()}</Text>
                                </View>
                                : null
                            }
                        </View>
                        <View style={styles.containerContent}>
                            {item?.ConsignmentAmount ?
                                <View style={styles.containerBody}>
                                    <Text style={styles.txtHeaderBody}>{languageKey('_consignment_fees')}</Text>
                                    <Text style={styles.contentBody}>{item?.ConsignmentAmount.toLocaleString()}</Text>
                                </View>
                                : null
                            }
                            {item?.TotalAmount ?
                                <View style={styles.containerBody}>
                                    <Text style={styles.txtHeaderBody}>{languageKey('_total_cost')}</Text>
                                    <Text style={styles.contentBody}>{item?.TotalAmount.toLocaleString()}</Text>
                                </View>
                                : null
                            }
                        </View>
                        {item?.Content ?
                            <View style={styles.containerBody}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_proposed_purpose')}</Text>
                                <Text
                                    style={styles.contentBody}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {item?.Content}
                                </Text>
                            </View>
                            : null
                        }
                    </View>
                    <View style={styles.containerFooterCard}>
                        <Text style={styles.contentTimeApproval}>{languageKey('_update')} {moment(item?.ApprovalDate).format('HH:mm DD/MM/YYYY')}</Text>
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
        setSearchResults(listCatalogue)
    }, [listCatalogue]);

    useEffect(() => {
        const body = {
            FactorID: detailMenu?.factorId,
            EntryID: detailMenu?.entryId
        }
        dispatch(fetchListEntry(body))
    }, []);
    
    return (
        <LinearGradient style={styles.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView>
                <HeaderBack
                    title={languageKey('_materials_proposal')}
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
            <Button style={styles.btnAdd}
                onPress={() => navigation.navigate(routes.FormCatalogueScreen)}
            >
                <SvgXml xml={plus_white} />
            </Button>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    )
}

export default FormShowrooomScreen;