/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import {scale, hScale} from '@resolutions';
import {colors, fontSize} from '@themes';
import {Button} from '../buttons';
import DrawerMenu from '../DrawerMenu';
import {fetchTotalNotify} from '@store/accNotify/thunk';
import routes from '@routes';
import SearchBar from '../SearchBar';

const HeaderHomeNew = ({
  title,
  iconRight,
  iconLeft,
  colorText,
  searchText,
  onChangeText,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {totalNotify} = useSelector(state => state.Notify);
  const [isShowMenu, setShowMenu] = useState(false);

  const handleShownMenu = () => setShowMenu(true);
  const handleCloseMenu = () => setShowMenu(false);

  useEffect(() => {
    dispatch(fetchTotalNotify());
  }, []);

  const renderNotificationBadge = () => {
    if (totalNotify === undefined || totalNotify === 0) return null;
    const badgeText = totalNotify < 99 ? totalNotify : '99+';
    const badgeStyle =
      totalNotify < 10
        ? styles.textTotalNotiOneNum
        : totalNotify < 99
        ? styles.textTotalNotiTwoNum
        : styles.textTotalNotiThreeNum;

    return <Text style={[styles.textNotify, badgeStyle]}>{badgeText}</Text>;
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.containerSearch}>
          <View style={styles.search}>
            <SearchBar
              value={searchText}
              onChangeText={text => onChangeText(text)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#F3F4F6',
                borderRadius: scale(12),
              }}
            />
          </View>
        </View>
        <Button
          style={styles.btnNoti}
          onPress={() => navigation.navigate(routes.NotificationScreen)}>
          <SvgXml xml={iconLeft} />
        </Button>
        {renderNotificationBadge()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: scale(5),
    paddingRight: scale(10),
    height: hScale(54),
  },
  textNotify: {
    position: 'absolute',
    right: scale(10),
    color: colors.white,
    padding: 1,
    fontFamily: 'Inter-Bold',
    fontSize: fontSize.size14,
    fontWeight: '700',
    lineHeight: scale(16),
  },
  textTotalNotiOneNum: {
    top: scale(3),
    right: scale(15),
    paddingHorizontal: scale(6),
    borderRadius: scale(9),
  },
  textTotalNotiTwoNum: {
    top: scale(2),
    right: scale(10),
    paddingHorizontal: scale(6),
    borderRadius: scale(40),
  },
  textTotalNotiThreeNum: {
    fontSize: fontSize.size10,
    top: scale(2),
    right: scale(8),
    paddingHorizontal: scale(3),
    borderRadius: scale(9),
  },
  btnNoti: {
    paddingVertical: scale(6),
    paddingHorizontal: scale(10),
  },
  containerSearch: {
    paddingHorizontal: scale(10),
    // paddingBottom: scale(7),
    paddingVertical: scale(7),
    flex: 9.25,
  },
  search: {
    backgroundColor: colors.white,
    borderRadius: scale(12),
    paddingHorizontal: scale(0),
  },
});

export default HeaderHomeNew;
