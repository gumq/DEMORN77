import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { translateLang } from 'store/accLanguages/slide';
import { checkbox_20, checkbox_active_20, radio, radio_active } from 'svgImg';
import { colors, fontSize } from 'themes';
import { hScale, scale } from 'utils/resolutions';
import { uniqBy } from 'lodash'

const QuestionRenderer = ({ questions, onChangeAnswers, dataEdit, mode = 'all', currentIndex = 0 }) => {
    const [surveyAnswers, setSurveyAnswers] = useState({});

    useEffect(() => {
        if (dataEdit) {
            setSurveyAnswers(dataEdit);
        }
    }, [dataEdit]);

    const handleAnswerChange = (questionID, newData) => {
        const question = questions.find(q => q.ID === questionID);
        if (question) {
            const updatedAnswers = {
                ...surveyAnswers,
                [questionID]: {
                    ...surveyAnswers[questionID],
                    ...newData,
                    QuestionType: question.QuestionType,
                },
            };

            setSurveyAnswers(updatedAnswers);

            if (onChangeAnswers) {
                onChangeAnswers(updatedAnswers);
            }
        }
    };

    if (!questions || !Array.isArray(questions)) {
        return <Text>Không có câu hỏi để hiển thị.</Text>;
    }

    const questionListToRender = mode === 'single'
        ? (questions[currentIndex] ? [questions[currentIndex]] : [])
        : questions;

    return (
        <View style={styles.container}>
            {questionListToRender.map((q, index) => {
                const answerObj = surveyAnswers[q.ID] || {};
                const value = answerObj.answer || null;
                const id = answerObj.id || null;

                if (!Array.isArray(q.Options)) {
                    console.warn(`Question ID ${q.ID} has invalid Options`, q.Options);
                }

                switch (q.QuestionType) {
                    case 'TN':
                        return <RadioQuestion key={q.ID} question={q} index={index} onAnswerChange={handleAnswerChange} value={value} id={id} />;
                    case 'CHKT':
                        return <TrainingQuestion key={q.ID} question={q} index={index} onAnswerChange={handleAnswerChange} value={value} id={id} />;
                    case 'HK':
                        return <CheckboxQuestion key={q.ID} question={q} index={index} onAnswerChange={handleAnswerChange} value={value} id={id} />;
                    case 'TÐTT':
                    case 'TDTT':
                        return <LinearScaleQuestion key={q.ID} question={q} index={index} onAnswerChange={handleAnswerChange} value={value} id={id} />;
                    case 'VB':
                        return <TextQuestion key={q.ID} question={q} index={index} onAnswerChange={handleAnswerChange} value={value} id={id} />;
                    case 'LTN':
                        return <GridRadioQuestion key={q.ID} question={q} index={index} onAnswerChange={handleAnswerChange} value={value} id={id} />;
                    case 'LHK':
                        return <GridCheckboxQuestion key={q.ID} question={q} index={index} onAnswerChange={handleAnswerChange} value={value} id={id} />;
                    default:
                        return <Text key={q?.ID ?? index}>Không hỗ trợ loại: {q?.QuestionType}</Text>;
                }
            })}
        </View>
    );
};

const TrainingQuestion = ({ question, onAnswerChange, value, id }) => {
    const options = question.Options || [];
    const [selected, setSelected] = useState(value ?? null);
    const [otherText, setOtherText] = useState(value?.text ?? '');
    const languageKey = useSelector(translateLang);

    useEffect(() => {
        setSelected(value ?? null);
        setOtherText(value?.text ?? '');
    }, [value]);

    const isOtherOption = (opt) => {
        const content = opt.QuestionName?.toLowerCase?.().trim();
        return content === 'khác' || content === 'other';
    };

    const handleSelect = (selectedId) => {
        const selectedOption = options.find((opt) => opt.ID === selectedId);
        const isOther = isOtherOption(selectedOption);

        setSelected(selectedId);
        setOtherText('');

        setTimeout(() => {
            onAnswerChange(question.ID, {
                answer: selectedId,
                text: isOther ? '' : '',
                id,
            });
        }, 0);
    };

    const handleOtherTextChange = (text) => {
        setOtherText(text);

        if (selected !== null) {
            const selectedOption = options.find((opt) => opt.ID === selected);
            const isOther = isOtherOption(selectedOption);

            if (isOther) {
                onAnswerChange(question.ID, {
                    answer: selected,
                    text,
                    id,
                });
            }
        }
    };

    return (
        <View style={styles.containerQuestionTraining}>
            <Text style={styles.question}>{question.QuestionName}</Text>
            {question?.LinkImages ?
                <Image source={{ uri: question?.LinkImages }} style={styles.imgDetail} />
                : null
            }
            {options.map((opt) => {
                const isOther = isOtherOption(opt);
                const isSelected = selected === opt.ID;

                return (
                    <View key={opt.ID}>
                        <TouchableOpacity
                            onPress={() => handleSelect(opt.ID)}
                            style={isSelected ? styles.optionButtonSelected : styles.optionButton}
                        >
                            <Text style={styles.optionText}>
                                {isOther ? languageKey('other') : opt.QuestionName}
                            </Text>
                        </TouchableOpacity>

                        {isOther && isSelected && (
                            <>
                                <Text style={styles.headerInput}>{languageKey('_your_answer')}</Text>
                                <TextInput
                                    placeholder={languageKey('_enter_content')}
                                    numberOfLines={4}
                                    multiline
                                    value={otherText}
                                    onChangeText={handleOtherTextChange}
                                    style={styles.inputContent}
                                />
                            </>
                        )}
                    </View>
                );
            })}
        </View>
    );
};

const RadioQuestion = ({ question, onAnswerChange, value, id }) => {
    const options = question.Options || [];
    const [selected, setSelected] = useState(value ?? null);
    const [otherText, setOtherText] = useState(value?.text ?? '');
    const languageKey = useSelector(translateLang);

    useEffect(() => {
        setSelected(value ?? null);
        setOtherText(value?.text ?? '');
    }, [value]);

    const isOtherOption = (opt) => {
        const content = opt.QuestionName?.toLowerCase?.().trim();
        return content === 'khác' || content === 'other';
    };

    const handleSelect = (selectedId) => {
        const selectedOption = options.find((opt) => opt.ID === selectedId);
        const isOther = isOtherOption(selectedOption);

        setSelected(selectedId);
        setOtherText('');

        setTimeout(() => {
            onAnswerChange(question.ID, {
                answer: selectedId,
                text: isOther ? '' : '',
                id,
            });
        }, 0);
    };

    const handleOtherTextChange = (text) => {
        setOtherText(text);

        if (selected !== null) {
            const selectedOption = options.find((opt) => opt.ID === selected);
            const isOther = isOtherOption(selectedOption);

            if (isOther) {
                onAnswerChange(question.ID, {
                    answer: selected,
                    text,
                    id,
                });
            }
        }
    };

    return (
        <View style={styles.containerQuestion}>
            <Text style={styles.question}>{question.QuestionName}</Text>
            {question?.LinkImages ?
                <Image source={{ uri: question?.LinkImages }} style={styles.imgDetail} />
                : null
            }
            {options.map((opt) => {
                const isOther = isOtherOption(opt);
                const isSelected = selected === opt.ID;

                return (
                    <View key={opt.ID}>
                        <View style={styles.containerBtn}>
                            <TouchableOpacity onPress={() => handleSelect(opt.ID)} style={styles.btn}>
                                <SvgXml xml={isSelected ? radio_active : radio} />
                            </TouchableOpacity>
                            <Text style={styles.txtAnswer}>
                                {isOther ? languageKey('other') : opt.QuestionName}
                            </Text>
                        </View>

                        {isOther && isSelected && (
                            <>
                                <Text style={styles.headerInput}>{languageKey('_your_answer')}</Text>
                                <TextInput
                                    placeholder={languageKey('_enter_content')}
                                    numberOfLines={4}
                                    multiline
                                    value={otherText}
                                    onChangeText={handleOtherTextChange}
                                    style={styles.inputContent}
                                />
                            </>
                        )}
                    </View>
                );
            })}
        </View>
    );
};

const CheckboxQuestion = ({ question, onAnswerChange, value, id }) => {

    const options = question.Options || [];
    const [selected, setSelected] = useState([]);
    const [otherText, setOtherText] = useState(value?.text ?? '');
    const languageKey = useSelector(translateLang);

    useEffect(() => {
        setSelected(value ? value : []);
        setOtherText(value?.text ?? '');
    }, [value]);

    const isOtherOption = (opt) => {
        const content = opt.QuestionName?.toLowerCase?.().trim();
        return content === 'khác' || content === 'other';
    };

    const toggleSelect = (optId) => {
        let updated = [...selected];
        if (selected.includes(optId)) {
            updated = selected.filter(x => x !== optId);
            if (isOtherOption(options.find(o => o.ID === optId))) {
                setOtherText('');
            }
        } else {
            updated.push(optId);
        }

        setSelected(updated);
        onAnswerChange(question.ID, {
            answer: updated,
            text: isOtherOption(options.find(o => o.ID === optId)) ? otherText : '',
            id,
        });
    };

    const handleOtherTextChange = (text) => {
        setOtherText(text);
        const isOtherSelected = selected.some(id => {
            const opt = options.find(o => o.ID === id);
            return isOtherOption(opt);
        });

        if (isOtherSelected) {
            onAnswerChange(question.ID, {
                answer: selected,
                text,
                id,
            });
        }
    };

    return (
        <View style={styles.containerQuestion}>
            <Text style={styles.question}>{question.QuestionName}</Text>
            {question?.LinkImages ?
                <Image source={{ uri: question?.LinkImages }} style={styles.imgDetail} />
                : null
            }
            {options.map((opt) => {
                const isOther = isOtherOption(opt);
                const isSelected = selected.includes(opt.ID);

                return (
                    <View key={opt.ID}>
                        <View style={styles.containerBtn}>
                            <TouchableOpacity onPress={() => toggleSelect(opt.ID)} style={styles.btn}>
                                <SvgXml xml={isSelected ? checkbox_active_20 : checkbox_20} />
                            </TouchableOpacity>
                            <Text style={styles.txtAnswer}>
                                {isOther ? languageKey('other') : opt.QuestionName}
                            </Text>
                        </View>

                        {isOther && isSelected && (
                            <>
                                <Text style={styles.headerInput}>{languageKey('_your_answer')}</Text>
                                <TextInput
                                    placeholder={languageKey('_enter_content')}
                                    numberOfLines={4}
                                    multiline
                                    value={otherText}
                                    onChangeText={handleOtherTextChange}
                                    style={styles.inputContent}
                                />
                            </>
                        )}
                    </View>
                );
            })}
        </View>
    );
};

const LinearScaleQuestion = ({ question, onAnswerChange, value, id }) => {
    const options = question.Options || [];
    const extractSelected = (val) => {
        if (Array.isArray(val)) {
            const firstValid = val.find(
                v => typeof v === 'object' && v.Column != null && v.Column !== 0
            );
            return firstValid?.Column ?? null;
        }
        if (typeof val === 'object' && val !== null && 'Column' in val && val.Column !== 0) {
            return val.Column;
        }
        if (typeof val === 'number' && val !== 0) {
            return val;
        }
        return null;
    };

    const [selected, setSelected] = useState(extractSelected(value));

    useEffect(() => {
        setSelected(extractSelected(value));
    }, [value]);

    const handleSelect = (selectedId) => {
        setSelected(selectedId);
        onAnswerChange(question.ID, {
            answer: {
                Row: 0,
                Column: selectedId,
            },
            id: id || 0,
        });
    };

    return (
        <View style={styles.containerQuestion}>
            <Text style={styles.question}>{question.QuestionName}</Text>
            {question?.LinkImages ?
                <Image source={{ uri: question?.LinkImages }} style={styles.imgDetail} />
                : null
            }

            {question?.Extention4 && (
                <Text style={styles.descriptionOne}>{question.Extention4}</Text>
            )}

            {options.map((opt) => (
                <View key={opt.ID} style={styles.containerBtn}>
                    <TouchableOpacity onPress={() => handleSelect(opt.ID)} style={styles.btn}>
                        <SvgXml xml={selected === opt.ID ? radio_active : radio} />
                    </TouchableOpacity>
                    <Text style={styles.txtAnswer}>{opt.QuestionName}</Text>
                </View>
            ))}

            {question?.Extention5 && (
                <Text style={styles.descriptionOne}>{question.Extention5}</Text>
            )}

        </View>
    );
};

const TextQuestion = ({ question, onAnswerChange, value, id }) => {
    const [text, setText] = useState(value ?? '');
    const languageKey = useSelector(translateLang);

    useEffect(() => {
        setText(value ?? '');
    }, [value]);

    const handleChange = (val) => {
        setText(val);
        onAnswerChange(question.ID, {
            answer: val,
            id: id,
        });
    };

    return (
        <View style={styles.containerQuestion}>
            <Text style={styles.question}>{question.QuestionName}</Text>
            {question?.LinkImages ?
                <Image source={{ uri: question?.LinkImages }} style={styles.imgDetail} />
                : null
            }
            <Text style={styles.headerInput}>{languageKey('_your_answer')}</Text>
            <TextInput
                placeholder={languageKey('_enter_content')}
                numberOfLines={4}
                multiline
                value={text}
                onChangeText={handleChange}
                style={styles.inputContent}
            />
        </View>
    );
};

const GridRadioQuestion = ({ question, onAnswerChange, value, id }) => {
    const [answers, setAnswers] = useState(value ?? {});

    useEffect(() => {
        setAnswers(value ?? {});
    }, [value]);

    const matrix = useMemo(() => {
        if (Array.isArray(question?.Options)) {
            return question.Options;
        }
        return [];
    }, [question?.Options]);

    const rows = useMemo(() => matrix.filter(item => String(item.IsRow) === '1'), [matrix]);

    const cols = useMemo(() => uniqBy(matrix.filter(item => String(item.IsRow) === '0'), 'QuestionName'), [matrix]);

    const handleSelect = (rowID, colID) => {
        const updatedAnswers = { ...answers, [rowID]: colID };
        setAnswers(updatedAnswers);
        onAnswerChange(question.ID, { answer: updatedAnswers, id });
    };

    return (
        <View style={styles.containerQuestionGrid}>
            <Text style={styles.questionGrid}>{question?.QuestionName}</Text>
            {question?.LinkImages ?
                <Image source={{ uri: question?.LinkImages }} style={styles.imgDetail} />
                : null
            }
            {rows.length && cols.length ? (
                <View style={styles.table}>
                    <View style={styles.tableRowHeader}>
                        <View style={styles.cellLabel} />
                        {cols.map(col => (
                            <View key={col.ID} style={styles.cell}>
                                <Text style={styles.txtAnswerHeader}>{col.QuestionName}</Text>
                            </View>
                        ))}
                    </View>
                    {rows.map(row => (
                        <View key={row.ID} style={styles.tableRow}>
                            <View style={styles.cellLabel}>
                                <Text style={styles.txtAnswer}>{row.QuestionName}</Text>
                            </View>

                            {cols.map(col => {
                                const isChecked = answers[row.ID] === col.ID;
                                return (
                                    <View key={col.ID} style={styles.cell}>
                                        <TouchableOpacity onPress={() => handleSelect(row.ID, col.ID)}>
                                            <SvgXml xml={isChecked ? radio_active : radio} />
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    ))}
                </View>
            ) : (
                <Text>Không có dữ liệu để hiển thị</Text>
            )}
        </View>
    );
};
const GridCheckboxQuestion = ({ question, onAnswerChange, value, id }) => {
    const [answers, setAnswers] = useState(value ?? {});

    useEffect(() => {
        setAnswers(value ?? {});
    }, [value]);

    const options = useMemo(() => {
        return Array.isArray(question.Options) ? question.Options : [];
    }, [question.Options]);

    const rows = useMemo(() => options.filter(opt => opt.IsRow === "1"), [options]);
    const cols = useMemo(() => options.filter(opt => opt.IsRow === "0"), [options]);

    const toggleOption = (rowID, colID) => {
        const current = Array.isArray(answers[rowID]) ? answers[rowID] : answers[rowID] !== undefined ? [answers[rowID]] : [];
        const isChecked = current.includes(colID);

        const updated = isChecked
            ? current.filter(id => id !== colID)
            : [...current, colID];

        const newAnswers = { ...answers, [rowID]: updated };
        setAnswers(newAnswers);
        onAnswerChange(question.ID, { answer: newAnswers, id });
    };

    return (
        <View style={styles.containerQuestionGrid}>
            <Text style={styles.questionGrid}>{question.QuestionName}</Text>
            {question?.LinkImages ?
                <Image source={{ uri: question?.LinkImages }} style={styles.imgDetail} />
                : null
            }
            {rows.length && cols.length ? (
                <View style={styles.table}>
                    <View style={styles.tableRowHeader}>
                        <View style={styles.cellLabel} />
                        {cols.map(col => (
                            <View key={col.ID} style={styles.cell}>
                                <Text style={styles.txtAnswerHeader}>{col.QuestionName}</Text>
                            </View>
                        ))}
                    </View>
                    {rows.map(row => (
                        <View key={row.ID} style={styles.tableRow}>
                            <View style={styles.cellLabel}>
                                <Text style={styles.txtAnswer}>{row.QuestionName}</Text>
                            </View>
                            {cols.map(col => {
                                const valueRow = answers[row.ID];
                                const checkedColumns = Array.isArray(valueRow) ? valueRow : valueRow !== undefined ? [valueRow] : [];
                                const isChecked = checkedColumns.includes(col.ID);

                                return (
                                    <View key={col.ID} style={styles.cell}>
                                        <TouchableOpacity onPress={() => toggleOption(row.ID, col.ID)}>
                                            <SvgXml xml={isChecked ? checkbox_active_20 : checkbox_20} />
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    ))}
                </View>
            ) : (
                <Text>Không có dữ liệu để hiển thị</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: scale(8),
        marginHorizontal: scale(12)
    },
    containerQuestion: {
        padding: scale(12),
        marginBottom: scale(8),
        borderRadius: scale(12),
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        backgroundColor: colors.white
    },
    question: {
        fontSize: fontSize.size16,
        fontWeight: '600',
        lineHeight: scale(22),
        fontFamily: 'Inter-SemiBold',
        color: colors.black,
        marginBottom: scale(12)
    },
    questionGrid: {
        fontSize: fontSize.size14,
        fontWeight: '500',
        lineHeight: scale(22),
        fontFamily: 'Inter-Medium',
        color: colors.black,
        marginBottom: scale(8)
    },
    containerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: scale(8)
    },
    txtAnswer: {
        fontSize: fontSize.size14,
        fontWeight: '500',
        lineHeight: scale(22),
        fontFamily: 'Inter-Regular',
        color: colors.black,
        marginLeft: scale(8),
    },
    txtAnswerHeader: {
        fontSize: fontSize.size14,
        fontWeight: '500',
        lineHeight: scale(22),
        fontFamily: 'Inter-Regular',
        color: colors.black,
        marginLeft: scale(4),
        textAlign: 'center'
    },
    txtHeader: {
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-Medium',
        color: colors.black,
        textAlign: 'center'
    },
    table: {
    },
    tableRowHeader: {
        flexDirection: 'row',
        paddingVertical: scale(10),
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scale(12),
        borderBottomWidth: 1,
        borderColor: '#f0f0f0'
    },
    cellLabel: {
        flex: 2,
        paddingRight: scale(8)
    },
    cell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerQuestionGrid: {
        padding: scale(12),
        marginBottom: scale(8),
        borderRadius: scale(12),
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        backgroundColor: colors.white
    },
    headerInput: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '400',
        fontFamily: 'Inter-Medium',
        lineHeight: scale(22),
        marginBottom: scale(4),
    },
    inputContent: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        paddingHorizontal: scale(12),
        paddingVertical: scale(8),
        borderRadius: scale(8),
        fontSize: fontSize.size14,
        lineHeight: scale(22),
        fontFamily: 'Inter-Regular',
        fontWeight: '400',
        color: colors.black,
        textAlignVertical: 'top',
        backgroundColor: '#F9FAFB',
    },
    description: {
        fontSize: fontSize.size14,
        fontWeight: '500',
        lineHeight: scale(22),
        fontFamily: 'Inter-Regular',
        color: colors.black,
    },
    descriptionOne: {
        fontSize: fontSize.size14,
        fontWeight: '500',
        lineHeight: scale(22),
        fontFamily: 'Inter-Regular',
        color: colors.black,
        marginBottom: scale(8)
    },
    imgDetail: {
        height: hScale(200),
        width: '100%',
        borderRadius: scale(8),
        marginBottom: scale(8),
    },
    containerQuestionTraining: {
        marginBottom: scale(8),
        borderRadius: scale(12),
        backgroundColor: colors.white
    },
    optionButton: {
        borderWidth: scale(1),
        borderColor: colors.borderColor,
        borderRadius: scale(8),
        height: hScale(40),
        justifyContent: 'center',
        marginBottom: scale(8)
    },
    optionButtonSelected: {
        backgroundColor: colors.blue,
        borderRadius: scale(8),
        height: hScale(40),
        justifyContent: 'center',
        marginBottom: scale(8)
    },
    optionText: {
        color: colors.black,
        fontSize: fontSize.size14,
        fontWeight: '600',
        fontFamily: 'Inter-SemiBold',
        lineHeight: scale(22),
        marginHorizontal: scale(12)
    },
});

export default QuestionRenderer;
