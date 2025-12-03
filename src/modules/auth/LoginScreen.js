import React, {useRef, useState, useEffect} from 'react';
import * as yup from 'yup';
import {useFormik} from 'formik';
import NetInfo from '@react-native-community/netinfo';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, StatusBar, ImageBackground, Text, Platform} from 'react-native';

import styles from './styles';
import routes from '@routes';
import {updateUser} from '@store/accAuth/slide';
import {translateLang} from '@store/accLanguages/slide';
import {ApiAddTokenFirebase, ApiCheckTokenAppValid, ApiLogin} from '@api';
import {
  Button,
  InputPassword,
  NotifierAlert,
  LoadingModal,
  InputLogin,
} from '@components';
import {
  getToken,
  getFcmInfo,
  getUserInformation,
  setToken,
  setUserInformation,
  setRefreshToken,
  setFcmInfo,
} from '@storage';

const initialValues = {
  UserName: '',
  UserPassword: '',
};

const initialErrors = {
  UserName: true,
  UserPassword: true,
};

const LoginScreen = () => {
  const refPassword = useRef();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const [isSubmitting, setSubmitting] = useState(false);

  const focusPassword = () => {
    refPassword.current?.focus();
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues,
    initialErrors,
    validationSchema: yup.object().shape({
      UserName: yup
        .string()
        .trim()
        .required(languageKey('_email_phone_incorrect')),
      UserPassword: yup
        .string()
        .trim()
        .required(languageKey('_password_incorrect')),
    }),
    onSubmit: () => onSubmit(),
  });

  const onSubmit = async () => {
    const body = {
      UserName: values.UserName.trim(),
      UserPassword: values.UserPassword.trim(),
    };
    console.log('bodybodybodybody', body);
    try {
      setSubmitting(true);
      const {data} = await ApiLogin(body);
      if (data.StatusCode === 200 && data.ErrorCode === '0') {
        let result = data.Result;
        if (result[0]?.Token) {
          await new Promise(resolve => {
            dispatch(updateUser(result[0]));
            setToken(JSON.stringify(result[0].Token));
            setRefreshToken(JSON.stringify(result[0]?.RefreshToken));
            setUserInformation(JSON.stringify(result[0]));
            setSubmitting(false);
            // resetForm();
            resolve();
          });
          // navigation.navigate(routes.HomeScreen);
          Platform.OS === 'android'
            ? navigation.replace('TabNavigator')
            : navigation.navigate('TabNavigator');
        } else if (result[0]?.CollectFromServer) {
          setSubmitting(false);
          navigation.navigate(routes.ChooseServerScreen, {
            body: body,
            result: result,
          });
          resetForm();
        } else {
          setSubmitting(false);
          navigation.navigate(routes.ChooseCompanyScreen, {
            body: body,
            result: result,
          });
          resetForm();
        }
      } else {
        resetForm();
        setSubmitting(false);
        NotifierAlert(
          3000,
          `${languageKey('_notification')}`,
          `${data.Message}`,
          'error',
        );
      }
    } catch (err) {
      resetForm();
      setSubmitting(false);
      NotifierAlert(
        3000,
        `${languageKey('_notification')}`,
        `${languageKey('_try_again')}`,
        'error',
      );
    }
  };

  const fetchInit = async () => {
    const token = JSON.parse(await getToken());
    const userInformation = JSON.parse(await getUserInformation());
    const netInfo = await NetInfo.fetch();
    const FCMToken = await getFcmInfo();
    if (token && netInfo?.isConnected) {
      try {
        const {data} = await ApiCheckTokenAppValid({Token: token});
        if (data.StatusCode === 200 && data.ErrorCode === '0') {
          dispatch(updateUser(userInformation));
          // navigation.navigate(routes.HomeScreen);
             Platform.OS === 'android'
            ? navigation.replace('TabNavigator')
            : navigation.navigate('TabNavigator');
          const body = {
            Token: FCMToken,
            AppCode: 'eSale',
          };
          ApiAddTokenFirebase(body);
        } else {
          navigation.navigate(routes.LoginScreen);
        }
      } catch (error) {}
    } else if (!netInfo?.isConnected) {
      NotifierAlert(
        3000,
        `${languageKey('_notification')}`,
        `${languageKey('please_check_network')}`,
        'error',
      );
    }
  };

  useEffect(() => {
    fetchInit();
  }, []);

  return (
    <View style={{flex: 1}}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <ImageBackground
        source={require('../../assets/bgLogin.png')}
        style={styles.imgBackground}>
        <Text style={styles.labelHeader} numberOfLines={2}>
          {languageKey('_sign_in_to_your_account')}
        </Text>
      </ImageBackground>

      <SafeAreaView style={styles.container}>
        <View style={styles.inputContainer}>
          <View style={styles.bodyInput}>
            <InputLogin
              name="UserName"
              returnKeyType="next"
              style={styles.input}
              value={values?.UserName}
              label={languageKey('_username')}
              onSubmitEditing={focusPassword}
              placeholderInput={true}
              string={true}
              labelHolder={languageKey('_enter_account')}
              {...{touched, errors, handleBlur, handleChange}}
            />
            <InputPassword
              ref={refPassword}
              returnKeyType="done"
              name="UserPassword"
              style={styles.input}
              labelHolder={languageKey('_enter_your_pass')}
              label={languageKey('_password')}
              placeholderInput={true}
              onSubmitEditing={handleSubmit}
              value={values?.UserPassword}
              {...{touched, errors, handleBlur, handleChange}}
            />
            <Button onPress={handleSubmit} style={styles.btnLogin}>
              <Text style={styles.textLoginBtn}>{languageKey('_login')}</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>

      <LoadingModal visible={isSubmitting} />
    </View>
  );
};

export default LoginScreen;
