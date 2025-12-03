/* eslint-disable handle-callback-err */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-catch-shadow */
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useFormik} from 'formik';
import _ from 'lodash';
import Modal from 'react-native-modal';
import {SvgXml} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from 'react-native-geolocation-service';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
  LogBox,
  findNodeHandle,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import routes from '@routes';
import {styleFormCustomer, styles} from './styles';
import {translateLang} from '@store/accLanguages/slide';
import {arrow_down_big, arrow_next_gray} from '@svgImg';
import {
  ApiCustomerEvaluation_Add,
  ApiCustomerEvaluation_Edit,
  ApiCustomerProfiles_Add,
  ApiCustomerProfiles_Edit,
  ApiCustomerProfiles_GetById,
  ApiCustomerProfiles_Submit,
} from '@api';
import {
  Button,
  CardModalSelect,
  HeaderBack,
  InputDefault,
  ModalSelectDate,
  NotifierAlert,
  InputPhoneNumber,
  CardModalProvince,
  CustomerProductInfo,
  ModalContact,
  ModalDelivery,
  ModalBank,
  AttachManyFile,
  LoadingModal,
  ModalProfileCustomerFile,
  InputLocationnew,
} from '@components';
import {
  fetchApiCustomerProfiles_CheckInfoTaxCode,
  fetchApiCustomerProfiles_GetCategoryCustomer,
  fetchDetailUserID,
  fetchListItemType,
  fetchListNation,
  fetchListProvinceCity,
  fetchListSalesSubTeam,
  fetchListSalesTeam,
  fetchListSalesVBH,
  fetchListWardCommune,
} from '@store/accCustomer_Profile/thunk';
import {clearDetailUserID} from '@store/accCustomer_Profile/slide';
import {scale} from '@utils/resolutions';;
import {colors} from '@themes';
import ToggleCheckBox from '../../../components/ToggleCheckBox';
import * as Yup from 'yup';
const FormCustomerProfileScreen = ({route}) => {
  const item = route?.params?.item;
  const dataDetail = route?.params?.dataDetail;
  const editForm = route?.params?.editForm;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const languageKey = useSelector(translateLang);
  const {detailMenu} = useSelector(state => state.Home);
  const {
    listCustomerType,
    listHonorifics,
    listNation,
    listCustomerGroup,
    listProvinceCity,
    listWardCommune,
    listRecordingChannel,
    listBusinessDomain,
    listSalesTeam,
    listSalesSubTeam,
    listBusinessType,
    listSalesChannel,
    listPartnerType,
    listPartnerGroup,
    detailUserID,
    listItemTypes,
    listVBH,
    listVungSAP,
    listTermsOfPayment,
    listfactory,
    listPositions,
  } = useSelector(state => state.CustomerProfile);
  const {userInfo, listUserByUserID, listCustomerByUserID} = useSelector(
    state => state.Login,
  );
  const scrollViewRef = useRef(null);
  const fieldRefs = useRef({});
  const {listCustomers, listUser} = useSelector(state => state.ApprovalProcess);

  const memoizedListUser = useMemo(() => listUser, [listUser]);
  const [dateStates, setDateStates] = useState({
    foundingDate: {
      selected: editForm ? dataDetail?.FoundingDate : '',
      submit: editForm ? dataDetail?.FoundingDate : '',
      visible: false,
    },
    taxIssuedDate: {
      selected: editForm ? dataDetail?.TaxIssuedDate : '',
      submit: editForm ? dataDetail?.TaxIssuedDate : '',
      visible: false,
    },
  });
  const [valueSalesChannel, setValueSalesChannel] = useState(() => {
    const selectedIDs = dataDetail?.SalesChannelID;
    return (
      listSalesChannel?.filter(
        item => selectedIDs?.toString() === item?.ID?.toString(),
      ) || []
    );
  });
  const [valueCustomerType, setValueCustomerType] = useState(
    editForm
      ? listCustomerType?.find(item => item?.ID === dataDetail?.CustomerTypeID)
      : listCustomerType?.find(item => item?.Code === 'CT'),
  );
  const [valueHonorifics, setValueHonorifics] = useState(
    editForm
      ? listHonorifics?.find(item => item?.ID === dataDetail?.HonorificsID)
      : listHonorifics?.find(item => item?.Code === '0003'),
  );
  const [valueCustomerInherit, setValueCustomerInherit] = useState(
    editForm
      ? listCustomerByUserID?.find(
          cus => cus?.ID === Number(dataDetail?.ReferenceID),
        )
      : null,
  );
  const [valueListPhoneNumber, setValueListPhoneNumber] = useState([]);
  const [valueNation, setValueNation] = useState(null);
  const [valueProvinceCity, setValueProvinceCity] = useState(null);
  const [valueSAPzone, setValueSAPzone] = useState(
    editForm
      ? listVungSAP?.find(
          item => item?.ID?.toString() === dataDetail?.Extention48?.toString(),
        )
      : null,
  );
  const [valueWardCommune, setValueWardCommune] = useState(null);
  const [valueLocation, setValueLocation] = useState(
    editForm ? `${dataDetail?.Lat}, ${dataDetail?.Long}` : '0,0',
  );
  const [valueCustomerGroup, setValueCustomerGroup] = useState(
    editForm
      ? listCustomerGroup?.find(
          item => item?.ID === dataDetail?.CustomerGroupID,
        )
      : listCustomerGroup?.find(item => item?.Code?.toString() === '19'),
  );
  const [valueBusinessType, setValueBusinessType] = useState(
    listBusinessType?.find(item => item?.ID === dataDetail?.BusinessType),
  );
  const [valueBusinessDomain, setValueBusinessDomain] = useState(
    listBusinessDomain?.find(item => item?.ID === dataDetail?.BusinessDomainID),
  );
  const [valueSalesTeam, setValueSalesTeam] = useState(
    listSalesTeam?.find(item => item?.ID === dataDetail?.SalesTeamID),
  );
  const [valueSubTeam, setValueSubTeam] = useState(
    listSalesSubTeam?.find(
      item => item?.ID === Number(dataDetail?.SalesSubTeamID),
    ),
  );
  const [valuePartnerType, setValuePartnerType] = useState(
    editForm
      ? listPartnerType?.find(item => item?.ID === dataDetail?.PartnerTypeID)
      : listPartnerType?.find(item => item?.Code?.toString() === '2'),
  );
  const [valuePartnerGroup, setValuePartnerGroup] = useState(
    editForm
      ? listPartnerGroup?.find(item => item?.ID === dataDetail?.PartnerGroupID)
      : listPartnerGroup?.find(item => item?.Code === 'Z01'),
  );
  const [valueRecordingChannel, setValueRecordingChannel] = useState(
    listRecordingChannel?.find(
      item => item?.ID === dataDetail?.ReceivingChannelID,
    ),
  );
  const [valueCustomerProductInfor, setValueCustomerProductInfor] = useState(
    [],
  );
  const [valueListContact, setValueListContact] = useState(
    editForm ? dataDetail?.CusContact : [],
  );
  const [valueListShipping, setValueListShipping] = useState(
    editForm ? dataDetail?.CusShipping : [],
  );
  const [valueListBank, setValueListBank] = useState(
    editForm ? dataDetail?.CusBank : [],
  );
  const [valueListCustomerProfiles, setValueListCustomerProfiles] = useState(
    editForm ? dataDetail?.CusDocument : [],
  );
  const listCustomerOfficalSupport = listCustomers?.filter(
    // item => item.ApprovalStatusCode === '_0',
    item =>
      (item?.CustomerTypeID === 9704 ||
        item?.CustomerTypeID === '9704' ||
        item?.CustomerTypeCode === 'CT') &&
      item?.IsLock === 1 &&
      item?.IsCompleted === 1 &&
      item?.IsActive === 1,
  );
  // console.log(
  //   'listCustomerOfficalSupportaaaaaaaaaaaaaaaaa',
  //   listCustomerOfficalSupport,
  // );
  const [valueListCustomerOfficalSupport, setValueListCustomerOfficalSupport] =
    useState(
      listCustomerOfficalSupport?.find(
        cus => cus.ID === dataDetail?.CustomerSupportID,
      ),
    );
  const [address, setAddress] = useState('');
  const [addressQuery, setAddressQuery] = useState('');
  const handleLocationChange = gps => {
    setValueLocation(gps);
  };
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
  const [pendingCountryToken, setPendingCountryToken] = useState(null);
  const [pendingProvinceKey, setPendingProvinceKey] = useState(null);
  const [pendingWardKey, setPendingWardKey] = useState(null);

  const unsign = (s = '') =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim();
  const stripMulti = (s = '', patterns = []) => {
    let t = ` ${unsign(s)} `;
    patterns.forEach(rx => (t = t.replace(rx, ' ')));
    return t.replace(/\s+/g, ' ').trim();
  };

  const normalizeCountryToken = (s = '') => {
    const u = unsign(s);
    if (u === 'vietnam' || u === 'viet nam') return 'viet nam';
    return u;
  };
  const normalizeProvinceName = (name = '') => {
    let t = stripMulti(name, [
      /\b(thanh pho|tp\.?)\b/g,
      /\b(city)\b/g,
      /\b(tinh)\b/g,
      /\b(province)\b/g,
    ]);
    t = t
      .replace(/\b(ho chi minh city|hcmc|tp hcm|tp\. hcm)\b/g, 'ho chi minh')
      .trim();
    return t;
  };
  const normalizeWardName = (name = '') =>
    stripMulti(name, [
      /\b(phuong)\b/g,
      /\b(xa)\b/g,
      /\b(thi tran)\b/g,
      /\b(ward)\b/g,
    ]);
  const isWardToken = (token = '') => {
    const u = unsign(token);
    return /\b(phuong|xa|thi tran|ward)\b/.test(u);
  };
  const isProvinceToken = (token = '') => {
    const u = unsign(token);
    return /\b(thanh pho|tp\.?|tinh|city|province)\b/.test(u);
  };
  const isZip = (s = '') => /^\d{4,6}$/.test((s || '').trim());
  const equalsLoose = (a = '', b = '') => {
    const ua = unsign(a);
    const ub = unsign(b);
    return ua === ub || ua.includes(ub) || ub.includes(ua);
  };

  const [valueRegion, setValueRegion] = useState([]);
  const [valueLineStructure, setValueStructure] = useState([]);
  const [valueRouteSaleNameRegion, setValueRouteSaleNameRegion] = useState([]);
  const [valueRouteSalesStaff, setValueRouteSalesStaff] = useState([]);
  const [valueDetailRegionRoute, setValueDetailRegionRoute] = useState([]);
  const [dataValuesSaleStaff, setDataValuesSaleStaff] = useState(null);
  const [detailCustomerInherit, setDetailCustomerInherit] = useState(null);
  const [dataProductCustomer, setDataProductCustomer] = useState([]);
  const [dataModalEdit, setDataModalEdit] = useState({
    profiles: [],
    shipping: [],
    contact: [],
    bank: [],
  });

  const sourceData = useMemo(
    () => detailCustomerInherit || dataDetail || {},
    [detailCustomerInherit, dataDetail],
  );
  const isEditForm = detailMenu?.accessEdit === 0 && sourceData?.IsLock === 1;

  const [valueStaffSales, setValueStaffSales] = useState(
    listUserByUserID?.find(
      item => item?.UserID === sourceData?.CustomerRepresentativeID,
    ),
  );
  const [valueSAPPaymentTermsID, setValueStaffSalvalueSAPPaymentTermsID] =
    useState(
      editForm
        ? listTermsOfPayment?.find(
            item => item?.ID === sourceData?.SAPPaymentTermsID,
          )
        : listTermsOfPayment?.find(item => item?.SAPID === 'RA00'),
    );
  const listUsersSupport = useMemo(() => {
    if (!valueStaffSales) return [];

    const isSameUser = user => {
      if (valueStaffSales?.UserID != null && user?.UserID != null) {
        return Number(user.UserID) === Number(valueStaffSales.UserID);
      }
      if (valueStaffSales?.UserName && user?.UserName) {
        return String(user.UserName) === String(valueStaffSales.UserName);
      }
      return false;
    };
    return (listUser || []).filter(
      user =>
        Number(user.DepartmentID) === Number(valueStaffSales?.DepartmentID) &&
        !isSameUser(user),
    );
  }, [listUser, valueStaffSales]);
  const [valueStaffSupport, setValueStaffSupport] = useState(null);
  const [linkImage, setLinkImage] = useState(
    dataDetail &&
      dataDetail?.LinkEvaluation &&
      dataDetail?.LinkEvaluation.trim() !== ''
      ? dataDetail?.LinkEvaluation
      : '',
  );
  const [images, setDataImages] = useState([]);
  const [selectedCustomerClass, setSelectedCustomerClass] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enoughfiles, setEnoughfiles] = useState(false);
  const [checkedSupport, setCheckedSupport] = useState(
    editForm ? (dataDetail?.Extention31 === '1' ? true : false) : false,
  );
  const [checkednation, setCheckedNation] = useState(
    editForm ? (dataDetail?.IsCheckNation === 0 ? false : true) : true,
  );
  const [showInformation, setShowInformation] = useState({
    general: true,
    management: true,
    contact: false,
    delivery: false,
    customer: false,
    bank: false,
  });

  const toggleInformation = key => {
    setShowInformation(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const dataCheckboxCustomer = [
    {ID: 1, Name: languageKey('_customer'), IsCustomer: 1},
    {ID: 2, Name: languageKey('_supplier'), IsSupplier: 1},
    {ID: 3, Name: languageKey('_full_profile'), IsCompleteDocuments: 1},
    {ID: 4, Name: languageKey('_customer_vip'), IsCustomerVIP: 1},
  ];

  // const toggleCategorySelection = id => {
  //   setSelectedCustomerClass(prevSelected => {
  //     const isSelected = prevSelected.some(item => item.ID === id);

  //     if (isSelected) {
  //       return prevSelected.filter(item => item.ID !== id);
  //     } else {
  //       const selectedItem = dataCheckboxCustomer.find(item => item.ID === id);
  //       return [...prevSelected, selectedItem];
  //     }
  //   });
  // };
  useEffect(() => {
    if (dataDetail) {
      const selected = dataCheckboxCustomer.filter(item => {
        return (
          dataDetail[
            item?.IsCustomer
              ? 'IsCustomer'
              : item?.IsSupplier
              ? 'IsSupplier'
              : item?.IsCompleteDocuments
              ? 'IsCompleteDocuments'
              : item?.IsCustomerVIP
              ? 'IsCustomerVIP'
              : ''
          ] === 1
        );
      });
      setSelectedCustomerClass(selected);
    }
  }, [dataDetail]);
  useEffect(() => {
    if (valueCustomerType?.Code) {
      setValuePartnerGroup(null);
    }
  }, [valueCustomerType?.Code]);
  const updateDateState = (key, newValues) => {
    setDateStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...newValues,
      },
    }));
  };

  const initialValues = {
    //Thông tin chung ----------------------------------------
    CustomerTypeID: editForm ? valueCustomerType : 0,
    PartnerTypeID: editForm ? valuePartnerType : 0,
    PartnerGroupID: editForm ? valuePartnerGroup : 0,
    Name: editForm ? dataDetail?.Name : '',
    ShortName: editForm ? dataDetail?.ShortName : '',
    CustomerClassificationID: 0,
    CustomerSupportID: editForm ? valueListCustomerOfficalSupport : 0,
    HonorificsID: editForm ? valueHonorifics : 0,
    TaxCode: editForm ? dataDetail?.TaxCode : '',
    TaxIssuedDate: '',
    FoundingDate: '',
    Email: editForm ? dataDetail?.Email : '',
    EmailHD: editForm ? dataDetail?.InvoiceEmail : '',
    Fax: editForm ? dataDetail?.Fax : '',
    WebSite: editForm ? dataDetail?.WebSite : '',
    Phone: editForm ? dataDetail?.Phone : '',
    NationID: editForm ? valueNation : 0,
    ProvinceID: editForm ? valueProvinceCity : 0,
    DistrictID: editForm ? valueWardCommune || 0 : 0,
    Ward: editForm ? valueWardCommune || 0 : 0,
    Address: editForm ? dataDetail?.Address : '',
    Lat: '0',
    Long: '0',
    Extention48: editForm ? dataDetail?.Extention48 : 0,
    PostalCode: editForm ? dataDetail?.PostalCode : '',
    ReceivingChannelID: editForm ? valueRecordingChannel : 0,
    CustomerGroupID: editForm ? valueCustomerGroup : 0,
    IsCustomer: editForm ? valueCustomerType : '',
    IsCustomerVIP: editForm ? valueCustomerType : '',
    IsSupplier: editForm ? valueCustomerType : '',
    IsCompleteDocuments: editForm ? valueCustomerType : '',
    BusinessType: editForm ? dataDetail?.BusinessType : '',
    BusinessDomainID: editForm ? valueBusinessDomain : 0,
    BusinessScale: editForm ? dataDetail?.BusinessScale : '',
    RegisteredCapital: editForm ? dataDetail?.RegisteredCapital : 0,
    LegalRepresentative: editForm ? dataDetail?.LegalRepresentative : '',
    IDCardNumber: editForm ? dataDetail?.IDCardNumber : '',
    // BusinessRegistrationTypeID: editForm ? valueBusinessRegistrationType : '',
    Note: editForm ? dataDetail?.Note : '',
    SalesChannelID: editForm ? valueSalesChannel : '',
    LinkEvaluation: editForm ? linkImage : '',
    //Thông tin quản lý ----------------------------------------
    CustomerRepresentativeID: editForm ? valueStaffSales : 0,
    SupportAgentID: editForm ? valueStaffSupport : 0,
    SalesTeamID: editForm ? valueSalesTeam : 0,
    SalesSubTeamID: editForm ? valueSubTeam : '',
    SalesOrganizationID: 0,
    DistributionChannelID: 0,
    RegionID: editForm ? valueRegion : 0,
    HotlineNumber: editForm
      ? dataDetail?.HotlineNumber
      : valueStaffSales?.DepartmentPhone,
    SalesManagerID: editForm ? valueStaffSales?.DepartmentManagerID : '',
    AreaSupervisorID: editForm ? valueRouteSaleNameRegion : '',
    SalesStaffID: editForm ? valueRouteSalesStaff : '',
    AreaRouteDetailsID: editForm ? valueDetailRegionRoute : '',
    BusinessSector: [],
    StaffAndInfrastructure: editForm
      ? dataDetail?.CusEvaluation_Cus?.[0]?.StaffAndInfrastructure
      : '',
    MainBusinessSector: editForm
      ? dataDetail?.CusEvaluation_Cus?.[0]?.MainBusinessSector
      : '',
    OverallCustomerEvaluation: editForm
      ? dataDetail?.CusEvaluation_Cus?.[0]?.OverallCustomerEvaluation
      : '',
    //bs
    NameExtention1: editForm ? dataDetail?.NameExtention1 : '',
    TypeShareholderID: editForm
      ? dataDetail?.TypeShareholderID?.toString()
      : '',
    AccountingInvoiceEmail: editForm ? dataDetail?.AccountingInvoiceEmail : '',
    AppliedToID: editForm ? dataDetail?.AppliedToID : '',
    CurrencyTypeID: editForm ? dataDetail?.BusinessType : '',
    CustomerCode: editForm ? dataDetail?.CustomerCode : '',
    FullAddress: editForm ? dataDetail?.DistrictID : '',
    BusinessRegistrationTypeID: editForm
      ? dataDetail?.BusinessRegistrationTypeID?.toString()
      : '',
    SAPCustomerArAccount: editForm
      ? dataDetail?.SAPCustomerArAccount
      : '1311000001',
    SAPCustomerCashflowGroup: editForm
      ? dataDetail?.SAPCustomerCashflowGroup
      : '',
    SalesInvoiceEmail: editForm ? dataDetail?.SalesInvoiceEmail : '',

    //Thông tin giao hàng ------------
    Shipping: [],
    //Thông tin giấy tờ hồ sơ khách hàng --------------
    Documents: [],
    //Thông tin liên hệ ------------
    Contacts: [],
    //Thông tin ngân hàng ------------
    Banks: [],
    // ho so hien tai
    CurrentDocs: [],
    SAPPaymentTermsID: editForm ? dataDetail?.SAPPaymentTermsID : 0,
    PartnerStartDate: editForm ? dataDetail?.PartnerStartDate : '',
  };
  const handleAddressChange = addr => {
    // 1) tách, lọc cơ bản
    const partsRaw = (addr || '')
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    // bỏ zip đứng riêng
    const parts = partsRaw.filter(t => !isZip(t));
    const countryToken = parts[parts.length - 1] || '';
    setPendingCountryToken(countryToken || null);
    const wantedCountry = normalizeCountryToken(countryToken);
    let wardIdx = -1;
    let provinceIdx = -1;
    parts.forEach((t, idx) => {
      if (wardIdx === -1 && isWardToken(t)) wardIdx = idx;
      if (isProvinceToken(t)) provinceIdx = idx;
    });
    const wardToken = wardIdx >= 0 ? parts[wardIdx] : '';
    const provinceToken =
      provinceIdx >= 0
        ? parts[provinceIdx]
        : parts.length >= 2
        ? parts[parts.length - 2]
        : '';

    const wardKey = normalizeWardName(wardToken);
    let provinceKey = normalizeProvinceName(provinceToken);
    if (/^ho chi minh( city)?$/.test(provinceKey)) provinceKey = 'ho chi minh';

    setPendingWardKey(wardKey || null);
    setPendingProvinceKey(provinceKey || null);
    let shortAddress = '';
    const wardIndex = parts.findIndex(p => /(phường|xã|thị trấn)/i.test(p));
    if (wardIndex > 0) {
      shortAddress = parts.slice(0, wardIndex).join(', ');
    } else {
      shortAddress = parts.slice(0, 3).join(', ');
    }
    setAddress(shortAddress);
    setFieldValue('Address', shortAddress || '');
    if (Array.isArray(listNation) && listNation.length) {
      let foundNation = null;
      if (wantedCountry === 'viet nam') {
        foundNation =
          listNation.find(n => Number(n.ID) === 1) ||
          listNation.find(n => equalsLoose(n.RegionsName, 'viet nam'));
      } else {
        foundNation =
          listNation.find(n => equalsLoose(n.RegionsName, wantedCountry)) ||
          listNation.find(n =>
            unsign(n.RegionsName).includes(wantedCountry || ''),
          );
      }

      if (foundNation && valueLocation !== '0,0') {
        setValueNation(foundNation);
      }
    }
  };
  const [taxInfoModalVisible, setTaxInfoModalVisible] = React.useState(false);
  const [taxInfo, setTaxInfo] = React.useState(null);
  const [checktaxInfo, setChecktaxInfo] = React.useState(false);
  const debouncedCheckTaxRef = React.useRef(
    _.debounce(
      async (
        taxCode,
        dispatch,
        setTaxInfo,
        setTaxInfoModalVisible,
        setChecktaxInfo,
      ) => {
        if (!taxCode) return;

        const res = await dispatch(
          fetchApiCustomerProfiles_CheckInfoTaxCode({TaxCode: taxCode}),
        );

        if (res && res !== false) {
          setTaxInfo(res?.[0]);
          setTaxInfoModalVisible(true);
          setChecktaxInfo(false);
        } else {
          setChecktaxInfo(true);
          console.log('Không có dữ liệu trong hệ thống');
        }
      },
      3000,
      {leading: false, trailing: true},
    ),
  );
  const taxCodeSchema = Yup.object().shape({
    TaxCode: Yup.string()
      .required('Mã số thuế là bắt buộc')
      .test(
        'taxcode-format',
        'Mã số thuế không hợp lệ. Phải là 10 hoặc 12 chữ số, hoặc 14 ký tự',
        value => {
          if (!value) return false;
          const v = value.trim();
          if (/^\d{10}$/.test(v)) return true;
          if (/^\d{12}$/.test(v)) return true;
          if (/^[0-9-]{14}$/.test(v)) return true;

          return false;
        },
      ),
  });
  const {values, errors, touched, handleChange, handleBlur, setFieldValue} =
    useFormik({
      initialValues,
      enableReinitialize: true,
      validationSchema: taxCodeSchema,
    });
  const getDetailCustomerInherit = _.debounce(
    async () => {
      setLoading(true);
      const body = {
        ID: valueCustomerInherit?.CustomerID_,
      };
      try {
        const result = await ApiCustomerProfiles_GetById(body);
        const responeData = result.data;
        if (responeData?.StatusCode === 200 && responeData?.ErrorCode === '0') {
          setDetailCustomerInherit(responeData?.Result);
          setLoading(false);
        } else {
          console.log('Get detail error');
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.log('handleConfirm', error);
      }
    },
    2000,
    {leading: true, trailing: false},
  );

  useEffect(() => {
    if (editForm === true || !valueCustomerInherit) return;

    getDetailCustomerInherit();
  }, [valueCustomerInherit, editForm === true]);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    // dispatch(fetchListNation());
    if (!listNation || listNation.length === 0) {
      dispatch(fetchListNation());
    }
    dispatch(fetchListSalesTeam());
    dispatch(fetchListItemType());
  }, [dispatch]);
  useEffect(() => {
    if (!sourceData) return;

    editForm &&
      setValueCustomerType(
        listCustomerType?.find(item => item?.ID === sourceData?.CustomerTypeID),
      );
    editForm &&
      setValuePartnerType(
        listPartnerType?.find(item => item?.ID === sourceData?.PartnerTypeID),
      );
    editForm &&
      setValuePartnerGroup(
        listPartnerGroup?.find(item => item?.ID === sourceData?.PartnerGroupID),
      );
    editForm &&
      setValueHonorifics(
        listHonorifics?.find(item => item?.ID === sourceData?.HonorificsID),
      );
    setValueCustomerGroup(
      listCustomerGroup?.find(item => item?.ID === sourceData?.CustomerGroupID),
    );
    setValueRecordingChannel(
      listRecordingChannel?.find(
        item => item?.ID === sourceData?.ReceivingChannelID,
      ),
    );
    setValueBusinessType(
      listBusinessType?.find(item => item?.ID === sourceData?.BusinessType),
    );
    setValueBusinessDomain(
      listBusinessDomain?.find(
        item => item?.ID === sourceData?.BusinessDomainID,
      ),
    );
    setValueStaffSales(
      listUserByUserID?.find(
        item => item?.UserID === sourceData?.CustomerRepresentativeID,
      ),
    );
    setValueSalesTeam(
      listSalesTeam?.find(item => item?.ID === sourceData?.SalesTeamID),
    );
    setValueSubTeam(
      listSalesSubTeam?.find(
        item => item?.ID === Number(sourceData?.SalesSubTeamID),
      ),
    );
    editForm && setFieldValue('Name', sourceData?.Name || values?.Name || '');
    setFieldValue(
      'ShortName',
      sourceData?.ShortName || values?.ShortName || '',
    );
    editForm &&
      setFieldValue('TaxCode', sourceData?.TaxCode || values?.TaxCode || '');
    editForm && setFieldValue('Email', sourceData?.Email || '');
    editForm && setFieldValue('Fax', sourceData?.Fax || '');
    editForm && setFieldValue('WebSite', sourceData?.WebSite || '');
    editForm &&
      setFieldValue('Address', sourceData?.Address || values?.Address || '');
    editForm && setFieldValue('PostalCode', sourceData?.PostalCode || '');
    editForm &&
      setFieldValue(
        'LegalRepresentative',
        sourceData?.LegalRepresentative || '',
      );
    editForm && setFieldValue('IDCardNumber', sourceData?.IDCardNumber || '');
    editForm && setFieldValue('Note', sourceData?.Note || values?.Note || '');
    editForm && setFieldValue('BusinessScale', sourceData?.BusinessScale || '');
    editForm &&
      setFieldValue('RegisteredCapital', sourceData?.RegisteredCapital || '');
    editForm &&
      setFieldValue('NameExtention1', sourceData?.NameExtention1 || '');
    const lat = sourceData?.Lat || '0';
    const long = sourceData?.Long || '0';
    setValueLocation(`${lat}, ${long}`);

    const selectedItems = listSalesChannel?.find(
      item => item?.ID === Number(sourceData?.SalesChannelID),
    );
    setValueSalesChannel(selectedItems || []);

    try {
      const phones = sourceData?.Phone?.split(',').map(num => num.trim()) || [];
      setValueListPhoneNumber(phones);
    } catch (e) {
      console.error('Split Phone Error', e);
    }

    setDateStates(prev => ({
      ...prev,
      foundingDate: {
        ...prev.foundingDate,
        selected: sourceData?.FoundingDate,
        submit: sourceData?.FoundingDate,
      },
      taxIssuedDate: {
        ...prev.taxIssuedDate,
        selected: sourceData?.TaxIssuedDate,
        submit: sourceData?.TaxIssuedDate,
      },
    }));

    const selected = dataCheckboxCustomer.filter(item => {
      return (
        sourceData[
          item?.IsCustomer
            ? 'IsCustomer'
            : item?.IsSupplier
            ? 'IsSupplier'
            : item?.IsCompleteDocuments
            ? 'IsCompleteDocuments'
            : item?.IsCustomerVIP
            ? 'IsCustomerVIP'
            : ''
        ] === 1
      );
    });
    setSelectedCustomerClass(selected);

    if (sourceData?.LinkEvaluation) {
      const imgList = sourceData.LinkEvaluation?.split(';').filter(Boolean);
      setDataImages(imgList);
    }

    const processedData = {
      profiles: sourceData?.CusDocument || [],
      shipping: sourceData?.CusShipping || [],
      contact: sourceData?.CusContact || [],
      bank: sourceData?.CusBank || [],
    };
    setDataModalEdit(processedData);

    if (sourceData?.Datas) {
      try {
        const parsed = JSON.parse(sourceData.Datas);
        setValueCustomerProductInfor(parsed);
        setDataProductCustomer(parsed);
      } catch (e) {
        console.error('Lỗi parse JSON', e);
      }
    }
  }, [sourceData]);
  useEffect(() => {
    const fillLocationAsync = async () => {
      if (!sourceData?.NationID) return;

      const selectedNation = listNation.find(
        item => item.ID === sourceData.NationID,
      );
      if (!selectedNation) {
        return;
      } else {
        setValueNation(selectedNation);
      }
      const provinces = await dispatch(
        fetchListProvinceCity({ParentId: selectedNation.ID}),
      );
      const selectedProvince = provinces?.find(
        p => p.ID === sourceData.ProvinceID,
      );
      if (!selectedProvince) return;
      setValueProvinceCity(selectedProvince);

      const wards = await dispatch(
        fetchListWardCommune({ParentId: selectedProvince.ID}),
      );
      const selectedWard = wards?.find(w => w.ID === sourceData?.DistrictID);
      if (selectedWard) {
        setValueWardCommune(selectedWard);
      }
    };

    fillLocationAsync();
  }, [sourceData, listNation]);
  useEffect(() => {
    if (valueNation) {
      dispatch(fetchListProvinceCity({ParentId: valueNation.ID}));
      setValueProvinceCity(null);
      setValueWardCommune(null);
    }
  }, [valueNation]);
  useEffect(() => {
    if (!Array.isArray(listProvinceCity) || !listProvinceCity.length) return;
    if (!pendingProvinceKey) return;

    const found =
      listProvinceCity.find(p =>
        equalsLoose(normalizeProvinceName(p.RegionsName), pendingProvinceKey),
      ) ||
      listProvinceCity.find(p =>
        normalizeProvinceName(p.RegionsName).includes(pendingProvinceKey),
      );

    if (found) {
      setValueProvinceCity(found);
    }
  }, [listProvinceCity, pendingProvinceKey]);

  useEffect(() => {
    if (valueProvinceCity) {
      dispatch(fetchListWardCommune({ParentId: valueProvinceCity.ID}));
      setValueWardCommune(null);
      setFieldValue('PostalCode', valueProvinceCity?.Postalcode || '');
    }
  }, [valueProvinceCity]);
  //ALALA
  useEffect(() => {
    if (valueCustomerType?.Code !== 'TN') {
      setValueStaffSales(
        memoizedListUser?.find(
          item => item?.UserID === Number(userInfo?.UserID),
        ),
      );
    }
  }, [valueCustomerType?.Code, userInfo]);
  useEffect(() => {
    if (!Array.isArray(listWardCommune) || !listWardCommune.length) return;
    if (!pendingWardKey) return;

    const found =
      listWardCommune.find(w =>
        equalsLoose(normalizeWardName(w.RegionsName), pendingWardKey),
      ) ||
      listWardCommune.find(w =>
        normalizeWardName(w.RegionsName).includes(pendingWardKey),
      );

    if (found) {
      setValueWardCommune(found);
    }
  }, [listWardCommune, pendingWardKey]);
  useEffect(() => {
    if (!valueStaffSales || !sourceData?.SupportAgentID || !listUser?.length)
      return;

    const supportList = listUserByUserID?.filter(
      user =>
        Number(user.DepartmentID) === Number(valueStaffSales.DepartmentID),
    );

    const selectedSupport = supportList?.find(
      item => Number(item?.UserID) === Number(sourceData?.SupportAgentID),
    );
    setValueStaffSupport(selectedSupport);
  }, [valueStaffSales?.DepartmentID, sourceData?.SupportAgentID, listUser]);

  const mapToFields = selectedItems => {
    let fields = {
      IsCustomer: 0,
      IsCustomerVIP: 0,
      IsSupplier: 0,
      IsCompleteDocuments: 0,
    };

    selectedItems.forEach(item => {
      if (item.IsCustomer) fields.IsCustomer = 1;
      if (item.IsCustomerVIP) fields.IsCustomerVIP = 1;
      if (item.IsSupplier) fields.IsSupplier = 1;
      if (item.IsCompleteDocuments) fields.IsCompleteDocuments = 1;
    });

    return fields;
  };
  function sanitizeRegisteredCapital(raw) {
    if (raw === null || raw === undefined) return '';
    let s = String(raw).trim();
    if (s === '') return '';
    if (s.includes(',') && !s.includes('.')) {
      s = s.replace(/,/g, '.');
    }
    s = s.replace(/[^\d.]/g, '');

    if (s === '') return '';
    const firstDot = s.indexOf('.');
    if (firstDot !== -1) {
      let intPartRaw = s.slice(0, firstDot);
      let decPartRaw = s.slice(firstDot + 1).replace(/\./g, '');
      const intPart = intPartRaw.slice(0, 12);
      const decPart = decPartRaw.slice(0, 6);
      const intFinal = intPart === '' ? '0' : intPart;

      return decPart.length ? `${intFinal}.${decPart}` : intFinal;
    } else {
      const intOnly = s.slice(0, 12);
      return intOnly === '' ? '' : intOnly;
    }
  }

  const fields = mapToFields(selectedCustomerClass);

  const handleFormCustomer = _.debounce(
    async () => {
      const isValidItem = item => {
        // console.log('values?.RegisteredCapital',sanitizeRegisteredCapital(values?.RegisteredCapital))
        const hasBS =
          item?.BusinessSectorID !== undefined &&
          item?.BusinessSectorID !== null &&
          item?.BusinessSectorID !== '';
        const cg = item?.CustomerGroup;
        const hasCG =
          Array.isArray(cg) &&
          cg.length > 0 &&
          cg.some(
            x =>
              x &&
              x.CustomerGroupID !== undefined &&
              x.CustomerGroupID !== null &&
              x.CustomerGroupID !== '',
          );

        return hasBS && hasCG;
      };
      const filtered = valueCustomerProductInfor.filter(isValidItem);
      const errors = [];
      let firstInvalidField = null;
      const pushError = (msg, fieldKey) => {
        errors.push(msg);
        if (!firstInvalidField && fieldKey) firstInvalidField = fieldKey;
      };
      if (!valueCustomerType?.ID) {
        pushError(languageKey('_please_select_customer_type'), 'CustomerType');
      }

      if (valueCustomerType?.Code === 'TN' && !valueSalesChannel) {
        pushError(languageKey('Please select sales channel'), 'CustomerType');
      }

      if (valueCustomerType?.Code !== 'TN') {
        if (!valuePartnerType?.ID) {
          pushError(languageKey('_please_select_type_partner'), 'CustomerType');
        }

        if (!valuePartnerGroup?.ID) {
          pushError(
            languageKey('_please_select_partner_group'),
            'CustomerType',
          );
        }
      }
      if (!values?.TaxCode) {
        pushError(languageKey('_please_enter_tax_code'), 'TaxCode1');
      }
      if (!values?.Name) {
        pushError(languageKey('_please_enter_customer_name'), 'Name');
      }
      if (!values?.ShortName && valueCustomerType?.Code !== 'TN') {
        pushError(languageKey('_please_enter_customer_initials'), 'ShortName');
      } else if (values.ShortName.length > 25) {
        pushError(languageKey('_25kt'), 'ShortName');
      }
      if (
        valueCustomerType?.Code === 'HT' &&
        !valueListCustomerOfficalSupport?.Name
      ) {
        pushError(
          'Vui lòng chọn KH chính thống được hỗ trợ',
          'valueListCustomerOfficalSupport',
        );
      }

      if (!valueListPhoneNumber?.length) {
        pushError(
          languageKey('_please_enter_phone_number'),
          'valueListPhoneNumber',
        );
      }
      if (!values?.Address) {
        pushError(languageKey('_please_enter_address'), 'Address');
      }

      if (
        !values?.OverallCustomerEvaluation &&
        valueCustomerType?.Code === 'TN'
      ) {
        pushError(
          languageKey('_pls_enter_info_cus'),
          'OverallCustomerEvaluation',
        );
      }
      if (valueCustomerType?.Code !== 'TN' && !valueSAPPaymentTermsID?.Name) {
        pushError(
          'Vui lòng chọn điều khoản thanh toán',
          'valueSAPPaymentTermsID',
        );
      }

      if (!valueNation?.ID) {
        pushError(languageKey('_please_select_country'), 'valueNation');
      }

      if (valueNation?.ID === 1) {
        if (!valueProvinceCity?.ID) {
          pushError(
            languageKey('_please_select_province_city'),
            'valueProvinceCity',
          );
        }
        if (!valueWardCommune?.ID) {
          pushError(
            languageKey('_please_select_ward_commune'),
            'valueWardCommune',
          );
        }
      }
      if (valueCustomerType?.Code !== 'TN' && !valueSAPzone?.Name) {
        pushError(languageKey('_please_select_SAP_region'), 'valueSAPzone');
      }

      if (valueCustomerType?.Code !== 'TN' && !valueBusinessType?.Name) {
        pushError(
          languageKey('_please_select_business_type'),
          'valueBusinessType',
        );
      }
      if (valueCustomerType?.Code !== 'TN' && !valueBusinessDomain?.Name) {
        pushError(languageKey('_please_select_segment'), 'valueBusinessDomain');
      }
      if (
        valueCustomerType?.Code !== 'TN' &&
        !values?.BusinessRegistrationTypeID
      ) {
        pushError(
          languageKey('_please_enterB_Certificate'),
          'BusinessRegistrationTypeID',
        );
      }
      if (valueCustomerType?.Code !== 'TN' && !values?.LegalRepresentative) {
        pushError(
          languageKey('_please_enter_legal_representative'),
          'LegalRepresentative',
        );
      }

      if (valueCustomerType?.Code !== 'TN' && !valueStaffSales?.UserID) {
        pushError(languageKey('_please_select_nvkd'), 'valueStaffSales');
      }

      if (valueCustomerType?.Code !== 'TN' && !valueSalesTeam?.Name) {
        pushError(
          languageKey('_please_select_main_sales_team'),
          'valueSalesTeam',
        );
      }
      if (valueCustomerType?.Code !== 'TN' && !valueSubTeam?.Name) {
        pushError(
          languageKey('_please_select_small_sales_team'),
          'valueSubTeam',
        );
      }
      if (!dateStates?.taxIssuedDate.submit) {
        pushError(
          'Vui lòng chọn/nhập Ngày cấp MST/Giấy phép KD',
          'taxIssuedDate',
        );
      }
      if (!dateStates?.foundingDate.submit) {
        pushError('Vui lòng chọn/nhập Thời gian thành lập', 'foundingDate');
      }
      if (!values?.PartnerStartDate) {
        pushError('Vui lòng nhập năm bắt đầu hđ với KT', 'PartnerStartDate');
      }
      if (values.PartnerStartDate) {
        const year = Number(values.PartnerStartDate);

        if (isNaN(year)) {
          pushError('Năm phải là số');
        } else if (year < 1999) {
          pushError('Năm không hợp lệ.');
        } else if (year > 3000) {
          pushError('Năm vượt quá năm hiện tại');
        }
      }

      if (valueCustomerType?.Code !== 'TN' && !valueRegion?.Name) {
        pushError(languageKey('_please_select_sales_area'), 'valueRegion');
      }
      if (errors.length > 0) {
        if (firstInvalidField) {
          scrollToField(firstInvalidField);
        }
        setTimeout(() => {
          Alert.alert(errors[0]);
        }, 300);
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
        ID: editForm ? dataDetail?.ID : 0,
        FactorID: 'Customers',
        // EntryID: 'CustomerProfiles',
        EntryID: 'CustomerProfile',
        // CmpnID: '0',
        SAPID: '',
        LemonID: '',
        ODate: new Date(),
        //Thông tin chung ----------------------------------------
        CustomerTypeID: valueCustomerType?.ID || 0,
        ReferenceID: String(valueCustomerInherit?.CustomerID_ || ''),
        CustomerSupportID: valueListCustomerOfficalSupport?.ID || 0,
        PartnerTypeID: valuePartnerType?.ID || 0,
        PartnerGroupID: valuePartnerGroup?.ID || 0,
        Name: values?.Name || '',
        ShortName: values?.ShortName || '',
        CustomerClassificationID: 0,
        HonorificsID: valueHonorifics?.ID,
        TaxCode: values?.TaxCode || '',
        TaxIssuedDate: dateStates?.taxIssuedDate.submit,
        FoundingDate: dateStates?.foundingDate.submit,
        Email: values?.Email || '',
        Fax: values?.Fax || '',
        WebSite: values?.WebSite || '',
        Phone: valueListPhoneNumber.join(','),
        NationID: valueNation?.ID || 0,
        ProvinceID: valueProvinceCity?.ID || 0,
        DistrictID: valueWardCommune?.ID || 0,
        Ward: valueWardCommune?.ID || 0,
        Address: values?.Address || '',
        Long: valueLocation?.substring(valueLocation?.indexOf(',') + 1)?.trim(),
        Lat: valueLocation?.substring(0, valueLocation?.indexOf(','))?.trim(),
        PostalCode: values?.PostalCode || '',
        ReceivingChannelID: valueRecordingChannel?.ID || 0,
        CustomerGroupID: valueCustomerGroup?.ID || 11968,
        IsCustomer: 1,
        IsCustomerVIP: fields.IsCustomerVIP || 0,
        IsSupplier: fields.IsSupplier || 0,
        IsCompleteDocuments: fields.IsCompleteDocuments || 0,
        BusinessType: valueBusinessType?.ID || 0,
        BusinessDomainID: valueBusinessDomain?.ID || 0,
        BusinessScale: values?.BusinessScale || '',
        RegisteredCapital:
          sanitizeRegisteredCapital(values?.RegisteredCapital) || 0,
        LegalRepresentative: values?.LegalRepresentative || '',
        IDCardNumber: values?.IDCardNumber || '',
        BusinessRegistrationTypeID:
          values?.BusinessRegistrationTypeID?.toString() || '',
        Note: values?.Note || '',
        SalesChannelID: String(valueSalesChannel?.ID) || '',
        LinkEvaluation: linkString || '',
        //Thông tin quản lý ----------------------------------------
        CustomerRepresentativeID: Number(valueStaffSales?.UserID) || 0,
        SupportAgentID: Number(valueStaffSupport?.UserID) || 0,
        SalesTeamID: Number(valueSalesTeam?.ID) || 0,
        SalesSubTeamID: Number(valueSubTeam?.ID) || 0,
        SalesOrganizationID: valueStaffSales?.DepartmentID || 0,
        DistributionChannelID: 0,
        RegionID: Number(valueRegion?.ID) || 0,
        HotlineNumber: values?.HotlineNumber?.toString() || '',
        SalesManagerID: valueStaffSales?.DepartmentManagerID || 0,
        SalesRouteID: Number(valueLineStructure?.ID) || 0,
        AreaSupervisorID: Number(valueRouteSaleNameRegion?.ID) || 0,
        SalesStaffID: Number(valueRouteSalesStaff?.ID) || 0,
        AreaRouteDetailsID: Number(valueDetailRegionRoute?.ID) || 0,
        BusinessSector: filtered || [],
        StaffAndInfrastructure: values?.StaffAndInfrastructure || '',
        MainBusinessSector: values?.MainBusinessSector || '',
        OverallCustomerEvaluation: values?.OverallCustomerEvaluation || '',
        AccountingInvoiceEmail: values?.AccountingInvoiceEmail || '',
        SalesInvoiceEmail: values?.SalesInvoiceEmail || '',
        //Thông tin giao hàng ------------
        Shipping: valueListShipping || [],
        //Thông tin giấy tờ hồ sơ khách hàng --------------
        Documents: [],
        //Thông tin liên hệ ------------
        Contacts: valueListContact || [],
        //
        CurrentDocs:
          valueCustomerType?.Code !== 'TN'
            ? valueListCustomerProfiles?.CurrentDocs || []
            : [],
        //Thông tin ngân hàng ------------
        Banks: valueListBank || [],
        NameExtention1: values?.NameExtention1 || values?.Name || '',
        NameExtention2: editForm ? dataDetail?.NameExtention2 : '',
        NameExtention3: editForm ? dataDetail?.NameExtention3 : '',
        NameExtention4: editForm ? dataDetail?.NameExtention4 : '',
        NameExtention5: editForm ? dataDetail?.NameExtention5 : '',
        NameExtention6: editForm ? dataDetail?.NameExtention6 : '',
        NameExtention7: editForm ? dataDetail?.NameExtention7 : '',
        NameExtention8: editForm ? dataDetail?.NameExtention8 : '',
        NameExtention9: editForm ? dataDetail?.NameExtention9 : '',
        Extention1: editForm ? dataDetail?.Extention1 : '',
        Extention2: editForm ? dataDetail?.Extention2 : '',
        Extention3: editForm ? dataDetail?.Extention3 : '',
        Extention4: editForm ? dataDetail?.Extention4 : '',
        Extention5: editForm ? dataDetail?.Extention5 : '',
        Extention6: editForm ? dataDetail?.Extention6 : '',
        Extention7: editForm ? dataDetail?.Extention7 : '',
        Extention8: editForm ? dataDetail?.Extention8 : '',
        Extention9: editForm ? dataDetail?.Extention9 : '',
        Extention10: editForm ? dataDetail?.Extention10 : '',
        Extention11: editForm ? dataDetail?.Extention11 : '',
        Extention12: editForm ? dataDetail?.Extention12 : '',
        Extention13: editForm ? dataDetail?.Extention13 : '',
        Extention14: editForm ? dataDetail?.Extention14 : '',
        Extention15: editForm ? dataDetail?.Extention15 : '',
        Extention16: editForm ? dataDetail?.Extention16 : '',
        Extention17: editForm ? dataDetail?.Extention17 : '',
        Extention18: editForm ? dataDetail?.Extention18 : '',
        Extention19: editForm ? dataDetail?.Extention19 : '',
        Extention20: editForm ? dataDetail?.Extention20 : '',
        Extention31: checkedSupport ? '1' : '0',
        // Extention30: editForm
        //   ? dataDetail?.Extention30
        //   : Math.floor(Date.now() / 1000),
        IsCheckNation:
          valueNation?.Code?.toLowerCase() !== 'vn' ? 1 : checkednation ? 1 : 0,
        SearchName: editForm ? dataDetail?.SearchName : '',
        InvoiceEmail: editForm ? dataDetail?.InvoiceEmail : '',
        PartnerStartDate:
          values?.PartnerStartDate ||
          moment(new Date()).format('YYYY') ||
          new Date(),
        // SalesInvoiceEmail: '',
        // AccountingInvoiceEmail: '',
        Quantity: editForm ? dataDetail?.Quantity : '',
        Revenue: editForm ? dataDetail?.Revenue : 0,
        EmployeeCount: editForm ? dataDetail?.EmployeeCount : 0,
        BusinessProductsID: editForm ? dataDetail?.BusinessProductsID : '',
        IndustryMinQuantity: editForm ? dataDetail?.IndustryMinQuantity : '',
        IndustryMaxQuantity: editForm ? dataDetail?.IndustryMaxQuantity : '',
        Brand: editForm ? dataDetail?.Brand : '',
        OfficeArea: editForm ? Number(dataDetail?.OfficeArea) : 0,
        FactoryArea: editForm ? Number(dataDetail?.FactoryArea) : 0,
        SignatureLink: editForm ? dataDetail?.SignatureLink : '',
        CustomerLink: editForm ? dataDetail?.CustomerLink : '',
        SupplierName: editForm ? dataDetail?.SupplierName : '',
        ProductID: editForm ? dataDetail?.ProductID : 0,
        ProductTargetID: editForm ? dataDetail?.ProductTargetID : 0,
        SupplierPurchaseQuantity: editForm
          ? dataDetail?.SupplierPurchaseQuantity
          : '',
        AverageSales: editForm ? dataDetail?.AverageSales : 0,
        SupplierPaymentTermsID: editForm
          ? dataDetail?.SupplierPaymentTermsID
          : 0,
        ShippingMethodID: editForm ? dataDetail?.ShippingMethodID : 0,
        SupplierCreditLimit: editForm ? dataDetail?.SupplierCreditLimit : 0,
        PaymentMethodID: editForm ? dataDetail?.PaymentMethodID : 0,
        YearID: editForm ? dataDetail?.YearID : 0,
        AverageMonthlyQuantity: editForm
          ? dataDetail?.AverageMonthlyQuantity
          : 0,
        AverageMonthlyRevenue: editForm ? dataDetail?.AverageMonthlyRevenue : 0,
        UnitID: editForm ? dataDetail?.UnitID : 0,
        PercentageOfCustomerSales: editForm
          ? dataDetail?.PercentageOfCustomerSales
          : 0,
        FactoryAddress: editForm ? dataDetail?.FactoryAddress : '',
        IsActive: editForm ? dataDetail?.IsActive : 1,
        CurrencyTypeID: editForm ? dataDetail?.CurrencyTypeID : 0,
        WarehouseCriteriaID: editForm ? dataDetail?.WarehouseCriteriaID : 0,
        PricingCriteriaID: editForm ? dataDetail?.PricingCriteriaID : 0,
        ProcessDefinitionID: editForm ? dataDetail?.ProcessDefinitionID : 0,
        CustomerProductInfo: editForm ? dataDetail?.CustomerProductInfo : '',
        IsViewLimit: editForm ? dataDetail?.IsViewLimit : 0,
        IsViewInventory: editForm ? dataDetail?.IsViewInventory : 0,
        LimitPercentage: editForm ? dataDetail?.LimitPercentage : 0,
        InventoryPercentage: editForm ? dataDetail?.InventoryPercentage : 0,
        Extention48: valueSAPzone?.ID?.toString() || '',
        SAPPaymentTermsID: Number(valueSAPPaymentTermsID?.ID) || 0,
        CategoryType: editForm ? dataDetail?.CategoryType : '',
      };
      console.log('bodybodybodybodybodybody', body);
      try {
        const result = editForm
          ? await ApiCustomerProfiles_Edit(body)
          : await ApiCustomerProfiles_Add(body);

        const responeData = result.data;

        if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
          const body2 = {
            BusinessExperience: editForm
              ? Number(
                  dataDetail?.CusEvaluation_Cus?.[0]?.BusinessExperience,
                ) || 0
              : 0,
            BusinessSeniority: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.BusinessSeniority || ''
              : '',
            FactoryArea: editForm
              ? Number(dataDetail?.CusEvaluation_Cus?.[0]?.BusinessSeniority) ||
                0
              : 0,
            MainBusinessSector: values?.MainBusinessSector?.toString() || '',
            OfficeArea: editForm
              ? Number(dataDetail?.CusEvaluation_Cus?.[0]?.BusinessSeniority) ||
                0
              : 0,
            OverallCustomerEvaluation:
              values?.OverallCustomerEvaluation?.toString() || '',
            StaffAndInfrastructure:
              values?.StaffAndInfrastructure?.toString() || '',
            StaffCount: editForm
              ? Number(dataDetail?.CusEvaluation_Cus?.[0]?.BusinessSeniority) ||
                0
              : 0,
            CustomerID: editForm
              ? dataDetail?.ID || 0
              : responeData?.Result?.[0]?.ID || 0,
            CustomerRankID: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.CustomerRankID || 0
              : 0,
            OID: editForm ? dataDetail?.CusEvaluation_Cus?.[0]?.OID || '' : '',
            FactorID: 'Customers',
            EntryID: 'CustomerEvaluations',
            ODate: moment(new Date()).format('YYYY-MM-DD'),
            SAPID: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.SAPID || ''
              : '',
            LemonID: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.LemonID || ''
              : '',
            IsLock: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.IsLock || ''
              : '',
            IsActive: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.IsActive || 1
              : 1,
            IsDeleted: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.IsDeleted || 0
              : 0,
            CreateUser: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.CreateUser || ''
              : '',
            CreateDate: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.CreateDate || ''
              : moment(new Date()).format('YYYY-MM-DD'),
            ChangeUser: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.ChangeUser || ''
              : '',
            ChangeDate: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.ChangeDate || ''
              : moment(new Date()).format('YYYY-MM-DD'),
            CmpnID: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.CmpnID || ''
              : '',
            ApprovalProcessID: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.ApprovalProcessID || ''
              : '',
            ApprovalStep: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.ApprovalStep || 1
              : 1,
            ApprovalStatusID: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.ApprovalStatusID || ''
              : '',
            ApprovalDate: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.ApprovalDate || ''
              : '',
            ApprovalNote: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.ApprovalNote || ''
              : '',
            AppliedToID: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.AppliedToID || ''
              : '',
            ToDate: moment(new Date()).format('YYYY-MM-DD'),
            FromDate: moment(new Date()).format('YYYY-MM-DD'),
            Note: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.Note || ''
              : '',
            BusinessItemEvaluation: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.BusinessItemEvaluation || ''
              : '',
            BusinessScaleEvaluation: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.BusinessScaleEvaluation ||
                ''
              : '',
            Extention1: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.Extention1 || ''
              : '',
            Extention2: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.Extention2 || ''
              : '',
            Extention3: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.Extention3 || ''
              : '',
            Extention4: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.Extention4 || ''
              : '',
            Extention5: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.Extention5 || ''
              : '',
            Extention6: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.Extention6 || ''
              : '',
            Extention7: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.Extention7 || ''
              : '',
            Extention8: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.Extention8 || ''
              : '',
            Extention9: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.Extention9 || ''
              : '',
            Step: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.Step || ''
              : '',
            IsCompleted: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.IsCompleted || ''
              : '',
            ErrDescription: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.ErrDescription || ''
              : '',
            Valuerr: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.Valuerr || ''
              : '',
            SalesPolicy: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.SalesPolicy || []
              : [],
            CustomerGoals: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.CustomerGoals || []
              : [],
            BusinessItem: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.BusinessItem || []
              : [],
            PurchaseOrder: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.PurchaseOrder || []
              : [],
            IsAddFromEval: editForm
              ? dataDetail?.CusEvaluation_Cus?.[0]?.IsAddFromEval || 0
              : 0,
            FactoryID: editForm
              ? Number(dataDetail?.FactoryID || 0)
              : listfactory?.[0]?.ID || 0,
          };
          const result2 = editForm
            ? await ApiCustomerEvaluation_Edit(body2)
            : await ApiCustomerEvaluation_Add(body2);
          const responeData2 = result2.data;
          console.log('responeData', responeData);
          if (
            responeData2.StatusCode === 200 &&
            responeData2.ErrorCode === '0'
          ) {
            console.log(responeData2);
            NotifierAlert(
              3000,
              `${languageKey('_notification')}`,
              `${responeData.Message}`,
              'success',
            );
          } else {
            console.log('responeData2', responeData2);
          }
          navigation.navigate(routes.CustomerProfileScreen);
        } else {
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData.Message}`,
            'error',
          );
        }
      } catch (errors) {
        NotifierAlert(
          3000,
          `${languageKey('_notification')}`,
          `${errors}`,
          'error',
        );
      }
    },
    2000,
    {leading: true, trailing: false},
  );
  const handleConfirm = _.debounce(
    async () => {
      const body = {
        ID: dataDetail?.ID,
        IsLock: dataDetail?.IsLock === 0 ? 1 : 0,
        Note: '',
      };
      try {
        const result = await ApiCustomerProfiles_Submit(body);
        const responeData = result.data;
        if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData.Message}`,
            'success',
          );
          navigation.navigate(routes.CustomerProfileScreen);
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

  useEffect(() => {
    if (valueSalesTeam) {
      const body = {
        CategoryType: 'Area',
        ParentID: valueSalesTeam?.ID,
      };
      editForm ? null : setValueSubTeam(null);
      editForm ? null : setValueRegion(null);
      dispatch(fetchListSalesSubTeam(body));
    }
  }, [valueSalesTeam, dispatch]);

  useEffect(() => {
    if (listNation?.length > 0 && valueNation === null) {
      setValueNation(
        listNation.find(item => item?.Code?.toLowerCase() === 'vn'),
      );
    }
  }, [listNation?.lenth > 0, dispatch]);
  useEffect(() => {
    if (valueSubTeam) {
      const body = {
        // CategoryType: 'SalesTeam',
        CategoryType: 'Area',
        ParentID: valueSubTeam?.ID,
      };
      dispatch(fetchListSalesVBH(body));
      editForm ? null : setValueRegion(null);
    }
  }, [valueSubTeam, dispatch]);
  useEffect(() => {
    if (valueListCustomerProfiles) {
      const isValid =
        valueListCustomerProfiles?.length >= listItemTypes?.length &&
        valueListCustomerProfiles.every(
          item => item.Link && item.Link.trim() !== '',
        );
      isValid === true
        ? setSelectedCustomerClass(prev => [
            ...prev,
            {ID: 3, Name: languageKey('_full_profile'), IsCompleteDocuments: 1},
          ])
        : setSelectedCustomerClass(prev => prev.filter(item => item.ID !== 3));
    }
  }, [dispatch, valueListCustomerProfiles]);
  const showAlertPermission = () => {
    Alert.alert(
      `${languageKey('_notification')}`,
      `${languageKey('_permission')}`,
      [
        {
          text: `${languageKey('_cancel')}`,
          style: 'cancel',
        },
        {text: languageKey('_go_to_setting'), onPress: () => openSettings()},
      ],
    );
  };

  const handleGetLong = () => {
    setTimeout(() => {
      checkPermissionFineLocation();
    }, 500);
  };

  const requestPermissionFineLocation = () => {
    request(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ).then(result => {
      if (result === RESULTS.GRANTED) {
        checkPermissionCoarseLocation();
      } else {
        showAlertPermission();
      }
    });
  };
  const checkPermissionCoarseLocation = () => {
    check(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ).then(result => {
      switch (result) {
        case RESULTS.GRANTED:
          handleGetLocation();
          break;
        case RESULTS.UNAVAILABLE:
        case RESULTS.DENIED:
        case RESULTS.LIMITED:
          requestPermissionCoarseLocation();
          break;
        case RESULTS.BLOCKED:
          showAlertPermission();
          break;
      }
    });
  };

  const checkPermissionFineLocation = () => {
    setTimeout(() => {
      check(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      ).then(result => {
        switch (result) {
          case RESULTS.GRANTED:
            checkPermissionCoarseLocation();
            break;
          case RESULTS.UNAVAILABLE:
          case RESULTS.DENIED:
          case RESULTS.LIMITED:
            requestPermissionFineLocation();
            break;
          case RESULTS.BLOCKED:
            showAlertPermission();
            break;
        }
      });
    }, 400);
  };

  const requestPermissionCoarseLocation = () => {
    request(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ).then(result => {
      if (result === RESULTS.GRANTED) {
        handleGetLocation();
      } else {
        showAlertPermission();
      }
    });
  };

  const handleGetLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        if (position) {
          let location = {
            latitude: `${Number(position.coords.latitude).toFixed(7)}`,
            longitude: `${Number(position.coords.longitude).toFixed(8)}`,
          };
          valueLocation === '0,0'
            ? null
            : editForm
            ? null
            : setValueLocation(`${location?.longitude}, ${location?.latitude}`);
        }
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  useEffect(() => {
    handleGetLong();
    dispatch(clearDetailUserID());
  }, []);

  useEffect(() => {
    if (!valueStaffSales) return;

    setFieldValue('Name', values?.Name);
    setFieldValue('ShortName', values?.ShortName);
    setFieldValue('TaxCode', values?.TaxCode);
    setFieldValue('Email', values?.Email);
    setFieldValue('EmailHD', values?.EmailHD);
    setFieldValue('Fax', values?.Fax);
    setFieldValue('WebSite', values?.WebSite);
    setFieldValue('Address', values?.Address);
    setFieldValue('BusinessScale', values?.BusinessScale);
    setFieldValue('PostalCode', values?.PostalCode);
    setFieldValue('RegisteredCapital', values?.RegisteredCapital);
    setFieldValue('LegalRepresentative', values?.LegalRepresentative);
    setFieldValue('IDCardNumber', values?.IDCardNumber);
    setFieldValue('Note', values?.Note);
    setFieldValue('NameExtention1', values?.NameExtention1);
    setFieldValue('TypeShareholderID', values?.TypeShareholderID?.toString());
    // const newContactNVKD = {
    //   CategoryType: 'Contact',
    //   IsActive: 1,
    //   Name: valueStaffSales?.UserFullName || '',
    //   NameExtention1: valueStaffSales?.UserFullName || '',
    //   BirthDate: moment(new Date()).format('YYYY-MM-DD'),
    //   ResponsibilitiesID:
    //     listPositions.find(i => i?.Code === 'Z99998')?.ID || 0,
    //   ResponsibilitiesName:
    //     listPositions.find(i => i?.Code === 'Z99998')?.Name || '',
    //   ResponsibilitiesCode:
    //     listPositions.find(i => i?.Code === 'Z99998')?.Code || '',
    //   CmpnID: userInfo?.CmpnID?.toString(),
    //   Email: valueStaffSales?.UserEmail || '',
    //   PhoneNumber: valueStaffSales?.UserPhone || '',
    //   Note: '',
    //   ID: 0,
    //   CustomerID: dataDetail?.ID,
    // };
    // // console.log('newContactNVKD', newContactNVKD);
    // const processedData = {
    //   profiles: sourceData?.CusDocument || [],
    //   shipping: sourceData?.CusShipping || [],
    //   contact: [newContactNVKD] || [],
    //   bank: sourceData?.CusBank || [],
    // };
    // valueListContact?.length === 0 && setDataModalEdit(processedData);
    const bodyUser = {ID: valueStaffSales?.UserID};
    dispatch(fetchDetailUserID(bodyUser));
  }, [valueStaffSales]);
  // console.log('valueStaffSales', listPositions);

  useEffect(() => {
    if (!detailUserID || !valueStaffSales) return;

    const parseMultipleValues = (ids, names) => {
      const idArray = String(ids)
        .split(',')
        .map(id => id.trim())
        .filter(Boolean);
      const nameArray = String(names)
        .split(';')
        .map(name => name.trim())
        .filter(Boolean);
      return idArray.map((id, index) => ({
        ID: id,
        Name: nameArray[index] || `Route ${id}`,
      }));
    };

    const region = parseMultipleValues(
      detailUserID.Region || '',
      detailUserID.RegionName || '',
    );
    const selectedIDs = detailUserID.SalesChannelID.split(',').map(id =>
      Number(id),
    );
    const selectedItems =
      listSalesChannel?.filter(item => selectedIDs.includes(item.ID)) || [];

    const parseRouteSalesArray = routeArrayString => {
      if (!routeArrayString) return [];

      try {
        const parsed = JSON.parse(routeArrayString);
        if (Array.isArray(parsed)) {
          return parsed.map(item => {
            if (item.RouteSales === '%' || item.RouteSales === '% ') {
              return {
                ID: '%',
                Name: 'Tất cả',
                ParentID: item.RouteParentID ?? 0,
                RoutePhone: item?.RoutePhone ?? 0,
              };
            }

            return {
              ID: item.RouteSales,
              Name: item.RouteSaleName?.trim() || `Route ${item.RouteSales}`,
              ParentID: item.RouteParentID ?? 0,
              RoutePhone: item?.RoutePhone ?? 0,
            };
          });
        }
      } catch (e) {
        console.log(
          'Không phải JSON hợp lệ, fallback sang dạng chuỗi ID/Name tách',
        );
      }

      // fallback nếu dữ liệu không phải JSON, tách theo "," và ";"
      const result = parseMultipleValues(routeArrayString, '');
      return result.map(item =>
        item.ID === '%' ? {...item, Name: 'Tất cả'} : item,
      );
    };
    const salesRoute1 = parseRouteSalesArray(detailUserID.RouteSalesArray1);
    const salesRoute2 = parseRouteSalesArray(detailUserID.RouteSalesArray2);

    const salesRoute3 = parseRouteSalesArray(detailUserID.RouteSalesArray3);

    const salesRoute4 = parseRouteSalesArray(detailUserID.RouteSalesArray4);

    editForm &&
      setValueRegion(
        dataDetail?.RegionID
          ? listVBH?.find(
              item => item?.ID?.toString() === dataDetail?.RegionID?.toString(),
            )
          : listVBH?.[0],
      );
    setValueStructure(
      dataDetail
        ? salesRoute1?.find(
            item =>
              item?.ID?.toString() === dataDetail?.SalesRouteID?.toString(),
          )
        : salesRoute1?.[0],
    );
    setValueRouteSaleNameRegion(
      dataDetail
        ? salesRoute2?.find(
            item =>
              item?.ID?.toString() === dataDetail?.AreaSupervisorID?.toString(),
          )
        : salesRoute2?.[0],
    );
    setValueRouteSalesStaff(
      dataDetail
        ? salesRoute3?.find(
            item =>
              item?.ID?.toString() === dataDetail?.SalesStaffID?.toString(),
          )
        : salesRoute3?.[0],
    );
    setValueDetailRegionRoute(
      dataDetail?.AreaRouteDetailsID !== ''
        ? salesRoute4?.find(
            item =>
              item?.ID?.toString() ===
              dataDetail?.AreaRouteDetailsID?.toString(),
          )
        : salesRoute4?.[0],
    );
    const dataValuesStaffSale = {
      Region: listVBH,
      SalesChannelRoute: selectedItems,
      SalesRoute1: salesRoute1,
      SalesRoute2: salesRoute2,
      SalesRoute3: salesRoute3,
      SalesRoute4: salesRoute4,
    };
    setDataValuesSaleStaff(dataValuesStaffSale);

    editForm
      ? null
      : setValueSalesChannel(dataValuesStaffSale?.SalesChannelRoute[0]);
  }, [detailUserID, valueStaffSales]);
  // console.log('valueRouteSalesStaff',valueRouteSalesStaff)
  useEffect(() => {
    if (valueRouteSalesStaff) {
      setFieldValue('HotlineNumber', valueRouteSalesStaff?.RoutePhone);
    }
  }, [valueRouteSalesStaff]);
  const isValidColor = color => {
    if (typeof color !== 'string') return false;

    const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
    if (hexRegex.test(color)) return true;

    const validColors = [
      'white',
      'black',
      'blue',
      'red',
      'green',
      'yellow',
      'gray',
      'purple',
      'pink',
      'brown',
      'orange',
    ];
    if (validColors.includes(color.toLowerCase())) return true;

    return false;
  };

  // function validate dùng chung
  const isValidTax = v => {
    if (!v) return false;
    const tax = v.toString().trim();

    if (/^\d{10}$/.test(tax)) return true;
    if (/^\d{12}$/.test(tax)) return true;
    if (/^[0-9-]{14}$/.test(tax)) return true;

    return false;
  };
  //  console.log('aaaa', valueNation);
  useEffect(() => {
    if (valuePartnerGroup?.Code === 'Z03') {
      const unixTimestamp = Math.floor(Date.now() / 1000);
      setFieldValue('TaxCode', '9999999999');
      if (values?.BusinessRegistrationTypeID === '') {
        setFieldValue('BusinessRegistrationTypeID', '9999999999');
      }
    }
  }, [valuePartnerGroup?.Code === 'Z03']);
  React.useEffect(() => {
    const taxCode = values?.TaxCode?.toString()?.trim();
    if (!taxCode || editForm) return;

    debouncedCheckTaxRef.current(
      taxCode,
      dispatch,
      setTaxInfo,
      setTaxInfoModalVisible,
      setChecktaxInfo,
    );
    if (
      values?.TaxCode &&
      values?.BusinessRegistrationTypeID === '' &&
      isValidTax(values?.TaxCode)
    ) {
      setFieldValue('BusinessRegistrationTypeID', values?.TaxCode);
    }

    return () => {
      debouncedCheckTaxRef.current.cancel();
    };
  }, [values?.TaxCode]);

  useEffect(() => {
    if (
      values?.BusinessRegistrationTypeID &&
      values?.TaxCode === '' &&
      isValidTax(values?.BusinessRegistrationTypeID)
    ) {
      setFieldValue('TaxCode', values?.BusinessRegistrationTypeID);
    }
  }, [values?.BusinessRegistrationTypeID]);

  useEffect(() => {
    if (valueLineStructure) {
      const a = dataValuesSaleStaff?.SalesRoute2?.filter(
        item => item?.ParentID === valueLineStructure?.ID,
      );
      setValueRouteSaleNameRegion(a?.length ? a?.[0] : null);
    }
  }, [valueLineStructure, dispatch]);

  useEffect(() => {
    if (valueRouteSaleNameRegion) {
      const b = dataValuesSaleStaff?.SalesRoute3?.filter(
        item => item?.ParentID === valueRouteSaleNameRegion?.ID,
      );
      setValueRouteSalesStaff(b?.length ? b?.[0] : null);
    }
  }, [valueRouteSaleNameRegion, dispatch]);
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      style={[
        styleFormCustomer.container,
        {marginBottom: scale(Platform.OS === 'android' ? insets.bottom : 0)},
      ]}
      start={{x: 0.44, y: 0.45}}
      end={{x: 1.22, y: 0.25}}
      colors={['#FFFFFF', '#FFFFFF']}
      pointerEvents="box-none">
      {Platform.OS === 'android' && (
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
      )}
      <SafeAreaView style={styleFormCustomer.container}>
        <HeaderBack
          title={
            editForm
              ? languageKey('_edit_customer')
              : languageKey('_new_customer')
          }
          onPress={() => navigation.goBack()}
        />
        <ScrollView
          ref={scrollViewRef}
          style={styleFormCustomer.scrollView}
          showsVerticalScrollIndicator={false}>
          <View style={styleFormCustomer.containerHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styleFormCustomer.header}>
                {languageKey('_information_general')}
              </Text>
              {dataDetail?.ApprovalDisplayStatus ? (
                <View
                  style={[
                    styles.bodyStatus,
                    {marginTop: scale(6)},
                    {
                      backgroundColor: isValidColor(
                        dataDetail?.ApprovalDisplayColor,
                      )
                        ? dataDetail?.ApprovalDisplayColor
                        : '#DBEAFE',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.txtStatus,
                      {
                        color: isValidColor(
                          dataDetail?.ApprovalDisplayTextColor,
                        )
                          ? dataDetail?.ApprovalDisplayTextColor
                          : '#1E40AF',
                      },
                    ]}>
                    {dataDetail?.ApprovalDisplayStatus}
                  </Text>
                </View>
              ) : null}
            </View>
            <Button
              style={styleFormCustomer.btnShowInfor}
              onPress={() => toggleInformation('general')}>
              <SvgXml
                xml={showInformation.general ? arrow_down_big : arrow_next_gray}
              />
            </Button>
          </View>
          {showInformation.general && (
            <View style={styleFormCustomer.card}>
              <View
                ref={el => registerFieldRef('CustomerType', el)}
                style={styleFormCustomer.input}>
                <CardModalSelect
                  title={languageKey('_customer_type')}
                  data={listCustomerType}
                  setValue={setValueCustomerType}
                  value={valueCustomerType?.Name}
                  bgColor={'#F9FAFB'}
                  require={true}
                />
              </View>
              {valueCustomerType?.Code === 'TN' ? (
                <>
                  <View
                    ref={el => registerFieldRef('CustomerType', el)}
                    style={styleFormCustomer.input}>
                    <CardModalSelect
                      title={languageKey('_sales_channel')}
                      data={listSalesChannel}
                      setValue={setValueSalesChannel}
                      value={valueSalesChannel?.Name}
                      bgColor={'#FAFAFA'}
                      require={true}
                    />
                  </View>
                  <View
                    ref={el => registerFieldRef('Name', el)}
                    onLayout={() => {}}>
                    <InputDefault
                      name="Name"
                      returnKeyType="next"
                      style={styleFormCustomer.input}
                      value={values?.Name}
                      isEdit={true}
                      label={languageKey('_customer_name')}
                      placeholderInput={true}
                      bgColor={'#F9FAFB'}
                      require={true}
                      labelHolder={languageKey('_enter_the_customer_name')}
                      {...{
                        touched,
                        errors,
                        handleBlur,
                        handleChange,
                        setFieldValue,
                      }}
                    />
                  </View>
                  <View
                    ref={el => registerFieldRef('TaxCode1', el)}
                    onLayout={() => {}}>
                    <InputDefault
                      name="TaxCode"
                      returnKeyType="next"
                      style={styleFormCustomer.input}
                      value={values?.TaxCode?.toString()}
                      isEdit={true}
                      label={languageKey('_tax_code_cccd')}
                      placeholderInput={true}
                      bgColor={'#F9FAFB'}
                      string={valuePartnerGroup?.Code === 'Z03' ? false : true}
                      require={true}
                      keyboardType={'numeric'}
                      check={checktaxInfo}
                      labelHolder={languageKey('_enter_tax_code')}
                      {...{
                        touched,
                        errors,
                        handleBlur,
                        handleChange, // Formik
                        setFieldValue,
                      }}
                    />
                    {/* {touched.TaxCode && errors.TaxCode ? (
                      <Text style={{color: 'red', marginTop: 4}}>
                        {errors.TaxCode}
                      </Text>
                    ) : null} */}
                  </View>
                </>
              ) : (
                <>
                  <View
                    ref={el => registerFieldRef('TaxCode1', el)}
                    onLayout={() => {}}>
                    <InputDefault
                      name="TaxCode"
                      returnKeyType="next"
                      style={styleFormCustomer.input}
                      value={values?.TaxCode?.toString()}
                      isEdit={true}
                      label={languageKey('_tax_code_cccd')}
                      placeholderInput={true}
                      bgColor={'#F9FAFB'}
                      string={true}
                      require={valuePartnerGroup?.Code === 'Z03' ? false : true}
                      check={checktaxInfo}
                      keyboardType={'numeric'}
                      labelHolder={languageKey('_enter_tax_code')}
                      {...{
                        touched,
                        errors,
                        handleBlur,
                        handleChange, // Formik
                        setFieldValue,
                      }}
                    />
                    {/* {touched.TaxCode && errors.TaxCode ? (
                      <Text style={{color: 'red', marginTop: 4}}>
                        {errors.TaxCode}
                      </Text>
                    ) : null} */}
                  </View>
                  {/* <View style={styleFormCustomer.input}>
                    <CardModalSelect
                      title={languageKey('_link_inherit_information')}
                      data={listCustomerByUserID}
                      setValue={setValueCustomerInherit}
                      value={valueCustomerInherit?.Name}
                      bgColor={'#F9FAFB'}
                    />
                  </View> */}
                  <View
                    ref={el => registerFieldRef('Name', el)}
                    onLayout={() => {}}>
                    <InputDefault
                      name="Name"
                      returnKeyType="next"
                      style={styleFormCustomer.input}
                      value={values?.Name}
                      isEdit={true}
                      label={languageKey('_customer_name')}
                      placeholderInput={true}
                      bgColor={'#F9FAFB'}
                      require={true}
                      labelHolder={languageKey('_enter_the_customer_name')}
                      {...{
                        touched,
                        errors,
                        handleBlur,
                        handleChange,
                        setFieldValue,
                      }}
                    />
                  </View>
                  <View
                    ref={el => registerFieldRef('valuePartnerType', el)}
                    style={styleFormCustomer.input}>
                    <CardModalSelect
                      title={languageKey('_business_partner_type')}
                      data={listPartnerType}
                      setValue={setValuePartnerType}
                      value={valuePartnerType?.Name}
                      bgColor={'#F9FAFB'}
                      require={true}
                    />
                  </View>
                  <View
                    ref={el => registerFieldRef('valuePartnerGroup', el)}
                    style={styleFormCustomer.input}>
                    <CardModalSelect
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
                    />
                  </View>
                </>
              )}
              {valueCustomerType?.Code === 'HT' && (
                <View
                  ref={el =>
                    registerFieldRef('valueListCustomerOfficalSupport', el)
                  }
                  style={styleFormCustomer.input}>
                  <CardModalSelect
                    title={languageKey('_mainstream_customer')}
                    data={listCustomerOfficalSupport}
                    setValue={setValueListCustomerOfficalSupport}
                    value={valueListCustomerOfficalSupport?.Name}
                    bgColor={'#F9FAFB'}
                    disabled={false}
                    name={true}
                    require={true}
                  />
                </View>
              )}
              {/* {valueCustomerType?.Code !== 'HT' && (
                <View style={styleFormCustomer.input}>
                  <ToggleCheckBox
                    label={languageKey(' _business_support')}
                    value={checkedSupport}
                    onChange={setCheckedSupport}
                    disable={
                      valueListCustomerOfficalSupport?.Name ? true : false
                    }
                  />
                </View>
              )} */}
              {valueCustomerType?.Code === 'TN' ? null : (
                <>
                  <View
                    ref={el => registerFieldRef('valueHonorifics', el)}
                    style={styleFormCustomer.input}>
                    <CardModalSelect
                      title={languageKey('_title')}
                      data={listHonorifics}
                      setValue={setValueHonorifics}
                      value={valueHonorifics?.Name}
                      bgColor={'#F9FAFB'}
                      require={true}
                    />
                  </View>
                  {/* <View style={styleFormCustomer.input}>
                    <CardModalSelect
                      title={languageKey('_customer_group')}
                      data={listCustomerGroup}
                      setValue={setValueCustomerGroup}
                      value={valueCustomerGroup?.Name}
                      bgColor={'#F9FAFB'}
                      require={true}
                    />
                  </View> */}
                  <View
                    ref={el => registerFieldRef('ShortName', el)}
                    onLayout={() => {}}>
                    <InputDefault
                      name="ShortName"
                      returnKeyType="next"
                      style={styleFormCustomer.input}
                      value={values?.ShortName}
                      isEdit={true}
                      label={languageKey('_abbreviated_name')}
                      placeholderInput={true}
                      bgColor={'#F9FAFB'}
                      labelHolder={languageKey('_enter_an_abbreviation')}
                      require={true}
                      limit={1}
                      string={true}
                      {...{
                        touched,
                        errors,
                        handleBlur,
                        handleChange,
                        setFieldValue,
                      }}
                    />
                  </View>
                </>
              )}
              {valueCustomerType?.Code === 'TN' ? null : (
                <>
                  <InputDefault
                    name="WebSite"
                    returnKeyType="next"
                    style={styleFormCustomer.input}
                    value={values?.WebSite}
                    label={'Website'}
                    placeholderInput={true}
                    isEdit={true}
                    bgColor={'#F9FAFB'}
                    labelHolder={languageKey('_enter_content')}
                    {...{
                      touched,
                      errors,
                      handleBlur,
                      handleChange,
                      setFieldValue,
                    }}
                  />
                  <InputDefault
                    name="Fax"
                    returnKeyType="next"
                    style={styleFormCustomer.input}
                    value={values?.Fax}
                    label={languageKey('_fax_number')}
                    isEdit={true}
                    bgColor={'#F9FAFB'}
                    string={true}
                    keyboardType={'numeric'}
                    placeholderInput={true}
                    labelHolder={languageKey('_enter_the_fax_number')}
                    {...{
                      touched,
                      errors,
                      handleBlur,
                      handleChange,
                      setFieldValue,
                    }}
                  />
                </>
              )}
              <View
                ref={el => registerFieldRef('valueListPhoneNumber', el)}
                onLayout={() => {}}>
                <InputPhoneNumber
                  label={languageKey('_phone')}
                  labelHolder={languageKey('_enter_phone')}
                  setListPhoneNumber={setValueListPhoneNumber}
                  dataEdit={valueListPhoneNumber}
                  bgColor={'#F9FAFB'}
                  require={true}
                />
              </View>
              {valueCustomerType?.Code === 'TN' ? null : (
                <>
                  <InputDefault
                    name="Email"
                    returnKeyType="next"
                    style={styleFormCustomer.input}
                    value={values?.Email}
                    isEdit={true}
                    label={'Email'}
                    bgColor={'#F9FAFB'}
                    placeholderInput={true}
                    labelHolder={languageKey('_enter_mail')}
                    {...{
                      touched,
                      errors,
                      handleBlur,
                      handleChange,
                      setFieldValue,
                    }}
                  />
                </>
              )}
              {valueCustomerType?.Code === 'TN' ? null : (
                <>
                  <View
                    ref={el => registerFieldRef('valueSAPPaymentTermsID', el)}
                    onLayout={() => {}}
                    style={styleFormCustomer.input}>
                    <CardModalSelect
                      title={languageKey('_payment_terms')}
                      data={listTermsOfPayment}
                      setValue={setValueStaffSalvalueSAPPaymentTermsID}
                      value={valueSAPPaymentTermsID?.Name}
                      require={true}
                    />
                  </View>
                </>
              )}
              {valueCustomerType?.Code !== 'TN' && (
                <View style={styleFormCustomer.input}>
                  <ToggleCheckBox
                    label={languageKey(' _business_support')}
                    value={checkedSupport}
                    onChange={setCheckedSupport}
                    disable={
                      valueListCustomerOfficalSupport?.Name ? true : false
                    }
                  />
                </View>
              )}
              <InputLocationnew
                returnKeyType="next"
                style={styleFormCustomer.input}
                value={valueLocation}
                label={languageKey('_gps_coordinates')}
                isEdit
                bgColor={'#F9FAFB'}
                placeholderInput
                labelHolder={languageKey('_select_coordinates')}
                tree
                onPress={handleGetLong}
                onChangeText={setValueLocation}
                onChangeLocation={handleLocationChange}
                onAddressChange={handleAddressChange} // nhận địa chỉ từ GPS
                addressQuery={addressQuery} // truyền địa chỉ để map focus
                typeNote
                // require={true}
                dem={'0'}
                {...{touched, errors, handleBlur, handleChange, setFieldValue}}
              />
              <View
                ref={el => registerFieldRef('valueNation', el)}
                onLayout={() => {}}
                style={styleFormCustomer.input}
                key={valueNation?.ID || 'nation'}>
                <CardModalProvince
                  title={languageKey('_nation')}
                  data={listNation}
                  setValue={setValueNation}
                  value={valueNation?.RegionsName}
                  bgColor={'#F9FAFB'}
                  require={true}
                />
              </View>
              {valueNation?.Code?.toLowerCase() === 'vn' && (
                <View style={styleFormCustomer.input}>
                  <ToggleCheckBox
                    label={'Hiển thị quốc gia lên hóa đơn'}
                    value={checkednation}
                    onChange={setCheckedNation}
                    disable={
                      valueNation?.Code?.toLowerCase() === 'vn' ? false : true
                    }
                  />
                </View>
              )}
              {valueNation?.ID != 1 ? null : (
                <>
                  <View
                    ref={el => registerFieldRef('valueProvinceCity', el)}
                    onLayout={() => {}}
                    style={styleFormCustomer.input}
                    key={valueProvinceCity?.ID || 'province'}>
                    <CardModalProvince
                      title={languageKey('_province_city')}
                      data={listProvinceCity}
                      setValue={setValueProvinceCity}
                      value={valueProvinceCity?.RegionsName}
                      bgColor={'#F9FAFB'}
                      require={true}
                    />
                  </View>
                  <View
                    ref={el => registerFieldRef('valueWardCommune', el)}
                    onLayout={() => {}}
                    style={styleFormCustomer.input}
                    key={valueWardCommune?.ID || 'ward'}>
                    <CardModalProvince
                      title={languageKey('_ward_commune')}
                      data={listWardCommune}
                      setValue={setValueWardCommune}
                      value={valueWardCommune?.RegionsName}
                      bgColor={'#F9FAFB'}
                      require={true}
                      xa={valueWardCommune?.RegionsName ? true : false}
                      checknt={valueWardCommune?.Extention3}
                    />
                  </View>
                </>
              )}
              <View
                ref={el => registerFieldRef('Address', el)}
                onLayout={() => {}}>
                <InputDefault
                  name="Address"
                  returnKeyType="next"
                  style={styleFormCustomer.input}
                  value={values?.Address}
                  label={languageKey('_address')}
                  placeholderInput={true}
                  isEdit={true}
                  labelHolder={languageKey('_enter_address')}
                  bgColor={'#F9FAFB'}
                  require={true}
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />
              </View>
              {/* <InputLocation
                selectTextOnFocus={false}
                label={languageKey('_gps_coordinates')}
                labelHolder={languageKey('_select_coordinates')}
                placeholderInput={true}
                onPress={handleGetLong}
                value={valueLocation}
                onChangeText={setValueLocation}
                bgColor={'#F9FAFB'}
                style={styleFormCustomer.input}
              /> */}
              {/* <InputLocationnew
                returnKeyType="next"
                style={styleFormCustomer.input}
                value={valueLocation}
                label={languageKey('_gps_coordinates')}
                isEdit={true}
                bgColor={'#F9FAFB'}
                placeholderInput={true}
                labelHolder={languageKey('_select_coordinates')}
                tree={true}
                onPress={handleGetLong}
                onChangeText={setValueLocation}
                onChangeLocation={handleLocationChange}
                typeNote={true}
                dem={'0'}
                {...{
                  touched,
                  errors,
                  handleBlur,
                  handleChange,
                  setFieldValue,
                }}
              /> */}
              {/* <InputLocationnew
                returnKeyType="next"
                style={styleFormCustomer.input}
                value={valueLocation}
                label={languageKey('_gps_coordinates')}
                isEdit
                bgColor={'#F9FAFB'}
                placeholderInput
                labelHolder={languageKey('_select_coordinates')}
                tree
                onPress={handleGetLong}
                onChangeText={setValueLocation}
                onChangeLocation={handleLocationChange}
                onAddressChange={handleAddressChange} // nhận địa chỉ từ GPS
                addressQuery={addressQuery} // truyền địa chỉ để map focus
                typeNote
                dem={'0'}
                {...{touched, errors, handleBlur, handleChange, setFieldValue}}
              /> */}
              {valueCustomerType?.Code !== 'TN' && (
                <View
                  ref={el => registerFieldRef('valueSAPzone', el)}
                  onLayout={() => {}}
                  style={styleFormCustomer.input}
                  key={valueSAPzone?.ID || 'valueSAPzone'}>
                  <CardModalSelect
                    title={languageKey('_region_SAP')}
                    data={listVungSAP}
                    setValue={setValueSAPzone}
                    value={valueSAPzone?.Name}
                    bgColor={'#F9FAFB'}
                    require={true}
                  />
                </View>
              )}
              {valueCustomerType?.Code === 'TN' ? (
                <>
                  <InputDefault
                    name="MainBusinessSector"
                    returnKeyType="next"
                    style={styleFormCustomer.input}
                    value={values?.MainBusinessSector}
                    label={languageKey('_main_business_lines')}
                    placeholderInput={true}
                    isEdit={true}
                    bgColor={'#F9FAFB'}
                    labelHolder={languageKey('_enter_content')}
                    {...{
                      touched,
                      errors,
                      handleBlur,
                      handleChange,
                      setFieldValue,
                    }}
                  />
                  <View
                    ref={el =>
                      registerFieldRef('OverallCustomerEvaluation', el)
                    }
                    onLayout={() => {}}>
                    <InputDefault
                      name="OverallCustomerEvaluation"
                      returnKeyType="next"
                      style={styleFormCustomer.input}
                      value={values?.OverallCustomerEvaluation}
                      label={languageKey('_general_customer_reiviews')}
                      placeholderInput={true}
                      isEdit={true}
                      bgColor={'#F9FAFB'}
                      labelHolder={languageKey('_enter_content')}
                      require={valueCustomerType?.Code === 'TN' ? true : false}
                      {...{
                        touched,
                        errors,
                        handleBlur,
                        handleChange,
                        setFieldValue,
                      }}
                    />
                  </View>
                  <InputDefault
                    name="StaffAndInfrastructure"
                    returnKeyType="next"
                    style={styleFormCustomer.input}
                    value={values?.StaffAndInfrastructure}
                    label={languageKey(' _infrastructure')}
                    placeholderInput={true}
                    isEdit={true}
                    bgColor={'#F9FAFB'}
                    labelHolder={languageKey('_enter_content')}
                    {...{
                      touched,
                      errors,
                      handleBlur,
                      handleChange,
                      setFieldValue,
                    }}
                  />
                  <Text style={styleFormCustomer.headerBoxImage}>
                    {languageKey('_image')}
                  </Text>
                  <View style={styleFormCustomer.imgBox}>
                    <AttachManyFile
                      OID={item?.OID}
                      images={images}
                      setDataImages={setDataImages}
                      setLinkImage={setLinkImage}
                      dataLink={linkImage}
                    />
                  </View>
                </>
              ) : (
                <>
                  {/* <InputDefault
                    name="PostalCode"
                    returnKeyType="next"
                    style={styleFormCustomer.input}
                    value={values?.PostalCode}
                    label={languageKey('_postal_code')}
                    placeholderInput={true}
                    isEdit={true}
                    string={true}
                    keyboardType={'numeric'}
                    bgColor={'#F9FAFB'}
                    labelHolder={languageKey('_enter_postal_code')}
                    {...{
                      touched,
                      errors,
                      handleBlur,
                      handleChange,
                      setFieldValue,
                    }}
                  /> */}
                  {/* <View style={styleFormCustomer.input}>
                    <CardModalSelect
                      title={languageKey('_recording_channel')}
                      data={listRecordingChannel}
                      setValue={setValueRecordingChannel}
                      value={valueRecordingChannel?.Name}
                      bgColor={'#F9FAFB'}
                    />
                  </View> */}
                  <View
                    ref={el => registerFieldRef('taxIssuedDate', el)}
                    style={{width: '100%', marginTop: 8}}>
                    <ModalSelectDate
                      title={languageKey('_date_of_tax_bussiness_license')}
                      showDatePicker={() =>
                        updateDateState('taxIssuedDate', {visible: true})
                      }
                      hideDatePicker={() =>
                        updateDateState('taxIssuedDate', {visible: false})
                      }
                      initialValue={dateStates.taxIssuedDate.selected}
                      selectedValueSelected={val =>
                        updateDateState('taxIssuedDate', {selected: val})
                      }
                      isDatePickerVisible={dateStates.taxIssuedDate.visible}
                      selectSubmitForm={val =>
                        updateDateState('taxIssuedDate', {submit: val})
                      }
                      bgColor={'#F9FAFB'}
                      require={true}
                    />
                  </View>

                  <View
                    ref={el => registerFieldRef('foundingDate', el)}
                    style={{width: '100%', marginTop: 8}}>
                    <ModalSelectDate
                      title={languageKey('_establishment_time')}
                      showDatePicker={() =>
                        updateDateState('foundingDate', {visible: true})
                      }
                      hideDatePicker={() =>
                        updateDateState('foundingDate', {visible: false})
                      }
                      initialValue={dateStates.foundingDate.selected}
                      selectedValueSelected={val =>
                        updateDateState('foundingDate', {selected: val})
                      }
                      isDatePickerVisible={dateStates.foundingDate.visible}
                      selectSubmitForm={val =>
                        updateDateState('foundingDate', {submit: val})
                      }
                      bgColor={'#F9FAFB'}
                      require={true}
                    />
                  </View>
                  <View ref={el => registerFieldRef('PartnerStartDate', el)}>
                    <InputDefault
                      name="PartnerStartDate"
                      returnKeyType="next"
                      style={styleFormCustomer.input}
                      value={values?.PartnerStartDate}
                      label={languageKey('_year_started_KT')}
                      placeholderInput={true}
                      isEdit={true}
                      string={true}
                      keyboardType={'numeric'}
                      bgColor={'#F9FAFB'}
                      require={true}
                      labelHolder={languageKey('_year_started_KT')}
                      {...{
                        touched,
                        errors,
                        handleBlur,
                        handleChange,
                        setFieldValue,
                      }}
                    />
                  </View>
                  <Text style={styleFormCustomer?.txtHeaderCompany}>
                    {languageKey('_information_legal_reprepsentation')}
                  </Text>
                  <View
                    ref={el => registerFieldRef('valueBusinessType', el)}
                    style={styleFormCustomer.input}>
                    <CardModalSelect
                      title={languageKey('_type_of_business')}
                      data={listBusinessType}
                      setValue={setValueBusinessType}
                      value={valueBusinessType?.Name}
                      bgColor={'#F9FAFB'}
                      require={true}
                    />
                  </View>
                  <View
                    ref={el => registerFieldRef('valueBusinessDomain', el)}
                    style={styleFormCustomer.input}>
                    <CardModalSelect
                      title={languageKey('_customer_business_segment')}
                      data={listBusinessDomain}
                      setValue={setValueBusinessDomain}
                      value={valueBusinessDomain?.Name}
                      bgColor={'#F9FAFB'}
                      require={true}
                    />
                  </View>
                  {/* <View style={styleFormCustomer.input}>
                    <CardModalSelect
                      title={languageKey('_type_of_business_registration')}
                      data={listBusinessRegistrationType}
                      setValue={setValueBusinessRegistrationType}
                      value={valueBusinessRegistrationType?.Name}
                      require={true}
                    />
                  </View> */}
                  <View
                    ref={el =>
                      registerFieldRef('BusinessRegistrationTypeID', el)
                    }
                    onLayout={() => {}}>
                    <InputDefault
                      name="BusinessRegistrationTypeID"
                      returnKeyType="next"
                      style={styleFormCustomer.input}
                      value={values?.BusinessRegistrationTypeID}
                      label={languageKey('_type_of_business_registration')}
                      placeholderInput={true}
                      isEdit={true}
                      keyboardType={'numeric'}
                      bgColor={'#F9FAFB'}
                      string={true}
                      labelHolder={languageKey(
                        '_type_of_business_registration',
                      )}
                      {...{
                        touched,
                        errors,
                        handleBlur,
                        handleChange,
                        setFieldValue,
                      }}
                      require={true}
                    />
                  </View>
                  <InputDefault
                    name="BusinessScale"
                    returnKeyType="next"
                    style={styleFormCustomer.input}
                    value={values?.BusinessScale}
                    label={languageKey('_business_scale')}
                    placeholderInput={true}
                    isEdit={true}
                    bgColor={'#F9FAFB'}
                    labelHolder={languageKey('_enter_business_scale')}
                    {...{
                      touched,
                      errors,
                      handleBlur,
                      handleChange,
                      setFieldValue,
                    }}
                  />
                  <InputDefault
                    name="RegisteredCapital"
                    returnKeyType="next"
                    style={styleFormCustomer.input}
                    value={String(values?.RegisteredCapital)}
                    label={languageKey('_charter_capital')}
                    placeholderInput={true}
                    isEdit={true}
                    keyboardType={'numeric'}
                    bgColor={'#F9FAFB'}
                    // limitnumber={true}
                    labelHolder={languageKey('_enter_charter_capital')}
                    {...{
                      touched,
                      errors,
                      handleBlur,
                      handleChange,
                      setFieldValue,
                    }}
                  />
                  <View
                    ref={el => registerFieldRef('LegalRepresentative', el)}
                    onLayout={() => {}}>
                    <InputDefault
                      name="LegalRepresentative"
                      returnKeyType="next"
                      style={styleFormCustomer.input}
                      value={values?.LegalRepresentative}
                      label={languageKey('_legal_representative')}
                      placeholderInput={true}
                      isEdit={true}
                      bgColor={'#F9FAFB'}
                      labelHolder={languageKey('_enter_legal_representative')}
                      {...{
                        touched,
                        errors,
                        handleBlur,
                        handleChange,
                        setFieldValue,
                      }}
                      require={true}
                    />
                  </View>
                  <InputDefault
                    name="IDCardNumber"
                    returnKeyType="next"
                    style={styleFormCustomer.input}
                    value={values?.IDCardNumber}
                    label={languageKey('_id_card_passport')}
                    placeholderInput={true}
                    isEdit={true}
                    string={true}
                    keyboardType={'numeric'}
                    bgColor={'#F9FAFB'}
                    // string={true}
                    labelHolder={languageKey('_enter_information')}
                    {...{
                      touched,
                      errors,
                      handleBlur,
                      handleChange,
                      setFieldValue,
                    }}
                  />
                </>
              )}
            </View>
          )}

          <View style={styleFormCustomer.containerHeader}>
            <Text style={styleFormCustomer.header}>
              {languageKey('_management_information')}
            </Text>
            <Button
              style={styleFormCustomer.btnShowInfor}
              onPress={() => toggleInformation('management')}>
              <SvgXml
                xml={
                  showInformation.management ? arrow_down_big : arrow_next_gray
                }
              />
            </Button>
          </View>
          {showInformation.management && (
            <View style={styleFormCustomer.card}>
              {valueCustomerType?.Code === 'TNA' ? null : (
                <>
                  <Text bold style={styleFormCustomer?.txtHeaderCompany}>
                    {languageKey('_sales_route')}
                  </Text>
                  <View
                    ref={el => registerFieldRef('valueStaffSales', el)}
                    style={styleFormCustomer.input}>
                    <CardModalSelect
                      title={languageKey('_sales_staff_customer')}
                      data={memoizedListUser}
                      setValue={setValueStaffSales}
                      value={valueStaffSales?.UserFullName}
                      require={true}
                    />
                  </View>
                  <View style={styleFormCustomer.input}>
                    <CardModalSelect
                      title={languageKey('_support_staff')}
                      data={listUsersSupport}
                      setValue={setValueStaffSupport}
                      value={valueStaffSupport?.UserFullName}
                    />
                  </View>
                  <View
                    ref={el => registerFieldRef('valueSalesChannel', el)}
                    style={styleFormCustomer.input}>
                    <CardModalSelect
                      title={languageKey('_sales_channel')}
                      data={dataValuesSaleStaff?.SalesChannelRoute}
                      setValue={setValueSalesChannel}
                      value={valueSalesChannel?.Name}
                      bgColor={'#FAFAFA'}
                      require={true}
                    />
                  </View>
                  <View style={styleFormCustomer.input}>
                    <Text style={styleFormCustomer.txtHeaderInputView}>
                      {languageKey('_sales_organization')}
                    </Text>
                    <Text
                      style={styleFormCustomer.inputView}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {detailUserID ? detailUserID?.DepartmentName : ''}
                    </Text>
                  </View>
                  <View
                    ref={el => registerFieldRef('valueLineStructure', el)}
                    style={styleFormCustomer.input}>
                    <CardModalSelect
                      title={languageKey('_line_structure')}
                      data={dataValuesSaleStaff?.SalesRoute1}
                      setValue={setValueStructure}
                      value={valueLineStructure?.Name}
                      bgColor={'#FAFAFA'}
                      require={true}
                    />
                  </View>
                  <View
                    ref={el => registerFieldRef('valueRouteSaleNameRegion', el)}
                    style={styleFormCustomer.input}>
                    <CardModalSelect
                      title={languageKey('_regional_monitoring_route')}
                      data={dataValuesSaleStaff?.SalesRoute2?.filter(
                        item => item?.ParentID === valueLineStructure?.ID,
                      )}
                      setValue={setValueRouteSaleNameRegion}
                      value={valueRouteSaleNameRegion?.Name}
                      bgColor={'#FAFAFA'}
                      require={true}
                    />
                  </View>

                  <View
                    ref={el => registerFieldRef('valueRouteSalesStaff', el)}
                    style={styleFormCustomer.input}>
                    <CardModalSelect
                      title={languageKey('_business_staff_route')}
                      data={dataValuesSaleStaff?.SalesRoute3?.filter(
                        item => item?.ParentID === valueRouteSaleNameRegion?.ID,
                      )}
                      setValue={setValueRouteSalesStaff}
                      value={valueRouteSalesStaff?.Name}
                      bgColor={'#FAFAFA'}
                      require={true}
                    />
                  </View>
                  <View style={styleFormCustomer.input}>
                    <CardModalSelect
                      title={languageKey('_details_of_the_route_area')}
                      data={dataValuesSaleStaff?.SalesRoute4}
                      setValue={setValueDetailRegionRoute}
                      value={valueDetailRegionRoute?.Name}
                      bgColor={'#FAFAFA'}
                      require={false}
                    />
                  </View>
                  <InputDefault
                    name="HotlineNumber"
                    returnKeyType="next"
                    style={styleFormCustomer.input}
                    value={values?.HotlineNumber}
                    label={languageKey('_hotline_number')}
                    placeholderInput={true}
                    string={true}
                    isEdit={true}
                    keyboardType={'numeric'}
                    labelHolder={languageKey('_enter_content')}
                    bgColor={'#F9FAFB'}
                    {...{
                      touched,
                      errors,
                      handleBlur,
                      handleChange,
                      setFieldValue,
                    }}
                  />
                  {valueCustomerType?.Code === 'TN' ? null : (
                    <>
                      <View
                        ref={el => registerFieldRef('valueSalesTeam', el)}
                        style={styleFormCustomer.input}>
                        <CardModalSelect
                          title={languageKey('_main_business_team')}
                          data={listSalesTeam}
                          setValue={setValueSalesTeam}
                          value={valueSalesTeam?.Name}
                          require={true}
                        />
                      </View>
                      <View
                        ref={el => registerFieldRef('valueSubTeam', el)}
                        style={styleFormCustomer.input}>
                        <CardModalSelect
                          title={languageKey(
                            '_small_team_in_charge_for_business',
                          )}
                          data={listSalesSubTeam}
                          setValue={setValueSubTeam}
                          value={valueSubTeam?.Name}
                          require={true}
                        />
                      </View>
                      <View
                        ref={el => registerFieldRef('valueRegion', el)}
                        style={styleFormCustomer.input}>
                        <CardModalSelect
                          title={languageKey('_sales_area')}
                          data={listVBH}
                          setValue={setValueRegion}
                          value={valueRegion?.Name}
                          bgColor={'#FAFAFA'}
                          require={true}
                        />
                      </View>
                    </>
                  )}
                </>
              )}
              <CustomerProductInfo
                setData={setValueCustomerProductInfor}
                data={dataProductCustomer}
              />
            </View>
          )}
          {1 && (
            <ModalContact
              setValueContact={setValueListContact}
              dataEdit={dataModalEdit?.contact}
              parentID={dataDetail?.ID}
              cmpnID={
                editForm
                  ? dataDetail?.CmpnID?.toString()
                  : userInfo?.CmpnID?.toString()
              }
              isadd={editForm ? false : true}
              TN={valueCustomerType?.Code === 'TN' ? true : false}
            />
          )}
          {valueCustomerType?.Code !== 'TN' && (
            <ModalDelivery
              setValueShipping={setValueListShipping}
              dataEdit={dataModalEdit?.shipping}
              parentID={dataDetail?.ID}
              cmpnID={
                editForm
                  ? dataDetail?.CmpnID?.toString()
                  : userInfo?.CmpnID?.toString()
              }
            />
          )}
          {valueCustomerType?.Code !== 'TN' && (
            <ModalBank
              setValueBank={setValueListBank}
              dataEdit={dataModalEdit?.bank}
              parentID={dataDetail?.ID}
              cmpnID={
                editForm
                  ? dataDetail?.CmpnID?.toString()
                  : userInfo?.CmpnID?.toString()
              }
            />
          )}
          <View
            style={{height: scale(8), width: '100%', backgroundColor: 'white'}}
          />
          {valueCustomerType?.Code && valueCustomerType?.Code !== 'TN' && (
            <View style={styleFormCustomer.cardFooter}>
              <ModalProfileCustomerFile
                setData={setValueListCustomerProfiles}
                dataEdit={editForm ? dataDetail?.CurrentDocs : []}
                parentID={dataDetail?.ID}
                dataex={listItemTypes}
              />
            </View>
          )}

          <View style={{marginBottom: scale(80)}}></View>
        </ScrollView>

        <View style={styleFormCustomer.containerFooter}>
          {dataDetail?.CustomerTypeID === 10133 ||
          dataDetail?.CustomerTypeCode === 'TN' ? (
            <>
              <Button
                style={[styleFormCustomer.btnSave, {width: '100%'}]}
                onPress={handleFormCustomer}
                disabled={dataDetail?.IsLock === 1}>
                <Text style={styleFormCustomer.txtBtnSave}>
                  {languageKey('_save')}
                </Text>
              </Button>
            </>
          ) : (
            <>
              <Button
                style={styleFormCustomer.btnSave}
                onPress={handleFormCustomer}>
                <Text style={styleFormCustomer.txtBtnSave}>
                  {languageKey('_save')}
                </Text>
              </Button>
              <Button
                style={styleFormCustomer.btnConfirm}
                disabled={sourceData?.IsLock === 1 || !editForm}
                onPress={handleConfirm}>
                <Text style={styleFormCustomer.txtBtnConfirm}>
                  {languageKey('_confirm')}
                </Text>
              </Button>
            </>
          )}
        </View>
      </SafeAreaView>
      <Modal
        visible={taxInfoModalVisible}
        transparent
        animationType="fade"
        style={{margin: 0}}
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
        onBackButtonPress={() => setTaxInfoModalVisible(false)}
        onBackdropPress={() => setTaxInfoModalVisible(false)}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating
        onRequestClose={() => setTaxInfoModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {languageKey('taxcodeccdc_exists')}
            </Text>
            <View
              style={[
                styles.bodyStatus,
                {
                  backgroundColor:
                    taxInfo?.IsActive === 1 ? '#DCFCE7' : '#FEE2E2',
                },
              ]}>
              <Text
                style={[
                  styles.txtStatus,
                  {
                    color: taxInfo?.IsActive === 1 ? '#166534' : '#991B1B',
                    justifyContent: 'center',
                    alignSelf: 'center',
                  },
                ]}>
                {taxInfo?.IsActive === 1
                  ? languageKey('_active')
                  : languageKey('_inactive')}
              </Text>
            </View>
            <View style={styles.txtHeaderBody}>
              <Text style={styles.sectionTitle}>
                {languageKey('_latest_transaction')}
              </Text>
              <Text style={styles.sectionText}>
                {moment(taxInfo?.ChangeDate).format('HH:mm:ss DD/MM/YYYY') ||
                  '_'}
              </Text>
            </View>
            <View style={styleFormCustomer.contentCardRow}>
              <View>
                <Text style={styles.sectionTitle}>
                  {languageKey('_customer_name')}
                </Text>
                <Text style={styles.sectionTitle}>
                  {taxInfo?.Name} - MST/CCDC: {taxInfo?.TaxCode} - ĐC:{' '}
                  {taxInfo?.Address}
                </Text>
              </View>
              <View style={styles.txtHeaderBody}>
                <Text style={styles.sectionTitle}>
                  {languageKey('_sales_staff_customer')}
                </Text>
                <Text style={styles.sectionText}>
                  {taxInfo?.CustomerRepresentativeName || '_'}
                </Text>
              </View>
            </View>
            <View style={styleFormCustomer.contentRowFlex}>
              <View style={styleFormCustomer.txtHeaderBody1}>
                <Text style={styles.sectionTitle}>
                  {languageKey('_support_staff')}
                </Text>
                <Text style={styles.sectionText}>
                  {taxInfo?.SupportAgentName || '_'}
                </Text>
              </View>
              <View style={styleFormCustomer.txtHeaderBody1}>
                <Text style={styles.sectionTitle}>
                  {languageKey('_sales_channel')}
                </Text>
                <Text style={styles.sectionText}>
                  {taxInfo?.SalesChannelName || '_'}
                </Text>
              </View>
            </View>
            <View style={styleFormCustomer.contentRowFlex}>
              <View style={styleFormCustomer.txtHeaderBody1}>
                <Text style={styles.sectionTitle}>
                  {languageKey('_sales_area')}
                </Text>
                <Text style={styles.sectionText}>
                  {taxInfo?.RegionName || '_'}
                </Text>
              </View>
              <View style={styleFormCustomer.txtHeaderBody1}>
                <Text style={styles.sectionTitle}>
                  {languageKey('_sales_organization')}
                </Text>
                <Text style={styles.sectionText}>
                  {taxInfo?.SalesOrganizationName || '_'}
                </Text>
              </View>
            </View>
            <View style={styleFormCustomer.contentRowFlex}>
              <View style={styleFormCustomer.txtHeaderBody1}>
                <Text style={styles.sectionTitle}>
                  {languageKey('_regional_monitoring_route')}
                </Text>
                <Text style={styles.sectionText}>
                  {taxInfo?.AreaSupervisorName || '_'}
                </Text>
              </View>
              <View style={styleFormCustomer.txtHeaderBody1}>
                <Text style={styles.sectionTitle}>
                  {languageKey('_business_staff_route')}
                </Text>
                <Text style={styles.sectionText}>
                  {taxInfo?.SalesStaffName || '_'}
                </Text>
              </View>
            </View>
            <View style={styleFormCustomer.contentRowFlex}>
              <View style={styleFormCustomer.txtHeaderBody1}>
                <Text style={styles.sectionTitle}>
                  {languageKey('_details_of_the_route_area')}
                </Text>
                <Text style={styles.sectionText}>
                  {taxInfo?.AreaRouteDetailName || 'Tất cả'}
                </Text>
              </View>
              <View style={styleFormCustomer.txtHeaderBody1}>
                <Text style={styles.sectionTitle}>
                  {languageKey('_main_business_team')}
                </Text>
                <Text style={styles.sectionText}>
                  {taxInfo?.SalesTeamName || '_'}
                </Text>
              </View>
            </View>
            <View style={styleFormCustomer.contentRowFlex}>
              <View style={styleFormCustomer.txtHeaderBody1}>
                <Text style={styles.sectionTitle}>
                  {languageKey('_small_team_in_charge_for_business')}
                </Text>
                <Text style={styles.sectionText}>
                  {taxInfo?.SalesSubTeamName || '_'}
                </Text>
              </View>
              <View style={styleFormCustomer.txtHeaderBody1}>
                <Text style={styles.sectionTitle}>
                  {languageKey('_hotline_number')}
                </Text>
                <Text style={styles.sectionText}>
                  {taxInfo?.HotlineNumber || '_'}
                </Text>
              </View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={() => setTaxInfoModalVisible(false)}>
                <Text style={styles.btnSecondaryText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <LoadingModal visible={loading} />
    </LinearGradient>
  );
};

export default FormCustomerProfileScreen;
