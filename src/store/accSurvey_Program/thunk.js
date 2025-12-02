import {
  setIsSubmitting,
  updateDataHistorySurvey,
  updateDetailSurveyProgram,
  updateListSurveyPrograms,
  updateListSurveyQuestions
} from '../accSurvey_Program/slide';
import { ApiMarketResearchs_GetActive, ApiMarketResearchs_GetByID, ApiMarketResearchs_GetQuestions, ApiResearchMarkets_GetChartData } from '@api';

const fetchListSurveyPrograms = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiMarketResearchs_GetActive();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListSurveyPrograms(result));
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

const fetchListSurveyQuestions = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiMarketResearchs_GetQuestions(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListSurveyQuestions(result));
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

const fetchDetailSurveyProgram = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiMarketResearchs_GetByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result?.Results;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateDetailSurveyProgram(result));
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

const fetchDataHistorySurvey = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiResearchMarkets_GetChartData(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateDataHistorySurvey(result?.ResultJson));
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
  fetchListSurveyPrograms,
  fetchListSurveyQuestions,
  fetchDetailSurveyProgram,
  fetchDataHistorySurvey
}
