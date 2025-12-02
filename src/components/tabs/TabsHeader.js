/* eslint-disable prettier/prettier */
import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
  Pressable,
  Platform,
  Text,
} from 'react-native';
import {heScale, scale} from '@resolutions';
import {colors, fontSize} from '@themes';

const {width} = Dimensions.get('window');
const TAB_WIDTH = width / 2;
const TAB_TWO = width / 3;
const TAB_FOUR = width / 4.52;

const TabsHeader = ({
  data = [],
  selected,
  onSelect,
  style,
  tabWidth,
  four = false,
}) => {
  const scrollViewRef = useRef(null);
  const translateX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(
    data.findIndex(item => item.id === selected?.id),
  );

  useEffect(() => {
    const index = data.findIndex(item => item.id === selected?.id);
    setCurrentIndex(index);

    Animated.spring(translateX, {
      toValue: index * (four ? TAB_FOUR : tabWidth ? TAB_TWO : TAB_WIDTH),
      useNativeDriver: true,
    }).start();

    scrollViewRef.current?.scrollTo({
      x: index * (four ? TAB_FOUR : tabWidth ? TAB_TWO : TAB_WIDTH),
      animated: true,
    });
  }, [selected, data, four, tabWidth]);

  return (
    <View style={[four ? styles.containerFour : styles.container, style]}>
      <View style={styles.tabContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          scrollEventThrottle={16}>
          {data?.map((item, index) => (
            <View key={`${item.id}_${index}`}>
              <Pressable
                style={[
                  index === 0
                    ? styles.btnHead
                    : index === data?.length - 1
                    ? styles.btnTail
                    : styles.btn,
                  {width: four ? TAB_FOUR : tabWidth ? TAB_TWO : TAB_WIDTH},
                  selected?.id === item.id && four && styles.fourBtn,
                ]}
                onPress={() => onSelect(item)}>
                <Text
                  style={[
                    four ? styles.textfour : styles.text,
                    selected?.id === item.id &&
                      (four ? styles.textActiveFour : styles.textActive),
                  ]}>
                  {item.label}
                </Text>
              </Pressable>

              {!four && (
                <View
                  style={[
                    selected?.id !== item.id && styles.indicatorOff,
                    {width: four ? TAB_FOUR : tabWidth ? TAB_TWO : TAB_WIDTH},
                    four && styles.fourIndicator,
                  ]}
                />
              )}
            </View>
          ))}
        </ScrollView>

        {/* Thanh indicator */}
        {!four && (
          <Animated.View
            style={[
              selected?.id ? styles.indicator : styles.indicatorOff,
              {width: four ? TAB_FOUR : tabWidth ? TAB_TWO : TAB_WIDTH},
              {transform: [{translateX}]},
              four && styles.fourIndicator,
            ]}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: scale(12),
  },
  containerFour: {
    flexDirection: 'row',
    marginHorizontal: scale(0),
    borderRadius: scale(8),
    backgroundColor: colors.blue50,
    paddingVertical: scale(2),
    paddingHorizontal: scale(2),
  },
  tabContainer: {
    position: 'relative',
    borderRadius: scale(12),
  },
  btn: {
    alignItems: 'center',
    paddingVertical: scale(8),
    backgroundColor: colors.blue50,
  },
  btnHead: {
    alignItems: 'center',
    paddingVertical: scale(8),
    backgroundColor: colors.blue50,
    borderTopLeftRadius: scale(8),
    borderBottomLeftRadius: scale(8),
  },
  btnTail: {
    alignItems: 'center',
    paddingVertical: scale(8),
    backgroundColor: colors.blue50,
    borderTopRightRadius: scale(8),
    borderBottomRightRadius: scale(8),
  },
  fourBtn: {
    backgroundColor: '#3B82F6',
    borderBottomWidth: scale(0),
    borderBottomColor: 'transparent',
    borderRadius: scale(8),
  },
  text: {
    fontWeight: '400',
    color: '#9CA0AF',
    fontSize: fontSize.size14,
    fontFamily: 'Inter-Regular',
    lineHeight: scale(18),
  },
  textfour: {
    fontWeight: '600',
    color: '#525252',
    fontSize: Platform.OS === 'ios' ? fontSize.size12 : fontSize.size12,
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(18),
  },
  textActive: {
    fontWeight: '600',
    color: colors.blue,
    fontSize: fontSize.size14,
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(18),
  },
  textActiveFour: {
    fontWeight: '600',
    color: colors.white,
    fontSize: Platform.OS === 'ios' ? fontSize.size12 : fontSize.size12,
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(18),
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: scale(2),
    backgroundColor: colors.blue,
    borderRadius: scale(2),
  },
  indicatorOff: {
    position: 'absolute',
    bottom: 0,
    height: scale(0.8),
    backgroundColor: colors.gray300,
    borderRadius: scale(2),
  },
  fourIndicator: {
    height: scale(3),
    backgroundColor: colors.blue,
  },
});

export default TabsHeader;
