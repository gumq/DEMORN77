/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {View, StatusBar, ScrollView, TextInput, Text, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Modal from 'react-native-modal';

import routes from 'modules/routes';
import {stylesDetail} from './styles';
import {DetailTab, ProgressTab} from './componentTab';
import {translateLang} from 'store/accLanguages/slide';
import {
  Button,
  HeaderBack,
  NotifierAlert,
  RadioButton,
  TabsHeaderDevices,
} from '@components';
import {ApiGeneralApprovals_ApprovalList} from 'action/Api';
import {fetchApiExportPDF_ExportPDF, fetchApiv2_OtherApprovals_GetByID} from 'store/accApproval_Signature/thunk';
import { scale } from 'utils/resolutions';
// import AttachFileCompleted from './componentTab/AttachFileCompleted';
// import Attachfiles from './componentTab/Attachfiles';
import moment from 'moment';

const DetailApprovalScreen = ({route, item}) => {
  const itemData = item || route?.params?.item;
  const languageKey = useSelector(translateLang);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {userInfo} = useSelector(state => state.Login);
  const [contentApproval, onChangeContentApproval] = useState('');
   const {detailApprovalList} = useSelector(
      state => state.ApprovalProcess,
    );
  const dataCheckbox = [
    {id: 1, value: languageKey('_argee'), key: 1},
    {id: 2, value: languageKey('_refuse'), key: 0},
  ];
  const [isApproval, setIsApproval] = useState(dataCheckbox[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const TAB_DETAILS_PROGRAM = [
    {id: 1, label: languageKey('_details')},
    {id: 2, label: languageKey('_progress')},
  ];

  const [selectedTab, setSelectTab] = useState(TAB_DETAILS_PROGRAM[0]);

  const selectTabEvent = item => {
    setSelectTab(item);
  };

  const handleToggleModal = () => {
    setModalVisible(!modalVisible);
  };
  // useEffect(() => {
  //   const body = {
  //     FactorID: 'Credit',
  //     EntryID: 'CustomerMains',
  //     OID: 'CM/1000/25/07/122',
  //   };
  //   dispatch(fetchApiExportPDF_ExportPDF(body));
  // }, [navigation, dispatch]);
   useEffect(() => {
    const body = {
      // FactorID: itemData?.FactorID,
      // EntryID: itemData?.EntryID,
      //     FactorID: 'Credit',
  //     EntryID: 'CustomerMains',
      OID: itemData?.OID,
    };
    const bodygetbyid = {
      OID: itemData?.OID,
    };
    console.log('bodygetbyid',bodygetbyid)
    const data = fetchApiv2_OtherApprovals_GetByID(bodygetbyid);
    // const bi = fetchApiExportPDF_ExportPDF(body);
  }, [navigation, itemData]);
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
        navigation.navigate(routes.ApprovalSignatureScreen);
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
  const appliedToArray = itemData?.AppliedToID?.split(',').map(Number);
  const isPermission =
    appliedToArray?.includes(userInfo?.UserID) && itemData?.IsLock !== 0;
  const isUserIncluded = (() => {
    if (!detailApprovalList?.AppliedToID || !userInfo?.UserID) return false;
    const appliedList = detailApprovalList.AppliedToID.split(',')
      .map(id => id.trim())
      .filter(Boolean);

    return appliedList.includes(String(userInfo.UserID));
  })();
  if (isUserIncluded === true) {
    console.log('Người dùng có trong danh sách phê duyệt');
  } else {
    console.log('Người dùng KHÔNG nằm trong danh sách phê duyệt');
  }


  return (
    <LinearGradient
      style={stylesDetail.container}
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
        <HeaderBack title={itemData?.OID} onPress={() => navigation.goBack()} />
        <View style={stylesDetail.scrollView}>
          <TabsHeaderDevices
            data={TAB_DETAILS_PROGRAM}
            selected={selectedTab}
            onSelect={selectTabEvent}
            tabWidth={2}
          />
          <ScrollView
            scrollEnabled={true}
            style={stylesDetail.containerBody}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={stylesDetail.flatScroll}>
            {/* {selectedTab.id === 1 && <DetailTab {...{itemData}} />}
            {selectedTab.id === 2 && <ProgressTab {...{itemData}} />} */}
             {selectedTab.id === 1 && (
              <DetailTab {...{ itemData: detailApprovalList }} />
            )}
            {selectedTab.id === 2 && (
              <ProgressTab itemData={detailApprovalList?.Progress} />
            )}

            {selectedTab.id === 1 && (
              <View style={stylesDetail.container}>
                <View style={stylesDetail.cardProgram}>
                  <View
                    style={[
                      stylesDetail.containerHeader,
                      { marginBottom: scale(8) },
                    ]}>
                    <Text style={stylesDetail.headerttc}>
                      {'File đính kèm'}
                    </Text>
                  </View>
                  {/* <Attachfiles
                    detailTraining={detailApprovalList}></Attachfiles> */}
                </View>
              </View>
            )}
            {selectedTab.id === 1 &&
              detailApprovalList?.Extention14 &&
              parseInt(detailApprovalList?.IsCompleted,10) === 1 && (
                <View style={stylesDetail.container}>
                  <View style={stylesDetail.cardProgram}>
                    <View
                      style={[
                        stylesDetail.containerHeader,
                        { marginBottom: scale(8) },
                      ]}>
                      <Text style={stylesDetail.headerttc}>
                        {'Kế hoạch dự kiến thực hiện'}
                      </Text>
                    </View>

                    {JSON?.parse(
                      detailApprovalList?.Extention14 || '[]',
                    ).map((item, index) => (
                      <View>
                        <View style={stylesDetail.containerContentBody}>
                          <View style={stylesDetail.containerBodyCard}>
                            <Text style={stylesDetail.txtHeaderBody}>
                              {'Từ ngày'}
                            </Text>
                            <Text style={stylesDetail.contentBody}>
                              {moment(item.FromDate).format('DD/MM/YYYY')}
                            </Text>
                          </View>
                          {item.ToDate && (
                            <View style={stylesDetail.containerBodyCard}>
                              <Text style={stylesDetail.txtHeaderBody}>
                                {'Đến ngày'}
                              </Text>
                              <Text style={stylesDetail.contentBody}>
                                {moment(item.ToDate).format('DD/MM/YYYY')}
                              </Text>
                            </View>
                          )}
                        </View>
                        <View style={stylesDetail.containerContentBody}>
                          <View style={stylesDetail.containerBodyCard}>
                            <Text style={stylesDetail.txtHeaderBody}>
                              {'Công việc dự kiến'}
                            </Text>
                            <Text style={stylesDetail.contentBody}>
                              {item.PlanTask}
                            </Text>
                          </View>
                        </View>
                        <View style={stylesDetail.containerContentBody}>
                          <View style={stylesDetail.containerBodyCard}>
                            <Text style={stylesDetail.txtHeaderBody}>
                              {'Số tiền dự kiến'}
                            </Text>
                            <Text style={stylesDetail.contentBody}>
                              {Number(item.PlanMoney).toLocaleString('vi-VN')} ₫
                            </Text>
                          </View>
                          {item.PlanStatus && (
                            <View style={stylesDetail.containerBodyCard}>
                              <Text style={stylesDetail.txtHeaderBody}>
                                Trạng thái
                              </Text>
                              {/* <Ionicons
                                name={
                                  item.PlanStatus === '1'
                                    ? 'checkbox-outline'
                                    : 'square-outline'
                                }
                                color={colors.blue}
                                size={scale(20)}
                              /> */}
                            </View>
                          )}
                        </View>
                        {item.CreatedUserName && (
                          <View style={stylesDetail.containerContentBody}>
                            <View style={stylesDetail.containerBodyCard}>
                              <Text style={stylesDetail.txtHeaderBody}>
                                {'Người tạo'}
                              </Text>
                              <Text style={stylesDetail.contentBody}>
                                {item.CreatedUserName}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              )}
            {selectedTab.id === 1 &&
              (detailApprovalList?.Extention10 ||
                detailApprovalList?.Extention9) &&
              parseInt(detailApprovalList?.IsCompleted) === 1 && (
                <View style={stylesDetail.container}>
                  <View style={stylesDetail.cardProgram}>
                    <View
                      style={[
                        stylesDetail.containerHeader,
                        { marginBottom: scale(8) },
                      ]}>
                      <Text style={stylesDetail.headerttc}>
                        {'Xác nhận hoàn thành'}
                      </Text>
                    </View>
                    <View style={stylesDetail.containerContentBody}>
                      <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>
                          {'Nội dung xác nhận hoàn thành'}
                        </Text>
                        <Text style={stylesDetail.contentBody}>
                          {detailApprovalList?.Extention10}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        stylesDetail.containerHeader,
                        { marginBottom: scale(8) },
                      ]}>
                      <Text style={stylesDetail.txtHeaderBody}>
                        {'File xác nhận hoàn thành'}
                      </Text>
                    </View>
                    {/* <AttachFileCompleted
                      detailTraining={
                        detailApprovalList
                      }></AttachFileCompleted> */}
                  </View>
                </View>
              )}
            {selectedTab.id === 1 &&
              isUserIncluded === true &&
              parseInt(detailApprovalList?.StatusID, 10) === 0 && (
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled">
                  <View style={stylesDetail.container}>
                    <View style={stylesDetail.cardProgramduyet}>
                      <View
                        style={[
                          stylesDetail.containerHeader,
                          { marginBottom: scale(8) },
                        ]}>
                        <Text style={stylesDetail.headerttc}>
                          Thông tin xét duyệt
                        </Text>
                      </View>

                      <View style={{ marginHorizontal: scale(0) }}>
                        <RadioButton
                          selected={isApproval}
                          data={dataCheckbox}
                          onSelect={setIsApproval}
                          op={true}
                        />
                      </View>

                      <View style={{ marginTop: scale(10) }} />
                      <Text
                        style={[
                          stylesDetail.txtHeaderInputViewduyet,
                          {
                            fontWeight:
                              Platform.OS === 'android' ? '600' : '500',
                          },
                        ]}>
                        Nội dung
                      </Text>

                      <TextInput
                        multiline
                        style={stylesDetail.inputNoteduyet}
                        onChangeText={onChangeContentApproval}
                        value={contentApproval}
                        numberOfLines={4}
                        placeholder="Nhập nội dung"
                      />

                      <View style={stylesDetail.containerFooterModal}>
                        <Button
                          style={stylesDetail.btnFooterModal}
                          onPress={submitApproval}>
                          <Text style={stylesDetail.txtBtnFooterModal}>
                            Xác nhận
                          </Text>
                        </Button>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              )}
          </ScrollView>
        </View>
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
              <Text style={stylesDetail.txtHeaderInputView}>
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
    </LinearGradient>
  );
};

export default DetailApprovalScreen;
