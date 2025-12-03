import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useSelector } from 'react-redux';

import { translateLang } from '@store/accLanguages/slide';
import NotifierAlert from './NotifierAlert';

const STATE = {
  NO_INTERNET: 1,
  RE_CONNECT: 2,
  CONNECTED: 3,
};

const Internet = () => {
  const [connection, setConnection] = useState(STATE.CONNECTED);
  const languageKey = useSelector(translateLang);

  useEffect(() => {
    const subNetInfo = NetInfo.addEventListener(({ isConnected }) => {

      if (!isConnected) {
        setConnection(STATE.NO_INTERNET);
        NotifierAlert(
          3000,
          `${languageKey('_check_network')}`,
          `${languageKey('_no_network_connect')}`,
          'error',
        );
        handleNetworkError();
      } else {
        setConnection(STATE.CONNECTED);
      }
    });

    return () => subNetInfo();
  }, [languageKey]);

  const handleNetworkError = () => {
    const listeningInterval = setInterval(() => {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          clearInterval(listeningInterval);
          setConnection(STATE.CONNECTED);
          NotifierAlert(
            3000,
            `${languageKey('_notification')}`,
            `${languageKey('_internet_connect')}`,
            'success',
          );
        }
      });
    }, 1500);
  };

  if (connection === STATE.CONNECTED) {
    return null;
  }

  return null;
};

export default Internet;
