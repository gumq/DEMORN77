/* eslint-disable react-native/no-inline-styles */
// import React, {useMemo, useState} from 'react';
// import moment from 'moment';
// import {SvgXml} from 'react-native-svg';
// import {useSelector} from 'react-redux';
// import {View, Text} from 'react-native';

// import {stylesDetail, stylesFormCredit} from '../styles';
// import {translateLang} from 'store/accLanguages/slide';
// import {
//   arrow_down_big,
//   arrow_next_gray,
//   radio_active_disable,
//   radio_disable,
// } from 'svgImg';
// import {Button, RenderImage, RenderImageZoomView} from 'components';

// const DetailTab = ({detailCreditLimit, itemData}) => {
//   const languageKey = useSelector(translateLang);
//   const {listCurrencyType} = useSelector(state => state.CreditLimit);
//   const currencyName = listCurrencyType?.find(
//     c => c.ID === itemData?.CurrencyTypeID,
//   );
//   const linkImgArray = useMemo(() => {
//     return detailCreditLimit?.Link
//       ? detailCreditLimit.Link.split(';').filter(Boolean)
//       : [];
//   }, [detailCreditLimit?.Link]);

//   const linkImgArrayFeedBack = useMemo(() => {
//     return detailCreditLimit?.ConfirmLink
//       ? detailCreditLimit.ConfirmLink.split(';').filter(Boolean)
//       : [];
//   }, [detailCreditLimit?.ConfirmLink]);
//   const [showInformation, setShowInformation] = useState({
//     general: true,
//     reference: true,
//   });

//   const toggleInformation = key => {
//     setShowInformation(prev => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   const itemLinks = detailCreditLimit?.Link
//     ? detailCreditLimit.Link.split(';').map(link => ({
//         Content: link.split('/').pop(),
//         Link: link,
//       }))
//     : [];

//   return (
//     <View style={stylesDetail.containerDetail}>
//       <View style={stylesDetail.containerHeader}>
//         <View style={stylesDetail.containerRadio}>
//           <Text style={stylesDetail.header}>
//             {languageKey('_information_general')}
//           </Text>
//           <View
//             style={[
//               stylesDetail.bodyStatus,
//               {backgroundColor: itemData?.ApprovalStatusColor},
//             ]}>
//             <Text
//               style={[
//                 stylesDetail.txtStatus,
//                 {color: itemData?.ApprovalStatusTextColor},
//               ]}>
//               {itemData?.ApprovalStatusName}
//             </Text>
//           </View>
//         </View>
//         <Button
//           style={stylesDetail.btnShowInfor}
//           onPress={() => toggleInformation('general')}>
//           <SvgXml
//             xml={showInformation.general ? arrow_down_big : arrow_next_gray}
//           />
//         </Button>
//       </View>
//       {showInformation.general && (
//         <View style={stylesDetail.cardProgram}>
//           <Text style={stylesDetail.headerProgram}>
//             {languageKey('_recommended_information')}
//           </Text>
//           <View style={stylesDetail.bodyCard}>
//             {itemData?.EntryName ? (
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_function')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {itemData?.EntryName}
//                 </Text>
//               </View>
//             ) : null}
//             <View style={stylesDetail.containerContent}>
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_ct_code')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>{itemData?.OID}</Text>
//               </View>
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_ct_day')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {moment(itemData?.ODate).format('DD/MM/YYYY')}
//                 </Text>
//               </View>
//             </View>
//             <View style={stylesDetail.containerContent}>
//               {itemData?.PartnerName ? (
//                 <View style={stylesDetail.containerBodyCard}>
//                   <Text style={stylesDetail.txtHeaderBody}>
//                     {languageKey('_business_partner_group')}
//                   </Text>
//                   <Text style={stylesDetail.contentBody}>
//                     {itemData?.PartnerName}
//                   </Text>
//                 </View>
//               ) : null}
//               {itemData?.ObjectTypeName ? (
//                 <View style={stylesDetail.containerBodyCard}>
//                   <Text style={stylesDetail.txtHeaderBody}>
//                     {languageKey('_object_type')}
//                   </Text>
//                   <Text style={stylesDetail.contentBody}>
//                     {itemData?.ObjectTypeName}
//                   </Text>
//                 </View>
//               ) : null}
//             </View>
//             {itemData?.ObjectName ? (
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_object')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {itemData?.ObjectName}
//                 </Text>
//               </View>
//             ) : null}

//             <Text style={stylesDetail.headerProgram}>
//               {languageKey('_required_limit')}
//             </Text>
//             <View style={stylesDetail.containerContent}>
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_so_od_limit')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {Number(itemData?.RequestedLimitSO || 0).toLocaleString(
//                     'en-US',
//                   )}
//                 </Text>
//               </View>
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_od_export_limit_request')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {Number(itemData?.RequestedLimitOD || 0).toLocaleString(
//                     'en-US',
//                   )}
//                 </Text>
//               </View>
//             </View>
//             <View style={stylesDetail.containerContent}>
//               {currencyName?.Code ? (
//                 <View style={stylesDetail.containerBodyCard}>
//                   <Text style={stylesDetail.txtHeaderBody}>
//                     {languageKey('_currency')}
//                   </Text>
//                   <Text style={stylesDetail.contentBody}>
//                     {currencyName?.Code}
//                   </Text>
//                 </View>
//               ) : null}
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_exchange_rate')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {Number(itemData?.ExchangeRate || 0).toLocaleString('en-US')}
//                 </Text>
//               </View>
//             </View>
//             <View style={stylesDetail.containerContent}>
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_so_od_vnd')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {Number(itemData?.ConvertedCreditLimit || 0).toLocaleString(
//                     'en-US',
//                   )}
//                 </Text>
//               </View>
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_od_xk_vnd')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {Number(itemData?.ConvertedExportLimit || 0).toLocaleString(
//                     'en-US',
//                   )}
//                 </Text>
//               </View>
//             </View>
//             <View style={stylesDetail.containerContent}>
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_effective_from_date')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {moment(itemData?.EffectiveDateFrom).format('DD/MM/YYYY')}
//                 </Text>
//               </View>
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_effective_to_date')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {moment(itemData?.EffectiveDateTo).format('DD/MM/YYYY')}
//                 </Text>
//               </View>
//             </View>
//             {itemData?.PaymentTermsName ? (
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_payment_terms')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {itemData?.PaymentTermsName}
//                 </Text>
//               </View>
//             ) : null}
//             {detailCreditLimit?.Description ? (
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_explain')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {detailCreditLimit?.Description}
//                 </Text>
//               </View>
//             ) : null}
//             {detailCreditLimit?.Note ? (
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_note')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {detailCreditLimit?.Note}
//                 </Text>
//               </View>
//             ) : null}
//           </View>
//           {linkImgArray.length > 0 && (
//             <View style={stylesDetail.containerImage}>
//               <Text style={stylesDetail.txtHeaderBody}>
//                 {languageKey('_image')}
//               </Text>
//               {/* <RenderImage urls={linkImgArray} /> */}
//               <RenderImageZoomView urls={linkImgArray} />
//             </View>
//           )}
//         </View>
//       )}
//       {detailCreditLimit?.IsConfirm === 1 && (
//         <>
//           <View style={stylesDetail.containerHeader}>
//             <Text style={stylesDetail.header}>
//               {languageKey('_customer_feedback')}
//             </Text>
//             <Button
//               style={stylesDetail.btnShowInfor}
//               onPress={() => toggleInformation('customer')}>
//               <SvgXml
//                 xml={
//                   showInformation.customer ? arrow_down_big : arrow_next_gray
//                 }
//               />
//             </Button>
//           </View>
//           {showInformation.customer && (
//             <View style={stylesDetail.cardProgram}>
//               <View style={stylesDetail.containerFormFeedback}>
//                 <View style={stylesDetail.containerRadio}>
//                   <SvgXml
//                     xml={
//                       detailCreditLimit?.IsConfirm === 1
//                         ? radio_active_disable
//                         : radio_disable
//                     }
//                   />
//                   <Text style={stylesDetail.title}>
//                     {languageKey('_argee')}
//                   </Text>
//                 </View>
//                 <View style={stylesDetail.containerRadio}>
//                   <SvgXml
//                     xml={
//                       detailCreditLimit?.IsConfirm === 0
//                         ? radio_active_disable
//                         : radio_disable
//                     }
//                   />
//                   <Text style={stylesDetail.title}>
//                     {languageKey('_refuse')}
//                   </Text>
//                 </View>
//               </View>

//               {detailCreditLimit?.Note ? (
//                 <View style={stylesDetail.containerBodyCard}>
//                   <Text style={stylesDetail.txtHeaderBody}>
//                     {languageKey('_content')}
//                   </Text>
//                   <Text style={stylesDetail.contentBody}>
//                     {detailCreditLimit?.ConfirmNote}
//                   </Text>
//                 </View>
//               ) : null}
//               {linkImgArrayFeedBack.length > 0 && (
//                 <View style={stylesDetail.containerImage}>
//                   <Text style={stylesDetail.txtHeaderBody}>
//                     {languageKey('_image')}
//                   </Text>
//                   <RenderImage urls={linkImgArrayFeedBack} />
//                 </View>
//               )}
//             </View>
//           )}
//         </>
//       )}
//       <View style={stylesDetail.containerHeader}>
//         <Text style={stylesDetail.header}>
//           {languageKey('_reference_information')}
//         </Text>
//         <Button
//           style={stylesDetail.btnShowInfor}
//           onPress={() => toggleInformation('reference')}>
//           <SvgXml
//             xml={showInformation.general ? arrow_down_big : arrow_next_gray}
//           />
//         </Button>
//       </View>
//       {showInformation.reference && (
//         <View style={stylesDetail.cardFooter}>
//           <Text style={stylesDetail.headerProgram}>
//             {languageKey('_current_limit')}
//           </Text>
//           <View style={stylesDetail.containerContent}>
//             <View style={stylesDetail.containerBodyCard}>
//               <Text style={stylesDetail.txtHeaderBody}>
//                 {languageKey('_so_od_limit')}
//               </Text>
//               <Text style={stylesDetail.contentBody}>
//                 {Number(
//                   detailCreditLimit?.SAPRequestedLimitSO || 0,
//                 ).toLocaleString('en-US')}
//               </Text>
//             </View>
//             <View style={stylesDetail.containerBodyCard}>
//               <Text style={stylesDetail.txtHeaderBody}>
//                 {languageKey('_od_export_limit')}
//               </Text>
//               <Text style={stylesDetail.contentBody}>
//                 {Number(
//                   detailCreditLimit?.SAPRequestedLimitOD || 0,
//                 ).toLocaleString('en-US')}
//               </Text>
//             </View>
//           </View>
//           <View style={stylesDetail.containerContent}>
//             <View style={stylesDetail.containerBodyCard}>
//               <Text style={stylesDetail.txtHeaderBody}>
//                 {languageKey('_currency')} - {languageKey('_exchange_rate')}
//               </Text>
//               <Text style={stylesDetail.contentBody}>
//                 {detailCreditLimit?.SAPExchangeRate}
//               </Text>
//             </View>
//             <View style={stylesDetail.containerBodyCard}>
//               <Text style={stylesDetail.txtHeaderBody}>
//                 {languageKey('_expiration')}
//               </Text>
//               <Text style={stylesDetail.contentBody}>
//                 {moment(detailCreditLimit?.SAPExpirationDate).format(
//                   'DD/MM/YYYY',
//                 )}
//               </Text>
//             </View>
//           </View>
//           <View style={stylesDetail.containerContent}>
//             <View style={stylesDetail.containerBodyCard}>
//               <Text style={stylesDetail.txtHeaderBody}>
//                 {languageKey('_so_od_vnd')}
//               </Text>
//               <Text style={stylesDetail.contentBody}>
//                 {Number(
//                   detailCreditLimit?.SAPConvertedCreditLimit || 0,
//                 ).toLocaleString('en-US')}
//               </Text>
//             </View>
//             <View style={stylesDetail.containerBodyCard}>
//               <Text style={stylesDetail.txtHeaderBody}>
//                 {languageKey('_od_xk_vnd')}
//               </Text>
//               <Text style={stylesDetail.contentBody}>
//                 {Number(
//                   detailCreditLimit?.SAPConvertedExportLimit || 0,
//                 ).toLocaleString('en-US')}
//               </Text>
//             </View>
//           </View>
//           <View style={stylesDetail.containerBodyCard}>
//             <Text style={stylesDetail.txtHeaderBody}>
//               {languageKey('_so_od_remaining_limit')}
//             </Text>
//             <Text style={stylesDetail.contentBody}>
//               {Number(
//                 detailCreditLimit?.SAPConvertedRemainingLimitSO || 0,
//               ).toLocaleString('en-US')}
//             </Text>
//           </View>
//           <View style={stylesDetail.containerBodyCard}>
//             <Text style={stylesDetail.txtHeaderBody}>
//               {languageKey('_od_xk_remaining_vnd')}
//             </Text>
//             <Text style={stylesDetail.contentBody}>
//               {Number(
//                 detailCreditLimit?.SAPConvertedRemainingLimitOD || 0,
//               ).toLocaleString('en-US')}
//             </Text>
//           </View>
//           <Text style={stylesDetail.headerProgram}>
//             {languageKey('_sale_information')}
//           </Text>
//           <View style={stylesFormCredit.containerBodyCard}>
//             <Text style={stylesDetail.txtHeaderBody}>
//               {languageKey('_biggest_daily_sales')}
//             </Text>
//             <Text style={stylesDetail.contentBody}>
//               {Number(
//                 detailCreditLimit?.SAPMaxDailySales3Months || 0,
//               ).toLocaleString('en-US')}
//             </Text>
//           </View>
//           <View style={stylesDetail.containerBodyCard}>
//             <Text style={stylesDetail.txtHeaderBody}>
//               {languageKey('_average_sales_of')}
//             </Text>
//             <Text style={stylesDetail.contentBody}>
//               {Number(
//                 detailCreditLimit?.SAPAvgSales3Months || 0,
//               ).toLocaleString('en-US')}
//             </Text>
//           </View>
//           <View style={stylesDetail.containerBodyCard}>
//             <Text style={stylesDetail.txtHeaderBody}>
//               {languageKey('_average_debt_sales')}
//             </Text>
//             <Text style={stylesDetail.contentBody}>
//               {Number(
//                 detailCreditLimit?.SAPAvgReceivablesSales3Months || 0,
//               ).toLocaleString('en-US')}
//             </Text>
//           </View>

//           <Text style={stylesDetail.contentBody}>
//             {languageKey('_sale_for_three_days')}
//           </Text>
//           <View style={stylesDetail.tableWrapper}>
//             <View style={stylesDetail.row}>
//               <View style={stylesDetail.cell_table}>
//                 <Text style={stylesDetail.txtHeaderTable}>
//                   {languageKey('_order_date')}
//                 </Text>
//               </View>
//               <View style={stylesDetail.cell_table}>
//                 <Text style={stylesDetail.txtHeaderTable}>
//                   {languageKey('_order_number')}
//                 </Text>
//               </View>
//               <View style={stylesDetail.cell_table}>
//                 <Text style={stylesDetail.txtHeaderTable}>
//                   {languageKey('_total_order')}
//                 </Text>
//               </View>
//               <View style={stylesDetail.cell_table}>
//                 <Text style={stylesDetail.txtHeaderTable}>
//                   {languageKey('_revenue')}
//                 </Text>
//               </View>
//             </View>
//             {detailCreditLimit?.Order?.map((item, index) => (
//               <View
//                 style={[
//                   stylesDetail.cellResponse,
//                   index === itemLinks.length - 1 && stylesDetail.lastCell,
//                 ]}
//                 key={index}>
//                 <View style={stylesDetail.cell_table}>
//                   <Text style={stylesDetail.valueRow}>
//                     {moment(item?.OrderDate).format('DD/MM/YYYY')}
//                   </Text>
//                 </View>
//                 <View style={stylesDetail.cell_table}>
//                   {item?.OrderCode?.split(',').map((code, i) => (
//                     <Text key={i} style={stylesDetail.valueRow}>
//                       {code.trim()}
//                     </Text>
//                   ))}
//                 </View>
//                 <View style={stylesDetail.cell_table}>
//                   <Text style={stylesDetail.valueRow}>{item?.OrderNumber}</Text>
//                 </View>
//                 <View style={stylesDetail.cell_table}>
//                   <Text style={stylesDetail.valueRow}>
//                     {Number(item?.SalesRevenue || 0).toLocaleString('en-US')}
//                   </Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };

// export default DetailTab;
import React, {useMemo, useState} from 'react';
import moment from 'moment';
import {SvgXml} from 'react-native-svg';
import {useSelector} from 'react-redux';
import {View, Text, TouchableOpacity, Linking, Alert} from 'react-native';

import {stylesDetail, stylesFormCredit} from '../styles';
import {translateLang} from 'store/accLanguages/slide';
import {
  arrow_down_big,
  arrow_next_gray,
  radio_active_disable,
  radio_disable,
  downFile,
} from 'svgImg';
import {
  Button,
  ModalProfileCustomerFile,
  RenderImage,
  RenderImageZoomView,
} from 'components';
import GuaranteeList from './GuaranteeList';

const DetailTab = ({detailCreditLimit, itemData, currentDoc}) => {
  const languageKey = useSelector(translateLang);
  const {listCurrencyType, informationSAP, listObjectsType} = useSelector(
    state => state.CreditLimit,
  );
  const {listItemTypes} = useSelector(state => state.CustomerProfile);
  const currencyName = listCurrencyType?.find(
    c => c.ID === itemData?.CurrencyTypeID,
  );
  // console.log('currentDoc', currentDoc);
  // console.log('detailCreditLimit', detailCreditLimit);
  // console.log('detailCreditLimit', detailCreditLimit);
  const linkImgArray = useMemo(() => {
    return detailCreditLimit?.Link
      ? detailCreditLimit.Link.split(';').filter(Boolean)
      : [];
  }, [detailCreditLimit?.Link]);
  const [valueListCustomerProfiles, setValueListCustomerProfiles] =
    useState(currentDoc);
  const linkImgArrayFeedBack = useMemo(() => {
    return detailCreditLimit?.ConfirmLink
      ? detailCreditLimit.ConfirmLink.split(';').filter(Boolean)
      : [];
  }, [detailCreditLimit?.ConfirmLink]);

  const [showInformation, setShowInformation] = useState({
    general: true,
    reference: true,
    customer: true,
    GuaranteeNews: true,
    gthskh: true,
  });
  const {userInfo, listUserByUserID, listCustomerByUserID} = useSelector(
    state => state.Login,
  );
  const [valueObjectType, setValueObjectType] = useState(
    1
      ? listObjectsType?.find(
          object => object?.ID === detailCreditLimit?.ObjectTypeID,
        )
      : listObjectsType?.find(object => object?.Code === 'NV'),
  );
  const safeJsonParseArray = str => {
    if (!str) return [];
    if (Array.isArray(str)) return str;

    try {
      return JSON.parse(str);
    } catch (err) {
      Alert.alert(
        'Lỗi dữ liệu',
        `'Extention2' không đúng định dạng JSON.\nVui lòng kiểm tra lại.`,
      );
      return [];
    }
  };
  const [valueObject, setValueObject] = useState(() => {
    if (1) {
      return valueObjectType?.Code === 'NV'
        ? listUserByUserID?.find(
            user => user?.UserID === detailCreditLimit?.ObjectID,
          )
        : listCustomerByUserID
            ?.filter(
              item =>
                item.IsClosed === 0 &&
                item?.IsCompleted === 1 &&
                item?.IsActive === 1,
            )
            ?.find(customer => customer?.ID === detailCreditLimit?.ObjectID);
    } else {
      return valueObjectType?.Code === 'NV'
        ? listUserByUserID?.find(
            user => Number(user?.UserID) === Number(userInfo?.UserID),
          )
        : null;
    }
    // return null;
  });
  const toggleInformation = key => {
    setShowInformation(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const itemLinks = detailCreditLimit?.Link
    ? detailCreditLimit.Link.split(';').map(link => ({
        Content: link.split('/').pop(),
        Link: link,
      }))
    : [];

  // helper: kiểm tra extension có phải ảnh không
  const isImage = url => {
    if (!url) return false;
    const withoutQuery = url.split('?')[0].split('#')[0];
    const parts = withoutQuery.split('.');
    if (parts.length === 1) return false;
    const ext = parts.pop().toLowerCase();
    const imageExt = [
      'jpg',
      'jpeg',
      'png',
      'gif',
      'webp',
      'bmp',
      'tiff',
      'tif',
      'svg',
      'heic',
      'heif',
    ];
    return imageExt.includes(ext);
  };

  // render files: nếu toàn ảnh -> render như cũ (zoom hoặc normal)
  // nếu mix hoặc non-image -> render danh sách với icon + tên, click mở url
  const renderFiles = (urls = [], useZoomView = false) => {
    if (!urls || urls.length === 0) return null;

    const allAreImages = urls.every(u => isImage(u));

    if (allAreImages) {
      return useZoomView ? (
        <RenderImageZoomView urls={urls} />
      ) : (
        <RenderImage urls={urls} />
      );
    }

    return (
      <View>
        {urls.map((u, idx) => {
          const filename = u.split('/').pop() || `file-${idx + 1}`;
          const image = isImage(u);
          return (
            <View
              key={idx}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}>
              {image ? (
                <View style={{flex: 0}}>
                  <RenderImage urls={[u]} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(u).catch(err =>
                      console.warn('Cannot open url', err),
                    );
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 6,
                  }}>
                  <SvgXml xml={downFile} width={28} height={28} />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(u).catch(err =>
                    console.warn('Cannot open url', err),
                  );
                }}
                style={{marginLeft: 10, flex: 1}}>
                <Text style={stylesDetail.contentBody} numberOfLines={1}>
                  {filename}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };

  // helper để chọn key hiển thị header: '_image' nếu tất cả là ảnh, ngược lại '_file'
  const headerKeyFor = urls => {
    if (!urls || urls.length === 0) return '_image';
    const allAreImages = urls.every(u => isImage(u));
    return allAreImages ? '_image' : '_attached_files';
  };

  return (
    <View style={stylesDetail.containerDetail}>
      <View style={stylesDetail.containerHeader}>
        <View style={stylesDetail.containerRadio}>
          <Text style={stylesDetail.header}>
            {languageKey('_information_general')}
          </Text>
          <View
            style={[
              stylesDetail.bodyStatus,
              {backgroundColor: itemData?.ApprovalStatusColor},
            ]}>
            <Text
              style={[
                stylesDetail.txtStatus,
                {color: itemData?.ApprovalStatusTextColor},
              ]}>
              {itemData?.ApprovalStatusName}
            </Text>
          </View>
        </View>
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
          <Text style={stylesDetail.headerProgram}>
            {languageKey('_recommended_information')}
          </Text>
          <View style={stylesDetail.bodyCard}>
            {itemData?.EntryName ? (
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_function')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {itemData?.EntryName}
                </Text>
              </View>
            ) : null}
            <View style={stylesDetail.containerContent}>
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
            <View style={stylesDetail.containerContent}>
              {itemData?.PartnerName ? (
                <View style={stylesDetail.containerBodyCard}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_business_partner_group')}
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {itemData?.PartnerName}
                  </Text>
                </View>
              ) : null}
              {itemData?.ObjectTypeName ? (
                <View style={stylesDetail.containerBodyCard}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_object_type')}
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {itemData?.ObjectTypeName}
                  </Text>
                </View>
              ) : null}
            </View>
            {itemData?.ObjectName ? (
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_object')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {itemData?.ObjectName}
                </Text>
              </View>
            ) : null}
            {itemData?.GuarantorCustomerName ? (
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_customer_are_guaranteed')}
                </Text>
                <Text
                  style={stylesDetail.contentBody}
                  numberOfLines={3}
                  ellipsizeMode="tail">
                  {itemData?.GuarantorCustomerName}
                </Text>
              </View>
            ) : null}
            <Text style={stylesDetail.headerProgram}>
              {languageKey('_required_limit')}
            </Text>
            <View style={stylesDetail.containerContent}>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_so_od_limit')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {Number(itemData?.RequestedLimitSO || 0).toLocaleString(
                    'en-US',
                  )}
                </Text>
              </View>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_od_export_limit_request')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {Number(itemData?.RequestedLimitOD || 0).toLocaleString(
                    'en-US',
                  )}
                </Text>
              </View>
            </View>
            <View style={stylesDetail.containerContent}>
              {currencyName?.Code ? (
                <View style={stylesDetail.containerBodyCard}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_currency')}
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {currencyName?.Code}
                  </Text>
                </View>
              ) : null}
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_exchange_rate')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {Number(itemData?.ExchangeRate || 0).toLocaleString('en-US')}
                </Text>
              </View>
            </View>
            <View style={stylesDetail.containerContent}>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_so_od_vnd')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {Number(itemData?.ConvertedCreditLimit || 0).toLocaleString(
                    'en-US',
                  )}
                </Text>
              </View>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_od_xk_vnd')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {Number(itemData?.ConvertedExportLimit || 0).toLocaleString(
                    'en-US',
                  )}
                </Text>
              </View>
            </View>
            <View style={stylesDetail.containerContent}>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_effective_from_date')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {moment(itemData?.EffectiveDateFrom).format('DD/MM/YYYY')}
                </Text>
              </View>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_effective_to_date')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {moment(itemData?.EffectiveDateTo).format('DD/MM/YYYY')}
                </Text>
              </View>
            </View>
            {itemData?.PaymentTermsName ? (
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_payment_terms')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {itemData?.PaymentTermsName}
                </Text>
              </View>
            ) : null}
            {detailCreditLimit?.Description ? (
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_explain')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {detailCreditLimit?.Description}
                </Text>
              </View>
            ) : null}
            {detailCreditLimit?.Note ? (
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_note')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {detailCreditLimit?.Note}
                </Text>
              </View>
            ) : null}
          </View>

          {linkImgArray.length > 0 && (
            <View style={stylesDetail.containerImage}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey(headerKeyFor(linkImgArray))}
              </Text>
              {renderFiles(linkImgArray, true)}
            </View>
          )}
        </View>
      )}

      {detailCreditLimit?.IsConfirm === 1 && (
        <>
          <View style={stylesDetail.containerHeader}>
            <Text style={stylesDetail.header}>
              {languageKey('_customer_feedback')}
            </Text>
            <Button
              style={stylesDetail.btnShowInfor}
              onPress={() => toggleInformation('customer')}>
              <SvgXml
                xml={
                  showInformation.customer ? arrow_down_big : arrow_next_gray
                }
              />
            </Button>
          </View>
          {showInformation.customer && (
            <View style={stylesDetail.cardProgram}>
              <View style={stylesDetail.containerFormFeedback}>
                <View style={stylesDetail.containerRadio}>
                  <SvgXml
                    xml={
                      detailCreditLimit?.IsConfirm === 1
                        ? radio_active_disable
                        : radio_disable
                    }
                  />
                  <Text style={stylesDetail.title}>
                    {languageKey('_argee')}
                  </Text>
                </View>
                <View style={stylesDetail.containerRadio}>
                  <SvgXml
                    xml={
                      detailCreditLimit?.IsConfirm === 0
                        ? radio_active_disable
                        : radio_disable
                    }
                  />
                  <Text style={stylesDetail.title}>
                    {languageKey('_refuse')}
                  </Text>
                </View>
              </View>

              {detailCreditLimit?.ConfirmNote ? (
                <View style={stylesDetail.containerBodyCard}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_content')}
                  </Text>
                  <Text style={stylesDetail.contentBody}>
                    {detailCreditLimit?.ConfirmNote}
                  </Text>
                </View>
              ) : null}
              {linkImgArrayFeedBack.length > 0 && (
                <View style={stylesDetail.containerImage}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey(headerKeyFor(linkImgArrayFeedBack))}
                  </Text>
                  {renderFiles(linkImgArrayFeedBack, false)}
                </View>
              )}
            </View>
          )}
        </>
      )}

      {(detailCreditLimit?.EntryID === 'QuarterlyTransfers' ||
        detailCreditLimit?.EntryID === 'QuarterlyNews' ||
        detailCreditLimit?.EntryID === 'QuarterlyChanges' ||
        detailCreditLimit?.EntryID === 'GuaranteeTransfers') && (
        <View style={stylesDetail.containerHeader}>
          <Text style={stylesDetail.header}>
            {languageKey('_reference_information')}
          </Text>
          <Button
            style={stylesDetail.btnShowInfor}
            onPress={() => toggleInformation('reference')}>
            <SvgXml
              xml={showInformation.reference ? arrow_down_big : arrow_next_gray}
            />
          </Button>
        </View>
      )}
      {showInformation.reference &&
        (detailCreditLimit?.EntryID === 'QuarterlyTransfers' ||
          detailCreditLimit?.EntryID === 'QuarterlyNews' ||
          detailCreditLimit?.EntryID === 'QuarterlyChanges' ||
          detailCreditLimit?.EntryID === 'GuaranteeTransfers') && (
          <View style={stylesDetail.cardFooter}>
            <Text style={stylesDetail.headerProgram}>
              {languageKey('_current_limit')}
            </Text>
            <View style={stylesDetail.containerContent}>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_currency')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {valueObject?.CurrencyName || ''}
                </Text>
              </View>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_exchange_rate')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {valueObject?.ExchangeRate}
                </Text>
              </View>
            </View>
            <View style={stylesDetail.containerContent}>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>{'Hiệu lực từ'}</Text>
                <Text style={stylesDetail.contentBody}>
                  {moment(valueObject?.LimitFromDate).format('DD/MM/YYYY')}
                </Text>
              </View>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_expiration')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {moment(valueObject?.LimitEndDate).format('DD/MM/YYYY')}
                </Text>
              </View>
            </View>
            <View style={stylesDetail.containerContent}>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>Hạn mức nhận đơn</Text>
                <Text style={stylesDetail.contentBody}>
                  {Number(valueObject?.GrantedLimitOD || 0).toLocaleString(
                    'en-US',
                  )}
                </Text>
              </View>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  Hạn mức nhận đơn (VNĐ)
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {Number(valueObject?.GrantedLimitAmntOD || 0).toLocaleString(
                    'en-US',
                  )}
                </Text>
              </View>
            </View>
            <View style={stylesDetail.containerBodyCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                Hạn mức nhận đơn còn lại (VND)
              </Text>
              <Text style={stylesDetail.contentBody}>
                {Number(valueObject?.GrantedLimitNowOD || 0).toLocaleString(
                  'en-US',
                )}
              </Text>
            </View>
            <View style={stylesDetail.containerContent}>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>Hạn mức giao</Text>
                <Text style={stylesDetail.contentBody}>
                  {Number(valueObject?.GrantedLimitSO || 0).toLocaleString(
                    'en-US',
                  )}
                </Text>
              </View>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  Hạn mức giao (VNĐ)
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {Number(valueObject?.GrantedLimitAmntSO || 0).toLocaleString(
                    'en-US',
                  )}
                </Text>
              </View>
            </View>
            <View style={stylesDetail.containerBodyCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                Hạn mức giao còn lại (VNĐ)
              </Text>
              <Text style={stylesDetail.contentBody}>
                {Number(valueObject?.GrantedLimitNowSO || 0).toLocaleString(
                  'en-US',
                )}
              </Text>
            </View>
            <Text style={stylesDetail.headerProgram}>Công nợ</Text>
            <View style={stylesFormCredit.containerBodyCard}>
              <Text style={stylesDetail.txtHeaderBody}>Công nợ hiện tại</Text>
              <Text style={stylesDetail.contentBody}>
                {Number(valueObject?.TotalDebit || 0).toLocaleString('en-US')}
              </Text>
            </View>
            <View style={stylesDetail.containerBodyCard}>
              <Text style={stylesDetail.txtHeaderBody}>Công nợ trong hạn</Text>
              <Text style={stylesDetail.contentBody}>
                {Number(valueObject?.NotDueDebit || 0).toLocaleString('en-US')}
              </Text>
            </View>
            <View style={stylesDetail.containerBodyCard}>
              <Text style={stylesDetail.txtHeaderBody}>Công nợ quá hạn</Text>
              <Text style={stylesDetail.contentBody}>
                {Number(valueObject?.TotalOverDebit || 0).toLocaleString(
                  'en-US',
                )}
              </Text>
            </View>

            <Text style={stylesDetail.headerProgram}>
              {languageKey('_sale_information')}
            </Text>
            <View style={stylesFormCredit.containerBodyCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_biggest_daily_sales')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {Number(informationSAP?.TotalAmountMax || 0).toLocaleString(
                  'en-US',
                )}
              </Text>
            </View>
            <View style={stylesDetail.containerBodyCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_average_sales_of')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {Number(informationSAP?.TotalAmountAVG || 0).toLocaleString(
                  'en-US',
                )}
              </Text>
            </View>
            <View style={stylesDetail.containerBodyCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_average_debt_sales')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {Number(informationSAP?.TotalDebitAVG || 0).toLocaleString(
                  'en-US',
                )}
              </Text>
            </View>

            <Text style={stylesDetail.contentBody}>
              {languageKey('_sale_for_three_days')}
            </Text>
            <View style={stylesDetail.tableWrapper}>
              <View style={stylesDetail.row}>
                <View style={stylesDetail.cell_table}>
                  <Text style={stylesDetail.txtHeaderTable}>
                    {languageKey('_order_date')}
                  </Text>
                </View>
                <View style={stylesDetail.cell_table}>
                  <Text style={stylesDetail.txtHeaderTable}>
                    {languageKey('_order_number')}
                  </Text>
                </View>
                <View style={stylesDetail.cell_table}>
                  <Text style={stylesDetail.txtHeaderTable}>
                    {languageKey('_total_order')}
                  </Text>
                </View>
                <View style={stylesDetail.cell_table}>
                  <Text style={stylesDetail.txtHeaderTable}>
                    {languageKey('_revenue')}
                  </Text>
                </View>
              </View>
              {informationSAP?.Orders?.map((item, index) => (
                <View
                  style={[
                    stylesDetail.cellResponse,
                    index === itemLinks.length - 1 && stylesDetail.lastCell,
                  ]}
                  key={index}>
                  <View style={stylesDetail.cell_table}>
                    <Text style={stylesDetail.valueRow}>
                      {moment(item?.ODate).format('DD/MM/YYYY')}
                    </Text>
                  </View>
                  <View style={stylesDetail.cell_table}>
                    {item?.OID?.split(',').map((code, i) => (
                      <Text key={i} style={stylesDetail.valueRow}>
                        {code.trim()}
                      </Text>
                    ))}
                  </View>
                  <View style={stylesDetail.cell_table}>
                    <Text style={stylesDetail.valueRow}>{item?.Quantity}</Text>
                  </View>
                  <View style={stylesDetail.cell_table}>
                    <Text style={stylesDetail.valueRow}>
                      {Number(item?.TotalAmount || 0).toLocaleString('en-US')}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <Text style={stylesDetail.headerProgram}>
              {languageKey('_customer_profile_doc')}
            </Text>
            <View style={stylesDetail.tableWrapper}>
              <View style={stylesDetail.row}>
                <View style={[stylesDetail.cell_table1]}>
                  <Text style={stylesDetail.txtHeaderTable}>Loại giấy tờ</Text>
                </View>
                <View style={stylesDetail.cell_table}>
                  <Text style={stylesDetail.txtHeaderTable}>File hồ sơ</Text>
                </View>
              </View>
              <View style={stylesDetail.cardFooter1}>
                <ModalProfileCustomerFile
                  setData={setValueListCustomerProfiles}
                  dataEdit={currentDoc || []}
                  parentID={detailCreditLimit?.ID}
                  dataex={listItemTypes}
                  disable={true}
                  fhm={true}
                />
              </View>
            </View>
          </View>
        )}
      {(detailCreditLimit?.EntryID === 'GuaranteeNews' ||
        detailCreditLimit?.EntryID === 'GuaranteeChanges' ||
        detailCreditLimit?.EntryID === 'QuarterlyTransfers') && (
        <View style={stylesDetail.containerHeader}>
          <Text style={stylesDetail.header}>
            {languageKey('customer_guarantee_staff')}
          </Text>
          <Button
            style={stylesDetail.btnShowInfor}
            onPress={() => toggleInformation('GuaranteeNews')}>
            <SvgXml
              xml={
                showInformation.GuaranteeNews ? arrow_down_big : arrow_next_gray
              }
            />
          </Button>
        </View>
      )}
      {showInformation.GuaranteeNews &&
        (detailCreditLimit?.EntryID === 'GuaranteeNews' ||
          detailCreditLimit?.EntryID === 'GuaranteeChanges' ||
          detailCreditLimit?.EntryID === 'QuarterlyTransfers') && (
          <View style={{width: '100%', backgroundColor: '#fff'}}>
            <GuaranteeList
              data={safeJsonParseArray(
                detailCreditLimit?.Extention2,
                'Danh sách bảo lãnh',
              )}
              onPressItem={item => {
                // ví dụ: chuyển màn hình chi tiết
                console.log('clicked', item);
              }}
            />
          </View>
        )}
      {/* {(detailCreditLimit?.EntryID === 'QuarterlyTransfers' ||
        detailCreditLimit?.EntryID === 'QuarterlyNews' ||
        detailCreditLimit?.EntryID === 'QuarterlyChanges' ||
        detailCreditLimit?.EntryID === 'GuaranteeTransfers') && (
        <View style={stylesDetail.containerHeader}>
          <Text style={stylesDetail.header}>
            {languageKey('_customer_profile_doc')}
          </Text>
          <Button
            style={stylesDetail.btnShowInfor}
            onPress={() => toggleInformation('gthskh')}>
            <SvgXml
              xml={showInformation.gthskh ? arrow_down_big : arrow_next_gray}
            />
          </Button>
        </View>
      )} */}
      {/* {
        (detailCreditLimit?.EntryID === 'QuarterlyTransfers' ||
          detailCreditLimit?.EntryID === 'QuarterlyNews' ||
          detailCreditLimit?.EntryID === 'QuarterlyChanges' ||
          detailCreditLimit?.EntryID === 'GuaranteeTransfers') && (
          <View style={stylesDetail.cardFooter1}>
            <ModalProfileCustomerFile
              setData={setValueListCustomerProfiles}
              dataEdit={currentDoc || []}
              parentID={detailCreditLimit?.ID}
              dataex={listItemTypes}
              disable={true}
            />
          </View>
        )} */}
    </View>
  );
};

export default DetailTab;
