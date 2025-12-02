import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from "react-native-linear-gradient";
import { SvgXml } from 'react-native-svg';
import { SafeAreaView } from "react-native-safe-area-context";

import { translateLang } from '../../store/accLanguages/slide';
import styles from './styles';
import { HeaderBack, Text } from '@components';
import { radio, radio_active } from '@svgImg';
import { updateLocale } from "../../store/accLanguages/slide";
import { setLocale } from '@storage';

const ChangeLanguageScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { locale, languageTypes } = useSelector(state => state.Language);
    const languageKey = useSelector(translateLang);
    const [selectedItem, setSelectedItem] = useState(locale);

    const handleSelection = (item) => {
        setSelectedItem(item)
        dispatch(updateLocale(item))
        setLocale(JSON.stringify(item));
    };

    return (
        <LinearGradient style={styles.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <SafeAreaView >
                <HeaderBack
                    title={languageKey('_change_language')}
                    onPress={() => navigation.goBack()}
                />
                <View style={styles.scrollView}>
                    <View style={styles.bodyInput}>
                        <View style={styles.row}>
                            {languageTypes.map((item, index) => (
                                <TouchableOpacity
                                    key={item.Code}
                                    style={index === languageTypes.length - 1 ? styles.cardNoBorder : styles.card}
                                    onPress={() => handleSelection(item)}
                                >
                                      {selectedItem && selectedItem.Code === item.Code ? (
                                        <SvgXml xml={radio_active} />
                                    ) : (
                                        <SvgXml xml={radio} />
                                    )}
                                    <Text bold style={styles.title}>
                                        {item.LanguageName}
                                    </Text>
                                  
                                </TouchableOpacity>
                            ))}

                        </View>
                    </View>
                </View>

            </SafeAreaView>
        </LinearGradient>
    );
};

export default ChangeLanguageScreen;
