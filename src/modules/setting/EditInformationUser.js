import React, {useState} from 'react';
import {View, StatusBar, ScrollView, Text} from 'react-native';
import {useFormik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';

import styles from './styles';
import {colors} from '@themes';
import {fetchApiChangeInfo, fetchChangePass} from 'store/accAuth/thunk';
import {translateLang} from 'store/accLanguages/slide';
import {
  LoadingModal,
  HeaderBack,
  Button,
  InputDefault,
  AttachManyFile,
  NotifierAlert,
} from '@components';

const EditInformationUser = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {userInfo, isSubmitting} = useSelector(state => state.Login);
  const languageKey = useSelector(translateLang);
  const [linkImage, setLinkImage] = useState(
    userInfo?.LinkAvatar?.trim() !== '' ? userInfo?.LinkAvatar : '',
  );
  const linkImgArray = linkImage ? linkImage.split(';').filter(Boolean) : [];
  const [images, setDataImages] = useState(linkImgArray);
  const [imagesAvt, setDataImagesAvt] = useState([userInfo?.Avatar]);
  const [linkAvt, setLinkImageAvt] = useState(userInfo?.Avatar);
  let initialValues = {
    UserMail: userInfo.UserEmail,
    UserName: userInfo?.UserFullName,
    UserPhone: userInfo?.UserPhone,
    UserAddress: userInfo?.CompanyAddress,
    // Note: userInfo?.UserDescription,
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    onSubmit: () => onSubmit(),
  });

  const onSubmit = async () => {
    const body = {
      UserPhone: values.UserPhone,
      UserEmail: values.UserEmail,
      UserFullName: values.UserName,
      UserAddress: values.UserAddress,
      UserName: userInfo?.UserName || '',
      UserDescription: '',
      Extention4: linkAvt?.toString() || '',
      CmpnID: userInfo?.CmpnID || 0,
      UserID: userInfo?.UserID || 0,
      IsConfig: userInfo?.IsConfig || 1,
      IsSale: userInfo?.IsSale,
      IsUnLock: userInfo?.IsUnLock,
      IsHold: 1,
      IsInfomationApp: 0,
      DomainLogin: 1,
      ViewStock: 10,
      Region: '51',
      IsActive: 1,
      IsDeleted: 0,
      DepartmentID: 0,
      PositionID: 1,
      Extention1: linkAvt?.toString() || '',
      Extention2: '',
      Extention3: '',
      Extention5: '',
      Extention6: '',
      Extention7: '',
      Extention8: '',
      Extention9: '',
      Extention10: '',
      RouteSales1: '',
      RouteSales2: '',
      RouteSales3: '',
      RouteSales4: '',
      ID: userInfo?.UserID || 0,
    };
    try {
      if (values.UserName.trim() !== '' && values.UserPhone.trim() !== '') {
        dispatch(fetchApiChangeInfo(body)).then(success => {
          if (success === true) {
            // console.log('success update info',success);
            // dispatch(updateUser(result[0]));
            // setUserInformation(JSON.stringify(result[0]));
            navigation.goBack();
          }
        });
      } else {
        NotifierAlert(
          3000,
          `${languageKey('_notification')}`,
          `${languageKey('please_required_select_fields')}`,
          'success',
        );
      }
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
          title={languageKey('_change_information')}
          onPress={() => navigation.goBack()}
        />
        <ScrollView style={styles.scrollView}>
          <View style={styles.bodyInput}>
            <InputDefault
              name="UserName"
              returnKeyType="next"
              style={styles.input}
              value={values?.UserName}
              label={languageKey('_user_name')}
              isEdit={true}
              bgColor={'#F9F9FB'}
              placeholderInput={true}
              labelHolder={languageKey('_enter_user_name')}
              {...{touched, errors, handleBlur, handleChange, setFieldValue}}
            />
            <InputDefault
              name="UserPhone"
              returnKeyType="next"
              style={styles.input}
              value={values?.UserPhone}
              label={languageKey('_phone')}
              isEdit={true}
              string={true}
              bgColor={'#F9F9FB'}
              placeholderInput={true}
              labelHolder={languageKey('_enter_phone')}
              {...{touched, errors, handleBlur, handleChange, setFieldValue}}
            />
            <InputDefault
              name="UserMail"
              returnKeyType="next"
              style={styles.input}
              value={values?.UserMail}
              label={'Email'}
              isEdit={true}
              bgColor={'#F9F9FB'}
              placeholderInput={true}
              labelHolder={languageKey('_enter_mail')}
              {...{touched, errors, handleBlur, handleChange, setFieldValue}}
            />
            <InputDefault
              name="UserAddress"
              returnKeyType="next"
              style={styles.input}
              value={values?.UserAddress}
              label={languageKey('_address')}
              isEdit={true}
              bgColor={'#F9F9FB'}
              placeholderInput={true}
              labelHolder={languageKey('_enter_address')}
              {...{touched, errors, handleBlur, handleChange, setFieldValue}}
            />
            {/* <InputDefault
              name="Note"
              returnKeyType="next"
              style={styles.input}
              value={values?.Note}
              label={languageKey('_describe')}
              isEdit={true}
              bgColor={'#F9F9FB'}
              placeholderInput={true}
              labelHolder={languageKey('_enter_a_description')}
              {...{touched, errors, handleBlur, handleChange, setFieldValue}}
            /> */}
          </View>
          <View style={styles.body_footer}>
            <View style={styles.imgBox}>
              <Text style={styles.labeAttach}>{languageKey('_avatar')}</Text>
              <AttachManyFile
                OID={userInfo?.UserID}
                images={images}
                setDataImages={setDataImages}
                setLinkImage={setLinkImage}
                dataLink={linkImage}
                single={true}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Button onPress={() => navigation.goBack()} style={styles.btnCancel}>
            <Text style={styles.textCancel}>{languageKey('_cancel')}</Text>
          </Button>
          <Button onPress={handleSubmit} style={styles.btnSave}>
            <Text style={styles.textChangePass}>{languageKey('_save')}</Text>
          </Button>
        </View>
      </SafeAreaView>
      <LoadingModal visible={isSubmitting} />
    </LinearGradient>
  );
};

export default EditInformationUser;
