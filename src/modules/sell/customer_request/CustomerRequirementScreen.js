import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {SvgXml} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  View,
  StatusBar,
  ScrollView,
  LogBox,
  RefreshControl,
  FlatList,
  Dimensions,
  Text,
  Platform,
} from 'react-native';

import {styles} from './styles';
import routes from '@routes';
import {noData, plus_white} from '@svgImg';
import {translateLang} from '@store/accLanguages/slide';
import {
  Button,
  HeaderBack,
  LoadingModal,
  SearchBar,
  SearchModal,
} from '@components';
import {fetchListCustomerByUserID} from '@store/accAuth/thunk';
import {
  fetchListCategoryTypeCusRequirement,
  fetchListCusRequirements,
  fetchListDepartment,
  fetchListEntry,
} from '@store/accCus_Requirement/thunk';
import {fetchListUser} from '@store/accApproval_Signature/thunk';
import { scale } from '@utils/resolutions';

const {height} = Dimensions.get('window');
const CustomerRequirementScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const [isRefreshing, setRefresh] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const {userInfo} = useSelector(state => state.Login);
  const {detailMenu} = useSelector(state => state.Home);
  const {isSubmitting, listCusRequirements} = useSelector(
    state => state.CusRequirement,
  );

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchListCusRequirements());
    });
    return unsubscribe;
  }, [navigation]);

  const refreshEvent = () => {
    setRefresh(true);
    dispatch(fetchListCusRequirements());
    setRefresh(false);
  };

  const onChangeText = textSearch => {
    if (textSearch?.length) {
      setSearchText(textSearch);
      const resultsData = SearchModal(listCusRequirements, textSearch);
      setSearchResults(resultsData);
    } else {
      setSearchResults(listCusRequirements);
    }
  };

  const moveToDetailProgram = item => {
    if (item?.EntryID === 'OtherRequests') {
      navigation.navigate(routes.DetailCusRequirementScreen, {item: item});
    } else {
      navigation.navigate(routes.DetailOrderRequestScreen, {item: item});
    }
  };

  const itemHeight = 30 + 22 + 46 + 22 + 110 + 30;
  const numberOfItemsInScreen = Math.ceil(height / itemHeight);
  const windowSize = numberOfItemsInScreen * 2;

  const _keyExtractor = (item, index) => `${item.OID}-${index}`;
  const _renderItem = ({item}) => {
    return (
      <Button onPress={() => moveToDetailProgram(item)}>
        <View style={styles.cardProgram}>
          <Text style={styles.headerProgram}>
            {item?.OID} - {moment(item?.ODate).format('DD/MM/YYYY')}
          </Text>
          <Text style={styles.txtProposal}>{item?.EntryName}</Text>
          <View style={styles.bodyCard}>
            {item?.CustomerName ? (
              <View style={styles.contentView}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_customer')}
                </Text>
                <Text style={styles.contentBodyKes}>{item?.CustomerName}</Text>
              </View>
            ) : null}
            {item?.Content ? (
              <View style={styles.contentView}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_request_content')}
                </Text>
                <Text style={styles.contentBodyKes}>{item?.Content}</Text>
              </View>
            ) : null}
            {item?.CustomerRequest ? (
              <View style={styles.contentView}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_detailed_description_of_requirement')}
                </Text>
                <Text style={styles.contentBodyKes}>
                  {item?.CustomerRequest}
                </Text>
              </View>
            ) : null}
            {item?.Note ? (
              <View style={styles.contentView}>
                <Text style={styles.txtHeaderBody}>{languageKey('_note')}</Text>
                <Text style={styles.contentBodyKes}>{item?.Note}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.containerFooterCard}>
            <Text style={styles.contentTimeApproval}>
              {languageKey('_update')}{' '}
              {moment(item?.ChangeDate).format('HH:mm DD/MM/YYYY')}
            </Text>
            <View
              style={[
                styles.bodyStatus,
                {backgroundColor: item?.ApprovalStatusColor},
              ]}>
              <Text
                style={[
                  styles.txtStatus,
                  {color: item?.ApprovalStatusTextColor},
                ]}>
                {item?.ApprovalStatusName}
              </Text>
            </View>
          </View>
        </View>
      </Button>
    );
  };

  useEffect(() => {
    setSearchResults(listCusRequirements);
  }, [listCusRequirements]);

  useEffect(() => {
    const bodyCustomer = {
      CustomerRepresentativeID: userInfo?.UserID || 0,
      // SalesStaffID: null,
      // Function: 'Default'
      CmpnID: userInfo?.CmpnID,
    };
    dispatch(fetchListCustomerByUserID(bodyCustomer));
    const body = {
      FactorID: detailMenu?.factorId,
      EntryID: detailMenu?.entryId,
    };
    dispatch(fetchListEntry(body));
    dispatch(fetchListUser({CmpnID: userInfo?.CmpnID}));
    dispatch(fetchListDepartment());
    dispatch(fetchListCategoryTypeCusRequirement());
  }, []);
  const insets = useSafeAreaInsets();
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
      <SafeAreaView>
        <HeaderBack
          title={languageKey('_customer_requirements')}
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
        onPress={() => navigation.navigate(routes.FormCustomerRequirement)}>
        <SvgXml xml={plus_white} />
      </Button>
      <LoadingModal visible={isSubmitting} />
    </LinearGradient>
  );
};

export default CustomerRequirementScreen;
