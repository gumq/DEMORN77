import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {View, StatusBar, ScrollView, Platform} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

import {edit} from '@svgImg';
import routes from '@routes';
import {stylesDetail} from './styles';
import {DetailTab, ProgressTab} from './componentTab';
import {translateLang} from '@store/accLanguages/slide';
import {HeaderBack, LoadingModal, TabsHeaderDevices} from '@components';
import {fetchDetailCusRequirement} from '@store/accCus_Requirement/thunk';
import { scale } from '@utils/resolutions';

const DetailOrderRequestScreen = ({route, item}) => {
  const itemData = item || route?.params?.item;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const {isSubmitting, detailCusRequirement} = useSelector(
    state => state.CusRequirement,
  );

  const TAB_DETAILS_PROGRAM = [
    {id: 1, label: languageKey('_details')},
    {id: 2, label: languageKey('_progress')},
  ];

  const [selectedTab, setSelectTab] = useState(TAB_DETAILS_PROGRAM[0]);

  const selectTabEvent = item => {
    setSelectTab(item);
  };

  useEffect(() => {
    const body = {
      OID:
        itemData?.ReferenceID && itemData?.ReferenceID !== ''
          ? itemData?.ReferenceID
          : itemData?.OID,
    };
    dispatch(fetchDetailCusRequirement(body));
  }, [itemData]);

  const handleFormEdit = () => {
    navigation.navigate(routes.FormCustomerRequirement, {
      item: detailCusRequirement,
      editOrder: true,
    });
  };
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      style={[
        stylesDetail.container,
        {marginBottom: scale(Platform.OS === 'android' ? insets.bottom : 0)},
      ]}
      start={{x: 0.44, y: 0.45}}
      end={{x: 1.22, y: 0.25}}
      colors={['#FFFFFF', '#FFFFFF']}
      pointerEvents="box-none">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <SafeAreaView>
        <HeaderBack
          title={languageKey('_request_details')}
          onPress={() => navigation.goBack()}
          btn={detailCusRequirement?.IsLock === 0 ? true : false}
          onPressBtn={handleFormEdit}
          iconBtn={edit}
        />
        <View style={stylesDetail.scrollView}>
          <TabsHeaderDevices
            data={TAB_DETAILS_PROGRAM}
            selected={selectedTab}
            onSelect={selectTabEvent}
            tabWidth={2}
          />
          <ScrollView
            style={stylesDetail.containerBody}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={stylesDetail.footerScroll}>
            {selectedTab.id === 1 && (
              <DetailTab {...{detailCusRequirement, itemData}} />
            )}
            {selectedTab.id === 2 && (
              <ProgressTab {...{detailCusRequirement, itemData}} />
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
      <LoadingModal visible={isSubmitting} />
    </LinearGradient>
  );
};

export default DetailOrderRequestScreen;
