import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import _ from 'lodash';
import { useDispatch, useSelector } from "react-redux";
import { View, Text, FlatList } from 'react-native';

import { stylesDetail, styles } from "../styles";
import { translateLang } from "store/accLanguages/slide";
import { Button, RenderImage } from "components";
import { fetchDetailComplaintWarranties, fetchListSOByCustomer } from "store/acc_Complaint_Warranties/thunk";
import { ModalAccept, ModalAddSO } from "../modalForm";
import { SvgXml } from "react-native-svg";
import { arrow_down_big, arrow_next_gray, trash_22 } from "svgImg";
import { ApiComplaints_DeleteProfile } from "action/Api";

const DetailTab = ({ detailComplaintWarraties }) => {
    const languageKey = useSelector(translateLang);
    const dispatch = useDispatch();
    const [isShowModal, setIsShowModal] = useState(false);
    const [listSO, setListSO] = useState([]);
    const [expandedPlans, setExpandedPlans] = useState({});
    const [itemEdit, setItemEdit] = useState(null);
    const linkImgArray = useMemo(() => {
        return detailComplaintWarraties?.Link
            ? detailComplaintWarraties.Link.split(';').filter(Boolean)
            : [];
    }, [detailComplaintWarraties?.Link]);


    const [showFormStepAccept, setShowFormStepAccept] = useState(false);
    const [showFormResponse, setShowFormResponse] = useState(false);

    const itemLinksStepAccept = useMemo(() => {
        return detailComplaintWarraties?.RequestLink
            ? detailComplaintWarraties.RequestLink.split(';').filter(Boolean)
            : [];
    }, [detailComplaintWarraties?.RequestLink]);

    const toggleInformation = (id) => {
        setExpandedPlans(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const showModal = () => {
        setIsShowModal(!isShowModal);
    };

    const closeModal = () => {
        setIsShowModal(!isShowModal);
    };

    const _keyExtractor = (item, index) => `${item.ErrorId}-${index}`;
    const _renderItem = ({ item }) => {
        return (
            <View style={styles.cardItem} >
                <View style={stylesDetail.containerHeader}>
                    <Text
                        style={stylesDetail.header}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {item?.Name}
                    </Text>
                    <View style={[styles.bodyStatus, { backgroundColor: item?.HandleStatusColor }]}>
                        <Text style={[styles.txtStatus, { color: item?.HandleStatusTextColor }]}>
                            {item?.HandleStatusName}
                        </Text>
                    </View>
                </View>
                <Text style={styles.txtDescription}>{item?.SKU}</Text>
                <View style={[styles.bodyCard, { marginTop: 8 }]}>
                    <View style={styles.contentCard}>
                        <Text style={styles.txtHeaderBody}>{languageKey('_describle_reason')}</Text>
                        <Text style={styles.contentBody}>{item.ErrorDescription}</Text>
                    </View>
                </View>
            </View>
        );
    };

    const handleDelete = _.debounce(async (item) => {
        const body = {
            ID: item?.ID,
        }
        try {
            const result = await ApiComplaints_DeleteProfile(body);
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                const bodyDetail = { OID: detailComplaintWarraties?.OID }
                dispatch(fetchDetailComplaintWarranties(bodyDetail))
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

    const handleEditSO = (itemSOEdit) => {
        setItemEdit(itemSOEdit)
        setIsShowModal(true)
    };

    const _keyExtractorGood = (item, index) => `${item.ReferenceID}-${index}`;
    const _renderItemGood = ({ item }) => {
        const isExpanded = expandedPlans[item.ID];
        return (
            <Button style={stylesDetail.cardProgramDetail} onPress={() => handleEditSO(item)}>
                <View style={stylesDetail.row}>
                    <Text style={stylesDetail.headerProgram}>{item?.ReferenceID}</Text>
                    {item?.IsLock === 1 ? null :
                        <Button onPress={() => handleDelete(item)}>
                            <SvgXml xml={trash_22} />
                        </Button>
                    }
                </View>
                <View style={stylesDetail.bodyCard}>
                    {item?.ODReferenceID ? (
                        <View style={stylesDetail.contentCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_od_information')}</Text>
                            <Text style={stylesDetail.contentBody}>{item?.ODReferenceID}</Text>
                        </View>
                    ) : null}
                    {item?.ReturnDate ? (
                        <View style={stylesDetail.contentCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_return_date')}</Text>
                            <Text style={stylesDetail.contentBody}>{moment(item?.ReturnDate).format('DD/MM/YY')}</Text>
                        </View>
                    ) : null}
                    {item?.NotSOReferenceID ? (
                        <View style={stylesDetail.contentCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('outward_delivery_so')}</Text>
                            <Text style={stylesDetail.contentBody}>{item?.NotSOReferenceID}</Text>
                        </View>
                    ) : null}
                </View>
                <View style={stylesDetail.line} />
                <View style={stylesDetail.containerHeaderShow}>
                    <Text style={stylesDetail.headerShow}>{languageKey('_product_list')}</Text>
                    <Button
                        style={stylesDetail.btnShowInfor}
                        onPress={() => toggleInformation(item.ID)}
                    >
                        <SvgXml xml={isExpanded ? arrow_down_big : arrow_next_gray} />
                    </Button>
                </View>

                {isExpanded && (
                    <FlatList
                        data={item?.ListItem}
                        renderItem={_renderItem}
                        style={stylesDetail.flatList}
                        keyExtractor={_keyExtractor}
                    />
                )}
            </Button>
        );
    };

    useEffect(() => {
        const body = {
            CustomerID: detailComplaintWarraties?.CustomerID,
        }
        dispatch(fetchListSOByCustomer(body))
    }, [detailComplaintWarraties])

    useEffect(() => {
        const isUnlocked = detailComplaintWarraties?.IsLock === 1;

        setShowFormStepAccept(detailComplaintWarraties?.RequestUserID === 0 && isUnlocked && detailComplaintWarraties?.IsCustomer === 1);
        setShowFormResponse(detailComplaintWarraties?.RequestUserID !== 0 && detailComplaintWarraties?.ResponseUserID === 0);
    }, [detailComplaintWarraties]);

    return (
        <View style={stylesDetail.container} >
            <View style={stylesDetail.cardProgram}>
                <View style={[stylesDetail.containerHeader, { marginBottom: 8 }]}>
                    <Text style={stylesDetail.header}>{languageKey('_information_general')}</Text>
                    <View style={[styles.bodyStatus, { backgroundColor: detailComplaintWarraties?.ApprovalStatusColor }]}>
                        <Text style={[styles.txtStatus, { color: detailComplaintWarraties?.ApprovalStatusTextColor }]}>
                            {detailComplaintWarraties?.ApprovalStatusName}
                        </Text>
                    </View>
                </View>

                <View style={stylesDetail.containerContentBody}>
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_ct_code')}</Text>
                        <Text style={stylesDetail.contentBody}>{detailComplaintWarraties?.OID}</Text>
                    </View>
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_ct_day')}</Text>
                        <Text style={stylesDetail.contentBody}>{moment(detailComplaintWarraties?.ODate).format('DD/MM/YYYY')}</Text>
                    </View>
                </View>
                <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_customer')}</Text>
                    <Text style={stylesDetail.contentBody}>{detailComplaintWarraties?.CustomerName}</Text>
                </View>
                <View style={stylesDetail.containerContentBody}>
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_request')}</Text>
                        <Text style={stylesDetail.contentBody}>{detailComplaintWarraties?.EntryName}</Text>
                    </View>
                    {detailComplaintWarraties?.CustomerRequestTypeName ?
                        <View style={stylesDetail.containerBodyCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_type_of_request')}</Text>
                            <Text style={stylesDetail.contentBody}>{detailComplaintWarraties?.CustomerRequestTypeName}</Text>
                        </View>
                        : null
                    }
                </View>
                {detailComplaintWarraties?.Content ?
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_content')}</Text>
                        <Text style={stylesDetail.contentBody}>{detailComplaintWarraties?.Content}</Text>
                    </View>
                    : null
                }
                {detailComplaintWarraties?.Note ?
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_note')}</Text>
                        <Text style={stylesDetail.contentBody}>{detailComplaintWarraties?.Note}</Text>
                    </View>
                    : null
                }
                {linkImgArray.length > 0 && (
                    <View style={stylesDetail.containerTableFileItem}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_image')}</Text>
                        <RenderImage urls={linkImgArray} />
                    </View>
                )}
            </View>
            {showFormStepAccept && (
                <ModalAccept
                    isShow={showFormStepAccept}
                    setShowForm={setShowFormStepAccept}
                    OID={detailComplaintWarraties?.OID}
                />
            )}
            {detailComplaintWarraties?.RequestUserID !== 0 && detailComplaintWarraties?.IsCustomer === 1 && (
                <View style={stylesDetail.cardProgram}>
                    <Text style={stylesDetail.headerProgram}>{languageKey('_request_reception_infor')}</Text>

                    <View style={stylesDetail.containerContent}>
                        <View style={stylesDetail.containerBodyCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_confirmer')}</Text>
                            <Text style={stylesDetail.contentBody}>{detailComplaintWarraties?.RequestUserName}</Text>
                        </View>
                        <View style={stylesDetail.containerBodyCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_time')}</Text>
                            <Text style={stylesDetail.contentBody}>{moment(detailComplaintWarraties?.RequestDate).format('DD/MM/YYYY')}</Text>
                        </View>
                    </View>
                    {detailComplaintWarraties?.RequestContent ?
                        <View style={stylesDetail.containerBodyCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_content')}</Text>
                            <Text
                                style={stylesDetail.contentBody}
                                numberOfLines={3}
                                ellipsizeMode="tail"
                            >
                                {detailComplaintWarraties?.RequestContent}
                            </Text>
                        </View>
                        : null
                    }
                    {itemLinksStepAccept.length > 0 && (
                        <View>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_image')}</Text>
                            <RenderImage urls={itemLinksStepAccept} />
                        </View>
                    )}

                </View>
            )}
            {/* {showFormResponse && (
                <ModalRespone
                    isShow={showFormResponse}
                    setShowForm={setShowFormResponse}
                    OID={detailComplaintWarraties?.OID}
                />
            )}
            {detailComplaintWarraties?.ResponseUserID !== 0 && (
                <View style={stylesDetail.cardProgram}>
                    <Text style={stylesDetail.headerProgram}>{languageKey('_feedback_results')}</Text>
                    <View style={stylesDetail.bodyCard}>
                        <View style={stylesDetail.containerContent}>
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_confirmer')}</Text>
                                <Text style={stylesDetail.contentBody}>{detailComplaintWarraties?.ResponseUserName}</Text>
                            </View>
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_time')}</Text>
                                <Text style={stylesDetail.contentBody}>{moment(detailComplaintWarraties?.ResponseDate).format('DD/MM/YYYY')}</Text>
                            </View>
                        </View>
                        {detailComplaintWarraties?.RequestContent ?
                            <View style={stylesDetail.containerBodyCard}>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_content')}</Text>
                                <Text
                                    style={stylesDetail.contentBody}
                                    numberOfLines={3}
                                    ellipsizeMode="tail"
                                >
                                    {detailComplaintWarraties?.ResponseContent}
                                </Text>
                            </View>
                            : null
                        }
                        {itemLinksStepAccept.length > 0 && (
                            <View>
                                <Text style={stylesDetail.txtHeaderBody}>{languageKey('_image')}</Text>
                                <RenderImage urls={itemLinksStepAccept} />
                            </View>
                        )}
                    </View>
                </View>
            )} */}
            {detailComplaintWarraties?.RequestUserID !== 0 ?
                <View style={stylesDetail.cardProgram}>
                    <View style={stylesDetail.containerAdd}>
                        <Text style={stylesDetail.header}>{languageKey('_update_details')}</Text>
                        <Button style={stylesDetail.btnUploadItem} onPress={showModal} >
                            <Text style={stylesDetail.txtBtnUploadItem}>{languageKey('_add')}</Text>
                        </Button>
                    </View>
                    {detailComplaintWarraties?.ListSO?.length > 0 ?
                        <FlatList
                            data={detailComplaintWarraties?.ListSO}
                            renderItem={_renderItemGood}
                            style={stylesDetail.flatList}
                            keyExtractor={_keyExtractorGood}
                        />
                        : null
                    }
                </View>
                : null
            }

            <ModalAddSO
                setValue={setListSO}
                showModal={isShowModal}
                closeModal={closeModal}
                OID={detailComplaintWarraties?.OID}
                dataEdit={itemEdit}
                editSO={itemEdit ? true : false}
                isLock={itemEdit?.IsLock}
            />

        </View>
    )
}

export default DetailTab;