import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import _ from 'lodash';
import { useSelector, useDispatch } from "react-redux";
import { View, Text, FlatList, ScrollView, TextInput } from 'react-native';
import Modal from 'react-native-modal';

import { stylesDetail, styles } from "../styles";
import { translateLang } from "store/accLanguages/slide";
import { Button, RenderImage, AttachManyFile, NotifierAlert } from "components";
import { ApiDisplayMaterials_Edit } from "action/Api";
import { fetchDetailCatalogue } from "store/accOther_Proposal/thunk";

const DetailTab = ({ detailCatalogue }) => {
    const languageKey = useSelector(translateLang);
    const dispatch = useDispatch();
    const [isShowModal, setIsShowModal] = useState(false);
    const [linkImage, setLinkImage] = useState('');
    const [images, setDataImages] = useState([]);
    const [quantiyGift, onChangeQuantity] = useState('0');
    const [note, onChangeNote] = useState('');
    const [itemUpdate, setItemUpdate] = useState(null);
    const [donatedGoods, setDonatedGoods] = useState([]);
    const [consignmentGoods, setConsignmentGoods] = useState([]);

    const linkImgArray = useMemo(() => {
        return detailCatalogue?.Link
            ? detailCatalogue.Link.split(';').filter(Boolean)
            : [];
    }, [detailCatalogue?.Link]);

    const handleCloseModalUpdate = () => {
        setIsShowModal(false)
    };

    const openModalUpdateResult = (item) => {
        setItemUpdate(item)
        setIsShowModal(true)
    };

    const _keyExtractorGood = (item, index) => `${item.ID}-${index}`;
    const _renderItemGood = ({ item }) => {
        const totalAmount = item?.ItemPrice * item?.ItemQty
        return (
            <Button style={stylesDetail.cardProgramDetail} onPress={() => openModalUpdateResult(item)}>
                <View style={stylesDetail.row}>
                    <View style={{ marginBottom: 8 }}>
                        <Text style={stylesDetail.headerProgramItem}>{item?.ItemName}</Text>
                        <Text style={stylesDetail.txtHeaderBody}>{item?.ItemID}</Text>
                    </View>
                </View>
                <View style={stylesDetail.containerContentBody}>
                    {item?.ItemQty ? (
                        <View style={stylesDetail.contentCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_quantity')}</Text>
                            <Text style={stylesDetail.contentBody}>{item?.ItemQty}</Text>
                        </View>
                    ) : null}
                    {item?.ItemPrice ? (
                        <View style={stylesDetail.contentCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_unit_price')}</Text>
                            <Text style={stylesDetail.contentBody}>{item?.ItemPrice?.toLocaleString()}</Text>
                        </View>
                    ) : null}
                    {totalAmount ? (
                        <View style={stylesDetail.contentCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_money')}</Text>
                            <Text style={stylesDetail.contentBody}>{totalAmount?.toLocaleString()}</Text>
                        </View>
                    ) : null}
                </View>
                <View style={stylesDetail.contentCard}>
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_customer')}</Text>
                    <Text style={stylesDetail.contentBody}>{item?.CustomerName}</Text>
                </View>
                <View style={stylesDetail.contentCard}>
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_note')}</Text>
                    <Text style={stylesDetail.contentBody}>{item?.Note}</Text>
                </View>
            </Button>
        );
    };

    const groupItemsByCustomer = (items, entryID) => {
        return detailCatalogue?.Customer?.map(customer => {
            const matchedItems = items?.filter(item => item?.OID === customer?.OID);
            if (matchedItems === 0) return null;
            return {
                CustomerID: customer.CustomerID,
                CustomerName: customer.CustomerName,
                OID: customer.OID,
                EntryID: entryID,
                ItemDetails: matchedItems
            }
        }).filter(entry => entry.ItemDetails.length > 0);
    };

    useEffect(() => {
        if (detailCatalogue) {
            const donated = groupItemsByCustomer(detailCatalogue?.ListItemGift, 'RequestGifts');
            const consignment = groupItemsByCustomer(detailCatalogue?.ListItemConsignment, 'RequestConsignment');

            setDonatedGoods(donated);
            setConsignmentGoods(consignment);
        }
    }, [detailCatalogue]);

    const getUpdatedGoods = (
        isGift,
        itemUpdate,
        targetGoods,
        quantity,
        note,
        linkImage
    ) => {
        return targetGoods?.map(entry => {
            if (entry?.OID === itemUpdate?.OID) {
                const updateDetail = entry?.ItemDetails?.map(item => {
                    if (item?.ID === itemUpdate?.ID) {
                        const linkArray = typeof linkImage === 'string' ? linkImage.split(';') : Array.isArray(linkImage) ? linkImage : [];
                        const linkString = linkArray.join(';');
                        return {
                            ...item,
                            Note: note,
                            Link: linkString || "",
                            ItemQtyGift: isGift ? Number(quantity) : item.ItemQtyGift,
                            ItemQtyConsigned: !isGift ? Number(quantity) : item.ItemQtyConsigned
                        };
                    }
                    return item;
                });

                return {
                    ...entry,
                    ItemDetails: updateDetail
                };
            }
            return entry;
        });
    };

    const handleSaveDraft = () => {
        const isGift = itemUpdate?.OID?.includes('DXTQ');
        const updatedGoods = getUpdatedGoods(isGift, itemUpdate, isGift ? donatedGoods : consignmentGoods, quantiyGift, note, linkImage);

        if (isGift) {
            setDonatedGoods(updatedGoods);
        } else {
            setConsignmentGoods(updatedGoods);
        }

        NotifierAlert(2000, `${languageKey('_notification')}`, `${languageKey('_save_draft')}`, 'success');
    };

    const handleUpdate = _.debounce(async () => {
        const body = {
            FactorID: detailCatalogue?.FactorID || '',
            EntryID: detailCatalogue?.EntryID || "",
            Odate: detailCatalogue?.ODate,
            SAPID: detailCatalogue?.SAPID,
            LemonID: detailCatalogue?.LemonID,
            ReferenceID: detailCatalogue?.ReferenceID,
            InProgram: detailCatalogue?.InProgram,
            OutProgram: detailCatalogue?.OutProgram,
            EventTypeID: detailCatalogue?.EventTypeID,
            RequestUserID: detailCatalogue?.RequestUserID,
            RequestDate: detailCatalogue?.RequestDate,
            Content: detailCatalogue?.Content || "",
            Link: detailCatalogue?.Link || "",
            Note: detailCatalogue?.Note || '',
            GiftAmount: detailCatalogue?.GiftAmount || 0,
            ConsignmentAmount: detailCatalogue?.ConsignmentAmount || 0,
            TotalAmount: detailCatalogue?.TotalAmount || 0,
            "Extention1": detailCatalogue?.Extention1,
            "Extention2": detailCatalogue?.Extention2,
            "Extention3": detailCatalogue?.Extention3,
            "Extention4": detailCatalogue?.Extention4,
            "Extention5": detailCatalogue?.Extention5,
            "Extention6": detailCatalogue?.Extention6,
            "Extention7": detailCatalogue?.Extention7,
            "Extention8": detailCatalogue?.Extention8,
            "Extention9": detailCatalogue?.Extention9,
            "Extention10": detailCatalogue?.Extention10,
            "Extention11": detailCatalogue?.Extention11,
            "Extention12": detailCatalogue?.Extention12,
            "Extention13": detailCatalogue?.Extention13,
            "Extention14": detailCatalogue?.Extention14,
            "Extention15": detailCatalogue?.Extention15,
            "Extention16": detailCatalogue?.Extention16,
            "Extention17": detailCatalogue?.Extention17,
            "Extention18": detailCatalogue?.Extention18,
            "Extention19": detailCatalogue?.Extention19,
            "Extention20": detailCatalogue?.Extention20,
            DisplayMaterialsJson: [...donatedGoods, ...consignmentGoods],
            OID: detailCatalogue?.OID
        }
        try {
            const result = await ApiDisplayMaterials_Edit(body)
            const responeData = result.data
            if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'success',
                );
                handleCloseModalUpdate()
                const bodyDetail = { OID: detailCatalogue?.OID }
                dispatch(fetchDetailCatalogue(bodyDetail))
            } else {
                handleCloseModalUpdate()
                NotifierAlert(
                    3000,
                    `${languageKey('_notification')}`,
                    `${responeData.Message}`,
                    'error',
                );
            }
        } catch (error) {
            handleCloseModalUpdate()
            console.log('handleUpdate', error);
        }
    }, 2000, { leading: true, trailing: false });

    useEffect(() => {
        if (itemUpdate) {
            const isGift = itemUpdate?.OID?.includes('DXTQ');
            onChangeQuantity(isGift ? String(itemUpdate?.ItemQtyGift) : String(itemUpdate?.ItemQtyConsigned));
            onChangeNote(itemUpdate?.Note);
            const linkImgArray = itemUpdate?.Link ? itemUpdate?.Link?.split(';').filter(Boolean) : [];
            setDataImages(linkImgArray)
            setLinkImage(itemUpdate?.Link)
        }
    }, [itemUpdate])

    return (
        <View style={stylesDetail.containerDetail} >
            <View style={stylesDetail.cardProgram}>
                <View style={[stylesDetail.containerHeader, { marginBottom: 8 }]}>
                    <Text style={stylesDetail.header}>{languageKey('_information_general')}</Text>
                    <View style={[styles.bodyStatus, { backgroundColor: detailCatalogue?.ApprovalStatusColor }]}>
                        <Text style={[styles.txtStatus, { color: detailCatalogue?.ApprovalStatusTextColor }]}>
                            {detailCatalogue?.ApprovalStatusName}
                        </Text>
                    </View>
                </View>
                <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_function')}</Text>
                    <Text style={stylesDetail.contentBody}>{detailCatalogue?.EntryName}</Text>
                </View>
                <View style={stylesDetail.containerContentBody}>
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_ct_code')}</Text>
                        <Text style={stylesDetail.contentBody}>{detailCatalogue?.OID}</Text>
                    </View>
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_ct_day')}</Text>
                        <Text style={stylesDetail.contentBody}>{moment(detailCatalogue?.ODate).format('DD/MM/YYYY')}</Text>
                    </View>
                </View>
                <View style={stylesDetail.containerContentBody}>
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_classify')}</Text>
                        <Text style={stylesDetail.contentBody}>{detailCatalogue?.InProgram === 1 ? languageKey('_according_to_the_program') : languageKey('_outside_program')}</Text>
                    </View>
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_request_deadline')}</Text>
                        <Text style={stylesDetail.contentBody}>{moment(detailCatalogue?.RequestDate).format('DD/MM/YYYY')}</Text>
                    </View>
                </View>
                <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_program')}</Text>
                    <Text style={stylesDetail.contentBody}>{detailCatalogue?.ReferenceID} - {detailCatalogue?.PromotionGiftName}</Text>
                </View>
                <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_reason_event_for_gift')}</Text>
                    <Text style={stylesDetail.contentBody}>{detailCatalogue?.ProposedReason} - {moment(detailCatalogue?.EventFromDate).format('DD/MM/YYYY')} -  - {moment(detailCatalogue?.EventToDate).format('DD/MM/YYYY')}</Text>
                </View>
                <View style={stylesDetail.containerContentBody}>
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_donation_costs')}</Text>
                        <Text style={stylesDetail.contentBody}>{detailCatalogue?.GiftAmount.toLocaleString()}</Text>
                    </View>
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_consignment_fees')}</Text>
                        <Text style={stylesDetail.contentBody}>{detailCatalogue?.ConsignmentAmount.toLocaleString()}</Text>
                    </View>
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_total_cost')}</Text>
                        <Text style={stylesDetail.contentBody}>{detailCatalogue?.TotalAmount.toLocaleString()}</Text>
                    </View>
                </View>
                {detailCatalogue?.Content ?
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_proposed_purpose')}</Text>
                        <Text style={stylesDetail.contentBody}>{detailCatalogue?.Content}</Text>
                    </View>
                    : null
                }
                {detailCatalogue?.Note ?
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_note')}</Text>
                        <Text style={stylesDetail.contentBody}>{detailCatalogue?.Note}</Text>
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
            <View style={stylesDetail.cardProgram}>
                <Text style={stylesDetail.headerProgram}>{languageKey('_donated_goods_and_materials')}</Text>
                <FlatList
                    data={detailCatalogue?.ListItemGift}
                    keyExtractor={_keyExtractorGood}
                    renderItem={_renderItemGood}
                />
            </View>
            <View style={stylesDetail.cardProgram}>
                <Text style={stylesDetail.headerProgram}>{languageKey('_consignment_good_and_material')}</Text>
                <FlatList
                    data={detailCatalogue?.ListItemConsignment}
                    keyExtractor={_keyExtractorGood}
                    renderItem={_renderItemGood}
                />
            </View>
            <Modal
                isVisible={isShowModal}
                useNativeDriver={true}
                onBackdropPress={handleCloseModalUpdate}
                onBackButtonPress={handleCloseModalUpdate}
                backdropTransitionOutTiming={450}
                avoidKeyboard={true}
                style={stylesDetail.modal}>
                <View style={stylesDetail.optionsModalContainer}>
                    <View style={stylesDetail.headerModal}>
                        <Text style={stylesDetail.titleModal}>{languageKey('_update_result')}</Text>
                    </View>
                    <ScrollView style={stylesDetail.modalContainer} showsVerticalScrollIndicator={false}>
                        <Text style={stylesDetail.headerInput}>{languageKey('_quantity_of_gifts')}</Text>
                        <TextInput
                            style={stylesDetail.inputContent}
                            onChangeText={onChangeQuantity}
                            value={quantiyGift}
                            multiline={true}
                            keyboardType="numeric"
                            placeholder={languageKey('_enter_content')}
                        />
                        <Text style={stylesDetail.headerInput}>{languageKey('_note')}</Text>
                        <TextInput
                            style={stylesDetail.inputContent}
                            onChangeText={onChangeNote}
                            value={note}
                            numberOfLines={4}
                            multiline={true}
                            placeholder={languageKey('_enter_notes')}
                        />
                        <Text style={stylesDetail.headerBoxImage}>{languageKey('_image')}</Text>
                        <View style={stylesDetail.imgBox}>
                            <AttachManyFile
                                OID={detailCatalogue?.OID}
                                images={images}
                                setDataImages={setDataImages}
                                setLinkImage={setLinkImage}
                                dataLink={linkImage}
                            />
                        </View>
                    </ScrollView>
                    <View style={stylesDetail.footer}>
                        <Button
                            style={stylesDetail.btnCancel}
                            onPress={handleSaveDraft}
                        >
                            <Text style={stylesDetail.txtBtnCancel}>{languageKey('_save')}</Text>
                        </Button>
                        <Button
                            style={stylesDetail.btnConfirm}
                            onPress={handleUpdate}
                        >
                            <Text style={stylesDetail.txtBtnConfirm}>{languageKey('_confirm')}</Text>
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default DetailTab;