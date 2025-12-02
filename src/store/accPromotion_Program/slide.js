import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  listPromotionPrograms: [],
  detailPromotionPrograms: null,
};

export const promotionProgramsSlice = createSlice({
  name: 'promotionPrograms',
  initialState: initialState,
  reducers: {
    updateListPromotionPrograms: (state, action) => {
      state.listPromotionPrograms = action.payload;
    },
    updateDetailPromotionPrograms: (state, action) => {
      state.detailPromotionPrograms = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateListPromotionPrograms,
  updateDetailPromotionPrograms,
  setIsSubmitting
} = promotionProgramsSlice.actions;

export default promotionProgramsSlice.reducer;
