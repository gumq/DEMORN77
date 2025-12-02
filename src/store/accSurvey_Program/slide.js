import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  listSurveyPrograms: [],
  listSurveyQuestions: [],
  detailSurveyProgram: null,
  dataHistorySurvey: null,
};

export const surveyProgramsSlice = createSlice({
  name: 'surveyPrograms',
  initialState: initialState,
  reducers: {
    updateListSurveyPrograms: (state, action) => {
      state.listSurveyPrograms = action.payload;
    },
    updateListSurveyQuestions: (state, action) => {
      state.listSurveyQuestions = action.payload;
    },
    updateDetailSurveyProgram: (state, action) => {
      state.detailSurveyProgram = action.payload;
    },
    updateDataHistorySurvey: (state, action) => {
      state.dataHistorySurvey = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateListSurveyPrograms,
  updateListSurveyQuestions,
  updateDetailSurveyProgram,
  setIsSubmitting,
  updateDataHistorySurvey
} = surveyProgramsSlice.actions;

export default surveyProgramsSlice.reducer;
