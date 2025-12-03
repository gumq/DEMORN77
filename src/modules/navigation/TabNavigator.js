/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useRoute, useNavigation} from '@react-navigation/native';
import {SvgXml} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import {
  dh,
  dhactive,
  gt,
  gtactive,
  house,
  houseactive,
  tk,
  tkactive,
  toi,
  toiactive,
  yc,
  ycactive,
} from '@svgImg';
import routes from '../routes';
import {translateLang} from '../../store/accLanguages/slide';
import {Alert, Dimensions, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {getFcmInfo, removerUserInformation, removeToken} from '@storage';
import {ApiauthenticationLogOut} from '@api';
import {updateUser} from '@store/accAuth/slide';
import {fetchMenu} from '@store/accHome/thunk';
import HomeScreen from '../../modules/home/HomeScreen';
import CustomerRequirementScreen from '../../modules/sell/customer_request/CustomerRequirementScreen';
import OrdersScreen from '../../modules/sell/order/OrdersScreen';
import ApprovalSignatureScreen from '../../modules/approval_signature/ApprovalSignatureScreen';
import SettingScreen from '../../modules/setting/SettingScreen';
import VisitCustomerScreen from '../../modules/sell/visit_customer/VisitCustomerScreen';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {scale} from '@utils/resolutions';;
import {colors, fontSize} from '@themes';
const {height} = Dimensions.get('window');
const Tab = createBottomTabNavigator();
import {useSafeAreaInsets} from 'react-native-safe-area-context';
const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  const appName = DeviceInfo.getApplicationName();
  const languageKey = useSelector(translateLang);
  const {userInfo} = useSelector(state => state.Login);
  const {tabnavigator} = useSelector(state => state.Home);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  // const handleLogout = async () => {
  //   const FCMToken = await getFcmInfo();
  //   const body = {
  //     Token: FCMToken,
  //     AppCode: 'eSale',
  //   };
  //   try {
  //     const {data} = await ApiauthenticationLogOut(body);
  //     if (data.ErrorCode === '0' && data.StatusCode === 200) {
  //       await new Promise(resolve => {
  //         handleLogoutCallback();
  //         resolve();
  //       });
  //     } else {
  //       Alert.alert('Thông báo', data.Message);
  //       // handleLogoutCallback();
  //     }
  //   } catch (error) {}
  // };

  // const handleLogoutCallback = async () => {
  //   await new Promise(resolve => {
  //     dispatch(updateUser(null));
  //     resolve();
  //   });
  //   await removeToken();
  //   await removerUserInformation();
  //   navigation.replace(routes.LoginScreen);
  // };
  // const fetchData = useCallback(() => {
  //   const body = {
  //     GroupID: userInfo?.GroupID?.toString() ?? '1',
  //     AppCode: 'eSale2',
  //   };

  //   dispatch(fetchMenu(body)).then(success => {
  //     if (success !== false) {
  //       if (success?.length === 0) {
  //         handleLogout();
  //       }
  //     } else {
  //       handleLogout();
  //     }
  //   });
  // }, [dispatch]);
  // useEffect(() => {
  //   fetchData();
  //   const intervalId = setInterval(() => {
  //     fetchData();
  //   }, 10000);

  //   return () => clearInterval(intervalId);
  // }, [dispatch, userInfo]);
  // useEffect(() => {
  //   const fromNotification = route.params?.params?.fromNotification;
  //   if (fromNotification) {
  //     navigation?.navigate(routes.NotificationScreen);
  //     if (route.params?.params) {
  //       route.params.params.fromNotification = undefined;
  //     }
  //   }
  // }, [route.params]);
  // const getTabLabel = name => {
  //   switch (name) {
  //     case routes.HomeScreen:
  //       return languageKey('_home');
  //     case routes.ProductScreen:
  //       return languageKey('_product');
  //     case routes.OtherRequirementScreen:
  //       return languageKey('_favourite');
  //     case routes.PaymentScreen:
  //       return languageKey('_shopping_cart');
  //     case routes.SearchProductScreen:
  //       return languageKey('_find_products');
  //     default:
  //       return name;
  //   }
  // };
  const screenMap = {
    'Trang chủ': {
      name: routes.HomeScreen,
      component: HomeScreen,
      label: languageKey('_home'),
      icon: house,
      iconActive: houseactive,
    },
    Home: {
      name: routes.HomeScreen,
      component: HomeScreen,
      label: languageKey('_home'),
      icon: house,
      iconActive: houseactive,
    },
    'Yêu cầu KH': {
      name: routes.CustomerRequirementScreen,
      component: CustomerRequirementScreen,
      label: languageKey('_request'),
      icon: yc,
      iconActive: ycactive,
    },
    Request: {
      name: routes.CustomerRequirementScreen,
      component: CustomerRequirementScreen,
      label: languageKey('_request'),
      icon: yc,
      iconActive: ycactive,
    },
    'Đơn hàng': {
      name: routes.OrdersScreen,
      component: OrdersScreen,
      label: languageKey('_order'),
      icon: dh,
      iconActive: dhactive,
    },
    Order: {
      name: routes.OrdersScreen,
      component: OrdersScreen,
      label: languageKey('_order'),
      icon: dh,
      iconActive: dhactive,
    },
    'Ghé thăm': {
      name: routes.VisitCustomerScreen,
      component: VisitCustomerScreen,
      label: languageKey('_visited_customer'),
      icon: gt,
      iconActive: gtactive,
    },
    Visit: {
      name: routes.VisitCustomerScreen,
      component: VisitCustomerScreen,
      label: languageKey('_visited_customer'),
      icon: gt,
      iconActive: gtactive,
    },
    Tôi: {
      name: routes.SettingScreen,
      component: SettingScreen,
      label: languageKey('_me'),
      icon: toi,
      iconActive: toiactive,
    },
    Me: {
      name: routes.SettingScreen,
      component: SettingScreen,
      label: languageKey('_me'),
      icon: toi,
      iconActive: toiactive,
    },
  };
  const screenMapGD = {
    'Trang chủ': {
      name: routes.HomeScreen,
      component: HomeScreen,
      label: languageKey('_home'),
      icon: house,
      iconActive: houseactive,
    },
    Home: {
      name: routes.HomeScreen,
      component: HomeScreen,
      label: languageKey('_home'),
      icon: house,
      iconActive: houseactive,
    },
    'Yêu cầu KH': {
      name: routes.CustomerRequirementScreen,
      component: CustomerRequirementScreen,
      label: languageKey('_request'),
      icon: yc,
      iconActive: ycactive,
    },
    Request: {
      name: routes.CustomerRequirementScreen,
      component: CustomerRequirementScreen,
      label: languageKey('_request'),
      icon: yc,
      iconActive: ycactive,
    },
    'Đơn hàng': {
      name: routes.OrdersScreen,
      component: OrdersScreen,
      label: languageKey('_order'),
      icon: dh,
      iconActive: dhactive,
    },
    Order: {
      name: routes.OrdersScreen,
      component: OrdersScreen,
      label: languageKey('_order'),
      icon: dh,
      iconActive: dhactive,
    },
    'Xét duyệt': {
      name: routes.ApprovalSignatureScreen,
      component: ApprovalSignatureScreen,
      label: languageKey('_approval'),
      icon: tk,
      iconActive: tkactive,
    },
    Approval: {
      name: routes.ApprovalSignatureScreen,
      component: ApprovalSignatureScreen,
      label: languageKey('_approval'),
      icon: tk,
      iconActive: tkactive,
    },
    Tôi: {
      name: routes.SettingScreen,
      component: SettingScreen,
      label: languageKey('_me'),
      icon: toi,
      iconActive: toiactive,
    },
    Me: {
      name: routes.SettingScreen,
      component: SettingScreen,
      label: languageKey('_me'),
      icon: toi,
      iconActive: toiactive,
    },
  };

  const tabsToRender =
    Array.isArray(tabnavigator) && tabnavigator.length > 0
      ? tabnavigator
      : [
          {MenuID: 'MENU_6314935251', MenuName: languageKey('_home')},
          // {MenuID: "MENU_6314935254", MenuName: "Sản phẩm"},
          // {MenuID: 'MENU_6314935254', MenuName: 'Thông báo'},
          {MenuID: 'MENU_6314935255', MenuName: languageKey('_me')},
        ];
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        lazy: true,
        headerShown: false,
        tabBarShowLabel: true,
        // tabBarButton: props => (
        //   <LongPressTabButton {...props} label={getTabLabel(route.name)} />
        // ),
        tabBarStyle: {
          height:
            Platform.OS === 'ios'
              ? 0.0881231527 * scale(height)
              : 0.0751231527 * scale(height) + insets.bottom,
          paddingBottom: Platform.OS === 'ios' ? scale(16) : 0,
          borderTopWidth: scale(0.8),
          borderTopColor: colors.gray300,
          shadowOpacity: 0,
          shadowOffset: {width: 0, height: 0},
          shadowRadius: 0,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: fontSize.size10,
          fontFamily: 'Inter-Medium',
          marginBottom:
            Platform.OS === 'android' ? scale(8) + insets.bottom : scale(8),
          lineHeight: scale(16),
          fontWeight: '500',
        },
        sceneContainerStyle: {
          backgroundColor: colors.blue,
        },
        tabBarActiveTintColor: colors.blue,
        tabBarIcon: ({focused}) => {
          let iconToUse = '';
          const isKTShop = appName?.toLowerCase() === 'kt shop';
          const activeColor = isKTShop ? colors.blue : colors.blue;

          if (route.name === routes.HomeScreen) {
            iconToUse = focused
              ? houseactive.replace('#FFCC00', activeColor)
              : house;
          } else if (route.name === routes.CustomerRequirementScreen) {
            iconToUse = focused ? ycactive.replace('#FFCC00', activeColor) : yc;
          } else if (route.name === routes.OrdersScreen) {
            iconToUse = focused ? dhactive.replace('#FFCC00', activeColor) : dh;
          } else if (route.name === routes.ApprovalSignatureScreen) {
            iconToUse = focused ? tkactive.replace('#FFCC00', activeColor) : tk;
          } else if (route.name === routes.VisitCustomerScreen) {
            iconToUse = focused ? gtactive.replace('#FFCC00', activeColor) : gt;
          } else if (route.name === routes.SettingScreen) {
            iconToUse = focused
              ? toiactive.replace('#FFCC00', activeColor)
              : toi;
          }
          return (
            <SvgXml
              width={scale(24)}
              height={scale(24)}
              xml={iconToUse}
              style={{marginTop: scale(4)}}
            />
          );
        },
      })}>
      {tabsToRender?.map(tab => {
        const hasApprovalSignature = tabnavigator.some(
          item => item.Link === 'ApprovalSignatureScreen',
        );

        const config =
          hasApprovalSignature === true
            ? screenMapGD?.[tab?.MenuName]
            : screenMap?.[tab?.MenuName];
        if (!config) return null;
        return (
          <Tab.Screen
            key={tab.MenuID}
            name={config.name}
            component={config.component}
            options={{
              title: config.label,
              unmountOnBlur: true,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default TabNavigator;
