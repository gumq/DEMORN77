import React, {useEffect, useMemo, useRef, useState} from 'react';
import _ from 'lodash';
import {useFormik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  FlatList,
  InteractionManager,
  Platform,
} from 'react-native';

import routes from '@routes';
import {close_blue} from 'svgImg';
import {stylesFormOrderRequest} from './styles';
import {translateLang} from 'store/accLanguages/slide';
import {
  fetchCodeProduct,
  fetchDataGoodsTypes,
  fetchListGoodsTypes,
} from 'store/accCus_Requirement/thunk';
import {
  ApiCustomerRequests_Add,
  ApiCustomerRequests_Edit,
  ApiCustomerRequests_Submit,
} from 'action/Api';
import {
  Button,
  CardModalSelect,
  HeaderBack,
  InputDefault,
  ModalNotify,
  NotifierAlert,
  ModalSelectDate,
  AttachManyFile,
  CardModalSelectTrigger,
  UnifiedModalSelect,
} from 'components';
import { scale } from 'utils/resolutions';

const FormCustomerRequirement = ({route}) => {
  const editOrder = route?.params?.editOrder;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const {listUser} = useSelector(state => state.ApprovalProcess);
  const {listCustomerByUserID} = useSelector(state => state.Login);
  const {
    listEntry,
    listGoodsType,
    listDataGoodType,
    listCodeProduct,
    listCustomerRequestType,
    detailCusRequirement,
    listDepartment,
  } = useSelector(state => state.CusRequirement);
  const listCustomerApproval = listCustomerByUserID?.filter(
    item => item.IsClosed === 0,
  );
  const [isShowOptionsModalCancel, setShowOptionsModalCancel] = useState(false);
  const [valueCustomer, setValueCustomer] = useState(
    editOrder
      ? listCustomerApproval?.find(
          customer => customer.ID === detailCusRequirement?.CustomerID,
        )
      : null,
  );
  const [valueEntry, setValueEntry] = useState(
    editOrder
      ? listEntry?.find(
          entry => entry.EntryID === detailCusRequirement?.EntryID,
        )
      : null,
  );
  const [valueGoodsType, setValueGoodsType] = useState(
    editOrder
      ? listGoodsType?.find(
          item => item.ID === detailCusRequirement?.GoodsTypeID,
        )
      : null,
  );
  const department = listDepartment?.filter(item => item?.Extention4 === '1');
  const [valueDepartment, setValueDepartMent] = useState(
    editOrder
      ? department?.find(
          item => item.ID === detailCusRequirement?.TransferDepartmentID,
        )
      : null,
  );
  const [valueCustomerRequirement, setValueCusRequirement] = useState(
    editOrder
      ? listCustomerRequestType?.find(
          item => item.ID === detailCusRequirement?.CustomerRequestTypeID,
        )
      : null,
  );
  const unifiedModalRef = useRef(null);

  const openSelectModal = (title, data, onSelect) => {
    unifiedModalRef.current?.open({
      title,
      data,
      onSelect,
    });
  };

  const listUserByDepartment = useMemo(() => {
    return listUser
      ? listUser.filter(
          user => Number(user?.DepartmentID) === valueDepartment?.ID,
        )
      : [];
  }, [listUser, valueDepartment]);

  const [valueUser, setValueUser] = useState(
    editOrder
      ? listUserByDepartment?.find(
          item => item.UserID === detailCusRequirement?.ResponsibleEmployeeID,
        )
      : null,
  );
  const [dateStates, setDateStates] = useState({
    planDate: {
      selected: null,
      submit: null,
      visible: false,
    },
    requestDate: {
      selected: null,
      submit: null,
      visible: false,
    },
  });

  const [linkImage, setLinkImage] = useState(
    editOrder && detailCusRequirement?.RequestLink?.trim() !== ''
      ? detailCusRequirement.RequestLink
      : '',
  );
  const linkImgArray = linkImage ? linkImage.split(';').filter(Boolean) : [];
  const [images, setDataImages] = useState(linkImgArray);
  const [selectedOptions, setSelectedOptions] = useState({});

  const initSelectedOptions = () => {
    const newOptions = {};

    const fieldStr = valueGoodsType?.Extention9 || '';
    const fieldList = fieldStr.split('/').filter(Boolean);
    fieldList.forEach(field => {
      const selectedId = detailCusRequirement?.[field];
      const fieldData = listDataGoodType?.[field]?.Data || [];

      if (selectedId && selectedId !== 0) {
        const matchedOption = fieldData.find(item => item.ID === selectedId);
        if (matchedOption) {
          newOptions[field] = matchedOption;
        }
      }
    });
    setSelectedOptions(newOptions);
  };

  useEffect(() => {
    if (
      valueGoodsType?.Extention9 &&
      Object.keys(listDataGoodType || {}).length > 0 &&
      detailCusRequirement
    ) {
      initSelectedOptions();
    }
  }, [valueGoodsType, listDataGoodType, detailCusRequirement]);

  const openModalOptionsCancel = item => {
    setShowOptionsModalCancel(true);
  };

  const handleCloseOptionsMoalCancel = () => {
    setShowOptionsModalCancel(false);
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
    if (detailCusRequirement && editOrder) {
      updateDateState('planDate', {
        selected: detailCusRequirement.ODate,
        submit: detailCusRequirement.ODate,
      });
      updateDateState('requestDate', {
        selected: detailCusRequirement.RequestDueDate,
        submit: detailCusRequirement.RequestDueDate,
      });
    } else {
      const now = new Date();
      updateDateState('planDate', {selected: now});
      updateDateState('requestDate', {selected: now});
    }
  }, [detailCusRequirement]);

  const initialValues = {
    FactorID: 'CustomerRequest',
    EntryID: '',
    CustomerID: editOrder ? valueCustomer : null,
    Quantity: editOrder ? detailCusRequirement?.Quantity : '',
    CustomerRequest: editOrder ? detailCusRequirement?.CustomerRequest : '',
    BusinessRequest: editOrder ? detailCusRequirement?.BusinessRequest : '',
    RequestLink: '',
    Note: editOrder ? detailCusRequirement?.Note : '',
  };

  const {values, errors, touched, handleChange, handleBlur, setFieldValue} =
    useFormik({
      initialValues,
    });

  const getSelectedOptionsBody = () => {
    const result = {};

    Object.entries(selectedOptions).forEach(([key, value]) => {
      if (value?.ID) {
        result[key] = value.ID;
      }
    });

    return result;
  };

  const createProductName = () => {
    const goodsTypeName = valueGoodsType?.Name?.trim();
    const selectedNames = Object.values(selectedOptions)
      .map(option => option?.Name?.trim())
      .filter(Boolean)
      .join(' ');

    if (!goodsTypeName && !selectedNames) {
      return '';
    }

    return [goodsTypeName, selectedNames].filter(Boolean).join(' ');
  };

  const handleSave = _.debounce(
    async () => {
      const linkArray =
        typeof linkImage === 'string'
          ? linkImage.split(';')
          : Array.isArray(linkImage)
          ? linkImage
          : [];
      const linkString = linkArray.join(';');
      const selectedFields = getSelectedOptionsBody();
      const body = {
        FactorID: 'CustomerRequest',
        EntryID: valueEntry?.EntryID,
        OID: editOrder ? detailCusRequirement?.OID : '',
        ODate: dateStates?.planDate.submit,
        CustomerID: valueCustomer?.ID || 0,
        GoodsTypeID: valueGoodsType?.ID || 0,
        ...selectedFields,
        ItemID: listCodeProduct?.ID || 0,
        Quantity: values?.Quantity || 0,
        CustomerRequest: values?.CustomerRequest || '',
        BusinessRequest: values?.BusinessRequest || '',
        CustomerRequestTypeID: valueCustomerRequirement?.ID || 0,
        TransferDepartmentID: valueDepartment?.ID || 0,
        ResponsibleEmployeeID: valueUser?.UserID || 0,
        RequestDueDate: dateStates?.requestDate.submit || new Date(),
        IsCustomer: 0,
        RequestLink: linkString || '',
        ItemName: listCodeProduct
          ? listCodeProduct?.Name
          : createProductName() || '',
        Note: values?.Note || '',
        TransferNote: '',
        TransferLink: '',
      };
      try {
        const result = editOrder
          ? await ApiCustomerRequests_Edit(body)
          : await ApiCustomerRequests_Add(body);
        const responeData = result.data;
        if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData.Message}`,
            'success',
          );
          navigation.navigate(routes.CustomerRequirementScreen);
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
        OID: detailCusRequirement?.OID,
        IsLock: detailCusRequirement?.IsLock === 0 ? 1 : 0,
        RequestDueDate: detailCusRequirement?.RequestDueDate,
        TransferDepartmentID: detailCusRequirement?.TransferDepartmentID || 0,
        ResponsibleEmployeeID: detailCusRequirement?.ResponsibleEmployeeID || 0,
      };
      try {
        const result = await ApiCustomerRequests_Submit(body);
        const responeData = result.data;
        if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData.Message}`,
            'success',
          );
          navigation.navigate(routes.CustomerRequirementScreen);
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
    dispatch(fetchListGoodsTypes());
  }, []);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (valueGoodsType) {
        const paramString = valueGoodsType?.Extention9?.replace(/\//g, ',');
        const body = {
          Parameters: paramString,
        };
        dispatch(fetchDataGoodsTypes(body));
      }
    });
  }, [valueGoodsType]);

  const entries = useMemo(
    () => Object.entries(listDataGoodType || {}),
    [listDataGoodType],
  );
  const firstEntry = useMemo(() => entries[0], [entries]);
  const restEntries = useMemo(() => entries.slice(1), [entries]);

  const splitToRows = (data, size = 2) => {
    const result = [];
    for (let i = 0; i < data.length; i += size) {
      result.push(data.slice(i, i + size));
    }
    return result;
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const baseBody = {
        GoodsTypeID: valueGoodsType?.ID || 0,
        TypeID: 0,
        ModelID: 0,
        CoreID: 0,
        ColorID: 0,
        DecorID: 0,
        PackagingID: 0,
        MoistureProofID: 0,
        PhysicalID: 0,
        ScratchResistanceID: 0,
        DensityID: 0,
        EmissionLevelID: 0,
        PlatingID: 0,
        RuloID: 0,
        GradeID: 0,
        CoreColorID: 0,
        BackingID: 0,
        GlueLineID: 0,
        PackagingGroupID: 0,
        NumberOfSurfacesID: 0,
        Specification1ID: 0,
        Specification2ID: 0,
        GlueTypeID: 0,
        MoldTypeID: 0,
        LockSeamID: 0,
        BrandM1ID: 0,
        ProductLineID: 0,
        PatternGroupM1ID: 0,
        PatternGroupM2ID: 0,
        ProductLineByPatternMoldID: 0,
        PatternM1ID: 0,
        PatternM2ID: 0,
        BackingThicknessID: 0,
        ColorCodeM1ID: 0,
        EmissionLevelForID: 0,
        ColorCodeM2ID: 0,
        ProductionGradeID: 0,
        MoldM1ID: 0,
        MoldM2ID: 0,
        OverlayPaperID: 0,
        DivisionM2ID: 0,
        BalancePaperID: 0,
        BrandM2ID: 0,
      };

      const filledBody = {
        ...baseBody,
        ...Object.fromEntries(
          Object.entries(selectedOptions).map(([key, value]) => [
            key,
            value?.ID || 0,
          ]),
        ),
      };

      dispatch(fetchCodeProduct(filledBody));
    }, 300);
    return () => clearTimeout(timeout);
  }, [selectedOptions, valueGoodsType]);

  const debouncedSetSelectedOptions = useMemo(
    () =>
      _.debounce((key, value) => {
        setSelectedOptions(prev => ({
          ...prev,
          [key]: value,
        }));
      }, 100),
    [],
  );
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      style={[
        stylesFormOrderRequest.container,
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
      <SafeAreaView style={stylesFormOrderRequest.container}>
        <HeaderBack
          title={
            editOrder
              ? languageKey('_edit_request')
              : languageKey('_new_request')
          }
          onPress={() => navigation.goBack()}
          btn={true}
          iconBtn={close_blue}
          onPressBtn={openModalOptionsCancel}
        />
        <ScrollView
          style={stylesFormOrderRequest.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={stylesFormOrderRequest.footerScroll}>
          <View style={stylesFormOrderRequest.card}>
            <View style={stylesFormOrderRequest.input}>
              <CardModalSelect
                title={languageKey('_function')}
                data={listEntry}
                setValue={setValueEntry}
                value={valueEntry?.EntryName}
                bgColor={editOrder ? '#E5E7EB' : '#FAFAFA'}
                require={true}
                disabled={editOrder}
              />
            </View>
            <View style={stylesFormOrderRequest.inputAuto}>
              <View style={stylesFormOrderRequest.widthInput}>
                <Text style={stylesFormOrderRequest.txtHeaderInputView}>
                  {languageKey('_ct_code')}
                </Text>
                <Text style={stylesFormOrderRequest.inputView}>
                  {' '}
                  {editOrder ? detailCusRequirement?.OID : 'Auto'}
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
                  bgColor={'#FAFAFA'}
                  minimumDate={new Date()}
                />
              </View>
            </View>
            <View style={stylesFormOrderRequest.input}>
              <CardModalSelect
                title={languageKey('_customer_name')}
                data={listCustomerApproval}
                setValue={setValueCustomer}
                value={valueCustomer?.Name}
                bgColor={'#FAFAFA'}
              />
            </View>
            {valueEntry?.EntryID === 'OtherRequests' ? (
              <>
                <View style={stylesFormOrderRequest.input}>
                  <CardModalSelect
                    title={languageKey('_request_content')}
                    data={listCustomerRequestType}
                    setValue={setValueCusRequirement}
                    value={valueCustomerRequirement?.Name}
                    bgColor={'#FAFAFA'}
                  />
                </View>
                <InputDefault
                  name="CustomerRequest"
                  returnKeyType="next"
                  style={stylesFormOrderRequest.input}
                  value={values?.CustomerRequest}
                  label={languageKey('_enter_a_detaied_description')}
                  isEdit={true}
                  bgColor={'#FAFAFA'}
                  labelHolder={languageKey('_enter_the_product_name')}
                  placeholderInput={true}
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />
                <View style={stylesFormOrderRequest.input}>
                  <CardModalSelect
                    title={languageKey('_forwarding_department')}
                    data={department}
                    setValue={setValueDepartMent}
                    value={valueDepartment?.Name}
                    bgColor={'#FAFAFA'}
                  />
                </View>
                <View style={stylesFormOrderRequest.input}>
                  <CardModalSelect
                    title={languageKey('_officer_in_charge')}
                    data={listUserByDepartment}
                    setValue={setValueUser}
                    value={valueUser?.UserFullName}
                    bgColor={'#FAFAFA'}
                  />
                </View>
                <ModalSelectDate
                  title={languageKey('_processing_time_limit')}
                  showDatePicker={() =>
                    updateDateState('requestDate', {visible: true})
                  }
                  hideDatePicker={() =>
                    updateDateState('requestDate', {visible: false})
                  }
                  initialValue={dateStates.requestDate.selected}
                  selectedValueSelected={val =>
                    updateDateState('requestDate', {selected: val})
                  }
                  isDatePickerVisible={dateStates.requestDate.visible}
                  selectSubmitForm={val =>
                    updateDateState('requestDate', {submit: val})
                  }
                  bgColor={'#FAFAFA'}
                  minimumDate={new Date()}
                />
              </>
            ) : (
              <>
                <View style={stylesFormOrderRequest.inputAuto}>
                  <View style={stylesFormOrderRequest.widthInput}>
                    <CardModalSelect
                      title={languageKey('_product_industry')}
                      data={listGoodsType}
                      setValue={setValueGoodsType}
                      value={valueGoodsType?.Name}
                      bgColor={'#FAFAFA'}
                    />
                  </View>

                  {firstEntry && (
                    <View
                      style={stylesFormOrderRequest.widthInput}
                      key={firstEntry[0]}>
                      <CardModalSelectTrigger
                        title={firstEntry[1].Name}
                        value={selectedOptions?.[firstEntry[0]]?.Name}
                        bgColor={'#FAFAFA'}
                        onPress={() =>
                          openSelectModal(
                            firstEntry[1].Name,
                            firstEntry[1].Data,
                            value =>
                              setSelectedOptions(prev => ({
                                ...prev,
                                [firstEntry[0]]: value,
                              })),
                          )
                        }
                      />
                    </View>
                  )}
                </View>

                <FlatList
                  data={splitToRows(restEntries)}
                  keyExtractor={(_, index) => `row-${index}`}
                  renderItem={({item: row}) => (
                    <View style={stylesFormOrderRequest.inputAuto}>
                      {row.map(([key, obj]) => (
                        <View
                          style={stylesFormOrderRequest.widthInput}
                          key={key}>
                          <CardModalSelectTrigger
                            title={obj.Name}
                            value={selectedOptions?.[key]?.Name}
                            bgColor={'#FAFAFA'}
                            onPress={() =>
                              openSelectModal(obj.Name, obj.Data, value =>
                                debouncedSetSelectedOptions(key, value),
                              )
                            }
                          />
                        </View>
                      ))}
                    </View>
                  )}
                  initialNumToRender={2}
                  maxToRenderPerBatch={5}
                  windowSize={10}
                />

                <View style={stylesFormOrderRequest.input}>
                  <Text style={stylesFormOrderRequest.txtHeaderInputView}>
                    {languageKey('_product_required')}
                  </Text>
                  <Text
                    style={stylesFormOrderRequest.inputView}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {listCodeProduct
                      ? listCodeProduct?.Name
                      : createProductName() || 'Chưa chọn sản phẩm'}
                  </Text>
                </View>
                <View style={stylesFormOrderRequest.inputAuto}>
                  <View style={stylesFormOrderRequest.widthInput}>
                    <Text style={stylesFormOrderRequest.txtHeaderInputView}>
                      {languageKey('_product_code')}
                    </Text>
                    <Text
                      style={stylesFormOrderRequest.inputView}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {listCodeProduct?.ID}
                    </Text>
                  </View>
                  <InputDefault
                    name="Quantity"
                    returnKeyType="next"
                    style={stylesFormOrderRequest.widthInput}
                    value={String(values?.Quantity)}
                    isEdit={true}
                    label={languageKey('_quantity_required')}
                    placeholderInput={true}
                    bgColor={'#FAFAFA'}
                    keyboardType={'numeric'}
                    labelHolder={languageKey('_enter_quantity')}
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
                  name="CustomerRequest"
                  returnKeyType="next"
                  style={stylesFormOrderRequest.input}
                  value={values?.CustomerRequest}
                  label={languageKey('_customer_requirements')}
                  isEdit={true}
                  bgColor={'#FAFAFA'}
                  labelHolder={languageKey('_enter_the_product_name')}
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
                  name="BusinessRequest"
                  returnKeyType="next"
                  style={stylesFormOrderRequest.input}
                  value={values?.BusinessRequest}
                  isEdit={true}
                  label={languageKey('_business_requirements')}
                  placeholderInput={true}
                  bgColor={'#FAFAFA'}
                  labelHolder={languageKey('_enter_quantity')}
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

            <InputDefault
              name="Note"
              returnKeyType="next"
              style={stylesFormOrderRequest.input}
              value={values?.Note}
              label={languageKey('_note')}
              placeholderInput={true}
              isEdit={true}
              bgColor={'#FAFAFA'}
              labelHolder={languageKey('_enter_notes')}
              {...{touched, errors, handleBlur, handleChange, setFieldValue}}
            />
            <View style={stylesFormOrderRequest.imgBox}>
              <Text style={stylesFormOrderRequest.headerBoxImage}>
                {languageKey('_image')}
              </Text>
              <AttachManyFile
                OID={detailCusRequirement?.OID}
                images={images}
                setDataImages={setDataImages}
                setLinkImage={setLinkImage}
                dataLink={linkImage}
              />
            </View>
          </View>
        </ScrollView>
        <View style={stylesFormOrderRequest.containerFooter}>
          <Button style={stylesFormOrderRequest.btnSave} onPress={handleSave}>
            <Text style={stylesFormOrderRequest.txtBtnSave}>
              {languageKey('_save')}
            </Text>
          </Button>
          <Button
            style={stylesFormOrderRequest.btnConfirm}
            disabled={editOrder ? false : true}
            onPress={handleConfirm}>
            <Text style={stylesFormOrderRequest.txtBtnConfirm}>
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
          content={languageKey('_cancel_create_plan')}
        />
        <UnifiedModalSelect ref={unifiedModalRef} />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default FormCustomerRequirement;
