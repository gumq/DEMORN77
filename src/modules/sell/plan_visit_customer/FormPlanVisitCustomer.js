import React, {useEffect, useState} from 'react';
import * as yup from 'yup';
import {useFormik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {View, Text, ScrollView, StatusBar, Alert, Platform} from 'react-native';

import routes from '@routes';
import {close_blue} from 'svgImg';
import {stylesAddPlan} from './styles';
import {translateLang} from 'store/accLanguages/slide';
import {ApiPlanForUsers_CalendarCheck} from 'action/Api';
import {fetchListEntry} from 'store/accCus_Requirement/thunk';
import {fetchListSalesRoutes} from 'store/accVisit_Customer/thunk';
import {
  AttachManyFile,
  Button,
  CardModalSelect,
  HeaderBack,
  InputDefault,
  ModalNotify,
  ModalSelectDate,
  NotifierAlert,
} from 'components';
import {fetchListCustomerByUserID} from 'store/accAuth/thunk';
import {scale} from 'utils/resolutions';

const FormPlanVisitCustomer = ({route}) => {
  const item = route?.params?.item;
  const editPlan = route?.params?.editPlan;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const languageKey = useSelector(translateLang);
  const {userInfo} = useSelector(state => state.Login);
  const {detailMenu} = useSelector(state => state.Home);
  const {listSalesRoutes} = useSelector(state => state.VisitCustomer);
  const {detailApprovalListProcess} = useSelector(
    state => state.ApprovalProcess,
  );
  const {listEntry} = useSelector(state => state.CusRequirement);
  const {listUserByUserID} = useSelector(state => state.Login);
  const [dataFormSetPlan, setDataFormSetPlan] = useState(null);
  const [isCheckCallendar, setIsCheckCallendar] = useState(false);
  const [isShowOptionsModalCancel, setShowOptionsModalCancel] = useState(false);
  const [valueEmployee, setValueEmployee] = useState(
    listUserByUserID?.find(user => user?.UserID === userInfo?.UserID),
  );
  const [valueSalesRoute, setValueSalesRoute] = useState();
  const [valueEntry, setValueEntry] = useState(
    editPlan
      ? listEntry?.find(
          item => item?.EntryID === detailApprovalListProcess?.EntryID,
        )
      : listEntry[0],
  );
  const [linkImage, setLinkImage] = useState(
    editPlan && detailApprovalListProcess?.Link?.trim() !== ''
      ? detailApprovalListProcess.Link
      : '',
  );
  const linkImgArray = linkImage ? linkImage.split(';').filter(Boolean) : [];
  const [images, setDataImages] = useState(linkImgArray);

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
    const body = {
      FactorID: detailMenu?.factorId,
      EntryID: detailMenu?.entryId,
    };
    dispatch(fetchListEntry(body));
  }, []);

  const updateDateState = (key, newValues) => {
    setDateStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...newValues,
      },
    }));
  };

  const openModalOptionsCancel = item => {
    setShowOptionsModalCancel(true);
  };

  const handleCloseOptionsMoalCancel = () => {
    setShowOptionsModalCancel(false);
  };

  const initialValues = {
    OID: editPlan ? item?.OID : '',
    PlanName: editPlan ? item?.PlanName : '',
    Note: editPlan ? item?.Note : '',
  };

  const initialErrors = {
    PlanName: true,
  };

  const {values, errors, touched, handleChange, handleBlur, setFieldValue} =
    useFormik({
      initialValues,
      initialErrors,
      validationSchema: yup.object().shape({
        PlanName: yup.string().trim().required(languageKey('_enter_plan_name')),
      }),
    });

  useEffect(() => {
    const body = {
      CustomerRepresentativeID: valueEmployee?.UserID || 0,
      SalesStaffID: valueSalesRoute ? valueSalesRoute?.ID : null,
      Function: 'PlanForUsers',
      CmpnID: userInfo?.CmpnID,
    };
    dispatch(fetchListCustomerByUserID(body));
  }, [valueEmployee, valueSalesRoute]);

  const checkCallendarEvent = async () => {
    const linkArray =
      typeof linkImage === 'string'
        ? linkImage.split(';')
        : Array.isArray(filesForm)
        ? filesForm
        : [];
    const linkString = linkArray.join(';');
    const errors = [];
    if (!valueEmployee?.UserID) {
      errors.push(languageKey('_please_select_employee'));
    }

    if (!values?.PlanName) {
      errors.push(languageKey('_please_enter_plan_name'));
    }

    if (errors.length > 0) {
      Alert.alert(errors[0]);
      return;
    }

    const body = {
      UserID: valueEmployee?.UserID,
      FromDate: dateStates?.fromDate.submit,
      ToDate: dateStates?.toDate.submit,
      OID: editPlan ? item?.OID : '',
    };
    try {
      const result = await ApiPlanForUsers_CalendarCheck(body);
      const responeData = result.data;
      if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
        setIsCheckCallendar(true);
      } else {
        setIsCheckCallendar(false);
        NotifierAlert(
          3000,
          `${languageKey('_notification')}`,
          `${responeData.Message}`,
          'error',
        );
      }
    } catch (error) {
      console.log('CheckCallendar', error);
    }
  };

  useEffect(() => {
    if (item && editPlan) {
      const userCurrent = listUserByUserID?.find(
        cus => cus.UserID === item?.UserID,
      );
      const customerSupportLine = listSalesRoutes.find(
        line => line.ID === item?.CustomerSupportLineID,
      );
      setValueEmployee(userCurrent);
      setValueSalesRoute(customerSupportLine);

      const fromDate = item.FromDate;
      const toDate = item.ToDate;

      updateDateState('fromDate', {
        initial: fromDate,
        selected: fromDate,
        submit: fromDate,
      });
      updateDateState('toDate', {
        initial: toDate,
        selected: toDate,
        submit: toDate,
      });
      setIsCheckCallendar(true);
    } else {
      const now = new Date();
      updateDateState('fromDate', {
        initial: now,
        selected: now,
        submit: now,
      });
      updateDateState('toDate', {
        initial: now,
        selected: now,
        submit: now,
      });
    }
  }, [item, editPlan]);

  useEffect(() => {
    if (
      dateStates.fromDate.selected !== dateStates.fromDate.initial ||
      dateStates.toDate.selected !== dateStates.toDate.initial
    ) {
      checkCallendarEvent();
    }
  }, [
    dateStates.fromDate.selected,
    dateStates.fromDate.initial,
    dateStates.toDate.selected,
    dateStates.toDate.initial,
  ]);

  useEffect(() => {
    const linkArray =
      typeof linkImage === 'string'
        ? linkImage.split(';')
        : Array.isArray(filesForm)
        ? filesForm
        : [];
    const linkString = linkArray.join(';');

    const bodyForm = {
      UserID: valueEmployee?.UserID,
      FactorID: detailMenu?.factorId,
      EntryID: valueEntry?.EntryID,
      FromDate: dateStates?.fromDate.submit,
      ToDate: dateStates?.toDate.submit,
      PlanName: values.PlanName,
      CustomerSupportLineID: valueSalesRoute?.ID,
      ODate: dateStates?.planDate.submit,
      Link: linkString || '',
      Note: values?.Note,
    };

    setDataFormSetPlan(bodyForm);
  }, [values?.Note, values?.PlanName, linkImage, dateStates]);

  const handleAddDetailsPlan = () => {
    const fromDateUpdate = dateStates?.fromDate.submit;
    const toDateUpdate = dateStates?.toDate.submit;

    const finalData = editPlan
      ? {...item, ...dataFormSetPlan}
      : dataFormSetPlan;

    navigation.navigate(routes.FormPlanDetailCustomer, {
      item: finalData,
      editPlan: editPlan,
      fromDateUpdate,
      toDateUpdate,
    });
  };

  useEffect(() => {
    if (valueEmployee) {
      const body = {
        CategoryType: 'SalesRoutes',
        ListID: valueEmployee?.RouteSales3 || '',
      };
      dispatch(fetchListSalesRoutes(body));
    }
  }, [valueEmployee]);
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      style={[
        stylesAddPlan.container,
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
      <SafeAreaView style={stylesAddPlan.container}>
        <HeaderBack
          title={languageKey('_create_a new_plan')}
          onPress={() => navigation.goBack()}
          btn={true}
          iconBtn={close_blue}
          onPressBtn={openModalOptionsCancel}
        />
        <ScrollView
          style={stylesAddPlan.scrollView}
          showsVerticalScrollIndicator={false}>
          <Text style={stylesAddPlan.header}>
            {languageKey('_information_general')}
          </Text>
          <View style={stylesAddPlan.card}>
            <View style={stylesAddPlan.input}>
              <CardModalSelect
                title={languageKey('_function')}
                data={listEntry}
                setValue={setValueEntry}
                value={valueEntry?.EntryName}
                bgColor={editPlan ? '#E5E7EB' : '#FAFAFA'}
                require={true}
                disabled={editPlan}
              />
            </View>
            <View style={stylesAddPlan.inputAuto}>
              <InputDefault
                name="OID"
                returnKeyType="next"
                style={stylesAddPlan.widthInput}
                value={editPlan ? detailApprovalListProcess?.OID : 'Auto'}
                label={languageKey('_ct_code')}
                isEdit={false}
                placeholderInput={true}
                bgColor={'#E5E5E5'}
                labelHolder={'Auto'}
                {...{touched, errors, handleBlur, handleChange, setFieldValue}}
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
                  bgColor="#FAFAFA"
                  minimumDate={new Date()}
                />
              </View>
            </View>
            <View style={stylesAddPlan.input}>
              <CardModalSelect
                title={languageKey('_employee')}
                data={listUserByUserID}
                setValue={setValueEmployee}
                value={valueEmployee?.UserFullName}
                require={true}
              />
            </View>
            <View style={stylesAddPlan.input}>
              <CardModalSelect
                title={languageKey('_customer_care_route')}
                data={listSalesRoutes}
                setValue={setValueSalesRoute}
                value={valueSalesRoute?.Name}
              />
            </View>
            <InputDefault
              name="PlanName"
              returnKeyType="next"
              style={stylesAddPlan.input}
              value={values?.PlanName}
              label={languageKey('_plan_name')}
              placeholderInput={true}
              isEdit={true}
              require={true}
              labelHolder={languageKey('_please_enter_a_plane_name')}
              {...{touched, errors, handleBlur, handleChange, setFieldValue}}
            />
            <View style={stylesAddPlan.inputFormDate}>
              <View style={{flex: 1}}>
                <ModalSelectDate
                  title={languageKey('_fromdate')}
                  showDatePicker={() =>
                    updateDateState('fromDate', {visible: true})
                  }
                  hideDatePicker={() =>
                    updateDateState('fromDate', {visible: false})
                  }
                  initialValue={
                    editPlan
                      ? dateStates.fromDate.initial
                      : dateStates.fromDate.selected
                  }
                  selectedValueSelected={val =>
                    updateDateState('fromDate', {selected: val})
                  }
                  isDatePickerVisible={dateStates.fromDate.visible}
                  selectSubmitForm={val =>
                    updateDateState('fromDate', {submit: val})
                  }
                  minimumDate={new Date()}
                  require={true}
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
                  initialValue={
                    editPlan
                      ? dateStates.toDate.initial
                      : dateStates.toDate.selected
                  }
                  selectedValueSelected={val =>
                    updateDateState('toDate', {selected: val})
                  }
                  isDatePickerVisible={dateStates.toDate.visible}
                  selectSubmitForm={val =>
                    updateDateState('toDate', {submit: val})
                  }
                  minimumDate={new Date()}
                  require={true}
                />
              </View>
            </View>
            <InputDefault
              name="Note"
              returnKeyType="next"
              style={stylesAddPlan.input}
              value={values?.Note}
              label={languageKey('_note')}
              placeholderInput={true}
              isEdit={true}
              labelHolder={languageKey('_enter_notes')}
              {...{touched, errors, handleBlur, handleChange, setFieldValue}}
            />
            <View style={stylesAddPlan.imgBox}>
              <Text style={stylesAddPlan.headerBoxImage}>
                {languageKey('_image')}
              </Text>
              <AttachManyFile
                OID={detailApprovalListProcess?.OID}
                images={images}
                setDataImages={setDataImages}
                setLinkImage={setLinkImage}
                dataLink={linkImage}
              />
            </View>
          </View>
          <Button
            style={stylesAddPlan.btnConfirm}
            onPress={handleAddDetailsPlan}
            disabled={
              isCheckCallendar && valueEmployee && values?.PlanName
                ? false
                : true
            }>
            <Text style={stylesAddPlan.txtBtnConfirm}>
              {languageKey('_next')}
            </Text>
          </Button>
        </ScrollView>
        <ModalNotify
          isShowOptions={isShowOptionsModalCancel}
          handleClose={handleCloseOptionsMoalCancel}
          handleAccept={() => navigation.goBack()}
          handleCancel={handleCloseOptionsMoalCancel}
          btnNameAccept={languageKey('_argee')}
          btnCancel={languageKey('_cancel')}
          content={languageKey('_cancel_create_plan')}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default FormPlanVisitCustomer;
