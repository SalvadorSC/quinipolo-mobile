import axios from 'axios';
import { supabase } from './supabaseClient';
import { config } from '../utils/config';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
});

// Helper to get the current Supabase access token with automatic refresh
const getAccessToken = async (): Promise<string | null> => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('[API] Error getting session:', error);
      return null;
    }

    if (!session) {
      console.warn('[API] No session available');
      return null;
    }

    if (!session.access_token) {
      console.warn('[API] Session exists but no access token');
      return null;
    }

    // Check if token is expired or about to expire (within 5 minutes)
    if (session.expires_at) {
      const expiresAt = new Date(session.expires_at * 1000);
      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

      if (expiresAt <= fiveMinutesFromNow) {
        console.log('[API] Token expired or expiring soon, refreshing...');
        const {
          data: { session: refreshedSession },
          error: refreshError,
        } = await supabase.auth.refreshSession();

        if (refreshError) {
          console.error('[API] Error refreshing session:', refreshError);
          return null;
        }

        if (!refreshedSession?.access_token) {
          console.error('[API] Refreshed session has no access token');
          return null;
        }

        return refreshedSession.access_token;
      }
    }

    return session.access_token;
  } catch (error) {
    console.error('[API] Error in getAccessToken:', error);
    return null;
  }
};

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  async (axiosConfig) => {
    try {
      const token = await getAccessToken();
      const url = axiosConfig.url || 'unknown';
      console.log(`[API] ${axiosConfig.method?.toUpperCase()} ${url} - Token:`, token ? 'exists' : 'null');
      
      if (token) {
        // Ensure headers object exists - axios needs this to be set properly
        if (!axiosConfig.headers) {
          axiosConfig.headers = {} as any;
        }
        // Set Authorization header
        axiosConfig.headers.Authorization = `Bearer ${token}`;
        console.log(`[API] Authorization header set for ${url}`);
      } else {
        console.warn(`[API] No access token available for ${url} - request may fail`);
        // Log current session state for debugging
        const { data: { session } } = await supabase.auth.getSession();
        console.log('[API] Current session state:', {
          hasSession: !!session,
          hasToken: !!session?.access_token,
          expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'N/A',
        });
      }
    } catch (error) {
      console.error('[API] Error in request interceptor:', error);
    }
    return axiosConfig;
  },
  (error) => {
    console.error('[API] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log('Authentication error (401), attempting to refresh session...');
      
      try {
        // Try to refresh the session
        const {
          data: { session },
          error: refreshError,
        } = await supabase.auth.refreshSession();

        if (refreshError || !session?.access_token) {
          console.error('Failed to refresh session:', refreshError);
          // Session refresh failed, user needs to login again
          // In React Native, we can't redirect like in web, so we'll just log
          // You might want to navigate to login screen here
          throw new Error('Authentication required - please login again');
        }

        // Update the authorization header with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
        }

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Error refreshing session:', refreshError);
        // If refresh fails, reject the request
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      console.error('Forbidden (403) - Insufficient permissions');
      throw new Error('Insufficient permissions');
    }

    return Promise.reject(error);
  }
);

// API functions
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/api/users/me/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export default apiClient;

