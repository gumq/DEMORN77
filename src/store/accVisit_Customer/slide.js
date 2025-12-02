import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  listPlanVisitCustomer: [],
  detailPlanVisitCustomer: null,
  listVisitCustomer: null,
  detailVisitCustomer: null,
  listProducts: [],
  listUnitProducts: [],
  listSalesRoutes: [],
  listCustomerForPlan: [],
  listCancelReason: [],
  listCustomerOffRoute: [],
};

export const visitToCustomerSlice = createSlice({
  name: 'visitToCustomer',
  initialState: initialState,
  reducers: {
    updateListPlanVisitCustomer: (state, action) => {
      state.listPlanVisitCustomer = action.payload;
    },
    updateDetailPlanVisitCustomer: (state, action) => {
      state.detailPlanVisitCustomer = action.payload;
    },
    updateListCustomer: (state, action) => {
      state.listVisitCustomer = action.payload;
    },
    updateDetailVisitCustomer: (state, action) => {
      state.detailVisitCustomer = action.payload;
    },
    updateListProducts: (state, action) => {
      state.listProducts = action.payload;
    },
    updateListUnitProducts: (state, action) => {
      state.listUnitProducts = action.payload;
    },
    updateListSalesRoutes: (state, action) => {
      state.listSalesRoutes = action.payload;
    },
    updateListCustomerForPlan: (state, action) => {
      state.listCustomerForPlan = action.payload;
    },
    updateListCancelReason: (state, action) => {
      state.listCancelReason = action.payload;
    },
    updateListCustomerOffRoute: (state, action) => {
      state.listCustomerOffRoute = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateDetailPlanVisitCustomer,
  updateListPlanVisitCustomer,
  setIsSubmitting,
  updateListCustomer,
  updateDetailVisitCustomer,
  updateListProducts,
  updateListUnitProducts,
  updateListSalesRoutes,
  updateListCustomerForPlan,
  updateListCancelReason,
  updateListCustomerOffRoute
} = visitToCustomerSlice.actions;

export default visitToCustomerSlice.reducer;
