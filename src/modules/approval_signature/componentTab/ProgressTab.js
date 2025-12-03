/* eslint-disable react-native/no-inline-styles */
import React, {useMemo, useState} from 'react';
import moment from 'moment';
import {colors, fontSize} from '@themes';
import {stylesProgress, stylesAllApproval} from '../styles';
import {View, Text, FlatList, Platform} from 'react-native';
import {noData} from '@svgImg';
import {SvgXml} from 'react-native-svg';
import {useSelector} from 'react-redux';
import {translateLang} from '@store/accLanguages/slide';
import {scale} from '@utils/resolutions';;

const ProgressTab = ({itemData}) => {
  const languageKey = useSelector(translateLang);
  const [lines, setLines] = useState(0);

  // 🧠 Chuẩn hóa dữ liệu: có thể là JSON string hoặc mảng object
  const progress = useMemo(() => {
    try {
      if (!itemData) return [];

      // Nếu là mảng thật
      if (Array.isArray(itemData)) {
        return itemData;
      }

      // Nếu có JsonColumn là string
      if (typeof itemData?.JsonColumn === 'string') {
        const parsed = JSON.parse(itemData.JsonColumn);
        return Array.isArray(parsed) ? parsed : [];
      }

      return [];
    } catch (err) {
      console.log('Lỗi parse JsonColumn:', err);
      return [];
    }
  }, [itemData]);

  // 🧩 Xóa trùng lặp nếu có
  const uniqueProgress = useMemo(() => {
    return progress?.filter(
      (value, index, self) =>
        index ===
        self.findIndex(t => JSON.stringify(t) === JSON.stringify(value)),
    );
  }, [progress]);
  const latestItem = useMemo(() => {
    if (!uniqueProgress?.length) return null;
    return uniqueProgress.reduce((latest, current) => {
      return moment(current.CreateDate).isAfter(moment(latest.CreateDate))
        ? current
        : latest;
    });
  }, [uniqueProgress]);

  const renderStopItem = ({item}) => {
    const isLatest = item?.CreateDate === latestItem?.CreateDate;

    return (
      <View>
        <View style={stylesProgress.itemContainer}>
          <View
            style={[
              stylesProgress.circle,
              {
                backgroundColor: isLatest ? colors.orange : '#D1D3DB',
              },
            ]}
          />
          <View
            style={[
              item?.ApprovalNote !== ''
                ? stylesProgress.line2
                : lines?.toString() === '2'
                ? stylesProgress.line2
                : stylesProgress.line,
              {},
            ]}
          />
          <Text
            onTextLayout={e => {
              Platform.OS === 'android'
                ? setLines(e.nativeEvent.lines.length)
                : null;
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[
              stylesProgress.stopText,
              {
                fontWeight: isLatest ? 'bold' : 'normal',
              },
            ]}>
            {item.PositionName?.trim() || '---'} - {item.UserFullName || '---'}{' '}
            - {item.ApprovalStatusName || item.StatusName || '---'}
          </Text>
        </View>

        {item?.CreateDate && (
          <Text
            style={[
              {
                marginTop: scale(8),
                fontSize: fontSize.size12,
                lineHeight: scale(18),
                //
                color: colors.graySystem,
                fontWeight: '400',
                marginLeft: scale(30),
                marginBottom: scale(4),
              },
            ]}>
            {moment(item?.CreateDate).format('HH:mm DD/MM/YYYY')}
          </Text>
        )}

        {item?.ApprovalNote ? (
          <Text style={stylesProgress.txtApprove}>{item.ApprovalNote}</Text>
        ) : null}
      </View>
    );
  };

  return (
    <View style={stylesProgress.container}>
      {uniqueProgress?.length > 0 ? (
        <FlatList
          data={uniqueProgress}
          renderItem={renderStopItem}
          keyExtractor={(item, index) => `${item.StationID || index}`}
          contentContainerStyle={stylesProgress.list}
          ItemSeparatorComponent={() => (
            <View style={stylesProgress.separator} />
          )}
        />
      ) : (
        <View>
          <Text style={stylesAllApproval.txtHeaderNodata}>
            Không có dữ liệu
          </Text>
          <Text style={stylesAllApproval.txtContent}>Quay lại sau</Text>
        </View>
      )}
    </View>
  );
};

export default ProgressTab;
