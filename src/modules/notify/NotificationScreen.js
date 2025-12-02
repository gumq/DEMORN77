import React, {useEffect, useState} from 'react';
import {View, StatusBar, ScrollView} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import styles from './styles';
import {fetchListNotify, fetchTotalNotify} from '../../store/accNotify/thunk';
import {translateLang} from '../../store/accLanguages/slide';
import {HeaderBack, LoadingModal, TabsHeaderDevices} from '@components';
import {AllNotify, NotReadNotify, ReadNotify} from './component';
const LifeBuoySmartScreen = () => {
  const navigation = useNavigation();
  const {listNotify, isSubmitting, totalNotify} = useSelector(
    state => state.Notify,
  );
  const dispatch = useDispatch();
  const languageKey = useSelector(translateLang);

  const HEADER_TABS = [
    {id: 1, label: languageKey('_all')},
    {id: 2, label: languageKey('_unread')},
    {id: 3, label: languageKey('_viewed')},
  ];
console.log('listNotify',listNotify)
  const [selected, setSelect] = useState(HEADER_TABS[0]);

  const handleSelect = item => {
    setSelect(item);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchTotalNotify());
      dispatch(fetchListNotify());
    });
    return unsubscribe;
  }, [navigation]);

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
      <SafeAreaView style={styles.container}>
        <HeaderBack
          title={
            totalNotify === 0
              ? languageKey('_notification')
              : totalNotify + ' ' + languageKey('_notification_normal')
          }
          onPress={() => navigation.goBack()}
        />
        <View style={styles.scrollView}>
          <TabsHeaderDevices
            data={HEADER_TABS}
            selected={selected}
            onSelect={handleSelect}
            tabWidth={3}
          />

          <ScrollView
            style={styles.containerBody}
            showsVerticalScrollIndicator={false}>
            {selected.id === 1 && <AllNotify {...{listNotify}} />}
            {selected.id === 2 && <NotReadNotify {...{listNotify}} />}
            {selected.id === 3 && <ReadNotify {...{listNotify}} />}
          </ScrollView>
        </View>
      </SafeAreaView>
      <LoadingModal visible={isSubmitting} />
    </LinearGradient>
  );
};

export default LifeBuoySmartScreen;
