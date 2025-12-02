import {
  updateListInventories,
  updateDetailInventory,
  setIsSubmitting,
  updateListCancelReason,
  updateListProposalGoods,
  updateListGoodsTypes,
  updateListWarehouse,
  updateListItem,
  updateListFactory,
  updateDetailKeepSales,
} from '../accInventory/slide';
import {
  ApiSaleInventorys_Get,
  ApiSaleInventorys_GetItem,
  ApiCategoryGenerals_GetByType,
  ApiSaleInventoryKeeps_Get,
  ApiCategoryGeneralTrees_GetByType,
  ApiItems_GetByGoodTypeID,
  ApiSaleInventoryKeeps_GetByID
} from '@api';

const fetchListInventories = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiSaleInventorys_Get(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListInventories(result));
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
const fetchDetailInventory = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiSaleInventorys_GetItem(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateDetailInventory(result));
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

const fetchListGoodTypes = () => async dispatch => {
  const body = { CategoryType: "GoodsTypes" }
  try {
    const { data } = await ApiCategoryGenerals_GetByType(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListGoodsTypes(result?.GoodsTypes));
          resolve();
        });
      } else {
        console.log('fetchListGoodTypes', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchListGoodTypes', error);
  }
};
const fetchListProposalGoods = () => async dispatch => {
  try {
    const { data } = await ApiSaleInventoryKeeps_Get();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListProposalGoods(result));
          resolve();
        });
      } else {
        console.log('fetchListProposalGoods', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchListProposalGoods', error);
  }
};

const fetchListWarehouseFactory = () => async dispatch => {
  const body = { CategoryType: "Factory,Warehouse,CancelReason" }
  try {
    const { data } = await ApiCategoryGeneralTrees_GetByType(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListFactory(result?.Factory));
          dispatch(updateListWarehouse(result?.Warehouse));
          dispatch(updateListCancelReason(result?.CancelReason))
          resolve();
        });
      } else {
        console.log('fetchListWarehouseFactory', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchListWarehouseFactory', error);
  }
};

const fetchListCancelReason = () => async dispatch => {
  const body = { CategoryType: "CancelReason" }
  try {
    const { data } = await ApiCategoryGenerals_GetByType(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListCancelReason(result?.CancelReason))
          resolve();
        });
      } else {
        console.log('fetchListCancelReason', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchListCancelReason', error);
  }
};

const fetchListItems = (body) => async dispatch => {
  try {
    const { data } = await ApiItems_GetByGoodTypeID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListItem(result));
          resolve();
        });
      } else {
        console.log('fetchListItems', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchListItems', error);
  }
};

const fetchDetailKeepSales = (body) => async dispatch => {
  try {
    const { data } = await ApiSaleInventoryKeeps_GetByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateDetailKeepSales(result));
          resolve();
        });
      } else {
        console.log('fetchDetailKeepSales', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchDetailKeepSales', error);
  }
};

export {
  fetchListInventories,
  fetchDetailInventory,
  fetchListGoodTypes,
  fetchListProposalGoods,
  fetchListWarehouseFactory,
  fetchListItems,
  fetchDetailKeepSales,
  fetchListCancelReason
}
