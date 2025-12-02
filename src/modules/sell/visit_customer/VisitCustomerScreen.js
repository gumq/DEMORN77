import React, { useEffect, useState } from "react";
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from "react-redux";
import { SvgXml } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, Text, LogBox, ScrollView, TouchableOpacity } from "react-native";

import { styles } from "./styles";
import { translateLang } from "store/accLanguages/slide";
import { Button, HeaderBack, LoadingModal, ModalSelectDate, SearchBar, TabsHeaderDevices } from "components";
import { filterDay, plus_white, radio, radio_active } from "svgImg";
import AllPlan from "./componentTabList/AllPlan";
import AccordingPlan from "./componentTabList/AccordingPlan";
import OffLine from "./componentTabList/OffLine";
import { NewCustomer, OffRouteVisit } from "./componentTab";
import { fetchListVisitCustomer } from "store/accVisit_Customer/thunk";
import { fetchListCustomerByUserID } from "store/accAuth/thunk";

const VisitCustomerScreen = () => {
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang);
    const dispatch = useDispatch();
    const { isSubmitting, listVisitCustomer } = useSelector(state => state.VisitCustomer);
    const { userInfo } = useSelector(state => state.Login);
    const [isOpenModalFilter, setIsOpenModalFilter] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isShowModalAddCustomer, setIsShowModalAddCustomer] = useState(false);
    const [showDatePickerRange, setShowDatePickerRange] = useState(false);
    const [dateStates, setDateStates] = useState({
        fromDate: {
            selected: null,
            submit: null,
            initial: new Date(),
            visible: false,
        },
        toDate: {
            selected: null,
            submit: null,
            initial: new Date(),
            visible: false,
        },
    });

    const updateDateState = (key, newValues) => {
        setDateStates(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                ...newValues,
            },
        }));
    };

    const dataFilter = [
        { id: 1, name: languageKey('_yesterday'), key: -1 },
        { id: 2, name: languageKey('_today'), key: 0 },
        { id: 3, name: languageKey('_tomorrow'), key: 1 },
        { id: 4, name: languageKey('_time_period'), key: 2 }
    ]

    const [selectedItem, setSelectedItem] = useState(null);

    const TAB_APPROVAL_PROCESS = [
        { id: 1, label: languageKey('_all') },
        { id: 2, label: languageKey('_according_to_plan') },
        { id: 3, label: languageKey('_off_line') }
    ]

    const [selectedTab, setSelectTab] = useState(TAB_APPROVAL_PROCESS[0]);

    const TAB_ADD_CUSTOMER = [
        { id: 1, label: languageKey('_off_line') },
        { id: 2, label: languageKey('_add_new_customer') },
    ]

    const [selectedTabCustomer, setSelectTabCustomer] = useState(TAB_ADD_CUSTOMER[0]);

    const onChangeText = textSearch => {
        if (textSearch?.length) {
            setSearchText(textSearch);
            const resultsData = SearchModal(listVisitCustomer?.Visit, textSearch);
            setSearchResults(resultsData);
        } else {
            setSearchResults(listVisitCustomer?.Visit);
        }
    };

    const handleSelection = (item) => {
        setSelectedItem(item);
        if (item.id === 4) {
            setShowDatePickerRange(true);
            closeModalFilterDay();
        } else {
            setShowDatePickerRange(false);
            closeModalFilterDay();
        }
    };

    const openModalFilterDay = () => {
        setIsOpenModalFilter(!isOpenModalFilter)
    }

    const closeModalDate = () => {
        setShowDatePickerRange(!showDatePickerRange)
    }

    const closeModalFilterDay = () => {
        setIsOpenModalFilter(!isOpenModalFilter)
    }

    const openModalAddCustomer = () => {
        setIsShowModalAddCustomer(!isShowModalAddCustomer)
    }

    const closeModalAddCustomer = () => {
        setIsShowModalAddCustomer(!isShowModalAddCustomer)
    }

    useEffect(() => {
        const body = {
            Option: selectedItem?.key ?? 0,
            FromDate: dateStates?.fromDate?.submit ?? new Date(),
            ToDate: dateStates?.toDate?.submit ?? new Date(),
        };
        dispatch(fetchListVisitCustomer(body));
    }, [selectedItem]);

    const handFilter = () => {
        const body = {
            Option: selectedItem?.key ?? 0,
            FromDate: dateStates?.fromDate?.submit ?? new Date(),
            ToDate: dateStates?.toDate?.submit ?? new Date(),
        };
        dispatch(fetchListVisitCustomer(body));
        closeModalDate();
    }

    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
        const unsubscribe = navigation.addListener('focus', () => {
            const body = {
                Option: selectedItem?.key ?? 0,
                FromDate: dateStates?.fromDate?.submit ?? new Date(),
                ToDate: dateStates?.toDate?.submit ?? new Date(),
            }
            dispatch(fetchListVisitCustomer(body));
        });
        return unsubscribe;
    }, [navigation])

    useEffect(() => {
        setSearchResults(listVisitCustomer?.Visit)
    }, [listVisitCustomer?.Visit])

    useEffect(() => {
        const body = {
            CustomerRepresentativeID: userInfo?.UserID || 0,
            // SalesStaffID: null,
            // Function: 'Default'
              CmpnID:userInfo?.CmpnID,
        }
        dispatch(fetchListCustomerByUserID(body))
    }, [])

    return (
        <LinearGradient style={styles.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView>
                <HeaderBack
                    title={languageKey('_visit_customers')}
                    onPress={() => navigation.goBack()}
                    iconBtn={filterDay}
                    btn={true}
                    onPressBtn={openModalFilterDay}
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

                    <View style={styles.containerDashboard}>
                        <View style={styles.viewContent}>
                            <Text style={styles.txtContent}>{languageKey('_visited_customer')} </Text>
                            <Text style={styles.contentVisit}>{listVisitCustomer?.Visited}</Text>
                        </View>
                        <View style={styles.viewContent}>
                            <Text style={styles.txtContent}>{languageKey('_order_value')} </Text>
                            <Text style={styles.contentRevenue}>{listVisitCustomer?.NumberOrders} {languageKey('_unit_order')} ({listVisitCustomer?.TotalOrder})</Text>
                        </View>
                    </View>
                    <TabsHeaderDevices
                        data={TAB_APPROVAL_PROCESS}
                        selected={selectedTab}
                        onSelect={setSelectTab}
                        tabWidth={3}
                    />
                    <ScrollView style={styles.containerBody} showsVerticalScrollIndicator={false}>
                        {selectedTab.id === 1 && <AllPlan {...{ searchResults, selectedItem, dateStates }} />}
                        {selectedTab.id === 2 && <AccordingPlan {...{ searchResults, selectedItem, dateStates }} />}
                        {selectedTab.id === 3 && <OffLine {...{ searchResults, selectedItem, dateStates }} />}
                    </ScrollView>
                </View>
            </SafeAreaView>
            {selectedItem?.key === 2 ? null :
                <Button style={styles.btnAdd}
                    onPress={openModalAddCustomer}
                >
                    <SvgXml xml={plus_white} />
                </Button>
            }
            <LoadingModal visible={isSubmitting} />
            <Modal
                useNativeDriver
                backdropOpacity={0.5}
                isVisible={isOpenModalFilter}
                style={styles.optionsModal}
                onBackButtonPress={closeModalFilterDay}
                onBackdropPress={closeModalFilterDay}
                hideModalContentWhileAnimating>
                <View style={styles.optionsModalContainer}>
                    <View style={styles.headerContent_gray}>
                        <Text style={styles.titleModal}>{languageKey('_view_by_filter')}</Text>
                    </View>
                    <View style={styles.contentContainer}>
                        <ScrollView style={styles.containerRadio} showsVerticalScrollIndicator={false}>
                            {dataFilter.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={index === dataFilter.length - 1 ? styles.cardNoBorder : styles.card}
                                    onPress={() => handleSelection(item)}
                                >
                                    {selectedItem === item ? (
                                        <SvgXml xml={radio_active} />
                                    ) : (
                                        <SvgXml xml={radio} />
                                    )}
                                    <Text bold style={styles.title}>
                                        {item?.name}
                                    </Text>

                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            {showDatePickerRange && (
                <Modal
                    useNativeDriver
                    backdropOpacity={0.5}
                    isVisible={showDatePickerRange}
                    style={styles.optionsModal}
                    onBackButtonPress={closeModalDate}
                    onBackdropPress={closeModalDate}
                    hideModalContentWhileAnimating>
                    <View style={styles.optionsModalContainer}>
                        <View style={styles.headerContent_gray}>
                            <Text style={styles.titleModal}>{languageKey('_view_by_filter')}</Text>
                        </View>
                        <View style={styles.contentContainer}>
                            <ScrollView>
                                <View style={styles.inputFormDate}>
                                    <View style={{ flex: 1 }}>
                                        <ModalSelectDate
                                            title={languageKey('_fromdate')}
                                            showDatePicker={() => updateDateState('fromDate', { visible: true })}
                                            hideDatePicker={() => updateDateState('fromDate', { visible: false })}
                                            initialValue={dateStates.fromDate.selected}
                                            selectedValueSelected={(val) => updateDateState('fromDate', { selected: val })}
                                            isDatePickerVisible={dateStates.fromDate.visible}
                                            selectSubmitForm={(val) => updateDateState('fromDate', { submit: val })}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <ModalSelectDate
                                            title={languageKey('_toDate')}
                                            showDatePicker={() => updateDateState('toDate', { visible: true })}
                                            hideDatePicker={() => updateDateState('toDate', { visible: false })}
                                            initialValue={dateStates.toDate.selected}
                                            selectedValueSelected={(val) => updateDateState('toDate', { selected: val })}
                                            isDatePickerVisible={dateStates.toDate.visible}
                                            selectSubmitForm={(val) => updateDateState('toDate', { submit: val })}
                                        />
                                    </View>
                                </View>
                                <Button style={styles.btnConfirm} onPress={handFilter}>
                                    <Text style={styles.txtBtnConfirm}>{languageKey('_confirm')}</Text>
                                </Button>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            )}
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
                    <View style={styles.contentContainerAdd}>
                        <TabsHeaderDevices
                            data={TAB_ADD_CUSTOMER}
                            selected={selectedTabCustomer}
                            onSelect={setSelectTabCustomer}
                            tabWidth={2}
                        />
                        <ScrollView style={styles.containerBody} showsVerticalScrollIndicator={false}>
                            {selectedTabCustomer.id === 1 && <OffRouteVisit closeModal={closeModalAddCustomer} data={listVisitCustomer} />}
                            {selectedTabCustomer.id === 2 && <NewCustomer closeModal={closeModalAddCustomer} reason={false} />}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    )
}

export default VisitCustomerScreen;