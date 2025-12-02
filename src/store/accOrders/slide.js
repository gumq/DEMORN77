import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  listOrders: [],
  detailOrder: null,
  listItems: [],
  listProductTypes: [],
  listDocumentTypes: [],
  listCurrencyType: [],
  listPaymentMethod: [],
  listPriceGroup: [],
  listApplicablePrograms: [],
  listReceivingForm: [],
  listSalesChannel: [],
  listQuoteContractNumber: [],
  listDepositPaymentValues: [],
  listSalesOrders: [],
  listTypeOfOrder: [],
  listSalesOrderDocument: [],
  listWarehouse: [],
  listAddress: []
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: initialState,
  reducers: {
    updateListOrders: (state, action) => {
      state.listOrders = action.payload;
    },
    updateDetailOrder: (state, action) => {
      state.detailOrder = action.payload;
    },
    updateListItems: (state, action) => {
      state.listItems = action.payload;
    },
    updateListProductTypes: (state, action) => {
      state.listProductTypes = action.payload;
    },
    updateListDocumentTypes: (state, action) => {
      state.listDocumentTypes = action.payload;
    },
    updateListCurrencyType: (state, action) => {
      state.listCurrencyType = action.payload;
    },
    updateListPaymentMethod: (state, action) => {
      state.listPaymentMethod = action.payload;
    },
    updateListPriceGroup: (state, action) => {
      state.listPriceGroup = action.payload;
    },
    updateListApplicablePrograms: (state, action) => {
      state.listApplicablePrograms = action.payload;
    },
    updateListReceivingForm: (state, action) => {
      state.listReceivingForm = action.payload;
    },
    updateListSalesChannel: (state, action) => {
      state.listSalesChannel = action.payload;
    },
    updateListQuoteContractNumber: (state, action) => {
      state.listQuoteContractNumber = action.payload;
    },
    updateListDepositPaymentValues: (state, action) => {
      state.listDepositPaymentValues = action.payload;
    },
    updateListSalesOrders: (state, action) => {
      state.listSalesOrders = action.payload;
    },
    updateListTypeOfOrder: (state, action) => {
      state.listTypeOfOrder = action.payload;
    },
    updateListSalesOrderDocument: (state, action) => {
      state.listSalesOrderDocument = action.payload;
    },
    updateListWarehouse: (state, action) => {
      state.listWarehouse = action.payload;
    },
    updateListAddress: (state, action) => {
      state.listAddress = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateListOrders,
  updateDetailOrder,
  updateListItems,
  updateListProductTypes,
  updateListDocumentTypes,
  updateListCurrencyType,
  updateListPaymentMethod,
  updateListPriceGroup,
  updateListApplicablePrograms,
  updateListReceivingForm,
  updateListSalesChannel,
  updateListQuoteContractNumber,
  updateListDepositPaymentValues,
  updateListSalesOrders,
  updateListTypeOfOrder,
  updateListSalesOrderDocument,
  updateListWarehouse,
  updateListAddress,
  setIsSubmitting,
} = ordersSlice.actions;

export default ordersSlice.reducer;

