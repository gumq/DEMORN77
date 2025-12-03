import React, {useEffect, useMemo, useState} from 'react';
import _ from 'lodash';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {View, StatusBar, ScrollView, Text, Platform} from 'react-native';

import {edit} from '@svgImg';
import routes from '@routes';
import {stylesDetail} from './styles';
import {HeaderBack, LoadingModal, RenderImage} from '@components';
import {translateLang} from '@store/accLanguages/slide';
import {fetchDetailCusRequirement} from '@store/accCus_Requirement/thunk';
import {ModalApprovalCus, ModalApprovalStepTwo} from './modalApprovalCus';
import { scale } from '@utils/resolutions';
const DetailCusRequirementScreen = ({route, item}) => {
  const itemData = item || route?.params?.item;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const {userInfo} = useSelector(state => state.Login);
  const {isSubmitting, detailCusRequirement, listDepartment} = useSelector(
    state => state.CusRequirement,
  );
  const [showFormAccept, setShowFormAccept] = useState(false);
  const [showFormStepTwo, setShowFormStepTwo] = useState(false);
  const linkImgArray = useMemo(() => {
    return detailCusRequirement?.RequestLink
      ? detailCusRequirement.RequestLink.split(';').filter(Boolean)
      : [];
  }, [detailCusRequirement?.RequestLink]);
  const departmentName = listDepartment.find(
    item => item.ID === detailCusRequirement?.TransferDepartmentID,
  );

  useEffect(() => {
    const body = {
      OID:
        itemData?.ReferenceID && itemData?.ReferenceID !== ''
          ? itemData?.ReferenceID
          : itemData?.OID,
    };
    dispatch(fetchDetailCusRequirement(body));
  }, [itemData]);

  const handleFormEdit = () => {
    navigation.navigate(routes.FormCustomerRequirement, {
      item: detailCusRequirement,
      editOrder: true,
    });
  };

  useEffect(() => {
    const showForm = detailCusRequirement?.IsCompleted === 1;
    const appliedToArray =
      detailCusRequirement?.AppliedToID?.split(',').map(Number);
    const isPermission = appliedToArray?.includes(userInfo?.UserID);
    const isUnlocked = detailCusRequirement?.IsLock !== 0;

    const canEdit = isPermission && isUnlocked;

    setShowFormAccept(
      detailCusRequirement?.IsCustomer === 1 &&
        detailCusRequirement?.ConfirmUser === 0,
    );

    setShowFormStepTwo(showForm && canEdit);
  }, [detailCusRequirement, userInfo]);

  const itemLinksConfirmLink = useMemo(() => {
    return detailCusRequirement?.ConfirmLink
      ? detailCusRequirement.ConfirmLink.split(';').filter(Boolean)
      : [];
  }, [detailCusRequirement?.ConfirmLink]);

  const itemLinksTransferLink = useMemo(() => {
    return detailCusRequirement?.TransferLink
      ? detailCusRequirement.TransferLink.split(';').filter(Boolean)
      : [];
  }, [detailCusRequirement?.TransferLink]);

  const itemLinksStepOne = useMemo(() => {
    return detailCusRequirement?.ResponseLink
      ? detailCusRequirement.ResponseLink.split(';').filter(Boolean)
      : [];
  }, [detailCusRequirement?.ResponseLink]);

  const itemLinksCofirmComplete = useMemo(() => {
    return detailCusRequirement?.ConfirmCompleteLink
      ? detailCusRequirement.ConfirmCompleteLink.split(';').filter(Boolean)
      : [];
  }, [detailCusRequirement?.ConfirmCompleteLink]);

  const itemLinksStepTwo = useMemo(() => {
    return detailCusRequirement?.BusinessResponseLink
      ? detailCusRequirement.BusinessResponseLink.split(';').filter(Boolean)
      : [];
  }, [detailCusRequirement?.BusinessResponseLink]);
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
          title={languageKey('_request_details')}
          onPress={() => navigation.goBack()}
          btn={
            detailCusRequirement?.IsLock === 0 &&
            detailCusRequirement?.IsCustomer !== 1
              ? true
              : false
          }
          onPressBtn={handleFormEdit}
          iconBtn={edit}
        />
        <ScrollView
          style={stylesDetail.scrollView}
          contentContainerStyle={stylesDetail.footerScroll}
          showsVerticalScrollIndicator={false}>
          <View style={stylesDetail.cardProgram}>
            <View style={stylesDetail.containerHeader}>
              <Text style={stylesDetail.headerProgram}>
                {languageKey('_information_general')}
              </Text>
              <View
                style={[
                  stylesDetail.bodyStatus,
                  {backgroundColor: detailCusRequirement?.ApprovalStatusColor},
                ]}>
                <Text
                  style={[
                    stylesDetail.txtStatus,
                    {color: detailCusRequirement?.ApprovalStatusTextColor},
                  ]}>
                  {detailCusRequirement?.ApprovalStatusName}
                </Text>
              </View>
            </View>
            <View style={stylesDetail.bodyCard}>
              {detailCusRequirement?.EntryName ? (
                <View style={stylesDetail.containerBody}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_function')}
                  </Text>
                  <Text
                    style={stylesDetail.contentBody}
                    numberOfLines={3}
                    ellipsizeMode="tail">
                    {detailCusRequirement?.EntryName}
                  </Text>
                </View>
              ) : null}
              <View style={stylesDetail.containerGeneralInfor}>
                <View style={stylesDetail.containerBody}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_ct_code')}
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {detailCusRequirement?.OID}
                  </Text>
                </View>
                <View style={stylesDetail.containerBody}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_ct_day')}
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {moment(detailCusRequirement?.ODate).format('DD/MM/YYYY')}
                  </Text>
                </View>
              </View>

              {detailCusRequirement?.CustomerName ? (
                <View style={stylesDetail.containerBody}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_customer_name')}
                  </Text>
                  <Text
                    style={stylesDetail.contentBody}
                    numberOfLines={3}
                    ellipsizeMode="tail">
                    {detailCusRequirement?.CustomerName}
                  </Text>
                </View>
              ) : null}
              {detailCusRequirement?.CustomerRequestTypeName ? (
                <View style={stylesDetail.containerBody}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_request_content')}
                  </Text>
                  <Text
                    style={stylesDetail.contentBody}
                    numberOfLines={3}
                    ellipsizeMode="tail">
                    {detailCusRequirement?.CustomerRequestTypeName}
                  </Text>
                </View>
              ) : null}
              {detailCusRequirement?.CustomerRequest ? (
                <View style={stylesDetail.containerBody}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_detailed_description_of_requirement')}
                  </Text>
                  <Text
                    style={stylesDetail.contentBody}
                    numberOfLines={3}
                    ellipsizeMode="tail">
                    {detailCusRequirement?.CustomerRequest}
                  </Text>
                </View>
              ) : null}
              {detailCusRequirement?.Note ? (
                <View style={stylesDetail.containerBody}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_note')}
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {detailCusRequirement?.Note}
                  </Text>
                </View>
              ) : null}
              {detailCusRequirement?.TransferDepartmentID ? (
                <View style={stylesDetail.containerBody}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_forwarding_department')}
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {departmentName?.Name}
                  </Text>
                </View>
              ) : null}
              {detailCusRequirement?.IsCustomer === 1 ? null : (
                <View style={stylesDetail.containerGeneralInfor}>
                  <View style={stylesDetail.containerBody}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_officer_in_charge')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {detailCusRequirement?.ResponsibleEmployeeName}
                    </Text>
                  </View>
                  <View style={stylesDetail.containerBody}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_processing_time_limit')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {moment(detailCusRequirement?.RequestDueDate).format(
                        'DD/MM/YYYY',
                      )}
                    </Text>
                  </View>
                </View>
              )}
            </View>
            {linkImgArray.length > 0 && (
              <View style={stylesDetail.containerImage}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_image')}
                </Text>
                <RenderImage urls={linkImgArray} />
              </View>
            )}
          </View>
          {showFormAccept && (
            <ModalApprovalCus
              isShowInforApproval={showFormAccept}
              setShowForm={setShowFormAccept}
            />
          )}

          {detailCusRequirement?.ConfirmUser !== 0 &&
            detailCusRequirement?.IsCustomer !== 0 && (
              <View style={stylesDetail.cardProgram}>
                <Text style={stylesDetail.headerProgram}>
                  {languageKey('_customer_reception_information')}
                </Text>
                <View style={stylesDetail.containerInforForm}>
                  <View style={stylesDetail.containerBody}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_confirmer')}
                    </Text>
                    <Text style={stylesDetail.contentBodyColumn}>
                      {detailCusRequirement?.ConfirmUserName}
                    </Text>
                  </View>
                  <View style={stylesDetail.containerBody}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_estimated_time')}
                    </Text>
                    <Text style={stylesDetail.contentBodyColumn}>
                      {moment(detailCusRequirement?.ConfirmDate).format(
                        'DD/MM/YYYY',
                      )}
                    </Text>
                  </View>
                </View>
                <View style={stylesDetail.containerBody}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_content')}
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {detailCusRequirement?.ConfirmNote}
                  </Text>
                </View>
                {itemLinksConfirmLink.length > 0 && (
                  <View>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_image')}
                    </Text>
                    <RenderImage urls={itemLinksConfirmLink} />
                  </View>
                )}
                {detailCusRequirement?.ApprovalStatus === -1 ? null : (
                  <>
                    <View style={stylesDetail.lineDetail} />

                    <Text style={stylesDetail.headerProgram}>
                      {languageKey('_processing_forwarding_information')}
                    </Text>
                    {detailCusRequirement?.TransferDepartmentName ? (
                      <View style={stylesDetail.containerBody}>
                        <Text style={stylesDetail.txtHeaderBody}>
                          {languageKey('_forwarding_department')}
                        </Text>
                        <Text style={stylesDetail.contentBody}>
                          {detailCusRequirement?.TransferDepartmentName}
                        </Text>
                      </View>
                    ) : null}
                    <View style={stylesDetail.containerInforForm}>
                      <View style={stylesDetail.containerBody}>
                        <Text style={stylesDetail.txtHeaderBody}>
                          {languageKey('_officer_in_charge')}
                        </Text>
                        <Text style={stylesDetail.contentBodyColumn}>
                          {detailCusRequirement?.ResponsibleEmployeeName}
                        </Text>
                      </View>
                      <View style={stylesDetail.containerBody}>
                        <Text style={stylesDetail.txtHeaderBody}>
                          {languageKey('_processing_time_limit')}
                        </Text>
                        <Text style={stylesDetail.contentBodyColumn}>
                          {moment(detailCusRequirement?.RequestDueDate).format(
                            'DD/MM/YYYY',
                          )}
                        </Text>
                      </View>
                    </View>
                    <View style={stylesDetail.containerBody}>
                      <Text style={stylesDetail.txtHeaderBody}>
                        {languageKey('_content')}
                      </Text>
                      <Text style={stylesDetail.contentBody}>
                        {detailCusRequirement?.ConfirmNote}
                      </Text>
                    </View>
                    {itemLinksTransferLink.length > 0 && (
                      <View>
                        <Text style={stylesDetail.txtHeaderBody}>
                          {languageKey('_image')}
                        </Text>
                        <RenderImage urls={itemLinksTransferLink} />
                      </View>
                    )}
                  </>
                )}
              </View>
            )}

          {detailCusRequirement?.ResponseUser !== 0 && (
            <View style={stylesDetail.cardProgram}>
              <Text style={stylesDetail.headerProgram}>
                {languageKey('_feedback_from_department')}
              </Text>
              <View style={stylesDetail.containerInforForm}>
                <View style={stylesDetail.containerBody}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_confirmer')}
                  </Text>
                  <Text style={stylesDetail.contentBodyColumn}>
                    {detailCusRequirement?.ResponseUserName}
                  </Text>
                </View>
                <View style={stylesDetail.containerBody}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_estimated_time')}
                  </Text>
                  <Text style={stylesDetail.contentBodyColumn}>
                    {moment(detailCusRequirement?.ResponseDate).format(
                      'DD/MM/YYYY',
                    )}
                  </Text>
                </View>
              </View>
              <View style={stylesDetail.containerBody}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_content')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {detailCusRequirement?.ResponseNote}
                </Text>
              </View>
              {itemLinksStepOne.length > 0 && (
                <View>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_image')}
                  </Text>
                  <RenderImage urls={itemLinksStepOne} />
                </View>
              )}
            </View>
          )}

          {detailCusRequirement?.ConfirmCompleteUser !== 0 && (
            <View style={stylesDetail.cardProgram}>
              <Text style={stylesDetail.headerProgram}>
                {languageKey('_confirm_completion')}
              </Text>
              <View style={stylesDetail.containerInforForm}>
                <View style={stylesDetail.containerBody}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_confirmer')}
                  </Text>
                  <Text style={stylesDetail.contentBodyColumn}>
                    {detailCusRequirement?.ConfirmCompleteUserName}
                  </Text>
                </View>
                <View style={stylesDetail.containerBody}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_estimated_time')}
                  </Text>
                  <Text style={stylesDetail.contentBodyColumn}>
                    {moment(detailCusRequirement?.ConfirmCompleteDate).format(
                      'DD/MM/YYYY',
                    )}
                  </Text>
                </View>
              </View>
              <View style={stylesDetail.containerBody}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_content')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {detailCusRequirement?.ConfirmCompleteNote}
                </Text>
              </View>
              {itemLinksCofirmComplete.length > 0 && (
                <View>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_image')}
                  </Text>
                  <RenderImage urls={itemLinksCofirmComplete} />
                </View>
              )}
            </View>
          )}

          {showFormStepTwo && (
            <ModalApprovalStepTwo
              isShowInforApproval={showFormStepTwo}
              setShowForm={setShowFormStepTwo}
            />
          )}
          {detailCusRequirement?.BusinessResponseNote && (
            <View style={stylesDetail.cardProgram}>
              <Text style={stylesDetail.headerProgram}>
                {languageKey('_feeback_infomation')}
              </Text>
              <View style={stylesDetail.containerInfor}>
                <View style={stylesDetail.containerBody}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_content')}
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {detailCusRequirement?.BusinessResponseNote}
                  </Text>
                </View>
              </View>
              {itemLinksStepTwo.length > 0 && (
                <View>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_image')}
                  </Text>
                  <RenderImage urls={itemLinksStepTwo} />
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      <LoadingModal visible={isSubmitting} />
    </LinearGradient>
  );
};

export default DetailCusRequirementScreen;
