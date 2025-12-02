import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';
import {useFormik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {SvgXml} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import routes from '@routes';
import {translateLang} from 'store/accLanguages/slide';
import {stylesProductQuote} from './styles';
import {
  arrow_down_big,
  checkbox_20,
  checkbox_active_20,
  close_blue,
  radio,
  radio_active,
} from 'svgImg';
import {
  ApiQuotation_Add,
  ApiQuotation_Edit,
  ApiQuotation_Submit,
} from 'action/Api';
import {
  Button,
  CardModalSelect,
  HeaderBack,
  InputDefault,
  ModalNotify,
  NotifierAlert,
  ModalSelectDate,
  ModalProductQuote,
} from 'components';
import {
  fetchListEntryQuote,
  fetchListItemsProduct,
} from 'store/accProduct_Quote/thunk';
import moment from 'moment';
import {updateListItemsProduct} from 'store/accProduct_Quote/slide';
import {scale} from 'utils/resolutions';

const FormProductQuote = ({route}) => {
  const item = route?.params?.item;
  const editPrice = route?.params?.editPrice;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const {detailMenu} = useSelector(state => state.Home);
  const {
    listSaleChannel,
    listCurrencyUnit,
    listPaymentTimes,
    listEntry,
    listGoodTypes,
    listPriceGroup,
    listCustPricingProcedures,
  } = useSelector(state => state.ProductQuote);
  // console.log('listCustPricingProcedures', listCustPricingProcedures);
  const {listCustomerByUserID} = useSelector(state => state.Login);
  const [isShowOptionsModalCancel, setShowOptionsModalCancel] = useState(false);
  const [valueEntry, setValueEntry] = useState(
    editPrice
      ? listEntry?.find(entry => entry.EntryID === item?.EntryID)
      : listEntry?.[0],
  );
  const [valueSalesChannel, setValueSalesChannel] = useState(
    editPrice
      ? listSaleChannel?.find(entry => entry.ID === item?.SalesChannelID)
      : listSaleChannel?.[0],
  );
  const [valuePaymentTimes, setValuePaymentTimes] = useState(
    editPrice
      ? listPaymentTimes?.find(payment => payment?.ID === item?.PaymentTermID)
      : listPaymentTimes?.[0],
  );
  const [valueCurrencyType, setValueCurrencyType] = useState(
    editPrice
      ? listCurrencyUnit?.find(
          currency => currency?.ID === item?.CurrencyTypeID,
        )
      : listCurrencyUnit?.find(currency => currency?.Code === 'VND'),
  );
  const [valueProcessPrice, setValueProcessPrice] = useState(
    editPrice
      ? listCustPricingProcedures?.find(
          process =>
            String(process?.Name) === String(item?.CustPricingProcedure),
        ) || listCustPricingProcedures?.[0]
      : //  ? null
        listCustPricingProcedures?.[0],
  );
  // console.log('item?.CustPricingProcedure', valueProcessPrice);
  const {listcompany} = useSelector(state => state.Login);
  const [valueCompany, setValueCompany] = useState(
    editPrice
      ? listcompany?.find(
          item => item?.CmpnID?.toString() === item?.CmpnID?.toString(),
        )
      : listcompany?.[0],
  );
  const [valueGoodType, setValueGoodType] = useState([]);
  const [valueCustomer, setValueCustomer] = useState([]);
  const [valuePriceGroup, setValuePriceGroup] = useState(
    editPrice
      ? listPriceGroup?.find(price => price?.ID === item?.PriceGroupID)
      : listPriceGroup?.[0],
  );
  // console.log('listPriceGroup', listPriceGroup);
  const [isShowInforGeneral, setIsShowInforGeneral] = useState(true);
  const [isShowModal, setIsShowModal] = useState(false);
  const [selectListDocument, setSelectListDocument] = useState([]);
  const [dateStates, setDateStates] = useState({
    fromDate: {
      selected: null,
      submit: null,
      initial: null,
      visible: false,
    },
    toDate: {
      selected: null,
      submit: null,
      initial: null,
      visible: false,
    },
    planDate: {
      selected: null,
      submit: null,
      visible: false,
    },
  });

  useEffect(() => {
    if (!editPrice || !item) return;

    const customerIDs = item?.Customers?.split(',').map(id => Number(id)) ?? [];
    const matchedCustomers =
      listCustomerByUserID?.filter(c => customerIDs.includes(c.ID)) ?? [];
    setValueCustomer(matchedCustomers);

    const goodTypeIDs =
      item?.GoodsTypes?.split(',').map(id => Number(id)) ?? [];
    const matchedGoodTypes =
      listGoodTypes?.filter(g => goodTypeIDs.includes(g.ID)) ?? [];
    setValueGoodType(matchedGoodTypes);
  }, [editPrice, item, listCustomerByUserID, listGoodTypes]);

  const isFirstCall = useRef(true);

  const DATA_PRICE_REFERENCE = [
    {ID: 1, Name: languageKey('_general_price'), Value: 1},
    {ID: 2, Name: languageKey('_separate_price'), Value: 0},
  ];

  const [selectedPrice, setSelectedPrice] = useState(
    editPrice && item?.IsGeneralPrice === 1
      ? DATA_PRICE_REFERENCE[0]
      : DATA_PRICE_REFERENCE[1],
  );

  const handleSelection = item => {
    setSelectedPrice(item);
  };

  const DATA_PROMOTION = [{ID: 1, Name: languageKey('_yes'), Value: 1}];

  const [selectedPromotion, setSelectedPromotion] = useState(
    editPrice && item?.IsGeneApplyPromotionralPrice === 1
      ? DATA_PROMOTION[0]
      : null,
  );

  const handleSelectPromotion = item => {
    if (selectedPromotion?.ID === item?.ID) {
      setSelectedPromotion(null);
    } else {
      setSelectedPromotion(item);
    }
  };

  const openModalOptionsCancel = item => {
    setShowOptionsModalCancel(true);
  };

  const handleCloseOptionsMoalCancel = () => {
    setShowOptionsModalCancel(false);
  };

  const handleShowInforGeneral = () => {
    setIsShowInforGeneral(!isShowInforGeneral);
  };

  const updateDateState = (key, newValues) => {
    setDateStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...newValues,
      },
    }));
  };

  useEffect(() => {
    if (item) {
      updateDateState('fromDate', {
        selected: item.FromDate,
        submit: item.FromDate,
      });
      updateDateState('toDate', {
        selected: item.ToDate,
        submit: item.ToDate,
      });
      updateDateState('planDate', {
        selected: item.ODate,
        submit: item.ODate,
      });
    } else {
      const now = new Date();
      updateDateState('fromDate', {selected: now});
      updateDateState('toDate', {selected: now});
      updateDateState('planDate', {selected: now});
    }
  }, [item]);

  const showModal = () => {
    setIsShowModal(true);
  };

  const closeModal = () => {
    setIsShowModal(false);
  };

  const initialValues = {
    OID: '',
    Note: editPrice ? item?.Note : '',
    QuotationName: editPrice ? item?.QuotationName : '',
    QuotationNameExtention1: editPrice ? item?.QuotationNameExtention1 : '',
    CurrencyDate: editPrice ? item?.CurrencyDate : new Date(),
    DeliveryTerms: editPrice ? item?.DeliveryTerms : '',
    Info: editPrice ? item?.Info : '',
    Note: editPrice ? item?.Note : '',
    Details: [],
  };

  const {values, errors, touched, handleChange, handleBlur, setFieldValue} =
    useFormik({
      initialValues,
    });

  const handleSave = _.debounce(
    async () => {
      const errors = [];

      if (!valueEntry?.EntryID) {
        errors.push(languageKey('_please_select_function'));
      }

      if (!values?.QuotationName) {
        errors.push(languageKey('_please_enter_price_list_name'));
      }

      if (errors.length > 0) {
        Alert.alert(errors[0]);
        return;
      }
      const toNumber = v => {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
      };
      const body = {
        FactorID: detailMenu?.factorId,
        EntryID: valueEntry?.EntryID,
        OID: editPrice ? item.OID : '',
        ODate: dateStates?.planDate?.submit,
        SAPID: '',
        LemonID: '',
        QuotationName: values?.QuotationName || '',
        QuotationNameExtention1: values?.QuotationNameExtention1 || '',
        QuotationNameExtention2: '',
        QuotationNameExtention3: '',
        QuotationNameExtention4: '',
        QuotationNameExtention5: '',
        QuotationNameExtention6: '',
        QuotationNameExtention7: '',
        QuotationNameExtention8: '',
        QuotationNameExtention9: '',
        FromDate: moment(dateStates?.fromDate?.submit).format('YYYY-MM-DD'),
        ToDate: moment(dateStates?.toDate?.submit).format('YYYY-MM-DD'),
        SalesChannelID: valueSalesChannel?.ID || 0,
        CustPricingProcedure: valueProcessPrice?.Code || 'Z',
        Customers: valueCustomer?.map(item => item?.ID).join(',') || '',
        GoodsTypes: valueGoodType?.map(item => item?.ID).join(',') || '',
        PriceGroupID: valuePriceGroup?.ID || 0,
        IsGeneralPrice: selectedPrice?.Value || 0,
        ApplyPromotion: selectedPromotion?.Value || 0,
        PaymentTermID: valuePaymentTimes?.ID || 0,
        CurrencyTypeID: valueCurrencyType?.ID || 0,
        CurrencyRate:
          valueCurrencyType?.Code === 'VND' ? 1 : values?.CurrencyRate,
        CurrencyDate: dateStates?.currencyDate?.submit
          ? new Date(dateStates.currencyDate.submit).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        DeliveryTerms: values?.DeliveryTerms || '',
        Info: values?.Info || '',
        Note: values?.Note || '',
        Extention1: '',
        Extention2: '',
        Extention3: '',
        Extention4: '',
        Extention5: '',
        Extention6: '',
        Extention7: '',
        Extention8: '',
        Extention9: '',
        Extention10: '',
        Extention11: '',
        Extention12: '',
        Extention13: '',
        Extention14: '',
        Extention15: '',
        Extention16: '',
        Extention17: '',
        Extention18: '',
        Extention19: '',
        Extention20: '',
        Details: selectListDocument || [],
        QuotationNameExtetion1: '',
        VATAmount:
          selectListDocument.reduce(
            (sum, it) => sum + toNumber(it.VATAmount),
            0,
          ) || 0,
        ItemAmount:
          selectListDocument.reduce(
            (sum, it) => sum + toNumber(it.ItemAmount),
            0,
          ) || 0,
        CmpnID: valueCompany?.CmpnID?.toString() || '5',
        QuotationDetails: '',
        TotalAmount:
          selectListDocument.reduce(
            (sum, it) => sum + toNumber(it.TotalAmount),
            0,
          ) || 0,
        VATValue: '10',
        CriteriaID: '',
        PricingTermsID: '',
        CompanyID: valueCompany?.CmpnID?.toString() || '5',
        ProductTypeID: '',
        ApprovedPriceOID: '',
        QuotationTypeID: '',
        TermsDetailsID: '',
        IncotermsID: '',
        MOQ: '',
        ShipmentPoint: '',
        DeliveryPoint: '',
        QuotationNameExtetion2: '',
        QuotationNameExtetion3: '',
        QuotationNameExtetion4: '',
        QuotationNameExtetion5: '',
        QuotationNameExtetion6: '',
        QuotationNameExtetion7: '',
        QuotationNameExtetion8: '',
        QuotationNameExtetion9: '',
        IsDeleted: '',
        Detail: '',
      };
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa', body);
      try {
        const result = editPrice
          ? await ApiQuotation_Edit(body)
          : await ApiQuotation_Add(body);
        const responeData = result?.data;
        //  console('responeData', responeData);
        if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
          console.log(responeData);
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData.Message}`,
            'success',
          );
          dispatch(updateListItemsProduct([]));
          navigation.navigate(routes.ProductQuoteScreen);
        } else {
          console.log(responeData);
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData.Message}`,
            'error',
          );
        }
      } catch (error) {
        console.log('handleOrderRequest', error);
      }
    },
    2000,
    {leading: true, trailing: false},
  );

  const handleConfirm = _.debounce(
    async () => {
      const body = {
        OID: item?.OID,
        IsLock: item?.IsLock === 0 ? 1 : 0,
        Note: '',
      };
      try {
        const result = await ApiQuotation_Submit(body);
        const responeData = result.data;
        if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData.Message}`,
            'success',
          );
          navigation.navigate(routes.ProductQuoteScreen);
        } else {
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData.Message}`,
            'error',
          );
        }
      } catch (error) {
        console.log('handleConfirm', error);
      }
    },
    2000,
    {leading: true, trailing: false},
  );
  // console.log('detailMenu', detailMenu);
  useEffect(() => {
    const body = {
      FactorID: detailMenu?.factorId,
      EntryID: detailMenu?.entryId,
    };
    dispatch(fetchListEntryQuote(body));
  }, []);

  useEffect(() => {
    const isValid =
      valueSalesChannel &&
      valueProcessPrice &&
      valueCustomer?.length > 0 &&
      valueGoodType?.length > 0 &&
      valuePriceGroup &&
      selectedPrice &&
      valueCurrencyType;

    if (!isValid) return;

    if (isFirstCall.current) {
      isFirstCall.current = false;
      callAPI();
    } else {
      callAPI();
    }
  }, [
    valueSalesChannel,
    valueProcessPrice,
    valueCustomer,
    valueGoodType,
    valueCurrencyType,
    valuePriceGroup,
    selectedPrice,
    selectedPromotion,
    valueEntry,
  ]);
  // console.log('valueCompany', valueCompany);
  const callAPI = () => {
    const body = {
      CmpnID: valueCompany?.CmpnID?.toString(),
      SalesChannelID: valueSalesChannel?.ID || 0,
      CustPricingProcedure: valueProcessPrice?.Code || '',
      Customers: valueCustomer
        ? valueCustomer.map(item => item.ID).join(',')
        : '',
      GoodsTypes: valueGoodType
        ? valueGoodType.map(item => item.ID).join(',')
        : '',
      PriceGroupID: valuePriceGroup?.ID || 0,
      IsGeneralPrice: selectedPrice?.Value ?? 0,
      ApplyPromotion: selectedPromotion?.Value ?? 0,
      CurrencyTypeID: valueCurrencyType?.ID || 0,
      Details: selectListDocument || [],
      EntryID: valueEntry?.EntryID || 'DomesticGeneral',
      FactorID: valueEntry?.FactorID || 'QuotationDomestic',
    };
    dispatch(fetchListItemsProduct(body));
  };
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <LinearGradient
        style={[
          stylesProductQuote.container,
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
        <SafeAreaView style={stylesProductQuote.container}>
          <HeaderBack
            title={languageKey('_product_quote')}
            onPress={() => navigation.goBack()}
            btn={true}
            iconBtn={close_blue}
            onPressBtn={openModalOptionsCancel}
          />
          <ScrollView
            style={stylesProductQuote.scrollView}
            showsVerticalScrollIndicator={false}>
            <View style={stylesProductQuote.containerHeader}>
              <Text style={stylesProductQuote.header}>
                {languageKey('_information_general')}
              </Text>
              <Button
                style={stylesProductQuote.btnShowInfor}
                onPress={handleShowInforGeneral}>
                <SvgXml xml={arrow_down_big} />
              </Button>
            </View>
            {isShowInforGeneral && (
              <View style={stylesProductQuote.card}>
                <View style={stylesProductQuote.input}>
                  <CardModalSelect
                    title={languageKey('_choose_a_company')}
                    data={listcompany}
                    setValue={setValueCompany}
                    value={valueCompany?.CompanyName}
                    bgColor={editPrice ? '#E5E7EB' : '#FAFAFA'}
                    require={true}
                    disabled={editPrice}
                    company={true}
                  />
                </View>
                <View style={stylesProductQuote.input}>
                  <CardModalSelect
                    title={languageKey('_function')}
                    data={listEntry}
                    setValue={setValueEntry}
                    value={valueEntry?.EntryName}
                    bgColor={'#FAFAFA'}
                    require={true}
                  />
                </View>
                <View style={stylesProductQuote.inputAuto}>
                  <View style={stylesProductQuote.inputRead}>
                    <Text style={stylesProductQuote.txtHeaderInputView}>
                      {languageKey('_ct_code')}
                    </Text>
                    <Text
                      style={stylesProductQuote.inputView}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {editPrice ? item?.OID : 'Auto'}
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    <ModalSelectDate
                      title={languageKey('_ct_day')}
                      showDatePicker={() =>
                        updateDateState('planDate', {visible: true})
                      }
                      hideDatePicker={() =>
                        updateDateState('planDate', {visible: false})
                      }
                      initialValue={dateStates.planDate.selected}
                      selectedValueSelected={val =>
                        updateDateState('planDate', {selected: val})
                      }
                      isDatePickerVisible={dateStates.planDate.visible}
                      selectSubmitForm={val =>
                        updateDateState('planDate', {submit: val})
                      }
                      bgColor="#FAFAFA"
                      minimumDate={new Date()}
                      require={true}
                    />
                  </View>
                </View>
                <InputDefault
                  name="QuotationName"
                  returnKeyType="next"
                  style={stylesProductQuote.input}
                  value={values?.QuotationName}
                  label={languageKey('_price_name_vi')}
                  isEdit={true}
                  bgColor={'#FAFAFA'}
                  labelHolder={languageKey('_enter_content')}
                  placeholderInput={true}
                  require={true}
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />
                <InputDefault
                  name="QuotationNameExtention1"
                  returnKeyType="next"
                  style={stylesProductQuote.input}
                  value={values?.QuotationNameExtention1}
                  label={languageKey('_price_name_en')}
                  isEdit={true}
                  bgColor={'#FAFAFA'}
                  labelHolder={languageKey('_enter_content')}
                  placeholderInput={true}
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />
                <View style={stylesProductQuote.inputFormDate}>
                  <View style={{flex: 1}}>
                    <ModalSelectDate
                      title={languageKey('_fromdate')}
                      showDatePicker={() =>
                        updateDateState('fromDate', {visible: true})
                      }
                      hideDatePicker={() =>
                        updateDateState('fromDate', {visible: false})
                      }
                      initialValue={dateStates.fromDate.selected}
                      selectedValueSelected={val =>
                        updateDateState('fromDate', {selected: val})
                      }
                      isDatePickerVisible={dateStates.fromDate.visible}
                      selectSubmitForm={val =>
                        updateDateState('fromDate', {submit: val})
                      }
                      minimumDate={new Date()}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <ModalSelectDate
                      title={languageKey('_toDate')}
                      showDatePicker={() =>
                        updateDateState('toDate', {visible: true})
                      }
                      hideDatePicker={() =>
                        updateDateState('toDate', {visible: false})
                      }
                      initialValue={dateStates.toDate.selected}
                      selectedValueSelected={val =>
                        updateDateState('toDate', {selected: val})
                      }
                      isDatePickerVisible={dateStates.toDate.visible}
                      selectSubmitForm={val =>
                        updateDateState('toDate', {submit: val})
                      }
                      minimumDate={new Date()}
                    />
                  </View>
                </View>

                <View style={stylesProductQuote.input}>
                  <CardModalSelect
                    title={languageKey('_sales_channel')}
                    data={listSaleChannel}
                    setValue={setValueSalesChannel}
                    value={valueSalesChannel?.Name}
                    bgColor={'#FAFAFA'}
                  />
                </View>
                {/* <View style={stylesProductQuote.input}>
                <CardModalSelect
                  title={languageKey('_customer_pricing_process')}
                  data={listCustPricingProcedures}
                  setValue={setValueProcessPrice}
                  value={valueProcessPrice?.Code}
                  bgColor={'#FAFAFA'}
                />
              </View> */}
                <View style={stylesProductQuote.input}>
                  <CardModalSelect
                    title={languageKey('_customer_name')}
                    data={listCustomerByUserID}
                    setValue={setValueCustomer}
                    value={valueCustomer?.map(item => item?.Name).join(', ')}
                    bgColor={'#FAFAFA'}
                    multiple={true}
                  />
                </View>
                <View style={stylesProductQuote.input}>
                  <CardModalSelect
                    title={languageKey('_product_industry')}
                    data={listGoodTypes}
                    setValue={setValueGoodType}
                    value={valueGoodType?.map(item => item?.Name).join(', ')}
                    bgColor={'#FAFAFA'}
                    multiple={true}
                  />
                </View>

                <View style={stylesProductQuote.containerRadio}>
                  <Text style={stylesProductQuote.label}>
                    {languageKey('_reference_price')}
                  </Text>
                  <View style={stylesProductQuote.row}>
                    {DATA_PRICE_REFERENCE.map((item, index) => {
                      const isMultipleCustomers = valueCustomer.length > 1;
                      const isDisabled = isMultipleCustomers && index !== 0;

                      return (
                        <TouchableOpacity
                          key={item?.ID}
                          style={[
                            stylesProductQuote.radio,
                            isDisabled && {opacity: 0.5},
                          ]}
                          onPress={() => {
                            if (!isDisabled) handleSelection(item);
                          }}
                          disabled={isDisabled}>
                          {selectedPrice?.ID === item?.ID ? (
                            <SvgXml xml={radio_active} />
                          ) : (
                            <SvgXml xml={radio} />
                          )}
                          <Text
                            bold
                            style={[
                              stylesProductQuote.contentTime,
                              {marginLeft: 4},
                            ]}
                            numberOfLines={2}
                            ellipsizeMode="tail">
                            {item?.Name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={stylesProductQuote.containerRadio}>
                  <Text style={stylesProductQuote.label}>
                    {languageKey('_apply_promotion')}
                  </Text>
                  <View style={stylesProductQuote.row}>
                    {DATA_PROMOTION.map(item => (
                      <TouchableOpacity
                        key={item?.ID}
                        style={stylesProductQuote.radio}
                        onPress={() => handleSelectPromotion(item)}>
                        {selectedPromotion?.ID === item?.ID ? (
                          <SvgXml xml={checkbox_active_20} />
                        ) : (
                          <SvgXml xml={checkbox_20} />
                        )}
                        <Text
                          bold
                          style={[
                            stylesProductQuote.contentTime,
                            {marginLeft: 4},
                          ]}
                          numberOfLines={2}
                          ellipsizeMode="tail">
                          {item?.Name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={stylesProductQuote.input}>
                  <CardModalSelect
                    title={languageKey('_price_group')}
                    data={listPriceGroup}
                    setValue={setValuePriceGroup}
                    value={valuePriceGroup?.Name}
                    bgColor={'#FAFAFA'}
                  />
                </View>
                <View style={stylesProductQuote.input}>
                  <CardModalSelect
                    title={languageKey('_payment_terms')}
                    data={listPaymentTimes}
                    setValue={setValuePaymentTimes}
                    value={valuePaymentTimes?.Name}
                    bgColor={'#FAFAFA'}
                  />
                </View>
                <View style={stylesProductQuote.input}>
                  <CardModalSelect
                    title={languageKey('_currency_unit')}
                    data={listCurrencyUnit}
                    setValue={setValueCurrencyType}
                    value={valueCurrencyType?.Name}
                    bgColor={'#FAFAFA'}
                  />
                </View>
                <View style={stylesProductQuote.inputAuto}>
                  <InputDefault
                    name="CurrencyRate"
                    returnKeyType="next"
                    style={stylesProductQuote.inputRead}
                    value={values?.CurrencyRate}
                    label={languageKey('_exchange_rate_by_day')}
                    isEdit={true}
                    bgColor={
                      valueCurrencyType?.Code !== 'VND' ? '#FAFAFA' : '#E5E7EB'
                    }
                    labelHolder={'1'}
                    disabled={valueCurrencyType?.Code !== 'VND' ? false : true}
                    placeholderInput={true}
                    {...{
                      touched,
                      errors,
                      handleBlur,
                      handleChange,
                      setFieldValue,
                    }}
                  />
                  <View style={stylesProductQuote.inputRead}>
                    <Text style={stylesProductQuote.txtHeaderInputView}>
                      {languageKey('_exchange_rate_date')}
                    </Text>
                    <Text
                      style={stylesProductQuote.inputView}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {moment(new Date()).format('DD/MM/YYYY')}
                    </Text>
                  </View>
                </View>
                <InputDefault
                  name="DeliveryTerms"
                  returnKeyType="next"
                  style={stylesProductQuote.input}
                  value={values?.DeliveryTerms}
                  label={languageKey('_information_delivery')}
                  isEdit={true}
                  bgColor={'#FAFAFA'}
                  labelHolder={languageKey('_enter_content')}
                  placeholderInput={true}
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />
                <InputDefault
                  name="Info"
                  returnKeyType="next"
                  style={stylesProductQuote.input}
                  value={values?.Info}
                  label={languageKey('_other_information')}
                  isEdit={true}
                  bgColor={'#FAFAFA'}
                  labelHolder={languageKey('_enter_content')}
                  placeholderInput={true}
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />
                <InputDefault
                  name="Note"
                  returnKeyType="next"
                  style={stylesProductQuote.input}
                  value={values?.Note}
                  label={languageKey('_note')}
                  placeholderInput={true}
                  isEdit={true}
                  bgColor={'#FAFAFA'}
                  labelHolder={languageKey('_enter_notes')}
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />
              </View>
            )}
            <View style={stylesProductQuote.containerAdd}>
              <Text style={stylesProductQuote.header}>
                {languageKey('_product_list')}
              </Text>
              <Button
                style={stylesProductQuote.btnUploadFile}
                onPress={showModal}>
                <Text style={stylesProductQuote.txtBtnUploadFile}>
                  {languageKey('_add')}
                </Text>
              </Button>
            </View>
            <ModalProductQuote
              setValue={setSelectListDocument}
              showModal={isShowModal}
              closeModal={closeModal}
              dataEdit={item?.Details}
              cusID={valueCustomer?.ID}
              salesChannel={valueSalesChannel?.ID || 0}
              custPricingProcedure={valueProcessPrice?.Name || ''}
              customers={
                valueCustomer
                  ? valueCustomer.map(item => item.ID).join(',')
                  : ''
              }
              goodTypes={
                valueGoodType
                  ? valueGoodType.map(item => item.ID).join(',')
                  : ''
              }
              priceGroup={valuePriceGroup?.ID || 0}
              isGeneralPrice={selectedPrice?.Value ?? 0}
              applyPromotion={selectedPromotion?.Value ?? 0}
              currencyTypeID={valueCurrencyType?.ID || 0}
              CmpnID={valueCompany?.CmpnID?.toString() || '5'}
            />
          </ScrollView>
          <View style={stylesProductQuote.containerFooter}>
            <Button style={stylesProductQuote.btnSave} onPress={handleSave}>
              <Text style={stylesProductQuote.txtBtnSave}>
                {languageKey('_save')}
              </Text>
            </Button>
            <Button
              style={stylesProductQuote.btnConfirm}
              disabled={item ? false : true}
              onPress={handleConfirm}>
              <Text style={stylesProductQuote.txtBtnConfirm}>
                {languageKey('_confirm')}
              </Text>
            </Button>
          </View>
          <ModalNotify
            isShowOptions={isShowOptionsModalCancel}
            handleClose={handleCloseOptionsMoalCancel}
            handleAccept={() => navigation.goBack()}
            handleCancel={handleCloseOptionsMoalCancel}
            btnNameAccept={languageKey('_argee')}
            btnCancel={languageKey('_cancel')}
            content={languageKey('_cancel_creating_proposal')}
          />
        </SafeAreaView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default FormProductQuote;
