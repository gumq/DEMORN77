import React, { useEffect, useState } from "react";
import _ from 'lodash';
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, LogBox, Text, ToastAndroid, ScrollView } from "react-native";

import { colors } from "@themes";
import routes from "@routes";
import { styleTakeSurvey } from './styles'
import { translateLang } from "@store/accLanguages/slide";
import { ApiMarketResearchs_SaveAnswer } from "@api";
import { Button, HeaderBack, LoadingModal, QuestionRenderer } from "@components";
import { fetchListSurveyQuestions } from "@store/accSurvey_Program/thunk";
import { close_blue, next_blue, next_gray, previous_blue, previous_gray } from "@svgImg";

const TakeSurveyScreen = ({ route }) => {
    const item = route?.params?.item;
    const customer = route?.params?.customer;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { isSubmitting, listSurveyQuestions } = useSelector(state => state.SurveyPrograms);
    const [surveyAnswers, setSurveyAnswers] = useState({});

    const mergedQuestions = listSurveyQuestions?.Questions?.flatMap(question => {
        try {
            const options = typeof question.Options === 'string' ? JSON.parse(question.Options) : question.Options || [];
            return options.map(opt => ({ ...opt, rootID: question.QuestionID }));
        } catch (err) {
            console.warn("Lỗi parse Options:", err);
            return [];
        }
    }) || [];

    const convertData = (flatList) => {
        const map = {};
        const roots = [];

        flatList.forEach(item => {
            map[item.ID] = { ...item, Options: [] };
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

        const cleanId = (val) => {
            if (typeof val === "number" && Number.isInteger(val)) return val;
            const n = parseInt(val);
            return Number.isInteger(n) ? n : "";
        };

        const keyCounter = {};

        const getUniqueKey = (qID) => {
            if (!keyCounter[qID]) keyCounter[qID] = 0;
            const key = `${qID}_${keyCounter[qID]}`;
            keyCounter[qID]++;
            return key;
        };

        for (const [questionID, answer] of Object.entries(surveyAnswers)) {
            const currentQuestion = questionTree.find(q => q.ID == questionID);
            if (!currentQuestion) continue;

            const { QuestionType } = currentQuestion;
            const ans = answer?.answer;
            const other = answer?.otherAnswer || answer?.text || "";

            switch (QuestionType) {
                case "VB":
                    choices[getUniqueKey(questionID)] = [questionID, "", ans || ""];
                    break;

                case "TN":
                    if (ans) {
                        const optID = cleanId(typeof ans === "object" ? ans.ID : ans);
                        if (optID !== "") {
                            choices[getUniqueKey(questionID)] = [optID, "", other || ""];
                        }
                    }
                    break;

                case "HK":
                    if (Array.isArray(ans)) {
                        ans.forEach(opt => {
                            const optID = cleanId(typeof opt === "object" ? opt.ID : opt);
                            if (optID !== "") {
                                choices[getUniqueKey(questionID)] = [optID];
                            }
                        });
                    }
                    break;

                case "TDTT":
                    if (ans) {
                        const colID = cleanId(typeof ans === "object" ? ans.Column : ans);
                        choices[getUniqueKey(questionID)] = [colID, "", ""];
                    }
                    break;

                case "LTN":
                case "LHK":
                    if (typeof ans === "object" && ans !== null) {
                        for (const rowID in ans) {
                            const colVal = ans[rowID];
                            const cols = Array.isArray(colVal) ? colVal : [colVal];
                            const row = cleanId(rowID);

                            cols.forEach(col => {
                                const colClean = cleanId(col);
                                if (row !== "" && colClean !== "") {
                                    choices[getUniqueKey(questionID)] = [row, colClean];
                                }
                            });
                        }
                    }
                    break;

                default:
                    console.warn("Unhandled QuestionType:", QuestionType);
                    break;
            }
        }

        const stringified = Object.entries(choices)
            .map(([key, value]) => {
                const newKey = key.replace(/_\d+$/, "");
                return `"${newKey}": ${JSON.stringify(value)}`;
            })
            .join(",");

        const body = {
            OID: listSurveyQuestions?.OID || "",
            QuestionID: 0,
            CustomerID: customer?.ID || 0,
            Choices: stringified,
            AnswerContent: "",
        };

        try {
            const response = await ApiMarketResearchs_SaveAnswer(body);
            const result = response.data;

            if (result?.StatusCode === 200 && result?.ErrorCode === "0") {
                navigation.navigate(routes.SurveyProgramScreen);
            } else {
                ToastAndroid?.show?.("Lưu thất bại", ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error("Lỗi gửi tất cả câu trả lời:", error);
        }
    };

    const handleSaveAndNext = async () => {
        if (currentIndex < totalQuestions - 1) {
            const currentQuestion = questionTree[currentIndex];
            const { ID: QuestionID } = currentQuestion;
            const answer = surveyAnswers[QuestionID];

            if (!answer || (!answer.answer && !answer.otherAnswer && !answer.text)) {
                ToastAndroid?.show?.("Bạn chưa trả lời câu hỏi này", ToastAndroid.SHORT);
                return;
            }

            setCurrentIndex(currentIndex + 1);
        } else {
            const unanswered = questionTree.filter(q => {
                const a = surveyAnswers[q.ID];
                return !a || (!a.answer && !a.otherAnswer && !a.text);
            });

            if (unanswered.length > 0) {
                ToastAndroid?.show?.("Bạn còn câu hỏi chưa trả lời", ToastAndroid.SHORT);
                return;
            }
            handleSubmitAll();
        }
    };

    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

        const body = {
            OID: item?.OID,
        };
        dispatch(fetchListSurveyQuestions(body));
    }, [item]);

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
            style={styleTakeSurvey.container}
            start={{ x: 0.44, y: 0.45 }}
            end={{ x: 1.22, y: 0.25 }}
            colors={['#FFFFFF', '#FFFFFF']}
            pointerEvents="box-none"
        >
            <StatusBar
                animated={true}
                backgroundColor={colors.white}
                barStyle="dark-content"
                translucent
            />
            <SafeAreaView>
                <HeaderBack
                    title={languageKey('_customer_survey')}
                    btn={true}
                    iconBtn={close_blue}
                    onPressBtn={() => navigation.goBack()}
                />
                <View style={styleTakeSurvey.content}>
                    <View style={styleTakeSurvey.containerHeader}>
                        <Button
                            onPress={() => handlePrevious()}
                            disabled={currentIndex === 0}
                        >
                            <SvgXml xml={currentIndex === 0 ? previous_gray : previous_blue} />
                        </Button>

                        <Text style={styleTakeSurvey.totalQuestion}>
                            {currentIndex + 1}/{totalQuestions}
                        </Text>
                        <Button
                            onPress={() => handleNextTest()}
                            disabled={currentIndex === totalQuestions - 1}
                        >
                            <SvgXml xml={currentIndex === totalQuestions - 1 ? next_gray : next_blue} />
                        </Button>
                    </View>
                    <ScrollView
                        style={styleTakeSurvey.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styleTakeSurvey.flatScroll}
                    >
                        <QuestionRenderer
                            questions={questionTree}
                            onChangeAnswers={setSurveyAnswers}
                            mode="single"
                            currentIndex={currentIndex}
                        />
                    </ScrollView>
                </View>
            </SafeAreaView>
            <View style={styleTakeSurvey.containerFooter}>
                <Button
                    style={styleTakeSurvey.btnFooter}
                    onPress={handleSaveAndNext}
                >
                    <Text style={styleTakeSurvey.txtBtnFooter}>{currentIndex === totalQuestions - 1 ? languageKey('_complete') : languageKey('_next')}</Text>
                </Button>
            </View>
            <LoadingModal visible={isSubmitting} />
        </LinearGradient>
    );
};

export default TakeSurveyScreen;