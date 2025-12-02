import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Modal from 'react-native-modal';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, FlatList } from 'react-native';
import { SvgXml } from 'react-native-svg';
import SearchBar from '../SearchBar';
import { close_blue, close_white, radio, radio_active } from 'svgImg';
import { scale, hScale } from '@resolutions';
import { colors, fontSize } from 'themes';
import SearchModal from 'components/SearchModal';

const { height } = Dimensions.get('window');

const UnifiedModalSelect = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [data, setData] = useState([]);
  const [onSelect, setOnSelect] = useState(() => { });
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useImperativeHandle(ref, () => ({
    open: ({ title, data, onSelect, defaultValue }) => {
      setTitle(title);
      setData(data);
      setOnSelect(() => onSelect);
      setSearchText('');
      setSearchResults(data);
      setSelectedItem(defaultValue || null);
      setVisible(true);
    },
    close: () => setVisible(false),
  }));

  const handleSelect = (item) => {
    setSelectedItem(item);
    onSelect?.(item);
    setVisible(false);
  };

  const onSearch = (text) => {
    setSearchText(text);
    if (!text) {
      setSearchResults(data);
    } else {
      const result = SearchModal(data, text);
      setSearchResults(result);
    }
  };

  return (
    <Modal
      useNativeDriver
      backdropOpacity={0.5}
      isVisible={visible}
      onBackdropPress={() => setVisible(false)}
      onBackButtonPress={() => setVisible(false)}
      style={styles.modal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <SvgXml xml={close_white} />
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={() => setVisible(false)} style={styles.btnClose}>
            <SvgXml xml={close_blue} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.search}>
            <SearchBar
              value={searchText}
              onChangeText={onSearch}
            />
          </View>

          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => `${item?.ID || item?.UserID || index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.itemText}>
                  {item?.Name || item?.UserFullName || item?.EntryName || item?.ItemName || item?.OID}
                </Text>
                <SvgXml
                  xml={selectedItem?.ID === item?.ID ? radio_active : radio}
                />
              </TouchableOpacity>
            )}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            windowSize={10}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: height / 2.2,
    backgroundColor: colors.white,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
  },
  header: {
    height: hScale(46),
    paddingHorizontal: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
  },
  title: {
    fontSize: fontSize.size16,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
    flex: 1,
  },
  btnClose: {
    padding: scale(10),
  },
  content: {
    paddingHorizontal: scale(16),
    flex: 1,
  },
  search: {
    marginTop: scale(16),
    marginBottom: scale(12),
  },
  scroll: {
    flexGrow: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#D1D3DB',
  },
  itemText: {
    fontSize: fontSize.size14,
    color: colors.black,
    width: '85%',
  },
});

export default UnifiedModalSelect;
