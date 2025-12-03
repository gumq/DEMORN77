import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {View, StatusBar, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {styles} from './styles';
import {translateLang} from '@store/accLanguages/slide';
import {Content, TestTraining, Results, Attendance} from './componentTabDetail';
import {fetchDetailTraining} from '@store/accTraining_Testing/thunk';
import {HeaderBack, LoadingModal, TabsHeaderDevices} from '@components';

const DetailTrainingTestingScreen = ({route}) => {
  const item = route?.params?.item;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const {isSubmitting, detailTraining} = useSelector(
    state => state.TrainingTesting,
  );

  const TAB_DETAILS_TRAINING = [
    {id: 1, label: languageKey('_content')},
    {id: 2, label: languageKey('_test')},
    {id: 3, label: languageKey('_result')},
  ];

  const TAB_DETAILS_TRAINING_ATTENDANCE = [
    {id: 1, label: languageKey('_attendance')},
    {id: 2, label: languageKey('_content')},
    {id: 3, label: languageKey('_test')},
    {id: 4, label: languageKey('_result')},
  ];

  const [selectedTab, setSelectTab] = useState(
    item?.IsActive === 1
      ? TAB_DETAILS_TRAINING_ATTENDANCE[0]
      : TAB_DETAILS_TRAINING[0],
  );

  const selectTabEvent = item => {
    setSelectTab(item);
  };

  useEffect(() => {
    const body = {OID: item?.OID};
    dispatch(fetchDetailTraining(body));
  }, [item]);

  return (
    <LinearGradient
      style={styles.container}
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
        <HeaderBack title={item?.Name} onPress={() => navigation.goBack()} />
        <View style={styles.scrollView}>
          <TabsHeaderDevices
            data={
              item?.TrainingTypeName === 'Offline'
                ? TAB_DETAILS_TRAINING_ATTENDANCE
                : TAB_DETAILS_TRAINING
            }
            selected={selectedTab}
            onSelect={selectTabEvent}
            tabWidth={item?.TrainingTypeName === 'Offline' ? 4 : 3}
          />
          {item?.TrainingTypeName === 'Offline' ? (
            <ScrollView
              style={styles.containerBody}
              showsVerticalScrollIndicator={false}>
              {selectedTab.id === 1 && <Attendance {...{detailTraining}} />}
              {selectedTab.id === 2 && <Content {...{detailTraining}} />}
              {selectedTab.id === 3 && <TestTraining {...{detailTraining}} />}
              {selectedTab.id === 4 && <Results {...{detailTraining}} />}
            </ScrollView>
          ) : (
            <ScrollView
              style={styles.containerBody}
              showsVerticalScrollIndicator={false}>
              {selectedTab.id === 1 && <Content {...{detailTraining}} />}
              {selectedTab.id === 2 && <TestTraining {...{detailTraining}} />}
              {selectedTab.id === 3 && <Results {...{detailTraining}} />}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
      <LoadingModal visible={isSubmitting} />
    </LinearGradient>
  );
};

export default DetailTrainingTestingScreen;
