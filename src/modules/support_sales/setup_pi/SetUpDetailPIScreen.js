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

import {noData} from 'svgImg';
import {styles} from './styles';
import routes from 'modules/routes';
import {translateLang} from 'store/accLanguages/slide';
import {fetchDetailSetUpPI, fetchListSetUpPI} from 'store/accSetup_PI/thunk';
import {
  Button,
  HeaderBack,
  LoadingModal,
  SearchBar,
  SearchModal,
} from 'components';

const {height} = Dimensions.get('window');

const SetUpDetailPIScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const [isRefreshing, setRefresh] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const {isSubmitting, listSetUpPI} = useSelector(state => state.SetUpDetailPI);

  const refreshEvent = () => {
    setRefresh(true);
    dispatch(fetchListSetUpPI());
    setRefresh(false);
  };

  const onChangeText = textSearch => {
    if (textSearch?.length) {
      setSearchText(textSearch);
      const resultsData = SearchModal(listSetUpPI, textSearch);
      setSearchResults(resultsData);
    } else {
      setSearchResults(listSetUpPI);
    }
  };

  const navigateDetailPI = item => {
    const body = {
      OID: item.OID,
    };
    dispatch(fetchDetailSetUpPI(body));
    navigation.navigate(routes.ListSetUpPIScreen);
  };

  const itemHeight = 30 + 26 + 4 + 44 + 44 + 44;
  const numberOfItemsInScreen = Math.ceil(height / itemHeight);
  const windowSize = numberOfItemsInScreen * 2;

  const _keyExtractor = (item, index) => `${item.OID}-${index}`;
  const _renderItem = ({item}) => {
    return (
      <Button onPress={() => navigateDetailPI(item)}>
        <View style={styles.cardProgram}>
          <Text style={styles.headerProgram}>
            {item?.OID} - {moment(item?.ODate).format('DD/MM/YYYY')}
          </Text>
          <Text style={styles.txtHeaderName}>{item?.Name}</Text>

          <View style={styles.timeProgram}>
            <Text style={styles.txtHeaderTime}>{languageKey('_time')}</Text>
            <Text style={styles.contentTime}>
              {item?.From} - {item?.To}
            </Text>
          </View>
          {item?.Departments ? (
            <View style={styles.timeProgram}>
              <Text style={styles.txtHeaderTime}>
                {languageKey('_applied_department')}
              </Text>
              <Text style={styles.contentTime}>{item?.Departments}</Text>
            </View>
          ) : null}
          {item?.Positions ? (
            <View style={styles.timeProgram}>
              <Text style={styles.txtHeaderTime}>
                {languageKey('_employess_apply')}
              </Text>
              <Text style={styles.contentTime}>{item?.Positions}</Text>
            </View>
          ) : null}
          {item?.Regions ? (
            <View style={styles.timeProgram}>
              <Text style={styles.txtHeaderTime}>
                {languageKey('_applicable_area')}
              </Text>
              <Text style={styles.contentTime}>{item?.Regions}</Text>
            </View>
          ) : null}
          {item?.Content ? (
            <View style={styles.timeProgram}>
              <Text style={styles.txtHeaderTime}>
                {languageKey('_program_goals')}
              </Text>
              <Text style={styles.contentTime}>{item?.Content}</Text>
            </View>
          ) : null}

          {item?.Note ? (
            <View style={styles.timeProgram}>
              <Text style={styles.txtHeaderTime}>{languageKey('_note')}</Text>
              <Text style={styles.contentTime}>{item?.Note}</Text>
            </View>
          ) : null}
        </View>
      </Button>
    );
  };

  useEffect(() => {
    setSearchResults(listSetUpPI);
  }, [listSetUpPI]);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchListSetUpPI());
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
          title={languageKey('_set_up_pi_details')}
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
              removeClippedSubviews={true}
              style={styles.flatScroll}
              showsVerticalScrollIndicator={false}
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

export default SetUpDetailPIScreen;
