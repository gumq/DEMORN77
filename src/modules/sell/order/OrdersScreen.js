import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {SvgXml} from 'react-native-svg';
import Modal from 'react-native-modal';
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
  Alert,
  TextInput,
  Platform,
} from 'react-native';

import {styles} from './styles';
import routes from '@routes';
import {noData, plus_white, trash_22} from '@svgImg';
import {translateLang} from '@store/accLanguages/slide';
import {
  AttachManyFile,
  Button,
  CardModalSelect,
  HeaderBack,
  LoadingModal,
  NotifierAlert,
  SearchBar,
  SearchModal,
} from '@components';
import {
  fetchListCategoryTypeOrder,
  fetchListOrders,
} from '@store/accOrders/thunk';
import {
  fetchApiCompanyConfig_GetByUserID,
  fetchListCustomerByUserID,
} from '@store/accAuth/thunk';
import {ApiSaleOrder_Cancel, ApiSaleOrders_GetByID} from '@api';
import {fetchListCancelReason} from '@store/accVisit_Customer/thunk';
import {fetchListCustomers} from '@store/accApproval_Signature/thunk';
import {scale} from '@utils/resolutions';;
import {colors} from '@themes';

const {height} = Dimensions.get('window');
const OrdersScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const [isRefreshing, setRefresh] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const {listCancelReason} = useSelector(state => state.VisitCustomer);
  const {isSubmitting, listOrders} = useSelector(state => state.Orders);
  const {userInfo} = useSelector(state => state.Login);
  const [isShowModal, setIsShowModal] = useState(false);
  const [itemSelected, setItemSelected] = useState(null);
  const [valueCancelReason, setValueCancelReason] = useState(null);
  const [contentCancel, onChangeContentCancel] = useState('');
  const [linkImage, setLinkImage] = useState('');
  const [images, setDataImages] = useState([]);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    dispatch(fetchApiCompanyConfig_GetByUserID());
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchListOrders());
    });
    return unsubscribe;
  }, [navigation]);

  const refreshEvent = () => {
    setRefresh(true);
    dispatch(fetchListOrders());
    setRefresh(false);
  };
  // console.log('searchResults', searchResults);
  const onChangeText = textSearch => {
    if (textSearch?.length) {
      setSearchText(textSearch);
      const resultsData = SearchModal(listOrders, textSearch);
      setSearchResults(resultsData);
    } else {
      setSearchResults(listOrders);
    }
  };

  const moveToDetailOrder = async item => {
    const body = {
      OID: item.OID,
    };
    try {
      const {data} = await ApiSaleOrders_GetByID(body);
      if (data.ErrorCode === '0' && data.StatusCode === 200) {
        let result = data.Result;
        if (result) {
          await new Promise(resolve => {
            navigation.navigate(routes.FormOrder, {
              editOrder: true,
              dataDetail: result,
            });
            resolve();
          });
        } else {
          console.log('moveToDetailOrder', error);
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const openModalCancel = item => {
    setItemSelected(item);
    setIsShowModal(!isShowModal);
  };

  const closeModalCancel = () => {
    setIsShowModal(!isShowModal);
  };

  const itemHeight = 30 + 22 + 46 + 22 + 110 + 30;
  const numberOfItemsInScreen = Math.ceil(height / itemHeight);
  const windowSize = numberOfItemsInScreen * 2;

  const _keyExtractor = (item, index) => `${item.OID}-${index}`;
  const _renderItem = ({item}) => {
    return (
      <Button onPress={() => moveToDetailOrder(item)}>
        <View style={styles.cardProgram}>
          <View style={styles.headerCustomer}>
            <Text style={styles.headerProgram}>
              {item?.OID} - {moment(item?.ODate).format('DD/MM/YYYY')}
            </Text>
            {item?.IsCustomer === 1 ? (
              <Button
                style={styles.btnCancel}
                onPress={() => openModalCancel(item)}>
                {/* <SvgXml xml={trash_22} /> */}
                <Text style={[styles.txtBtnFooterCancel, {color: colors.red}]}>
                  {languageKey('_cancel')}
                </Text>
              </Button>
            ) : null}
          </View>
          <Text style={styles.txtProposal}>{item?.EntryName}</Text>
          <View style={styles.bodyCard}>
            {item?.CustomerName ? (
              <View style={styles.containerBodyText}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_customer')}
                </Text>
                <Text style={styles.contentBody}>{item?.CustomerName}</Text>
              </View>
            ) : null}

            <View style={styles.containerBody}>
              {item?.DeliveryDueDate ? (
                <View style={{width: '60%'}}>
                  <Text style={styles.txtHeaderBody}>
                    {languageKey('_estimated_delievery_date')}
                  </Text>
                  <Text style={styles.contentBody}>
                    {moment(item?.DeliveryDueDate).format('DD/MM/YYYY')}
                    {(() => {
                      const now = moment();
                      const deliveryDate = moment(item.DeliveryDueDate);
                      const diffMinutes = deliveryDate.diff(now, 'minutes');
                      const diffDays = Math.floor(diffMinutes / (60 * 24));
                      const remainingMinutes = diffMinutes % 60;

                      if (diffMinutes < 0) {
                        return ` (Quá hạn)`;
                      }
                      return ` (${diffDays} ngày ${remainingMinutes} phút)`;
                    })()}
                  </Text>
                </View>
              ) : null}
              <View style={{width: '40%'}}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_total_amount')}
                </Text>
                <Text style={styles.contentBody}>
                  {item?.TotalAmountVND.toLocaleString('en')}
                </Text>
              </View>
            </View>
            {item?.SupportCustomerName ? (
              <View style={{width: '60%'}}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_support_customer')}
                </Text>
                <Text
                  style={styles.contentBody}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {item?.SupportCustomerName}
                </Text>
              </View>
            ) : null}
            {item?.PriceGroup ? (
              <View style={styles.containerBodyText}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_price_group')}
                </Text>
                <Text style={styles.contentBody}>{item?.PriceGroup}</Text>
              </View>
            ) : null}

            {item?.Note ? (
              <View style={styles.containerBodyText}>
                <Text style={styles.txtHeaderBody}>{languageKey('_note')}</Text>
                <Text style={styles.contentBody}>{item?.Note}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.containerFooterCard}>
            <Text style={styles.contentTimeApproval}>
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
    setSearchResults(listOrders);
  }, [listOrders]);

  useEffect(() => {
    dispatch(fetchListCategoryTypeOrder());
    const bodyCustomer = {
      CustomerRepresentativeID: userInfo?.UserID || 0,
      // SalesStaffID: null,
      // Function: 'Default'
      CmpnID: userInfo?.CmpnID,
    };
    // console.log('bodyCustomer',bodyCustomer)
    dispatch(fetchListCustomerByUserID(bodyCustomer));
    dispatch(fetchListCustomers());
  }, []);

  useEffect(() => {
    const bodyCustomer = {
      CustomerRepresentativeID: userInfo?.UserID || 0,
      // SalesStaffID: null,
      // Function: 'Default'
      CmpnID: userInfo?.CmpnID,
    };
    dispatch(fetchListCustomerByUserID(bodyCustomer));
  }, []);

  const handleCancel = async () => {
    const errors = [];
    if (!valueCancelReason?.ID) {
      errors.push(languageKey('_please_select_reason_cancel'));
    }
    if (errors.length > 0) {
      Alert.alert(errors[0]);
      return;
    }

    const linkArray =
      typeof linkImage === 'string'
        ? linkImage.split(';')
        : Array.isArray(linkImage)
        ? linkImage
        : [];
    const linkString = linkArray.join(';');
    const body = {
      OID: itemSelected?.OID || '',
      CancelReasonID: valueCancelReason?.ID || 0,
      CancelReason: contentCancel || '',
      CancelLink: linkString || '',
    };
    try {
      const result = await ApiSaleOrder_Cancel(body);
      const responeData = result.data;
      if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
        NotifierAlert(
          3000,
          `${languageKey('_notification')}`,
          `${responeData.Message}`,
          'success',
        );
        dispatch(fetchListOrders());
        closeModalCancel();
        setValueCancelReason(null);
        setLinkImage(''), onChangeContentCancel('');
      } else {
        NotifierAlert(
          3000,
          `${languageKey('_notification')}`,
          `${responeData.Message}`,
          'error',
        );
        closeModalCancel();
      }
    } catch (error) {
      console.log('handleCancel', error);
    }
  };

  useEffect(() => {
    dispatch(fetchListCancelReason());
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
          title={languageKey('_order') + ' '}
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
              showsVerticalScrollIndicator={false}
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
        onPress={() => navigation.navigate(routes.FormOrder)}>
        <SvgXml xml={plus_white} />
      </Button>
      <LoadingModal visible={isSubmitting} />
      <Modal
        isVisible={isShowModal}
        useNativeDriver={true}
        onBackdropPress={closeModalCancel}
        onBackButtonPress={closeModalCancel}
        backdropTransitionOutTiming={450}
        avoidKeyboard={true}
        style={styles.modal}>
        <View style={styles.optionsModalContainer}>
          <View style={styles.headerModal}>
            <Text style={styles.titleModal}>
              {languageKey('_cancel_order')}
            </Text>
          </View>
          <ScrollView
            style={styles.modalContainer}
            showsVerticalScrollIndicator={false}>
            <View style={styles.input}>
              <CardModalSelect
                title={languageKey('_reason_for_cancel')}
                data={listCancelReason}
                setValue={setValueCancelReason}
                value={valueCancelReason?.Name}
                bgColor={'#F9FAFB'}
                require={true}
              />
            </View>
            <Text style={styles.headerInput}>
              {languageKey('_confirmation_content')}
            </Text>
            <TextInput
              style={styles.inputContent}
              onChangeText={onChangeContentCancel}
              value={contentCancel}
              numberOfLines={4}
              multiline={true}
              placeholder={languageKey('_enter_content')}
            />
            <Text style={styles.headerBoxImage}>{languageKey('_image')}</Text>
            <View style={styles.imgBox}>
              <AttachManyFile
                OID={itemSelected?.OID}
                images={images}
                setDataImages={setDataImages}
                setLinkImage={setLinkImage}
                dataLink={linkImage}
              />
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <Button style={styles.btnFooterCancel} onPress={closeModalCancel}>
              <Text style={styles.txtBtnFooterCancel}>
                {languageKey('_cancel')}
              </Text>
            </Button>
            <Button style={styles.btnFooterApproval} onPress={handleCancel}>
              <Text style={styles.txtBtnFooterApproval}>
                {languageKey('_confirm')}
              </Text>
            </Button>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default OrdersScreen;
