import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  listTraining: [],
  listTrainingQuestions: [],
  detailTraining: null
};

export const trainingSlice = createSlice({
  name: 'training',
  initialState: initialState,
  reducers: {
    updateListTraining: (state, action) => {
      state.listTraining = action.payload;
    },
    updateListTrainingQuestions: (state, action) => {
      state.listTrainingQuestions = action.payload;
    },
    updateDetailTraining: (state, action) => {
      state.detailTraining = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateListTraining,
  updateListTrainingQuestions,
  updateDetailTraining,
  setIsSubmitting
} = trainingSlice.actions;

export default trainingSlice.reducer;
