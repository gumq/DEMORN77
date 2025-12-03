/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState, useEffect, forwardRef} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Platform,
  Pressable,
  Text,
  Modal,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import WebView from 'react-native-webview';
import Geolocation from 'react-native-geolocation-service';
import {close_blue, gps, local_current} from '@svgImg';
import {Button} from '@components';
import {colors, fontSize} from '../../themes';
import {hScale, scale} from '../../utils/resolutions';
import html_script from '../../modules/layermap/html_script';
import {isIphoneX} from 'react-native-iphone-x-helper';

const InputLocationAlone = forwardRef(
  (
    {
      label,
      value,
      style,
      placeholderInput,
      labelHolder,
      onPress,
      bgColor,
      height,
      textColor,
      tree = false,
      disable,
      onChangeLocation,
      onAddressChange,
      error,
      touched,
      addressQuery,
      require = false,
      btnUpdateGPS = false,
      itemId = null,
      onPickGps = null,
      ...rest
    },
    ref,
  ) => {
    const mapRef = useRef(null);
    const [modalVisible, setModalVisibleState] = useState(false);
    const [gpss, setgpss] = useState(value || '');
    const modalVisibleRef = useRef(false);
    const [pendingGps, setPendingGps] = useState(null);

    useEffect(() => {
      setgpss(value || '');
    }, [value]);

    const setModalVisibility = visible => {
      modalVisibleRef.current = visible;
      setModalVisibleState(visible);
    };

    const getCurrentLocationAndEmit = () => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          const gpsString = `${Number(latitude).toFixed(8)},${Number(
            longitude,
          ).toFixed(8)}`;
          setgpss(gpsString);
          if (typeof onChangeLocation === 'function') {
            try {
              onChangeLocation(gpsString);
            } catch (e) {}
          }
          if (typeof onPickGps === 'function') {
            try {
              onPickGps(itemId, gpsString);
            } catch (e) {}
          }
        },
        err => {
          console.log('Geolocation error', err);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 2000,
          distanceFilter: 1,
        },
      );
    };

    const sendLocationToWebViewClick = (latitude, longitude, heading, click) => {
      if (mapRef.current) {
        const payload = {latitude, longitude, heading, click};
        mapRef.current.injectJavaScript(
          `window.postMessage('${JSON.stringify(payload)}','*');`,
        );
      }
    };

    const sendSearchAddress = address => {
      if (mapRef.current && address) {
        const msg = {searchAddress: address};
        mapRef.current.postMessage(encodeURIComponent(JSON.stringify(msg)));
      }
    };

    const getCurrentLocationForMap = () => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude, heading} = position.coords;
          sendLocationToWebViewClick(latitude, longitude, heading || 0, 1);
        },
        err => {
          console.log(err);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 2000,
          distanceFilter: 1,
        },
      );
    };

    const handleMessage = async event => {
      try {
        const raw = event?.nativeEvent?.data || '';
        let parsed = null;
        try {
          parsed = JSON.parse(raw);
        } catch (e) {
          try {
            parsed = JSON.parse(decodeURIComponent(raw));
          } catch (e2) {
            parsed = null;
          }
        }
        if (!parsed) return;
        let lat = NaN;
        let lon = NaN;
        if (Array.isArray(parsed) && parsed.length >= 2) {
          lon = Number(parsed[0]);
          lat = Number(parsed[1]);
        } else if (typeof parsed === 'object') {
          lon = Number(
            parsed.lon ??
              parsed.longitude ??
              parsed[0] ??
              parsed.long ??
              parsed.Long,
          );
          lat = Number(parsed.lat ?? parsed.latitude ?? parsed[1] ?? parsed.Lat);
        }
        if (!isFinite(lat) || !isFinite(lon)) return;
        const newGps = `${Number(lat).toFixed(8)},${Number(lon).toFixed(8)}`;
        setgpss(newGps);
        if (typeof onChangeLocation === 'function') {
          try {
            onChangeLocation(newGps);
          } catch (e) {}
        }
        if (modalVisibleRef.current === true) {
          setPendingGps(newGps);
          return;
        }
        if (typeof onPickGps === 'function') {
          try {
            onPickGps(itemId, newGps);
          } catch (err) {
            console.log('onPickGps error', err);
          }
        }
      } catch (err) {
        console.log('handleMessage error', err);
      }
    };

    useEffect(() => {
      if (addressQuery) {
        sendSearchAddress(addressQuery);
      }
    }, [addressQuery]);

    const handlePress = () => {
      getCurrentLocationAndEmit();
    };

    const handleLongPress = () => {
      setModalVisibility(true);
    };

    const handCloseModal = () => {
      setModalVisibility(false);
      if (pendingGps && typeof onPickGps === 'function') {
        try {
          onPickGps(itemId, pendingGps);
        } catch (e) {
          console.log('onPickGps error when closing modal', e);
        }
      }
      setPendingGps(null);
    };

    return (
      <View style={style}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <Pressable
          onPress={handlePress}
          onLongPress={handleLongPress}
          delayLongPress={400}
          disabled={disable}
          style={({pressed}) => [
            styles.btnUpdate,
            pressed && styles.btnUpdatePressed,
            style,
          ]}>
          <Text numberOfLines={1} style={[styles.btnUpdateText]}>
            Cập nhật GPS
          </Text>
        </Pressable>
        {modalVisible && (
          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={handCloseModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalmap}>
                <WebView
                  ref={mapRef}
                  source={{html: html_script}}
                  style={styles.container}
                  onLoad={getCurrentLocationForMap}
                  onMessage={handleMessage}
                  scalesPageToFit={false}
                  domStorageEnabled
                  javaScriptEnabled
                  scrollEnabled
                  onError={() => mapRef.current?.reload?.()}
                  onRenderProcessGone={() => mapRef.current?.reload?.()}
                />
                <Pressable style={styles.buttonContainerexit} onPress={handCloseModal}>
                  <SvgXml xml={close_blue} width={scale(24)} height={scale(24)} />
                </Pressable>
                <Text style={styles.textGPS}>{gpss?.toString()}</Text>
              </View>
            </View>
          </Modal>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalmap: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: scale(16),
  },
  textGPS: {
    position: 'absolute',
    right: scale(90),
    bottom: scale(20),
    color: colors.green,
    fontWeight: '600',
    backgroundColor: colors.white,
    padding: scale(8),
    borderRadius: scale(4),
    borderColor: colors.black,
    borderWidth: 2,
  },
  input: {
    color: colors.black,
    borderRadius: scale(8),
    fontSize: fontSize.size14,
    height: hScale(46),
    marginTop: scale(4),
    borderWidth: scale(1),
    borderColor: '#D1D3DB',
    backgroundColor: colors.white,
    paddingHorizontal: scale(16),
    justifyContent: 'center',
  },
  label: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '500',
    lineHeight: scale(22),
  },
  buttonContainerexit: {
    height: scale(44),
    width: scale(44),
    position: 'absolute',
    backgroundColor: colors.white,
    borderRadius: scale(22),
    justifyContent: 'center',
    alignItems: 'center',
    bottom: scale(isIphoneX() ? 400 : 400),
    right: scale(16),
    borderColor: colors.black,
    borderWidth: 2,
  },
  btnUpdate: {
    width: scale(375 - 32),
    borderRadius: scale(8),
    borderWidth: scale(1.5),
    borderColor: colors.blue,
    paddingVertical: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  btnUpdatePressed: {
    opacity: 0.85,
  },
  btnUpdateText: {
    color: colors.blue,
    fontWeight: '600',
    fontSize: fontSize.size14,
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
  },
});

export default InputLocationAlone;
