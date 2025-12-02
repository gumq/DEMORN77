import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { NotifierWrapper } from 'react-native-notifier';
import { Provider } from 'react-redux';
import { store } from './src/store'
import AppContainer from './src/modules/AppContainer';
import { GestureHandlerRootView } from "react-native-gesture-handler";

if (Platform.OS === 'android') {
  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor('transparent');
}

const App = () => {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NotifierWrapper>
            <StatusBar translucent backgroundColor="transparent" />
          <AppContainer />
        </NotifierWrapper>
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;
