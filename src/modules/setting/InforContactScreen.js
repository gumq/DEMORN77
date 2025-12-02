import React from 'react';
import {View, Image, ScrollView, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';

import {translateLang} from '../../store/accLanguages/slide';
import styles from './styles';
import {Button, HeaderBack} from '../../components';
import routes from '../routes';
import {SvgXml} from 'react-native-svg';
import {scale} from 'utils/resolutions';
import { colors } from 'themes';
import { chevronleft, close_blue } from 'svgImg';

const InforContactScreen = () => {
  const {inforCompany, userInfo} = useSelector(state => state.Login);
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);

  const handleEditInformation = () => {
    navigation.navigate(routes.EditInformationUser);
  };

  return (
    <LinearGradient
      start={{x: 0.44, y: 0.45}}
      end={{x: 1.22, y: 0.25}}
      colors={['#00A6FB', '#0466C8']}
      pointerEvents="box-none"
      style={styles.headerGradient}>
      <Button onPress={() => navigation.goBack()} style={styles.btnMenu}>
        <SvgXml
          xml={chevronleft.replace('#3B82F6', colors.white)}
          width={scale(24)}
          height={scale(24)}
        />
      </Button>
      <View style={styles.headerContentnew}>
        <View style={styles.viewavatar}>
           {userInfo?.Avatar?.includes('https://') ||
          userInfo?.Avatar?.includes('http://') ? (
            <Image
              source={{uri: userInfo?.Avatar}}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require('../../assets/avatar.png')}
              style={styles.avatar}
            />
          )}
        </View>
        <View style={{height: scale(40), width: '100%'}} />
        <View style={styles.itemBody}>
          <Text style={styles.userName} numberOfLines={2} ellipsizeMode="tail">
            {userInfo?.UserFullName}{' '}
          </Text>
        </View>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.companyName}>
          {userInfo?.DepartmentName || ''}
        </Text>
      </View>
      <ScrollView bounces={false} style={styles.scrollView}>
        <View style={styles.bodyInput}>
          <View style={styles.row_two}>
            <View style={styles.contentInfo}>
              <Text style={styles.txtHeader_two}>{languageKey('_phone')}</Text>
              <Text style={styles.txtContent}>
                {userInfo?.Phone || userInfo?.UserPhone}
              </Text>
            </View>
            <View style={styles.line} />
            <View style={styles.contentInfo}>
              <Text style={styles.txtHeader_two}>Email</Text>
              <Text style={styles.txtContent}>
                {userInfo?.Email || userInfo?.UserEmail}
              </Text>
            </View>
            <View style={styles.line} />
            <View style={styles.contentInfoBottom}>
              <Text style={styles.txtHeader_two}>
                {languageKey('_address')}
              </Text>
              <Text style={styles.txtContent}>
                {inforCompany?.CompanyConfigAddress || userInfo?.UserAddress}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button onPress={handleEditInformation} style={styles.btnChangePass}>
          <Text style={styles.textChangePass}>
            {languageKey('_edit_information')}
          </Text>
        </Button>
      </View>
    </LinearGradient>
  );
};

export default InforContactScreen;
