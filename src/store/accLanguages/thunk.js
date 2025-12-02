import { updateLocale, fetchLanguageType, fetchLanguageDetails } from '../accLanguages/slide';
import { ApiChooseLanguage, ApiGetLanguageDetails } from '../../action/Api';
import {
  getLocale,
  setLanguageDetail,
  getLanguageDetail,
  setLanguageType,
} from '../../storage';

const DEFAULT_LANGUAGE = {
  Code: 'vn',
  LanguageName: 'Tiếng Việt',
  Icon: '/assets/img/vietnam.png',
  MobileIcon:
    'https://imgsmartcity.namlongtekgroup.com/Languages/vietnam-flag-icon.png',
};

const getListFetchLocale = () => {
  return async dispatch => {
    try {
      let localLocale = await getLocale();
      if (localLocale) {
        await new Promise(resolve => {
          dispatch(updateLocale(JSON.parse(localLocale)));
          resolve();
        });
      } else {
        dispatch(updateLocale(DEFAULT_LANGUAGE));
      }
    } catch (error) {
      console.log('getListFetchLocale', error)
    }
  }
};

const getListFetchLanguageType = () => {
  return async dispatch => {
    try {
      const { data } = await ApiChooseLanguage();
      if (data?.ErrorCode === '0' && data?.StatusCode === 200) {
        let result = data.Result;
        if (result.length > 0) {
          await new Promise(resolve => {
            dispatch(fetchLanguageType(result));
            dispatch(setLanguageType(JSON.stringify(result)));
            resolve();
          });
        }
      }
    } catch (error) {
      console.log('getListFetchLanguageType', error)
    }
  }
};

const getListFetchLanguageDetails = () => {
  return async dispatch => {
    try {
      const { data } = await ApiGetLanguageDetails();
      if (data?.ErrorCode === '0' && data?.StatusCode === 200) {
        let result = data.Result;
        await new Promise(resolve => {
          dispatch(fetchLanguageDetails(result));
          dispatch(setLanguageDetail(JSON.stringify(result)));
          resolve();
        });
      }
    } catch (error) {
      let localLanguage = await getLanguageDetail();
      if (localLanguage) {
        dispatch(fetchLanguageDetails(JSON.parse(localLanguage)));
      }
    }
  }
};

export {
  getListFetchLocale,
  getListFetchLanguageType,
  getListFetchLanguageDetails
};