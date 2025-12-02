/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable prettier/prettier */
// import React, {useCallback, useEffect, useState} from 'react';
// import Modal from 'react-native-modal';
// import {SvgXml} from 'react-native-svg';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   Dimensions,
//   TouchableOpacity,
//   Text,
//   FlatList,
// } from 'react-native';

// import {Button} from '../buttons';
// import SearchBar from '../SearchBar';
// import {colors, fontSize} from 'themes';
// import {hScale, scale} from '@resolutions';
// import SearchModal from 'components/SearchModal';
// import {arrow_down, close_blue, close_white, radio, radio_active} from 'svgImg';

// const {height} = Dimensions.get('window');

// const CardModalSelect = ({
//   data = [],
//   title,
//   setValue,
//   value,
//   bgColor,
//   titleInventory,
//   require,
//   disabled,
//   multiple = false,
//   keyOID = false,
//   company = false,
// }) => {
//   const isDisabled = disabled ?? false;
//   const [searchText, setSearchText] = useState('');
//   const [ishowModal, setIsShowModal] = useState(false);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(null);
//   // console.log(
//   //   selectedItem
//   // )
//   const [searchResults, setSearchResults] = useState(
//     data?.length > 0 ? data : [],
//   );
//   // console.log('searchResults',searchResults)
//   const [isLongText, setIsLongText] = useState(false);
//   const openShowModal = () => {
//     setIsShowModal(true);
//   };

//   const closeModal = () => {
//     setIsShowModal(false);
//   };
//   // const handleSelection = item => {
//   //   if (multiple) {
//   //     const isSelected = selectedItems.some(i => i?.ID === item?.ID);
//   //     let updatedItems;
//   //     if (isSelected) {
//   //       updatedItems = selectedItems.filter(i => i?.ID !== item?.ID);
//   //     } else {
//   //       updatedItems = [...selectedItems, item];
//   //     }
//   //     setSelectedItems(updatedItems);
//   //   } else {
//   //     setValue(item);
//   //     setSelectedItem(item);
//   //     closeModal();
//   //   }
//   // };
//   const handleSelection = item => {
//     if (multiple) {
//       const isSelected = selectedItems.some(i => i?.ID === item?.ID);
//       const updatedItems = isSelected
//         ? selectedItems.filter(i => i?.ID !== item?.ID)
//         : [...selectedItems, item];
//       setSelectedItems(updatedItems);
//     } else {
//       setValue(item);
//       setSelectedItem(item);
//       closeModal();
//     }
//   };

//   const handleConfirmMultiSelect = () => {
//     setValue(selectedItems);
//     closeModal();
//   };

//   const onChangeText = textSearch => {
//     if (textSearch?.length) {
//       setSearchText(textSearch);
//       const resultsData = SearchModal(data, textSearch);
//       setSearchResults(resultsData);
//     } else {
//       setSearchResults(data);
//     }
//   };

//   useEffect(() => {
//     if (Array.isArray(data) && data.length > 0) {
//       setSearchResults(prev => {
//         const isSame = JSON.stringify(prev) === JSON.stringify(data);
//         return isSame ? prev : data;
//       });
//     }
//   }, [data]);
//   useEffect(() => {
//     if (!multiple && value) {
//       const found = data?.find(
//         i =>
//           i?.ID === value ||
//           i?.OID === value ||
//           i?.Name === value ||
//           i?.UserFullName === value ||
//           i?.EntryName === value ||
//           i?.ItemName === value ||
//           i?.CompanyConfigName === value||
//              i?.CompanyName === value,
//       );
//       if (found) {
//         setSelectedItem(found);
//       } else {
//         setSelectedItem(null);
//       }
//     }
//   }, [value, data, multiple]);

//   useEffect(() => {
//     if (multiple && Array.isArray(value)) {
//       setSelectedItems(prev => {
//         const isSame = JSON.stringify(prev) === JSON.stringify(value);
//         return isSame ? prev : value;
//       });
//     }
//   }, [value]);

//   const textStyle = [
//     value ? styles.placeholder_two : styles.placeholder,
//     disabled && {color: colors.black},
//   ];

//   const renderItem = useCallback(
//     ({item, index}) => (
//       <TouchableOpacity
//         style={
//           index === searchResults.length - 1 ? styles.cardNoBorder : styles.card
//         }
//         onPress={() => handleSelection(item)}>
//         <Text bold style={styles.title} numberOfLines={2} ellipsizeMode="tail">
//           {keyOID
//             ? item?.OID
//             : (item?.UserFullName
//                 ? item?.UserFullName +
//                   (item?.DepartmentName ? ' - ' + item?.DepartmentName : '')
//                 : item?.Code && item?.Name
//                 ? item?.Code + ' - ' + item?.Name
//                 : item?.Name) ||
//               item?.EntryName ||
//               item?.ItemName ||
//               item?.OID ||
//               (item?.CompanyConfigName &&
//                 item?.Code + ' - ' + item?.CompanyConfigName) ||
//               item?.CompanyCode + ' - ' + item?.CompanyName}
//         </Text>
//         {multiple ? (
//           selectedItems.some(i => i?.ID === item?.ID) ? (
//             <SvgXml xml={radio_active} />
//           ) : (
//             <SvgXml xml={radio} />
//           )
//         ) : selectedItem === item ? (
//           <SvgXml xml={radio_active} />
//         ) : (
//           <SvgXml xml={radio} />
//         )}
//       </TouchableOpacity>
//     ),
//     [selectedItems, selectedItem, multiple, keyOID],
//   );

//   return (
//     <View>
//       {titleInventory ? (
//         <View style={styles.containerHeader}>
//           <Text style={styles.label}>{title}</Text>
//           <Text style={styles.titleInventory}>
//             {titleInventory ? titleInventory : 0}
//           </Text>
//         </View>
//       ) : (
//         <>
//           {require ? (
//             <View style={styles.containerRequire}>
//               <Text style={styles.label}>{title}</Text>
//               <Text style={styles.txtRequire}>*</Text>
//             </View>
//           ) : (
//             <View>
//               <Text style={styles.label}>{title}</Text>
//             </View>
//           )}
//         </>
//       )}

//       <Button
//         style={[
//           styles.container,
//           {
//             backgroundColor: bgColor ?? colors.white,
//             height: isLongText ? 'auto' : hScale(42),
//           },
//         ]}
//         opacity={disabled ? 1 : 0.5}
//         onPress={openShowModal}
//         disabled={isDisabled}>
//         <View style={styles.header}>
//           <Text
//             style={textStyle}
//             numberOfLines={4}
//             ellipsizeMode="tail"
//             onTextLayout={e => {
//               const lines = e.nativeEvent.lines;
//               const shouldSet = lines.length > 2;
//               if (shouldSet !== isLongText) {
//                 setIsLongText(shouldSet);
//               }
//             }}>
//             {value ? value : title}
//           </Text>
//           <View>
//             <SvgXml xml={arrow_down} width="14" height="14" />
//           </View>
//         </View>

//         <Modal
//           useNativeDriver
//           backdropOpacity={0.5}
//           isVisible={ishowModal}
//           style={styles.optionsModal}
//           onBackButtonPress={closeModal}
//           onBackdropPress={closeModal}
//           avoidKeyboard={true}
//           hideModalContentWhileAnimating>
//           <View style={styles.optionsModalContainer}>
//             <View style={styles.headerContent_gray}>
//               <View style={styles.btnClose}>
//                 <SvgXml xml={close_white} />
//               </View>
//               <Text style={styles.titleModal}>{title}</Text>
//               <Button onPress={closeModal} style={styles.btnClose}>
//                 <SvgXml xml={close_blue} />
//               </Button>
//             </View>
//             <View style={styles.contentContainer}>
//               <View style={styles.search}>
//                 <SearchBar
//                   value={searchText}
//                   onChangeText={text => {
//                     setSearchText(text);
//                     onChangeText(text);
//                   }}
//                 />
//               </View>
//               <FlatList
//                 data={searchResults}
//                 keyExtractor={(item, index) =>
//                   `${item?.ID || item?.OID}-${index}`
//                 }
//                 renderItem={renderItem}
//                 initialNumToRender={7}
//                 maxToRenderPerBatch={7}
//                 windowSize={5}
//                 removeClippedSubviews={true}
//                 // ListFooterComponent={
//                 //   multiple ? (
//                 //     <Button
//                 //       style={styles.btnConfirm}
//                 //       onPress={handleConfirmMultiSelect}>
//                 //       <Text style={styles.txtConfirm}>Xác nhận</Text>
//                 //     </Button>
//                 //   ) : null
//                 // }
//                 showsVerticalScrollIndicator={false}
//               />
//               <View>
//                 {multiple ? (
//                   <Button
//                     style={styles.btnConfirm}
//                     onPress={handleConfirmMultiSelect}>
//                     <Text style={styles.txtConfirm}>Xác nhận</Text>
//                   </Button>
//                 ) : null}
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </Button>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     color: colors.black,
//     borderRadius: scale(8),
//     fontSize: fontSize.size14,
//     borderWidth: scale(1),
//     borderColor: '#D1D3DB',
//     backgroundColor: colors.white,
//     paddingLeft: scale(16),
//     paddingHorizontal: scale(16),
//     justifyContent: 'center',
//   },
//   optionsModal: {
//     margin: 0,
//     justifyContent: 'flex-end',
//   },
//   optionsModalContainer: {
//     height: height / 2.2,
//   },
//   contentContainer: {
//     backgroundColor: colors.white,
//     height: height / 2.2,
//     paddingBottom: scale(50),
//   },
//   label: {
//     color: colors.black,
//     fontSize: fontSize.size14,
//     fontWeight: '500',
//     fontFamily: 'Inter-Medium',
//     lineHeight: scale(22),
//     marginBottom: scale(8),
//   },
//   placeholder: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     color: '#525252',
//   },
//   placeholder_two: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     color: colors.black,
//     fontSize: fontSize.size14,
//     fontFamily: 'Inter-Regular',
//     lineHeight: scale(22),
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerContent_gray: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     height: hScale(46),
//     paddingHorizontal: scale(16),
//     backgroundColor: colors.white,
//     borderTopLeftRadius: scale(24),
//     borderTopRightRadius: scale(24),
//   },
//   titleModal: {
//     color: colors.black,
//     fontSize: fontSize.size16,
//     fontWeight: '600',
//     fontFamily: 'Inter-SemiBold',
//     lineHeight: scale(24),
//     textAlign: 'center',
//     flex: 1,
//   },
//   containerRadio: {
//     borderRadius: scale(12),
//     marginHorizontal: scale(16),
//   },
//   search: {
//     marginHorizontal: scale(16),
//     marginBottom: scale(16),
//     marginTop: scale(16),
//   },
//   btnClose: {
//     padding: scale(10),
//   },
//   card: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: scale(10),
//     borderBottomWidth: 1,
//     borderBottomColor: '#D1D3DB',
//     marginHorizontal: scale(16),
//     alignItems: 'center',
//   },
//   cardNoBorder: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: scale(10),
//     marginHorizontal: scale(16),
//   },
//   title: {
//     color: colors.black,
//     fontSize: fontSize.size14,
//     fontWeight: '400',
//     fontFamily: 'Inter-Regular',
//     lineHeight: scale(22),
//     width: '90%',
//     overflow: 'hidden',
//   },
//   row: {
//     borderRadius: scale(12),
//     backgroundColor: colors.white,
//   },
//   containerHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   titleInventory: {
//     color: '#525252',
//     fontSize: fontSize.size14,
//     fontWeight: '400',
//     fontFamily: 'Inter-Regular',
//     lineHeight: scale(22),
//   },
//   txtRequire: {
//     color: colors.red,
//     marginLeft: scale(2),
//     bottom: 4,
//   },
//   containerRequire: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   btnConfirm: {
//     height: hScale(38),
//     backgroundColor: colors.blue,
//     borderRadius: scale(8),
//     marginVertical: scale(8),
//     marginHorizontal: scale(12),
//     justifyContent: 'center',
//   },
//   txtConfirm: {
//     color: colors.white,
//     fontSize: fontSize.size14,
//     fontWeight: '600',
//     fontFamily: 'Inter-SemiBold',
//     lineHeight: scale(22),
//     textAlign: 'center',
//   },
// });

// export default React.memo(CardModalSelect);
/* eslint-disable prettier/prettier */
// import React, {useCallback, useEffect, useState} from 'react';
// import Modal from 'react-native-modal';
// import {SvgXml} from 'react-native-svg';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   Dimensions,
//   TouchableOpacity,
//   Text,
//   FlatList,
// } from 'react-native';

// import {Button} from '../buttons';
// import SearchBar from '../SearchBar';
// import {colors, fontSize} from 'themes';
// import {hScale, scale} from '@resolutions';
// import SearchModal from 'components/SearchModal';
// import {arrow_down, close_blue, close_white, radio, radio_active} from 'svgImg';

// const {height} = Dimensions.get('window');

// const areSameItem = (a, b) => {
//   if (!a || !b) return false;
//   if (a?.ID && b?.ID) return a.ID === b.ID;
//   if (a?.OID && b?.OID) return a.OID === b.OID;
//   if (a?.Name && b?.Name) return a.Name === b.Name;
//   return false;
// };

// const CardModalSelect = ({
//   data = [],
//   title,
//   setValue,
//   value,
//   bgColor,
//   titleInventory,
//   require,
//   disabled,
//   multiple = false,
//   keyOID = false,
//   company = false,
// }) => {
//   console.log('data',data)
//   const isDisabled = disabled ?? false;
//   const [searchText, setSearchText] = useState('');
//   const [ishowModal, setIsShowModal] = useState(false);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [searchResults, setSearchResults] = useState(
//     data?.length > 0 ? data : [],
//   );
//   const [isLongText, setIsLongText] = useState(false);

//   const openShowModal = () => {
//     setIsShowModal(true);
//   };

//   const closeModal = () => {
//     setIsShowModal(false);
//   };

//   const handleSelection = item => {
//     if (multiple) {
//       const isSelected = selectedItems.some(i => areSameItem(i, item));
//       const updatedItems = isSelected
//         ? selectedItems.filter(i => !areSameItem(i, item))
//         : [...selectedItems, item];
//       setSelectedItems(updatedItems);
//     } else {
//       // nếu nhấn lại item đã chọn => bỏ chọn (không đóng modal)
//       if (selectedItem && areSameItem(selectedItem, item)) {
//         setValue(null);
//         setSelectedItem(null);
//         return; // không đóng modal để người dùng có thể thao tác tiếp
//       }

//       // ngược lại: chọn item và đóng modal
//       setValue(item);
//       setSelectedItem(item);
//       closeModal();
//     }
//   };

//   const handleConfirmMultiSelect = () => {
//     setValue(selectedItems);
//     closeModal();
//   };

//   const onChangeText = textSearch => {
//     if (textSearch?.length) {
//       setSearchText(textSearch);
//       const resultsData = SearchModal(data, textSearch);
//       setSearchResults(resultsData);
//     } else {
//       setSearchResults(data);
//     }
//   };

//   useEffect(() => {
//     if (Array.isArray(data) && data.length > 0) {
//       setSearchResults(prev => {
//         const isSame = JSON.stringify(prev) === JSON.stringify(data);
//         return isSame ? prev : data;
//       });
//     } else {
//       setSearchResults([]);
//     }
//   }, [data]);

//   useEffect(() => {
//     if (!multiple && value) {
//       const found = data?.find(
//         i =>
//           i?.ID === value ||
//           i?.OID === value ||
//           i?.Name === value ||
//           i?.UserFullName === value ||
//           i?.EntryName === value ||
//           i?.ItemName === value ||
//           i?.CompanyConfigName === value ||
//           i?.CompanyName === value,
//       );
//       if (found) {
//         setSelectedItem(found);
//       } else {
//         setSelectedItem(null);
//       }
//     } else if (!multiple && !value) {
//       // nếu value rỗng thì reset selectedItem
//       setSelectedItem(null);
//     }
//   }, [value, data, multiple]);

//   useEffect(() => {
//     if (multiple && Array.isArray(value)) {
//       setSelectedItems(prev => {
//         const isSame = JSON.stringify(prev) === JSON.stringify(value);
//         return isSame ? prev : value;
//       });
//     }
//   }, [value, multiple]);

//   const textStyle = [
//     value ? styles.placeholder_two : styles.placeholder,
//     disabled && {color: colors.black},
//   ];

//   const renderItem = useCallback(
//     ({item, index}) => {
//       const last = index === searchResults.length - 1;
//       const isSelected = multiple
//         ? selectedItems.some(i => areSameItem(i, item))
//         : areSameItem(selectedItem, item);

//       return (
//         <TouchableOpacity
//           style={last ? styles.cardNoBorder : styles.card}
//           onPress={() => handleSelection(item)}>
//           <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
//             {keyOID
//               ? item?.OID
//               : (item?.UserFullName
//                   ? item?.UserFullName +
//                     (item?.DepartmentName ? ' - ' + item?.DepartmentName : '')
//                   : item?.Code && item?.Name
//                   ? item?.Code + ' - ' + item?.Name
//                   : item?.Name) ||
//                 item?.EntryName ||
//                 item?.ItemName ||
//                 item?.OID ||
//                 (item?.CompanyConfigName &&
//                   item?.Code + ' - ' + item?.CompanyConfigName) ||
//                 item?.CompanyCode + ' - ' + item?.CompanyName}
//           </Text>
//           {isSelected ? <SvgXml xml={radio_active} /> : <SvgXml xml={radio} />}
//         </TouchableOpacity>
//       );
//     },
//     [selectedItems, selectedItem, multiple, keyOID, searchResults],
//   );

//   return (
//     <View>
//       {titleInventory ? (
//         <View style={styles.containerHeader}>
//           <Text style={styles.label}>{title}</Text>
//           <Text style={styles.titleInventory}>
//             {titleInventory ? titleInventory : 0}
//           </Text>
//         </View>
//       ) : (
//         <>
//           {require ? (
//             <View style={styles.containerRequire}>
//               <Text style={styles.label}>{title}</Text>
//               <Text style={styles.txtRequire}>*</Text>
//             </View>
//           ) : (
//             <View>
//               <Text style={styles.label}>{title}</Text>
//             </View>
//           )}
//         </>
//       )}

//       <Button
//         style={[
//           styles.container,
//           {
//             backgroundColor: bgColor ?? colors.white,
//             height: isLongText ? 'auto' : hScale(42),
//           },
//         ]}
//         opacity={disabled ? 1 : 0.5}
//         onPress={openShowModal}
//         disabled={isDisabled}>
//         <View style={styles.header}>
//           <Text
//             style={textStyle}
//             numberOfLines={4}
//             ellipsizeMode="tail"
//             onTextLayout={e => {
//               const lines = e.nativeEvent.lines;
//               const shouldSet = lines.length > 2;
//               if (shouldSet !== isLongText) {
//                 setIsLongText(shouldSet);
//               }
//             }}>
//             {value ? value : title}
//           </Text>
//           <View>
//             <SvgXml xml={arrow_down} width="14" height="14" />
//           </View>
//         </View>

//         <Modal
//           useNativeDriver
//           backdropOpacity={0.5}
//           isVisible={ishowModal}
//           style={styles.optionsModal}
//           onBackButtonPress={closeModal}
//           onBackdropPress={closeModal}
//           avoidKeyboard={true}
//           hideModalContentWhileAnimating>
//           <View style={styles.optionsModalContainer}>
//             <View style={styles.headerContent_gray}>
//               <View style={styles.btnClose}>
//                 <SvgXml xml={close_white} />
//               </View>
//               <Text style={styles.titleModal}>{title}</Text>
//               <Button onPress={closeModal} style={styles.btnClose}>
//                 <SvgXml xml={close_blue} />
//               </Button>
//             </View>
//             <View style={styles.contentContainer}>
//               <View style={styles.search}>
//                 <SearchBar
//                   value={searchText}
//                   onChangeText={text => {
//                     setSearchText(text);
//                     onChangeText(text);
//                   }}
//                 />
//               </View>
//               <FlatList
//                 data={searchResults}
//                 keyExtractor={(item, index) =>
//                   `${item?.ID || item?.OID || item?.Name}-${index}`
//                 }
//                 renderItem={renderItem}
//                 initialNumToRender={7}
//                 maxToRenderPerBatch={7}
//                 windowSize={5}
//                 removeClippedSubviews={true}
//                 showsVerticalScrollIndicator={false}
//               />
//               <View>
//                 {multiple ? (
//                   <Button
//                     style={styles.btnConfirm}
//                     onPress={handleConfirmMultiSelect}>
//                     <Text style={styles.txtConfirm}>Xác nhận</Text>
//                   </Button>
//                 ) : null}
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </Button>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     color: colors.black,
//     borderRadius: scale(8),
//     fontSize: fontSize.size14,
//     borderWidth: scale(1),
//     borderColor: '#D1D3DB',
//     backgroundColor: colors.white,
//     paddingLeft: scale(16),
//     paddingHorizontal: scale(16),
//     justifyContent: 'center',
//   },
//   optionsModal: {
//     margin: 0,
//     justifyContent: 'flex-end',
//   },
//   optionsModalContainer: {
//     height: height / 2.2,
//   },
//   contentContainer: {
//     backgroundColor: colors.white,
//     height: height / 2.2,
//     paddingBottom: scale(50),
//   },
//   label: {
//     color: colors.black,
//     fontSize: fontSize.size14,
//     fontWeight: '500',
//     fontFamily: 'Inter-Medium',
//     lineHeight: scale(22),
//     marginBottom: scale(8),
//   },
//   placeholder: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     color: '#525252',
//   },
//   placeholder_two: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     color: colors.black,
//     fontSize: fontSize.size14,
//     fontFamily: 'Inter-Regular',
//     lineHeight: scale(22),
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerContent_gray: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     height: hScale(46),
//     paddingHorizontal: scale(16),
//     backgroundColor: colors.white,
//     borderTopLeftRadius: scale(24),
//     borderTopRightRadius: scale(24),
//   },
//   titleModal: {
//     color: colors.black,
//     fontSize: fontSize.size16,
//     fontWeight: '600',
//     fontFamily: 'Inter-SemiBold',
//     lineHeight: scale(24),
//     textAlign: 'center',
//     flex: 1,
//   },
//   containerRadio: {
//     borderRadius: scale(12),
//     marginHorizontal: scale(16),
//   },
//   search: {
//     marginHorizontal: scale(16),
//     marginBottom: scale(16),
//     marginTop: scale(16),
//   },
//   btnClose: {
//     padding: scale(10),
//   },
//   card: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: scale(10),
//     borderBottomWidth: 1,
//     borderBottomColor: '#D1D3DB',
//     marginHorizontal: scale(16),
//     alignItems: 'center',
//   },
//   cardNoBorder: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: scale(10),
//     marginHorizontal: scale(16),
//   },
//   title: {
//     color: colors.black,
//     fontSize: fontSize.size14,
//     fontWeight: '400',
//     fontFamily: 'Inter-Regular',
//     lineHeight: scale(22),
//     width: '90%',
//     overflow: 'hidden',
//   },
//   row: {
//     borderRadius: scale(12),
//     backgroundColor: colors.white,
//   },
//   containerHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   titleInventory: {
//     color: '#525252',
//     fontSize: fontSize.size14,
//     fontWeight: '400',
//     fontFamily: 'Inter-Regular',
//     lineHeight: scale(22),
//   },
//   txtRequire: {
//     color: colors.red,
//     marginLeft: scale(2),
//     bottom: 4,
//   },
//   containerRequire: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   btnConfirm: {
//     height: hScale(38),
//     backgroundColor: colors.blue,
//     borderRadius: scale(8),
//     marginVertical: scale(8),
//     marginHorizontal: scale(12),
//     justifyContent: 'center',
//   },
//   txtConfirm: {
//     color: colors.white,
//     fontSize: fontSize.size14,
//     fontWeight: '600',
//     fontFamily: 'Inter-SemiBold',
//     lineHeight: scale(22),
//     textAlign: 'center',
//   },
// });

// export default React.memo(CardModalSelect);
/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Modal from 'react-native-modal';
import {SvgXml} from 'react-native-svg';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native';

import {Button} from '../buttons';
import SearchBar from '../SearchBar';
import {colors, fontSize} from 'themes';
import {hScale, scale} from '@resolutions';
import SearchModal from 'components/SearchModal';
import {arrow_down, close_blue, close_white, radio, radio_active} from 'svgImg';

const {height} = Dimensions.get('window');

const areSameItem = (a, b) => {
  if (!a || !b) return false;
  if (a?.ID && b?.ID) return a.ID === b.ID;
  if (a?.OID && b?.OID) return a.OID === b.OID;
  if (a?.Name && b?.Name) return a.Name === b.Name;
  if (a?.SKU && b?.SKU) return a.SKU === b.SKU;
  if (a?.CompanyConfigName && b?.CompanyConfigName)
    return a.CompanyConfigName === b.CompanyConfigName;
  return false;
};

const CardModalSelect = ({
  data = [],
  title,
  setValue,
  value,
  bgColor,
  titleInventory,
  require,
  disabled,
  multiple = false,
  keyOID = false,
  company = false,
  name = false,
  document = false,
  itemOrder = false,
  extend = false,
  address = false,
  nofilter = false,
}) => {
  // console.log('value',value)
  const isDisabled = disabled ?? false;
  const [searchText, setSearchText] = useState('');
  const [ishowModal, setIsShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchResults, setSearchResults] = useState(
    Array.isArray(data) && data.length > 0 ? data : [],
  );
  const [isLongText, setIsLongText] = useState(false);
  const prevDataJsonRef = useRef(null);

  const openShowModal = () => {
    if (isDisabled) return;
    setIsShowModal(true);
  };

  const closeModal = () => {
    setIsShowModal(false);
  };
  const processData = dataArr => {
    const arr = Array.isArray(dataArr) ? [...dataArr] : [];

    if (arr.length === 0) return arr;

    // kiểm tra có bất kỳ SAPID/Code nào tồn tại không
    const hasSapOrCode = arr.some(i => i?.SAPID || i?.Code);

    if (hasSapOrCode) {
      // nhóm có SAPID hoặc Code
      const withSapOrCode = arr.filter(i => i?.SAPID || i?.Code);
      const without = arr.filter(i => !(i?.SAPID || i?.Code));

      withSapOrCode.sort((a, b) => {
        // ưu tiên SAPID nếu cả hai có SAPID
        if (a?.SAPID && b?.SAPID) {
          const aNum = Number(a.SAPID);
          const bNum = Number(b.SAPID);
          if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
            return aNum - bNum;
          }
          return String(a.SAPID).localeCompare(String(b.SAPID));
        }

        // nếu a có SAPID, b không có -> a trước
        if (a?.SAPID && !b?.SAPID) return -1;
        if (!a?.SAPID && b?.SAPID) return 1;

        // nếu không có SAPID nhưng có Code -> sort theo Code
        if (a?.Code && b?.Code) {
          const aNum = Number(a.Code);
          const bNum = Number(b.Code);
          if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
            return aNum - bNum;
          }
          return String(a.Code).localeCompare(String(b.Code));
        }

        // nếu a có Code còn b không -> a trước
        if (a?.Code && !b?.Code) return -1;
        if (!a?.Code && b?.Code) return 1;

        // fallback: theo Name
        const aName = (a?.Name || '').toString();
        const bName = (b?.Name || '').toString();
        return aName.localeCompare(bName);
      });

      // sắp xếp phần without (không có SAPID/Code) theo ID -> Name
      without.sort((a, b) => {
        if (a?.ID != null && b?.ID != null) {
          return Number(a.ID) - Number(b.ID);
        }
        const aName = (a?.Name || '').toString();
        const bName = (b?.Name || '').toString();
        return aName.localeCompare(bName);
      });

      return [...withSapOrCode, ...without];
    }

    // Nếu không có SAPID/Code ở bất kỳ item nào: sort theo ID (nếu có), fallback Name
    arr.sort((a, b) => {
      if (a?.ID != null && b?.ID != null) {
        return Number(a.ID) - Number(b.ID);
      }
      const aName = (a?.Name || '').toString();
      const bName = (b?.Name || '').toString();
      return aName.localeCompare(bName);
    });

    return arr;
  };

  const handleSelection = item => {
    if (multiple) {
      const isSelected = selectedItems.some(i => areSameItem(i, item));
      const updatedItems = isSelected
        ? selectedItems.filter(i => !areSameItem(i, item))
        : [...selectedItems, item];
      setSelectedItems(updatedItems);
      return;
    }

    // single-select:
    // nếu nhấn lại item đã chọn => bỏ chọn (không đóng modal)
    if (selectedItem && areSameItem(selectedItem, item)) {
      // gọi setValue với null/'' tuỳ mong muốn của bạn (ở đây dùng null)
      setValue(null);
      setSelectedItem(null);
      return; // không đóng modal
    }

    setValue(item);
    setSelectedItem(item);
    closeModal();
  };

  const handleConfirmMultiSelect = () => {
    setValue(selectedItems);
    closeModal();
  };

  // Search: tìm trong một nguồn đã xử lý (processedSource)
  const onChangeText = textSearch => {
    if (textSearch?.length) {
      setSearchText(textSearch);
      // tìm kiếm trên data đã processed (nếu có), còn không thì trên raw data
      const source = Array.isArray(prevDataJsonRef.currentProcessed)
        ? prevDataJsonRef.currentProcessed
        : Array.isArray(data)
        ? data
        : [];
      const resultsData = SearchModal(source, textSearch);
      setSearchResults(resultsData);
    } else {
      // reset search -> trả về processed data
      const dataArr = Array.isArray(data) ? data : [];
      const processed = nofilter ? dataArr : processData(dataArr);
      setSearchResults(processed);
      setSearchText('');
    }
  };
  useEffect(() => {
    const dataArr = Array.isArray(data) ? data : [];
    const dataJson = JSON.stringify(dataArr);
    if (prevDataJsonRef.current !== dataJson) {
      const processed = nofilter === true ? dataArr : processData(dataArr);
      setSearchResults(processed);
      prevDataJsonRef.current = dataJson;
      prevDataJsonRef.currentProcessed = processed;
    }
  }, [data]);
  useEffect(() => {
    if (multiple) return;
    let found = null;
    if (value && typeof value === 'object') {
      found =
        (Array.isArray(searchResults) &&
          searchResults.find(i => areSameItem(i, value))) ??
        (value?.ID || value?.OID || value?.Name ? value : null);
    } else if (value !== undefined && value !== null) {
      // giá trị value có thể là ID hoặc string
      const source =
        Array.isArray(searchResults) && searchResults.length > 0
          ? searchResults
          : data;
      found =
        (Array.isArray(source) &&
          source.find(
            i =>
              i?.SKU + ' - ' + i?.ItemName === value ||
              i?.CompanyName === value ||
              i?.ID === value ||
              i?.OID === value ||
              i?.Name === value ||
              i?.UserFullName === value ||
              i?.EntryName === value ||
              i?.ItemName === value ||
              i?.CompanyConfigName === value ||
              i?.CompanyName === value ||
              i?.Address === value,
          )) ??
        null;
    }

    if (found) {
      if (!areSameItem(found, selectedItem)) {
        setSelectedItem(found);
      }
    } else {
      if (selectedItem !== null) {
        setSelectedItem(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, data, multiple, searchResults]);

  // 3) Sync selectedItems khi prop value (mảng) thay đổi (only for multiple)
  useEffect(() => {
    if (!multiple) return;
    if (!Array.isArray(value)) return;

    const prevJson = JSON.stringify(selectedItems);
    const newJson = JSON.stringify(value);
    if (prevJson !== newJson) {
      setSelectedItems(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, multiple]);

  const textStyle = [
    value ? styles.placeholder_two : styles.placeholder,
    disabled && {color: colors.black},
  ];

  const renderItem = useCallback(
    ({item, index}) => {
      const last = index === searchResults.length - 1;
      const isSelected = multiple
        ? selectedItems.some(i => areSameItem(i, item))
        : areSameItem(selectedItem, item);
      return (
        <TouchableOpacity
          style={last ? styles.cardNoBorder : styles.card}
          onPress={() => handleSelection(item)}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {address
              ? item?.Address
              : itemOrder
              ? item?.SKU + ' - ' + item?.ItemName
              : document
              ? item?.Name +
                ' - ' +
                (item?.IsCompleteDocuments === 0
                  ? '(Chưa đủ HSKH)'
                  : '(Đủ HSKH)')
              : name
              ? item?.Name
              : keyOID
              ? item?.OID
              : (item?.UserFullName
                  ? item?.UserFullName +
                    (item?.DepartmentName ? ' - ' + item?.DepartmentName : '')
                  : item?.Code && item?.Name
                  ? (nofilter ? '' : item?.SAPID || item?.Code) +
                    (nofilter ? '':' - ') +
                    item?.Name
                  : item?.Name) ||
                item?.EntryName ||
                item?.ItemName ||
                item?.OID ||
                (item?.CompanyConfigName &&
                  (nofilter ? '' : item?.SAPID || item?.Code) +
                    (nofilter ? '':' - ') +
                    item?.CompanyConfigName) ||
                item?.CompanyCode + ' - ' + item?.CompanyName}
          </Text>
          {isSelected ? <SvgXml xml={radio_active} /> : <SvgXml xml={radio} />}
        </TouchableOpacity>
      );
    },
    // chú ý dependencies: chỉ những giá trị thực sự có thể thay đổi render
    [selectedItems, selectedItem, multiple, keyOID, searchResults],
  );

  return (
    <View>
      {titleInventory ? (
        <View style={styles.containerHeader}>
          <Text style={styles.label}>{title}</Text>
          <Text style={styles.titleInventory}>
            {titleInventory ? titleInventory : 0}
          </Text>
        </View>
      ) : (
        <>
          {require ? (
            <View style={styles.containerRequire}>
              <Text style={styles.label}>{title} </Text>
              <Text style={styles.txtRequire}>*</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.label}>{title} </Text>
            </View>
          )}
        </>
      )}

      <Button
        style={[
          styles.container,
          {
            borderColor:
              value?.length > 0 ? '#D1D3DB' : require ? colors.blue : '#D1D3DB',
            borderWidth:
              value?.length > 0 ? scale(1) : require ? scale(2) : scale(1),
            backgroundColor: bgColor ?? colors.white,
            height: isLongText ? 'auto' : hScale(42),
            minHeight: hScale(42),
          },
        ]}
        opacity={disabled ? 1 : 0.5}
        onPress={openShowModal}
        disabled={isDisabled}>
        <View style={styles.header}>
          <Text
            style={textStyle}
            numberOfLines={4}
            ellipsizeMode="tail"
            onTextLayout={e => {
              const lines = e.nativeEvent.lines;
              const shouldSet = extend ? true : lines.length >= 2;
              if (shouldSet !== isLongText || extend === true) {
                setIsLongText(extend ? true : shouldSet);
              }
            }}>
            {value ? value : title}
          </Text>
          <View>
            <SvgXml xml={arrow_down} width="14" height="14" />
          </View>
        </View>

        <Modal
          useNativeDriver
          backdropOpacity={0.5}
          isVisible={ishowModal}
          style={styles.optionsModal}
          onBackButtonPress={closeModal}
          onBackdropPress={closeModal}
          avoidKeyboard={true}
          hideModalContentWhileAnimating>
          <View style={styles.optionsModalContainer}>
            <View style={styles.headerContent_gray}>
              <View style={styles.btnClose}>
                <SvgXml xml={close_white} />
              </View>
              <Text style={styles.titleModal}>{title}</Text>
              <Button onPress={closeModal} style={styles.btnClose}>
                <SvgXml xml={close_blue} />
              </Button>
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.search}>
                <SearchBar
                  value={searchText}
                  onChangeText={text => {
                    setSearchText(text);
                    onChangeText(text);
                  }}
                />
              </View>
              <FlatList
                data={searchResults}
                keyExtractor={(item, index) =>
                  `${item?.ID || item?.OID || item?.Name || index}-${index}`
                }
                renderItem={renderItem}
                initialNumToRender={7}
                maxToRenderPerBatch={7}
                windowSize={5}
                removeClippedSubviews={true}
                showsVerticalScrollIndicator={false}
              />
              <View>
                {multiple ? (
                  <Button
                    style={styles.btnConfirm}
                    onPress={handleConfirmMultiSelect}>
                    <Text style={styles.txtConfirm}>Xác nhận</Text>
                  </Button>
                ) : null}
              </View>
            </View>
          </View>
        </Modal>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    color: colors.black,
    borderRadius: scale(8),
    fontSize: fontSize.size14,
    borderWidth: scale(1),
    borderColor: '#D1D3DB',
    backgroundColor: colors.white,
    paddingLeft: scale(16),
    paddingHorizontal: scale(16),
    justifyContent: 'center',
  },
  optionsModal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  optionsModalContainer: {
    height: height / 2.2,
  },
  contentContainer: {
    backgroundColor: colors.white,
    height: height / 2.2,
    paddingBottom: scale(50),
  },
  label: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    lineHeight: scale(22),
    marginBottom: scale(8),
  },
  placeholder: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#525252',
  },
  placeholder_two: {
    flexDirection: 'row',
    alignItems: 'center',
    color: colors.black,
    fontSize: fontSize.size14,
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent_gray: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: hScale(46),
    paddingHorizontal: scale(16),
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
  },
  titleModal: {
    color: colors.black,
    fontSize: fontSize.size16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(24),
    textAlign: 'center',
    flex: 1,
  },
  containerRadio: {
    borderRadius: scale(12),
    marginHorizontal: scale(16),
  },
  search: {
    marginHorizontal: scale(16),
    marginBottom: scale(16),
    marginTop: scale(16),
  },
  btnClose: {
    padding: scale(10),
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#D1D3DB',
    marginHorizontal: scale(16),
    alignItems: 'center',
  },
  cardNoBorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: scale(10),
    marginHorizontal: scale(16),
  },
  title: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
    width: '90%',
    overflow: 'hidden',
  },
  row: {
    borderRadius: scale(12),
    backgroundColor: colors.white,
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleInventory: {
    color: '#525252',
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
  },
  txtRequire: {
    color: colors.red,
    marginLeft: scale(2),
    bottom: 4,
  },
  containerRequire: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnConfirm: {
    height: hScale(38),
    backgroundColor: colors.blue,
    borderRadius: scale(8),
    marginVertical: scale(8),
    marginHorizontal: scale(12),
    justifyContent: 'center',
  },
  txtConfirm: {
    color: colors.white,
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(22),
    textAlign: 'center',
  },
});

export default React.memo(CardModalSelect);
