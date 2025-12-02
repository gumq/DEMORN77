import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import {SvgXml} from 'react-native-svg';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, StatusBar, Text, ToastAndroid, Alert} from 'react-native';

import {colors} from 'themes';
import routes from 'modules/routes';
import {styleTakeTest} from './styles';
import {translateLang} from 'store/accLanguages/slide';
import {ApiTrainings_SaveChoices} from 'action/Api';
import {Button, HeaderBack, QuestionRenderer} from 'components';
import {
  close_blue,
  next_blue,
  next_gray,
  previous_blue,
  previous_gray,
} from 'svgImg';

const TakeTestScreen = ({route}) => {
  const item = route?.params?.item;
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const [currentIndex, setCurrentIndex] = useState(0);
  const {detailTraining} = useSelector(state => state.TrainingTesting);
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const listTrainingQuestions = detailTraining?.Questions || [];
  const {TimeLimit} = item;
  const [timeRemaining, setTimeRemaining] = useState(TimeLimit * 60);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!hasSubmitted) {
            setHasSubmitted(true);
            handleAutoSubmit();
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [hasSubmitted, currentIndex]);

  const handleAutoSubmit = async () => {
    try {
      handleSubmitAll();
      Alert.alert(languageKey('_time_up'), languageKey('_system_auto_submit'), [
        {
          text: 'OK',
        },
      ]);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  const mergedQuestions =
    listTrainingQuestions?.flatMap(question => {
      try {
        const options =
          typeof question.Options === 'string'
            ? JSON.parse(question.Options)
            : question.Options || [];
        return options.map(opt => ({...opt, rootID: question.QuestionID}));
      } catch (err) {
        console.warn('Lỗi parse Options:', err);
        return [];
      }
    }) || [];

  const convertData = flatList => {
    const map = {};
    const roots = [];

    flatList.forEach(item => {
      map[item.ID] = {...item, Options: []};
    });

    flatList.forEach(item => {
      const parent = map[item.ParentID];
      if (item.ParentID !== item.ID && parent) {
        parent.Options.push(map[item.ID]);
      } else if (!parent || item.ParentID === 0) {
        roots.push(map[item.ID]);
      }
    });

    return roots;
  };

  const cleanList = _.uniqBy(mergedQuestions, 'ID');
  const questionTree = convertData(cleanList);
  const totalQuestions = questionTree.length;

  const handleSubmitAll = async () => {
    const choices = {};

    const cleanId = val => {
      if (typeof val === 'number' && Number.isInteger(val)) return val;
      const n = parseInt(val);
      return Number.isInteger(n) ? n : '';
    };

    const keyCounter = {};

    const getUniqueKey = qID => {
      if (!keyCounter[qID]) keyCounter[qID] = 0;
      const key = `${qID}_${keyCounter[qID]}`;
      keyCounter[qID]++;
      return key;
    };

    for (const [questionID, answer] of Object.entries(surveyAnswers)) {
      const currentQuestion = questionTree.find(q => q.ID == questionID);
      if (!currentQuestion) continue;

      const {QuestionType} = currentQuestion;
      const ans = answer?.answer;
      const other = answer?.otherAnswer || answer?.text || '';

      switch (QuestionType) {
        case 'CHKT':
          if (ans) {
            const optID = cleanId(typeof ans === 'object' ? ans.ID : ans);
            if (optID !== '') {
              choices[getUniqueKey(questionID)] = [optID, '', other || ''];
            }
          }
          break;
        default:
          console.warn('Unhandled QuestionType:', QuestionType);
          break;
      }
    }

    const stringified = Object.entries(choices)
      .map(([key, value]) => {
        const newKey = key.replace(/_\d+$/, '');
        return `"${newKey}": ${JSON.stringify(value)}`;
      })
      .join(',');

    const body = {
      OID: detailTraining?.OID || '',
      QuestionID: 0,
      CustomerID: 0,
      Choices: stringified,
      AnswerContent: '',
    };

    try {
      const response = await ApiTrainings_SaveChoices(body);
      const result = response.data;

      if (result?.StatusCode === 200 && result?.ErrorCode === '0') {
        navigation.navigate(routes.TrainingTestingScreen);
      } else {
        ToastAndroid?.show?.('Lưu thất bại', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Lỗi gửi tất cả câu trả lời:', error);
    }
  };

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSaveAndNext = async () => {
    if (currentIndex < totalQuestions - 1) {
      const currentQuestion = questionTree[currentIndex];
      const {ID: QuestionID} = currentQuestion;
      const answer = surveyAnswers[QuestionID];

      if (!answer || (!answer.answer && !answer.otherAnswer && !answer.text)) {
        ToastAndroid?.show?.(
          'Bạn chưa trả lời câu hỏi này',
          ToastAndroid.SHORT,
        );
        return;
      }

      setCurrentIndex(currentIndex + 1);
    } else {
      const unanswered = questionTree.filter(q => {
        const a = surveyAnswers[q.ID];
        return !a || (!a.answer && !a.otherAnswer && !a.text);
      });

      if (unanswered.length > 0) {
        ToastAndroid?.show?.(
          'Bạn còn câu hỏi chưa trả lời',
          ToastAndroid.SHORT,
        );
        return;
      }
      handleSubmitAll();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextTest = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <LinearGradient
      style={styleTakeTest.container}
      start={{x: 0.44, y: 0.45}}
      end={{x: 1.22, y: 0.25}}
      colors={['#FFFFFF', '#FFFFFF']}
      pointerEvents="box-none">
      <StatusBar
        animated={true}
        backgroundColor={colors.white}
        barStyle="dark-content"
        translucent
      />
      <SafeAreaView>
        <HeaderBack
          title={languageKey('_test')}
          btn={true}
          iconBtn={close_blue}
          onPressBtn={() => navigation.goBack()}
        />
        <View style={styleTakeTest.content}>
          <View style={styleTakeTest.containerHeader}>
            <Button
              onPress={() => handlePrevious()}
              disabled={currentIndex === 0}>
              <SvgXml
                xml={currentIndex === 0 ? previous_gray : previous_blue}
              />
            </Button>

            <Text style={styleTakeTest.totalQuestion}>
              {currentIndex + 1}/{totalQuestions}
            </Text>
            <Button
              onPress={() => handleNextTest()}
              disabled={currentIndex === totalQuestions - 1}>
              <SvgXml
                xml={
                  currentIndex === totalQuestions - 1 ? next_gray : next_blue
                }
              />
            </Button>
          </View>
          <View style={styleTakeTest.scrollView}>
            <QuestionRenderer
              questions={questionTree}
              onChangeAnswers={setSurveyAnswers}
              mode="single"
              currentIndex={currentIndex}
            />
          </View>
        </View>
      </SafeAreaView>

      <View style={styleTakeTest.containerFooter}>
        <Text style={styleTakeTest.timeRemainingText}>
          {languageKey('_remaining_time')} {`${formatTime(timeRemaining)}`}
        </Text>
        <Button style={styleTakeTest.btnFooter} onPress={handleSaveAndNext}>
          <Text style={styleTakeTest.txtBtnFooter}>
            {currentIndex === totalQuestions - 1
              ? languageKey('_complete')
              : languageKey('_next')}
          </Text>
        </Button>
      </View>
    </LinearGradient>
  );
};

export default TakeTestScreen;
