import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalNotify: [],
  listNotify: [],
  isSubmitting: false
};

export const notifySlice = createSlice({
  name: 'notify',
  initialState: initialState,
  reducers: {
    updateTotalNotify: (state, action) => {
      state.totalNotify = action.payload;
    },
    updateListNotify: (state, action) => {
      state.listNotify = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    resetUser: state => {
      return initialState;
    },
  },
});

export const {
  updateListNotify,
  updateTotalNotify,
  setIsSubmitting
} = notifySlice.actions;

export default notifySlice.reducer;
