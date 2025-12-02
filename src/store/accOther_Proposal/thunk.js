import {
  setIsSubmitting,
  updateListOtherProposal,
  updateDetailOtherProposal,
  updateListReasonProposal,
  updateListCatalogue,
  updatedetailCatalogue,
  updateListProgram,
  updateListEvent,
  updateListItem,
  updateListShowroom,
  updateDetailShowroom,
  updateListProgramShowroom,
} from './slide';
import {
  ApiCategoryGenerals_GetByType,
  ApiDisplayCabinets_Get,
  ApiDisplayCabinets_GetByID,
  ApiDisplayCabinets_GetMobile,
  ApiDisplayCabinets_GetMobileByID,
  ApiDisplayMaterials_GetByID,
  ApiDisplayMaterials_GetMobile,
  ApiExhibitions_Get,
  ApiItems_GetActive,
  ApiOtherProposals_Get,
  ApiOtherProposals_GetByID,
  ApiPromotionGiftPlans_GetByID,
  ApiPromotionGifts_Get,
  ApiPromotionPrograms_Get,
} from '@api';

const fetchListOtherProposal = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiOtherProposals_Get();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListOtherProposal(result));
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

const fetchDetailOtherProposal = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiOtherProposals_GetByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateDetailOtherProposal(result));
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

const fetchListReasonProposal = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  const body = {
    CategoryType: "ProposalReason"
  }
  try {
    const { data } = await ApiCategoryGenerals_GetByType(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListReasonProposal(result?.ProposalReason));
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

const fetchListCatalogue = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiDisplayMaterials_GetMobile();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListCatalogue(result));
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

const fetchDetailCatalogue = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiDisplayMaterials_GetByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updatedetailCatalogue(result));
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

const fetchListPromotionGift = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiPromotionGifts_Get();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListProgram(result));
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

const fetchListEventGift = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiPromotionGiftPlans_GetByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListEvent(result?.Details));
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

const fetchListItem = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiItems_GetActive();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListItem(result));
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

const fetchListShowroom = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiDisplayCabinets_Get();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListShowroom(result));
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

const fetchDetailShowroom = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiDisplayCabinets_GetByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateDetailShowroom(result));
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

const fetchListProgramShowroom = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiExhibitions_Get();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListProgramShowroom(result));
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
  fetchListOtherProposal,
  fetchDetailOtherProposal,
  fetchListReasonProposal,
  fetchListCatalogue,
  fetchDetailCatalogue,
  fetchListPromotionGift,
  fetchListEventGift,
  fetchListItem,
  fetchListShowroom,
  fetchDetailShowroom,
  fetchListProgramShowroom
}
