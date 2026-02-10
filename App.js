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

// Consumer Screens
import ConsumerDashboardScreen from './screens/consumer/ConsumerDashboardScreen';
import BrowseServicesScreen from './screens/consumer/BrowseServicesScreen';
import MyRequestsScreen from './screens/consumer/MyRequestsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize auth state from AsyncStorage
    const init = async () => {
      await initializeAuth();
      setIsReady(true);
    };
    init();
  }, []);

  // Show loading screen while checking auth
  if (!isReady || isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  return (
    <SafeAreaProvider>
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
