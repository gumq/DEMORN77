/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useEffect, useMemo, useRef, useState, memo} from 'react';
import RNFS from 'react-native-fs';
import Modal from 'react-native-modal';
import {SvgXml} from 'react-native-svg';
import {useSelector} from 'react-redux';
import DocumentPicker from 'react-native-document-picker';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import {colors, fontSize} from '@themes';
import {ApiUploadFile} from '@api';
import {hScale, scale} from '@resolutions';
import {Button} from '@components/buttons';
import {translateLang} from '@store/accLanguages/slide';
import {
  uploadFile_white,
  docFile,
  close_white,
  close_red,
  viewFile_gray,
  downFile,
  trash,
} from '@svgImg';

import ImagePicker from 'react-native-image-crop-picker';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

const ModalProfileCustomer = ({
  setData,
  dataEdit,
  parentID,
  dataex,
  disable = false,
  fhm = false,
}) => {
  const languageKey = useSelector(translateLang);
  const [files, setFiles] = useState(null);
  const [filesSubmit, setFilesFormSubmit] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isShowModalViewFile, setIsShowModalViewFile] = useState(false);
  const handleCloseModal = () => setIsShowModalViewFile(false);
  const nameById = useMemo(() => {
    const map = {};
    (Array.isArray(dataex) ? dataex : []).forEach(it => {
      map[String(it.ID)] = it.Name || '';
    });
    return map;
  }, [JSON.stringify(dataex || [])]);

  const [visibleUploadModal, setVisibleUploadModal] = useState(false);
  const uploadTargetRef = useRef(null);
  const handleOpenUploadModal = item => {
    uploadTargetRef.current = item;
    setVisibleUploadModal(true);
  };
  const handleCloseModalUpload = () => {
    uploadTargetRef.current = null;
    setVisibleUploadModal(false);
  };

  const itemsForList = useMemo(() => {
    if (Array.isArray(dataex) && dataex.length > 0) {
      return dataex.map(it => ({ID: it.ID, Name: it.Name || ''}));
    }

    const ids = Array.isArray(dataEdit)
      ? Array.from(
          new Set(
            dataEdit
              .filter(x => x && typeof x.CategoryGeneralID !== 'undefined')
              .map(x => x.CategoryGeneralID),
          ),
        )
      : [];

    return ids.map(id => ({
      ID: id,
      Name: nameById[String(id)] || 'Tài liệu',
    }));
    // phụ thuộc theo NỘI DUNG thay vì tham chiếu
  }, [JSON.stringify(dataex || []), JSON.stringify(dataEdit || []), nameById]);

  // Gom link theo CategoryGeneralID (string)
  const groupedFiles = useMemo(() => {
    return (filesSubmit || []).reduce((acc, item) => {
      const links = (item?.Link || '')
        .split(';')
        .filter(Boolean)
        .map(link => ({Content: link.split('/').pop() || '', Link: link}));

      const key = String(item.CategoryGeneralID);
      if (!acc[key]) acc[key] = [];
      acc[key] = acc[key].concat(links);
      return acc;
    }, {});
  }, [filesSubmit]);

  const handleViewFile = fileUrl => {
    if (fileUrl) {
      Linking.openURL(fileUrl).catch(() =>
        Alert.alert('Error', languageKey('_cannot_open_file')),
      );
    } else {
      Alert.alert('Error', languageKey('_file_error'));
    }
  };

  const handleDownloadFile = async url => {
    try {
      const fileName = url.split('/').pop() || 'download';
      const downloadPath =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/${fileName}`
          : `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.downloadFile({fromUrl: url, toFile: downloadPath}).promise;

      Alert.alert(
        'Download',
        `${languageKey('_download_success')} ${downloadPath}`,
      );

      if (Platform.OS === 'android') {
        Linking.openURL(`file://${downloadPath}`);
      }
    } catch (e) {
      Alert.alert(
        languageKey('_download_failed'),
        languageKey('_error_download_file'),
      );
    }
  };

  const handleShowModal = categoryId => {
    setSelectedFiles(groupedFiles[String(categoryId)] || []);
    setIsShowModalViewFile(true);
  };
  // options chung
  const imagePickerOptions = {
    cropping: false,
    compressImageQuality: 0.7,
    includeBase64: false,
  };

  // Chụp hình
  const takePhoto = async () => {
    try {
      const res = await ImagePicker.openCamera({
        width: 1200,
        height: 1600,
        compressImageQuality: 0.7,
        cropping: false,
      });

      if (res) {
        const fileObj = {
          uri:
            Platform.OS === 'android'
              ? res.path
              : res.path.replace('file://', ''),
          name: res.filename || `photo_${Date.now()}.jpg`,
          type: res.mime || 'image/jpeg',
        };

        setFiles({
          CategoryGeneralID: uploadTargetRef.current?.ID,
          Name: uploadTargetRef.current?.Name,
          Link: [fileObj],
        });
        uploadTargetRef.current = null;
        handleCloseModalUpload();
      }
    } catch (err) {
      if (err?.code && err.code === 'E_PICKER_CANCELLED') return;
      console.log('takePhoto error', err);
    }
  };

  const getImageGallery = async () => {
    try {
      // handleCloseModalUpload();

      const res = await ImagePicker.openPicker({
        multiple: true,
        compressImageQuality: 0.7,
        cropping: false,
      });

      let assets = Array.isArray(res) ? res : [res];

      const docs = assets.map(file => ({
        uri:
          Platform.OS === 'android'
            ? file.path
            : file.path.replace('file://', ''),
        name: file.filename || file.path.split('/').pop(),
        type: file.mime || 'image/jpeg',
      }));

      setFiles({
        CategoryGeneralID: uploadTargetRef.current?.ID,
        Name: uploadTargetRef.current?.Name,
        Link: docs,
      });
      handleCloseModalUpload();
      uploadTargetRef.current = null;
    } catch (err) {
      if (err?.code && err.code === 'E_PICKER_CANCELLED') return;
      console.log('getImageGallery error', err);
    }
  };

  const handleChooseFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      setFiles({
        CategoryGeneralID: uploadTargetRef.current?.ID,
        Name: uploadTargetRef.current?.Name,
        Link: res,
      });
      uploadTargetRef.current = null;
      handleCloseModalUpload();
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) console.log('Chọn file lỗi', err);
    }
  };

  // const handleUploadFile = async item => {
  //   try {
  //     const res = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.allFiles],
  //       allowMultiSelection: true,
  //     });
  //     const dataFile = {
  //       CategoryGeneralID: item?.ID,
  //       Name: item?.Name,
  //       Link: res, // tạm giữ file objects để upload
  //     };
  //     setFiles(dataFile);
  //   } catch (err) {
  //     if (!DocumentPicker.isCancel(err)) console.log('Lỗi:', err);
  //   }
  // };

  // Sau khi chọn file -> gọi API upload -> gộp kết quả vào filesSubmit
  const handleSelectFileAndSubmit = () => {
    const OIDTime = new Date().getTime();
    const formData = new FormData();
    formData.append('OID', String(OIDTime));
    formData.append('EntryID', 'SmartLighting');
    formData.append('FactorID', 'Category');
    formData.append('Name', files?.Name || 'Chứng từ mới');
    formData.append('Note', 'Ghi chú');

    if (files?.Link?.length > 0) {
      files.Link.forEach(file => {
        const document = {
          uri: file.uri ? file.uri : file.path,
          name: file.name ? file.name : file.path?.split('/').pop() || 'file',
          type: file.type ? file.type : file.mime || 'application/octet-stream',
        };
        formData.append('File', document);
      });

      ApiUploadFile(formData)
        .then(val => {
          const result = val.status ? val.data?.Result || [] : [];
          if (result.length > 0) {
            const newLinks = result.map(f => f.LinkFile);
            const categoryId = files?.CategoryGeneralID;
            const updated = [...filesSubmit];
            const idx = updated.findIndex(
              f => f.CategoryGeneralID === categoryId,
            );

            if (idx >= 0) {
              const currentLinks = updated[idx].Link
                ? updated[idx].Link.split(';')
                : [];
              const unique = Array.from(
                new Set([...currentLinks, ...newLinks]),
              );
              updated[idx] = {...updated[idx], Link: unique.join(';')};
            } else {
              updated.push({
                CategoryGeneralID: categoryId,
                Name: files?.Name || '',
                Link: newLinks.join(';'),
              });
            }
            setFilesFormSubmit(updated);
          } else {
            console.log(val.message);
          }
        })
        .catch(console.log);
    } else {
      setFilesFormSubmit([...filesSubmit]);
    }
  };

  // Tạo dữ liệu đúng schema CurrentDocs
  const generateFormattedData = () => {
    const customerId = parentID || 0;
    // chú ý: ta dựa vào itemsForList, để ngay cả khi dataex rỗng, vẫn trả đủ dòng
    return (itemsForList || []).map(profile => {
      const key = String(profile.ID);
      const links = groupedFiles[key] || [];
      const linkStr = links.map(x => x.Link).join(';');
      const isCheck = linkStr ? 1 : 0; // có link => IsCheck = 1

      return {
        CustomerID: customerId,
        CategoryGeneralID: profile.ID,
        Link: linkStr || '',
        IsCheck: isCheck,
        Extention1: '',
        Extention2: '',
        Extention3: '',
        Extention4: '',
        Extention5: '',
      };
    });
  };

  // Xoá 1 file trong 1 CategoryGeneralID
  const handleDeleteFile = fileToDelete => {
    const key = Object.keys(groupedFiles).find(k =>
      groupedFiles[k].some(f => f.Link === fileToDelete.Link),
    );
    if (!key) return;

    setFilesFormSubmit(prevFiles => {
      return prevFiles
        .map(file => {
          if (String(file.CategoryGeneralID) === String(key)) {
            const updatedLinks = (file.Link || '')
              .split(';')
              .filter(link => link !== fileToDelete.Link);
            return updatedLinks.length > 0
              ? {...file, Link: updatedLinks.join(';')}
              : null;
          }
          return file;
        })
        .filter(Boolean);
    });

    setSelectedFiles(prevSelected =>
      prevSelected.filter(file => file.Link !== fileToDelete.Link),
    );
  };

  // Khi thay đổi filesSubmit/itemsForList/parentID -> bắn setData theo schema mới
  // Chỉ set khi payload thật sự khác
  const lastPayloadRef = useRef('');
  useEffect(() => {
    const formattedData = generateFormattedData();
    const nextStr = JSON.stringify({CurrentDocs: formattedData});
    if (nextStr !== lastPayloadRef.current) {
      lastPayloadRef.current = nextStr;
      setData({CurrentDocs: formattedData});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesSubmit, itemsForList, parentID]);

  // Nạp dữ liệu edit theo schema mới (dataEdit = CurrentDocs từ server)
  // Chỉ nạp khi dataEdit thực sự thay đổi về nội dung
  const lastEditRef = useRef('');
  useEffect(() => {
    const editStr = JSON.stringify(dataEdit || []);
    if (editStr === lastEditRef.current) return;
    lastEditRef.current = editStr;

    if (Array.isArray(dataEdit) && dataEdit.length > 0) {
      // Chỉ nạp các mục có Link để hasFiles hiển thị đúng
      const formattedFilesSubmit = (dataEdit || [])
        .filter(x => x && (x.Link || '').length > 0)
        .map(x => ({
          CategoryGeneralID: x.CategoryGeneralID,
          Name: nameById[String(x.CategoryGeneralID)] || 'Tài liệu',
          Link: x.Link || '',
        }));

      setFilesFormSubmit(formattedFilesSubmit);
    } else {
      // dataEdit rỗng -> không có file nào
      setFilesFormSubmit([]);
    }
  }, [dataEdit, nameById]);

  useEffect(() => {
    if (files?.Link?.length > 0) handleSelectFileAndSubmit();
  }, [files]);
  const renderItem = ({item}) => {
    const name = item?.Name || '';
    const hasFiles = !!(
      groupedFiles[String(item.ID)] && groupedFiles[String(item.ID)].length
    );

    return (
      <View style={styles.rowItem}>
        <Text
          style={[
            styles.rowTitle,
            {
              fontSize: fhm ? fontSize.size14 : fontSize.size16,
              marginLeft: fhm ? scale(0) : scale(0),
            },
          ]}
          numberOfLines={2}>
          {name}
        </Text>

        <View style={styles.rowActions}>
          {hasFiles ? (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => handleShowModal(item.ID)}
              hitSlop={{
                top: scale(16),
                bottom: scale(16),
                left: scale(16),
                right: scale(16),
              }}>
              <SvgXml
                xml={docFile?.replace('#171717', colors.orange)}
                width={scale(18)}
                height={scale(18)}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconPlaceholder} />
          )}

          {fhm === true ? null : (
            <TouchableOpacity
              disabled={disable}
              style={styles.iconBtn}
              // onPress={() => handleUploadFile(item)}
              onPress={() => handleOpenUploadModal(item)}
              hitSlop={{
                top: scale(16),
                bottom: scale(16),
                left: scale(16),
                right: scale(16),
              }}>
              <SvgXml
                xml={uploadFile_white?.replace(
                  'white',
                  disable ? colors.gray600 : colors.blue,
                )}
                width={scale(18)}
                height={scale(18)}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const ItemSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      {/* <Text style={disable ? styles.headerTitle2 : styles.headerTitle}>
        {languageKey('_customer_profile_doc') || 'Giấy tờ hồ sơ khách hàng'}
      </Text> */}
      {disable === false && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: colors.graySystem2,
            paddingVertical: scale(12),
          }}>
          <Text
            style={{
              fontSize: disable === true ? fontSize.size20 : fontSize.size16,
              fontWeight: '600',
              lineHeight: scale(24),
              fontFamily: 'Inter-SemiBold',
              color: colors.black,
              marginTop: scale(0),
              marginHorizontal: scale(12),
              marginBottom: scale(0),
            }}>
            {languageKey('_customer_profile_doc')}
          </Text>
        </View>
      )}
      <FlatList
        data={itemsForList}
        keyExtractor={it => String(it.ID)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={styles.listContent}
      />

      {isShowModalViewFile && (
        <Modal
          useNativeDriver
          backdropOpacity={0.5}
          isVisible={isShowModalViewFile}
          style={styles.optionsModal}
          onBackButtonPress={handleCloseModal}
          onBackdropPress={handleCloseModal}
          hideModalContentWhileAnimating>
          <View style={styles.headerContent_gray}>
            <View style={styles.btnClose}>
              <SvgXml xml={close_white} />
            </View>

            <Text style={styles.titleModal}>
              {languageKey('_attached_files')}
            </Text>

            <Button onPress={handleCloseModal} style={styles.btnClose}>
              <SvgXml xml={close_red} />
            </Button>
          </View>

          <View style={styles.tableWrapper}>
            <View style={styles.rowHeader}>
              <View style={styles.cell_60}>
                <Text style={styles.txtHeaderTable}>
                  {languageKey('_file_name')}
                </Text>
              </View>
              <View style={styles.cell_40}>
                <Text style={styles.txtHeaderTable}>
                  {languageKey('_operation')}
                </Text>
              </View>
            </View>

            {selectedFiles?.map((it, idx) => (
              <View
                key={`${it.Link}-${idx}`}
                style={[
                  styles.cellResponse,
                  idx === selectedFiles.length - 1 && styles.lastCell,
                ]}>
                <View style={styles.cell_60}>
                  <Text style={styles.contentTime}>{it.Content}</Text>
                </View>
                <View style={styles.cell_40}>
                  <View style={styles.btnDoc}>
                    <Button onPress={() => handleViewFile(it.Link)}>
                      <SvgXml
                        xml={viewFile_gray}
                        width={scale(32)}
                        height={scale(32)}
                      />
                    </Button>
                    <Button onPress={() => handleDownloadFile(it.Link)}>
                      <SvgXml
                        xml={downFile}
                        width={scale(32)}
                        height={scale(32)}
                      />
                    </Button>
                    {disable ? null : (
                      <Button
                        disabled={disable}
                        onPress={() => handleDeleteFile(it)}>
                        <SvgXml
                          xml={trash}
                          width={scale(24)}
                          height={scale(24)}
                        />
                      </Button>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Modal>
      )}

      {visibleUploadModal && (
        <Modal
          isVisible={visibleUploadModal}
          style={styles.modal}
          onBackButtonPress={handleCloseModalUpload}
          onBackdropPress={handleCloseModalUpload}
          backdropTransitionOutTiming={0}
          hideModalContentWhileAnimating>
          <View style={styles.modalContainer1}>
            <View style={styles.cameraGalleryContainer1}>
              <Text style={styles.uploadModalTitle1}>
                {languageKey('_upload_files')}
              </Text>

              <TouchableOpacity
                style={styles.takeChoose}
                onPress={() => takePhoto()}>
                <Text style={styles.txtTakePhoto}>
                  {languageKey('_take_photo') || 'Chụp hình'}
                </Text>
              </TouchableOpacity>

              <Button
                style={styles.chooseGalleryBtn}
                onPress={() => getImageGallery()}>
                <Text style={styles.txtTakePhoto}>
                  {languageKey('_select_gallery') || 'Chọn từ thư viện'}
                </Text>
              </Button>

              <Button
                style={styles.chooseGalleryBtn}
                onPress={() => handleChooseFile()}>
                <Text style={styles.txtTakePhoto}>
                  {languageKey('_select_file') || 'Chọn file'}
                </Text>
              </Button>
            </View>

            <Button
              style={[
                styles.cancelButton,
                {marginHorizontal: scale(16), marginTop: scale(12)},
              ]}
              onPress={() => handleCloseModalUpload()}>
              <Text style={styles.txtBtn}>{languageKey('_close')}</Text>
            </Button>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: scale(0),
  },
  headerTitle: {
    color: colors.black,
    fontWeight: '700',
    fontSize: fontSize.size16,
    lineHeight: scale(24),
    fontFamily: 'Inter-Bold',
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    backgroundColor: '#F5F5F5',
  },
  headerTitle2: {
    color: colors.black,
    fontWeight: '600',
    fontSize: fontSize.size16,
    lineHeight: scale(24),
    fontFamily: 'Inter-SemiBold',
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    backgroundColor: colors.white,
  },
  rowItem: {
    minHeight: hScale(48),
    paddingHorizontal: scale(12),
    paddingVertical: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTitle: {
    flex: 1,
    color: '#111827',
    fontWeight: '400',
    fontSize: fontSize.size16,
    lineHeight: scale(20),
    marginRight: scale(12),
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: scale(6),
    marginLeft: scale(8),
  },
  iconPlaceholder: {
    width: scale(24),
    height: scale(24),
    marginLeft: scale(8),
  },
  cardProgram1: {
    backgroundColor: colors.white,
    marginHorizontal: scale(12),
    marginTop: scale(0),
    borderRadius: scale(8),
    borderWidth: scale(1),
    borderColor: colors.borderColor,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginLeft: scale(12),
  },
  optionsModal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modal: {
    margin: 0,
  },
  headerContent_gray: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: hScale(46),
    paddingHorizontal: scale(16),
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    borderBottomWidth: scale(1),
    borderBottomColor: colors.borderColor,
  },
  titleModal: {
    color: colors.black,
    fontSize: fontSize.size16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(24),
    textAlign: 'center',
    flex: 1,
  },
  btnClose: {
    padding: scale(10),
  },
  tableWrapper: {
    overflow: 'hidden',
    backgroundColor: colors.white,
    paddingBottom: scale(Platform.OS === 'ios' ? 200 : 0),
  },
  rowHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9F9FB',
    borderBottomWidth: scale(1),
    borderBottomColor: colors.borderColor,
  },
  cell_60: {
    width: '60%',
    justifyContent: 'center',
    padding: scale(8),
  },
  cell_40: {
    width: '40%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: scale(8),
  },
  lastCell: {
    borderBottomWidth: 0,
  },
  txtHeaderTable: {
    color: '#6B7280',
    fontSize: fontSize.size12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(18),
  },
  cellResponse: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: scale(1),
    borderBottomColor: colors.borderColor,
    backgroundColor: colors.white,
  },
  contentTime: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
    overflow: 'hidden',
    width: '80%',
  },
  btnDoc: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadModal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainerUpload: {
    width: '90%',
    backgroundColor: colors.white,
    borderRadius: scale(12),
    padding: scale(12),
  },
  modalContainer1: {
    width: '100%',
    height: hScale(280),
    bottom: 0,
    position: 'absolute',
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(12),
    borderTopRightRadius: scale(12),
  },
  uploadModalTitle: {
    fontSize: fontSize.size16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: scale(8),
    textAlign: 'center',
  },
  uploadModalTitle1: {
    fontSize: fontSize.size16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: scale(16),
    textAlign: 'center',
    marginTop: scale(12),
    borderBottomWidth: scale(1),
    borderBottomColor: colors.gray200,
  },
  cameraGalleryContainer1: {
    marginBottom: scale(1),
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(12),
    borderTopRightRadius: scale(12),
  },
  takeChoose: {
    borderBottomWidth: scale(1),
    borderBottomColor: '#D1D3DB',
    paddingVertical: scale(12),
  },
  chooseGalleryBtn: {
    paddingVertical: scale(12),
    borderBottomWidth: scale(1),
    borderBottomColor: '#D1D3DB',
  },
  txtTakePhoto: {
    fontSize: fontSize.size14,
    color: colors.black,
    paddingHorizontal: scale(10),
    fontWeight: '500',
    lineHeight: scale(22),
  },
  cancelButton: {
    marginTop: scale(8),
    height: hScale(38),
    borderRadius: scale(8),
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtBtn: {
    fontSize: fontSize.size14,
    color: colors.white,
    fontWeight: '600',
  },
  cameraGalleryContainer: {
    marginBottom: scale(8),
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(12),
    borderTopRightRadius: scale(12),
  },
});

export default memo(ModalProfileCustomer);
