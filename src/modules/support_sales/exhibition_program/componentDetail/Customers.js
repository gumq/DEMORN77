import React, { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import _, { groupBy } from 'lodash';
import { View, Text, FlatList, ScrollView, TextInput } from 'react-native';

import { stylesCustomers, stylesDetail } from "../styles";
import { translateLang } from "@store/accLanguages/slide";
import { AttachManyFile, Button, CardModalSelect, NotifierAlert, QuestionRenderer, RenderImage } from "@components";
import { ApiExhibitionRegistrations_Delete, ApiExhibitionRegistrations_Edit, ApiExhibitionRegistrations_EditImages, ApiExhibitionRegistrations_Submit, ApiUploadFile } from "@api";
import { fetchDetailCustomerRegis, fetchDetailExhibitionPrograms } from "@store/accExhibition_Programs/thunk";
import { arrow_down_big, arrow_next_gray, noData, three_dot } from "@svgImg";

const Customers = () => {
    const languageKey = useSelector(translateLang)
    const dispatch = useDispatch();
    const { listCustomers } = useSelector(state => state.ApprovalProcess);
    const { detailExhibitionPrograms, detailCustomerRegis } = useSelector(state => state.ExhibitionPrograms);
    const [files, setFiles] = useState([]);
    const [itemEdit, setItemEdit] = useState(null);
    const [linkImage, setLinkImage] = useState('');
    const [linkImageEdit, setLinkImageEdit] = useState('');
    const [linkImageArray, setLinkImageArray] = useState([]);
    const [images, setDataImages] = useState([]);
    const [itemSelected, setItemSelected] = useState(null);
    const [valueCustomer, setValueCustomer] = useState(null);
    const [contentAddCustomer, onChangeContentAddCustomer] = useState('');
    const [surveyAnswers, setSurveyAnswers] = useState({});

    const [modals, setModals] = useState({
        addCustomer: false,
        update: false,
        viewImage: false,
        upload: false,
    });

    const toggleModal = (key, value) => {
        setModals((prev) => ({ ...prev, [key]: value }));
    };

    const handleOpenModalUpload = (item) => {
        setItemEdit(item);
        toggleModal('upload', true);
    };

    const handleCloseModalUpload = () => {
        toggleModal('upload', false);
    };

    const handleOpenModalUpdate = (item) => {
        setItemSelected(item);
        toggleModal('update', true);
    };

    const handleCloseModalUpdate = () => {
        toggleModal('update', false);
    };

    const openModalAddCustomer = () => {
        toggleModal('addCustomer', true);
    };

    const closeModalAddCustomer = () => {
        toggleModal('addCustomer', false);
    };

    const openModalViewImage = (item) => {
        setItemEdit(item);
        toggleModal('viewImage', true);
    };

    const closeModalViewImage = () => {
        toggleModal('viewImage', false);
    };

    const groupedImages = useMemo(() => {
        if (!itemEdit?.Images) return [];
        const parsedImages = JSON.parse(itemEdit.Images || '[]');
        return Object.entries(groupBy(parsedImages, 'Time'))
            .sort(([a], [b]) => Number(b) - Number(a));
    }, [itemEdit]);

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

    const customerData = detailExhibitionPrograms?.Registrations || []
    const dataTab = [
        { id: 1, name: languageKey('_all'), key: 'all' },
        { id: 2, name: languageKey('_wait'), key: '-2' },
        { id: 3, name: languageKey('_waiting_approval'), key: '0' },
        { id: 4, name: languageKey('_approved'), key: '1' },
        { id: 5, name: languageKey('_refuse'), key: '-1' }
    ];

    const [selectedTab, setSelectedTab] = useState(dataTab[0]);
    const [dataItem, setDataItem] = useState([]);

    const flatListRef = useRef(null);

    const filterDataByTab = (tabKey) => {
        if (tabKey === 'all') {
            setDataItem(customerData);
        } else {
            const filtered = customerData.filter((item) => String(item.ApprovalStatus) === tabKey);
            setDataItem(filtered);
        }
    };

    useEffect(() => {
        filterDataByTab(selectedTab.key);
    }, [customerData, selectedTab]);

    const handleTabPress = (item) => {
        setSelectedTab(item);
        const index = dataTab.findIndex((i) => i.id === item.id);
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ index, animated: true });
        }
    };

    const _keyExtractorTab = (item) => `${item.id}`;
    const _renderItemTab = ({ item }) => {
        const isSelected = item.id === selectedTab.id;

        return (
            <Button
                key={item.id}
                style={[stylesCustomers.btn, isSelected && stylesCustomers.btnActive]}
                onPress={() => handleTabPress(item)}
            >
                <Text style={isSelected ? stylesCustomers.textActive : stylesCustomers.text}>
                    {item.name}
                </Text>
            </Button>
        );
    };

    const getImageGallery = () => {
        ImagePicker.openPicker({
            mediaType: 'photo',
            multiple: true,
            compressImageQuality: 0.4,
            cropperChooseText: 'OK',
            cropperCancelText: languageKey('_try_angian'),
        }).then(results => {
            if (results?.length > 0) {
                setFiles(results);
                handleCloseModalUpload();
            }
        });
    };

    const takePhoto = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            compressImageQuality: 0.4,
            cropperChooseText: 'OK',
            cropperCancelText: languageKey('_try_angian'),
        }).then(result => {
            if (result) {
                setFiles([result]);
                handleCloseModalUpload();
            }
        }).catch(error => {
            console.error(error);
        });
    };

    useEffect(() => {
        if (!itemSelected) return;
        const body = { OID: itemSelected?.OID }
        dispatch(fetchDetailCustomerRegis(body))
        const customer = listCustomers.find(cus => cus.ID === itemSelected.CustomerID);
        setValueCustomer(customer);
        onChangeContentAddCustomer(itemSelected.Note || '');
        const linkImage = itemSelected?.Link?.trim() !== ''
            ? itemSelected.Link
            : ''

        const linkImgArray = linkImage ? linkImage.split(';').filter(Boolean) : [];
        setDataImages(linkImgArray)
    }, [itemSelected, listCustomers]);

    useEffect(() => {
        if (detailCustomerRegis) {
            setLinkImageArray(detailCustomerRegis?.Images)
        }
    }, [detailCustomerRegis]);

    const convertAllTypesToSurveyAnswers = (choicesArray) => {
        const result = {};

        choicesArray.forEach((item) => {
            const parentID = item.ParentID;
            const rows = item.Rows || [];
            let questionType = '';
            let answer;
            let id = null;
            let text = '';

            if (rows.length > 0) {
                const code = rows[0]?.Details?.[0]?.Code;
                questionType = code;

                if (code === 'VB') {
                    const firstDetail = rows[0]?.Details?.[0];
                    answer = firstDetail?.Answers ?? '';
                }

                else if (['LTN', 'LHK'].includes(code)) {
                    answer = {};
                    rows.forEach((row) => {
                        const selectedCols = row.Details?.filter(d => d.IsSelected === 1).map(d => d.ColumnID) || [];
                        if (selectedCols.length === 1) {
                            answer[row.RowID] = selectedCols[0];
                        } else if (selectedCols.length > 1) {
                            answer[row.RowID] = selectedCols;
                        }
                    });
                }

                if (code === 'TDTT') {
                    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                        const row = rows[rowIndex];
                        const selected = row.Details?.find((d) => d.IsSelected === 1);
                        if (selected) {
                            answer = {
                                Column: row.RowID,
                                Row: rowIndex,
                            };
                            id = rowIndex;
                            break;
                        }
                    }
                }

                else if (code === 'HK') {
                    const selectedIDs = [];
                    rows.forEach(row => {
                        const isSelected = row.Details?.some(d => d.IsSelected === 1);
                        if (isSelected) selectedIDs.push(row.RowID);
                    });
                    answer = selectedIDs;
                }

                else if (code === 'TN') {
                    for (let row of rows) {
                        const selected = row.Details?.find(d => d.IsSelected === 1);
                        if (selected) {
                            answer = row.RowID;
                            break;
                        }
                    }
                }
            }

            if (answer !== undefined) {
                result[parentID] = {
                    QuestionType: questionType,
                    answer,
                    id,
                };
            }
        });

        return result;
    };

    useEffect(() => {
        const rawChoices = detailCustomerRegis?.Choices?.[0]?.JsonResponse;
        if (rawChoices) {
            const choicesArray = Array.isArray(rawChoices) ? rawChoices : JSON.parse(rawChoices);
            const parsedAnswers = convertAllTypesToSurveyAnswers(choicesArray);
            setSurveyAnswers((prev) => ({
                ...prev,
                ...parsedAnswers
            }));
        }
    }, [detailCustomerRegis?.Choices]);


    const handleDelete = _.debounce(async () => {
        try {
            const body = {
                OID: itemSelected?.OID,
            };
            const result = await ApiExhibitionRegistrations_Delete(body);
            const data = result.data;
            if (data.StatusCode === 200 && data.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${data.Message}`,
                    'success',
                );
                handleCloseModalUpdate();
                const bodyDetail = { OID: detailExhibitionPrograms?.OID }
                dispatch(fetchDetailExhibitionPrograms(bodyDetail))
            } else {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${data.Message}`,
                    'error',
                );
                handleCloseModalUpdate();
            }
        } catch (error) {
            handleCloseModalUpdate();
            NotifierAlert(
                3000,
                `${languageKey('_notification')}`,
                `${error}`,
                'error',
            );
        }
    }, 2000, { leading: true, trailing: false })

    const _keyExtractor = (item, index) => `${item.OID}-${index}`;
    const _renderItem = ({ item }) => {
        const linkImgArray = item.Link.split(';').filter(Boolean)
        return (
            <View style={stylesCustomers.cardProgram}>
                {item?.IsLock === 0 ?
                    <View style={stylesDetail.headerCard}>
                        <Text
                            style={stylesDetail.txtHeaderCard}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {item?.CustomerName}
                        </Text>
                        <Button
                            onPress={() => handleOpenModalUpdate(item)}
                        >
                            <SvgXml xml={three_dot} />
                        </Button>
                    </View>
                    :
                    <Text
                        style={stylesCustomers.headerProgram}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {item?.CustomerName}
                    </Text>
                }

                <Text style={stylesCustomers.contentTime}>{moment(item?.ChangeDate).format('HH:mm DD/MM/YYYY')}</Text>
                {item?.ImageUpdateCount > 0 ?
                    <View style={stylesCustomers.headerCard}>
                        <View style={stylesCustomers.contentProgram}>
                            <Text style={stylesCustomers.txtHeaderContent}>{languageKey('_number_of_image_updates')}</Text>
                            <Text style={stylesCustomers.content}>{item?.ImageUpdateCount}</Text>
                        </View>
                        <View style={stylesCustomers.contentProgram}>
                            <Text style={stylesCustomers.txtHeaderContent}>{languageKey('_last_update_at')}</Text>
                            <Text style={stylesCustomers.content}>{moment(item?.ChangeDate).format('HH:mm DD/MM/YYYY')}</Text>
                        </View>
                    </View>
                    :
                    <View style={stylesCustomers.contentProgram}>
                        <Text style={stylesCustomers.txtHeaderContent}>{languageKey('_content')}</Text>
                        <Text style={stylesCustomers.content}>{item?.Note}</Text>
                    </View>
                }
                {linkImgArray.length > 0 && (
                    <View style={stylesCustomers.containerTableFileItem}>
                        <Text style={stylesCustomers.txtHeaderContent}>{languageKey('_image')}</Text>
                        <RenderImage urls={linkImgArray} />
                    </View>
                )}
                {item?.ApprovalStatus === 1 ?
                    <View style={stylesCustomers.containerFooterCard}>
                        <Button style={stylesCustomers.btnViewImage} onPress={() => openModalViewImage(item)}>
                            <Text style={stylesCustomers.txtViewImage}>{languageKey('_all_images')}</Text>
                        </Button>
                        <Button style={stylesCustomers.btnUpdateImage} onPress={() => handleOpenModalUpload(item)}>
                            <Text style={stylesCustomers.txtUpdateImage}>{languageKey('_update_images')}</Text>
                        </Button>
                    </View>

                    :
                    <View style={stylesCustomers.containerFooterCard}>
                        <Text style={stylesCustomers.contentTimeApproval}>{languageKey('_update')} {moment(item?.ApprovalDate).format('HH:mm DD/MM/YYYY')}</Text>
                        <View style={[stylesCustomers.bodyStatus, { backgroundColor: item?.ApprovalStatusColor }]}>
                            <Text style={[stylesCustomers.txtStatus, { color: item?.ApprovalStatusTextColor }]}>
                                {item?.ApprovalStatusName}
                            </Text>
                        </View>
                    </View>
                }
            </View>
        );
    };

    const handleSelectFileAndSubmit = () => {
        const OIDTime = detailExhibitionPrograms?.OID + new Date().getTime();
        const formData = new FormData();

        formData.append('OID', OIDTime);
        formData.append('EntryID', 'SmartLighting');
        formData.append('FactorID', 'Category');
        formData.append('Name', 'Ảnh');
        formData.append('Note', 'Ghi chú');

        if (files.length > 0) {
            files.forEach((file) => {
                const document = {
                    uri: file.uri || file.path,
                    name: file.name || file.path.split('/').pop(),
                    type: file.type || file.mime,
                };
                formData.append('File', document);
            });

            ApiUploadFile(formData)
                .then(val => {
                    const result = val.status ? val.data?.Result : [];

                    if (result.length > 0) {
                        const newImages = result.flatMap(item => {
                            const links = item.LinkFile?.split(';').filter(Boolean) || [];
                            return links.map(link => ({
                                ID: 0,
                                Link: link.trim(),
                            }));
                        });

                        const allImages = [...newImages];
                        setLinkImage(allImages);
                        handleCloseModalUpload();
                    } else {
                        console.log(val.message);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            handleCloseModalUpload();
        }
    };

    useEffect(() => {
        if (files?.length > 0) {
            handleSelectFileAndSubmit();
        }
    }, [files]);

    const updateImageCustomer = _.debounce(async () => {
        try {
            const body = {
                OID: itemEdit?.OID,
                Images: linkImage || '',
            };
            const result = await ApiExhibitionRegistrations_EditImages(body);
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
            } else {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${data.Message}`,
                    'error',
                );
            }
        } catch (error) {
            NotifierAlert(
                3000,
                `${languageKey('_notification')}`,
                `${error}`,
                'error',
            );
        }
    }, 2000, { leading: true, trailing: false });

    useEffect(() => {
        if (linkImage?.length > 0) {
            updateImageCustomer();
        }
    }, [linkImage])

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
                FactorID: 'Exhibitions',
                EntryID: 'ExhibitionRegistrations',
                ReferenceID: detailExhibitionPrograms?.OID,
                OID: itemSelected ? itemSelected?.OID : "",
                CustomerID: valueCustomer?.ID,
                Note: contentAddCustomer,
                Images: linkImageArray || [],
                Link: '',
                Choices: [
                    {
                        ID: 0,
                        QuestionID: 0,
                        Choices: formattedChoices || "",
                        AnswerText: ""
                    }
                ]
            };
            const result = await ApiExhibitionRegistrations_Edit(body)
            const data = result.data;
            if (data.StatusCode === 200 && data.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${data.Message}`,
                    'success',
                );
                closeModalAddCustomer();
                setValueCustomer(null)
                onChangeContentAddCustomer('')
                const bodyDetail = { OID: detailExhibitionPrograms?.OID }
                dispatch(fetchDetailExhibitionPrograms(bodyDetail))
                handleCloseModalUpdate();
            } else {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${data.Message}`,
                    'error',
                );
                closeModalAddCustomer();
                handleCloseModalUpdate();
            }
        } catch (error) {
            closeModalAddCustomer();
            handleCloseModalUpdate();
            NotifierAlert(
                3000,
                `${languageKey('_notification')}`,
                `${error}`,
                'error',
            );
        }
    }, 2000, { leading: true, trailing: false });

    const handleConfirm = _.debounce(async () => {
        try {
            const body = {
                OID: itemSelected?.OID,
                IsLock: itemSelected?.IsLock === 0 ? 1 : 0,
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
                closeModalAddCustomer();
                handleCloseModalUpdate();
            } else {
                closeModalAddCustomer();
                handleCloseModalUpdate();
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${data.Message}`,
                    'error',
                );
            }
        } catch (error) {
            closeModalAddCustomer();
            handleCloseModalUpdate();
            NotifierAlert(
                3000,
                `${languageKey('_notification')}`,
                `${error}`,
                'error',
            );
        }
    }, 2000, { leading: true, trailing: false })

    return (
        <View style={stylesCustomers.container}>
            <View style={stylesCustomers.containerTab}>
                <FlatList
                    ref={flatListRef}
                    data={dataTab}
                    horizontal
                    keyExtractor={_keyExtractorTab}
                    renderItem={_renderItemTab}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            {dataItem?.length > 0 ? (
                <FlatList
                    data={dataItem}
                    renderItem={_renderItem}
                    keyExtractor={_keyExtractor}
                    style={stylesCustomers.scrollview}
                />
            ) : (
                <View >
                    <Text style={stylesCustomers.txtHeaderNodata}>{languageKey('_no_data')}</Text>
                    <Text style={stylesCustomers.txtContent}>{languageKey('_we_will_back')}</Text>
                    <SvgXml xml={noData} style={stylesCustomers.imgEmpty} />
                </View>

            )}
            <Modal
                isVisible={modals.upload}
                style={stylesCustomers.modalUpdateImage}
                onBackButtonPress={handleCloseModalUpload}
                onBackdropPress={handleCloseModalUpload}
                backdropTransitionOutTiming={0}
                hideModalContentWhileAnimating>
                <View style={stylesCustomers.modalContainerUpdateImage}>
                    <View style={stylesCustomers.cameraGalleryContainer}>
                        <View style={stylesCustomers.takeChoose} onPress={takePhoto}>
                            <Text style={stylesCustomers.txtTakeChoose}>{languageKey('_upload_photo')}</Text>
                        </View>
                        <Button style={stylesCustomers.takePhotoBtn} onPress={takePhoto}>
                            <Text style={stylesCustomers.txtTakePhoto}>{languageKey('_take_photo')}</Text>
                        </Button>
                        <Button style={stylesCustomers.chooseGalleryBtn} onPress={getImageGallery}>
                            <Text style={stylesCustomers.txtTakePhoto}>{languageKey('_select_gallery')}</Text>
                        </Button>
                    </View>
                    <Button style={stylesCustomers.cancelButton} onPress={handleCloseModalUpload}>
                        <Text style={stylesCustomers.txtBtn}>{languageKey('_close')}</Text>
                    </Button>
                </View>
            </Modal>

            <Modal
                isVisible={modals.update}
                style={stylesCustomers.modalUpdateImage}
                onBackButtonPress={handleCloseModalUpdate}
                onBackdropPress={handleCloseModalUpdate}
                backdropTransitionOutTiming={0}
                hideModalContentWhileAnimating>
                <View style={stylesCustomers.modalContainerEdit}>
                    <View style={stylesCustomers.containerButtonEdit}>
                        <Button style={stylesCustomers.editBtn} onPress={openModalAddCustomer}>
                            <Text style={stylesCustomers.txtModalBtn}>{languageKey('_edit')}</Text>
                        </Button>
                        <Button style={stylesCustomers.deleteBtn} onPress={handleDelete}>
                            <Text style={stylesCustomers.txtDelete}>{languageKey('_delete')}</Text>
                        </Button>
                    </View>
                    <Button style={stylesCustomers.cancelButtonModal} onPress={handleCloseModalUpdate}>
                        <Text style={stylesCustomers.txtModalBtn}>{languageKey('_cancel')}</Text>
                    </Button>
                </View>
            </Modal>
            {modals.addCustomer && (
                <View >
                    <Modal
                        isVisible={modals.addCustomer}
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
                        <ScrollView style={stylesCustomers.modalContainer}>
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
                                            data={listCustomers}
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
                                            setLinkImage={setLinkImageEdit}
                                            dataLink={linkImageEdit}
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
                                    dataEdit={surveyAnswers}
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
                            >
                                <Text style={stylesCustomers.txtBtnConfirm}>{languageKey('_confirm')}</Text>
                            </Button>
                        </View>
                    </Modal>
                </View>
            )}
            <Modal
                isVisible={modals.viewImage}
                style={stylesCustomers.modal}
                onBackButtonPress={openModalViewImage}
                onBackdropPress={closeModalViewImage}
                backdropTransitionOutTiming={0}
                hideModalContentWhileAnimating
            >
                <View style={stylesCustomers.headerModal}>
                    <Button style={stylesCustomers.btnCancelModal} onPress={closeModalViewImage}>
                        <Text style={stylesCustomers.txtCancelModal}>{languageKey('_cancel')}</Text>
                    </Button>
                    <Text style={stylesCustomers.titleModal}>{languageKey('_all_images')}</Text>
                </View>
                <ScrollView style={stylesCustomers.modalContainer} showsVerticalScrollIndicator={false}>
                    {groupedImages.map(([time, images], index) => {
                        const linkImgArray = images.map((img) => img.Link);
                        return (
                            <View key={time} style={stylesCustomers.containerImage}>
                                <Text style={stylesCustomers.txtImageModal}>
                                    {index === 0 ? languageKey('_recent_picures') : `${languageKey('_time_one')} ${Number(time) + 1}`}
                                </Text>
                                <RenderImage urls={linkImgArray} />
                            </View>
                        );
                    })}
                </ScrollView>
            </Modal>
        </View>
    )
}

export default Customers;