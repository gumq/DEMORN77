import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  listCreditLimit: [],
  detailCreditLimit: null,
  listRecommendedType: [],
  listPaymentTimes: [],
  listSalesType: [],
  listPartnerGroup: [],
  listObjectsType: [],
  listCurrencyType: [],
  informationSAP: null,
  listEntryCreditLimit: [],
  listDataFilter: null,
  listItemTypes: [],
};

export const creditLimitSlice = createSlice({
  name: 'creditLimit',
  initialState: initialState,
  reducers: {
    updateListItemTypes: (state, action) => {
      state.listItemTypes = action.payload;
    },
    updateListCreditLimit: (state, action) => {
      state.listCreditLimit = action.payload;
    },
    updateDetailCreditLimit: (state, action) => {
      state.detailCreditLimit = action.payload;
    },
    updateListRecommendedType: (state, action) => {
      state.listRecommendedType = action.payload;
    },
    updateListPaymentTimes: (state, action) => {
      state.listPaymentTimes = action.payload;
    },
    updateListSalesType: (state, action) => {
      state.listSalesType = action.payload;
    },
    updateListObjectsType: (state, action) => {
      state.listObjectsType = action.payload;
    },
    updateListCurrencyType: (state, action) => {
      state.listCurrencyType = action.payload;
    },
    updateInformationSAP: (state, action) => {
      state.informationSAP = action.payload;
    },
    updateListEntryCreditLimit: (state, action) => {
      state.listEntryCreditLimit = action.payload;
    },
    updateListPartnerGroup: (state, action) => {
      state.listPartnerGroup = action.payload;
    },
    updateListDataFilter: (state, action) => {
      state.listDataFilter = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateDetailCreditLimit,
  updateListCreditLimit,
  setIsSubmitting,
  updateListRecommendedType,
  updateListPaymentTimes,
  updateListObjectsType,
  updateListSalesType,
  updateListCurrencyType,
  updateInformationSAP,
  updateListEntryCreditLimit,
  updateListPartnerGroup,
  updateListDataFilter,
  updateListItemTypes
} = creditLimitSlice.actions;

export default creditLimitSlice.reducer;
