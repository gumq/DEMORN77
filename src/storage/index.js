import AsyncStorage from '@react-native-async-storage/async-storage';

// languages
const _LANGUAGE = '@LANGUAGE';
const _LOCALE = '@LOCALE';
const _TYPE_LANGUAGE = '@TYPE_LANGUAGE';
const _FCM = '@FCM';
const _REFRESH_TOKEN = '@REFRESH_TOKEN';

// user's token
const _TOKEN = '@TOKEN';

// user information
const _INFORMATION = '@INFORMATION';

// languages
export const setLocale = locale => {
    return AsyncStorage.setItem(_LOCALE, locale);
};

export const getLocale = () => {
    return AsyncStorage.getItem(_LOCALE);
};

export const removeLocale = () => {
    return AsyncStorage.removeItem(_LOCALE);
};

export const setLanguageType = options => {
    return AsyncStorage.setItem(_TYPE_LANGUAGE, options);
};

export const getLanguageType = () => {
    return AsyncStorage.getItem(_TYPE_LANGUAGE);
};

export const setLanguageDetail = language => {
    return AsyncStorage.setItem(_LANGUAGE, language);
};

export const getLanguageDetail = () => {
    return AsyncStorage.getItem(_LANGUAGE);
};

// user's token
export const setToken = token => {
    return AsyncStorage.setItem(_TOKEN, token);
};

export const getToken = () => {
    return AsyncStorage.getItem(_TOKEN);
};

export const removeToken = () => {
    return AsyncStorage.removeItem(_TOKEN);
};

export const setUserInformation = user => {
    return AsyncStorage.setItem(_INFORMATION, user);
};

export const getUserInformation = () => {
    return AsyncStorage.getItem(_INFORMATION);
};

export const removerUserInformation = () => {
    return AsyncStorage.removeItem(_INFORMATION);
};

export const getRefreshToken = () => {
    return AsyncStorage.getItem(_REFRESH_TOKEN);
};

export const setRefreshToken = refreshToken => {
    return AsyncStorage.setItem(_REFRESH_TOKEN, refreshToken);
};

export const setFcmInfo = fcm => {
    return AsyncStorage.setItem(_FCM, fcm);
};

export const getFcmInfo = () => {
    return AsyncStorage.getItem(_FCM);
};

export const clearFcm = () => {
    return AsyncStorage.removeItem(_FCM);
};
