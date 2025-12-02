/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useFormik} from 'formik';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import {SvgXml} from 'react-native-svg';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  ScrollView,
  Dimensions,
  Linking,
  Pressable,
} from 'react-native';

import {colors, fontSize} from 'themes';
import {hScale, scale} from '@resolutions';
import {translateLang} from 'store/accLanguages/slide';
import {
  InputDefault,
  AttachManyFile,
  RenderImage,
  CardModalSelect,
  Button,
} from 'components';
import {trash_22} from 'svgImg';

const {width} = Dimensions.get('window');

const ModalProfileCustomer = ({
  setData,
  dataEdit,
  parentID,
  cmpnID,
  disable = false,
  dataex,
}) => {
  console.log('dataEdit', dataEdit);
  const languageKey = useSelector(translateLang);
  const [isShowModalDocument, setIsShowModalDocument] = useState(false);
  const [listDocument, setListDoc] = useState([]);
  console.log('listDocument',listDocument)
  const [linkImage, setLinkImage] = useState('');
  const [images, setDataImages] = useState([]);
  const years = Array.from(
    {length: 100},
    (_, i) => new Date().getFullYear() - i,
  );
  const yearOptions = years?.map(year => ({
    ID: year,
    Name: year.toString(),
  }));
  const [editingIndex, setEditingIndex] = useState(null);
  const [valueYear, setValueYear] = useState(null);
  const openShowModal = () => {
    setIsShowModalDocument(true);
  };

  const closeModal = () => {
    setIsShowModalDocument(false);
    setValueYear(null);
    setLinkImage('');
    setDataImages([]);
    setEditingIndex(null);
    resetForm();
  };

  const initialValues = {
    CategoryType: 'Document',
    Link: '',
    Name: '',
    ID: 0,
    CustomerID: 0,
    Note: '',
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

  const handleEditDocument = (item, index) => {
    setValueYear({ID: item?.Name, Name: item?.Name?.toString()});
    setFieldValue('Note', item?.Note || '');
    const linkArray = item?.Link ? item?.Link?.split(';') : [];
    setDataImages(linkArray);
    setLinkImage(item?.Link);

    setEditingIndex(index);

    setIsShowModalDocument(true);
  };

  const handleAddNewDocument = () => {
    const linkArray =
      typeof linkImage === 'string'
        ? linkImage.split(';')
        : Array.isArray(linkImage)
        ? linkImage
        : [];
    const linkString = linkArray.join(';');

    const newDocument = {
      CategoryType: 'Document',
      Note: values?.Note,
      Link: linkString || '',
      Name: valueYear?.Name,
      CmpnID: cmpnID,
      ID: 0,
      CustomerID: parentID || 0,
    };

    if (editingIndex !== null) {
      const updatedList = [...listDocument];
      updatedList[editingIndex] = newDocument;
      setListDoc(updatedList);
      setData(updatedList);
      resetForm();
      setValueYear(null);
      setLinkImage('');
      setDataImages([]);
      setEditingIndex(null);
    } else {
      setListDoc(prev => [...prev, newDocument]);
      setData(prev => [...prev, newDocument]);
    }

    resetForm();
    // setValueYear(null);
    setLinkImage('');
    setDataImages([]);
    setEditingIndex(null);
    closeModal();
  };

  useEffect(() => {
    if (dataEdit && dataEdit.length > 0) {
      const convertedData = dataEdit.map(item => ({
        ID: item?.ID || 0,
        CustomerID: parentID || 0,
        Name: item?.Name || '',
        Link: item?.Link || '',
        Note: item?.Note || '',
        CmpnID: item?.CmpnID?.toString(),
        CategoryType: 'Document',
        CategoryGeneralID: item?.ID || 0,
      }));
      setListDoc(convertedData);
      setData(convertedData);
    }
  }, [dataEdit]);

  const handleDelete = doc => {
    setListDoc(prev => prev.filter(item => item !== doc));
    setData(prev => prev.filter(item => item !== doc));
  };

  const _keyExtractor = (item, index) => `${item.Name}-${index}`;
  const _renderItem = ({item, index}) => {
    const linkImgArray = item?.Link.split(';').filter(Boolean);
    const imageExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.bmp',
      '.webp',
      '.heic',
    ];
    const imageLinks = linkImgArray.filter(link =>
      imageExtensions.some(ext => link.toLowerCase().endsWith(ext)),
    );
    const otherLinks = linkImgArray.filter(
      link => !imageExtensions.some(ext => link.toLowerCase().endsWith(ext)),
    );

    const handleOpenLink = async url => {
      try {
        let openUrl = url;
        if (1) {
          // Dùng Google Docs Viewer để xem thay vì tải
          openUrl = `https://docs.google.com/gview?embedded=true&chrome=false&rm=minimal&url=${encodeURIComponent(
            url,
          )}`;
        }

        const supported = await Linking.canOpenURL(openUrl);
        if (supported) {
          await Linking.openURL(openUrl);
        } else {
          console.warn("Can't open this URL:", openUrl);
        }
      } catch (error) {
        console.error('Error opening URL:', error);
      }
    };
    return (
      <Button
        style={styles.cardProgram}
        onPress={() => handleEditDocument(item, index)}>
        <View style={[styles.containerHeader, {marginLeft: scale(4)}]}>
          <View>
            <Text style={styles.txtTitleItem}>{languageKey('_year')}</Text>
            <Text style={styles.txtValueItem}>{item?.Name}</Text>
          </View>
          {disable === false && (
            <Button onPress={() => handleDelete(item)}>
              <SvgXml xml={trash_22} />
            </Button>
          )}
        </View>
        {item?.Note && (
          <View style={{marginLeft: scale(4)}}>
            <Text style={styles.txtTitleItem}>{languageKey('_explain')} </Text>
            <Text style={styles.txtValueItem}>{item?.Note} </Text>
          </View>
        )}
        {linkImgArray.length > 0 && (
          <View>
            <Text style={[styles.txtTitleItem, {marginLeft: scale(4)}]}>
              {languageKey(
                imageLinks.length > 0 ? '_image' : '_attached_files',
              )}
            </Text>
            {imageLinks.length > 0 && <RenderImage urls={imageLinks} />}

            {/* Hiển thị file khác */}
            {otherLinks.length > 0 && (
              <View style={{marginTop: scale(8)}}>
                {otherLinks.map((link, index) => (
                  <Pressable key={index} onPress={() => handleOpenLink(link)}>
                    <Text
                      style={{
                        color: 'blue',
                        textDecorationLine: 'underline',
                        marginBottom: scale(4),
                      }}
                      numberOfLines={1}
                      ellipsizeMode="head">
                      {link}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}
      </Button>
    );
  };

  return (
    <View style={styles.container}>
      {/* ⚠️ Thông báo hồ sơ yêu cầu */}
      {Array.isArray(dataex) && dataex?.length > 0 && (
        <Text
          style={{
            color: 'red',
            fontWeight: '600',
            marginBottom: scale(16),
            fontSize: fontSize.size14,
            marginHorizontal: scale(16),
            marginVertical: scale(8),
          }}>
          {`! Hồ sơ yêu cầu: ${dataex.length} (${dataex
            .map(item => item?.Name)
            .join(', ')})`}
        </Text>
      )}

      {disable === false && (
        <Button onPress={openShowModal} style={styles.btnAddDocument}>
          <Text style={styles.txtBtnAdd}>{languageKey('_add')}</Text>
        </Button>
      )}
      {isShowModalDocument && disable === false && (
        <View>
          <Modal
            isVisible={isShowModalDocument}
            useNativeDriver={true}
            onBackdropPress={closeModal}
            onBackButtonPress={closeModal}
            backdropTransitionOutTiming={450}
            avoidKeyboard={true}
            style={styles.modal}>
            <View style={styles.optionsModalContainer}>
              <View style={styles.headerModal}>
                <Text style={styles.titleModal}>
                  {languageKey('_add_archive')}
                </Text>
              </View>
              <ScrollView
                style={styles.modalContainer}
                showsVerticalScrollIndicator={false}>
                <View style={styles.input}>
                  <CardModalSelect
                    title={languageKey('_year')}
                    data={yearOptions}
                    setValue={setValueYear}
                    value={valueYear?.Name}
                    bgColor={'#F9FAFB'}
                  />
                </View>
                <InputDefault
                  name="Note"
                  returnKeyType="next"
                  style={styles.input}
                  value={values?.Note}
                  label={languageKey('_explain')}
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
                <View style={styles.footer}>
                  <Button
                    style={styles.btnFooterModal}
                    onPress={handleAddNewDocument}>
                    <Text style={styles.txtBtnFooterModal}>
                      {languageKey('_confirm')}
                    </Text>
                  </Button>
                </View>
              </ScrollView>
            </View>
          </Modal>
        </View>
      )}
      {listDocument?.length > 0 ? (
        <FlatList
          data={listDocument}
          renderItem={_renderItem}
          keyExtractor={_keyExtractor}
        />
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: scale(4),
            marginBottom: scale(60),
          }}></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    alignContent: 'center',
    paddingVertical: scale(8),
  },
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
  btnAddDocument: {
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
    height: 'auto',
  },
  modalContainer: {
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: scale(1),
    borderBottomColor: colors.graySystem2,
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(8),
    borderTopRightRadius: scale(8),
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
    paddingHorizontal: scale(8),
    paddingVertical: scale(8),
  },
  cardProgramBS: {
    backgroundColor: colors.white,
    marginHorizontal: scale(16),
    marginTop: scale(12),
    borderRadius: scale(8),
    borderWidth: scale(1),
    borderColor: colors.borderColor,
    paddingHorizontal: scale(8),
    paddingVertical: scale(8),
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
    fontSize: fontSize.size14,
    fontWeight: '400',
    lineHeight: scale(24),
    fontFamily: 'Inter-Regular',
    color: '#525252',
  },
  txtValueItem: {
    fontSize: fontSize.size14,
    fontWeight: '500',
    lineHeight: scale(24),
    fontFamily: 'Inter-Medium',
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
  inputDate: {
    marginVertical: scale(4),
  },
});

export default ModalProfileCustomer;
