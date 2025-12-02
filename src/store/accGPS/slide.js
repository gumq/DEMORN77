import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  menus: [],
  isSubmitting: false
};

export const gpsSlice = createSlice({
  name: 'gps',
  initialState: initialState,
  reducers: {
    updateMenu: (state, action) => {
      state.menus = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    resetUser: state => {
      return initialState;
    },
  },
});

export const {
  updateMenu,
  setIsSubmitting
} = gpsSlice.actions;

export default gpsSlice.reducer;
