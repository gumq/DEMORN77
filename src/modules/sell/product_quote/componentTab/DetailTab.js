// import React, {useEffect, useMemo, useState} from 'react';
// import moment from 'moment';
// import Modal from 'react-native-modal';
// import {SvgXml} from 'react-native-svg';
// import {useDispatch, useSelector} from 'react-redux';
// import {View, Text, FlatList, ScrollView} from 'react-native';

// import {stylesDetail} from '../styles';
// import {translateLang} from 'store/accLanguages/slide';
// import {arrow_down_big, arrow_next_gray} from 'svgImg';
// import {Button, RenderImage} from 'components';
// import {
//   fetchListSalesSubTeam,
//   fetchListSalesTeam,
// } from 'store/accCustomer_Profile/thunk';
// import {colors} from 'themes';

// const DetailTab = ({detailProductQuote, itemData}) => {
//   const languageKey = useSelector(translateLang);
//   const dispatch = useDispatch();
//   const {
//     listSaleChannel,
//     listCurrencyUnit,
//     listPaymentTimes,
//     listEntry,
//     listGoodTypes,
//     listPriceGroup,
//     listItems,
//   } = useSelector(state => state.ProductQuote);
//   const {listCustomerByUserID} = useSelector(state => state.Login);
//   const [showModalPrice, setShowModalPrice] = useState(false);
//   const [itemDetail, setItemDetail] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [showInformation, setShowInformation] = useState({
//     general: true,
//     reference: true,
//     current: false,
//     change: false,
//   });

//   const toggleInformation = key => {
//     setShowInformation(prev => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   const handleShowModalPrice = item => {
//     setItemDetail(item);
//     setShowModalPrice(true);
//   };

//   const handleHiddenModalPrice = () => {
//     setShowModalPrice(false);
//   };

//   const customerIDs = detailProductQuote?.Customers?.split(',').map(id =>
//     Number(id),
//   );
//   const goodTypeIDs = detailProductQuote?.GoodsTypes?.split(',').map(id =>
//     Number(id),
//   );

//   const customerNames = listCustomerByUserID
//     .filter(c => customerIDs?.includes(c.ID))
//     .map(c => c.Name)
//     .join(', ');

//   const goodTypeNames = listGoodTypes
//     .filter(g => goodTypeIDs?.includes(g.ID))
//     .map(g => g.Name)
//     .join(', ');

//   const saleChanelName = listSaleChannel.find(
//     c => c.ID === Number(detailProductQuote?.SalesChannelID),
//   );
//   const priceGroup = listPriceGroup.find(
//     c => c.ID === Number(detailProductQuote?.PriceGroupID),
//   );
//   const paymentTerm = listPaymentTimes.find(
//     c => c.ID === Number(detailProductQuote?.PaymentTermID),
//   );
//   const currency = listCurrencyUnit.find(
//     c => c.ID === Number(detailProductQuote?.CurrencyTypeID),
//   );

//   const dataTable = itemDetail ? JSON.parse(itemDetail?.Details) : [];
//   const _keyExtractorGood = (item, index) => `${item.Name}-${index}`;
//   const _renderItemGood = ({item}) => {
//     return (
//       <View>
//         <View style={stylesDetail.cardProgramDetail}>
//           <View style={stylesDetail.itemBody_two}>
//             <View style={stylesDetail.containerItem}>
//               <View style={stylesDetail.containerHeader}>
//                 <Text style={stylesDetail.txtTitleItem}>{item?.ItemName}</Text>
//               </View>
//               <Text style={stylesDetail.txtProposal}>
//                 {item?.GoodsTypeName}
//               </Text>
//             </View>
//           </View>
//           <View style={stylesDetail.bodyCard}>
//             <View style={stylesDetail.content}>
//               {item?.VAT ? (
//                 <View style={stylesDetail.containerBodyText}>
//                   <Text style={stylesDetail.txtHeaderBody}>
//                     {languageKey('_tax_rate')}
//                   </Text>
//                   <Text style={stylesDetail.contentBodyPrice}>{item?.VAT}</Text>
//                 </View>
//               ) : null}
//               {item?.UnitSaleName ? (
//                 <View style={stylesDetail.containerBodyText}>
//                   <Text style={stylesDetail.txtHeaderBody}>
//                     {languageKey('_unit')}
//                   </Text>
//                   <Text style={stylesDetail.contentBodyPrice}>
//                     {item?.UnitSaleName}
//                   </Text>
//                 </View>
//               ) : null}
//             </View>
//             <View style={stylesDetail.content}>
//               <View style={stylesDetail.containerBodyText}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_quantity_from')}
//                 </Text>
//                 <Text style={stylesDetail.contentBodyPrice}>{item?.From}</Text>
//               </View>
//               <View style={stylesDetail.containerBodyText}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_quantity_to')}
//                 </Text>
//                 <Text style={stylesDetail.contentBodyPrice}>{item?.To}</Text>
//               </View>
//             </View>
//             {item?.Price ? (
//               <View style={stylesDetail.containerBodyText}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_unit_price')}
//                 </Text>
//                 <Text style={stylesDetail.contentBodyPrice}>{item?.Price}</Text>
//               </View>
//             ) : null}

//             <Button
//               style={stylesDetail.btnDetail}
//               onPress={() => handleShowModalPrice(item)}>
//               <Text style={stylesDetail.txtBtnDetail}>
//                 {languageKey('_price_details')}
//               </Text>
//             </Button>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={stylesDetail.container}>
//       <View style={stylesDetail.containerHeader}>
//         <Text style={stylesDetail.header}>
//           {languageKey('_information_general')}
//         </Text>
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
//           <View style={stylesDetail.bodyCard}>
//             <View style={stylesDetail.containerBodyCard}>
//               <Text style={stylesDetail.txtHeaderBody}>
//                 {languageKey('_function')}
//               </Text>
//               <Text style={stylesDetail.contentBody}>
//                 {itemData?.EntryName}
//               </Text>
//             </View>
//             <View style={stylesDetail.containerContentBody}>
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_ct_code')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {detailProductQuote?.OID}
//                 </Text>
//               </View>
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_ct_day')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {moment(detailProductQuote?.ODate).format('DD/MM/YYYY')}
//                 </Text>
//               </View>
//             </View>
//             <View style={stylesDetail.containerBodyCard}>
//               <Text style={stylesDetail.txtHeaderBody}>
//                 {languageKey('_price_name_vi')}
//               </Text>
//               <Text style={stylesDetail.contentBody}>
//                 {detailProductQuote?.QuotationName}
//               </Text>
//             </View>
//             {detailProductQuote?.QuotationNameExtention1 ? (
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_price_name_en')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {detailProductQuote?.QuotationNameExtention1}
//                 </Text>
//               </View>
//             ) : null}
//             <View style={stylesDetail.containerContentBody}>
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_fromdate')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {moment(detailProductQuote?.FromDate).format('DD/MM/YYYY')}
//                 </Text>
//               </View>
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_toDate')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {moment(detailProductQuote?.ToDate).format('DD/MM/YYYY')}
//                 </Text>
//               </View>
//             </View>
//             {saleChanelName?.Name ? (
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_sales_channel')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {saleChanelName?.Name}
//                 </Text>
//               </View>
//             ) : null}
//             {detailProductQuote?.CustPricingProcedure ? (
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_customer_pricing_process')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {detailProductQuote?.CustPricingProcedure}
//                 </Text>
//               </View>
//             ) : null}
//             {customerNames ? (
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_customer_name')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>{customerNames}</Text>
//               </View>
//             ) : null}
//             {goodTypeNames ? (
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_product_industry')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>{goodTypeNames}</Text>
//               </View>
//             ) : null}
//             <View style={stylesDetail.containerContentBody}>
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_reference_price')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {detailProductQuote?.IsGeneralPrice === 1
//                     ? languageKey('_general_price')
//                     : languageKey('_separate_price')}
//                 </Text>
//               </View>
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_apply_promotion_short')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {detailProductQuote?.ApplyPromotion === 1
//                     ? languageKey('_yes')
//                     : languageKey('_no')}
//                 </Text>
//               </View>
//             </View>
//             {priceGroup ? (
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_price_group')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>{priceGroup?.Name}</Text>
//               </View>
//             ) : null}
//             {paymentTerm ? (
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_payment_terms')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {paymentTerm?.Name}
//                 </Text>
//               </View>
//             ) : null}
//             <View style={stylesDetail.containerContentBody}>
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_currency_unit')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>{currency?.Code}</Text>
//               </View>
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_exchange_rate_by_day_two')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {detailProductQuote?.CurrencyRate}
//                 </Text>
//               </View>
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_exchange_rate_date')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {moment(detailProductQuote?.CurrencyDate).format(
//                     'DD/MM/YYYY',
//                   )}
//                 </Text>
//               </View>
//             </View>
//             {detailProductQuote?.DeliveryTerms ? (
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_information_delivery')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {detailProductQuote?.DeliveryTerms}
//                 </Text>
//               </View>
//             ) : null}
//             {detailProductQuote?.Info ? (
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_other_information')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {detailProductQuote?.Info}
//                 </Text>
//               </View>
//             ) : null}
//             {detailProductQuote?.Note ? (
//               <View style={stylesDetail.containerBodyCard}>
//                 <Text style={stylesDetail.txtHeaderBody}>
//                   {languageKey('_note')}
//                 </Text>
//                 <Text style={stylesDetail.contentBody}>
//                   {detailProductQuote?.Note}
//                 </Text>
//               </View>
//             ) : null}
//           </View>
//         </View>
//       )}
//       <View style={stylesDetail.containerHeader}>
//         <Text style={stylesDetail.header}>{languageKey('_product_list')}</Text>
//       </View>
//       {detailProductQuote?.Details ? (
//         <View style={stylesDetail.cardProgram}>
//           <FlatList
//             data={detailProductQuote?.Details}
//             renderItem={_renderItemGood}
//             style={stylesDetail.flatList}
//             keyExtractor={_keyExtractorGood}
//           />
//         </View>
//       ) : null}

//       {showModalPrice && (
//         <Modal
//           isVisible={showModalPrice}
//           useNativeDriver={true}
//           onBackdropPress={handleHiddenModalPrice}
//           onBackButtonPress={handleHiddenModalPrice}
//           backdropTransitionOutTiming={450}
//           avoidKeyboard={true}
//           style={stylesDetail.modal}>
//           <View style={stylesDetail.optionsModalDetail}>
//             <View style={stylesDetail.headerModal}>
//               <Text style={stylesDetail.titleModal}>
//                 {languageKey('_price_details')}
//               </Text>
//             </View>
//             <ScrollView
//               style={stylesDetail.modalContainerDetail}
//               showsVerticalScrollIndicator={false}>
//               <Text style={stylesDetail.header}>
//                 {languageKey('_information_general')}
//               </Text>
//               {itemDetail?.ItemName ? (
//                 <View style={stylesDetail.contentDetail}>
//                   <Text style={stylesDetail.txtHeaderBody}>
//                     {languageKey('_product_name')}
//                   </Text>
//                   <Text style={stylesDetail.valueDetail}>
//                     {itemDetail?.ItemName}
//                   </Text>
//                 </View>
//               ) : null}
//               <View style={stylesDetail.contentInfoModal}>
//                 {itemDetail?.UnitSaleName ? (
//                   <View style={stylesDetail.containerBodyDetail}>
//                     <Text style={stylesDetail.txtHeaderBody}>
//                       {languageKey('_unit')}
//                     </Text>
//                     <Text style={stylesDetail.valueDetail}>
//                       {itemDetail?.UnitSaleName}
//                     </Text>
//                   </View>
//                 ) : null}
//                 {itemDetail?.VAT ? (
//                   <View style={stylesDetail.containerBodyDetail}>
//                     <Text style={stylesDetail.txtHeaderBody}>
//                       {languageKey('_tax_rate')}
//                     </Text>
//                     <Text style={stylesDetail.valueDetail}>
//                       {itemDetail?.VAT}
//                     </Text>
//                   </View>
//                 ) : null}
//                 {itemDetail?.Price ? (
//                   <View style={stylesDetail.containerBodyDetail}>
//                     <Text style={stylesDetail.txtHeaderBody}>
//                       {languageKey('_unit_price')}
//                     </Text>
//                     <Text style={stylesDetail.valueDetail}>
//                       {itemDetail?.Price}
//                     </Text>
//                   </View>
//                 ) : null}
//               </View>
//               <View style={stylesDetail.containerUpdatePrice}>
//                 <Text style={stylesDetail.txtHeaderUpdate}>
//                   {languageKey('_pricing_details')}
//                 </Text>
//               </View>
//               <View style={stylesDetail.containerTableFile}>
//                 <View style={stylesDetail.tableWrapper}>
//                   <View style={stylesDetail.row}>
//                     <View style={stylesDetail.cell_20}>
//                       <Text style={stylesDetail.txtHeaderTable}>Code</Text>
//                     </View>
//                     <View style={stylesDetail.cell_40}>
//                       <Text style={stylesDetail.txtHeaderTable}>
//                         {languageKey('_evaluation_criteria')}
//                       </Text>
//                     </View>
//                     <View style={stylesDetail.cell_25}>
//                       <Text style={stylesDetail.txtHeaderTable}>
//                         {languageKey('_amount')}
//                       </Text>
//                     </View>
//                     <View style={stylesDetail.cell_15}>
//                       <Text style={stylesDetail.txtHeaderTable}>
//                         {languageKey('_condition')}
//                       </Text>
//                     </View>
//                   </View>
//                   {dataTable.map((item, index) => (
//                     <View
//                       style={[
//                         stylesDetail.cellResponse,
//                         index === dataTable.length - 1 && stylesDetail.lastCell,
//                       ]}
//                       key={index}>
//                       <View style={stylesDetail.cell_20}>
//                         <Text style={stylesDetail.contentTime}>
//                           {item.SAPID}
//                         </Text>
//                       </View>
//                       <View style={stylesDetail.cell_40}>
//                         <Text
//                           style={[
//                             stylesDetail.contentTime,
//                             {
//                               color:
//                                 item?.SAPID !== '' ? colors.black : colors.blue,
//                             },
//                           ]}
//                           numberOfLines={2}
//                           ellipsizeMode="tail">
//                           {item.Name}
//                         </Text>
//                       </View>
//                       <View style={stylesDetail.cell_25}>
//                         <Text
//                           style={[
//                             stylesDetail.contentTime,
//                             {
//                               color:
//                                 item?.SAPID !== '' ? colors.black : colors.blue,
//                             },
//                           ]}>
//                           {item.Amount}
//                         </Text>
//                       </View>
//                       <View style={stylesDetail.cell_15}>
//                         <Text
//                           style={[
//                             stylesDetail.contentTime,
//                             {
//                               color:
//                                 item?.SAPID !== '' ? colors.black : colors.blue,
//                             },
//                           ]}>
//                           {item.Condition}
//                         </Text>
//                       </View>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//             </ScrollView>
//             <View style={stylesDetail.footer}>
//               <Button
//                 style={stylesDetail.btnFooterCancel}
//                 onPress={handleHiddenModalPrice}>
//                 <Text style={stylesDetail.txtBtnFooterCancel}>
//                   {languageKey('_cancel')}
//                 </Text>
//               </Button>
//               <Button
//                 style={stylesDetail.btnFooterApproval}
//                 onPress={handleHiddenModalPrice}>
//                 <Text style={stylesDetail.txtBtnFooterApproval}>
//                   {languageKey('_confirm')}
//                 </Text>
//               </Button>
//             </View>
//           </View>
//         </Modal>
//       )}
//     </View>
//   );
// };

// export default DetailTab;
/* DetailTab.js */
import React, {useEffect, useMemo, useState} from 'react';
import moment from 'moment';
import Modal from 'react-native-modal';
import {SvgXml} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text, FlatList, ScrollView, TouchableOpacity} from 'react-native';

import {stylesDetail} from '../styles';
import {translateLang} from 'store/accLanguages/slide';
import {arrow_down_big, arrow_next_gray} from 'svgImg';
import {Button, RenderImage} from 'components';
import {
  fetchListSalesSubTeam,
  fetchListSalesTeam,
} from 'store/accCustomer_Profile/thunk';
import {colors} from 'themes';
import {scale} from 'utils/resolutions';

const DetailTab = ({detailProductQuote, itemData}) => {
  const languageKey = useSelector(translateLang);
  const dispatch = useDispatch();
  const {
    listSaleChannel,
    listCurrencyUnit,
    listPaymentTimes,
    listEntry,
    listGoodTypes,
    listPriceGroup,
    listItems,
  } = useSelector(state => state.ProductQuote || {});
  const {listCustomerByUserID} = useSelector(state => state.Login || {});
  const [showModalPrice, setShowModalPrice] = useState(false);
  const [itemDetail, setItemDetail] = useState(null);

  const [showInformation, setShowInformation] = useState({
    general: true,
    reference: true,
    current: false,
    change: false,
    totals: true, // thêm tab totals
  });

  const toggleInformation = key => {
    setShowInformation(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleShowModalPrice = item => {
    setItemDetail(item);
    setShowModalPrice(true);
  };

  const handleHiddenModalPrice = () => {
    setShowModalPrice(false);
  };

  // dữ liệu liên quan
  const customerIDs = (detailProductQuote?.Customers || '')
    .split(',')
    .filter(Boolean)
    .map(id => Number(id));
  const goodTypeIDs = (detailProductQuote?.GoodsTypes || '')
    .split(',')
    .filter(Boolean)
    .map(id => Number(id));

  const customerNames = (listCustomerByUserID || [])
    .filter(c => customerIDs?.includes(c.ID))
    .map(c => c.Name)
    .join(', ');

  const goodTypeNames = (listGoodTypes || [])
    .filter(g => goodTypeIDs?.includes(g.ID))
    .map(g => g.Name)
    .join(', ');

  const saleChanelName = (listSaleChannel || []).find(
    c => c.ID === Number(detailProductQuote?.SalesChannelID),
  );
  const priceGroup = (listPriceGroup || []).find(
    c => c.ID === Number(detailProductQuote?.PriceGroupID),
  );
  const paymentTerm = (listPaymentTimes || []).find(
    c => c.ID === Number(detailProductQuote?.PaymentTermID),
  );
  const currency = (listCurrencyUnit || []).find(
    c => c.ID === Number(detailProductQuote?.CurrencyTypeID),
  );

  // Tổng tiền từ root object (nếu API trả sẵn)
  const totalItemAmount = Number(detailProductQuote?.ItemAmount ?? 0); // tiền hàng (chưa VAT) hoặc theo API
  const totalVatAmount = Number(detailProductQuote?.VATAmount ?? 0);
  const totalAmount = Number(detailProductQuote?.TotalAmount ?? 0);
  const vatPercentRaw = detailProductQuote?.VATValue
    ? String(detailProductQuote.VATValue).replace('%', '')
    : null;
  const vatPercent = vatPercentRaw ? Number(vatPercentRaw) : null;

  const fmtMoney = v => {
    if (v === null || typeof v === 'undefined' || Number.isNaN(Number(v)))
      return '—';
    // giữ nhiều chữ số thập phân như dữ liệu gốc
    const n = Number(v);
    // hiển thị với phân cách hàng nghìn, giữ tối đa 6 chữ số thập phân nếu cần
    return (
      n.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6,
      }) + ' VND'
    );
  };

  const _keyExtractorGood = (item, index) =>
    `${item.ID || item.ItemID || index}-${index}`;

  // Hàm hỗ trợ tính toán cho từng dòng item
  const computeLine = item => {
    const qty = Number(item?.Quantity || 0);

    // VAT tỷ lệ
    const vat = Number(item?.VAT ?? vatPercent ?? 0);

    // nếu server cung cấp PriceNotVAT sử dụng, ngược lại ước lượng từ Price
    // Giả định: item.Price = đơn giá có VAT (nếu server lưu như vậy). Nếu server khác, vẫn fallback hợp lý.
    let unitExcl = null;
    if (
      typeof item?.PriceNotVAT !== 'undefined' &&
      item?.PriceNotVAT !== null &&
      item.PriceNotVAT !== ''
    ) {
      unitExcl = Number(item.PriceNotVAT);
    } else if (
      typeof item?.Price !== 'undefined' &&
      item.Price !== null &&
      item.Price !== ''
    ) {
      // giả định item.Price là đơn giá gồm VAT -> chia cho (1 + vat/100)
      const p = Number(item.Price);
      unitExcl = vat ? p / (1 + vat / 100) : p;
    } else {
      unitExcl = 0;
    }

    // đơn giá có VAT
    let unitIncl = null;
    if (
      typeof item?.Price !== 'undefined' &&
      item.Price !== null &&
      item.Price !== ''
    ) {
      unitIncl = Number(item.Price);
    } else {
      unitIncl = unitExcl * (1 + vat / 100);
    }

    const lineExcl = unitExcl * qty; // thành tiền chưa VAT
    const tax = (unitIncl - unitExcl) * qty; // tiền thuế cho dòng
    const lineTotal = unitIncl * qty; // tổng gồm VAT

    return {
      qty,
      vat,
      unitExcl,
      unitIncl,
      lineExcl,
      tax,
      lineTotal,
    };
  };
  const dataTable = itemDetail ? JSON.parse(itemDetail?.Details) : [];
  const _renderItemGood = ({item}) => {
    const c = computeLine(item);
    return (
      <View>
        <View style={stylesDetail.cardProgramDetail}>
          <View style={stylesDetail.itemBody_two}>
            <View style={stylesDetail.containerItem}>
              <View style={stylesDetail.containerHeader}>
                <Text style={stylesDetail.txtTitleItem}>{item?.ItemName}</Text>
              </View>
              <Text style={stylesDetail.txtProposal}>
                {item?.GoodsTypeName}
              </Text>
            </View>
          </View>

          <View style={stylesDetail.bodyCard}>
            <View style={stylesDetail.content}>
              {/* VAT và Đơn vị */}
              {item?.VAT !== undefined && (
                <View style={stylesDetail.containerBodyText}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_tax_rate') || 'VAT'}
                  </Text>
                  <Text style={stylesDetail.contentBodyPrice}>
                    {String(c.vat) + '%'}
                  </Text>
                </View>
              )}
              {item?.UnitSaleName ? (
                <View style={stylesDetail.containerBodyText}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_unit') || 'Đơn vị'}
                  </Text>
                  <Text style={stylesDetail.contentBodyPrice}>
                    {item?.UnitSaleName}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={stylesDetail.content}>
              <View style={stylesDetail.containerBodyText}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_quantity') || 'Số lượng'}
                </Text>
                <Text style={stylesDetail.contentBodyPrice}>{c.qty}</Text>
              </View>
              {/* <View style={stylesDetail.containerBodyText}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_unit_price_excl_vat') || 'Đơn giá (-VAT)'}
                </Text>
                <Text style={stylesDetail.contentBodyPrice}>
                  {fmtMoney(c.unitExcl)}
                </Text>
              </View> */}
            </View>
            <View style={stylesDetail.content}>
              {/* <View style={stylesDetail.containerBodyText}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_quantity') || 'Số lượng'}
                </Text>
                <Text style={stylesDetail.contentBodyPrice}>{c.qty}</Text>
              </View> */}
              <View style={stylesDetail.containerBodyText}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_unit_price_excl_vat') || 'Đơn giá (-VAT)'}
                </Text>
                <Text style={stylesDetail.contentBodyPrice}>
                  {fmtMoney(c.unitExcl)}
                </Text>
              </View>
            </View>
            <View style={stylesDetail.content}>
              <View style={stylesDetail.containerBodyText}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_unit_price_incl_vat') || 'Đơn giá (+VAT)'}
                </Text>
                <Text style={stylesDetail.contentBodyPrice}>
                  {fmtMoney(c.unitIncl)}
                </Text>
              </View>
              {/* <View style={stylesDetail.containerBodyText}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_line_total_excl_vat') || 'Thành tiền (-VAT)'}
                </Text>
                <Text style={stylesDetail.contentBodyPrice}>
                  {fmtMoney(c.lineExcl)}
                </Text>
              </View> */}
            </View>

            <View style={stylesDetail.content}>
              <View style={stylesDetail.containerBodyText}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_line_total_excl_vat') || 'Thành tiền (-VAT)'}
                </Text>
                <Text style={stylesDetail.contentBodyPrice}>
                  {fmtMoney(c.lineExcl)}
                </Text>
              </View>
            </View>
            <View style={stylesDetail.content}>
              <View style={stylesDetail.containerBodyText}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_tax_amount') || 'Tiền thuế'}
                </Text>
                <Text
                  style={[
                    stylesDetail.contentBodyPrice,
                    {color: colors.red || '#b00020'},
                  ]}>
                  {fmtMoney(c.tax)}
                </Text>
              </View>
              {/* <View style={stylesDetail.containerBodyText}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_line_total') || 'Tổng (có VAT)'}
                </Text>
                <Text
                  style={[stylesDetail.contentBodyPrice, {fontWeight: '600'}]}>
                  {fmtMoney(c.lineTotal)}
                </Text>
              </View> */}
            </View>

            {item?.Price ? (
              <View style={{marginTop: 0}}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_total_amount') || 'Đơn giá (nguồn)'}
                </Text>
                <Text
                  style={[stylesDetail.contentBodyPrice, {fontWeight: '600'}]}>
                  {(item.Price * item?.Quantity)?.toLocaleString('en')}
                </Text>
              </View>
            ) : null}

            <Button
              style={stylesDetail.btnDetail}
              onPress={() => handleShowModalPrice(item)}>
              <Text style={stylesDetail.txtBtnDetail}>
                {languageKey('_price_details') || 'Chi tiết giá'}
              </Text>
            </Button>
          </View>
        </View>
      </View>
    );
  };

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
                <Text style={stylesDetail.contentBody}>
                  {detailProductQuote?.OID}
                </Text>
              </View>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_ct_day')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {moment(detailProductQuote?.ODate).format('DD/MM/YYYY')}
                </Text>
              </View>
            </View>
            <View style={stylesDetail.containerBodyCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_price_name_vi')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {detailProductQuote?.QuotationName}
              </Text>
            </View>
            {detailProductQuote?.QuotationNameExtention1 ? (
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_price_name_en')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {detailProductQuote?.QuotationNameExtention1}
                </Text>
              </View>
            ) : null}
            <View style={stylesDetail.containerContentBody}>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_fromdate')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {moment(detailProductQuote?.FromDate).format('DD/MM/YYYY')}
                </Text>
              </View>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_toDate')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {moment(detailProductQuote?.ToDate).format('DD/MM/YYYY')}
                </Text>
              </View>
            </View>
            {saleChanelName?.Name ? (
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_sales_channel')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {saleChanelName?.Name}
                </Text>
              </View>
            ) : null}
            {detailProductQuote?.CustPricingProcedure ? (
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_customer_pricing_process')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {detailProductQuote?.CustPricingProcedure}
                </Text>
              </View>
            ) : null}
            {customerNames ? (
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_customer_name')}
                </Text>
                <Text style={stylesDetail.contentBody}>{customerNames}</Text>
              </View>
            ) : null}
            {goodTypeNames ? (
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_product_industry')}
                </Text>
                <Text style={stylesDetail.contentBody}>{goodTypeNames}</Text>
              </View>
            ) : null}
            <View style={stylesDetail.containerContentBody}>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_reference_price')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {detailProductQuote?.IsGeneralPrice === 1
                    ? languageKey('_general_price')
                    : languageKey('_separate_price')}
                </Text>
              </View>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_apply_promotion_short')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {detailProductQuote?.ApplyPromotion === 1
                    ? languageKey('_yes')
                    : languageKey('_no')}
                </Text>
              </View>
            </View>
            {priceGroup ? (
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_price_group')}
                </Text>
                <Text style={stylesDetail.contentBody}>{priceGroup?.Name}</Text>
              </View>
            ) : null}
            {paymentTerm ? (
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_payment_terms')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {paymentTerm?.Name}
                </Text>
              </View>
            ) : null}
            <View style={stylesDetail.containerContentBody}>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_currency_unit')}
                </Text>
                <Text style={stylesDetail.contentBody}>{currency?.Code}</Text>
              </View>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_exchange_rate_by_day_two')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {detailProductQuote?.CurrencyRate}
                </Text>
              </View>
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_exchange_rate_date')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {moment(detailProductQuote?.CurrencyDate).format(
                    'DD/MM/YYYY',
                  )}
                </Text>
              </View>
            </View>
            {detailProductQuote?.DeliveryTerms ? (
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_information_delivery')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {detailProductQuote?.DeliveryTerms}
                </Text>
              </View>
            ) : null}
            {detailProductQuote?.Info ? (
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_other_information')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {detailProductQuote?.Info}
                </Text>
              </View>
            ) : null}
            {detailProductQuote?.Note ? (
              <View style={stylesDetail.containerBodyCard}>
                <Text style={stylesDetail.txtHeaderBody}>
                  {languageKey('_note')}
                </Text>
                <Text style={stylesDetail.contentBody}>
                  {detailProductQuote?.Note}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      )}

      {/* TAB Tiền hàng */}
      <View style={[stylesDetail.containerHeader, {marginTop: 8}]}>
        <Text style={stylesDetail.header}>
          {languageKey('_summary') || 'Tiền hàng'}
        </Text>
        <Button
          style={stylesDetail.btnShowInfor}
          onPress={() => toggleInformation('totals')}>
          <SvgXml
            xml={showInformation.totals ? arrow_down_big : arrow_next_gray}
          />
        </Button>
      </View>
      {showInformation.totals && (
        <View style={[stylesDetail.cardProgram, {padding: 12}]}>
          <View style={{marginBottom: scale(8)}}>
            <Text style={[stylesDetail.txtHeaderBody]}>Tiền hàng</Text>
            <Text style={[stylesDetail.contentBody, {fontWeight: '600'}]}>
              {fmtMoney(totalItemAmount)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 12,
            }}>
            <View style={{flex: 1}}>
              <Text style={stylesDetail.txtHeaderBody}>VAT</Text>
              <Text
                style={[
                  stylesDetail.contentBody,
                  {fontWeight: '600', color: colors.red},
                ]}>
                {vatPercent != null
                  ? String(vatPercent) + '%'
                  : detailProductQuote?.VATValue || '—'}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={stylesDetail.txtHeaderBody}>Tiền thuế</Text>
              <Text
                style={[
                  stylesDetail.contentBody,
                  {fontWeight: '600', color: colors.red},
                ]}>
                {fmtMoney(totalVatAmount)}
              </Text>
            </View>
            {/* <View style={{flex: 1}}>
              <Text style={stylesDetail.txtHeaderBody}>Tổng giá trị</Text>
              <Text style={[stylesDetail.contentBody, {fontWeight: '600'}]}>
                {fmtMoney(totalAmount)}
              </Text>
            </View> */}
          </View>
          <View style={{marginBottom: scale(8), marginTop: scale(8)}}>
            <Text style={[stylesDetail.txtHeaderBody]}>Tổng giá trị</Text>
            <Text
              style={[
                stylesDetail.contentBody,
                {fontWeight: '600', color: colors.green},
              ]}>
              {fmtMoney(totalAmount)}
            </Text>
          </View>
        </View>
      )}

      <View style={stylesDetail.containerHeader}>
        <Text style={stylesDetail.header}>{languageKey('_product_list')}</Text>
      </View>

      {Array.isArray(detailProductQuote?.Details) &&
      detailProductQuote.Details.length > 0 ? (
        <View style={stylesDetail.cardProgram}>
          <FlatList
            data={detailProductQuote.Details}
            renderItem={_renderItemGood}
            style={stylesDetail.flatList}
            keyExtractor={_keyExtractorGood}
          />
        </View>
      ) : null}

      {showModalPrice && (
        <Modal
          isVisible={showModalPrice}
          useNativeDriver={true}
          onBackdropPress={handleHiddenModalPrice}
          onBackButtonPress={handleHiddenModalPrice}
          backdropTransitionOutTiming={450}
          avoidKeyboard={true}
          style={stylesDetail.modal}>
          <View style={stylesDetail.optionsModalDetail}>
            <View style={stylesDetail.headerModal}>
              <Text style={stylesDetail.titleModal}>
                {languageKey('_price_details')}
              </Text>
            </View>
            <ScrollView
              style={stylesDetail.modalContainerDetail}
              showsVerticalScrollIndicator={false}>
              <Text style={stylesDetail.header}>
                {languageKey('_information_general')}
              </Text>
              {itemDetail?.ItemName && (
                <View style={stylesDetail.contentDetail}>
                  <Text style={stylesDetail.txtHeaderBody}>
                    {languageKey('_product_name')}
                  </Text>
                  <Text style={stylesDetail.valueDetail}>
                    {itemDetail?.ItemName}
                  </Text>
                </View>
              )}
              <View style={stylesDetail.containerUpdatePrice}>
                <Text style={stylesDetail.txtHeaderUpdate}>
                  {languageKey('_pricing_details')}
                </Text>
              </View>
              <View style={stylesDetail.containerTableFile}>
                <View style={stylesDetail.tableWrapper}>
                  <View style={stylesDetail.row}>
                    <View style={stylesDetail.cell_20}>
                      <Text style={stylesDetail.txtHeaderTable}>Code</Text>
                    </View>
                    <View style={stylesDetail.cell_40}>
                      <Text style={stylesDetail.txtHeaderTable}>
                        {languageKey('_evaluation_criteria')}
                      </Text>
                    </View>
                    <View style={stylesDetail.cell_25}>
                      <Text style={stylesDetail.txtHeaderTable}>
                        {languageKey('_amount')}
                      </Text>
                    </View>
                    <View style={stylesDetail.cell_15}>
                      <Text style={stylesDetail.txtHeaderTable}>
                        {languageKey('_condition')}
                      </Text>
                    </View>
                  </View>
                  {dataTable?.map((item, index) => (
                    <View
                      style={[
                        stylesDetail.cellResponse,
                        index === dataTable?.length - 1 &&
                          stylesDetail.lastCell,
                      ]}
                      key={index}>
                      <View style={stylesDetail.cell_20}>
                        <Text style={stylesDetail.contentTime}>
                          {item.SAPID}
                        </Text>
                      </View>
                      <View style={stylesDetail.cell_40}>
                        <Text
                          style={[
                            stylesDetail.contentTime,
                            {
                              color:
                                item?.SAPID !== '' ? colors.black : colors.blue,
                            },
                          ]}
                          numberOfLines={2}
                          ellipsizeMode="tail">
                          {item.Name}
                        </Text>
                      </View>
                      <View style={stylesDetail.cell_25}>
                        <Text
                          style={[
                            stylesDetail.contentTime,
                            {
                              color:
                                item?.SAPID !== '' ? colors.black : colors.blue,
                            },
                          ]}>
                          {item.Amount}
                        </Text>
                      </View>
                      <View style={stylesDetail.cell_15}>
                        <Text
                          style={[
                            stylesDetail.contentTime,
                            {
                              color:
                                item?.SAPID !== '' ? colors.black : colors.blue,
                            },
                          ]}>
                          {item.Condition}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
            <View style={stylesDetail.footer}>
              <Button
                style={stylesDetail.btnFooterCancel}
                onPress={handleHiddenModalPrice}>
                <Text style={stylesDetail.txtBtnFooterCancel}>
                  {languageKey('_cancel')}
                </Text>
              </Button>
              <Button
                style={stylesDetail.btnFooterApproval}
                onPress={handleHiddenModalPrice}>
                <Text style={stylesDetail.txtBtnFooterApproval}>
                  {languageKey('_confirm')}
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default DetailTab;
