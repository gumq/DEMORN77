import React, {useCallback, useEffect, useRef, useState} from 'react';
import _ from 'lodash';
import moment from 'moment';
import {useFormik} from 'formik';
import {SvgXml} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Alert,
  TextInput,
  Platform,
  findNodeHandle,
} from 'react-native';

import routes from '@routes';
import {stylesDetail, stylesFormCredit} from './styles';
import {translateLang} from '@store/accLanguages/slide';
import {arrow_down_big, arrow_next_gray, close_blue} from '@svgImg';
import {
  ApiCreditLimitProposal_Add,
  ApiCreditLimitProposal_Confirm,
  ApiCreditLimitProposal_Edit,
  ApiCreditLimitProposal_Submit,
  ApiCustomerProfiles_GetById,
} from '@api';
import {
  fetchApiCreditLimitProposal_GetInfoGuarantee,
  fetchInformationSAP,
  fetchListDataFilter,
  fetchListEntryCredit,
} from '@store/accCredit_Limit/thunk';
import {
  Button,
  CardModalSelect,
  HeaderBack,
  InputDefault,
  ModalNotify,
  ModalSelectDate,
  NotifierAlert,
  RadioButton,
  AttachManyFile,
  ModalProfileCustomerFile,
} from '@components';
import {
  fetchApiCompanyConfig_GetByUserID,
  fetchListCustomerByUserID,
} from '@store/accAuth/thunk';
import {fetchListCategoryTypeComplaint} from '@store/acc_Complaint_Warranties/thunk';
import {scale} from '@utils/resolutions';;
import GuaranteeList from './componentTab/GuaranteeList';

const FormCreditLimitScreen = ({route}) => {
  const item = route?.params?.item;
  const editCredit = route?.params?.editCredit;
  console.log('editCredit', item);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const languageKey = useSelector(translateLang);
  const {detailMenu} = useSelector(state => state.Home);
  const {listcompany} = useSelector(state => state.Login);
  const {listCustomerByUserID, listUserByUserID} = useSelector(
    state => state.Login,
  );
  const {userInfo} = useSelector(state => state.Login);
  const {
    detailCreditLimit,
    listPartnerGroup,
    listPaymentTimes,
    listObjectsType,
    listCurrencyType,
    informationSAP,
    listEntryCreditLimit,
    listDataFilter,
  } = useSelector(state => state.CreditLimit);
  const listCustomerActive = listCustomerByUserID?.filter(
    item =>
      item?.IsClosed === 0 &&
      item?.IsCompleted === 1 &&
      item?.IsActive === 1 &&
      (item?.CustomerTypeID === 9704 || item?.CustomerTypeCode === 'CT'),
  );
  const {listItemTypes} = useSelector(state => state.CustomerProfile);
  const [isShowOptionsModalCancel, setShowOptionsModalCancel] = useState(false);
  const [valueRecommendedType, setValueRecommendedType] = useState(
    editCredit
      ? listEntryCreditLimit?.find(
          item => item?.EntryID === detailCreditLimit?.EntryID,
        )
      : listEntryCreditLimit?.[0],
  );
  const [listObjectsTypefilter, setListObjectsTypefilter] =
    useState(listObjectsType);
  const [listInfoGuarantee, setListInfoGuarantee] = useState([]);
  const [valueCompany, setValueCompany] = useState(
    editCredit
      ? listcompany?.find(
          item =>
            item?.CmpnID?.toString() === detailCreditLimit?.CmpnID?.toString(),
        )
      : listcompany?.[0],
  );
  const [valuePaymentTimes, setValuePaymentTimes] = useState(
    editCredit
      ? listPaymentTimes?.find(
          item => item?.ID === detailCreditLimit?.PaymentTermsID,
        )
      : null,
  );
  const [valueObjectType, setValueObjectType] = useState(
    editCredit
      ? listObjectsType?.find(
          object => object?.ID === detailCreditLimit?.ObjectTypeID,
        )
      : listObjectsType?.find(object => object?.Code === 'NV'),
  );
  const [valueListCustomerProfiles, setValueListCustomerProfiles] =
    useState(null);
  const [valueObject, setValueObject] = useState(() => {
    if (editCredit) {
      return valueObjectType?.Code === 'NV'
        ? listUserByUserID?.find(
            user => user?.UserID === detailCreditLimit?.ObjectID,
          )
        : listCustomerActive?.find(
            customer => customer?.ID === detailCreditLimit?.ObjectID,
          );
    } else {
      return valueObjectType?.Code === 'NV'
        ? listUserByUserID?.find(
            user => Number(user?.UserID) === Number(userInfo?.UserID),
          )
        : null;
    }
    // return null;
  });
  const [currentDoc, setcurrentDoc] = useState([]);
  const [valueCurrencyType, setValueCurrencyType] = useState(
    editCredit
      ? listCurrencyType?.find(
          currency => currency?.ID === detailCreditLimit?.CurrencyTypeID,
        )
      : listCurrencyType?.find(currency => currency?.SAPID === 'VND'),
  );
  // console.log(
  //   'listCurrencyType',
  //   listCurrencyType?.find(currency => currency?.SAPID === 'VND'),
  // );
  const [valuePartnerGroup, setValuePartnerGroup] = useState(
    editCredit
      ? listPartnerGroup?.find(
          partner => partner?.ID === detailCreditLimit?.PartnerTypeID,
        )
      : listPartnerGroup?.find(partner => partner?.Code === 'Z01'),
  );
  const [valueCustomerGuarantee, setValueCustomerGuarantee] = useState(
    editCredit
      ? listCustomerActive?.find(
          cus => cus?.ID === detailCreditLimit?.GuarantorCustomerID,
        )
      : null,
  );
  // console.log('valueObjectvalueObjectvalueObject', valueObject);
  const [dateStates, setDateStates] = useState({
    planDate: {
      selected: null,
      submit: null,
      visible: false,
    },
    fromDate: {
      selected: null,
      submit: null,
      visible: false,
    },
    toDate: {
      selected: null,
      submit: null,
      visible: false,
    },
  });

  const updateDateState = (key, newValues) => {
    setDateStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...newValues,
      },
    }));
  };

  const [limitSOConvertVND, setLimitSOConvertVND] = useState(0);
  const [limitODConvertVND, setLimitODConvertVND] = useState(0);
  const [contentApproval, onChangeContentApproval] = useState('');
  const [linkImage, setLinkImage] = useState(
    editCredit && detailCreditLimit?.Link?.trim() !== ''
      ? detailCreditLimit.Link
      : '',
  );
  const linkImgArray = linkImage ? linkImage.split(';').filter(Boolean) : [];
  const [images, setDataImages] = useState(linkImgArray);
  const [linkImageFeedBack, setLinkImageFeedBack] = useState(
    editCredit && detailCreditLimit?.LinkFeedBack?.trim() !== ''
      ? detailCreditLimit.LinkFeedBack
      : '',
  );
  const linkImgArrayFeedBack = linkImageFeedBack
    ? linkImageFeedBack.split(';').filter(Boolean)
    : [];
  const [imagesFeedBack, setDataImagesFeedBack] =
    useState(linkImgArrayFeedBack);
  const [filesForm, setFilesForm] = useState(
    editCredit ? detailCreditLimit?.Link : '',
  );
  const dataCheckbox = [
    {id: 1, value: languageKey('_argee'), key: 1},
    {id: 2, value: languageKey('_refuse'), key: 0},
  ];

  const [isApproval, setIsApproval] = useState(dataCheckbox[0]);

  const [showInformation, setShowInformation] = useState({
    general: true,
    customer: true,
    reference: false,
    GuaranteeNews: false,
    gthskh: false,
  });

  const toggleInformation = key => {
    setShowInformation(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const openModalOptionsCancel = () => {
    setShowOptionsModalCancel(true);
  };

  const handleCloseOptionsMoalCancel = () => {
    setShowOptionsModalCancel(false);
  };
  const fetchDataGetInfoGuarantee = body => {
    console.log('body', body);
    dispatch(fetchApiCreditLimitProposal_GetInfoGuarantee(body)).then(
      success => {
        try {
          if (success !== false) {
            console.log('success', success);
            setListInfoGuarantee(success);
          } else {
          }
        } catch (error) {
          console.log(error);
        }
      },
    );
  };
  const scrollViewRef = useRef(null);
  const fieldRefs = useRef({});
  const registerFieldRef = (key, node) => {
    if (!key) return;
    fieldRefs.current[key] = node;
  };
  const scrollToField = fieldKey => {
    const node = fieldRefs.current[fieldKey];
    if (!node || !scrollViewRef.current) return;
    const scrollNode = findNodeHandle(scrollViewRef.current);
    node.measureLayout(
      scrollNode,
      (x, y) => {
        const offset = Math.max(0, y - 16);
        scrollViewRef.current.scrollTo({y: offset, animated: true});
      },
      err => {
        node.measure((fx, fy, width, height, px, py) => {
          scrollViewRef.current.scrollTo({y: py - 100, animated: true});
        });
      },
    );
  };
  useEffect(() => {
    const bodyCustomer = {
      CustomerRepresentativeID: userInfo?.UserID || 0,
      //   SalesStaffID: null,
      //   Function: 'Default',
      CmpnID: valueCompany?.CmpnID?.toString(),
    };
    // console.log('bodyCustomerbodyCustomerbodyCustomer', bodyCustomer);
    dispatch(fetchListCustomerByUserID(bodyCustomer));
  }, [valueCompany?.ID]);
  const initialValues = {
    ProposalTypeID: editCredit ? valueRecommendedType : '',
    ObjectTypeID: editCredit ? valueObjectType : '',
    ObjectID: editCredit ? valueObject : '',
    PartnerTypeID: editCredit ? valuePartnerGroup : '',
    RequestedLimitSO: editCredit ? item?.RequestedLimitSO : 0,
    RequestedLimitOD: editCredit ? item?.RequestedLimitOD : 0,
    CurrencyTypeID: editCredit ? valueCurrencyType : '',
    ExchangeRate: editCredit ? item?.ExchangeRate : 1,
    PaymentTermsID: editCredit ? valuePaymentTimes : '',
    BusinessProposalContent: editCredit ? item?.BusinessProposalContent : '',
    CustomerProposalContent: editCredit ? item?.CustomerProposalContent : '',
    Note: editCredit ? item?.Note : '',
  };
  const safeJsonParseArray = str => {
    if (!str) return [];
    if (Array.isArray(str)) return str;

    try {
      return JSON.parse(str);
    } catch (err) {
      Alert.alert(
        'Lỗi dữ liệu',
        `'Extention2' không đúng định dạng JSON.\nVui lòng kiểm tra lại.`,
      );
      return [];
    }
  };
  const {values, errors, touched, handleChange, handleBlur, setFieldValue} =
    useFormik({
      initialValues,
    });
  const handleCreditRequest = _.debounce(
    async () => {
      const errors = [];
      const _valueObjectType = valueObjectType;
      if (dateStates.fromDate?.submit && dateStates.toDate?.submit) {
        const from = new Date(dateStates.fromDate.submit);
        const to = new Date(dateStates.toDate.submit);

        if (to < from) {
          errors.push('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }
      }

      if (!valueRecommendedType?.EntryID) {
        errors.push(languageKey('_please_select_function'));
      }

      if (!valuePartnerGroup?.ID) {
        errors.push(languageKey('_please_select_partner_group'));
      }

      if (!_valueObjectType?.ID) {
        errors.push(languageKey('_please_select_object_type'));
      }

      if (
        valueObjectType?.Code === 'NV' ? !valueObject?.UserID : !valueObject?.ID
      ) {
        errors.push(languageKey('_please_select_subject'));
      }

      if (
        valueRecommendedType?.EntryID === 'QuarterlyTransfers'
        // valueRecommendedType?.EntryID === 'GuaranteeTransfers' ||
        // valueRecommendedType?.EntryID === 'GuaranteeChanges'
      ) {
        if (!valueCustomerGuarantee?.ID) {
          errors.push(languageKey('_please_guarantor_customer'));
        }
      }

      if (!values?.RequestedLimitSO) {
        errors.push(languageKey('_enter_so_od_limit'));
      }

      if (valuePartnerGroup?.Code === 'Z03') {
        if (!values?.RequestedLimitSO) {
          errors.push(languageKey('_enter_od_xk_limit'));
        }
      }

      if (!valueCurrencyType?.ID) {
        errors.push(languageKey('_select_currency'));
      }

      if (!values?.ExchangeRate) {
        errors.push(languageKey('_please_enter_exchange_rate'));
      }

      if (!valuePaymentTimes?.ID) {
        errors.push(languageKey('_please_select_payment_terms'));
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
        CmpnID: editCredit
          ? valueCompany?.CmpnID?.toString()
          : valueCompany?.CmpnID?.toString() ?? '',
        OID: editCredit ? item?.OID : '',
        ODate: moment(dateStates.planDate.submit).format('YYYY-MM-DD'),
        FactorID: 'Credit',
        EntryID: valueRecommendedType?.EntryID,
        SAPID: '',
        LemonID: '',
        ProposalTypeID: 0,
        SalesTypeID: 0,
        ObjectTypeID: valueObjectType?.ID || 0,
        ObjectID:
          valueObjectType?.Code === 'NV'
            ? valueObject?.UserID
            : valueObject?.ID,
        PartnerTypeID: valuePartnerGroup?.ID || 0,
        RequestedLimit: 0,
        CurrencyTypeID: valueCurrencyType?.ID || 0,
        ExchangeRate: parseFloat(values?.ExchangeRate) || 0,
        ConvertToVND: 0,
        EffectiveDateFrom: moment(dateStates.fromDate.submit).format(
          'YYYY-MM-DD',
        ),
        EffectiveDateTo: moment(dateStates.toDate.submit).format('YYYY-MM-DD'),
        PaymentTermsID: valuePaymentTimes?.ID || 0,
        Description: '',
        BusinessProposalContent: values?.BusinessProposalContent || '',
        CustomerProposalContent: values?.CustomerProposalContent || '',
        Note: values?.Note,
        Link: linkString || '',
        RequestedLimitSO: parseFloat(values?.RequestedLimitSO) || 0,
        RequestedLimitOD: parseFloat(values?.RequestedLimitOD) || 0,
        ConvertedCreditLimit: parseFloat(limitSOConvertVND) || 0,
        ConvertedExportLimit: parseFloat(limitODConvertVND) || 0,
        GuarantorCustomerID: valueCustomerGuarantee?.ID || 0,
        Extention1: '',
        Extention2: editCredit
          ? item?.Extention2
          : JSON.stringify(listInfoGuarantee),
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
        SAPExpirationDate: moment(new Date()).format('YYYY-MM-DD'),
        SAPDay1: moment(new Date()).format('YYYY-MM-DD'),
        SAPDay2: moment(new Date()).format('YYYY-MM-DD'),
        SAPDay3: moment(new Date()).format('YYYY-MM-DD'),
        SAPRequestedLimitSO: 0,
        SAPConvertedCreditLimit: 0,
        SAPConvertedRemainingLimitSO: '',
        SAPAvgReceivablesSales3Months: 0,
        SAPRequestedLimit_: '',
        SAPRequestedLimitOD: 0,
        IsCustomer: '',
        ObjectTypeCode: valueObjectType?.Code ?? '',
        TotalDebit: '',
        TotalDebitAVG: '',
        SAPConvertedExportLimit: '',
        SAPConvertedRemainingLimitOD: '',
        SalesTypeCode: '',
        SAPAvgSales3Months: 0,
        SAPMaxDailySales3Months: 0,
        NotDueDebit: '',
        SAPRemainingLimit: '',
        ConfirmNote: '',
        ConfirmLink: '',
        TotalAmountAVG: '',
        TotalAmountMax: '',
        TotalOverDebit: '',
        Orders: '',
        LimitEndDate: '',
        LimitFromDate: '',
      };
      // console.log(valueCompany);
      console.log('body', body);
      try {
        const result = editCredit
          ? await ApiCreditLimitProposal_Edit(body)
          : await ApiCreditLimitProposal_Add(body);
        const responeData = result.data;
        console.log('responeData', responeData);
        if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData.Message}`,
            'success',
          );
          navigation.navigate(routes.CreditLimitScreen);
        } else {
          // console.log('aaaaaa',responeData.Message)
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData.Message}`,
            'error',
          );
        }
      } catch (error) {
        console.log('handleCreditRequest', error);
      }
    },
    2000,
    {leading: true, trailing: false},
  );

  const handleConfirm = _.debounce(
    async () => {
      const body = {
        OID: detailCreditLimit?.OID,
        IsLock: detailCreditLimit?.IsLock === 0 ? 1 : 0,
      };
      try {
        const result = await ApiCreditLimitProposal_Submit(body);
        const responeData = result.data;
        if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData.Message}`,
            'success',
          );
          navigation.navigate(routes.CreditLimitScreen);
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

  const handleConfirmCustomer = _.debounce(
    async () => {
      const linkArrayFeedBack =
        typeof linkImageFeedBack === 'string'
          ? linkImageFeedBack.split(';')
          : Array.isArray(linkImageFeedBack)
          ? linkImageFeedBack
          : [];
      const linkStringFeedBack = linkArrayFeedBack.join(';');
      const confirmBody = {
        OID: detailCreditLimit?.OID,
        IsConfirm: isApproval?.key,
        Note: contentApproval || '',
        Link: linkStringFeedBack || '',
      };

      try {
        const result = await ApiCreditLimitProposal_Confirm(confirmBody);
        const responeData = result.data;
        if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData.Message}`,
            'success',
          );
          navigation.navigate(routes.CreditLimitScreen);
        } else {
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData.Message}`,
            'error',
          );
        }
      } catch (error) {
        console.log('handleConfirmCustomer', error);
      }
    },
    2000,
    {leading: true, trailing: false},
  );

  const itemLinks =
    typeof filesForm === 'string' && filesForm.length > 0
      ? filesForm.split(';').map(link => ({
          Content: link.split('/').pop(),
          Link: link,
        }))
      : [];

  useEffect(() => {
    dispatch(fetchListDataFilter());
    const body = {
      FactorID: detailMenu?.factorId,
      EntryID: detailMenu?.entryId,
    };
    dispatch(fetchListEntryCredit(body));
  }, []);
  const navigateFormCustomer = useCallback(
    async ID => {
      try {
        const {data} = await ApiCustomerProfiles_GetById({ID: ID});
        if (data.ErrorCode === '0' && data.StatusCode === 200 && data.Result) {
          setcurrentDoc(data?.Result?.CurrentDocs);
          console.log('data?.Result', data?.Result);
          setValueListCustomerProfiles(data?.Result?.CurrentDocs);
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
      editCredit
        ? null
        : setValuePaymentTimes(
            listPaymentTimes?.filter(
              item => item?.ID === Number(valueObject?.SAPPaymentTermsID),
            )?.[0],
          );
    }
    if (valueObjectType?.Code === 'NV' && valueObject?.UserID) {
      fetchDataGetInfoGuarantee({
        ObjectTypeID: valueObjectType?.ID,
        ObjectID: valueObject?.UserID,
        CmpnID: valueObject?.CmpnID,
      });
    }
    if (valueObjectType?.Code === 'KH' && valueObject?.ID) {
      navigateFormCustomer(valueObject?.ID);
    }
  }, [valueObjectType?.ID, valueObject]);
  // const getQuarterEndDate = (date = new Date()) => {
  //   const month = date.getMonth() + 1; // 1..12
  //   const endMonth = month <= 3 ? 3 : month <= 6 ? 6 : month <= 9 ? 9 : 12;
  //   // new Date(year, endMonth, 0) trả về ngày cuối cùng của tháng endMonth
  //   return new Date(date.getFullYear(), endMonth, 0);
  // };

  // useEffect(() => {
  //   if (item) {
  //     updateDateState('fromDate', {
  //       selected: item.EffectiveDateFrom,
  //       submit: item.EffectiveDateFrom,
  //     });
  //     updateDateState('toDate', {
  //       selected: item.EffectiveDateTo,
  //       submit: item.EffectiveDateTo,
  //     });
  //   } else {
  //     const now = new Date();
  //     updateDateState('fromDate', {selected: now, submit: now});

  //     const quarterEnd = getQuarterEndDate(now);
  //     updateDateState('toDate', {selected: quarterEnd, submit: quarterEnd});
  //   }
  // }, [item]);
  const getQuarterEndDate = (date = new Date()) => {
    const month = date.getMonth() + 1; // 1..12
    const endMonth = month <= 3 ? 3 : month <= 6 ? 6 : month <= 9 ? 9 : 12;
    // new Date(year, endMonth, 0) = ngày cuối tháng endMonth
    return new Date(date.getFullYear(), endMonth, 0);
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  useEffect(() => {
    if (item) {
      updateDateState('fromDate', {
        selected: item.EffectiveDateFrom,
        submit: item.EffectiveDateFrom,
      });
      updateDateState('toDate', {
        selected: item.EffectiveDateTo,
        submit: item.EffectiveDateTo,
      });
    } else {
      const now = new Date();
      updateDateState('fromDate', {selected: now, submit: now});

      const quarterEnd = getQuarterEndDate(now);
      const quarterEndPlus10 = addDays(quarterEnd, 10);

      updateDateState('toDate', {
        selected: quarterEndPlus10,
        submit: quarterEndPlus10,
      });
    }
  }, [item]);

  const isValidDecimal18_6 = value => {
    const stringValue = String(value).replace(/,/g, '').trim();
    if (!stringValue) return true;

    const [integerPart, decimalPart] = stringValue.split('.');

    const integerLen = integerPart?.length || 0;
    const decimalLen = decimalPart?.length || 0;
    const totalLen = integerLen + decimalLen;

    return integerLen <= 12 && decimalLen <= 6 && totalLen <= 18;
  };

  useEffect(() => {
    const convertedSO =
      Number(values.RequestedLimitSO.toString()?.replace(/,/g, '')) *
      Number(values.ExchangeRate.toString()?.replace(/,/g, ''));
    const convertedOD =
      //  Number(values.RequestedLimitOD) * values.ExchangeRate;
      Number(values.RequestedLimitOD.toString()?.replace(/,/g, '')) *
      Number(values.ExchangeRate.toString()?.replace(/,/g, ''));
    const isValid =
      isValidDecimal18_6(values.RequestedLimitSO) &&
      isValidDecimal18_6(values.RequestedLimitOD) &&
      isValidDecimal18_6(convertedSO) &&
      isValidDecimal18_6(convertedOD);

    if (!isValid) {
      Alert.alert(languageKey('_notification'), languageKey('_noti_money'));
      return;
    }

    setLimitSOConvertVND(convertedSO);
    setLimitODConvertVND(convertedOD);
  }, [values.RequestedLimitSO, values.RequestedLimitOD, values.ExchangeRate]);
  useEffect(() => {
    if (valueRecommendedType && listObjectsType.length > 0) {
      // const isGuarantee = valueRecommendedType.Extention10 === 'Guarantee';
      const isGuarantee =
        valueRecommendedType?.EntryID === 'GuaranteeNews' ||
        valueRecommendedType?.EntryID === 'QuarterlyTransfers' ||
        valueRecommendedType?.EntryID === 'GuaranteeChanges';

      const defaultObjectID = isGuarantee ? 'NV' : 'KH';
      const defaultObject = listObjectsType.find(
        item => item.Code === defaultObjectID,
      );
      if (defaultObject && defaultObject.ID !== valueObjectType?.ID) {
        setListObjectsTypefilter(
          listObjectsType.filter(item => item.Code === defaultObjectID),
        );
        setValueObjectType(defaultObject);
      }
    }
  }, [valueRecommendedType, listObjectsType]);
  // console.log('valueObjectType',valueObject)
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      style={[
        stylesFormCredit.container,
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
      <SafeAreaView style={stylesFormCredit.container}>
        <HeaderBack
          title={
            editCredit
              ? languageKey('_edit_limit_proposal')
              : languageKey('_propose_new_limit')
          }
          onPress={() => navigation.goBack()}
          btn={true}
          iconBtn={close_blue}
          onPressBtn={openModalOptionsCancel}
        />
        <ScrollView
          style={stylesFormCredit.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={stylesFormCredit.footerScroll}>
          <View style={stylesDetail.containerHeader}>
            <View style={stylesDetail.containerRadio}>
              <Text style={stylesDetail.header}>
                {languageKey('_information_general')}
              </Text>
              <View
                style={[
                  stylesDetail.bodyStatus,
                  {backgroundColor: detailCreditLimit?.ApprovalStatusColor},
                ]}>
                <Text
                  style={[
                    stylesDetail.txtStatus,
                    {color: detailCreditLimit?.ApprovalStatusTextColor},
                  ]}>
                  {detailCreditLimit?.ApprovalStatusName}
                </Text>
              </View>
            </View>
            <Button
              style={stylesDetail.btnShowInfor}
              onPress={() => toggleInformation('general')}>
              <SvgXml
                xml={showInformation.general ? arrow_down_big : arrow_next_gray}
              />
            </Button>
          </View>
          {showInformation.general && (
            <View style={stylesFormCredit.card}>
              <Text style={stylesFormCredit.headerProgram}>
                {languageKey('_recommended_information')}
              </Text>
              <View style={stylesFormCredit.input}>
                <CardModalSelect
                  title={languageKey('_choose_a_company')}
                  data={listcompany}
                  setValue={setValueCompany}
                  value={
                    valueCompany?.CompanyCode +
                    ' - ' +
                    valueCompany?.CompanyName
                  }
                  bgColor={editCredit ? '#E5E7EB' : '#FAFAFA'}
                  require={true}
                  disabled={editCredit}
                  company={true}
                />
              </View>
              <View style={stylesFormCredit.input}>
                <CardModalSelect
                  title={languageKey('_function')}
                  data={listEntryCreditLimit}
                  setValue={setValueRecommendedType}
                  value={valueRecommendedType?.EntryName}
                  bgColor={editCredit ? '#E5E7EB' : '#FAFAFA'}
                  require={true}
                  disabled={editCredit}
                />
              </View>
              <View style={stylesFormCredit.inputAuto}>
                <InputDefault
                  name="OID"
                  returnKeyType="next"
                  style={stylesFormCredit.widthInput}
                  value={editCredit ? detailCreditLimit?.OID : 'Auto'}
                  label={languageKey('_ct_code')}
                  isEdit={false}
                  placeholderInput={true}
                  bgColor={'#E5E5E5'}
                  labelHolder={'Auto'}
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />
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
                    bgColor={'#FAFAFA'}
                    require={true}
                    minimumDate={new Date()}
                  />
                </View>
              </View>
              <View style={stylesFormCredit.input}>
                <CardModalSelect
                  title={languageKey('_business_partner_group')}
                  data={listPartnerGroup?.filter(
                    item => item?.Code === 'Z01' || item?.Code === 'Z03',
                  )}
                  setValue={setValuePartnerGroup}
                  value={valuePartnerGroup?.Name}
                  bgColor={
                    detailCreditLimit?.IsCustomer === 1 ? '#E5E7EB' : '#FAFAFA'
                  }
                  require={true}
                  disabled={detailCreditLimit?.IsCustomer === 1}
                />
                {/* <CardModalSelect
                      title={languageKey('_business_partner_group')}
                      data={
                        valueCustomerType?.Code === 'HT'
                          ? listPartnerGroup?.filter(
                              item => item?.Code === 'Z02',
                            )
                          : valueCustomerType?.Code === 'TN'
                          ? listPartnerGroup
                          : listPartnerGroup?.filter(
                              item => item?.Code !== 'Z02',
                            )
                      }
                      setValue={setValuePartnerGroup}
                      value={valuePartnerGroup?.Name}
                      bgColor={'#F9FAFB'}
                      require={true}
                    /> */}
              </View>
              <View style={stylesFormCredit.input}>
                <CardModalSelect
                  title={languageKey('_object_type')}
                  data={listObjectsTypefilter}
                  setValue={setValueObjectType}
                  value={valueObjectType?.Name}
                  bgColor={
                    detailCreditLimit?.IsCustomer === 1 ? '#E5E7EB' : '#FAFAFA'
                  }
                  require={true}
                  disabled={detailCreditLimit?.IsCustomer === 1}
                />
              </View>
              <View style={stylesFormCredit.input}>
                <CardModalSelect
                  title={languageKey('_object')}
                  data={
                    valueObjectType?.Code === 'NV'
                      ? listUserByUserID
                      : listCustomerActive
                  }
                  setValue={setValueObject}
                  value={
                    valueObjectType?.Code === 'NV'
                      ? valueObject?.UserFullName
                      : valueObject?.Name
                  }
                  bgColor={
                    detailCreditLimit?.IsCustomer === 1 ? '#E5E7EB' : '#FAFAFA'
                  }
                  require={true}
                  document={valueObjectType?.Code === 'KH' ? true : false}
                  disabled={detailCreditLimit?.IsCustomer === 1}
                />
              </View>
              {valueRecommendedType?.EntryID === 'QuarterlyTransfers' ? (
                <View style={stylesFormCredit.input}>
                  <CardModalSelect
                    title={languageKey('_customer_are_guaranteed')}
                    data={listCustomerActive}
                    setValue={setValueCustomerGuarantee}
                    value={valueCustomerGuarantee?.Name}
                    bgColor={'#FAFAFA'}
                    document={true}
                    require={true}
                  />
                </View>
              ) : null}
              <Text style={stylesFormCredit.headerProgram}>
                {languageKey('_required_limit')}
              </Text>
              <View style={stylesFormCredit.inputAuto}>
                <InputDefault
                  name="RequestedLimitSO"
                  returnKeyType="next"
                  style={stylesFormCredit.widthInput}
                  value={
                    Number.isInteger(
                      parseFloat(
                        values.RequestedLimitSO?.toString()?.replace(/./g, ''),
                      ) ?? '',
                    ) === true
                      ? parseFloat(values.RequestedLimitSO || 0).toLocaleString(
                          'en-US',
                        )
                      : values.RequestedLimitSO
                  }
                  label={languageKey('_so_od_limit')}
                  isEdit={detailCreditLimit?.IsCustomer === 1 ? false : true}
                  placeholderInput={true}
                  labelHolder={'0'}
                  require={true}
                  keyboardType={'numbers-and-punctuation'}
                  bgColor={'#FAFAFA'}
                  numberRight={true}
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />
                <InputDefault
                  name="RequestedLimitOD"
                  returnKeyType="next"
                  style={stylesFormCredit.widthInput}
                  value={Number(values?.RequestedLimitOD || 0).toLocaleString(
                    'en-US',
                  )}
                  label={languageKey('_od_export_limit')}
                  isEdit={valuePartnerGroup?.Code === 'Z03' ? true : false}
                  placeholderInput={true}
                  labelHolder={'0'}
                  require={true}
                  bgColor={
                    valuePartnerGroup?.ID !== 9852 ? '#E5E7EB' : '#FAFAFA'
                  }
                  numberRight={true}
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />
              </View>

              <View style={stylesFormCredit.inputAuto}>
                <View style={stylesFormCredit.widthInput}>
                  <CardModalSelect
                    title={languageKey('_currency_type')}
                    data={listCurrencyType}
                    setValue={setValueCurrencyType}
                    value={valueCurrencyType?.Code}
                    bgColor={'#FAFAFA'}
                    require={true}
                  />
                </View>
                <InputDefault
                  name="ExchangeRate"
                  returnKeyType="next"
                  style={stylesFormCredit.widthInput}
                  value={values?.ExchangeRate}
                  isEdit={true}
                  label={languageKey('_exchange_rate')}
                  placeholderInput={true}
                  labelHolder={'0'}
                  require={true}
                  keyboardType={'numbers-and-punctuation'}
                  bgColor={'#FAFAFA'}
                  numberRight={true}
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />
              </View>
              <View style={stylesFormCredit.inputAuto}>
                <View style={stylesFormCredit.widthInput}>
                  <Text style={stylesFormCredit.txtHeaderInputView}>
                    {languageKey('_so_od_vnd')}
                  </Text>
                  <Text
                    style={[
                      stylesFormCredit.inputView,
                      {textAlign: 'right', paddingRight: scale(10)},
                    ]}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {Number(limitSOConvertVND || 0).toLocaleString('en-US')}
                  </Text>
                </View>
                <View style={stylesFormCredit.widthInput}>
                  <Text style={stylesFormCredit.txtHeaderInputView}>
                    {languageKey('_od_xk_vnd')}
                  </Text>
                  <Text
                    style={[
                      stylesFormCredit.inputView,
                      {textAlign: 'right', paddingRight: scale(10)},
                    ]}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {Number(limitODConvertVND || 0).toLocaleString('en-US')}
                  </Text>
                </View>
              </View>
              <View style={stylesFormCredit.inputFormDate}>
                <View style={{flex: 1}}>
                  <ModalSelectDate
                    title={languageKey('_effective_from_date')}
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
                    bgColor={'#FAFAFA'}
                    require={true}
                    minimumDate={new Date()}
                  />
                </View>
                <View style={{flex: 1}}>
                  <ModalSelectDate
                    title={languageKey('_effective_to_date')}
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
                    bgColor={'#FAFAFA'}
                    require={true}
                    minimumDate={new Date()}
                  />
                </View>
              </View>
              <View style={stylesFormCredit.input}>
                <CardModalSelect
                  title={languageKey('_payment_terms')}
                  data={listPaymentTimes}
                  setValue={setValuePaymentTimes}
                  value={valuePaymentTimes?.Name}
                  bgColor={'#FAFAFA'}
                  require={true}
                />
              </View>
              {detailCreditLimit?.IsCustomer === 1 ? (
                <InputDefault
                  name="CustomerProposalContent"
                  returnKeyType="next"
                  style={stylesFormCredit.input}
                  value={values?.CustomerProposalContent}
                  label={languageKey('_customer_proposal_content')}
                  placeholderInput={true}
                  isEdit={detailCreditLimit?.IsCustomer === 1 ? false : true}
                  bgColor={'#FAFAFA'}
                  labelHolder={languageKey('_enter_content')}
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />
              ) : null}
              <InputDefault
                name="BusinessProposalContent"
                returnKeyType="next"
                style={stylesFormCredit.input}
                value={values?.BusinessProposalContent}
                label={languageKey('_bussiness_proposal_content')}
                placeholderInput={true}
                isEdit={true}
                bgColor={'#FAFAFA'}
                labelHolder={languageKey('_enter_content')}
                {...{touched, errors, handleBlur, handleChange, setFieldValue}}
              />
              <InputDefault
                name="Note"
                returnKeyType="next"
                style={stylesFormCredit.input}
                value={values?.Note}
                label={languageKey('_note')}
                placeholderInput={true}
                isEdit={true}
                bgColor={'#FAFAFA'}
                labelHolder={languageKey('_enter_notes')}
                {...{touched, errors, handleBlur, handleChange, setFieldValue}}
              />
              <View style={stylesFormCredit.imgBox}>
                <Text style={stylesFormCredit.headerBoxImage}>
                  {languageKey('_image')}
                </Text>
                <AttachManyFile
                  OID={detailCreditLimit?.OID}
                  images={images}
                  setDataImages={setDataImages}
                  setLinkImage={setLinkImage}
                  dataLink={linkImage}
                />
              </View>
            </View>
          )}
          {detailCreditLimit?.IsCustomer === 1 && (
            <>
              <View style={stylesDetail.containerHeader}>
                <Text style={stylesDetail.header}>
                  {languageKey('_customer_feedback')}
                </Text>
                <Button
                  style={stylesDetail.btnShowInfor}
                  onPress={() => toggleInformation('customer')}>
                  <SvgXml
                    xml={
                      showInformation.customer
                        ? arrow_down_big
                        : arrow_next_gray
                    }
                  />
                </Button>
              </View>
              {showInformation.customer && (
                <View style={stylesFormCredit.card}>
                  <View style={{marginHorizontal: 12}}>
                    <RadioButton
                      initialValue={isApproval}
                      data={dataCheckbox}
                      setValue={setIsApproval}
                    />
                    <Text style={stylesFormCredit.headerInput}>
                      {languageKey('_content')}
                    </Text>
                    <TextInput
                      style={stylesFormCredit.inputContent}
                      onChangeText={onChangeContentApproval}
                      value={contentApproval}
                      numberOfLines={4}
                      multiline={true}
                      placeholder={languageKey('_enter_content')}
                    />
                  </View>
                  <View style={stylesFormCredit.imgBox}>
                    <Text style={stylesFormCredit.headerBoxImage}>
                      {languageKey('_image')}
                    </Text>
                    <AttachManyFile
                      OID={detailCreditLimit?.OID}
                      images={imagesFeedBack}
                      setDataImages={setDataImagesFeedBack}
                      setLinkImage={setLinkImageFeedBack}
                      dataLink={linkImageFeedBack}
                    />
                  </View>
                </View>
              )}
            </>
          )}
          {(valueRecommendedType?.EntryID === 'QuarterlyTransfers' ||
            valueRecommendedType?.EntryID === 'QuarterlyNews' ||
            valueRecommendedType?.EntryID === 'QuarterlyChanges' ||
            valueRecommendedType?.EntryID === 'GuaranteeTransfers') && (
            <View style={stylesDetail.containerHeader}>
              <Text style={stylesDetail.header}>
                {languageKey('_reference_information')}
              </Text>
              <Button
                style={stylesDetail.btnShowInfor}
                onPress={() => toggleInformation('reference')}>
                <SvgXml
                  xml={
                    showInformation.reference ? arrow_down_big : arrow_next_gray
                  }
                />
              </Button>
            </View>
          )}
          {showInformation.reference &&
            valueObjectType?.Code === 'KH' &&
            !valueObject?.UserID &&
            (valueRecommendedType?.EntryID === 'QuarterlyTransfers' ||
              valueRecommendedType?.EntryID === 'QuarterlyNews' ||
              valueRecommendedType?.EntryID === 'QuarterlyChanges' ||
              valueRecommendedType?.EntryID === 'GuaranteeTransfers') && (
              <View style={stylesDetail.cardFooter}>
                <Text style={stylesDetail.headerProgram}>
                  {languageKey('_current_limit')}
                </Text>
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_currency')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {valueObject?.CurrencyName || ''}
                    </Text>
                  </View>
                  <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_exchange_rate')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {valueObject?.ExchangeRate}
                    </Text>
                  </View>
                </View>
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {'Hiệu lực từ'}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {moment(valueObject?.LimitFromDate).format('DD/MM/YYYY')}
                    </Text>
                  </View>
                  <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_expiration')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {moment(valueObject?.LimitEndDate).format('DD/MM/YYYY')}
                    </Text>
                  </View>
                </View>
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_so_od_limit')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {Number(valueObject?.GrantedLimitOD || 0).toLocaleString(
                        'en-US',
                      )}
                    </Text>
                  </View>
                  <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_so_od_vnd')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {Number(
                        valueObject?.GrantedLimitAmntOD || 0,
                      ).toLocaleString('en-US')}
                    </Text>
                  </View>
                </View>
                <View style={stylesDetail.containerBodyCard}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    Hạn mức nhận đơn còn lại (VND)
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {Number(valueObject?.GrantedLimitNowOD || 0).toLocaleString(
                      'en-US',
                    )}
                  </Text>
                </View>
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_od_export_limit')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {Number(valueObject?.GrantedLimitSO || 0).toLocaleString(
                        'en-US',
                      )}
                    </Text>
                  </View>
                  <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_od_xk_vnd')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {Number(
                        valueObject?.GrantedLimitAmntSO || 0,
                      ).toLocaleString('en-US')}
                    </Text>
                  </View>
                </View>
                <View style={stylesDetail.containerBodyCard}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_od_xk_remaining_vnd')}
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {Number(valueObject?.GrantedLimitNowSO || 0).toLocaleString(
                      'en-US',
                    )}
                  </Text>
                </View>
                <Text style={stylesDetail.headerProgram}>Công nợ</Text>
                <View style={stylesFormCredit.containerBodyCard}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    Công nợ hiện tại
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {Number(valueObject?.TotalDebit || 0).toLocaleString(
                      'en-US',
                    )}
                  </Text>
                </View>
                <View style={stylesDetail.containerBodyCard}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    Công nợ trong hạn
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {Number(valueObject?.NotDueDebit || 0).toLocaleString(
                      'en-US',
                    )}
                  </Text>
                </View>
                <View style={stylesDetail.containerBodyCard}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    Công nợ quá hạn
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {Number(valueObject?.TotalOverDebit || 0).toLocaleString(
                      'en-US',
                    )}
                  </Text>
                </View>

                <Text style={stylesDetail.headerProgram}>
                  {languageKey('_sale_information')}
                </Text>
                <View style={stylesFormCredit.containerBodyCard}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_biggest_daily_sales')}
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {Number(informationSAP?.TotalAmountMax || 0).toLocaleString(
                      'en-US',
                    )}
                  </Text>
                </View>
                <View style={stylesDetail.containerBodyCard}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_average_sales_of')}
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {Number(informationSAP?.TotalAmountAVG || 0).toLocaleString(
                      'en-US',
                    )}
                  </Text>
                </View>
                <View style={stylesDetail.containerBodyCard}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_average_debt_sales')}
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {Number(informationSAP?.TotalDebitAVG || 0).toLocaleString(
                      'en-US',
                    )}
                  </Text>
                </View>

                <Text style={stylesDetail.contentBody}>
                  {languageKey('_sale_for_three_days')}
                </Text>
                <View style={stylesDetail.tableWrapper}>
                  <View style={stylesDetail.row}>
                    <View style={stylesDetail.cell_table}>
                      <Text style={stylesDetail.txtHeaderTable}>
                        {languageKey('_order_date')}
                      </Text>
                    </View>
                    <View style={stylesDetail.cell_table}>
                      <Text style={stylesDetail.txtHeaderTable}>
                        {languageKey('_order_number')}
                      </Text>
                    </View>
                    <View style={stylesDetail.cell_table}>
                      <Text style={stylesDetail.txtHeaderTable}>
                        {languageKey('_total_order')}
                      </Text>
                    </View>
                    <View style={stylesDetail.cell_table}>
                      <Text style={stylesDetail.txtHeaderTable}>
                        {languageKey('_revenue')}
                      </Text>
                    </View>
                  </View>
                  {informationSAP?.Orders?.map((item, index) => (
                    <View
                      style={[
                        stylesDetail.cellResponse,
                        index === itemLinks.length - 1 && stylesDetail.lastCell,
                      ]}
                      key={index}>
                      <View style={stylesDetail.cell_table}>
                        <Text style={stylesDetail.valueRow}>
                          {moment(item?.ODate).format('DD/MM/YYYY')}
                        </Text>
                      </View>
                      <View style={stylesDetail.cell_table}>
                        {item?.OID?.split(',').map((code, i) => (
                          <Text key={i} style={stylesDetail.valueRow}>
                            {code.trim()}
                          </Text>
                        ))}
                      </View>
                      <View style={stylesDetail.cell_table}>
                        <Text style={stylesDetail.valueRow}>
                          {item?.Quantity}
                        </Text>
                      </View>
                      <View style={stylesDetail.cell_table}>
                        <Text style={stylesDetail.valueRow}>
                          {Number(item?.TotalAmount || 0).toLocaleString(
                            'en-US',
                          )}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          {(valueRecommendedType?.EntryID === 'GuaranteeNews' ||
            valueRecommendedType?.EntryID === 'GuaranteeChanges' ||
            valueRecommendedType?.EntryID === 'QuarterlyTransfers') && (
            <View style={stylesDetail.containerHeader}>
              <Text style={stylesDetail.header}>
                {languageKey('customer_guarantee_staff')}
              </Text>
              <Button
                style={stylesDetail.btnShowInfor}
                onPress={() => toggleInformation('GuaranteeNews')}>
                <SvgXml
                  xml={
                    showInformation.GuaranteeNews
                      ? arrow_down_big
                      : arrow_next_gray
                  }
                />
              </Button>
            </View>
          )}
          {showInformation.GuaranteeNews &&
            (valueRecommendedType?.EntryID === 'GuaranteeNews' ||
              valueRecommendedType?.EntryID === 'GuaranteeChanges' ||
              valueRecommendedType?.EntryID === 'QuarterlyTransfers') && (
              <View style={{width: '100%', backgroundColor: '#fff'}}>
                <GuaranteeList
                  data={
                    editCredit
                      ? safeJsonParseArray(
                          item?.Extention2,
                          'Danh sách bảo lãnh',
                        )
                      : listInfoGuarantee
                  }
                  onPressItem={item => {
                    // ví dụ: chuyển màn hình chi tiết
                    console.log('clicked', item);
                  }}
                />
              </View>
            )}
          {(valueRecommendedType?.EntryID === 'QuarterlyTransfers' ||
            valueRecommendedType?.EntryID === 'QuarterlyNews' ||
            valueRecommendedType?.EntryID === 'QuarterlyChanges' ||
            valueRecommendedType?.EntryID === 'GuaranteeTransfers') && (
            <View style={stylesDetail.containerHeader}>
              <Text style={stylesDetail.header}>
                {languageKey('_customer_profile_doc')}
              </Text>
              <Button
                style={stylesDetail.btnShowInfor}
                onPress={() => toggleInformation('gthskh')}>
                <SvgXml
                  xml={
                    showInformation.gthskh ? arrow_down_big : arrow_next_gray
                  }
                />
              </Button>
            </View>
          )}
          {showInformation.gthskh &&
            (valueRecommendedType?.EntryID === 'QuarterlyTransfers' ||
              valueRecommendedType?.EntryID === 'QuarterlyNews' ||
              valueRecommendedType?.EntryID === 'QuarterlyChanges' ||
              valueRecommendedType?.EntryID === 'GuaranteeTransfers') && (
              <View style={stylesDetail.cardFooter1}>
                <ModalProfileCustomerFile
                  setData={setValueListCustomerProfiles}
                  dataEdit={currentDoc || []}
                  parentID={valueRecommendedType?.ID}
                  dataex={listItemTypes}
                  disable={true}
                  fhm={true}
                />
              </View>
            )}
        </ScrollView>

        <View style={stylesFormCredit.containerFooter}>
          <Button
            style={stylesFormCredit.btnSave}
            onPress={handleCreditRequest}>
            <Text style={stylesFormCredit.txtBtnSave}>
              {languageKey('_save')}
            </Text>
          </Button>
          <Button
            style={stylesFormCredit.btnConfirm}
            disabled={detailCreditLimit ? false : true}
            onPress={
              detailCreditLimit?.IsCustomer === 1
                ? handleConfirmCustomer
                : handleConfirm
            }>
            <Text style={stylesFormCredit.txtBtnConfirm}>
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
  );
};

export default FormCreditLimitScreen;
