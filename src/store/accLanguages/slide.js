import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  languageTypes: null,
  languageDetails: null,
  locale: null,
};

export const languagesSlice = createSlice({
  name: 'languages',
  initialState,
  reducers: {
    updateLocale: (state, action) => {
      state.locale = action.payload;
    },
    fetchLanguageType: (state, action) => {
      state.languageTypes = action.payload;
    },
    fetchLanguageDetails: (state, action) => {
      state.languageDetails = action.payload;
    },
    resetLanguages: () => initialState,
  },
});

export const {
  updateLocale,
  fetchLanguageType,
  fetchLanguageDetails,
  resetLanguages,
} = languagesSlice.actions;

export const selectLanguageDetails = state => state.Language.languageDetails;
export const selectLocale = state => state.Language.locale;

let lastLocaleCode;
let lastLanguageDetails;
let lastFn;

export const translateLang = createSelector(
  [selectLanguageDetails, selectLocale],
  (languageDetails, locale) => {
    if (
      lastFn &&
      lastLocaleCode === locale?.Code &&
      lastLanguageDetails === languageDetails
    ) {
      return lastFn;
    }

    lastLocaleCode = locale?.Code;
    lastLanguageDetails = languageDetails;

    lastFn = (key) => {
      const str = languageDetails?.[locale?.Code]?.[key];
      return str?.length ? str : (__DEV__ ? key : '');
    };

    return lastFn;
  }
);
export default languagesSlice.reducer;
