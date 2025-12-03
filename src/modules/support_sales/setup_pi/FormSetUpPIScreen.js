import React, { useEffect, useMemo, useState } from "react";
import _ from 'lodash';
import moment from "moment";
import Modal from 'react-native-modal';
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import { View, Text, TextInput, StatusBar, ScrollView, FlatList } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import routes from "@routes";
import { stylesDetail } from "./styles";
import { Button, HeaderBack, LoadingModal, ModalSelectDate, NotifierAlert } from "@components";
import { translateLang } from "@store/accLanguages/slide";
import { arrow_down_big, arrow_next_gray, open_envelope, trash_22 } from "@svgImg";
import { ApiPIAllocations_Edit, ApiPIAllocations_Submit } from "@api";
import { hScale, scale } from "@resolutions";
import { fetchDetailPI } from "@store/accSetup_PI/thunk";

const FormSetUpPIScreen = ({ route }) => {
    const item = route?.params?.item;
    const languageKey = useSelector(translateLang);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { detailPI, isSubmitting } = useSelector(state => state.SetUpDetailPI);
    const [isShowModal, setIsShowModal] = useState(false);
    const [contentWork, onChangeContentWork] = useState('');
    const [contentCost, onChangeContentCost] = useState('0');
    const [contentProposal, onChangeContentProposal] = useState('');
    const [plansByCriteria, setPlansByCriteria] = useState({});
    const [listAdjust, setListAdjust] = useState(detailPI?.Details || []);
    const [criteriaAdd, setCriteriaAdd] = useState(null);
    const [keyModal, setKeyModal] = useState(0);
    const [editingPlan, setEditingPlan] = useState(null);
    const [expandedPlans, setExpandedPlans] = useState({});
    const [editingCriteria, setEditingCriteria] = useState(null);

    const parseMonthYear = (str, isEnd = false) => {
        if (!str) return null;
        const [monthStr, yearStr] = str.split("/");
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        if (isNaN(year) || isNaN(month)) return null;
        return isEnd ? new Date(year, month, 0) : new Date(year, month - 1, 1);
    };

    const minDate = useMemo(() => parseMonthYear(item?.Month), [item?.Month]);
    const maxDate = useMemo(() => parseMonthYear(item?.Month, true), [item?.Month]);

    const [dateStates, setDateStates] = useState({
        fromDate: {
            selected: null,
            submit: null,
            visible: false,
        },
        toDate: {
            selected: null,
            submit: null,
            visible: false,
        },
    });

    const updateDateState = (key, newValues) => {
        setDateStates(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                ...newValues
            }
        }));
    };

    const [showInformation, setShowInformation] = useState({
        information: true,
        criteria: false,
    });

    const toggleInformation = (key) => {
        setShowInformation((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const togglePlanVisibility = (id) => {
        setExpandedPlans(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleChangeContentCost = (text) => {
        const numeric = text.replace(/\D/g, '');
        onChangeContentCost(numeric)
    };

    const openModalAdd = (item, key) => {
        setCriteriaAdd(item)
        setKeyModal(key)
        setIsShowModal(!isShowModal);
    }

    const closeModalAdd = () => {
        setIsShowModal(!isShowModal);
    }

    const findWorkCriteriaIDByAllocationID = (allocationID) => {
        const criteria = detailPI?.Details?.find(item => item.ID === allocationID);
        return criteria?.WorkCriteriaID ?? 0;
    };

    const onEditPlan = (planItem) => {
        const planClone = { ...planItem };

        setEditingPlan(planClone);

        onChangeContentWork(planClone.Content || '');
        onChangeContentCost(String(planClone.Value || '0'));

        updateDateState('fromDate', {
            selected: new Date(planClone.FromDate),
            submit: new Date(planClone.FromDate),
        });

        updateDateState('toDate', {
            selected: new Date(planClone.ToDate),
            submit: new Date(planClone.ToDate),
        });

        const allocationID = planClone.AllocationID || planClone.PIAllocationID;

        const workCriteriaID = findWorkCriteriaIDByAllocationID(allocationID);

        setIsShowModal(true);
        setKeyModal(1);

        setCriteriaAdd({
            ID: allocationID,
            WorkCriteriaID: workCriteriaID
        });
    };

    useEffect(() => {
        if (minDate && maxDate) {
            updateDateState('fromDate', {
                selected: minDate,
                submit: minDate,
            });

            updateDateState('toDate', {
                selected: maxDate,
                submit: maxDate,
            });

        }
    }, [minDate, maxDate]);

    const onEditCriteria = (item) => {
        setEditingCriteria(item);

        onChangeContentProposal(String(item.ProposalValue || '0'));
        onChangeContentWork(item.Reason || '');

        setIsShowModal(true);
        setKeyModal(0);
        setCriteriaAdd(item);
    };

    useEffect(() => {
        if (detailPI?.Details?.length > 0) {
            const plansInit = {};

            detailPI.Details.forEach(item => {
                try {
                    const parsed = JSON.parse(item.Plans || '[]');

                    const enhancedPlans = parsed.map(plan => ({
                        ...plan,
                        AllocationID: item.ID,
                        WorkCriteriaID: item.WorkCriteriaID,
                        _uuid: plan._uuid || `${item.ID}-${plan.ID || generateSimpleId()}`
                    }));

                    plansInit[item.WorkCriteriaID] = enhancedPlans;
                } catch (e) {
                    console.warn('Parse lỗi:', e);
                    plansInit[item.WorkCriteriaID] = [];
                }
            });

            setPlansByCriteria(plansInit);
            setListAdjust(detailPI?.Details);

        }
    }, [detailPI]);

    const getPlansByItem = (item) => plansByCriteria[item.WorkCriteriaID] || [];

    const generateSimpleId = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const handleAddNewPlan = () => {
        const isEditing = !!editingPlan;

        const newPlan = {
            _uuid: editingPlan?._uuid || generateSimpleId(),
            ID: editingPlan?.ID || 0,
            AllocationID: criteriaAdd?.ID || 0,
            WorkCriteriaID: criteriaAdd?.WorkCriteriaID || 0,
            FromDate: dateStates?.fromDate.submit,
            ToDate: dateStates?.toDate.submit,
            Content: contentWork,
            Value: contentCost,
        };

        const key = criteriaAdd?.WorkCriteriaID;

        setPlansByCriteria(prev => {
            const currentPlans = prev[key] || [];

            const updatedPlans = isEditing
                ? currentPlans.map(plan => {
                    const matchByUuid = plan._uuid && editingPlan._uuid && plan._uuid === editingPlan._uuid;
                    const matchByIdAndAlloc = plan.ID === editingPlan.ID && plan.AllocationID === editingPlan.AllocationID;
                    return matchByUuid || matchByIdAndAlloc ? { ...plan, ...newPlan } : plan;
                })
                : [...currentPlans, newPlan];

            return {
                ...prev,
                [key]: updatedPlans,
            };
        });

        onChangeContentCost('0');
        onChangeContentWork('');
        setDateStates({
            fromDate: { submit: new Date() },
            toDate: { submit: new Date() },
        });
        setEditingPlan(null);
        closeModalAdd();
    };

    const handleAdjust = () => {
        const newAdjust = {
            ID: criteriaAdd?.ID || 0,
            WorkCriteriaID: criteriaAdd?.WorkCriteriaID || 0,
            WorkCriteriaName: criteriaAdd?.WorkCriteriaName || '',
            AssignedValue: criteriaAdd?.AssignedValue || 0,
            ProposalValue: contentProposal || 0,
            Reason: contentWork || '',
            Plans: []
        };

        setListAdjust(prev => {
            if (!prev || prev.length === 0) {
                return [newAdjust];
            }

            const index = prev.findIndex(item => item.WorkCriteriaID === newAdjust.WorkCriteriaID);

            if (index !== -1) {
                const updatedList = [...prev];
                updatedList[index] = { ...prev[index], ...newAdjust };
                return updatedList;
            }
            return [...prev, newAdjust];
        });

        onChangeContentProposal('0');
        onChangeContentWork('');
        setEditingCriteria(null);
        closeModalAdd();
    };

    const details = listAdjust?.map(criteria => {
        const plans = plansByCriteria[criteria.WorkCriteriaID] || [];

        return {
            ID: criteria ? criteria.ID : (plans[0]?.AllocationID || 0),
            WorkCriteriaID: criteria.WorkCriteriaID || 0,
            AssignedValue: criteria?.AssignedValue ?? criteria.AssignedValue ?? 0,
            ProposalValue: Number(criteria?.ProposalValue ?? 0),
            Reason: criteria?.Reason ?? "",
            Plans: plans || [],
        };
    });

    const handleSave = _.debounce(async () => {
        const body = {
            Note: detailPI?.Note || "",
            ID: detailPI?.ID || "",
            HasPlans: keyModal || 0,
            Details: details || []
        }
        try {
            const result = await ApiPIAllocations_Edit(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                const body = {
                    ID: item.ID
                }
                dispatch(fetchDetailPI(body))
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
            } else {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'error',
                );
            }
        } catch (error) {
            console.log('handleSave', error);
        }
    }, 2000, { leading: true, trailing: false });

    const handleConfirm = _.debounce(async () => {
        const body = {
            ID: detailPI?.ID,
            IsLock: detailPI?.IsLock === 0 ? 1 : 0
        }
        try {
            const result = await ApiPIAllocations_Submit(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                navigation.navigate(routes.SetUpDetailPIScreen)
            } else {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'error',
                );
            }
        } catch (error) {
            console.log('handleConfirm', error);
        }
    }, 2000, { leading: true, trailing: false });

    const handleDelete = (plan) => {
        const workCriteriaID = plan.WorkCriteriaID || criteriaAdd?.WorkCriteriaID;

        if (!workCriteriaID) {
            console.warn('❌ Missing workCriteriaID when deleting plan:', plan);
            return;
        }

        setPlansByCriteria(prev => {
            const currentPlans = prev[workCriteriaID] || [];

            const newPlans = currentPlans.filter(p => p._uuid !== plan._uuid);

            return {
                ...prev,
                [workCriteriaID]: newPlans
            };
        });
    };

    const _keyExtractorCriteria = (item, index) => `${item.Content}-${index}`;
    const _renderItemCriteria = ({ item }) => {
        console.log('item', item);
        return (
            <Button style={stylesDetail.cardProgramCriteria} onPress={() => onEditPlan(item)} >
                <View style={stylesDetail.contentPlan}>
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_time')}</Text>
                    <Text style={stylesDetail.contentTime}>{moment(item?.FromDate).format('DD/MM/YYYY')} - {moment(item?.ToDate).format('DD/MM/YYYY')}</Text>
                </View>
                <View style={stylesDetail.contentPlan}>
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_estimated_costs')}</Text>
                    <Text style={stylesDetail.contentTime}>{Number(item?.Value).toLocaleString('vi-VN')} VND</Text>
                </View>
                <View style={stylesDetail.containerHeaderShow}>
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_work_perdormed')}</Text>
                    <Button onPress={() => handleDelete(item)}>
                        <SvgXml xml={trash_22} />
                    </Button>
                </View>
                <Text style={stylesDetail.contentTime}>{item?.Content}</Text>
            </Button>
        );
    };

    const handleDeleteAdjust = (item) => {
        setListAdjust(prev => {
            return prev.map(adjust => {
                if (adjust.WorkCriteriaID === item.WorkCriteriaID) {
                    return {
                        ...adjust,
                        ProposalValue: 0,
                        Reason: '',
                    };
                }
                return adjust;
            });
        });
    };

    const _keyExtractor = (item, index) => `${item.ID}-${index}`;
    const _renderItem = ({ item }) => {
        const plans = getPlansByItem(item);
        const isExpanded = expandedPlans[item.ID];
        const difference = item.AssignedValue - item.ProposalValue;
        return (
            <Button style={stylesDetail.cardProgram} onPress={() => openModalAdd(item, key = 1)}>
                <View style={stylesDetail.containerHeaderShow}>
                    <Text
                        style={stylesDetail.headerProgram}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {item?.WorkCriteriaName}
                    </Text>
                    {item?.IsLock === 1 ? null :
                        <Button onPress={() => openModalAdd(item, key = 0)}>
                            <SvgXml xml={open_envelope} />
                        </Button>
                    }
                </View>
                <View style={stylesDetail.contentCard}>
                    <Text style={[stylesDetail.txtHeaderBody, { marginRight: scale(4) }]}>{languageKey('_assigned')}</Text>
                    <Text style={stylesDetail.contentTime}>{item?.AssignedValue}</Text>
                </View>

                {plans.length > 0 && (
                    <View style={stylesDetail.containerHeaderShow}>
                        <Text style={stylesDetail.headerShowPlan}>{languageKey('_details_plan')}</Text>
                        <Button
                            style={stylesDetail.btnShowInfor}
                            onPress={() => togglePlanVisibility(item.ID)}
                        >
                            <SvgXml xml={isExpanded ? arrow_down_big : arrow_next_gray} />
                        </Button>
                    </View>
                )}

                {isExpanded && (
                    <FlatList
                        data={plans}
                        renderItem={_renderItemCriteria}
                        keyExtractor={_keyExtractorCriteria}
                        extraData={plansByCriteria}
                        showsVerticalScrollIndicator={false}
                    />
                )}
                {item.ProposalValue !== 0 ?
                    <>
                        <Text style={stylesDetail.headerShowPlan}>{languageKey('_adjustment_details')}</Text>
                        <Button style={stylesDetail.cardProgramCriteria} onPress={() => onEditCriteria(item)} >
                            <View style={stylesDetail.contentPlan}>
                                <View>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_assigned')}</Text>
                                    <Text style={stylesDetail.contentTime}>{item.AssignedValue}</Text>
                                </View>
                                <View>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_propose')}</Text>
                                    <Text style={stylesDetail.contentTime}>{item.ProposalValue}</Text>
                                </View>
                                <View>
                                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_difference')}</Text>
                                    <Text style={stylesDetail.contentTime}>{difference}</Text>
                                </View>
                            </View>
                            <View style={stylesDetail.containerHeaderShow}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_suggested_reason')}</Text>
                                {item?.IsLock === 1 ? null :
                                    <Button onPress={() => handleDeleteAdjust(item)}>
                                        <SvgXml xml={trash_22} />
                                    </Button>
                                }
                            </View>

                            <Text style={stylesDetail.contentTime}>{item.Reason}</Text>
                        </Button>
                    </>
                    : null
                }
            </Button>
        );
    };

    return (
        <LinearGradient style={stylesDetail.container} start={{ x: 0.44, y: 0.45 }} end={{ x: 1.22, y: 0.25 }} colors={['#FFFFFF', '#FFFFFF',]} pointerEvents="box-none">
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView style={stylesDetail.container}>
                <HeaderBack
                    title={item?.Name}
                    onPress={() => navigation.goBack()}
                />
                <ScrollView style={stylesDetail.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={stylesDetail.containerHeaderShow}>
                        <Text style={stylesDetail.headerShow}>{languageKey('_information_general')}</Text>
                        <Button style={stylesDetail.btnShowInfor} onPress={() => toggleInformation("information")}>
                            <SvgXml xml={showInformation.information ? arrow_down_big : arrow_next_gray} />
                        </Button>
                    </View>
                    {showInformation.information && (
                        <View style={stylesDetail.cardProgram}>
                            <View style={stylesDetail.containerTime}>
                                <Text style={[stylesDetail.txtHeaderTime, { marginRight: scale(4) }]}>{languageKey('_application_period')}</Text>
                                <Text style={stylesDetail.contentTime}>{detailPI?.Month}</Text>
                            </View>
                            {detailPI?.Note ?
                                <View style={stylesDetail.containerTime}>
                                    <Text style={stylesDetail.txtHeaderTime}>{languageKey('_note')}</Text>
                                    <Text style={stylesDetail.contentTime}>{detailPI?.Note}</Text>
                                </View>
                                : null
                            }
                        </View>
                    )}
                    <View style={stylesDetail.containerHeaderShow}>
                        <Text style={stylesDetail.headerShow}>{languageKey('_list_of_criteria')}</Text>
                        <Button style={stylesDetail.btnShowInfor} onPress={() => toggleInformation("criteria")}>
                            <SvgXml xml={showInformation.criteria ? arrow_down_big : arrow_next_gray} />
                        </Button>
                    </View>
                    {showInformation.criteria && (
                        <FlatList
                            data={listAdjust}
                            renderItem={_renderItem}
                            keyExtractor={_keyExtractor}
                            contentContainerStyle={stylesDetail.footerFlat}
                        />
                    )}
                </ScrollView>
                <View style={stylesDetail.containerFooter}>
                    <Button
                        style={stylesDetail.btnSave}
                        onPress={handleSave}
                    >
                        <Text style={stylesDetail.txtBtnSave}>{languageKey('_save')}</Text>
                    </Button>
                    <Button
                        style={stylesDetail.btnConfirm}
                        disabled={detailPI ? false : true}
                        onPress={handleConfirm}
                    >
                        <Text style={stylesDetail.txtBtnConfirm}>{languageKey('_confirm')}</Text>
                    </Button>
                </View>
            </SafeAreaView>
            <LoadingModal isShowModal={isSubmitting} />
            <Modal
                isVisible={isShowModal}
                useNativeDriver
                onBackdropPress={closeModalAdd}
                onBackButtonPress={closeModalAdd}
                backdropTransitionOutTiming={450}
                style={stylesDetail.modal}
            >

                {keyModal === 1 ?
                    <View style={stylesDetail.headerModalAdd}>
                        <Text style={stylesDetail.titleModalAdd}>
                            {languageKey('_propose_a_plan')}
                        </Text>
                        <Text style={stylesDetail.titleModalAdd}>{criteriaAdd?.WorkCriteriaName}</Text>
                    </View>
                    :
                    <View style={stylesDetail.headerModalAdd}>
                        <Text style={stylesDetail.titleModalAdd}>
                            {languageKey('_suggested_adjustments')}
                        </Text>
                        <Text style={stylesDetail.titleModalAdd}>{criteriaAdd?.WorkCriteriaName}</Text>
                    </View>
                }

                {keyModal === 1 ?
                    <View style={stylesDetail.modalContainer}>
                        <View style={stylesDetail.inputFormDate}>
                            <View style={{ flex: 1 }}>
                                <ModalSelectDate
                                    title={languageKey('_fromdate')}
                                    showDatePicker={() => updateDateState('fromDate', { visible: true })}
                                    hideDatePicker={() => updateDateState('fromDate', { visible: false })}
                                    initialValue={dateStates.fromDate.selected}
                                    selectedValueSelected={(val) => updateDateState('fromDate', { selected: val })}
                                    isDatePickerVisible={dateStates.fromDate.visible}
                                    selectSubmitForm={(val) => updateDateState('fromDate', { submit: val })}
                                    bgColor={'#FAFAFA'}
                                    require={true}
                                    minimumDate={minDate}
                                    maximumDate={maxDate}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <ModalSelectDate
                                    title={languageKey('_toDate')}
                                    showDatePicker={() => updateDateState('toDate', { visible: true })}
                                    hideDatePicker={() => updateDateState('toDate', { visible: false })}
                                    initialValue={dateStates.toDate.selected}
                                    selectedValueSelected={(val) => updateDateState('toDate', { selected: val })}
                                    isDatePickerVisible={dateStates.toDate.visible}
                                    selectSubmitForm={(val) => updateDateState('toDate', { submit: val })}
                                    bgColor={'#FAFAFA'}
                                    require={true}
                                    minimumDate={minDate}
                                    maximumDate={maxDate}
                                />
                            </View>
                        </View>
                        <Text style={stylesDetail.headerInput}>{languageKey('_work_perdormed')}</Text>
                        <TextInput
                            style={stylesDetail.inputValue}
                            onChangeText={onChangeContentWork}
                            value={contentWork}
                            multiline={true}
                            numberOfLines={4}
                            placeholder={languageKey('_enter_content')}
                        />
                        <Text style={stylesDetail.headerInput}>{languageKey('_estimated_costs')}</Text>
                        <TextInput
                            style={[stylesDetail.inputValue, { height: hScale(42), textAlign: 'right' }]}
                            onChangeText={handleChangeContentCost}
                            value={contentCost ? Number(contentCost).toLocaleString('vi-VN') : '0'}
                            multiline={true}
                            keyboardType="numeric"
                            placeholder={languageKey('_enter_content')}
                        />
                        <View style={stylesDetail.footer}>
                            <Button style={stylesDetail.btnFooterCancel} onPress={closeModalAdd}>
                                <Text style={stylesDetail.txtBtnCancel}>{languageKey('_cancel')}</Text>
                            </Button>
                            <Button style={stylesDetail.btnFooterModal} onPress={handleAddNewPlan}>
                                <Text style={stylesDetail.txtBtnFooterModal}>{languageKey('_save')}</Text>
                            </Button>
                        </View>
                    </View>
                    :
                    <View style={stylesDetail.modalContainer}>
                        <View style={stylesDetail.inputFormDate}>
                            <View style={{ flex: 1 }}>
                                <View style={stylesDetail.inputRead}>
                                    <Text style={stylesDetail.txtHeaderInputView}>{languageKey('_assigned')}</Text>
                                    <Text
                                        style={stylesDetail.inputView}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {criteriaAdd?.AssignedValue}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={stylesDetail.headerInput}>{languageKey('_propose')}</Text>
                                <TextInput
                                    style={[stylesDetail.inputValue, { height: hScale(42) }]}
                                    onChangeText={onChangeContentProposal}
                                    value={contentProposal}
                                    multiline={true}
                                    keyboardType="numeric"
                                    placeholder={languageKey('_enter_content')}
                                />
                            </View>
                        </View>
                        <Text style={stylesDetail.headerInput}>{languageKey('_suggested_reason')}</Text>
                        <TextInput
                            style={stylesDetail.inputValue}
                            onChangeText={onChangeContentWork}
                            value={contentWork}
                            multiline={true}
                            numberOfLines={4}
                            placeholder={languageKey('_enter_content')}
                        />
                        <View style={stylesDetail.footer}>
                            <Button style={stylesDetail.btnFooterCancel} onPress={closeModalAdd}>
                                <Text style={stylesDetail.txtBtnCancel}>{languageKey('_cancel')}</Text>
                            </Button>
                            <Button style={stylesDetail.btnFooterModal} onPress={handleAdjust}>
                                <Text style={stylesDetail.txtBtnFooterModal}>{languageKey('_save')}</Text>
                            </Button>
                        </View>
                    </View>
                }
            </Modal>
        </LinearGradient>

    );
}

export default FormSetUpPIScreen;