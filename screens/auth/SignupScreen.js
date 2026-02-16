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
import { Picker } from '@react-native-picker/picker';
import AuthInput from '../../components/AuthInput';
import Button from '../../components/Button';
import colors from '../../constants/colors';
import config from '../../constants/config';
import authService from '../../services/authService';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import useAuthStore from '../../store/authStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen({ navigation }) {
  const googleLogin = useAuthStore((state) => state.googleLogin);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'consumer',
  });
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
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleSignup(authentication);
    }
  }, [response]);

  const handleGoogleSignup = async (authentication) => {
    setLoading(true);
    try {
      const result = await googleLogin({
        idToken: authentication.idToken,
        role: formData.role, // Pass the selected role from the picker
      });

      if (!result.success) {
        Alert.alert('Google Signup Failed', result.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Google Signup Error:', error);
      Alert.alert('Google Signup Failed', 'An error occurred during Google sign up');
    } finally {
      setLoading(false);
    }
  };

  // Update form field
  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    const { username, email, password, confirmPassword } = formData;

    // Username validation
    if (!username) {
      newErrors.username = 'Username is required';
    } else if (username.length < config.validation.username.minLength) {
      newErrors.username = `Username must be at least ${config.validation.username.minLength} characters`;
    } else if (username.length > config.validation.username.maxLength) {
      newErrors.username = `Username must not exceed ${config.validation.username.maxLength} characters`;
    } else if (!config.validation.username.pattern.test(username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      const { minLength, maxLength } = config.validation.password;
      
      if (password.length < minLength) {
        newErrors.password = `Password must be at least ${minLength} characters`;
      } else if (password.length > maxLength) {
        newErrors.password = `Password must not exceed ${maxLength} characters`;
      } else if (!/[a-z]/.test(password)) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!/[0-9]/.test(password)) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!/[!@#$%^&*()\\-_=+{};:,<.>]/.test(password)) {
        newErrors.password = 'Password must contain at least one special character';
      }
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle signup
  const handleSignup = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const { username, email, password, role } = formData;
      await authService.register({ username, email, password, role });
      
      Alert.alert(
        'Success',
        'Registration successful! Please check your email to verify your account.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Signup Failed', error || 'An error occurred');
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
        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSubtitle}>Join our marketplace today</Text>
      </LinearGradient>

      {/* Form Container */}
      <ScrollView
        style={styles.formContainer}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          <Text style={styles.formTitle}>Sign Up</Text>

          <AuthInput
            placeholder="Username"
            value={formData.username}
            onChangeText={(text) => updateField('username', text)}
            icon="account"
            error={errors.username}
          />

          <AuthInput
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
            keyboardType="email-address"
            icon="email"
            error={errors.email}
          />

          <AuthInput
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => updateField('password', text)}
            secureTextEntry
            icon="lock"
            error={errors.password}
          />

          <AuthInput
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => updateField('confirmPassword', text)}
            secureTextEntry
            icon="lock-check"
            error={errors.confirmPassword}
          />

          {/* Role Selection */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>I want to:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.role}
                onValueChange={(value) => updateField('role', value)}
                style={styles.picker}
              >
                <Picker.Item label="Browse and Request Services (Consumer)" value="consumer" />
                <Picker.Item label="Offer Services (Provider)" value="provider" />
              </Picker>
            </View>
          </View>

          {formData.role === 'provider' && (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                ⓘ Provider accounts require admin approval before you can create services.
              </Text>
            </View>
          )}

          <Button
            title="Sign Up"
            onPress={handleSignup}
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
            style={styles.loginContainer}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginLink}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
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
    paddingBottom: 40,
  },
  form: {
    backgroundColor: colors.surface,
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
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  picker: {
    height: 56,
  },
  infoBox: {
    backgroundColor: colors.info + '15',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.info,
  },
  infoText: {
    fontSize: 13,
    color: colors.info,
    lineHeight: 18,
  },
  loginContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: 'bold',
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
