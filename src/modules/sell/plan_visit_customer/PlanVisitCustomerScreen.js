import React, {useEffect, useState} from 'react';
import {SvgXml} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {View, StatusBar, ScrollView, LogBox, Platform} from 'react-native';

import {styles} from './styles';
import {plus_white} from '@svgImg';
import routes from '@routes';
import {translateLang} from '@store/accLanguages/slide';
import {Button, HeaderBack, LoadingModal, TabsHeaderDevices} from '@components';
import {
  AllApprovalProcess,
  Approved,
  RefuseApproval,
  WaitingApprovalProcess,
} from './componentTab';
import {fetchListPlanVisitCustomer} from '@store/accVisit_Customer/thunk';
import {fetchListUserByUserID} from '@store/accAuth/thunk';
import {scale} from '@utils/resolutions';;

const PlanVisitCustomerScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const {userInfo} = useSelector(state => state.Login);
  const {isSubmitting, listPlanVisitCustomer} = useSelector(
    state => state.VisitCustomer,
  );

  const TAB_APPROVAL_PROCESS = [
    {id: 1, label: languageKey('_all')},
    {id: 2, label: languageKey('_waiting_approval')},
    {id: 3, label: languageKey('_approved')},
    {id: 4, label: languageKey('_refuse')},
  ];

  const [selectedTab, setSelectTab] = useState(TAB_APPROVAL_PROCESS[0]);

  const selectTabEvent = item => {
    setSelectTab(item);
  };

  useEffect(() => {
    const body = {
      UserID: userInfo?.UserID,
    };
    dispatch(fetchListUserByUserID(body));
  }, []);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchListPlanVisitCustomer());
    });
    return unsubscribe;
  }, [navigation]);

  const handleAddPlanVisitCustomer = () => {
    navigation.navigate(routes.FormPlanVisitCustomer);
  };
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      style={[
        styles.container,
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
      <SafeAreaView style={styles.container}>
        <HeaderBack
          title={languageKey('_plan_to_visit_customers')}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.scrollView}>
          <TabsHeaderDevices
            data={TAB_APPROVAL_PROCESS}
            selected={selectedTab}
            onSelect={selectTabEvent}
            tabWidth={4}
          />

          <ScrollView
            style={styles.containerBody}
            showsVerticalScrollIndicator={false}>
            {selectedTab.id === 1 && (
              <AllApprovalProcess {...{listPlanVisitCustomer}} />
            )}
            {selectedTab.id === 2 && (
              <WaitingApprovalProcess {...{listPlanVisitCustomer}} />
            )}
            {selectedTab.id === 3 && <Approved {...{listPlanVisitCustomer}} />}
            {selectedTab.id === 4 && (
              <RefuseApproval {...{listPlanVisitCustomer}} />
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
      <Button style={styles.btnAdd} onPress={handleAddPlanVisitCustomer}>
        <SvgXml xml={plus_white} />
      </Button>
      <LoadingModal visible={isSubmitting} />
    </LinearGradient>
  );
};

export default PlanVisitCustomerScreen;
