import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSubmitting: false,
  listSupportArticles: [],
  detailSupportArticles: null,
  listMenuParent: [],
  listMenuChildren: [],
  listPostType: [],
  listBanner: []
};

export const supportArticlesSlice = createSlice({
  name: 'supportArticles',
  initialState: initialState,
  reducers: {
    updateListSupportArticles: (state, action) => {
      state.listSupportArticles = action.payload;
    },
    updateDetailSupportArticles: (state, action) => {
      state.detailSupportArticles = action.payload;
    },
    updateListMenuParent: (state, action) => {
      state.listMenuParent = action.payload;
    },
    updateListMenuChildren: (state, action) => {
      state.listMenuChildren = action.payload;
    },
    updateListPostType: (state, action) => {
      state.listPostType = action.payload;
    },
    updateListBanner: (state, action) => {
      state.listBanner = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateListSupportArticles,
  updateDetailSupportArticles,
  setIsSubmitting,
  updateListMenuParent,
  updateListMenuChildren,
  updateListPostType,
  updateListBanner
} = supportArticlesSlice.actions;

export default supportArticlesSlice.reducer;
