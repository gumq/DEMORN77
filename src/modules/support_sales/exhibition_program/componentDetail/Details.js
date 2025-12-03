import React, { useState } from "react";
import moment from "moment";
import _ from 'lodash';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from "react-redux";
import { View, Text, Image, TextInput, ScrollView } from 'react-native';

import { stylesCustomers, stylesDetail } from "../styles";
import { translateLang } from "@store/accLanguages/slide";
import { AttachManyFile, Button, CardModalSelect, NotifierAlert, QuestionRenderer } from "@components";
import { fetchDetailExhibitionPrograms } from "@store/accExhibition_Programs/thunk";
import { ApiExhibitionRegistrations_Add, ApiExhibitionRegistrations_Submit } from "@api";
import { SvgXml } from "react-native-svg";
import { arrow_down_big, arrow_next_gray } from "@svgImg";

const Details = ({ detailExhibitionPrograms }) => {
    const languageKey = useSelector(translateLang);
    const dispatch = useDispatch();
    const { listCustomerByUserID } = useSelector(state => state.Login);
    const [valueCustomer, setValueCustomer] = useState(null);
    const [contentAddCustomer, onChangeContentAddCustomer] = useState('');
    const [isShowModalAddCustomer, setIsShowModalAddCustomer] = useState(false)
    const [linkImage, setLinkImage] = useState('');
    const [linkImageArray, setLinkImageArray] = useState([]);
    const [images, setDataImages] = useState([]);
    const [surveyAnswers, setSurveyAnswers] = useState({});
    const [dataOID, setDataOID] = useState('');

    const mergedQuestions = detailExhibitionPrograms?.Questions?.flatMap(question => {
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

    const [showInformation, setShowInformation] = useState({
        registration: true,
        question: false,
    });

    const toggleInformation = (key) => {
        setShowInformation((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const openModalAddCustomer = () => {
        setIsShowModalAddCustomer(!isShowModalAddCustomer)
    }

    const closeModalAddCustomer = () => {
        setIsShowModalAddCustomer(!isShowModalAddCustomer)
    }

    const saveExhibitionProgram = _.debounce(async () => {
        const choices = {};
        const keyCounter = {};

        const cleanId = (val) => {
            const n = typeof val === "number" ? val : parseInt(val);
            return Number.isInteger(n) ? n : "";
        };

        const getUniqueKey = (qID) => {
            if (!keyCounter[qID]) keyCounter[qID] = 0;
            return `${qID}_${keyCounter[qID]++}`;
        };

        for (const [questionID, answer] of Object.entries(surveyAnswers)) {
            const question = questionTree.find(q => q.ID == questionID);
            if (!question) continue;

            const { QuestionType } = question;
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
                            choices[getUniqueKey(questionID)] = [optID, "", other];
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
                        if (colID !== "") {
                            choices[getUniqueKey(questionID)] = [colID, "", ""];
                        }
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
                    console.warn("⚠️ Unhandled QuestionType:", QuestionType);
                    break;
            }
        }

        const formattedChoices = Object.entries(choices)
            .map(([key, value]) => {
                const newKey = key.replace(/_\d+$/, "");
                return `"${newKey}": ${JSON.stringify(value)}`;
            })
            .join(",");

        try {
            const body = {
                FactorID: "Exhibitions",
                EntryID: "ExhibitionRegistrations",
                ReferenceID: detailExhibitionPrograms?.OID,
                OID: "",
                CustomerID: valueCustomer?.ID,
                Note: contentAddCustomer,
                Images: linkImageArray || [],
                Link: "",
                Choices: [
                    {
                        ID: 0,
                        QuestionID: 0,
                        Choices: formattedChoices || "",
                        AnswerText: ""
                    }
                ]
            };

            const result = await ApiExhibitionRegistrations_Add(body);
            const data = result.data;

            if (data.StatusCode === 200 && data.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    languageKey('_notification'),
                    data.Message,
                    'success'
                );
                setDataOID(data?.Result[0]?.OID);
                dispatch(fetchDetailExhibitionPrograms({ OID: detailExhibitionPrograms?.OID }));
            } else {
                NotifierAlert(
                    3000,
                    languageKey('_notification'),
                    data.Message,
                    'error'
                );
            }
        } catch (error) {
            closeModalAddCustomer();
            NotifierAlert(
                3000,
                languageKey('_notification'),
                error.toString(),
                'error'
            );
        }
    }, 2000, { leading: true, trailing: false });

    const handleConfirm = _.debounce(async () => {
        try {
            const body = {
                OID: dataOID,
                IsLock: 1,
            };
            const result = await ApiExhibitionRegistrations_Submit(body);
            const data = result.data;
            if (data.StatusCode === 200 && data.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${data.Message}`,
                    'success',
                );
                const bodyDetail = { OID: detailExhibitionPrograms?.OID }
                dispatch(fetchDetailExhibitionPrograms(bodyDetail))
                closeModalAddCustomer()
            } else {
                closeModalAddCustomer()
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${data.Message}`,
                    'error',
                );
            }
        } catch (error) {
            closeModalAddCustomer()
            NotifierAlert(
                3000,
                `${languageKey('_notification')}`,
                `${error}`,
                'error',
            );
        }
    }, 2000, { leading: true, trailing: false })

    const dataCriterias = detailExhibitionPrograms?.Criterias ? JSON.parse(detailExhibitionPrograms?.Criterias) : [];

    return (
        <ScrollView style={stylesDetail.container}>
            <Image source={{ uri: detailExhibitionPrograms?.Link }} style={stylesDetail.img} />
            <View style={stylesDetail.cardProgram}>
                <View style={stylesDetail.containerContent}>
                    <Text style={stylesDetail.headerProgram}>{detailExhibitionPrograms?.Name}</Text>
                    <Text style={stylesDetail.contentTime}>{moment(detailExhibitionPrograms?.FromDate).format('DD/MM/YYYY')} - {moment(detailExhibitionPrograms?.ToDate).format('DD/MM/YYYY')}</Text>

                    <View style={stylesDetail.timeProgram}>
                        <Text style={stylesDetail.txtHeaderTime}>{detailExhibitionPrograms?.Interpretation}</Text>
                    </View>
                </View>
                {dataCriterias?.length > 0 ?
                    <View style={stylesDetail.tableWrapper}>
                        <View style={stylesDetail.row}>
                            <View style={stylesDetail.cell_70}>
                                <Text style={stylesDetail.txtHeaderTable}>{languageKey('_evaluation_criteria')}</Text>
                            </View>
                            <View style={stylesDetail.cell_30}>
                                <Text style={stylesDetail.txtHeaderTable}>{languageKey('_percent')}</Text>
                            </View>
                        </View>
                        <View style={stylesDetail.cardProduct}>
                            {dataCriterias?.map((item, index) => (
                                <View style={[
                                    stylesDetail.cellResponse,
                                    index === dataCriterias?.length - 1 && stylesDetail.lastCell
                                ]}
                                    key={index}>
                                    <View style={stylesDetail.cell_70}>
                                        <Text style={stylesDetail.txtValueTable}>{item.Name}</Text>
                                    </View>
                                    <View style={stylesDetail.cell_30}>
                                        <Text style={stylesDetail.txtValueTable}>{item.Percent}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                    : null
                }

                <View style={stylesDetail.tableWrapper}>
                    <View style={stylesDetail.row}>
                        <View style={stylesDetail.cell_70}>
                            <Text style={stylesDetail.txtHeaderTable}>{languageKey('_product')}</Text>
                        </View>
                        <View style={stylesDetail.cell_30}>
                            <Text style={stylesDetail.txtHeaderTable}>{languageKey('_quantity')}</Text>
                        </View>
                    </View>
                    <View style={stylesDetail.cardProduct}>
                        {detailExhibitionPrograms?.Items?.map((item, index) => (
                            <View style={[
                                stylesDetail.cellResponse,
                                index === detailExhibitionPrograms?.Items.length - 1 && stylesDetail.lastCell
                            ]}
                                key={index}>
                                <View style={stylesDetail.cell_70}>
                                    <Text style={stylesDetail.txtValueTable}>{item.ItemName}</Text>
                                </View>
                                <View style={stylesDetail.cell_30}>
                                    <Text style={stylesDetail.txtValueTable}>{item.Quantity} {item?.UnitName}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
            <Button style={stylesDetail.btnUploadFile} onPress={openModalAddCustomer}>
                <Text style={stylesDetail.txtBtnUploadFile}>{languageKey('_registration')}</Text>
            </Button>

            {isShowModalAddCustomer && (
                <View >
                    <Modal
                        isVisible={isShowModalAddCustomer}
                        useNativeDriver={true}
                        onBackdropPress={closeModalAddCustomer}
                        onBackButtonPress={closeModalAddCustomer}
                        backdropTransitionOutTiming={450}
                        avoidKeyboard={true}
                        style={stylesCustomers.modal}>
                        <View style={stylesCustomers.headerModal}>
                            <Button style={stylesCustomers.btnCancelModal} onPress={closeModalAddCustomer}>
                                <Text style={stylesCustomers.txtCancelModal}>{languageKey('_cancel')}</Text>
                            </Button>
                            <Text style={stylesCustomers.titleModal}>{languageKey('_registration')}</Text>
                        </View>
                        <ScrollView style={stylesCustomers.modalContainer} showsVerticalScrollIndicator={false}>
                            <View style={stylesCustomers.containerHeader}>
                                <Text style={stylesCustomers.header}>{languageKey('_registration_information')}</Text>
                                <Button style={stylesCustomers.btnShowInfor} onPress={() => toggleInformation("registration")}>
                                    <SvgXml xml={showInformation.registration ? arrow_down_big : arrow_next_gray} />
                                </Button>
                            </View>
                            {showInformation.registration && (
                                <>
                                    <View style={stylesCustomers.input}>
                                        <CardModalSelect
                                            title={languageKey('_customer')}
                                            data={listCustomerByUserID}
                                            setValue={setValueCustomer}
                                            value={valueCustomer?.Name}
                                        />
                                    </View>
                                    <Text style={stylesCustomers.headerInput}>{languageKey('_content')}</Text>
                                    <TextInput
                                        style={stylesCustomers.inputContent}
                                        onChangeText={onChangeContentAddCustomer}
                                        value={contentAddCustomer}
                                        numberOfLines={4}
                                        multiline={true}
                                        placeholder={languageKey('_enter_content')}
                                    />
                                    <View style={stylesCustomers.imgBox}>
                                        <Text style={stylesCustomers.headerBoxImage}>{languageKey('_image')}</Text>
                                        <AttachManyFile
                                            OID={detailExhibitionPrograms?.OID}
                                            images={images}
                                            setDataImages={setDataImages}
                                            setLinkImage={setLinkImage}
                                            dataLink={linkImage}
                                            setImageArray={setLinkImageArray}
                                        />
                                    </View>
                                </>
                            )}
                            <View style={stylesCustomers.containerHeader}>
                                <Text style={stylesCustomers.header}>{languageKey('_survey_questions')}</Text>
                                <Button style={stylesCustomers.btnShowInfor} onPress={() => toggleInformation("question")}>
                                    <SvgXml xml={showInformation.registration ? arrow_down_big : arrow_next_gray} />
                                </Button>
                            </View>
                            {showInformation.question && (
                                <QuestionRenderer
                                    questions={questionTree}
                                    onChangeAnswers={setSurveyAnswers}
                                />
                            )}
                        </ScrollView>
                        <View style={stylesCustomers.footer}>
                            <Button
                                style={stylesCustomers.btnCancel}
                                onPress={saveExhibitionProgram}
                            >
                                <Text style={stylesCustomers.txtBtnCancel}>{languageKey('_save')}</Text>
                            </Button>
                            <Button
                                style={stylesCustomers.btnConfirm}
                                onPress={handleConfirm}
                                disabled={dataOID ? false : true}
                            >
                                <Text style={stylesCustomers.txtBtnConfirm}>{languageKey('_confirm')}</Text>
                            </Button>
                        </View>
                    </Modal>
                </View>
            )}
        </ScrollView>
    )
}

export default Details;