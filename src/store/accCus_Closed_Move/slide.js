import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  listCustomerClosedMove: [],
  detailCustomerClosedMove: null,
  listProposalReason: [],
  listSalesChannel: [],
  listCustomerType: [],
  customerByCode: null,
  listEntry: [],
};

export const cusClosedMoveSlice = createSlice({
  name: 'cusClosedMove',
  initialState: initialState,
  reducers: {
    updateListCusCloseMove: (state, action) => {
      state.listCustomerClosedMove = action.payload;
    },
    updateDetailCusCloseMove: (state, action) => {
      state.detailCustomerClosedMove = action.payload;
    },
    updateListProposalReason: (state, action) => {
      state.listProposalReason = action.payload;
    },
    updateListSalesChannel: (state, action) => {
      state.listSalesChannel = action.payload;
    },
    updateListCustomerType: (state, action) => {
      state.listCustomerType = action.payload;
    },
    updateCustomerByCode: (state, action) => {
      state.customerByCode = action.payload;
    },
     updateListEntry: (state, action) => {
      state.listEntry = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateListCusCloseMove,
  updateDetailCusCloseMove,
  updateListProposalReason,
  updateListSalesChannel,
  setIsSubmitting,
  updateListCustomerType,
  updateCustomerByCode,
  updateListEntry,
} = cusClosedMoveSlice.actions;

export default cusClosedMoveSlice.reducer;

