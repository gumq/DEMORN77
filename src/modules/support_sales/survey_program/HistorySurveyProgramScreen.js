import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, StatusBar, LogBox} from 'react-native';

import {stylesHistory} from './styles';
import {translateLang} from 'store/accLanguages/slide';
import {HeaderBack, LoadingModal, SurveyChart} from 'components';
import {fetchDataHistorySurvey} from 'store/accSurvey_Program/thunk';

const HistorySurveyProgramScreen = ({route}) => {
  const item = route?.params?.item;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const {isSubmitting, dataHistorySurvey} = useSelector(
    state => state.SurveyPrograms,
  );

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    const body = {OID: item?.OID};
    dispatch(fetchDataHistorySurvey(body));
  }, [item]);

  const parsedData = JSON.parse(dataHistorySurvey);

  const groupedData = parsedData?.reduce((acc, item) => {
    const {QuestionType, QuestionName} = item;

    if (!acc[QuestionType]) {
      acc[QuestionType] = {};
    }

    if (!acc[QuestionType][QuestionName]) {
      acc[QuestionType][QuestionName] = {
        Option: [],
      };
    }

    acc[QuestionType][QuestionName].Option.push(item);

    return acc;
  }, {});

  return (
    <LinearGradient
      style={stylesHistory.container}
      start={{x: 0.44, y: 0.45}}
      end={{x: 1.22, y: 0.25}}
      colors={['#FFFFFF', '#FFFFFF']}
      pointerEvents="box-none">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <SafeAreaView style={stylesHistory.container}>
        <HeaderBack
          title={languageKey('_survey_history')}
          onPress={() => navigation.goBack()}
        />
        <View style={stylesHistory.scrollView}>
          <SurveyChart data={groupedData} />
        </View>
      </SafeAreaView>
      <LoadingModal visible={isSubmitting} />
    </LinearGradient>
  );
};

export default HistorySurveyProgramScreen;
