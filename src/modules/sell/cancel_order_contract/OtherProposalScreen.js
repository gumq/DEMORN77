import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {SvgXml} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  View,
  StatusBar,
  ScrollView,
  LogBox,
  RefreshControl,
  FlatList,
  Dimensions,
  Text,
} from 'react-native';

import {styles} from './styles';
import routes from 'modules/routes';
import {noData, plus_white} from 'svgImg';
import {translateLang} from 'store/accLanguages/slide';
import {
  Button,
  HeaderBack,
  LoadingModal,
  SearchBar,
  SearchModal,
} from 'components';
import {
  fetchListOtherProposal,
  fetchListReasonProposal,
} from 'store/accOther_Proposal/thunk';
import {fetchListCustomerByUserID} from 'store/accAuth/thunk';

const {height} = Dimensions.get('window');
const OtherProposalScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const {userInfo} = useSelector(state => state.Login);
  const [isRefreshing, setRefresh] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const {isSubmitting, listOtherProposal} = useSelector(
    state => state.OtherProposal,
  );

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchListOtherProposal());
    });
    return unsubscribe;
  }, [navigation]);

  const refreshEvent = () => {
    setRefresh(true);
    dispatch(fetchListOtherProposal());
    setRefresh(false);
  };

  const onChangeText = textSearch => {
    if (textSearch?.length) {
      setSearchText(textSearch);
      const resultsData = SearchModal(listOtherProposal, textSearch);
      setSearchResults(resultsData);
    } else {
      setSearchResults(listOtherProposal);
    }
  };

  const moveToDetailProgram = item => {
    navigation.navigate(routes.DetailOtherProposalScreen, {item: item});
  };

  const itemHeight = 30 + 22 + 22 + 22 + 22 + 40;
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
          <View style={styles.bodyCard}>
            <View style={styles.containerBody}>
              <Text style={styles.txtHeaderBody}>
                {languageKey('_customer')}
              </Text>
              <Text
                style={styles.contentBody}
                numberOfLines={2}
                ellipsizeMode="tail">
                {item?.CustomerName}
              </Text>
            </View>
            <View style={styles.containerBody}>
              <Text style={styles.txtHeaderBody}>
                {languageKey('_document_type')}
              </Text>
              <Text style={styles.contentBody}>{item?.DocumentTypeName}</Text>
            </View>
            <View style={styles.containerBody}>
              <Text style={styles.txtHeaderBody}>
                {languageKey('_contract_order')}
              </Text>
              <Text style={styles.contentBody}>{item?.ReferenceID}</Text>
            </View>
            <View style={styles.containerBody}>
              <Text style={styles.txtHeaderBody}>
                {languageKey('_reason_for_cancel')}
              </Text>
              <Text style={styles.contentBody}>{item?.ReasonName}</Text>
            </View>
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
    setSearchResults(listOtherProposal);
  }, [listOtherProposal]);

  useEffect(() => {
    const bodyCustomer = {
      CustomerRepresentativeID: userInfo?.UserID || 0,
      // SalesStaffID: null,
      // Function:'Default'
      CmpnID: userInfo?.CmpnID,
    };
    dispatch(fetchListCustomerByUserID(bodyCustomer));
    dispatch(fetchListReasonProposal());
  }, []);

  return (
    <LinearGradient
      style={styles.container}
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
          title={languageKey('_cancel_order_contract')}
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
        onPress={() => navigation.navigate(routes.FormOtherProposalScreen)}>
        <SvgXml xml={plus_white} />
      </Button>
      <LoadingModal visible={isSubmitting} />
    </LinearGradient>
  );
};

export default OtherProposalScreen;
