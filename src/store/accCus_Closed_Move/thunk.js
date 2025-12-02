import {
  updateListCusCloseMove,
  updateDetailCusCloseMove,
  setIsSubmitting,
  updateListProposalReason,
  updateListSalesChannel,
  updateListCustomerType,
  updateCustomerByCode,
  updateListEntry,
} from '../accCus_Closed_Move/slide';
import {
  ApiCustomerArchived_Get,
  ApiCustomerArchived_GetById,
  ApiCategoryGenerals_GetByType,
  ApiCustomerSalesAccesses_GetByTaxCode,
  ApiEntrys_GetByFactorEntry,
} from '@api';

const fetchListCusCloseMove = () => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiCustomerArchived_Get();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListCusCloseMove(result));
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
const fetchDetailCusCloseMove = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  console.log('body', body);
  try {
    const {data} = await ApiCustomerArchived_GetById(body);
    // console.log('data',data)
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateDetailCusCloseMove(result));
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

const fetchListCategoryTypeCusClosed = () => async dispatch => {
  const body = {
    CategoryType: 'ProposalReason,SalesChannel,CustomerType',
  };
  try {
    const {data} = await ApiCategoryGenerals_GetByType(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListCustomerType(result?.CustomerType));
          dispatch(updateListProposalReason(result?.ProposalReason));
          dispatch(updateListSalesChannel(result?.SalesChannel));
          resolve();
        });
      } else {
        console.log('fetchListCategoryTypeCusClosed', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchListCategoryTypeCusClosed', error);
  }
};
const fetchListEntryMV = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiEntrys_GetByFactorEntry(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListEntry(result));
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
const fetchCustomerByCode = body => async dispatch => {
  console.log(body);
  try {
    const {data} = await ApiCustomerSalesAccesses_GetByTaxCode(body);
    console.log('aaaa', data);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      dispatch(updateCustomerByCode(result));
    } else {
      dispatch(updateCustomerByCode(null));
    }
  } catch (error) {
    console.log('fetchCustomerByCode', error);
  }
};

export {
  fetchListCusCloseMove,
  fetchDetailCusCloseMove,
  fetchListCategoryTypeCusClosed,
  fetchCustomerByCode,
  fetchListEntryMV,
};
