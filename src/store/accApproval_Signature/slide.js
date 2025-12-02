import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  listUser: [],
  listCustomers: [],
  isSubmitting: false,
  approvalListProcess: [],
  detailApprovalListProcess: null,
  listFilter: [],
  detailCustomerChangeInfor: null,
  detailMaterial: null,
  filesAttach: null,
  detailApprovalList: [],
};

export const approvalListProcessSlice = createSlice({
  name: 'approvalListProcess',
  initialState: initialState,
  reducers: {
    updateApprovalListProcess: (state, action) => {
      state.approvalListProcess = action.payload;
    },
    updateDetailApprovalListProcess: (state, action) => {
      state.detailApprovalListProcess = action.payload;
    },
    updateDetailApprovalList: (state, action) => {
      state.detailApprovalList = action.payload;
    },
    updateListUser: (state, action) => {
      state.listUser = action.payload;
    },
    updateListCustomers: (state, action) => {
      state.listCustomers = action.payload;
    },
    clrsListCustomers: (state, action) => {
      state.listCustomers = [];
    },
    updateListFilter: (state, action) => {
      state.listFilter = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    updateDetailCustomerChangeInfor: (state, action) => {
      state.detailCustomerChangeInfor = action.payload;
    },
    updateDetailMaterial: (state, action) => {
      state.detailMaterial = action.payload;
    },
    updateFilesAttach: (state, action) => {
      state.filesAttach = action.payload;
    },
  },
});

export const {
  updateApprovalListProcess,
  updateDetailApprovalList,
  updateDetailApprovalListProcess,
  updateListUser,
  updateListCustomers,
  setIsSubmitting,
  updateListFilter,
  updateDetailCustomerChangeInfor,
  updateDetailMaterial,
  updateFilesAttach,
  clrsListCustomers,
} = approvalListProcessSlice.actions;

export default approvalListProcessSlice.reducer;
