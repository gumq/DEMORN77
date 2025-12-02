import {
  setIsSubmitting,
  updateDetailCreditLimit,
  updateInformationSAP,
  updateListCreditLimit,
  updateListCurrencyType,
  updateListEntryCreditLimit,
  updateListObjectsType,
  updateListPaymentTimes,
  updateListRecommendedType,
  updateListSalesType,
  updateListPartnerGroup,
  updateListDataFilter,
} from '../accCredit_Limit/slide';
import {
  ApiCreditLimitProposal_GetSAPInfo,
  ApiCategoryGenerals_GetByType,
  ApiCreditLimitProposal_Get,
  ApiCreditLimitProposal_GetById,
  ApiEntrys_GetByFactorID,
  ApiEntrys_GetByFactorEntry,
  ApiCreditLimitProposal_GetListCategories,
  ApiCreditLimitProposal_GetInfoSale,
  ApiCreditLimitProposal_GetInfoGuarantee,
  ApiCustomerProfiles_GetInfo,
} from '@api';

const fetchListCreditLimit = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  // console.log('body',body)
  try {
    const {data} = await ApiCreditLimitProposal_Get(body);
    // console.log('data',data)
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListCreditLimit(result));
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

const fetchDetailCreditLimit = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiCreditLimitProposal_GetById(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateDetailCreditLimit(result));
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
const fetchListCategoryType = () => async dispatch => {
  dispatch(setIsSubmitting(true));
  const body = {
    CategoryType:
      'ProposalType,SalesPolicy,TermsOfPayment,SalesType,CurrencyType,ObjectType,PartnerGroup',
  };
  try {
    const {data} = await ApiCategoryGenerals_GetByType(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListPaymentTimes(result?.TermsOfPayment));
          dispatch(updateListSalesType(result?.SalesType));
          dispatch(updateListObjectsType(result?.ObjectType));
          dispatch(updateListCurrencyType(result?.CurrencyType));
          dispatch(updateListPartnerGroup(result?.PartnerGroup));
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
const fetchListRecommendedType = () => async dispatch => {
  dispatch(setIsSubmitting(true));
  const body = {
    FactorID: 'Credit',
  };
  try {
    const {data} = await ApiEntrys_GetByFactorID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListRecommendedType(result));
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
const fetchInformationSAP = body => async dispatch => {
  console.log('body', body);
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiCreditLimitProposal_GetInfoSale(body);
    console.log('datadddddd', data);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateInformationSAP(result));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false));
      }
    }
  } catch (error) {
    console.log('error', error);
  }
};

const fetchListEntryCredit = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiEntrys_GetByFactorEntry(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListEntryCreditLimit(result));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false));
      }
    }
  } catch (error) {
    console.log('error', error);
  }
};

const fetchListDataFilter = () => async dispatch => {
  dispatch(setIsSubmitting(true));
  const body = {
    FactorID: 'string',
    EntryID: 'string',
  };
  try {
    const {data} = await ApiCreditLimitProposal_GetListCategories(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListDataFilter(result));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false));
      }
    }
  } catch (error) {
    console.log('error', error);
  }
};
const fetchApiCreditLimitProposal_GetInfoGuarantee = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiCreditLimitProposal_GetInfoGuarantee(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        return result;
      } else {
        dispatch(setIsSubmitting(false));
        return false;
      }
    } else {
      dispatch(setIsSubmitting(false));
      return false;
    }
  } catch (error) {
    dispatch(setIsSubmitting(false));
    return false;
  }
};
const fetchApiCustomerProfiles_GetInfo = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiCustomerProfiles_GetInfo(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        return result;
      } else {
        dispatch(setIsSubmitting(false));
        return false;
      }
    } else {
      dispatch(setIsSubmitting(false));
      return false;
    }
  } catch (error) {
    dispatch(setIsSubmitting(false));
    return false;
  }
};
export {
  fetchListCreditLimit,
  fetchDetailCreditLimit,
  fetchListRecommendedType,
  fetchListCategoryType,
  fetchInformationSAP,
  fetchListEntryCredit,
  fetchListDataFilter,
  fetchApiCreditLimitProposal_GetInfoGuarantee,
  fetchApiCustomerProfiles_GetInfo,
};
