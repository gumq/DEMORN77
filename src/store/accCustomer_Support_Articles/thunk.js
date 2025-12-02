import {
  setIsSubmitting,
  updateListSupportArticles,
  updateDetailSupportArticles,
  updateListMenuParent,
  updateListMenuChildren,
  updateListPostType,
  updateListBanner,
} from '../accCustomer_Support_Articles/slide';
import {
  ApiCategoryGenerals_GetByType,
  ApiPostsMedia_Get,
  ApiPostsMedia_GetByID,
  ApiCategoryGenerals_GetCategoryGeneralsID
} from '@api';

const fetchListSupportArticles = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiPostsMedia_Get(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListSupportArticles(result));
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

const fetchDetailSupportArticles = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiPostsMedia_GetByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      // console.log('result', result);
      if (result !== null) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateDetailSupportArticles(result?.Details[0]));
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

const fetchListMenu = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  const body = { CategoryType: "PostType,PostTypeDetail,Pictures" }
  try {
    const { data } = await ApiCategoryGenerals_GetByType(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListMenuParent(result?.PostType));
          dispatch(updateListMenuChildren(result?.PostTypeDetail));
          dispatch(updateListBanner(result?.Pictures))
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

const fetchListPostType = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiCategoryGenerals_GetCategoryGeneralsID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListPostType(result));
          resolve();
        });
      } else {
        dispatch(setIsSubmitting(false))
      }
    }
  } catch (error) {
    console.log('error', error);
  }
};

export {
  fetchListSupportArticles,
  fetchDetailSupportArticles,
  fetchListMenu,
  fetchListPostType
}
