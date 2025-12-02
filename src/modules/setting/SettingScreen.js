import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  LogBox,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SvgXml} from 'react-native-svg';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import DeviceInfo from 'react-native-device-info';

import {Button, HeaderHome, ModalNotify} from '../../components';
import {
  penedituser,
  radio,
  radio_active,
  svgDMK,
  svgDX,
  svgNN,
  svgPB,
} from '../../svgImg';
import {translateLang, updateLocale} from '../../store/accLanguages/slide';
import styles from './styles';
import {
  removeToken,
  removerUserInformation,
  getFcmInfo,
  setLocale,
} from '../../storage';
import {updateUser} from '../../store/accAuth/slide';
import {fetchInforCompany} from '../../store/accAuth/thunk';
import {ApiauthenticationLogOut} from '../../action/Api';
import {colors} from 'themes';
import {hScale, scale} from 'utils/resolutions';
import routes from 'modules/routes';
import Modal from 'react-native-modal';
import {fetchMenu} from 'store/accHome/thunk';
const icons = {
  svgDX: svgDX,
  svgDMK: svgDMK,
  svgNN: svgNN,
  svgPB: svgPB,
};
const SettingScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [isShowOptionsLogout, setShowOptionsLogout] = useState(false);
  const {userInfo} = useSelector(state => state.Login);
  const {menu_me} = useSelector(state => state.Home);
  const {locale, languageTypes} = useSelector(state => state.Language);
  const [selectedItem, setSelectedItem] = useState(locale);
  const [isVisible, setIsVisible] = useState(false);
  const languageKey = useSelector(translateLang);
  const menus = [
    ...menu_me,
    {
      MenuID: 'version',
      MenuName: languageKey('_version'),
      Link: 'Version',
      MenuIcon: 'svgPB', // svg riêng
      Extention20: 'tab5',
    },
    {
      MenuID: 'logout_static',
      MenuName: languageKey('_logout'),
      Link: 'Logout',
      MenuIcon: 'svgDX', // svg riêng
      Extention20: 'tab5',
    },
  ];

  const openModalOptionsLogout = () => {
    setShowOptionsLogout(true);
  };

  const handleCloseOptionsLogout = () => {
    setShowOptionsLogout(false);
  };
  const hideModal = () => {
    setIsVisible(false);
  };
  // useEffect(() => {
  //   dispatch(fetchInforCompany());
  //   LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  // }, []);

  const getVersion = DeviceInfo.getVersion();

  const handleLogout = async () => {
    const Token = await getFcmInfo();
    try {
      const body = {
        Token: Token,
        AppCode: 'eSale',
      };
      const {data} = await ApiauthenticationLogOut(body);
      if (data.ErrorCode === '0' && data.StatusCode === 200) {
        await new Promise(resolve => {
          handleLogoutCallback();
          resolve();
        });
      }
    } catch (error) {
      console.log('error', error);
    }
    handleLogoutCallback();
  };

  const handleLogoutCallback = async () => {
    await removeToken();
    await removerUserInformation();
    await new Promise(resolve => {
      updateUser(null);
      handleCloseOptionsLogout();
      resolve();
    });
    navigation.navigate(routes.LoginScreen);
  };

  const handleChangeLanguage = () => {
    navigation.navigate(routes.ChangeLanguageScreen);
  };

  const handleChangePassWord = () => {
    navigation.navigate(routes.ChangePassScreen);
  };

  const handleInforUser = () => {
    navigation.navigate(routes.InforContactScreen);
  };
  const handlePress = link => {
    if (link === 'Logout') {
      openModalOptionsLogout();
    } else if (link === 'Version') {
      navigation.navigate(routes.Version);
    } else if (link === 'ChangeLanguageScreen') {
      setIsVisible(true);
    } else if (link === 'ChangePassScreen') {
      handleChangePassWord();
    } else {
      const routeName = routes[link] || link;
      // navigation.navigate(routeName);
    }
  };
  //   return (
  //     <LinearGradient
  //       style={styles.container}
  //       start={{x: 0.44, y: 0.45}}
  //       end={{x: 1.22, y: 0.25}}
  //       colors={['#00A6FB', '#0466C8']}
  //       pointerEvents="box-none">
  //       <SafeAreaView style={styles.container}>
  //         <HeaderHome
  //           iconRight={false}
  //           iconLeft={false}
  //           colorText={colors.black}
  //         />
  //         <View style={styles.scrollView}>
  //           <View style={styles.containerBody}>
  //             <View style={styles.headerItem}>
  //               <Button style={styles.item} onPress={handleInforUser}>
  //                 <View style={styles.itemBody}>
  //                   <Image
  //                     source={require('../../assets/avatar.png')}
  //                     style={styles.img}
  //                   />
  //                   <View style={styles.containerItem}>
  //                     <Text style={styles.txtTitleItem}>
  //                       {userInfo?.UserFullName}
  //                     </Text>
  //                     <Text
  //                       style={styles.txtItem}
  //                       numberOfLines={2}
  //                       ellipsizeMode="tail">
  //                       {userInfo?.UserPhone}
  //                     </Text>
  //                   </View>
  //                 </View>
  //                 <SvgXml xml={arrow_next_black} />
  //               </Button>
  //             </View>
  //           </View>
  //           <View style={styles.containerBody}>
  //             <View style={styles.headerItem}>
  //               <Button style={styles.item_2} onPress={handleChangePassWord}>
  //                 <Text style={styles.txtItem_2}>
  //                   {languageKey('_change_pass')}
  //                 </Text>
  //                 <SvgXml xml={arrow_next_black} />
  //               </Button>
  //               <Button style={styles.item_2} onPress={handleChangeLanguage}>
  //                 <Text style={styles.txtItem_2}>{languageKey('_language')}</Text>
  //                 <View style={styles.btnLanguage}>
  //                   <Text style={styles.txtLanguage}>{locale?.LanguageName}</Text>
  //                   <SvgXml xml={arrow_next_black} />
  //                 </View>
  //               </Button>

  //               <View style={styles.item_3}>
  //                 <Text style={styles.txtItem_2}>{languageKey('_version')}</Text>
  //                 <Text style={styles.txtItem_3}>{getVersion}</Text>
  //               </View>
  //             </View>
  //             <Button onPress={openModalOptionsLogout} style={styles.btnLogout}>
  //               <Text style={styles.textLogoutBtn}>{languageKey('_logout')}</Text>
  //             </Button>
  //           </View>
  //           <ModalNotify
  //             isShowOptions={isShowOptionsLogout}
  //             handleClose={handleCloseOptionsLogout}
  //             handleAccept={handleLogout}
  //             handleCancel={handleCloseOptionsLogout}
  //             titleModal={languageKey('_confirm')}
  //             btnNameAccept={languageKey('_argee')}
  //             btnCancel={languageKey('_no')}
  //             content={userInfo?.CustomerName}
  //             titleContent={'Bạn có chắc chắn muốn đăng xuất?'}
  //             titleContent_two={'Hành động này sẽ đưa bạn trở về trang đăng nhập'}
  //           />
  //         </View>
  //       </SafeAreaView>
  //     </LinearGradient>
  //   );
  // };
  const handleSelection = async item => {
    setSelectedItem(item);
    dispatch(updateLocale(item));
    await setLocale(JSON.stringify(item));

    const body = {
      GroupID: userInfo?.GroupID?.toString() ?? '1',
      AppCode: 'eSale2',
    };

    try {
      const resultAction = await dispatch(fetchMenu(body));
      if (fetchMenu.fulfilled.match(resultAction)) {
        console.log('✅ fetchMenu done:', resultAction.payload);
      } else {
        // console.warn('⚠️ fetchMenu failed:', resultAction.error);
      }
    } catch (error) {
      // console.error('❌ fetchMenu error:', error);
    }
  };
console.log('userInfo',userInfo)
  return (
    <LinearGradient
      start={{x: 0.44, y: 0.45}}
      end={{x: 1.22, y: 0.25}}
      colors={['#00A6FB', '#0466C8']}
      pointerEvents="box-none"
      style={styles.headerGradient}>
      <View style={styles.headerContent}>
        <View style={styles.viewavatar}>
          {userInfo?.Avatar?.includes('https://') ||
          userInfo?.Avatar?.includes('http://') ? (
            <Image
              source={{uri: userInfo?.Avatar}}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require('../../assets/avatar.png')}
              style={styles.avatar}
            />
          )}
        </View>
        <View style={{height: scale(40), width: '100%'}} />
        <Pressable onPress={handleInforUser} style={styles.itemBody}>
          <Text style={styles.userName} numberOfLines={2} ellipsizeMode="tail">
            {userInfo?.UserFullName}{' '}
            <SvgXml
              xml={penedituser}
              width={scale(13)}
              height={scale(13)}
              style={{marginBottom: scale(5)}}
            />
          </Text>
        </Pressable>
        <Text style={styles.companyName}>
          {userInfo?.DepartmentName ||
            'Công ty Cổ phần Đầu tư và Phát triển Kim Tín'}
        </Text>
      </View>
      <View style={styles.mrh8} />
      <View style={styles.bodyContainer}>
        <Text style={styles.sectionTitle}>{languageKey('_settings')}</Text>
        {/* <View style={styles.settingGrid}> */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}>
          <View style={styles.wrapper}>
            {menus?.map((item, index) => {
              const IconXml = icons[item.MenuIcon] || icons.defaultIcon;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.item3}
                  onPress={() => handlePress(item.Link)}
                  activeOpacity={0.7}>
                  <View style={styles.iconContainer}>
                    <SvgXml
                      xml={IconXml}
                      width={scale(46)}
                      height={scale(46)}
                    />
                  </View>
                  <Text style={styles.text}>{item?.MenuName}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        {/* </View> */}
      </View>
      <ModalNotify
        isShowOptions={isShowOptionsLogout}
        handleClose={handleCloseOptionsLogout}
        handleAccept={handleLogout}
        handleCancel={handleCloseOptionsLogout}
        titleModal={languageKey('_confirm')}
        btnNameAccept={languageKey('_argee')}
        btnCancel={languageKey('_no')}
        content={userInfo?.CustomerName}
        titleContent={'Bạn có chắc chắn muốn đăng xuất?'}
        titleContent_two={'Hành động này sẽ đưa bạn trở về trang đăng nhập'}
      />
      <Modal
        isVisible={isVisible}
        onBackdropPress={hideModal}
        onBackButtonPress={hideModal}
        backdropTransitionOutTiming={450}
        style={styles.modal}>
        <View style={styles.row}>
          <View style={styles.headerModal}>
            <Text style={[styles.titleModal, {marginBottom: scale(5)}]}>
              {languageKey('_language')}
            </Text>
          </View>
          {languageTypes?.map((item, index) => (
            <View>
              <TouchableOpacity
                key={item.Code + 'index' + index}
                style={styles.cardNoBorder}
                onPress={() => handleSelection(item)}>
                {selectedItem && selectedItem.Code === item.Code ? (
                  <SvgXml xml={radio_active} style={{marginRight: scale(12)}} />
                ) : (
                  <SvgXml xml={radio} style={{marginRight: scale(12)}} />
                )}
                <Text bold style={styles.title}>
                  {item.LanguageName}
                </Text>
              </TouchableOpacity>
              {index !== languageTypes.length - 1 ? (
                <View style={styles.linelang} />
              ) : (
                <View style={styles.viewModalNN} />
              )}
            </View>
          ))}
        </View>
      </Modal>
    </LinearGradient>
  );
};
export default SettingScreen;
