import React, { useEffect, useState } from "react";
import { SvgXml } from "react-native-svg";
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { View, StatusBar, ScrollView, LogBox, RefreshControl, FlatList, Dimensions, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from './styles'
import { translateLang } from "store/accLanguages/slide";
import { Button, HeaderBack, LoadingModal, SearchBar, SearchModal } from "@components";
import { fetchListGoodTypes, fetchListInventories } from "store/accInventory/thunk";
import { arrow_down_big, checkbox, checkbox_active, noData } from "svgImg";
import routes from "modules/routes";

const { height } = Dimensions.get('window')

const InventoryRenewalScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const languageKey = useSelector(translateLang);
    const [isRefreshing, setRefresh] = useState(false);
    const { isSubmitting, listInventories, listGoodsTypes } = useSelector(state => state.Inventory);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isOpenModalFilter, setIsOpenModalFilter] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const TAB_DETAILS_PROGRAM = [
        { id: 1, label: languageKey('_inventory_information') },
        { id: 2, label: languageKey('_recommend_keeping_stock') },
    ]

    const [selectedTab, setSelectTab] = useState(TAB_DETAILS_PROGRAM[0]);

    const selectTabEvent = item => {
        setSelectTab(item);
    };

    const allCategoriesOption = {
        ID: "0",
        Name: languageKey('_all_industries')
    };

    const updatedFilters = [allCategoriesOption, ...listGoodsTypes];

    const handleSelection = (item) => {
        if (item.ID === "0") {
            if (selectedItems.some(selected => selected.ID === "0")) {
                setSelectedItems([]);
            } else {
                setSelectedItems(updatedFilters);
            }
        } else {
            const isSelected = selectedItems.some(selected => selected.ID === item.ID);
            let newSelectedItems;

            if (isSelected) {
                newSelectedItems = selectedItems.filter(selected => selected.ID !== item.ID);
            } else {
                newSelectedItems = [...selectedItems, item];
            }

            if (newSelectedItems.length === updatedFilters.length - 1) {
                newSelectedItems = updatedFilters;
            } else {
                newSelectedItems = newSelectedItems.filter(selected => selected.ID !== "0");
            }

            setSelectedItems(newSelectedItems);
        }
    };

    const openModalFilterDay = () => {
        setIsOpenModalFilter(!isOpenModalFilter)
    }

    const closeModalFilterDay = () => {
        setIsOpenModalFilter(!isOpenModalFilter)
    }

    const handleSaveFilter = () => {
        const isAllSelected = selectedItems.some(item => item.ID === "0");
        const selectedIDs = isAllSelected ? ["0"] : selectedItems.map(item => item.ID);

        const body = {
            GoodsTypeID: selectedIDs.length > 0 ? selectedIDs.join(',') : "0"
        };

        dispatch(fetchListInventories(body));
        closeModalFilterDay();
    };

    const handleClearFilter = () => {
        setSelectedItems([]);
        closeModalFilterDay();
    };

    const refreshEvent = () => {
        setRefresh(true);
        const body = {
            GoodsTypeID: "0"
        }
        dispatch(fetchListInventories(body))
        setRefresh(false);
    };

    const onChangeText = textSearch => {
        if (textSearch?.length) {
            setSearchText(textSearch);
            const resultsData = SearchModal(listInventories, textSearch);
            setSearchResults(resultsData);
        } else {
            setSearchResults(listInventories);
        }
    };

    useEffect(() => {
        setSearchResults(listInventories)
    }, [listInventories])

    const moveToDetailInventory = (item) => {
        navigation.navigate(routes.DetailInventoryRenewalScreen, { item: item });
    }

    const itemHeight = 30 + 22 + 46 + 22 + 110 + 30;
    const numberOfItemsInScreen = Math.ceil(height / itemHeight);
    const windowSize = numberOfItemsInScreen * 2;

    const _keyExtractor = (item, index) => `${item.ItemID}-${index}`;
    const _renderItem = ({ item }) => {
        return (
            <Button onPress={() => moveToDetailInventory(item)}>
                <View style={styles.cardProgram}>
                    <Text style={styles.headerProgram}>{item?.ItemName}</Text>
                    <Text style={styles.txtDescription}>{item?.ItemID} - {item?.UnitName}</Text>

                    <View style={styles.containerBodyCard}>
                        <View style={styles.bodyCard}>
                            <View style={styles.contentCard}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_inventory')}</Text>
                                <Text style={styles.contentBody}>{item?.Quantity}</Text>
                            </View>
                            <View style={styles.contentCard}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_keep_so')}</Text>
                                <Text style={styles.contentBody}>{item?.KeepSOQuantity}</Text>
                            </View>

                        </View>
                        <View style={styles.bodyCard}>
                            <View style={styles.contentCard}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_keep_od')}</Text>
                                <Text style={styles.contentBody}>{item?.KeepODQuantity}</Text>
                            </View>
                            <View style={styles.contentCard}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_keep_selling')}</Text>
                                <Text style={styles.contentBody}>{item?.KeepSaleQuantity}</Text>
                            </View>
                        </View>
                        <View style={styles.bodyCard}>
                            <View style={styles.contentCard}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_in_stock_for_sale')}</Text>
                                <Text style={styles.contentBody}>{item?.SaleQuantity}</Text>
                            </View>

                            <View style={styles.contentCard}>
                                <Text style={styles.txtHeaderBody}>{languageKey('_warehouse_transfer')}</Text>
                                <Text style={styles.contentBody}>{item?.KeepTransferQuantity}</Text>
                            </View>

                        </View>
                    </View>
                </View>
            </Button>
        );
    };

    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"])

        const unsubscribe = navigation.addListener('focus', () => {
            const body = {
                GoodsTypeID: "0"
            }
            dispatch(fetchListInventories(body))
        });
        return unsubscribe;
    }, [navigation])

    useEffect(() => {
        dispatch(fetchListGoodTypes())
    }, [])

    return (
        <LinearGradient style={styles.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView >
                <HeaderBack
                    title={languageKey('_inventory')}
                    onPress={() => navigation.goBack()}
                />
                <View style={styles.line} />
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.containerFilter}>
                        {selectedItems.some(selected => selected.ID === "0") ?
                            <Text style={styles.headerFilter}>{languageKey('_product_industry')}: {languageKey('_all')}</Text>
                            :
                            <Text style={styles.headerFilter}>{languageKey('_product_industry')}: {selectedItems?.length}</Text>

                        }
                        <Button style={styles.btnShowInfor} onPress={openModalFilterDay}>
                            <SvgXml xml={arrow_down_big} />
                        </Button>
                    </View>
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
                    <View style={styles.scrollView}>
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
                    <LoadingModal visible={isSubmitting} />
                    <Modal
                        useNativeDriver
                        backdropOpacity={0.5}
                        isVisible={isOpenModalFilter}
                        style={styles.optionsModal}
                        onBackButtonPress={closeModalFilterDay}
                        onBackdropPress={closeModalFilterDay}
                        hideModalContentWhileAnimating
                    >
                        <View style={styles.optionsModalContainer}>
                            <View style={styles.headerContent_gray}>
                                <Text style={styles.titleModal}>{languageKey('_product_filter')}</Text>
                            </View>
                            <View style={styles.contentContainer}>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={styles.containerRadio}
                                >
                                    {updatedFilters.map((item, index) => (
                                        <TouchableOpacity
                                            key={item.ID}
                                            style={index === updatedFilters.length - 1 ? styles.cardNoBorder : styles.card}
                                            onPress={() => handleSelection(item)}
                                        >
                                            {selectedItems.find((selected) => selected.ID === item.ID) ? (
                                                <SvgXml xml={checkbox_active} />
                                            ) : (
                                                <SvgXml xml={checkbox} />
                                            )}
                                            <Text bold style={styles.title}>{item?.Name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                                <View style={styles.containerFooter}>
                                    <Button style={styles.btnConfirm} onPress={handleClearFilter}>
                                        <Text style={styles.txtBtnConfirm}>{languageKey('_clear_filter')}</Text>
                                    </Button>
                                    <Button style={styles.btnSave} onPress={handleSaveFilter}>
                                        <Text style={styles.txtBtnSave}>{languageKey('_save_filter')}</Text>
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </SafeAreaView>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    )
}

export default InventoryRenewalScreen;