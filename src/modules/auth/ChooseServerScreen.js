import React, { useState } from 'react';
import {
  View,
  Platform,
  StatusBar,
  ImageBackground,
  KeyboardAvoidingView,
  Text
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";

import routes from '@routes';
import styles from './styles';
import { ApiLogin } from '@api';
import { updateUser } from '../../store/accAuth/slide'
import { translateLang } from '../../store/accLanguages/slide';
import { setRefreshToken, setToken, setUserInformation, } from '@storage';
import { Button, NotifierAlert, LoadingModal, CardModalCompany } from '@components';

const ChooseServerScreen = ({ route }) => {
  const body = route?.params?.body;
  const result = route?.params?.result;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const [valueCmpnID, setValueCmpnID] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    const param = {
      UserName: body.UserName,
      UserPassword: body.UserPassword,
      CollectFromServer: valueCmpnID?.CollectFromServer
    };
    try {
      setSubmitting(true);
      const { data } = await ApiLogin(param);
      if (data.StatusCode === 200 && data.ErrorCode === '0') {
        let result = data.Result;
        if (result[0]?.Token) {
          await new Promise(resolve => {
            dispatch(updateUser(result[0]))
            setToken(JSON.stringify(result[0].Token));
            setRefreshToken(JSON.stringify(result[0]?.RefreshToken));
            setUserInformation(JSON.stringify(result[0]));
            setSubmitting(false);
            resolve();
          });
          // navigation.navigate(routes.HomeScreen);
          navigation.replace('TabNavigator');
        } else {
          setSubmitting(false);
          navigation.navigate(routes.ChooseCompanyScreen, { body: param, result: result });
        }
      } else {
        setSubmitting(false);
        NotifierAlert(
          3000,
          `${languageKey('_notification')}`,
          `${languageKey('try_again')}`,
          'error',
        );
      }
    } catch (err) {
      setSubmitting(false);
      NotifierAlert(
        3000,
        `${languageKey('_notification')}`,
        `${languageKey('try_again')}`,
        'error',
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../../assets/bgLogin.png')}
        style={styles.imgBackground}
      >
        <Text
          style={styles.labelHeader}
          numberOfLines={2}
        >{languageKey('_sign_in_to_your_account')}</Text>
      </ImageBackground>

      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.inputContainer}>
            <View style={styles.bodyInput}>
              <CardModalCompany
                title={languageKey('_choose_a_server')}
                data={result}
                setValue={setValueCmpnID}
                value={valueCmpnID?.ServerName}
              />
              <Button
                disabled={valueCmpnID?.ServerName ? false : true}
                onPress={onSubmit}
                style={styles.btnNext}>
                <Text style={styles.textLoginBtn}>{languageKey('_next')}</Text>
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <LoadingModal visible={isSubmitting} />
    </View>
  );
};

export default ChooseServerScreen;
