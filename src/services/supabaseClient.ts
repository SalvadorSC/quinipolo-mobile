import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { AUTH_TOKEN_STORAGE_KEY } from '../utils/config';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Debug logging (development only)
if (__DEV__) {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Anon Key exists:', !!supabaseAnonKey);
  console.log('Platform:', Platform.OS);
}

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase configuration. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Storage adapter that works on both web and native
// On web, use localStorage; on native, use SecureStore
const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
          const value = localStorage.getItem(key);
          if (__DEV__) {
            console.log(`[Supabase Storage] getItem(${key}) [web]:`, value ? 'exists' : 'null');
          }
          return value;
        }
        return null;
      } else {
        const value = await SecureStore.getItemAsync(key);
        if (__DEV__) {
          console.log(`[Supabase Storage] getItem(${key}) [native]:`, value ? 'exists' : 'null');
        }
        return value;
      }
    } catch (error) {
      console.error(`[Supabase Storage] Error getting ${key}:`, error);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(key, value);
          if (__DEV__) {
            console.log(`[Supabase Storage] setItem(${key}) [web]: success`);
          }
        }
      } else {
        await SecureStore.setItemAsync(key, value);
        if (__DEV__) {
          console.log(`[Supabase Storage] setItem(${key}) [native]: success`);
        }
      }
    } catch (error) {
      console.error(`[Supabase Storage] Error setting ${key}:`, error);
      // Handle storage errors gracefully
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(key);
          if (__DEV__) {
            console.log(`[Supabase Storage] removeItem(${key}) [web]: success`);
          }
        }
      } else {
        await SecureStore.deleteItemAsync(key);
        if (__DEV__) {
          console.log(`[Supabase Storage] removeItem(${key}) [native]: success`);
        }
      }
    } catch (error) {
      console.error(`[Supabase Storage] Error removing ${key}:`, error);
      // Handle storage errors gracefully
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: AUTH_TOKEN_STORAGE_KEY,
    storage: secureStorage,
  },
});
