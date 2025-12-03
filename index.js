import React from 'react';
import App from './App.js';
import 'react-native-gesture-handler';
import { name as appName } from './app.json';
import { AppRegistry, Text, TextInput } from 'react-native';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});

function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
        return null;
    }
    return <App />;
}

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

AppRegistry.registerComponent(appName, () => HeadlessCheck);

