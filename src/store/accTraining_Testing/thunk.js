
import { ApiTrainings_GetActive, ApiTrainings_GetByID, ApiTrainings_GetQuestions } from '@api';
import { updateDetailTraining, updateListTraining, updateListTrainingQuestions, setIsSubmitting } from './slide';

const fetchListTraining = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiTrainings_GetActive();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListTraining(result));
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

const fetchListTrainingQuestions = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiTrainings_GetQuestions(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListTrainingQuestions(result));
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

const fetchDetailTraining = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiTrainings_GetByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateDetailTraining(result));
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
  fetchListTraining,
  fetchListTrainingQuestions,
  fetchDetailTraining,
}
