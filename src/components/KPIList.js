/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {colors, fontSize} from '@themes';
import {scale} from '@utils/resolutions';;
import ProgressBar from './ProgressBar';

const formatNumber = n => {
  if (typeof n === 'number') return n.toLocaleString();
  return n ?? '';
};

const KPIList = ({data}) => {
  if (!data || !data.thongTinKPI) return null;

  return (
    <FlatList
      data={data.thongTinKPI.duLieu}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <View style={styles.item}>
          <View style={styles.row}>
            <Text style={styles.ten}>{item.ten}</Text>
            <Text style={styles.giaTri}>
              {formatNumber(item.giaTri)} {item.donVi}
            </Text>
          </View>

          <View style={styles.progressWrap}>
            <ProgressBar
              value={item.giaTri}
              total={item.total}
              color={item.color}
              height={scale(8)}
            />
          </View>
        </View>
      )}
    />
  );
};

export default KPIList;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(12),
    backgroundColor: colors.white,
    borderRadius: scale(12),
    padding: scale(8),
    shadowColor: colors.black,
    shadowRadius: scale(6),
  },
  header: {
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    // marginBottom: scale(8),
    color: colors.black,
  },
  item: {
    paddingVertical: scale(4),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(2),
  },
  ten: {
    fontSize: fontSize.size14,
    color: colors.black,
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    lineHeight: scale(22),
  },
  giaTri: {
    fontSize: fontSize.size14,
    fontWeight: '600',
    color: '#172554',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(22),
    textAlign: 'right',
  },
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tatCaText: {
    marginLeft: scale(8),
    fontSize: fontSize.size12,
    color: colors.gray300,
    fontFamily: 'Inter-Regular',
  },
  separator: {
    height: scale(1),
    backgroundColor: colors.gray200,
    marginTop: scale(8),
  },
});
