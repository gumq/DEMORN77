import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';
import {hScale, scale} from '@utils/resolutions';

const {width} = Dimensions.get('window');

const RenderImageZoomView = ({urls = [], widthScreen}) => {
  const [svgContents, setSvgContents] = useState({});
  const [errorImages, setErrorImages] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchAllSvg = async () => {
      const results = {};
      for (let url of urls) {
        if (url?.endsWith?.('.svg')) {
          try {
            const res = await fetch(url);
            const text = await res.text();
            results[url] = text;
          } catch (e) {
            console.warn('SVG load error:', url);
          }
        }
      }
      setSvgContents(results);
    };
    fetchAllSvg();
  }, [urls]);

  const sharedStyle = {
    width: widthScreen ? widthScreen : width / 4 - 19,
    height: hScale(82),
  };

  const handleOpenModal = index => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const handleCloseModal = () => setModalVisible(false);

  const imageViewerList = urls
    .filter(url => !url?.endsWith?.('.svg'))
    .map(url => ({url}));

  return (
    <View>
      <View style={styles.container}>
        {urls.map((url, index) => {
          const isSvg = url?.endsWith?.('.svg');
          const svgContent = svgContents[url];
          const hasError = errorImages[url];

          if (isSvg && svgContent) {
            return (
              <SvgXml
                key={index}
                xml={svgContent}
                {...sharedStyle}
                style={styles.image}
              />
            );
          }

          if (hasError) {
            return (
              <View
                key={index}
                style={[styles.image, sharedStyle, {backgroundColor: '#ccc'}]}
              />
            );
          }

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleOpenModal(index)}
              activeOpacity={0.8}>
              <Image
                source={{uri: url}}
                style={[styles.image, sharedStyle]}
                onError={() =>
                  setErrorImages(prev => ({...prev, [url]: true}))
                }
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Modal Zoom View */}
      <Modal
        useNativeDriver
        isVisible={modalVisible}
        onBackdropPress={handleCloseModal}
        onBackButtonPress={handleCloseModal}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating
        style={styles.modal}>
        <ImageViewer
          enableSwipeDown
          onSwipeDown={handleCloseModal}
          imageUrls={imageViewerList}
          index={selectedIndex}
          saveToLocalByLongPress={false}
          renderIndicator={(currentIndex, allSize) => (
            <View style={styles.indicator}>
              <Text style={styles.indicatorText}>
                {currentIndex}/{allSize}
              </Text>
            </View>
          )}
          renderHeader={() => (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          )}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: width / 4 - scale(24),
    height: hScale(82),
    borderRadius: scale(12),
    marginHorizontal: scale(4),
    marginTop: scale(8),
  },
  modal: {
    margin: 0,
    backgroundColor: 'black',
  },
  indicator: {
    position: 'absolute',
    top: scale(50),
    alignSelf: 'center',
  },
  indicatorText: {
    color: 'white',
    fontSize: scale(14),
  },
  closeButton: {
    position: 'absolute',
    top: scale(40),
    right: scale(20),
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: scale(26),
    lineHeight: scale(26),
  },
});

export default RenderImageZoomView;
