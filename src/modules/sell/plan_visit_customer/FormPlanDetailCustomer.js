import React, {useCallback, useEffect, useState} from 'react';
import moment from 'moment';
import _ from 'lodash';
import {SvgXml} from 'react-native-svg';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  FlatList,
  LogBox,
  Platform,
} from 'react-native';

import routes from '@routes';
import {trash} from 'svgImg';
import {scale} from '@resolutions';
import {stylesFormDetail} from './styles';
import {translateLang} from 'store/accLanguages/slide';
import {Button, CustomPicker, HeaderBack, NotifierAlert} from 'components';
import {
  ApiPlanForUsers_AddDetail,
  ApiPlanForUsers_AddPlan,
  ApiPlanForUsers_EditPlan,
  ApiPlanForUsers_SubmitPlan,
} from 'action/Api';

const FormPlanDetailCustomer = ({route}) => {
  const item = route?.params?.item;
  const editPlan = route?.params?.editPlan;
  const fromDateUpdate = route?.params?.fromDateUpdate;
  const toDateUpdate = route?.params?.toDateUpdate;
  const navigation = useNavigation();
  const languageKey = useSelector(translateLang);
  // const { listCustomerForPlan } = useSelector(state => state.VisitCustomer);
  const {listCustomerByUserID} = useSelector(state => state.Login);
  const [isConfirmPlan, setIsConfirmPlan] = useState(false);
  const listCustomerApproval = listCustomerByUserID?.filter(
    item => item.IsClosed === 0 && item.IsCompleted === 1,
  );

  const calculateDates = (fromDate, toDate) => {
    const start = moment(fromDate).startOf('day');
    const end = moment(toDate).startOf('day');
    const dates = [];

    while (start.isSameOrBefore(end)) {
      dates.push(start.format('DD/MM/YYYY'));
      start.add(1, 'days');
    }
    return dates;
  };

  const dates = calculateDates(fromDateUpdate, toDateUpdate);

  const initializeSchedule = () => {
    return dates.map(date => {
      const formattedDate = moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY');

      const matchingPlans = item?.Plan?.filter(plan => {
        const planDate = moment(plan.PlanDate).format('DD/MM/YYYY');
        return planDate === formattedDate;
      });

      const customers =
        matchingPlans?.flatMap(plan => {
          const matchingSchedules = (item?.Schedule || []).filter(schedule => {
            return String(schedule.PlanScheduleID) === String(plan.ID);
          });

          const customerIDs = matchingSchedules.map(
            schedule => schedule.CustomerID,
          );

          return listCustomerApproval.filter(
            customer =>
              Array.isArray(customerIDs) && customerIDs.includes(customer.ID),
          );
        }) || [];

      return {
        date,
        customers,
      };
    });
  };

  const [schedule, setSchedule] = useState(initializeSchedule());

  const removeCustomer = (date, customerId) => {
    setSchedule(prev =>
      prev.map(day =>
        day.date === date
          ? {...day, customers: day.customers.filter(c => c.ID !== customerId)}
          : day,
      ),
    );
  };

  const handleSelectCustomer = (dayIndex, selectedCustomers) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex] = {
      ...updatedSchedule[dayIndex],
      customers: selectedCustomers,
    };
    setSchedule(updatedSchedule);
  };

  const keyExtractor = (item, index) => `${item.date}-${index}`;
  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <View style={stylesFormDetail.row}>
          <Text style={stylesFormDetail.cellDate}>{item.date}</Text>
          <View
            style={[
              stylesFormDetail.cellPicker,
              {borderBottomWidth: item.customers?.length > 0 ? scale(1) : 0},
            ]}>
            <CustomPicker
              data={listCustomerApproval}
              selectedCustomers={item.customers}
              onSelectCustomer={selectedCustomers =>
                handleSelectCustomer(index, selectedCustomers)
              }
            />
          </View>
          <View style={stylesFormDetail.cellCustomers}>
            {item.customers.map((customer, customerIndex) => (
              <View
                key={customerIndex}
                style={[
                  stylesFormDetail.customerItem,
                  customerIndex === item.customers.length - 1
                    ? {borderBottomWidth: 0}
                    : {},
                ]}>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={stylesFormDetail.customerText}>
                  {customer.Name} - {customer?.CustomerGroupCode} (
                  {customer.Visited_Actual}/{customer.NumberOfVisits_ByGroup})
                </Text>
                <Button
                  style={stylesFormDetail.btnRemove}
                  onPress={() => removeCustomer(item.date, customer.ID)}>
                  <SvgXml xml={trash} />
                </Button>
              </View>
            ))}
          </View>
        </View>
      );
    },
    [schedule],
  );

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const saveCreatePlanEvent = _.debounce(
    async () => {
      try {
        const bodyAddPlan = {
          Note: item?.Note,
          Extention1: '',
          Extention2: '',
          Extention3: '',
          Extention4: '',
          Extention5: '',
          Extention6: '',
          Extention7: '',
          Extention8: '',
          Extention9: '',
          Extention10: '',
          Extention11: 'string',
          Extention12: 'string',
          Extention13: 'string',
          Extention14: 'string',
          Extention15: 'string',
          Extention16: 'string',
          Extention17: 'string',
          Extention18: 'string',
          Extention19: 'string',
          Extention20: 'string',
          UserID: item.UserID,
          FactorID: item?.FactorID,
          EntryID: item.EntryID,
          SAPID: '',
          LemonID: '',
          FromDate: fromDateUpdate,
          ToDate: toDateUpdate,
          ApprovalProcessID: 0,
          ApprovalStep: 1,
          ApprovalStatusID: 1,
          ApprovalDate: '',
          ApprovalNote: '',
          IsLock: 0,
          IsDeleted: 0,
          IsActive: 1,
          PlanCode: '',
          PlanName: item?.PlanName,
          PlanName1: item?.PlanName1,
          PlanName2: '',
          PlanName3: '',
          PlanName4: '',
          PlanName5: '',
          PlanName6: '',
          PlanName7: '',
          PlanName8: '',
          PlanName9: '',
          OID: editPlan ? item?.OID : '',
          ODate: item?.ODate,
          CustomerSupportLineID: item?.CustomerSupportLineID,
          Link: item?.Link,
        };
        const resultAddPlan = editPlan
          ? await ApiPlanForUsers_EditPlan(bodyAddPlan)
          : await ApiPlanForUsers_AddPlan(bodyAddPlan);
        const planResults = resultAddPlan.data;

        if (planResults.StatusCode === 200 && planResults.ErrorCode === '0') {
          const planResultsData = resultAddPlan.data.Result;
          let dataJson = [];

          const addedCustomerIds = new Set();

          for (let i = 0; i < planResultsData.length; i++) {
            const plan = planResultsData[i];

            const matchingDay = schedule.find(
              day => day.date === formatDate(plan.PlanDate),
            );

            if (matchingDay) {
              dataJson = dataJson.concat(
                matchingDay.customers
                  .map(customer => {
                    if (
                      !addedCustomerIds.has(
                        `${matchingDay.date}_${customer.ID}`,
                      )
                    ) {
                      addedCustomerIds.add(
                        `${matchingDay.date}_${customer.ID}`,
                      );
                      return {
                        PlanScheduleID: plan.ID,
                        CustomerID: customer.ID,
                        VisitTypeCode: '',
                        Link: '',
                        CheckIn_Lat: 1,
                        CheckIn_Long: 1,
                        CheckInTime: '',
                        CheckOut_Lat: 1,
                        CheckOut_Long: 1,
                        CheckOutTime: '',
                        TotalTime: 0,
                        FeedBack: '',
                        Rival: '1',
                        Status: '1',
                        StationNote: '',
                        StatisticReason: '',
                        Note: '',
                        Extention1: '',
                        Extention2: '',
                        Extention3: '',
                        Extention4: '',
                        Extention5: '',
                        Extention6: '',
                        Extention7: '',
                        Extention8: '',
                        Extention9: '',
                        Extention10: '',
                        ID: '1',
                      };
                    }
                    return null;
                  })
                  .filter(Boolean),
              );
            }
          }

          if (dataJson.length > 0) {
            const bodyAddPlanDetail = {
              dataJson,
            };

            const resultAddDetail = await ApiPlanForUsers_AddDetail(
              bodyAddPlanDetail,
            );
            const dataAddDetail = resultAddDetail?.data;

            if (
              dataAddDetail.StatusCode === 200 &&
              dataAddDetail.ErrorCode === '0'
            ) {
              NotifierAlert(
                3000,
                `${languageKey('_notification')}`,
                `${dataAddDetail.Message}`,
                'success',
              );
              navigation.navigate(routes.PlanVisitCustomerScreen);
            } else {
              NotifierAlert(
                3000,
                `${languageKey('_notification')}`,
                `${dataAddDetail.Message}`,
                'error',
              );
              return;
            }
          }

          setIsConfirmPlan(true);
        } else {
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${planResults.Message}`,
            'error',
          );
        }
      } catch (error) {
        NotifierAlert(
          3000,
          `${languageKey('_notification')}`,
          `${error}`,
          'error',
        );
      }
    },
    2000,
    {leading: true, trailing: false},
  );

  const confirmPlanEvent = _.debounce(
    async () => {
      try {
        const body = {
          OID: item?.OID,
          IsLock: item?.IsLock === 0 ? 1 : 0,
          Note: item?.Note,
        };

        const result = await ApiPlanForUsers_SubmitPlan(body);
        const data = result.data;
        if (data.StatusCode === 200 && data.ErrorCode === '0') {
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${data.Message}`,
            'success',
          );
          navigation.navigate(routes.PlanVisitCustomerScreen);
        } else {
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${data.Message}`,
            'error',
          );
        }
      } catch (error) {
        NotifierAlert(
          3000,
          `${languageKey('_notification')}`,
          `${error}`,
          'error',
        );
      }
    },
    2000,
    {leading: true, trailing: false},
  );

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      style={[
        stylesFormDetail.container,
        {marginBottom: scale(Platform.OS === 'android' ? insets.bottom : 0)},
      ]}
      start={{x: 0.44, y: 0.45}}
      end={{x: 1.22, y: 0.25}}
      colors={['#FFFFFF', '#FFFFFF']}
      pointerEvents="box-none">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <SafeAreaView style={stylesFormDetail.container}>
        <HeaderBack
          title={languageKey('_create_a new_plan')}
          onPress={() => navigation.goBack()}
        />
        <ScrollView
          style={stylesFormDetail.scrollView}
          showsVerticalScrollIndicator={false}>
          <Text style={stylesFormDetail.header}>
            {languageKey('_detail_schedule_plans')}
          </Text>
          <View style={stylesFormDetail.card}>
            <FlatList
              data={schedule}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              contentContainerStyle={stylesFormDetail.containerFlat}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      <View style={stylesFormDetail.containerBtnConfirm}>
        <Button style={stylesFormDetail.btnSave} onPress={saveCreatePlanEvent}>
          <Text style={stylesFormDetail.txtBtnSave}>
            {languageKey('_save')}
          </Text>
        </Button>
        <Button
          style={stylesFormDetail.btnConfirm}
          onPress={confirmPlanEvent}
          disabled={editPlan || isConfirmPlan ? false : true}>
          <Text style={stylesFormDetail.txtBtnConfirm}>
            {languageKey('_confirm')}
          </Text>
        </Button>
      </View>
    </LinearGradient>
  );
};

export default FormPlanDetailCustomer;
