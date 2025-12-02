/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {useFormik} from 'formik';
import Modal from 'react-native-modal';
import {SvgXml} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  ScrollView,
  FlatList,
  Alert,
  Linking,
  TouchableOpacity,
} from 'react-native';

import {Button} from '../buttons';
import {colors, fontSize} from 'themes';
import {hScale, scale} from '@resolutions';
import {
  close_red,
  close_white,
  location,
  phone,
  trash_22,
  user_red,
} from 'svgImg';
import {translateLang} from 'store/accLanguages/slide';
import {
  InputDefault,
  CardModalSelect,
  Switch,
  InputLocationnew,
  CardModalProvince,
} from 'components';
import Geolocation from 'react-native-geolocation-service';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {
  fetchListProvinceCity,
  fetchListWardCommune,
} from 'store/accCustomer_Profile/thunk';
import * as Yup from 'yup';
const {height} = Dimensions.get('window');

const ModalDelivery = ({
  setValueShipping,
  dataEdit,
  parentID,
  cmpnID,
  disable = false,
}) => {
  const dispatch = useDispatch();
  const languageKey = useSelector(translateLang);
  const {
    listWarehouseMD,
    listImportPort,
    listExportPort,
    listAddress,
    listNation,
    listProvinceCity,
    listWardCommune,
    listReceivingForm,
  } = useSelector(state => state.CustomerProfile);
  const [isShowModalDelivery, setIsShowModalDelivery] = useState(false);
  const [listShipping, setListShipping] = useState([]);
  const [switchStates, setSwitchStates] = useState(true);
  const [selectedValueExportPort, setSelectedValueExportPort] = useState(null);
  const [selectedValueImportPort, setSelectedValueImportPort] = useState(null);
  const [selectedValuetWarehouse, setSelectedValuetWarehouse] = useState(null);
  const [selectedValuetAddress, setSelectedValuetAddress] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedValueReceivingForm, setSelectedValueReceivingForm] = useState(
    listReceivingForm?.filter(item => item?.Code === 'HN_0002')?.[0],
  );
  const [valueNation, setValueNation] = useState(null);
  const [valueProvinceCity, setValueProvinceCity] = useState(null);
  const [valueWardCommune, setValueWardCommune] = useState(null);
  const [valueLocation, setValueLocation] = useState('0,0');
  const [address, setAddress] = useState('');
  const [addressQuery, setAddressQuery] = useState('');
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

  const handleLocationChange = gps => {
    setValueLocation(gps);
  };

  const handleAddressChange = addr => {
    // 1) tách, lọc cơ bản
    const partsRaw = (addr || '')
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);
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

    // shortAddress: phần trước phường nếu có, ngược lại lấy 3 phần đầu
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
      if (foundNation) {
        setValueNation(foundNation);
      }
    }
  };

  // Permissions & location helpers
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
  const handleGetLong = () => {
    setTimeout(() => {
      checkPermissionFineLocation();
    }, 500);
  };
  // Gọi điện
  const handleCall = async phone => {
    if (!phone) {
      Alert.alert('Thông báo', 'Không có số điện thoại.');
      return;
    }
    const cleaned = String(phone)
      .trim()
      .replace(/[^+\d]/g, '');
    const url = `tel:${cleaned}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else Alert.alert('Lỗi', 'Thiết bị không thể thực hiện cuộc gọi.');
    } catch (err) {
      console.warn('handleCall error', err);
    }
  };
  const handleOpenMap = coords => {
    if (!coords) {
      Alert.alert('Thông báo', 'Không có tọa độ để mở bản đồ.');
      return;
    }
    const [a, b] = coords.split(',').map(x => x.trim());
    let lat = parseFloat(a);
    let lon = parseFloat(b);
    if (lat > 100) {
      lat = parseFloat(b);
      lon = parseFloat(a);
    }

    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lon}`,
      android: `geo:${lat},${lon}?q=${lat},${lon}`,
    });

    Linking.openURL(url).catch(err => {
      console.warn('Cannot open map', err);
      Alert.alert('Lỗi', 'Không thể mở bản đồ.');
    });
  };

  // Formik
  const initialValues = {
    CategoryType: 'Shipping',
    IsActive: 1,
    LemonID: '',
    SAPID: '',
    WarehouseName: '',
    Address: '',
    Name: '',
    PhoneNumber: '',
    Lat: '',
    Long: '',
    ReceivingFormID: 0,
    SpecialRequest: '',
    DefaultWarehouseID: 0,
    ShipmentPortID: 0,
    DestinationPortID: 0,
    IdentityCardNumber: '',
    Note: '',
    AddressNH: '',
  };

  const validationSchema = Yup.object().shape({
    // WarehouseName: Yup.string().trim().required('Vui lòng nhập nơi nhận hàng'),
    Address: Yup.string().trim().required('Vui lòng nhập địa chỉ'),
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    validateForm,
    setFieldTouched,
    handleSubmit,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: vals => {
      // không cần xử lý ở đây vì handleAddNewShipping sẽ gọi handleSubmit() khi hợp lệ
    },
  });
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
    if (!dataEdit || !dataEdit.length) return;

    const convertedData = dataEdit.map(item => ({
      CategoryType: 'Shipping',
      LemonID: item.LemonID || 'string',
      SAPID: item.SAPID || 'string',
      IsActive: item.IsActive ?? 1,
      WarehouseName: item.WarehouseName || '',
      AddressID: Number(item.AddressID) || 0,
      Name: item.Name || '',
      PhoneNumber: item.PhoneNumber || '',
      LicensePlate: item.LicensePlate || '',
      DrivingLicense: item.DrivingLicense || '',
      CustomerID: parentID || 0,
      Lat: item.Lat || 0,
      Long: item.Long || 0,
      ReceivingFormID: item.ReceivingFormID || 0,
      ReceivingFormName: listReceivingForm?.find(
        name => name.ID === item?.ReceivingFormID,
      )?.Name,
      SpecialRequest: item.SpecialRequest || '',
      DefaultWarehouseID: item.DefaultWarehouseID || 0,
      ShipmentPortID: item.ShipmentPortID || 0,
      DestinationPortID: item.DestinationPortID || 0,
      CmpnID: item?.CmpnID?.toString(),
      ID: item?.ID,
      Note: item.Note || '',
      Address: item.Address || '',
      Street: item?.Street || '',
      AddressName: item.AddressName || '',
    }));
    setListShipping(convertedData);
    setValueShipping(convertedData);
    const first = dataEdit[0];
    if (first) {
      if (first.Address) {
        handleAddressChange(first.Address);
      }
      if (first.NationID && Array.isArray(listNation) && listNation.length) {
        const foundNation = listNation.find(
          n => Number(n.ID) === Number(first.NationID),
        );
        if (foundNation) setValueNation(foundNation);
      }

      if (
        first.ProvinceID &&
        Array.isArray(listProvinceCity) &&
        listProvinceCity.length
      ) {
        const foundP = listProvinceCity.find(
          p => Number(p.ID) === Number(first.ProvinceID),
        );
        if (foundP) setValueProvinceCity(foundP);
      }

      if (
        first.WardID &&
        Array.isArray(listWardCommune) &&
        listWardCommune.length
      ) {
        const foundW = listWardCommune.find(
          w => Number(w.ID) === Number(first.WardID),
        );
        if (foundW) setValueWardCommune(foundW);
      }
    }
  }, [dataEdit, listNation, listProvinceCity, listWardCommune]);
  const openShowModal = () => setIsShowModalDelivery(true);
  const closeModal = () => setIsShowModalDelivery(false);
  const handleSwitchToggle = () => setSwitchStates(!switchStates);
  const handleEditShipping = (item, index) => {
    setSwitchStates(item?.IsActive === 1);
    setFieldValue('WarehouseName', item?.WarehouseName || '');
    setFieldValue('Name', item?.Name || '');
    setFieldValue('PhoneNumber', item?.PhoneNumber || '');
    setFieldValue('LicensePlate', item?.LicensePlate || '');
    setFieldValue('DrivingLicense', item?.DrivingLicense || '');
    setFieldValue('SpecialRequest', item?.SpecialRequest || '');
    setFieldValue('Note', item?.Note || '');

    setSelectedValuetAddress({
      ID: item?.AddressID,
      Name: listAddress?.find(r => r.ID === item?.AddressID)?.Name || '',
    });

    setSelectedValueReceivingForm({
      ID: item?.ReceivingFormID,
      Name:
        listReceivingForm?.find(r => r.ID === item?.ReceivingFormID)?.Name ||
        '',
    });

    setSelectedValueImportPort({
      ID: item?.DestinationPortID,
      Name:
        listImportPort?.find(p => p.ID === item?.DestinationPortID)?.Name || '',
    });

    setSelectedValueExportPort({
      ID: item?.ShipmentPortID,
      Name:
        listExportPort?.find(p => p.ID === item?.ShipmentPortID)?.Name || '',
    });

    setSelectedValuetWarehouse({
      ID: item?.DefaultWarehouseID,
      Name:
        listWarehouseMD?.find(w => w.ID === item?.DefaultWarehouseID)?.Name ||
        '',
    });
    if (item.Long != null && item.Lat != null) {
      setValueLocation(`${item.Long}, ${item.Lat}`);
    }
    if (item.Address) {
      handleAddressChange(item.Address);
    }

    setEditingIndex(index);
    setIsShowModalDelivery(true);
  };

  // const handleAddNewShipping = async () => {
  //   setFieldTouched('WarehouseName', true);
  //   setFieldTouched('Address', true);
  //   const ghepdc =
  //     (values?.Address || '') +
  //     (valueWardCommune?.RegionsName
  //       ? `, ${valueWardCommune?.RegionsName}`
  //       : '') +
  //     (valueProvinceCity?.RegionsName
  //       ? `, ${valueProvinceCity?.RegionsName}`
  //       : '') +
  //     (valueNation?.RegionsName ? `, ${valueNation?.RegionsName}` : '');
  //   const formErrors = await validateForm();

  //   if (Object.keys(formErrors).length > 0) {
  //     const firstError = Object.values(formErrors)[0];
  //     Alert.alert('Lỗi', firstError);
  //     return;
  //   }
  //   const newShipping = {
  //     ID: 0,
  //     CategoryType: 'Shipping',
  //     LemonID: 'string',
  //     SAPID: 'string',
  //     CmpnID: cmpnID?.toString(),
  //     CustomerID: parentID || 0,
  //     IsActive: switchStates ? 1 : 0,
  //     WarehouseName: values?.WarehouseName || '',
  //     AddressID: Number(selectedValuetAddress?.ID) || 0,
  //     Address: ghepdc,
  //     AddressName: ghepdc,
  //     Name: values?.Name || '',
  //     PhoneNumber: values?.PhoneNumber || '',
  //     LicensePlate: values?.LicensePlate || '',
  //     DrivingLicense: values?.DrivingLicense || '',
  //     Lat:
  //       valueLocation?.substring(valueLocation?.indexOf(',') + 1)?.trim() || 0,
  //     Long:
  //       valueLocation?.substring(0, valueLocation?.indexOf(','))?.trim() || 0,
  //     ReceivingFormID: selectedValueReceivingForm?.ID,
  //     ReceivingFormName: selectedValueReceivingForm?.Name || '',
  //     SpecialRequest: values?.SpecialRequest || '',
  //     DefaultWarehouseID: selectedValuetWarehouse?.ID || 0,
  //     ShipmentPortID: selectedValueExportPort?.ID || 0,
  //     DestinationPortID: selectedValueImportPort?.ID || 0,
  //     Note: values?.Note || '',
  //   };

  //   if (editingIndex !== null) {
  //     const updatedList = [...listShipping];
  //     updatedList[editingIndex] = newShipping;
  //     setListShipping(updatedList);
  //     setValueShipping(updatedList);
  //   } else {
  //     setListShipping(prev => [...prev, newShipping]);
  //     setValueShipping(prev => [...prev, newShipping]);
  //   }

  //   resetForm();
  //   setSelectedValueReceivingForm(null);
  //   setSelectedValueExportPort(null);
  //   setSelectedValueImportPort(null);
  //   setSelectedValuetWarehouse(null);
  //   setSelectedValuetAddress(null);
  //   setEditingIndex(null);
  //   closeModal();
  // };
  const handleAddNewShipping = async () => {
    // setFieldTouched('WarehouseName', true);
    setFieldTouched('Address', true);

    const normalizedNewAddr =
      (values?.Address || '') +
      (valueWardCommune?.RegionsName
        ? `, ${valueWardCommune?.RegionsName}`
        : '') +
      (valueProvinceCity?.RegionsName
        ? `, ${valueProvinceCity?.RegionsName}`
        : '') +
      (valueNation?.RegionsName ? `, ${valueNation?.RegionsName}` : '')?.trim();

    const formErrors = await validateForm();
    if (Object.keys(formErrors).length > 0) {
      const firstError = Object.values(formErrors)[0];
      Alert.alert('Lỗi', firstError);
      return;
    }

    // kiểm tra duplicate trong listShipping (loại bỏ bản thân khi edit)
    const isDuplicate = (listShipping || []).some((it, idx) => {
      if (editingIndex !== null && idx === editingIndex) return false; // ignore chính nó khi edit
      const existingAddr = (it?.Address || '').trim();
      // dùng equalsLoose (đã có trong file) để so sánh lỏng
      return equalsLoose(existingAddr, normalizedNewAddr);
    });

    if (isDuplicate) {
      Alert.alert(
        languageKey('_notification') || 'Thông báo',
        languageKey('_duplicate_address') ||
          'Địa chỉ đã tồn tại trong danh sách.',
      );
      return;
    }

    const newShipping = {
      ID: 0,
      CategoryType: 'Shipping',
      LemonID: 'string',
      SAPID: 'string',
      CmpnID: cmpnID?.toString(),
      CustomerID: parentID || 0,
      IsActive: switchStates ? 1 : 0,
      WarehouseName: values?.WarehouseName || '',
      AddressID: Number(selectedValuetAddress?.ID) || 0,
      Address: normalizedNewAddr,
      AddressName: normalizedNewAddr,
      Street: values?.Address ?? '',
      Name: values?.Name || '',
      PhoneNumber: values?.PhoneNumber || '',
      LicensePlate: values?.LicensePlate || '',
      DrivingLicense: values?.DrivingLicense || '',
      Long:
        valueLocation?.substring(valueLocation?.indexOf(',') + 1)?.trim() || 0,
      Lat:
        valueLocation?.substring(0, valueLocation?.indexOf(','))?.trim() || 0,
      ReceivingFormID: selectedValueReceivingForm?.ID,
      ReceivingFormName: selectedValueReceivingForm?.Name || '',
      SpecialRequest: values?.SpecialRequest || '',
      DefaultWarehouseID: selectedValuetWarehouse?.ID || 0,
      ShipmentPortID: selectedValueExportPort?.ID || 0,
      DestinationPortID: selectedValueImportPort?.ID || 0,
      Note: values?.Note || '',
      NationID: valueNation?.ID || 0,
      ProvinceID: valueProvinceCity?.ID || 0,
      DistrictID: valueWardCommune?.ID || 0,
    };

    if (editingIndex !== null) {
      const updatedList = [...listShipping];
      updatedList[editingIndex] = newShipping;
      setListShipping(updatedList);
      setValueShipping(updatedList);
    } else {
      setListShipping(prev => [...prev, newShipping]);
      setValueShipping(prev => [...(prev || []), newShipping]);
    }

    resetForm();
    setValueLocation('0,0');
    setValueNation(0);
    setValueProvinceCity(0);
    setValueWardCommune(0);
    setSelectedValueReceivingForm(null);
    setSelectedValueExportPort(null);
    setSelectedValueImportPort(null);
    setSelectedValuetWarehouse(null);
    setSelectedValuetAddress(null);
    setEditingIndex(null);
    closeModal();
  };

  useEffect(() => {
    if (dataEdit && dataEdit.length > 0) {
      // handled by the updated useEffect above (so nothing extra here)
    }
  }, []);

  const handleDelete = ship => {
    setListShipping(prev => prev.filter(item => item !== ship));
    setValueShipping(prev => prev.filter(item => item !== ship));
  };

  const _keyExtractor = (item, index) => `${item.Name}-${index}`;
  const _renderItem = useCallback(
    ({item, index}) => {
      const isActive = item?.IsActive === 1;
      const statusBgColor = isActive ? '#DCFCE7' : '#FEE2E2';
      const statusTextColor = isActive ? '#166534' : '#991B1B';

      return (
        <Button
          style={disable ? styles.cardProgram1 : styles.cardProgram}
          onPress={() => handleEditShipping(item, index)}>
          <View style={disable ? styles.itemBody_two1 : styles.itemBody_two}>
            <View style={styles.containerItem}>
              <View style={styles.containerHeader}>
                <Text style={styles.txtTitleItem}>
                  {item?.ReceivingFormName}
                </Text>
                {disable === false && (
                  <Button onPress={() => handleDelete(item)}>
                    <SvgXml xml={trash_22} />
                  </Button>
                )}
              </View>
              <View style={styles.containerStatus}>
                <View
                  style={[styles.bodyStatus, {backgroundColor: statusBgColor}]}>
                  <Text style={[styles.txtStatus, {color: statusTextColor}]}>
                    {isActive
                      ? languageKey('_active')
                      : languageKey('_inactive')}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.bodyCard}>
            {item?.Address && (
              <TouchableOpacity
                style={styles.containerBody}
                activeOpacity={0.7}
                onPress={() => handleOpenMap(`${item?.Lat}, ${item?.Long}`)}>
                <SvgXml xml={location} style={{marginTop: scale(4)}} />
                <Text
                  style={styles.contentBody}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {item?.Address}
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.containerBody}>
              <SvgXml xml={user_red} />
              <Text
                style={styles.contentBody}
                numberOfLines={2}
                ellipsizeMode="tail">
                {item?.Name}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.containerBody}
              activeOpacity={0.7}
              onPress={() => handleCall(item?.PhoneNumber)}>
              <SvgXml xml={phone} />
              <Text
                style={styles.contentBody}
                numberOfLines={2}
                ellipsizeMode="tail">
                {item?.PhoneNumber}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={
              disable === true &&
              index !== listShipping?.length - 1 &&
              styles.bodyCard1
            }></View>
        </Button>
      );
    },
    [handleEditShipping, handleDelete, languageKey],
  );

  return (
    <View style={styles.container}>
      {disable === false && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: colors.graySystem2,
            paddingVertical: scale(12),
          }}>
          <Text
            style={{
              fontSize: fontSize.size16,
              fontWeight: '600',
              lineHeight: scale(24),
              fontFamily: 'Inter-SemiBold',
              color: colors.black,
              marginTop: scale(0),
              marginHorizontal: scale(12),
              marginBottom: scale(0),
            }}>
            {languageKey('_information_delivery')}
          </Text>
          <Button
            style={{
              marginRight: scale(12),
            }}
            onPress={openShowModal}>
            <Text
              style={{
                color: colors.blue,
                fontWeight: '500',
                fontFamily: 'Inter-Medium',
                fontSize: fontSize.size14,
                lineHeight: scale(22),
              }}>
              {languageKey('add')}
            </Text>
          </Button>
        </View>
      )}

      {isShowModalDelivery && disable === false && (
        <View>
          <Modal
            isVisible={isShowModalDelivery}
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
                  {languageKey('_new_delivery_infor')}
                </Text>
                <Button onPress={closeModal} style={styles.btnClose}>
                  <SvgXml xml={close_red} />
                </Button>
              </View>
              <ScrollView
                style={styles.modalContainer}
                showsVerticalScrollIndicator={false}>
                <View style={styles.row}>
                  <View>
                    <Text style={styles.txtItem}>{languageKey('_status')}</Text>
                    <Text style={styles.txtDescription}>
                      {languageKey('_active')}
                    </Text>
                  </View>
                  <Switch
                    value={switchStates}
                    onValueChange={handleSwitchToggle}
                  />
                </View>

                <InputDefault
                  name="ID"
                  returnKeyType="next"
                  style={styles.input}
                  value={'Auto'}
                  label={'ID'}
                  isEdit={false}
                  placeholderInput={true}
                  bgColor={'#E5E7EB'}
                  labelHolder={'Auto'}
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />

                <View style={styles.input}>
                  <CardModalSelect
                    title={languageKey('_form_of_receipt')}
                    data={listReceivingForm}
                    setValue={setSelectedValueReceivingForm}
                    value={selectedValueReceivingForm?.Name}
                    bgColor={'#F9FAFB'}
                  />
                </View>

                {0 ? (
                  <>
                    <InputDefault
                      name="DrivingLicense"
                      returnKeyType="next"
                      style={styles.input}
                      value={values?.DrivingLicense}
                      label={languageKey('_licensePlate')}
                      isEdit={true}
                      placeholderInput={true}
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
                    <InputDefault
                      name="Name"
                      returnKeyType="next"
                      style={styles.input}
                      value={values?.Name}
                      label={languageKey('_consignee')}
                      isEdit={true}
                      placeholderInput={true}
                      labelHolder={languageKey('_enter_the_consignee')}
                      bgColor={'#F9FAFB'}
                      {...{
                        touched,
                        errors,
                        handleBlur,
                        handleChange,
                        setFieldValue,
                      }}
                    />
                    <InputDefault
                      name="PhoneNumber"
                      returnKeyType="next"
                      style={styles.input}
                      value={values?.PhoneNumber}
                      label={languageKey('_phone')}
                      isEdit={true}
                      keyboardType={'numeric'}
                      string={true}
                      placeholderInput={true}
                      labelHolder={languageKey('_enter_phone')}
                      bgColor={'#F9FAFB'}
                      {...{
                        touched,
                        errors,
                        handleBlur,
                        handleChange,
                        setFieldValue,
                      }}
                    />
                    <InputDefault
                      name="LicensePlate"
                      returnKeyType="next"
                      style={styles.input}
                      value={values?.LicensePlate}
                      label={languageKey('_cccd_driver_license')}
                      isEdit={true}
                      keyboardType={'numeric'}
                      placeholderInput={true}
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
                  </>
                ) : (
                  <>
                    <InputLocationnew
                      returnKeyType="next"
                      style={styles.input}
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
                      onAddressChange={handleAddressChange}
                      addressQuery={addressQuery}
                      typeNote
                      dem={'0'}
                      {...{
                        touched,
                        errors,
                        handleBlur,
                        handleChange,
                        setFieldValue,
                      }}
                    />

                    <View
                      style={styles.input}
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

                    {valueNation?.ID != 1 ? null : (
                      <>
                        <View
                          style={styles.input}
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
                          style={styles.input}
                          key={valueWardCommune?.ID || 'ward'}>
                          <CardModalProvince
                            title={languageKey('_ward_commune')}
                            data={listWardCommune}
                            setValue={setValueWardCommune}
                            value={valueWardCommune?.RegionsName}
                            bgColor={'#F9FAFB'}
                            require={true}
                          />
                        </View>
                      </>
                    )}
                    <InputDefault
                      name="Address"
                      returnKeyType="next"
                      style={styles.input}
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
                    <InputDefault
                      name="WarehouseName"
                      returnKeyType="next"
                      style={styles.input}
                      value={values?.WarehouseName}
                      label={languageKey('_places_of_receipt_goods')}
                      placeholderInput={true}
                      isEdit={true}
                      labelHolder={languageKey('_enter_mport_point')}
                      bgColor={'#F9FAFB'}
                      // require={true}
                      {...{
                        touched,
                        errors,
                        handleBlur,
                        handleChange,
                        setFieldValue,
                      }}
                    />

                    <InputDefault
                      name="Name"
                      returnKeyType="next"
                      style={styles.input}
                      value={values?.Name}
                      label={languageKey('_consignee')}
                      isEdit={true}
                      placeholderInput={true}
                      labelHolder={languageKey('_enter_the_consignee')}
                      bgColor={'#F9FAFB'}
                      {...{
                        touched,
                        errors,
                        handleBlur,
                        handleChange,
                        setFieldValue,
                      }}
                    />
                    <InputDefault
                      name="PhoneNumber"
                      returnKeyType="next"
                      style={styles.input}
                      value={values?.PhoneNumber}
                      label={languageKey('_phone')}
                      isEdit={true}
                      string={true}
                      placeholderInput={true}
                      labelHolder={languageKey('_enter_phone')}
                      bgColor={'#F9FAFB'}
                      {...{
                        touched,
                        errors,
                        handleBlur,
                        handleChange,
                        setFieldValue,
                      }}
                    />
                    <InputDefault
                      name="SpecialRequest"
                      returnKeyType="next"
                      style={styles.input}
                      value={values?.SpecialRequest}
                      label={languageKey('_special_request')}
                      isEdit={true}
                      placeholderInput={true}
                      labelHolder={languageKey('_enter_special_request')}
                      bgColor={'#F9FAFB'}
                      {...{
                        touched,
                        errors,
                        handleBlur,
                        handleChange,
                        setFieldValue,
                      }}
                    />
                    {selectedValueReceivingForm?.Code === 'HN_0001' && (
                      <>
                        <View style={styles.input}>
                          <CardModalSelect
                            title={languageKey('_default_shipping_warehouse')}
                            data={listWarehouseMD}
                            setValue={setSelectedValuetWarehouse}
                            value={selectedValuetWarehouse?.Name}
                            bgColor={'#F9FAFB'}
                          />
                        </View>
                        <View style={styles.input}>
                          <CardModalSelect
                            title={languageKey('_port_of_export')}
                            data={listExportPort}
                            setValue={setSelectedValueExportPort}
                            value={selectedValueExportPort?.Name}
                            bgColor={'#F9FAFB'}
                          />
                        </View>
                        <View style={styles.input}>
                          <CardModalSelect
                            title={languageKey('_port_of_receipt')}
                            data={listImportPort}
                            setValue={setSelectedValueImportPort}
                            value={selectedValueImportPort?.Name}
                            bgColor={'#F9FAFB'}
                          />
                        </View>
                      </>
                    )}
                  </>
                )}

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

                <View style={styles.footer}>
                  <Button
                    style={styles.btnFooterModal}
                    onPress={handleAddNewShipping}>
                    <Text style={styles.txtBtnFooterModal}>
                      {languageKey('_confirm')}
                    </Text>
                  </Button>
                </View>
              </ScrollView>
            </View>
          </Modal>
        </View>
      )}

      <FlatList
        data={listShipping}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    alignContent: 'center',
    paddingVertical: scale(8),
  },
  txtBtnAdd: {
    color: colors.blue,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    fontSize: fontSize.size14,
  },
  label: {
    color: colors.black,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    fontSize: fontSize.size14,
    lineHeight: scale(22),
    marginHorizontal: scale(16),
    marginTop: scale(4),
  },
  btnAddContact: {
    borderWidth: scale(1),
    borderColor: colors.blue,
    borderRadius: scale(12),
    height: hScale(38),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scale(12),
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  optionsModalContainer: {
    height: height / 1.5,
  },
  modalContainer: {
    overflow: 'hidden',
    backgroundColor: colors.white,
    maxHeight: height / 1.5,
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: scale(1),
    borderBottomColor: colors.graySystem2,
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(8),
    borderTopRightRadius: scale(8),
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
  btnFooterModal: {
    alignItems: 'center',
    backgroundColor: colors.blue,
    borderRadius: scale(12),
    height: hScale(38),
    paddingVertical: scale(Platform.OS === 'android' ? 6 : 8),
    marginTop: scale(12),
    marginBottom: scale(Platform.OS === 'ios' ? 24 : 12),
    marginHorizontal: scale(12),
  },
  txtBtnFooterModal: {
    color: colors.white,
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(22),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scale(12),
    marginTop: scale(12),
    backgroundColor: colors.white,
  },
  txtItem: {
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    fontSize: fontSize.size14,
    lineHeight: scale(22),
    color: colors.black,
  },
  txtDescription: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    fontSize: fontSize.size12,
    lineHeight: scale(18),
    color: '#6B6F80',
  },
  input: {
    marginHorizontal: scale(12),
    marginVertical: scale(4),
  },
  cardProgram: {
    backgroundColor: colors.white,
    marginHorizontal: scale(12),
    marginTop: scale(18),
    borderRadius: scale(8),
    borderWidth: scale(1),
    borderColor: colors.borderColor,
  },
  cardProgram1: {
    backgroundColor: colors.white,
    marginHorizontal: scale(12),
    marginTop: scale(0),
    borderRadius: scale(8),
  },
  itemBody_two: {
    flexDirection: 'row',
    borderRadius: scale(12),
    padding: scale(8),
  },
  itemBody_two1: {
    flexDirection: 'row',
    borderRadius: scale(12),
    paddingHorizontal: scale(8),
  },
  containerItem: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerStatus: {
    flexDirection: 'row',
    marginVertical: scale(4),
  },
  txtTitleItem: {
    fontSize: fontSize.size16,
    fontWeight: '600',
    lineHeight: scale(24),
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
  },
  bodyStatus: {
    borderRadius: scale(4),
    paddingHorizontal: scale(6),
    paddingVertical: scale(2),
    marginRight: scale(8),
    width: 'auto',
  },
  txtStatus: {
    fontSize: fontSize.size12,
    fontWeight: '500',
    lineHeight: scale(18),
    fontFamily: 'Inter-Medium',
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
    alignItems: 'flex-start',
    marginBottom: scale(6),
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
    paddingVertical: scale(10),
    color: colors.black,
  },
  bodyCard1: {
    height: scale(1),
    width: '100%',
    backgroundColor: colors.gray200,
    marginBottom: scale(8),
    marginTop: scale(4),
  },
});

export default ModalDelivery;
