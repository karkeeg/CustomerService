
export const config = {
  // ============================================
  // API CONFIGURATION
  // ============================================
  // IMPORTANT: Update this with your local IP address
  // 
  // How to find your IP:
  // - Windows: Open CMD, type 'ipconfig', look for IPv4 Address
  // - Mac: Open Terminal, type 'ifconfig | grep "inet "', look for 192.168.x.x
  // - Linux: Open Terminal, type 'hostname -I'
  //
  // Examples:
  // API_URL: 'http://192.168.1.100:5000/api',  // Local development
  // API_URL: 'https://myapp.herokuapp.com/api', // Production
  
  API_URL: 'http://192.168.1.64:5000/api', 
  
  // ============================================
  // APP INFORMATION
  // ============================================
  APP_NAME: 'Customer Service',
  APP_VERSION: '1.0.0',
  
  // ============================================
  // VALIDATION RULES
  // ============================================
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
  
  // ============================================
  // USER ROLES
  // ============================================
  roles: {
    CONSUMER: 'consumer',
    PROVIDER: 'provider',
    ADMIN: 'admin',
  },
};

export default config;
