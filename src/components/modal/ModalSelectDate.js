// /* eslint-disable react-native/no-inline-styles */
// import React, {useState, useEffect} from 'react';
// import moment from 'moment';
// import Modal from 'react-native-modal';
// import {SvgXml} from 'react-native-svg';
// import {useSelector} from 'react-redux';
// import DatePicker from 'react-native-date-picker';
// import {View, Text, StyleSheet, Platform} from 'react-native';

// import {Button} from '../buttons';
// import {colors, fontSize} from 'themes';
// import {hScale, scale} from '@resolutions';
// import {callendar, close_blue} from 'svgImg';
// import {translateLang} from 'store/accLanguages/slide';

// const ModalSelectDate = ({
//   title,
//   initialValue,
//   showDatePicker,
//   hideDatePicker,
//   selectSubmitForm,
//   isDatePickerVisible,
//   selectedValueSelected,
//   bgColor,
//   margin,
//   require,
//   minimumDate,
//   maximumDate,
//   disabled,
//   mode,
// }) => {
//   const languageKey = useSelector(translateLang);

//   const [selectedValue, setSelectedValue] = useState(moment().toDate());
//   const [formattedDate, setFormattedDate] = useState(() =>
//     mode
//       ? moment(selectedValue).format('HH:mm DD/MM/YYYY')
//       : moment(selectedValue).format('DD/MM/YYYY'),
//   );
//   const [isDateSelected, setIsDateSelected] = useState(false);

//   const parseInitialDate = value => {
//     if (!value) return moment().toDate();

//     if (moment(value, 'DD/MM/YYYY', true).isValid()) {
//       return moment(value, 'DD/MM/YYYY').toDate();
//     } else {
//       return moment(value).toDate();
//     }
//   };

//   useEffect(() => {
//     const parsedDate = parseInitialDate(initialValue);
//     setSelectedValue(parsedDate);
//     setFormattedDate(
//       moment(parsedDate).format(mode ? 'HH:mm DD/MM/YYYY' : 'DD/MM/YYYY'),
//     );
//     setIsDateSelected(true);

//     if (!initialValue) {
//       selectSubmitForm(parsedDate);
//       selectedValueSelected(moment(parsedDate).format('DD/MM/YYYY'));
//     }
//   }, [initialValue]);

//   // const handleDateChange = (date) => {
//   //     if (date) {
//   //         const formatted = moment(date).format('YYYY-MM-DDT00:00:00');
//   //         setSelectedValue(moment(formatted).toDate());
//   //         setFormattedDate(moment(formatted).format('DD/MM/YYYY'));
//   //         setIsDateSelected(true);
//   //         selectedValueSelected(moment(formatted).format('DD/MM/YYYY'));
//   //         selectSubmitForm(formatted);
//   //     }
//   // };
//   const handleDateChange = date => {
//     if (date) {
//       const selected = moment(date).toDate();
//       setSelectedValue(selected);
//       setFormattedDate(moment(selected).format('DD/MM/YYYY'));
//       setIsDateSelected(true);
//       selectedValueSelected(moment(selected).format('DD/MM/YYYY'));
//       selectSubmitForm(selected);
//     }
//   };

//   const handleConfirm = () => {
//     hideDatePicker();
//   };

//   return (
//     <View style={styles.container}>
//       {require ? (
//         <View style={styles.containerRequire}>
//           <Text style={styles.label}>{title}</Text>
//           <Text style={styles.txtRequire}>*</Text>
//         </View>
//       ) : (
//         <View>
//           <Text
//             style={[styles.label, {marginHorizontal: margin ? 0 : scale(16)}]}>
//             {title}
//           </Text>
//         </View>
//       )}

//       <Button
//         onPress={showDatePicker}
//         style={[
//           styles.inputDate,
//           {
//             backgroundColor: bgColor ? bgColor : colors.white,
//             marginHorizontal: margin ? 0 : scale(12),
//           },
//         ]}
//         disabled={disabled}>
//         <Text style={[styles.txtDate, !isDateSelected && {color: 'gray'}]}>
//           {isDateSelected ? formattedDate : 'Chọn ngày'}
//         </Text>
//         <SvgXml xml={callendar} style={styles.iconCallendar} />
//       </Button>
//       {isDatePickerVisible && (
//         <View>
//           <Modal
//             isVisible={isDatePickerVisible}
//             useNativeDriver={true}
//             onBackdropPress={hideDatePicker}
//             onBackButtonPress={hideDatePicker}
//             backdropTransitionOutTiming={450}
//             style={styles.modal}>
//             <View style={styles.headerModal}>
//               <Button onPress={hideDatePicker}>
//                 <SvgXml xml={close_blue} />
//               </Button>
//               <Text style={[styles.titleModal, {marginBottom: scale(5)}]}>
//                 {languageKey('_please_select_a_date')}
//               </Text>
//             </View>
//             <View style={styles.modalContainer}>
//               <View style={styles.date}>
//                 <DatePicker
//                   mode={mode ? 'datetime' : 'date'}
//                   open={isDatePickerVisible}
//                   date={selectedValue}
//                   onDateChange={handleDateChange}
//                   locale="vi"
//                   style={styles.datePicker}
//                   minimumDate={minimumDate}
//                   maximumDate={maximumDate}
//                 />
//               </View>
//               <View style={styles.footer}>
//                 <Button onPress={handleConfirm} style={styles.btnFooterModal}>
//                   <Text style={styles.txtBtnFooterModal}>
//                     {languageKey('_confirm')}
//                   </Text>
//                 </Button>
//               </View>
//             </View>
//           </Modal>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {},
//   txtDate: {
//     color: colors.black,
//   },
//   label: {
//     color: colors.black,
//     fontSize: fontSize.size14,
//     fontWeight: '500',
//     fontFamily: 'Inter-Medium',
//     fontSize: fontSize.size14,
//     lineHeight: scale(22),
//     marginLeft: scale(12),
//   },
//   modal: {
//     margin: 0,
//     justifyContent: 'flex-end',
//   },
//   modalContainer: {
//     backgroundColor: colors.white,
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
//     paddingVertical: scale(6),
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
//     marginBottom: scale(12),
//   },
//   inputDate: {
//     flexDirection: 'row',
//     borderRadius: scale(8),
//     paddingLeft: scale(10),
//     fontSize: fontSize.size14,
//     marginTop: scale(8),
//     borderWidth: scale(1),
//     borderColor: '#D1D3DB',
//     backgroundColor: colors.white,
//     height: hScale(42),
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   date: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     color: '#525252',
//   },
//   footer: {
//     paddingHorizontal: scale(16),
//   },
//   txtBtnFooterModal: {
//     color: colors.white,
//     fontSize: fontSize.size14,
//     fontWeight: '600',
//     fontFamily: 'Inter-SemiBold',
//     lineHeight: scale(22),
//   },
//   body_footer: {
//     backgroundColor: colors.white,
//     paddingBottom: scale(10),
//     marginTop: scale(12),
//     paddingTop: scale(4),
//     marginBottom: scale(100),
//   },
//   iconCallendar: {
//     marginRight: scale(11),
//   },
//   txtRequire: {
//     color: colors.red,
//     marginLeft: scale(2),
//   },
//   containerRequire: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
// });

// export default ModalSelectDate;
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import moment from 'moment';
import Modal from 'react-native-modal';
import {SvgXml} from 'react-native-svg';
import {useSelector} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Pressable,
} from 'react-native';

import {Button} from '../buttons';
import {colors, fontSize} from 'themes';
import {hScale, scale} from '@resolutions';
import {callendar, close_blue} from 'svgImg';
import {translateLang} from 'store/accLanguages/slide';

const ModalSelectDate = ({
  title,
  initialValue,
  showDatePicker,
  hideDatePicker,
  selectSubmitForm,
  isDatePickerVisible,
  selectedValueSelected,
  bgColor,
  margin,
  require,
  minimumDate,
  maximumDate,
  disabled,
  mode,
}) => {
  const languageKey = useSelector(translateLang);

  const [selectedValue, setSelectedValue] = useState(moment().toDate());
  const [formattedDate, setFormattedDate] = useState(() =>
    mode
      ? moment(selectedValue).format('HH:mm DD/MM/YYYY')
      : moment(selectedValue).format('DD/MM/YYYY'),
  );
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [editingText, setEditingText] = useState(''); // cho TextInput
  const inputRef = useRef(null);

  // const parseInitialDate = value => {
  //   if (!value) return moment().toDate();

  //   // nếu giá trị theo DD/MM/YYYY
  //   if (moment(value, 'DD/MM/YYYY', true).isValid()) {
  //     return moment(value, 'DD/MM/YYYY').toDate();
  //   } else if (moment(value, moment.ISO_8601, true).isValid()) {
  //     return moment(value).toDate();
  //   } else {
  //     return moment(value).toDate();
  //   }
  // };
  const parseInitialDate = value => {
    if (value === '' || value === null || value === undefined) return null;

    // nếu giá trị theo DD/MM/YYYY
    if (moment(value, 'DD/MM/YYYY', true).isValid()) {
      return moment(value, 'DD/MM/YYYY').toDate();
    } else if (moment(value, moment.ISO_8601, true).isValid()) {
      return moment(value).toDate();
    } else {
      // fallback
      const maybe = moment(value);
      return maybe.isValid() ? maybe.toDate() : null;
    }
  };

  // useEffect(() => {
  //   const parsedDate = parseInitialDate(initialValue);
  //   setSelectedValue(parsedDate);
  //   const fmt = mode ? 'HH:mm DD/MM/YYYY' : 'DD/MM/YYYY';
  //   setFormattedDate(moment(parsedDate).format(fmt));
  //   setEditingText(moment(parsedDate).format(fmt));
  //   setIsDateSelected(true);

  //   if (!initialValue) {
  //     selectSubmitForm(parsedDate);
  //     selectedValueSelected(moment(parsedDate).format('DD/MM/YYYY'));
  //   }
  // }, [initialValue]);
  useEffect(() => {
    const parsedDate = parseInitialDate(initialValue);

    if (parsedDate === null) {
      // Giá trị rỗng -> để trống hoàn toàn
      setSelectedValue(null);
      setFormattedDate('');
      setEditingText('');
      setIsDateSelected(false);

      // Không push gì lên form
      selectedValueSelected('');
      selectSubmitForm(null);
      return;
    }

    // Có giá trị -> hiển thị bình thường
    const fmt = mode ? 'HH:mm DD/MM/YYYY' : 'DD/MM/YYYY';
    setSelectedValue(parsedDate);
    setFormattedDate(moment(parsedDate).format(fmt));
    setEditingText(moment(parsedDate).format(fmt));
    setIsDateSelected(true);

    // Không submit lại nếu dữ liệu đã có (avoid overwriting)
  }, [initialValue]);

  const commitTextInput = text => {
    if (!text) {
      // nếu xóa input -> clear selection
      setIsDateSelected(false);
      setSelectedValue(null);
      setFormattedDate('');
      selectedValueSelected('');
      selectSubmitForm(null);
      return;
    }

    // Thử parse với format DD/MM/YYYY trước, nếu fail thử moment tự detect
    let parsed = null;
    if (moment(text, 'DD/MM/YYYY', true).isValid()) {
      parsed = moment(text, 'DD/MM/YYYY').toDate();
    } else if (moment(text, 'YYYY-MM-DD', true).isValid()) {
      parsed = moment(text, 'YYYY-MM-DD').toDate();
    } else if (moment(text, moment.ISO_8601, true).isValid()) {
      parsed = moment(text).toDate();
    } else {
      // cố gắng parse lỏng lẻo
      const maybe = moment(
        text,
        ['DD/MM/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY', moment.ISO_8601],
        true,
      );
      if (maybe.isValid()) parsed = maybe.toDate();
    }

    if (parsed) {
      const fmt = mode ? 'HH:mm DD/MM/YYYY' : 'DD/MM/YYYY';
      setSelectedValue(parsed);
      setFormattedDate(moment(parsed).format(fmt));
      setEditingText(moment(parsed).format(fmt));
      setIsDateSelected(true);
      selectedValueSelected(moment(parsed).format('DD/MM/YYYY'));
      selectSubmitForm(parsed);
    } else {
      // Không hợp lệ: giữ nguyên văn bản nhập và không gửi submit
      // Bạn có thể hiện thông báo lỗi nếu muốn
      // Ví dụ: setEditingText(text + ' (invalid)');
      setEditingText(text);
    }
  };

  const handleDateChange = date => {
    if (date) {
      const selected = moment(date).toDate();
      const fmt = mode ? 'HH:mm DD/MM/YYYY' : 'DD/MM/YYYY';
      setSelectedValue(selected);
      setFormattedDate(moment(selected).format(fmt));
      setEditingText(moment(selected).format(fmt));
      setIsDateSelected(true);
      selectedValueSelected(moment(selected).format('DD/MM/YYYY'));
      selectSubmitForm(selected);
    }
  };

  const handleConfirm = () => {
    hideDatePicker();
  };

  // Khi focus input, ta có thể mở date picker nếu muốn
  const handleInputFocus = () => {
    // mở DatePicker khi focus
    // nếu không muốn tự mở, comment dòng dưới
    // showDatePicker && showDatePicker();
  };

  return (
    <View style={styles.container}>
      {require ? (
        <View style={styles.containerRequire}>
          <Text style={styles.label}>{title}</Text>
          <Text style={styles.txtRequire}>*</Text>
        </View>
      ) : (
        <View>
          <Text
            style={[styles.label, {marginHorizontal: margin ? 0 : scale(16)}]}>
            {title}
          </Text>
        </View>
      )}

      <View>
        <View
          activeOpacity={1}
          // onPress={() => {
          //   // chạm vào vùng input -> focus TextInput
          //   if (inputRef.current) {
          //     inputRef.current.focus();
          //   } else {
          //     showDatePicker && showDatePicker();
          //   }
          // }}
        >
          <View
            style={[
              styles.inputDate,
              {
                backgroundColor: bgColor ? bgColor : colors.white,
                marginHorizontal: margin ? 0 : scale(12),
                borderColor:
                  editingText?.length > 0
                    ? '#D1D3DB'
                    : require
                    ? colors.blue
                    : '#D1D3DB',
                borderWidth:
                  editingText?.length > 0 ? scale(1) : require ? scale(2) : scale(1),
              },
            ]}>
            <TextInput
              ref={inputRef}
              value={editingText}
              onChangeText={t => {
                setEditingText(t);
              }}
              onBlur={() => {
                commitTextInput(editingText);
              }}
              onSubmitEditing={() => {
                commitTextInput(editingText);
                Keyboard.dismiss();
              }}
              placeholder="Chọn ngày hoặc nhập (DD/MM/YYYY)"
              editable={!disabled}
              style={[styles.txtDateInput, !isDateSelected && {color: 'gray'}]}
              keyboardType="numbers-and-punctuation"
              returnKeyType="done"
              onFocus={handleInputFocus}
            />
            <Pressable
              onPress={() => {
                // mở date picker khi nhấn icon
                showDatePicker && showDatePicker();
              }}
              disabled={disabled}>
              <SvgXml xml={callendar} style={styles.iconCallendar} />
            </Pressable>
          </View>
        </View>
      </View>

      {isDatePickerVisible && (
        <View>
          <Modal
            isVisible={isDatePickerVisible}
            useNativeDriver={true}
            onBackdropPress={hideDatePicker}
            onBackButtonPress={hideDatePicker}
            backdropTransitionOutTiming={450}
            style={styles.modal}>
            <View style={styles.headerModal}>
              <Button onPress={hideDatePicker}>
                <SvgXml xml={close_blue} />
              </Button>
              <Text style={[styles.titleModal, {marginBottom: scale(5)}]}>
                {languageKey('_please_select_a_date')}
              </Text>
            </View>
            <View style={styles.modalContainer}>
              <View style={styles.date}>
                <DatePicker
                  mode={mode ? 'datetime' : 'date'}
                  open={isDatePickerVisible}
                  date={selectedValue || new Date()}
                  onDateChange={handleDateChange}
                  locale="vi"
                  style={styles.datePicker}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                />
              </View>
              <View style={styles.footer}>
                <Button onPress={handleConfirm} style={styles.btnFooterModal}>
                  <Text style={styles.txtBtnFooterModal}>
                    {languageKey('_confirm')}
                  </Text>
                </Button>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  txtDate: {
    color: colors.black,
  },
  txtDateInput: {
    color: colors.black,
    flex: 1,
    paddingVertical: 0,
    paddingLeft: 8,
    fontSize: fontSize.size14,
  },
  label: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    fontSize: fontSize.size14,
    lineHeight: scale(22),
    marginLeft: scale(12),
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
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
    paddingVertical: scale(6),
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
  },
  inputDate: {
    flexDirection: 'row',
    borderRadius: scale(8),
    paddingLeft: scale(10),
    fontSize: fontSize.size14,
    marginTop: scale(8),
    borderWidth: scale(1),
    borderColor: '#D1D3DB',
    backgroundColor: colors.white,
    height: hScale(42),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#525252',
  },
  footer: {
    paddingHorizontal: scale(16),
  },
  txtBtnFooterModal: {
    color: colors.white,
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(22),
  },
  body_footer: {
    backgroundColor: colors.white,
    paddingBottom: scale(10),
    marginTop: scale(12),
    paddingTop: scale(4),
    marginBottom: scale(100),
  },
  iconCallendar: {
    marginRight: scale(11),
  },
  txtRequire: {
    color: colors.red,
    marginLeft: scale(2),
  },
  containerRequire: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ModalSelectDate;
