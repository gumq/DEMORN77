/* eslint-disable react-hooks/rules-of-hooks */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useFormik} from 'formik';
import {debounce} from 'lodash';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {SvgXml} from 'react-native-svg';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  TextInput,
  Platform,
  Pressable,
  Alert,
} from 'react-native';

import {Button} from '../buttons';
import {colors, fontSize} from '@themes';
import {hScale, scale} from '@resolutions';
import {translateLang} from '@store/accLanguages/slide';
import {
  InputDefault,
  CardModalSelect,
  AttachManyFile,
  RenderImage,
} from '@components';
import {
  arrow_down_big,
  arrow_next_gray,
  close_red,
  close_white,
  trash,
} from '@svgImg';
import {
  fetchDetailUserID,
  fetchListSalesSubTeam,
  fetchListSalesTeam,
  fetchListSalesVBH,
} from '@store/accCustomer_Profile/thunk';
import {fetchCustomerByCode} from '@store/accCus_Closed_Move/thunk';
import {updateCustomerByCode} from '@store/accCus_Closed_Move/slide';

const {height, width} = Dimensions.get('window');

const DEBOUNCE_DELAY = 500;

const ModalCusClosedMove = ({
  setValue,
  dataEdit,
  parentID,
  showModal,
  closeModal,
  entryID,
  edit = false,
}) => {
  // Edit', dataEdit);
  const languageKey = useSelector(translateLang);
  const dispatch = useDispatch();
  const {listSalesTeam, listSalesSubTeam, listVBH, detailUserID} = useSelector(
    state => state.CustomerProfile,
  );
  const {listSalesChannel, listCustomerType, customerByCode} = useSelector(
    state => state.CustomerCloseMove,
  );
  // console.log('listSalesChannel', listSalesChannel);
  const {listUserByUserID, listCustomerByUserID} = useSelector(
    state => state.Login,
  );
  const {listUser} = useSelector(state => state.ApprovalProcess);
  const {listCustomers} = useSelector(state => state.ApprovalProcess);
  // console.log('listUserByUserID',listUserByUserID)

  // const listUsersSupport = listCustomerByUserID?.filter(
  //   item => item.IsActive === 1,
  // );

  const listCustomerActive = listCustomerByUserID?.filter(
    item => item.IsActive === 1 && item?.IsCompleted === 1,
  );
  // console.log('listCustomerActive', listCustomerActive?.length);
  const listCustomerClosed = listCustomerByUserID?.filter(
    item => item.IsClosed === 1 && item?.IsCompleted === 1,
    // item => item.IsActive === 1 && item.IsClosed === 0,
  );
  // console.log('listCustomers',listCustomerClosed)
  const [listCustomer, setListCustomer] = useState([]);
  // console.log('listCustomer',listCustomer)
  const [valueListCustomerOfficalSupport, setValueListCustomerOfficalSupport] =
    useState(null);
  const [selectedValueCustomer, setSelectedValueCustomer] = useState(null);
  const [valueSalesChannel, setValueSalesChannel] = useState(null);
  const [valueStaffSales, setValueStaffSales] = useState(null);
  const listUsersSupport = listUser?.filter(
    user => Number(user.DepartmentID) === Number(valueStaffSales?.DepartmentID),
  );
  // const listUsersSupport = listUser?.filter(
  //   user => user?.IsActive === 1 && user?.CustomerTypeID === 9705,
  // );
  // console.log('listUser', listUsersSupport?.length);
  const [valueStaffSupport, setValueStaffSupport] = useState(null);
  const [valueSalesTeam, setValueSalesTeam] = useState(null);
  const [valueSubTeam, setValueSubTeam] = useState(null);
  const [valueRegion, setValueRegion] = useState([]);
  const [valueOrganization, setValueOrganization] = useState([]);
  const [valueRouteSaleNameRegion, setValueRouteSaleNameRegion] = useState([]);
  const [valueRouteSalesStaff, setValueRouteSalesStaff] = useState([]);
  const [valueDetailRegionRoute, setValueDetailRegionRoute] = useState([]);
  const [dataValuesSaleStaff, setDataValuesSaleStaff] = useState(null);
  const [listRoute3, setListRoute3] = useState([]);
  const [listRoute4, setListRoute4] = useState([]);
  const [linkImage, setLinkImage] = useState('');
  const [images, setDataImages] = useState([]);
  const [taxCodeCustomer, onChangeTaxCodeCustomer] = useState('');
  // ValuesSaleStaff', dataValuesSaleStaff);
  const [showInformation, setShowInformation] = useState({
    current: false,
    change: false,
  });

  const toggleInformation = key => {
    setShowInformation(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const initialValues = {
    OID: parentID || '',
    ID: 0,
    CustomerID: 0,
    CustomerSupportID: 0,
    SalesChannelID: 0,
    SalesOrganizationID: 0,
    DistributionChannelID: 0,
    RegionID: 0,
    Route: '',
    HotlineNumber: '',
    SalesManagerID: 0,
    AreaSupervisorID: 0,
    SalesStaffID: 0,
    AreaRouteDetailsID: 0,
    SalesTeamID: 0,
    SalesSubTeamID: 0,
    CurrencyTypeID: 0,
    WarehouseCriteriaID: 0,
    PricingCriteriaID: 0,
    ProcessDefinitionID: 0,
    CustomerProductInfo: '',
    CustomerRepresentativeID: 0,
    SupportAgentID: 0,
    Note: '',
    Link: '',
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
  });

  // const handleAddNewProduct = () => {
  //   const linkArray =
  //     typeof linkImage === 'string'
  //       ? linkImage.split(';')
  //       : Array.isArray(linkImage)
  //       ? linkImage
  //       : [];
  //   const linkString = linkArray.join(';');
  //   if (
  //     !customerByCode &&
  //     entryID !== 'OpenCustomers' &&
  //     entryID !== 'CustomerClosed'
  //   ) {
  //     Alert.alert('Vui lòng nhập thông tin mã số thuế/CCDC khả dụng');
  //     return;
  //   }
  //   if (
  //     !valueStaffSales?.UserFullName &&
  //     customerByCode?.length > 0 &&
  //     entryID !== 'OpenCustomers' &&
  //     entryID !== 'CustomerClosed'
  //   ) {
  //     Alert.alert(languageKey('_please_select_nvkd'));
  //   }
  //   if (
  //     !valueSalesChannel?.Name &&
  //     customerByCode?.length > 0 &&
  //     entryID !== 'OpenCustomers' &&
  //     entryID !== 'CustomerClosed'
  //   ) {
  //     Alert.alert(languageKey('_please_select_sales_channel'));
  //   }
  //   if (
  //     !valueSalesTeam?.Name &&
  //     customerByCode?.length > 0 &&
  //     entryID !== 'OpenCustomers' &&
  //     entryID !== 'CustomerClosed'
  //   ) {
  //     Alert.alert(languageKey('_please_select_main_sales_team'));
  //   }
  //   if (
  //     !valueSubTeam?.Name &&
  //     customerByCode?.length > 0 &&
  //     entryID !== 'OpenCustomers' &&
  //     entryID !== 'CustomerClosed'
  //   ) {
  //     Alert.alert(languageKey('_please_select_small_sales_team'));
  //   }
  //   if (
  //     !valueRegion?.Name &&
  //     customerByCode?.length > 0 &&
  //     entryID !== 'OpenCustomers' &&
  //     entryID !== 'CustomerClosed'
  //   ) {
  //     Alert.alert(languageKey('_please_select_sales_area'));
  //   }
  //   const product = {
  //     OID: '',
  //     ID: 0,
  //     Name: customerByCode?.Name || '',
  //     CustomerName: customerByCode?.Name || '',
  //     CustomerID: selectedValueCustomer?.ID || customerByCode?.ID || 0,
  //     CustomerSupportID: valueListCustomerOfficalSupport?.ID || 0,
  //     CustomerTypeID: selectedValueCustomer?.CustomerTypeID || 0,
  //     CustomerTypeName:
  //       listCustomerType?.filter(
  //         item => item?.ID === customerByCode?.CustomerTypeID,
  //       )?.[0]?.Name || '',
  //     SalesChannelID: Number(valueSalesChannel?.ID) || 0,
  //     SalesOrganizationID: valueOrganization?.ID || 0,
  //     DistributionChannelID: 0,
  //     RegionID: valueRegion?.ID ? Number(valueRegion?.ID) : 0,
  //     Route: '',
  //     HotlineNumber: values?.HotlineNumber || '',
  //     SalesManagerID: valueStaffSales?.DepartmentManagerID
  //       ? Number(valueStaffSales?.DepartmentManagerID)
  //       : 0,
  //     AreaSupervisorID: Number(valueRouteSaleNameRegion?.ID) || 0,
  //     SalesStaffID: Number(valueRouteSalesStaff?.ID) || 0,
  //     AreaRouteDetailsID: valueDetailRegionRoute?.ID || 0,
  //     SalesTeamID: Number(valueSalesTeam?.ID) || 0,
  //     SalesSubTeamID: valueSubTeam?.ID ? Number(valueSubTeam?.ID) : 0,
  //     CurrencyTypeID: 0,
  //     WarehouseCriteriaID: 0,
  //     PricingCriteriaID: 0,
  //     ProcessDefinitionID: 0,
  //     CustomerProductInfo: '',
  //     CustomerRepresentativeID: Number(valueStaffSales?.UserID) || 0,
  //     SupportAgentID: valueStaffSupport?.UserID
  //       ? Number(valueStaffSupport?.UserID)
  //       : 0,
  //     Note: values?.Note || '',
  //     Link: linkString || '',
  //   };
  //   // console.log('product', product);
  //   setListCustomer(prevProduct => [...prevProduct, product]);
  //   setValue(prevProduct => [...prevProduct, product]);
  //   setSelectedValueCustomer(null);
  //   setValueListCustomerOfficalSupport(null);
  //   setValueSalesChannel(null);
  //   setValueStaffSupport(null);
  //   onChangeTaxCodeCustomer('');
  //   resetForm();
  //   closeModal();
  //   dispatch(updateCustomerByCode(null));
  // };
  const handleAddNewProduct = () => {
    const linkArray =
      typeof linkImage === 'string'
        ? linkImage.split(';')
        : Array.isArray(linkImage)
        ? linkImage
        : [];
    const linkString = linkArray.join(';');

    if (
      !customerByCode &&
      entryID !== 'OpenCustomers' &&
      entryID !== 'CustomerClosed'
    ) {
      Alert.alert('Vui lòng nhập thông tin mã số thuế/CCDC khả dụng');
      return;
    }
    if (
      !valueStaffSales?.UserFullName &&
      customerByCode?.length > 0 &&
      entryID !== 'OpenCustomers' &&
      entryID !== 'CustomerClosed'
    ) {
      Alert.alert(languageKey('_please_select_nvkd'));
      return;
    }
    if (
      !valueSalesChannel?.Name &&
      customerByCode?.length > 0 &&
      entryID !== 'OpenCustomers' &&
      entryID !== 'CustomerClosed'
    ) {
      Alert.alert(languageKey('_please_select_sales_channel'));
      return;
    }
    if (
      !valueSalesTeam?.Name &&
      customerByCode?.length > 0 &&
      entryID !== 'OpenCustomers' &&
      entryID !== 'CustomerClosed'
    ) {
      Alert.alert(languageKey('_please_select_main_sales_team'));
      return;
    }
    if (
      !valueSubTeam?.Name &&
      customerByCode?.length > 0 &&
      entryID !== 'OpenCustomers' &&
      entryID !== 'CustomerClosed'
    ) {
      Alert.alert(languageKey('_please_select_small_sales_team'));
      return;
    }
    if (
      !valueRegion?.Name &&
      customerByCode?.length > 0 &&
      entryID !== 'OpenCustomers' &&
      entryID !== 'CustomerClosed'
    ) {
      Alert.alert(languageKey('_please_select_sales_area'));
      return;
    }

    const product = {
      OID: '',
      ID: 0,
      Name: customerByCode?.Name || '',
      CustomerName: customerByCode?.Name || '',
      CustomerID: selectedValueCustomer?.ID || customerByCode?.ID || 0,
      CustomerSupportID: valueListCustomerOfficalSupport?.ID || 0,
      CustomerTypeID: selectedValueCustomer?.CustomerTypeID || 0,
      CustomerTypeName:
        listCustomerType?.filter(
          item => item?.ID === customerByCode?.CustomerTypeID,
        )?.[0]?.Name || '',
      SalesChannelID: Number(valueSalesChannel?.ID) || 0,
      SalesOrganizationID: valueOrganization?.ID || 0,
      DistributionChannelID: 0,
      RegionID: valueRegion?.ID ? Number(valueRegion?.ID) : 0,
      Route: '',
      HotlineNumber: values?.HotlineNumber || '',
      SalesManagerID: valueStaffSales?.DepartmentManagerID
        ? Number(valueStaffSales?.DepartmentManagerID)
        : 0,
      AreaSupervisorID: Number(valueRouteSaleNameRegion?.ID) || 0,
      SalesStaffID: Number(valueRouteSalesStaff?.ID) || 0,
      AreaRouteDetailsID: valueDetailRegionRoute?.ID || 0,
      SalesTeamID: Number(valueSalesTeam?.ID) || 0,
      SalesSubTeamID: valueSubTeam?.ID ? Number(valueSubTeam?.ID) : 0,
      CurrencyTypeID: 0,
      WarehouseCriteriaID: 0,
      PricingCriteriaID: 0,
      ProcessDefinitionID: 0,
      CustomerProductInfo: '',
      CustomerRepresentativeID: Number(valueStaffSales?.UserID) || 0,
      SupportAgentID: valueStaffSupport?.UserID
        ? Number(valueStaffSupport?.UserID)
        : 0,
      Note: values?.Note || '',
      Link: linkString || '',
    };

    // --- BỔ SUNG: kiểm tra duplicate trước khi add ---
    // So sánh theo CustomerID nếu có, ngược lại so sánh theo CustomerName (trim & lowercase)
    const normalizedName = (product.CustomerName || '')
      .toString()
      .trim()
      .toLowerCase();
    const exists = listCustomer?.some(p => {
      // nếu cả hai đều có CustomerID (khác 0) so sánh theo ID
      if (product.CustomerID && p.CustomerID) {
        return Number(p.CustomerID) === Number(product.CustomerID);
      }
      // fallback so sánh theo tên (loại bỏ khoảng trắng khác biệt + ignore case)
      const pName = (p.CustomerName || p.Name || '')
        .toString()
        .trim()
        .toLowerCase();
      return pName && normalizedName && pName === normalizedName;
    });

    if (exists) {
      // Thông báo trùng và không thêm
      Alert.alert('Khách hàng đã tồn tại trong danh sách');
      return;
    }
    // --- end duplicate check ---

    setListCustomer(prevProduct => [...prevProduct, product]);
    setValue(prevProduct => [...prevProduct, product]);
    setSelectedValueCustomer(null);
    setLinkImage('');
    setDataImages([])
    setValueListCustomerOfficalSupport(null);
    setValueSalesChannel(null);
    setValueStaffSupport(null);
    onChangeTaxCodeCustomer('');
    resetForm();
    closeModal();
    dispatch(updateCustomerByCode(null));
  };

  const handleRemoveProduct = (item, index) => {
    // console.log('item', index);
    // console.log('listCustomer', listCustomer);
    setListCustomer(prev => prev.filter((items, indexs) => indexs !== index));
    setValue(prev => prev.filter((items, indexs) => indexs !== index));
  };
  useEffect(() => {
    if (dataEdit && dataEdit.length > 0) {
      const convertedData = dataEdit.map(item => ({
        OID: item.OID || '',
        ID: item.ID || 0,
        CustomerName: item?.CustomerName || '',
        CustomerID: item.CustomerID || 0,
        CustomerTypeID: item?.CustomerTypeID || 0,
        CustomerSupportID: item.CustomerSupportID || 0,
        SalesChannelID: Number(item.SalesChannelID) || 0,
        SalesOrganizationID: item.SalesOrganizationID || 0,
        DistributionChannelID: item.DistributionChannelID || 0,
        RegionID: Number(item.RegionID) || 0,
        Route: Number(item.Route) || 0,
        HotlineNumber: item.HotlineNumber || '',
        SalesManagerID: Number(item.SalesManagerID) || 0,
        AreaSupervisorID: Number(item.AreaSupervisorID) || 0,
        SalesStaffID: Number(item.SalesStaffID) || 0,
        AreaRouteDetailsID: Number(item.AreaRouteDetailsID) || 0,
        SalesTeamID: item?.SalesTeamID || 0,
        SalesSubTeamID: Number(item.SalesSubTeam) || 0,
        CurrencyTypeID: item?.CurrencyTypeID || 0,
        WarehouseCriteriaID: item?.WarehouseCriteriaID || 0,
        PricingCriteriaID: item?.PricingCriteriaID || 0,
        ProcessDefinitionID: item?.ProcessDefinitionID || 0,
        CustomerProductInfo: item?.CustomerProductInfo || '',
        CustomerRepresentativeID: item?.CustomerRepresentativeID || 0,
        SupportAgentID: Number(item?.SupportAgentID) || 0,
        Note: item?.Note || '',
        Link: item?.Link || '',
      }));
      setListCustomer(convertedData);
      setValue(convertedData);
    }
  }, [dataEdit]);

  const customerTypeName = listCustomerType?.find(
    c => c.ID === selectedValueCustomer?.CustomerTypeID,
  );

  const customerMap = useMemo(() => {
    const map = {};
    listCustomerActive?.forEach(c => {
      map[c.ID] = c;
    });
    return map;
  }, [listCustomerActive]);
  const customerTypeMap = useMemo(() => {
    const map = {};
    listCustomerType?.forEach(c => {
      map[c.ID] = c;
    });
    return map;
  }, [listCustomerType]);
  // console.log('listCustomers',listCustomers)
  // console.log('listCustomer', listCustomer);
  const _keyExtractor1 = (item, index) => `${item.ID}-${index}`;
  const _renderItem1 = ({item, index}) => {
    const customerName = listCustomers?.find(c => c.ID === item?.CustomerID);
    // const customerOfficial = listCustomers?.find(
    //   c => c.ID === item?.CustomerSupportID,
    // );
    // const customerOfficial = listCustomers;
    // console.log('customerOfficial', customerOfficial);
    // console.log('customerName', customerName);
    const itemLinks = item?.Link.split(';').filter(Boolean);
    return (
      <Button>
        <View style={styles.cardCustomer1}>
          {/* <Text
            style={stylesDetail.txtHeaderCard}
            numberOfLines={2}
            ellipsizeMode="tail">
            {customerName?.Name}
          </Text> */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {item ? (
              <View style={styles.contentCard1}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_customer')}
                </Text>
                <Text style={styles.contentBody}>{item?.CustomerName}</Text>
              </View>
            ) : null}
            <Pressable
              onPress={() => {
                handleRemoveProduct(item, index);
              }}>
              <SvgXml xml={trash} />
            </Pressable>
          </View>
          {item?.CustomerRepresentativeName ? (
            <View style={styles.contentCard1}>
              <Text style={styles.txtHeaderBody}>
                {languageKey('_sales_staff_customer')}
              </Text>
              <Text style={styles.contentBody}>
                {item?.CustomerRepresentativeName}
              </Text>
            </View>
          ) : null}
          {/* {item?.CustomerTypeName ? (
            <View style={stylesDetail.contentCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_customer_type')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {item?.CustomerTypeName}
              </Text>
            </View>
          ) : null} */}
          {/* {item?.SupportAgentName ? (
            <View style={stylesDetail.contentCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_hotline')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {item.SupportAgentName}
              </Text>
            </View>
          ) : null} */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {item?.SalesOrganizationName ? (
              <View style={styles.contentCard}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_sales_organization')}
                </Text>
                <Text style={styles.contentBody}>
                  {item?.SalesOrganizationName}
                </Text>
              </View>
            ) : null}
            {item?.SalesRouteName ? (
              <View style={styles.contentCard}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_sales_route')}
                </Text>
                <Text style={styles.contentBody}>{item?.SalesRouteName}</Text>
              </View>
            ) : null}
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {item?.AreaSupervisorName ? (
              <View style={styles.contentCard}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_regional_monitoring_route')}
                </Text>
                <Text style={styles.contentBody}>
                  {item?.AreaSupervisorName}
                </Text>
              </View>
            ) : null}
            {item?.SupportAgentName ? (
              <View style={styles.contentCard}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_support_staff')}
                </Text>
                <Text style={styles.contentBody}>{item?.SupportAgentName}</Text>
              </View>
            ) : null}
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {item?.SalesStaffName ? (
              <View style={styles.contentCard}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_business_staff_route')}
                </Text>
                <Text style={styles.contentBody}>{item?.SalesStaffName}</Text>
              </View>
            ) : null}
            {item?.SalesTeamName ? (
              <View style={styles.contentCard}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_main_business_team')}
                </Text>
                <Text style={styles.contentBody}>{item?.SalesTeamName}</Text>
              </View>
            ) : null}
          </View>
          {/* {item?.SalesTeamName ? (
            <View style={stylesDetail.contentCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_small_team_in_charge_for_business')}
              </Text>
              <Text style={stylesDetail.contentBody}>{item.SalesTeamName}</Text>
            </View>
          ) : null} */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {item?.SalesSubTeamName ? (
              <View style={styles.contentCard}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_small_team_in_charge_for_business')}
                </Text>
                <Text style={styles.contentBody}>{item?.SalesSubTeamName}</Text>
              </View>
            ) : null}
            {item?.RegionName ? (
              <View style={styles.contentCard}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_region')}
                </Text>
                <Text style={styles.contentBody}>{item?.RegionName}</Text>
              </View>
            ) : null}
          </View>
          {item?.HotlineNumber ? (
            <View style={styles.contentCard}>
              <Text style={styles.txtHeaderBody}>HotLine</Text>
              <Text style={styles.contentBody}>{item?.HotlineNumber}</Text>
            </View>
          ) : null}
          {item?.Note ? (
            <View style={styles.contentCard}>
              <Text style={styles.txtHeaderBody}>{languageKey('_note')}</Text>
              <Text style={styles.contentBody}>{item.Note}</Text>
            </View>
          ) : null}
          {itemLinks.length > 0 && (
            <View>
              <Text style={styles.txtHeaderBody}>{languageKey('_image')}</Text>
              <RenderImage urls={itemLinks} />
            </View>
          )}
        </View>
      </Button>
    );
  };
  // console.log('customerByCode',customerByCode)
  const _keyExtractor = (item, index) => `${item.CustomerID}-${index}`;
  const _renderItem = useCallback(
    ({item, index}) => {
      const customerName = customerMap?.[item?.CustomerID];
      const customerOfficial = customerMap?.[item?.CustomerSupportID];
      const customerType = customerTypeMap?.[item?.CustomerTypeID];
      // console.log('customerMap',customerMap)
      // const itemLinks = useMemo(
      //   () => item?.Link?.split(';')?.filter(Boolean) || [],
      //   [item?.Link],
      // );
      // console.log('itemLinks', itemLinks);
      const itemLinks = item?.Link?.split(';')?.filter(Boolean) || [];
      // console.log('customerNamecustomerName', customerName);
      return (
        <View style={styles.cardProgramItem}>
          <View style={styles.cardCustomer}>
            <View style={styles.containerHeader}>
              <Text
                style={styles.txtHeaderCard}
                numberOfLines={2}
                ellipsizeMode="tail">
                {customerName?.Name || item?.Name || ''}
              </Text>
              <Pressable
                onPress={() => {
                  handleRemoveProduct(item, index);
                }}>
                <SvgXml xml={trash} />
              </Pressable>
            </View>
            {(customerOfficial?.Name || item?.CustomerTypeName) && (
              <View style={styles.contentCard1}>
                {/* <Text style={styles.txtHeaderBody}>
                  {languageKey('_official_customers')}
                </Text> */}
                <Text style={styles.contentBody}>
                  {customerOfficial?.Name || item?.CustomerTypeName || ''}
                </Text>
              </View>
            )}

            {item?.Note && (
              <View style={styles.contentCard}>
                <Text style={styles.txtHeaderBody}>{languageKey('_note')}</Text>
                <Text style={styles.contentBody}>{item?.Note}</Text>
              </View>
            )}

            {entryID === 'OpenCustomers' && (
              <View style={[styles.contentCard, {width: scale(300)}]}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_customer_type')}
                </Text>
                <Text style={styles.contentBody}>{customerType?.Name}</Text>
              </View>
            )}

            {itemLinks.length > 0 && (
              <View style={styles.containerTableFileItem}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_image')}
                </Text>
                <RenderImage urls={itemLinks} />
              </View>
            )}
          </View>
        </View>
      );
    },
    [customerMap, customerTypeMap, languageKey, entryID],
  );

  useEffect(() => {
    if (!valueStaffSales) return;

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
      valueStaffSales.Region || '',
      valueStaffSales.RegionName || '',
    );
    const organizationSale = parseMultipleValues(
      valueStaffSales.RouteSales || '',
      valueStaffSales.RouteSaleName || '',
    );
    // const salesRoute2 = parseMultipleValues(
    //   valueStaffSales.RouteSales2 || '',
    //   valueStaffSales.RouteSaleName2 || '',
    // );
    // const salesRoute3 = parseMultipleValues(
    //   valueStaffSales.RouteSales3 || '',
    //   valueStaffSales.RouteSaleName3 || '',
    // );
    // const salesRoute4 = parseMultipleValues(
    //   valueStaffSales.RouteSales4 || '',
    //   valueStaffSales.RouteSaleName4 || '',
    // );
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
    const bodyUser = {ID: valueStaffSales?.UserID};
    dispatch(fetchDetailUserID(bodyUser));
    const salesRoute1 = parseRouteSalesArray(detailUserID?.RouteSalesArray1);
    const salesRoute2 = parseRouteSalesArray(detailUserID?.RouteSalesArray2);
    // console.log('salesRoute2', salesRoute2);
    const salesRoute3 = parseRouteSalesArray(detailUserID?.RouteSalesArray3);
    // console.log('salesRoute3', salesRoute3);
    const salesRoute4 = parseRouteSalesArray(detailUserID?.RouteSalesArray4);
    // console.log('salesRoute4', salesRoute4);
    const selectedIDs =
      valueStaffSales?.SalesChannelID?.split(',')?.map(Number) || [];
    const selectedItems =
      listSalesChannel?.filter(item => selectedIDs?.includes(item?.ID)) || [];
    // const selectedItems =
    //   listSalesChannel?.filter(
    //     item => selectedIDs?.toString() === item?.ID?.toString(),
    //   ) || [];

    const route2 = salesRoute2?.[0] || null;
    const route3 =
      salesRoute3.find(r => r?.RouteParentID === route2?.ID) || null;
    const route4 =
      salesRoute4.find(r => r?.RouteParentID === route3?.ID) || null;
    // console.log('selectedItems', selectedItems);
    if (selectedItems?.length === 1) {
      setValueSalesChannel(selectedItems?.[0]);
    }
    setDataValuesSaleStaff({
      Region: listVBH,
      SalesChannelRoute: selectedItems,
      SalesRoute1: salesRoute1,
      SalesRoute2: salesRoute2,
      SalesRoute3: salesRoute3,
      SalesRoute4: salesRoute4,
    });

    // setValueRegion(listVBH[0] || null);
    // setValueOrganization(organizationSale[0] || null);
    // setValueSalesChannel(selectedItems);
    // setValueRouteSaleNameRegion(route2);
    // setValueRouteSalesStaff(route3);
    // setValueDetailRegionRoute(route4);
    setValueRegion(listVBH?.[0]);
    setValueOrganization(salesRoute1?.[0]);
    setValueRouteSaleNameRegion(salesRoute2?.[0]);
    setValueRouteSalesStaff(salesRoute3?.[0]);
    setValueDetailRegionRoute(salesRoute4?.[0]);
    setListRoute3(salesRoute3.filter(r => r.RouteParentID === route2?.ID));
    setListRoute4(salesRoute4.filter(r => r.RouteParentID === route3?.ID));

    setFieldValue('HotlineNumber', valueStaffSales?.DepartmentPhone);
  }, [valueStaffSales]);

  useEffect(() => {
    dispatch(fetchListSalesTeam());
  }, [dispatch]);

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
        // CategoryType: 'SalesTeam',
        CategoryType: 'Area',
        ParentID: valueSubTeam?.ID,
      };
      dispatch(fetchListSalesVBH(body));
    }
  }, [valueSubTeam, dispatch]);
  useEffect(() => {
    if (
      !valueRouteSaleNameRegion?.ID ||
      !valueStaffSales?.RouteParentID3 ||
      !valueStaffSales?.RouteSales3 ||
      !valueStaffSales?.RouteSaleName3
    )
      return;

    const parentIDs = valueStaffSales.RouteParentID3.split(';');
    const routeIDs = valueStaffSales.RouteSales3.split(',');
    const routeNames = valueStaffSales.RouteSaleName3.split(';');

    const filteredRoute3List = parentIDs
      .map((pid, index) => ({
        ID: routeIDs[index],
        Name: routeNames[index],
        ParentID: pid,
      }))
      .filter(item => item.ParentID === valueRouteSaleNameRegion.ID);

    setListRoute3(filteredRoute3List);

    if (filteredRoute3List.length === 0) {
      setValueRouteSalesStaff(null);
      setListRoute4([]);
      setValueDetailRegionRoute(null);
      return;
    }

    const selected = filteredRoute3List.find(
      r => r.ID === valueRouteSalesStaff?.ID,
    );
    if (!selected) {
      const defaultRoute3 = filteredRoute3List[0];
      if (valueRouteSalesStaff?.ID !== defaultRoute3?.ID) {
        setValueRouteSalesStaff(defaultRoute3);
      }
    }
  }, [
    valueRouteSaleNameRegion?.ID,
    valueStaffSales?.RouteParentID3,
    valueStaffSales?.RouteSales3,
    valueStaffSales?.RouteSaleName3,
  ]);

  useEffect(() => {
    if (
      !valueRouteSalesStaff?.ID ||
      !valueStaffSales?.RouteParentID4 ||
      !valueStaffSales?.RouteSales4 ||
      !valueStaffSales?.RouteSaleName4
    )
      return;

    const parentIDs = valueStaffSales.RouteParentID4.split(';');
    const routeIDs = valueStaffSales.RouteSales4.split(',');
    const routeNames = valueStaffSales.RouteSaleName4.split(';');

    const filteredRoute4List = parentIDs
      .map((pid, index) => ({
        ID: routeIDs[index],
        Name: routeNames[index],
        ParentID: pid,
      }))
      .filter(item => item.ParentID === valueRouteSalesStaff.ID);

    setListRoute4(filteredRoute4List);

    if (filteredRoute4List.length === 0) {
      setValueDetailRegionRoute(null);
      return;
    }

    const firstRoute4 = filteredRoute4List[0];
    if (valueDetailRegionRoute?.ID !== firstRoute4.ID) {
      setValueDetailRegionRoute(firstRoute4);
    }
  }, [
    valueRouteSalesStaff?.ID,
    valueStaffSales?.RouteParentID4,
    valueStaffSales?.RouteSales4,
    valueStaffSales?.RouteSaleName4,
  ]);

  const debouncedFetchCustomer = useCallback(
    debounce(value => {
      const body = {TaxCode: value};
      dispatch(fetchCustomerByCode(body));
    }, DEBOUNCE_DELAY),
    [],
  );

  useEffect(() => {
    if (taxCodeCustomer !== '') {
      debouncedFetchCustomer(taxCodeCustomer);
    }

    return () => {
      debouncedFetchCustomer.cancel();
    };
  }, [taxCodeCustomer]);

  return (
    <View>
      {showModal && (
        <View>
          <Modal
            isVisible={showModal}
            useNativeDriver={true}
            onBackdropPress={closeModal}
            onBackButtonPress={closeModal}
            backdropTransitionOutTiming={450}
            avoidKeyboard={true}
            style={styles.modal}>
            <View style={styles.optionsModalContainer}>
              <View style={styles.headerModal}>
                <View style={styles.btnClose}>
                  <SvgXml xml={close_white} />
                </View>
                <Text style={styles.titleModal}>
                  {languageKey('_add_customer')}
                </Text>
                <Button onPress={closeModal} style={styles.btnClose}>
                  <SvgXml xml={close_red} />
                </Button>
              </View>
              <ScrollView
                style={styles.modalContainer}
                showsVerticalScrollIndicator={false}>
                {entryID === 'OpenCustomers' || entryID === 'CustomerClosed' ? (
                  <>
                    <View style={styles.input}>
                      <CardModalSelect
                        title={languageKey('_customer')}
                        data={
                          entryID === 'OpenCustomers'
                            ? listCustomerClosed
                            : listCustomerActive
                        }
                        setValue={setSelectedValueCustomer}
                        value={selectedValueCustomer?.Name}
                        bgColor={'#F9FAFB'}
                      />
                    </View>
                    {entryID === 'OpenCustomers' ? (
                      <View style={styles.input}>
                        <Text style={styles.txtHeaderInputView}>
                          {languageKey('_customer_type')}
                        </Text>
                        <Text
                          style={styles.inputView}
                          numberOfLines={2}
                          ellipsizeMode="tail">
                          {customerTypeName
                            ? customerTypeName?.Name
                            : 'Chưa chọn khách hàng'}
                        </Text>
                      </View>
                    ) : null}
                  </>
                ) : (
                  <View style={styles.input}>
                    <Text style={styles.headerInput}>
                      {languageKey('_tax_code_cccd')}
                    </Text>
                    <TextInput
                      style={styles.inputContent}
                      onChangeText={onChangeTaxCodeCustomer}
                      value={taxCodeCustomer}
                      placeholder={languageKey('_enter_content')}
                      keyboardType={'numeric'}
                    />
                  </View>
                )}

                {entryID === 'MoveToSupports' && (
                  <View style={styles.input}>
                    <CardModalSelect
                      title={languageKey('_mainstream_customer')}
                      data={listCustomerActive}
                      setValue={setValueListCustomerOfficalSupport}
                      value={
                        valueListCustomerOfficalSupport
                          ? `${valueListCustomerOfficalSupport.Name ?? ''} ${
                              valueListCustomerOfficalSupport.TaxCode ?? ''
                            } ${
                              valueListCustomerOfficalSupport.FullAddress ?? ''
                            }`
                          : ''
                      }
                      bgColor={'#F9FAFB'}
                    />
                  </View>
                )}

                {entryID === 'MoveDepartments' ? (
                  <>
                    <View style={styles.containerHeader}>
                      <Text style={styles.header}>
                        {languageKey('_current_information')}
                      </Text>
                      <Button
                        style={styles.btnShowInfor}
                        onPress={() => toggleInformation('current')}>
                        <SvgXml
                          xml={
                            showInformation.current
                              ? arrow_down_big
                              : arrow_next_gray
                          }
                        />
                      </Button>
                    </View>
                    {showInformation.current && (
                      <View style={styles.bodyCard}>
                        <View style={styles.containerContent}>
                          <View style={styles.containerBodyCard}>
                            <Text style={styles.txtHeaderBody}>
                              {languageKey('_customer')}
                            </Text>
                            <Text style={styles.contentBody}>
                              {customerByCode?.Name ?? ''}{' '}
                              {customerByCode?.TaxCode ?? ''}{' '}
                              {customerByCode?.FullAddress ?? ''}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.containerContent}>
                          <View style={styles.containerBodyCard}>
                            <Text style={styles.txtHeaderBody}>
                              {languageKey('_sales_staff_customer')}
                            </Text>
                            <Text style={styles.contentBody}>
                              {customerByCode?.CustomerRepresentativeName}
                            </Text>
                          </View>
                          <View style={styles.containerBodyCard}>
                            <Text style={styles.txtHeaderBody}>
                              {languageKey('_support_staff')}
                            </Text>
                            <Text style={styles.contentBody}>
                              {customerByCode?.SupportAgentName}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.containerContent}>
                          <View style={styles.containerBodyCard}>
                            <Text style={styles.txtHeaderBody}>
                              {languageKey('_sales_channel')}
                            </Text>
                            <Text style={styles.contentBody}>
                              {customerByCode?.SalesChannelName}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.containerContent}>
                          <View style={styles.containerBodyCard}>
                            <Text style={styles.txtHeaderBody}>
                              {languageKey('_sales_organization')}
                            </Text>
                            <Text style={styles.contentBody}>
                              {customerByCode?.SalesOrganizationName}
                            </Text>
                          </View>
                          <View style={styles.containerBodyCard}>
                            <Text style={styles.txtHeaderBody}>
                              {languageKey('_regional_monitoring_route')}
                            </Text>
                            <Text style={styles.contentBody}>
                              {customerByCode?.AreaSupervisorName}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.containerContent}>
                          <View style={styles.containerBodyCard}>
                            <Text style={styles.txtHeaderBody}>
                              {languageKey('_business_staff_route')}
                            </Text>
                            <Text style={styles.contentBody}>
                              {customerByCode?.SalesStaffName}
                            </Text>
                          </View>
                          <View style={styles.containerBodyCard}>
                            <Text style={styles.txtHeaderBody}>
                              {languageKey('_details_of_the_route_area')}
                            </Text>
                            <Text style={styles.contentBody}>
                              {customerByCode?.AreaRouteDetailName === ''
                                ? 'Tất cả'
                                : customerByCode?.AreaRouteDetailName}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.containerContent}>
                          <View style={styles.containerBodyCard}>
                            <Text style={styles.txtHeaderBody}>
                              {languageKey('_main_business_team')}
                            </Text>
                            <Text style={styles.contentBody}>
                              {customerByCode?.SalesTeamName}
                            </Text>
                          </View>
                          <View style={styles.containerBodyCard}>
                            <Text style={styles.txtHeaderBody}>
                              {languageKey(
                                '_small_team_in_charge_for_business',
                              )}
                            </Text>
                            <Text style={styles.contentBody}>
                              {customerByCode?.SalesSubTeamName}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.containerContent}>
                          <View style={styles.containerBodyCard}>
                            <Text style={styles.txtHeaderBody}>
                              {languageKey('_hotline_number')}
                            </Text>
                            <Text style={styles.contentBody}>
                              {customerByCode?.HotlineNumber}
                            </Text>
                          </View>
                          <View style={styles.containerBodyCard}>
                            <Text style={styles.txtHeaderBody}>
                              {languageKey('_region')}
                            </Text>
                            <Text style={styles.contentBody}>
                              {customerByCode?.RegionName}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                    <View style={styles.containerHeader}>
                      <Text style={styles.header}>
                        {languageKey('_information_changes')}
                      </Text>
                      <Button
                        style={styles.btnShowInfor}
                        onPress={() => toggleInformation('change')}>
                        <SvgXml
                          xml={
                            showInformation.change
                              ? arrow_down_big
                              : arrow_next_gray
                          }
                        />
                      </Button>
                    </View>
                    {showInformation.change && (
                      <View style={styles.card}>
                        <View style={styles.input}>
                          <CardModalSelect
                            title={languageKey('_sales_staff_customer')}
                            data={listUserByUserID}
                            setValue={setValueStaffSales}
                            value={valueStaffSales?.UserFullName}
                            require={true}
                          />
                        </View>
                        <View style={styles.input}>
                          <CardModalSelect
                            title={languageKey('_support_staff')}
                            data={listUsersSupport}
                            setValue={setValueStaffSupport}
                            value={valueStaffSupport?.UserFullName}
                          />
                        </View>
                        <View style={styles.input}>
                          <CardModalSelect
                            title={languageKey('_sales_channel')}
                            data={dataValuesSaleStaff?.SalesChannelRoute}
                            setValue={setValueSalesChannel}
                            value={valueSalesChannel?.Name}
                            bgColor={'#FAFAFA'}
                            require={true}
                          />
                        </View>
                        <View style={styles.input}>
                          <CardModalSelect
                            title={languageKey('_sales_organization')}
                            data={dataValuesSaleStaff?.SalesRoute1}
                            setValue={setValueOrganization}
                            value={valueOrganization?.Name}
                            bgColor={'#FAFAFA'}
                            require={true}
                          />
                        </View>
                        <View style={styles.input}>
                          <CardModalSelect
                            title={languageKey('_regional_monitoring_route')}
                            data={dataValuesSaleStaff?.SalesRoute2}
                            setValue={setValueRouteSaleNameRegion}
                            value={valueRouteSaleNameRegion?.Name}
                            bgColor={'#FAFAFA'}
                            require={true}
                          />
                        </View>
                        <View style={styles.input}>
                          <CardModalSelect
                            title={languageKey('_business_staff_route')}
                            data={dataValuesSaleStaff?.SalesRoute3}
                            setValue={setValueRouteSalesStaff}
                            value={valueRouteSalesStaff?.Name}
                            bgColor={'#FAFAFA'}
                            require={true}
                          />
                        </View>
                        <View style={styles.input}>
                          <CardModalSelect
                            title={languageKey('_details_of_the_route_area')}
                            data={dataValuesSaleStaff?.SalesRoute4}
                            setValue={setValueDetailRegionRoute}
                            value={valueDetailRegionRoute?.Name}
                            bgColor={'#FAFAFA'}
                          />
                        </View>
                        <View style={styles.input}>
                          <CardModalSelect
                            title={languageKey('_main_business_team')}
                            data={listSalesTeam}
                            setValue={setValueSalesTeam}
                            value={valueSalesTeam?.Name}
                            require={true}
                          />
                        </View>
                        <View style={styles.input}>
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
                        <View style={styles.input}>
                          <CardModalSelect
                            title={languageKey('_region')}
                            data={listVBH}
                            setValue={setValueRegion}
                            value={valueRegion?.Name}
                            require={true}
                            bgColor={'#FAFAFA'}
                          />
                        </View>
                        <InputDefault
                          name="HotlineNumber"
                          returnKeyType="next"
                          style={styles.input}
                          value={values?.HotlineNumber}
                          label={languageKey('_hotline_number')}
                          placeholderInput={true}
                          isEdit={true}
                          keyboardType={'numeric'}
                          string={true}
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
                      </View>
                    )}
                  </>
                ) : (
                  <InputDefault
                    name="Note"
                    returnKeyType="next"
                    style={styles.input}
                    value={values?.Note}
                    label={languageKey('_note')}
                    isEdit={true}
                    placeholderInput={true}
                    labelHolder={languageKey('_enter_notes')}
                    bgColor={'#F9FAFB'}
                    {...{
                      touched,
                      errors,
                      handleBlur,
                      handleChange,
                      setFieldValue,
                    }}
                  />
                )}

                <Text style={styles.headerBoxImage}>
                  {languageKey('_image')}
                </Text>
                <View style={styles.imgBox}>
                  <AttachManyFile
                    OID={parentID}
                    images={images}
                    setDataImages={setDataImages}
                    setLinkImage={setLinkImage}
                    dataLink={linkImage}
                  />
                </View>
              </ScrollView>
              <View style={styles.footer}>
                <Button style={styles.btnFooterCancel} onPress={closeModal}>
                  <Text style={styles.txtBtnFooterCancel}>
                    {languageKey('_cancel')}
                  </Text>
                </Button>
                <Button
                  style={styles.btnFooterApproval}
                  onPress={handleAddNewProduct}>
                  <Text style={styles.txtBtnFooterApproval}>
                    {languageKey('_add')}
                  </Text>
                </Button>
              </View>
            </View>
          </Modal>
        </View>
      )}
      {listCustomer?.length > 0 ? (
        <View style={styles.card}>
          <FlatList
            data={edit ? dataEdit : listCustomer ?? []}
            renderItem={edit ? _renderItem1 : _renderItem}
            keyExtractor={edit ? _keyExtractor1 : _keyExtractor}
            contentContainerStyle={styles.containerFlat}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  optionsModal: {
    margin: 0,
    justifyContent: 'flex-end',
    borderTopRightRadius: scale(8),
    borderTopLeftRadius: scale(8),
  },
  optionsModalContainer: {
    backgroundColor: colors.white,
    height: 'auto',
    borderTopRightRadius: scale(12),
    borderTopLeftRadius: scale(12),
  },
  modalContainer: {
    overflow: 'hidden',
    backgroundColor: colors.white,
    maxHeight: height / 1.7,
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: scale(1),
    borderBottomColor: colors.graySystem2,
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(12),
    borderTopRightRadius: scale(12),
    paddingVertical: scale(10),
    paddingHorizontal: scale(12),
  },
  titleModal: {
    fontFamily: 'Inter-SemiBold',
    fontSize: fontSize.size16,
    lineHeight: scale(24),
    fontWeight: '600',
    color: colors.black,
    flex: 1,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#F9F9FB',
    borderBottomWidth: scale(1),
    borderBottomColor: colors.borderColor,
  },
  input: {
    marginHorizontal: scale(12),
    marginVertical: scale(4),
  },
  txtHeaderInputView: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    lineHeight: scale(22),
  },
  inputView: {
    borderRadius: scale(8),
    paddingLeft: scale(10),
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
    marginTop: scale(8),
    borderWidth: scale(1),
    borderColor: '#D1D3DB',
    backgroundColor: '#E5E7EB',
    paddingVertical: scale(8),
    color: colors.black,
    overflow: 'hidden',
  },
  cardProgram: {
    backgroundColor: colors.white,
    marginHorizontal: scale(12),
    marginTop: scale(8),
    borderRadius: scale(8),
    borderWidth: scale(1),
    borderColor: colors.borderColor,
    paddingHorizontal: scale(8),
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentBody: {
    fontSize: fontSize.size14,
    fontWeight: '400',
    lineHeight: scale(22),
    fontFamily: 'Inter-Regular',
    color: colors.black,
    marginLeft: scale(4),
    overflow: 'hidden',
    width: '90%',
  },
  containerBody: {
    flexDirection: 'row',
    marginHorizontal: scale(8),
    alignItems: 'center',
    marginBottom: scale(4),
  },
  footer: {
    backgroundColor: colors.white,
    borderTopColor: colors.borderColor,
    borderTopWidth: scale(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    marginBottom: scale(Platform.OS === 'ios' ? 16 : 0),
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
  },
  txtBtnFooterApproval: {
    color: colors.white,
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(22),
  },
  containerBodyCard: {
    marginVertical: scale(8),
    flex: 1,
  },
  contentCard: {
    marginBottom: scale(4),
    flexDirection: 'row',
    flex: 1,
  },
  txtHeaderBody: {
    color: '#6B7280',
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
  },
  card: {
    backgroundColor: colors.white,
    paddingBottom: scale(8),
  },
  containerFlat: {
    paddingBottom: scale(100),
  },
  btnShowInfor: {
    marginRight: scale(12),
  },
  header: {
    fontSize: fontSize.size16,
    fontWeight: '600',
    lineHeight: scale(24),
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
    marginTop: scale(12),
    marginHorizontal: scale(12),
    marginBottom: scale(4),
  },
  containerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bodyCard: {
    marginVertical: scale(8),
    paddingHorizontal: scale(12),
  },
  cardProgramItem: {
    backgroundColor: colors.white,
    paddingHorizontal: scale(12),
  },
  cardCustomer: {
    backgroundColor: colors.white,
    paddingHorizontal: scale(8),
    borderWidth: scale(1),
    borderColor: colors.borderColor,
    borderRadius: scale(8),
    marginTop: scale(8),
    paddingVertical: scale(8),
  },
  cardCustomer1: {
    backgroundColor: colors.white,
    paddingHorizontal: scale(8),
    borderWidth: scale(1),
    borderColor: colors.borderColor,
    borderRadius: scale(8),
    marginTop: scale(8),
    paddingVertical: scale(8),
    marginHorizontal: scale(8),
  },
  txtHeaderCard: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(18),
    marginBottom: scale(8),
  },
  contentCard: {
    marginBottom: scale(8),
  },
  txtHeaderBody: {
    color: '#6B7280',
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
  },
  contentBody: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
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
  image: {
    width: width / 4 - 24,
    height: hScale(82),
    borderRadius: scale(12),
    marginHorizontal: scale(4),
    marginTop: scale(8),
  },
  headerInput: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Medium',
    lineHeight: scale(22),
    marginBottom: scale(4),
    marginTop: scale(8),
  },
  inputContent: {
    borderWidth: scale(1),
    borderColor: colors.borderColor,
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(8),
    fontSize: fontSize.size14,
    lineHeight: scale(22),
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    color: colors.black,
    backgroundColor: '#F9FAFB',
  },
  contentCard: {
    marginBottom: scale(8),
    width: scale(320 / 2),
  },
  contentCard1: {
    marginBottom: scale(8),
  },
});

export default ModalCusClosedMove;
