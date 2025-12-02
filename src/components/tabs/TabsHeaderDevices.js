import React, {useRef} from 'react';
import {View, StyleSheet, FlatList, Dimensions, Text} from 'react-native';

import {Button} from '../buttons';
import {scale} from '@resolutions';
import {colors, fontSize} from '@themes';

const {width} = Dimensions.get('window');

const TabsHeaderDevices = ({
  data,
  selected,
  onSelect,
  style,
  tabWidth,
  TK = false,
}) => {
  const flatListRef = useRef(null);

  const _keyExtractor = (item, index) => `${item.id}-${index}`;

  const _renderItem = ({item}) => {
    let isSelected = item.id === selected.id;
    return (
      <Button
        key={item.id}
        style={[
          styles.btn,
          {width: width / tabWidth},
          isSelected && styles.btnActive,
        ]}
        onPress={() => {
          onSelect(item);
          const index = data.findIndex(i => i.id === item.id);
          flatListRef.current.scrollToIndex({index, animated: true});
        }}>
        <Text
          style={
            isSelected
              ? TK === true
                ? styles.textActiveTK
                : styles.textActive
              : TK === true
              ? styles.textTK
              : styles.text
          }>
          {item.label}
        </Text>
      </Button>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        bounces={false}
        alwaysBounceHorizontal={false}
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  btn: {
    width: width,
    alignItems: 'center',
    paddingVertical: scale(3),
    borderBottomWidth: 1,
    borderBottomColor: '#C8C8C8',
    backgroundColor: colors.white,
  },
  btnActive: {
    borderBottomColor: '#3B82F6',
  },
  textActive: {
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#3B82F6',
    fontSize: fontSize.size14,
    marginTop: scale(11),
    lineHeight: scale(22),
  },
  text: {
    fontWeight: '400',
    color: '#9CA0AF',
    fontSize: fontSize.size14,
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
    marginTop: scale(11),
    marginBottom: scale(11),
  },
  textActiveTK: {
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#3B82F6',
    fontSize: fontSize.size14,
    // marginTop: scale(11),
    lineHeight: scale(22),
  },
  textTK: {
    fontWeight: '400',
    color: '#9CA0AF',
    fontSize: fontSize.size14,
    fontFamily: 'Inter-Regular',
    lineHeight: scale(22),
    // marginTop: scale(11),
    // marginBottom: scale(0),
  },
});

export default TabsHeaderDevices;
