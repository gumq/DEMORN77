// import React, {useEffect, useState} from 'react';
// import {Dimensions, Image, View, StyleSheet} from 'react-native';
// import {SvgXml} from 'react-native-svg';
// import {hScale, scale} from '@utils/resolutions';;

// const {width} = Dimensions.get('window');

// const RenderImage = ({urls = [], widthScreen}) => {
//   const [svgContents, setSvgContents] = useState({});
//   const [errorImages, setErrorImages] = useState({});

//   useEffect(() => {
//     const fetchAllSvg = async () => {
//       const results = {};
//       for (let url of urls) {
//         if (url?.endsWith?.('.svg')) {
//           try {
//             const res = await fetch(url);
//             const text = await res.text();
//             results[url] = text;
//           } catch (e) {
//             console.warn('SVG load error:', url);
//           }
//         }
//       }
//       setSvgContents(results);
//     };
//     fetchAllSvg();
//   }, [urls]);

//   const sharedStyle = {
//     width: widthScreen ? widthScreen : width / 4 - 19,
//     height: hScale(82),
//   };

//   return (
//     <View style={styles.container}>
//       {urls.map((url, index) => {
//         const isSvg = url?.endsWith?.('.svg');
//         const svgContent = svgContents[url];
//         const hasError = errorImages[url];

//         if (isSvg && svgContent) {
//           return (
//             <SvgXml
//               key={index}
//               xml={svgContent}
//               {...sharedStyle}
//               style={styles.image}
//             />
//           );
//         }

//         if (hasError) {
//           return (
//             <View
//               key={index}
//               style={[styles.image, sharedStyle, {backgroundColor: '#ccc'}]}
//             />
//           );
//         }

//         return (
//           <Image
//             key={index}
//             source={{uri: url}}
//             style={[styles.image, sharedStyle]}
//             onError={() => setErrorImages(prev => ({...prev, [url]: true}))}
//           />
//         );
//       })}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   image: {
//     width: width / 4 - 24,
//     height: hScale(82),
//     borderRadius: scale(12),
//     marginHorizontal: scale(4),
//     marginTop: scale(8),
//   },
// });

// export default RenderImage;
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  View,
  StyleSheet,
  Platform,
  Linking,
  Modal,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {hScale, scale} from '@utils/resolutions';
import {WebView} from 'react-native-webview';

const {width} = Dimensions.get('window');

// danh sách extension coi là "file" (không phải ảnh)
const FILE_EXTENSIONS = [
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'txt',
  'rtf',
  'odt',
  'ods',
  'odp',
];

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'];

const getExtension = url => {
  if (!url) return '';
  // loại bỏ query string và fragment
  const clean = url.split('?')[0].split('#')[0];
  const parts = clean.split('.');
  if (parts.length <= 1) return '';
  return parts[parts.length - 1].toLowerCase();
};

const isSvgUrl = url => getExtension(url) === 'svg';
const isImageUrl = url => IMAGE_EXTENSIONS.includes(getExtension(url));
const isFileUrl = url => FILE_EXTENSIONS.includes(getExtension(url));

const RenderImage = ({urls = [], widthScreen}) => {
  const [svgContents, setSvgContents] = useState({});
  const [errorImages, setErrorImages] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [webUrl, setWebUrl] = useState(null);
  const [webLoading, setWebLoading] = useState(true);

  useEffect(() => {
    const fetchAllSvg = async () => {
      const results = {};
      for (let url of urls) {
        if (isSvgUrl(url)) {
          try {
            const res = await fetch(url);
            const text = await res.text();
            results[url] = text;
          } catch (e) {
            console.warn('SVG load error:', url, e);
            // không set errorImages ở đây để vẫn thử render fallback nếu cần
          }
        }
      }
      setSvgContents(results);
    };
    fetchAllSvg();
  }, [urls]);

  const sharedSize = {
    width: widthScreen ? widthScreen : width / 4 - 19,
    height: hScale(82),
  };

  const openFile = async url => {
    if (!url) return;

    // iOS: open bằng Linking (mở qua Safari hoặc app tương ứng)
    if (Platform.OS === 'ios') {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          // fallback: mở bằng Safari (http(s) link)
          await Linking.openURL(url);
        }
      } catch (err) {
        console.warn('Open file error (iOS):', err);
        Alert.alert('Lỗi', 'Không thể mở file trên thiết bị này.');
      }
      return;
    }

    // Android: mở bằng Google Docs Viewer trong WebView (embedded)
    if (Platform.OS === 'android') {
      const encoded = encodeURIComponent(url);
      const openUrl = `https://docs.google.com/gview?embedded=true&chrome=false&rm=minimal&url=${encoded}`;
      setWebUrl(openUrl);
      setModalVisible(true);
      setWebLoading(true);
      return;
    }

    // other OS fallback
    try {
      await Linking.openURL(url);
    } catch (err) {
      console.warn('Open file error (fallback):', err);
      Alert.alert('Lỗi', 'Không thể mở file.');
    }
  };

  // Thêm onPress cho từng item
  const renderItem = (url, index) => {
    const isSvg = isSvgUrl(url);
    const svgContent = svgContents[url];
    const hasError = errorImages[url];

    // nếu là file (pdf/doc...)
    if (isFileUrl(url)) {
      // hiển thị ô đại diện cho file, có thể bấm để mở
      return (
        <TouchableOpacity
          key={index}
          onPress={() => openFile(url)}
          activeOpacity={0.7}
          style={[styles.itemWrapper, sharedSize]}>
          <View style={[styles.fileBox, {width: sharedSize.width, height: sharedSize.height}]}>
            <Text numberOfLines={1} style={styles.fileName}>
              {decodeURIComponent(url.split('/').pop().split('?')[0])}
            </Text>
            {/* <Text style={styles.tapHint}>Tap để xem</Text> */}
          </View>
        </TouchableOpacity>
      );
    }

    // nếu là svg và đã tải nội dung
    if (isSvg && svgContent) {
      return (
        <Pressable
          key={index}
          onPress={() => {
            // nếu url thực sự là file svg (có thể được mở ở browser), mở bằng platform behavior
            if (isFileUrl(url)) {
              openFile(url);
            }
          }}
          style={[styles.itemWrapper]}>
          <SvgXml
            xml={svgContent}
            width={sharedSize.width}
            height={sharedSize.height}
            style={styles.svgImage}
          />
        </Pressable>
      );
    }

    // nếu đã có lỗi load ảnh -> hiển thị placeholder
    if (hasError) {
      return (
        <View
          key={index}
          style={[
            styles.imagePlaceholder,
            {width: sharedSize.width, height: sharedSize.height},
          ]}
        />
      );
    }

    // mặc định render Image (nếu là link ảnh)
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.8}
        onPress={() => {
          // Nếu một file ảnh muốn mở full-screen hay open link, bạn tuỳ chỉnh ở đây.
          if (isFileUrl(url)) {
            openFile(url);
          } else if (!isImageUrl(url)) {
            // nếu ko biết nhưng không phải ảnh -> mở file theo platform
            openFile(url);
          } else {
            // ảnh: bạn có thể xử lý mở viewer full screen nếu cần. Hiện ta ko mở gì thêm.
          }
        }}
        style={[styles.itemWrapper]}>
        <Image
          source={{uri: url}}
          style={[styles.image, {width: sharedSize.width, height: sharedSize.height}]}
          resizeMode="cover"
          onError={() => setErrorImages(prev => ({...prev, [url]: true}))}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {urls.map((url, idx) => renderItem(url, idx))}

      {/* Modal chứa WebView cho Android */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
            <Text style={styles.closeText}>Đóng</Text>
          </TouchableOpacity>
        </View>

        {webUrl ? (
          <WebView
            source={{uri: webUrl}}
            startInLoadingState
            onLoadEnd={() => setWebLoading(false)}
            onError={syntheticEvent => {
              const {nativeEvent} = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
              Alert.alert('Lỗi', 'Không thể tải file trong WebView.');
              setWebLoading(false);
            }}
            style={styles.webview}
          />
        ) : (
          <View style={styles.webFallback}>
            <Text>Không có URL để hiển thị</Text>
          </View>
        )}

        {webLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  itemWrapper: {
    marginHorizontal: scale(4),
    marginTop: scale(8),
    borderRadius: scale(12),
    overflow: 'hidden',
  },
  image: {
    borderRadius: scale(12),
  },
  svgImage: {
    borderRadius: scale(12),
  },
  imagePlaceholder: {
    backgroundColor: '#ccc',
    borderRadius: scale(12),
  },
  fileBox: {
    backgroundColor: '#f7f7f7',
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(8),
  },
  fileName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  tapHint: {
    marginTop: 6,
    fontSize: 11,
    color: '#555',
  },
  modalHeader: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  closeBtn: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  closeText: {
    color: '#007AFF',
    fontSize: 16,
  },
  webview: {
    flex: 1,
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 56,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RenderImage;
