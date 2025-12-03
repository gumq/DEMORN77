/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, StatusBar, Text, FlatList} from 'react-native';

import {colors} from '@themes';
import {close_blue} from '@svgImg';
import routes from '@routes';
import {stylesDetail} from './styles';
import {HeaderBack, LoadingModal} from '@components';
import {translateLang} from '@store/accLanguages/slide';
import {
  fetchDetailTraining,
  fetchListTrainingQuestions,
} from '@store/accTraining_Testing/thunk';

const DetailTestingScreen = ({route}) => {
  const item = route?.params?.item;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const {isSubmitting, detailTraining, listTrainingQuestions} = useSelector(
    state => state.TrainingTesting,
  );

  useEffect(() => {
    const body = {OID: item?.OID};
    dispatch(fetchDetailTraining(body));
    const bodyAnswer = {
      OID: detailTraining?.OID,
      IsTesting: 0,
    };
    dispatch(fetchListTrainingQuestions(bodyAnswer));
  }, [item]);

  const getCorrectAnswer = answers => {
    const parsedAnswers = JSON.parse(answers);
    const correctAnswer = parsedAnswers.find(answer => answer.IsCorrect === 1);
    return correctAnswer?.Title || 'Không có đáp án đúng';
  };

  const renderItem = ({item, index}) => (
    <View key={item.ID} style={stylesDetail.card}>
      <Text style={stylesDetail.questionText}>
        Câu {index + 1}: {item.Title}: {item?.Content}
      </Text>
      <Text style={stylesDetail.answerText}>
        {languageKey('_answer_detail')} {getCorrectAnswer(item.Answers)}
      </Text>
    </View>
  );

  return (
    <LinearGradient
      style={stylesDetail.container}
      start={{x: 0.44, y: 0.45}}
      end={{x: 1.22, y: 0.25}}
      colors={['#FFFFFF', '#FFFFFF']}
      pointerEvents="box-none">
      <StatusBar
        animated={true}
        backgroundColor={colors.white}
        barStyle={'dark-content'}
        translucent={true}
      />
      <SafeAreaView style={stylesDetail.container}>
        <HeaderBack
          title={languageKey('_test')}
          btn={true}
          iconBtn={close_blue}
          onPressBtn={() => navigation.navigate(routes.TrainingTestingScreen)}
        />
        <View style={stylesDetail.scrollView}>
          <View style={stylesDetail.container}>
            <View style={stylesDetail.cardProgram}>
              <View style={stylesDetail.containerResult}>
                <Text style={stylesDetail.txtHeaderResult}>
                  {languageKey('_your_results')}
                </Text>
                <View
                  style={[
                    stylesDetail.bodyStatus,
                    {
                      backgroundColor:
                        detailTraining?.IsComplete === 1
                          ? '#DCFCE7'
                          : '#FEE2E2',
                    },
                  ]}>
                  <Text
                    style={[
                      stylesDetail.txtStatus,
                      {
                        color:
                          detailTraining?.IsComplete === 1
                            ? '#166534'
                            : '#991B1B',
                      },
                    ]}>
                    {detailTraining?.IsComplete === 1
                      ? languageKey('_passed')
                      : languageKey('_failed')}
                  </Text>
                </View>
              </View>
              <View style={stylesDetail.containerScore}>
                <Text style={stylesDetail.txtHeaderScore}>
                  {languageKey('_your_score')}
                </Text>
                <Text style={stylesDetail?.contentScore}>
                  {detailTraining?.Result}/{detailTraining?.QuestionsCount}
                </Text>
              </View>
            </View>

            <View style={stylesDetail.cardProgram}>
              <Text style={stylesDetail.txtHeaderDetail}>
                {languageKey('_test_details')}
              </Text>
              <FlatList
                data={listTrainingQuestions}
                renderItem={renderItem}
                keyExtractor={item => item.ID.toString()}
                contentContainerStyle={stylesDetail.containerFlat}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
      <LoadingModal visible={isSubmitting} />
    </LinearGradient>
  );
};

export default DetailTestingScreen;
