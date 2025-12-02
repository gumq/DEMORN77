
import {
  ApiCategoryGenerals_GetByType,
  ApiPIConfigs_GetActive,
  ApiPIConfigs_GetByID,
  ApiPIAllocations_GetByID
} from '@api';
import {
  updateListSetUpPI,
  setIsSubmitting,
  updateDetailSetUpPI,
  updateListWorkCriteria,
  updateDetailPI
} from './slide';

const fetchListSetUpPI = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiPIConfigs_GetActive();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListSetUpPI(result));
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

const fetchListCategoryTypePI = () => async dispatch => {
  const body = { CategoryType: "WorkCriteria" }
  try {
    const { data } = await ApiCategoryGenerals_GetByType(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListWorkCriteria(result?.WorkCriteria));
          resolve();
        });
      } else {
        console.log('fetchListCategoryType', data?.Message);
      }

    }
  } catch (error) {
    console.log('fetchListCategoryType', error);
  }
};

const fetchDetailSetUpPI = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiPIConfigs_GetByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateDetailSetUpPI(result));
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

const fetchDetailPI = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiPIAllocations_GetByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateDetailPI(result));
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
  fetchListSetUpPI,
  fetchListCategoryTypePI,
  fetchDetailSetUpPI,
  fetchDetailPI
}
