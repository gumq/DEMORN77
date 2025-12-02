import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  menus: [],
  detailMenu: null,
  isSubmitting: false,
  tabnavigator: [],
  menu_home: [],
  menu_me: [],
};

export const homeSlice = createSlice({
  name: 'home',
  initialState: initialState,
  reducers: {
    updateMenu: (state, action) => {
      state.menus = action.payload;
    },
    updateDetailMenu: (state, action) => {
      state.detailMenu = action.payload;
    },
    updateTabnavigator: (state, action) => {
      state.tabnavigator = action.payload;
    },
    updateMenu_me: (state, action) => {
      state.menu_me = action.payload;
    },
    updateMenu_home: (state, action) => {
      state.menu_home = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  updateMenu,
  updateDetailMenu,
  setIsSubmitting,
  updateTabnavigator,
  updateMenu_me,
  updateMenu_home,
} = homeSlice.actions;

export default homeSlice.reducer;
