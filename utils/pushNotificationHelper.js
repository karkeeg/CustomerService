import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configure how notifications should be handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register for push notifications and get the token
 */
export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }
    
    // Get the token from Expo
    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.expoConfig?.id;
      
      if (!projectId) {
        console.log('Project ID not found. Skipping push token registration.');
        return null;
      }

      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log('Push Token:', token);
    } catch (e) {
      console.error('Error getting push token:', e);
      return null;
    }
  } else {
    console.log('Must use physical device for Push Notifications');
    return null;
  }

  return token;
}

/**
 * Add notification listeners
 * @param {Function} handleNotification - Callback for when a notification is received in foreground
 * @param {Function} handleNotificationResponse - Callback for when a user interacts with a notification
 */
export function addNotificationListeners(handleNotification, handleNotificationResponse) {
  const notificationListener = Notifications.addNotificationReceivedListener(handleNotification);
  const responseListener = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

  return () => {
    notificationListener.remove();
    responseListener.remove();
  };
}
