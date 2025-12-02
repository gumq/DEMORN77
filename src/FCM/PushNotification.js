import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';

class LocalNotificationService {
  configure = onOpenNotification => {
    PushNotification.createChannel({
      channelId: 'com.eSalesKimTin',
      channelName: 'eSales',
      channelDescription: 'A channel to categorise your notifications',
      soundName: 'default',
      importance: 4,
      vibrate: true,
    });

    PushNotification.configure({
      onRegister: function (token) {
      },
      onNotification: function (notification) {
        if (!notification?.data) {
          return;
        }
        notification.userInteraction = true;
        onOpenNotification(
          Platform.OS === 'ios' ? notification.data.item : notification.data,
        );

        if (Platform.OS === 'ios') {
          PushNotificationIOS.requestPermissions();
          notification.finish(PushNotificationIOS.FetchResult.NoData)
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,

    });
    if (Platform.OS === 'ios') {
      PushNotification.getApplicationIconBadgeNumber(function (number) {
        if (number > 0) {
          PushNotification.setApplicationIconBadgeNumber(0);
        }
      });
    }
  };

  unregister = () => {
    PushNotification.unregister();
  };

  showNotification = (id, title, message, data = {}, options = {}) => {
    PushNotification.localNotification({
      ...this.buildAndroidNotification(id, title, message, data, options),
      channelId: 'com.eSalesKimTin',
      title: title || '',
      message: message || '',
      playSound: true,
      soundName: 'default',
      color: 'red',
      badge: 0,
      userInteraction: false,
      number: 1,
    });
  };

  buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    return {
      id: id,
      autoCancel: true,
      largeIcon: 'default',
      smallIcon: 'ic_notification',
      bigText: message || '',
      subText: title || '',
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || 'high',
      importance: options.importance || 'high',
      data: data,
    };
  };

  buildIOSNotification = (id, title, message, data = {}, options = {}) => {
    return {
      alertAction: 'view',
      category: '',
      userInfo: {},
    }
  };

  cancelAllLocalNotifications = () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };

  removeDeliveredNotificationByID = notificationId => {
    PushNotification.cancelLocalNotification({ id: `${notificationId}` })
  }
}

export const localNotificationService = new LocalNotificationService();
