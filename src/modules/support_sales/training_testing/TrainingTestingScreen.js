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
import {fetchListTraining} from '@store/accTraining_Testing/thunk';
import {
  Button,
  HeaderBack,
  LoadingModal,
  SearchBar,
  SearchModal,
} from '@components';

const {height} = Dimensions.get('window');

const TrainingTestingScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const [isRefreshing, setRefresh] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const {isSubmitting, listTraining} = useSelector(
    state => state.TrainingTesting,
  );

  const refreshEvent = () => {
    setRefresh(true);
    dispatch(fetchListTraining());
    setRefresh(false);
  };

  const onChangeText = textSearch => {
    if (textSearch?.length) {
      setSearchText(textSearch);
      const resultsData = SearchModal(listTraining, textSearch);
      setSearchResults(resultsData);
    } else {
      setSearchResults(listTraining);
    }
  };

  const moveToDetailProgram = item => {
    navigation.navigate(routes.DetailTrainingTestingScreen, {item: item});
  };

  const itemHeight = 30 + 8 + 22;
  const numberOfItemsInScreen = Math.ceil(height / itemHeight);
  const windowSize = numberOfItemsInScreen * 2;

  const _keyExtractor = (item, index) => `${item.OID}-${index}`;
  const _renderItem = ({item}) => {
    return (
      <Button onPress={() => moveToDetailProgram(item)}>
        <View style={styles.cardProgram}>
          <Text style={styles.headerProgram}>{item?.Name}</Text>
          <View style={styles.containerStatus}>
            <View
              style={[
                styles.bodyStatusType,
                {
                  backgroundColor:
                    item?.TrainingTypeName === 'Online' ? '#DCFCE7' : '#DBEAFE',
                },
              ]}>
              <Text
                style={[
                  styles.txtStatus,
                  {
                    color:
                      item?.TrainingTypeName === 'Online'
                        ? '#166534'
                        : '#1E40AF',
                  },
                ]}>
                {item?.TrainingTypeName}
              </Text>
            </View>
            <View
              style={[
                styles.bodyStatus,
                {
                  backgroundColor:
                    item?.CompletedCode === 1 ? '#DCFCE7' : '#F5F5F5',
                },
              ]}>
              <Text
                style={[
                  styles.txtStatus,
                  {color: item?.CompletedCode === 1 ? '#166534' : '#000000'},
                ]}>
                {item?.TrainingStatus}
              </Text>
            </View>
          </View>
          <View style={styles.content}>
            {item?.Subjects ? (
              <View style={styles.timeProgram}>
                <Text style={styles.txtHeaderTime}>
                  {languageKey('_applicable_subjects')}
                </Text>
                <Text style={styles.contentTime}>{item?.Subjects}</Text>
              </View>
            ) : null}
            {item?.RequiredNumberSessions ? (
              <View style={styles.timeProgram}>
                <Text style={styles.txtHeaderTime}>
                  {languageKey('_number_of_sessions_required')}
                </Text>
                <Text style={styles.contentTime}>
                  {item?.RequiredNumberSessions}
                </Text>
              </View>
            ) : null}
          </View>
          {item?.Content ? (
            <View style={styles.timeProgram}>
              <Text style={styles.txtHeaderTime}>
                {languageKey('_program_goals')}
              </Text>
              <Text style={styles.contentProgram}>{item?.Content}</Text>
            </View>
          ) : null}

          <View style={styles.timeProgram}>
            <Text style={styles.txtHeaderTime}>{languageKey('_time')}</Text>
            <Text style={styles.contentTime}>
              {moment(item?.FromDate).format('DD/MM/YYYY')} -{' '}
              {moment(item?.ToDate).format('DD/MM/YYYY')}
            </Text>
          </View>
        </View>
      </Button>
    );
  };

  useEffect(() => {
    setSearchResults(listTraining);
  }, [listTraining]);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchListTraining());
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
          title={languageKey('_training_testing')}
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
              contentContainerStyle={styles.flatListContainer}
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

export default TrainingTestingScreen;
