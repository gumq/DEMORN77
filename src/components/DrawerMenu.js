import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Dimensions, ScrollView, ImageBackground, Image, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SvgXml } from 'react-native-svg';

import { Button } from './buttons';
import { colors, fontSize } from '@themes';
import { hScale, scale, wScale } from '@resolutions';
import {
  homepage,
  setting,
  approval_signature,
  support_sales,
  sell,
  other_request
} from '@svgImg';
import { updateDetailMenu } from 'store/accHome/slide';
import { isIphoneX } from 'react-native-iphone-x-helper';
import DeviceInfo from 'react-native-device-info';
import { translateLang } from 'store/accLanguages/slide';

const WIDTH_DRAWER = Dimensions.get('window').width / 1.1;

const DrawerMenu = ({ isShowMenu, handleCloseMenu }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const languageKey = useSelector(translateLang)
  const { menus } = useSelector(state => state.Home);
  const { userInfo } = useSelector(state => state.Login);
  const [expandedMenu, setExpandedMenu] = useState(null);

  const getVersion = DeviceInfo.getVersion();

  const filteredMenus = menus.filter(menu => menu.ParentID !== '0');
  const parentMenus = filteredMenus.filter(
    menu => !filteredMenus.some(subMenu => subMenu.MenuID === menu.ParentID),
  );

  const createSubMenuTree = parentId => {
    const subMenuTree = menus.filter(menu => menu.ParentID === parentId);
    subMenuTree.forEach(menu => {
      menu.children = createSubMenuTree(menu.MenuID);
    });
    return subMenuTree;
  };

  const handleMenuPress = menuId => {
    handleCloseMenu();
    const nameScreen = menus.find(menu => menu.MenuID === menuId)?.Link;
    const selectedMenu = menus.find(menu => menu.MenuID === menuId);
    const accessAdd = menus.find(menu => menu.MenuID === menuId)?.AccessAdd;
    const accessDelete = menus.find(menu => menu.MenuID === menuId)?.AccessDelete;
    const accessEdit = menus.find(menu => menu.MenuID === menuId)?.AccessEdit;
    const accessWrite = menus.find(menu => menu.MenuID === menuId)?.AccessWrite;
    const { MenuName, EntryID, FactorID } = selectedMenu;
    dispatch(updateDetailMenu({
      menuName: MenuName,
      entryId: EntryID,
      factorId: FactorID,
      accessAdd: accessAdd,
      accessDelete: accessDelete,
      accessEdit: accessEdit,
      accessWrite: accessWrite
    }))
    navigation.navigate(nameScreen);
  };

  const icons = {
    homepage: homepage,
    support_sales: support_sales,
    sell: sell,
    approval_signature: approval_signature,
    other_request: other_request,
    setting: setting
  };

  const renderIconByName = iconName => {
    const icon = icons[iconName];
    if (icon) {
      return <SvgXml xml={icon} />;
    }
    return null;
  };

  const renderSubMenu = subMenu => {
    return (
      <Button
        key={subMenu.MenuID}
        style={styles.containerMenuChild}
        onPress={() => handleMenuPress(subMenu.MenuID)}>
        <View style={styles.menuChildren}>
          <Text style={styles.title}>{subMenu.MenuName}</Text>
        </View>
        {subMenu.children &&
          subMenu.children.map(child => renderSubMenu(child))}
      </Button>
    );
  };

  const toggleSubMenu = menuId => {
    if (menuId === 'MENU_61' || menuId === 'MENU_67' || menuId === 'MENU_65') {
      handleMenuPress(menuId);;
      return;
    }
    setExpandedMenu(expandedMenu === menuId ? null : menuId)
  };

  return (
    <Modal
      isVisible={isShowMenu}
      useNativeDriver
      animationInTiming={450}
      animationOutTiming={450}
      backdropOpacity={0.7}
      coverScreen={false}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      onBackButtonPress={handleCloseMenu}
      onBackdropPress={handleCloseMenu}
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
      style={styles.modal}>
      <ImageBackground source={require('../assets/bg_drawer.png')} style={styles.imageBg}>
        <ScrollView style={styles.modalContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.userInfo}>
            <Image source={require('../assets/avatar.png')} style={styles.imgAvt} />
            <View style={styles.content}>
              <Text bold style={styles.name}>
                {userInfo?.UserFullName || 'Unknown'}
              </Text>
              <Text style={styles.phoneNum}>{userInfo?.UserPhone || 'Unknown'}</Text>
            </View>
          </View>
          {parentMenus.map(menu => (
            <View key={menu.MenuID} style={styles.containerMenu}>
              <Button
                style={[
                  styles.parentMenu,
                  {
                    borderBottomWidth: expandedMenu === menu.MenuID ? 1 : 0,
                    borderBottomColor: colors.borderColor,
                    paddingBottom: expandedMenu ? scale(5) : 0,
                  },
                ]}
                onPress={() => toggleSubMenu(menu.MenuID)}>
                <View style={styles.iconHeader}>
                  {renderIconByName(menu.MenuIcon)}
                  <Text style={styles.titleCard}>{menu.MenuName}</Text>
                </View>
              </Button>
              {expandedMenu === menu.MenuID &&
                createSubMenuTree(menu.MenuID).map(subMenu =>
                  renderSubMenu(subMenu),
                )}
            </View>
          ))}
        </ScrollView>
        <View style={styles.containerVersion}>
          <Text style={styles.txtVesion}>{languageKey('_current_version')}: {getVersion}</Text>
        </View>
      </ImageBackground>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  modalContainer: {
    flex: 1,
    width: WIDTH_DRAWER,
  },
  imageBg: {
    flex: 1,
    width: WIDTH_DRAWER,
  },
  parentMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(12),
  },
  titleCard: {
    color: colors.black,
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    fontSize: fontSize.size16,
    lineHeight: scale(24),
    marginLeft: scale(8),
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    fontSize: fontSize.size16,
    lineHeight: scale(24),
    color: colors.black,
    marginLeft: scale(4),
  },
  img: {
    width: WIDTH_DRAWER,
  },
  imgAvt: {
    width: wScale(60),
    height: hScale(60),
    marginRight: scale(12)
  },
  containerMenu: {
    marginVertical: scale(8)
  },
  containerMenuChild: {
    marginLeft: scale(38),
    borderBottomColor: colors.borderColor,
    borderBottomWidth: scale(1),
    paddingBottom: scale(8),
    marginTop: scale(8),
  },
  iconHeader: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  menuChildren: {
    flexDirection: 'row',
  },
  avt: {
    backgroundColor: colors.blue,
    height: hScale(48),
    width: hScale(48),
    borderRadius: hScale(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12)
  },
  userInfo: {
    marginHorizontal: scale(12),
    paddingVertical: scale(12),
    marginTop:isIphoneX ? scale(50) : scale(30),
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    fontSize: fontSize.size16,
    lineHeight: scale(24),
    color: colors.black,
  },
  phoneNum: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    fontSize: fontSize.size16,
    lineHeight: scale(24),
    color: '#6B7280',
  },
  itemBody: {
    alignItems: 'center',
  },
  img: {
    width: WIDTH_DRAWER,
  },
  iconHeader: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  menuChildren: {
    flexDirection: 'row',
  },
  containerVersion: {
    position: 'absolute',
    bottom: 0,
    marginHorizontal: scale(16),
    marginVertical: scale(8)
  },
  txtVesion: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    fontSize: fontSize.size12,
    lineHeight: scale(18),
    color: '#525252',
  }
});

export default DrawerMenu;
