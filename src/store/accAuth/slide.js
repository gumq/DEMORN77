import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
  changePass: [],
  ruleFormatCurrency: 'VN',
  ruleFormatDecimal: 2,
  inforCompany: [],
  isSubmitting: false,
  listCustomerByUserID: [],
  listUserByUserID: [],
  listcompany: [],
  isUpdateOdate:null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    updateUser: (state, action) => {
      state.userInfo = action.payload;
    },
    updateChangePass: (state, action) => {
      state.changePass = action.payload;
    },
    updateRuleFormatCurrency: (state, action) => {
      state.ruleFormatCurrency = action.payload;
    },
    updateRuleFormatDecimal: (state, action) => {
      state.ruleFormatDecimal = action.payload;
    },
    updateInforCompany: (state, action) => {
      state.inforCompany = action.payload;
    },
    updateListcompany: (state, action) => {
      state.listcompany = action.payload;
    },
    updateListCustomerByUserID: (state, action) => {
      state.listCustomerByUserID = action.payload;
    },
    updateListUserByUserID: (state, action) => {
      state.listUserByUserID = action.payload;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    resetUser: state => {
      return initialState;
    },
    updateIsUpdateOdate: (state, action) => {
      state.isUpdateOdate = action.payload;
    },
  },
});

export const {
  updateUser,
  updateRuleFormatCurrency,
  updateRuleFormatDecimal,
  resetUser,
  updateChangePass,
  updateInforCompany,
  setIsSubmitting,
  updateListUserByUserID,
  updateListCustomerByUserID,
  updateListcompany,
  updateIsUpdateOdate
} = userSlice.actions;

export default userSlice.reducer;
