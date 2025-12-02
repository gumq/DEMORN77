/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
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
import html_script from 'modules/layermap/html_script';
import {isIphoneX} from 'react-native-iphone-x-helper';

const InputLocationnew = forwardRef(
  (
    {
      label,
      value, // "lat,lon"
      style,
      placeholderInput,
      labelHolder,
      onPress,
      bgColor,
      height,
      textColor,
      tree = false,
      disable,
      onChangeLocation, // (gps: "lat,lon") => void
      onAddressChange, // (address: string) => void
      error,
      touched,
      addressQuery,
      require = false,
      btnUpdateGPS = false,
      ...rest
    },
    ref,
  ) => {
    const mapRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [gpss, setgpss] = useState(value || '');

    const handleLongPress = () => setModalVisible(true);
    const handCloseModal = () => setModalVisible(false);

    // RN -> WebView: center theo lat/lon
    const sendLocationToWebViewClick = (
      latitude,
      longitude,
      heading,
      click,
    ) => {
      if (mapRef.current) {
        const payload = {latitude, longitude, heading, click};
        mapRef.current.injectJavaScript(
          `window.postMessage('${JSON.stringify(payload)}','*');`,
        );
      }
    };

    // RN -> WebView: yêu cầu tìm địa chỉ & focus
    const sendSearchAddress = address => {
      if (mapRef.current && address) {
        const msg = {searchAddress: address};
        // react-native-webview hỗ trợ trực tiếp:
        mapRef.current.postMessage(encodeURIComponent(JSON.stringify(msg)));
      }
    };

    // Lấy vị trí hiện tại
    const getCurrentLocation = () => {
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

    // Nhận message từ WebView: data là [lon, lat]
    const handleMessage = async event => {
      try {
        const data = JSON.parse(event?.nativeEvent?.data || '[]');
        const lon = Number(data?.[0]);
        const lat = Number(data?.[1]);
        if (isFinite(lat) && isFinite(lon)) {
          const newGps = `${lat.toFixed(8)},${lon.toFixed(8)}`;
          setgpss(newGps);
          onChangeLocation && onChangeLocation(newGps);
          try {
            const addr = await reverseGeocode(lat, lon);
            if (addr && onAddressChange) onAddressChange(addr);
          } catch (e) {}
        }
      } catch (e) {}
    };

    // Reverse geocoding bằng Nominatim
    const reverseGeocode = async (lat, lon) => {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
        lat,
      )}&lon=${encodeURIComponent(lon)}&addressdetails=1`;
      const res = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'YourAppName/1.0 (RN)',
        },
      });
      const json = await res.json();
      return json?.display_name;
    };

    useEffect(() => {
      if (addressQuery) {
        console.log('InputLocationnew useEffect addressQuery', addressQuery);
        sendSearchAddress(addressQuery);
      }
    }, [addressQuery]);

    return (
      <View style={style}>
        {require ? (
          <View style={styles.containerRequire}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.txtRequire}>*</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.label}>{label}</Text>
          </View>
        )}

        <View>
          <TextInput
            ref={ref}
            {...rest}
            editable={!disable}
            keyboardType="numeric"
            value={tree === true && value === ', ' ? '' : value}
            autoCapitalize="none"
            style={[
              styles.input,
              {
                borderColor:
                  value?.length > 0
                    ? '#D1D3DB'
                    : require
                    ? colors.blue
                    : '#D1D3DB',
                borderWidth:
                  value?.length > 0 ? scale(1) : require ? scale(2) : scale(1),
                paddingHorizontal: tree === true ? scale(12) : scale(16),
                height: height ? height : hScale(38),
                backgroundColor: bgColor ? bgColor : colors.white,
                paddingBottom: scale(Platform.OS === 'android' ? 10 : 0),
                color: textColor || colors.black,
              },
            ]}
            placeholder={placeholderInput ? labelHolder : ''}
            placeholderTextColor={colors.graySystem}
            onChangeText={text => {
              setgpss(text);
              onChangeLocation && onChangeLocation(text);
            }}
          />

          {placeholderInput && (
            <View style={styles.placeholder}>
              <Button
                disabled={disable}
                onPress={handleLongPress}
                onLongPress={handleLongPress}
                delayLongPress={500}
                style={styles.btnShowPW}>
                <SvgXml width={scale(16)} height={scale(16)} xml={gps} />
              </Button>
            </View>
          )}
        </View>

        {touched && Object?.keys(touched).length !== 0 && error !== false && (
          <Text style={styles.error}>{error?.toString()}</Text>
        )}

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
                  onLoad={getCurrentLocation}
                  onMessage={handleMessage}
                  scalesPageToFit={false}
                  domStorageEnabled
                  javaScriptEnabled
                  scrollEnabled
                  onError={() => mapRef.current?.reload()}
                  onRenderProcessGone={() => mapRef.current?.reload()}
                />

                <Pressable
                  style={styles.buttonContainerexit}
                  onPress={() => setModalVisible(false)}>
                  <SvgXml
                    xml={close_blue}
                    width={scale(24)}
                    height={scale(24)}
                  />
                </Pressable>
                {/* 
              <Pressable style={styles.buttonContainer} onPress={getCurrentLocation}>
                <SvgXml xml={local_current} width={scale(24)} height={scale(24)} />
              </Pressable> */}

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
  textGPS: {
    position: 'absolute',
    right: scale(90),
    bottom: scale(Platform.OS === 'ios' ? 20 : 20),
    color: colors.green,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    backgroundColor: colors.white,
    padding: scale(8),
    borderRadius: scale(4),
    borderColor: colors.black,
    borderWidth: 2,
  },
  buttonContainer: {
    height: scale(44),
    width: scale(44),
    position: 'absolute',
    backgroundColor: colors.white,
    borderRadius: scale(22),
    justifyContent: 'center',
    alignItems: 'center',
    bottom: scale(16),
    right: scale(16),
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
  container: {
    flex: 1,
    width: '100%',
    bottom: 0,
  },
  input: {
    color: colors.black,
    borderRadius: scale(8),
    paddingLeft: scale(10),
    fontSize: fontSize.size14,
    marginTop: scale(8),
    borderWidth: scale(1),
    borderColor: '#D1D3DB',
    backgroundColor: colors.white,
    height: hScale(38),
  },
  btnShowPW: {
    right: 0,
    bottom: -4,
    position: 'absolute',
    paddingVertical: scale(6),
    paddingHorizontal: scale(0),
  },
  label: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    fontSize: fontSize.size14,
    lineHeight: scale(14),
  },
  error: {
    fontSize: fontSize.size12,
    color: colors.redSystem,
    marginTop: scale(8),
  },
  placeholder: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    paddingHorizontal: scale(8),
    bottom: scale(8),
    width: '100%',
  },
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
  },
  btnShowPW: {
    right: 0,
    bottom: -4,
    position: 'absolute',
    paddingVertical: scale(6),
    paddingHorizontal: scale(10),
  },
  label: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    fontSize: fontSize.size14,
    lineHeight: scale(22),
  },
  error: {
    color: colors.red,
    fontSize: fontSize.size14,
    marginTop: scale(5),
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  placeholder: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    paddingHorizontal: scale(8),
    bottom: scale(8),
    width: '100%',
  },
  containerRequire: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtRequire: {
    color: colors.red,
    marginLeft: scale(2),
  },
});

export default InputLocationnew;
