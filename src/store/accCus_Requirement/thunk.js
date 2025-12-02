import {
  setIsSubmitting,
  updateListCustomerRequirements,
  updateDetailCustomerRequirement,
  updateListCustomerRequestType,
  updateListDepartment,
  updateListItemTypes,
  updateListEntry,
  updateListGoodsType,
  updateListDataGoodType,
  updateListCodeProduct,
} from '../accCus_Requirement/slide';
import {
  ApiCategoryGenerals_GetByType,
  ApiCategoryGeneralTrees_GetByLevel,
  ApiCustomerRequests_Get,
  ApiCustomerRequests_GetByID,
  ApiCustomerRequests_GetItem,
  ApiCategoryGenerals_Get,
  ApiConditionKeys_GetConfigs,
  ApiEntrys_GetByFactorEntry,
} from '@api';

const fetchListCusRequirements = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiCustomerRequests_Get();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListCustomerRequirements(result));
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

const fetchDetailCusRequirement = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiCustomerRequests_GetByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateDetailCustomerRequirement(result));
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

const fetchListCategoryTypeCusRequirement = () => async dispatch => {
  const body = { CategoryType: "CustomerRequestType" }
  try {
    const { data } = await ApiCategoryGenerals_GetByType(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListCustomerRequestType(result?.CustomerRequestType));
          resolve();
        });
      } else {
        console.log('fetchListCategoryTypeCusRequirement', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchListCategoryTypeCusRequirement', error);
  }
};

const fetchListDepartment = () => async dispatch => {
  const body = {
    CategoryType: "SalesRoutes",
    Level: 1
  }
  try {
    const { data } = await ApiCategoryGeneralTrees_GetByLevel(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListDepartment(result));
          resolve();
        });
      } else {
        console.log('fetchListDepartment', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchListDepartment', error);
  }
};

const fetchCodeProduct = (body) => async dispatch => {
  try {
    const { data } = await ApiCustomerRequests_GetItem(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListCodeProduct(result[0]))
          resolve();
        });
      } else {
        console.log('fetchCodeProduct', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchCodeProduct', error);
  }
};

const fetchListItemType = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiCategoryGenerals_Get(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListItemTypes(result));
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

const fetchListEntry = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiEntrys_GetByFactorEntry(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListEntry(result));
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

const fetchListGoodsTypes = () => async dispatch => {
  const body = {
    CategoryType: "GoodsTypes"
  }
  try {
    const { data } = await ApiCategoryGenerals_GetByType(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListGoodsType(result?.GoodsTypes))
          resolve();
        });
      } else {
        console.log('fetchListGoodsTypes', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchListGoodsTypes', error);
  }
};

const fetchDataGoodsTypes = (body) => async dispatch => {
  try {
    const { data } = await ApiConditionKeys_GetConfigs(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListDataGoodType(result))
          resolve();
        });
      } else {
        console.log('fetchDataGoodsTypes', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchDataGoodsTypes', error);
  }
};

export {
  fetchListCusRequirements,
  fetchDetailCusRequirement,
  fetchListCategoryTypeCusRequirement,
  fetchListDepartment,
  fetchListItemType,
  fetchListEntry,
  fetchListGoodsTypes,
  fetchDataGoodsTypes,
  fetchCodeProduct
}
