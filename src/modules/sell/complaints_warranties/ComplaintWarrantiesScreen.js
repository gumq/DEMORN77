import React, { useEffect, useState } from "react";
import moment from "moment";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, ScrollView, LogBox, RefreshControl, FlatList, Dimensions, Text } from "react-native";

import { styles } from './styles';
import routes from "modules/routes";
import { noData, plus_white } from "svgImg";
import { translateLang } from "store/accLanguages/slide";
import { Button, HeaderBack, LoadingModal, SearchBar, SearchModal } from "components";
import { fetchListCustomerByUserID } from "store/accAuth/thunk";
import { fetchDetailComplaintWarranties, fetchListCategoryTypeComplaint, fetchListComplaintWarranties } from "store/acc_Complaint_Warranties/thunk";

const { height } = Dimensions.get('window')
const ComplaintWarrantiesScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang)
    const [isRefreshing, setRefresh] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { userInfo } = useSelector(state => state.Login);
    const { isSubmitting, listComplaintWarraties } = useSelector(state => state.ComplaintWarranties);

    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"])

        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(fetchListComplaintWarranties())
        });
        return unsubscribe;
    }, [navigation])

    const refreshEvent = () => {
        setRefresh(true);
        dispatch(fetchListComplaintWarranties())
        setRefresh(false);
    };

    const onChangeText = textSearch => {
        if (textSearch?.length) {
            setSearchText(textSearch);
            const resultsData = SearchModal(listComplaintWarraties, textSearch);
            setSearchResults(resultsData);
        } else {
            setSearchResults(listComplaintWarraties);
        }
    };

    const moveToDetailCusRequirement = (item) => {
        const body = { OID: item?.OID }
        dispatch(fetchDetailComplaintWarranties(body))
        if (item?.IsLock === 1) {
            navigation.navigate(routes.DetailComplaintWarrantiesScreen, { item: item })
        } else {
            navigation.navigate(routes.FormComplaintWarranties, { item: item, editComplaint: true })
        }

    }

    const itemHeight = 30 + 22 + 46 + 22 + 110 + 30;
    const numberOfItemsInScreen = Math.ceil(height / itemHeight);
    const windowSize = numberOfItemsInScreen * 2;

    const _keyExtractor = (item, index) => `${item.OID}-${index}`;
    const _renderItem = ({ item }) => {
        return (
            <Button onPress={() => moveToDetailCusRequirement(item)}>
                <View style={styles.cardProgram}>
                    <Text style={styles.headerProgram}>{item?.OID} - {moment(item?.ODate).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.txtProposal}>{item?.EntryName}</Text>
                    <View style={styles.bodyCard}>
                        {item?.CustomerName ?
                            <View style={styles.containerBodyText}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_customer')}</Text>
                                <Text style={styles.contentBody}>{item?.CustomerName}</Text>
                            </View>
                            : null
                        }
                        {item?.Content ?
                            <View style={styles.containerBodyText}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_content')}</Text>
                                <Text style={styles.contentBody}>{item?.Content}</Text>
                            </View>
                            : null
                        }

                        {item?.Note ?
                            <View style={styles.containerBodyText}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_note')}</Text>
                                <Text style={styles.contentBody}>{item?.Note}</Text>
                            </View>
                            : null
                        }
                    </View>
                    <View style={styles.containerFooterCard}>
                        <Text style={styles.contentTimeApproval}>{languageKey('_update')} {moment(item?.ChangeDate).format('HH:mm DD/MM/YYYY')}</Text>
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
        setSearchResults(listComplaintWarraties)
    }, [listComplaintWarraties])

    useEffect(() => {
        dispatch(fetchListCategoryTypeComplaint())
        const bodyCustomer = {
            CustomerRepresentativeID: userInfo?.UserID || 0,
            // SalesStaffID: null,
            // Function: 'Default'
              CmpnID:userInfo?.CmpnID,
        }
        dispatch(fetchListCustomerByUserID(bodyCustomer));
    }, [])

    return (
        <LinearGradient style={styles.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView>
                <HeaderBack
                    title={languageKey('_complaint_warranties')}
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
                onPress={() => navigation.navigate(routes.FormComplaintWarranties)}
            >
                <SvgXml xml={plus_white} />
            </Button>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    )
}

export default ComplaintWarrantiesScreen;