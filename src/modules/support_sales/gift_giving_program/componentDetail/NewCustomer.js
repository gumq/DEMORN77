import React, {useEffect, useState} from 'react';
import {useFormik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import Geolocation from 'react-native-geolocation-service';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {View, Text, StyleSheet, Alert, Platform} from 'react-native';

import {colors, fontSize} from '@themes';
import {hScale, scale} from '@resolutions';
import {translateLang} from '@store/accLanguages/slide';
import {
  InputDefault,
  Button,
  NotifierAlert,
  CardModalProvince,
  InputLocation,
  InputPhoneNumber,
} from '@components';
import {ApiCustomerProfiles_Add} from '@api';
import {
  fetchListProvinceCity,
  fetchListWardCommune,
} from '@store/accCustomer_Profile/thunk';
import {fetchListCustomerByUserID} from '@store/accAuth/thunk';

const NewCustomer = ({closeModal}) => {
  const languageKey = useSelector(translateLang);
  const dispatch = useDispatch();
  const {listProvinceCity, listWardCommune} = useSelector(
    state => state.CustomerProfile,
  );
  const [valueListPhoneNumber, setValueListPhoneNumber] = useState([]);
  const [valueNation, setValueNation] = useState(null);
  const [valueProvinceCity, setValueProvinceCity] = useState(null);
  const [valueWardCommune, setValueWardCommune] = useState(null);
  const [valueLocation, setValueLocation] = useState('0,0');
  const {userInfo} = useSelector(state => state.Login);

  const initialValues = {
    Name: '',
    Address: '',
  };

  useEffect(() => {
    dispatch(fetchListProvinceCity({ParentId: 1}));
  }, [dispatch]);

  useEffect(() => {
    if (valueProvinceCity) {
      dispatch(fetchListWardCommune({ParentId: valueProvinceCity.ID}));
    }
  }, [valueProvinceCity, dispatch]);

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

  const {values, errors, touched, handleChange, handleBlur, setFieldValue} =
    useFormik({
      initialValues,
    });

  const handleFormCustomer = _.debounce(
    async () => {
      const errors = [];

      if (!values?.Name) {
        errors.push(languageKey('_please_enter_customer_name'));
      }

      if (!valueListPhoneNumber?.length) {
        errors.push(languageKey('_please_enter_phone_number'));
      }

      if (!valueWardCommune?.ID) {
        errors.push(languageKey('_please_select_ward_commune'));
      }

      if (errors.length > 0) {
        Alert.alert(errors[0]);
        return;
      }

      const bodyCustomer = {
        ID: 0,
        FactorID: 'Customers',
        EntryID: 'CustomerProfiles',
        SAPID: '',
        LemonID: '',
        ODate: new Date(),
        //Thông tin chung ----------------------------------------
        CustomerTypeID: 10133,
        CustomerSupportID: 0,
        PartnerTypeID: 0,
        PartnerGroupID: 0,
        Name: values?.Name || '',
        ShortName: '',
        CustomerClassificationID: 0,
        HonorificsID: 0,
        TaxCode: '',
        TaxIssuedDate: new Date(),
        FoundingDate: new Date(),
        Email: '',
        Fax: '',
        WebSite: '',
        Phone: valueListPhoneNumber.join(','),
        NationID: valueNation?.ID || 0,
        ProvinceID: valueProvinceCity?.ID || 0,
        DistrictID: 0,
        Ward: valueWardCommune?.ID || 0,
        Address: values?.Address,
        Lat: valueLocation?.substring(valueLocation?.indexOf(',') + 1)?.trim(),
        Long: valueLocation?.substring(0, valueLocation?.indexOf(','))?.trim(),
        PostalCode: '',
        ReceivingChannelID: 0,
        CustomerGroupID: 0,
        IsCustomer: 0,
        IsCustomerVIP: 0,
        IsSupplier: 0,
        IsCompleteDocuments: 0,
        BusinessType: 0,
        BusinessDomainID: 0,
        BusinessScale: '',
        RegisteredCapital: 0,
        LegalRepresentative: '',
        IDCardNumber: '',
        BusinessRegistrationTypeID: 0,
        Note: '',
        SalesChannelID: '',
        LinkEvaluation: '',
        //Thông tin quản lý ----------------------------------------
        CustomerRepresentativeID: userInfo?.UserID,
        SupportAgentID: 0,
        SalesTeamID: 0,
        SalesSubTeamID: 0,
        SalesOrganizationID: 0,
        DistributionChannelID: 0,
        RegionID: '',
        HotlineNumber: '',
        SalesManagerID: '',
        AreaSupervisorID: '',
        SalesStaffID: '',
        AreaRouteDetailsID: '',
        BusinessSector: [],
        StaffAndInfrastructure: '',
        MainBusinessSector: '',
        OverallCustomerEvaluation: '',
        //Thông tin giao hàng ------------
        Shipping: [],
        //Thông tin giấy tờ hồ sơ khách hàng --------------
        Documents: [],
        //Thông tin liên hệ ------------
        Contacts: [],
        //Thông tin ngân hàng ------------
        Banks: [],
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
        PartnerStartDate: '2025-02-12T03:53:08.732Z',
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
        const resCustomer = await ApiCustomerProfiles_Add(bodyCustomer);
        const customerData = resCustomer.data;

        if (customerData.StatusCode === 200 && customerData.ErrorCode === '0') {
          closeModal();
          const bodyCustomer = {
            CustomerRepresentativeID: userInfo?.UserID || 0,
            // SalesStaffID: null,
            // Function: 'Default'
            CmpnID: userInfo?.CmpnID,
          };
          dispatch(fetchListCustomerByUserID(bodyCustomer));
        } else {
          NotifierAlert(
            3000,
            languageKey('_notification'),
            customerData.Message,
            'error',
          );
        }
      } catch (err) {
        NotifierAlert(3000, languageKey('_notification'), String(err), 'error');
      }
    },
    2000,
    {leading: true, trailing: false},
  );
  return (
    <View style={styles.container}>
      <InputDefault
        name="Name"
        returnKeyType="next"
        style={styles.input}
        value={values?.Name}
        isEdit={true}
        label={languageKey('_customer_name')}
        placeholderInput={true}
        bgColor={'#F9FAFB'}
        require={true}
        labelHolder={languageKey('_enter_the_customer_name')}
        {...{touched, errors, handleBlur, handleChange, setFieldValue}}
      />
      <InputPhoneNumber
        label={languageKey('_phone')}
        labelHolder={languageKey('_enter_phone')}
        setListPhoneNumber={setValueListPhoneNumber}
        dataEdit={valueListPhoneNumber}
        bgColor={'#F9FAFB'}
        require={true}
      />
      <View style={styles.input} key={valueProvinceCity?.ID || 'province'}>
        <CardModalProvince
          title={languageKey('_province_city')}
          data={listProvinceCity}
          setValue={setValueProvinceCity}
          value={valueProvinceCity?.RegionsName}
          bgColor={'#F9FAFB'}
          require={true}
        />
      </View>
      <View style={styles.input} key={valueWardCommune?.ID || 'ward'}>
        <CardModalProvince
          title={languageKey('_ward_commune')}
          data={listWardCommune}
          setValue={setValueWardCommune}
          value={valueWardCommune?.RegionsName}
          bgColor={'#F9FAFB'}
          require={true}
        />
      </View>
      <InputDefault
        name="Address"
        returnKeyType="next"
        style={styles.input}
        value={values?.Address}
        isEdit={true}
        label={languageKey('_address')}
        placeholderInput={true}
        bgColor={'#F9FAFB'}
        labelHolder={languageKey('_enter_content')}
        {...{touched, errors, handleBlur, handleChange, setFieldValue}}
      />
      <InputLocation
        selectTextOnFocus={false}
        label={languageKey('_gps_coordinates')}
        labelHolder={languageKey('_select_coordinates')}
        placeholderInput={true}
        onPress={handleGetLong}
        value={valueLocation}
        onChangeText={setValueLocation}
        bgColor={'#F9FAFB'}
        style={styles.input}
      />
      <View style={styles.footer}>
        <Button style={styles.btnFooterCancel} onPress={closeModal}>
          <Text style={styles.txtBtnFooterCancel}>
            {languageKey('_cancel')}
          </Text>
        </Button>
        <Button style={styles.btnFooterApproval} onPress={handleFormCustomer}>
          <Text style={styles.txtBtnFooterApproval}>{languageKey('_add')}</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    marginHorizontal: scale(12),
    marginVertical: scale(4),
  },
  footer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  btnFooterCancel: {
    flex: 1,
    borderWidth: scale(1),
    borderColor: colors.borderColor,
    height: hScale(38),
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(4),
    marginBottom: scale(Platform.OS === 'android' ? 0 : 16),
  },
  txtBtnFooterCancel: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(22),
  },
  btnFooterApproval: {
    flex: 1,
    backgroundColor: colors.blue,
    height: hScale(38),
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: scale(4),
    marginBottom: scale(Platform.OS === 'android' ? 0 : 16),
  },
  txtBtnFooterApproval: {
    color: colors.white,
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(22),
  },
  headerBoxImage: {
    fontSize: fontSize.size14,
    lineHeight: scale(22),
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: colors.black,
    marginLeft: scale(12),
    marginTop: scale(8),
  },
  imgBox: {
    marginLeft: scale(12),
  },
});

export default NewCustomer;
