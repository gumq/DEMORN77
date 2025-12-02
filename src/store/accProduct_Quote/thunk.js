import {
  setIsSubmitting,
  updateDetailProductQuote,
  updateListApprovedPrice,
  updateListApprovedQuote,
  updateListCurrencyUnit,
  updateListCustPricingProcedures,
  updateListdetailsPrice,
  updateListEntry,
  updateListGoodTypes,
  updateListItemsProduct,
  updateListPaymentTimes,
  updateListPriceGroup,
  updateListProductQuote,
  updateListSaleChannel,
} from '../accProduct_Quote/slide';
import {
  ApiCategoryGenerals_GetByType,
  ApiEntrys_GetByFactorEntry,
  ApiPricePolicy_GetActive,
  ApiQuotation_EditPrice,
  ApiQuotation_Get,
  ApiQuotation_GetById,
  ApiQuotation_GetItems,
  ApiQuotations_GetActive,
} from '@api';

const fetchListProductQuote = () => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiQuotation_Get();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListProductQuote(result));
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

const fetchApiQuotation_EditPrice = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiQuotation_EditPrice(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListdetailsPrice(result));
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

const fetchDetailProductQuote = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiQuotation_GetById(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateDetailProductQuote(result));
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

const fetchListCategoryTypeQuote = () => async dispatch => {
  dispatch(setIsSubmitting(true));
  const body = {
    CategoryType:
      'TermsOfPayment,CurrencyType,SalesChannel,PriceGroup,GoodsTypes,CustPricingProcedures',
  };
  try {
    const {data} = await ApiCategoryGenerals_GetByType(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListPaymentTimes(result?.TermsOfPayment));
          dispatch(updateListCurrencyUnit(result?.CurrencyType));
          dispatch(updateListSaleChannel(result?.SalesChannel));
          dispatch(updateListPriceGroup(result?.PriceGroup));
          dispatch(updateListGoodTypes(result?.GoodsTypes));
          dispatch(
            updateListCustPricingProcedures(result?.CustPricingProcedures),
          );
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

const fetchListEntryQuote = body => async dispatch => {
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

const fetchListItemsProduct = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiQuotation_GetItems(body);
    console.log('data', data);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListItemsProduct(result));
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

const fetchListApprovedPrice = () => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiPricePolicy_GetActive();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListApprovedPrice(result));
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

const fetchListApprovedQuote = () => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiQuotations_GetActive();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListApprovedQuote(result));
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
  fetchDetailProductQuote,
  fetchListProductQuote,
  fetchListCategoryTypeQuote,
  fetchListEntryQuote,
  fetchListApprovedPrice,
  fetchListApprovedQuote,
  fetchListItemsProduct,
  fetchApiQuotation_EditPrice
};
