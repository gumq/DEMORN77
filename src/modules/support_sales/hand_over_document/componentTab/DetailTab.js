import React, {useEffect, useMemo, useState} from 'react';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text, FlatList, Dimensions} from 'react-native';

import {ModalStepOne, ModalStepTwo} from '../modalApproval';
import {translateLang} from '@store/accLanguages/slide';
import {stylesDetail, stylesFormHandOverDocument} from '../styles';
import {fetchListDocumentTypes} from '@store/accHand_Over_Doc/thunk';
import {Button, RenderImage} from '@components';
import {SvgXml} from 'react-native-svg';
import {arrow_down_big, arrow_next_gray} from '@svgImg';

const {width} = Dimensions.get('window');
const DetailTab = ({detailHandOverDoc}) => {
  const languageKey = useSelector(translateLang);
  const dispatch = useDispatch();
  const {listDocumentTypes} = useSelector(state => state.HandOverDoc);
  const {userInfo} = useSelector(state => state.Login);
  const [showInformation, setShowInformation] = useState({
    information: true,
  });

  const toggleInformation = key => {
    setShowInformation(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const linkImgArrayStepOne = useMemo(() => {
    return detailHandOverDoc?.ConfirmReceiptLink
      ? detailHandOverDoc.ConfirmReceiptLink.split(';').filter(Boolean)
      : [];
  }, [detailHandOverDoc?.ConfirmReceiptLink]);

  const linkImgArrayStepTwo = useMemo(() => {
    return detailHandOverDoc?.DeliveryToCustomerLink
      ? detailHandOverDoc.DeliveryToCustomerLink.split(';').filter(Boolean)
      : [];
  }, [detailHandOverDoc?.DeliveryToCustomerLink]);

  const linkImgArrayStepThree = useMemo(() => {
    return detailHandOverDoc?.AccountantConfirmLink
      ? detailHandOverDoc.AccountantConfirmLink.split(';').filter(Boolean)
      : [];
  }, [detailHandOverDoc?.AccountantConfirmLink]);

  useEffect(() => {
    const body = {
      FactorID: detailHandOverDoc?.FactorID,
      EntryID: detailHandOverDoc?.EntryID,
    };
    dispatch(fetchListDocumentTypes(body));
  }, []);

  const [showFormStepOne, setShowFormStepOne] = useState(false);
  const [showFormStepTwo, setShowFormStepTwo] = useState(false);

  const getLatestStepData = step => {
    if (!detailHandOverDoc?.Progress || detailHandOverDoc.Progress.length === 0)
      return null;

    const lastResetIndex = detailHandOverDoc.Progress.findIndex(
      item => item.ApprovalStep === 0,
    );

    const validProgress =
      lastResetIndex !== -1
        ? detailHandOverDoc.Progress.slice(0, lastResetIndex)
        : detailHandOverDoc.Progress;

    const stepData = validProgress.find(item => item.Step === step);

    return stepData || null;
  };
  const inforApprovalsStepOne = getLatestStepData(1);
  const inforApprovalsStepTwo = getLatestStepData(2);
  const inforApprovalsStepThree = getLatestStepData(4);

  const _keyExtractor = (item, index) => `${item.ID}-${index}`;
  const _renderItem = ({item}) => {
    const documentType = listDocumentTypes?.find(
      c => c.ID === item?.DocumentTypeID,
    );
    const itemLinks = item?.Link.split(';').filter(Boolean);
    return (
      <View style={stylesDetail.cardProgramItem}>
        <View style={stylesDetail.cardCustomer}>
          <View style={stylesDetail.containerHeader}>
            <View style={stylesDetail.containerText}>
              <Text style={stylesDetail.txtHeader}>
                {languageKey('_customer')}
              </Text>
              <Text
                style={stylesDetail.content}
                numberOfLines={2}
                ellipsizeMode="tail">
                {item?.CustomerName}
              </Text>
            </View>
          </View>
          <View style={stylesDetail.containerHeader}>
            <View style={stylesDetail.containerText}>
              <Text style={stylesDetail.txtHeader}>
                {languageKey('_document_type')}
              </Text>
              <Text style={stylesDetail.content}>{documentType?.Name}</Text>
            </View>
            <View style={stylesDetail.containerText}>
              <Text style={stylesDetail.txtHeader}>
                {languageKey('_document_number')}
              </Text>
              <Text style={stylesDetail.content}>{item?.ReferenceID}</Text>
            </View>
          </View>
          <View style={stylesDetail.containerHeader}>
            <View style={stylesDetail.containerText}>
              <Text style={stylesDetail.txtHeader}>
                {languageKey('_original_number')}
              </Text>
              <Text style={stylesDetail.content}>
                {item?.NumberOfOriginals}
              </Text>
            </View>
            <View style={stylesDetail.containerText}>
              <Text style={stylesDetail.txtHeader}>
                {languageKey('_number_of_coppies')}
              </Text>
              <Text style={stylesDetail.content}>{item?.NumberOfCopies}</Text>
            </View>
          </View>
          {itemLinks.length > 0 && (
            <View>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_image')}
              </Text>
              <RenderImage urls={itemLinks} widthScreen={width / 4 - 23} />
            </View>
          )}
        </View>
      </View>
    );
  };

  useEffect(() => {
    const currentStep = detailHandOverDoc?.Step;
    const appliedToArray =
      detailHandOverDoc?.AppliedToID?.split(',').map(Number);
    const isPermission = appliedToArray?.includes(userInfo?.UserID);
    const isUnlocked = detailHandOverDoc?.IsLock !== 0;

    const canEdit = isPermission && isUnlocked;

    setShowFormStepOne(currentStep === 1 && canEdit);
    setShowFormStepTwo(currentStep === 2 && canEdit);
  }, [detailHandOverDoc, userInfo]);

  return (
    <View style={stylesDetail.container} showsVerticalScrollIndicator={false}>
      <View style={stylesDetail.cardProgram}>
        <View style={stylesDetail.containerHeader}>
          <Text style={stylesDetail.headerProgram}>
            {languageKey('_information_general')}
          </Text>
          <View
            style={[
              stylesDetail.bodyStatus,
              {
                backgroundColor:
                  detailHandOverDoc?.ApprovalStatusColor?.toLowerCase(),
              },
            ]}>
            <Text
              style={[
                stylesDetail.txtStatus,
                {
                  color:
                    detailHandOverDoc?.ApprovalStatusTextColor?.toLowerCase(),
                },
              ]}>
              {detailHandOverDoc?.ApprovalStatusName}
            </Text>
          </View>
        </View>
        <View style={stylesDetail.bodyCard}>
          <View style={stylesDetail.containerBodyCard}>
            <Text style={stylesDetail.txtHeaderBody}>
              {languageKey('_function')}
            </Text>
            <Text style={stylesDetail.contentBody}>
              {detailHandOverDoc?.EntryName}
            </Text>
          </View>
          <View style={stylesDetail.containerGeneralInfor}>
            <View style={stylesDetail.containerBodyCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_ct_code')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {detailHandOverDoc?.OID}
              </Text>
            </View>
            <View style={stylesDetail.containerBodyCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_ct_day')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {moment(detailHandOverDoc?.ODate).format('DD/MM/YYYY')}
              </Text>
            </View>
          </View>
          <View style={stylesDetail.containerBodyCard}>
            <Text style={stylesDetail.txtHeaderBody}>
              {languageKey('_deliverer')}
            </Text>
            <Text style={stylesDetail.contentBody}>
              {detailHandOverDoc?.DelivererName}
            </Text>
          </View>
          <View style={stylesDetail.containerBodyCard}>
            <Text style={stylesDetail.txtHeaderBody}>
              {languageKey('_receiver')}
            </Text>
            <Text style={stylesDetail.contentBody}>
              {detailHandOverDoc?.RecipientName}
            </Text>
          </View>
          <View style={stylesDetail.containerBodyCard}>
            <Text style={stylesDetail.txtHeaderBody}>
              {languageKey('_handover_content')}
            </Text>
            <Text style={stylesDetail.contentBody}>
              {detailHandOverDoc?.Content}
            </Text>
          </View>
        </View>
      </View>

      {detailHandOverDoc?.Details?.length > 0 ? (
        <View style={stylesDetail.cardProgram}>
          <View style={stylesDetail.containerHeaderShow}>
            <Text style={stylesDetail.headerShow}>
              {languageKey('_list_of_document')}
            </Text>
            <Button
              style={stylesDetail.btnShowInfor}
              onPress={() => toggleInformation('information')}>
              <SvgXml
                xml={
                  showInformation.information ? arrow_down_big : arrow_next_gray
                }
              />
            </Button>
          </View>
          {showInformation.information && (
            <FlatList
              data={detailHandOverDoc?.Details}
              renderItem={_renderItem}
              keyExtractor={_keyExtractor}
              contentContainerStyle={stylesDetail.containerFlatlist}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      ) : null}
      {showFormStepOne && (
        <ModalStepOne
          isShowInforApproval={showFormStepOne}
          setShowForm={setShowFormStepOne}
        />
      )}
      {inforApprovalsStepOne && (
        <View style={stylesDetail.cardProgram}>
          <Text style={stylesDetail.headerProgram}>
            {languageKey('_confirmation_of_receipt_of_document')}
          </Text>
          <View style={stylesDetail.containerInfor}>
            <View style={stylesDetail.containerHeaderColumn}>
              <View style={{width: '45%'}}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_confirmer')}
                </Text>
                <Text style={stylesDetail.contentBodyColumn}>
                  {inforApprovalsStepOne?.UserFullName}
                </Text>
              </View>
              <View style={{width: '45%'}}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_time')}
                </Text>
                <Text style={stylesDetail.contentBodyColumn}>
                  {moment(inforApprovalsStepOne?.CreateDate).format(
                    'HH:mm DD/MM/YYYY',
                  )}
                </Text>
              </View>
            </View>
            <View style={stylesDetail.containerBodyCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_content')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {inforApprovalsStepOne?.ApprovalNote}
              </Text>
            </View>
          </View>
          {linkImgArrayStepOne.length > 0 && (
            <View style={stylesDetail.containerTableFileItem}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_image')}
              </Text>
              <RenderImage urls={linkImgArrayStepOne} />
            </View>
          )}
        </View>
      )}

      {showFormStepTwo && (
        <ModalStepTwo
          isShowInforApproval={showFormStepTwo}
          setShowForm={setShowFormStepTwo}
        />
      )}
      {inforApprovalsStepTwo && (
        <View style={stylesDetail.cardProgram}>
          <Text style={stylesDetail.headerProgram}>
            {languageKey('_confirm_delivery_to_customer')}
          </Text>
          <View style={stylesDetail.containerInfor}>
            <View style={stylesDetail.containerHeaderColumn}>
              <View style={{width: '45%'}}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_confirmer')}
                </Text>
                <Text style={stylesDetail.contentBodyColumn}>
                  {inforApprovalsStepTwo?.UserFullName}
                </Text>
              </View>
              <View style={{width: '45%'}}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_time')}
                </Text>
                <Text style={stylesDetail.contentBodyColumn}>
                  {moment(inforApprovalsStepTwo?.CreateDate).format(
                    'HH:mm DD/MM/YYYY',
                  )}
                </Text>
              </View>
            </View>
            <View style={stylesDetail.containerBodyCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_content')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {inforApprovalsStepTwo?.ApprovalNote}
              </Text>
            </View>
          </View>
          {linkImgArrayStepTwo.length > 0 && (
            <View style={stylesDetail.containerTableFileItem}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_image')}
              </Text>
              <RenderImage urls={linkImgArrayStepTwo} />
            </View>
          )}
        </View>
      )}

      {inforApprovalsStepThree && (
        <View style={stylesDetail.cardProgram}>
          <Text style={stylesDetail.headerProgram}>
            {languageKey('_accountant_confirm')}
          </Text>
          <View style={stylesDetail.containerInfor}>
            <View style={stylesDetail.containerHeaderColumn}>
              <View style={{width: '45%'}}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_confirmer')}
                </Text>
                <Text style={stylesDetail.contentBodyColumn}>
                  {inforApprovalsStepThree?.UserFullName}
                </Text>
              </View>
              <View style={{width: '45%'}}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_time')}
                </Text>
                <Text style={stylesDetail.contentBodyColumn}>
                  {moment(inforApprovalsStepThree?.CreateDate).format(
                    'HH:mm DD/MM/YYYY',
                  )}
                </Text>
              </View>
            </View>
            <View style={stylesDetail.containerBodyCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_content')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {inforApprovalsStepThree?.ApprovalNote}
              </Text>
            </View>
          </View>
          {linkImgArrayStepThree.length > 0 && (
            <View style={stylesDetail.containerTableFileItem}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_image')}
              </Text>
              <RenderImage urls={linkImgArrayStepThree} />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default DetailTab;
