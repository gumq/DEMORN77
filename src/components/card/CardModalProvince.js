/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {SvgXml} from 'react-native-svg';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';

import {Button} from '../buttons';
import SearchBar from '../SearchBar';
import {colors, fontSize} from '@themes';
import {hScale, scale} from '@resolutions';
import SearchModal from '@components/SearchModal';
import {arrow_down, close_blue, close_white, radio, radio_active} from '@svgImg';

const {height} = Dimensions.get('window');

const CardModalProvince = ({
  data,
  title,
  setValue,
  value,
  bgColor,
  require,
  disabled = false,
  checknt = '',
  xa = false,
}) => {
  const [searchText, setSearchText] = useState('');
  const [ishowModal, setIsShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchResults, setSearchResults] = useState(
    data?.length > 0 ? data : [],
  );

  const openShowModal = () => {
    setIsShowModal(true);
  };

  const closeModal = () => {
    setIsShowModal(false);
  };

  const handleSelection = item => {
    setValue(item);
    closeModal();
    setSelectedItem(item);
  };

  const onChangeText = textSearch => {
    if (textSearch?.length) {
      setSearchText(textSearch);
      const resultsData = SearchModal(data, textSearch);
      setSearchResults(resultsData);
    } else {
      setSearchResults(data);
    }
  };

  useEffect(() => {
    setSearchResults(data?.length > 0 ? data : []);
  }, [data]);

  const renderItem = useCallback(
    ({item}) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleSelection(item)}>
        <Text bold style={styles.title}>
          {item?.RegionsName}
        </Text>
        {selectedItem?.ID === item?.ID ? (
          <SvgXml xml={radio_active} style={{marginTop: scale(2)}} />
        ) : (
          <SvgXml xml={radio} style={{marginTop: scale(2)}} />
        )}
      </TouchableOpacity>
    ),
    [handleSelection, selectedItem],
  );

  return (
    <View>
      {require ? (
        <View
          style={[
            styles.containerRequire,
            {justifyContent: xa ? 'space-between' : 'flex-start'},
          ]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <Text style={styles.label}>{title} </Text>
            <Text style={styles.txtRequire}>*</Text>
          </View>
          {xa && <Text style={styles.label}>{checknt}</Text>}
        </View>
      ) : (
        <View>
          <Text style={styles.label}>{title} </Text>
        </View>
      )}
      <Button
        style={[
          styles.container,
          {
            borderColor:
              value?.length > 0 ? '#D1D3DB' : require ? colors.blue : '#D1D3DB',
            borderWidth:
              value?.length > 0 ? scale(1) : require ? scale(2) : scale(1),
            backgroundColor: bgColor ? bgColor : colors.white,
          },
        ]}
        opacity={disabled ? 1 : 0.5}
        onPress={openShowModal}
        disabled={disabled}>
        <View style={styles.header}>
          <Text
            style={[
              value ? styles.placeholder_two : styles.placeholder,
              disabled && {color: colors.black},
            ]}>
            {value ? value : title}
          </Text>
          <View>
            <SvgXml xml={arrow_down} width="14" height="14" />
          </View>
        </View>

        <Modal
          useNativeDriver
          backdropOpacity={0.5}
          isVisible={ishowModal}
          style={styles.optionsModal}
          onBackButtonPress={closeModal}
          onBackdropPress={closeModal}
          avoidKeyboard={true}
          hideModalContentWhileAnimating>
          <View style={styles.headerContent_gray}>
            <View style={styles.btnClose}>
              <SvgXml xml={close_white} />
            </View>
            <Text style={styles.titleModal}>{title}</Text>
            <Button onPress={closeModal} style={styles.btnClose}>
              <SvgXml xml={close_blue} />
            </Button>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.search}>
              <SearchBar
                value={searchText}
                onChangeText={text => {
                  setSearchText(text);
                  onChangeText(text);
                }}
              />
            </View>
            <FlatList
              data={searchResults}
              keyExtractor={item => item?.ID?.toString()}
              renderItem={renderItem}
              initialNumToRender={10}
              maxToRenderPerBatch={20}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.flatlistContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Modal>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    color: colors.black,
    borderRadius: scale(8),
    fontSize: fontSize.size14,
    height: hScale(42),
    borderWidth: scale(1),
    borderColor: '#D1D3DB',
    backgroundColor: colors.white,
    paddingLeft: scale(16),
    paddingHorizontal: scale(16),
    justifyContent: 'center',
  },
  optionsModal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  optionsModalContainer: {
    height: height / 2.2,
  },
  contentContainer: {
    backgroundColor: colors.white,
    height: height / 2.2,
  },
  label: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    lineHeight: scale(22),
    marginBottom: scale(8),
  },
  placeholder: {
    flexDirection: 'row',
    alignItems: 'center',
    color: colors.gray600,
    fontSize: fontSize.size14,
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
  },
  placeholder_two: {
    flexDirection: 'row',
    alignItems: 'center',
    color: colors.black,
    fontSize: fontSize.size14,
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  containerRadio: {
    borderRadius: scale(12),
    marginHorizontal: scale(16),
  },
  search: {
    marginHorizontal: scale(16),
    marginBottom: scale(16),
    marginTop: scale(16),
  },
  btnClose: {
    padding: scale(10),
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#D1D3DB',
    marginHorizontal: scale(16),
    alignItems: 'center',
  },
  cardNoBorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: scale(10),
    marginHorizontal: scale(16),
  },
  title: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '400',
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
  },
  row: {
    borderRadius: scale(12),
    backgroundColor: colors.white,
  },
  txtRequire: {
    color: colors.red,
    marginLeft: scale(2),
    bottom: 4,
  },
  containerRequire: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CardModalProvince;
