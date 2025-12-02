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
import routes from 'modules/routes';
import {noData, plus_white} from 'svgImg';
import {translateLang} from 'store/accLanguages/slide';
import {
  fetchListCategoryType,
  fetchListCreditLimit,
} from 'store/accCredit_Limit/thunk';
import {
  Button,
  HeaderBack,
  LoadingModal,
  SearchBar,
  SearchModal,
} from 'components';
import {
  fetchApiCompanyConfig_GetByUserID,
  fetchApiuser_GetCurrentUser,
  fetchListCustomerByUserID,
  fetchListUserByUserID,
} from 'store/accAuth/thunk';
import {fetchListFactorID} from 'store/accOrders/thunk';
import {scale} from 'utils/resolutions';
import {fetchListItemType} from 'store/accCustomer_Profile/thunk';

const {height} = Dimensions.get('window');
const CreditLimitScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const [isRefreshing, setRefresh] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const {userInfo} = useSelector(state => state.Login);
  const {isSubmitting, listCreditLimit} = useSelector(
    state => state.CreditLimit,
  );

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    dispatch(fetchListItemType());
    dispatch(fetchApiuser_GetCurrentUser());
    const body = {
      FactorID: 'QuotationDomestic',
    };
    dispatch(fetchListFactorID(body));
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(
        fetchListCreditLimit({
          CustomerID: '%',
          OrderID: '%',
          TypeGet: 'Quarter',
        }),
      );
    });
    return unsubscribe;
  }, [navigation]);

  const refreshEvent = () => {
    setRefresh(true);
    dispatch(
      fetchListCreditLimit({CustomerID: '%', OrderID: '%', TypeGet: 'Quarter'}),
    );
    setRefresh(false);
  };

  const onChangeText = textSearch => {
    if (textSearch?.length) {
      setSearchText(textSearch);
      const resultsData = SearchModal(listCreditLimit, textSearch);
      setSearchResults(resultsData);
    } else {
      setSearchResults(listCreditLimit);
    }
  };

  const moveToDetailProgram = item => {
    navigation.navigate(routes.DetailCreditLimitScreen, {item: item});
  };

  const itemHeight = 30 + 22 + 46 + 22 + 110 + 30;
  const numberOfItemsInScreen = Math.ceil(height / itemHeight);
  const windowSize = numberOfItemsInScreen * 2;
  // console.log('item?.ObjectTypeName', searchResults?.[0]);
  const _keyExtractor = (item, index) => `${item.OID}-${index}`;
  const _renderItem = ({item}) => {
    return (
      <Button onPress={() => moveToDetailProgram(item)}>
        <View style={styles.cardProgram}>
          <Text style={styles.headerProgram}>
            {item?.OID} - {moment(item?.ODate).format('DD/MM/YYYY')}
          </Text>
          {item?.IsCustomer === 1 ? (
            <Text style={styles.txtProposalCustomer}>
              {item?.EntryName} - {languageKey('_customer_suggested')}
            </Text>
          ) : (
            <Text style={styles.txtProposal}>{item?.EntryName}</Text>
          )}

          <View style={styles.bodyCard}>
            <View style={styles.containerContent}>
              {item?.PartnerName ? (
                <View style={styles.containerBody}>
                  <Text style={styles.txtHeaderBody}>
                    {languageKey('_business_partner_group')}
                  </Text>
                  <Text style={styles.contentBody}>{item?.PartnerName}</Text>
                </View>
              ) : null}
              {item?.ObjectTypeName ? (
                <View style={styles.containerBody}>
                  <Text style={styles.txtHeaderBody}>
                    {languageKey('_object_type')}
                  </Text>
                  <Text style={styles.contentBody}>{item?.ObjectTypeName}</Text>
                </View>
              ) : null}
            </View>
            {item?.ObjectName ? (
              <View style={styles.containerBody}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_object')}
                </Text>
                <Text
                  style={styles.contentBody}
                  numberOfLines={3}
                  ellipsizeMode="tail">
                  {item?.ObjectName}
                </Text>
              </View>
            ) : null}
            {item?.GuarantorCustomerName ? (
              <View style={styles.containerBody}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_customer_are_guaranteed')}
                </Text>
                <Text
                  style={styles.contentBody}
                  numberOfLines={3}
                  ellipsizeMode="tail">
                  {item?.GuarantorCustomerName}
                </Text>
              </View>
            ) : null}
            <View style={styles.containerContent}>
              {item?.RequestedLimitSO ? (
                <View style={styles.containerBody}>
                  <Text style={styles.txtHeaderBody}>
                    {languageKey('_so_od_limit_requested')}
                  </Text>
                  <Text style={styles.contentBody}>
                    {Number(item?.RequestedLimitSO || 0).toLocaleString(
                      'en-US',
                    )}
                  </Text>
                </View>
              ) : null}
              {item?.RequestedLimitOD ? (
                <View style={styles.containerBody}>
                  <Text style={styles.txtHeaderBody}>
                    {languageKey('_od_export_limit_request')}
                  </Text>
                  <Text style={styles.contentBody}>
                    {Number(item?.RequestedLimitOD || 0).toLocaleString(
                      'en-US',
                    )}
                  </Text>
                </View>
              ) : null}
            </View>
            {item?.PaymentTermsName ? (
              <View style={styles.containerBody}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_payment_terms')}
                </Text>
                <Text style={styles.contentBody}>{item?.PaymentTermsName}</Text>
              </View>
            ) : null}
            {item?.Description ? (
              <View style={styles.containerBody}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_explain')}
                </Text>
                <Text style={styles.contentBody}>{item?.Description}</Text>
              </View>
            ) : null}
            {item?.ApprovalNote ? (
              <View style={styles.containerBody}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_approved_content')}
                </Text>
                <Text style={styles.contentBody}>{item?.ApprovalNote}</Text>
              </View>
            ) : null}
            {item?.Note ? (
              <View style={styles.containerBody}>
                <Text style={styles.txtHeaderBody}>{languageKey('_note')}</Text>
                <Text style={styles.contentBody}>{item?.Note}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.containerFooterCard}>
            <Text style={styles.contentTimeApproval}>
              {languageKey('_update')}{' '}
              {moment(item?.ApprovalDate).format('HH:mm DD/MM/YYYY')}
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
    setSearchResults(listCreditLimit);
  }, [listCreditLimit]);

  useEffect(() => {
    // const bodyCustomer = {
    //   CustomerRepresentativeID: userInfo?.UserID || 0,
    //   //   SalesStaffID: null,
    //   //   Function: 'Default',
    //   CmpnID: userInfo?.CmpnID,
    // };
    // dispatch(fetchListCustomerByUserID(bodyCustomer));
    const bodyUser = {
      UserID: userInfo?.UserID,
    };
    dispatch(fetchListUserByUserID(bodyUser));
    dispatch(fetchListCategoryType());
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
          title={languageKey('_credit_limit')}
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
        onPress={() => navigation.navigate(routes.FormCreditLimitScreen)}>
        <SvgXml xml={plus_white} />
      </Button>
      {/* <LoadingModal visible={isSubmitting} /> */}
    </LinearGradient>
  );
};

export default CreditLimitScreen;
