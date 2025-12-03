import React, {useCallback, useEffect, useState} from 'react';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Alert,
  Linking,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import {stylesDetail} from '../styles';
import {translateLang} from '@store/accLanguages/slide';
import {wScale} from '@utils/resolutions';;
import {
  fetchApiExportPDF_ExportPDF,
  fetchApiv2_OtherApprovals_GetByID,
} from '@store/accApproval_Signature/thunk';
import {SvgXml} from 'react-native-svg';
import {close, downFile, extend} from '@svgImg';
import RNFS from 'react-native-fs';

// Thay WebView bằng react-native-pdf
import Pdf from 'react-native-pdf';

const {width} = Dimensions.get('window');

const DetailTab = ({itemData}) => {
  const languageKey = useSelector(translateLang);
  const dispatch = useDispatch();
// console.log('itemData',itemData);
  const [fileLinks, setFileLinks] = useState([]); // Danh sách link gốc (không qua Google)
  const [fileLinkRoot, setFileLinkRoot] = useState(null);
  const [selectedPdfUri, setSelectedPdfUri] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  // === Fetch file links ===
  const fetchGetFileLink = useCallback(() => {
    const body = {
      // FactorID: itemData?.FactorID,
      // EntryID: itemData?.EntryID,
      OID: itemData?.OID,
    };
// console.log('body',body);
    dispatch(fetchApiv2_OtherApprovals_GetByID(body)).then(success => {
      if (success !== false) {
        const linkRoot = success?.[0]?.LinkFile;
        setFileLinkRoot(linkRoot);

        const links = linkRoot
          ?.split(';')
          .map(l => l.trim())
          .filter(l => l && l.endsWith('.pdf'));

        setFileLinks(links || []);
      }
    });
  }, [dispatch, itemData]);

  useEffect(() => {
    fetchGetFileLink();
  }, [fetchGetFileLink]);

  // === Mở modal xem PDF ===
  const openPdfModal = (uri, index) => {
    setSelectedPdfUri(uri);
    setSelectedIndex(index);
    setModalVisible(true);
  };

  // === Download file ===
  const handleDownloadFile = async () => {
    if (!fileLinkRoot || selectedIndex === null) return;

    const links = fileLinkRoot
      .split(';')
      .map(l => l.trim())
      .filter(Boolean);
    const downloadUrl = links[selectedIndex];
    const fileName = downloadUrl.split('/').pop();
    const downloadPath =
      Platform.OS === 'android'
        ? `${RNFS.DownloadDirectoryPath}/${fileName}`
        : `${RNFS.DocumentDirectoryPath}/${fileName}`;

    try {
      await RNFS.downloadFile({
        fromUrl: downloadUrl,
        toFile: downloadPath,
      }).promise;

      Alert.alert(
        languageKey('_download_success'),
        `${fileName}\n${downloadPath}`,
      );

      if (Platform.OS === 'android') {
        Linking.openURL(`file://${downloadPath}`);
      }
    } catch (error) {
      Alert.alert(
        languageKey('_download_failed'),
        languageKey('_error_download_file'),
      );
    }
  };

  return (
    <View style={stylesDetail.container}>
      {/* === Header Info === */}
      <View style={stylesDetail.cardProgram}>
        <View
          style={[
            stylesDetail.containerHeader,
            {
              marginBottom: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}>
          <Text style={stylesDetail.header}>
            {languageKey('_information_general')}
          </Text>
          <View
            style={[
              stylesDetail.bodyStatus,
              {
                backgroundColor: itemData?.ApprovalStatusColor,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
              },
            ]}>
            <Text
              style={[
                stylesDetail.txtStatus,
                {color: itemData?.ApprovalStatusTextColor, fontWeight: '600'},
              ]}>
              {itemData?.ApprovalStatusName}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 12,
          }}>
          <View style={{flex: 1, marginRight: 16}}>
            <Text style={stylesDetail.txtHeaderBody}>
              {languageKey('_ct_code')}
            </Text>
            <Text style={[stylesDetail.contentBody, {fontWeight: '600'}]}>
              {itemData?.OID}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={stylesDetail.txtHeaderBody}>
              {languageKey('_ct_day')}
            </Text>
            <Text style={[stylesDetail.contentBody, {fontWeight: '600'}]}>
              {moment(itemData?.ODate).format('DD/MM/YYYY')}
            </Text>
          </View>
        </View>
      </View>

      {/* === PDF Preview Cards (Native PDF) === */}
      {fileLinks.map((pdfUrl, idx) => (
        <View
          key={idx}
          style={[
            stylesDetail.cardProgram,
            {
              marginTop: 16,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 12,
            },
          ]}>
          {/* Nút mở full */}
          <TouchableOpacity
            onPress={() => openPdfModal(pdfUrl, idx)}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 10,
              backgroundColor: '#fff',
              padding: 8,
              borderRadius: 20,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}>
            <SvgXml xml={extend} width={wScale(20)} height={wScale(20)} />
          </TouchableOpacity>

          {/* PDF Native Preview */}
          <Pdf
            source={{uri: pdfUrl, cache: true}}
            onLoadComplete={numberOfPages => {
              console.log(`PDF loaded: ${numberOfPages} pages`);
            }}
            onError={error => {
              console.log('PDF Error:', error);
            }}
            style={{
              width: '100%',
              height: wScale(500),
              borderRadius: 12,
            }}
            trustAllCerts={false}
            enablePaging={false}
            singlePage={false}
          />
        </View>
      ))}

      {/* === Fullscreen PDF Modal === */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={{margin: 0}}
        animationIn="slideInUp"
        animationOut="slideOutDown">
        <View style={{flex: 1, backgroundColor: '#000'}}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 16,
              paddingTop: 50,
              backgroundColor: 'rgba(0,0,0,0.7)',
            }}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <SvgXml
                xml={close}
                width={wScale(28)}
                height={wScale(28)}
                fill="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleDownloadFile}>
              <SvgXml
                xml={downFile}
                width={wScale(36)}
                height={wScale(36)}
                fill="#fff"
              />
            </TouchableOpacity>
          </View>

          {/* Full PDF */}
          {selectedPdfUri && (
            <Pdf
              source={{uri: selectedPdfUri, cache: true}}
              style={{flex: 1, width}}
              onError={error => {
                Alert.alert('Lỗi', 'Không thể tải PDF');
              }}
              trustAllCerts={false}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default DetailTab;
