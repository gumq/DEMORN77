import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {SvgXml} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  View,
  StatusBar,
  ScrollView,
  LogBox,
  RefreshControl,
  FlatList,
  Dimensions,
  Text,
} from 'react-native';

import {noData} from '@svgImg';
import {styles} from './styles';
import routes from '@routes';
import {translateLang} from '@store/accLanguages/slide';
import {fetchListSurveyPrograms} from '@store/accSurvey_Program/thunk';
import {
  Button,
  HeaderBack,
  LoadingModal,
  SearchBar,
  SearchModal,
} from '@components';

const {height} = Dimensions.get('window');

const SurveyProgramScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const [isRefreshing, setRefresh] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const {isSubmitting, listSurveyPrograms} = useSelector(
    state => state.SurveyPrograms,
  );

  const refreshEvent = () => {
    setRefresh(true);
    dispatch(fetchListSurveyPrograms());
    setRefresh(false);
  };

  const onChangeText = textSearch => {
    if (textSearch?.length) {
      setSearchText(textSearch);
      const resultsData = SearchModal(listSurveyPrograms, textSearch);
      setSearchResults(resultsData);
    } else {
      setSearchResults(listSurveyPrograms);
    }
  };

  const moveOnSurveyHistory = item => {
    navigation.navigate(routes.HistorySurveyProgramScreen, {item: item});
  };

  const moveOnTakeSurvey = item => {
    navigation.navigate(routes.ChooseCustomerScreen, {item: item});
  };

  const itemHeight = 38 + 26 + 46;
  const numberOfItemsInScreen = Math.ceil(height / itemHeight);
  const windowSize = numberOfItemsInScreen * 2;

  const _keyExtractor = (item, index) => `${item.OID}-${index}`;
  const _renderItem = ({item}) => {
    return (
      <View style={styles.cardProgram}>
        <View style={styles.containerHeader}>
          <Text
            style={styles.headerProgram}
            numberOfLines={2}
            ellipsizeMode="tail">
            {item?.Name}
          </Text>
          <Text style={styles.txtHeaderTime}>
            {moment(item?.FromDate).format('DD/MM/YYYY')} -{' '}
            {moment(item?.ToDate).format('DD/MM/YYYY')}
          </Text>
        </View>
        {item?.Content ? (
          <Text style={styles.content}>{item?.Content}</Text>
        ) : null}
        <View style={styles.footer}>
          <Button
            style={styles.btnHistory}
            onPress={() => moveOnSurveyHistory(item)}>
            <Text style={styles.txtBtnHistory}>
              {languageKey('_survey_history')}
            </Text>
          </Button>
          <Button
            style={styles.btnTakeSurvey}
            onPress={() => moveOnTakeSurvey(item)}>
            <Text style={styles.txtBtnTakeSurvey}>
              {languageKey('_take_a_survey')}
            </Text>
          </Button>
        </View>
      </View>
    );
  };

  useEffect(() => {
    setSearchResults(listSurveyPrograms);
  }, [listSurveyPrograms]);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchListSurveyPrograms());
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
      <SafeAreaView>
        <HeaderBack
          title={languageKey('_survey_program')}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.scrollView}>
          <View style={styles.containerSearch}>
            <View style={styles.search}>
              <SearchBar
                value={searchText}
                onChangeText={text => {
                  setSearchText(text);
                  onChangeText(text);
                }}
              />
            </View>
          </View>

          {searchResults?.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={_renderItem}
              keyExtractor={_keyExtractor}
              initialNumToRender={numberOfItemsInScreen}
              maxToRenderPerBatch={numberOfItemsInScreen}
              windowSize={windowSize}
              contentContainerStyle={styles.flatScroll}
              removeClippedSubviews={true}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={refreshEvent}
                />
              }
            />
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={refreshEvent}
                />
              }>
              <View>
                <Text style={styles.txtHeaderNodata}>
                  {languageKey('_no_data')}
                </Text>
                <Text style={styles.txtContent}>
                  {languageKey('_we_will_back')}
                </Text>
                <SvgXml xml={noData} style={styles.imgEmpty} />
              </View>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
      <LoadingModal visible={isSubmitting} />
    </LinearGradient>
  );
};

export default SurveyProgramScreen;
