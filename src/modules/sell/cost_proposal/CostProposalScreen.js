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
import { fetchListCustomers } from "store/accApproval_Signature/thunk";
import { Button, HeaderBack, LoadingModal, SearchBar, SearchModal } from "components";
import { fetchListCategoryTypeCostProposal, fetchListCostProposal } from "store/accCost_Proposal/thunk";

const { height } = Dimensions.get('window')
const CostProposalScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang)
    const [isRefreshing, setRefresh] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { isSubmitting, listCostProposal } = useSelector(state => state.CostProposal);

    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"])

        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(fetchListCostProposal())
        });
        return unsubscribe;
    }, [navigation])

    const refreshEvent = () => {
        setRefresh(true);
        dispatch(fetchListCostProposal())
        setRefresh(false);
    };

    const onChangeText = textSearch => {
        if (textSearch?.length) {
            setSearchText(textSearch);
            const resultsData = SearchModal(listCostProposal, textSearch);
            setSearchResults(resultsData);
        } else {
            setSearchResults(listCostProposal);
        }
    };

    const moveToDetailCusRequirement = (item) => {
        navigation.navigate(routes.DetailCostProposalScreen, { item: item })
    }

    const itemHeight = 30 + 22 + 46 + 22 + 110 + 30;
    const numberOfItemsInScreen = Math.ceil(height / itemHeight);
    const windowSize = numberOfItemsInScreen * 2;

    const _keyExtractor = (item, index) => `${item.OID}-${index}`;
    const _renderItem = ({ item }) => {
        return (
            <Button onPress={() => moveToDetailCusRequirement(item)}>
                <View style={styles.cardProgram}>
                    <View style={styles.containerFooterCard}>
                        <Text style={styles.headerProgram}>{item?.OID} - {moment(item?.ODate).format('DD/MM/YYYY')}</Text>
                        <View style={[styles.bodyStatus, { backgroundColor: item?.ApprovalStatusColor }]}>
                            <Text style={[styles.txtStatus, { color: item?.ApprovalStatusTextColor }]}>
                                {item?.ApprovalStatusName}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.txtProposal}>{item?.ProposalType}</Text>
                    <View style={styles.bodyCard}>
                        {item?.UserFullName ?
                            <View style={styles.containerBody}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_staff_recommneded')}</Text>
                                <Text style={styles.contentBody}>{item?.UserFullName}</Text>
                            </View>
                            : null
                        }
                        {item?.ReferenceID ?
                            <View style={styles.containerBody}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_content')}</Text>
                                <Text style={styles.contentBody}>{item?.ReferenceID}</Text>
                            </View>
                            : null
                        }
                        <View style={styles.containerContent}>
                            {item?.DeliveryDueDate ?
                                <View style={styles.containerBody}>
                                    <Text style={styles.txtHeaderBody}>{languageKey('_order_date')}</Text>
                                    <Text style={styles.contentBody}>{moment(item?.DeliveryDueDate).format('DD/MM/YYYY')}</Text>
                                </View>
                                : null
                            }
                            {item?.ExpectedDeliveryDate ?
                                <View style={styles.containerBody}>
                                    <Text style={styles.txtHeaderBody}>{languageKey('_order_deadline')}</Text>
                                    <Text style={styles.contentBody}>{moment(item?.ExpectedDeliveryDate).format('DD/MM/YYYY')}</Text>
                                </View>
                                : null
                            }
                            {item?.TotalAmount ?
                                <View style={styles.containerBody}>
                                    <Text style={styles.txtHeaderBody}>{languageKey('_total_proposal')}</Text>
                                    <Text style={styles.contentBody}>{item?.TotalAmount}</Text>
                                </View>
                                : null
                            }
                        </View>
                        {item?.ProposalReason ?
                            <View style={styles.containerBody}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_suggested_reason')}</Text>
                                <Text style={styles.contentBody}>{item?.ProposalReason}</Text>
                            </View>
                            : null
                        }
                        {item?.Note ?
                            <View style={styles.containerBody}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_note')}</Text>
                                <Text style={styles.contentBody}>{item?.Note}</Text>
                            </View>
                            : null
                        }
                    </View>
                </View>
            </Button>
        );
    };

    useEffect(() => {
        setSearchResults(listCostProposal)
    }, [listCostProposal])

    useEffect(() => {
        dispatch(fetchListCustomers())
        dispatch(fetchListCategoryTypeCostProposal())
    }, [])

    return (
        <LinearGradient style={styles.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
             <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView>
                <HeaderBack
                    title={languageKey('_cost_proposal')}
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
            <Button style={styles.btnAdd}
                onPress={() => navigation.navigate(routes.FormCostProposal)}
            >
                <SvgXml xml={plus_white} />
            </Button>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    )
}

export default CostProposalScreen;