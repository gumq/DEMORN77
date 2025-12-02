import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import {SvgXml} from 'react-native-svg';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  Dimensions,
  FlatList,
  Alert,
  TextInput,
} from 'react-native';

import {Button} from '../buttons';
import {colors, fontSize} from 'themes';
import {hScale, scale} from '@resolutions';
import {translateLang} from 'store/accLanguages/slide';
import {
  checkbox_20,
  checkbox_active_20,
  close_red,
  close_white,
  trash_22,
} from 'svgImg';
import {ApiQuotation_EditPrice, ApiQuotation_GetItems} from 'action/Api';
import LoadingModal from 'components/LoadingModal';
import {InputDefault} from 'components/inputs';
import {useFormik} from 'formik';

const {height} = Dimensions.get('window');

// const ModalProductQuote = ({
//   setValue,
//   parentID,
//   showModal,
//   closeModal,
//   salesChannel,
//   custPricingProcedure,
//   customers,
//   goodTypes,
//   priceGroup,
//   isGeneralPrice,
//   applyPromotion,
//   currencyTypeID,
//   dataEdit = [],
// }) => {
//   const languageKey = useSelector(translateLang);
//   const {listItems} = useSelector(state => state.ProductQuote);
//   const [listGoods, setListGoods] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [showModalPrice, setShowModalPrice] = useState(false);
//   const [itemDetail, setItemDetail] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   //   console.log('listItems', listItems);
//   const handleShowModalPrice = item => {
//     setItemDetail(item);
//     setShowModalPrice(true);
//   };

//   const handleHiddenModalPrice = () => {
//     setShowModalPrice(false);
//   };

//   const toggleSelectItem = item => {
//     const exists = selectedItems.find(i => i.ItemID === item.ItemID);
//     if (exists) {
//       setSelectedItems(prev => prev.filter(i => i.ItemID !== item.ItemID));
//     } else {
//       setSelectedItems(prev => [...prev, item]);
//     }
//   };

//   const selectAllItems = () => {
//     if (selectedItems.length === listItems.length) {
//       setSelectedItems([]);
//     } else {
//       setSelectedItems(listItems);
//     }
//   };

//   useEffect(() => {
//     if (listItems.length === 0) return;

//     setListGoods(prevGoods => {
//       return prevGoods.map(good => {
//         const updatedItem = listItems.find(item => item.ItemID === good.ItemID);
//         return updatedItem
//           ? {
//               ...good,
//               ItemName: updatedItem.ItemName,
//               VAT: updatedItem.VAT,
//               From: updatedItem.From,
//               To: updatedItem.To,
//               Price: updatedItem.Price,
//               Details: updatedItem.Details,
//               PricePolicyID: updatedItem.PricePolicyID,
//               PriceNotVAT: updatedItem?.PriceNotVAT,
//               CmpnID: updatedItem?.CmpnID || '5',
//             }
//           : good;
//       });
//     });
//   }, [listItems]);
//   //   console.log('listItems', listItems?.[0]);
//   const handleAddSelectedItems = () => {
//     if (!selectedItems.length) return;

//     const newProducts = selectedItems.map(item => ({
//       OID: parentID || '',
//       ID: 0,
//       ItemName: item?.ItemName,
//       ItemID: item?.ItemID,
//       VAT: item?.VAT,
//       From: item?.From,
//       To: item?.To,
//       Price: item?.Price,
//       Details: item?.Details,
//       PriceNotVAT: item?.PriceNotVAT,
//       PricePolicyID: item?.PricePolicyID,
//       GoodsTypeID: item?.GoodsTypeID || 0,
//       GoodsTypeName: item?.GoodsTypeName || '',
//       UnitSaleName: item?.UnitSaleName || '',
//       Extention1: '',
//       Extention2: '',
//       Extention3: '',
//       Extention4: '',
//       Extention5: '',
//       Extention6: '',
//       Extention7: '',
//       Extention8: '',
//       Extention9: '',
//       Note: '',
//       VATAmount: Number(item?.PriceNotVAT) * Number(item?.VAT),
//       TotalAmount: item?.Price,
//       Quantity: 1,
//       ItemAmount: item?.PriceNotVAT,
//       IsDeleted: 0,
//     }));

//     setListGoods(prev => [...prev, ...newProducts]);
//     setValue(prev => [...prev, ...newProducts]);
//     setSelectedItems([]);
//     closeModal();
//   };

//   const _keyExtractor = (item, index) => `${item.Name}-${index}`;
//   const _renderItem = ({item}) => {
//     const isSelected = selectedItems.find(i => i.ItemID === item.ItemID);
//     const alreadyAdded = listGoods.find(i => i.ItemID === item.ItemID);

//     return (
//       <View>
//         <View style={styles.cardProgram}>
//           <View style={styles.itemBody_two}>
//             <View style={styles.containerItem}>
//               <View style={styles.containerHeader}>
//                 <Text style={styles.txtTitleItem}>{item?.ItemName}</Text>
//                 <Button
//                   onPress={() => toggleSelectItem(item)}
//                   disabled={alreadyAdded}
//                   style={{opacity: alreadyAdded ? 0.4 : 1}}>
//                   <SvgXml xml={isSelected ? checkbox_active_20 : checkbox_20} />
//                 </Button>
//               </View>
//               <Text style={styles.txtProposal}>{item?.GoodsTypeName}</Text>
//             </View>
//           </View>
//           <View style={styles.bodyCard}>
//             <View style={styles.content}>
//               {item?.VAT ? (
//                 <View style={styles.containerBodyText}>
//                   <Text style={styles.txtHeaderBody}>
//                     {languageKey('_tax_rate')}
//                   </Text>
//                   <Text style={styles.contentBody}>
//                     {item?.VAT?.toLocaleString('en')}
//                   </Text>
//                 </View>
//               ) : null}
//               {item?.UnitSaleName ? (
//                 <View style={styles.containerBodyText}>
//                   <Text style={styles.txtHeaderBody}>
//                     {languageKey('_unit')}
//                   </Text>
//                   <Text style={styles.contentBody}>{item?.UnitSaleName}</Text>
//                 </View>
//               ) : null}
//             </View>
//             <View style={styles.content}>
//               <View style={styles.containerBodyText}>
//                 <Text style={styles.txtHeaderBody}>
//                   {languageKey('_quantity_from')}
//                 </Text>
//                 <Text style={styles.contentBody}>
//                   {item?.From?.toLocaleString('en')}
//                 </Text>
//               </View>
//               <View style={styles.containerBodyText}>
//                 <Text style={styles.txtHeaderBody}>
//                   {languageKey('_quantity_to')}
//                 </Text>
//                 <Text style={styles.contentBody}>
//                   {item?.To?.toLocaleString('en')}
//                 </Text>
//               </View>
//             </View>
//             {item?.Price ? (
//               <View style={styles.containerBodyText}>
//                 <Text style={styles.txtHeaderBody}>
//                   {languageKey('_unit_price')}
//                 </Text>
//                 <Text style={styles.contentBody}>
//                   {item?.Price?.toLocaleString('en')}
//                 </Text>
//               </View>
//             ) : null}
//           </View>
//         </View>
//       </View>
//     );
//   };

//   const handleDelete = itemToDelete => {
//     setListGoods(prevGoods =>
//       prevGoods.filter(item => item.ItemID !== itemToDelete.ItemID),
//     );
//     setValue(prevGoods =>
//       prevGoods.filter(item => item.ItemID !== itemToDelete.ItemID),
//     );
//   };

//   const _keyExtractorGood = (item, index) => `${item.Name}-${index}`;
//   const _renderItemGood = ({item}) => {
//     return (
//       <View>
//         <View style={styles.cardProgram}>
//           <View style={styles.itemBody_two}>
//             <View style={styles.containerItem}>
//               <View style={styles.containerHeader}>
//                 <Text style={styles.txtTitleItem}>{item?.ItemName}</Text>
//                 <Button onPress={() => handleDelete(item)}>
//                   <SvgXml xml={trash_22} />
//                 </Button>
//               </View>
//               <Text style={styles.txtProposal}>{item?.GoodsTypeName}</Text>
//             </View>
//           </View>
//           <View style={styles.bodyCard}>
//             <View style={styles.content}>
//               {item?.VAT ? (
//                 <View style={styles.containerBodyText}>
//                   <Text style={styles.txtHeaderBody}>
//                     {languageKey('_tax_rate')}
//                   </Text>
//                   <Text style={styles.contentBody}>
//                     {item?.VAT?.toLocaleString('en')}
//                   </Text>
//                 </View>
//               ) : null}
//               {item?.UnitSaleName ? (
//                 <View style={styles.containerBodyText}>
//                   <Text style={styles.txtHeaderBody}>
//                     {languageKey('_unit')}
//                   </Text>
//                   <Text style={styles.contentBody}>{item?.UnitSaleName}</Text>
//                 </View>
//               ) : null}
//             </View>
//             <View style={styles.content}>
//               <View style={styles.containerBodyText}>
//                 <Text style={styles.txtHeaderBody}>
//                   {languageKey('_quantity_from')}
//                 </Text>
//                 <Text style={styles.contentBody}>
//                   {item?.From?.toLocaleString('en')}
//                 </Text>
//               </View>
//               <View style={styles.containerBodyText}>
//                 <Text style={styles.txtHeaderBody}>
//                   {languageKey('_quantity_to')}
//                 </Text>
//                 <Text style={styles.contentBody}>
//                   {Number(item?.To)?.toLocaleString('en')}
//                 </Text>
//               </View>
//             </View>
//             {item?.Price ? (
//               <View style={styles.containerBodyText}>
//                 <Text style={styles.txtHeaderBody}>
//                   {languageKey('_unit_price')}
//                 </Text>
//                 <Text style={styles.contentBody}>
//                   {item?.Price?.toLocaleString('en')}
//                 </Text>
//               </View>
//             ) : null}

//             <Button
//               style={styles.btnDetail}
//               onPress={() => handleShowModalPrice(item)}>
//               <Text style={styles.txtBtnDetail}>
//                 {languageKey('_price_details')}
//               </Text>
//             </Button>
//           </View>
//         </View>
//       </View>
//     );
//   };
//   //   console.log('itemDetail', itemDetail);
//   const dataTable = itemDetail?.Details
//     ? itemDetail?.Details || JSON?.parse(itemDetail?.Details)
//     : [];

//   const handleUpDate = async () => {
//     setIsSubmitting(true);
//     const body = {
//       SalesChannelID: salesChannel,
//       CustPricingProcedure: custPricingProcedure,
//       Customers: customers,
//       GoodsTypes: goodTypes,
//       PriceGroupID: priceGroup,
//       IsGeneralPrice: isGeneralPrice,
//       ApplyPromotion: applyPromotion,
//       CurrencyTypeID: currencyTypeID,
//       Details: [itemDetail] || [],
//     };
//     console.log('bodybodybodybodybody', itemDetail);
//     try {
//       const {data} = await ApiQuotation_GetItems(body);
//       if (data.ErrorCode === '0' && data.StatusCode === 200) {
//         let result = data.Result;
//         if (result) {
//           setIsSubmitting(false);
//           await new Promise(resolve => {
//             setItemDetail(result[0]);
//             resolve();
//           });
//         } else {
//           setIsSubmitting(false);
//         }
//       } else {
//         setIsSubmitting(false);
//       }
//     } catch (error) {
//       console.log('error', error);
//     }
//   };

//   useEffect(() => {
//     if (dataEdit && dataEdit.length > 0) {
//       const convertedData = dataEdit.map(item => ({
//         OID: item?.OID || '',
//         ID: item?.ID,
//         ItemName: item?.ItemName,
//         ItemID: item?.ItemID,
//         VAT: item?.VAT,
//         From: item?.From,
//         To: item?.To,
//         Price: item?.Price,
//         Details: item?.Details,
//         PricePolicyID: item?.PricePolicyID,
//         GoodsTypeID: item?.GoodsTypeID || 0,
//         GoodsTypeName: item?.GoodsTypeName || '',
//         UnitSaleName: item?.UnitSaleName || '',
//         Extention1: '',
//         Extention2: '',
//         Extention3: '',
//         Extention4: '',
//         Extention5: '',
//         Extention6: '',
//         Extention7: '',
//         Extention8: '',
//         Extention9: '',
//         Note: '',
//       }));
//       setValue(convertedData);
//       setListGoods(convertedData);
//     }
//   }, [dataEdit]);

//   return (
//     <View>
//       {showModal && (
//         <Modal
//           isVisible={showModal}
//           useNativeDriver={true}
//           onBackdropPress={closeModal}
//           onBackButtonPress={closeModal}
//           backdropTransitionOutTiming={450}
//           avoidKeyboard={true}
//           style={styles.modal}>
//           <View style={styles.optionsModalContainer}>
//             <View style={styles.headerModal}>
//               <View style={styles.btnClose}>
//                 <SvgXml xml={close_white} />
//               </View>
//               <Text style={styles.titleModal}>
//                 {languageKey('_add_products')}
//               </Text>
//               <Button onPress={closeModal} style={styles.btnClose}>
//                 <SvgXml xml={close_red} />
//               </Button>
//             </View>
//             <ScrollView
//               style={styles.modalContainer}
//               showsVerticalScrollIndicator={false}>
//               <FlatList
//                 data={listItems}
//                 renderItem={_renderItem}
//                 keyExtractor={_keyExtractor}
//               />
//             </ScrollView>
//             <View style={styles.footer}>
//               <Button style={styles.btnFooterCancel} onPress={selectAllItems}>
//                 <Text style={styles.txtBtnFooterCancel}>
//                   {languageKey('_select_all')}
//                 </Text>
//               </Button>
//               <Button
//                 style={styles.btnFooterApproval}
//                 onPress={handleAddSelectedItems}>
//                 <Text style={styles.txtBtnFooterApproval}>
//                   {languageKey('_add')}
//                 </Text>
//               </Button>
//             </View>
//           </View>
//         </Modal>
//       )}
//       <View style={styles.card}>
//         <FlatList
//           data={listGoods}
//           renderItem={_renderItemGood}
//           keyExtractor={_keyExtractorGood}
//         />
//       </View>
//       {showModalPrice && (
//         <Modal
//           isVisible={showModalPrice}
//           useNativeDriver={true}
//           onBackdropPress={handleHiddenModalPrice}
//           onBackButtonPress={handleHiddenModalPrice}
//           backdropTransitionOutTiming={450}
//           avoidKeyboard={true}
//           style={styles.modal}>
//           <View style={styles.optionsModalDetail}>
//             <View style={styles.headerModal}>
//               <Text style={styles.titleModal}>
//                 {languageKey('_price_details')}
//               </Text>
//             </View>
//             <ScrollView
//               style={styles.modalContainerDetail}
//               showsVerticalScrollIndicator={false}>
//               <Text style={styles.header}>
//                 {languageKey('_information_general')}
//               </Text>
//               {itemDetail?.ItemName ? (
//                 <View style={styles.contentDetail}>
//                   <Text style={styles.txtHeaderBody}>
//                     {languageKey('_product_name')}
//                   </Text>
//                   <Text style={styles.valueDetail}>{itemDetail?.ItemName}</Text>
//                 </View>
//               ) : null}
//               <View style={styles.contentInfoModal}>
//                 {itemDetail?.UnitSaleName ? (
//                   <View style={styles.containerBodyDetail}>
//                     <Text style={styles.txtHeaderBody}>
//                       {languageKey('_unit')}
//                     </Text>
//                     <Text style={styles.valueDetail}>
//                       {itemDetail?.UnitSaleName}
//                     </Text>
//                   </View>
//                 ) : null}
//                 {itemDetail?.VAT ? (
//                   <View style={styles.containerBodyDetail}>
//                     <Text style={styles.txtHeaderBody}>
//                       {languageKey('_tax_rate')}
//                     </Text>
//                     <Text style={styles.valueDetail}>{itemDetail?.VAT}</Text>
//                   </View>
//                 ) : null}
//                 {itemDetail?.Price ? (
//                   <View style={styles.containerBodyDetail}>
//                     <Text style={styles.txtHeaderBody}>
//                       {languageKey('_unit_price')}
//                     </Text>
//                     <Text style={styles.valueDetail}>
//                       {Number(itemDetail?.Price)?.toLocaleString('en')}
//                     </Text>
//                   </View>
//                 ) : null}
//               </View>
//               <View style={styles.containerUpdatePrice}>
//                 <Text style={styles.txtHeaderUpdate}>
//                   {languageKey('_pricing_details')}
//                 </Text>
//                 <Button style={styles.btnUpdate} onPress={handleUpDate}>
//                   <Text style={styles.txtBtnUpdate}>
//                     {languageKey('_update_price')}
//                   </Text>
//                 </Button>
//               </View>
//               <View style={styles.containerTableFile}>
//                 <View style={styles.tableWrapper}>
//                   <View style={styles.row}>
//                     <View style={styles.cell_20}>
//                       <Text style={styles.txtHeaderTable}>Code</Text>
//                     </View>
//                     <View style={styles.cell_40}>
//                       <Text style={styles.txtHeaderTable}>
//                         {languageKey('_evaluation_criteria')}
//                       </Text>
//                     </View>
//                     <View style={styles.cell_25}>
//                       <Text style={styles.txtHeaderTable}>
//                         {languageKey('_amount')}
//                       </Text>
//                     </View>
//                     <View style={styles.cell_15}>
//                       <Text style={styles.txtHeaderTable}>
//                         {languageKey('_condition')}
//                       </Text>
//                     </View>
//                   </View>
//                   {dataTable?.map((item, index) => (
//                     <View
//                       style={[
//                         styles.cellResponse,
//                         index === dataTable.length - 1 && styles.lastCell,
//                       ]}
//                       key={index}>
//                       <View style={styles.cell_20}>
//                         <Text style={styles.contentTime}>{item.SAPID}</Text>
//                       </View>
//                       <View style={styles.cell_40}>
//                         <Text
//                           style={[
//                             styles.contentTime,
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
//                       <View style={styles.cell_25}>
//                         <Text
//                           style={[
//                             styles.contentTime,
//                             {
//                               color:
//                                 item?.SAPID !== '' ? colors.black : colors.blue,
//                             },
//                           ]}>
//                           {item.Amount}
//                         </Text>
//                       </View>
//                       <View style={styles.cell_15}>
//                         <Text
//                           style={[
//                             styles.contentTime,
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
//             <View style={styles.footer}>
//               <Button
//                 style={styles.btnFooterCancel}
//                 onPress={handleHiddenModalPrice}>
//                 <Text style={styles.txtBtnFooterCancel}>
//                   {languageKey('_cancel')}
//                 </Text>
//               </Button>
//               <Button
//                 style={styles.btnFooterApproval}
//                 onPress={handleHiddenModalPrice}>
//                 <Text style={styles.txtBtnFooterApproval}>
//                   {languageKey('_confirm')}
//                 </Text>
//               </Button>
//             </View>
//           </View>
//         </Modal>
//       )}
//       <LoadingModal visible={isSubmitting} />
//     </View>
//   );
// };
// const ModalProductQuote = ({
//   setValue,
//   parentID,
//   showModal,
//   closeModal,
//   salesChannel,
//   custPricingProcedure,
//   customers,
//   goodTypes,
//   priceGroup,
//   isGeneralPrice,
//   applyPromotion,
//   currencyTypeID,
//   dataEdit = [],
//   CmpnID = null,
// }) => {
//   const languageKey = useSelector(translateLang);
//   const {listItems} = useSelector(state => state.ProductQuote || {});
//   const [listGoods, setListGoods] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [showModalPrice, setShowModalPrice] = useState(false);
//   const [itemDetail, setItemDetail] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Formik: store per-item quantities in values.quantities[itemId]
//   const {values, setFieldValue, handleChange, handleBlur} = useFormik({
//     initialValues: {quantities: {}},
//     onSubmit: () => {},
//   });
//   console.log('quantities', values.quantities);
//   useEffect(() => {
//     // populate from dataEdit if provided
//     if (dataEdit && dataEdit.length > 0) {
//       const convertedData = dataEdit.map(item => ({
//         OID: item?.OID || '',
//         ID: item?.ID || 0,
//         ItemName: item?.ItemName,
//         ItemID: item?.ItemID,
//         VAT: item?.VAT,
//         From: item?.From,
//         To: item?.To,
//         Price: item?.Price,
//         Details: item?.Details,
//         PricePolicyID: item?.PricePolicyID,
//         GoodsTypeID: item?.GoodsTypeID || 0,
//         GoodsTypeName: item?.GoodsTypeName || '',
//         UnitSaleName: item?.UnitSaleName || '',
//         PriceNotVAT: item?.PriceNotVAT,
//         Quantity: item?.Quantity ?? 1,
//         Extention1: '',
//         Note: 'Note',
//       }));
//       setValue(convertedData);
//       setListGoods(convertedData);

//       // initialize quantities in formik
//       const q = {};
//       convertedData.forEach(it => {
//         q[it.ItemID] = Number(it.Quantity ?? 1);
//       });
//       setFieldValue('quantities', q);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dataEdit, setValue]);

//   useEffect(() => {
//     if (!listItems || listItems.length === 0) return;

//     // cập nhật thông tin cho những mục trong listGoods nếu listItems thay đổi
//     setListGoods(prevGoods =>
//       prevGoods.map(good => {
//         const updatedItem = listItems.find(item => item.ItemID === good.ItemID);
//         return updatedItem
//           ? {
//               ...good,
//               ItemName: updatedItem.ItemName ?? good.ItemName,
//               VAT: updatedItem.VAT ?? good.VAT,
//               From: updatedItem.From ?? good.From,
//               To: updatedItem.To ?? good.To,
//               Price: updatedItem.Price ?? good.Price,
//               Details: updatedItem.Details ?? good.Details,
//               PricePolicyID: updatedItem.PricePolicyID ?? good.PricePolicyID,
//               PriceNotVAT: updatedItem?.PriceNotVAT ?? good.PriceNotVAT,
//               CmpnID: updatedItem?.CmpnID || good.CmpnID || '5',
//             }
//           : good;
//       }),
//     );
//   }, [listItems]);

//   const handleShowModalPrice = item => {
//     console.log('item', item);
//     setItemDetail(item);
//     setShowModalPrice(true);
//   };
//   const handleHiddenModalPrice = () => setShowModalPrice(false);

//   const toggleSelectItem = item => {
//     const exists = selectedItems.find(i => i.ItemID === item.ItemID);
//     if (exists) {
//       setSelectedItems(prev => prev.filter(i => i.ItemID !== item.ItemID));
//     } else {
//       // if user hasn't set quantity for this item yet, initialize to 1
//       setFieldValue(
//         `quantities.${item.ItemID}`,
//         values.quantities?.[item.ItemID] ?? 1,
//       );
//       setSelectedItems(prev => [...prev, item]);
//     }
//   };

//   const selectAllItems = () => {
//     if (!listItems) return;
//     if (selectedItems.length === listItems.length) {
//       setSelectedItems([]);
//     } else {
//       // init quantities for all to 1 if not set
//       const q = {...(values.quantities || {})};
//       listItems.forEach(it => {
//         if (!q[it.ItemID]) q[it.ItemID] = 1;
//       });
//       setFieldValue('quantities', q);
//       setSelectedItems(listItems);
//     }
//   };

//   const handleDelete = itemToDelete => {
//     setListGoods(prevGoods =>
//       prevGoods.filter(item => item.ItemID !== itemToDelete.ItemID),
//     );
//     setValue(prevGoods =>
//       Array.isArray(prevGoods)
//         ? prevGoods.filter(item => item.ItemID !== itemToDelete.ItemID)
//         : [],
//     );
//     // remove quantity
//     const q = {...(values.quantities || {})};
//     delete q[itemToDelete.ItemID];
//     setFieldValue('quantities', q);
//   };

//   const buildDetailsPayloadFromSelected = selectedItems => {
//     const qmap = values.quantities || {};
//     return selectedItems.map(item => {
//       const Quantity = Number(qmap[item.ItemID] ?? item.Quantity ?? 1);
//       // PriceNotVAT calculation sample: Price - VAT%
//       const priceNum = Number(item.Price || 0);
//       const vatNum = Number(item.VAT || 0);
//       const priceNotVAT = Math.round((priceNum * 100) / (100 + (vatNum || 0))); // approximate
//       return {
//         ID: item?.ID ?? 0,
//         PriceGoupID: Number(priceGroup) || item?.PriceGoupID || 0,
//         GoodsTypeID: item?.GoodsTypeID || 0,
//         GoodsTypeName: item?.GoodsTypeName || '',
//         ModelID: item?.ModelID ?? 0,
//         ModelName: item?.ModelName ?? '',
//         ItemID: item?.ItemID,
//         ItemName: item?.ItemName || '',
//         SKU: item?.SKU || '',
//         UnitName: item?.UnitSaleName || item?.UnitName || 'KG',
//         From: item?.From ?? 1,
//         To: item?.To ?? 9999999,
//         VAT: String(item?.VAT ?? 0),
//         VATName: item?.VAT ? `${item.VAT}%` : '',
//         Price: priceNum,
//         PricePolicyID: item?.PricePolicyID || '',
//         OID: parentID || '',
//         Quantity: 1,
//         Details: item?.Details
//           ? typeof item.Details !== 'string'
//             ? item.Details
//             : JSON.stringify(item.Details)
//           : '[]',
//         Extention1: item?.Extention1 || '',
//         Extention2: item?.Extention2 || '',
//         Extention3: item?.Extention3 || '',
//         Extention4: item?.Extention4 || '',
//         Extention5: item?.Extention5 || '',
//         Extention6: item?.Extention6 || '',
//         Extention7: item?.Extention7 || '',
//         Extention8: item?.Extention8 || '',
//         Extention9: item?.Extention9 || '',
//         Note: ' ',
//       };
//     });
//   };

//   // --- Hàm chính: khi ấn Add ---
//   const handleAddSelectedItems = async () => {
//     if (!selectedItems.length) return;

//     const detailsPayload = buildDetailsPayloadFromSelected(selectedItems);

//     const body = {
//       CmpnID: CmpnID?.toString(),
//       FactorID: 'QuotationDomestic',
//       EntryID: 'DomesticGeneral',
//       SalesChannelID: Number(salesChannel) || 0,
//       Customers: String(customers || ''),
//       GoodsTypes: String(goodTypes || ''),
//       PriceGroupID: Number(priceGroup) || 0,
//       IsGeneralPrice: Number(isGeneralPrice ? 1 : 0),
//       ApplyPromotion: Number(applyPromotion ? 1 : 0),
//       CurrencyTypeID: Number(currencyTypeID) || 0,
//       Details: detailsPayload,
//     };
//     console.log('bodybodybodybodybody', body);
//     setIsSubmitting(true);
//     try {
//       const {data} = await ApiQuotation_EditPrice(body);
//       console.log('datadatadataaaaaaaaaaaaaaaaaaa', data);
//       if (
//         data &&
//         data.ErrorCode === '0' &&
//         data.StatusCode === 200
//         //  &&
//         // Array.isArray(data.Result)
//       ) {
//         const returned = data.Result;
//         const returnedByItemId = {};
//         returned.forEach(r => {
//           if (r.ItemID != null) returnedByItemId[Number(r.ItemID)] = r;
//         });

//         const newProducts = selectedItems.map(item => {
//           const ret = returnedByItemId[Number(item.ItemID)];
//           const qty = Number(
//             values.quantities?.[item.ItemID] ?? item.Quantity ?? 1,
//           );
//           if (ret) {
//             return {
//               OID: ret.OID ?? parentID ?? '',
//               ID: ret.ID ?? 0,
//               ItemName: ret.ItemName ?? item.ItemName,
//               ItemID: ret.ItemID ?? item.ItemID,
//               VAT: ret.VAT ?? item.VAT,
//               From: ret.From ?? item.From,
//               To: ret.To ?? item.To,
//               Price: ret.Price ?? item.Price,
//               Details: ret.Details ?? (item.Details ? item.Details : '[]'),
//               PricePolicyID: ret.PricePolicyID ?? item.PricePolicyID,
//               GoodsTypeID: ret.GoodsTypeID ?? item.GoodsTypeID,
//               GoodsTypeName: ret.GoodsTypeName ?? item.GoodsTypeName,
//               UnitSaleName: ret.UnitSaleName ?? item.UnitSaleName,
//               PriceNotVAT: ret.PriceNotVAT ?? item.PriceNotVAT,
//               Quantity: qty,
//               TotalAmount:
//                 ret.TotalAmount ??
//                 (ret.Price ? ret.Price * qty : item.Price * qty),
//               ItemAmount: ret.ItemAmount ?? item.ItemAmount,
//               VATAmount: ret.VATAmount ?? item.VATAmount,
//               IsDeleted: ret.IsDeleted ?? 0,
//               Note: ' ',
//             };
//           } else {
//             return {
//               OID: parentID || '',
//               ID: item?.ID || 0,
//               ItemName: item?.ItemName,
//               ItemID: item?.ItemID,
//               VAT: item?.VAT,
//               From: item?.From,
//               To: item?.To,
//               Price: item?.Price,
//               Details: item?.Details ?? '[]',
//               PricePolicyID: item?.PricePolicyID,
//               GoodsTypeID: item?.GoodsTypeID || 0,
//               GoodsTypeName: item?.GoodsTypeName || '',
//               UnitSaleName: item?.UnitSaleName || '',
//               PriceNotVAT: item?.PriceNotVAT,
//               Quantity: qty,
//               TotalAmount: item?.Price * qty,
//               ItemAmount: item?.ItemAmount,
//               VATAmount: item?.VATAmount,
//               IsDeleted: item?.IsDeleted ?? 0,
//               Note: ' ',
//             };
//           }
//         });

//         // merge vào listGoods
//         setListGoods(prev => {
//           const ids = new Set(prev.map(p => p.ItemID));
//           const merged = [...prev];
//           newProducts.forEach(p => {
//             if (!ids.has(p.ItemID)) merged.push(p);
//             else {
//               const idx = merged.findIndex(x => x.ItemID === p.ItemID);
//               if (idx >= 0) merged[idx] = p;
//             }
//           });
//           return merged;
//         });

//         // cập nhật parent values
//         setValue(prev => {
//           const prevArr = Array.isArray(prev) ? prev.slice() : [];
//           const idsPrev = new Set(prevArr.map(p => p.ItemID));
//           newProducts.forEach(p => {
//             if (!idsPrev.has(p.ItemID)) prevArr.push(p);
//             else {
//               const idx = prevArr.findIndex(x => x.ItemID === p.ItemID);
//               if (idx >= 0) prevArr[idx] = p;
//             }
//           });
//           return prevArr;
//         });

//         setSelectedItems([]);
//         closeModal();
//       } else {
//         Alert.alert('Lỗi', 'Cập nhật giá thất bại. Thêm tạm cục bộ.');
//         const newProducts = selectedItems.map(item => {
//           const qty = Number(
//             values.quantities?.[item.ItemID] ?? item.Quantity ?? 1,
//           );
//           return {
//             OID: parentID || '',
//             ID: 0,
//             ItemName: item?.ItemName,
//             ItemID: item?.ItemID,
//             VAT: item?.VAT,
//             From: item?.From,
//             To: item?.To,
//             Price: item?.Price,
//             Details: item?.Details ?? '[]',
//             PricePolicyID: item?.PricePolicyID,
//             GoodsTypeID: item?.GoodsTypeID || 0,
//             GoodsTypeName: item?.GoodsTypeName || '',
//             UnitSaleName: item?.UnitSaleName || '',
//             PriceNotVAT: item?.PriceNotVAT,
//             Quantity: qty,
//             TotalAmount: item?.Price * qty,
//             ItemAmount: item?.ItemAmount,
//             VATAmount: item?.VATAmount,
//             IsDeleted: 0,
//             Note: ' ',
//           };
//         });
//         setListGoods(prev => [...prev, ...newProducts]);
//         setValue(prev => [...(prev || []), ...newProducts]);
//         setSelectedItems([]);
//         closeModal();
//       }
//     } catch (error) {
//       console.log('ApiQuotation_EditPrice error', error);
//       Alert.alert('Lỗi', 'Gọi API thất bại. Thêm tạm cục bộ.');
//       const newProducts = selectedItems.map(item => {
//         const qty = Number(
//           values.quantities?.[item.ItemID] ?? item.Quantity ?? 1,
//         );
//         return {
//           OID: parentID || '',
//           ID: 0,
//           ItemName: item?.ItemName,
//           ItemID: item?.ItemID,
//           VAT: item?.VAT,
//           From: item?.From,
//           To: item?.To,
//           Price: item?.Price,
//           Details: item?.Details ?? '[]',
//           PricePolicyID: item?.PricePolicyID,
//           GoodsTypeID: item?.GoodsTypeID || 0,
//           GoodsTypeName: item?.GoodsTypeName || '',
//           UnitSaleName: item?.UnitSaleName || '',
//           PriceNotVAT: item?.PriceNotVAT,
//           Quantity: qty,
//           TotalAmount: item?.Price * qty,
//           ItemAmount: item?.ItemAmount,
//           VATAmount: item?.VATAmount,
//           IsDeleted: 0,
//           Note: ' ',
//         };
//       });
//       setListGoods(prev => [...prev, ...newProducts]);
//       setValue(prev => [...(prev || []), ...newProducts]);
//       setSelectedItems([]);
//       closeModal();
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const _keyExtractor = (item, index) =>
//     `${item.ItemID || item.ID || index}-${index}`;

//   // Render item list (selectable) — thêm InputDefault để nhập quantity cho từng item trước khi chọn
//   const _renderItem = ({item}) => {
//     const isSelected = selectedItems.find(i => i.ItemID === item.ItemID);
//     const alreadyAdded = listGoods.find(i => i.ItemID === item.ItemID);
//     const qtyVal = values.quantities?.[item.ItemID] ?? 1;

//     return (
//       <View>
//         <View style={styles.cardProgram}>
//           <View style={styles.itemBody_two}>
//             <View style={styles.containerItem}>
//               <View style={styles.containerHeader}>
//                 <Text style={styles.txtTitleItem}>{item?.ItemName}</Text>
//                 <Button
//                   onPress={() => toggleSelectItem(item)}
//                   disabled={alreadyAdded}
//                   style={{opacity: alreadyAdded ? 0.4 : 1}}>
//                   <SvgXml xml={isSelected ? checkbox_active_20 : checkbox_20} />
//                 </Button>
//               </View>
//               <Text style={styles.txtProposal}>{item?.GoodsTypeName}</Text>
//             </View>
//           </View>

//           <View style={styles.bodyCard}>
//             <View style={styles.content}>
//               {item?.VAT ? (
//                 <View style={styles.containerBodyText}>
//                   <Text style={styles.txtHeaderBody}>
//                     {languageKey('_tax_rate')}
//                   </Text>
//                   <Text style={styles.contentBody}>{String(item?.VAT)}</Text>
//                 </View>
//               ) : null}
//               {item?.UnitSaleName ? (
//                 <View style={styles.containerBodyText}>
//                   <Text style={styles.txtHeaderBody}>
//                     {languageKey('_unit')}
//                   </Text>
//                   <Text style={styles.contentBody}>{item?.UnitSaleName}</Text>
//                 </View>
//               ) : null}
//             </View>

//             <View style={styles.content}>
//               <View style={styles.containerBodyText}>
//                 <Text style={styles.txtHeaderBody}>
//                   {languageKey('_quantity_from')}
//                 </Text>
//                 <Text style={styles.contentBody}>
//                   {item?.From?.toLocaleString('en')}
//                 </Text>
//               </View>
//               <View style={styles.containerBodyText}>
//                 <Text style={styles.txtHeaderBody}>
//                   {languageKey('_quantity_to')}
//                 </Text>
//                 <Text style={styles.contentBody}>
//                   {Number(item?.To)?.toLocaleString('en')}
//                 </Text>
//               </View>
//             </View>

//             {item?.Price ? (
//               <View style={styles.containerBodyText}>
//                 <Text style={styles.txtHeaderBody}>
//                   {languageKey('_unit_price')}
//                 </Text>
//                 <Text style={styles.contentBody}>
//                   {Number(item?.Price)?.toLocaleString('en')}
//                 </Text>
//               </View>
//             ) : null}
//             <View style={{marginTop: scale(4)}}>
//               <InputDefault
//                 name={`Quantity_${item.ItemID}`}
//                 returnKeyType="next"
//                 style={{marginHorizontal: scale(4)}}
//                 value={String(qtyVal)}
//                 label={languageKey('_quantity')}
//                 isEdit={true}
//                 placeholderInput={true}
//                 bgColor={'#fff'}
//                 labelHolder={''}
//                 {...{handleBlur, handleChange, setFieldValue}}
//               />
//             </View>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   const _keyExtractorGood = (item, index) =>
//     `${item.ItemID || item.ID || index}-${index}`;

//   const _renderItemGood = ({item}) => {
//     const qtyVal = values.quantities?.[item.ItemID] ?? item.Quantity ?? 1;
//     return (
//       <View>
//         <View style={styles.cardProgram}>
//           <View style={styles.itemBody_two}>
//             <View style={styles.containerItem}>
//               <View style={styles.containerHeader}>
//                 <Text style={styles.txtTitleItem}>{item?.ItemName}</Text>
//                 <Button onPress={() => handleDelete(item)}>
//                   <SvgXml xml={trash_22} />
//                 </Button>
//               </View>
//               <Text style={styles.txtProposal}>{item?.GoodsTypeName}</Text>
//             </View>
//           </View>

//           <View style={styles.bodyCard}>
//             <View style={styles.content}>
//               {item?.VAT ? (
//                 <View style={styles.containerBodyText}>
//                   <Text style={styles.txtHeaderBody}>
//                     {languageKey('_tax_rate')}
//                   </Text>
//                   <Text style={styles.contentBody}>{String(item?.VAT)}</Text>
//                 </View>
//               ) : null}
//               {item?.UnitSaleName ? (
//                 <View style={styles.containerBodyText}>
//                   <Text style={styles.txtHeaderBody}>
//                     {languageKey('_unit')}
//                   </Text>
//                   <Text style={styles.contentBody}>{item?.UnitSaleName}</Text>
//                 </View>
//               ) : null}
//             </View>

//             <View style={styles.content}>
//               <View style={styles.containerBodyText}>
//                 <Text style={styles.txtHeaderBody}>
//                   {languageKey('_quantity')}
//                 </Text>
//                 <Text style={styles.contentBody}>
//                   {item?.From?.toLocaleString('en')}{' '}
//                 </Text>
//               </View>

//               <View style={styles.containerBodyText}>
//                 <Text style={styles.txtHeaderBody}>
//                   {languageKey('_quantity_to')}
//                 </Text>
//                 <Text style={styles.contentBody}>
//                   {Number(item?.To)?.toLocaleString('en')}
//                 </Text>
//               </View>
//             </View>

//             {item?.Price ? (
//               <View style={styles.containerBodyText}>
//                 <Text style={styles.txtHeaderBody}>
//                   {languageKey('_unit_price')}
//                 </Text>
//                 <Text style={styles.contentBody}>
//                   {Number(item?.Price)?.toLocaleString('en')}
//                 </Text>
//               </View>
//             ) : null}
//             <InputDefault
//               name={`Quantity_added_${item.ItemID}`}
//               returnKeyType="next"
//               style={{marginHorizontal: scale(4)}}
//               value={String(qtyVal)}
//               label={languageKey('_quantity')}
//               isEdit={true}
//               placeholderInput={true}
//               bgColor={'#fff'}
//               labelHolder={''}
//               {...{handleBlur, handleChange, setFieldValue}}
//             />
//             <Button
//               style={styles.btnDetail}
//               onPress={() => handleShowModalPrice(item)}>
//               <Text style={styles.txtBtnDetail}>
//                 {languageKey('_price_details')}
//               </Text>
//             </Button>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   const dataTable =
//     itemDetail?.Details && typeof itemDetail.Details === 'string'
//       ? JSON.parse(itemDetail.Details)
//       : itemDetail?.Details || [];
//   // console.log('itemDetail', itemDetail);
//   return (
//     <View>
//       {showModal && (
//         <Modal
//           isVisible={showModal}
//           useNativeDriver={true}
//           onBackdropPress={closeModal}
//           onBackButtonPress={closeModal}
//           backdropTransitionOutTiming={450}
//           avoidKeyboard={true}
//           style={styles.modal}>
//           <View style={styles.optionsModalContainer}>
//             <View style={styles.headerModal}>
//               <View style={styles.btnClose}>
//                 <SvgXml xml={close_white} />
//               </View>
//               <Text style={styles.titleModal}>
//                 {languageKey('_add_products')}
//               </Text>
//               <Button onPress={closeModal} style={styles.btnClose}>
//                 <SvgXml xml={close_red} />
//               </Button>
//             </View>

//             <ScrollView
//               style={styles.modalContainer}
//               showsVerticalScrollIndicator={false}>
//               <FlatList
//                 data={listItems}
//                 renderItem={_renderItem}
//                 keyExtractor={_keyExtractor}
//               />
//             </ScrollView>

//             <View style={styles.footer}>
//               <Button style={styles.btnFooterCancel} onPress={selectAllItems}>
//                 <Text style={styles.txtBtnFooterCancel}>
//                   {languageKey('_select_all')}
//                 </Text>
//               </Button>
//               <Button
//                 style={styles.btnFooterApproval}
//                 onPress={handleAddSelectedItems}
//                 disabled={isSubmitting}>
//                 <Text style={styles.txtBtnFooterApproval}>
//                   {languageKey('_add')}
//                 </Text>
//               </Button>
//             </View>
//           </View>
//         </Modal>
//       )}

//       <View style={styles.card}>
//         <FlatList
//           data={listGoods}
//           renderItem={_renderItemGood}
//           keyExtractor={_keyExtractorGood}
//         />
//       </View>

//       {showModalPrice && (
//         <Modal
//           isVisible={showModalPrice}
//           useNativeDriver={true}
//           onBackdropPress={handleHiddenModalPrice}
//           onBackButtonPress={handleHiddenModalPrice}
//           backdropTransitionOutTiming={450}
//           avoidKeyboard={true}
//           style={styles.modal}>
//           <View style={styles.optionsModalDetail}>
//             <View style={styles.headerModal}>
//               <Text style={styles.titleModal}>
//                 {languageKey('_price_details')}
//               </Text>
//             </View>
//             <ScrollView
//               style={styles.modalContainerDetail}
//               showsVerticalScrollIndicator={false}>
//               <Text style={styles.header}>
//                 {languageKey('_information_general')}
//               </Text>
//               {itemDetail?.ItemName ? (
//                 <View style={styles.contentDetail}>
//                   <Text style={styles.txtHeaderBody}>
//                     {languageKey('_product_name')}
//                   </Text>
//                   <Text style={styles.valueDetail}>{itemDetail?.ItemName}</Text>
//                 </View>
//               ) : null}
//               <View style={styles.contentInfoModal}>
//                 {itemDetail?.UnitSaleName ? (
//                   <View style={styles.containerBodyDetail}>
//                     <Text style={styles.txtHeaderBody}>
//                       {languageKey('_unit')}
//                     </Text>
//                     <Text style={styles.valueDetail}>
//                       {itemDetail?.UnitSaleName}
//                     </Text>
//                   </View>
//                 ) : null}
//                 {itemDetail?.VAT ? (
//                   <View style={styles.containerBodyDetail}>
//                     <Text style={styles.txtHeaderBody}>
//                       {languageKey('_tax_rate')}
//                     </Text>
//                     <Text style={styles.valueDetail}>{itemDetail?.VAT}</Text>
//                   </View>
//                 ) : null}
//                 {itemDetail?.Price ? (
//                   <View style={styles.containerBodyDetail}>
//                     <Text style={styles.txtHeaderBody}>
//                       {languageKey('_unit_price')}
//                     </Text>
//                     <Text style={styles.valueDetail}>
//                       {Number(itemDetail?.Price)?.toLocaleString('en')}
//                     </Text>
//                   </View>
//                 ) : null}
//               </View>

//               <View style={styles.containerUpdatePrice}>
//                 <Text style={styles.txtHeaderUpdate}>
//                   {languageKey('_pricing_details')}
//                 </Text>
//                 <Button
//                   style={styles.btnUpdate}
//                   onPress={async () => {
//                     try {
//                       const body = {
//                         SalesChannelID: salesChannel,
//                         CustPricingProcedure: custPricingProcedure,
//                         Customers: customers,
//                         GoodsTypes: goodTypes,
//                         PriceGroupID: priceGroup,
//                         IsGeneralPrice: isGeneralPrice ? 1 : 0,
//                         ApplyPromotion: applyPromotion ? 1 : 0,
//                         CurrencyTypeID: currencyTypeID,
//                         Details: [itemDetail] || [],
//                       };
//                       setIsSubmitting(true);
//                       const {data} = await ApiQuotation_GetItems(body);
//                       if (
//                         data &&
//                         data.ErrorCode === '0' &&
//                         data.StatusCode === 200 &&
//                         Array.isArray(data.Result)
//                       ) {
//                         setItemDetail(data.Result[0]);
//                       } else {
//                         Alert.alert('Lỗi', 'Không lấy được chi tiết');
//                       }
//                     } catch (e) {
//                       console.log(e);
//                       Alert.alert('Lỗi', 'Gọi API thất bại');
//                     } finally {
//                       setIsSubmitting(false);
//                     }
//                   }}>
//                   <Text style={styles.txtBtnUpdate}>
//                     {languageKey('_update_price')}
//                   </Text>
//                 </Button>
//               </View>

//               <View style={styles.containerTableFile}>
//                 <View style={styles.tableWrapper}>
//                   <View style={styles.row}>
//                     <View style={styles.cell_20}>
//                       <Text style={styles.txtHeaderTable}>Code</Text>
//                     </View>
//                     <View style={styles.cell_40}>
//                       <Text style={styles.txtHeaderTable}>
//                         {languageKey('_evaluation_criteria')}
//                       </Text>
//                     </View>
//                     <View style={styles.cell_25}>
//                       <Text style={styles.txtHeaderTable}>
//                         {languageKey('_amount')}
//                       </Text>
//                     </View>
//                     <View style={styles.cell_15}>
//                       <Text style={styles.txtHeaderTable}>
//                         {languageKey('_condition')}
//                       </Text>
//                     </View>
//                   </View>

//                   {dataTable?.map((d, idx) => (
//                     <View
//                       key={idx}
//                       style={[
//                         styles.cellResponse,
//                         idx === dataTable.length - 1 && styles.lastCell,
//                       ]}>
//                       <View style={styles.cell_20}>
//                         <Text style={styles.contentTime}>{d.SAPID}</Text>
//                       </View>
//                       <View style={styles.cell_40}>
//                         <Text
//                           numberOfLines={2}
//                           style={[
//                             styles.contentTime,
//                             {
//                               color:
//                                 d?.SAPID !== '' ? colors.black : colors.blue,
//                             },
//                           ]}>
//                           {d.Name}
//                         </Text>
//                       </View>
//                       <View style={styles.cell_25}>
//                         <Text
//                           style={[
//                             styles.contentTime,
//                             {
//                               color:
//                                 d?.SAPID !== '' ? colors.black : colors.blue,
//                             },
//                           ]}>
//                           {d.Amount}
//                         </Text>
//                       </View>
//                       <View style={styles.cell_15}>
//                         <Text
//                           style={[
//                             styles.contentTime,
//                             {
//                               color:
//                                 d?.SAPID !== '' ? colors.black : colors.blue,
//                             },
//                           ]}>
//                           {d.Condition}
//                         </Text>
//                       </View>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//             </ScrollView>

//             <View style={styles.footer}>
//               <Button
//                 style={styles.btnFooterCancel}
//                 onPress={handleHiddenModalPrice}>
//                 <Text style={styles.txtBtnFooterCancel}>
//                   {languageKey('_cancel')}
//                 </Text>
//               </Button>
//               <Button
//                 style={styles.btnFooterApproval}
//                 onPress={handleHiddenModalPrice}>
//                 <Text style={styles.txtBtnFooterApproval}>
//                   {languageKey('_confirm')}
//                 </Text>
//               </Button>
//             </View>
//           </View>
//         </Modal>
//       )}

//       <LoadingModal visible={isSubmitting} />
//     </View>
//   );
// };
const ModalProductQuote = ({
  setValue,
  parentID,
  showModal,
  closeModal,
  salesChannel,
  custPricingProcedure,
  customers,
  goodTypes,
  priceGroup,
  isGeneralPrice,
  applyPromotion,
  currencyTypeID,
  dataEdit = [],
  CmpnID = null,
}) => {
  const languageKey = useSelector(translateLang);
  const {listItems} = useSelector(state => state.ProductQuote);
  const [listGoods, setListGoods] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModalPrice, setShowModalPrice] = useState(false);
  const [itemDetail, setItemDetail] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // local typing buffer to keep UI stable while typing
  const [typingMap, setTypingMap] = useState({});

  // Formik: store per-item quantities in values.quantities[itemId]
  const {values, setFieldValue} = useFormik({
    initialValues: {quantities: {}},
    onSubmit: () => {},
  });

  useEffect(() => {
    // populate from dataEdit if provided
    console.log('dataEdit', dataEdit);
    if (dataEdit && dataEdit.length > 0) {
      const convertedData = dataEdit.map(item => ({
        OID: item?.OID || '',
        ID: item?.ID || 0,
        ItemName: item?.ItemName,
        ItemID: item?.ItemID,
        VAT: item?.VAT,
        From: item?.From || 1,
        To: item?.To || 9999999,
        Price: item?.Price,
        Details: item?.Details,
        PricePolicyID: item?.PricePolicyID,
        GoodsTypeID: item?.GoodsTypeID || 0,
        GoodsTypeName: item?.GoodsTypeName || '',
        UnitSaleName: item?.UnitSaleName || '',
        PriceNotVAT: item?.PriceNotVAT,
        Quantity: item?.Quantity ?? 1,
        Extention1: '',
        Note: '',
        TotalAmount: Number(item?.Price) * Number(item?.Quantity),
        VATAmount: Math.round(
          item?.Price * item?.Quantity - item?.PriceNotVAT * item?.Quantity,
        ),
        ItemAmount: Number(item?.Price),
      }));
      setValue(convertedData);
      setListGoods(convertedData);

      // initialize quantities in formik
      const q = {};
      const tm = {};
      convertedData.forEach(it => {
        q[it.ItemID] = Number(it.Quantity ?? 1);
        tm[it.ItemID] = String(it.Quantity ?? 1);
      });
      setFieldValue('quantities', q);
      setTypingMap(tm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataEdit, setValue]);

  useEffect(() => {
    if (!listItems || listItems.length === 0) return;

    // cập nhật thông tin cho những mục trong listGoods nếu listItems thay đổi
    setListGoods(prevGoods =>
      prevGoods.map(good => {
        const updatedItem = listItems.find(item => item.ItemID === good.ItemID);
        return updatedItem
          ? {
              ...good,
              ItemName: updatedItem.ItemName ?? good.ItemName,
              VAT: updatedItem.VAT ?? good.VAT,
              From: updatedItem.From ?? good.From ?? 1,
              To: updatedItem.To ?? good.To ?? 9999999,
              Price: updatedItem.Price ?? good.Price,
              Details: updatedItem.Details ?? good.Details,
              PricePolicyID: updatedItem.PricePolicyID ?? good.PricePolicyID,
              PriceNotVAT: updatedItem?.PriceNotVAT ?? good.PriceNotVAT,
              CmpnID: updatedItem?.CmpnID || good.CmpnID || '5',
            }
          : good;
      }),
    );
  }, [listItems]);

  const handleShowModalPrice = item => {
    setItemDetail(item);
    setShowModalPrice(true);
  };
  const handleHiddenModalPrice = () => setShowModalPrice(false);

  // --- Selection handlers ---
  const toggleSelectItem = item => {
    const exists = selectedItems.find(i => i.ItemID === item.ItemID);
    if (exists) {
      setSelectedItems(prev => prev.filter(i => i.ItemID !== item.ItemID));
    } else {
      if (values.quantities?.[item.ItemID] == null) {
        setFieldValue(`quantities.${item.ItemID}`, 1);
        setTypingMap(prev => ({...prev, [item.ItemID]: '1'}));
      }
      setSelectedItems(prev => [...prev, item]);
    }
  };

  const selectAllItems = () => {
    if (!listItems) return;
    if (selectedItems.length === listItems.length) {
      setSelectedItems([]);
    } else {
      const q = {...(values.quantities || {})};
      const tm = {...(typingMap || {})};
      listItems.forEach(it => {
        if (q[it.ItemID] == null) q[it.ItemID] = 1;
        if (tm[it.ItemID] == null) tm[it.ItemID] = '1';
      });
      setFieldValue('quantities', q);
      setTypingMap(tm);
      setSelectedItems(listItems);
    }
  };

  const handleDelete = itemToDelete => {
    setListGoods(prevGoods =>
      prevGoods.filter(item => item.ItemID !== itemToDelete.ItemID),
    );
    setValue(prevGoods =>
      Array.isArray(prevGoods)
        ? prevGoods.filter(item => item.ItemID !== itemToDelete.ItemID)
        : [],
    );
    // remove quantity and typing
    const q = {...(values.quantities || {})};
    delete q[itemToDelete.ItemID];
    setFieldValue('quantities', q);
    setTypingMap(prev => {
      const n = {...prev};
      delete n[itemToDelete.ItemID];
      return n;
    });
  };

  // --------------------------
  // Quantity typing & commit
  // --------------------------
  const handleQuantityTyping = (itemID, text) => {
    // keep user's raw text in typingMap for smooth UI
    setTypingMap(prev => ({...prev, [itemID]: String(text)}));
    // keep raw text in formik too (so values reflect typing)
    setFieldValue(`quantities.${itemID}`, String(text));
  };

  const commitQuantity = itemID => {
    // prefer raw from formik (may be string), fallback typingMap
    const rawFromFormik = values?.quantities?.[itemID];
    const raw = (rawFromFormik ?? typingMap[itemID] ?? '').toString();

    // remove non-digit chars (if you want decimals, adjust)
    const digitsOnly = raw.replace(/\D/g, '');
    const parsed = parseInt(digitsOnly || '0', 10);
    const qtyNum = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;

    // set number into formik
    setFieldValue(`quantities.${itemID}`, qtyNum);

    // update listGoods and parent values
    setListGoods(prev =>
      prev.map(it => (it.ItemID === itemID ? {...it, Quantity: qtyNum} : it)),
    );
    setValue(prev =>
      (prev || []).map(it =>
        it.ItemID === itemID ? {...it, Quantity: qtyNum} : it,
      ),
    );

    // remove typing entry
    setTypingMap(prev => {
      const n = {...prev};
      delete n[itemID];
      return n;
    });
  };

  // Build detailsPayload using values.quantities[itemId]
  const buildDetailsPayloadFromSelected = selectedItems => {
    const qmap = values.quantities || {};
    return selectedItems.map(item => {
      const rawQty = qmap[item.ItemID];
      const parsedQty =
        typeof rawQty === 'number'
          ? rawQty
          : parseInt(String(rawQty ?? '').replace(/\D/g, ''), 10);
      const Quantity = Number.isFinite(parsedQty)
        ? parsedQty
        : Number(item.Quantity ?? 1);

      const priceNum = Number(item.Price || 0);
      const vatNum = Number(item.VAT || 0);
      const priceNotVAT = Math.round((priceNum * 100) / (100 + (vatNum || 0)));

      return {
        ID: item?.ID ?? 0,
        PriceGoupID: Number(priceGroup) || item?.PriceGoupID || 0,
        GoodsTypeID: item?.GoodsTypeID || 0,
        GoodsTypeName: item?.GoodsTypeName || '',
        ModelID: item?.ModelID ?? 0,
        ModelName: item?.ModelName ?? '',
        ItemID: item?.ItemID,
        ItemName: item?.ItemName || '',
        SKU: item?.SKU || '',
        UnitName: item?.UnitSaleName || item?.UnitName || 'KG',
        From: item?.From ?? 1,
        To: item?.To ?? 9999999,
        VAT: String(item?.VAT ?? 0),
        VATName: item?.VAT ? `${item.VAT}%` : '',
        Price: priceNum,
        PricePolicyID: item?.PricePolicyID || '',
        OID: parentID || '',
        Quantity: Quantity,
        Details: item?.Details
          ? typeof item.Details !== 'string'
            ? JSON.stringify(item.Details)
            : item.Details
          : '[]',
        Extention1: item?.Extention1 || '',
        Extention2: item?.Extention2 || '',
        Extention3: item?.Extention3 || '',
        Extention4: item?.Extention4 || '',
        Extention5: item?.Extention5 || '',
        Extention6: item?.Extention6 || '',
        Extention7: item?.Extention7 || '',
        Extention8: item?.Extention8 || '',
        Extention9: item?.Extention9 || '',
        Note: ' ',
        PriceNotVAT: priceNotVAT,
        TotalAmount: priceNum * Quantity,
        ItemAmount: priceNotVAT * Quantity,
        VATAmount: Math.round(priceNum * Quantity - priceNotVAT * Quantity),
      };
    });
  };

  // --- Add selected items ---
  const handleAddSelectedItems = async () => {
    if (!selectedItems.length) return;

    // commit any typing entries for selected items
    selectedItems.forEach(s => {
      if (typingMap[s.ItemID] != null) commitQuantity(s.ItemID);
    });

    const detailsPayload = buildDetailsPayloadFromSelected(selectedItems);

    const body = {
      CmpnID: CmpnID !== null ? CmpnID?.toString() : '5',
      FactorID: 'QuotationDomestic',
      EntryID: 'DomesticGeneral',
      SalesChannelID: Number(salesChannel) || 0,
      Customers: String(customers || ''),
      GoodsTypes: String(goodTypes) || '',
      PriceGroupID: Number(priceGroup) || 0,
      IsGeneralPrice: Number(isGeneralPrice ? 1 : 0),
      ApplyPromotion: Number(applyPromotion ? 1 : 0),
      CurrencyTypeID: Number(currencyTypeID) || 0,
      Details: detailsPayload,
    };

    setIsSubmitting(true);
    try {
      const {data} = await ApiQuotation_EditPrice(body);
      if (data && data.ErrorCode === '0' && data.StatusCode === 200) {
        const returned = Array.isArray(data.Result) ? data.Result : [];
        const returnedByItemId = {};
        returned.forEach(r => {
          if (r.ItemID != null) returnedByItemId[Number(r.ItemID)] = r;
        });

        const newProducts = selectedItems.map(item => {
          const ret = returnedByItemId[Number(item.ItemID)];
          const rawQty = values.quantities?.[item.ItemID];
          const parsedQty =
            typeof rawQty === 'number'
              ? rawQty
              : parseInt(String(rawQty ?? '').replace(/\D/g, ''), 10);
          const qty = Number.isFinite(parsedQty)
            ? parsedQty
            : Number(item.Quantity ?? 1);

          if (ret) {
            return {
              OID: ret.OID ?? parentID ?? '',
              ID: ret.ID ?? 0,
              ItemName: ret.ItemName ?? item.ItemName,
              ItemID: ret.ItemID ?? item.ItemID,
              VAT: ret.VAT ?? item.VAT,
              From: ret.From ?? item.From ?? 1,
              To: ret.To ?? item.To ?? 9999999,
              Price: ret.Price ?? item.Price,
              Details: ret.Details ?? (item.Details ? item.Details : '[]'),
              PricePolicyID: ret.PricePolicyID ?? item.PricePolicyID,
              GoodsTypeID: ret.GoodsTypeID ?? item.GoodsTypeID,
              GoodsTypeName: ret.GoodsTypeName ?? item.GoodsTypeName,
              UnitSaleName: ret.UnitSaleName ?? item.UnitSaleName,
              PriceNotVAT: ret.PriceNotVAT ?? item.PriceNotVAT,
              Quantity: qty,
              TotalAmount:
                ret.TotalAmount ??
                (ret.Price ? ret.Price * qty : item.Price * qty),
              ItemAmount: ret.ItemAmount ?? item.ItemAmount ?? item.Price * qty,
              VATAmount:
                ret.VATAmount ??
                item.VATAmount ??
                Math.round(
                  (ret.Price ?? item.Price) * qty -
                    (ret.PriceNotVAT ?? item.PriceNotVAT) * qty,
                ),
              IsDeleted: ret.IsDeleted ?? 0,
              Note: ' ',
            };
          } else {
            return {
              OID: parentID || '',
              ID: item?.ID || 0,
              ItemName: item?.ItemName,
              ItemID: item?.ItemID,
              VAT: item?.VAT,
              From: item?.From || 1,
              To: item?.To || 9999999,
              Price: item?.Price,
              Details: item?.Details ?? '[]',
              PricePolicyID: item?.PricePolicyID,
              GoodsTypeID: item?.GoodsTypeID || 0,
              GoodsTypeName: item?.GoodsTypeName || '',
              UnitSaleName: item?.UnitSaleName || '',
              PriceNotVAT: item?.PriceNotVAT,
              Quantity: qty,
              TotalAmount: item?.Price * qty,
              ItemAmount: item?.PriceNotVAT
                ? item.PriceNotVAT * qty
                : item?.ItemAmount,
              VATAmount:
                item?.VATAmount ??
                Math.round(
                  item?.Price * qty -
                    (item?.PriceNotVAT ? item.PriceNotVAT * qty : 0),
                ),
              IsDeleted: item?.IsDeleted ?? 0,
              Note: ' ',
            };
          }
        });

        // merge into listGoods
        setListGoods(prev => {
          const ids = new Set(prev.map(p => p.ItemID));
          const merged = [...prev];
          newProducts.forEach(p => {
            if (!ids.has(p.ItemID)) merged.push(p);
            else {
              const idx = merged.findIndex(x => x.ItemID === p.ItemID);
              if (idx >= 0) merged[idx] = p;
            }
          });
          return merged;
        });

        // update parent values
        setValue(prev => {
          const prevArr = Array.isArray(prev) ? prev.slice() : [];
          const idsPrev = new Set(prevArr.map(p => p.ItemID));
          newProducts.forEach(p => {
            if (!idsPrev.has(p.ItemID)) prevArr.push(p);
            else {
              const idx = prevArr.findIndex(x => x.ItemID === p.ItemID);
              if (idx >= 0) prevArr[idx] = p;
            }
          });
          return prevArr;
        });

        setSelectedItems([]);
        closeModal();
      } else {
        Alert.alert('Lỗi', 'Cập nhật giá thất bại. Thêm tạm cục bộ.');
        const newProducts = selectedItems.map(item => {
          const rawQty = values.quantities?.[item.ItemID];
          const parsedQty =
            typeof rawQty === 'number'
              ? rawQty
              : parseInt(String(rawQty ?? '').replace(/\D/g, ''), 10);
          const qty = Number.isFinite(parsedQty)
            ? parsedQty
            : Number(item.Quantity ?? 1);
          return {
            OID: parentID || '',
            ID: 0,
            ItemName: item?.ItemName,
            ItemID: item?.ItemID,
            VAT: item?.VAT,
            From: item?.From || 1,
            To: item?.To || 9999999,
            Price: item?.Price,
            Details: item?.Details ?? '[]',
            PricePolicyID: item?.PricePolicyID,
            GoodsTypeID: item?.GoodsTypeID || 0,
            GoodsTypeName: item?.GoodsTypeName || '',
            UnitSaleName: item?.UnitSaleName || '',
            PriceNotVAT: item?.PriceNotVAT,
            Quantity: qty,
            TotalAmount: item?.Price * qty,
            ItemAmount: item?.PriceNotVAT
              ? item.PriceNotVAT * qty
              : item?.ItemAmount,
            VATAmount:
              item?.VATAmount ??
              Math.round(
                item?.Price * qty -
                  (item?.PriceNotVAT ? item.PriceNotVAT * qty : 0),
              ),
            IsDeleted: 0,
            Note: ' ',
          };
        });
        setListGoods(prev => [...prev, ...newProducts]);
        setValue(prev => [...(prev || []), ...newProducts]);
        setSelectedItems([]);
        closeModal();
      }
    } catch (error) {
      console.log('ApiQuotation_EditPrice error', error);
      Alert.alert('Lỗi', 'Gọi API thất bại. Thêm tạm cục bộ.');
      const newProducts = selectedItems.map(item => {
        const rawQty = values.quantities?.[item.ItemID];
        const parsedQty =
          typeof rawQty === 'number'
            ? rawQty
            : parseInt(String(rawQty ?? '').replace(/\D/g, ''), 10);
        const qty = Number.isFinite(parsedQty)
          ? parsedQty
          : Number(item.Quantity ?? 1);
        return {
          OID: parentID || '',
          ID: 0,
          ItemName: item?.ItemName,
          ItemID: item?.ItemID,
          VAT: item?.VAT,
          From: item?.From || 1,
          To: item?.To || 9999999,
          Price: item?.Price,
          Details: item?.Details ?? '[]',
          PricePolicyID: item?.PricePolicyID,
          GoodsTypeID: item?.GoodsTypeID || 0,
          GoodsTypeName: item?.GoodsTypeName || '',
          UnitSaleName: item?.UnitSaleName || '',
          PriceNotVAT: item?.PriceNotVAT,
          Quantity: qty,
          TotalAmount: item?.Price * qty,
          ItemAmount: item?.ItemAmount,
          VATAmount: item?.VATAmount,
          IsDeleted: 0,
          Note: ' ',
        };
      });
      setListGoods(prev => [...prev, ...newProducts]);
      setValue(prev => [...(prev || []), ...newProducts]);
      setSelectedItems([]);
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const _keyExtractor = (item, index) =>
    `${item.ItemID || item.ID || index}-${index}`;

  // --- Render item list (selectable) with TextInput ---
  const _renderItem = ({item}) => {
    const isSelected = !!selectedItems.find(i => i.ItemID === item.ItemID);
    const alreadyAdded = !!listGoods.find(i => i.ItemID === item.ItemID);

    const displayValue =
      typingMap[item.ItemID] != null
        ? typingMap[item.ItemID]
        : values.quantities?.[item.ItemID] != null
        ? String(values.quantities[item.ItemID])
        : '';

    return (
      <View>
        <View style={styles.cardProgram}>
          <View style={styles.itemBody_two}>
            <View style={styles.containerItem}>
              <View style={styles.containerHeader}>
                <Text style={styles.txtTitleItem}>{item?.ItemName}</Text>
                <Button
                  onPress={() => toggleSelectItem(item)}
                  disabled={alreadyAdded}
                  style={{opacity: alreadyAdded ? 0.4 : 1}}>
                  <SvgXml xml={isSelected ? checkbox_active_20 : checkbox_20} />
                </Button>
              </View>
              <Text style={styles.txtProposal}>{item?.GoodsTypeName}</Text>
            </View>
          </View>

          <View style={styles.bodyCard}>
            <View style={styles.content}>
              {item?.VAT ? (
                <View style={styles.containerBodyText}>
                  <Text style={styles.txtHeaderBody}>
                    {languageKey('_tax_rate')}
                  </Text>
                  <Text style={styles.contentBody}>{String(item?.VAT)}</Text>
                </View>
              ) : null}
              {item?.UnitSaleName ? (
                <View style={styles.containerBodyText}>
                  <Text style={styles.txtHeaderBody}>
                    {languageKey('_unit')}
                  </Text>
                  <Text style={styles.contentBody}>{item?.UnitSaleName}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.content}>
              <View style={styles.containerBodyText}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_quantity_from')}
                </Text>
                <Text style={styles.contentBody}>
                  {item?.From?.toLocaleString('en')}
                </Text>
              </View>
              <View style={styles.containerBodyText}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_quantity_to')}
                </Text>
                <Text style={styles.contentBody}>
                  {Number(item?.To)?.toLocaleString('en')}
                </Text>
              </View>
            </View>

            {item?.Price ? (
              <View style={styles.containerBodyText}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_unit_price')}
                </Text>
                <Text style={styles.contentBody}>
                  {Number(item?.Price)?.toLocaleString('en')}
                </Text>
              </View>
            ) : null}

            <View style={{marginTop: scale(4)}}>
              <View style={{marginTop: scale(4)}}></View>
              <View style={styles.containerBodyText}>
                <Text style={styles.txtHeaderBody}>Nhập số lượng báo giá</Text>
              </View>
              <TextInput
                testID={`Quantity_${item.ItemID}`}
                style={[
                  styles.textInput || {},
                  {
                    padding: scale(8),
                    backgroundColor: '#fff',
                    marginHorizontal: scale(4),
                    borderBottomWidth: 1,
                    borderBottomColor: colors.gray300,
                  },
                ]}
                value={displayValue}
                keyboardType="numeric"
                onChangeText={text => handleQuantityTyping(item.ItemID, text)}
                onBlur={() => commitQuantity(item.ItemID)}
                placeholder={languageKey('_quantity')}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const _keyExtractorGood = (item, index) =>
    `${item.ItemID || item.ID || index}-${index}`;

  const _renderItemGood = ({item}) => {
    const displayValue =
      typingMap[item.ItemID] != null
        ? typingMap[item.ItemID]
        : values.quantities?.[item.ItemID] != null
        ? String(values.quantities[item.ItemID])
        : item.Quantity != null
        ? String(item.Quantity)
        : '';

    return (
      <View>
        <View style={styles.cardProgram}>
          <View style={styles.itemBody_two}>
            <View style={styles.containerItem}>
              <View style={styles.containerHeader}>
                <Text style={styles.txtTitleItem}>{item?.ItemName}</Text>
                <Button onPress={() => handleDelete(item)}>
                  <SvgXml xml={trash_22} />
                </Button>
              </View>
              <Text style={styles.txtProposal}>{item?.GoodsTypeName}</Text>
            </View>
          </View>

          <View style={styles.bodyCard}>
            <View style={styles.content}>
              {item?.VAT ? (
                <View style={styles.containerBodyText}>
                  <Text style={styles.txtHeaderBody}>
                    {languageKey('_tax_rate')}
                  </Text>
                  <Text style={styles.contentBody}>{String(item?.VAT)}</Text>
                </View>
              ) : null}
              {item?.UnitSaleName ? (
                <View style={styles.containerBodyText}>
                  <Text style={styles.txtHeaderBody}>
                    {languageKey('_unit')}
                  </Text>
                  <Text style={styles.contentBody}>{item?.UnitSaleName}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.content}>
              <View style={styles.containerBodyText}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_quantity')}
                </Text>
                <Text style={styles.contentBody}>
                  {item?.From?.toLocaleString('en')}{' '}
                </Text>
              </View>

              <View style={styles.containerBodyText}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_quantity_to')}
                </Text>
                <Text style={styles.contentBody}>
                  {Number(item?.To)?.toLocaleString('en')}
                </Text>
              </View>
            </View>

            {item?.Price ? (
              <View style={styles.containerBodyText}>
                <Text style={styles.txtHeaderBody}>
                  {languageKey('_unit_price')}
                </Text>
                <Text style={styles.contentBody}>
                  {Number(item?.Price)?.toLocaleString('en')}
                </Text>
              </View>
            ) : null}
            <View style={{marginTop: scale(8)}}></View>
            <View style={styles.containerBodyText}>
              <Text style={styles.txtHeaderBody}>Nhập số lượng báo giá</Text>
            </View>
            <TextInput
              testID={`Quantity_added_${item.ItemID}`}
              style={[
                styles.textInput || {},
                {
                  padding: scale(8),
                  backgroundColor: '#fff',
                  marginHorizontal: scale(4),
                  borderBottomWidth: 1,
                  borderBottomColor: colors.gray300,
                },
              ]}
              value={displayValue}
              keyboardType="numeric"
              onChangeText={text => handleQuantityTyping(item.ItemID, text)}
              onBlur={() => commitQuantity(item.ItemID)}
              placeholder={languageKey('_quantity')}
            />

            <Button
              style={styles.btnDetail}
              onPress={() => handleShowModalPrice(item)}>
              <Text style={styles.txtBtnDetail}>
                {languageKey('_price_details')}
              </Text>
            </Button>
          </View>
        </View>
      </View>
    );
  };

  const dataTable =
    itemDetail?.Details && typeof itemDetail.Details === 'string'
      ? (() => {
          try {
            return JSON.parse(itemDetail.Details);
          } catch (e) {
            return [];
          }
        })()
      : itemDetail?.Details || [];

  return (
    <View>
      {showModal && (
        <Modal
          isVisible={showModal}
          useNativeDriver={true}
          onBackdropPress={closeModal}
          onBackButtonPress={closeModal}
          backdropTransitionOutTiming={450}
          avoidKeyboard={true}
          style={styles.modal}>
          <View style={styles.optionsModalContainer}>
            <View style={styles.headerModal}>
              <View style={styles.btnClose}>
                <SvgXml xml={close_white} />
              </View>
              <Text style={styles.titleModal}>
                {languageKey('_add_products')}
              </Text>
              <Button onPress={closeModal} style={styles.btnClose}>
                <SvgXml xml={close_red} />
              </Button>
            </View>

            <ScrollView
              style={styles.modalContainer}
              showsVerticalScrollIndicator={false}>
              <FlatList
                data={listItems}
                renderItem={_renderItem}
                keyExtractor={_keyExtractor}
              />
            </ScrollView>

            <View style={styles.footer}>
              <Button style={styles.btnFooterCancel} onPress={selectAllItems}>
                <Text style={styles.txtBtnFooterCancel}>
                  {languageKey('_select_all')}
                </Text>
              </Button>
              <Button
                style={styles.btnFooterApproval}
                onPress={handleAddSelectedItems}
                disabled={isSubmitting}>
                <Text style={styles.txtBtnFooterApproval}>
                  {languageKey('_add')}
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      )}

      <View style={styles.card}>
        <FlatList
          data={listGoods}
          renderItem={_renderItemGood}
          keyExtractor={_keyExtractorGood}
        />
      </View>

      {showModalPrice && (
        <Modal
          isVisible={showModalPrice}
          useNativeDriver={true}
          onBackdropPress={handleHiddenModalPrice}
          onBackButtonPress={handleHiddenModalPrice}
          backdropTransitionOutTiming={450}
          avoidKeyboard={true}
          style={styles.modal}>
          <View style={styles.optionsModalDetail}>
            <View style={styles.headerModal}>
              <Text style={styles.titleModal}>
                {languageKey('_price_details')}
              </Text>
            </View>
            <ScrollView
              style={styles.modalContainerDetail}
              showsVerticalScrollIndicator={false}>
              <Text style={styles.header}>
                {languageKey('_information_general')}
              </Text>
              {itemDetail?.ItemName ? (
                <View style={styles.contentDetail}>
                  <Text style={styles.txtHeaderBody}>
                    {languageKey('_product_name')}
                  </Text>
                  <Text style={styles.valueDetail}>{itemDetail?.ItemName}</Text>
                </View>
              ) : null}
              <View style={styles.contentInfoModal}>
                {itemDetail?.UnitSaleName ? (
                  <View style={styles.containerBodyDetail}>
                    <Text style={styles.txtHeaderBody}>
                      {languageKey('_unit')}
                    </Text>
                    <Text style={styles.valueDetail}>
                      {itemDetail?.UnitSaleName}
                    </Text>
                  </View>
                ) : null}
                {itemDetail?.VAT ? (
                  <View style={styles.containerBodyDetail}>
                    <Text style={styles.txtHeaderBody}>
                      {languageKey('_tax_rate')}
                    </Text>
                    <Text style={styles.valueDetail}>{itemDetail?.VAT}</Text>
                  </View>
                ) : null}
                {itemDetail?.Price ? (
                  <View style={styles.containerBodyDetail}>
                    <Text style={styles.txtHeaderBody}>
                      {languageKey('_unit_price')}
                    </Text>
                    <Text style={styles.valueDetail}>
                      {Number(itemDetail?.Price)?.toLocaleString('en')}
                    </Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.containerUpdatePrice}>
                <Text style={styles.txtHeaderUpdate}>
                  {languageKey('_pricing_details')}
                </Text>
                <Button
                  style={styles.btnUpdate}
                  onPress={async () => {
                    try {
                      const body = {
                        SalesChannelID: salesChannel,
                        CustPricingProcedure: custPricingProcedure,
                        Customers: customers,
                        GoodsTypes: goodTypes,
                        PriceGroupID: priceGroup,
                        IsGeneralPrice: isGeneralPrice ? 1 : 0,
                        ApplyPromotion: applyPromotion ? 1 : 0,
                        CurrencyTypeID: currencyTypeID,
                        Details: [itemDetail] || [],
                      };
                      setIsSubmitting(true);
                      const {data} = await ApiQuotation_GetItems(body);
                      if (
                        data &&
                        data.ErrorCode === '0' &&
                        data.StatusCode === 200 &&
                        Array.isArray(data.Result)
                      ) {
                        setItemDetail(data.Result[0]);
                      } else {
                        Alert.alert('Lỗi', 'Không lấy được chi tiết');
                      }
                    } catch (e) {
                      console.log(e);
                      Alert.alert('Lỗi', 'Gọi API thất bại');
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}>
                  <Text style={styles.txtBtnUpdate}>
                    {languageKey('_update_price')}
                  </Text>
                </Button>
              </View>

              <View style={styles.containerTableFile}>
                <View style={styles.tableWrapper}>
                  <View style={styles.row}>
                    <View style={styles.cell_20}>
                      <Text style={styles.txtHeaderTable}>Code</Text>
                    </View>
                    <View style={styles.cell_40}>
                      <Text style={styles.txtHeaderTable}>
                        {languageKey('_evaluation_criteria')}
                      </Text>
                    </View>
                    <View style={styles.cell_25}>
                      <Text style={styles.txtHeaderTable}>
                        {languageKey('_amount')}
                      </Text>
                    </View>
                    <View style={styles.cell_15}>
                      <Text style={styles.txtHeaderTable}>
                        {languageKey('_condition')}
                      </Text>
                    </View>
                  </View>

                  {dataTable?.map((d, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.cellResponse,
                        idx === dataTable.length - 1 && styles.lastCell,
                      ]}>
                      <View style={styles.cell_20}>
                        <Text style={styles.contentTime}>{d.SAPID}</Text>
                      </View>
                      <View style={styles.cell_40}>
                        <Text
                          numberOfLines={2}
                          style={[
                            styles.contentTime,
                            {
                              color:
                                d?.SAPID !== '' ? colors.black : colors.blue,
                            },
                          ]}>
                          {d.Name}
                        </Text>
                      </View>
                      <View style={styles.cell_25}>
                        <Text
                          style={[
                            styles.contentTime,
                            {
                              color:
                                d?.SAPID !== '' ? colors.black : colors.blue,
                            },
                          ]}>
                          {d.Amount}
                        </Text>
                      </View>
                      <View style={styles.cell_15}>
                        <Text
                          style={[
                            styles.contentTime,
                            {
                              color:
                                d?.SAPID !== '' ? colors.black : colors.blue,
                            },
                          ]}>
                          {d.Condition}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Button
                style={styles.btnFooterCancel}
                onPress={handleHiddenModalPrice}>
                <Text style={styles.txtBtnFooterCancel}>
                  {languageKey('_cancel')}
                </Text>
              </Button>
              <Button
                style={styles.btnFooterApproval}
                onPress={handleHiddenModalPrice}>
                <Text style={styles.txtBtnFooterApproval}>
                  {languageKey('_confirm')}
                </Text>
              </Button>
            </View>
          </View>
        </Modal>
      )}

      <LoadingModal visible={isSubmitting} />
    </View>
  );
};

const styles = StyleSheet.create({
  txtBtnAdd: {
    color: colors.blue,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    fontSize: fontSize.size14,
  },
  card: {
    paddingBottom: scale(8),
    backgroundColor: colors.white,
  },
  label: {
    color: colors.black,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    fontSize: fontSize.size14,
    lineHeight: scale(22),
    marginHorizontal: scale(16),
    marginTop: scale(4),
  },
  btnAddContact: {
    borderWidth: scale(1),
    borderColor: colors.blue,
    borderRadius: scale(12),
    height: hScale(38),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scale(12),
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  optionsModalContainer: {
    height: height / 1.8,
  },
  modalContainer: {
    overflow: 'hidden',
    backgroundColor: colors.white,
    maxHeight: height / 1.8,
  },
  optionsModalDetail: {
    height: height / 1.2,
  },
  modalContainerDetail: {
    overflow: 'hidden',
    backgroundColor: colors.white,
    maxHeight: height / 1.2,
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: scale(1),
    borderBottomColor: colors.graySystem2,
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(12),
    borderTopRightRadius: scale(12),
    paddingVertical: scale(10),
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
    backgroundColor: colors.blue,
    borderRadius: scale(12),
    height: hScale(38),
    paddingVertical: scale(Platform.OS === 'android' ? 6 : 8),
    marginTop: scale(12),
    marginBottom: scale(12),
    marginHorizontal: scale(12),
  },
  txtBtnFooterModal: {
    color: colors.white,
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(22),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scale(12),
    marginTop: scale(12),
    backgroundColor: colors.white,
  },
  txtItem: {
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    fontSize: fontSize.size14,
    lineHeight: scale(22),
    color: colors.black,
  },
  txtDescription: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    fontSize: fontSize.size12,
    lineHeight: scale(18),
    color: '#6B6F80',
  },
  input: {
    marginHorizontal: scale(12),
    marginVertical: scale(4),
  },
  cardProgram: {
    backgroundColor: colors.white,
    marginHorizontal: scale(12),
    marginTop: scale(12),
    borderRadius: scale(8),
    borderWidth: scale(1),
    borderColor: colors.borderColor,
  },
  itemBody_two: {
    flexDirection: 'row',
    borderRadius: scale(12),
    padding: scale(8),
  },
  containerItem: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerStatus: {
    flexDirection: 'row',
  },
  txtTitleItem: {
    fontSize: fontSize.size16,
    fontWeight: '600',
    lineHeight: scale(24),
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
    overflow: 'hidden',
    width: '80%',
  },
  bodyStatus: {
    borderRadius: scale(4),
    paddingHorizontal: scale(6),
    paddingVertical: scale(2),
    marginRight: scale(8),
    width: 'auto',
  },
  txtStatus: {
    fontSize: fontSize.size12,
    fontWeight: '500',
    lineHeight: scale(18),
    fontFamily: 'Inter-Medium',
  },
  txtProposal: {
    fontSize: fontSize.size14,
    fontWeight: '400',
    lineHeight: scale(22),
    fontFamily: 'Inter-Regular',
    color: '#525252',
  },
  txtHeaderBody: {
    fontSize: fontSize.size14,
    fontWeight: '400',
    lineHeight: scale(22),
    fontFamily: 'Inter-Regular',
    color: '#525252',
    marginLeft: scale(4),
  },
  contentBody: {
    fontSize: fontSize.size14,
    fontWeight: '400',
    lineHeight: scale(22),
    fontFamily: 'Inter-Regular',
    color: colors.black,
    marginLeft: scale(4),
    overflow: 'hidden',
    width: '90%',
  },
  containerBody: {
    flexDirection: 'row',
    marginHorizontal: scale(8),
    alignItems: 'center',
    marginBottom: scale(4),
  },
  inputAuto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: scale(4),
  },
  inputRead: {
    flex: 1,
    marginHorizontal: scale(12),
  },
  txtHeaderInputView: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    lineHeight: scale(22),
  },
  inputView: {
    borderRadius: scale(8),
    paddingLeft: scale(10),
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
    marginTop: scale(8),
    borderWidth: scale(1),
    borderColor: '#D1D3DB',
    backgroundColor: '#E5E7EB',
    paddingVertical: scale(7),
    color: colors.black,
  },
  footer: {
    backgroundColor: colors.white,
    borderTopColor: colors.borderColor,
    borderTopWidth: scale(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
  },
  btnFooterCancel: {
    flex: 1,
    borderWidth: scale(1),
    borderColor: colors.borderColor,
    height: hScale(38),
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(4),
  },
  txtBtnFooterCancel: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(22),
  },
  btnFooterApproval: {
    flex: 1,
    backgroundColor: colors.blue,
    height: hScale(38),
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: scale(4),
  },
  txtBtnFooterApproval: {
    color: colors.white,
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(22),
  },
  widthInput: {
    flex: 1,
    marginHorizontal: scale(12),
  },
  inputRead: {
    flex: 1,
    marginHorizontal: scale(12),
    marginBottom: scale(8),
  },
  txtHeaderInputView: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    lineHeight: scale(22),
  },
  inputView: {
    borderRadius: scale(8),
    paddingLeft: scale(10),
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
    marginTop: scale(8),
    borderWidth: scale(1),
    borderColor: '#D1D3DB',
    backgroundColor: '#E5E7EB',
    paddingVertical: scale(8),
    color: colors.black,
    overflow: 'hidden',
    height: hScale(42),
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
  inputNote: {
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
  bodyCard: {
    marginHorizontal: scale(8),
    marginBottom: scale(8),
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(4),
  },
  containerBodyText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnDetail: {
    borderWidth: scale(1),
    borderColor: colors.borderColor,
    borderRadius: scale(8),
    height: hScale(38),
    justifyContent: 'center',
    marginTop: scale(8),
  },
  txtBtnDetail: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(22),
    textAlign: 'center',
  },
  header: {
    fontSize: fontSize.size16,
    fontWeight: '600',
    lineHeight: scale(24),
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
    marginTop: scale(12),
    marginHorizontal: scale(12),
    marginBottom: scale(8),
  },
  contentInfoModal: {
    marginHorizontal: scale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(4),
  },
  contentDetail: {
    marginBottom: scale(8),
    marginHorizontal: scale(12),
  },
  valueDetail: {
    fontSize: fontSize.size14,
    fontWeight: '400',
    lineHeight: scale(22),
    fontFamily: 'Inter-Regular',
    color: colors.black,
    overflow: 'hidden',
    width: '90%',
    marginHorizontal: scale(4),
  },
  containerBodyDetail: {
    flex: 1,
  },
  containerTableFile: {
    marginBottom: scale(8),
    paddingHorizontal: scale(12),
  },
  cell_25: {
    width: '22%',
    justifyContent: 'center',
    padding: scale(8),
  },
  cell_15: {
    width: '18%',
    justifyContent: 'center',
    padding: scale(8),
  },
  cell_20: {
    width: '20%',
    justifyContent: 'center',
    padding: scale(8),
  },
  cell_40: {
    width: '40%',
    justifyContent: 'center',
    padding: scale(8),
  },
  txtHeaderTable: {
    color: '#6B7280',
    fontSize: fontSize.size12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(18),
  },
  cellResponse: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: scale(1),
    borderBottomColor: colors.borderColor,
  },
  btnDoc: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastCell: {
    borderBottomWidth: 0,
  },
  contentTime: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
    width: '80%',
    overflow: 'hidden',
  },
  tableWrapper: {
    borderWidth: scale(1),
    borderColor: colors.borderColor,
    borderRadius: scale(8),
    overflow: 'hidden',
    marginTop: scale(8),
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#F9F9FB',
    borderBottomWidth: scale(1),
    borderBottomColor: colors.borderColor,
  },
  containerUpdatePrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: scale(12),
    borderTopWidth: scale(1),
    borderTopColor: colors.borderColor,
    paddingTop: scale(8),
  },
  txtHeaderUpdate: {
    color: colors.black,
    fontSize: fontSize.size16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(24),
    marginBottom: scale(4),
  },
  btnUpdate: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: scale(6),
    borderWidth: scale(1),
    borderColor: colors.blue,
    width: 'auto',
    paddingHorizontal: scale(4),
  },
  txtBtnUpdate: {
    color: colors.blue,
    fontSize: fontSize.size12,
    fontWeight: '400',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(22),
    marginLeft: scale(4),
  },
});

export default ModalProductQuote;
