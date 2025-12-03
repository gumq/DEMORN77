import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
// import Geolocation from 'react-native-geolocation-service';
// import BackgroundTimer from 'react-native-background-timer';
// import RNForegroundService from '@supersami/rn-foreground-service';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import {
  View,
  Text,
  BackHandler,
  PermissionsAndroid,
  Platform,
  FlatList,
  TouchableOpacity,
  ScrollView,
  LogBox,
  AppState,
  Dimensions,
  Alert,
} from 'react-native';

import {fetchMenu} from '@store/accHome/thunk';
import {fetchAddGPS} from '/store/accGPS/thunk';
import {
  Button,
  HeaderHome,
  HeaderHomeNew,
  KPIList,
  ModalNotify,
  SearchBar,
  SearchModal,
  TabsHeader,
} from '@components';
import {translateLang} from '@store/accLanguages/slide';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './styles';
import {SvgXml} from 'react-native-svg';
import {
  cancel_contract_order,
  catalogue,
  cost_proposal,
  customer_profiles,
  customer_request,
  exhibition_program,
  gift_program,
  inventory,
  limit_credit,
  menu,
  notify,
  order,
  order_request,
  other_cost,
  paint_the_car,
  plan_visit_customer,
  prices,
  promotion_program,
  requirement_deposit,
  sample_cabinet_shelves,
  setup_pi,
  support_articles,
  survey_program,
  training_testing,
  view_more,
  visit_customer,
  customer_closed,
  handover_doc,
  job_list,
  complaint,
  TKXD,
  updateGps,
} from '@svgImg';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {colors} from '@themes';
import {updateDetailMenu} from '@store/accHome/slide';
import {fcmService} from '../../FCM/FCMService';
import {localNotificationService} from '../../FCM/PushNotification';
import {ApiAddTokenFirebase} from '@api';
import {setFcmInfo} from '@storage';import AsyncStorage from '@react-native-async-storage/async-storage';
import {convertVi} from '@utils/resolutions';;
import {updateListEntryCreditLimit} from '@store/accCredit_Limit/slide';
import {clrsListCustomers} from '@store/accApproval_Signature/slide';
const width = Dimensions.get('window').width;
const HomeScreen = () => {
  const dispatch = useDispatch();
  const languageKey = useSelector(translateLang);
  const navigation = useNavigation();
  const {menu_home} = useSelector(state => state.Home);
  const {userInfo} = useSelector(state => state.Login);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [viewMoreModalVisible, setViewMoreModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const selectedTabRef = useRef({
    id: 1,
    label: languageKey('_todayy'),
    type: 'DAY',
  });
  const data = {
    thongTinKPI: {
      khoangThoiGian: 'Tuần',
      duLieu: [
        {
          ten: 'Đơn hàng',
          giaTri: 5,
          donVi: 'Đơn',
          total: 10,
          color: colors.blue,
        },
        {
          ten: 'Doanh số',
          giaTri: 10000000,
          donVi: 'VND',
          total: 10000000,
          color: colors.green,
        },
        {
          ten: 'Sản lượng',
          giaTri: 100,
          donVi: 'KG',
          total: 1000,
          color: colors.yellow,
        },
        {
          ten: 'Khách hàng mới',
          giaTri: 2,
          donVi: '',
          total: 10,
          color: colors.blueSystem1,
        },
        {
          ten: 'Ghé thăm khách hàng',
          giaTri: 5,
          donVi: '',
          total: 10,
          color: colors.green300,
        },
        {
          ten: 'Khảo sát',
          giaTri: 2,
          donVi: '',
          total: 10,
          color: colors.orangeCustom,
        },
      ],
    },
  };
  const [selectedTab, setSelectedTab] = useState(selectedTabRef.current);
  const handleTabChange = useCallback(tab => {
    selectedTabRef.current = tab;
    setSelectedTab(tab);
    console.log('Tab selected:', tab);
    //  tab.type !== 'FromTo' ? fetchdataListHistory(tab) : openShowModal();
    tab?.id === 2
      ? setDataKPI({
          thongTinKPI: {
            khoangThoiGian: 'Tuần',
            duLieu: [
              {
                ten: 'Đơn hàng',
                giaTri: 1,
                donVi: 'Đơn',
                total: 10,
                color: colors.blue,
              },
              {
                ten: 'Doanh số',
                giaTri: 5000000,
                donVi: 'VND',
                total: 10000000,
                color: colors.green,
              },
              {
                ten: 'Sản lượng',
                giaTri: 50,
                donVi: 'KG',
                total: 1000,
                color: colors.yellow,
              },
              {
                ten: 'Khách hàng mới',
                giaTri: 1,
                donVi: '',
                total: 10,
                color: colors.blueSystem1,
              },
              {
                ten: 'Ghé thăm khách hàng',
                giaTri: 1,
                donVi: '',
                total: 10,
                color: colors.green300,
              },
              {
                ten: 'Khảo sát',
                giaTri: 10,
                donVi: '',
                total: 10,
                color: colors.orangeCustom,
              },
            ],
          },
        })
      : setDataKPI(data);
  }, []);

  const [dataKPI, setDataKPI] = useState(data);

  const groupedMenus = menu_home || [];
  const handleShowMore = parentMenu => {
    setExpandedMenu(parentMenu);
    setViewMoreModalVisible(true);
  };

  const handleCloseModal = () => {
    setViewMoreModalVisible(false);
    setExpandedMenu(null);
  };

  const icons = {
    customer_profiles: customer_profiles,
    limit_credit: limit_credit,
    plan_visit_customer: plan_visit_customer,
    visit_customer: visit_customer,
    customer_request: customer_request,
    order_request: order_request,
    prices: prices,
    order: order,
    requirement_deposit: requirement_deposit,
    cost_proposal: cost_proposal,
    cancel_contract_order: cancel_contract_order,
    inventory: inventory,
    promotion_program: promotion_program,
    gift_program: gift_program,
    exhibition_program: exhibition_program,
    survey_program: survey_program,
    support_articles: support_articles,
    training_testing: training_testing,
    setup_pi: setup_pi,
    catalogue: catalogue,
    sample_cabinet_shelves: sample_cabinet_shelves,
    paint_the_car: paint_the_car,
    other_cost: other_cost,
    view_more: view_more,
    customer_closed: customer_closed,
    handover_doc: handover_doc,
    job_list: job_list,
    complaint: complaint,
    TKXD: TKXD,
    updateGps: updateGps,
  };
  const navigateScreen = menuItem => {
    const {
      Link: nameScreen,
      MenuName,
      EntryID,
      FactorID,
      AccessAdd,
      AccessDelete,
      AccessEdit,
      AccessWrite,
    } = menuItem;
    console.log('nameScreen', menuItem);
    if (!nameScreen) {
      Alert.alert('Thông báo', 'Màn hình chưa được cấu hình trong menu.');
      return;
    }
    dispatch(
      updateDetailMenu({
        menuName: MenuName,
        entryId: EntryID,
        factorId: FactorID,
        accessAdd: AccessAdd,
        accessDelete: AccessDelete,
        accessEdit: AccessEdit,
        accessWrite: AccessWrite,
      }),
    );

    navigation.navigate(nameScreen);
    handleCloseModal();
  };

  const renderChildMenu = item => {
    const icon = item?.MenuIcon ? icons[item.MenuIcon] : null;
    return (
      <Button style={styles.childMenuItem} onPress={() => navigateScreen(item)}>
        <SvgXml xml={icon} />
        <Text style={styles.txtMenu}>{item?.MenuName}</Text>
      </Button>
    );
  };

  const renderParentMenu = parentMenu => {
    const children = parentMenu.children || [];
    const showMore = children.length > 6;
    let visibleChildren = showMore ? children.slice(0, 5) : children;

    if (showMore) {
      visibleChildren.push({MenuID: 'view_more', isViewMore: true});
    }

    return (
      <View style={styles.parentMenuContainer} key={parentMenu.MenuID}>
        <Text style={styles.parentMenuTitle}>{parentMenu.MenuName}</Text>
        <FlatList
          data={visibleChildren}
          renderItem={({item}) =>
            item.isViewMore ? (
              <TouchableOpacity
                style={styles.childMenuItem}
                onPress={() => handleShowMore(parentMenu)}>
                <SvgXml xml={view_more} />
                <Text style={styles.txtMenu}>{languageKey('_see_more')}</Text>
              </TouchableOpacity>
            ) : (
              renderChildMenu(item)
            )
          }
          keyExtractor={item => item.MenuID.toString()}
          numColumns={3}
          columnWrapperStyle={styles.rowStyle}
        />
      </View>
    );
  };

  const renderModal = () => (
    <Modal
      isVisible={viewMoreModalVisible}
      useNativeDriver={true}
      onBackdropPress={handleCloseModal}
      onBackButtonPress={handleCloseModal}
      backdropTransitionOutTiming={450}
      style={styles.modal}>
      <View style={styles.headerModal}>
        <Text style={styles.titleModal}>{expandedMenu?.MenuName}</Text>
      </View>
      <View style={styles.modalContainer}>
        <FlatList
          data={expandedMenu?.children || []}
          renderItem={({item}) => renderChildMenu(item)}
          keyExtractor={item => item.MenuID.toString()}
          numColumns={3}
          columnWrapperStyle={styles.rowStyle}
        />
      </View>
    </Modal>
  );
  // const onChangeText = textSearch => {
  //   if (textSearch?.length) {
  //     setSearchText(textSearch);
  //     const resultsData = SearchModal(menus, textSearch);
  //     setSearchResults(resultsData);
  //   } else {
  //     setSearchResults(menus);
  //   }
  // };
  const onChangeText = textSearch => {
    setSearchText(textSearch);

    if (!textSearch?.trim()) {
      setSearchResults(menu_home);
      return;
    }

    // 🔹 Bỏ dấu và chuyển thường chuỗi nhập
    const normalizedSearch = convertVi(textSearch.toLowerCase());

    const filteredMenus = menu_home
      .map(parent => {
        const parentName = convertVi(parent.MenuName?.toLowerCase() || '');
        const matchedChildren = parent.children?.filter(child => {
          const childName = convertVi(child.MenuName?.toLowerCase() || '');
          return childName.includes(normalizedSearch);
        });
        if (
          parentName.includes(normalizedSearch) ||
          (matchedChildren && matchedChildren.length > 0)
        ) {
          return {
            ...parent,
            children: matchedChildren?.length
              ? matchedChildren
              : parent.children,
          };
        }

        return null;
      })
      .filter(Boolean);

    setSearchResults(filteredMenus);
  };
  const handleBackPress = () => {
    setExitModalVisible(true);
    return true;
  };

  const exitApp = () => {
    setExitModalVisible(false);
    BackHandler.exitApp();
  };

  const handleCloseModalExit = () => {
    setExitModalVisible(false);
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );

      return () => backHandler.remove();
    }, []),
  );
  async function onRegister(Token) {
    try {
      setFcmInfo(Token);
      await ApiAddTokenFirebase({
        Token: Token,
        AppCode: 'eSales',
      });
    } catch (error) {
      console.log(error);
    }
  }

  function onNotification(notify) {
    const options = {
      soundName: 'default',
      playSound: true,
    };
    if (notify?.title) {
      localNotificationService.showNotification(
        0,
        notify?.title || 'TITLE',
        notify?.body || 'BODY',
        notify,
        options,
      );
    }
  }

  function onOpenNotification(notify) {}

  async function requestNotificationPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.warn('Failed to request notification permission:', error);
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    const listener = AppState.addEventListener('change', () => {});

    const init = async () => {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        fcmService.registerAppWithFCM();
        fcmService.register(onRegister, onNotification, onOpenNotification);
        localNotificationService.configure(onOpenNotification);
      } else {
        console.log('Notification permission denied');
      }
    };

    init();

    return () => listener?.remove();
  }, []);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    setSearchResults(menu_home);
  }, [menu_home]);

  const loadLocationHistory = async () => {
    try {
      const currentData = await AsyncStorage.getItem('locationHistory');
      if (currentData) {
        const history = JSON.parse(currentData);
      }
    } catch (error) {
      console.error('Error loading location history:', error);
    }
  };

  useEffect(() => {
    const body = {
      GroupID: userInfo?.GroupID?.toString(),
      AppCode: 'eSale2',
    };
    dispatch(fetchMenu(body));
    // dispatch(clrsListCustomers());
  }, [userInfo]);

  return (
    <LinearGradient
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      colors={['#3B82F6', 'rgba(59, 130, 246, 0.00)']}
      locations={[0.2, 0.5]}
      pointerEvents="box-none">
      <SafeAreaView style={styles.container}>
        <HeaderHomeNew
          title={languageKey('_home_page')}
          iconRight={menu}
          iconLeft={notify}
          colorText={colors.white}
          searchText={searchText}
          onChangeText={onChangeText}
        />

        <ScrollView
          style={styles.scrollView}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          {/* <View style={styles.containerKPI}>
            <Text style={styles.headerKPI}>
              {languageKey('_KPI_information')}
            </Text>
            <TabsHeader
              data={[
                {id: 1, label: languageKey('_week'), type: 'WEEK'},
                {id: 2, label: languageKey('_month'), type: 'MONTH'},
                {id: 3, label: languageKey('_year'), type: 'YEAR'},
                {id: 4, label: languageKey('_during'), type: 'FromTo'},
              ]}
              selected={selectedTab}
              onSelect={handleTabChange}
              style={{
                marginVertical: scale(0),
                borderRadius: scale(12),
              }}
              tabWidth={width / 4.2}
              four={true}
            />
            <KPIList data={dataKPI} />
          </View> */}
          {searchResults.map(renderParentMenu)}
          {renderModal()}
        </ScrollView>
      </SafeAreaView>
      <ModalNotify
        isShowOptions={exitModalVisible}
        handleClose={handleCloseModalExit}
        handleAccept={exitApp}
        handleCancel={handleCloseModalExit}
        btnNameAccept={languageKey('_argee')}
        btnCancel={languageKey('_cancel')}
        content={languageKey('_exit_app')}
      />
    </LinearGradient>
  );
};

export default HomeScreen;
