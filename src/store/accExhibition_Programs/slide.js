import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  listExhibitionPrograms: [],
  detailExhibitionPrograms: null,
  detailCustomerRegis : null
};

export const exhibitionProgramsSlice = createSlice({
  name: 'exhibitionPrograms',
  initialState: initialState,
  reducers: {
    updateListExhibitionPrograms: (state, action) => {
      state.listExhibitionPrograms = action.payload;
    },
    updateDetailExhibitionPrograms: (state, action) => {
      state.detailExhibitionPrograms = action.payload;
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
  updateListExhibitionPrograms,
  updateDetailExhibitionPrograms,
  updateDetailCustomerRegistration,
  setIsSubmitting
} = exhibitionProgramsSlice.actions;

export default exhibitionProgramsSlice.reducer;
