import React, {useEffect, useState} from 'react';
import {useFormik} from 'formik';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {SvgXml} from 'react-native-svg';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';

import {Button} from '../buttons';
import {colors, fontSize} from 'themes';
import {hScale, scale} from '@resolutions';
import {translateLang} from 'store/accLanguages/slide';
import {
  InputDefault,
  CardModalSelect,
  AttachManyFile,
  RenderImage,
} from 'components';
import {close_red, close_white, trash} from 'svgImg';
import {fetchListReference} from 'store/accHand_Over_Doc/thunk';

const {height, width} = Dimensions.get('window');

const ModalHandOverDocument = ({
  setValue,
  dataEdit,
  parentID,
  showModal,
  closeModal,
}) => {
  const languageKey = useSelector(translateLang);
  const dispatch = useDispatch();
  const {listCustomerByUserID} = useSelector(state => state.Login);
  const {listDocumentTypes, listReference} = useSelector(
    state => state.HandOverDoc,
  );
  const [listDocument, setListDocument] = useState([]);
  const [valueDocumentType, setValueDocumentType] = useState(null);
  const [valueReference, setValueReference] = useState(null);
  const [valueCustomer, setValueCustomer] = useState(null);
  const [linkImage, setLinkImage] = useState('');
  const [images, setDataImages] = useState([]);

  const initialValues = {
    OID: parentID || '',
    ID: 0,
    DocumentTypeID: 0,
    ReferenceID: '',
    Note: '',
    Link: '',
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

  const handleAddNewDoc = () => {
    const linkArray =
      typeof linkImage === 'string'
        ? linkImage.split(';')
        : Array.isArray(linkImage)
        ? linkImage
        : [];
    const linkString = linkArray.join(';');
    const document = {
      OID: '',
      ID: 0,
      CustomerID: valueCustomer?.ID || 0,
      CustomerName: valueCustomer?.Name || '',
      DocumentTypeID: valueDocumentType?.ID || 0,
      ReferenceID: valueReference?.OID || '',
      Note: values?.Note || '',
      Link: linkString || '',
      NumberOfOriginals: Number(values?.NumberOfOriginals) || 0,
      NumberOfCopies: Number(values?.NumberOfCopies) || 0,
    };
    setListDocument(prevDocument => [...prevDocument, document]);
    setValue(prevDocument => [...prevDocument, document]);
    setValueDocumentType(null);
    setValueReference(null);
    setValueCustomer(null);
    setDataImages([]);
    setLinkImage('');
    resetForm();
    closeModal();
  };

  const handleDelete = itemToDelete => {
    setListDocument(prevDoc =>
      prevDoc.filter(item => item.CustomerID !== itemToDelete.CustomerID),
    );
    setValue(prevDoc =>
      prevDoc.filter(item => item.CustomerID !== itemToDelete.CustomerID),
    );
  };

  useEffect(() => {
    if (dataEdit && dataEdit.length > 0) {
      const convertedData = dataEdit.map(item => ({
        OID: item.OID,
        Note: item.Note,
        Link: item?.Link,
        ID: item.ID,
        CustomerID: item?.CustomerID,
        CustomerName: item?.CustomerName,
        NumberOfCopies: item?.NumberOfCopies,
        NumberOfOriginals: item?.NumberOfOriginals,
        DocumentTypeID: item.DocumentTypeID,
        ReferenceID: item.ReferenceID,
      }));
      setListDocument(convertedData);
      setValue(convertedData);
    }
  }, [dataEdit]);

  const _keyExtractor = (item, index) => `${item.CustomerID}-${index}`;
  const _renderItem = ({item}) => {
    const documentType = listDocumentTypes?.find(
      c => c.ID === item?.DocumentTypeID,
    );
    const itemLinks = item?.Link.split(';').filter(Boolean);

    return (
      <View style={styles.cardProgramItem}>
        <View style={styles.cardCustomer}>
          <View style={styles.containerHeader}>
            <View style={styles.containerText}>
              <Text style={styles.txtHeader}>{languageKey('_customer')}</Text>
              <Text
                style={styles.content}
                numberOfLines={2}
                ellipsizeMode="tail">
                {item?.CustomerName}
              </Text>
            </View>
            <Button onPress={() => handleDelete(item)}>
              <SvgXml xml={trash} />
            </Button>
          </View>
          <View style={styles.containerHeader}>
            <View style={styles.containerText}>
              <Text style={styles.txtHeader}>
                {languageKey('_document_type')}
              </Text>
              <Text style={styles.content}>{documentType?.Name}</Text>
            </View>
            <View style={styles.containerText}>
              <Text style={styles.txtHeader}>
                {languageKey('_document_number')}
              </Text>
              <Text style={styles.content}>{item?.ReferenceID}</Text>
            </View>
          </View>
          <View style={styles.containerHeader}>
            <View style={styles.containerText}>
              <Text style={styles.txtHeader}>
                {languageKey('_original_number')}
              </Text>
              <Text style={styles.content}>{item?.NumberOfOriginals}</Text>
            </View>
            <View style={styles.containerText}>
              <Text style={styles.txtHeader}>
                {languageKey('_number_of_coppies')}
              </Text>
              <Text style={styles.content}>{item?.NumberOfCopies}</Text>
            </View>
          </View>
          {itemLinks.length > 0 && (
            <View>
              <Text style={styles.txtHeaderBody}>{languageKey('_image')}</Text>
              <RenderImage urls={itemLinks} />
            </View>
          )}
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (valueDocumentType && valueCustomer) {
      const body = {
        ID: valueDocumentType?.ID,
        CustomerID: valueCustomer?.ID,
      };
      dispatch(fetchListReference(body));
    }
  }, [valueDocumentType, valueCustomer]);

  const selectedCustomerIDs = listDocument.map(doc => doc.CustomerID);

  const filteredCustomers = listCustomerByUserID.filter(
    customer => !selectedCustomerIDs.includes(customer.ID),
  );

  return (
    <View>
      {showModal && (
        <View>
          <Modal
            isVisible={showModal}
            useNativeDriver={true}
            onBackdropPress={closeModal}
            onBackButtonPress={closeModal}
            backdropTransitionOutTiming={450}
            avoidKeyboard={true}
            style={styles.modal}>
            <View style={styles.optionsModalContainer}>
              <View style={styles.headerModal}>
                <View style={styles.btnClose}>
                  <SvgXml xml={close_white} />
                </View>
                <Text style={styles.titleModal}>
                  {languageKey('_add_document')}
                </Text>
                <Button onPress={closeModal} style={styles.btnClose}>
                  <SvgXml xml={close_red} />
                </Button>
              </View>
              <ScrollView
                style={styles.modalContainer}
                showsVerticalScrollIndicator={false}>
                <View style={styles.input}>
                  <CardModalSelect
                    title={languageKey('_customer')}
                    data={filteredCustomers}
                    setValue={setValueCustomer}
                    value={valueCustomer?.Name}
                    bgColor={'#FAFAFA'}
                  />
                </View>
                <View style={styles.input}>
                  <CardModalSelect
                    title={languageKey('_document_type')}
                    data={listDocumentTypes}
                    setValue={setValueDocumentType}
                    value={valueDocumentType?.Name}
                    bgColor={'#F9FAFB'}
                  />
                </View>
                <View style={styles.input}>
                  <CardModalSelect
                    title={languageKey('_document_number')}
                    data={listReference}
                    setValue={setValueReference}
                    value={valueReference?.OID}
                    bgColor={'#F9FAFB'}
                  />
                </View>
                <View style={styles.inputAuto}>
                  <InputDefault
                    name="NumberOfOriginals"
                    returnKeyType="next"
                    style={styles.widthInput}
                    value={values?.NumberOfOriginals}
                    label={languageKey('_original_number')}
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
                  <InputDefault
                    name="NumberOfCopies"
                    returnKeyType="next"
                    style={styles.widthInput}
                    value={values?.NumberOfCopies}
                    label={languageKey('_number_of_coppies')}
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
                </View>
                <InputDefault
                  name="Note"
                  returnKeyType="next"
                  style={styles.input}
                  value={values?.Note}
                  label={languageKey('_note')}
                  isEdit={true}
                  placeholderInput={true}
                  labelHolder={languageKey('_enter_notes')}
                  bgColor={'#F9FAFB'}
                  {...{
                    touched,
                    errors,
                    handleBlur,
                    handleChange,
                    setFieldValue,
                  }}
                />
                <Text style={styles.headerBoxImage}>
                  {languageKey('_image')}
                </Text>
                <View style={styles.imgBox}>
                  <AttachManyFile
                    OID={parentID}
                    images={images}
                    setDataImages={setDataImages}
                    setLinkImage={setLinkImage}
                    dataLink={linkImage}
                  />
                </View>
              </ScrollView>
              <View style={styles.footer}>
                <Button style={styles.btnFooterCancel} onPress={closeModal}>
                  <Text style={styles.txtBtnFooterCancel}>
                    {languageKey('_cancel')}
                  </Text>
                </Button>
                <Button
                  style={styles.btnFooterApproval}
                  onPress={handleAddNewDoc}>
                  <Text style={styles.txtBtnFooterApproval}>
                    {languageKey('_add')}
                  </Text>
                </Button>
              </View>
            </View>
          </Modal>
        </View>
      )}
      {listDocument?.length > 0 ? (
        <View style={styles.card}>
          <FlatList
            data={listDocument}
            renderItem={_renderItem}
            keyExtractor={_keyExtractor}
            contentContainerStyle={styles.containerFlat}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  optionsModal: {
    margin: 0,
    justifyContent: 'flex-end',
    borderTopRightRadius: scale(8),
    borderTopLeftRadius: scale(8),
  },
  optionsModalContainer: {
    backgroundColor: colors.white,
    height: 'auto',
    borderTopRightRadius: scale(12),
    borderTopLeftRadius: scale(12),
  },
  modalContainer: {
    overflow: 'hidden',
    backgroundColor: colors.white,
    maxHeight: height / 1.7,
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
  input: {
    marginHorizontal: scale(12),
    marginVertical: scale(4),
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  footer: {
    backgroundColor: colors.white,
    borderTopColor: colors.borderColor,
    borderTopWidth: scale(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
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
  containerBodyCard: {
    marginVertical: scale(8),
    flex: 1,
  },
  contentCard: {
    marginBottom: scale(4),
    flexDirection: 'row',
    flex: 1,
  },
  txtHeaderBody: {
    color: '#6B7280',
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
  },
  card: {
    backgroundColor: colors.white,
    paddingBottom: scale(8),
  },
  containerFlat: {
    paddingBottom: scale(100),
  },
  containerTableFile: {
    marginBottom: scale(8),
    paddingHorizontal: scale(12),
  },
  txtHeaderDoc: {
    color: '#6B7280',
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
    marginBottom: scale(4),
  },
  header: {
    fontSize: fontSize.size16,
    fontWeight: '600',
    lineHeight: scale(24),
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
    marginTop: scale(12),
    marginHorizontal: scale(12),
    marginBottom: scale(4),
  },
  cardProgramItem: {
    backgroundColor: colors.white,
    paddingHorizontal: scale(12),
  },
  cardCustomer: {
    backgroundColor: colors.white,
    paddingHorizontal: scale(8),
    borderWidth: scale(1),
    borderColor: colors.borderColor,
    borderRadius: scale(8),
    marginTop: scale(8),
    paddingVertical: scale(8),
  },
  txtHeaderCard: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(18),
  },
  contentCard: {
    marginBottom: scale(8),
  },
  txtHeaderBody: {
    color: '#6B7280',
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
  },
  contentBody: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    lineHeight: scale(22),
  },
  headerBoxImage: {
    fontSize: fontSize.size14,
    lineHeight: scale(22),
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: colors.black,
    marginLeft: scale(12),
    marginTop: scale(8),
  },
  imgBox: {
    marginLeft: scale(12),
  },
  image: {
    width: width / 4 - 24,
    height: hScale(82),
    borderRadius: scale(12),
    marginHorizontal: scale(4),
    marginTop: scale(8),
  },
  inputAuto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: scale(4),
  },
  widthInput: {
    flex: 1,
    marginHorizontal: scale(12),
  },
  containerText: {
    flex: 1,
    marginBottom: scale(8),
  },
  content: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    lineHeight: scale(22),
    width: '90%',
    overflow: 'hidden',
  },
  txtHeader: {
    color: '#6B7280',
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
  },
});

export default ModalHandOverDocument;
