import React from 'react';
import RNFS from 'react-native-fs';
import {useSelector} from 'react-redux';
import {
  View,
  Text,
  Alert,
  Linking,
  Platform,
  FlatList,
  Share,
} from 'react-native';

import {Button} from 'components';
import {stylesContent, styles} from '../styles';
import {SvgXml} from 'react-native-svg';
import {downFile, noData, viewFile} from 'svgImg';
import {translateLang} from 'store/accLanguages/slide';
import DocumentPicker from 'react-native-document-picker';
const Content = ({detailTraining}) => {
  const languageKey = useSelector(translateLang);

  const handleViewFile = fileUrl => {
    ``;
    if (fileUrl) {
      Linking.openURL(fileUrl)
        .then(() => console.log('Mở file'))
        .catch(err => Alert.alert('Error', languageKey('_cannot_open_file')));
    } else {
      Alert.alert('Error', languageKey('_file_error'));
    }
  };

  const handleDownloadFile = async url => {
    const fileName = url.split('/').pop();
    const downloadPath =
      Platform.OS === 'android'
        ? RNFS.DownloadDirectoryPath + `/${fileName}`
        : RNFS.DocumentDirectoryPath + `/${fileName}`;

    RNFS.downloadFile({
      fromUrl: url,
      toFile: downloadPath,
    })
      .promise.then(result => {
        Alert.alert(
          'Download',
          `${languageKey('_download_success')} ${downloadPath}`,
        );
        if (Platform.OS === 'android') {
          Linking.openURL(`file://${downloadPath}`);
        }
      })
      .catch(error => {
        Alert.alert(
          languageKey('_download_failed'),
          languageKey('_error_download_file'),
        );
      });
  };

  //   const handleDownloadFile = async url => {
  //     try {
  //       const fileName = url.split('/').pop();
  //       const downloadPath =
  //         Platform.OS === 'android'
  //           ? `${RNFS.DownloadDirectoryPath}/${fileName}`
  //           : `${RNFS.DocumentDirectoryPath}/${fileName}`;

  //       const result = await RNFS.downloadFile({
  //         fromUrl: url,
  //         toFile: downloadPath,
  //       }).promise;

  //       if (result.statusCode === 200) {
  //         Platform.OS === 'android' &&
  //           Alert.alert('Download', `Tải xuống thành công:\n${downloadPath}`);

  //         if (Platform.OS === 'android') {
  //           Linking.openURL(`file://${downloadPath}`);
  //         } else {
  //           // ✅ iOS: mở hộp chia sẻ (Share Sheet)
  //           await Share.share({
  //             url: `file://${downloadPath}`,
  //             // message: 'Chọn “Save to Files” để lưu vào On My iPhone.',
  //           });
  //         }
  //       } else {
  //         throw new Error('Download failed');
  //       }
  //     } catch (error) {
  //       console.log('Download error:', error);
  //       Alert.alert('Lỗi', 'Không thể tải hoặc lưu file. Vui lòng thử lại.');
  //     }
  //   };

  const _keyExtractor = (item, index) => `${item.ID}-${index}`;
  const _renderItem = ({item}) => {
    const itemLinks = item?.Link
      ? item?.Link?.split(';').map(link => ({
          Content: link.split('/').pop(),
          Link: link,
        }))
      : [];
    return (
      <View style={stylesContent.cardProgram}>
        <Text style={stylesContent.headerProgram}>{item?.Content}</Text>
        {item?.ContentExtention1 ? (
          <View style={stylesContent.timeProgram}>
            <Text style={stylesContent.txtHeaderTime}>
              {languageKey('_content')}
            </Text>
            <Text style={stylesContent.contentTime}>
              {item?.ContentExtention1}
            </Text>
          </View>
        ) : null}
        {itemLinks?.length > 0 ? (
          <View style={stylesContent.timeProgram}>
            <Text style={stylesContent.txtHeaderDoc}>
              {languageKey('_training_doc')}
            </Text>
            <View style={stylesContent.tableWrapper}>
              {itemLinks?.map((item, index) => (
                <View
                  style={[
                    stylesContent.cellResponse,
                    index === itemLinks.length - 1 && stylesContent.lastCell,
                  ]}
                  key={index}>
                  <View style={stylesContent.cell}>
                    <Text
                      style={stylesContent.contentTime}
                      numberOfLines={2}
                      ellipsizeMode="middle">
                      {item?.Content}
                    </Text>
                    <View style={stylesContent.btnDoc}>
                      <Button onPress={() => handleViewFile(item?.Link)}>
                        <SvgXml xml={viewFile} />
                      </Button>
                      <Button onPress={() => handleDownloadFile(item?.Link)}>
                        <SvgXml xml={downFile} />
                      </Button>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <View style={stylesContent.container}>
      {detailTraining?.Contents?.length > 0 ? (
        <FlatList
          data={detailTraining?.Contents}
          renderItem={_renderItem}
          keyExtractor={_keyExtractor}
          contentContainerStyle={stylesContent.containerFlatlist}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View>
          <Text style={styles.txtHeaderNodata}>{languageKey('_no_data')}</Text>
          <Text style={styles.txtContent}>{languageKey('_we_will_back')}</Text>
          <SvgXml xml={noData} style={styles.imgEmpty} />
        </View>
      )}
    </View>
  );
};

export default Content;
