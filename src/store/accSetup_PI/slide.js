import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  listSetUpPI: [],
  listWorkCriteria: [],
  detailSetUpPI: null,
  detailPI : null
};

export const setUpPISlice = createSlice({
  name: 'setUpPI',
  initialState: initialState,
  reducers: {
    updateListSetUpPI: (state, action) => {
      state.listSetUpPI = action.payload;
    },
    updateListWorkCriteria: (state, action) => {
      state.listWorkCriteria = action.payload;
    },
    updateDetailSetUpPI: (state, action) => {
      state.detailSetUpPI = action.payload;
    },
    updateDetailPI: (state, action) => {
      state.detailPI = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateListSetUpPI,
  updateListWorkCriteria,
  updateDetailSetUpPI,
  setIsSubmitting,
  updateDetailPI
} = setUpPISlice.actions;

export default setUpPISlice.reducer;
