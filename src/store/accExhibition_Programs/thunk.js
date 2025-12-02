import {
  setIsSubmitting,
  updateDetailCustomerRegistration,
  updateDetailExhibitionPrograms,
  updateListExhibitionPrograms
} from '../accExhibition_Programs/slide';
import {
  ApiExhibitionPrograms_GetActive,
  ApiExhibitionPrograms_GetByID,
  ApiExhibitionRegistrations_GetByID,
} from '@api';

const fetchListExhibitionPrograms = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiExhibitionPrograms_GetActive();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListExhibitionPrograms(result));
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

const fetchDetailExhibitionPrograms = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiExhibitionPrograms_GetByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateDetailExhibitionPrograms(result));
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

const fetchDetailCustomerRegis = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiExhibitionRegistrations_GetByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateDetailCustomerRegistration(result));
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
  fetchListExhibitionPrograms,
  fetchDetailExhibitionPrograms,
  fetchDetailCustomerRegis
}
