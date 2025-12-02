import {
  setIsSubmitting,
  updateListPaymentRequests,
  updateDetailPaymentRequest,
  updateListEntryPayment,
  updateListAccountReceiver,
  updateListOrder,
  updateDetailConfirmRequest
} from '../accDeposit_Payment/slide';
import {
 
  ApiCategoryGenerals_GetByType,
  ApiEntrys_GetByFactorID,
  ApiEntrys_GetByFactorEntry,
  ApiPaymentRequests_Get,
  ApiPaymentRequests_GetByID,
  ApiSaleOrders_GetByCustomerID,
  ApiPaymentConfirmations_GetByID
} from '@api';

const fetchListPaymentRequest = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiPaymentRequests_Get();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListPaymentRequests(result));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false))
      }
    } else {
      dispatch(setIsSubmitting(false))
    }
  } catch (error) {
    console.log('error', error);
  }
};

const fetchDetailPaymentRequest = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiPaymentRequests_GetByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateDetailPaymentRequest(result));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false))
      }
    } else {
      dispatch(setIsSubmitting(false))
    }
  } catch (error) {
    console.log('error', error);
  }
};
const fetchListEntryPayment = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiEntrys_GetByFactorEntry(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListEntryPayment(result));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false))
      }
    } else {
      dispatch(setIsSubmitting(false))
    }
  } catch (error) {
    console.log('error', error);
  }
};

const fetchListAccountReceiver = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  const body = {
    CategoryType: "BankAccount"
  }
  try {
    const { data } = await ApiCategoryGenerals_GetByType(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListAccountReceiver(result?.BankAccount));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false))
      }
    } else {
      dispatch(setIsSubmitting(false))
    }
  } catch (error) {
    console.log('error', error);
  }
};

const fetchListOrder = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiSaleOrders_GetByCustomerID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListOrder(result));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false))
      }
    } else {
      dispatch(setIsSubmitting(false))
    }
  } catch (error) {
    console.log('error', error);
  }
};

const fetchDetailConfirmRequest = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiPaymentConfirmations_GetByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateDetailConfirmRequest(result));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false))
      }
    } else {
      dispatch(setIsSubmitting(false))
    }
  } catch (error) {
    console.log('error', error);
  }
};

export {
  fetchListPaymentRequest,
  fetchDetailPaymentRequest,
  fetchListEntryPayment,
  fetchListAccountReceiver,
  fetchListOrder,
  fetchDetailConfirmRequest
}
