
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import AuthInput from '../../components/AuthInput';
import Button from '../../components/Button';
import LoadingScreen from '../../components/LoadingScreen';
import colors from '../../constants/colors';
import useAuthStore from '../../store/authStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import config from '../../constants/config';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const login = useAuthStore((state) => state.login);
  const googleLogin = useAuthStore((state) => state.googleLogin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: config.GOOGLE_CLIENT_ID,
    iosClientId: config.GOOGLE_CLIENT_ID,
    webClientId: config.GOOGLE_CLIENT_ID,
    redirectUri: Google.makeRedirectUri({
      scheme: 'customer-service',
    }),
  });

  React.useEffect(() => {
    if (request) {
      console.log('Redirect URI:', request.redirectUri);
    }
  }, [request]);

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleLogin(authentication);
    }
  }, [response]);

  const handleGoogleLogin = async (authentication) => {
    setLoading(true);
    try {
      if (authentication.idToken) {
        // High security: Send ID Token to backend for verification
        const result = await googleLogin({
          idToken: authentication.idToken,
          role: 'consumer',
        });

        if (!result.success) {
          Alert.alert('Google Login Failed', result.error || 'An error occurred');
        }
      } else {
        // Fallback: Fetch user info using accessToken (less secure)
        const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${authentication.accessToken}` },
        });
        const googleUser = await res.json();

        const result = await googleLogin({
          email: googleUser.email,
          username: googleUser.name,
          googleId: googleUser.id,
          profileImage: googleUser.picture,
          role: 'consumer',
        });

        if (!result.success) {
          Alert.alert('Google Login Failed', result.error || 'An error occurred');
        }
      }
    } catch (error) {
      console.error('Google Login Error:', error);
      Alert.alert('Google Login Failed', 'An error occurred during Google sign in');
    } finally {
      setLoading(false);
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login
  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Navigation will happen automatically via App.js
        // No need to manually navigate
      } else {
        Alert.alert('Login Failed', result.error || 'An error occurred');
      }
    } catch (error) {
      Alert.alert('Login Failed', error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      
      {/* Gradient Header */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons name="account-circle" size={80} color={colors.surface} />
        </View>
        <Text style={styles.headerTitle}>Welcome Back!</Text>
        <Text style={styles.headerSubtitle}>Login to continue</Text>
      </LinearGradient>

      {/* Form Container */}
      <ScrollView
        style={styles.formContainer}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <Text style={styles.formTitle}>Login</Text>

          <AuthInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors({ ...errors, email: '' });
            }}
            keyboardType="email-address"
            icon="email"
            error={errors.email}
          />

          <AuthInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors({ ...errors, password: '' });
            }}
            secureTextEntry
            icon="lock"
            error={errors.password}
          />

          <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('forgotPassword')}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => promptAsync()}
            disabled={!request || loading}
          >
            <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupContainer}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.signupText}>
              Don't have an account?{' '}
              <Text style={styles.signupLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {loading && <LoadingScreen message="Logging in..." />}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems:'center'
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.surface,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.surface,
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 24,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.textSecondary,
    fontSize: 14,
  },
  signupContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  signupText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signupLink: {
    color: colors.secondary,
    fontWeight: 'bold',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  googleButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
