import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {SvgXml} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  View,
  StatusBar,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  Platform,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

import {close_red, close_white, edit} from '@svgImg';
import {colors, fontSize} from '@themes';
import routes from '@routes';
import {translateLang} from '@store/accLanguages/slide';
import {Detail, ApprovalProgress} from './componentTabDetail';
import {
  Button,
  HeaderBack,
  LoadingModal,
  NotifierAlert,
  RadioButton,
  TabsHeaderDevices,
} from '@components';
import {fetchDetailApprovalListProcess} from '@store/accApproval_Signature/thunk';
import {
  fetchListCustomerForPlan,
  fetchListSalesRoutes,
} from '@store/accVisit_Customer/thunk';
import {hScale, scale} from '@utils/resolutions';
import {ApiGeneralApprovals_ApprovalList} from '@api';

const {height, width} = Dimensions.get('window');

const DetailPlanVisitCustomer = ({route, item}) => {
  const itemData = item || route?.params?.item;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const {userInfo} = useSelector(state => state.Login);
  const {listUserByUserID} = useSelector(state => state.Login);
  const {isSubmitting, detailApprovalListProcess} = useSelector(
    state => state.ApprovalProcess,
  );

  const [isShowModalApprove, setIsShowModalApprove] = useState(false);
  const [isApproval, setIsApproval] = useState(null);
  const [contentApproval, onChangeContentApproval] = useState('');

  const dataCheckbox = [
    {id: 1, value: languageKey('_argee'), key: 1},
    {id: 2, value: languageKey('_refuse'), key: 0},
  ];

  const showModalApprove = () => {
    setIsShowModalApprove(true);
  };

  const closeModalApprove = () => {
    setIsShowModalApprove(false);
  };

  const TAB_APPROVAL_PROCESS = [
    {id: 1, label: languageKey('_details')},
    {id: 2, label: languageKey('_approval_progress')},
  ];

  const [selectedTab, setSelectTab] = useState(TAB_APPROVAL_PROCESS[0]);

  const selectTabEvent = item => {
    setSelectTab(item);
  };

  const submitApproval = async () => {
    const body = {
      dataJson: [
        {
          OID: detailApprovalListProcess?.OID,
          FactorID: detailApprovalListProcess?.FactorID,
          EntryID: detailApprovalListProcess?.EntryID,
          ApprovalProcessID: detailApprovalListProcess?.ApprovalProcessID,
          ApprovalStatusID: isApproval?.key,
          ApprovalNote: contentApproval,
          Extention1: 0,
          Extention2: new Date().toISOString(),
          Extention3: '',
          Extention4: '',
          Extention5: '',
        },
      ],
    };
    try {
      const {data} = await ApiGeneralApprovals_ApprovalList(body);
      if (data.StatusCode === 200 && data.ErrorCode === '0') {
        closeModalApprove();
        NotifierAlert(
          3000,
          `${languageKey('_notification')}`,
          `${data.Message}`,
          'success',
        );
        navigation.goBack();
      } else {
        closeModalApprove();
        NotifierAlert(
          3000,
          `${languageKey('_notification')}`,
          `${data.Message}`,
          'error',
        );
      }
    } catch (error) {
      console.log('ApprovalList', error);
    }
  };

  useEffect(() => {
    const body = {OID: itemData?.OID};
    dispatch(fetchDetailApprovalListProcess(body));
  }, []);

  useEffect(() => {
    const userInfor = listUserByUserID?.find(
      user => user.UserID === detailApprovalListProcess?.UserID,
    );
    const bodySale = {
      CategoryType: 'SalesRoutes',
      ListID: userInfor?.RouteSales3 || '',
    };
    dispatch(fetchListSalesRoutes(bodySale));

    const body = {
      CustomerRepresentativeID: detailApprovalListProcess?.UserID || 0,
      SalesStaffID: detailApprovalListProcess?.CustomerSupportLineID || 0,
    };
    dispatch(fetchListCustomerForPlan(body));
  }, [detailApprovalListProcess]);

  const handleEditForm = () => {
    navigation.navigate(routes.FormPlanVisitCustomer, {
      item: detailApprovalListProcess,
      editPlan: true,
    });
  };

  const appliedToArray =
    detailApprovalListProcess?.AppliedToID?.split(',').map(Number);
  const isPermission = appliedToArray?.includes(userInfo?.UserID);
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      style={[
        styles.container,
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
      <SafeAreaView style={styles.container}>
        <HeaderBack
          title={detailApprovalListProcess?.PlanName}
          onPress={() => navigation.goBack()}
          btn={detailApprovalListProcess?.IsLock === 0 ? true : false}
          iconBtn={edit}
          onPressBtn={handleEditForm}
        />
        <View style={styles.scrollView}>
          <TabsHeaderDevices
            data={TAB_APPROVAL_PROCESS}
            selected={selectedTab}
            onSelect={selectTabEvent}
            tabWidth={2}
          />

          <View style={styles.containerBody}>
            {selectedTab.id === 1 && (
              <Detail {...{detailApprovalListProcess}} />
            )}
            {selectedTab.id === 2 && (
              <ApprovalProgress {...{detailApprovalListProcess}} />
            )}
          </View>
        </View>
        {detailApprovalListProcess?.IsCompleted === 1 ||
        !isPermission ? null : (
          <View style={styles.containerFooter}>
            <Button
              style={styles.btnFooter}
              onPress={showModalApprove}
              disabled={detailApprovalListProcess?.IsLock === 0 ? true : false}>
              <Text style={styles.txtBtnFooter}>{languageKey('_approve')}</Text>
            </Button>
          </View>
        )}
        {isShowModalApprove && (
          <Modal
            isVisible={isShowModalApprove}
            useNativeDriver={true}
            onBackdropPress={closeModalApprove}
            onBackButtonPress={closeModalApprove}
            backdropTransitionOutTiming={450}
            style={styles.modal}>
            <View style={styles.headerModal}>
              <View>
                <SvgXml xml={close_white} />
              </View>
              <Text style={[styles.titleModal, {marginBottom: scale(5)}]}>
                {languageKey('_approval_information')}
              </Text>
              <Button onPress={closeModalApprove}>
                <SvgXml xml={close_red} />
              </Button>
            </View>
            <View style={styles.modalContainer}>
              <View style={styles.containerRadio}>
                <RadioButton data={dataCheckbox} setValue={setIsApproval} />
              </View>
              <Text style={styles.headerInput}>
                {languageKey('_approved_content')}
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeContentApproval}
                value={contentApproval}
                numberOfLines={4}
                multiline={true}
                placeholder={languageKey('_enter_approval_content')}
              />
              <View style={styles.footer}>
                <Button style={styles.btnFooterModal} onPress={submitApproval}>
                  <Text style={styles.txtBtnFooterModal}>
                    {languageKey('_confirm')}
                  </Text>
                </Button>
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>
      <LoadingModal visible={isSubmitting} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    height: height,
    backgroundColor: colors.graySystem2,
  },
  containerBody: {
    height: height,
  },
  containerFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    alignItems: 'center',
    zIndex: 10,
    borderTopWidth: scale(1),
    borderTopColor: colors.borderColor,
    borderTopColor: colors.borderColor,
  },
  btnFooter: {
    backgroundColor: colors.blue,
    height: hScale(38),
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: scale(8),
    marginBottom: scale(Platform.OS === 'android' ? 0 : 16),
  },
  txtBtnFooter: {
    fontSize: fontSize.size16,
    lineHeight: scale(24),
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: scale(1),
    borderBottomColor: colors.borderColor,
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(12),
    borderTopRightRadius: scale(12),
    paddingVertical: scale(6),
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
    justifyContent: 'center',
    backgroundColor: colors.green,
    borderRadius: scale(8),
    height: hScale(38),
    marginVertical: scale(8),
    marginHorizontal: scale(12),
  },
  txtBtnFooterModal: {
    color: colors.white,
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(22),
  },
  headerInput: {
    fontSize: fontSize.size14,
    lineHeight: scale(22),
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: colors.black,
    marginBottom: scale(8),
    marginHorizontal: scale(12),
  },
  input: {
    borderWidth: scale(1),
    borderColor: colors.borderColor,
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    marginBottom: scale(8),
    borderRadius: scale(8),
    fontSize: fontSize.size14,
    lineHeight: scale(22),
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    color: colors.black,
    textAlignVertical: 'top',
    backgroundColor: '#F9FAFB',
    marginHorizontal: scale(12),
  },
  containerRadio: {
    marginHorizontal: scale(12),
  },
  image: {
    width: width / 4 - 24,
    height: hScale(82),
    borderRadius: scale(12),
    marginHorizontal: scale(4),
    marginTop: scale(8),
  },
  containerTableFileItem: {
    marginBottom: scale(8),
    marginHorizontal: scale(12),
  },
  txtHeaderBody: {
    color: '#6B7280',
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
  },
});

export default DetailPlanVisitCustomer;
