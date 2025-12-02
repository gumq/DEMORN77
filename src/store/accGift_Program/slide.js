import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  listGiftPrograms: [],
  detailGiftPrograms: null,
  detailCustomerRegis : null
};

export const giftProgramsSlice = createSlice({
  name: 'giftPrograms',
  initialState: initialState,
  reducers: {
    updateListGiftPrograms: (state, action) => {
      state.listGiftPrograms = action.payload;
    },
    updateDetailGiftPrograms: (state, action) => {
      state.detailGiftPrograms = action.payload;
    },
    updateDetailCustomerRegistration: (state, action) => {
      state.detailCustomerRegis = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateListGiftPrograms,
  updateDetailGiftPrograms,
  updateDetailCustomerRegistration,
  setIsSubmitting
} = giftProgramsSlice.actions;

export default giftProgramsSlice.reducer;
