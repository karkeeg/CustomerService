// App configuration constants
export const config = {
  // API Configuration
  // IMPORTANT: Replace with your local IP address
  // Find your IP: Windows (ipconfig), Mac/Linux (ifconfig)
  // API_URL: 'http://192.168.1.64:5000/api', // Your backend IP
  API_URL: 'http://192.168.1.66:5000/api', // Your backend IP
  
  // App Information
  APP_NAME: 'Customer Service',
  APP_VERSION: '1.0.0',
  
  // Validation Rules
  validation: {
    username: {
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_]+$/,
    },
    password: {
      minLength: 8,
      maxLength: 28,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSpecial: true,
    },
  },
  
  // User Roles
  roles: {
    CONSUMER: 'consumer',
    PROVIDER: 'provider',
    ADMIN: 'admin',
  },
};

export default config;
