import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  listInventories: [],
  detailInventory: null,
  listProposalGoods: [],
  listGoodsTypes: [],
  listItem: [],
  listFactory: [],
  listWarehouse: [],
  detailKeepSales: null,
  listCancelReason : []
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState: initialState,
  reducers: {
    updateListInventories: (state, action) => {
      state.listInventories = action.payload;
    },
    updateDetailInventory: (state, action) => {
      state.detailInventory = action.payload;
    },
    updateListProposalGoods: (state, action) => {
      state.listProposalGoods = action.payload;
    },
    updateListGoodsTypes: (state, action) => {
      state.listGoodsTypes = action.payload;
    },
    updateListItem: (state, action) => {
      state.listItem = action.payload;
    },
    updateListFactory: (state, action) => {
      state.listFactory = action.payload;
    },
    updateListWarehouse: (state, action) => {
      state.listWarehouse = action.payload;
    },
    updateDetailKeepSales: (state, action) => {
      state.detailKeepSales = action.payload;
    },
    updateListCancelReason: (state, action) => {
      state.listCancelReason = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateListInventories,
  updateDetailInventory,
  setIsSubmitting,
  updateListProposalGoods,
  updateListGoodsTypes,
  updateListItem,
  updateListFactory,
  updateListWarehouse,
  updateDetailKeepSales,
  updateListCancelReason
} = inventorySlice.actions;

export default inventorySlice.reducer;

