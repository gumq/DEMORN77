import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  listCostProposal: [],
  detailCostProposal: null,
  listCostProposalType: [],
  listExpenseType: [],
};

export const costProposalSlice = createSlice({
  name: 'costProposal',
  initialState: initialState,
  reducers: {
    updateListCostProposal: (state, action) => {
      state.listCostProposal = action.payload;
    },
    updateDetailCostProposal: (state, action) => {
      state.detailCostProposal = action.payload;
    },
    updateListCostProposalType: (state, action) => {
      state.listCostProposalType = action.payload;
    },
    updateListExpenseType: (state, action) => {
      state.listExpenseType = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateDetailCostProposal,
  updateListCostProposal,
  updateListCostProposalType,
  setIsSubmitting,
  updateListExpenseType
} = costProposalSlice.actions;

export default costProposalSlice.reducer;
