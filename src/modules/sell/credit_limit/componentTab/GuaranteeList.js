// GuaranteeList.js
import React from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import moment from 'moment';
import {scale} from 'utils/resolutions';
import {colors, fontSize} from 'themes';
import {useSelector} from 'react-redux';
import {translateLang} from 'store/accLanguages/slide';

/**
 * Expect item shape:
 * {
 *   CustomerName,
 *   TotalDebit,
 *   TotalOverDebit,
 *   NotDueDebit,
 *   GrantedLimitAmntSO,
 *   GrantedLimitDateSO (ISO string)
 * }
 */

const formatNumber = v => {
  const n = Number(v || 0);
  if (isNaN(n)) return '-';
  return n === 0 ? '0' : n.toLocaleString('en-US');
};

const getDateRange = isoDate => {
  if (!isoDate) return {from: '', to: ''};
  const from = moment(isoDate);
  // use +1 month for "to" if no explicit to given
  const to = from.clone().add(1, 'month');
  return {
    from: from.format('DD/MM/YYYY'),
    to: to.format('DD/MM/YYYY'),
  };
};

const GuaranteeCard = ({item, onPress}) => {
  const name = item?.CustomerName || '-';
  const granted = item?.GrantedLimitAmntSO || item?.GrantedLimitSO || 0;
  const totalDebit = item?.TotalDebit || 0;
  const notDue = item?.NotDueDebit || 0;
  const overDebit = item?.TotalOverDebit || 0;

  const {from, to} = getDateRange(item?.GrantedLimitDateSO);
  const languageKey = useSelector(translateLang);
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress && onPress(item)}
      style={localStyles.cardWrapper}>
      <View style={localStyles.cardInner}>
        <View
          style={{
            borderBottomWidth: scale(1),
            borderBottomColor: '#D4D4D4',
            marginBottom: scale(8),
          }}>
          <Text style={localStyles.title} numberOfLines={2}>
            {name}
          </Text>
        </View>
        <View style={localStyles.row}>
          <Text style={localStyles.leftLabel}>{languageKey('_limit')}</Text>
          <Text style={localStyles.rightValue}>{formatNumber(granted)}</Text>
        </View>

        <View style={localStyles.row}>
          <Text style={localStyles.leftLabel}>Công nợ hiện tại</Text>
          <Text style={localStyles.rightValue}>{formatNumber(totalDebit)}</Text>
        </View>

        <View style={localStyles.row}>
          <Text style={localStyles.leftLabel}>Công nợ trong hạn</Text>
          <Text style={localStyles.rightValue}>{formatNumber(notDue)}</Text>
        </View>

        <View style={localStyles.row}>
          <Text style={localStyles.leftLabel}>Hạn mức bảo lãnh</Text>
          <Text style={localStyles.rightValue}>
            {/* if you have a different field for guarantee limit, replace */}
            {formatNumber(item?.GrantedLimitAmntSO || 0)}
          </Text>
        </View>

        <View style={[localStyles.row, {marginTop: scale(0)}]}>
          <Text style={localStyles.leftLabel}>Hiệu lực</Text>
          <Text style={localStyles.rightValueSmall}>
            {from} {from && to ? '-' : ''} {to}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const GuaranteeList = ({data = [], onPressItem}) => {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <FlatList
      data={data}
      keyExtractor={(item, idx) => `${item.CustomerName || 'g'}-${idx}`}
      renderItem={({item}) => (
        <GuaranteeCard item={item} onPress={onPressItem} />
      )}
      contentContainerStyle={localStyles.listContainer}
      ItemSeparatorComponent={() => <View style={{height: scale(10)}} />}
      showsVerticalScrollIndicator={false}
    />
  );
};

const localStyles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: scale(12),
    paddingTop: scale(6),
    paddingBottom: scale(12),
  },
  cardWrapper: {
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  cardInner: {
    backgroundColor: colors.white,
    borderRadius: scale(8),
    borderWidth: scale(1),
    borderColor: '#D4D4D4',
    padding: scale(12),
  },
  title: {
    fontSize: fontSize.size16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: scale(8),
    lineHeight: scale(22),
    fontFamily: 'Inter-SemiBold',
    borderBottomWidth: scale(1),
    borderBottomColor: colors.gray52,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(0),
  },
  leftLabel: {
    flex: 1,
    textAlign: 'left',
    fontSize: fontSize.size16,
    fontWeight: '400',
    color: '#0A0A0A',
    marginBottom: scale(8),
    lineHeight: scale(24),
    fontFamily: 'Inter-Regular',
  },
  rightValue: {
    minWidth: scale(110),
    textAlign: 'right',
    fontSize: fontSize.size16,
    fontWeight: '400',
    color: colors.gray52,
    marginBottom: scale(8),
    lineHeight: scale(24),
    fontFamily: 'Inter-Regular',
  },
  rightValueSmall: {
    minWidth: scale(110),
    textAlign: 'right',
    fontSize: fontSize.size16,
    fontWeight: '400',
    color: colors.gray52,
    marginBottom: scale(0),
    lineHeight: scale(24),
    fontFamily: 'Inter-Regular',
  },
});

export default GuaranteeList;
