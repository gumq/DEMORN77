import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  listPaymentRequests: [],
  detailPaymentRequest: null,
  listOrder: [],
  listAccountReceiver: [],
  listEntryPayment: [],
  detailConfirmRequest: null
};

export const depositPaymentSlice = createSlice({
  name: 'depositPayment',
  initialState: initialState,
  reducers: {
    updateListPaymentRequests: (state, action) => {
      state.listPaymentRequests = action.payload;
    },
    updateDetailPaymentRequest: (state, action) => {
      state.detailPaymentRequest = action.payload;
    },
    updateListOrder: (state, action) => {
      state.listOrder = action.payload;
    },
    updateListAccountReceiver: (state, action) => {
      state.listAccountReceiver = action.payload;
    },
    updateListEntryPayment: (state, action) => {
      state.listEntryPayment = action.payload;
    },
    updateDetailConfirmRequest: (state, action) => {
      state.detailConfirmRequest = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateDetailPaymentRequest,
  updateListPaymentRequests,
  setIsSubmitting,
  updateListOrder,
  updateListAccountReceiver,
  updateListEntryPayment,
  updateDetailConfirmRequest
} = depositPaymentSlice.actions;

export default depositPaymentSlice.reducer;
