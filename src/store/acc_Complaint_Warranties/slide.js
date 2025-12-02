import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  listComplaintWarraties: [],
  detailComplaintWarraties: null,
  listSOByCustomer: [],
  listODBySO: [],
  listItemBySO: [],
  listEntryComplaint: [],
  listComplaintType: [],
  listNotOD: [],
  listProductError: []
};

export const complaintWarrantiesSlice = createSlice({
  name: 'complaintWarranties',
  initialState: initialState,
  reducers: {
    updateListComplaintWarranties: (state, action) => {
      state.listComplaintWarraties = action.payload;
    },
    updateDetailComplaintWarries: (state, action) => {
      state.detailComplaintWarraties = action.payload;
    },
    updateListSOByCustomer: (state, action) => {
      state.listSOByCustomer = action.payload;
    },
    updateListODBySO: (state, action) => {
      state.listODBySO = action.payload;
    },
    updateListItemBySO: (state, action) => {
      state.listItemBySO = action.payload;
    },
    updateListEntryComplaint: (state, action) => {
      state.listEntryComplaint = action.payload;
    },
    updateListComplaintType: (state, action) => {
      state.listComplaintType = action.payload;
    },
    updateListNotOD: (state, action) => {
      state.listNotOD = action.payload;
    },
    updateListProductError: (state, action) => {
      state.listProductError = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateListComplaintWarranties,
  updateDetailComplaintWarries,
  updateListItemBySO,
  updateListSOByCustomer,
  updateListEntryComplaint,
  updateListComplaintType,
  updateListNotOD,
  updateListODBySO,
  updateListProductError,
  setIsSubmitting
} = complaintWarrantiesSlice.actions;

export default complaintWarrantiesSlice.reducer;
