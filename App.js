import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SignupScreen';
import HomeScreen from './screens/home/HomeScreen';
import LoadingScreen from './components/LoadingScreen';
import useAuthStore from './store/authStore';
import ForgotPassword from './screens/auth/ForgotPassword';

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
            <Stack.Screen name="Home" component={HomeScreen} />
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
  );
}
