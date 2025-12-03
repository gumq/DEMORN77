/* eslint-disable handle-callback-err */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Modal from 'react-native-modal';
import {SvgXml} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  View,
  StatusBar,
  ScrollView,
  RefreshControl,
  Alert,
  Linking,
  Dimensions,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';

import {styles} from './styles';
import routes from '@routes';
import {translateLang} from '@store/accLanguages/slide';
import {ApiCustomerProfiles_GetById} from '@api';
import {
  fetchListCustomers,
  fetchListUser,
} from '@store/accApproval_Signature/thunk';
import {
  Button,
  HeaderBack,
  LoadingModal,
  SearchBar,
  SearchModal,
  TabsHeaderDevices,
} from '@components';
import {
  fetchApiCustomerProfiles_GetCategoryCustomer,
  fetchListCategoryType,
  fetchListSalesTeam,
  fetchListWareHouse,
} from '@store/accCustomer_Profile/thunk';
import {
  address,
  checkbox,
  checkbox_active,
  filterCustomer,
  noData,
  phone_green,
  plus_white,
} from '@svgImg';
import {
  fetchListCustomerByUserID,
  fetchListUserByUserID,
} from '@store/accAuth/thunk';
import {scale} from '@utils/resolutions';;
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SearchModalKH from '../../../components/SearchModalKH';
const {height} = Dimensions.get('window');

const CustomerProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const {userInfo} = useSelector(state => state.Login);
  const {detailMenu} = useSelector(state => state.Home);
  const {listCustomers, isSubmitting} = useSelector(
    state => state.ApprovalProcess,
  );

  const TAB = useMemo(
    () => [
      {id: 1, label: languageKey('_all'), key: '0'},
      {id: 2, label: languageKey('_official'), key: 'CT'},
      {id: 3, label: languageKey('_potential'), key: 'TN'},
      {id: 4, label: languageKey('_support'), key: 'HT'},
      {id: 5, label: languageKey('_guarantee1'), key: 'BL'},
    ],
    [languageKey],
  );

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isRefreshing, setRefresh] = useState(false);
  const [isOpenModalFilter, setIsOpenModalFilter] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedTab, setSelectTab] = useState(TAB[0]);
  const dataFilter = useMemo(
    () => [
      {id: 1, name: languageKey('_all'), key: '0'},
      {id: 2, name: languageKey('_official'), key: 'CT'},
      {id: 3, name: languageKey('_potential'), key: 'HT'},
      {id: 4, name: languageKey('_support'), key: 'TN'},
    ],
    [languageKey],
  );

  const isFocus = useIsFocused();

  // --- FETCH ON FOCUS / MOUNT: chỉ chạy khi màn focus ---
  useEffect(() => {
    if (!isFocus) return;

    const bodyCustomer = {
      CustomerRepresentativeID: userInfo?.UserID || 0,
      CmpnID: userInfo?.CmpnID,
    };

    dispatch(fetchListCustomerByUserID(bodyCustomer));
    dispatch(fetchListCustomers());

    // Các fetch khác chỉ cần chạy 1 lần khi mount/focus
    const bodyUser = {UserID: userInfo?.UserID};
    dispatch(fetchListUserByUserID(bodyUser));
    dispatch(fetchListUser({CmpnID: userInfo?.CmpnID}));
    dispatch(fetchListCategoryType());
    dispatch(fetchListSalesTeam());
    dispatch(fetchListWareHouse({CategoryType: 'Warehouse'}));
    dispatch(
      fetchApiCustomerProfiles_GetCategoryCustomer({
        CategoryType: 'Factory',
        CmpnID: userInfo?.CmpnID,
      }),
    );
  }, [isFocus]);
  const filteredCustomers = useMemo(() => {
    if (!listCustomers) return [];
    if (selectedTab?.id === 1) return listCustomers;
    return listCustomers.filter(
      customer => customer.CustomerTypeCode === selectedTab?.key,
    );
  }, [listCustomers, selectedTab]);
  useEffect(() => {
    if (searchText && searchText.length > 0) {
      const resultsData = SearchModalKH(filteredCustomers, searchText);
      setSearchResults(resultsData);
    } else {
      setSearchResults(filteredCustomers);
    }
  }, [filteredCustomers, searchText]);

  const selectTabEvent = useCallback(item => {
    setSelectTab(item);
  }, []);

  const handleSelection = useCallback(item => {
    setSelectedItems(prev =>
      prev.some(selected => selected.key === item.key)
        ? prev.filter(selected => selected.key !== item.key)
        : [...prev, item],
    );
  }, []);

  const handleClear = useCallback(() => setSelectedItems([]), []);
  const openModalFilter = useCallback(() => setIsOpenModalFilter(true), []);
  const closeModalFilter = useCallback(() => setIsOpenModalFilter(false), []);

  const refreshEvent = useCallback(async () => {
    setRefresh(true);
    setSearchText('');
    await dispatch(fetchListCustomers());
    setRefresh(false);
  }, [dispatch]);

  const sendSMS = useCallback(phoneNumber => {
    if (!phoneNumber) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ!');
      return;
    }

    const smsUrl = `sms:${phoneNumber}`;
    Linking.openURL(smsUrl).catch(err =>
      Alert.alert('Lỗi', 'Không thể mở ứng dụng tin nhắn!'),
    );
  }, []);

  const onChangeText = useCallback(
    textSearch => {
      setSearchText(textSearch);
      if (textSearch?.length) {
        const resultsData = SearchModalKH(listCustomers, textSearch);
        if (selectedTab.id === 1) {
          setSearchResults(resultsData);
        } else {
          setSearchResults(
            resultsData.filter(
              customer => customer.CustomerTypeCode === selectedTab?.key,
            ),
          );
        }
      } else {
        setSearchResults(filteredCustomers);
      }
    },
    [listCustomers, filteredCustomers, selectedTab],
  );

  const navigateFormCustomer = useCallback(
    async item => {
      try {
        const {data} = await ApiCustomerProfiles_GetById({ID: item.ID});
        if (data.ErrorCode === '0' && data.StatusCode === 200 && data.Result) {
          navigation.navigate(routes.ViewCustomerProfileScreen, {
            editForm: true,
            dataDetail: data.Result,
          });
        }
      } catch (error) {
        console.log('ApiCustomerProfiles_GetById', error);
      }
    },
    [navigation],
  );

  const isValidColor = useCallback(color => {
    if (typeof color !== 'string') return false;

    const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
    if (hexRegex.test(color)) return true;

    const validColors = [
      'white',
      'black',
      'blue',
      'red',
      'green',
      'yellow',
      'gray',
      'purple',
      'pink',
      'brown',
      'orange',
    ];
    if (validColors.includes(color.toLowerCase())) return true;

    return false;
  }, []);

  const itemHeight = 8 + 46 + 24 + 66;
  const numberOfItemsInScreen = Math.ceil(height / itemHeight);
  const windowSize = numberOfItemsInScreen * 2;

  const _keyExtractor = useCallback((item, index) => `${item.ID}-${index}`, []);
  const _renderItem = useCallback(
    ({item}) => {
      return (
        <Button onPress={() => navigateFormCustomer(item)}>
          <View style={styles.cardProgram}>
            <View style={styles.itemBody_two}>
              <View style={styles.containerItem}>
                <View style={styles.containerHeader}>
                  <Text style={styles.txtTitleItem}>{item?.Name}</Text>
                </View>
                <View style={styles.containerStatus}>
                  {item?.CustomerClassificationName ? (
                    <View
                      style={[
                        styles.bodyStatus,
                        {
                          backgroundColor: isValidColor(
                            item?.CustomerClassificationStatusColor,
                          )
                            ? item?.CustomerClassificationStatusColor
                            : '#DCFCE7',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.txtStatus,
                          {
                            color: isValidColor(
                              item?.CustomerClassificationTextColor,
                            )
                              ? item.CustomerClassificationTextColor
                              : '#166534',
                          },
                        ]}>
                        {item?.CustomerClassificationName}
                      </Text>
                    </View>
                  ) : null}
                  {item?.CustomerTypeName ? (
                    <View
                      style={[
                        styles.bodyStatus,
                        {
                          backgroundColor: isValidColor(
                            item?.CustomerTypeStatusColor,
                          )
                            ? item?.CustomerTypeStatusColor
                            : '#DBEAFE',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.txtStatus,
                          {
                            color: isValidColor(item?.CustomerTypeTextColor)
                              ? item?.CustomerTypeTextColor
                              : '#1E40AF',
                          },
                        ]}>
                        {item?.CustomerTypeName}
                      </Text>
                    </View>
                  ) : null}
                  {item?.ApprovalDisplayStatus ? (
                    <View
                      style={[
                        styles.bodyStatus,
                        {
                          backgroundColor: isValidColor(
                            item?.ApprovalDisplayColor,
                          )
                            ? item?.ApprovalDisplayColor
                            : '#DBEAFE',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.txtStatus,
                          {
                            color: isValidColor(item?.ApprovalDisplayTextColor)
                              ? item?.ApprovalDisplayTextColor
                              : '#1E40AF',
                          },
                        ]}>
                        {item?.ApprovalDisplayStatus}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
            {item?.CustomerSupportName && (
              <View style={[styles.bodyCard, {marginLeft: scale(8)}]}>
                <View style={styles.containerBody}>
                  <Text
                    style={[styles.contentBody1]}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {languageKey('_mainstream_customer')}:{' '}
                    {item?.CustomerSupportName}
                  </Text>
                </View>
              </View>
            )}
            <View style={[styles.bodyCard, {marginLeft: scale(8)}]}>
              <View style={styles.containerBody}>
                <SvgXml xml={address} style={styles.icon} />
                <Text
                  style={styles.contentBody}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {item?.FullAddress}
                </Text>
              </View>
              <View style={styles.containerBody}>
                <SvgXml xml={phone_green} style={styles.icon} />
                <Text
                  style={styles.contentBody}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {item?.Phone}{' '}
                </Text>
              </View>
            </View>
          </View>
        </Button>
      );
    },
    [navigateFormCustomer, isValidColor],
  );

  return (
    <LinearGradient
      style={[
        styles.container,
        {marginBottom: scale(Platform.OS === 'android' ? insets.bottom : 0)},
      ]}
      start={{x: 0.44, y: 0.45}}
      end={{x: 1.22, y: 0.25}}
      colors={['#FFFFFF', '#FFFFFF']}
      pointerEvents="box-none">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <SafeAreaView style={styles.container}>
        <HeaderBack
          title={languageKey('_customer_information')}
          onPress={() => navigation.goBack()}
        />
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
        <TabsHeaderDevices
          data={TAB}
          selected={selectedTab}
          onSelect={selectTabEvent}
          tabWidth={4}
          TK={false}
        />
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
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={refreshEvent}
                />
              }
            />
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={refreshEvent}
                />
              }>
              <View>
                <Text style={styles.txtHeaderNodata}>
                  {languageKey('_no_data')}
                </Text>
                <Text style={styles.txtContent}>
                  {languageKey('_we_will_back')}
                </Text>
                <SvgXml xml={noData} style={styles.imgEmpty} />
              </View>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
      <Button
        style={styles.btnAdd}
        onPress={() => navigation.navigate(routes.FormCustomerProfileScreen)}
        disabled={detailMenu?.accessAdd === 0}>
        <SvgXml xml={plus_white} />
      </Button>
      {/* <LoadingModal visible={isSubmitting} /> */}
      {/* Filter modal commented out */}
    </LinearGradient>
  );
};

export default CustomerProfileScreen;
