/* eslint-disable react/no-unstable-nested-components */
// /* eslint-disable react-native/no-inline-styles */
// import React, {useCallback, useEffect, useState} from 'react';
// import moment from 'moment';
// import {useFormik} from 'formik';
// import Modal from 'react-native-modal';
// import {useSelector} from 'react-redux';
// import {SvgXml} from 'react-native-svg';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Platform,
//   FlatList,
//   ScrollView,
//   Dimensions,
//   Alert,
//   Linking,
//   TouchableOpacity,
// } from 'react-native';

// import {Button} from '../buttons';
// import {colors, fontSize} from 'themes';
// import {hScale, scale} from '@resolutions';
// import {translateLang} from 'store/accLanguages/slide';
// import {
//   InputDefault,
//   Switch,
//   CardModalSelect,
//   ModalSelectDate,
// } from 'components';
// import {
//   cake_birthday,
//   close_red,
//   close_white,
//   envelope,
//   phone_green,
//   three_dot,
//   trash_22,
// } from 'svgImg';

// const {height} = Dimensions.get('window');

// const ModalContact = ({
//   setValueContact,
//   dataEdit,
//   parentID,
//   cmpnID,
//   disable = false,
//   isadd = false,
// }) => {
//   const languageKey = useSelector(translateLang);
//   const {listPositions} = useSelector(state => state.CustomerProfile);
//   const [isShowModalContact, setIsShowModalContact] = useState(false);
//   const [listContact, setListContact] = useState([]);
//   const [switchStates, setSwitchStates] = useState(true);
//   const [isDatePickerVisible, setDatePickerVisible] = useState(false);
//   const [selectedValueSubmitForm, setSelectedValueSubmitForm] = useState();
//   const [selectedValue, setSelectedValue] = useState();
//   const [selectedValuePosition, setSelectedValuePosition] = useState(null);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const openShowModal = () => {
//     setIsShowModalContact(true);
//   };

//   const closeModal = () => {
//     setIsShowModalContact(false);
//   };
// console.log('listPositions',listPositions)
//   const handleSwitchToggle = () => {
//     setSwitchStates(!switchStates);
//   };

//   const initialValues = {
//     CategoryType: 'Contact',
//     IsActive: 0,
//     Name: '',
//     NameExtention1: '',
//     BirthDate: '',
//     ResponsibilitiesID: 0,
//     ID: 0,
//     CustomerID: 0,
//     Email: '',
//     PhoneNumber: '',
//     Note: '',
//   };

//   const {
//     values,
//     errors,
//     touched,
//     handleChange,
//     handleBlur,
//     setFieldValue,
//     resetForm,
//     validateForm,
//     setFieldTouched,
//   } = useFormik({
//     initialValues,
//     // validate function: trả về object errors
//     validate: values => {
//       const errors = {};
//       if (!values.PhoneNumber || values.PhoneNumber.toString().trim() === '') {
//         if (selectedValuePosition?.Code !== 'Z99999') {
//           errors.PhoneNumber = 'Số điện thoại là bắt buộc';
//         }
//       }
//       return errors;
//     },
//   });

//   const showDatePicker = () => {
//     setDatePickerVisible(true);
//   };

//   const hideDatePicker = () => {
//     setDatePickerVisible(false);
//   };

//   const handleEditContact = (contactToEdit, index) => {
//     setFieldValue('Name', contactToEdit?.Name || '');
//     setFieldValue('NameExtention1', contactToEdit?.NameExtention1 || '');
//     setFieldValue('Email', contactToEdit?.Email || '');
//     setFieldValue('PhoneNumber', contactToEdit?.PhoneNumber || '');
//     setFieldValue('Note', contactToEdit?.Note || '');

//     setSelectedValue(contactToEdit?.BirthDate || '');
//     setSelectedValueSubmitForm(contactToEdit?.BirthDate || '');
//     setSelectedValuePosition({
//       ID: contactToEdit?.ResponsibilitiesID,
//       Name:
//         listPositions?.find(r => r.ID === contactToEdit?.ResponsibilitiesID)
//           ?.Name || '',
//     });
//     setSwitchStates(contactToEdit?.IsActive === 1);
//     setEditingIndex(index);
//     setIsShowModalContact(true);
//   };

//   const handleAddNewContact = async () => {
//     const formErrors = await validateForm();
//     if (!selectedValuePosition?.Name) {
//       Alert.alert('Lỗi bắt buộc nhập chức vụ');
//       return;
//     }
//     if (formErrors.PhoneNumber && selectedValuePosition?.Code !== 'Z99999') {
//       setFieldTouched('PhoneNumber', true);
//       Alert.alert('Lỗi', formErrors.PhoneNumber);
//       return;
//     }
//     if (!values?.Email && selectedValuePosition?.Code === 'Z99999') {
//       Alert.alert('Vui lòng nhập email');
//       return;
//     }
//     const newContact = {
//       CategoryType: 'Contact',
//       IsActive: switchStates ? 1 : 0,
//       Name: values?.Name,
//       NameExtention1: values?.NameExtention1 || '',
//       BirthDate: moment(new Date()).format('DD/MM/YYYY'),
//       ResponsibilitiesID: selectedValuePosition?.ID || 0,
//       ResponsibilitiesName: selectedValuePosition?.Name || '',
//       CmpnID: cmpnID?.toString(),
//       Email: values?.Email,
//       PhoneNumber: values?.PhoneNumber,
//       Note: values?.Note,
//       ID: 0,
//       CustomerID: parentID || 0,
//     };
//     if (editingIndex !== null) {
//       const updatedList = [...listContact];
//       updatedList[editingIndex] = newContact;
//       setListContact(updatedList);
//       setValueContact(updatedList);
//     } else {
//       setListContact(prev => [...prev, newContact]);
//       setValueContact(prev => [...prev, newContact]);
//     }
//     resetForm();
//     setSelectedValue(new Date());
//     setSelectedValuePosition(null);
//     closeModal();
//     setEditingIndex(null);
//   };

//   const handleDelete = contactToDelete => {
//     setListContact(prev => prev.filter(item => item !== contactToDelete));
//     setValueContact(prev => prev.filter(item => item !== contactToDelete));
//   };

//   useEffect(() => {
//     if (dataEdit && dataEdit.length > 0) {
//       const convertedData = dataEdit.map(item => ({
//         ID: item?.ID || 0,
//         CustomerID: parentID,
//         CategoryType: 'Contact',
//         IsActive: item?.IsActive ?? 0,
//         Name: item?.Name || '',
//         CmpnID: item?.CmpnID?.toString(),
//         NameExtention1: item?.NameExtention1 || '',
//         BirthDate: item?.BirthDate || '',
//         ResponsibilitiesID: item?.ResponsibilitiesID || 0,
//         ResponsibilitiesName: item?.ResponsibilitiesName || '',
//         Email: item?.Email || '',
//         PhoneNumber: item?.PhoneNumber || '',
//         Note: item?.Note || '',
//       }));
//       setListContact(convertedData);
//       setValueContact(convertedData);
//     }
//   }, [dataEdit]);
//   const handleCall = async phone => {
//     if (!phone) {
//       Alert.alert(
//         '',
//         languageKey ? languageKey('_no_phone_number') : 'No phone number',
//       );
//       return;
//     }
//     // remove spaces and non-digit plus signs except leading +
//     const cleaned = String(phone)
//       .trim()
//       .replace(/[^+\d]/g, '');
//     const url = `tel:${cleaned}`;
//     try {
//       const supported = await Linking.canOpenURL(url);
//       if (supported) {
//         await Linking.openURL(url);
//       } else {
//         Alert.alert(
//           '',
//           languageKey
//             ? languageKey('_cannot_make_call')
//             : 'Cannot make a call from this device',
//         );
//       }
//     } catch (err) {
//       console.warn('handleCall error', err);
//       Alert.alert(
//         '',
//         languageKey ? languageKey('_cannot_make_call') : 'Cannot make a call',
//       );
//     }
//   };

//   const handleEmail = async email => {
//     if (!email) {
//       Alert.alert(
//         '',
//         languageKey ? languageKey('_no_email') : 'No email address',
//       );
//       return;
//     }
//     const cleaned = String(email).trim();
//     // Optional: prefill subject/body, encode components if you want
//     const subject = encodeURIComponent('');
//     const body = encodeURIComponent('');
//     const url = `mailto:${cleaned}?subject=${subject}&body=${body}`;
//     try {
//       const supported = await Linking.canOpenURL(url);
//       if (supported) {
//         await Linking.openURL(url);
//       } else {
//         Alert.alert(
//           '',
//           languageKey
//             ? languageKey('_cannot_open_mail')
//             : 'Cannot open mail app',
//         );
//       }
//     } catch (err) {
//       console.warn('handleEmail error', err);
//       Alert.alert(
//         '',
//         languageKey ? languageKey('_cannot_open_mail') : 'Cannot open mail app',
//       );
//     }
//   };

//   const _keyExtractor = (item, index) => `${item?.ID}-${index}`;
//   const _renderItem = useCallback(
//     ({item, index}) => {
//       return (
//         <Button onPress={() => handleEditContact(item, index)}>
//           <View style={disable ? styles.cardProgram1 : styles.cardProgram}>
//             <View style={disable ? styles.itemBody_two1 : styles.itemBody_two}>
//               <View style={styles.containerItem}>
//                 <View style={styles.containerHeader}>
//                   <Text style={styles.txtTitleItem}>{item?.Name}</Text>
//                   {disable === false && (
//                     <Button onPress={() => handleDelete(item)}>
//                       <SvgXml xml={trash_22} />
//                     </Button>
//                   )}
//                 </View>
//                 <View style={styles.containerStatus}>
//                   {/* <View
//                     style={[
//                       styles.bodyStatus,
//                       {
//                         backgroundColor:
//                           item?.IsActive === 1 ? '#DCFCE7' : '#FEE2E2',
//                       },
//                     ]}>
//                     <Text
//                       style={[
//                         styles.txtStatus,
//                         {color: item?.IsActive === 1 ? '#166534' : '#991B1B'},
//                       ]}>
//                       {item?.IsActive === 1
//                         ? languageKey('_active')
//                         : languageKey('_inactive')}
//                     </Text>
//                   </View> */}
//                   {item?.ResponsibilitiesName ? (
//                     <View
//                       style={[
//                         styles.bodyStatus,
//                         {
//                           backgroundColor:
//                             item?.ApprovalStatusColor || '#F5F5F5',
//                         },
//                       ]}>
//                       <Text
//                         style={[
//                           styles.txtStatus,
//                           {color: item?.ApprovalStatusTextColor || '#262626'},
//                         ]}>
//                         {item?.ResponsibilitiesName}
//                       </Text>
//                     </View>
//                   ) : null}
//                 </View>
//               </View>
//             </View>
//             <View style={styles.bodyCard}>
//               {/* <View style={styles.containerBody}>
//                 <SvgXml xml={cake_birthday} />
//                 <Text
//                   style={styles.contentBody}
//                   numberOfLines={2}
//                   ellipsizeMode="tail">
//                   {moment(item?.BirthDate).format('DD/MM/YYYY')}
//                 </Text>
//               </View> */}

//               {/* <View style={styles.containerBody}>
//                 <SvgXml xml={phone_green} />
//                 <Text
//                   style={styles.contentBody}
//                   numberOfLines={2}
//                   ellipsizeMode="tail">
//                   {item?.PhoneNumber}
//                 </Text>
//               </View>

//               <View style={styles.containerBody}>
//                 <SvgXml xml={envelope} />
//                 <Text
//                   style={styles.contentBody}
//                   numberOfLines={2}
//                   ellipsizeMode="tail">
//                   {item?.Email}
//                 </Text>
//               </View> */}
//               <TouchableOpacity
//                 onPress={() => handleCall(item?.PhoneNumber)}
//                 style={styles.containerBody}
//                 activeOpacity={0.7}>
//                 <SvgXml xml={phone_green} />
//                 <Text
//                   style={styles.contentBody}
//                   numberOfLines={2}
//                   ellipsizeMode="tail">
//                   {item?.PhoneNumber}
//                 </Text>
//               </TouchableOpacity>

//               {/* EMAIL: touch to mail */}
//               <TouchableOpacity
//                 onPress={() => handleEmail(item?.Email)}
//                 style={styles.containerBody}
//                 activeOpacity={0.7}>
//                 <SvgXml xml={envelope} />
//                 <Text
//                   style={styles.contentBody}
//                   numberOfLines={2}
//                   ellipsizeMode="tail">
//                   {item?.Email}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//           {/* <View style={{marginLeft: scale(10), marginTop: scale(10)}}>
//             <Text
//               style={[styles.contentBody, {color: colors.red,fontFamily:'Inter-Medium',fontWeight:'500'}]}
//               numberOfLines={5}
//               ellipsizeMode="tail">
//               ! Các thông tin liên hệ được yêu cầu bắt buộc: {'\n'}- Người liên
//               hệ đặt hàng,{'\n'}- Người liên hệ nhận hàng,{'\n'}- Người liên hệ
//               thanh toán,{'\n'}- Thông tin nhận hóa đơn.
//             </Text>
//           </View> */}
//           <View
//             style={
//               disable === true &&
//               index !== listContact?.length - 1 &&
//               styles.bodyCard1
//             }></View>
//         </Button>
//       );
//     },
//     [handleDelete, handleEditContact],
//   );

//   return (
//     <View style={styles.container}>
//       {/* {disable === false && (
//         <Button onPress={openShowModal} style={styles.btnAddContact}>
//           <Text style={styles.txtBtnAdd}>{languageKey('_add_contact')}</Text>
//         </Button>
//       )} */}
//       {disable === false && (
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             backgroundColor: colors.graySystem2,
//             paddingVertical: scale(12),
//           }}>
//           <Text
//             style={{
//               fontSize: fontSize.size16,
//               fontWeight: '600',
//               lineHeight: scale(24),
//               fontFamily: 'Inter-SemiBold',
//               color: colors.black,
//               marginTop: scale(0),
//               marginHorizontal: scale(12),
//               marginBottom: scale(0),
//             }}>
//             {languageKey('_contact_info')}
//           </Text>

//           <Button
//             style={{
//               marginRight: scale(12),
//             }}
//             onPress={openShowModal}>
//             <Text
//               style={{
//                 color: colors.blue,
//                 fontWeight: '500',
//                 fontFamily: 'Inter-Medium',
//                 fontSize: fontSize.size14,
//                 lineHeight: scale(22),
//               }}>
//               {languageKey('add')}
//             </Text>
//           </Button>
//         </View>
//       )}
//       {isShowModalContact && disable === false && (
//         <View>
//           <Modal
//             isVisible={isShowModalContact}
//             useNativeDriver={true}
//             onBackdropPress={closeModal}
//             onBackButtonPress={closeModal}
//             backdropTransitionOutTiming={450}
//             avoidKeyboard={true}
//             style={styles.modal}>
//             <View style={styles.optionsModalContainer}>
//               <View style={styles.headerModal}>
//                 <View style={styles.btnClose}>
//                   <SvgXml xml={close_white} />
//                 </View>
//                 <Text style={styles.titleModal}>
//                   {languageKey('_new_contact')}
//                 </Text>
//                 <Button onPress={closeModal} style={styles.btnClose}>
//                   <SvgXml xml={close_red} />
//                 </Button>
//               </View>
//               <ScrollView
//                 style={styles.modalContainer}
//                 showsVerticalScrollIndicator={false}>
//                 {/* <View style={styles.row}>
//                   <View>
//                     <Text style={styles.txtItem}>{languageKey('_status')}</Text>
//                     <Text style={styles.txtDescription}>
//                       {languageKey('_active')}
//                     </Text>
//                   </View>
//                   <Switch
//                     value={isadd ? true : switchStates}
//                     onValueChange={handleSwitchToggle}
//                   />
//                 </View> */}
//                 <InputDefault
//                   name="ID"
//                   returnKeyType="next"
//                   style={styles.input}
//                   value={'Auto'}
//                   label={'ID'}
//                   isEdit={false}
//                   placeholderInput={true}
//                   bgColor={'#E5E7EB'}
//                   labelHolder={'Auto'}
//                   {...{
//                     touched,
//                     errors,
//                     handleBlur,
//                     handleChange,
//                     setFieldValue,
//                   }}
//                 />
//                 <InputDefault
//                   name="Name"
//                   returnKeyType="next"
//                   style={styles.input}
//                   value={values?.Name}
//                   label={languageKey('_full_name_vi')}
//                   isEdit={true}
//                   placeholderInput={true}
//                   labelHolder={languageKey('_enter_content')}
//                   bgColor={'#F9FAFB'}
//                   {...{
//                     touched,
//                     errors,
//                     handleBlur,
//                     handleChange,
//                     setFieldValue,
//                   }}
//                 />
//                 {/* <InputDefault
//                   name="NameExtention1"
//                   returnKeyType="next"
//                   style={styles.input}
//                   value={values?.NameExtention1}
//                   label={languageKey('_full_name_en')}
//                   isEdit={true}
//                   placeholderInput={true}
//                   labelHolder={languageKey('_enter_content')}
//                   bgColor={'#F9FAFB'}
//                   {...{
//                     touched,
//                     errors,
//                     handleBlur,
//                     handleChange,
//                     setFieldValue,
//                   }}
//                 /> */}
//                 <View style={{width: '100%'}}>
//                   {/* <ModalSelectDate
//                       title={languageKey('_contact_birthday')}
//                       showDatePicker={showDatePicker}
//                       hideDatePicker={hideDatePicker}
//                       initialValue={selectedValue}
//                       selectedValueSelected={setSelectedValue}
//                       isDatePickerVisible={isDatePickerVisible}
//                       selectSubmitForm={setSelectedValueSubmitForm}
//                       bgColor={'#F9FAFB'}
//                     /> */}
//                 </View>
//                 <View style={styles.input}>
//                   <CardModalSelect
//                     title={languageKey('_position')}
//                     data={listPositions}
//                     setValue={setSelectedValuePosition}
//                     value={selectedValuePosition?.Name}
//                     bgColor={'#F9FAFB'}
//                     require={true}
//                   />
//                 </View>
//                 <InputDefault
//                   name="PhoneNumber"
//                   returnKeyType="next"
//                   style={styles.input}
//                   value={values?.PhoneNumber}
//                   label={languageKey('_phone')}
//                   isEdit={true}
//                   string={true}
//                   keyboardType={'numeric'}
//                   placeholderInput={true}
//                   labelHolder={languageKey('_enter_phone')}
//                   bgColor={'#F9FAFB'}
//                   require={
//                     selectedValuePosition?.Code !== 'Z99999' ? true : false
//                   }
//                   {...{
//                     touched,
//                     errors,
//                     handleBlur,
//                     handleChange,
//                     setFieldValue,
//                   }}
//                 />
//                 <InputDefault
//                   name="Email"
//                   returnKeyType="next"
//                   style={styles.input}
//                   value={values?.Email}
//                   label={'Email'}
//                   isEdit={true}
//                   placeholderInput={true}
//                   labelHolder={languageKey('_enter_mail')}
//                   bgColor={'#F9FAFB'}
//                   require={
//                     selectedValuePosition?.Code === 'Z99999' ? true : false
//                   }
//                   {...{
//                     touched,
//                     errors,
//                     handleBlur,
//                     handleChange,
//                     setFieldValue,
//                   }}
//                 />
//                 <InputDefault
//                   name="Note"
//                   returnKeyType="next"
//                   style={styles.input}
//                   value={values?.Note}
//                   label={languageKey('_note')}
//                   isEdit={true}
//                   placeholderInput={true}
//                   labelHolder={languageKey('_enter_notes')}
//                   bgColor={'#F9FAFB'}
//                   {...{
//                     touched,
//                     errors,
//                     handleBlur,
//                     handleChange,
//                     setFieldValue,
//                   }}
//                 />
//                 <View style={styles.footer}>
//                   <Button
//                     style={styles.btnFooterModal}
//                     onPress={handleAddNewContact}>
//                     <Text style={styles.txtBtnFooterModal}>
//                       {languageKey('_add_contact')}
//                     </Text>
//                   </Button>
//                 </View>
//               </ScrollView>
//             </View>
//           </Modal>
//         </View>
//       )}
//       <FlatList
//         data={listContact}
//         renderItem={_renderItem}
//         keyExtractor={_keyExtractor}
//       />
//       <View style={{marginLeft: scale(10), marginTop: scale(10)}}>
//         <Text
//           style={[
//             styles.contentBody,
//             {color: colors.red, fontFamily: 'Inter-Medium', fontWeight: '500'},
//           ]}
//           numberOfLines={5}
//           ellipsizeMode="tail">
//           ! Các thông tin liên hệ được yêu cầu bắt buộc: {'\n'}- Người liên hệ
//           đặt hàng,{'\n'}- Người liên hệ nhận hàng,{'\n'}- Người liên hệ thanh
//           toán,{'\n'}- Thông tin nhận hóa đơn.
//         </Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: colors.white,
//     alignContent: 'center',
//     paddingVertical: scale(8),
//   },
//   txtBtnAdd: {
//     color: colors.blue,
//     fontWeight: '500',
//     fontFamily: 'Inter-Medium',
//     fontSize: fontSize.size14,
//   },
//   label: {
//     color: colors.black,
//     fontWeight: '500',
//     fontFamily: 'Inter-Medium',
//     fontSize: fontSize.size14,
//     lineHeight: scale(22),
//     marginHorizontal: scale(16),
//     marginTop: scale(4),
//   },
//   btnAddContact: {
//     borderWidth: scale(1),
//     borderColor: colors.blue,
//     borderRadius: scale(12),
//     height: hScale(38),
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginHorizontal: scale(12),
//   },
//   modal: {
//     margin: 0,
//     justifyContent: 'flex-end',
//   },
//   optionsModalContainer: {
//     height: height / 1.5,
//   },
//   modalContainer: {
//     overflow: 'hidden',
//     backgroundColor: colors.white,
//     maxHeight: height / 1.5,
//   },
//   headerModal: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderBottomWidth: scale(1),
//     borderBottomColor: colors.graySystem2,
//     backgroundColor: colors.white,
//     borderTopLeftRadius: scale(8),
//     borderTopRightRadius: scale(8),
//     paddingVertical: scale(10),
//     paddingHorizontal: scale(12),
//   },
//   titleModal: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: fontSize.size16,
//     lineHeight: scale(24),
//     fontWeight: '600',
//     color: colors.black,
//     flex: 1,
//     textAlign: 'center',
//   },
//   btnFooterModal: {
//     alignItems: 'center',
//     backgroundColor: colors.blue,
//     borderRadius: scale(12),
//     height: hScale(38),
//     paddingVertical: scale(Platform.OS === 'android' ? 6 : 8),
//     marginTop: scale(12),
//     marginBottom: scale(Platform.OS === 'ios' ? 24 : 12),
//     marginHorizontal: scale(12),
//   },
//   txtBtnFooterModal: {
//     color: colors.white,
//     fontSize: fontSize.size14,
//     fontWeight: '600',
//     fontFamily: 'Inter-SemiBold',
//     lineHeight: scale(22),
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginHorizontal: scale(12),
//     marginTop: scale(12),
//     backgroundColor: colors.white,
//   },
//   txtItem: {
//     fontFamily: 'Inter-Medium',
//     fontWeight: '500',
//     fontSize: fontSize.size14,
//     lineHeight: scale(22),
//     color: colors.black,
//   },
//   txtDescription: {
//     fontFamily: 'Inter-Regular',
//     fontWeight: '400',
//     fontSize: fontSize.size12,
//     lineHeight: scale(18),
//     color: '#6B6F80',
//   },
//   input: {
//     marginHorizontal: scale(12),
//     marginVertical: scale(4),
//   },
//   cardProgram: {
//     backgroundColor: colors.white,
//     marginHorizontal: scale(12),
//     marginTop: scale(18),
//     borderRadius: scale(8),
//     borderWidth: scale(1),
//     borderColor: colors.borderColor,
//   },
//   cardProgram1: {
//     backgroundColor: colors.white,
//     marginHorizontal: scale(12),
//     marginTop: scale(0),
//     borderRadius: scale(8),
//     // borderWidth: scale(1),
//     // borderColor: colors.borderColor,
//   },
//   itemBody_two: {
//     flexDirection: 'row',
//     borderRadius: scale(12),
//     padding: scale(8),
//   },
//   itemBody_two1: {
//     flexDirection: 'row',
//     borderRadius: scale(12),
//     paddingHorizontal: scale(8),
//   },
//   containerItem: {
//     justifyContent: 'flex-end',
//     flex: 1,
//   },
//   containerHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   containerStatus: {
//     flexDirection: 'row',
//     marginVertical: scale(4),
//   },
//   txtTitleItem: {
//     fontSize: fontSize.size16,
//     fontWeight: '600',
//     lineHeight: scale(24),
//     fontFamily: 'Inter-SemiBold',
//     color: colors.black,
//   },
//   bodyStatus: {
//     borderRadius: scale(4),
//     paddingHorizontal: scale(6),
//     paddingVertical: scale(2),
//     marginRight: scale(8),
//     width: 'auto',
//   },
//   txtStatus: {
//     fontSize: fontSize.size12,
//     fontWeight: '500',
//     lineHeight: scale(18),
//     fontFamily: 'Inter-Medium',
//   },
//   contentBody: {
//     fontSize: fontSize.size14,
//     fontWeight: '400',
//     lineHeight: scale(22),
//     fontFamily: 'Inter-Regular',
//     color: colors.black,
//     marginLeft: scale(4),
//     overflow: 'hidden',
//     width: '90%',
//   },
//   containerBody: {
//     flexDirection: 'row',
//     marginHorizontal: scale(8),
//     alignItems: 'center',
//     marginBottom: scale(4),
//   },
//   header: {
//     fontSize: fontSize.size16,
//     fontWeight: '600',
//     lineHeight: scale(24),
//     fontFamily: 'Inter-SemiBold',
//     color: colors.black,
//     marginTop: scale(0),
//     marginHorizontal: scale(12),
//     marginBottom: scale(0),
//   },
//   btnShowInfor: {
//     marginRight: scale(12),
//   },
//   bodyCard1: {
//     height: scale(1),
//     width: '100%',
//     backgroundColor: colors.gray200,
//     marginBottom: scale(8),
//     marginTop: scale(4),
//     marginHorizontal: scale(16),
//   },
// });

// export default ModalContact;
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import moment from 'moment';
import {useFormik} from 'formik';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import {SvgXml} from 'react-native-svg';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  ScrollView,
  Dimensions,
  Alert,
  Linking,
  TouchableOpacity,
} from 'react-native';

import {Button} from '../buttons';
import {colors, fontSize} from 'themes';
import {hScale, scale} from '@resolutions';
import {translateLang} from 'store/accLanguages/slide';
import {
  InputDefault,
  Switch,
  CardModalSelect,
  ModalSelectDate,
} from 'components';
import {
  cake_birthday,
  close_red,
  close_white,
  envelope,
  phone_green,
  three_dot,
  trash_22,
} from 'svgImg';

const {height} = Dimensions.get('window');

const ModalContact = ({
  setValueContact,
  dataEdit,
  parentID,
  cmpnID,
  disable = false,
  isadd = false,
  TN = false,
}) => {
  const languageKey = useSelector(translateLang);
  const {listPositions} = useSelector(state => state.CustomerProfile);
  const [isShowModalContact, setIsShowModalContact] = useState(false);
  const [listContact, setListContact] = useState([]);
  const [switchStates, setSwitchStates] = useState(true);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedValueSubmitForm, setSelectedValueSubmitForm] = useState();
  const [selectedValue, setSelectedValue] = useState();
  const [selectedValuePosition, setSelectedValuePosition] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  // console.log('selectedValuePosition',listPositions)
  // trạng thái required checklist
  const [requiredStatus, setRequiredStatus] = useState({
    Z00002: false, // Người liên hệ đặt hàng
    Z00004: false, // Người liên hệ nhận hàng
    Z00003: false, // Người liên hệ thanh toán
    Z99999: false, // Thông tin nhận hóa đơn
  });

  const openShowModal = () => {
    setIsShowModalContact(true);
  };

  const closeModal = () => {
    setIsShowModalContact(false);
  };

  const handleSwitchToggle = () => {
    setSwitchStates(!switchStates);
  };

  const initialValues = {
    CategoryType: 'Contact',
    IsActive: 0,
    Name: '',
    NameExtention1: '',
    BirthDate: '',
    ResponsibilitiesID: 0,
    ID: 0,
    CustomerID: 0,
    Email: '',
    PhoneNumber: '',
    Note: '',
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    validateForm,
    setFieldTouched,
  } = useFormik({
    initialValues,
    validate: values => {
      const errors = {};

      const phone = values.PhoneNumber?.toString().trim() || '';

      // Trường hợp bắt buộc nhập (Code != Z99999)
      if (
        selectedValuePosition?.Code !== 'Z99999' &&
        selectedValuePosition?.Code !== 'Z99997' &&
        selectedValuePosition?.Code !== 'Z99998'
      ) {
        if (!phone) {
          errors.PhoneNumber = 'Số điện thoại là bắt buộc';
        } else if (phone.length <= 7) {
          errors.PhoneNumber = 'Số điện thoại phải lớn hơn 7 chữ số';
        }
      } else {
        // Không bắt buộc, nhưng nếu có nhập thì vẫn kiểm tra hợp lệ
        if (phone && phone.length <= 7) {
          errors.PhoneNumber = 'Số điện thoại phải lớn hơn 7 chữ số';
        }
      }

      return errors;
    },
  });

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleEditContact = (contactToEdit, index) => {
    setFieldValue('Name', contactToEdit?.Name || '');
    setFieldValue('NameExtention1', contactToEdit?.NameExtention1 || '');
    setFieldValue('Email', contactToEdit?.Email || '');
    setFieldValue('PhoneNumber', contactToEdit?.PhoneNumber || '');
    setFieldValue('Note', contactToEdit?.Note || '');

    setSelectedValue(contactToEdit?.BirthDate || '');
    setSelectedValueSubmitForm(contactToEdit?.BirthDate || '');
    setSelectedValuePosition({
      ID: contactToEdit?.ResponsibilitiesID,
      Name:
        listPositions?.find(r => r.ID === contactToEdit?.ResponsibilitiesID)
          ?.Name || '',
      Code:
        listPositions?.find(r => r.ID === contactToEdit?.ResponsibilitiesID)
          ?.Code || '',
    });
    setSwitchStates(contactToEdit?.IsActive === 1);
    setEditingIndex(index);
    setIsShowModalContact(true);
  };

  // const handleAddNewContact = async () => {
  //   const formErrors = await validateForm();
  //   if (!selectedValuePosition?.Name) {
  //     Alert.alert('Lỗi bắt buộc nhập chức vụ');
  //     return;
  //   }
  //   if (formErrors.PhoneNumber && selectedValuePosition?.Code !== 'Z99999') {
  //     setFieldTouched('PhoneNumber', true);
  //     Alert.alert('Lỗi', formErrors.PhoneNumber);
  //     return;
  //   }
  //   if (!values?.Email && selectedValuePosition?.Code === 'Z99999') {
  //     Alert.alert('Vui lòng nhập email');
  //     return;
  //   }
  //   const newContact = {
  //     CategoryType: 'Contact',
  //     IsActive: switchStates ? 1 : 0,
  //     Name: values?.Name,
  //     NameExtention1: values?.NameExtention1 || '',
  //     BirthDate: moment(new Date()).format('YYYY-MM-DD'),
  //     ResponsibilitiesID: selectedValuePosition?.ID || 0,
  //     ResponsibilitiesName: selectedValuePosition?.Name || '',
  //     ResponsibilitiesCode: selectedValuePosition?.Code || '',
  //     CmpnID: cmpnID?.toString(),
  //     Email: values?.Email,
  //     PhoneNumber: values?.PhoneNumber,
  //     Note: values?.Note,
  //     ID: 0,
  //     CustomerID: parentID || 0,
  //   };
  //   if (editingIndex !== null) {
  //     const updatedList = [...listContact];
  //     updatedList[editingIndex] = newContact;
  //     setListContact(updatedList);
  //     setValueContact(updatedList);
  //   } else {
  //     setListContact(prev => [...prev, newContact]);
  //     // nếu setValueContact có kiểu undefined ban đầu thì bấm thêm phải xử lý an toàn
  //     setValueContact(prev =>
  //       Array.isArray(prev) ? [...prev, newContact] : [newContact],
  //     );
  //   }
  //   resetForm();
  //   setSelectedValue(new Date());
  //   setSelectedValuePosition(null);
  //   closeModal();
  //   setEditingIndex(null);
  // };
  const handleAddNewContact = async () => {
    const formErrors = await validateForm();
    if (
      !values?.Name &&
      !['Z99999', 'Z99997', 'Z99998'].includes(selectedValuePosition?.Code)
    ) {
      Alert.alert('Vui lòng nhập tên liên hệ');
      return;
    }
    if (!selectedValuePosition?.Name) {
      Alert.alert('Lỗi bắt buộc nhập chức vụ');
      return;
    }
    if (formErrors.PhoneNumber && selectedValuePosition?.Code !== 'Z99999') {
      setFieldTouched('PhoneNumber', true);
      Alert.alert('Lỗi', formErrors.PhoneNumber);
      return;
    }
    if (!values?.Email && selectedValuePosition?.Code === 'Z99999') {
      Alert.alert('Vui lòng nhập email');
      return;
    }

    // hàm helper chuẩn hoá số điện thoại để so sánh (giữ + nếu có, bỏ ký tự khác)
    const normalizePhone = ph => {
      if (!ph && ph !== 0) return '';
      const s = String(ph).trim();
      // nếu bắt đầu bằng + thì giữ + rồi xóa phần còn lại không phải chữ số
      if (s.startsWith('+')) {
        return '+' + s.slice(1).replace(/[^0-9]/g, '');
      }
      return s.replace(/[^0-9]/g, '');
    };

    const newPhoneNorm = normalizePhone(values?.PhoneNumber);
    const newCode = selectedValuePosition?.Code || '';

    // kiểm tra trùng trong listContact
    const duplicateIndex = listContact.findIndex((c, idx) => {
      const cCode =
        c?.ResponsibilitiesCode ||
        (c?.ResponsibilitiesID ? getCodeById(c.ResponsibilitiesID) : '') ||
        '';
      const cPhoneNorm = normalizePhone(c?.PhoneNumber);
      // nếu đang edit, bỏ qua chính phần tử đang edit (so sánh bằng index)
      if (editingIndex !== null && idx === editingIndex) return false;
      return (
        cCode === newCode && cPhoneNorm === newPhoneNorm && newPhoneNorm !== ''
      );
    });

    if (duplicateIndex !== -1) {
      Alert.alert(
        'Lỗi',
        'Đã tồn tại liên hệ với cùng chức vụ và số điện thoại.',
      );
      return;
    }

    const newContact = {
      CategoryType: 'Contact',
      IsActive: switchStates ? 1 : 0,
      Name: values?.Name,
      NameExtention1: values?.NameExtention1 || '',
      BirthDate: moment(new Date()).format('YYYY-MM-DD'),
      ResponsibilitiesID: selectedValuePosition?.ID || 0,
      ResponsibilitiesName: selectedValuePosition?.Name || '',
      ResponsibilitiesCode: selectedValuePosition?.Code || '',
      CmpnID: cmpnID?.toString(),
      Email: values?.Email,
      PhoneNumber: values?.PhoneNumber,
      Note: values?.Note,
      ID: 0,
      CustomerID: parentID || 0,
    };

    if (editingIndex !== null) {
      const updatedList = [...listContact];
      updatedList[editingIndex] = newContact;
      setListContact(updatedList);
      setValueContact(updatedList);
    } else {
      setListContact(prev => [...prev, newContact]);
      setValueContact(prev =>
        Array.isArray(prev) ? [...prev, newContact] : [newContact],
      );
    }
    resetForm();
    setSelectedValue(new Date());
    setSelectedValuePosition(null);
    closeModal();
    setEditingIndex(null);
  };

  const handleDelete = contactToDelete => {
    const updated = listContact.filter(item => item !== contactToDelete);
    setListContact(updated);
    setValueContact(updated);
  };

  useEffect(() => {
    if (dataEdit && dataEdit.length > 0) {
      const convertedData = dataEdit.map(item => ({
        ID: item?.ID || 0,
        CustomerID: parentID,
        CategoryType: 'Contact',
        IsActive: item?.IsActive ?? 0,
        Name: item?.Name || '',
        CmpnID: item?.CmpnID?.toString(),
        NameExtention1: item?.NameExtention1 || '',
        BirthDate: item?.BirthDate || '',
        ResponsibilitiesID: item?.ResponsibilitiesID || 0,
        ResponsibilitiesName: item?.ResponsibilitiesName || '',
        ResponsibilitiesCode:
          item?.ResponsibilitiesCode || item?.ResponsibilitiesCode || '',
        Email: item?.Email || '',
        PhoneNumber: item?.PhoneNumber || '',
        Note: item?.Note || '',
      }));
      setListContact(convertedData);
      setValueContact(convertedData);
    }
  }, [dataEdit]);
  const getCodeById = id => {
    const pos = listPositions?.find(p => Number(p.ID) === Number(id));
    return pos ? pos.Code || '' : '';
  };
  useEffect(() => {
    const codes = {
      Z00002: false,
      Z00004: false,
      Z00003: false,
      Z99999: false,
    };
    listContact.forEach(c => {
      const codeFromItem =
        c?.ResponsibilitiesCode || getCodeById(c?.ResponsibilitiesID);
      if (codeFromItem && codes.hasOwnProperty(codeFromItem)) {
        codes[codeFromItem] = true;
      }
    });
    setRequiredStatus(codes);
  }, [listContact, listPositions]);

  useEffect(() => {
    if (listContact.length > 0 && listPositions?.length > 0) {
      const updated = listContact.map(c => {
        if (!c.ResponsibilitiesCode && c.ResponsibilitiesID) {
          return {
            ...c,
            ResponsibilitiesCode: getCodeById(c.ResponsibilitiesID),
          };
        }
        return c;
      });
      // nếu khác mới set để tránh vòng lặp vô hạn
      const isDifferent =
        JSON.stringify(updated) !== JSON.stringify(listContact);
      if (isDifferent) {
        setListContact(updated);
        setValueContact(updated);
      }
    }
  }, [listPositions]);

  const handleCall = async phone => {
    if (!phone) {
      Alert.alert(
        '',
        languageKey ? languageKey('_no_phone_number') : 'No phone number',
      );
      return;
    }
    const cleaned = String(phone)
      .trim()
      .replace(/[^+\d]/g, '');
    const url = `tel:${cleaned}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          '',
          languageKey
            ? languageKey('_cannot_make_call')
            : 'Cannot make a call from this device',
        );
      }
    } catch (err) {
      console.warn('handleCall error', err);
      Alert.alert(
        '',
        languageKey ? languageKey('_cannot_make_call') : 'Cannot make a call',
      );
    }
  };

  const handleEmail = async email => {
    if (!email) {
      Alert.alert(
        '',
        languageKey ? languageKey('_no_email') : 'No email address',
      );
      return;
    }
    const cleaned = String(email).trim();
    const subject = encodeURIComponent('');
    const body = encodeURIComponent('');
    const url = `mailto:${cleaned}?subject=${subject}&body=${body}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          '',
          languageKey
            ? languageKey('_cannot_open_mail')
            : 'Cannot open mail app',
        );
      }
    } catch (err) {
      console.warn('handleEmail error', err);
      Alert.alert(
        '',
        languageKey ? languageKey('_cannot_open_mail') : 'Cannot open mail app',
      );
    }
  };

  const _keyExtractor = (item, index) => `${item?.ID}-${index}`;
  const _renderItem = useCallback(
    ({item, index}) => {
      return (
        <Button onPress={() => handleEditContact(item, index)}>
          <View style={disable ? styles.cardProgram1 : styles.cardProgram}>
            <View style={disable ? styles.itemBody_two1 : styles.itemBody_two}>
              <View style={styles.containerItem}>
                <View style={styles.containerHeader}>
                  <Text style={styles.txtTitleItem}>{item?.Name}</Text>
                  {disable === false && (
                    <Button onPress={() => handleDelete(item)}>
                      <SvgXml xml={trash_22} />
                    </Button>
                  )}
                </View>
                <View style={styles.containerStatus}>
                  {item?.ResponsibilitiesName ? (
                    <View
                      style={[
                        styles.bodyStatus,
                        {
                          backgroundColor:
                            item?.ApprovalStatusColor || '#F5F5F5',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.txtStatus,
                          {color: item?.ApprovalStatusTextColor || '#262626'},
                        ]}>
                        {item?.ResponsibilitiesName}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
            <View style={styles.bodyCard}>
              <TouchableOpacity
                onPress={() => handleCall(item?.PhoneNumber)}
                style={styles.containerBody}
                activeOpacity={0.7}>
                <SvgXml xml={phone_green} />
                <Text
                  style={styles.contentBody}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {item?.PhoneNumber}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleEmail(item?.Email)}
                style={styles.containerBody}
                activeOpacity={0.7}>
                <SvgXml xml={envelope} />
                <Text
                  style={styles.contentBody}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {item?.Email}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={
              disable === true &&
              index !== listContact?.length - 1 &&
              styles.bodyCard1
            }></View>
        </Button>
      );
    },
    [handleDelete, handleEditContact, listContact],
  );

  // RENDER checklist item: label + tick or placeholder
  const ChecklistRow = ({label, checked}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: scale(6),
          marginHorizontal: scale(12),
        }}>
        <View
          style={{
            width: scale(18),
            height: scale(18),
            borderRadius: scale(4),
            borderWidth: 1,
            borderColor: checked ? colors.blue : '#D1D5DB',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: checked ? colors.blue + '11' : 'transparent',
            marginRight: scale(10),
          }}>
          {checked ? (
            <Text
              style={{
                color: colors.blue,
                fontSize: fontSize.size12,
                fontWeight: '700',
              }}>
              ✓
            </Text>
          ) : (
            <View
              style={{
                width: scale(10),
                height: scale(10),
                borderRadius: scale(2),
                backgroundColor: '#F3F4F6',
              }}
            />
          )}
        </View>
        <Text
          style={[
            styles.contentBody,
            {color: checked ? colors.blue : colors.black},
          ]}>
          {label}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {disable === false && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: colors.graySystem2,
            paddingVertical: scale(12),
          }}>
          <Text
            style={{
              fontSize: fontSize.size16,
              fontWeight: '600',
              lineHeight: scale(24),
              fontFamily: 'Inter-SemiBold',
              color: colors.black,
              marginTop: scale(0),
              marginHorizontal: scale(12),
              marginBottom: scale(0),
            }}>
            {languageKey('_contact_info')}
          </Text>

          <Button
            style={{
              marginRight: scale(12),
            }}
            onPress={openShowModal}>
            <Text
              style={{
                color: colors.blue,
                fontWeight: '500',
                fontFamily: 'Inter-Medium',
                fontSize: fontSize.size14,
                lineHeight: scale(22),
              }}>
              {languageKey('add')}
            </Text>
          </Button>
        </View>
      )}
      {isShowModalContact && disable === false && (
        <View>
          <Modal
            isVisible={isShowModalContact}
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
                  {languageKey('_new_contact')}
                </Text>
                <Button onPress={closeModal} style={styles.btnClose}>
                  <SvgXml xml={close_red} />
                </Button>
              </View>
              <ScrollView
                style={styles.modalContainer}
                showsVerticalScrollIndicator={false}>
                <InputDefault
                  name="ID"
                  returnKeyType="next"
                  style={styles.input}
                  value={'Auto'}
                  label={'ID'}
                  isEdit={false}
                  placeholderInput={true}
                  bgColor={'#E5E7EB'}
                  labelHolder={'Auto'}
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />
                <InputDefault
                  name="Name"
                  returnKeyType="next"
                  style={styles.input}
                  value={values?.Name}
                  label={languageKey('_full_name_vi')}
                  isEdit={true}
                  placeholderInput={true}
                  labelHolder={languageKey('_enter_content')}
                  bgColor={'#F9FAFB'}
                  require={
                    !['Z99999', 'Z99997', 'Z99998'].includes(
                      selectedValuePosition?.Code,
                    )
                      ? true
                      : false
                  }
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />
                <View style={{width: '100%'}} />
                <View style={styles.input}>
                  <CardModalSelect
                    title={languageKey('_position')}
                    data={
                      [
                        listPositions?.find?.(item => item?.Code === 'Z99999'),
                        ...listPositions?.filter?.(
                          item => item?.Code !== 'Z99999',
                        ),
                      ] || listPositions
                    }
                    setValue={val => {
                      setSelectedValuePosition(val);
                    }}
                    value={selectedValuePosition?.Name}
                    bgColor={'#F9FAFB'}
                    nofilter={true}
                    require={true}
                  />
                </View>
                <InputDefault
                  name="PhoneNumber"
                  returnKeyType="next"
                  style={styles.input}
                  value={values?.PhoneNumber}
                  label={languageKey('_phone')}
                  isEdit={true}
                  string={true}
                  keyboardType={'numeric'}
                  placeholderInput={true}
                  labelHolder={languageKey('_enter_phone')}
                  bgColor={'#F9FAFB'}
                  require={
                    !['Z99999', 'Z99997', 'Z99998'].includes(
                      selectedValuePosition?.Code,
                    )
                      ? true
                      : false
                  }
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />
                <InputDefault
                  name="Email"
                  returnKeyType="next"
                  style={styles.input}
                  value={values?.Email}
                  label={'Email'}
                  isEdit={true}
                  placeholderInput={true}
                  labelHolder={languageKey('_enter_mail')}
                  bgColor={'#F9FAFB'}
                  require={
                    ['Z99999', 'Z99997', 'Z99998'].includes(
                      selectedValuePosition?.Code,
                    )
                      ? true
                      : false
                  }
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />
                <InputDefault
                  name="Note"
                  returnKeyType="next"
                  style={styles.input}
                  value={values?.Note}
                  label={languageKey('_note')}
                  isEdit={true}
                  placeholderInput={true}
                  labelHolder={languageKey('_enter_notes')}
                  bgColor={'#F9FAFB'}
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />
                <View style={styles.footer}>
                  <Button
                    style={styles.btnFooterModal}
                    onPress={handleAddNewContact}>
                    <Text style={styles.txtBtnFooterModal}>
                      {languageKey('_add_contact')}
                    </Text>
                  </Button>
                </View>
              </ScrollView>
            </View>
          </Modal>
        </View>
      )}
      <FlatList
        data={listContact}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
      />

      {/* CHECKLIST yêu cầu 4 thông tin */}
      {TN === true ? null : (
        <View style={{marginLeft: scale(10), marginTop: scale(10)}}>
          <Text
            style={[
              styles.contentBody,
              {fontWeight: '600', marginBottom: scale(8), color: colors.red},
            ]}>
            ! {'Các thông tin liên hệ được yêu cầu bắt buộc:'}
          </Text>

          <ChecklistRow
            label={'Người liên hệ đặt hàng'}
            checked={requiredStatus.Z00002}
          />
          <ChecklistRow
            label={'Người liên hệ nhận hàng'}
            checked={requiredStatus.Z00004}
          />
          <ChecklistRow
            label={'Người liên hệ thanh toán'}
            checked={requiredStatus.Z00003}
          />
          <ChecklistRow
            label={'Thông tin nhận hóa đơn'}
            checked={requiredStatus.Z99999}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    alignContent: 'center',
    paddingVertical: scale(8),
  },
  txtBtnAdd: {
    color: colors.blue,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    fontSize: fontSize.size14,
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
    height: height / 1.5,
  },
  modalContainer: {
    overflow: 'hidden',
    backgroundColor: colors.white,
    maxHeight: height / 1.5,
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: scale(1),
    borderBottomColor: colors.graySystem2,
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(8),
    borderTopRightRadius: scale(8),
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
    marginBottom: scale(Platform.OS === 'ios' ? 24 : 12),
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
    marginTop: scale(18),
    borderRadius: scale(8),
    borderWidth: scale(1),
    borderColor: colors.borderColor,
  },
  cardProgram1: {
    backgroundColor: colors.white,
    marginHorizontal: scale(12),
    marginTop: scale(0),
    borderRadius: scale(8),
  },
  itemBody_two: {
    flexDirection: 'row',
    borderRadius: scale(12),
    padding: scale(8),
  },
  itemBody_two1: {
    flexDirection: 'row',
    borderRadius: scale(12),
    paddingHorizontal: scale(8),
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
    marginVertical: scale(4),
  },
  txtTitleItem: {
    fontSize: fontSize.size16,
    fontWeight: '600',
    lineHeight: scale(24),
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
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
  header: {
    fontSize: fontSize.size16,
    fontWeight: '600',
    lineHeight: scale(24),
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
    marginTop: scale(0),
    marginHorizontal: scale(12),
    marginBottom: scale(0),
  },
  btnShowInfor: {
    marginRight: scale(12),
  },
  bodyCard1: {
    height: scale(1),
    width: '100%',
    backgroundColor: colors.gray200,
    marginBottom: scale(8),
    marginTop: scale(4),
    marginHorizontal: scale(16),
  },
});

export default ModalContact;
