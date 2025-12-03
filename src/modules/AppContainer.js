import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, AppState, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import RNFS from 'react-native-fs';
import RNRestart from 'react-native-restart';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';

import { getListFetchLanguageDetails, getListFetchLanguageType, getListFetchLocale } from '../store/accLanguages/thunk';
import { colors } from '@themes';
import { MainStackNavigator } from './navigation/StackNavigator';
import { Internet } from '@components';

const AppContainer = () => {
  const dispatch = useDispatch();
  const [appState, setAppState] = useState(AppState.currentState);

  const { languageTypes, languageDetails } = useSelector(state => state.Language);

  const handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      checkMemoryUsage();
    }
    setAppState(nextAppState);
  };

  const checkMemoryUsage = async () => {
    try {
      const freeMemory = await DeviceInfo.getFreeDiskStorage();
      const totalMemory = await DeviceInfo.getTotalMemory();

      if (totalMemory > 0) {
        const freeMemoryMB = freeMemory / (1024 * 1024);
        const totalMemoryMB = totalMemory / (1024 * 1024);
        if (freeMemoryMB < totalMemoryMB * 0.1) {
          console.log('Low memory detected. Clearing cache...');
          clearCache();
        }
      } else {
        console.log('Invalid totalMemory value');
      }
    } catch (error) {
      console.error('Error checking memory usage:', error);
    }
  };

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared.');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  const clearExternalDirectory = async () => {
    try {
      const externalDir = RNFS.ExternalDirectoryPath;
      const files = await RNFS.readDir(externalDir);

      for (const file of files) {
        await RNFS.unlink(file.path);
      }
      console.log('External directory cleared.');
    } catch (error) {
      console.error('Error clearing external directory:', error);
    }
  };

  const clearDocumentDirectory = async () => {
    try {
      const documentDir = RNFS.DocumentDirectoryPath;
      const files = await RNFS.readDir(documentDir);

      for (const file of files) {
        await RNFS.unlink(file.path);
      }
      console.log('Document directory cleared.');
    } catch (error) {
      console.error('Error clearing document directory:', error);
    }
  };

  const cleanFileImages = async () => {
    try {
      await ImagePicker.clean();
      console.log('Removed temporary images from temporary directory.');
    } catch (error) {
      console.error('Error cleaning temporary images:', error);
    }
  };

  const deleteFilesWithPath = async (path) => {
    if (!path) return;
    try {
      const result = await RNFS.readDir(path);
      for (const currentItem of result) {
        if (currentItem.isDirectory()) {
          await deleteFilesWithPath(currentItem.path);
        } else {
          try {
            await RNFS.unlink(currentItem.path);
          } catch (error) {
            console.log('Error unlinking file:', error);
          }
        }
      }
    } catch (error) {
      console.log('Error reading directory:', error);
    }
  };

  const clearCache = async () => {
    try {
      await clearExternalDirectory();
      await clearDocumentDirectory();
      await clearAsyncStorage();
      await cleanFileImages();

      await deleteFilesWithPath(RNFS.CachesDirectoryPath);

      RNRestart.Restart();
    } catch (error) {
      console.error('Error clearing all storage:', error);
    }
  };

  useEffect(() => {
    let subscription;
    if (AppState.addEventListener) {
      subscription = AppState.addEventListener('change', handleAppStateChange);
    } else {
      AppState.addEventListener('change', handleAppStateChange);
    }

    return () => {
      if (subscription?.remove) {
        subscription.remove();
      } else {
        AppState.removeEventListener('change', handleAppStateChange);
      }
    };

  }, []);

  useEffect(() => {
    dispatch(getListFetchLocale());
    dispatch(getListFetchLanguageType());
    dispatch(getListFetchLanguageDetails());

    LogBox.ignoreLogs([
      '`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.',
      '`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.'
    ]);

  }, [dispatch]);

  if (languageDetails === null || languageTypes === null) {
    return (
      <View style={styles.noLanguages}>
        <ActivityIndicator color={colors.red} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Internet />
      <MainStackNavigator />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  noLanguages: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default AppContainer;
