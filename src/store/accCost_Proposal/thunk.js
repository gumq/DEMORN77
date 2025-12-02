import {
  updateDetailCostProposal,
  updateListCostProposal,
  updateListCostProposalType,
  updateListExpenseType,
  setIsSubmitting,
} from '../accCost_Proposal/slide';
import {
  ApiCategoryGenerals_GetByType,
  ApiBrandPromotionBudgets_Get,
  ApiBrandPromotionBudgets_GetByID,
} from '@api';

const fetchListCostProposal = () => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiBrandPromotionBudgets_Get();
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result.length > 0) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateListCostProposal(result));
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

const fetchDetailCostProposal = (body) => async dispatch => {
  dispatch(setIsSubmitting(true))
  try {
    const { data } = await ApiBrandPromotionBudgets_GetByID(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        dispatch(setIsSubmitting(false))
        await new Promise(resolve => {
          dispatch(updateDetailCostProposal(result));
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

const fetchListCategoryTypeCostProposal = () => async dispatch => {
  const body = { CategoryType: "SalesProposalType,ExpenseType" }
  try {
    const { data } = await ApiCategoryGenerals_GetByType(body);
    if (data.ErrorCode === '0' && data.StatusCode === 200) {
      let result = data.Result;
      if (result) {
        await new Promise(resolve => {
          dispatch(updateListCostProposalType(result?.SalesProposalType));
          dispatch(updateListExpenseType(result?.ExpenseType));
          resolve();
        });
      } else {
        console.log('fetchListCategoryTypeCostProposal', data?.Message);
      }
    }
  } catch (error) {
    console.log('fetchListCategoryTypeCostProposal', error);
  }
};

export {
  fetchListCostProposal,
  fetchDetailCostProposal,
  fetchListCategoryTypeCostProposal,
}
