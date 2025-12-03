import React, {useMemo, useState} from 'react';
import RNFS from 'react-native-fs';
import {
  View,
  Text,
  Alert,
  Linking,
  Platform,
  FlatList,
  StyleSheet,
  Modal,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Pdf from 'react-native-pdf';
import WebView from 'react-native-webview';

import {Button} from '@components';
import {colors, fontSize} from '@themes';
import {scale} from '@resolutions';

const {width, height} = Dimensions.get('window');

const AttachFileCompleted = ({detailTraining}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectFileLink, setSelectFileLink] = useState(null);
  // Chuẩn hóa dữ liệu từ Link
  const contents = useMemo(() => {
    let links = [];

    if (detailTraining?.Extention9) {
      links = detailTraining.Extention9.split(';')
        .filter(Boolean)
        .map((link, idx) => ({
          ID: `link-${idx}`,
          Content: link.split('/').pop(),
          Link: link,
        }));
    }
    return [
      {
        ID: 'file-group',
        Content: 'Danh sách file đính kèm',
        LinkList: links,
      },
    ];
  }, [detailTraining]);

  // const handleOpenFile = fileUrl => {
  //   if (!fileUrl) return;
  //   const viewerUrl = `https://docs.google.com/gview?embedded=true&chrome=false&rm=minimal&url=${encodeURIComponent(
  //     fileUrl,
  //   )}`;
  //   console.log('viewerUrlviewerUrlviewerUrl', viewerUrl);
  //   setSelectFileLink(viewerUrl);
  //   setModalVisible(true);
  // };
  const handleOpenFile = fileUrl => {
    if (fileUrl) {
      Linking.openURL(fileUrl)
        .then(() => console.log('Mở file'))
        .catch(() => Alert.alert('Error', 'Không thể mở file'));
    } else {
      Alert.alert('Error', 'Lỗi mở file');
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
      .promise.then(() => {
        Alert.alert('Download', `Tải xuống thành công ${downloadPath}`);
        if (Platform.OS === 'android') {
          Linking.openURL(`file://${downloadPath}`);
        }
      })
      .catch(() => {
        Alert.alert('Tải thất bại', 'Lỗi tải xuống');
      });
  };

  const renderModalViewer = uri => {
    if (!uri) return null;

    const isPdf = uri.toLowerCase().includes('.pdf');
    if (isPdf) {
      return (
        <Pdf
          source={{uri, cache: true}}
          style={{width, height, backgroundColor: 'white'}}
          onLoadComplete={numPages => {
            console.log(`PDF Modal loaded with ${numPages} pages`);
          }}
          onError={error => {
            console.log(error);
          }}
        />
      );
    }

    return (
      <WebView
        source={{uri}}
        style={{flex: 1}}
        cacheEnabled={false}
        cacheMode={'LOAD_NO_CACHE'}
        incognito={true}
        scalesPageToFit={true}
        automaticallyAdjustContentInsets={false}
        contentMode="mobile"
        startInLoadingState={true}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        renderLoading={() => (
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color="#0000ff"
          />
        )}
      />
    );
  };

  const _keyExtractor = (item, index) => `${item.ID}-${index}`;

  const _renderItem = ({item}) => (
    <View style={styles.cardProgram}>
      {item?.LinkList?.length > 0 ? (
        <View style={styles.timeProgram}>
          <View style={styles.tableWrapper}>
            {item.LinkList.map((file, index) => (
              <View
                style={[
                  styles.cellResponse,
                  index === item.LinkList.length - 1 && styles.lastCell,
                ]}
                key={file.ID}>
                <View style={styles.cell}>
                  <Text
                    style={styles.contentTime}
                    numberOfLines={2}
                    ellipsizeMode="middle">
                    {file.Content}
                  </Text>
                  <View style={styles.btnDoc}>
                    <Button
                      style={{
                        paddingHorizontal: scale(4),
                        marginTop: scale(3),
                      }}
                      onPress={() => handleOpenFile(file.Link)}>
                      {/* <Ionicons
                        name="eye-outline"
                        size={scale(14)}
                        color="#737373"
                      /> */}
                    </Button>
                    <Button
                      style={{marginBottom: scale(0), padding: scale(4)}}
                      onPress={() => handleDownloadFile(file.Link)}>
                      {/* <Feather
                        name="download"
                        size={scale(14)}
                        color={colors.orange}
                      /> */}
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
  return (
    <View style={styles.container}>
      {contents?.[0]?.LinkList?.length > 0 ? (
        <FlatList
          data={contents}
          renderItem={_renderItem}
          keyExtractor={_keyExtractor}
          contentContainerStyle={styles.containerFlatlist}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View>
          <Text style={styles.txtHeaderNodata}>Không có dữ liệu</Text>
          {/* <Text style={styles.txtContent}>Quay lại sau</Text> */}
          {/* <Ionicons
            name="document-text-outline"
            size={60}
            color="#A0A0A0"
            style={styles.imgEmpty}
          /> */}
        </View>
      )}

      {/* Modal WebView/PDF */}
      <Modal visible={isModalVisible} animationType="slide" transparent={false}>
        <StatusBar
          translucent
          backgroundColor={colors.white}
          barStyle="dark-content"
        />
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.btnClose}
            onPress={() => setModalVisible(false)}>
            {/* <Ionicons name="close" size={scale(20)} color="#000" /> */}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnDownLoad}
            onPress={() => handleDownloadFile(selectFileLink)}>
            {/* <MaterialIcons name="file-download" size={30} color="orange" /> */}
          </TouchableOpacity>

          {renderModalViewer(selectFileLink)}
        </View>
      </Modal>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardProgram: {
    backgroundColor: colors.white,
    marginHorizontal: scale(0),
    marginTop: scale(4),
    borderRadius: scale(8),
    borderWidth: scale(1),
    borderColor: colors.graySystem2,
    paddingHorizontal: scale(0),
  },
  contentTime: {
    color: colors.black,
    fontSize: fontSize.size12,
    fontWeight: '400',
    lineHeight: scale(22),
    overflow: 'hidden',
    width: '85%',
  },
  cell: {
    padding: scale(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cellResponse: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: scale(1),
    borderBottomColor: colors.graySystem2,
  },
  lastCell: {
    borderBottomWidth: 0,
  },
  btnDoc: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableWrapper: {
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  timeProgram: {
    marginBottom: scale(2),
  },
  containerFlatlist: {
    paddingBottom: scale(0),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  btnClose: {
    position: 'absolute',
    top: scale(20),
    left: scale(16),
    zIndex: 10,
  },
  btnDownLoad: {
    position: 'absolute',
    top: scale(20),
    right: scale(16),
    zIndex: 10,
  },
  loading: {
    marginTop: 20,
  },
  txtHeaderNodata: {
    color: colors.black,
    fontSize: fontSize.size12,
    fontWeight: '600',
    // fontFamily: 'Inter-SemiBold',
    alignSelf: 'center',
    fontStyle: 'normal',
    lineHeight: scale(18),
    marginTop: scale(0),
  },
  txtContent: {
    marginTop: scale(4),
    alignSelf: 'center',
    fontWeight: '400',
    // fontFamily: 'Inter-Regular',
    fontSize: fontSize.size12,
    lineHeight: scale(18),
    color: '#525252',
  },
});

export default AttachFileCompleted;
