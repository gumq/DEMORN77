/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import moment from 'moment';
import {SvgXml} from 'react-native-svg';
import {useSelector} from 'react-redux';
import {translateLang} from 'store/accLanguages/slide';
import {colors, fontSize} from 'themes';
import {arrow_down_big, arrow_next_gray, noData} from 'svgImg';
import {stylesProgress, styles} from '../styles'; // stylesProgress should include the object you pasted
import {scale} from 'utils/resolutions';

const ProgressTab = ({detailCreditLimit, dataBXD}) => {
  const languageKey = useSelector(translateLang);
  const [lines, setLines] = useState(0);
  const latestItem = useMemo(() => {
    const arr = detailCreditLimit?.Progress ?? [];
    if (!arr || arr.length === 0) return null;
    return arr.reduce((latest, current) => {
      return moment(current.CreateDate).isAfter(moment(latest.CreateDate))
        ? current
        : latest;
    }, arr[0]);
  }, [detailCreditLimit]);

  const [showInformation, setShowInformation] = useState({
    Progress: true,
    BXD: true,
  });
  const toggleInformation = key => {
    setShowInformation(prev => ({...prev, [key]: !prev[key]}));
  };

  const renderStopItem = ({item, index}) => {
    const isLatest = latestItem && item?.CreateDate === latestItem?.CreateDate;
    // use the stylesProgress you provided: itemContainer, circle, line, stopText, txtDate, txtApprove
    return (
      <View>
        <View style={stylesProgress.itemContainer}>
          <View
            style={[
              stylesProgress.circle,
              {
                backgroundColor: isLatest
                  ? colors.blue
                  : stylesProgress.circle.backgroundColor,
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

        <Text style={stylesProgress.txtDate}>
          {item.CreateDate
            ? moment(item.CreateDate).format('HH:mm DD/MM/YYYY')
            : ''}
        </Text>

        {item?.ApprovalNote ? (
          <Text style={stylesProgress.txtApprove}>{item.ApprovalNote}</Text>
        ) : null}
      </View>
    );
  };

  // const renderProcessItem = ({item, index}) => {
  //   const stepNumber = typeof item.Step === 'number' ? item.Step : index + 1;
  //   const approverText =
  //     item.ApproverNames?.length > 0
  //       ? item.ApproverNames
  //       : item.DefaultApproverName;
  //   return (
  //     <View style={localStyles.flowItem}>
  //       <Text style={localStyles.flowTitle}>
  //         Bước {stepNumber} - {item.Description}
  //       </Text>
  //       {approverText ? (
  //         <Text style={localStyles.flowSubtitle}>{approverText}</Text>
  //       ) : (
  //         <Text style={localStyles.flowSubtitleMuted}>Nhân viên đề xuất</Text>
  //       )}
  //     </View>
  //   );
  // };
  // ở đầu component FormCreditLimitScreen (hoặc nơi renderProcessItem có thể truy cập)
  const activeStepCount =
    (detailCreditLimit?.Progress && detailCreditLimit.Progress.length - 1) || 0;

  const renderProcessItem = ({item, index}) => {
    // bước hiện tại (1-based)
    const stepNumber = typeof item.Step === 'number' ? item.Step : index + 1;

    // active nếu index < activeStepCount (bật xanh cho các bước từ 1..activeStepCount)
    const isActive = index < activeStepCount;

    const approverText =
      item.ApproverNames && item.ApproverNames.length > 0
        ? item.ApproverNames
        : item.DefaultApproverName;

    const isLast = index === (infoDetails?.length ?? 1) - 1; // dùng infoDetails (mảng luồng) để xác định last

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingVertical: scale(8),
        }}>
        {/* Left marker: circle + vertical line */}
        <View
          style={{
            width: scale(16),
            alignItems: 'center',
            position: 'relative',
            marginRight: scale(8),
          }}>
          <View
            style={[
              stylesProgress.circle,
              {backgroundColor: isActive ? colors.blue : '#D1D3DB'},
            ]}
          />
          {!isLast && (
            <View
              style={[
                stylesProgress.line2,
                {backgroundColor: isActive ? colors.blue + '33' : '#E6E9EE'},
              ]}
            />
          )}
        </View>

        {/* Content */}
        <View style={stylesProgress.flowItem}>
          <Text
            style={[
              stylesProgress.flowTitle,
              {fontWeight: isActive ? '700' : '600', marginLeft: scale(8)},
            ]}>
            Bước {stepNumber} - {item.Description}
          </Text>

          {approverText ? (
            <Text
              style={[
                stylesProgress.flowSubtitle,
                {marginTop: scale(8), marginLeft: scale(8)},
              ]}>
              {approverText}
            </Text>
          ) : (
            <Text style={stylesProgress.flowSubtitleMuted}>{''}</Text>
          )}
        </View>
      </View>
    );
  };
  const infoDetails = useMemo(() => {
    const arr = dataBXD?.InfoDetail ?? [];
    return [...arr]
      .filter(i => i.Step !== 98 && i.Step !== 99)
      .sort((a, b) => {
        if (typeof a.Step === 'number' && typeof b.Step === 'number')
          return a.Step - b.Step;
        return 0;
      });
  }, [dataBXD]);

  // return (
  //   <View style={stylesProgress.container}>
  //     {/* Tiến độ header */}
  //     <TouchableOpacity
  //       style={localStyles.header}
  //       onPress={() => toggleInformation('Progress')}>
  //       <Text style={localStyles.headerTitle}>Tiến độ</Text>
  //       <SvgXml
  //         xml={showInformation.Progress ? arrow_down_big : arrow_next_gray}
  //       />
  //     </TouchableOpacity>

  //     {showInformation.Progress && (
  //       <View style={localStyles.sectionContent}>
  //         {detailCreditLimit?.Progress?.length > 0 ? (
  //           <FlatList
  //             data={detailCreditLimit.Progress}
  //             renderItem={renderStopItem}
  //             keyExtractor={(item, idx) => item.StationID ?? String(idx)}
  //             contentContainerStyle={stylesProgress.list}
  //             ItemSeparatorComponent={() => (
  //               <View style={stylesProgress.separator} />
  //             )}
  //           />
  //         ) : (
  //           <View style={localStyles.noDataBox}>
  //             <Text style={styles.txtHeaderNodata}>
  //               {languageKey('_no_data')}
  //             </Text>
  //             <Text style={styles.txtContent}>
  //               {languageKey('_we_will_back')}
  //             </Text>
  //             {/* <SvgXml xml={noData} style={styles.imgEmpty} /> */}
  //           </View>
  //         )}
  //       </View>
  //     )}

  //     {/* Luồng duyệt header */}
  //     <TouchableOpacity
  //       style={[localStyles.header, {marginTop: 0}]}
  //       onPress={() => toggleInformation('BXD')}>
  //       <Text style={localStyles.headerTitle}>Luồng duyệt</Text>
  //       <SvgXml xml={showInformation.BXD ? arrow_down_big : arrow_next_gray} />
  //     </TouchableOpacity>

  //     {showInformation.BXD && (
  //       <View style={localStyles.sectionContent}>
  //         {infoDetails && infoDetails.length > 0 ? (
  //           <FlatList
  //             data={infoDetails}
  //             showsVerticalScrollIndicator={false}
  //             renderItem={renderProcessItem}
  //             keyExtractor={(item, idx) =>
  //               item.ID ? String(item.ID) : String(idx)
  //             }
  //             contentContainerStyle={{
  //               paddingBottom: scale(infoDetails?.length * scale(22)),
  //             }}
  //           />
  //         ) : (
  //           <View style={localStyles.noDataBox}>
  //             <Text style={styles.txtHeaderNodata}>
  //               {languageKey('_no_data')}
  //             </Text>
  //             <Text style={styles.txtContent}>
  //               {languageKey('_we_will_back')}
  //             </Text>
  //             {/* <SvgXml xml={noData} style={styles.imgEmpty} /> */}
  //           </View>
  //         )}
  //       </View>
  //     )}
  //   </View>
  // );
  return (
    // Outer FlatList chịu scroll toàn cục
    <FlatList
      data={[1]} // dummy single item; tất cả UI nằm trong ListHeaderComponent
      keyExtractor={i => String(i)}
      contentContainerStyle={{paddingBottom: scale(20)}}
      // dùng header component để chứa toàn bộ nội dung
      ListHeaderComponent={() => (
        <View style={stylesProgress.container}>
          {/* Tiến độ header */}
          <TouchableOpacity
            style={localStyles.header}
            onPress={() => toggleInformation('Progress')}>
            <Text style={localStyles.headerTitle}>Tiến độ</Text>
            <SvgXml
              xml={showInformation.Progress ? arrow_down_big : arrow_next_gray}
            />
          </TouchableOpacity>

          {showInformation.Progress && (
            <View style={localStyles.sectionContent}>
              {detailCreditLimit?.Progress?.length > 0 ? (
                // inner FlatList 1 - không scroll độc lập
                <FlatList
                  data={detailCreditLimit.Progress}
                  renderItem={renderStopItem}
                  keyExtractor={(item, idx) => item.StationID ?? String(idx)}
                  contentContainerStyle={stylesProgress.list}
                  ItemSeparatorComponent={() => (
                    <View style={stylesProgress.separator} />
                  )}
                  scrollEnabled={false}
                  nestedScrollEnabled={false}
                  removeClippedSubviews={false}
                />
              ) : (
                <View style={localStyles.noDataBox}>
                  <Text style={styles.txtHeaderNodata}>
                    {languageKey('_no_data')}
                  </Text>
                  <Text style={styles.txtContent}>
                    {languageKey('_we_will_back')}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Luồng duyệt header */}
          <TouchableOpacity
            style={[localStyles.header, {marginTop: 0}]}
            onPress={() => toggleInformation('BXD')}>
            <Text style={localStyles.headerTitle}>Luồng duyệt</Text>
            <SvgXml
              xml={showInformation.BXD ? arrow_down_big : arrow_next_gray}
            />
          </TouchableOpacity>

          {showInformation.BXD && (
            <View style={localStyles.sectionContent}>
              {infoDetails && infoDetails.length > 0 ? (
                // inner FlatList 2 - không scroll độc lập
                <FlatList
                  data={infoDetails}
                  showsVerticalScrollIndicator={false}
                  renderItem={renderProcessItem}
                  keyExtractor={(item, idx) =>
                    item.ID ? String(item.ID) : String(idx)
                  }
                  contentContainerStyle={{
                    paddingBottom: scale(infoDetails?.length * 22),
                  }}
                  scrollEnabled={false} // KHÔNG cho scroll riêng
                  nestedScrollEnabled={false} // Android: disable nested scroll
                  removeClippedSubviews={false}
                />
              ) : (
                <View style={localStyles.noDataBox}>
                  <Text style={styles.txtHeaderNodata}>
                    {languageKey('_no_data')}
                  </Text>
                  <Text style={styles.txtContent}>
                    {languageKey('_we_will_back')}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      )}
    />
  );
};

const localStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(10),
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: scale(12),
  },
  headerTitle: {
    fontSize: fontSize.size20,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    lineHeight: scale(28),
    marginHorizontal: scale(12),
  },
  sectionContent: {
    backgroundColor: colors.white,
    paddingTop: scale(8),
    paddingHorizontal: scale(12),
    paddingBottom: scale(8),
  },
  noDataBox: {
    alignItems: 'center',
    paddingVertical: scale(12),
  },
  flowItem: {
    paddingVertical: scale(10),
    paddingLeft: scale(4),
  },
  flowTitle: {
    fontSize: fontSize.size14,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    lineHeight: scale(22),
  },
  flowSubtitle: {
    marginTop: scale(6),
    color: '#444',
    fontSize: fontSize.size14,
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    lineHeight: scale(22),
  },
  flowSubtitleMuted: {
    marginTop: scale(6),
    color: '#9B9B9B',
    fontSize: fontSize.size14,
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
    lineHeight: scale(22),
  },
   cardFooter1: {
    backgroundColor: colors.white,
    paddingTop: scale(8),
    paddingBottom: scale(8),
    // marginBottom: scale(16),
    marginHorizontal: scale(16),
    marginVertical: scale(8),
    borderRadius: scale(12),
  },
});

export default ProgressTab;
