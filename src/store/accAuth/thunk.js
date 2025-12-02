import {
  updateUser,
  updateRuleFormatCurrency,
  updateRuleFormatDecimal,
  updateChangePass,
  updateInforCompany,
  setIsSubmitting,
  updateListUserByUserID,
  updateListCustomerByUserID,
  updateListcompany,
  updateIsUpdateOdate,
} from '../accAuth/slide';
import {
  ApiGetCompanyConfig,
  ApiLogin,
  ApiChangeInfoCustomer,
  ApiChangePasswordCustomer,
  ApiGetInfoContact,
  ApiPermissionLists_GetListUsers,
  ApiPermissionLists_GetListCustomers,
  ApiCompanyConfig_GetByUserID,
  Apiuser_GetCurrentUser,
} from '../../action/Api';
import {setToken, setUserInformation, setRefreshToken} from '../../storage';
import {NotifierAlert} from '../../components';

const fetchCompanyConfig = () => async dispatch => {
  try {
    const {data} = await ApiGetCompanyConfig();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result.CompanyInfo;
      if (result.length > 0) {
        await new Promise(resolve => {
          dispatch(updateRuleFormatCurrency(result[0].FormatCurrency));
          dispatch(updateRuleFormatDecimal(result[0].FormatDecimal));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false));
      }
    } else {
      dispatch(setIsSubmitting(false));
    }
  } catch (error) {
    dispatch(updateRuleFormatCurrency('VN'));
    dispatch(updateRuleFormatDecimal(2));
  }
};

const fetchLogin = (body, navigation, setShowOptions) => async dispatch => {
  try {
    const {data} = await ApiLogin(body);
    if (data.StatusCode === 200 && data.ErrorCode === '0') {
      let result = data.Result;
      if (result[0]?.Token) {
        await new Promise(resolve => {
          dispatch(updateUser(result[0]));
          setToken(JSON.stringify(result[0].Token));
          setRefreshToken(JSON.stringify(result[0].RefreshToken));
          setUserInformation(JSON.stringify(result[0]));
          setShowOptions(false);
          resolve();
        });
        navigation.navigate('TabNavigator');
      }
    } else {
      setShowOptions(false);
      NotifierAlert(3000, 'Thông báo', `${data.Message}`, 'error');
      setTimeout(() => {
        setShowOptions(true);
      }, 500);
    }
  } catch (err) {
    setShowOptions(true);
    NotifierAlert(3000, 'Thông báo', `${data.Message}`, 'error');
  }
};

const fetchChooseCompany = body => async dispatch => {
  try {
    const {data} = await ApiLogin(body);
    if (data.StatusCode === 200 && data.ErrorCode === '0') {
      let result = data.Result;
      await new Promise(resolve => {
        dispatch(fetchCompanyConfig());
        dispatch(updateUser(result[0]));
        dispatch(setToken(JSON.stringify(result[0].Token)));
        dispatch(setUserInformation(JSON.stringify(result[0])));
        resolve();
      });
    } else {
      NotifierAlert(3000, 'Thông báo', `${data.Message}`, 'error');
    }
  } catch (err) {
    console.log('err', err);
  }
};
const fetchApiChangeInfo = body => async dispatch => {
  try {
    const {data} = await ApiChangeInfoCustomer(body);
    if (data.StatusCode === 200 && data.ErrorCode === '0') {
      let result = data.Result;
      // console.log('result', result);
      if (result) {
        if (result?.[0]?.UserFullName) {
          dispatch(updateUser(result[0]));
          setUserInformation(JSON.stringify(result[0]));
        }
        NotifierAlert(3000, 'Thông báo', `${data.Message}`, 'success');
        return true;
      }
    } else {
      NotifierAlert(3000, 'Thông báo', `${data.Message}`, 'success');
      return false;
    }
  } catch (err) {
    NotifierAlert(3000, 'Thông báo', `${err}`, 'success');
    return false;
  }
};

const fetchChangePass = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiChangePasswordCustomer(body);
    if (data.StatusCode === 200 && data.ErrorCode === '0') {
      let result = data.Result;
      dispatch(setIsSubmitting(false));
      await new Promise(resolve => {
        dispatch(updateChangePass(result[0]));
        resolve();
      });
      NotifierAlert(3000, 'Thông báo', `${data.Message}`, 'success');
    } else {
      dispatch(setIsSubmitting(false));
      NotifierAlert(3000, 'Thông báo', `${data.Message}`, 'error');
    }
  } catch (err) {
    dispatch(setIsSubmitting(false));
    console.log('err', err);
  }
};

const fetchChangeInfoCustomer = body => async dispatch => {
  try {
    const {data} = await ApiChangeInfoCustomer(body);
    if (data.StatusCode === 200 && data.ErrorCode === '0') {
      let result = data.Result;
      if (result) {
        NotifierAlert(3000, 'Thông báo', `${data.Message}`, 'success');
      }
    } else {
      NotifierAlert(3000, 'Thông báo', `${data.Message}`, 'error');
    }
  } catch (err) {
    NotifierAlert(3000, 'Thông báo', `${err}`, 'error');
  }
};

const fetchInforCompany = () => async dispatch => {
  try {
    const {data} = await ApiGetInfoContact();
    if (data.StatusCode === 200 && data.ErrorCode === '0') {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateInforCompany(result[0]));
          resolve();
        });
      }
    } else {
      NotifierAlert(3000, 'Thông báo', `${data.Message}`, 'error');
    }
  } catch (err) {
    console.log('fetchInforCompany', err);
  }
};
const fetchApiCompanyConfig_GetByUserID = () => async dispatch => {
  try {
    const {data} = await ApiCompanyConfig_GetByUserID();
    console.log('data', data);
    if (data.StatusCode === 200 && data.ErrorCode === '0') {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListcompany(result));
          resolve();
        });
      }
    } else {
      NotifierAlert(3000, 'Thông báo', `${data.Message}`, 'error');
    }
  } catch (err) {
    console.log('fetchInforCompany', err);
  }
};
const fetchApiuser_GetCurrentUser = () => async dispatch => {
  try {
    const {data} = await Apiuser_GetCurrentUser();
    console.log('data', data);
    if (data.StatusCode === 200 && data.ErrorCode === '0') {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListcompany(result?.Company));
          dispatch(updateIsUpdateOdate(result?.IsEditODate));
          resolve();
        });
      }
    } else {
      NotifierAlert(3000, 'Thông báo', `${data.Message}`, 'error');
    }
  } catch (err) {
    console.log('fetchInforCompany', err);
  }
};
const fetchListUserByUserID = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiPermissionLists_GetListUsers(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          const dataFilter = result?.filter(item => item.IsActive === 1);
          dispatch(updateListUserByUserID(dataFilter));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false));
      }
    } else {
      dispatch(setIsSubmitting(false));
    }
  } catch (error) {
    console.log('error', error);
  }
};

const fetchListCustomerByUserID = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiPermissionLists_GetListCustomers(body);
    // console.log('1', data);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListCustomerByUserID(result));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false));
      }
    } else {
      dispatch(setIsSubmitting(false));
    }
  } catch (error) {
    console.log('error', error);
  }
};

export {
  fetchCompanyConfig,
  fetchLogin,
  fetchChooseCompany,
  fetchChangePass,
  fetchChangeInfoCustomer,
  fetchInforCompany,
  fetchListUserByUserID,
  fetchListCustomerByUserID,
  fetchApiCompanyConfig_GetByUserID,
  fetchApiChangeInfo,
  fetchApiuser_GetCurrentUser,
};
