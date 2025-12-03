/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useEffect, useMemo, useState} from 'react';
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
  TouchableOpacity,
  Linking,
} from 'react-native';

import routes from '@routes';
import {styleFormCustomer, styles} from './styles';
import {translateLang} from '@store/accLanguages/slide';
import {arrow_down_big, arrow_next_gray, edit} from '@svgImg';
import {
  ApiCustomerProfiles_Add,
  ApiCustomerProfiles_Edit,
  ApiCustomerProfiles_GetById,
  ApiCustomerProfiles_Submit,
} from '@api';
import {
  Button,
  HeaderBack,
  NotifierAlert,
  CustomerProductInfo,
  ModalContact,
  ModalDelivery,
  ModalBank,
  AttachManyFile,
  LoadingModal,
  TextCopy,
  ModalProfileCustomerFile,
} from '@components';
import {
  fetchDetailUserID,
  fetchListNation,
  fetchListProvinceCity,
  fetchListSalesSubTeam,
  fetchListSalesVBH,
  fetchListWardCommune,
} from '@store/accCustomer_Profile/thunk';
import {clearDetailUserID} from '@store/accCustomer_Profile/slide';
import moment from 'moment';
import {scale} from '@utils/resolutions';;
import {colors, fontSize} from '@themes';
import ToggleCheckBox from '../../../components/ToggleCheckBox';

const ViewCustomerProfileScreen = ({route}) => {
  const item = route?.params?.item;
  const dataDetail = route?.params?.dataDetail;
  const editForm = route?.params?.editForm;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const languageKey = useSelector(translateLang);
  const {detailMenu} = useSelector(state => state.Home);
  const {listUser} = useSelector(state => state.ApprovalProcess);
  const {
    listCustomerType,
    listHonorifics,
    listNation,
    listCustomerGroup,
    listRecordingChannel,
    listBusinessDomain,
    listBusinessRegistrationType,
    listSalesTeam,
    listSalesSubTeam,
    listBusinessType,
    listSalesChannel,
    listPartnerType,
    listPartnerGroup,
    detailUserID,
    listVBH,
    listItemTypes,
    listVungSAP,
    listTermsOfPayment,
  } = useSelector(state => state.CustomerProfile);
  const {userInfo, listUserByUserID, listCustomerByUserID} = useSelector(
    state => state.Login,
  );
  const {listCustomers} = useSelector(state => state.ApprovalProcess);

  const [dateStates, setDateStates] = useState({
    foundingDate: {
      selected: editForm ? dataDetail?.FoundingDate : new Date(),
      submit: editForm ? dataDetail?.FoundingDate : new Date(),
      visible: false,
    },
    taxIssuedDate: {
      selected: editForm ? dataDetail?.TaxIssuedDate : new Date(),
      submit: editForm ? dataDetail?.TaxIssuedDate : new Date(),
      visible: false,
    },
  });
  const [valueSalesChannel, setValueSalesChannel] = useState(() => {
    return (
      listSalesChannel?.filter(
        item => dataDetail?.SalesChannelID === item.ID,
      ) || []
    );
  });
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [listPhones, setListPhones] = useState([]);

  const [valueCustomerType, setValueCustomerType] = useState(
    listCustomerType?.find(item => item?.ID === dataDetail?.CustomerTypeID),
  );
  const [valueHonorifics, setValueHonorifics] = useState(
    listHonorifics?.find(item => item?.ID === dataDetail?.HonorificsID),
  );
  const [valueCustomerInherit, setValueCustomerInherit] = useState(
    listCustomerByUserID?.find(
      cus => cus?.ID === Number(dataDetail?.ReferenceID),
    ),
  );
  const [valueListPhoneNumber, setValueListPhoneNumber] = useState([]);
  const [valueNation, setValueNation] = useState(null);
  const [valueProvinceCity, setValueProvinceCity] = useState(null);
  const [valueDistrictID, setvalueDistrictID] = useState(null);
  const [valueWardCommune, setValueWardCommune] = useState(null);
  const [valueLocation, setValueLocation] = useState(
    editForm ? `${dataDetail?.Lat}, ${dataDetail?.Long}` : '0,0',
  );
  const [valueCustomerGroup, setValueCustomerGroup] = useState(
    listCustomerGroup?.find(item => item?.ID === dataDetail?.CustomerGroupID),
  );
  const [valueBusinessType, setValueBusinessType] = useState(
    listBusinessType?.find(item => item?.ID === dataDetail?.BusinessType),
  );
  const [valueBusinessDomain, setValueBusinessDomain] = useState(
    listBusinessDomain?.find(item => item?.ID === dataDetail?.BusinessDomainID),
  );
  const [valueSAPPaymentTermsID, setValueStaffSalvalueSAPPaymentTermsID] =
    useState(
      editForm
        ? listTermsOfPayment?.find(
            item => item?.ID === dataDetail?.SAPPaymentTermsID,
          )
        : listTermsOfPayment?.[0],
    );
  const [valueBusinessRegistrationType, setValueBusinessRegistrationType] =
    useState(
      listBusinessRegistrationType?.find(
        item => item?.ID === dataDetail?.BusinessRegistrationTypeID,
      ),
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
    listPartnerType?.find(item => item?.ID === dataDetail?.PartnerTypeID),
  );
  const [valuePartnerGroup, setValuePartnerGroup] = useState(
    listPartnerGroup?.find(item => item?.ID === dataDetail?.PartnerGroupID),
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
    editForm ? dataDetail?.CurrentDocs : [],
  );
  // const listCustomerOfficalSupport = listCustomerByUserID?.filter(
  //   item => item.ApprovalStatusCode === '_0',
  // );
  const listCustomerOfficalSupport = listCustomers?.filter(
    // item => item.ApprovalStatusCode === '_0',
    item =>
      (item?.CustomerTypeID === 9704 ||
        item?.CustomerTypeID === '9704' ||
        item?.CustomerTypeCode === 'CT') &&
      item?.IsClosed === 0 &&
      item?.IsCompleted === 1,
  );
  const [valueListCustomerOfficalSupport, setValueListCustomerOfficalSupport] =
    useState(
      listCustomerOfficalSupport?.find(
        cus => cus.ID === dataDetail?.CustomerSupportID,
      ),
    );
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
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    if (!listNation || listNation.length === 0) {
      dispatch(fetchListNation());
    }
  }, [dispatch, listNation]);
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
  const listUsersSupport = useMemo(() => {
    if (!valueStaffSales) return [];
    return listUser?.filter(
      user => Number(user.DepartmentID) === valueStaffSales?.DepartmentID,
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

  const [showInformation, setShowInformation] = useState({
    general: true,
    management: true,
    contact: true,
    delivery: true,
    customer: true,
    bank: true,
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

  const toggleCategorySelection = id => {
    setSelectedCustomerClass(prevSelected => {
      const isSelected = prevSelected.some(item => item.ID === id);

      if (isSelected) {
        return prevSelected.filter(item => item.ID !== id);
      } else {
        const selectedItem = dataCheckboxCustomer.find(item => item.ID === id);
        return [...prevSelected, selectedItem];
      }
    });
  };

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
    Fax: editForm ? dataDetail?.Fax : '',
    WebSite: editForm ? dataDetail?.WebSite : '',
    Phone: editForm ? dataDetail?.Phone : '',
    NationID: editForm ? valueNation : 0,
    ProvinceID: editForm ? valueProvinceCity : 0,
    DistrictID: editForm ? dataDetail?.DistrictID : 0,
    Ward: editForm ? valueWardCommune : 0,
    Address: editForm ? dataDetail?.Address : '',
    Lat: '0',
    Long: '0',
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
    BusinessRegistrationTypeID: editForm ? valueBusinessRegistrationType : '',
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
    RegionID: editForm ? valueRegion : '',
    HotlineNumber: editForm
      ? dataDetail?.HotlineNumber
      : valueStaffSales?.DepartmentPhone,
    SalesManagerID: editForm ? valueStaffSales?.DepartmentManagerID : '',
    AreaSupervisorID: editForm ? valueRouteSaleNameRegion : '',
    SalesStaffID: editForm ? valueRouteSalesStaff : '',
    AreaRouteDetailsID: editForm ? valueDetailRegionRoute : '',
    BusinessSector: [],
    StaffAndInfrastructure: 1
      ? dataDetail?.CusEvaluation_Cus?.[0]?.StaffAndInfrastructure
      : '',
    MainBusinessSector: 1
      ? dataDetail?.CusEvaluation_Cus?.[0]?.MainBusinessSector
      : '',
    OverallCustomerEvaluation: 1
      ? dataDetail?.CusEvaluation_Cus?.[0]?.OverallCustomerEvaluation
      : '',
    //Thông tin giao hàng ------------
    Shipping: [],
    //Thông tin giấy tờ hồ sơ khách hàng --------------
    Documents: [],
    //Thông tin liên hệ ------------
    Contacts: [],
    //Thông tin ngân hàng ------------
    Banks: [],
  };
  const {values, errors, touched, handleChange, handleBlur, setFieldValue} =
    useFormik({
      initialValues,
      enableReinitialize: true,
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
        if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
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
  // console.log('valueListPhoneNumber', valueListPhoneNumber);
  useEffect(() => {
    if (editForm || !valueCustomerInherit) return;

    getDetailCustomerInherit();
  }, [valueCustomerInherit, editForm]);

  useEffect(() => {
    if (!sourceData) return;

    setValueCustomerType(
      listCustomerType?.find(item => item?.ID === sourceData?.CustomerTypeID),
    );
    setValuePartnerType(
      listPartnerType?.find(item => item?.ID === sourceData?.PartnerTypeID),
    );
    setValuePartnerGroup(
      listPartnerGroup?.find(item => item?.ID === sourceData?.PartnerGroupID),
    );
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
    setValueBusinessRegistrationType(
      listBusinessRegistrationType?.find(
        item => item?.ID === sourceData?.BusinessRegistrationTypeID,
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

    setFieldValue('Name', sourceData?.Name || '');
    setFieldValue('ShortName', sourceData?.ShortName || '');
    setFieldValue('TaxCode', sourceData?.TaxCode || '');
    setFieldValue('Email', sourceData?.Email || '');
    setFieldValue('Fax', sourceData?.Fax || '');
    setFieldValue('WebSite', sourceData?.WebSite || '');
    setFieldValue('Address', sourceData?.Address || '');
    setFieldValue('PostalCode', sourceData?.PostalCode || '');
    setFieldValue('LegalRepresentative', sourceData?.LegalRepresentative || '');
    setFieldValue('IDCardNumber', sourceData?.IDCardNumber || '');
    setFieldValue('Note', sourceData?.Note || '');
    setFieldValue('BusinessScale', sourceData?.BusinessScale || '');
    setFieldValue('RegisteredCapital', sourceData?.RegisteredCapital || '');

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
      profiles: sourceData?.CurrentDocs || [],
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
      if (!selectedNation && !valueNation) return;
      setValueNation(selectedNation);

      const provinces = await dispatch(
        fetchListProvinceCity({ParentId: selectedNation.ID}),
      );
      const selectedProvince = provinces?.find(
        p => p.ID === sourceData.ProvinceID,
      );
      if (!selectedProvince && !valueProvinceCity) return;
      setValueProvinceCity(selectedProvince);

      const wards = await dispatch(
        fetchListWardCommune({ParentId: selectedProvince.ID}),
      );
      const selectedWard = wards?.find(
        w => w.ID === sourceData?.DistrictID,
        // sourceData.Ward  // sửa lại chỗ này ngày 6/11
      );
      if (selectedWard && !valueWardCommune) {
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
    if (valueProvinceCity) {
      dispatch(fetchListWardCommune({ParentId: valueProvinceCity.ID}));
      setValueWardCommune(null);
    }
  }, [valueProvinceCity]);

  useEffect(() => {
    if (!valueStaffSales || !sourceData?.SupportAgentID || !listUser?.length)
      return;

    const supportList = listUser?.filter(
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

  const fields = mapToFields(selectedCustomerClass);

  const handleFormCustomer = _.debounce(
    async () => {
      const errors = [];

      if (!valueCustomerType?.ID) {
        errors.push(languageKey('_please_select_customer_type'));
      }

      if (valueCustomerType?.Code === 'TN' && !valueSalesChannel) {
        errors.push(languageKey('Please select sales channel'));
      }

      if (valueCustomerType?.Code !== 'TN') {
        if (!valuePartnerType?.ID) {
          errors.push(languageKey('_please_select_type_partner'));
        }

        if (!valuePartnerGroup?.ID) {
          errors.push(languageKey('_please_select_partner_group'));
        }
      }

      if (!values?.Name) {
        errors.push(languageKey('_please_enter_customer_name'));
      }

      if (valueCustomerType?.Code !== 'TN') {
        if (!valueCustomerGroup?.ID) {
          errors.push(languageKey('_please_select_customer_group'));
        }

        if (!valueHonorifics?.ID) {
          errors.push(languageKey('_please_select_a_title'));
        }
      }

      if (!values?.TaxCode) {
        errors.push(languageKey('_please_enter_tax_code'));
      }

      if (!valueListPhoneNumber?.length) {
        errors.push(languageKey('_please_enter_phone_number'));
      }

      if (!valueNation?.ID) {
        errors.push(languageKey('_please_select_country'));
      }

      if (valueNation?.ID === 1) {
        if (!valueProvinceCity?.ID) {
          errors.push(languageKey('_please_select_province_city'));
        }
        if (!valueWardCommune?.ID) {
          errors.push(languageKey('_please_select_ward_commune'));
        }
      }

      if (!values?.Address) {
        errors.push(languageKey('_please_enter_address'));
      }

      if (valueCustomerType?.Code !== 'TN' && !valueStaffSales?.UserID) {
        errors.push(languageKey('_please_select_nvkd'));
      }

      if (errors.length > 0) {
        Alert.alert(errors[0]);
        return;
      }

      const linkArray =
        typeof linkImage === 'string'
          ? linkImage?.split(';')
          : Array.isArray(linkImage)
          ? linkImage
          : [];
      const linkString = linkArray.join(';');

      const body = {
        ID: editForm ? dataDetail?.ID : 0,
        FactorID: 'Customers',
        EntryID: 'CustomerProfiles',
        SAPID: '',
        LemonID: '',
        ODate: new Date(),
        //Thông tin chung ----------------------------------------
        CustomerTypeID: valueCustomerType?.ID || 0,
        ReferenceID: String(valueCustomerInherit?.CustomerID_ || 0),
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
        DistrictID: 0,
        Ward: valueWardCommune?.ID || 0,
        Address: values?.Address || '',
        Lat: valueLocation?.substring(valueLocation?.indexOf(',') + 1)?.trim(),
        Long: valueLocation?.substring(0, valueLocation?.indexOf(','))?.trim(),
        PostalCode: values?.PostalCode || '',
        ReceivingChannelID: valueRecordingChannel?.ID || 0,
        CustomerGroupID: valueCustomerGroup?.ID || 0,
        IsCustomer: fields.IsCustomer || 0,
        IsCustomerVIP: fields.IsCustomerVIP || 0,
        IsSupplier: fields.IsSupplier || 0,
        IsCompleteDocuments: fields.IsCompleteDocuments || 0,
        BusinessType: valueBusinessType?.ID || 0,
        BusinessDomainID: valueBusinessDomain?.ID || 0,
        BusinessScale: values?.BusinessScale || '',
        RegisteredCapital: values?.RegisteredCapital || 0,
        LegalRepresentative: values?.LegalRepresentative || '',
        IDCardNumber: values?.IDCardNumber || '',
        BusinessRegistrationTypeID: valueBusinessRegistrationType?.ID || 0,
        Note: values?.Note || '',
        SalesChannelID: String(valueSalesChannel?.ID) || '',
        LinkEvaluation: linkString || '',
        //Thông tin quản lý ----------------------------------------
        CustomerRepresentativeID: Number(valueStaffSales?.UserID) || 0,
        SupportAgentID: Number(valueStaffSupport?.UserID) || 0,
        SalesTeamID: valueSalesTeam?.ID || 0,
        SalesSubTeamID: valueSubTeam?.ID || 0,
        SalesOrganizationID: valueStaffSales?.DepartmentID || 0,
        DistributionChannelID: 0,
        RegionID: valueRegion?.ID || '',
        HotlineNumber: values?.HotlineNumber || '',
        SalesManagerID: valueStaffSales?.DepartmentManagerID || '',
        SalesRouteID: valueLineStructure?.ID || '',
        AreaSupervisorID: valueRouteSaleNameRegion?.ID || '',
        SalesStaffID: valueRouteSalesStaff?.ID || '',
        AreaRouteDetailsID: valueDetailRegionRoute?.ID || '',
        BusinessSector: valueCustomerProductInfor || [],
        StaffAndInfrastructure: values?.StaffAndInfrastructure || '',
        MainBusinessSector: values?.MainBusinessSector || '',
        OverallCustomerEvaluation: values?.OverallCustomerEvaluation || '',
        //Thông tin giao hàng ------------
        Shipping: valueListShipping || [],
        //Thông tin giấy tờ hồ sơ khách hàng --------------
        Documents: valueListCustomerProfiles || [],
        //Thông tin liên hệ ------------
        Contacts: valueListContact || [],
        //Thông tin ngân hàng ------------
        Banks: valueListBank || [],
        NameExtention1: '',
        NameExtention2: '',
        NameExtention3: '',
        NameExtention4: '',
        NameExtention5: '',
        NameExtention6: '',
        NameExtention7: '',
        NameExtention8: '',
        NameExtention9: '',
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
        SearchName: '',
        InvoiceEmail: '',
        PartnerStartDate: '2025-02-12T03:53:08.735Z',
        SalesInvoiceEmail: '',
        AccountingInvoiceEmail: '',
        Quantity: '',
        Revenue: 0,
        EmployeeCount: 0,
        BusinessProductsID: '',
        IndustryMinQuantity: '',
        IndustryMaxQuantity: '',
        Brand: '',
        OfficeArea: '',
        FactoryArea: '',
        SignatureLink: '',
        CustomerLink: '',
        SupplierName: '',
        ProductID: 0,
        ProductTargetID: 0,
        SupplierPurchaseQuantity: '',
        AverageSales: 0,
        SupplierPaymentTermsID: 0,
        ShippingMethodID: 0,
        SupplierCreditLimit: 0,
        PaymentMethodID: 0,
        YearID: 0,
        AverageMonthlyQuantity: 0,
        AverageMonthlyRevenue: 0,
        UnitID: 0,
        PercentageOfCustomerSales: 0,
        FactoryAddress: '',
        IsActive: 1,
        CurrencyTypeID: 0,
        WarehouseCriteriaID: 0,
        PricingCriteriaID: 0,
        ProcessDefinitionID: 0,
        CustomerProductInfo: '',
        IsViewLimit: 0,
        IsViewInventory: 0,
        LimitPercentage: 0,
        InventoryPercentage: 0,
      };
      try {
        const result = editForm
          ? await ApiCustomerProfiles_Edit(body)
          : await ApiCustomerProfiles_Add(body);
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
        IsLock: 0,
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
          const {data} = await ApiCustomerProfiles_GetById({
            ID: dataDetail?.ID,
          });
          if (
            data.ErrorCode === '0' &&
            data.StatusCode === 200 &&
            data.Result
          ) {
            navigation.navigate(routes.ViewCustomerProfileScreen, {
                        editForm: true,
                        dataDetail: data.Result,
                      });
          } else {
          }
          // navigation.navigate(routes.CustomerProfileScreen);
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
      dispatch(fetchListSalesSubTeam(body));
    }
  }, [valueSalesTeam, dispatch]);

  useEffect(() => {
    if (valueSubTeam) {
      const body = {
        CategoryType: 'Area',
        ParentID: valueSubTeam?.ID,
      };
      dispatch(fetchListSalesVBH(body));
    }
  }, [valueSubTeam, dispatch]);

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
          setValueLocation(`${location?.longitude}, ${location?.latitude}`);
        }
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    dispatch(clearDetailUserID());
  }, []);

  useEffect(() => {
    if (!valueStaffSales) return;

    setFieldValue('Name', values?.Name);
    setFieldValue('ShortName', values?.ShortName);
    setFieldValue('TaxCode', values?.TaxCode);
    setFieldValue('Email', values?.Email);
    setFieldValue('Fax', values?.Fax);
    setFieldValue('WebSite', values?.WebSite);
    setFieldValue('Address', values?.Address);
    setFieldValue('BusinessScale', values?.BusinessScale);
    setFieldValue('PostalCode', values?.PostalCode);
    setFieldValue('RegisteredCapital', values?.RegisteredCapital);
    setFieldValue('LegalRepresentative', values?.LegalRepresentative);
    setFieldValue('IDCardNumber', values?.IDCardNumber);
    setFieldValue('Note', values?.Note);

    const bodyUser = {ID: valueStaffSales?.UserID};
    dispatch(fetchDetailUserID(bodyUser));
  }, [valueStaffSales]);

  useEffect(() => {
    if (!detailUserID || !valueStaffSales) return;

    const parseMultipleValues = (ids, names) => {
      const idArray = String(ids)
        ?.split(',')
        ?.map(id => id.trim())
        ?.filter(Boolean);
      const nameArray = String(names)
        ?.split(';')
        ?.map(name => name.trim())
        ?.filter(Boolean);
      return idArray.map((id, index) => ({
        ID: id,
        Name: nameArray[index] || `Route ${id}`,
      }));
    };
    // console.log('detailUserID',detailUserID)
    const region = parseMultipleValues(
      detailUserID.Region || '',
      detailUserID.RegionName || '',
    );
    // console.log('region',region)
    const selectedIDs = editForm
      ? detailUserID?.SalesChannelID?.split(',')?.map(id => Number(id))
      : 0;
    const selectedItems =
      listSalesChannel?.filter(item => selectedIDs?.includes(item.ID)) || [];
    const parseRouteSalesArray = routeArrayString => {
      if (!routeArrayString) return [];

      try {
        // Trường hợp dữ liệu là JSON string hợp lệ
        const parsed = JSON.parse(routeArrayString);

        if (Array.isArray(parsed)) {
          return parsed.map(item => {
            if (item.RouteSales === '%' || item.RouteSales === '% ') {
              return {
                ID: '%',
                Name: 'Tất cả',
                ParentID: item.RouteParentID ?? 0,
              };
            }

            return {
              ID: item.RouteSales,
              Name: item.RouteSaleName?.trim() || `Route ${item.RouteSales}`,
              ParentID: item.RouteParentID ?? 0,
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

    const dataValuesStaffSale = {
      Region: region,
      SalesChannelRoute: selectedItems,
      SalesRoute1: salesRoute1,
      SalesRoute2: salesRoute2,
      SalesRoute3: salesRoute3,
      SalesRoute4: salesRoute4,
    };
    setDataValuesSaleStaff(dataValuesStaffSale);
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

    setFieldValue('HotlineNumber', detailUserID?.DepartmentPhone);
  }, [detailUserID, valueStaffSales]);

  const handleFormEdit = () => {
    navigation.navigate(routes.FormCustomerProfileScreen, {
      editForm: true,
      dataDetail: dataDetail,
    });
  };
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
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <SafeAreaView style={styleFormCustomer.container}>
        <HeaderBack
          title={'Thông tin khách hàng'}
          onPress={() => navigation.goBack()}
          btn={sourceData?.IsLock === 1 ? false : true}
          onPressBtn={handleFormEdit}
          iconBtn={edit}
        />
        <ScrollView
          style={styleFormCustomer.scrollView}
          showsVerticalScrollIndicator={false}>
          <View style={styleFormCustomer.containerHeader1}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styleFormCustomer.header1, {marginTop: scale(16)}]}>
                {languageKey('_information_general')}
              </Text>
              {dataDetail?.ApprovalDisplayStatus ? (
                <View
                  style={[
                    styles.bodyStatus,
                    {marginTop: scale(16)},
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
              style={[styleFormCustomer.btnShowInfor, {marginTop: scale(12)}]}
              onPress={() => toggleInformation('general')}>
              <SvgXml
                xml={showInformation.general ? arrow_down_big : arrow_next_gray}
              />
            </Button>
          </View>
          {showInformation.general && (
            <View style={styleFormCustomer.cardView}>
              <View style={styleFormCustomer.mrh8}></View>
              <View style={styleFormCustomer.input}>
                <View style={styleFormCustomer.contentRowFlex}>
                  <Text style={styleFormCustomer.txtHeaderBody}>
                    {languageKey('_sales_channel')}
                  </Text>
                  <TextCopy style={styleFormCustomer.contentBodyDetail}>
                    {valueCustomerType?.Name}
                  </TextCopy>
                </View>
              </View>
              {valueCustomerType?.Code === 'TN' ? (
                <>
                  <View style={styleFormCustomer.input}>
                    <View style={styleFormCustomer.contentRowFlex}>
                      <Text style={styleFormCustomer.txtHeaderBody}>
                        {languageKey('_sales_channel')}
                      </Text>
                      <TextCopy style={styleFormCustomer.contentBodyDetail}>
                        {valueSalesChannel?.Name}
                      </TextCopy>
                    </View>
                  </View>
                  <View style={styleFormCustomer.input}>
                    <View style={styleFormCustomer.contentRowFlex}>
                      <Text style={styleFormCustomer.txtHeaderBody}>
                        {languageKey('_customer_name')}
                      </Text>
                      <TextCopy style={styleFormCustomer.contentBodyDetail}>
                        {values?.Name}
                      </TextCopy>
                    </View>
                  </View>
                  <View style={styleFormCustomer.input}>
                    <TouchableOpacity
                      // onPress={() => {
                      //   if (values?.TaxCode) {
                      //     const url = `https://google.com/search?q=${values?.TaxCode}`;
                      //     Linking.openURL(url);
                      //   }
                      // }}
                      style={styleFormCustomer.contentRowFlex}>
                      <Text style={styleFormCustomer.txtHeaderBody}>
                        {languageKey('_tax_code_cccd')}
                      </Text>
                      <Text style={styleFormCustomer.txtHeaderBody}>
                        {values?.TaxCode}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <View style={styleFormCustomer.input}>
                    <View
                      // onPress={() => {
                      //   if (values?.TaxCode) {
                      //     const url = `https://google.com/search?q=${values?.TaxCode}`;
                      //     Linking.openURL(url);
                      //   }
                      // }}
                      style={styleFormCustomer.contentRowFlex}>
                      <Text style={styleFormCustomer.txtHeaderBody}>
                        {languageKey('_tax_code_cccd')}
                      </Text>
                      <TextCopy
                        style={[
                          styleFormCustomer.txtHeaderBody,
                          {maxWidth: '60%'},
                        ]}>
                        {values?.TaxCode}
                      </TextCopy>
                    </View>
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(languageKey('_customer_name') + values?.Name)?.length >
                    35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_customer_name')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {values?.Name}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_customer_name')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {values?.Name}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey('_business_partner_type') +
                      valuePartnerType?.Name
                    )?.length > 33 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_business_partner_type')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {valuePartnerType?.Name}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_business_partner_type')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {valuePartnerType?.Name}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey('_business_partner_group') +
                      valuePartnerGroup?.Name
                    )?.length > 39 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_business_partner_group')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {valuePartnerGroup?.Name}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_business_partner_group')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {valuePartnerGroup?.Name}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                </>
              )}
              {valueCustomerType?.Code === 'HT' && (
                <View style={styleFormCustomer.input}>
                  {(
                    languageKey('_mainstream_customer') +
                    valueListCustomerOfficalSupport?.Name
                  )?.length > 35 ? (
                    <View style={styleFormCustomer.contentCardRow}>
                      <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                        {languageKey('_mainstream_customer')}
                      </Text>
                      <TextCopy style={styleFormCustomer.contentBodyDetailLong}>
                        {valueListCustomerOfficalSupport?.Name}
                      </TextCopy>
                    </View>
                  ) : (
                    <View style={styleFormCustomer.contentRowFlex}>
                      <Text style={styleFormCustomer.txtHeaderBody}>
                        {languageKey('_mainstream_customer')}
                      </Text>
                      <TextCopy style={styleFormCustomer.contentBodyDetail}>
                        {valueListCustomerOfficalSupport?.Name}
                      </TextCopy>
                    </View>
                  )}
                </View>
              )}
              {valueCustomerType?.Code === 'HT' && (
                <View style={styleFormCustomer.input}>
                  {(languageKey(' _business_support') + dataDetail?.Extention31)
                    ?.length > 35 ? (
                    // Hiển thị dọc khi text dài
                    <View style={styleFormCustomer.contentCardRow}>
                      <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                        {languageKey(' _business_support')}
                      </Text>
                      <TextCopy style={styleFormCustomer.contentBodyDetailLong}>
                        {dataDetail?.Extention31 === '1' ? 'Có' : 'Không'}
                      </TextCopy>
                    </View>
                  ) : (
                    <View style={styleFormCustomer.contentRowFlex}>
                      <Text style={styleFormCustomer.txtHeaderBody}>
                        {languageKey(' _business_support')}
                      </Text>
                      <TextCopy style={styleFormCustomer.contentBodyDetail}>
                        {dataDetail?.Extention31 === '1' ? 'Có' : 'Không'}
                      </TextCopy>
                    </View>
                  )}
                </View>
              )}
              {valueCustomerType?.Code === 'TN' ? null : (
                <>
                  <View style={styleFormCustomer.input}>
                    {(languageKey('_title') + valueHonorifics?.Name)?.length >
                    35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_title')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {valueHonorifics?.Name}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_title')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {valueHonorifics?.Name}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(languageKey('_customer_group') + valueCustomerGroup?.Name)
                      ?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_customer_group')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {valueCustomerGroup?.Name || ''}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_customer_group')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {valueCustomerGroup?.Name || ''}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(languageKey('_abbreviated_name') + values?.ShortName)
                      ?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_abbreviated_name')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {values?.ShortName}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_abbreviated_name')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {values?.ShortName}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                </>
              )}
              <View style={styleFormCustomer.input}>
                <TouchableOpacity
                  onPress={() => {
                    if (valueListPhoneNumber?.length > 0) {
                      setListPhones(valueListPhoneNumber);
                      setShowPhoneModal(true);
                    }
                  }}>
                  {(languageKey('_phone') + valueListPhoneNumber)?.length >
                  35 ? (
                    <View style={styleFormCustomer.contentCardRow}>
                      <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                        {languageKey('_phone')}
                      </Text>
                      <TextCopy style={styleFormCustomer.contentBodyDetailLong}>
                        {valueListPhoneNumber.join(', ')}
                      </TextCopy>
                    </View>
                  ) : (
                    <View style={styleFormCustomer.contentRowFlex}>
                      <Text style={styleFormCustomer.txtHeaderBody}>
                        {languageKey('_phone')}
                      </Text>
                      <TextCopy style={styleFormCustomer.contentBodyDetail}>
                        {valueListPhoneNumber.join(', ')}
                      </TextCopy>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {valueCustomerType?.Code === 'TN' ? null : (
                <>
                  <View style={styleFormCustomer.input}>
                    {(languageKey('_website_customer') + values?.WebSite)
                      ?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_website_customer')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {values?.WebSite}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_website_customer')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {values?.WebSite}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(languageKey('_fax_number') + values?.Fax)?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_fax_number')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {values?.Fax}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_fax_number')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {values?.Fax}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {('Email' + values?.Email)?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {'Email KH'}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {values?.Email}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {'Email KH'}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {values?.Email}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey('_payment_terms') +
                      valueSAPPaymentTermsID?.Name
                    )?.length > 30 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_payment_terms')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {valueSAPPaymentTermsID?.Name}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_payment_terms')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {valueSAPPaymentTermsID?.Name}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                </>
              )}
              {valueCustomerType?.Code === 'TN' ? null : (
                <View style={styleFormCustomer.input}>
                  {'Thông tin khác'?.length > 1 ? (
                    // Hiển thị dọc khi text dài
                    <View style={styleFormCustomer.contentCardRow}>
                      <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                        {'Thông tin khác'}
                      </Text>
                      <TextCopy style={styleFormCustomer.contentBodyDetailLong}>
                        {selectedCustomerClass && selectedCustomerClass.length
                          ? selectedCustomerClass
                              ?.map(sc => sc?.Name)
                              .join(', ')
                          : ''}
                      </TextCopy>
                    </View>
                  ) : (
                    <View style={styleFormCustomer.contentRowFlex}>
                      <Text style={styleFormCustomer.txtHeaderBody}>
                        {'Thông tin khác'}
                      </Text>
                      <TextCopy style={styleFormCustomer.contentBodyDetail}>
                        {selectedCustomerClass && selectedCustomerClass.length
                          ? selectedCustomerClass
                              ?.map(sc => sc?.Name)
                              .join(', ')
                          : ''}
                      </TextCopy>
                    </View>
                  )}
                </View>
              )}
              <View style={styleFormCustomer.input}>
                {(languageKey('_nation') + valueNation?.RegionsName)?.length >
                35 ? (
                  // Hiển thị dọc khi text dài
                  <View style={styleFormCustomer.contentCardRow}>
                    <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                      {languageKey('_nation')}
                    </Text>
                    <TextCopy style={styleFormCustomer.contentBodyDetailLong}>
                      {valueNation?.RegionsName}
                    </TextCopy>
                  </View>
                ) : (
                  <View style={styleFormCustomer.contentRowFlex}>
                    <Text style={styleFormCustomer.txtHeaderBody}>
                      {languageKey('_nation')}
                    </Text>
                    <TextCopy style={styleFormCustomer.contentBodyDetail}>
                      {valueNation?.RegionsName}
                    </TextCopy>
                  </View>
                )}
              </View>
              {valueNation?.ID != 1 ? null : (
                <>
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey('_province_city') +
                      valueProvinceCity?.RegionsName
                    )?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_province_city')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {valueProvinceCity?.RegionsName}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_province_city')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {valueProvinceCity?.RegionsName}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey('_ward_commune') +
                      valueWardCommune?.RegionsName
                    )?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_ward_commune')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {valueWardCommune?.RegionsName} (
                          {valueWardCommune?.Extention3 === '1'
                            ? 'Nội thành'
                            : 'Ngoại thành'}
                          )
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_ward_commune')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {valueWardCommune?.RegionsName} (
                          {valueWardCommune?.Extention3 === '1'
                            ? 'Nội thành'
                            : 'Ngoại thành'}
                          )
                        </TextCopy>
                      </View>
                    )}
                  </View>
                </>
              )}
              <View style={styleFormCustomer.input}>
                {(languageKey('_address') + values?.Address)?.length > 35 ? (
                  // Hiển thị dọc khi text dài
                  <View style={styleFormCustomer.contentCardRow}>
                    <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                      {languageKey('_address')}
                    </Text>
                    <TextCopy style={styleFormCustomer.contentBodyDetailLong}>
                      {values?.Address}
                    </TextCopy>
                  </View>
                ) : (
                  <View style={styleFormCustomer.contentRowFlex}>
                    <Text style={styleFormCustomer.txtHeaderBody}>
                      {languageKey('_address')}
                    </Text>
                    <TextCopy style={styleFormCustomer.contentBodyDetail}>
                      {values?.Address}
                    </TextCopy>
                  </View>
                )}
              </View>
              <View style={styleFormCustomer.input}>
                {(languageKey('_region_SAP') + dataDetail?.Extention48)
                  ?.length > 35 ? (
                  <View style={styleFormCustomer.contentCardRow}>
                    <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                      {languageKey('_region_SAP')}
                    </Text>
                    <TextCopy style={styleFormCustomer.contentBodyDetailLong}>
                      {listVungSAP
                        ?.find(
                          item =>
                            item?.ID?.toString() ===
                            dataDetail?.Extention48?.toString(),
                        )
                        ?.Name?.toString() || ''}
                    </TextCopy>
                  </View>
                ) : (
                  <View style={styleFormCustomer.contentRowFlex}>
                    <Text style={styleFormCustomer.txtHeaderBody}>
                      {languageKey('_region_SAP')}
                    </Text>
                    <TextCopy style={styleFormCustomer.contentBodyDetail}>
                      {listVungSAP
                        ?.find(
                          item =>
                            item?.ID?.toString() ===
                            dataDetail?.Extention48?.toString(),
                        )
                        ?.Name?.toString() || ''}
                    </TextCopy>
                  </View>
                )}
              </View>
              <View style={styleFormCustomer.input}>
                {(languageKey('_gps_coordinates') + valueLocation)?.length >
                35 ? (
                  // Hiển thị dọc khi text dài
                  <View style={styleFormCustomer.contentCardRow}>
                    <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                      {languageKey('_gps_coordinates')}
                    </Text>
                    <TextCopy style={styleFormCustomer.contentBodyDetailLong}>
                      {valueLocation}
                    </TextCopy>
                  </View>
                ) : (
                  <View style={styleFormCustomer.contentRowFlex}>
                    <Text style={styleFormCustomer.txtHeaderBody}>
                      {languageKey('_gps_coordinates')}
                    </Text>
                    <TextCopy style={styleFormCustomer.contentBodyDetail}>
                      {valueLocation}
                    </TextCopy>
                  </View>
                )}
              </View>
              {valueCustomerType?.Code === 'TN' ? (
                <>
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey('_main_business_lines') +
                      values?.MainBusinessSector
                    )?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_main_business_lines')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {values?.MainBusinessSector}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_main_business_lines')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {values?.MainBusinessSector}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey('_general_customer_reiviews') +
                      values?.OverallCustomerEvaluation
                    )?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_general_customer_reiviews')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {values?.OverallCustomerEvaluation}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_general_customer_reiviews')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {values?.OverallCustomerEvaluation}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey(' _infrastructure') +
                      values?.StaffAndInfrastructure
                    )?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey(' _infrastructure')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {values?.StaffAndInfrastructure}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey(' _infrastructure')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {values?.StaffAndInfrastructure}
                        </TextCopy>
                      </View>
                    )}
                  </View>
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
                      disable={true}
                    />
                  </View>
                </>
              ) : (
                <>
                  <View style={styleFormCustomer.input}>
                    {(languageKey('_postal_code') + dataDetail?.PostalCode)
                      ?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_postal_code')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {dataDetail?.PostalCode?.toString() || ''}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_postal_code')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {dataDetail?.PostalCode?.toString() || ''}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={{width: '100%', marginTop: 8}}>
                    <View style={styleFormCustomer.input}>
                      {(
                        languageKey('_date_of_tax_bussiness_license') +
                        moment(dataDetail?.TaxIssuedDate).format('DD/MM/YYYY')
                      )?.length > 36 ? (
                        // Hiển thị dọc khi text dài
                        <View style={styleFormCustomer.contentCardRow}>
                          <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                            {languageKey('_date_of_tax_bussiness_license')}
                          </Text>
                          <TextCopy
                            style={styleFormCustomer.contentBodyDetailLong}>
                            {moment(dataDetail?.TaxIssuedDate).format(
                              'DD/MM/YYYY',
                            )}
                          </TextCopy>
                        </View>
                      ) : (
                        <View style={styleFormCustomer.contentRowFlex}>
                          <Text style={styleFormCustomer.txtHeaderBody}>
                            {languageKey('_date_of_tax_bussiness_license')}
                          </Text>
                          <TextCopy style={styleFormCustomer.contentBodyDetail}>
                            {moment(dataDetail?.TaxIssuedDate).format(
                              'DD/MM/YYYY',
                            )}
                          </TextCopy>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={{width: '100%', marginTop: 8}}>
                    <View style={styleFormCustomer.input}>
                      {(
                        languageKey('_establishment_time') +
                        moment(dataDetail?.FoundingDate).format('DD/MM/YYYY')
                      )?.length > 35 ? (
                        // Hiển thị dọc khi text dài
                        <View style={styleFormCustomer.contentCardRow}>
                          <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                            {languageKey('_establishment_time')}
                          </Text>
                          <TextCopy
                            style={styleFormCustomer.contentBodyDetailLong}>
                            {moment(dataDetail?.FoundingDate).format(
                              'DD/MM/YYYY',
                            )}
                          </TextCopy>
                        </View>
                      ) : (
                        <View style={styleFormCustomer.contentRowFlex}>
                          <Text style={styleFormCustomer.txtHeaderBody}>
                            {languageKey('_establishment_time')}
                          </Text>
                          <TextCopy style={styleFormCustomer.contentBodyDetail}>
                            {moment(dataDetail?.FoundingDate).format(
                              'DD/MM/YYYY',
                            )}
                          </TextCopy>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey('_year_started_KT') +
                      moment(dataDetail?.PartnerStartDate).format('YYYY')
                    )?.length > 36 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_year_started_KT')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {moment(dataDetail?.PartnerStartDate).format('YYYY')}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_year_started_KT')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {moment(dataDetail?.PartnerStartDate).format('YYYY')}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <Text style={styleFormCustomer?.txtHeaderCompany}>
                    {languageKey('_information_legal_reprepsentation')}
                  </Text>
                  {/* <View style={styleFormCustomer.input}>
                    <CardModalSelect
                      title={languageKey('_type_of_business')}
                      data={listBusinessType}
                      setValue={setValueBusinessType}
                      value={valueBusinessType?.Name}
                      bgColor={'#F9FAFB'}
                    />
                  </View> */}
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey('_type_of_business') + valueBusinessType?.Name
                    )?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_type_of_business')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {valueBusinessType?.Name}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_type_of_business')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {valueBusinessType?.Name}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey('_customer_business_segment') +
                      valueBusinessDomain?.Name
                    )?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_customer_business_segment')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {valueBusinessDomain?.Name ?? ''}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_customer_business_segment')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {valueBusinessDomain?.Name ?? ''}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey('_type_of_business_registration') +
                      dataDetail?.BusinessRegistrationTypeID
                    )?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_type_of_business_registration')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {dataDetail?.BusinessRegistrationTypeID?.toString() ??
                            ''}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_type_of_business_registration')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {dataDetail?.BusinessRegistrationTypeID?.toString() ??
                            ''}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(languageKey('_business_scale') + values?.BusinessScale)
                      ?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_business_scale')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {values?.BusinessScale ?? ''}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_business_scale')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {values?.BusinessScale ?? ''}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey('_charter_capital') +
                      String(values?.RegisteredCapital)
                    )?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_charter_capital')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {values?.RegisteredCapital?.toLocaleString('en') ??
                            ''}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_charter_capital')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {values?.RegisteredCapital?.toLocaleString('en') ??
                            ''}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey('_legal_representative') +
                      values?.LegalRepresentative
                    )?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_legal_representative')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {values?.LegalRepresentative}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_legal_representative')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {values?.LegalRepresentative}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(languageKey('_id_card_passport') + values?.IDCardNumber)
                      ?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_id_card_passport')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {values?.IDCardNumber ?? ''}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_id_card_passport')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {values?.IDCardNumber ?? ''}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                </>
              )}
            </View>
          )}

          <View style={styleFormCustomer.containerHeader1}>
            <Text style={styleFormCustomer.header1}>
              {languageKey('_management_information')}
            </Text>
            <Button
              style={[styleFormCustomer.btnShowInfor, {marginTop: scale(12)}]}
              onPress={() => toggleInformation('management')}>
              <SvgXml
                xml={
                  showInformation.management ? arrow_down_big : arrow_next_gray
                }
              />
            </Button>
          </View>
          {showInformation.management && (
            <View style={styleFormCustomer.cardView}>
              {valueCustomerType?.Code === 'TN' ? null : (
                <>
                  <Text bold style={styleFormCustomer?.txtHeaderCompany}>
                    {languageKey('_sales_route')}
                  </Text>
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey('_sales_staff_customer') +
                      dataDetail?.CustomerRepresentativeName
                    )?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_sales_staff_customer')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {dataDetail?.CustomerRepresentativeName ?? ''}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_sales_staff_customer')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {dataDetail?.CustomerRepresentativeName ?? ''}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey('_support_staff') +
                      dataDetail?.SupportAgentName
                    )?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_support_staff')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {dataDetail?.SupportAgentName || ''}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_support_staff')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {dataDetail?.SupportAgentName || ''}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(languageKey('_sales_channel') + valueSalesChannel?.Name)
                      ?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_sales_channel')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {valueSalesChannel?.Name ?? ''}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_sales_channel')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {valueSalesChannel?.Name ?? ''}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(languageKey('_main_business_team') + valueSalesTeam?.Name)
                      ?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_main_business_team')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {valueSalesTeam?.Name ?? ''}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_main_business_team')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {valueSalesTeam?.Name ?? ''}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey('_small_team_in_charge_for_business') +
                      valueSubTeam?.Name
                    )?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_small_team_in_charge_for_business')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {valueSubTeam?.Name ?? ''}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_small_team_in_charge_for_business')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {valueSubTeam?.Name ?? ''}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(languageKey('_sales_organization') + detailUserID
                      ? dataDetail?.SalesOrganizationName
                      : ''
                    )?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_sales_organization')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {dataDetail?.SalesOrganizationName
                            ? dataDetail?.SalesOrganizationName
                            : '' ?? ''}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_sales_organization')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {dataDetail?.SalesOrganizationName
                            ? dataDetail?.SalesOrganizationName
                            : '' ?? ''}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey('_line_structure') +
                      dataDetail?.SalesRouteName
                    )?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_line_structure')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {dataDetail?.SalesRouteName ?? ''}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_line_structure')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {dataDetail?.SalesRouteName ?? ''}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey('_regional_monitoring_route') +
                      dataDetail?.AreaSupervisorName
                    )?.length > 37 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_regional_monitoring_route')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {dataDetail?.AreaSupervisorName ?? ''}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_regional_monitoring_route')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {dataDetail?.AreaSupervisorName ?? ''}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey('_business_staff_route') +
                      dataDetail?.SalesStaffName
                    )?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_business_staff_route')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {dataDetail?.SalesStaffName ?? ''}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_business_staff_route')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {dataDetail?.SalesStaffName ?? ''}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  {/* <View style={styleFormCustomer.input}>
                  <CardModalSelect
                    title={languageKey('_details_of_the_route_area')}
                    data={dataValuesSaleStaff?.SalesRoute4}
                    setValue={setValueDetailRegionRoute}
                    value={valueDetailRegionRoute?.Name}
                    bgColor={'#FAFAFA'}
                    require={true}
                  />
                </View> */}
                  <View style={styleFormCustomer.input}>
                    {(
                      languageKey('_details_of_the_route_area') +
                      dataDetail?.AreaRouteDetailID
                    )?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_details_of_the_route_area')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {(dataDetail?.AreaRouteDetailsID === 0 && 'Tất cả') ||
                            ''}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_details_of_the_route_area')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {(dataDetail?.AreaRouteDetailsID === 0 && 'Tất cả') ||
                            ''}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(languageKey('_sales_area') + dataDetail?.RegionName)
                      ?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_sales_area')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {dataDetail?.RegionName ?? ''}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_sales_area')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {dataDetail?.RegionName ?? ''}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                  <View style={styleFormCustomer.input}>
                    {(languageKey('_hotline_number') + values?.HotlineNumber)
                      ?.length > 35 ? (
                      // Hiển thị dọc khi text dài
                      <View style={styleFormCustomer.contentCardRow}>
                        <Text style={styleFormCustomer.txtHeaderBodyViewCol}>
                          {languageKey('_hotline_number')}
                        </Text>
                        <TextCopy
                          style={styleFormCustomer.contentBodyDetailLong}>
                          {values?.HotlineNumber ?? ''}
                        </TextCopy>
                      </View>
                    ) : (
                      <View style={styleFormCustomer.contentRowFlex}>
                        <Text style={styleFormCustomer.txtHeaderBody}>
                          {languageKey('_hotline_number')}
                        </Text>
                        <TextCopy style={styleFormCustomer.contentBodyDetail}>
                          {values?.HotlineNumber ?? ''}
                        </TextCopy>
                      </View>
                    )}
                  </View>
                </>
              )}
              <CustomerProductInfo
                setData={setValueCustomerProductInfor}
                data={dataProductCustomer}
                disable={true}
                view={true}
              />
            </View>
          )}

          <View style={styleFormCustomer.containerHeader1}>
            <Text style={styleFormCustomer.header1}>
              {languageKey('_contact_info')}
            </Text>
            <Button
              style={[styleFormCustomer.btnShowInfor, {marginTop: scale(12)}]}
              onPress={() => toggleInformation('contact')}>
              <SvgXml
                xml={showInformation.contact ? arrow_down_big : arrow_next_gray}
              />
            </Button>
          </View>
          {showInformation.contact && (
            <View style={styleFormCustomer.cardFooter1}>
              <ModalContact
                setValueContact={setValueListContact}
                dataEdit={dataModalEdit?.contact}
                parentID={dataDetail?.ID}
                cmpnID={editForm ? dataDetail?.CmpnID : userInfo?.CmpnID}
                disable={true}
              />
            </View>
          )}
          {valueCustomerType?.Code === 'TN' ? null : (
            <View style={styleFormCustomer.containerHeader1}>
              <Text style={styleFormCustomer.header1}>
                {languageKey('_information_delivery')}
              </Text>
              <Button
                style={[styleFormCustomer.btnShowInfor, {marginTop: scale(12)}]}
                onPress={() => toggleInformation('delivery')}>
                <SvgXml
                  xml={
                    showInformation.delivery ? arrow_down_big : arrow_next_gray
                  }
                />
              </Button>
            </View>
          )}

          {showInformation.delivery && valueCustomerType?.Code !== 'TN' && (
            <View style={styleFormCustomer.cardFooter1}>
              <ModalDelivery
                setValueShipping={setValueListShipping}
                dataEdit={dataModalEdit?.shipping}
                parentID={dataDetail?.ID}
                cmpnID={editForm ? dataDetail?.CmpnID : userInfo?.CmpnID}
                disable={true}
              />
            </View>
          )}
          {valueCustomerType?.Code === 'TN' ? null : (
            <View style={styleFormCustomer.containerHeader1}>
              <Text style={styleFormCustomer.header1}>
                {languageKey('_bank_information')}
              </Text>
              <Button
                style={[styleFormCustomer.btnShowInfor, {marginTop: scale(12)}]}
                onPress={() => toggleInformation('bank')}>
                <SvgXml
                  xml={showInformation.bank ? arrow_down_big : arrow_next_gray}
                />
              </Button>
            </View>
          )}
          {showInformation.bank && valueCustomerType?.Code !== 'TN' && (
            <View style={styleFormCustomer.cardFooter1}>
              <ModalBank
                setValueBank={setValueListBank}
                dataEdit={dataModalEdit?.bank}
                parentID={dataDetail?.ID}
                cmpnID={editForm ? dataDetail?.CmpnID : userInfo?.CmpnID}
                disable={true}
              />
            </View>
          )}
          {valueCustomerType?.Code === 'TN' ? null : (
            <View style={styleFormCustomer.containerHeader1}>
              <Text style={styleFormCustomer.header1}>
                {languageKey('_customer_profile_doc')}
              </Text>
              <Button
                style={[styleFormCustomer.btnShowInfor, {marginTop: scale(12)}]}
                onPress={() => toggleInformation('customer')}>
                <SvgXml
                  xml={
                    showInformation.customer ? arrow_down_big : arrow_next_gray
                  }
                />
              </Button>
            </View>
          )}
          {showInformation.customer && valueCustomerType?.Code !== 'TN' && (
            <View style={styleFormCustomer.cardFooter1}>
              <ModalProfileCustomerFile
                setData={setValueListCustomerProfiles}
                dataEdit={editForm ? dataDetail?.CurrentDocs : []}
                parentID={dataDetail?.ID}
                dataex={listItemTypes}
                disable={true}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      {showPhoneModal && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={showPhoneModal}
          style={{margin: 0}}
          animationIn="slideInLeft"
          animationOut="slideOutLeft"
          onBackButtonPress={() => setShowPhoneModal(false)}
          onBackdropPress={() => setShowPhoneModal(false)}
          backdropTransitionOutTiming={0}
          hideModalContentWhileAnimating
          onRequestClose={() => setShowPhoneModal(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.4)',
              justifyContent: 'center',
              alignItems: 'center',
              bottom: 0,
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                width: '80%',
                padding: scale(16),
                borderRadius: scale(12),
              }}>
              <Text
                style={{
                  fontSize: fontSize.size16,
                  fontWeight: '600',
                  marginBottom: scale(12),
                  color: colors.black,
                }}>
                {languageKey('_choose_phone_number')}
              </Text>

              {listPhones.map((phone, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{
                    paddingVertical: scale(10),
                    borderBottomWidth: 1,
                    borderColor: '#eee',
                  }}
                  onPress={() => {
                    Linking.openURL(`tel:${phone}`);
                    setShowPhoneModal(false);
                  }}>
                  <Text
                    style={{
                      fontSize: fontSize.size14,
                      color: colors.blue,
                    }}>
                    {phone}
                  </Text>
                </TouchableOpacity>
              ))}

              <Button
                onPress={() => setShowPhoneModal(false)}
                style={{
                  marginTop: scale(16),
                  alignSelf: 'center',
                }}>
                <Text style={{color: colors.red}}>
                  {languageKey('_cancel')}
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      )}
      <LoadingModal visible={loading} />
      {dataDetail?.IsUnlock === 1 && (
        <Button
          onPress={() => handleConfirm()}
          style={styleFormCustomer.btnConfirmFULL}>
          <Text
            style={{
              fontSize: fontSize.size16,
              fontWeight: '600',
              marginBottom: scale(0),
              color: colors.red,
              lineHeight: scale(24),
            }}>
            {languageKey('_unlock')}
          </Text>
        </Button>
      )}
    </LinearGradient>
  );
};

export default ViewCustomerProfileScreen;
