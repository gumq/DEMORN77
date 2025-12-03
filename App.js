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
// import {StyleSheet, Text, View} from 'react-native';
// import React from 'react';
// import {HeaderHomeNew} from '@components';
// import {colors} from '@themes';
//  import Config from 'react-native-config';
// const App = () => {
//    console.log('AAAAAA',Config.API_URL);
  
//   return (
//     <View>
//       <Text 
//       style={{color:colors.red}}
//       >indexaaaaaaaaaaaaaaaa{Config.API_URL}</Text>
//     </View>
//   );
// };

// export default App;

// const styles = StyleSheet.create({});