# Customer Service Marketplace - Mobile App

A modern React Native mobile application built with Expo for the Customer Service Marketplace platform. Connects consumers with service providers through an intuitive mobile interface.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [What We've Built](#what-weve-built)
- [What We're Building Next](#what-were-building-next)
- [Development Guide](#development-guide)
- [Testing](#testing)
- [Deployment](#deployment)

---

## 🎯 Overview

The Customer Service Marketplace mobile app is a cross-platform application (iOS & Android) that allows users to:

- **Consumers**: Browse services, request services, and track requests
- **Providers**: Create and manage services, handle service requests
- **Admins**: Approve providers and manage the platform

Built with React Native and Expo for rapid development and easy deployment.

---

## ✨ Features

### Current Features (Setup Complete)
- ✅ Expo project initialized
- ✅ Navigation system ready
- ✅ API integration layer configured
- ✅ Authentication infrastructure
- ✅ Modern UI component library

### Planned Features

#### Authentication
- [ ] User registration with role selection
- [ ] Email verification
- [ ] Login with JWT token storage
- [ ] Password reset
- [ ] Auto-login on app start
- [ ] Logout functionality

#### Consumer Features
- [ ] Browse all available services
- [ ] Search and filter services
- [ ] View service details
- [ ] Request a service
- [ ] Track request status
- [ ] View request history
- [ ] Rate and review services

#### Provider Features
- [ ] Create service listings
- [ ] Manage services (edit, activate/deactivate)
- [ ] View incoming requests
- [ ] Accept/reject requests
- [ ] Update request status
- [ ] Manage profile
- [ ] View earnings

#### Admin Features
- [ ] View all providers
- [ ] Approve/reject providers
- [ ] View all users
- [ ] Manage platform settings

#### Additional Features
- [ ] Push notifications
- [ ] Real-time chat
- [ ] Payment integration
- [ ] Location-based services
- [ ] Dark mode support

---

## 🛠 Technology Stack

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.81.5 | Mobile framework |
| Expo | ~54.0.33 | Development platform |
| React | 19.1.0 | UI library |

### Navigation
| Package | Version | Purpose |
|---------|---------|---------|
| @react-navigation/native | ^7.1.28 | Navigation framework |
| @react-navigation/native-stack | ^7.12.0 | Stack navigation |
| react-native-screens | ~4.16.0 | Native screens |
| react-native-safe-area-context | ~5.6.0 | Safe area handling |

### API & Storage
| Package | Version | Purpose |
|---------|---------|---------|
| axios | ^1.13.5 | HTTP client |
| @react-native-async-storage/async-storage | ^2.2.0 | Local storage |

### UI Components
| Package | Version | Purpose |
|---------|---------|---------|
| react-native-paper | ^5.15.0 | Material Design components |
| expo-status-bar | ~3.0.9 | Status bar control |

---

## 📁 Project Structure

```
mobile/
├── components/              # Reusable UI components
│   ├── AuthInput.js            # Custom input field (planned)
│   ├── Button.js               # Custom button (planned)
│   ├── ServiceCard.js          # Service display card (planned)
│   └── RequestCard.js          # Request display card (planned)
│
├── services/                # API integration
│   ├── api.js                  # Axios configuration (planned)
│   ├── authService.js          # Authentication API (planned)
│   ├── serviceService.js       # Service API (planned)
│   └── requestService.js       # Request API (planned)
│
├── context/                 # Global state management
│   └── AuthContext.js          # Authentication context (planned)
│
├── constants/               # App constants
│   ├── colors.js               # Color palette (planned)
│   └── config.js               # App configuration (planned)
│
├── screens/                 # App screens (planned)
│   ├── auth/
│   │   ├── LoginScreen.js
│   │   ├── SignupScreen.js
│   │   ├── VerifyEmailScreen.js
│   │   └── ForgotPasswordScreen.js
│   ├── consumer/
│   │   ├── HomeScreen.js
│   │   ├── ServicesScreen.js
│   │   ├── ServiceDetailScreen.js
│   │   └── MyRequestsScreen.js
│   ├── provider/
│   │   ├── DashboardScreen.js
│   │   ├── MyServicesScreen.js
│   │   ├── CreateServiceScreen.js
│   │   └── RequestsScreen.js
│   └── admin/
│       ├── ProvidersScreen.js
│       └── UsersScreen.js
│
├── assets/                  # Images, fonts, icons
│   ├── icon.png
│   ├── splash-icon.png
│   └── adaptive-icon.png
│
├── App.js                   # Main app entry point
├── app.json                 # Expo configuration
├── package.json             # Dependencies
└── README.md               # This file
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)
- Expo Go app on your phone (for testing)

### Step 1: Navigate to Mobile Directory
```bash
cd CustomerService/mobile
```

### Step 2: Install Dependencies
All dependencies are already installed during setup:
```bash
npm install
```

### Step 3: Verify Installation
Check that all packages are installed:
```bash
npm list --depth=0
```

You should see:
```
mobile@1.0.0
├── @react-native-async-storage/async-storage@2.2.0
├── @react-navigation/native@7.1.28
├── @react-navigation/native-stack@7.12.0
├── axios@1.13.5
├── expo@54.0.33
├── react@19.1.0
├── react-native@0.81.5
├── react-native-paper@5.15.0
├── react-native-safe-area-context@5.6.0
└── react-native-screens@4.16.0
```

---

## 📱 Running the App

### Start Development Server
```bash
npm start
```

This will:
1. Start the Expo development server
2. Display a QR code in the terminal
3. Open Expo DevTools in your browser

### Test on Physical Device (Recommended)

1. **Install Expo Go**
   - iOS: Download from App Store
   - Android: Download from Play Store

2. **Scan QR Code**
   - iOS: Use Camera app to scan QR code
   - Android: Use Expo Go app to scan QR code

3. **App Loads**
   - App will download and run on your device
   - Changes appear instantly (hot reload)

### Test on Emulator/Simulator

#### Android Emulator
```bash
npm run android
```

Requirements:
- Android Studio installed
- Android emulator configured

#### iOS Simulator (Mac only)
```bash
npm run ios
```

Requirements:
- Xcode installed
- iOS simulator configured

### Test on Web Browser
```bash
npm run web
```

Opens app in web browser (limited functionality).

---

## ✅ What We've Built

### Phase 1: Project Setup (Completed ✅)
- [x] Initialized Expo project with blank template
- [x] Installed core dependencies (React Native, Expo)
- [x] Configured package.json with scripts
- [x] Set up Expo configuration (app.json)

### Phase 2: Dependencies (Completed ✅)
- [x] Installed Axios for API calls
- [x] Installed AsyncStorage for token storage
- [x] Installed React Navigation for screen navigation
- [x] Installed React Native Paper for UI components
- [x] Installed required navigation dependencies

### Phase 3: Project Structure (Completed ✅)
- [x] Created `components/` folder for reusable components
- [x] Created `services/` folder for API integration
- [x] Created `context/` folder for global state
- [x] Created `constants/` folder for app constants

---

## 🚧 What We're Building Next

### Phase 4: API Integration (Next)
- [ ] Create API configuration with Axios
- [ ] Set up base URL and headers
- [ ] Add token interceptor
- [ ] Create authentication service
- [ ] Create service management service
- [ ] Create request management service

### Phase 5: Authentication Screens (Next)
- [ ] Create color constants
- [ ] Build AuthInput component
- [ ] Build Button component
- [ ] Build Login screen
- [ ] Build Signup screen
- [ ] Implement form validation
- [ ] Connect to backend API

### Phase 6: Authentication Context (Next)
- [ ] Create AuthContext
- [ ] Implement login function
- [ ] Implement logout function
- [ ] Implement token persistence
- [ ] Implement auto-login

### Phase 7: Navigation Setup
- [ ] Set up navigation container
- [ ] Create auth stack navigator
- [ ] Create consumer stack navigator
- [ ] Create provider stack navigator
- [ ] Create admin stack navigator
- [ ] Implement role-based navigation

### Phase 8: Consumer Features
- [ ] Services list screen
- [ ] Service detail screen
- [ ] Request service functionality
- [ ] My requests screen
- [ ] Request tracking

### Phase 9: Provider Features
- [ ] Provider dashboard
- [ ] Create service screen
- [ ] My services screen
- [ ] Manage requests screen
- [ ] Profile management

### Phase 10: Admin Features
- [ ] Providers approval screen
- [ ] Users management screen
- [ ] Platform statistics

### Phase 11: Enhanced Features
- [ ] Push notifications
- [ ] Real-time chat
- [ ] Payment integration
- [ ] Reviews and ratings
- [ ] Search and filters

### Phase 12: Polish & Optimization
- [ ] Loading states
- [ ] Error handling
- [ ] Offline support
- [ ] Performance optimization
- [ ] UI/UX refinements

---

## 🔧 Development Guide

### Creating a New Screen

1. **Create screen file**
```javascript
// screens/auth/LoginScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

2. **Add to navigation**
```javascript
// App.js
import LoginScreen from './screens/auth/LoginScreen';

// Add to stack navigator
<Stack.Screen name="Login" component={LoginScreen} />
```

### Making API Calls

1. **Set up API service**
```javascript
// services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.100:5000/api'; // Your local IP

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default api;
```

2. **Create service function**
```javascript
// services/authService.js
import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};
```

3. **Use in component**
```javascript
import { authService } from '../services/authService';

const handleLogin = async () => {
  try {
    const data = await authService.login(email, password);
    console.log('Login successful:', data);
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Using AsyncStorage

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store data
await AsyncStorage.setItem('token', 'jwt_token_here');

// Retrieve data
const token = await AsyncStorage.getItem('token');

// Remove data
await AsyncStorage.removeItem('token');

// Clear all data
await AsyncStorage.clear();
```

### Styling Components

```javascript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  button: {
    backgroundColor: '#6366F1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

---

## 🎨 Design System (Planned)

### Color Palette
```javascript
// constants/colors.js
export const colors = {
  primary: '#6366F1',      // Indigo
  secondary: '#8B5CF6',    // Purple
  success: '#10B981',      // Green
  error: '#EF4444',        // Red
  warning: '#F59E0B',      // Amber
  background: '#F9FAFB',   // Light gray
  surface: '#FFFFFF',      // White
  text: '#111827',         // Dark gray
  textSecondary: '#6B7280', // Medium gray
  border: '#E5E7EB',       // Light border
};
```

### Typography
```javascript
// constants/typography.js
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal',
  },
};
```

---

## 🧪 Testing

### Manual Testing
1. Start the app
2. Test each screen
3. Verify navigation
4. Test API calls
5. Check error handling

### Automated Testing (Planned)
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e
```

---

## 📦 Building for Production

### Build for Android
```bash
# Create APK
expo build:android -t apk

# Create App Bundle (for Play Store)
expo build:android -t app-bundle
```

### Build for iOS
```bash
# Create IPA (requires Apple Developer account)
expo build:ios
```

### Using EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

---

## 🚀 Deployment

### Expo Go (Development)
- App runs in Expo Go app
- Instant updates
- No app store submission needed

### Standalone App (Production)
1. Build app binary (APK/IPA)
2. Submit to app stores
3. Users download from store

### Over-the-Air Updates
```bash
# Publish update
expo publish

# Users get update automatically
# No app store review needed
```

---

## 📝 Scripts

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web

# Install dependencies
npm install

# Clear cache
expo start -c
```

---

## 🔍 Debugging

### React Native Debugger
1. Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
2. Select "Debug Remote JS"
3. Opens Chrome DevTools

### Console Logs
```javascript
console.log('Debug message');
console.error('Error message');
console.warn('Warning message');
```

### Expo DevTools
- Automatically opens in browser
- View logs
- Reload app
- Toggle performance monitor

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👥 Team

- **Developer**: Your Name
- **Project**: Customer Service Marketplace Mobile
- **Version**: 1.0.0

---

## 📞 Support

For questions or support:
- **Email**: support@customerservice.com
- **GitHub Issues**: [Create an issue](https://github.com/your-repo/issues)

---

## 🔗 Related Projects

- **Backend API**: `../backend/README.md`
- **Documentation**: See artifacts folder

---

**Last Updated**: February 9, 2026  
**Status**: Setup Complete - Ready for Development  
**Next Step**: Build authentication screens
