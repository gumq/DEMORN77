import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  listJob: [],
  detailJob: null,
};

export const jobListSlice = createSlice({
  name: 'jobList',
  initialState: initialState,
  reducers: {
    updateListJob: (state, action) => {
      state.listJob = action.payload;
    },
    updateDetailJob: (state, action) => {
      state.detailJob = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateListJob,
  updateDetailJob,
  setIsSubmitting,
} = jobListSlice.actions;

export default jobListSlice.reducer;
