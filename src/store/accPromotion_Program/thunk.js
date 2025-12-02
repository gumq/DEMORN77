import {
  setIsSubmitting,
  updateDetailPromotionPrograms,
  updateListPromotionPrograms
} from '../accPromotion_Program/slide';
import {
  ApiPromotionPrograms_Get,
  ApiPromotionPrograms_GetById,
} from '@api';

const fetchListPromotionPrograms = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiPromotionPrograms_Get();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListPromotionPrograms(result));
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

const fetchDetailPromotionPrograms = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiPromotionPrograms_GetById(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateDetailPromotionPrograms(result));
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
  fetchListPromotionPrograms,
  fetchDetailPromotionPrograms,
}
