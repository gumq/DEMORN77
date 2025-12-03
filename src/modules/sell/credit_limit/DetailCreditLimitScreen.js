import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  View,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
  Text,
  Platform,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Modal from 'react-native-modal';

import {edit} from '@svgImg';
import routes from '@routes';
import {stylesDetail, stylesFormCredit} from './styles';
import {DetailTab, ProgressTab} from './componentTab';
import {translateLang} from '@store/accLanguages/slide';
import {
  ApiCustomerProfiles_GetById,
  ApiGeneralApprovals_ApprovalList,
} from '@api';
import {
  fetchDetailCreditLimit,
  fetchInformationSAP,
} from '@store/accCredit_Limit/thunk';
import {
  Button,
  HeaderBack,
  LoadingModal,
  ModalSelectDate,
  NotifierAlert,
  RadioButton,
  TabsHeaderDevices,
} from '@components';
import {fetchApiApprovalProcess_GetById} from '@store/accApproval_Signature/thunk';
import {scale} from '@utils/resolutions';;
import {fetchListItemType} from '@store/accCustomer_Profile/thunk';

const DetailCreditLimitScreen = ({route, item}) => {
  const itemData = item || route?.params?.item;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {userInfo, listUserByUserID, listCustomerByUserID} = useSelector(
    state => state.Login,
  );
  const languageKey = useSelector(translateLang);
  const {
    isSubmitting,
    detailCreditLimit,
    listCurrencyType,
    listPartnerGroup,
    informationSAP,
    listObjectsType,
  } = useSelector(state => state.CreditLimit);
  const [contentApproval, onChangeContentApproval] = useState('');
  const [limitSO, onChangeLimitSO] = useState(0);
  const [limitOD, onChangeLimitOD] = useState(0);
  const dataCheckbox = [
    {id: 1, value: languageKey('_argee'), key: 1},
    {id: 2, value: languageKey('_refuse'), key: 0},
  ];
  const [isApproval, setIsApproval] = useState(dataCheckbox[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [limitSOConvertVND, setLimitSOConvertVND] = useState(0);
  const [limitODConvertVND, setLimitODConvertVND] = useState(0);
  const [dateFields, setDateFields] = useState({
    expired: null,
    expiredSubmit: null,
  });
  const [visiblePickers, setVisiblePickers] = useState({
    expired: false,
  });
  const [dataBXD, setDataBXD] = useState([]);
  const [currentDoc, setcurrentDoc] = useState([]);
  const currencyName = listCurrencyType?.find(
    c => c.ID === itemData?.CurrencyTypeID,
  );
  const valuePartnerGroup = listPartnerGroup?.find(
    partner => partner?.ID === itemData?.PartnerTypeID,
  );

  const handleToggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const formatNumber = value => {
    if (!value) return '';
    return parseFloat(value.replace(/,/g, '')).toLocaleString('en-US');
  };

  const TAB_DETAILS_PROGRAM = [
    {id: 1, label: languageKey('_details')},
    {id: 2, label: languageKey('_progress')},
  ];

  const [selectedTab, setSelectTab] = useState(TAB_DETAILS_PROGRAM[0]);

  const selectTabEvent = item => {
    setSelectTab(item);
  };
  const [valueObjectType, setValueObjectType] = useState(
    1
      ? listObjectsType?.find(
          object => object?.ID === detailCreditLimit?.ObjectTypeID,
        )
      : listObjectsType?.find(object => object?.Code === 'NV'),
  );
  // console.log('valueObjectType',valueObjectType)
  const [valueObject, setValueObject] = useState(() => {
    if (1) {
      return valueObjectType?.Code === 'NV'
        ? listUserByUserID?.find(
            user => user?.UserID === detailCreditLimit?.ObjectID,
          )
        : listCustomerByUserID
            ?.filter(
              item =>
                item.IsClosed === 0 &&
                item?.IsCompleted === 1 &&
                item?.IsActive === 1,
            )
            ?.find(customer => customer?.ID === detailCreditLimit?.ObjectID);
    } else {
      return valueObjectType?.Code === 'NV'
        ? listUserByUserID?.find(
            user => Number(user?.UserID) === Number(userInfo?.UserID),
          )
        : null;
    }
    // return null;
  });
  const navigateFormCustomer = useCallback(
    async ID => {
      try {
        const {data} = await ApiCustomerProfiles_GetById({ID: ID});
        if (data.ErrorCode === '0' && data.StatusCode === 200 && data.Result) {
          setcurrentDoc(data.Result?.CurrentDocs);
        }
      } catch (error) {
        console.log('ApiCustomerProfiles_GetById', error);
      }
    },
    [navigation],
  );
  useEffect(() => {
    if (valueObjectType?.ID && valueObject?.ID) {
      const body = {
        ObjectTypeID: valueObjectType.ID,
        ObjectID: valueObject.ID,
      };
      dispatch(fetchInformationSAP(body));
    }
    if (valueObjectType?.Code === 'KH' && valueObject?.ID) {
      navigateFormCustomer(valueObject?.ID);
    }
  }, [valueObjectType?.ID, valueObject?.ID]);
  useEffect(() => {
    console.log('currentDoc updated =>', currentDoc);
  }, [currentDoc]);
  useEffect(() => {
    const body = {OID: itemData?.OID};
    dispatch(fetchDetailCreditLimit(body));
  }, [itemData]);

  const handleFormEdit = () => {
    navigation.navigate(routes.FormCreditLimitScreen, {
      item: detailCreditLimit,
      editCredit: true,
    });
  };
  // console.log('detailCreditLimit',detailCreditLimit)
  const toggleDatePicker = (key, visible) => {
    setVisiblePickers(prev => ({
      ...prev,
      [key]: visible,
    }));
  };

  const submitApproval = async () => {
    const errors = [];

    if (isApproval.key === 1) {
      if (!limitSO || limitSO === 0) {
        errors.push(languageKey('_enter_so_od_limit'));
      }
      if (valuePartnerGroup?.Code === 'Z03' && (!limitOD || limitOD === 0)) {
        errors.push(languageKey('_enter_od_xk_limit'));
      }
    } else {
      if (!contentApproval || contentApproval.trim() === '') {
        errors.push(languageKey('_select_currency'));
      }
    }

    if (errors.length > 0) {
      Alert.alert(errors[0]);
      return;
    }

    const stringObject = JSON.stringify({
      DefinedLimitSO: limitSO,
      DefinedLimitOD: limitOD,
      ConvertedDefinedLimitSO: limitSOConvertVND,
      ConvertedDefinedLimitOD: limitODConvertVND,
      ApprovedExpiryDate: dateFields.expiredSubmit,
      LinkFeedBack: '',
    });
    const body = {
      dataJson: [
        {
          OID: itemData?.OID,
          FactorID: itemData?.FactorID,
          EntryID: itemData?.EntryID,
          ApprovalProcessID: itemData?.ApprovalProcessID,
          ApprovalStatusID: isApproval?.key,
          ApprovalNote: contentApproval,
          Extention1: 0,
          Extention2: new Date().toISOString(),
          Extention3: '',
          Extention4: '',
          Extention5: '',
          StringObject: stringObject,
        },
      ],
    };
    try {
      const {data} = await ApiGeneralApprovals_ApprovalList(body);
      if (data.StatusCode === 200 && data.ErrorCode === '0') {
        NotifierAlert(
          3000,
          `${languageKey('_notification')}`,
          `${data.Message}`,
          'success',
        );
        navigation.navigate(routes.CreditLimitScreen);
        handleToggleModal();
      } else {
        NotifierAlert(
          3000,
          `${languageKey('_notification')}`,
          `${data.Message}`,
          'error',
        );
        handleToggleModal();
      }
    } catch (error) {
      console.log('ApprovalList', error);
    }
  };

  const appliedToArray = detailCreditLimit?.AppliedToID?.split(',').map(Number);
  const isPermission =
    appliedToArray?.includes(userInfo?.UserID) &&
    detailCreditLimit?.IsLock !== 0;

  useEffect(() => {
    if (itemData) {
      setDateFields(prev => ({
        ...prev,
        expired: itemData.ExpirationDate,
        expiredSubmit: itemData.ExpirationDate,
      }));
    } else {
      const now = new Date();
      setDateFields(prev => ({
        ...prev,
        expired: now,
      }));
    }
  }, [itemData]);

  useEffect(() => {
    if (detailCreditLimit?.IsApprovalExtendedInfo === 0) {
      const limitSOConvert = detailCreditLimit?.ConvertedDefinedLimitSO;
      setLimitSOConvertVND(limitSOConvert);
      const limitODConvert = detailCreditLimit?.ConvertedDefinedLimitOD;
      setLimitODConvertVND(limitODConvert);
    } else {
      const limitSOConvert = limitSO * itemData.ExchangeRate;
      setLimitSOConvertVND(limitSOConvert);
      const limitODConvert = limitOD * itemData.ExchangeRate;
      setLimitODConvertVND(limitODConvert);
    }
  }, [limitOD, limitSO, itemData.ExchangeRate, detailCreditLimit]);
  const fetchDataApprovalProcess_GetById = () => {
    const body = {ID: Number(itemData?.ApprovalProcessID)};
    dispatch(fetchApiApprovalProcess_GetById(body)).then(success => {
      try {
        if (success !== false) {
          // console.log('success', success);
          // setdataDetails(success);
          setDataBXD(success);
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    });
  };
  useEffect(() => {
    fetchDataApprovalProcess_GetById();
  }, [navigation, fetchApiApprovalProcess_GetById]);
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      style={[
        stylesDetail.container,
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
      <SafeAreaView style={stylesDetail.container}>
        <HeaderBack
          title={languageKey('_proposal_detail')}
          onPress={() => navigation.goBack()}
          btn={detailCreditLimit?.IsLock === 0 ? true : false}
          onPressBtn={handleFormEdit}
          iconBtn={edit}
        />
        <View style={stylesDetail.scrollView}>
          <TabsHeaderDevices
            data={TAB_DETAILS_PROGRAM}
            selected={selectedTab}
            onSelect={selectTabEvent}
            tabWidth={2}
          />
          <ScrollView
            style={stylesDetail.containerBody}
            bounces={false}
            showsVerticalScrollIndicator={false}>
            {selectedTab.id === 1 && (
              <DetailTab {...{detailCreditLimit, itemData, currentDoc}} />
            )}
            {selectedTab.id === 2 && (
              <ProgressTab {...{detailCreditLimit, itemData, dataBXD}} />
            )}
          </ScrollView>
        </View>
        {selectedTab.id === 1 && (
          <View style={stylesDetail.containerFooter}>
            <Button
              style={stylesDetail.btnFooter}
              onPress={handleToggleModal}
              disabled={!isPermission}>
              <Text style={stylesDetail.txtBtnFooter}>
                {languageKey('_approve')}
              </Text>
            </Button>
          </View>
        )}
        <Modal
          useNativeDriver
          backdropOpacity={0.6}
          isVisible={modalVisible}
          avoidKeyboard={true}
          style={stylesDetail.optionsModal}
          onBackButtonPress={handleToggleModal}
          onBackdropPress={handleToggleModal}
          hideModalContentWhileAnimating>
          <View style={stylesDetail.optionsModalContainer}>
            <Text style={stylesDetail.headerModalApproval}>
              {languageKey('_approval_information')}
            </Text>
            <ScrollView style={stylesDetail.cardProgramModal}>
              <View style={{marginHorizontal: 12}}>
                <RadioButton
                  initialValue={isApproval}
                  data={dataCheckbox}
                  setValue={setIsApproval}
                />
              </View>
              <View style={stylesDetail.containerInput}>
                <View style={stylesDetail.input}>
                  <Text style={stylesFormCredit.txtHeaderInputView}>
                    {languageKey('_so_od_limit')}
                  </Text>
                  <TextInput
                    multiline={true}
                    style={stylesDetail.inputContent}
                    onChangeText={text =>
                      onChangeLimitSO(text.replace(/[^0-9]/g, ''))
                    }
                    value={formatNumber(limitSO)}
                    placeholder={'0'}
                    keyboardType="numeric"
                  />
                </View>

                <View style={stylesDetail.input}>
                  <Text style={stylesFormCredit.txtHeaderInputView}>
                    {languageKey('_currency')} - {languageKey('_exchange_rate')}
                  </Text>
                  <Text
                    style={stylesDetail.inputView}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {currencyName?.Code} -{' '}
                    {Number(itemData?.ExchangeRate || 0).toLocaleString(
                      'en-US',
                    )}
                  </Text>
                </View>
              </View>
              <View style={stylesDetail.containerInput}>
                <View style={stylesDetail.input}>
                  <Text style={stylesFormCredit.txtHeaderInputView}>
                    {languageKey('_so_od_vnd')}
                  </Text>
                  <Text
                    style={stylesDetail.inputView}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {Number(limitSOConvertVND || 0).toLocaleString('en-US')}
                  </Text>
                </View>
                <View style={stylesDetail.input}>
                  <Text style={stylesFormCredit.txtHeaderInputView}>
                    {languageKey('_od_export_limit')}
                  </Text>
                  <TextInput
                    multiline={true}
                    style={[
                      stylesDetail.inputContent,
                      {
                        backgroundColor:
                          valuePartnerGroup?.Code === 'Z03'
                            ? '#FAFAFA'
                            : '#E5E7EB',
                      },
                    ]}
                    onChangeText={text =>
                      onChangeLimitOD(text.replace(/[^0-9]/g, ''))
                    }
                    value={formatNumber(limitOD)}
                    placeholder={'0'}
                    editable={
                      valuePartnerGroup?.Code === 'Z03' &&
                      detailCreditLimit?.IsApprovalExtendedInfo === 1
                        ? true
                        : false
                    }
                  />
                </View>
              </View>
              <View style={stylesDetail.containerInput}>
                <View style={{width: '50%', bottom: 4}}>
                  <ModalSelectDate
                    title={languageKey('_expiration')}
                    showDatePicker={() => toggleDatePicker('expired', true)}
                    hideDatePicker={() => toggleDatePicker('expired', false)}
                    initialValue={dateFields.expired}
                    selectedValueSelected={val =>
                      setDateFields(prev => ({...prev, expired: val}))
                    }
                    isDatePickerVisible={visiblePickers.expired}
                    selectSubmitForm={val =>
                      setDateFields(prev => ({...prev, expiredSubmit: val}))
                    }
                    disabled={detailCreditLimit?.IsApprovalExtendedInfo === 0}
                    bgColor="#FAFAFA"
                  />
                </View>
                <View style={stylesDetail.input}>
                  <Text style={stylesFormCredit.txtHeaderInputView}>
                    {languageKey('_od_xk_vnd')}
                  </Text>
                  <Text
                    style={stylesDetail.inputView}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {Number(limitODConvertVND || 0).toLocaleString('en-US')}
                  </Text>
                </View>
              </View>
              <Text style={stylesDetail.headerInput}>
                {languageKey('_content')}
              </Text>
              <TextInput
                multiline={true}
                style={stylesDetail.inputNote}
                onChangeText={onChangeContentApproval}
                value={contentApproval}
                numberOfLines={4}
                placeholder={languageKey('_enter_content')}
              />
            </ScrollView>
            <View style={stylesDetail.containerFooterModal}>
              <Button
                style={stylesDetail.btnFooterModal}
                onPress={submitApproval}>
                <Text style={stylesDetail.txtBtnFooterModal}>
                  {languageKey('_confirm')}
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
      <LoadingModal visible={isSubmitting} />
    </LinearGradient>
  );
};

export default DetailCreditLimitScreen;
