import React, { useMemo, useState } from "react";
import { View, Text, FlatList, ScrollView } from 'react-native';
import moment from "moment";
import { SvgXml } from "react-native-svg";
import { useSelector } from "react-redux";
import Modal from 'react-native-modal';
import { groupBy } from 'lodash';

import { stylesCustomers, stylesDetail } from "../styles";
import { translateLang } from "store/accLanguages/slide";
import { Button, RenderImage } from "components";
import { ApiExhibitionEvaluations_GetByID } from "action/Api";
import { checkbox_active } from "svgImg";

const EvaluationResult = ({ detailExhibitionPrograms }) => {
    const languageKey = useSelector(translateLang);
    const [isShowModalDetail, setIsShowModalDetail] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);

    const openModalDetail = async (item) => {
        const body = {
            OID: item?.OID,
        };
        const result = await ApiExhibitionEvaluations_GetByID(body);
        const data = result.data;
        if (data.StatusCode === 200 && data.ErrorCode === '0') {
            setDataDetail(data?.Result)
            setIsShowModalDetail(!isShowModalDetail)
        } else {
            setDataDetail(null)
            setIsShowModalDetail(!isShowModalDetail)
        }
    }

    const closeModalDetail = () => {
        setIsShowModalDetail(!isShowModalDetail)
    }

    const _keyExtractor = (item, index) => `${item.OID}-${index}`;
    const _renderItem = ({ item }) => {
        const linkImgArray = item.Link.split(';').filter(Boolean)
        return (
            <Button style={stylesCustomers.cardProgram} onPress={() => openModalDetail(item)}>
                <Text
                    style={stylesCustomers.headerProgram}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {item?.CustomerName}
                </Text>

                <Text style={stylesCustomers.contentTime}>{moment(item?.ODate).format('DD/MM/YYYY')}</Text>
                <View style={stylesCustomers.headerCard}>
                    <View style={stylesCustomers.contentProgramCard}>
                        <Text style={stylesCustomers.txtHeaderContent}>{languageKey('_number_of_image_updates')}</Text>
                        <Text style={stylesCustomers.content}>{item?.ImageUpdateCount}</Text>
                    </View>
                    <View style={stylesCustomers.contentProgramCard}>
                        <Text style={stylesCustomers.txtHeaderContent}>{languageKey('_last_update_at')}</Text>
                        <Text style={stylesCustomers.content}>{moment(item?.ChangeDate).format('HH:mm DD/MM/YYYY')}</Text>
                    </View>
                </View>
                <Text style={stylesCustomers.txtHeaderContent}>{languageKey('_image')}</Text>
                {linkImgArray.length > 0 && (
                    <View style={stylesCustomers.containerTableFileItem}>
                        <Text style={stylesCustomers.txtHeaderContent}>{languageKey('_image')}</Text>
                        <RenderImage urls={linkImgArray} />
                    </View>
                )}
                <View style={stylesCustomers.containerFooterCard}>
                    <Text style={stylesCustomers.contentTimeApproval}>{languageKey('_update')} {moment(item?.ApprovalDate).format('HH:mm DD/MM/YYYY')}</Text>
                    <View style={[stylesCustomers.bodyStatus, { backgroundColor: item?.AIEvaluateStatusColor }]}>
                        <Text style={[stylesCustomers.txtStatus, { color: item?.AIEvaluateStatusTextColor }]}>
                            {item?.AIEvaluateStatusName}
                        </Text>
                    </View>
                </View>
            </Button>
        );
    };
    const groupedImages = useMemo(() => {
        if (!dataDetail?.Images || !Array.isArray(dataDetail.Images)) return [];

        return Object.entries(groupBy(dataDetail.Images, 'Time'))
            .sort(([a], [b]) => Number(b) - Number(a));
    }, [dataDetail]);

    return (
        <View style={stylesCustomers.container}>
            <FlatList
                data={detailExhibitionPrograms?.Evaluations}
                renderItem={_renderItem}
                keyExtractor={_keyExtractor}
                style={stylesCustomers.scrollview}
            />
            <Modal
                isVisible={isShowModalDetail}
                useNativeDriver={true}
                onBackdropPress={closeModalDetail}
                onBackButtonPress={closeModalDetail}
                backdropTransitionOutTiming={450}
                style={stylesCustomers.modal}>
                <View style={stylesCustomers.headerModal}>
                    <Text style={stylesCustomers.titleModal}>{languageKey('_results_details')}</Text>
                </View>
                <ScrollView style={stylesCustomers.modalContainerDetail} showsVerticalScrollIndicator={false}>
                    <View style={stylesCustomers.contentProgram}>
                        <Text style={stylesCustomers.txtHeaderContent}>{languageKey('_customer')}</Text>
                        <Text style={stylesCustomers.headerProgram}>{dataDetail?.CustomerName}</Text>
                    </View>

                    <View style={stylesCustomers.contentProgram}>
                        <Text style={stylesCustomers.txtHeaderContent}>{languageKey('_address')}</Text>
                        <Text style={stylesCustomers.headerProgram}>{dataDetail?.FullAddress}</Text>
                    </View>
                    <View style={stylesCustomers.headerCard}>
                        <View style={stylesCustomers.contentProgramCard}>
                            <Text style={stylesCustomers.txtHeaderContent}>{languageKey('_number_of_image_updates')}</Text>
                            <Text style={stylesCustomers.content}>{dataDetail?.ImageUpdateCount}</Text>
                        </View>
                        <View style={stylesCustomers.contentProgramCard}>
                            <Text style={stylesCustomers.txtHeaderContent}>{languageKey('_last_update_at')}</Text>
                            <Text style={stylesCustomers.content}>{moment(dataDetail?.ChangeDate).format('HH:mm DD/MM/YYYY')}</Text>
                        </View>
                    </View>

                    {dataDetail?.Details?.length > 0 ?
                        <View style={stylesDetail.tableWrapperDetail}>
                            <View style={stylesDetail.row}>
                                <View style={stylesDetail.cell_50}>
                                    <Text style={stylesDetail.txtHeaderTable}>{languageKey('_evaluation_criteria')}</Text>
                                </View>
                                <View style={stylesDetail.cell_25}>
                                    <Text style={stylesDetail.txtHeaderTable}>{languageKey('_percent')}</Text>
                                </View>
                                <View style={stylesDetail.cell_25}>
                                    <Text style={stylesDetail.txtHeaderTable}>{languageKey('_meets_requriements')}</Text>
                                </View>
                            </View>
                            <View style={stylesDetail.cardProduct}>
                                {dataDetail?.Details?.map((item, index) => (
                                    <View style={[
                                        stylesDetail.cellResponse,
                                        index === dataDetail?.Details?.length - 1 && stylesDetail.lastCell
                                    ]}
                                        key={index}>
                                        <View style={stylesDetail.cell_50}>
                                            <Text style={stylesDetail.txtValueTable}>{item.CriteriaName}</Text>
                                        </View>
                                        <View style={stylesDetail.cell_25}>
                                            <Text style={stylesDetail.txtValueTable}>{item.Weight}</Text>
                                        </View>
                                        <View style={stylesDetail.cell_25}>
                                            {item?.UserEvaluation === 1 ?
                                                <SvgXml xml={checkbox_active} />
                                                : null
                                            }
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                        : null
                    }
                    {groupedImages.map(([time, images], index) => {
                        const linkImgArray = images.map((img) => img.Link);
                        return (
                            <View key={time} style={stylesDetail.containerImage} >
                                <Text style={stylesDetail.txtImageModal}>
                                    {index === 0 ? 'Hình ảnh gần đây' : `Lần ${Number(time) + 1}`}
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

export default EvaluationResult;