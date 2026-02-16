import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SignupScreen';
import HomeScreen from './screens/home/HomeScreen';
import LoadingScreen from './components/LoadingScreen';
import useAuthStore from './store/authStore';
import ForgotPassword from './screens/auth/ForgotPassword';

// Provider Screens
import ProviderDashboardScreen from './screens/provider/ProviderDashboardScreen';
import ServiceFormScreen from './screens/provider/ServiceFormScreen';
import EditProfileScreen from './screens/common/EditProfileScreen';

// Consumer Screens
import ConsumerDashboardScreen from './screens/consumer/ConsumerDashboardScreen';
import BrowseServicesScreen from './screens/consumer/BrowseServicesScreen';
import MyRequestsScreen from './screens/consumer/MyRequestsScreen';

// Admin Screens
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen';
import ManageUsersScreen from './screens/admin/ManageUsersScreen';
import AdminManageServicesScreen from './screens/admin/AdminManageServicesScreen';
import ProviderApprovalScreen from './screens/admin/ProviderApprovalScreen';
import NotificationsScreen from './screens/common/NotificationsScreen';

const Stack = createNativeStackNavigator();

import { registerForPushNotificationsAsync, addNotificationListeners } from './utils/pushNotificationHelper';
import notificationService from './services/notificationService';

import OfflineNotice from './components/OfflineNotice';

export default function App() {
  const { isAuthenticated, isLoading, initializeAuth, user } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize auth state from AsyncStorage
    const init = async () => {
      await initializeAuth();
      setIsReady(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Setup Push Notifications
      const setupPush = async () => {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          try {
            await notificationService.registerPushToken(token);
            console.log('Push token registered with backend');
          } catch (error) {
            console.error('Failed to register push token:', error);
          }
        }
      };
      setupPush();

      // Listeners
      const cleanup = addNotificationListeners(
        (notification) => {
          // Foreground notification received
          // console.log('Notification received:', notification);
        },
        (response) => {
          // User clicked on notification
          // navigation.navigate('Notifications'); // Need to handle navigation here or in listeners
        }
      );

      return cleanup;
    }
  }, [isAuthenticated, user]);

  // Show loading screen while checking auth
  if (!isReady || isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  return (
    <SafeAreaProvider>
      <OfflineNotice />
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={isAuthenticated ? 'Home' : 'Login'}
            screenOptions={{
              headerShown: false,
            }}
          >
            {isAuthenticated ? (
              // Authenticated Stack
              <>
                <Stack.Screen name="Home" component={HomeScreen} />
                
                {/* Provider Screens */}
                <Stack.Screen name="ProviderDashboard" component={ProviderDashboardScreen} />
                <Stack.Screen name="ServiceForm" component={ServiceFormScreen} />
                
                {/* Consumer Screens */}
                <Stack.Screen name="ConsumerDashboard" component={ConsumerDashboardScreen} />
                <Stack.Screen name="BrowseServices" component={BrowseServicesScreen} />
                <Stack.Screen name="MyRequests" component={MyRequestsScreen} />
                
                {/* Common Authenticated Screens */}
                <Stack.Screen name="EditProfile" component={EditProfileScreen} />

                {/* Admin Screens */}
                <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
                <Stack.Screen name="ManageUsers" component={ManageUsersScreen} />
                <Stack.Screen name="AdminManageServices" component={AdminManageServicesScreen} />
                <Stack.Screen name="ProviderApprovals" component={ProviderApprovalScreen} />
                <Stack.Screen name="Notifications" component={NotificationsScreen} />
              </>
            ) : (
              // Auth Stack
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="forgotPassword" component={ForgotPassword} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
