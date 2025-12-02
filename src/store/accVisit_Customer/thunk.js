import {
  setIsSubmitting,
  updateListPlanVisitCustomer,
  updateDetailVisitCustomer,
  updateListProducts,
  updateListUnitProducts,
  updateListSalesRoutes,
  updateListCustomerForPlan,
  updateListCancelReason,
  updateListCustomerOffRoute,
  updateListCustomer,
} from '../accVisit_Customer/slide';
import {
  ApiCategoryGenerals_Get,
  ApiItems_Get,
  ApiCategoryGeneralTrees_GetByListID,
  ApiPlanForUsers_Get,
  ApiPlanForUsers_GetById,
  ApiVisitForUsers_GetById,
  ApiPlanForUsers_GetListCustomers,
  ApiCategoryGenerals_GetByType,
  ApiVisitForUsers_GETOFFSchedule,
  ApiVisitForUsers_Get,
} from '@api';

const fetchListPlanVisitCustomer = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  const body = {OID: '0'};
  try {
    const {data} = await ApiPlanForUsers_Get(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListPlanVisitCustomer(result));
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

const fetchListVisitCustomer = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiVisitForUsers_Get(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListCustomer(result));
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

const fetchDetailPlanVisitCustomer = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiPlanForUsers_GetById(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateDetailApprovalListProcess(result));
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

const fetchDetailVisitCustomer = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiVisitForUsers_GetById(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateDetailVisitCustomer(result));
          resolve();
        });
      } else {
        dispatch(updateDetailVisitCustomer(null));
        dispatch(setIsSubmitting(false));
      }
    } else {
      dispatch(setIsSubmitting(false));
    }
  } catch (error) {
    console.log('error', error);
  }
};

const fetchListProducts = () => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiItems_Get();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListProducts(result));
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

const fetchListUnitProducts = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  const body = {
    CategoryType: 'Units',
  };
  try {
    const {data} = await ApiCategoryGenerals_Get(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListUnitProducts(result));
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

const fetchListSalesRoutes = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiCategoryGeneralTrees_GetByListID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListSalesRoutes(result));
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

const fetchListCustomerForPlan = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiPlanForUsers_GetListCustomers(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListCustomerForPlan(result));
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

const fetchListCancelReason = () => async dispatch => {
  dispatch(setIsSubmitting(true));
  const body = {CategoryType: 'VisitCancelReason'};
  try {
    const {data} = await ApiCategoryGenerals_GetByType(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListCancelReason(result?.VisitCancelReason));
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

const fetchListCustomerOffRoute = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiVisitForUsers_GETOFFSchedule(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListCustomerOffRoute(result));
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
  fetchListPlanVisitCustomer,
  fetchDetailPlanVisitCustomer,
  fetchDetailVisitCustomer,
  fetchListUnitProducts,
  fetchListProducts,
  fetchListSalesRoutes,
  fetchListCustomerForPlan,
  fetchListCancelReason,
  fetchListCustomerOffRoute,
  fetchListVisitCustomer,
};
