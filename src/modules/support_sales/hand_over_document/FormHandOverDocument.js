import React, {useEffect, useMemo, useState} from 'react';
import _ from 'lodash';
import {useFormik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {SvgXml} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, Text, ScrollView, StatusBar} from 'react-native';

import routes from '@routes';
import {translateLang} from 'store/accLanguages/slide';
import {stylesFormHandOverDocument} from './styles';
import {arrow_down_big, close_blue} from 'svgImg';
import {
  ApiHandOverDocuments_Add,
  ApiHandOverDocuments_Edit,
  ApiHandOverDocuments_Submit,
} from 'action/Api';
import {
  Button,
  CardModalSelect,
  HeaderBack,
  InputDefault,
  ModalNotify,
  NotifierAlert,
  ModalSelectDate,
  ModalHandOverDocument,
} from 'components';
import {
  fetchListDocumentTypes,
  fetchListEntry,
  fetchListHandOverTypes,
} from 'store/accHand_Over_Doc/thunk';
import {fetchListDepartment} from 'store/accCus_Requirement/thunk';

const FormHandOverDocument = ({route}) => {
  const item = route?.params?.item;
  const editDoc = route?.params?.editDoc;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const {userInfo} = useSelector(state => state.Login);
  const {detailMenu} = useSelector(state => state.Home);
  const {listUser} = useSelector(state => state.ApprovalProcess);
  const {listDepartment} = useSelector(state => state.CusRequirement);
  const {listEntry, detailHandOverDoc} = useSelector(
    state => state.HandOverDoc,
  );
  const [isShowOptionsModalCancel, setShowOptionsModalCancel] = useState(false);
  const department = listDepartment?.filter(item => item?.Extention4 === '1');
  const [valueDepartment, setValueDepartMent] = useState(
    editDoc
      ? department?.find(item => item.ID === detailHandOverDoc?.DepartmentID)
      : null,
  );
  const [valueEntry, setValueEntry] = useState(
    editDoc
      ? listEntry?.find(entry => entry.EntryID === detailHandOverDoc?.EntryID)
      : null,
  );
  const [isShowInforGeneral, setIsShowInforGeneral] = useState(true);
  const [isShowModal, setIsShowModal] = useState(false);
  const [selectListDocument, setSelectListDocument] = useState([]);
  const [dateStates, setDateStates] = useState({
    planDate: {
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

  const listUserByDepartment = useMemo(() => {
    return listUser
      ? listUser.filter(
          user => Number(user?.DepartmentID) === valueDepartment?.ID,
        )
      : [];
  }, [listUser, valueDepartment]);

  const [valueReceiver, setValueReceiver] = useState(
    editDoc
      ? listUserByDepartment?.find(
          item => item.UserID === detailHandOverDoc?.RecipientID,
        )
      : null,
  );

  const openModalOptionsCancel = item => {
    setShowOptionsModalCancel(true);
  };

  const handleCloseOptionsMoalCancel = () => {
    setShowOptionsModalCancel(false);
  };

  const handleShowInforGeneral = () => {
    setIsShowInforGeneral(!isShowInforGeneral);
  };

  const showModal = () => {
    setIsShowModal(!isShowModal);
  };

  const closeModal = () => {
    setIsShowModal(!isShowModal);
  };

  const initialValues = {
    OID: '',
    Note: editDoc ? detailHandOverDoc?.Note : '',
    Link: '',
    DelivererID: 0,
    RecipientID: 0,
    Content: editDoc ? detailHandOverDoc?.Content : '',
    Details: [],
  };

  const {values, errors, touched, handleChange, handleBlur, setFieldValue} =
    useFormik({
      initialValues,
    });

  const total = selectListDocument?.reduce((sum, item) => {
    return (
      sum +
      (Number(item?.NumberOfCopies || 0) + Number(item?.NumberOfOriginals || 0))
    );
  }, 0);

  const handleSave = _.debounce(
    async () => {
      const body = {
        OID: editDoc ? detailHandOverDoc.OID : '',
        Note: values?.Note || '',
        Link: '',
        IsActive: 1,
        FactorID: detailMenu?.factorId,
        EntryID: valueEntry?.EntryID,
        ODate: dateStates?.planDate.submit,
        DepartmentID: valueDepartment?.ID || 0,
        SAPID: '',
        LemonID: '',
        DelivererID: userInfo?.UserID || 0,
        RecipientID: valueReceiver?.UserID || 0,
        Content: values?.Content || '',
        DocumentsCount: total || 0,
        Details: selectListDocument,
      };
      try {
        const result = editDoc
          ? await ApiHandOverDocuments_Edit(body)
          : await ApiHandOverDocuments_Add(body);
        const responeData = result.data;
        if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData.Message}`,
            'success',
          );
          navigation.navigate(routes.HandOverDocumentScreen);
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
        OID: detailHandOverDoc?.OID,
        IsLock: detailHandOverDoc?.IsLock === 0 ? 1 : 0,
      };
      try {
        const result = await ApiHandOverDocuments_Submit(body);
        const responeData = result.data;
        if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${responeData.Message}`,
            'success',
          );
          navigation.navigate(routes.HandOverDocumentScreen);
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
    dispatch(fetchListHandOverTypes());
    const body = {
      FactorID: detailMenu?.factorId,
      EntryID: detailMenu?.entryId,
    };
    dispatch(fetchListEntry(body));
    dispatch(fetchListDepartment());
  }, []);

  useEffect(() => {
    const body = {
      FactorID: detailMenu?.factorId,
      EntryID: valueEntry?.EntryID,
    };
    dispatch(fetchListDocumentTypes(body));
  }, [valueEntry]);

  return (
    <LinearGradient
      style={stylesFormHandOverDocument.container}
      start={{x: 0.44, y: 0.45}}
      end={{x: 1.22, y: 0.25}}
      colors={['#FFFFFF', '#FFFFFF']}
      pointerEvents="box-none">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <SafeAreaView style={stylesFormHandOverDocument.container}>
        <HeaderBack
          title={
            editDoc
              ? languageKey('_edit_handover')
              : languageKey('_new_handover')
          }
          onPress={() => navigation.goBack()}
          btn={true}
          iconBtn={close_blue}
          onPressBtn={openModalOptionsCancel}
        />
        <ScrollView
          style={stylesFormHandOverDocument.scrollView}
          showsVerticalScrollIndicator={false}>
          <View style={stylesFormHandOverDocument.containerHeader}>
            <Text style={stylesFormHandOverDocument.header}>
              {languageKey('_information_general')}
            </Text>
            <Button
              style={stylesFormHandOverDocument.btnShowInfor}
              onPress={handleShowInforGeneral}>
              <SvgXml xml={arrow_down_big} />
            </Button>
          </View>
          {isShowInforGeneral && (
            <View style={stylesFormHandOverDocument.card}>
              <View style={stylesFormHandOverDocument.input}>
                <CardModalSelect
                  title={languageKey('_function')}
                  data={listEntry}
                  setValue={setValueEntry}
                  value={valueEntry?.EntryName}
                  bgColor={'#FAFAFA'}
                />
              </View>

              <View style={stylesFormHandOverDocument.inputAuto}>
                <View style={stylesFormHandOverDocument.inputRead}>
                  <Text style={stylesFormHandOverDocument.txtHeaderInputView}>
                    {languageKey('_ct_code')}
                  </Text>
                  <Text
                    style={stylesFormHandOverDocument.inputView}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {editDoc ? detailHandOverDoc?.OID : 'Auto'}
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
                    bgColor="#FAFAFA"
                    minimumDate={new Date()}
                  />
                </View>
              </View>
              <View style={stylesFormHandOverDocument.input}>
                <CardModalSelect
                  title={languageKey('_receiving_department')}
                  data={department}
                  setValue={setValueDepartMent}
                  value={valueDepartment?.Name}
                  bgColor={'#FAFAFA'}
                />
              </View>
              <View style={stylesFormHandOverDocument.input}>
                <CardModalSelect
                  title={languageKey('_receiver')}
                  data={listUserByDepartment}
                  setValue={setValueReceiver}
                  value={valueReceiver?.UserFullName}
                  bgColor={'#FAFAFA'}
                />
              </View>
              <InputDefault
                name="Content"
                returnKeyType="next"
                style={stylesFormHandOverDocument.input}
                value={values?.Content}
                label={languageKey('_handover_content')}
                isEdit={true}
                bgColor={'#FAFAFA'}
                labelHolder={languageKey('_enter_content')}
                placeholderInput={true}
                {...{touched, errors, handleBlur, handleChange, setFieldValue}}
              />
              <InputDefault
                name="Note"
                returnKeyType="next"
                style={stylesFormHandOverDocument.input}
                value={values?.Note}
                label={languageKey('_note')}
                placeholderInput={true}
                isEdit={true}
                bgColor={'#FAFAFA'}
                labelHolder={languageKey('_enter_notes')}
                {...{touched, errors, handleBlur, handleChange, setFieldValue}}
              />
            </View>
          )}
          <View style={stylesFormHandOverDocument.containerAdd}>
            <Text style={stylesFormHandOverDocument.header}>
              {languageKey('_list_of_document')}
            </Text>
            <Button
              style={stylesFormHandOverDocument.btnUploadFile}
              onPress={showModal}>
              <Text style={stylesFormHandOverDocument.txtBtnUploadFile}>
                {languageKey('_add')}
              </Text>
            </Button>
          </View>
          <ModalHandOverDocument
            setValue={setSelectListDocument}
            showModal={isShowModal}
            closeModal={closeModal}
            dataEdit={item?.Details}
          />
        </ScrollView>
        <View style={stylesFormHandOverDocument.containerFooter}>
          <Button
            style={stylesFormHandOverDocument.btnSave}
            onPress={handleSave}>
            <Text style={stylesFormHandOverDocument.txtBtnSave}>
              {languageKey('_save')}
            </Text>
          </Button>
          <Button
            style={stylesFormHandOverDocument.btnConfirm}
            disabled={detailHandOverDoc ? false : true}
            onPress={handleConfirm}>
            <Text style={stylesFormHandOverDocument.txtBtnConfirm}>
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

export default FormHandOverDocument;
