import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  listHandOverDoc: [],
  detailHandOverDoc: null,
  listHandOverTypes: [],
  listEntry: [],
  listDocumentTypes :[],
  listReference :[]
};

export const handOverDocSlice = createSlice({
  name: 'handOverDoc',
  initialState: initialState,
  reducers: {
    updateListHandOverDoc: (state, action) => {
      state.listHandOverDoc = action.payload;
    },
    updateDetailHandOverDoc: (state, action) => {
      state.detailHandOverDoc = action.payload;
    },
    updateListHandOverTypes: (state, action) => {
      state.listHandOverTypes = action.payload;
    },
    updateListEntry: (state, action) => {
      state.listEntry = action.payload;
    },
    updateListDocumentTypes: (state, action) => {
      state.listDocumentTypes = action.payload;
    },
    updateListReference: (state, action) => {
      state.listReference = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateListHandOverDoc,
  updateDetailHandOverDoc,
  updateListHandOverTypes,
  updateListEntry,
  updateListDocumentTypes,
  updateListReference,
  setIsSubmitting,
} = handOverDocSlice.actions;

export default handOverDocSlice.reducer;
