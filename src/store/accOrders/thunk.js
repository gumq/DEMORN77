import {
  updateListOrders,
  updateDetailOrder,
  updateListItems,
  updateListProductTypes,
  updateListDocumentTypes,
  updateListCurrencyType,
  updateListPaymentMethod,
  updateListPriceGroup,
  updateListApplicablePrograms,
  updateListReceivingForm,
  updateListSalesChannel,
  updateListDepositPaymentValues,
  updateListSalesOrders,
  updateListTypeOfOrder,
  setIsSubmitting,
  updateListSalesOrderDocument,
  updateListDeliveryPoints,
  updateListWarehouse,
  updateListAddress,
} from '../accOrders/slide';
import {
  ApiCategoryConfigs_Get,
  ApiCategoryGenerals_GetByType,
  ApiItems_Get,
  ApiSaleOrders_Get,
  ApiSaleOrders_GetByID,
  ApiCategoryGeneralTrees_Get,
  ApiOrders_GetDocuments,
  ApiEntrys_GetByFactorEntry,
  ApiFactors_GetByList,
  ApiOrders_GetAddress,
} from '@api';

const fetchListOrders = () => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiSaleOrders_Get();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListOrders(result));
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
const fetchDetailOrder = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiSaleOrders_GetByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateDetailOrder(result));
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

const fetchListCategoryTypeOrder = () => async dispatch => {
  const body = {CategoryType: 'PriceGroup'};
  try {
    const {data} = await ApiCategoryGenerals_GetByType(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListPriceGroup(result?.PriceGroup));
          resolve();
        });
      } else {
        console.log('fetchListCategoryTypeOrder', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchListCategoryTypeOrder', error);
  }
};

const fetchListItems = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiItems_Get(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListItems(result));
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

const fetchListQuoteContractNumber = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    console.log('', body);
    const {data} = await ApiOrders_GetDocuments(body);
    // console.log('result', data);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListSalesOrderDocument(result));
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

const fetchListTypeOfOrder = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiEntrys_GetByFactorEntry(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListTypeOfOrder(result));
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

const fetchListFactorID = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiFactors_GetByList(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListSalesOrders(result));
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

const fetchListDocumentTypes = body => async dispatch => {
  dispatch(setIsSubmitting(true));
  try {
    const {data} = await ApiCategoryConfigs_Get(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false));
        await new Promise(resolve => {
          dispatch(updateListDocumentTypes(result));
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

const fetchListWareHouse = body => async dispatch => {
  try {
    const {data} = await ApiCategoryGenerals_GetByType(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListWarehouse(result?.Warehouse));
          resolve();
        });
      } else {
        console.log('fetchListWareHouse', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchListWareHouse', error);
  }
};

const fetchListAddress = body => async dispatch => {
  try {
    const {data} = await ApiOrders_GetAddress(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListAddress(result));
          resolve();
        });
      } else {
        console.log('fetchListAddress', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchListAddress', error);
  }
};

export {
  fetchListOrders,
  fetchDetailOrder,
  fetchListItems,
  fetchListCategoryTypeOrder,
  fetchListQuoteContractNumber,
  fetchListTypeOfOrder,
  fetchListDocumentTypes,
  fetchListWareHouse,
  fetchListFactorID,
  fetchListAddress,
};
