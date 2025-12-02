import {
  setIsSubmitting,
  updateDetailCustomerRegistration,
  updateDetailGiftPrograms,
  updateListGiftPrograms
} from '../accGift_Program/slide';
import { ApiPromotionGifts_GetMobile, ApiPromotionGifts_GetMobileByID } from '@api';

const fetchListGiftPrograms = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiPromotionGifts_GetMobile();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListGiftPrograms(result));
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

const fetchDetailGiftPrograms = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiPromotionGifts_GetMobileByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateDetailGiftPrograms(result));
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

// const fetchDetailCustomerRegis = (body) => async dispatch => {
//   dispatch(setIsSubmitting(true))
//   try {
//     const { data } = await ApiGiftRegistrations_GetByID(body);
//     if (data.ErrorCode === '0' && data.StatusCode === 200) {
//       let result = data.Result;
//       if (result) {
//         dispatch(setIsSubmitting(false))
//         await new Promise(resolve => {
//           dispatch(updateDetailCustomerRegistration(result));
//           resolve();
//         });
//       } else {
//         dispatch(setIsSubmitting(false))
//       }
//     } else {
//       dispatch(setIsSubmitting(false))
//     }
//   } catch (error) {
//     console.log('error', error);
//   }
// };

export {
  fetchListGiftPrograms,
  fetchDetailGiftPrograms,
  // fetchDetailCustomerRegis
}
