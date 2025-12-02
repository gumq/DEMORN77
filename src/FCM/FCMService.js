import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

class FCMService {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister);
    this.createNotificationers(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      await messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission = onRegister => {
    messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          this.getToken(onRegister);
        } else {
          this.requestPermission(onRegister);
        }
      })
      .catch(error => { });
  };

  getToken = onRegister => {
    messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          onRegister(fcmToken);
        }
      })
      .catch(error => { });
  };

  requestPermission = async onRegister => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        this.getToken(onRegister);
      }
    } catch (error) { }
  };

  deleteToken = async () => {
    try {
      await messaging().deleteToken();
      console.log('✅ Token đã được xoá thành công');
    } catch (error) {
      console.error('❌ Lỗi khi xoá token:', error);
    }
  };

  createNotificationers = (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    // When the application is running, but in the background
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        const notification = remoteMessage.notification;
        onOpenNotification(notification);
      }
    });

    // When the application is opened from a quit state.
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const notification = remoteMessage.notification;
          onOpenNotification(notification);
        }
      });

    // Foreground state messages
    this.messageer = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        const notification = remoteMessage.notification;
        onNotification(notification);
      }
    });

    messaging().onTokenRefresh(fcmToken => {
      onRegister(fcmToken);
    });
  };

  unRegister = () => {
    this.messageer();
  };
}

export const fcmService = new FCMService();
