/* eslint-disable react-native/no-inline-styles */
// import React, {useState} from 'react';
// import {View, StyleSheet, TextInput, Text} from 'react-native';

// import {hScale, scale} from '@resolutions';
// import {colors, fontSize} from '@themes';
// const InputDefault = ({
//   label,
//   name,
//   values,
//   style,
//   errors,
//   touched,
//   handleChange,
//   handleBlur,
//   onChangeText,
//   labelHolder,
//   bgColor,
//   isEdit = false,
//   textColor = false,
//   setFieldValue,
//   keyboardType,
//   require,
//   value,
//   note = false,
//   string = false,
//   limit=0,
//   ...rest
// }) => {
//   const [height, setHeight] = useState(hScale(38));
//   const isNumeric = val => /^[0-9,]+$/.test(val);
//   return (
//     <View style={[style]}>
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
//       <View>
//         <TextInput
//           editable={isEdit}
//           multiline={true}
//           value={
//             keyboardType === 'numbers-and-punctuation'
//               ? isNumeric(value)
//                 ? Number(value.toString().replace(/,/g, '')).toLocaleString(
//                     'en-US',
//                   )
//                 : value
//               : string === true
//               ? value
//               : isNumeric(value)
//               ? Number(value.toString().replace(/,/g, '')).toLocaleString(
//                   'en-US',
//                 )
//               : value
//           }
//           keyboardType={keyboardType || 'default'}
//           onBlur={handleBlur(name)}
//           placeholder={labelHolder}
//           textAlignVertical={'top'}
//           placeholderTextColor={colors.graySystem}
//           onChangeText={text => {
//             let newText = text;
//             if (name === 'PostalCode' && newText.length > 8) {
//               newText = newText.slice(0, 8);
//             }

//             if (isNumeric(newText)) {
//               const cleanNumber = newText
//                 .replace(/,/g, '')
//                 .replace(/[^0-9]/g, '');
//               setFieldValue(name, cleanNumber);
//             } else {
//               setFieldValue(name, newText);
//             }
//           }}
//           onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
//           style={[
//             styles.input,
//             {
//               borderColor: require ? colors.blue : '#D1D3DB',
//               borderWidth: require ? scale(2) : scale(1),
//               height: Math.max(hScale(38), height),
//               color: textColor ? colors.gray600 : colors.black,
//               backgroundColor: bgColor ? bgColor : colors.white,
//             },
//           ]}
//           {...rest}
//         />
//         {errors && touched && touched[name] && errors[name] ? (
//           <Text style={styles.error}>{errors[name]}</Text>
//         ) : null}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   label: {
//     color: colors.black,
//     fontSize: fontSize.size14,
//     fontWeight: '500',
//     fontFamily: 'Inter-Medium',
//     lineHeight: scale(22),
//   },
//   title: {
//     color: colors.black,
//     fontSize: fontSize.size14,
//     fontWeight: '500',
//     fontFamily: 'Inter-Medium',
//   },
//   input: {
//     color: colors.black,
//     borderRadius: scale(8),
//     paddingLeft: scale(10),
//     fontSize: fontSize.size14,
//     fontWeight: '400',
//     fontFamily: 'Inter-Regular',
//     lineHeight: scale(22),
//     marginTop: scale(8),
//     borderWidth: scale(1),
//     borderColor: '#D1D3DB',
//     backgroundColor: colors.white,
//   },
//   error: {
//     color: colors.redSystem,
//     fontSize: fontSize.size10,
//     marginTop: scale(5),
//   },
//   cardNoBorder: {
//     flexDirection: 'row',
//     paddingHorizontal: scale(8),
//     paddingVertical: scale(2),
//     marginRight: scale(8),
//     borderRadius: scale(6),
//     backgroundColor: colors.graySystem2,
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

// export default InputDefault;
import React, {useState} from 'react';
import {View, StyleSheet, TextInput, Text} from 'react-native';

import {hScale, scale} from '@resolutions';
import {colors, fontSize} from '@themes';
import {SvgXml} from 'react-native-svg';
import {arrow_down_big, checkgreen} from '@svgImg';

const InputDefault = ({
  label,
  name,
  values,
  style,
  errors,
  touched,
  handleChange,
  handleBlur,
  onChangeText,
  labelHolder,
  bgColor,
  isEdit = false,
  textColor = false,
  setFieldValue,
  keyboardType,
  require,
  value,
  note = false,
  string = false,
  check = false,
  limit = 0,
  numberRight = false,
  ...rest
}) => {
  const [height, setHeight] = useState(hScale(38));
  const isNumeric = val => /^[0-9,]+$/.test(val);
  const maxLen = limit && limit !== 0 ? 25 : undefined;
  return (
    <View style={[style]}>
      {require ? (
        <View
          style={[
            styles.containerRequire,
            {justifyContent: check ? 'space-between' : 'flex-start'},
          ]}>
          <View style={[styles.containerRequire]}>
            <Text style={styles.label}>{label} </Text>
            <Text style={styles.txtRequire}>*</Text>
          </View>
          {check && (
            <SvgXml xml={checkgreen} width={scale(16)} height={scale(16)} />
          )}
        </View>
      ) : (
        <View style={{justifyContent: check ? 'space-between' : 'flex-start'}}>
          <Text style={styles.label}>{label}</Text>
        </View>
      )}
      <View>
        <TextInput
          editable={isEdit}
          multiline={true}
          value={
            keyboardType === 'numbers-and-punctuation'
              ? isNumeric(value)
                ? Number(value.toString().replace(/,/g, '')).toLocaleString(
                    'en-US',
                  )
                : value
              : string === true
              ? value
              : isNumeric(value)
              ? Number(value.toString().replace(/,/g, '')).toLocaleString(
                  'en-US',
                )
              : value
          }
          keyboardType={keyboardType || 'default'}
          onBlur={handleBlur(name)}
          placeholder={labelHolder}
          textAlignVertical={'top'}
          textAlign={numberRight ? 'right' : 'left'}
          placeholderTextColor={colors.graySystem}
          onChangeText={text => {
            let newText = text;

            // nếu có cấu hình limit -> cắt tối đa 25 ký tự
            if (maxLen) {
              // nếu user dán chuỗi dài thì cắt
              newText = newText.slice(0, maxLen);
            }

            if (name === 'PostalCode' && newText.length > 8) {
              newText = newText.slice(0, 8);
            }

            if (isNumeric(newText)) {
              const cleanNumber = newText
                .replace(/,/g, '')
                .replace(/[^0-9]/g, '');
              setFieldValue(name, cleanNumber);
            } else {
              setFieldValue(name, newText);
            }

            // optional: gọi onChangeText prop nếu có
            if (typeof onChangeText === 'function') {
              onChangeText(newText);
            }
          }}
          onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
          maxLength={maxLen}
          style={[
            styles.input,
            {
              borderColor:
                value?.length > 0
                  ? '#D1D3DB'
                  : require
                  ? colors.blue
                  : '#D1D3DB',
              borderWidth:
                value?.length > 0 ? scale(1) : require ? scale(2) : scale(1),
              height: Math.max(hScale(38), height),
              color: textColor ? colors.gray600 : colors.black,
              backgroundColor: bgColor ? bgColor : colors.white,
              paddingRight: numberRight === true ? scale(10) : 0,
            },
          ]}
          {...rest}
        />
        {maxLen === 25 && value?.length > 24 ? (
          <Text style={styles.error}>Dài tối đa 25 kí tự{value?.length}</Text>
        ) : null}
        {errors && touched && touched[name] && errors[name] ? (
          <Text style={styles.error}>{errors[name]}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    lineHeight: scale(22),
  },
  title: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  input: {
    color: colors.black,
    borderRadius: scale(8),
    paddingLeft: scale(10),
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
    marginTop: scale(8),
    borderWidth: scale(1),
    borderColor: '#D1D3DB',
    backgroundColor: colors.white,
  },
  error: {
    color: colors.redSystem,
    fontSize: fontSize.size10,
    marginTop: scale(5),
  },
  cardNoBorder: {
    flexDirection: 'row',
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    marginRight: scale(8),
    borderRadius: scale(6),
    backgroundColor: colors.graySystem2,
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

export default InputDefault;
