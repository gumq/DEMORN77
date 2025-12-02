/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StackActions, useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  View,
  StatusBar,
  ScrollView,
  TextInput,
  Text,
  Platform,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Modal from 'react-native-modal';

import {edit} from 'svgImg';
import routes from 'modules/routes';
import {stylesDetail} from './styles';
import {DetailTab, ProgressTab} from './componentTab';
import {translateLang} from 'store/accLanguages/slide';
import {
  Button,
  HeaderBack,
  LoadingModal,
  NotifierAlert,
  RadioButton,
  TabsHeaderDevices,
} from '@components';
import {ApiGeneralApprovals_ApprovalList} from 'action/Api';
import {fetchDetailCusCloseMove} from 'store/accCus_Closed_Move/thunk';
import {fetchApiApprovalProcess_GetById} from 'store/accApproval_Signature/thunk';
import {scale} from 'utils/resolutions';

const DetailCusClosedMoveScreen = ({route, item}) => {
  const itemData = item || route?.params?.item;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {userInfo} = useSelector(state => state.Login);
  const languageKey = useSelector(translateLang);
  const {isSubmitting, detailCustomerClosedMove} = useSelector(
    state => state.CustomerCloseMove,
  );
  const [dataBXD, setDataBXD] = useState([]);
  const [contentApproval, onChangeContentApproval] = useState('');
  const dataCheckbox = [
    {id: 1, value: languageKey('_argee'), key: 1},
    {id: 2, value: languageKey('_refuse'), key: 0},
  ];
  const [isApproval, setIsApproval] = useState(dataCheckbox[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleToggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const TAB_DETAILS_PROGRAM = [
    {id: 1, label: languageKey('_details')},
    {id: 2, label: languageKey('_progress')},
  ];

  const [selectedTab, setSelectTab] = useState(TAB_DETAILS_PROGRAM[0]);

  const selectTabEvent = item => {
    setSelectTab(item);
  };

  useEffect(() => {
    const body = {OID: itemData?.OID};
    dispatch(fetchDetailCusCloseMove(body));
  }, [itemData]);
  // console.log('detailCustomerClosedMoveaaaaaaaaaaaa', detailCustomerClosedMove);
  const handleFormEdit = () => {
    navigation.navigate(routes.FormCusClosedMoveScreen, {
      item: detailCustomerClosedMove,
      editCustomer: true,
    });
  };

  const submitApproval = async () => {
    const body = {
      dataJson: [
        {
          OID: itemData?.OID,
          FactorID: itemData?.FactorID,
          EntryID: itemData?.EntryID,
          ApprovalProcessID: itemData?.ApprovalProcessID,
          ApprovalStatusID: isApproval?.key,
          ApprovalNote: contentApproval,
          Extention1: 0,
          Extention2: new Date().toISOString(),
          Extention3: '',
          Extention4: '',
          Extention5: '',
          StringObject: '',
        },
      ],
    };
    try {
      const {data} = await ApiGeneralApprovals_ApprovalList(body);
      if (data.StatusCode === 200 && data.ErrorCode === '0') {
        NotifierAlert(
          3000,
          `${languageKey('_notification')}`,
          `${data.Message}`,
          'success',
        );
        navigation.navigate(routes.CustomerClosedMoveScreen);
        handleToggleModal();
      } else {
        NotifierAlert(
          3000,
          `${languageKey('_notification')}`,
          `${data.Message}`,
          'error',
        );
        handleToggleModal();
      }
    } catch (error) {
      console.log('ApprovalList', error);
    }
  };
  const fetchDataApprovalProcess_GetById = () => {
    const body = {ID: Number(itemData?.ApprovalProcessID)};
    dispatch(fetchApiApprovalProcess_GetById(body)).then(success => {
      try {
        if (success !== false) {
          // console.log('success', success);
          // setdataDetails(success);
          setDataBXD(success);
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    });
  };
  useEffect(() => {
    fetchDataApprovalProcess_GetById();
  }, [navigation, fetchApiApprovalProcess_GetById]);
  const appliedToArray =
    detailCustomerClosedMove?.AppliedToID?.split(',').map(Number);
  // console.log('appliedToArray',detailCustomerClosedMove?.AppliedToID)
  const isPermission =
    appliedToArray?.includes(userInfo?.UserID) &&
    detailCustomerClosedMove?.IsLock !== 0;
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      style={[
        stylesDetail.container,
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
      <SafeAreaView style={stylesDetail.container}>
        <HeaderBack
          title={languageKey('_endcoding_transcoding')}
          onPress={() => navigation.goBack()}
          btn={detailCustomerClosedMove?.IsLock === 0 ? true : false}
          onPressBtn={handleFormEdit}
          iconBtn={edit}
        />
        <View style={stylesDetail.scrollView}>
          <TabsHeaderDevices
            data={TAB_DETAILS_PROGRAM}
            selected={selectedTab}
            onSelect={selectTabEvent}
            tabWidth={2}
          />
          <ScrollView
            style={stylesDetail.containerBody}
            showsVerticalScrollIndicator={false}>
            {selectedTab.id === 1 && (
              <DetailTab {...{detailCustomerClosedMove, itemData}} />
            )}
            {selectedTab.id === 2 && (
              <ProgressTab {...{detailCustomerClosedMove, itemData, dataBXD}} />
            )}
          </ScrollView>
        </View>
        {selectedTab.id === 1 && isPermission && (
          <View style={stylesDetail.containerFooter}>
            <Button
              style={stylesDetail.btnFooter}
              onPress={handleToggleModal}
              disabled={!isPermission}>
              <Text style={stylesDetail.txtBtnFooter}>
                {languageKey('_approve')}
              </Text>
            </Button>
          </View>
        )}
        <Modal
          useNativeDriver
          backdropOpacity={0.6}
          isVisible={modalVisible}
          avoidKeyboard={true}
          style={stylesDetail.optionsModal}
          onBackButtonPress={handleToggleModal}
          onBackdropPress={handleToggleModal}
          hideModalContentWhileAnimating>
          <View style={stylesDetail.optionsModalContainer}>
            <Text style={stylesDetail.headerModalApproval}>
              {languageKey('_approval_information')}
            </Text>
            <ScrollView style={stylesDetail.cardProgramModal}>
              <View style={{marginHorizontal: 12}}>
                <RadioButton
                  initialValue={isApproval}
                  data={dataCheckbox}
                  setValue={setIsApproval}
                />
              </View>
              <Text style={stylesDetail.headerInput}>
                {languageKey('_content')}
              </Text>
              <TextInput
                multiline={true}
                style={stylesDetail.inputNote}
                onChangeText={onChangeContentApproval}
                value={contentApproval}
                numberOfLines={4}
                placeholder={languageKey('_enter_content')}
              />
            </ScrollView>
            <View style={stylesDetail.containerFooterModal}>
              <Button
                style={stylesDetail.btnFooterModal}
                onPress={submitApproval}>
                <Text style={stylesDetail.txtBtnFooterModal}>
                  {languageKey('_confirm')}
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
      <LoadingModal visible={isSubmitting} />
    </LinearGradient>
  );
};

export default DetailCusClosedMoveScreen;
