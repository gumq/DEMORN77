/* eslint-disable prettier/prettier */
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, StatusBar, ScrollView, LogBox} from 'react-native';
import Pdf from 'react-native-pdf';
import {styles} from './styles';
import {translateLang} from '@store/accLanguages/slide';
import {
  CardModalSelect,
  HeaderBack,
  LoadingModal,
  SearchBar,
  SearchModal,
  TabsHeaderDevices,
} from '@components';
import {
  AllApprovalProcess,
  Approved,
  Canceled,
  Completed,
  Hadaplan,
  RefuseApproval,
  RejectedBySuperiors,
  WaitingApprovalProcess,
} from './componentTab';
import {
  fetchApprovalListProcess,
  fetchListCustomers,
  fetchListFilter,
  fetchListUser,
} from '@store/accApproval_Signature/thunk';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

const ApprovalSignatureScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  const [valueFilter, setValueFilter] = useState(null);
  const [searchText, setSearchText] = useState('');
    const {userInfo} = useSelector(state => state.Login);
  const {isSubmitting, approvalListProcess, listFilter} = useSelector(
    state => state.ApprovalProcess,
  );
  const dataFilter = useMemo(
    () => listFilter?.map(item => item?.Child || []).flat(),
    [listFilter],
  );

  const TAB_APPROVAL_PROCESS = useMemo(
    () => [
      {id: 1, label: languageKey('_all')},
      {id: 2, label: languageKey('_waiting_approval')},
      {id: 3, label: languageKey('_approved')},
      {id: 4, label: languageKey('_refuse')},
      { id: 5, label: languageKey('_superiors_refused') },
      { id: 6, label: languageKey('_canceled') },
      { id: 7, label: languageKey('_there_plans') },
      { id: 8, label: languageKey('_completed') },
    ],
    [languageKey],
  );
  const [selectedTab, setSelectTab] = useState(TAB_APPROVAL_PROCESS[0]);

  const [searchResults, setSearchResults] = useState(approvalListProcess || []);
  useEffect(() => {
    setSearchResults(approvalListProcess || []);
  }, [approvalListProcess]);

  const filterApprovalList = useMemo(() => {
    if (valueFilter) {
      return searchResults?.filter(
        item => item?.EntryID === valueFilter?.EntryID,
      );
    }
    return searchResults;
  }, [searchResults, valueFilter]);

  const selectTabEvent = useCallback(item => {
    setSelectTab(item);
  }, []);

  const onChangeText = useCallback(
    textSearch => {
      setSearchText(textSearch);
      if (textSearch?.length) {
        const resultsData = SearchModal(approvalListProcess, textSearch);
        setSearchResults(resultsData);
      } else {
        setSearchResults(approvalListProcess);
      }
    },
    [approvalListProcess],
  );

  useEffect(() => {
    dispatch(fetchListCustomers());
    dispatch(fetchListUser({CmpnID: userInfo?.CmpnID}));

    const today = new Date();
    const toDateObj = new Date(today);
    toDateObj.setDate(toDateObj.getDate() + 1);
    const toDate = toDateObj.toISOString().split('T')[0];
    const fromDateObj = new Date(today);
    fromDateObj.setDate(fromDateObj.getDate() - 60);
    const fromDate = fromDateObj.toISOString().split('T')[0];
    const body = {FromDate: fromDate, ToDate: toDate};
    dispatch(fetchApprovalListProcess(body));
    // dispatch(fetchListFilter(body));

    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchApprovalListProcess(body));
      // dispatch(fetchListFilter(body));
    });
    return unsubscribe;
  }, [navigation, dispatch]);

  return (
    <LinearGradient
      style={styles.container}
      start={{x: 0.44, y: 0.45}}
      end={{x: 1.22, y: 0.25}}
      colors={['#FFFFFF', '#FFFFFF']}
      pointerEvents="box-none">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <SafeAreaView style={styles.container}>
        <HeaderBack
          title={languageKey('_signing_for_approval')}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.scrollView}>
          <View style={styles.containerSearch}>
            <View style={styles.search}>
              <SearchBar value={searchText} onChangeText={onChangeText} />
            </View>
          </View>
          <TabsHeaderDevices
            data={TAB_APPROVAL_PROCESS}
            selected={selectedTab}
            onSelect={selectTabEvent}s
            tabWidth={4}
            TK={true}
          />
          <View style={styles.cardFilter}>
            <CardModalSelect
              title={languageKey('_select_filter')}
              data={dataFilter}
              setValue={setValueFilter}
              value={valueFilter?.EntryName}
              bgColor={'#FAFAFA'}
            />
          </View>

          <ScrollView
            style={styles.containerBody}
            showsVerticalScrollIndicator={false}>
            {selectedTab.id === 1 && (
              <AllApprovalProcess filterApprovalList={filterApprovalList} />
            )}
            {selectedTab.id === 2 && (
              <WaitingApprovalProcess filterApprovalList={filterApprovalList} />
            )}
            {selectedTab.id === 3 && (
              <Approved filterApprovalList={filterApprovalList} />
            )}
            {selectedTab.id === 4 && (
              <RefuseApproval filterApprovalList={filterApprovalList} />
            )}
             {selectedTab.id === 5 && (
            <RejectedBySuperiors filterApprovalList={filterApprovalList} />
          )}
          {selectedTab.id === 6 && (
            <Canceled filterApprovalList={filterApprovalList} />
          )}
          {selectedTab.id === 7 && (
            <Hadaplan filterApprovalList={filterApprovalList} />
          )}
          {selectedTab.id === 8 && (
            <Completed filterApprovalList={filterApprovalList} />
          )}
          </ScrollView>
        </View>
      </SafeAreaView>
      <LoadingModal visible={isSubmitting} />
    </LinearGradient>
  );
};

export default ApprovalSignatureScreen;
