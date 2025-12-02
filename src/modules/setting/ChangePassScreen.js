import React, {useRef} from 'react';
import {View, StatusBar, ScrollView, Text as TextRN} from 'react-native';
import * as yup from 'yup';
import {useFormik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';

import styles from './styles';
import {colors} from '@themes';
import {fetchChangePass} from '@store/accAuth/thunk';
import {translateLang} from '@store/accLanguages/slide';
import {InputPassword, LoadingModal, HeaderBack, Button} from '@components';

const initialValues = {
  UserPassword: '',
  UserPassNew: '',
  ConfirmPassword: '',
};

const initialErrors = {
  UserPassword: true,
  UserPassNew: true,
  ConfirmPassword: true,
};

const ChangePassScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {userInfo, isSubmitting} = useSelector(state => state.Login);
  const languageKey = useSelector(translateLang);
  const refPassword = useRef();
  const {values, errors, touched, handleChange, handleBlur, handleSubmit} =
    useFormik({
      initialValues,
      initialErrors,
      validationSchema: yup.object().shape({
        UserPassword: yup
          .string()
          .trim()
          .required(languageKey('_please_enter_pass')),
        UserPassNew: yup
          .string()
          .trim()
          .required(languageKey('_please_enter_pass')),
        ConfirmPassword: yup
          .string()
          .trim()
          .required(languageKey('_please_enter_pass'))
          .oneOf(
            [yup.ref('UserPassNew'), null],
            languageKey('_pass_do_not_match'),
          ),
      }),
      onSubmit: () => onSubmit(),
    });

  const onSubmit = async () => {
    const body = {
      AppCode: 'eSale',
      UserPassword: values?.UserPassword,
      UserPassNew: values?.UserPassNew,
      UserID: userInfo?.UserID,
    };
    try {
      dispatch(fetchChangePass(body));
    } catch (err) {
      console.log('err', err);
    }
  };

  return (
    <LinearGradient
      style={styles.container}
      start={{x: 0.44, y: 0.45}}
      end={{x: 1.22, y: 0.25}}
      colors={['#FFFFFF', '#FFFFFF']}
      pointerEvents="box-none">
      <StatusBar
        animated
        barStyle="dark-content"
        backgroundColor={colors.white}
        translucent={false}
      />

      <SafeAreaView style={styles.safeArea}>
        <HeaderBack
          title={languageKey('_change_pass')}
          onPress={() => navigation.goBack()}
        />
        <ScrollView bounces={false} style={styles.scrollView}>
          <View style={styles.bodyInput}>
            <InputPassword
              ref={refPassword}
              returnKeyType="done"
              name="UserPassword"
              label={languageKey('_current_pass')}
              labelHolder={languageKey('_enter_your_pass')}
              placeholderInput={true}
              onSubmitEditing={handleSubmit}
              value={values?.UserPassword}
              {...{touched, errors, handleBlur, handleChange}}
            />
            <InputPassword
              ref={refPassword}
              returnKeyType="done"
              name="UserPassNew"
              label={languageKey('_new_pass')}
              labelHolder={languageKey('_please_enter_your_new_pass')}
              placeholderInput={true}
              onSubmitEditing={handleSubmit}
              value={values?.UserPassNew}
              style={styles.inputTwo}
              {...{touched, errors, handleBlur, handleChange}}
            />
            <InputPassword
              ref={refPassword}
              returnKeyType="done"
              name="ConfirmPassword"
              label={languageKey('_confirm_pass')}
              labelHolder={languageKey('_confirm_your_pass')}
              placeholderInput={true}
              onSubmitEditing={handleSubmit}
              value={values?.ConfirmPassword}
              style={styles.inputTwo}
              {...{touched, errors, handleBlur, handleChange}}
            />
          </View>
        </ScrollView>
        <View style={styles.footer1}>
          <Button onPress={handleSubmit} style={styles.btnChangePass1}>
            <TextRN style={styles.textChangePass}>
              {languageKey('_save')}
            </TextRN>
          </Button>
        </View>
      </SafeAreaView>
      <LoadingModal visible={isSubmitting} />
    </LinearGradient>
  );
};

export default ChangePassScreen;
