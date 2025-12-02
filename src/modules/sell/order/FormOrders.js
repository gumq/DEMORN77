/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {useFormik} from 'formik';
import _ from 'lodash';
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
  Platform,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import {Swipeable} from 'react-native-gesture-handler';
import moment from 'moment';
import routes from '@routes';
import {stylesFormOrder, stylesDetail} from './styles';
import {translateLang} from 'store/accLanguages/slide';
import {
  arrow_down_big,
  arrow_next_gray,
  close_blue,
  close_white,
  edit,
  svgi,
  trash_22,
} from 'svgImg';
import {
  ApiOrders_CheckInventory,
  ApiSaleOrder_Submit,
  ApiSaleOrders_Add,
  ApiSaleOrders_Edit,
} from 'action/Api';
import {
  Button,
  CardModalSelect,
  HeaderBack,
  InputDefault,
  ModalNotify,
  NotifierAlert,
  ModalGoods,
} from 'components';
import {
  fetchListAddress,
  fetchListFactorID,
  fetchListItems,
  fetchListQuoteContractNumber,
  fetchListTypeOfOrder,
  fetchListWareHouse,
} from 'store/accOrders/thunk';
import {
  fetchApiCustomerProfiles_GetInfo,
  fetchInformationSAP,
  fetchListCreditLimit,
} from 'store/accCredit_Limit/thunk';
import {fetchListCustomerByUserID} from 'store/accAuth/thunk';
import {hScale, scale} from 'utils/resolutions';
import {colors, fontSize} from 'themes';

const FormOrder = ({route}) => {
  const editOrder = route?.params?.editOrder;
  const dataDetail = route?.params?.dataDetail;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const {detailMenu} = useSelector(state => state.Home);
  // const {userInfo} = useSelector(state => state.Login);
  const {listCustomerByUserID, userInfo, listcompany} = useSelector(
    state => state.Login,
  );
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const {
    listQuoteContractNumber,
    listPriceGroup,
    listSalesOrders,
    listTypeOfOrder,
    listSalesOrderDocument,
    listWarehouse,
    listAddress,
  } = useSelector(state => state.Orders);
  const [valueCompany, setValueCompany] = useState(
    editOrder
      ? listcompany?.find(
          item => item?.ID?.toString() === dataDetail?.CmpnID?.toString(),
        )
      : listcompany?.[0],
  );
  const {informationSAP, listCreditLimit} = useSelector(
    state => state.CreditLimit,
  );
  const {listCustomers} = useSelector(state => state.ApprovalProcess);
  const listCustomerApproval = listCustomerByUserID?.filter(
    item =>
      item?.IsClosed === 0 &&
      item.IsCompleted === 1 &&
      item.IsActive === 1 &&
      item?.IsLock === 1 &&
      (item?.CustomerTypeID === 9704 || item?.CustomerTypeCode === 'CT'),
  );
  // console.log('listCustomerApproval', listCustomerApproval);
  const [listShipping, setlistShipping] = useState([]);
  const [isShowOptionsModalCancel, setShowOptionsModalCancel] = useState(false);
  const [valueCustomer, setValueCustomer] = useState(
    editOrder
      ? listCustomerApproval?.find(
          customer => customer.ID === Number(dataDetail?.CustomerID),
        )
      : null,
  );
  const listCustomersSupported =
    listCustomerByUserID.length > 0
      ? listCustomerByUserID.filter(
          customer =>
            customer?.CustomerSupportID === valueCustomer?.ID &&
            customer?.IsCompleted === 1 &&
            customer?.IsActive === 1 &&
            customer?.IsLock === 1 &&
            (customer?.CustomerTypeID === 9705 ||
              customer?.CustomerTypeCode === 'HT'),
        )
      : [];
  // console.log('CustomerSupportID,', listCustomersSupported);
  const customerInvoices = valueCustomer
    ? [valueCustomer, ...listCustomersSupported]
    : [];
  const [valueCustomerSupport, setValueCustomerSupport] = useState(
    editOrder
      ? listCustomersSupported?.find(
          customer => customer.ID === Number(dataDetail?.SupportCustomerID),
        )
      : null,
  );
  const [valueQuoteContractNumber, setValueQuoteContractNumber] = useState(
    editOrder
      ? listQuoteContractNumber?.find(
          item => item.ID === dataDetail?.DocumentTypeID,
        )
      : null,
  );
  const [valuePriceGroup, setValuePriceGroup] = useState(
    editOrder
      ? listPriceGroup?.find(item => item.ID === dataDetail?.PriceGroupID)
      : null,
  );
  const [selectedValueReceivingForm, setSelectedValueReceivingForm] = useState(
    editOrder
      ? listAddress?.find(item => item.ID === dataDetail?.ReceivingAddressID)
      : null,
  );
  const [valueListSalesOrders, setValueListSalesOrders] = useState(
    editOrder
      ? listSalesOrders?.find(item => item.ID === dataDetail?.SalesOrdersID)
      : listSalesOrders?.[0],
  );
  const [valueTypeOfOrder, setValueTypeOfOrder] = useState(
    editOrder
      ? listTypeOfOrder?.find(item => item?.EntryID === dataDetail?.EntryID)
      : listTypeOfOrder?.[0],
  );
  const [valueCustomerInvoice, setValueCustomerInvoice] = useState(
    editOrder
      ? listCustomerApproval?.find(
          customer => customer.ID === dataDetail?.CustomerInvoiceID,
        )
      : listCustomerApproval?.[0],
  );
  const [valueWarehouse, setValueWarehouse] = useState(
    editOrder
      ? listWarehouse?.find(item => item.ID === dataDetail?.WarehouseID)
      : null,
  );
  const [itemOutStock, setItemOutStock] = useState([]);

  const [isShowModalGoods, setIsShowModalGoods] = useState(false);
  const [selectedValueGoods, setSelectedValueGoods] = useState(
    editOrder ? dataDetail?.Items : [],
  );

  const [showInformation, setShowInformation] = useState({
    contract: true,
    payment: false,
    invoice: false,
  });

  const toggleInformation = key => {
    setShowInformation(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  useEffect(() => {
    const bodyCustomer = {
      CustomerRepresentativeID: userInfo?.UserID || 0,
      //   SalesStaffID: null,
      //   Function: 'Default',
      CmpnID: valueCompany?.ID?.toString(),
    };
    dispatch(fetchListCustomerByUserID(bodyCustomer));
  }, [valueCompany?.ID]);
  const openModalOptionsCancel = item => {
    setShowOptionsModalCancel(true);
  };

  const handleCloseOptionsMoalCancel = () => {
    setShowOptionsModalCancel(false);
  };

  const openModalAddProducts = () => {
    setIsShowModalGoods(!isShowModalGoods);
  };

  const handleCloseModalProducts = () => {
    setIsShowModalGoods(!isShowModalGoods);
  };

  const initialValues = {
    Note: editOrder ? dataDetail?.Note : '',
    FactorID: editOrder ? valueListSalesOrders : '',
    EntryID: editOrder ? valueTypeOfOrder : '',
    OID: editOrder ? dataDetail?.OID : '',
    CustomerID: editOrder ? valueCustomer : 0,
    SupportCustomerID: editOrder ? valueCustomerSupport : 0,
    ItemsAmount: editOrder ? 0 : 0, // will compute later
    VATAmount: editOrder ? 0 : 0,
    TotalAmount: editOrder ? 0 : 0,
    TotalAmountVND: editOrder ? 0 : 0,
    WarehouseID: editOrder ? valueWarehouse : 0,
    BusinessNote: editOrder ? dataDetail?.BusinessNote : '',
    CustomerNote: editOrder ? dataDetail?.CustomerNote : '',
    BillBusinessNote: editOrder ? dataDetail?.BillBusinessNote : '',
    BillCustomerNote: editOrder ? dataDetail?.BillCustomerNote : '',
    CustomerInvoiceID: valueCustomerInvoice?.ID || 0,
    Items: selectedValueGoods || [],
  };

  const {values, errors, touched, handleChange, handleBlur, setFieldValue} =
    useFormik({
      initialValues,
    });

  const stockStatus =
    itemOutStock?.length > 0
      ? languageKey('_out_of_stock')
      : languageKey('_in_stock');
  const totalGoodsMoney = (selectedValueGoods || []).reduce(
    (sum, item) => sum + (Number(item.ItemAmount) || 0),
    0,
  );

  const totalTax = (selectedValueGoods || []).reduce(
    (sum, item) => sum + (Number(item.VATAmount) || 0),
    0,
  );
  const totalAmount = totalGoodsMoney + totalTax;

  const creditStatus =
    informationSAP?.SAPConvertedRemainingLimitSO < totalAmount;
  // console.log('creditStatus',creditStatus)
  const weight = (selectedValueGoods || []).reduce(
    (sum, item) => sum + (Number(item.NetWeight) || 0),
    0,
  );

  const totalWeight = (selectedValueGoods || []).reduce(
    (sum, item) => sum + (Number(item.GrossWeight) || 0),
    0,
  );
  useEffect(() => {
    if (editOrder && listSalesOrders?.length > 0) {
      const found = listSalesOrders.find(
        item => item.ID?.toString() === dataDetail?.SalesOrdersID?.toString(),
      );
      setValueListSalesOrders(found || null);
    } else if (!editOrder && listSalesOrders?.length > 0) {
      setValueListSalesOrders(listSalesOrders[0]);
    }
  }, [editOrder, listSalesOrders]);

  useEffect(() => {
    if (editOrder && listTypeOfOrder?.length > 0) {
      const found = listTypeOfOrder.find(
        item => item.EntryID?.toString() === dataDetail?.EntryID?.toString(),
      );
      setValueTypeOfOrder(found || null);
    } else if (!editOrder && listTypeOfOrder?.length > 0) {
      setValueTypeOfOrder(listTypeOfOrder[0]);
    }
  }, [editOrder, listTypeOfOrder]);
  useEffect(() => {
    if (editOrder && listCustomerApproval?.length > 0) {
      const found = listCustomerApproval.find(
        customer =>
          customer.ID?.toString() === dataDetail?.CustomerInvoiceID?.toString(),
      );
      setValueCustomerInvoice(found || null);
    } else if (!editOrder && listCustomerApproval?.length > 0) {
      setValueCustomerInvoice(listCustomerApproval[0]);
    }
  }, [editOrder, listCustomerApproval]);
  useEffect(() => {
    if (listWarehouse?.length > 0) {
      if (editOrder) {
        const found = listWarehouse.find(
          item => item.ID?.toString() === dataDetail?.WarehouseID?.toString(),
        );
        setValueWarehouse(found || null);
      } else {
        setValueWarehouse(listWarehouse[0] || null);
      }
    } else {
      setValueWarehouse(null);
    }
  }, [editOrder, listWarehouse, dataDetail?.WarehouseID]);
  useEffect(() => {
    if (editOrder && Array.isArray(dataDetail?.Items)) {
      setSelectedValueGoods(dataDetail.Items);
    } else if (!editOrder) {
      setSelectedValueGoods([]);
    }
  }, [editOrder, dataDetail?.Items]);
  useEffect(() => {
    if (listQuoteContractNumber?.length > 0) {
      if (editOrder) {
        const found = listQuoteContractNumber.find(
          item =>
            item.ID?.toString() === dataDetail?.DocumentTypeID?.toString(),
        );
        setValueQuoteContractNumber(found || null);
      } else {
        setValueQuoteContractNumber(listQuoteContractNumber[0] || null);
      }
    } else {
      setValueQuoteContractNumber(null);
    }
  }, [editOrder, listQuoteContractNumber, dataDetail?.DocumentTypeID]);

  const handleSave = _.debounce(
    async () => {
      const errors = [];
      if (!valueCompany?.CompanyConfigName) {
        errors.push(languageKey('_choose_a_company'), 'valueCompany');
      }
      if (!valueListSalesOrders?.Name) {
        errors.push(
          languageKey('Please select an order'),
          'valueListSalesOrders',
        );
      }
      if (!valueTypeOfOrder?.EntryName) {
        errors.push(
          languageKey('Please select order type'),
          'valueTypeOfOrder',
        );
      }
      if (!valueCustomer?.Name) {
        errors.push(languageKey('_please_select_subject'), 'valueCustomer');
      }
      if (!valueWarehouse?.Name) {
        errors.push(
          languageKey('Please select a price group'),
          'valueWarehouse',
        );
      }

      if (!valuePriceGroup?.Name) {
        errors.push(
          languageKey('Please select warehouse to pick up goods'),
          'valuePriceGroup',
        );
      }
      if (errors.length > 0) {
        Alert.alert(errors[0]);
        return;
      }
      const body = {
        Note: values?.Note || (editOrder ? dataDetail?.Note : ''),
        Extention1: editOrder ? dataDetail?.Extention1 : '',
        Extention2: editOrder ? dataDetail?.Extention2 : '',
        Extention3: editOrder ? dataDetail?.Extention3 : '',
        Extention4: editOrder ? dataDetail?.Extention4 : '',
        Extention5: editOrder ? dataDetail?.Extention5 : '',
        Extention6: editOrder ? dataDetail?.Extention6 : '',
        Extention7: editOrder ? dataDetail?.Extention7 : '',
        Extention8: editOrder ? dataDetail?.Extention8 : '',
        Extention9: editOrder ? dataDetail?.Extention9 : '',
        Extention10: editOrder ? dataDetail?.Extention10 : '',
        Extention11: editOrder ? dataDetail?.Extention11 : '',
        Extention12: editOrder ? dataDetail?.Extention12 : '',
        Extention13: editOrder ? dataDetail?.Extention13 : '',
        Extention14: editOrder ? dataDetail?.Extention14 : '',
        Extention15: editOrder ? dataDetail?.Extention15 : '',
        Extention16: editOrder ? dataDetail?.Extention16 : '',
        Extention17: editOrder ? dataDetail?.Extention17 : '',
        Extention18: editOrder ? dataDetail?.Extention18 : '',
        Extention19: editOrder ? dataDetail?.Extention19 : '',
        Extention20: editOrder ? dataDetail?.Extention20 : '',
        FactorID:
          valueListSalesOrders?.FactorID ??
          (editOrder ? dataDetail?.FactorID : undefined),
        EntryID:
          valueTypeOfOrder?.EntryID ??
          (editOrder ? dataDetail?.EntryID : undefined),
        OID: editOrder ? dataDetail?.OID : values?.OID || '',
        ODate: editOrder
          ? dataDetail?.ODate
            ? new Date(dataDetail.ODate)
            : new Date()
          : new Date(),
        SAPID: editOrder ? dataDetail?.SAPID : '',
        LemonID: editOrder ? dataDetail?.LemonID : '',
        CustomerID:
          valueCustomer?.ID || (editOrder ? dataDetail?.CustomerID : 0),
        SupportCustomerID:
          valueCustomerSupport?.ID ||
          (editOrder ? dataDetail?.SupportCustomerID : 0),
        DocumentTypeID: editOrder ? dataDetail?.DocumentTypeID : 0,
        ReferenceID:
          valueQuoteContractNumber?.OID ??
          (editOrder ? dataDetail?.ReferenceID : ''),
        SalesChanelID: editOrder ? dataDetail?.SalesChanelID : 0,
        GoodsTypeID: editOrder ? dataDetail?.GoodsTypeID : 0,
        ExpectedDeliveryDate: editOrder
          ? dataDetail?.ExpectedDeliveryDate
            ? new Date(dataDetail.ExpectedDeliveryDate)
            : new Date()
          : new Date(),
        PriceGroupID:
          valuePriceGroup?.ID ?? (editOrder ? dataDetail?.PriceGroupID : 0),
        PaymentTermID: editOrder ? dataDetail?.PaymentTermID : 0,
        PaymentMethodID: editOrder ? dataDetail?.PaymentMethodID : 0,
        CurrencyTypeID: editOrder ? dataDetail?.CurrencyTypeID : 17692,
        CurrencyRate: editOrder ? dataDetail?.CurrencyRate : 0,
        CurrencyDate: editOrder
          ? dataDetail?.CurrencyDate
            ? new Date(dataDetail.CurrencyDate)
            : new Date()
          : new Date(),
        RequireDepositPayment: editOrder
          ? dataDetail?.RequireDepositPayment
          : 0,
        DepositPaymentValue: editOrder ? dataDetail?.DepositPaymentValue : 0,
        IsCOD: editOrder ? dataDetail?.IsCOD ?? 1 : 1,
        IsDeliveryOnce: editOrder ? dataDetail?.IsDeliveryOnce ?? 1 : 1,
        BusinessUserID: editOrder ? dataDetail?.BusinessUserID : 0,
        BusinessSupportID: editOrder ? dataDetail?.BusinessSupportID : 0,
        SaleLots: editOrder
          ? dataDetail?.SaleLots
          : values?.SaleLots || 'string',
        IsCustomer: editOrder ? dataDetail?.IsCustomer ?? 0 : 0,
        IsMTS: editOrder ? dataDetail?.IsMTS ?? 0 : 0,
        CheckCreditLimit: creditStatus ? 1 : 0,
        ItemsAmount:
          totalGoodsMoney || (editOrder ? dataDetail?.ItemsAmount || 0 : 0),
        VATAmount: totalTax || (editOrder ? dataDetail?.VATAmount || 0 : 0),
        TotalAmount:
          totalAmount || (editOrder ? dataDetail?.TotalAmount || 0 : 0),
        RemainAmount: editOrder ? dataDetail?.RemainAmount || 0 : 0,
        TotalAmountVND:
          totalAmount || (editOrder ? dataDetail?.TotalAmountVND || 0 : 0),
        RemainAmountVND: editOrder ? dataDetail?.RemainAmountVND || 0 : 0,
        ShippingUnitID: editOrder ? dataDetail?.ShippingUnitID : 192843,
        ShippingTypeID: editOrder ? dataDetail?.ShippingTypeID : 0,
        ReceiverName:
          values?.ReceiverName || (editOrder ? dataDetail?.ReceiverName : ''),
        LicensePlate:
          values?.LicensePlate || (editOrder ? dataDetail?.LicensePlate : ''),
        ReceiverPhone:
          values?.ReceiverPhone || (editOrder ? dataDetail?.ReceiverPhone : ''),
        ReceiverIdentityCode:
          values?.ReceiverIdentityCode ||
          (editOrder ? dataDetail?.ReceiverIdentityCode : ''),
        ReceivingCustomerID: editOrder ? dataDetail?.ReceivingCustomerID : 0,
        ReceivingAddressID:
          selectedValueReceivingForm?.ID ??
          (editOrder ? dataDetail?.ReceivingAddressID : 0),
        ActualReceivingAddressID: editOrder
          ? dataDetail?.ActualReceivingAddressID
          : 0,
        ActualReceivingAddress:
          values?.ActualReceivingAddress ||
          (editOrder ? dataDetail?.ActualReceivingAddress : ''),
        CustomerNote:
          values?.CustomerNote || (editOrder ? dataDetail?.CustomerNote : ''),
        BusinessNote:
          values?.BusinessNote || (editOrder ? dataDetail?.BusinessNote : ''),
        AccountantNote:
          values?.AccountantNote ||
          (editOrder ? dataDetail?.AccountantNote : ''),
        DeliveryNote:
          values?.DeliveryNote || (editOrder ? dataDetail?.DeliveryNote : ''),
        IncotermID: editOrder ? dataDetail?.IncotermID : 0,
        DeliveryTermID: editOrder ? dataDetail?.DeliveryTermID : 0,
        OrderNote:
          values?.OrderNote || (editOrder ? dataDetail?.OrderNote : ''),
        DeliveryPickupPointID: editOrder
          ? dataDetail?.DeliveryPickupPointID
          : 0,
        DeliveryToID: editOrder ? dataDetail?.DeliveryToID : 0,
        DeparturePortID: editOrder ? dataDetail?.DeparturePortID : 0,
        DischargePortID: editOrder ? dataDetail?.DischargePortID : 0,
        DeliveryDueDate: editOrder
          ? dataDetail?.DeliveryDueDate
            ? new Date(dataDetail.DeliveryDueDate)
            : new Date()
          : new Date(),
        Weight: weight || (editOrder ? dataDetail?.Weight || 0 : 0),
        TotalWeight:
          totalWeight || (editOrder ? dataDetail?.TotalWeight || 0 : 0),
        FactoryID: editOrder ? dataDetail?.FactoryID : 0,
        WarehouseID:
          valueWarehouse?.ID || (editOrder ? dataDetail?.WarehouseID : 0),
        DeparturePointID: editOrder ? dataDetail?.DeparturePointID : 0,
        PickupPointID: editOrder ? dataDetail?.PickupPointID : 0,
        CustReference: '1',
        // values?.CustReference || (editOrder ? dataDetail?.CustReference : ''),
        Description:
          values?.Description || (editOrder ? dataDetail?.Description : ''),
        CostCenter:
          values?.CostCenter || (editOrder ? dataDetail?.CostCenter : ''),
        IsCrossSale: editOrder ? dataDetail?.IsCrossSale : 0,
        ApplyDiscount: editOrder ? dataDetail?.ApplyDiscount ?? 0 : 0,
        ApplyPromotion: editOrder ? dataDetail?.ApplyPromotion ?? 0 : 0,
        ApplyExhibition: editOrder ? dataDetail?.ApplyExhibition ?? 0 : 0,
        ApplyShipping: editOrder ? dataDetail?.ApplyShipping ?? 0 : 0,
        BillCustomerNote:
          values?.BillCustomerNote ||
          (editOrder ? dataDetail?.BillCustomerNote : ''),
        BillBusinessNote:
          values?.BillBusinessNote ||
          (editOrder ? dataDetail?.BillBusinessNote : ''),
        BillAccountantNote:
          values?.BillAccountantNote ||
          (editOrder ? dataDetail?.BillAccountantNote : ''),
        BillDeliveryNote:
          values?.BillDeliveryNote ||
          (editOrder ? dataDetail?.BillDeliveryNote : ''),
        PaymentCustomerID: editOrder ? dataDetail?.PaymentCustomerID : 0,
        CustomerInvoiceID:
          valueCustomerInvoice?.ID ||
          (editOrder ? dataDetail?.CustomerInvoiceID : 0),
        OtherEmail:
          values?.OtherEmail || (editOrder ? dataDetail?.OtherEmail : ''),
        Items: selectedValueGoods || (editOrder ? dataDetail?.Items || [] : []),
        CmpnID: valueCompany?.ID?.toString() || '',
        // ShippingUnitID: 192843,
        // UnitID:
        // TotalAmount: 642591500,
        // VATAmount: 47599370,
        // ItemAmount: 594992124,
      };
      console.log('body', body);
      try {
        const result = editOrder
          ? await ApiSaleOrders_Edit(body)
          : await ApiSaleOrders_Add(body);
        const responeData = result.data;
        console.log('responeData', responeData);
        if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
          setSelectedValueGoods([]);
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData.Message}`,
            'success',
          );
          navigation.navigate(routes.OrdersScreen);
        } else {
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
        OID: dataDetail?.OID,
        IsLock: dataDetail?.IsLock === 0 ? 1 : 0,
      };
      try {
        const result = await ApiSaleOrder_Submit(body);
        const responeData = result.data;
        if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData.Message}`,
            'success',
          );
          navigation.navigate(routes.OrdersScreen);
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

  const handleCheckInventory = _.debounce(
    async () => {
      const itemCheck = selectedValueGoods?.map(item => ({
        ItemID: item?.ItemID,
        Quantity: item?.OrderedQuantity,
        WarehouseID: valueWarehouse?.ID,
      }));
      const body = {
        Items: itemCheck,
      };
      console.log('body', body);
      try {
        const result = await ApiOrders_CheckInventory(body);
        const responeData = result.data;
        console.log('responeData', responeData);
        if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
          setItemOutStock(responeData?.Result);
        } else {
          setItemOutStock([]);
        }
      } catch (error) {
        console.log('handleCheckInventory', error);
      }
    },
    2000,
    {leading: true, trailing: false},
  );

  useEffect(() => {
    if (valueListSalesOrders) {
      const body = {
        FactorID: valueListSalesOrders?.FactorID,
        EntryID: detailMenu?.entryId,
      };
      dispatch(fetchListTypeOfOrder(body));
    }
  }, [valueListSalesOrders]);

  useEffect(() => {
    if (valueTypeOfOrder && valueCustomer && valuePriceGroup) {
      const bodyQuote = {
        FactorID: detailMenu?.factorId,
        EntryID: valueTypeOfOrder?.EntryID,
        ReferenceFactorID: valueQuoteContractNumber?.FactorID || '',
        ReferenceEntryID: valueQuoteContractNumber?.EntryID || '',
        ReferenceID: valueQuoteContractNumber?.OID || '',
        CustomerID: valueCustomer?.ID || 0,
        PriceGroupID: valuePriceGroup?.ID || 0,
        ApplyDiscount: 1,
        ApplyPromotion: 1,
        ApplyExhibition: 1,
        ApplyShipping: 1,
        CmpnID: valueCompany?.ID?.toString() || '',
      };
      console.log('bodyQuote', bodyQuote);
      dispatch(fetchListItems(bodyQuote));
    }
  }, [valueTypeOfOrder, valueCustomer, valuePriceGroup]);

  useEffect(() => {
    if (valueCustomer) {
      const body = {
        CustomerID: valueCustomer?.ID,
      };
      // console.log('body', body);
      dispatch(fetchListQuoteContractNumber(body));
      setValueCustomerSupport(
        listCustomersSupported?.length ? listCustomersSupported?.[0] : null,
      );
      setValueQuoteContractNumber(
        listSalesOrderDocument?.length ? listSalesOrderDocument?.[0] : null,
      );
      setValuePriceGroup(listPriceGroup?.length ? listPriceGroup?.[0] : null);
      setValueCustomerInvoice(
        customerInvoices?.length ? customerInvoices?.[0] : null,
      );
      if (valueCompany?.ID) {
        const bodysp = {
          ID: valueCustomer?.ID,
          CmpnID: valueCompany?.ID.toString() || '',
          CusInfo: 'Shipping',
        };
        console.log('bodysp', bodysp);
        dispatch(fetchApiCustomerProfiles_GetInfo(bodysp)).then(success => {
          try {
            if (success !== false) {
              console.log('success', success);
              setlistShipping(success);
              success?.length && setSelectedValueReceivingForm(success?.[0]);
            } else {
            }
          } catch (error) {
            console.log(error);
          }
        });
      }
    }
  }, [valueCustomer, valueCompany]);

  useEffect(() => {
    if (valueQuoteContractNumber) {
      const body = {
        FactorID: valueListSalesOrders?.FactorID,
        EntryID: valueTypeOfOrder?.EntryID,
        ReferenceFactorID: valueQuoteContractNumber?.FactorID,
        ReferenceEntryID: valueQuoteContractNumber?.EntryID,
        ReferenceID: valueQuoteContractNumber?.OID,
        CustomerID: valueCustomer?.ID || 0,
      };
      dispatch(fetchListItems(body));
    }
  }, [valueQuoteContractNumber]);

  useEffect(() => {
    const body = {
      FactorID: detailMenu?.factorId,
    };
    dispatch(fetchListFactorID(body));
    dispatch(fetchListWareHouse({CategoryType: 'Warehouse'}));
    const bodyAddress = {
      CustomerID: valueCustomer?.ID,
      IsCustomer: 0,
    };
    dispatch(fetchListAddress(bodyAddress));
  }, []);

  useEffect(() => {
    if (valueCustomer) {
      const body = {
        ObjectTypeID: valueCustomer?.PartnerTypeID,
        ObjectID: valueCustomer?.ID,
      };
      dispatch(fetchInformationSAP(body));
    }
    editOrder &&
      dispatch(
        fetchListCreditLimit({
          CustomerID: valueCustomer?.ID?.toString() || 0,
          OrderID: dataDetail?.OrderID || dataDetail?.ID || dataDetail?.OID,
          TypeGet: 'Short',
        }),
      );
  }, [valueCustomer]);
  useEffect(() => {
    if (selectedValueGoods) {
      handleCheckInventory();
    }
  }, [selectedValueGoods]);

  const insets = useSafeAreaInsets();

  // ---------- Edit item modal state & handlers ----------
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [editingQuantityText, setEditingQuantityText] = useState('');
  const [editingOtherReq, setEditingOtherReq] = useState('');

  const openEditModal = index => {
    const it = selectedValueGoods?.[index] || {};
    setEditingItemIndex(index);
    setEditingQuantityText(
      String(it?.OrderedQuantity ?? it?.ApprovedQuantity ?? ''),
    );
    setEditingOtherReq(it?.OtherRequirements ?? '');
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditingItemIndex(null);
    setEditingQuantityText('');
    setEditingOtherReq('');
    setIsEditModalVisible(false);
  };

  // const saveEditModal = () => {
  //   const idx = editingItemIndex;
  //   if (idx === null || idx === undefined) {
  //     closeEditModal();
  //     return;
  //   }
  //   const parsedQty = Number(editingQuantityText) || 0;
  //   setSelectedValueGoods(prev => {
  //     const copy = [...(prev || [])];
  //     const old = copy[idx] || {};
  //     // recalc ItemAmount, VATAmount, TotalAmount, NetWeight/GrossWeight if PriceNotVAT or ConversionWeight... exist
  //     const Price = Number(old.Price || 0);
  //     const PriceNotVAT = Number(old.PriceNotVAT || old.PriceNotVAT || 0);
  //     const VATRate = Number(old.VATRate ?? old.VAT ?? 0);
  //     // If the API returns PriceNotVAT in different prop name, preserve original logic (best effort)
  //     // compute item amounts:
  //     const itemAmountNoVAT = PriceNotVAT * parsedQty;
  //     const totalOrder = Price * parsedQty;
  //     const vatAmount = totalOrder - itemAmountNoVAT;
  //     const netWeight =
  //       parsedQty * Number(old.ConversionWeightNet || old.NetWeight || 0);
  //     const grossWeight =
  //       parsedQty * Number(old.ConversionWeightGross || old.GrossWeight || 0);

  //     copy[idx] = {
  //       ...old,
  //       OrderedQuantity: parsedQty,
  //       ApprovedQuantity: parsedQty,
  //       OtherRequirements: editingOtherReq,
  //       ItemAmount: Number(itemAmountNoVAT) || 0,
  //       VATAmount: Number(vatAmount) || 0,
  //       TotalAmount: Number(totalOrder) || 0,
  //       NetWeight: Number(netWeight) || 0,
  //       GrossWeight: Number(grossWeight) || 0,
  //     };
  //     return copy;
  //   });
  //   closeEditModal();
  // };
  const saveEditModal = () => {
    const idx = editingItemIndex;
    if (idx === null || idx === undefined) {
      closeEditModal();
      return;
    }

    const parsedQty = Number(editingQuantityText) || 0;

    setSelectedValueGoods(prev => {
      const copy = [...(prev || [])];
      const old = copy[idx] || {};
      const Price = Number(old.Price ?? 0);
      let PriceNotVAT = null;
      if (old.PriceNotVAT !== undefined && old.PriceNotVAT !== null) {
        PriceNotVAT = Number(old.PriceNotVAT) || 0;
      } else if (old.PriceNoVAT !== undefined && old.PriceNoVAT !== null) {
        PriceNotVAT = Number(old.PriceNoVAT) || 0;
      } else {
        const VATRate = Number(old.VATRate ?? old.VAT ?? 0);
        if (Price > 0 && VATRate > 0) {
          PriceNotVAT = Price / (1 + VATRate / 100);
        } else if (Price > 0 && VATRate === 0) {
          PriceNotVAT = Price;
        } else {
          PriceNotVAT = Price;
        }
      }

      const VATRate = Number(old.VATRate ?? old.VAT ?? 0); // %
      const itemAmountNoVAT = parsedQty * (Number(PriceNotVAT) || 0);
      const vatAmount =
        (Number(itemAmountNoVAT) * (Number(VATRate) || 0)) / 100;
      const totalOrder = Number(itemAmountNoVAT) + Number(vatAmount);

      const netWeight =
        parsedQty * Number(old.ConversionWeightNet ?? old.NetWeight ?? 0);
      const grossWeight =
        parsedQty * Number(old.ConversionWeightGross ?? old.GrossWeight ?? 0);
      console.log('saveEditModal debug:', {
        idx,
        parsedQty,
        Price,
        PriceNotVAT,
        VATRate,
        itemAmountNoVAT,
        vatAmount,
        totalOrder,
        netWeight,
        grossWeight,
      });

      copy[idx] = {
        ...old,
        OrderedQuantity: parsedQty,
        ApprovedQuantity: parsedQty,
        OtherRequirements: editingOtherReq,
        ItemAmount: Number(itemAmountNoVAT) || 0,
        VATAmount: Number(vatAmount) || 0,
        TotalAmount: Number(totalOrder) || 0,

        NetWeight: Number(netWeight) || 0,
        GrossWeight: Number(grossWeight) || 0,
      };

      return copy;
    });

    closeEditModal();
  };

  const confirmDeleteItem = index => {
    Alert.alert(
      languageKey('_notification') || 'Xác nhận',
      languageKey('_confirm_delete_item') ||
        'Bạn có chắc chắn muốn xóa dòng này?',
      [
        {text: languageKey('_cancel') || 'Hủy', style: 'cancel'},
        {
          text: languageKey('_confirm') || 'Xóa',
          style: 'destructive',
          onPress: () => handleDeleteItem(index),
        },
      ],
    );
  };

  const handleDeleteItem = index => {
    setSelectedValueGoods(prev => (prev || []).filter((_, i) => i !== index));
  };

  // render right actions for swipe
  const renderRightActions = index => (
    <View style={{flexDirection: 'row', alignItems: 'center', paddingRight: 8}}>
      <TouchableOpacity
        onPress={() => confirmDeleteItem(index)}
        style={{
          paddingHorizontal: scale(8),
          paddingVertical: scale(20),
          justifyContent: 'center',
        }}>
        <SvgXml xml={trash_22} />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      style={[
        stylesFormOrder.container,
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
      <SafeAreaView style={stylesFormOrder.container}>
        <HeaderBack
          title={languageKey('_order_new')}
          onPress={() => navigation.goBack()}
          btn={true}
          iconBtn={close_blue}
          onPressBtn={openModalOptionsCancel}
        />
        <ScrollView
          style={stylesFormOrder.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={stylesFormOrder.footerScroll}>
          <View style={stylesFormOrder.card}>
            <View style={stylesFormOrder.input}>
              <CardModalSelect
                title={languageKey('_choose_a_company')}
                data={listcompany}
                setValue={setValueCompany}
                value={valueCompany?.CompanyConfigName}
                require={true}
                company={true}
                disabled={editOrder}
                bgColor={editOrder ? '#E5E7EB' : '#FAFAFA'}
              />
            </View>
            <View style={stylesFormOrder.input}>
              <CardModalSelect
                title={languageKey('_order')}
                data={listSalesOrders}
                setValue={setValueListSalesOrders}
                value={valueListSalesOrders?.Name}
                bgColor={'#FAFAFA'}
                require={true}
                disabled={editOrder}
                bgColor={editOrder ? '#E5E7EB' : '#FAFAFA'}
              />
            </View>
            <View style={stylesFormOrder.input}>
              <CardModalSelect
                title={languageKey('_type_of_order')}
                data={listTypeOfOrder}
                setValue={setValueTypeOfOrder}
                value={valueTypeOfOrder?.EntryName}
                bgColor={'#FAFAFA'}
                require={true}
                disabled={editOrder}
                bgColor={editOrder ? '#E5E7EB' : '#FAFAFA'}
              />
            </View>
            <View style={stylesFormOrder.input}>
              <CardModalSelect
                title={languageKey('_customer_name')}
                data={listCustomerApproval}
                setValue={setValueCustomer}
                value={valueCustomer?.Name}
                bgColor={'#FAFAFA'}
                require={true}
              />
            </View>
            <View style={stylesFormOrder.input}>
              <CardModalSelect
                title={languageKey('_quotation_contract_number')}
                data={listSalesOrderDocument}
                setValue={setValueQuoteContractNumber}
                value={valueQuoteContractNumber?.OID}
                bgColor={'#FAFAFA'}
              />
            </View>
            <View style={stylesFormOrder.input}>
              <CardModalSelect
                title={languageKey('_support_customer')}
                data={listCustomersSupported}
                setValue={setValueCustomerSupport}
                value={valueCustomerSupport?.Name}
                bgColor={'#FAFAFA'}
              />
            </View>
            <View style={stylesFormOrder.input}>
              <CardModalSelect
                title={languageKey('_price_group')}
                data={listPriceGroup}
                setValue={setValuePriceGroup}
                value={valuePriceGroup?.Name}
                bgColor={'#FAFAFA'}
                require={true}
              />
            </View>
            <View style={stylesFormOrder.input}>
              <CardModalSelect
                title={languageKey('_warehouse_goods')}
                data={listWarehouse}
                setValue={setValueWarehouse}
                value={valueWarehouse?.Name}
                bgColor={'#FAFAFA'}
                require={true}
              />
            </View>
            <InputDefault
              name="Note"
              returnKeyType="next"
              style={stylesFormOrder.input}
              value={values?.Note}
              label={languageKey('_note')}
              placeholderInput={true}
              isEdit={true}
              bgColor={'#FAFAFA'}
              labelHolder={languageKey('_enter_notes')}
              {...{touched, errors, handleBlur, handleChange, setFieldValue}}
            />
          </View>

          <View style={stylesFormOrder.containerHeader}>
            <Text style={stylesFormOrder.header}>{languageKey('_goods')}</Text>
            <Button
              style={stylesFormOrder.btnAdd}
              onPress={openModalAddProducts}>
              <Text style={stylesFormOrder.txtAdd}>{languageKey('_add')}</Text>
            </Button>
          </View>

          {isShowModalGoods ? (
            <View style={stylesFormOrder.card}>
              <ModalGoods
                setValueGoods={setSelectedValueGoods}
                showModalGoods={isShowModalGoods}
                closeModalGoods={handleCloseModalProducts}
                parentID={valueCustomer?.ID}
                factorID={valueListSalesOrders?.FactorID}
                entryID={valueTypeOfOrder?.EntryID}
                customerID={valueCustomer?.ID}
                pricegroupID={valuePriceGroup?.ID}
                referenceFactorID={valueQuoteContractNumber?.FactorID}
                referenceEntryID={valueQuoteContractNumber?.EntryID}
                referenceID={valueQuoteContractNumber?.OID}
                cmpID={valueCompany?.ID ?? ''}
              />
            </View>
          ) : (
            <View style={stylesFormOrder.containerTableFile}>
              <View style={stylesFormOrder.tableWrapper}>
                <View style={stylesFormOrder.row}>
                  <View style={stylesFormOrder.cell_40}>
                    <Text style={stylesFormOrder.txtHeaderTable}>
                      {languageKey('_product')}
                    </Text>
                  </View>
                  <View style={stylesFormOrder.cell_25}>
                    <Text style={stylesFormOrder.txtHeaderTable}>
                      {languageKey('_unit_price')}
                    </Text>
                  </View>
                  <View style={stylesFormOrder.cell_25}>
                    <Text style={stylesFormOrder.txtHeaderTable}>
                      {languageKey('_quantity')}
                    </Text>
                  </View>
                  {/* <View style={stylesFormOrder.cell_20}>
                    <Text style={stylesFormOrder.txtHeaderTable}>
                      {languageKey('_remain')}
                    </Text>
                  </View> */}
                  <View style={stylesFormOrder.cell_30}>
                    <Text style={stylesFormOrder.txtHeaderTable}>
                      {languageKey('_money')}
                    </Text>
                  </View>
                </View>

                {(selectedValueGoods || []).map((item, index) => {
                  return (
                    <Swipeable
                      key={`goods-line-${index}-${item?.ItemID || ''}`}
                      renderRightActions={() => renderRightActions(index)}
                      overshootRight={false}>
                      <View style={stylesFormOrder.containerHeaderTable}>
                        <Text style={stylesFormOrder.txtValueHeaderTable}>
                          {item.ItemName} -{' '}
                        </Text>
                        <Text style={stylesFormOrder.txtValueNoteTable}>{`(${
                          item?.OtherRequirements || '-'
                        })`}</Text>
                      </View>
                      <View
                        style={[
                          stylesFormOrder.cellResponse,
                          index === selectedValueGoods.length - 1 &&
                            stylesFormOrder.lastCell,
                        ]}>
                        <View style={stylesFormOrder.cell_40} />

                        <View style={stylesFormOrder.cell_25}>
                          <Text style={stylesFormOrder.txtValueTable}>
                            {item.Price?.toLocaleString?.() ?? item.Price}
                          </Text>
                        </View>
                        <View style={stylesFormOrder.cell_25}>
                          <TouchableOpacity
                            onPress={() => openEditModal(index)}>
                            <Text
                              style={[
                                stylesFormOrder.txtValueTable,
                                {textDecorationLine: 'underline'},
                              ]}>
                              {item.OrderedQuantity ??
                                item.ApprovedQuantity ??
                                0}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        {/* <View style={stylesFormOrder.cell_20}>
                          <Text style={stylesFormOrder.txtValueTable}>
                            {item.OrderedQuantity ?? item.ApprovedQuantity ?? 0}
                          </Text>
                        </View> */}
                        <View style={stylesFormOrder.cell_30}>
                          <Text style={stylesFormOrder.txtValueTable}>
                            {(item.TotalAmount || 0)?.toLocaleString?.('en') ??
                              item.TotalAmount}
                          </Text>
                        </View>
                      </View>
                    </Swipeable>
                  );
                })}
              </View>
            </View>
          )}

          <View style={stylesFormOrder.containerHeader}>
            <Text style={stylesFormOrder.header}>
              {languageKey('_information_delivery')}
            </Text>
          </View>
          <View style={stylesFormOrder.card}>
            <View style={stylesFormOrder.input}>
              <CardModalSelect
                title={languageKey('_delivery_address_request')}
                data={listShipping}
                setValue={setSelectedValueReceivingForm}
                value={
                  selectedValueReceivingForm
                    ? `${selectedValueReceivingForm.Address ?? ''}`
                    : ''
                }
                address={true}
                bgColor={'#F9FAFB'}
              />
            </View>
            <InputDefault
              name="BusinessNote"
              returnKeyType="next"
              style={stylesFormOrder.input}
              value={values?.BusinessNote}
              label={languageKey('_business_notes')}
              isEdit={true}
              placeholderInput={true}
              labelHolder={languageKey('_enter_notes')}
              bgColor={'#F9FAFA'}
              {...{touched, errors, handleBlur, handleChange, setFieldValue}}
            />
            <View style={stylesFormOrder.inputRead}>
              <Text style={stylesFormOrder.txtHeaderInputView}>
                {languageKey('_customer_notes')}
              </Text>
              <Text
                style={stylesFormOrder.inputView}
                numberOfLines={2}
                ellipsizeMode="tail">
                {dataDetail ? dataDetail?.CustomerNote : 'Chưa có thông tin'}
              </Text>
            </View>
          </View>

          <View style={stylesFormOrder.containerHeader}>
            <Text style={stylesFormOrder.header}>
              {languageKey('_invoice_information')}
            </Text>
            <Button
              style={stylesFormOrder.btnShowInfor}
              onPress={() => toggleInformation('invoice')}>
              <SvgXml
                xml={
                  showInformation?.invoice ? arrow_down_big : arrow_next_gray
                }
              />
            </Button>
          </View>

          {showInformation?.invoice && (
            <View style={stylesFormOrder.card}>
              <View style={stylesFormOrder.input}>
                <CardModalSelect
                  title={languageKey('_customer_invoice')}
                  data={customerInvoices}
                  setValue={setValueCustomerInvoice}
                  value={
                    valueCustomerInvoice
                      ? `${valueCustomerInvoice.TaxCode ?? ''} - ${
                          valueCustomerInvoice.Name ?? ''
                        } - ${valueCustomerInvoice.FullAddress ?? ''}`
                      : ''
                  }
                  extend={true}
                  bgColor={'#FAFAFA'}
                />
              </View>
              <InputDefault
                name="BillBusinessNote"
                returnKeyType="next"
                style={stylesFormOrder.input}
                value={values?.BillBusinessNote}
                label={languageKey('_business_notes')}
                isEdit={true}
                placeholderInput={true}
                labelHolder={languageKey('_enter_notes')}
                bgColor={'#F9FAFB'}
                {...{touched, errors, handleBlur, handleChange, setFieldValue}}
              />
              <View style={stylesFormOrder.inputRead}>
                <Text style={stylesFormOrder.txtHeaderInputView}>
                  {languageKey('_customer_notes')}
                </Text>
                <Text
                  style={stylesFormOrder.inputView}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {dataDetail
                    ? dataDetail?.BillCustomerNote
                    : 'Chưa có thông tin'}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer summary & actions */}
        <View style={stylesFormOrder.containerButtonFooter}>
          <View style={stylesFormOrder.sumaryOrder}>
            <Text style={stylesFormOrder.txtTotoalOrder}>
              {languageKey('consolidate_orders')}
            </Text>
            {!creditStatus && editOrder ? (
              <View style={stylesFormOrder.containerStatus}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={stylesFormOrder.txtCreditCheck}>
                    {languageKey('_credit_check')}
                  </Text>
                  <TouchableOpacity onPress={() => setShowCustomerModal(true)}>
                    <SvgXml
                      xml={svgi}
                      width={scale(14)}
                      height={scale(14)}
                      style={{
                        marginLeft: scale(8),
                        marginTop: scale(4),
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    stylesFormOrder.bodyStatus,
                    {backgroundColor: '#FEE2E2'},
                  ]}>
                  <Text style={[stylesFormOrder.txtStatus, {color: '#991B1B'}]}>
                    {' '}
                    {languageKey('_exceeded_limit')}
                  </Text>
                </View>
              </View>
            ) : null}
            {0 ? null : (
              <View style={stylesFormOrder.containerStatus}>
                <Text style={stylesFormOrder.txtCreditCheck}>
                  {languageKey('_inventory_check')}
                </Text>
                <View
                  style={[
                    stylesFormOrder.bodyStatus,
                    {
                      backgroundColor:
                        stockStatus === 'Hết hàng' ? '#FEE2E2' : '#DCFCE7',
                    },
                  ]}>
                  <Text
                    style={[
                      stylesFormOrder.txtStatus,
                      {
                        color:
                          stockStatus === 'Hết hàng' ? '#991B1B' : '#166534',
                      },
                    ]}>
                    {stockStatus}
                  </Text>
                </View>
              </View>
            )}
            <View style={stylesFormOrder.containerStatus}>
              <Text style={stylesFormOrder.txtCreditCheck}>
                {languageKey('_goods_money')}
              </Text>
              <Text style={stylesFormOrder.txtMonney}>
                {totalGoodsMoney.toLocaleString()} VND
              </Text>
            </View>
            <View style={stylesFormOrder.containerStatus}>
              <Text style={stylesFormOrder.txtCreditCheck}>
                {languageKey('_total_tax')}
              </Text>
              <Text style={stylesFormOrder.txtMonney}>
                {totalTax.toLocaleString()} VND
              </Text>
            </View>
            <View style={stylesFormOrder.containerStatus}>
              <Text style={stylesFormOrder.txtCreditCheck}>
                {languageKey('_total')}
              </Text>
              <Text style={stylesFormOrder.txtMonney}>
                {totalAmount.toLocaleString()} VND
              </Text>
            </View>
          </View>
          <View style={stylesFormOrder.containerFooter}>
            <Button style={stylesFormOrder.btnSave} onPress={handleSave}>
              <Text style={stylesFormOrder.txtBtnSave}>
                {languageKey('_save')}
              </Text>
            </Button>
            <Button
              style={stylesFormOrder.btnConfirm}
              disabled={dataDetail ? false : true}
              onPress={handleConfirm}>
              <Text style={stylesFormOrder.txtBtnConfirm}>
                {languageKey('_confirm')}
              </Text>
            </Button>
          </View>
        </View>

        {/* Edit Item Modal */}
        <Modal
          isVisible={isEditModalVisible}
          onBackdropPress={closeEditModal}
          onBackButtonPress={closeEditModal}
          avoidKeyboard>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: scale(12),
              padding: scale(16),
            }}>
            <Text
              style={{
                fontSize: fontSize.size16,
                fontWeight: '600',
                marginBottom: scale(12),
              }}>
              {languageKey('_edit_product') || 'Chỉnh sửa sản phẩm'}
            </Text>

            <Text style={{marginBottom: 6}}>
              {languageKey('_quantity') || 'Số lượng'}
            </Text>
            <TextInput
              keyboardType="numbers-and-punctuation"
              value={editingQuantityText}
              onChangeText={setEditingQuantityText}
              style={{
                borderWidth: 1,
                borderColor: '#D1D3DB',
                borderRadius: 8,
                padding: 8,
                marginBottom: 12,
              }}
            />

            <Text style={{marginBottom: 6}}>
              {languageKey('_other_requirements') || 'Yêu cầu khác'}
            </Text>
            <TextInput
              value={editingOtherReq}
              onChangeText={setEditingOtherReq}
              style={{
                borderWidth: scale(1),
                borderColor: '#D1D3DB',
                borderRadius: scale(8),
                padding: scale(8),
                marginBottom: scale(12),
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginLeft: scale(34),
              }}>
              <Button
                style={[
                  stylesFormOrder.btnConfirm,
                  {backgroundColor: colors.gray300},
                ]}
                onPress={closeEditModal}>
                <Text style={stylesFormOrder.txtBtnConfirm}>
                  {languageKey('_cancel') || 'Hủy'}
                </Text>
              </Button>
              <Button
                style={stylesFormOrder.btnConfirm}
                onPress={saveEditModal}>
                <Text style={stylesFormOrder.txtBtnConfirm}>
                  {languageKey('_save') || 'Lưu'}
                </Text>
              </Button>
            </View>
          </View>
        </Modal>

        <ModalNotify
          isShowOptions={isShowOptionsModalCancel}
          handleClose={handleCloseOptionsMoalCancel}
          handleAccept={() => navigation.goBack()}
          handleCancel={handleCloseOptionsMoalCancel}
          btnNameAccept={languageKey('_argee')}
          btnCancel={languageKey('_cancel')}
          content={languageKey('_cancel_creating_proposal')}
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={showCustomerModal}
          onRequestClose={() => setShowCustomerModal(false)}
          backdropTransitionOutTiming={450}
          backdropOpacity={0.35}
          avoidKeyboard={true}
          onBackButtonPress={() => setShowCustomerModal(false)}
          onBackdropPress={() => setShowCustomerModal(false)}
          style={{
            margin: 0,
            justifyContent: 'flex-end',
            backgroundColor: colors.gray200,
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: scale(16),
              borderTopRightRadius: scale(16),
              maxHeight: hScale ? hScale(700) : 700,
              paddingBottom: scale(24),
              // shadow
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: scale(10),
              elevation: scale(10),
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() => setShowCustomerModal(false)}
                style={{alignSelf: 'flex-end', marginBottom: 10}}>
                <SvgXml xml={close_white} />
              </TouchableOpacity>

              <View style={[stylesDetail.cardFooter]}>
                <Text style={stylesDetail.headerProgram}>
                  {languageKey('_current_limit')}
                </Text>

                {/* --- Dòng: Tiền tệ + Tỷ giá --- */}
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_currency')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {valueCustomer?.CurrencyName || ''}
                    </Text>
                  </View>
                  <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_exchange_rate')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {valueCustomer?.ExchangeRate}
                    </Text>
                  </View>
                </View>

                {/* --- Dòng: Hiệu lực từ / Hết hạn --- */}
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {'Hiệu lực từ'}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {valueCustomer?.LimitFromDate
                        ? moment(valueCustomer?.LimitFromDate).format(
                            'DD/MM/YYYY',
                          )
                        : ''}
                    </Text>
                  </View>
                  <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_expiration')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {valueCustomer?.LimitEndDate
                        ? moment(valueCustomer?.LimitEndDate).format(
                            'DD/MM/YYYY',
                          )
                        : ''}
                    </Text>
                  </View>
                </View>

                {/* --- Hạn mức nhận đơn --- */}
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      Hạn mức nhận đơn
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {Number(
                        valueCustomer?.GrantedLimitOD || 0,
                      ).toLocaleString('en-US')}
                    </Text>
                  </View>
                  <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      Hạn mức nhận đơn (VNĐ)
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {Number(
                        valueCustomer?.GrantedLimitAmntOD || 0,
                      ).toLocaleString('en-US')}
                    </Text>
                  </View>
                </View>

                <View style={stylesDetail.containerBodyCard}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    Hạn mức nhận đơn còn lại (VND)
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {Number(
                      valueCustomer?.GrantedLimitNowOD || 0,
                    ).toLocaleString('en-US')}
                  </Text>
                </View>

                {/* --- Hạn mức giao --- */}
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>Hạn mức giao</Text>
                    <Text style={stylesDetail.contentBody}>
                      {Number(
                        valueCustomer?.GrantedLimitSO || 0,
                      ).toLocaleString('en-US')}
                    </Text>
                  </View>
                  <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      Hạn mức giao (VNĐ)
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {Number(
                        valueCustomer?.GrantedLimitAmntSO || 0,
                      ).toLocaleString('en-US')}
                    </Text>
                  </View>
                </View>

                <View style={stylesDetail.containerBodyCard}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    Hạn mức giao còn lại (VNĐ)
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {Number(
                      valueCustomer?.GrantedLimitNowSO || 0,
                    ).toLocaleString('en-US')}
                  </Text>
                </View>

                {/* --- Công nợ --- */}
                <Text style={stylesDetail.headerProgram}>Công nợ</Text>

                <View style={stylesFormOrder.containerBodyCard}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    Công nợ hiện tại
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {Number(valueCustomer?.TotalDebit || 0).toLocaleString(
                      'en-US',
                    )}
                  </Text>
                </View>

                <View style={stylesDetail.containerBodyCard}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    Công nợ trong hạn
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {Number(valueCustomer?.NotDueDebit || 0).toLocaleString(
                      'en-US',
                    )}
                  </Text>
                </View>

                <View style={stylesDetail.containerBodyCard}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    Công nợ quá hạn
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {Number(valueCustomer?.TotalOverDebit || 0).toLocaleString(
                      'en-US',
                    )}
                  </Text>
                </View>

                {/* --- Thông tin bán hàng --- */}
                <Text style={stylesDetail.headerProgram}>
                  {languageKey('_sale_information')}
                </Text>

                <View style={stylesFormOrder.containerBodyCard}>
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

                {/* --- Bảng bán hàng 3 ngày --- */}
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
                        index === (informationSAP?.Orders?.length || 0) - 1 &&
                          stylesDetail.lastCell,
                      ]}
                      key={index}>
                      <View style={stylesDetail.cell_table}>
                        <Text style={stylesDetail.valueRow}>
                          {item?.ODate
                            ? moment(item?.ODate).format('DD/MM/YYYY')
                            : ''}
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
            </ScrollView>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default FormOrder;
