import React, {useEffect, useState} from 'react';
import {useFormik} from 'formik';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';

import {Button} from '../buttons';
import {colors, fontSize} from '@themes';
import {hScale, scale} from '@resolutions';
import {translateLang} from '@store/accLanguages/slide';
import {InputDefault, CardModalSelect} from '@components';
import {ApiOrders_EditPrices} from '@api';
import moment from 'moment';

const {height} = Dimensions.get('window');

const ModalGoods = ({
  setValueGoods,
  parentID,
  showModalGoods,
  closeModalGoods,
  factorID,
  entryID,
  customerID,
  pricegroupID,
  referenceFactorID,
  referenceEntryID,
  referenceID,
  cmpID,
}) => {
  const languageKey = useSelector(translateLang);
  const {listItems} = useSelector(state => state.Orders);
  const [selectedValueItems, setSelectedValueItems] = useState(null);
  const [selectedValueItemsPrice, setSelectedValueItemsPrice] = useState(null);
  const [totalOrder, setTotalOrder] = useState('0');
  const [valuePriceNoVAT, setValuePriceNoVAT] = useState('0');
  const [amountVAT, setAmountVAT] = useState('0');
  const [valueWeight, setValueWeight] = useState('0');
  const [valueTotalWeight, setValueTotalWeight] = useState('0');
  // console.log('listItems',listItems)
  console.log('cmpID', cmpID);
  const initialValues = {
    OrderQuantity: '1',
    OtherRequirements: '',
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
  });

  const parseProductData = product => ({
    Note: '',
    Extention1: '',
    Extention2: '',
    Extention3: '',
    Extention4: '',
    Extention5: '',
    Extention6: '',
    Extention7: '',
    Extention8: '',
    Extention9: '',
    Extention10: '',
    Extention11: '',
    Extention12: '',
    Extention13: '',
    Extention14: '',
    Extention15: '',
    Extention16: '',
    Extention17: '',
    Extention18: '',
    Extention19: '',
    Extention20: '',
    Type: '',
    ID: 0,
    OID: '',
    ItemCatID: 0,
    ItemID: product?.ItemID || selectedValueItems?.ItemID,
    OrderedQuantity:
      Number(values.OrderQuantity.toString()?.replace(/,/g, '')) || 1,
    ApprovedQuantity:
      Number(values.OrderQuantity.toString()?.replace(/,/g, '')) || 1,
    VATRate: product?.VAT || selectedValueItems?.VAT,
    Price: product?.Price || selectedValueItems?.Price,
    ItemAmount: Number(valuePriceNoVAT) || 0,
    VATAmount: Number(amountVAT || 0),
    TotalAmount: Number(totalOrder || 0),
    OtherRequirements: values?.OtherRequirements,
    WarrantyID: 0,
    FactoryID: 0,
    WarehouseID: 0,
    DeparturePointID: 0,
    GoodsType: 'MTS',
    ItemName: selectedValueItems?.ItemName,
    NetWeight: valueWeight || 0,
    GrossWeight: valueTotalWeight || 0,
    Details: product?.Details || selectedValueItems?.Details || '[]',
    PriceOID: selectedValueItems?.ReferenceID || '',
    Incoterms2ID: selectedValueItems?.Incoterms2ID || 0,
    RouteID: 0,
    ApplyDiscount: 0,
    ApplyPromotion: 0,
    ApplyExhibition: 0,
    ApplyShipping: 0,
    VAT: selectedValueItems?.VA || product?.VAT || 0,
    ItemNo: '',
    POD: 0,
    PriceDate: moment(new Date()).format('YYYY/MM/DD'),
  });
  // console.log('parseProductData', parseProductData);
  const handleAddNewProduct = () => {
    const newItem = parseProductData(selectedValueItemsPrice);
    setValueGoods(prev => [...prev, newItem]);

    setTimeout(() => {
      closeModalGoods();
    }, 100);
  };

  useEffect(() => {
    if (selectedValueItemsPrice && parentID && values?.OrderQuantity) {
      const totalOrder =
        Number(values?.OrderQuantity) * Number(selectedValueItemsPrice?.Price);
      setTotalOrder(totalOrder);
      const priceNoVAT =
        selectedValueItemsPrice?.PriceNotVAT * Number(values?.OrderQuantity);
      setValuePriceNoVAT(priceNoVAT);
      const amountVAT = totalOrder - priceNoVAT;
      setAmountVAT(amountVAT);
      const weight =
        Number(values?.OrderQuantity) *
        Number(selectedValueItemsPrice?.ConversionWeightNet);
      setValueWeight(weight);
      const totalWeight =
        Number(values?.OrderQuantity) *
        Number(selectedValueItemsPrice?.ConversionWeightGross);
      setValueTotalWeight(totalWeight);
    }
  }, [selectedValueItemsPrice, values?.OrderQuantity]);

  const handleGetPriceItemByQuantity = async () => {
    const itemPayload = {
      ...(selectedValueItems || {}),
      ID: selectedValueItems?.ID || 0,
      ItemID: selectedValueItems?.ItemID || 0,
      VAT: selectedValueItems?.VAT || 0,
      ReferenceFactorID: referenceFactorID || '',
      ReferenceEntryID: referenceEntryID || '',
      ReferenceID: referenceID || '',
      ApplyDiscount: 0,
      ApplyPromotion: 0,
      ApplyExhibition: 0,
      ApplyShipping: 0,
      Details: JSON.stringify(selectedValueItems?.Details) || '[]',
      WarrantyID: 0,
      PriceNotVAT: 0,
      GoodsType: 'MTS',
      Note: '',
      OtherRequirements: '',
      ItemText1: '',
      ItemText2: '',
      ItemText3: '',
      PriceDate: new Date(),
      OrderedQuantity: Number(values?.OrderQuantity) || 1,
      ApprovedQuantity: Number(values?.OrderQuantity) || 1,
      Incoterms2ID: 0,
      RouteID: 0,
      POD: 0,
      ItemCatID: 0,
      FactoryID: 0,
      WarehouseID: 0,
      DeparturePointID: 0,
      TotalAmount: selectedValueItems?.Price || 0,
      VATAmount: null,
      UnitID: 197420,
    };

    const body = {
      FactorID: factorID || 0,
      EntryID: entryID || 0,
      CustomerID: customerID || 0,
      PriceGroupID: pricegroupID || 0,
      CmpnID: cmpID?.toString() || '',
      CurrencyType: 'VND',
      ReferenceFactorID: '',
      ReferenceEntryID: '',
      ReferenceID: '',
      Items: [itemPayload],
    };

    console.log('body11111111111', body);
    try {
      const result = await ApiOrders_EditPrices(body);
      const responeData = result.data;
      if (responeData.StatusCode === 200 && responeData.ErrorCode === '0') {
        console.log('responeData111111111111111', responeData);
        setSelectedValueItemsPrice(responeData?.Result[0]);
      } else {
        console.log('responeData2222', responeData);
        setSelectedValueItemsPrice(null);
      }
    } catch (error) {
      console.log('handleGetPriceItemByQuantity', error);
    }
  };

  useEffect(() => {
    if (values?.OrderQuantity) {
      handleGetPriceItemByQuantity();
    }
  }, [values?.OrderQuantity, selectedValueItems]);

  return (
    <View>
      {showModalGoods && (
        <View>
          <Modal
            isVisible={showModalGoods}
            useNativeDriver={true}
            onBackdropPress={closeModalGoods}
            onBackButtonPress={closeModalGoods}
            backdropTransitionOutTiming={450}
            avoidKeyboard={true}
            style={styles.modal}>
            <View style={styles.optionsModalContainer}>
              <View style={styles.headerModal}>
                <Text style={styles.titleModal}>
                  {languageKey('_add_products')}
                </Text>
              </View>
              <ScrollView
                style={styles.modalContainer}
                showsVerticalScrollIndicator={false}>
                <View style={styles.input}>
                  <CardModalSelect
                    title={languageKey('_product')}
                    data={listItems}
                    setValue={setSelectedValueItems}
                    value={
                      selectedValueItems
                        ? selectedValueItems?.SKU +
                          ' - ' +
                          selectedValueItems?.ItemName
                        : null
                    }
                    bgColor={'#F9FAFB'}
                    itemOrder={true}
                    //\ multiple={true}
                    // titleInventory={`${languageKey('_available')}:${totalOrder ? totalOrder[0]?.SaleQuantity : 0}`}
                  />
                </View>
                <InputDefault
                  name="OrderQuantity"
                  returnKeyType="next"
                  style={styles.input}
                  value={values?.OrderQuantity}
                  label={languageKey('_quantity')}
                  isEdit={true}
                  placeholderInput={true}
                  labelHolder={'1'}
                  bgColor={'#F9FAFB'}
                  keyboardType={'numbers-and-punctuation'}
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />
                <View style={styles.inputAuto}>
                  <View style={styles.inputRead}>
                    <Text style={styles.txtHeaderInputView}>
                      {languageKey('_unit_price')}
                    </Text>
                    <Text
                      style={styles.inputView}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {selectedValueItemsPrice
                        ? Number(selectedValueItemsPrice?.Price).toLocaleString(
                            'en',
                          )
                        : 0}
                    </Text>
                  </View>
                  <View style={styles.inputRead}>
                    <Text style={styles.txtHeaderInputView}>
                      {languageKey('_money')}
                    </Text>
                    <Text
                      style={styles.inputView}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {selectedValueItemsPrice
                        ? Number(
                            selectedValueItemsPrice?.TotalAmount,
                          ).toLocaleString('vi-VN')
                        : 0}
                    </Text>
                  </View>
                </View>
                <InputDefault
                  name="OtherRequirements"
                  returnKeyType="next"
                  style={styles.input}
                  value={values?.OtherRequirements}
                  label={languageKey('_other_requirements')}
                  isEdit={true}
                  placeholderInput={true}
                  labelHolder={languageKey('_enter_content')}
                  bgColor={'#F9FAFB'}
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />
              </ScrollView>
              <View style={styles.footer}>
                <Button
                  style={styles.btnFooterCancel}
                  onPress={closeModalGoods}>
                  <Text style={styles.txtBtnFooterCancel}>
                    {languageKey('_cancel')}
                  </Text>
                </Button>
                <Button
                  style={styles.btnFooterApproval}
                  onPress={() => {
                    handleGetPriceItemByQuantity();
                    handleAddNewProduct();
                  }}>
                  <Text style={styles.txtBtnFooterApproval}>
                    {languageKey('_confirm')}
                  </Text>
                </Button>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  txtBtnAdd: {
    color: colors.blue,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    fontSize: fontSize.size14,
  },
  label: {
    color: colors.black,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    fontSize: fontSize.size14,
    lineHeight: scale(22),
    marginHorizontal: scale(16),
    marginTop: scale(4),
  },
  btnAddContact: {
    borderWidth: scale(1),
    borderColor: colors.blue,
    borderRadius: scale(12),
    height: hScale(38),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scale(12),
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  optionsModalContainer: {
    height: height / 2.22,
  },
  modalContainer: {
    overflow: 'hidden',
    backgroundColor: colors.white,
    maxHeight: height / 2.3,
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: scale(1),
    borderBottomColor: colors.graySystem2,
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(12),
    borderTopRightRadius: scale(12),
    paddingVertical: scale(10),
    paddingHorizontal: scale(12),
  },
  titleModal: {
    fontFamily: 'Inter-SemiBold',
    fontSize: fontSize.size16,
    lineHeight: scale(24),
    fontWeight: '600',
    color: colors.black,
    flex: 1,
    textAlign: 'center',
  },
  btnFooterModal: {
    alignItems: 'center',
    backgroundColor: colors.blue,
    borderRadius: scale(12),
    height: hScale(38),
    paddingVertical: scale(Platform.OS === 'android' ? 6 : 8),
    marginTop: scale(12),
    marginBottom: scale(12),
    marginHorizontal: scale(12),
  },
  txtBtnFooterModal: {
    color: colors.white,
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(22),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scale(12),
    marginTop: scale(12),
    backgroundColor: colors.white,
  },
  txtItem: {
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    fontSize: fontSize.size14,
    lineHeight: scale(22),
    color: colors.black,
  },
  txtDescription: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    fontSize: fontSize.size12,
    lineHeight: scale(18),
    color: '#6B6F80',
  },
  input: {
    marginHorizontal: scale(12),
    marginVertical: scale(4),
  },
  cardProgram: {
    backgroundColor: colors.white,
    marginHorizontal: scale(12),
    marginTop: scale(12),
    borderRadius: scale(8),
    borderWidth: scale(1),
    borderColor: colors.borderColor,
  },
  itemBody_two: {
    flexDirection: 'row',
    borderRadius: scale(12),
    padding: scale(8),
  },
  containerItem: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerStatus: {
    flexDirection: 'row',
  },
  txtTitleItem: {
    fontSize: fontSize.size16,
    fontWeight: '600',
    lineHeight: scale(24),
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
  },
  bodyStatus: {
    borderRadius: scale(4),
    paddingHorizontal: scale(6),
    paddingVertical: scale(2),
    marginRight: scale(8),
    width: 'auto',
  },
  txtStatus: {
    fontSize: fontSize.size12,
    fontWeight: '500',
    lineHeight: scale(18),
    fontFamily: 'Inter-Medium',
  },
  contentBody: {
    fontSize: fontSize.size14,
    fontWeight: '400',
    lineHeight: scale(22),
    fontFamily: 'Inter-Regular',
    color: colors.black,
    marginLeft: scale(4),
    overflow: 'hidden',
    width: '90%',
  },
  containerBody: {
    flexDirection: 'row',
    marginHorizontal: scale(8),
    alignItems: 'center',
    marginBottom: scale(4),
  },
  inputAuto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: scale(4),
  },
  inputRead: {
    flex: 1,
    marginHorizontal: scale(12),
  },
  txtHeaderInputView: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    lineHeight: scale(22),
  },
  inputView: {
    borderRadius: scale(8),
    paddingLeft: scale(10),
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
    marginTop: scale(8),
    borderWidth: scale(1),
    borderColor: '#D1D3DB',
    backgroundColor: '#E5E7EB',
    paddingVertical: scale(7),
    color: colors.black,
  },
  footer: {
    backgroundColor: colors.white,
    borderTopColor: colors.borderColor,
    borderTopWidth: scale(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    paddingBottom: scale(Platform.OS === 'android' ? 8 : 24),
  },
  btnFooterCancel: {
    flex: 1,
    borderWidth: scale(1),
    borderColor: colors.borderColor,
    height: hScale(38),
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(4),
  },
  txtBtnFooterCancel: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(22),
  },
  btnFooterApproval: {
    flex: 1,
    backgroundColor: colors.blue,
    height: hScale(38),
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: scale(4),
  },
  txtBtnFooterApproval: {
    color: colors.white,
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(22),
  },
});

export default ModalGoods;
