import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  listProductQuote: [],
  detailProductQuote: null,
  listSaleChannel: [],
  listCurrencyUnit: [],
  listPaymentTimes: [],
  listEntry: [],
  listApprovedPrice: [],
  listApprovedQuote: [],
  listGoodTypes: [],
  listPriceGroup: [],
  listItems: [],
  listCustPricingProcedures: [],
  listdetailsPrice: [],
};

export const productQuoteSlice = createSlice({
  name: 'productQuote',
  initialState: initialState,
  reducers: {
    updateListdetailsPrice: (state, action) => {
      state.listdetailsPrice = action.payload;
    },
    updateListProductQuote: (state, action) => {
      state.listProductQuote = action.payload;
    },
    updateDetailProductQuote: (state, action) => {
      state.detailProductQuote = action.payload;
    },
    updateListSaleChannel: (state, action) => {
      state.listSaleChannel = action.payload;
    },
    updateListCurrencyUnit: (state, action) => {
      state.listCurrencyUnit = action.payload;
    },
    updateListPaymentTimes: (state, action) => {
      state.listPaymentTimes = action.payload;
    },
    updateListEntry: (state, action) => {
      state.listEntry = action.payload;
    },
    updateListApprovedPrice: (state, action) => {
      state.listApprovedPrice = action.payload;
    },
    updateListApprovedQuote: (state, action) => {
      state.listApprovedQuote = action.payload;
    },
    updateListGoodTypes: (state, action) => {
      state.listGoodTypes = action.payload;
    },
    updateListPriceGroup: (state, action) => {
      state.listPriceGroup = action.payload;
    },
    updateListItemsProduct: (state, action) => {
      state.listItems = action.payload;
    },
    updateListCustPricingProcedures: (state, action) => {
      state.listCustPricingProcedures = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateListProductQuote,
  updateDetailProductQuote,
  updateListCurrencyUnit,
  updateListSaleChannel,
  updateListPaymentTimes,
  updateListEntry,
  updateListApprovedPrice,
  updateListApprovedQuote,
  updateListGoodTypes,
  updateListPriceGroup,
  updateListItemsProduct,
  updateListCustPricingProcedures,
  setIsSubmitting,
  updateListdetailsPrice
} = productQuoteSlice.actions;

export default productQuoteSlice.reducer;
