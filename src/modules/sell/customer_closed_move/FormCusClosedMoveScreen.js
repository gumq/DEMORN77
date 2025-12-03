/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import {useFormik} from 'formik';
import {SvgXml} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {View, Text, ScrollView, StatusBar, Alert, Platform} from 'react-native';

import routes from '@routes';
import {translateLang} from '@store/accLanguages/slide';
import {stylesDetail, stylesFormCusClosedMove} from './styles';
import {arrow_down_big, arrow_next_gray, close_blue} from '@svgImg';
import {fetchListEntryCredit} from '@store/accCredit_Limit/thunk';
import {
  fetchListCategoryTypeCusClosed,
  fetchListEntryMV,
} from '@store/accCus_Closed_Move/thunk';
import {
  fetchListCustomerByUserID,
  fetchListUserByUserID,
} from '@store/accAuth/thunk';
import {
  ApiCustomerArchived_Add,
  ApiCustomerArchived_Edit,
  ApiCustomerArchived_Submit,
} from '@api';
import {
  Button,
  CardModalSelect,
  HeaderBack,
  InputDefault,
  ModalNotify,
  ModalSelectDate,
  NotifierAlert,
  ModalCusClosedMove,
  AttachManyFile,
} from '@components';
import {fetchListUser} from '@store/accApproval_Signature/thunk';
import {scale} from '@utils/resolutions';;
import { colors } from '@themes';

const FormCusClosedMoveScreen = ({route}) => {
  const item = route?.params?.item;
  const editCustomer = route?.params?.editCustomer;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const languageKey = useSelector(translateLang);
  const {detailMenu} = useSelector(state => state.Home);
  const {userInfo, isUpdateOdate} = useSelector(state => state.Login);
  const {listProposalReason, detailCustomerClosedMove, listEntry} = useSelector(
    state => state.CustomerCloseMove,
  );
  const {listEntryCreditLimit} = useSelector(state => state.CreditLimit);
  const [isShowOptionsModalCancel, setShowOptionsModalCancel] = useState(false);
  const [valueRecommendedType, setValueRecommendedType] = useState(
    editCustomer
      ? listEntry?.find(
          item => item?.EntryID === detailCustomerClosedMove?.EntryID,
        )
      : listEntry?.[0],
  );

  const [valueProposalReason, setValueProposalReason] = useState(
    editCustomer
      ? listProposalReason?.find(
          reason => reason?.ID === detailCustomerClosedMove?.ProposalReasonID,
        )
      : null,
  );
  const [isShowModalAddNewCus, setIsShowModalAddNewCus] = useState(false);
  const [dateStates, setDateStates] = useState({
    planDate: {
      selected: null,
      submit: null,
      visible: false,
    },
  });

  const [listCustomerAddNew, setListCustomerAddNew] = useState([]);
  // console.log('listCustomerAddNew',listCustomerAddNew)
  const [showInformation, setShowInformation] = useState({
    general: true,
    reference: true,
  });
  const [linkImage, setLinkImage] = useState(
    editCustomer && detailCustomerClosedMove?.Link?.trim() !== ''
      ? detailCustomerClosedMove.Link
      : '',
  );
  const linkImgArray = linkImage ? linkImage.split(';').filter(Boolean) : [];
  const [images, setDataImages] = useState(linkImgArray);
  const toggleInformation = key => {
    setShowInformation(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
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

  const openModalOptionsCancel = () => {
    setShowOptionsModalCancel(true);
  };

  const handleCloseOptionsMoalCancel = () => {
    setShowOptionsModalCancel(false);
  };

  const openModalAddNewCus = () => {
    setIsShowModalAddNewCus(!isShowModalAddNewCus);
  };

  const handleCloseModalNewCus = () => {
    setIsShowModalAddNewCus(!isShowModalAddNewCus);
  };

  const initialValues = {
    ProposalReasonID: editCustomer ? valueProposalReason : '',
    Description: item?.Description,
    Note: item?.Note,
  };

  const {values, errors, touched, handleChange, handleBlur, setFieldValue} =
    useFormik({
      initialValues,
    });

  const handleCusClosedMove = _.debounce(
    async () => {
      const errors = [];

      if (!valueRecommendedType?.EntryID) {
        errors.push(languageKey('_please_select_function'));
      }

      if (!valueProposalReason?.ID) {
        errors.push(languageKey('_please_select_reason_for_proposal'));
      }

      if (!values?.Description) {
        errors.push(languageKey('_please_enter_content'));
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
        OID: editCustomer ? item?.OID : '',
        ODate: dateStates?.planDate.submit,
        FactorID: detailMenu?.factorId,
        EntryID: valueRecommendedType?.EntryID,
        SAPID: '',
        LemonID: '',
        ProposalTypeID: 0,
        ProposalReasonID: valueProposalReason?.ID || 0,
        UserID: editCustomer ? item?.UserID : userInfo?.UserID,
        Description: values?.Description || '',
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
        IsCompleted: 0,
        IsActive: 0,
        Note: values?.Note || '',
        Link: linkString || '',
        CustomerArchivedDetails: listCustomerAddNew || [],
      };
      console.log('bodybodybody', body);
      try {
        const result = editCustomer
          ? await ApiCustomerArchived_Edit(body)
          : await ApiCustomerArchived_Add(body);
        const responeData = result.data;
        if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData.Message}`,
            'success',
          );
          navigation.navigate(routes.CustomerClosedMoveScreen);
        } else {
          console.log('responeData.Message', responeData.Message);
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
        OID: detailCustomerClosedMove?.OID,
        IsLock: detailCustomerClosedMove?.IsLock === 0 ? 1 : 0,
        Note: '',
      };
      try {
        const result = await ApiCustomerArchived_Submit(body);
        const responeData = result.data;
        if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData.Message}`,
            'success',
          );
          navigation.navigate(routes.CustomerClosedMoveScreen);
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
    dispatch(fetchListCategoryTypeCusClosed());
    const body = {
      FactorID: detailMenu?.factorId || 'Customers',
      EntryID:
        detailMenu?.entryId || 'CustomerClosed,MoveDepartments,OpenCustomers',
      // EntryID: "CustomerClosed,MoveDepartments,OpenCustomers",
      // FactorID: "Customers"
    };
    dispatch(fetchListEntryMV(body));
    // dispatch(fetchListEntryCredit(body));
    const bodyCustomer = {
      CustomerRepresentativeID: userInfo?.UserID || 0,
      // SalesStaffID: null,
      // Function: 'Default',
      CmpnID: userInfo?.CmpnID,
    };
    dispatch(fetchListCustomerByUserID(bodyCustomer));
    const bodyUser = {
      UserID: userInfo?.UserID,
    };
    dispatch(fetchListUserByUserID(bodyUser));
    dispatch(fetchListUser({CmpnID: userInfo?.CmpnID}));
  }, []);
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      style={[
        stylesFormCusClosedMove.container,
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
      <SafeAreaView style={stylesFormCusClosedMove.container}>
        <HeaderBack
          title={languageKey('_endcoding_transcoding')}
          onPress={() => navigation.goBack()}
          btn={true}
          iconBtn={close_blue}
          onPressBtn={openModalOptionsCancel}
        />
        <ScrollView
          style={stylesFormCusClosedMove.scrollView}
          showsVerticalScrollIndicator={false}>
          <View style={stylesDetail.containerHeader}>
            <Text style={stylesDetail.header}>
              {languageKey('_information_general')}
            </Text>
            <Button
              style={stylesDetail.btnShowInfor}
              onPress={() => toggleInformation('general')}>
              <SvgXml
                xml={showInformation.general ? arrow_down_big : arrow_next_gray}
              />
            </Button>
          </View>
          {showInformation.general && (
            <View style={stylesFormCusClosedMove.card}>
              <View style={stylesFormCusClosedMove.input}>
                <CardModalSelect
                  title={languageKey('_function')}
                  data={listEntry}
                  setValue={setValueRecommendedType}
                  value={valueRecommendedType?.EntryName}
                  bgColor={editCustomer ? '#E5E7EB' : '#FAFAFA'}
                  require={true}
                  disabled={editCustomer}
                />
              </View>
              <View style={stylesFormCusClosedMove.inputAuto}>
                <InputDefault
                  name="OID"
                  returnKeyType="next"
                  style={stylesFormCusClosedMove.widthInput}
                  value={editCustomer ? detailCustomerClosedMove?.OID : 'Auto'}
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
                    bgColor={
                      isUpdateOdate?.toString() === 1
                        ? '#FAFAFA'
                        : colors.gray200
                    }
                    require={true}
                    minimumDate={new Date()}
                    disabled={isUpdateOdate?.toString() === 1 ? false : true}
                  />
                </View>
              </View>
              <View style={stylesFormCusClosedMove.input}>
                <CardModalSelect
                  title={languageKey('_suggested_reason')}
                  data={listProposalReason}
                  setValue={setValueProposalReason}
                  value={valueProposalReason?.Name}
                  bgColor={'#FAFAFA'}
                  require={true}
                />
              </View>
              <InputDefault
                name="Description"
                returnKeyType="next"
                style={stylesFormCusClosedMove.input}
                value={values?.Description}
                label={languageKey('_content_detail')}
                placeholderInput={true}
                isEdit={true}
                require={true}
                bgColor={'#FAFAFA'}
                labelHolder={languageKey('_enter_content')}
                {...{touched, errors, handleBlur, handleChange, setFieldValue}}
              />
              <InputDefault
                name="Note"
                returnKeyType="next"
                style={stylesFormCusClosedMove.input}
                value={values?.Note}
                label={languageKey('_note')}
                placeholderInput={true}
                isEdit={true}
                bgColor={'#FAFAFA'}
                labelHolder={languageKey('_enter_notes')}
                {...{touched, errors, handleBlur, handleChange, setFieldValue}}
              />
              <View style={stylesFormCusClosedMove.imgBox}>
                <Text style={stylesFormCusClosedMove.headerBoxImage}>
                  {languageKey('_image')}
                </Text>
                <AttachManyFile
                  OID={detailCustomerClosedMove?.OID}
                  images={images}
                  setDataImages={setDataImages}
                  setLinkImage={setLinkImage}
                  dataLink={linkImage}
                />
              </View>
            </View>
          )}
          <View style={stylesFormCusClosedMove.containerHeader}>
            <Text style={stylesFormCusClosedMove.header}>
              {languageKey('_customer_list')}
            </Text>
            <Button
              style={stylesFormCusClosedMove.btnAdd}
              onPress={openModalAddNewCus}>
              <Text style={stylesFormCusClosedMove.txtAdd}>
                {languageKey('_add')}
              </Text>
            </Button>
          </View>
          <ModalCusClosedMove
            showModal={isShowModalAddNewCus}
            setValue={setListCustomerAddNew}
            closeModal={handleCloseModalNewCus}
            dataEdit={
              editCustomer
                ? detailCustomerClosedMove?.CustomerArchivedDetails
                : []
            }
            parentID={editCustomer ? detailCustomerClosedMove?.OID : ''}
            entryID={valueRecommendedType?.EntryID}
            edit={editCustomer ? true : false}
          />
        </ScrollView>

        <View style={stylesFormCusClosedMove.containerFooter}>
          <Button
            style={stylesFormCusClosedMove.btnSave}
            onPress={handleCusClosedMove}>
            <Text style={stylesFormCusClosedMove.txtBtnSave}>
              {languageKey('_save')}
            </Text>
          </Button>
          <Button
            style={stylesFormCusClosedMove.btnConfirm}
            disabled={detailCustomerClosedMove ? false : true}
            onPress={handleConfirm}>
            <Text style={stylesFormCusClosedMove.txtBtnConfirm}>
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

export default FormCusClosedMoveScreen;
