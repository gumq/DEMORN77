import React, { useEffect, useState } from "react";
import moment from "moment";
import { View, Text, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { colors } from "themes";
import { stylesDetail } from "../styles";
import { ApiVisitForUsers_FeedBack } from "action/Api";
import { translateLang } from "store/accLanguages/slide";
import { AttachManyFile, Button, NotifierAlert } from "components";
import { fetchDetailVisitCustomer } from "store/accVisit_Customer/thunk";

const TabOpinionCustomer = ({ item }) => {
    const languageKey = useSelector(translateLang);
    const dispatch = useDispatch();
    const { detailVisitCustomer } = useSelector(state => state.VisitCustomer);
    const [isSubmit, setIsSubmit] = useState(true);
    const [machineType, onChangeMachineType] = useState(detailVisitCustomer?.FeedBack || "");
    const [numberMachine, onChangeNumberMachine] = useState(detailVisitCustomer?.FeedBack || "");
    const [numberEmployees, onChangeNumberEmployees] = useState(detailVisitCustomer?.FeedBack || "");
    const [consumptionOutput, onChangeComsumptionOutput] = useState(detailVisitCustomer?.FeedBack || "");
    const [content, onChangeContent] = useState(detailVisitCustomer?.FeedBack || "");
    const [linkImage, setLinkImage] = useState(
        detailVisitCustomer && detailVisitCustomer?.LinkFeedBack && detailVisitCustomer?.LinkFeedBack.trim() !== ''
            ? detailVisitCustomer?.LinkFeedBack
            : ''
    );
    const [images, setDataImages] = useState([])

    const opinionCustomerEvent = async () => {
        const linkArray = typeof linkImage === 'string' ? linkImage.split(';') : Array.isArray(linkImage) ? linkImage : [];
        const linkString = linkArray.join(';');
        const body = {
            ID: item?.ID,
            FeedBack: content,
            LinkFeedBack: linkString || "",
            TypeMachines: machineType || "",
            NumberMachines: numberMachine || "",
            NumberWorkers: numberEmployees || "",
            ConsumedOutput: consumptionOutput || "",
        };

        try {
            const response = await ApiVisitForUsers_FeedBack(body);
            const result = response.data;
            if (result?.StatusCode === 200 && result?.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${result?.Message}`,
                    'success',
                );
                setIsSubmit(false);
                const bodyDetail = {
                    ID: item?.ID
                }
                dispatch(fetchDetailVisitCustomer(bodyDetail))
            } else {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${result?.Message}`,
                    'error',
                );
            }
        } catch (error) {
            console.error('Thêm ý kiến phản hồi khách hàng', error);
        }
    };

    const shouldShowCheckInButton =
        item?.PlanDate &&
        moment(item.PlanDate).format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY');

    const btnDisable = detailVisitCustomer?.LinkFeedBack !== '' || detailVisitCustomer?.FeedBack !== ''

    useEffect(() => {
        const linkImg = detailVisitCustomer?.LinkFeedBack || '';
        const linkImgArray = linkImg ? linkImg.split(';').filter(Boolean) : [];
        setDataImages(linkImgArray);
    }, [detailVisitCustomer]);

    return (
        <View style={stylesDetail.cardProgram}>
            <Text style={stylesDetail.headerProgram}>{languageKey('_customer_opinion_info')}</Text>
            {!btnDisable ?
                <>
                    <Text style={stylesDetail.headerInput}>{languageKey('_machine_type')}</Text>
                    <TextInput
                        style={stylesDetail.inputContent}
                        onChangeText={onChangeMachineType}
                        value={machineType}
                        placeholder={languageKey('_enter_content')}
                        multiline={true}
                    />

                    <Text style={stylesDetail.headerInput}>{languageKey('_number_of_machines')}</Text>
                    <TextInput
                        style={stylesDetail.inputContent}
                        onChangeText={onChangeNumberMachine}
                        value={numberMachine}
                        placeholder={languageKey('_enter_content')}
                        multiline={true}
                        keyboardType="numeric"
                    />
                    <Text style={stylesDetail.headerInput}>{languageKey('_number_of_employees')}</Text>
                    <TextInput
                        style={stylesDetail.inputContent}
                        onChangeText={onChangeNumberEmployees}
                        value={numberEmployees}
                        placeholder={languageKey('_enter_content')}
                        multiline={true}
                        keyboardType="numeric"
                    />
                    <Text style={stylesDetail.headerInput}>{languageKey('_consumption_output_month')}</Text>
                    <TextInput
                        style={stylesDetail.inputContent}
                        onChangeText={onChangeComsumptionOutput}
                        value={consumptionOutput}
                        placeholder={languageKey('_enter_content')}
                        multiline={true}
                        keyboardType="numeric"
                    />
                    <Text style={stylesDetail.headerInput}>{languageKey('_note')}</Text>
                    <TextInput
                        style={stylesDetail.inputContent}
                        onChangeText={onChangeContent}
                        value={content}
                        placeholder={languageKey('_enter_notes')}
                        multiline={true}
                    />
                    <View>
                        <Text style={stylesDetail.headerBoxImage}>{languageKey('_image')}</Text>
                        <AttachManyFile
                            OID={item?.OID}
                            images={images}
                            setDataImages={setDataImages}
                            setLinkImage={setLinkImage}
                            dataLink={linkImage}
                            disable={btnDisable}
                        />

                    </View>
                </>
                :
                <>
                    <View style={stylesDetail.viewContentRow}>
                        <Text style={stylesDetail.txtTitle}>{languageKey('_machine_type')}</Text>
                        <Text style={stylesDetail.txtValue}>{detailVisitCustomer?.TypeMachines}</Text>
                    </View>
                    <View style={stylesDetail.containerContent}>
                        <View style={stylesDetail.viewContent}>
                            <Text style={stylesDetail.txtTitle}>{languageKey('_number_of_machines')} </Text>
                            <Text style={stylesDetail.txtValue}>{detailVisitCustomer?.NumberMachines}</Text>
                        </View>
                        <View style={stylesDetail.viewContent}>
                            <Text style={stylesDetail.txtTitle}>{languageKey('_number_of_employees')} </Text>
                            <Text style={stylesDetail.txtValue}>{detailVisitCustomer?.NumberWorkers}</Text>
                        </View>
                    </View>
                    <View style={stylesDetail.viewContentRow}>
                        <Text style={stylesDetail.txtTitle}>{languageKey('_consumption_output_month')}</Text>
                        <Text style={stylesDetail.txtValue}>{detailVisitCustomer?.ConsumedOutput}</Text>
                    </View>
                    <View style={stylesDetail.viewContentRow}>
                        <Text style={stylesDetail.txtTitle}>{languageKey('_note')}</Text>
                        <Text style={stylesDetail.txtValue}>{detailVisitCustomer?.FeedBack}</Text>
                    </View>
                    <View>
                        <Text style={stylesDetail.headerBoxImage}>{languageKey('_image')}</Text>
                        <AttachManyFile
                            OID={item?.OID}
                            images={images}
                            setDataImages={setDataImages}
                            setLinkImage={setLinkImage}
                            dataLink={linkImage}
                            disable={btnDisable}
                        />

                    </View>
                </>

            }

            {isSubmit && !btnDisable ? (
                <View style={stylesDetail.footer}>
                    <Button
                        style={[stylesDetail.btnConfirmCheck, { borderColor: colors.borderColor }]}
                        onPress={opinionCustomerEvent}
                        disabled={!shouldShowCheckInButton}
                    >
                        <Text style={[stylesDetail.txtBtnConfirm, { color: colors.black }]}>{languageKey('_skip')}</Text>
                    </Button>
                    <Button
                        style={stylesDetail.btnConfirmCheck}
                        onPress={opinionCustomerEvent}
                        disabled={!shouldShowCheckInButton}
                    >
                        <Text style={stylesDetail.txtBtnConfirm}>{languageKey('_confirm')}</Text>
                    </Button>
                </View>
            ) : null}
        </View>
    )
}

export default TabOpinionCustomer;