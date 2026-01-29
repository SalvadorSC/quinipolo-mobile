// Environment configuration utility for React Native
export const config = {
  // Base URL for the application
  baseUrl:
    __DEV__
      ? 'http://localhost:3001'
      : 'https://quinipolo.com', // Replace with your production URL

  // API base URL
  apiBaseUrl:
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    (__DEV__ ? 'http://localhost:3000' : 'https://quinipolo.onrender.com'),

  // Supabase configuration
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL,
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },

  // Environment
  isDevelopment: __DEV__,
  isProduction: !__DEV__,
};

// Helper function to get redirect URLs
export const getRedirectUrl = (path: string): string => {
  return `${config.baseUrl}${path}`;
};

// Centralized storage key for Supabase auth token
export const AUTH_TOKEN_STORAGE_KEY = 'quinipolo-auth-token';

// Quinipolo filtering configuration
export const PENDING_QUINIPOLO_RECENT_DAYS = 30;
