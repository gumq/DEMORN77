import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  listCusRequirements: [],
  detailCusRequirement: null,
  listCustomerRequestType: [],
  listDepartment: [],
  listItemTypes: [],
  listEntry: [],
  listGoodsType: [],
  listNumberOfFaces: [],
  listDataGoodType: null,
  listCodeProduct : null
};

export const cusRequirementSlice = createSlice({
  name: 'cusRequirement',
  initialState: initialState,
  reducers: {
    updateListCustomerRequirements: (state, action) => {
      state.listCusRequirements = action.payload;
    },
    updateDetailCustomerRequirement: (state, action) => {
      state.detailCusRequirement = action.payload;
    },
    updateListCustomerRequestType: (state, action) => {
      state.listCustomerRequestType = action.payload;
    },
    updateListDepartment: (state, action) => {
      state.listDepartment = action.payload;
    },
    updateListItemTypes: (state, action) => {
      state.listItemTypes = action.payload;
    },
    updateListEntry: (state, action) => {
      state.listEntry = action.payload;
    },
    updateListGoodsType: (state, action) => {
      state.listGoodsType = action.payload;
    },
    updateListNumberOfFaces: (state, action) => {
      state.listNumberOfFaces = action.payload;
    },
    updateListDataGoodType: (state, action) => {
      state.listDataGoodType = action.payload;
    },
    updateListCodeProduct: (state, action) => {
      state.listCodeProduct = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateListCustomerRequirements,
  updateDetailCustomerRequirement,
  updateListCustomerRequestType,
  setIsSubmitting,
  updateListDepartment,
  updateListItemTypes,
  updateListEntry,
  updateListGoodsType,
  updateListDataGoodType,
  updateListCodeProduct
} = cusRequirementSlice.actions;

export default cusRequirementSlice.reducer;
