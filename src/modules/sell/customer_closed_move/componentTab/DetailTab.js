import React, {useEffect, useMemo, useState} from 'react';
import moment from 'moment';
import Modal from 'react-native-modal';
import {SvgXml} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text, FlatList, ScrollView} from 'react-native';

import {stylesDetail} from '../styles';
import {translateLang} from 'store/accLanguages/slide';
import {arrow_down_big, arrow_next_gray} from 'svgImg';
import {Button, RenderImage} from 'components';
import {
  fetchListSalesSubTeam,
  fetchListSalesTeam,
} from 'store/accCustomer_Profile/thunk';
import {ApiCustomerProfiles_GetById} from 'action/Api';
import { colors } from 'themes';
const DetailTab = ({detailCustomerClosedMove, itemData}) => {
  //  console.log('detailCustomerClosedMove',detailCustomerClosedMove)
  const languageKey = useSelector(translateLang);
  const dispatch = useDispatch();
  const {listCustomers} = useSelector(state => state.ApprovalProcess);
  const {listSalesTeam, listSalesSubTeam} = useSelector(
    state => state.CustomerProfile,
  );
  const {listSalesChannel} = useSelector(state => state.CustomerCloseMove);
  const [isShowDetailCus, setIsShowDetailCus] = useState(false);
  const [inforCustomerCurrent, setInforCustomerCurrent] = useState(null);
  const [inforCustomerChange, setInforCustomerChange] = useState(false);
  const [showInformation, setShowInformation] = useState({
    general: true,
    reference: true,
    current: false,
    change: false,
  });

  const toggleInformation = key => {
    setShowInformation(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const showDetailCustomer = item => {
    setIsShowDetailCus(
      detailCustomerClosedMove?.EntryID === 'MoveDepartments'
        ? !isShowDetailCus
        : false,
    );
    setInforCustomerChange(item);
  };

  const hiddenDetailCustomer = () => {
    setIsShowDetailCus(!isShowDetailCus);
  };

  const _keyExtractor = (item, index) => `${item.ID}-${index}`;
  const _renderItem = ({item}) => {
    // console.log('item', item);
    const customerName = listCustomers?.find(c => c.ID === item?.CustomerID);
    // const customerOfficial = listCustomers?.find(
    //   c => c.ID === item?.CustomerSupportID,
    // );
    // const customerOfficial = listCustomers;
    // console.log('customerOfficial', customerOfficial);
    const itemLinks = item?.Link.split(';').filter(Boolean);
    return (
      <Button onPress={() => showDetailCustomer(item)}>
        <View style={stylesDetail.cardCustomer}>
          {/* <Text
            style={stylesDetail.txtHeaderCard}
            numberOfLines={2}
            ellipsizeMode="tail">
            {customerName?.Name}
          </Text> */}
          {item ? (
            <View style={stylesDetail.contentCard1}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_customer')}
              </Text>
              <Text style={stylesDetail.contentBody}>{item?.CustomerName}</Text>
            </View>
          ) : null}
          {item?.CustomerRepresentativeName ? (
            <View style={stylesDetail.contentCard1}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_sales_staff_customer')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {item?.CustomerRepresentativeName}
              </Text>
            </View>
          ) : null}
          {/* {item?.CustomerTypeName ? (
            <View style={stylesDetail.contentCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_customer_type')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {item?.CustomerTypeName}
              </Text>
            </View>
          ) : null} */}
          {/* {item?.SupportAgentName ? (
            <View style={stylesDetail.contentCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_hotline')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {item.SupportAgentName}
              </Text>
            </View>
          ) : null} */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {item?.SalesOrganizationName ? (
              <View style={stylesDetail.contentCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_sales_organization')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {item.SalesOrganizationName}
                </Text>
              </View>
            ) : null}
            {item?.SalesRouteName ? (
              <View style={stylesDetail.contentCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_sales_route')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {item.SalesRouteName}
                </Text>
              </View>
            ) : null}
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {item?.AreaSupervisorName ? (
              <View style={stylesDetail.contentCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_regional_monitoring_route')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {item.AreaSupervisorName}
                </Text>
              </View>
            ) : null}
            {item?.SupportAgentName ? (
              <View style={stylesDetail.contentCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_support_staff')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {item.SupportAgentName}
                </Text>
              </View>
            ) : null}
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {item?.SalesStaffName ? (
              <View style={stylesDetail.contentCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_business_staff_route')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {item.SalesStaffName}
                </Text>
              </View>
            ) : null}
            {item?.SalesTeamName ? (
              <View style={stylesDetail.contentCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_main_business_team')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {item.SalesTeamName}
                </Text>
              </View>
            ) : null}
          </View>
          {/* {item?.SalesTeamName ? (
            <View style={stylesDetail.contentCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_small_team_in_charge_for_business')}
              </Text>
              <Text style={stylesDetail.contentBody}>{item.SalesTeamName}</Text>
            </View>
          ) : null} */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {item?.SalesSubTeamName ? (
              <View style={stylesDetail.contentCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_small_team_in_charge_for_business')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {item.SalesSubTeamName}
                </Text>
              </View>
            ) : null}
            {item?.RegionName ? (
              <View style={stylesDetail.contentCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_region')}
                </Text>
                <Text style={stylesDetail.contentBody}>{item.RegionName}</Text>
              </View>
            ) : null}
          </View>
          {item?.HotlineNumber ? (
            <View style={stylesDetail.contentCard}>
              <Text style={stylesDetail.txtHeaderBody}>HotLine</Text>
              <Text style={stylesDetail.contentBody}>{item.HotlineNumber}</Text>
            </View>
          ) : null}
          {item?.Note ? (
            <View style={stylesDetail.contentCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_note')}
              </Text>
              <Text style={stylesDetail.contentBody}>{item.Note}</Text>
            </View>
          ) : null}
          {itemLinks.length > 0 && (
            <View>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_image')}
              </Text>
              <RenderImage urls={itemLinks} />
            </View>
          )}
        </View>
      </Button>
    );
  };
  const renderComparisonField = (label, currentValue, changeValue) => {
    const cur = currentValue ?? '';
    const chg = changeValue ?? '';

    // Nếu cả 2 đều rỗng -> không render gì
    if (!cur && !chg) return null;

    const isDifferent = String(cur).trim() !== String(chg).trim();

    return (
      <View style={stylesDetail.containerBodyCardView}>
        <Text style={stylesDetail.txtHeaderBody}>{label}</Text>

        {isDifferent ? (
          <>
            {/* Giá trị hiện tại (bị gạch ngang) */}
            {cur ? (
              <Text
                style={[
                  stylesDetail.contentBody,
                  {textDecorationLine: 'line-through', color: colors.gray300},
                ]}
                numberOfLines={2}
                ellipsizeMode="tail">
                {cur}
              </Text>
            ) : null}

            {/* Giá trị thay đổi (mới) */}
            <Text
              style={[
                stylesDetail.contentBody,
                {color: colors.blue, fontWeight: '600', marginTop: cur ? 4 : 0},
              ]}
              numberOfLines={2}
              ellipsizeMode="tail">
              {chg}
            </Text>
          </>
        ) : (
          // Nếu giống nhau hoặc chỉ 1 giá trị -> hiển thị bình thường
          <Text
            style={stylesDetail.contentBody}
            numberOfLines={2}
            ellipsizeMode="tail">
            {cur || chg}
          </Text>
        )}
      </View>
    );
  };

  useEffect(() => {
    dispatch(fetchListSalesTeam());
  }, [dispatch]);

  useEffect(() => {
    if (inforCustomerChange) {
      const body = {
        CategoryType: 'Area',
        ParentID: inforCustomerChange?.SalesTeamID,
      };
      dispatch(fetchListSalesSubTeam(body));
      const navigateFormCustomer = async () => {
        const body = {
          ID: inforCustomerChange.CustomerID,
        };
        try {
          const {data} = await ApiCustomerProfiles_GetById(body);
          if (data.ErrorCode === '0' && data.StatusCode === 200) {
            let result = data.Result;
            // console.log('result', result);
            if (result) {
              await new Promise(resolve => {
                setInforCustomerCurrent(result);
                resolve();
              });
            } else {
              console.log('ApiCustomerProfiles_GetById', error);
            }
          }
        } catch (error) {
          console.log('error', error);
        }
      };
      navigateFormCustomer();
    }
  }, [inforCustomerChange, dispatch]);

  const customerName = listCustomers?.find(
    c => Number(c.ID) === Number(inforCustomerChange?.CustomerID),
  );
  // console.log('customerName', inforCustomerChange);
  const saleChanelName = listSalesChannel.find(
    c => c.ID === Number(inforCustomerChange?.SalesChannelID),
  );
  const mainTeamSale = listSalesTeam.find(
    c => c.ID === inforCustomerChange?.SalesTeamID,
  );
  const subTeamSale = listSalesSubTeam.find(
    c => c.ID === Number(inforCustomerChange?.SalesSubTeamID),
  );

  const itemLinksInfor = useMemo(() => {
    return detailCustomerClosedMove?.Link
      ? detailCustomerClosedMove.Link.split(';').filter(Boolean)
      : [];
  }, [detailCustomerClosedMove?.Link]);

  return (
    <View style={stylesDetail.container}>
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
        <View style={stylesDetail.cardProgram}>
          <View style={stylesDetail.bodyCard}>
            <View style={stylesDetail.containerBodyCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_function')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {itemData?.EntryName}
              </Text>
            </View>
            <View style={stylesDetail.containerContentBody}>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_ct_code')}
                </Text>
                <Text style={stylesDetail.contentBody}>{itemData?.OID}</Text>
              </View>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_ct_day')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {moment(itemData?.ODate).format('DD/MM/YYYY')}
                </Text>
              </View>
            </View>
            <View style={stylesDetail.containerBodyCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_reason_for_request')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {itemData?.ProposalReasonName}
              </Text>
            </View>
            {itemData?.Description ? (
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_content_detail')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {itemData?.Description}
                </Text>
              </View>
            ) : null}
            {itemData?.Note ? (
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_note')}
                </Text>
                <Text style={stylesDetail.contentBody}>{itemData?.Note}</Text>
              </View>
            ) : null}
            {itemLinksInfor.length > 0 && (
              <View>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_image')}
                </Text>
                <RenderImage urls={itemLinksInfor} />
              </View>
            )}
          </View>
        </View>
      )}
      <View style={stylesDetail.containerHeader}>
        <Text style={stylesDetail.header}>{languageKey('_customer_list')}</Text>
      </View>
      {detailCustomerClosedMove?.CustomerArchivedDetails?.length > 0 && (
        <View style={stylesDetail.cardProgram}>
          <FlatList
            data={detailCustomerClosedMove?.CustomerArchivedDetails}
            renderItem={_renderItem}
            style={stylesDetail.flatList}
            keyExtractor={_keyExtractor}
            contentContainerStyle={stylesDetail.containerFlat}
          />
        </View>
      )}
      <Modal
        isVisible={isShowDetailCus}
        useNativeDriver={true}
        onBackdropPress={hiddenDetailCustomer}
        onBackButtonPress={hiddenDetailCustomer}
        backdropTransitionOutTiming={450}
        avoidKeyboard={true}
        style={stylesDetail.optionsModal}>
        <View style={stylesDetail.optionsModalContainer}>
          <View style={stylesDetail.headerModal}>
            <View style={stylesDetail.containerBodyCardView1}>
              <Text style={stylesDetail.headerProgram}>
                {languageKey('_customer')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {inforCustomerChange?.CustomerName}
              </Text>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* CURRENT INFORMATION */}
            <View style={stylesDetail.containerHeader}>
              <Text style={stylesDetail.header}>
                {languageKey('_current_information')}
              </Text>
              <Button
                style={stylesDetail.btnShowInfor}
                onPress={() => toggleInformation('current')}>
                <SvgXml
                  xml={
                    showInformation.current ? arrow_down_big : arrow_next_gray
                  }
                />
              </Button>
            </View>

            {showInformation.current && (
              <View>
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_sales_staff_customer')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.CustomerRepresentativeName}
                    </Text>
                  </View>

                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_support_staff')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.SupportAgentName}
                    </Text>
                  </View>
                </View>

                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_sales_channel')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.SalesChannelName}
                    </Text>
                  </View>

                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_region')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.RegionName}
                    </Text>
                  </View>
                </View>

                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_sales_organization')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.SalesOrganizationName}
                    </Text>
                  </View>

                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_regional_monitoring_route')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.AreaSupervisorName}
                    </Text>
                  </View>
                </View>

                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_business_staff_route')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.SalesStaffName}
                    </Text>
                  </View>

                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_details_of_the_route_area')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.AreaRouteDetailName === ''
                        ? ''
                        : inforCustomerCurrent?.AreaRouteDetailName}
                    </Text>
                  </View>
                </View>

                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_main_business_team')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.SalesTeamName}
                    </Text>
                  </View>

                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_small_team_in_charge_for_business')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.SalesSubTeamName}
                    </Text>
                  </View>
                </View>

                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_hotline_number')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.HotlineNumber}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={stylesDetail.line} />

            {/* CHANGES INFORMATION */}
            <View style={stylesDetail.containerHeader}>
              <Text style={stylesDetail.header}>
                {languageKey('_information_changes')}
              </Text>
              <Button
                style={stylesDetail.btnShowInfor}
                onPress={() => toggleInformation('change')}>
                <SvgXml
                  xml={
                    showInformation.change ? arrow_down_big : arrow_next_gray
                  }
                />
              </Button>
            </View>

            {showInformation.change && (
              <View>
                <View style={stylesDetail.containerContent}>
                  {renderComparisonField(
                    languageKey('_sales_staff_customer'),
                    inforCustomerCurrent?.CustomerRepresentativeName,
                    inforCustomerChange?.CustomerRepresentativeName,
                  )}

                  {renderComparisonField(
                    languageKey('_support_staff'),
                    inforCustomerCurrent?.SupportAgentName,
                    inforCustomerChange?.SupportAgentName,
                  )}
                </View>

                <View style={stylesDetail.containerContent}>
                  {renderComparisonField(
                    languageKey('_sales_channel'),
                    inforCustomerCurrent?.SalesChannelName,
                    saleChanelName?.Name,
                  )}

                  {renderComparisonField(
                    languageKey('_region'),
                    inforCustomerCurrent?.RegionName,
                    inforCustomerChange?.RegionName,
                  )}
                </View>

                <View style={stylesDetail.containerContent}>
                  {renderComparisonField(
                    languageKey('_sales_organization'),
                    inforCustomerCurrent?.SalesOrganizationName,
                    inforCustomerChange?.SalesOrganizationName,
                  )}

                  {renderComparisonField(
                    languageKey('_regional_monitoring_route'),
                    inforCustomerCurrent?.AreaSupervisorName,
                    inforCustomerChange?.AreaSupervisorName,
                  )}
                </View>

                <View style={stylesDetail.containerContent}>
                  {renderComparisonField(
                    languageKey('_business_staff_route'),
                    inforCustomerCurrent?.SalesStaffName,
                    inforCustomerChange?.SalesStaffName,
                  )}

                  {renderComparisonField(
                    languageKey('_details_of_the_route_area'),
                    inforCustomerCurrent?.AreaRouteDetailName === ''
                      ? ''
                      : inforCustomerCurrent?.AreaRouteDetailName,
                    inforCustomerChange?.AreaRouteDetailName === ''
                      ? ''
                      : inforCustomerChange?.AreaRouteDetailName,
                  )}
                </View>

                <View style={stylesDetail.containerContent}>
                  {renderComparisonField(
                    languageKey('_main_business_team'),
                    inforCustomerCurrent?.SalesTeamName,
                    mainTeamSale?.Name,
                  )}

                  {renderComparisonField(
                    languageKey('_small_team_in_charge_for_business'),
                    inforCustomerCurrent?.SalesSubTeamName,
                    subTeamSale?.Name,
                  )}
                </View>

                <View style={stylesDetail.containerContent}>
                  {renderComparisonField(
                    languageKey('_hotline_number'),
                    inforCustomerCurrent?.HotlineNumber,
                    inforCustomerChange?.HotlineNumber,
                  )}
                </View>
              </View>
            )}

            {/* IMAGES */}
            {itemLinksInfor.length > 0 && (
              <View>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_image')}
                </Text>
                <RenderImage urls={itemLinksInfor} />
              </View>
            )}
          </ScrollView>

          <View style={stylesDetail.mrh60} />
        </View>
      </Modal>
      {/* <Modal
        isVisible={isShowDetailCus}
        useNativeDriver={true}
        onBackdropPress={hiddenDetailCustomer}
        onBackButtonPress={hiddenDetailCustomer}
        backdropTransitionOutTiming={450}
        avoidKeyboard={true}
        style={stylesDetail.optionsModal}>
        <View style={stylesDetail.optionsModalContainer}>
          <View style={stylesDetail.headerModal}>
            <View style={stylesDetail.containerBodyCardView1}>
              <Text style={stylesDetail.headerProgram}>
                {languageKey('_customer')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {inforCustomerChange?.CustomerName}
              </Text>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={stylesDetail.containerHeader}>
              <Text style={stylesDetail.header}>
                {languageKey('_current_information')}
              </Text>
              <Button
                style={stylesDetail.btnShowInfor}
                onPress={() => toggleInformation('current')}>
                <SvgXml
                  xml={
                    showInformation.current ? arrow_down_big : arrow_next_gray
                  }
                />
              </Button>
            </View>
            {showInformation.current && (
              <View>
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_sales_staff_customer')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.CustomerRepresentativeName}
                    </Text>
                  </View>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_support_staff')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.SupportAgentName}
                    </Text>
                  </View>
                </View>
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_sales_channel')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.SalesChannelName}
                    </Text>
                  </View>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_region')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.RegionName}
                    </Text>
                  </View>
                </View>
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_sales_organization')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.SalesOrganizationName}
                    </Text>
                  </View>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_regional_monitoring_route')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.AreaSupervisorName}
                    </Text>
                  </View>
                </View>
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_business_staff_route')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.SalesStaffName}
                    </Text>
                  </View>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_details_of_the_route_area')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.AreaRouteDetailName === ''
                        ? 'Tất cả'
                        : inforCustomerChange?.AreaRouteDetailName}
                    </Text>
                  </View>
                </View>
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_main_business_team')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.SalesTeamName}
                    </Text>
                  </View>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_small_team_in_charge_for_business')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.SalesSubTeamName}
                    </Text>
                  </View>
                </View>
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_hotline_number')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerCurrent?.HotlineNumber}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            <View style={stylesDetail.line} />
            <View style={stylesDetail.containerHeader}>
              <Text style={stylesDetail.header}>
                {languageKey('_information_changes')}
              </Text>
              <Button
                style={stylesDetail.btnShowInfor}
                onPress={() => toggleInformation('change')}>
                <SvgXml
                  xml={
                    showInformation.change ? arrow_down_big : arrow_next_gray
                  }
                />
              </Button>
            </View>
            {showInformation.change && (
              <View>
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_sales_staff_customer')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerChange?.CustomerRepresentativeName}
                    </Text>
                  </View>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_support_staff')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerChange?.SupportAgentName}
                    </Text>
                  </View>
                </View>
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_sales_channel')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {saleChanelName?.Name}
                    </Text>
                  </View>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_region')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerChange?.RegionName}
                    </Text>
                  </View>
                </View>
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_sales_organization')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerChange?.SalesOrganizationName}
                    </Text>
                  </View>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_regional_monitoring_route')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerChange?.AreaSupervisorName}
                    </Text>
                  </View>
                </View>
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_business_staff_route')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerChange?.SalesStaffName}
                    </Text>
                  </View>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_details_of_the_route_area')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerChange?.AreaRouteDetailName === ''
                        ? 'Tất cả'
                        : inforCustomerChange?.AreaRouteDetailName}
                    </Text>
                  </View>
                </View>
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_main_business_team')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {mainTeamSale?.Name}
                    </Text>
                  </View>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_small_team_in_charge_for_business')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {subTeamSale?.Name}
                    </Text>
                  </View>
                </View>
                <View style={stylesDetail.containerContent}>
                  <View style={stylesDetail.containerBodyCardView}>
                    <Text style={stylesDetail.txtHeaderBody}>
                      {languageKey('_hotline_number')}
                    </Text>
                    <Text style={stylesDetail.contentBody}>
                      {inforCustomerChange?.HotlineNumber}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            {itemLinksInfor.length > 0 && (
              <View>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_image')}
                </Text>
                <RenderImage urls={itemLinksInfor} />
              </View>
            )}
          </ScrollView>
          <View style={stylesDetail.mrh60} />
        </View>
      </Modal> */}
    </View>
  );
};

export default DetailTab;
