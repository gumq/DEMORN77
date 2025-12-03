import React, {useMemo, useState} from 'react';
import moment from 'moment';
import {colors, fontSize} from '@themes';
import {stylesProgress, styles} from '../styles';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {arrow_down_big, arrow_next_gray, noData} from '@svgImg';
import {SvgXml} from 'react-native-svg';
import {useSelector} from 'react-redux';
import {translateLang} from '@store/accLanguages/slide';
import {scale} from '@utils/resolutions';;

const ProgressTab = ({detailCustomerClosedMove, dataBXD}) => {
  const languageKey = useSelector(translateLang);
  const latestItem = detailCustomerClosedMove?.Progress?.reduce(
    (latest, current) => {
      return moment(current.CreateDate).isAfter(moment(latest.CreateDate))
        ? current
        : latest;
    },
    detailCustomerClosedMove?.Progress?.[0],
  );
  const [showInformation, setShowInformation] = useState({
    Progress: true,
    BXD: true,
  });
  const toggleInformation = key => {
    setShowInformation(prev => ({...prev, [key]: !prev[key]}));
  };
  console.log('detailCustomerClosedMove', detailCustomerClosedMove);
  const renderStopItem = ({item}) => {
    const isLatest = item?.CreateDate === latestItem?.CreateDate;

    return (
      <View>
        <View style={stylesProgress.itemContainer}>
          <View
            style={[
              stylesProgress.circle,
              {
                backgroundColor: isLatest ? colors.blue : '#D1D3DB',
              },
            ]}
          />
          <View style={stylesProgress.line} />
          <Text
            style={[
              stylesProgress.stopText,
              {
                fontWeight: isLatest ? 'bold' : 'normal',
              },
            ]}>
            {item.Description} - {item.StatusName}
          </Text>
        </View>
        <Text style={stylesProgress.txtDate}>
          {moment(item.CreateDate).format('HH:mm DD/MM/YYYY')}
        </Text>
        {item?.ApprovalNote ? (
          <Text style={stylesProgress.txtApprove}>{item?.ApprovalNote}</Text>
        ) : null}
      </View>
    );
  };
  const renderProcessItem = ({item, index}) => {
    const stepNumber = typeof item.Step === 'number' ? item.Step : index + 1;
    const approverText =
      item.ApproverNames?.length > 0
        ? item.ApproverNames
        : item.DefaultApproverName;
    return (
      <View style={localStyles.flowItem}>
        <Text style={localStyles.flowTitle}>
          Bước {stepNumber} - {item.Description}
        </Text>
        {approverText ? (
          <Text style={localStyles.flowSubtitle}>{approverText}</Text>
        ) : (
          <Text style={localStyles.flowSubtitleMuted}>Nhân viên đề xuất</Text>
        )}
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
  //   return (
  //     <View style={stylesProgress.container}>
  //       {detailCustomerClosedMove?.Progress?.length > 0 ? (
  //         <FlatList
  //           data={detailCustomerClosedMove?.Progress}
  //           renderItem={({item}) => renderStopItem({item})}
  //           keyExtractor={item => item.StationID}
  //           contentContainerStyle={stylesProgress.list}
  //           ItemSeparatorComponent={() => (
  //             <View style={stylesProgress.separator} />
  //           )}
  //         />
  //       ) : (
  //         <View>
  //           <Text style={styles.txtHeaderNodata}>{languageKey('_no_data')}</Text>
  //           <Text style={styles.txtContent}>{languageKey('_we_will_back')}</Text>
  //           <SvgXml xml={noData} style={styles.imgEmpty} />
  //         </View>
  //       )}
  //     </View>
  //   );
  return (
    <View
      style={[
        stylesProgress.container,
        {paddingHorizontal: 0, paddingTop: 0, paddingBottom: scale(16)},
      ]}>
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
          {detailCustomerClosedMove?.Progress?.length > 0 ? (
            <FlatList
              data={detailCustomerClosedMove.Progress}
              renderItem={renderStopItem}
              keyExtractor={(item, idx) => item.StationID ?? String(idx)}
              contentContainerStyle={stylesProgress.list}
              ItemSeparatorComponent={() => (
                <View style={stylesProgress.separator} />
              )}
            />
          ) : (
            <View style={localStyles.noDataBox}>
              <Text style={styles.txtHeaderNodata}>
                {languageKey('_no_data')}
              </Text>
              <Text style={styles.txtContent}>
                {languageKey('_we_will_back')}
              </Text>
              {/* <SvgXml xml={noData} style={styles.imgEmpty} /> */}
            </View>
          )}
        </View>
      )}

      {/* Luồng duyệt header */}
      <TouchableOpacity
        style={[localStyles.header, {marginTop: 0}]}
        onPress={() => toggleInformation('BXD')}>
        <Text style={localStyles.headerTitle}>Luồng duyệt</Text>
        <SvgXml xml={showInformation.BXD ? arrow_down_big : arrow_next_gray} />
      </TouchableOpacity>

      {showInformation.BXD && (
        <View style={localStyles.sectionContent}>
          {infoDetails && infoDetails.length > 0 ? (
            <FlatList
              data={infoDetails}
              renderItem={renderProcessItem}
              scrollEnabled={true}
              keyExtractor={(item, idx) =>
                item.ID ? String(item.ID) : String(idx)
              }
              ListFooterComponent={
                <View style={{height: scale(200), width: '100%'}}></View>
              }
            />
          ) : (
            <View style={localStyles.noDataBox}>
              <Text style={styles.txtHeaderNodata}>
                {languageKey('_no_data')}
              </Text>
              <Text style={styles.txtContent}>
                {languageKey('_we_will_back')}
              </Text>
              {/* <SvgXml xml={noData} style={styles.imgEmpty} /> */}
            </View>
          )}
        </View>
      )}
    </View>
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
  header1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(10),
    backgroundColor: colors.backgroundColor,
    // paddingHorizontal: scale(12),
  },
  headerTitle: {
    fontSize: fontSize.size14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    // marginHorizontal: scale(12),
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
});
export default ProgressTab;
