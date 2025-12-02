import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Dimensions, Text} from 'react-native';
import Modal from 'react-native-modal';
import {SvgXml} from 'react-native-svg';

import {colors, fontSize} from '../../themes';
import {hScale, scale} from '../../utils/resolutions';
import {arrow_down, close_blue, close_white} from '../../svgImg';
import {RadioCompany} from '../radio';
import {Button} from '../buttons';
import SearchBar from '../SearchBar';
import {SearchModal} from '..';

const {height} = Dimensions.get('window');

const CardModalCompany = ({data, title, setValue, value}) => {
  const [ishowModal, setIsShowModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const openShowModal = () => {
    setIsShowModal(true);
  };

  const closeModal = () => {
    setIsShowModal(false);
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

  return (
    <View>
      <Text style={styles.label}>{title}</Text>
      <Button style={styles.container} onPress={openShowModal}>
        <View style={styles.header}>
          <Text style={value ? styles.placeholder_two : styles.placeholder}>
            {value ? value : title}{' '}
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
            <Button style={styles.btnClose}>
              <SvgXml xml={close_white} />
            </Button>
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
                style={{marginHorizontal: scale(16)}}
              />
            </View>
            <ScrollView
              style={styles.containerRadio}
              showsVerticalScrollIndicator={false}>
              <RadioCompany
                data={searchResults?.length > 0 ? searchResults : data}
                handleCloseModal={closeModal}
                setValue={setValue}
              />
            </ScrollView>
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
    height: hScale(38),
    marginTop: scale(8),
    borderWidth: scale(1),
    borderColor: '#D1D3DB',
    backgroundColor: '#F9F9FB',
    paddingLeft: scale(16),
    paddingHorizontal: scale(16),
    justifyContent: 'center',
  },
  optionsModal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  optionsModalContainer: {
    height: height / 2.3,
    paddingBottom: scale(10),
    backgroundColor: colors.white,
  },
  contentContainer: {
    height: height / 2.3,
    backgroundColor: colors.white,
  },
  label: {
    color: colors.black,
    fontSize: fontSize.size14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    lineHeight: scale(22),
  },
  placeholder: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(6),
    color: '#525252',
  },
  placeholder_two: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(6),
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
    alignItems: 'center',
    height: hScale(46),
    paddingHorizontal: scale(16),
    justifyContent: 'space-between',
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
  },
  containerRadio: {
    marginHorizontal: scale(16),
  },
  search: {
    marginBottom: scale(16),
    marginTop: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#D1D3DB',
    paddingBottom: scale(8),
  },
  btnClose: {
    padding: scale(10),
  },
});

export default CardModalCompany;
