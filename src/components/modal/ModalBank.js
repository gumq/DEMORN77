/* eslint-disable react-native/no-inline-styles */
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable quotes */
// /* eslint-disable prettier/prettier */
// import React, {useCallback, useEffect, useState} from 'react';
// import Modal from 'react-native-modal';
// import {useFormik} from 'formik';
// import {SvgXml} from 'react-native-svg';
// import {useSelector} from 'react-redux';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Platform,
//   FlatList,
//   ScrollView,
//   Dimensions,
// } from 'react-native';

// import {Button} from '../buttons';
// import {colors, fontSize} from 'themes';
// import {hScale, scale} from '@resolutions';
// import {translateLang} from 'store/accLanguages/slide';
// import {CardModalProvince, CardModalSelect, InputDefault} from 'components';
// import {
//   bank,
//   close_red,
//   close_white,
//   credit_card,
//   three_dot,
//   trash_22,
//   user_red,
// } from 'svgImg';

// const {height} = Dimensions.get('window');

// const ModalBank = ({
//   setValueBank,
//   dataEdit,
//   parentID,
//   cmpnID,
//   disable = false,
// }) => {
//   const languageKey = useSelector(translateLang);
//   const {listBanks, listNation} = useSelector(state => state.CustomerProfile);
//   const [isShowModalBank, setIsShowModalBank] = useState(false);
//   const [listBankNew, setListBank] = useState([]);
//   const [selectedValueBank, setSelectedValueBank] = useState(dataEdit);
//   const [selectedValueNation, setSelectedValueNation] = useState();
//   const [editingIndex, setEditingIndex] = useState(null);

//   const openShowModal = () => {
//     setIsShowModalBank(true);
//   };

//   const closeModal = () => {
//     setIsShowModalBank(false);
//   };

//   const initialValues = {
//     CategoryType: 'Bank',
//     BankID: 0,
//     NationID: 0,
//     CustomerID: 0,
//     IBAN: '',
//     AccountNumber: '',
//     AccountHolder: '',
//     Branch: '',
//     Note: '',
//     IsActive: 1,
//   };

//   const {
//     values,
//     errors,
//     touched,
//     handleChange,
//     handleBlur,
//     setFieldValue,
//     resetForm,
//   } = useFormik({
//     initialValues,
//   });

//   const handleEditBank = (item, index) => {
//     setSelectedValueBank({ID: item?.BankID, Name: item?.BankName});
//     const nation = listNation?.find(nation => nation?.ID === item?.NationID);
//     setSelectedValueNation(nation);

//     setFieldValue('IBAN', item?.IBAN || '');
//     setFieldValue('AccountNumber', item?.AccountNumber || '');
//     setFieldValue('AccountHolder', item?.AccountHolder || '');
//     setFieldValue('Branch', item?.Branch || '');
//     setFieldValue('Note', item?.Note || '');
//     setFieldValue('IsActive', 1 || 1);
//     setEditingIndex(index);
//     setIsShowModalBank(true);
//   };

//   const handleAddNewBank = () => {
//     const newBank = {
//       ID: 0,
//       CmpnID: cmpnID?.toString(),
//       CategoryType: 'Bank',
//       CustomerID: parentID || 0,
//       IBAN: values?.IBAN,
//       BankID: selectedValueBank?.ID,
//       BankName: selectedValueBank?.Name,
//       NationID: selectedValueNation?.ID,
//       AccountNumber: values?.AccountNumber,
//       AccountHolder: values?.AccountHolder,
//       Branch: values?.Branch,
//       Note: values?.Note,
//       IsActive: 1,
//     };

//     if (editingIndex !== null) {
//       const updatedList = [...listBankNew];
//       updatedList[editingIndex] = newBank;
//       setListBank(updatedList);
//       setValueBank(updatedList);
//     } else {
//       setListBank(prev => [...prev, newBank]);
//       setValueBank(prev => [...prev, newBank]);
//     }

//     resetForm();
//     setSelectedValueBank(null);
//     setSelectedValueNation(null);
//     setEditingIndex(null);
//     closeModal();
//   };

//   useEffect(() => {
//     if (dataEdit && dataEdit.length > 0) {
//       const convertedData = dataEdit.map(item => ({
//         ID: item?.ID,
//         CmpnID: item?.CmpnID?.toString(),
//         CategoryType: 'Bank',
//         BankID: item.BankID || 0,
//         BankName: item.BankName || '',
//         NationID: item.NationID || 0,
//         CustomerID: parentID || 0,
//         IBAN: item?.IBAN || '',
//         AccountNumber: item.AccountNumber || '',
//         AccountHolder: item.AccountHolder || '',
//         Branch: item.Branch || '',
//         Note: item.Note || '',
//         IsActive: 1,
//       }));
//       setListBank(convertedData);
//       setValueBank(convertedData);
//     }
//   }, [dataEdit]);

//   const handleDelete = bank => {
//     setListBank(prev => prev.filter(item => item !== bank));
//     setValueBank(prev => prev.filter(item => item !== bank));
//   };

//   const _keyExtractor = (item, index) => `${item.AccountNumber}-${index}`;
//   const _renderItem = useCallback(
//     ({item, index}) => {
//       return (
//         <Button onPress={() => handleEditBank(item, index)}>
//           <View style={disable ? styles.cardProgram1 : styles.cardProgram}>
//             <View style={disable ? styles.itemBody_two1 : styles.itemBody_two}>
//               <View style={styles.containerItem}>
//                 <View style={styles.containerHeader}>
//                   <Text style={styles.txtTitleItem}>{item?.BankName}</Text>
//                   {disable === false && (
//                     <Button onPress={() => handleDelete(item)}>
//                       <SvgXml xml={trash_22} />
//                     </Button>
//                   )}
//                 </View>
//               </View>
//             </View>
//             <View style={styles.bodyCard}>
//               <View style={styles.containerBody}>
//                 <SvgXml xml={bank} />
//                 <Text
//                   style={styles.contentBody}
//                   numberOfLines={2}
//                   ellipsizeMode="tail">
//                   {item?.Branch}
//                 </Text>
//               </View>

//               <View style={styles.containerBody}>
//                 <SvgXml xml={user_red} />
//                 <Text
//                   style={styles.contentBody}
//                   numberOfLines={2}
//                   ellipsizeMode="tail">
//                   {item?.AccountHolder}
//                 </Text>
//               </View>

//               <View style={styles.containerBody}>
//                 <SvgXml xml={credit_card} />
//                 <Text
//                   style={styles.contentBody}
//                   numberOfLines={2}
//                   ellipsizeMode="tail">
//                   {item?.AccountNumber}
//                 </Text>
//               </View>
//             </View>
//           </View>
//           <View
//             style={
//               disable === true &&
//               index !== listBankNew?.length - 1 &&
//               styles.bodyCard1
//             }></View>
//         </Button>
//       );
//     },
//     [handleDelete, handleEditBank],
//   );

//   return (
//     <View style={styles.container}>
//       {/* {disable === false && (
//         <Button onPress={openShowModal} style={styles.btnAddContact}>
//           <Text style={styles.txtBtnAdd}>{languageKey('_add_bank')}</Text>
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
//             {languageKey('_bank_information')}
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
//       {isShowModalBank && disable === false && (
//         <Modal
//           isVisible={isShowModalBank}
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
//               <Text style={styles.titleModal}>{languageKey('_add_bank')}</Text>
//               <Button onPress={closeModal} style={styles.btnClose}>
//                 <SvgXml xml={close_red} />
//               </Button>
//             </View>
//             <ScrollView
//               style={styles.modalContainer}
//               showsVerticalScrollIndicator={false}>
//               <View style={styles.input}>
//                 <CardModalSelect
//                   title={languageKey('_bank')}
//                   data={listBanks}
//                   setValue={setSelectedValueBank}
//                   value={selectedValueBank?.Name}
//                   bgColor={'#F9FAFB'}
//                   require={true}
//                 />
//               </View>
//               <View style={styles.input}>
//                 <CardModalProvince
//                   title={languageKey('_nation')}
//                   data={listNation}
//                   setValue={setSelectedValueNation}
//                   value={selectedValueNation?.RegionsName}
//                   bgColor={'#F9FAFB'}
//                     require={true}
//                 />
//               </View>
//               <InputDefault
//                 name="IBAN"
//                 returnKeyType="next"
//                 style={styles.input}
//                 value={values?.IBAN}
//                 label={languageKey('_iban_number')}
//                 isEdit={true}
//                 placeholderInput={true}
//                 string={true}
//                 bgColor={'#F9FAFB'}
//                 labelHolder={languageKey('_enter_content')}
//                 {...{touched, errors, handleBlur, handleChange, setFieldValue}}
//               />
//               <InputDefault
//                 name="AccountNumber"
//                 returnKeyType="next"
//                 style={styles.input}
//                 value={values?.AccountNumber}
//                 label={languageKey('_account_number')}
//                 isEdit={true}
//                 string={true}
//                 keyboardType={'numeric'}
//                 placeholderInput={true}
//                 labelHolder={languageKey('_enter_content')}
//                 bgColor={'#F9FAFB'}
//                   require={true}
//                 {...{touched, errors, handleBlur, handleChange, setFieldValue}}
//               />
//               <InputDefault
//                 name="AccountHolder"
//                 returnKeyType="next"
//                 style={styles.input}
//                 value={values?.AccountHolder}
//                 label={languageKey('_account_owner')}
//                 isEdit={true}
//                 placeholderInput={true}
//                 labelHolder={languageKey('_enter_content')}
//                 bgColor={'#F9FAFB'}
//                   require={true}
//                 {...{touched, errors, handleBlur, handleChange, setFieldValue}}
//               />
//               <InputDefault
//                 name="Branch"
//                 returnKeyType="next"
//                 style={styles.input}
//                 value={values?.Branch}
//                 label={languageKey('_branch')}
//                 isEdit={true}
//                 placeholderInput={true}
//                 labelHolder={languageKey('_enter_content')}
//                 bgColor={'#F9FAFB'}
//                   require={true}
//                 {...{touched, errors, handleBlur, handleChange, setFieldValue}}
//               />
//               <InputDefault
//                 name="Note"
//                 returnKeyType="next"
//                 style={styles.input}
//                 value={values?.Note}
//                 label={languageKey('_note')}
//                 isEdit={true}
//                 placeholderInput={true}
//                 labelHolder={languageKey('_enter_notes')}
//                 bgColor={'#F9FAFB'}
//                 {...{touched, errors, handleBlur, handleChange, setFieldValue}}
//               />
//               <View style={styles.footer}>
//                 <Button
//                   style={styles.btnFooterModal}
//                   onPress={handleAddNewBank}>
//                   <Text style={styles.txtBtnFooterModal}>
//                     {languageKey('_add_bank')}
//                   </Text>
//                 </Button>
//               </View>
//             </ScrollView>
//           </View>
//         </Modal>
//       )}
//       <FlatList
//         data={listBankNew}
//         renderItem={_renderItem}
//         keyExtractor={_keyExtractor}
//       />
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
//     marginBottom: scale(8),
//   },
//   cardProgram1: {
//     backgroundColor: colors.white,
//     marginHorizontal: scale(12),
//     marginTop: scale(0),
//     borderRadius: scale(12),
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
//   txtTitleItem: {
//     fontSize: fontSize.size16,
//     fontWeight: '600',
//     lineHeight: scale(24),
//     fontFamily: 'Inter-SemiBold',
//     color: colors.black,
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
//   bodyCard1: {
//     height: scale(1),
//     width: '100%',
//     backgroundColor: colors.gray200,
//     marginBottom: scale(8),
//     marginTop: scale(4),marginHorizontal:scale(16)
//   },
// });

// export default ModalBank;
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {SvgXml} from 'react-native-svg';
import {useSelector} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';

import {Button} from '../buttons';
import {colors, fontSize} from 'themes';
import {hScale, scale} from '@resolutions';
import {translateLang} from 'store/accLanguages/slide';
import {CardModalProvince, CardModalSelect, InputDefault} from 'components';
import {
  bank,
  close_red,
  close_white,
  credit_card,
  three_dot,
  trash_22,
  user_red,
} from 'svgImg';

const {height} = Dimensions.get('window');

const ModalBank = ({
  setValueBank,
  dataEdit,
  parentID,
  cmpnID,
  disable = false,
}) => {
  const languageKey = useSelector(translateLang);
  const {listBanks, listNation, listBankKey} = useSelector(
    state => state.CustomerProfile,
  );
  const [isShowModalBank, setIsShowModalBank] = useState(false);
  const [listBankNew, setListBank] = useState([]);
  const [selectedValueBank, setSelectedValueBank] = useState(null);
  const [selectedValueNation, setSelectedValueNation] = useState(null);
  const [selectedBankkey, setSelectedBankkey] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const openShowModal = () => {
    // reset form state when open new (optional)
    setIsShowModalBank(true);
  };

  const closeModal = () => {
    setIsShowModalBank(false);
    // reset selection when closing
    // resetForm(); // handled after submit
  };

  const initialValues = {
    CategoryType: 'Bank',
    BankID: 0,
    NationID: 0,
    CustomerID: 0,
    IBAN: '',
    Extention1: '',
    AccountNumber: '',
    AccountHolder: '',
    Branch: '',
    Note: '',
    IsActive: 1,
  };

  const validationSchema = Yup.object().shape({
    BankID: Yup.number()
      .typeError('Vui lòng chọn ngân hàng')
      .required('Vui lòng chọn ngân hàng')
      .min(1, 'Vui lòng chọn ngân hàng'),
    NationID: Yup.number()
      .typeError('Vui lòng chọn quốc gia')
      .required('Vui lòng chọn quốc gia')
      .min(1, 'Vui lòng chọn quốc gia'),
    AccountNumber: Yup.string().trim().required('Vui lòng nhập số tài khoản'),
    AccountHolder: Yup.string().trim().required('Vui lòng nhập chủ tài khoản'),
    Branch: Yup.string().trim().required('Vui lòng nhập chi nhánh'),
    IBAN: Yup.string().nullable(),
    Note: Yup.string().nullable(),
    // Extention1: Yup.number()
    //   .typeError('Vui lòng chọn BankKey')
    //   .required('Vui lòng chọn BankKey')
    //   .min(1, 'Vui lòng chọn BankKey'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: values => {
      if (!selectedBankkey) {
        Alert.alert('Vui lòng chọn Bankkey');
        return
      }
      const newBank = {
        ID: 0,
        CmpnID: cmpnID?.toString(),
        CategoryType: 'Bank',
        CustomerID: parentID || 0,
        IBAN: values?.IBAN,
        BankID: values?.BankID,
        Extention1: selectedBankkey?.ID?.toString() || '',
        BankName: selectedValueBank?.Name || '',
        NationID: values?.NationID,
        AccountNumber: values?.AccountNumber,
        AccountHolder: values?.AccountHolder,
        Branch: values?.Branch,
        Note: values?.Note,
        IsActive: 1,
      };

      if (editingIndex !== null && editingIndex >= 0) {
        const updatedList = [...listBankNew];
        updatedList[editingIndex] = newBank;
        setListBank(updatedList);
        setValueBank(updatedList);
      } else {
        setListBank(prev => [...prev, newBank]);
        setValueBank(prev => [...(prev || []), newBank]);
      }

      // reset form + selections
      formik.resetForm();
      setSelectedValueBank(null);
      setSelectedValueNation(null);
      setSelectedBankkey(null);
      setEditingIndex(null);
      closeModal();
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    handleSubmit,
    setFieldTouched,
    validateForm,
  } = formik;

  // Sync selection component -> formik values
  const onSelectBank = bankObj => {
    setSelectedValueBank(bankObj || null);
    setFieldValue('BankID', bankObj?.ID || 0);
    setFieldTouched('BankID', true);
  };

  const onSelectNation = nationObj => {
    setSelectedValueNation(nationObj || null);
    setFieldValue('NationID', nationObj?.ID || 0);
    setFieldTouched('NationID', true);
  };
  const onSelectBankkey = key => {
    setSelectedBankkey(key || null);
  };

  const handleEditBank = (item, index) => {
    // set selected values and form values
    const bankObj = item?.BankID
      ? {ID: item?.BankID, Name: item?.BankName}
      : null;
    setSelectedValueBank(bankObj);
    setFieldValue('BankID', bankObj?.ID || 0);

    const nationObj = listNation?.find(n => n?.ID === item?.NationID) || null;
    setSelectedValueNation(nationObj);
    setFieldValue('NationID', nationObj?.ID || 0);
    setFieldValue('Extention1', item?.Extention1?.toString() || '');
    setFieldValue('IBAN', item?.IBAN || '');
    setFieldValue('AccountNumber', item?.AccountNumber || '');
    setFieldValue('AccountHolder', item?.AccountHolder || '');
    setFieldValue('Branch', item?.Branch || '');
    setFieldValue('Note', item?.Note || '');
    setFieldValue('IsActive', 1);
    setEditingIndex(index);
    setIsShowModalBank(true);
  };

  const handleAddNewBank = async () => {
    // ensure touched so errors show
    setFieldTouched('BankID', true);
    setFieldTouched('NationID', true);
    setFieldTouched('AccountNumber', true);
    setFieldTouched('AccountHolder', true);
    setFieldTouched('Branch', true);

    const formErrors = await validateForm();

    if (Object.keys(formErrors).length > 0) {
      // show first error message
      const firstError = Object.values(formErrors)[0];
      Alert.alert('Lỗi', firstError);
      return;
    }

    // if valid, submit (onSubmit in formik will be called)
    handleSubmit();
  };
  // console.log('listBankKey', listBankKey);
  useEffect(() => {
    if (dataEdit && dataEdit.length > 0) {
      const convertedData = dataEdit.map(item => ({
        ID: item?.ID,
        CmpnID: item?.CmpnID?.toString(),
        CategoryType: 'Bank',
        BankID: item.BankID || 0,
        BankName: item.BankName || '',
        NationID: item.NationID || 0,
        Extention1: item?.Extention1?.toString() || '',
        CustomerID: parentID || 0,
        IBAN: item?.IBAN || '',
        AccountNumber: item.AccountNumber || '',
        AccountHolder: item.AccountHolder || '',
        Branch: item.Branch || '',
        Note: item.Note || '',
        IsActive: 1,
      }));
      setListBank(convertedData);
      setValueBank(convertedData);
    }
  }, [dataEdit]);

  const handleDelete = bank => {
    setListBank(prev => prev.filter(item => item !== bank));
    setValueBank(prev => prev.filter(item => item !== bank));
  };

  const _keyExtractor = (item, index) => `${item.AccountNumber}-${index}`;
  const _renderItem = useCallback(
    ({item, index}) => {
      return (
        <Button onPress={() => handleEditBank(item, index)}>
          <View style={disable ? styles.cardProgram1 : styles.cardProgram}>
            <View style={disable ? styles.itemBody_two1 : styles.itemBody_two}>
              <View style={styles.containerItem}>
                <View style={styles.containerHeader}>
                  <Text style={[styles.txtTitleItem]}>{item?.BankName}</Text>
                  {/* <View style={{width:scale(8)}}/> */}
                  {disable === false && (
                    <Button onPress={() => handleDelete(item)}>
                      <SvgXml xml={trash_22} />
                    </Button>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.bodyCard}>
              <View style={styles.containerBody}>
                <SvgXml xml={bank} />
                <Text
                  style={styles.contentBody}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {item?.Branch}
                </Text>
              </View>

              <View style={styles.containerBody}>
                <SvgXml xml={user_red} />
                <Text
                  style={styles.contentBody}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {item?.AccountHolder}
                </Text>
              </View>

              <View style={styles.containerBody}>
                <SvgXml xml={credit_card} />
                <Text
                  style={styles.contentBody}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {item?.AccountNumber}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={
              disable === true &&
              index !== listBankNew?.length - 1 &&
              styles.bodyCard1
            }></View>
        </Button>
      );
    },
    [handleDelete, handleEditBank, listBankNew],
  );

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
            {languageKey('_bank_information')}
          </Text>
          <Button
            style={{
              marginRight: scale(12),
            }}
            onPress={() => {
              // clear form for new
              formik.resetForm();
              setSelectedValueBank(null);
              setSelectedValueNation(null);
              setEditingIndex(null);
              openShowModal();
            }}>
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

      {isShowModalBank && disable === false && (
        <Modal
          isVisible={isShowModalBank}
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
              <Text style={styles.titleModal}>{languageKey('_add_bank')}</Text>
              <Button onPress={closeModal} style={styles.btnClose}>
                <SvgXml xml={close_red} />
              </Button>
            </View>
            <ScrollView
              style={styles.modalContainer}
              showsVerticalScrollIndicator={false}>
              <View style={styles.input}>
                <CardModalSelect
                  title={languageKey('_bank')}
                  data={listBanks}
                  setValue={onSelectBank}
                  value={selectedValueBank?.Name}
                  bgColor={'#F9FAFB'}
                  require={true}
                />
                {touched.BankID && errors.BankID && (
                  <Text style={styles.errorText}>{errors.BankID}</Text>
                )}
              </View>

              <View style={styles.input}>
                <CardModalProvince
                  title={languageKey('_nation')}
                  data={listNation}
                  setValue={onSelectNation}
                  value={selectedValueNation?.RegionsName}
                  bgColor={'#F9FAFB'}
                  require={true}
                />
                {touched.NationID && errors.NationID && (
                  <Text style={styles.errorText}>{errors.NationID}</Text>
                )}
              </View>

              <InputDefault
                name="IBAN"
                returnKeyType="next"
                style={styles.input}
                value={values?.IBAN}
                label={languageKey('_iban_number')}
                isEdit={true}
                placeholderInput={true}
                string={true}
                bgColor={'#F9FAFB'}
                labelHolder={languageKey('_enter_content')}
                {...{touched, errors, handleBlur, handleChange, setFieldValue}}
              />
              <View style={styles.input}>
                <CardModalSelect
                  title={'BankKey'}
                  data={listBankKey}
                  setValue={onSelectBankkey}
                  value={selectedBankkey?.Name}
                  bgColor={'#F9FAFB'}
                  require={true}
                />
                {touched.Extention1 && errors.Extention1 && (
                  <Text style={styles.errorText}>{errors.Extention1}</Text>
                )}
              </View>
              <InputDefault
                name="AccountNumber"
                returnKeyType="next"
                style={styles.input}
                value={values?.AccountNumber}
                label={languageKey('_account_number')}
                isEdit={true}
                string={true}
                keyboardType={'numeric'}
                placeholderInput={true}
                labelHolder={languageKey('_enter_content')}
                bgColor={'#F9FAFB'}
                require={true}
                {...{touched, errors, handleBlur, handleChange, setFieldValue}}
              />
              {/* {touched.AccountNumber && errors.AccountNumber && (
                <Text style={styles.errorText}>{errors.AccountNumber}</Text>
              )} */}

              <InputDefault
                name="AccountHolder"
                returnKeyType="next"
                style={styles.input}
                value={values?.AccountHolder}
                label={languageKey('_account_owner')}
                isEdit={true}
                placeholderInput={true}
                labelHolder={languageKey('_enter_content')}
                bgColor={'#F9FAFB'}
                require={true}
                string={true}
                {...{touched, errors, handleBlur, handleChange, setFieldValue}}
              />
              {/* {touched.AccountHolder && errors.AccountHolder && (
                <Text style={styles.errorText}>{errors.AccountHolder}</Text>
              )} */}

              <InputDefault
                name="Branch"
                returnKeyType="next"
                style={styles.input}
                value={values?.Branch}
                label={languageKey('_branch')}
                isEdit={true}
                placeholderInput={true}
                labelHolder={languageKey('_enter_content')}
                bgColor={'#F9FAFB'}
                require={true}
                string={true}
                {...{touched, errors, handleBlur, handleChange, setFieldValue}}
              />
              {/* {touched.Branch && errors.Branch && (
                <Text style={styles.errorText}>{errors.Branch}</Text>
              )} */}

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
                string={true}
                {...{touched, errors, handleBlur, handleChange, setFieldValue}}
              />

              <View style={styles.footer}>
                <Button
                  style={styles.btnFooterModal}
                  onPress={handleAddNewBank}>
                  <Text style={styles.txtBtnFooterModal}>
                    {languageKey('_add_bank')}
                  </Text>
                </Button>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}

      <FlatList
        data={listBankNew}
        renderItem={_renderItem}
        keyExtractor={_keyExtractor}
      />
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
    marginBottom: scale(8),
  },
  cardProgram1: {
    backgroundColor: colors.white,
    marginHorizontal: scale(12),
    marginTop: scale(0),
    borderRadius: scale(12),
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
  txtTitleItem: {
    fontSize: fontSize.size16,
    fontWeight: '600',
    lineHeight: scale(24),
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
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
  bodyCard1: {
    height: scale(1),
    width: '100%',
    backgroundColor: colors.gray200,
    marginBottom: scale(8),
    marginTop: scale(4),
    marginHorizontal: scale(16),
  },
  errorText: {
    color: colors.redSystem,
    fontSize: fontSize.size10,
    marginTop: scale(6),
    marginHorizontal: scale(0),
  },
});

export default ModalBank;
