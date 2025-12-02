/* eslint-disable react-native/no-inline-styles */
// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   TextInput,
//   FlatList,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import {SvgXml} from 'react-native-svg';
// import {minus_circle, plus_circle} from 'svgImg';
// import {colors, fontSize} from 'themes';
// import {hScale, scale} from 'utils/resolutions';

// const InputPhoneNumber = ({
//   setListPhoneNumber,
//   label,
//   labelHolder,
//   dataEdit,
//   require,
//   disabled,
// }) => {
//   const [phoneNumbers, setPhoneNumbers] = useState([]);
//   const [inputValue, setInputValue] = useState('');

//   useEffect(() => {
//     if (dataEdit) {
//       if (JSON.stringify(phoneNumbers) !== JSON.stringify(dataEdit)) {
//         setPhoneNumbers(dataEdit);
//         setListPhoneNumber(dataEdit);
//       }
//     } else {
//       if (phoneNumbers.length > 0) {
//         setPhoneNumbers([]);
//         setListPhoneNumber([]);
//       }
//     }
//   }, [dataEdit]);

//   const addNewInput = () => {
//     setPhoneNumbers(prevPhones => [...prevPhones, inputValue.trim()]);
//     setListPhoneNumber(prevPhones => [...prevPhones, inputValue.trim()]);
//     setInputValue('');
//   };

//   const handleEndEditing = () => {
//     const trimmedValue = inputValue.trim();
//     if (trimmedValue !== '' && !phoneNumbers.includes(trimmedValue)) {
//       const updatedList = [...new Set([...phoneNumbers, trimmedValue])];
//       setPhoneNumbers(updatedList);
//       setListPhoneNumber(updatedList);
//     }
//     setInputValue('');
//   };

//   const removePhoneNumber = index => {
//     const updatedList = phoneNumbers.filter((_, i) => i !== index);
//     setPhoneNumbers(updatedList);
//     setListPhoneNumber(updatedList);
//   };

//   return (
//     <View>
//       {require ? (
//         <View style={styles.containerRequire}>
//           <Text style={styles.label}>{label}</Text>
//           <Text style={styles.txtRequire}>*</Text>
//         </View>
//       ) : (
//         <View>
//           <Text style={styles.label}>{label}</Text>
//         </View>
//       )}
//       <View style={styles.container}>
//         <FlatList
//           data={phoneNumbers}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({item, index}) => (
//             <View style={styles.phoneItem}>
//               <Text style={styles.phoneText}>{item}</Text>
//               <TouchableOpacity onPress={() => removePhoneNumber(index)}>
//                 <SvgXml xml={minus_circle} />
//               </TouchableOpacity>
//             </View>
//           )}
//         />

//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder={labelHolder}
//             placeholderTextColor="#A0A0A0"
//             keyboardType="phone-pad"
//             value={inputValue}
//             onChangeText={setInputValue}
//             onEndEditing={handleEndEditing}
//             editable={!disabled}
//           />
//           <TouchableOpacity onPress={addNewInput} disabled={disabled}>
//             <SvgXml xml={plus_circle} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     borderWidth: scale(1),
//     borderColor: colors.borderColor,
//     borderRadius: scale(8),
//     paddingHorizontal: scale(8),
//     backgroundColor: '#FAFAFA',
//     marginHorizontal: scale(12),
//     marginTop: scale(8),
//     marginBottom: scale(4),
//   },
//   phoneItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: scale(8),
//     borderBottomWidth: scale(1),
//     borderBottomColor: colors.borderColor,
//   },
//   phoneText: {
//     fontSize: fontSize.size16,
//     color: colors.black,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     height: hScale(38),
//   },
//   input: {
//     flex: 1,
//     color: colors.black,
//     fontSize: fontSize.size14,
//     fontWeight: '400',
//     fontFamily: 'Inter-Regular',
//     lineHeight: scale(22),
//     paddingVertical: scale(8),
//   },
//   label: {
//     color: colors.black,
//     fontSize: fontSize.size14,
//     fontWeight: '500',
//     fontFamily: 'Inter-Medium',
//     lineHeight: scale(22),
//     marginLeft: scale(12),
//     marginTop: scale(8),
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

// export default InputPhoneNumber;
import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {minus_circle, plus_circle} from 'svgImg';
import {colors, fontSize} from 'themes';
import {hScale, scale} from 'utils/resolutions';

const InputPhoneNumber = ({
  setListPhoneNumber,
  label,
  labelHolder,
  dataEdit,
  require,
  disabled,
}) => {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (dataEdit) {
      // only update if different to avoid infinite loop
      if (JSON.stringify(phoneNumbers) !== JSON.stringify(dataEdit)) {
        setPhoneNumbers(dataEdit);
        setListPhoneNumber && setListPhoneNumber(dataEdit);
      }
    } else {
      if (phoneNumbers.length > 0) {
        setPhoneNumbers([]);
        setListPhoneNumber && setListPhoneNumber([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataEdit]);

  const isValidPhone = value => {
    if (!value) return false;
    // remove spaces
    const trimmed = value.trim();
    // only digits allowed
    const digitsOnly = /^\d+$/;
    if (!digitsOnly.test(trimmed)) return false;
    // at least 10 digits
    return trimmed.length >= 7;
  };

  const normalizeInput = value => {
    // remove non-digit characters (just in case user paste with spaces/formatting)
    return (value || '').replace(/\D/g, '').trim();
  };

  const addNewInput = () => {
    if (disabled) return;
    const normalized = normalizeInput(inputValue);
    if (!isValidPhone(normalized)) {
      setError('Số điện thoại không hợp lệ (chỉ số, tối thiểu 7 chữ số)');
      return;
    }
    // prevent duplicates
    const updatedList = [...new Set([...phoneNumbers, normalized])];
    setPhoneNumbers(updatedList);
    setListPhoneNumber && setListPhoneNumber(updatedList);
    setInputValue('');
    setError('');
  };

  const handleEndEditing = () => {
    const normalized = normalizeInput(inputValue);
    if (normalized === '') {
      setInputValue('');
      setError('');
      return;
    }
    if (!isValidPhone(normalized)) {
      setError('Số điện thoại không hợp lệ (chỉ số, tối thiểu 7 chữ số)');
      setInputValue(normalized); // keep normalized so user sees digits only
      return;
    }
    const updatedList = [...new Set([...phoneNumbers, normalized])];
    setPhoneNumbers(updatedList);
    setListPhoneNumber && setListPhoneNumber(updatedList);
    setInputValue('');
    setError('');
  };

  const removePhoneNumber = index => {
    const updatedList = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(updatedList);
    setListPhoneNumber && setListPhoneNumber(updatedList);
  };

  // disable add button when input invalid or empty or component disabled
  const canAdd = () => {
    if (disabled) return false;
    const normalized = normalizeInput(inputValue);
    return isValidPhone(normalized);
  };

  return (
    <View>
      {require ? (
        <View style={styles.containerRequire}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.txtRequire}>*</Text>
        </View>
      ) : (
        <View>
          <Text style={styles.label}>{label}</Text>
        </View>
      )}

      <View
        style={[
          styles.container,
          {
            borderColor:
              phoneNumbers?.length > 0
                ? '#D1D3DB'
                : require
                ? colors.blue
                : '#D1D3DB',
            borderWidth:
              phoneNumbers?.length > 0
                ? scale(1)
                : require
                ? scale(2)
                : scale(1),
          },
        ]}>
        <FlatList
          data={phoneNumbers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => (
            <View style={styles.phoneItem}>
              <Text style={styles.phoneText}>{item}</Text>
              <TouchableOpacity
                onPress={() => removePhoneNumber(index)}
                disabled={disabled}>
                <SvgXml xml={minus_circle} />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={null}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={labelHolder}
            placeholderTextColor="#A0A0A0"
            keyboardType="phone-pad"
            value={inputValue}
            onChangeText={text => {
              // accept only digits visually but keep raw for normalization; we also strip non-digits
              const onlyDigits = text.replace(/\D/g, '');
              setInputValue(onlyDigits);
              // live validate
              if (onlyDigits.length === 0) {
                setError('');
              } else if (!isValidPhone(onlyDigits)) {
                setError('Số điện thoại không hợp lệ (tối thiểu 7 chữ số)');
              } else {
                setError('');
              }
            }}
            onEndEditing={handleEndEditing}
            editable={!disabled}
          />
          <TouchableOpacity
            onPress={addNewInput}
            disabled={!canAdd()}
            style={[!canAdd() && {opacity: 0.4}]}>
            <SvgXml xml={plus_circle} />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: scale(1),
    borderColor: colors.borderColor,
    borderRadius: scale(8),
    paddingHorizontal: scale(8),
    backgroundColor: '#FAFAFA',
    marginHorizontal: scale(12),
    marginTop: scale(8),
    marginBottom: scale(4),
  },
  phoneItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(8),
    borderBottomWidth: scale(1),
    borderBottomColor: colors.borderColor,
  },
  phoneText: {
    fontSize: fontSize.size16,
    color: colors.black,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hScale(38),
  },
  input: {
    flex: 1,
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
    paddingVertical: scale(8),
  },
  label: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    lineHeight: scale(22),
    marginLeft: scale(12),
    marginTop: scale(8),
  },
  txtRequire: {
    color: colors.red,
    marginLeft: scale(2),
  },
  containerRequire: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: fontSize.size12,
    marginTop: scale(6),
    marginLeft: scale(6),
  },
});

export default InputPhoneNumber;
