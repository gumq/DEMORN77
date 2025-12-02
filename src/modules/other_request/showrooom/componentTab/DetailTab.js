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

const DetailTab = ({ detailShowroom }) => {
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
        return detailShowroom?.Link
            ? detailShowroom.Link.split(';').filter(Boolean)
            : [];
    }, [detailShowroom?.Link]);

    const linkImgArraySale = useMemo(() => {
        return detailShowroom?.SalesLink
            ? detailShowroom.SalesLink.split(';').filter(Boolean)
            : [];
    }, [detailShowroom?.SalesLink]);

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
                    {item?.ItemType ? (
                        <View style={stylesDetail.contentCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_product_type')}</Text>
                            <Text style={stylesDetail.contentBody}>{item?.ItemType === 'GIFT' ? languageKey('_gift') : languageKey('_consignment')}</Text>
                        </View>
                    ) : null}
                    {item?.ItemQty ? (
                        <View style={stylesDetail.contentCard}>
                            <Text style={stylesDetail.txtHeaderBody}>{languageKey('_quantity')}</Text>
                            <Text style={stylesDetail.contentBody}>{item?.ItemQty}</Text>
                        </View>
                    ) : null}

                </View>
                <View style={stylesDetail.containerContentBody}>
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
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_note')}</Text>
                    <Text style={stylesDetail.contentBody}>{item?.Note}</Text>
                </View>
            </Button>
        );
    };

    const groupItemsByCustomer = (items, entryID) => {
        return detailShowroom?.Customer?.map(customer => {
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
        if (detailShowroom) {
            const donated = groupItemsByCustomer(detailShowroom?.ListItemGift, 'RequestGifts');
            const consignment = groupItemsByCustomer(detailShowroom?.ListItemConsignment, 'RequestConsignment');

            setDonatedGoods(donated);
            setConsignmentGoods(consignment);
        }
    }, [detailShowroom]);

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
            FactorID: detailShowroom?.FactorID || '',
            EntryID: detailShowroom?.EntryID || "",
            Odate: detailShowroom?.ODate,
            SAPID: detailShowroom?.SAPID,
            LemonID: detailShowroom?.LemonID,
            ReferenceID: detailShowroom?.ReferenceID,
            InProgram: detailShowroom?.InProgram,
            OutProgram: detailShowroom?.OutProgram,
            EventTypeID: detailShowroom?.EventTypeID,
            RequestUserID: detailShowroom?.RequestUserID,
            RequestDate: detailShowroom?.RequestDate,
            Content: detailShowroom?.Content || "",
            Link: detailShowroom?.Link || "",
            Note: detailShowroom?.Note || '',
            GiftAmount: detailShowroom?.GiftAmount || 0,
            ConsignmentAmount: detailShowroom?.ConsignmentAmount || 0,
            TotalAmount: detailShowroom?.TotalAmount || 0,
            "Extention1": detailShowroom?.Extention1,
            "Extention2": detailShowroom?.Extention2,
            "Extention3": detailShowroom?.Extention3,
            "Extention4": detailShowroom?.Extention4,
            "Extention5": detailShowroom?.Extention5,
            "Extention6": detailShowroom?.Extention6,
            "Extention7": detailShowroom?.Extention7,
            "Extention8": detailShowroom?.Extention8,
            "Extention9": detailShowroom?.Extention9,
            "Extention10": detailShowroom?.Extention10,
            "Extention11": detailShowroom?.Extention11,
            "Extention12": detailShowroom?.Extention12,
            "Extention13": detailShowroom?.Extention13,
            "Extention14": detailShowroom?.Extention14,
            "Extention15": detailShowroom?.Extention15,
            "Extention16": detailShowroom?.Extention16,
            "Extention17": detailShowroom?.Extention17,
            "Extention18": detailShowroom?.Extention18,
            "Extention19": detailShowroom?.Extention19,
            "Extention20": detailShowroom?.Extention20,
            DisplayMaterialsJson: [...donatedGoods, ...consignmentGoods],
            OID: detailShowroom?.OID
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
                const bodyDetail = { OID: detailShowroom?.OID }
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
                    <View style={[styles.bodyStatus, { backgroundColor: detailShowroom?.ApprovalStatusColor }]}>
                        <Text style={[styles.txtStatus, { color: detailShowroom?.ApprovalStatusTextColor }]}>
                            {detailShowroom?.ApprovalStatusName}
                        </Text>
                    </View>
                </View>
                <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_function')}</Text>
                    <Text style={stylesDetail.contentBody}>{detailShowroom?.EntryName}</Text>
                </View>
                <View style={stylesDetail.containerContentBody}>
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_ct_code')}</Text>
                        <Text style={stylesDetail.contentBody}>{detailShowroom?.OID}</Text>
                    </View>
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_ct_day')}</Text>
                        <Text style={stylesDetail.contentBody}>{moment(detailShowroom?.ODate).format('DD/MM/YYYY')}</Text>
                    </View>
                </View>
                <View style={stylesDetail.containerContentBody}>
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_classify')}</Text>
                        <Text style={stylesDetail.contentBody}>{detailShowroom?.InProgram === 1 ? languageKey('_according_to_the_program') : languageKey('_outside_program')}</Text>
                    </View>
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_request_deadline')}</Text>
                        <Text style={stylesDetail.contentBody}>{moment(detailShowroom?.RequestDate).format('DD/MM/YYYY')}</Text>
                    </View>
                </View>
                <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_program')}</Text>
                    <Text style={stylesDetail.contentBody}>{detailShowroom?.ReferenceID} - {detailShowroom?.PromotionGiftName}</Text>
                </View>
                <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_customer')}</Text>
                    <Text style={stylesDetail.contentBody}>{detailShowroom?.CustomerName} </Text>
                </View>
                <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_address')}</Text>
                    <Text style={stylesDetail.contentBody}>{detailShowroom?.FullAddress}</Text>
                </View>
                <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_business_partner_type')}</Text>
                    <Text style={stylesDetail.contentBody}>{detailShowroom?.PartnerTypeName}</Text>
                </View>
                <View style={stylesDetail.containerContentBody}>
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_phone')}</Text>
                        <Text style={stylesDetail.contentBody}>{detailShowroom?.Phone}</Text>
                    </View>
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_total_cost')}</Text>
                        <Text style={stylesDetail.contentBody}>{detailShowroom?.TotalAmount.toLocaleString()}</Text>
                    </View>
                </View>
                {detailShowroom?.Content ?
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_proposed_purpose')}</Text>
                        <Text style={stylesDetail.contentBody}>{detailShowroom?.Content}</Text>
                    </View>
                    : null
                }
                {detailShowroom?.Note ?
                    <View style={stylesDetail.containerBodyCard}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_note')}</Text>
                        <Text style={stylesDetail.contentBody}>{detailShowroom?.Note}</Text>
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
            <View style={styles.cardProgram}>
                <View style={[stylesDetail.containerHeader, { marginBottom: 8 }]}>
                    <Text style={stylesDetail.header}>{languageKey('_potential_analysis')}</Text>
                </View>
                <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_current_sales')}</Text>
                    <Text style={stylesDetail.contentBody}>{detailShowroom?.SalesCurrent}</Text>
                </View>
                <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_traffic_volumne/minute')}</Text>
                    <Text style={stylesDetail.contentBody}>{detailShowroom?.SalesVolume}</Text>
                </View>
                <View style={stylesDetail.containerBodyCard}>
                    <Text style={stylesDetail.txtHeaderBody}>{languageKey('_location_potential_analysis')}</Text>
                    <Text style={stylesDetail.contentBody}>{detailShowroom?.SalesContent}</Text>
                </View>
                {linkImgArraySale.length > 0 && (
                    <View style={[stylesDetail.containerTableFileItem, { marginBottom: 8 }]}>
                        <Text style={stylesDetail.txtHeaderBody}>{languageKey('_image')}</Text>
                        <RenderImage urls={linkImgArraySale} />
                    </View>
                )}
            </View>
            <View style={stylesDetail.cardProgram}>
                <Text style={stylesDetail.headerProgram}>{languageKey('_recommended_list')}</Text>
                <FlatList
                    data={detailShowroom?.ListItems}
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
                                OID={detailShowroom?.OID}
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