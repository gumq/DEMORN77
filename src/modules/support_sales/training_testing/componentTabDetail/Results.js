import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, FlatList } from "react-native";

import { stylesDetail } from '../styles'
import { translateLang } from "@store/accLanguages/slide";
import { fetchDetailTraining, fetchListTrainingQuestions } from "@store/accTraining_Testing/thunk";
import { noData } from "@svgImg";
import { SvgXml } from "react-native-svg";

const DetailTestingScreen = ({ route }) => {
    const languageKey = useSelector(translateLang)
    const { detailTraining } = useSelector(state => state.TrainingTesting);

    const getCorrectAnswer = (answers) => {
        const parsedAnswers = JSON.parse(answers);
        const correctAnswer = parsedAnswers?.find((answer) => answer.IsCorrect === 1);
        return correctAnswer?.Title || "Không có đáp án đúng";
    };

    const renderItem = ({ item, index }) => (
        <View key={item.ID} style={stylesDetail.card}>
            <Text style={stylesDetail.questionText}>
                Câu {index + 1}: {item.QuestionName}
            </Text>
            <View style={stylesDetail.containerAnswer}>
                <Text style={stylesDetail.titleAnswer}>{languageKey('_answer_detail')}</Text>
                <Text style={stylesDetail.answerText}> {item?.AnswerName}</Text>
            </View>
        </View>
    );

    return (
        <View style={stylesDetail.containerFlat}>
            {detailTraining?.Results?.length > 0 ?
                <View style={stylesDetail.scrollView}>
                    <View style={stylesDetail.container}>
                        <View style={stylesDetail.cardProgram} >
                            <View style={stylesDetail.containerResult}>
                                <Text style={stylesDetail.txtHeaderResult}>{languageKey('_your_results')}</Text>
                                <View
                                    style={[
                                        stylesDetail.bodyStatus,
                                        {
                                            backgroundColor: detailTraining?.Results[0]?.CompletedCode === 1 ? '#DCFCE7' : '#FEE2E2',
                                        }
                                    ]}
                                >
                                    <Text style={[
                                        stylesDetail.txtStatus,
                                        { color: detailTraining?.Results[0]?.CompletedCode === 1 ? '#166534' : '#991B1B' }
                                    ]}>
                                        {detailTraining?.Results[0]?.CompletedCode === 1 ? languageKey('_passed') : languageKey('_failed')}
                                    </Text>
                                </View>
                            </View>
                            <View style={stylesDetail.containerScore}>
                                <Text style={stylesDetail.txtHeaderScore}>{languageKey('_your_score')}</Text>
                                <Text style={stylesDetail?.contentScore}>{detailTraining?.Results[0]?.CorrectAnswerCount}</Text>
                            </View>
                        </View>

                        <View style={stylesDetail.cardProgram} >
                            <Text style={stylesDetail.txtHeaderDetail}>{languageKey('_test_details')}</Text>
                            <FlatList
                                data={detailTraining?.Results}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.QuestionID.toString()}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </View>
                </View>
                :
                <View>
                    <Text style={stylesDetail.txtHeaderNodata}>{languageKey('_no_data')}</Text>
                    <Text style={stylesDetail.txtContent}>{languageKey('_we_will_back')}</Text>
                    <SvgXml xml={noData} style={stylesDetail.imgEmpty} />
                </View>
            }
        </View>
    )
}

export default DetailTestingScreen;