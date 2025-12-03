import React from "react";
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import routes from "@routes";
import { Button } from "@components";
import { stylesTest } from "../styles";
import { translateLang } from "@store/accLanguages/slide";

const TestTraining = ({ detailTraining }) => {
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const languageKey = useSelector(translateLang);
    const active = detailTraining?.Attendances?.length === detailTraining?.RequiredNumberSessions

    const handleTakeTest = () => {
        navigation.navigate(routes.TakeTestScreen, { item: detailTraining })
    }

    return (
        <View style={stylesTest.container}>
            <View style={stylesTest.cardProgram}>
                <Text style={stylesTest.headerProgram}>{detailTraining?.Name}</Text>
                <View style={stylesTest.containerContent}>
                    <View style={stylesTest.timeProgram}>
                        <Text style={stylesTest.txtHeaderTime}>{languageKey('_questions')}</Text>
                        <Text style={stylesTest.contentTime}>{detailTraining?.TotalQuestions} {languageKey('_sentences')}</Text>
                    </View>
                    <View style={stylesTest.timeProgram}>
                        <Text style={stylesTest.txtHeaderTime}>{languageKey('_time')}</Text>
                        <Text style={stylesTest.contentTime}>{detailTraining?.TimeLimit} {languageKey('_minute')}</Text>
                    </View>
                    <View style={stylesTest.timeProgram}>
                        <Text style={stylesTest.txtHeaderTime}>{languageKey('_score')}</Text>
                        <Text style={stylesTest.contentTime}>{detailTraining?.RequiredScore}</Text>
                    </View>
                </View>
                <Button
                    style={stylesTest.btnTest}
                    onPress={handleTakeTest}
                    disabled={!active}
                >
                    <Text style={stylesTest.txtBtnTest}>{languageKey('_take_a_test')}</Text>
                </Button>
            </View>

        </View>
    )
}

export default TestTraining;