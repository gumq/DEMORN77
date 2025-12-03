import React, { useEffect, useState } from "react";
import Modal from 'react-native-modal';
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, ScrollView, LogBox, RefreshControl, FlatList, Text, TouchableOpacity } from "react-native";

import { noData, radio, radio_active } from "@svgImg";
import { styles } from './styles'
import routes from "@routes";
import { translateLang } from "@store/accLanguages/slide";
import { Button, HeaderBack, LoadingModal, SearchBar, SearchModal } from "@components";
import { fetchListCustomerByUserID } from "@store/accAuth/thunk";
import { NewCustomer } from "../../../modules/sell/visit_customer/componentTab";

const ChooseCustomerScreen = ({ route }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang);
    const item = route?.params?.item;
    const [isRefreshing, setRefresh] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isShowModalAddCustomer, setIsShowModalAddCustomer] = useState(false);
    const { userInfo, listCustomerByUserID } = useSelector(state => state.Login);
    const { isSubmitting, listSurveyPrograms } = useSelector(state => state.SurveyPrograms);

    const refreshEvent = () => {
        setRefresh(true);
        const bodyCustomer = {
            CustomerRepresentativeID: userInfo?.UserID || 0,
            // SalesStaffID: null,
            // Function: 'Default'
              CmpnID:userInfo?.CmpnID,
        }
        dispatch(fetchListCustomerByUserID(bodyCustomer))
        setRefresh(false);
    };

    const onChangeText = textSearch => {
        if (textSearch?.length) {
            setSearchText(textSearch);
            const resultsData = SearchModal(listSurveyPrograms, textSearch);
            setSearchResults(resultsData);
        } else {
            setSearchResults(listSurveyPrograms);
        }
    };

    const openModalAddCustomer = () => {
        setIsShowModalAddCustomer(!isShowModalAddCustomer)
    }

    const closeModalAddCustomer = () => {
        setIsShowModalAddCustomer(!isShowModalAddCustomer)
    }

    const moveOnTakeSurvey = () => {
        navigation.navigate(routes.TakeSurveyScreen, { item: item, customer: selectedItem })
    }

    const handleSelection = (item) => {
        setSelectedItem(item);
    };

    const _keyExtractor = (item, index) => `${item.ID}-${index}`;
    const _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                key={item?.ID}
                style={styles.btnSelect}
                onPress={() => handleSelection(item)}
            >

                {selectedItem === item ? (
                    <SvgXml xml={radio_active} />
                ) : (
                    <SvgXml xml={radio} />
                )}
                <Text
                    style={index === searchResults.length - 1 ? styles.cardNoBorder : styles.card}
                    numberOfLines={2}
                    ellipsizeMode='tail'
                >
                    {item?.Name}
                </Text>
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        setSearchResults(listCustomerByUserID)
    }, [listCustomerByUserID])

    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"])

        const unsubscribe = navigation.addListener('focus', () => {
            const bodyCustomer = {
                CustomerRepresentativeID: userInfo?.UserID || 0,
                // SalesStaffID: null,
                // Function: 'Default'
                  CmpnID:userInfo?.CmpnID,
            }
            dispatch(fetchListCustomerByUserID(bodyCustomer))
        })

        return unsubscribe;
    }, [navigation])

    return (
        <LinearGradient style={styles.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView>
                <HeaderBack
                    title={languageKey('_select_customer')}
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
            <View style={styles.containerFooter}>
                <Button
                    style={styles.btnSave}
                    onPress={openModalAddCustomer}
                >
                    <Text style={styles.txtBtnSave}>{languageKey('_add_new_customer')}</Text>
                </Button>
                <Button
                    style={styles.btnConfirm}
                    onPress={moveOnTakeSurvey}
                    disabled={selectedItem ? false : true}
                >
                    <Text style={styles.txtBtnConfirm}>{languageKey('_next')}</Text>
                </Button>
            </View>
            <Modal
                useNativeDriver
                backdropOpacity={0.5}
                isVisible={isShowModalAddCustomer}
                style={styles.optionsModal}
                onBackButtonPress={closeModalAddCustomer}
                onBackdropPress={closeModalAddCustomer}
                avoidKeyboard={true}
                hideModalContentWhileAnimating>
                <View style={styles.optionsModalContainerAdd}>
                    <View style={styles.headerContentAdd}>
                        <Text style={styles.titleModal}>{languageKey('_add_customer')}</Text>
                    </View>
                    <ScrollView style={styles.containerBody} showsVerticalScrollIndicator={false}>
                        <NewCustomer closeModal={closeModalAddCustomer} reason={true} />
                    </ScrollView>
                </View>
            </Modal>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    )
}

export default ChooseCustomerScreen;