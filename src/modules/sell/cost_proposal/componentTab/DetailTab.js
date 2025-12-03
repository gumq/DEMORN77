/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import moment from 'moment';
import RNFS from 'react-native-fs';
import {SvgXml} from 'react-native-svg';
import {useSelector} from 'react-redux';
import {
  View,
  Text,
  Alert,
  Linking,
  ScrollView,
  Platform,
  FlatList,
} from 'react-native';

import {stylesDetail, stylesFormCostProposal} from '../styles';
import {arrow_down_big, downFile, viewFile_gray} from '@svgImg';
import {translateLang} from '@store/accLanguages/slide';
import {Button} from '@components';

const DetailTab = ({detailCostProposal, itemData}) => {
  const languageKey = useSelector(translateLang);
  const {listExpenseType} = useSelector(state => state.CostProposal);
  const [isShowInforGeneral, setIsShowInforGeneral] = useState(false);

  const handleShowInforGeneral = () => {
    setIsShowInforGeneral(!isShowInforGeneral);
  };

  const handleViewFile = fileUrl => {
    if (fileUrl) {
      Linking.openURL(fileUrl)
        .then(() => console.log('Mở file'))
        .catch(err => Alert.alert('Error', languageKey('_cannot_open_file')));
    } else {
      Alert.alert('Error', languageKey('_file_error'));
    }
  };

  const handleDownloadFile = async url => {
    const fileName = url.split('/').pop();
    const downloadPath =
      Platform.OS === 'android'
        ? RNFS.DownloadDirectoryPath + `/${fileName}`
        : RNFS.DocumentDirectoryPath + `/${fileName}`;

    RNFS.downloadFile({
      fromUrl: url,
      toFile: downloadPath,
    })
      .promise.then(result => {
        Alert.alert(
          'Download',
          `${languageKey('_download_success')} ${downloadPath}`,
        );
        if (Platform.OS === 'android') {
          Linking.openURL(`file://${downloadPath}`);
        }
      })
      .catch(error => {
        Alert.alert(
          languageKey('_download_failed'),
          languageKey('_error_download_file'),
        );
      });
  };

  const itemLinks = detailCostProposal?.Link
    ? detailCostProposal.Link.split(';').map(link => ({
        Content: link.split('/').pop(),
        Link: link,
      }))
    : [];

  const _keyExtractor = (item, index) => `${item.ID}-${index}`;
  const _renderItem = ({item}) => {
    const enxpenseType = listExpenseType.find(
      expense => expense?.ID === item.ExpenseTypeID,
    );
    return (
      <View style={stylesDetail.cardItem}>
        <Text style={stylesDetail.txtTitleItem}>{enxpenseType?.Name}</Text>
        <View style={stylesDetail.bodyCardItem}>
          <View style={stylesDetail.containerContentCard}>
            <Text style={stylesDetail.txtDescription}>
              {languageKey('_amount')}
            </Text>
            <Text style={stylesDetail.txtItem}>{item?.Total}</Text>
          </View>
          <View style={stylesDetail.containerContentCard}>
            <Text style={stylesDetail.txtDescription}>
              {languageKey('_explain')}
            </Text>
            <Text style={stylesDetail.txtItem}>{item?.Content}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={stylesDetail.scrollView}
      showsVerticalScrollIndicator={false}>
      <View style={stylesFormCostProposal.containerHeader}>
        <Text style={stylesFormCostProposal.header}>
          {languageKey('_information_general')}
        </Text>
        <Button
          style={stylesFormCostProposal.btnShowInfor}
          onPress={handleShowInforGeneral}>
          <SvgXml xml={arrow_down_big} />
        </Button>
      </View>
      <View style={stylesDetail.cardProgram}>
        <View style={stylesDetail.bodyCard}>
          <View style={stylesDetail.containerGeneralInfor}>
            <View style={[stylesDetail.containerBodyCard, {width: '50%'}]}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_ct_code')}
              </Text>
              <Text style={stylesDetail.contentBody}>{itemData?.OID}</Text>
            </View>
            <View style={[stylesDetail.containerBodyCard, {width: '50%'}]}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_ct_day')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {moment(itemData?.ODate).format('DD/MM/YYYY')}
              </Text>
            </View>
          </View>
          {itemData?.ProposalType ? (
            <View style={stylesDetail.containerBodyCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_recommended_type')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {itemData?.ProposalType}
              </Text>
            </View>
          ) : null}
          {itemData?.ReferenceID ? (
            <View style={stylesDetail.containerBodyCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_order')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {itemData?.ReferenceID}
              </Text>
            </View>
          ) : null}
          <View style={stylesDetail.containerGeneralInfor}>
            <View style={[stylesDetail.containerBodyCard, {width: '50%'}]}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_order_date')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {moment(itemData?.DeliveryDueDate).format('DD/MM/YYYY')}
              </Text>
            </View>
            <View style={[stylesDetail.containerBodyCard, {width: '50%'}]}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_order_deadline')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {moment(itemData?.DeliveryDueDate).format('DD/MM/YYYY')}
              </Text>
            </View>
          </View>
          {itemData?.ProposalReason ? (
            <View style={stylesDetail.containerBodyCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_suggested_reason')}
              </Text>
              <Text style={stylesDetail.contentBody}>
                {itemData?.ProposalReason}
              </Text>
            </View>
          ) : null}
          {itemData?.Note ? (
            <View style={stylesDetail.containerBodyCard}>
              <Text style={stylesDetail.txtHeaderBody}>
                {languageKey('_note')}
              </Text>
              <Text style={stylesDetail.contentBody}>{itemData?.Note}</Text>
            </View>
          ) : null}
        </View>
        <View style={stylesDetail.containerTableFile}>
          <Text style={stylesDetail.txtHeaderDoc}>
            {languageKey('_attached_files')}
          </Text>
          <View style={stylesDetail.tableWrapper}>
            <View style={stylesDetail.rowTable}>
              {itemLinks.map((item, index) => (
                <View
                  style={[
                    stylesDetail.cell,
                    index === itemLinks.length - 1 && stylesDetail.lastCell,
                  ]}
                  key={index}>
                  <Text style={stylesDetail.contentTime}>{item.Content}</Text>
                  <View style={stylesDetail.btnDoc}>
                    <Button onPress={() => handleViewFile(item.Link)}>
                      <SvgXml xml={viewFile_gray} />
                    </Button>
                    <Button onPress={() => handleDownloadFile(item.Link)}>
                      <SvgXml xml={downFile} />
                    </Button>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
      <View style={stylesFormCostProposal.containerAdd}>
        <Text style={stylesFormCostProposal.header}>
          {languageKey('_proposed_cost')}
        </Text>
      </View>
      <View style={stylesDetail.cardProgram}>
        <FlatList
          data={detailCostProposal?.Details}
          renderItem={_renderItem}
          keyExtractor={_keyExtractor}
          contentContainerStyle={stylesDetail.containerFlatlist}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
};

export default DetailTab;
