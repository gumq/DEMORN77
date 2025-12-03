/* eslint-disable handle-callback-err */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react';
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
  Dimensions,
  Text,
  FlatList,
  Platform,
  Pressable,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {styles} from './styles';
import routes from '@routes';
import {translateLang} from '@store/accLanguages/slide';
import {
  ApiCustomerProfiles_GetById,
  ApiCustomerProfiles_UpdateGPS,
} from '@api';
import {
  Button,
  HeaderBack,
  InputLocationAlone,
  InputLocationnew,
  NotifierAlert,
  SearchBar,
  TabsHeaderDevices,
} from '@components';
import {noData, plus_white} from '@svgImg';
import {fetchListCustomerByUserID} from '@store/accAuth/thunk';
import {scale} from '@utils/resolutions';;
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SearchModalKH from '../../components/SearchModalKH';
import moment, {lang} from 'moment';
const {height} = Dimensions.get('window');

const UpdateGpsScreen = () => { d
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const {userInfo, listCustomerByUserID} = useSelector(state => state.Login);
  const {detailMenu} = useSelector(state => state.Home);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalGps, setModalGps] = useState('0,0'); // chuỗi gps hiển thị trong modal
  const [modalItemId, setModalItemId] = useState(null);
  const [modalTime, setModalTime] = useState(null); // thời gian cập nhật (optional)
  const [isSubmittingGps, setIsSubmittingGps] = useState(false);
  const [valueLocation, setValueLocation] = useState('0,0');
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
  const TABgps = useMemo(
    () => [
      {id: 1, label: languageKey('_all'), key: '0'},
      {id: 2, label: 'Đã cập nhật', key: 'DCN'},
      {id: 3, label: 'Chờ cập nhật', key: 'CCN'},
    ],
    [languageKey],
  );

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isRefreshing, setRefresh] = useState(false);
  const [isOpenModalFilter, setIsOpenModalFilter] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedTab, setSelectTab] = useState(TAB[0]);
  // console.log('searchResults', searchResults);
  const dataFilter = useMemo(
    () => [
      {id: 1, name: languageKey('_all'), key: '0'},
      {id: 2, name: languageKey('_official'), key: 'CT'},
      {id: 3, name: languageKey('_potential'), key: 'HT'},
      {id: 4, name: languageKey('_support'), key: 'TN'},
    ],
    [languageKey],
  );
  // console.log('searchResults',searchResults)
  const isFocus = useIsFocused();
  useEffect(() => {
    if (!isFocus) return;

    const bodyCustomer = {
      CustomerRepresentativeID: userInfo?.UserID || 0,
      CmpnID: userInfo?.CmpnID,
    };
    dispatch(fetchListCustomerByUserID(bodyCustomer));
  }, [isFocus]);
  // const handlePickGps = useCallback(
  //   async (itemId, gpsString) => {
  //     try {
  //       console.log('itemId', itemId);
  //       console.log('Picked GPS for', itemId, gpsString);
  //       const parts = String(gpsString).replace(/\s+/g, '').split(',');
  //       const lat = Number(parts[0].replace(',', '.'));
  //       const lon = Number(parts[1].replace(',', '.'));
  //       console.log('lat', lat);
  //       console.log('lon', lon);
  //       const body = {
  //         ID: Number(itemId),
  //         Lat: Number(lat),
  //         Long: Number(lon),
  //       };
  //       try {
  //         const result = await ApiCustomerProfiles_UpdateGPS(body);

  //         const responeData = result.data;

  //         if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
  //           console.log('responeData', responeData);
  //           const bodyCustomer = {
  //             CustomerRepresentativeID: userInfo?.UserID || 0,
  //             CmpnID: userInfo?.CmpnID,
  //           };
  //           dispatch(fetchListCustomerByUserID(bodyCustomer));
  //         } else {
  //           NotifierAlert(
  //             3000,
  //             `${languageKey('_notification')}`,
  //             `${responeData.Message}`,
  //             'error',
  //           );
  //         }
  //       } catch (errors) {
  //         NotifierAlert(
  //           3000,
  //           `${languageKey('_notification')}`,
  //           `${errors}`,
  //           'error',
  //         );
  //       }
  //       console.log('body', body);
  //     } catch (e) {
  //       console.log('handlePickGps error', e);
  //     }
  //   },
  //   [dispatch],
  // );
  const performUpdateGps = useCallback(async () => {
    if (!modalItemId) return;
    try {
      setIsSubmittingGps(true);
      // modalGps là dạng "lat - lon" (dấu '-'), convert lại về "lat,lon" với dấu chấm thập phân
      const parts = modalGps.replace(/\s+/g, '')?.split(':');
      console.log('parts', parts);
      const latStr = (parts[0] || '0').replace(',', '.');
      const lonStr = (parts[1] || '0').replace(',', '.');

      const body = {
        ID: Number(modalItemId),
        Lat: Number(latStr),
        Long: Number(lonStr),
      };

      console.log('calling ApiCustomerProfiles_UpdateGPS with', body);
      try {
        const result = await ApiCustomerProfiles_UpdateGPS(body);
        const responeData = result?.data;
        if (responeData?.StatusCode === 200 && responeData?.ErrorCode === '0') {
          const bodyCustomer = {
            CustomerRepresentativeID: userInfo?.UserID || 0,
            CmpnID: userInfo?.CmpnID,
          };
          dispatch(fetchListCustomerByUserID(bodyCustomer));
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData?.Message}`,
            'success',
          );
        } else {
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData?.Message ?? 'Có lỗi'}`,
            'error',
          );
        }
      } catch (errors) {
        NotifierAlert(
          3000,
          `${languageKey('_notification')}`,
          `${errors}`,
          'error',
        );
      }
    } catch (e) {
      console.log('performUpdateGps error', e);
    } finally {
      setIsSubmittingGps(false);
      setModalVisible(false);
      setModalItemId(null);
    }
  }, [modalGps, modalItemId, dispatch, userInfo, languageKey]);

  const handlePickGps = useCallback((itemId, gpsString) => {
    try {
      console.log('open confirm modal for', itemId, gpsString);
      setModalItemId(itemId);
      // chuẩn hoá hiển thị: phần hiển thị dùng dấu '-' theo UI
      const parts = String(gpsString).replace(/\s+/g, '').split(',');
      const latPart = parts[0] ?? '0';
      const lonPart = parts[1] ?? '0';
      // hiển thị giống ảnh: "10,841 - 106,717"
      const latDisplay = String(latPart).replace('.', ',');
      const lonDisplay = String(lonPart).replace('.', ',');
      setModalGps(`${latDisplay} : ${lonDisplay}`);
      setModalTime(moment().format('HH:mm DD/MM/YYYY')); // hoặc lấy thời gian thực tế nếu có
      setModalVisible(true);
    } catch (e) {
      console.log('handlePickGps error', e);
    }
  }, []);

  const showAlertPermission = () => {
    Alert.alert(
      `${languageKey('_notification')}`,
      `${languageKey('_permission')}`,
      [
        {
          text: `${languageKey('_cancel')}`,
          style: 'cancel',
        },
        {text: languageKey('_go_to_setting'), onPress: () => openSettings()},
      ],
    );
  };

  const handleGetLong = () => {
    setTimeout(() => {
      checkPermissionFineLocation();
    }, 500);
  };

  const requestPermissionFineLocation = () => {
    request(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ).then(result => {
      if (result === RESULTS.GRANTED) {
        checkPermissionCoarseLocation();
      } else {
        showAlertPermission();
      }
    });
  };
  const checkPermissionCoarseLocation = () => {
    check(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ).then(result => {
      switch (result) {
        case RESULTS.GRANTED:
          handleGetLocation();
          break;
        case RESULTS.UNAVAILABLE:
        case RESULTS.DENIED:
        case RESULTS.LIMITED:
          requestPermissionCoarseLocation();
          break;
        case RESULTS.BLOCKED:
          showAlertPermission();
          break;
      }
    });
  };

  const checkPermissionFineLocation = () => {
    setTimeout(() => {
      check(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      ).then(result => {
        switch (result) {
          case RESULTS.GRANTED:
            checkPermissionCoarseLocation();
            break;
          case RESULTS.UNAVAILABLE:
          case RESULTS.DENIED:
          case RESULTS.LIMITED:
            requestPermissionFineLocation();
            break;
          case RESULTS.BLOCKED:
            showAlertPermission();
            break;
        }
      });
    }, 400);
  };

  const requestPermissionCoarseLocation = () => {
    request(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ).then(result => {
      if (result === RESULTS.GRANTED) {
        handleGetLocation();
      } else {
        showAlertPermission();
      }
    });
  };

  const handleGetLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        if (position) {
          let location = {
            latitude: `${Number(position.coords.latitude).toFixed(7)}`,
            longitude: `${Number(position.coords.longitude).toFixed(8)}`,
          };
          valueLocation === '0,0'
            ? null
            : 1
            ? null
            : setValueLocation(`${location?.longitude}, ${location?.latitude}`);
        }
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  useEffect(() => {
    handleGetLong();
  }, []);

  const handleLocationChange = gps => {
    console.log('gps', gps);
    setValueLocation(gps);
  };
  const hasGps1 = customer => {
    if (!customer) return false;

    const latRaw = customer?.Lat ?? customer?.Latitude ?? null;
    const lonRaw = customer?.Long ?? customer?.Longitude ?? null;

    if (latRaw === null || latRaw === undefined) return false;
    if (lonRaw === null || lonRaw === undefined) return false;

    // nếu là chuỗi rỗng
    if (typeof latRaw === 'string' && latRaw.trim() === '') return false;
    if (typeof lonRaw === 'string' && lonRaw.trim() === '') return false;

    const lat = Number(String(latRaw).replace(',', '.'));
    const lon = Number(String(lonRaw).replace(',', '.'));

    if (Number.isNaN(lat) || Number.isNaN(lon)) return false;
    return Math.abs(lat) > 1e-6 || Math.abs(lon) > 1e-6;
  };

  const filteredCustomers = useMemo(() => {
    if (!listCustomerByUserID) return [];

    return listCustomerByUserID.filter(customer => {
      const isActive =
        customer?.IsClosed === 0 &&
        customer?.IsCompleted === 1 &&
        customer?.IsActive === 1;

      if (!isActive) return false;
      if (selectedTab?.id === 1) return true;
      if (selectedTab?.id === 2) {
        return hasGps1(customer);
      }
      if (selectedTab?.id === 3) {
        return !hasGps1(customer);
      }
    });
  }, [listCustomerByUserID, selectedTab]);
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

  const refreshEvent = useCallback(async () => {
    setRefresh(true);
    setSearchText('');
    const bodyCustomer = {
      CustomerRepresentativeID: userInfo?.UserID || 0,
      CmpnID: userInfo?.CmpnID,
    };
    dispatch(fetchListCustomerByUserID(bodyCustomer));
    setRefresh(false);
  }, [dispatch]);
  const searchDebounceRef = useRef(null);

  const handleInputChange = useCallback(
    text => {
      setSearchText(text);
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }

      searchDebounceRef.current = setTimeout(() => {
        const q = text?.trim();

        if (q && q.length > 0) {
          const resultsData = SearchModalKH(listCustomerByUserID, q);

          if (selectedTab?.id === 1) {
            setSearchResults(resultsData);
          } else if (selectedTab?.id === 2) {
            setSearchResults(resultsData.filter(item => hasGps(item)));
          } else if (selectedTab?.id === 3) {
            setSearchResults(resultsData.filter(item => !hasGps(item)));
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
      }, 300);
    },
    [listCustomerByUserID, filteredCustomers, selectedTab],
  );
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = null;
      }
    };
  }, []);

  const itemHeight = 8 + 46 + 24 + 66;
  const numberOfItemsInScreen = Math.ceil(height / itemHeight);
  const windowSize = numberOfItemsInScreen * 2;
  const hasGps = item => {
    const lat = Number(item?.Lat);
    const lon = Number(item?.Long);
    if (!isFinite(lat) || !isFinite(lon)) return false;
    if (Math.abs(lat) < 1e-6 && Math.abs(lon) < 1e-6) return false;
    return true;
  };

  const _keyExtractor = useCallback((item, index) => `${item.ID}-${index}`, []);
  const _renderItem = useCallback(
    ({item}) => {
      const gpsInitialValue = `${item?.Lat ?? 0},${item?.Long ?? 0}`;
      const formatGpsDisplay = (lat, lon) => {
        const latStr = String(lat || 0).replace('.', ',');
        const lonStr = String(lon || 0).replace('.', ',');
        return `${latStr} - ${lonStr}`;
      };
      const gpsDisplay = formatGpsDisplay(item?.Lat, item?.Long);
      const timeDisplay =
        item?.ChangeDateGPS ||
        item?.GPSUpdatedAt ||
        item?.UpdatedAt ||
        languageKey('_not_updated');

      return (
        <View style={styles.cardProgram}>
          <View style={styles.itemBody_two}>
            <View style={styles.containerItem}>
              <View style={styles.containerHeader}>
                <Text style={styles.txtTitleItem}>
                  {[item?.Name, item?.TaxCode, item?.CustomerID]
                    .filter(Boolean)
                    .join(' - ')}
                </Text>
              </View>
              <View style={[styles.containerStatus, {marginTop: scale(4)}]}>
                <View
                  style={[
                    styles.bodyStatus,
                    {
                      backgroundColor: hasGps(item) ? '#DCFCE7' : '#F3F4F6',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.txtStatus,
                      {
                        color: hasGps(item) ? '#166534' : '#6B7280',
                      },
                    ]}>
                    {hasGps(item) ? 'Đã cập nhật' : 'Chưa cập nhật'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.gpsCard}>
            <View style={[styles.gpsLeft]}>
              <View>
                <Text style={styles.gpsLabel}>Địa chỉ</Text>
                <Text style={styles.gpsValue}>{item?.FullAddress}</Text>
              </View>
            </View>
            {item?.Lat?.toString() !== '0' && item?.Lat !== '' && (
              <View style={[styles.gpsLeft]}>
                <View style={styles.containerHeader}>
                  <Text style={styles.gpsLabel}>GPS</Text>
                  <Text style={styles.gpsValue}>{gpsDisplay}</Text>
                </View>
                <View style={styles.containerHeader}>
                  <Text style={styles.gpsTime}>Thời gian cập nhật</Text>
                  <Text style={styles.gpsValue}>
                    {moment(item?.ChangeDateGPS).format('HH:mm DD/MM/YYYY')}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.gpsRight}>
              <InputLocationAlone
                returnKeyType="next"
                style={{width: '100%'}}
                value={gpsInitialValue}
                label={''}
                isEdit
                bgColor={'#F9FAFB'}
                placeholderInput
                labelHolder={languageKey('_select_coordinates')}
                tree
                onChangeText={text => {}}
                onChangeLocation={text => {}}
                itemId={item?.CustomerID_}
                onPickGps={handlePickGps}
                typeNote
                dem={'0'}
              />
            </View>
          </View>
        </View>
      );
    },
    [languageKey],
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
          title={languageKey('_updategps')}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.containerSearch}>
          <View style={styles.search}>
            <SearchBar
              value={searchText}
              onChangeText={text => {
                setSearchText(text);
                handleInputChange(text);
              }}
            />
          </View>
        </View>
        <TabsHeaderDevices
          data={TABgps}
          selected={selectedTab}
          onSelect={selectTabEvent}
          tabWidth={3}
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
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        useNativeDriver
        hideModalContentWhileAnimating
        backdropOpacity={0.4}>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{fontSize: 18, fontWeight: '600', marginBottom: 8}}>
            Xác nhận GPS
          </Text>
          <View
            style={[
              styles.gpsRight,
              {
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'flex-start',
              },
            ]}>
            <View>
              <View>
                <Text style={styles.gpsLabel}>GPS</Text>
                <Text style={styles.gpsValue}>
                  {modalGps?.replace(':', '-')}
                </Text>
              </View>
              <View>
                <Text style={styles.gpsTime}>Thời gian cập nhật</Text>
                <Text style={styles.gpsValue}>{modalTime}</Text>
              </View>
            </View>
          </View>
          <Pressable
            onPress={performUpdateGps}
            disabled={isSubmittingGps}
            style={{
              width: '100%',
              backgroundColor: '#3B82F6',
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: 'center',
              marginTop: 12,
            }}>
            <Text style={{color: '#fff', fontSize: 16}}>Xác nhận</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              // Cập nhật lại: chỉ đóng modal
              setModalVisible(false);
            }}
            style={{
              width: '100%',
              paddingVertical: 12,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#3B82F6',
              alignItems: 'center',
              marginTop: 8,
            }}>
            <Text style={{color: '#3B82F6', fontSize: 16}}>Cập nhật lại</Text>
          </Pressable>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default UpdateGpsScreen;
