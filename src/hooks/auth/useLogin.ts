import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResult {
  success: boolean;
  error?: string;
}

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (
    credentials: LoginCredentials
  ): Promise<LoginResult> => {
    setLoading(true);
    setError(null);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return { success: false, error: error.message };
      }

      // UserContext will automatically handle the auth state change
      setLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const loginWithGoogle = async (): Promise<LoginResult> => {
    setLoading(true);
    setError(null);

    try {
      // Note: Google OAuth requires additional setup in Expo
      // For now, this is a placeholder
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return { success: false, error: error.message };
      }

      setLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => setError(null);

  return {
    login,
    loginWithGoogle,
    loading,
    error,
    clearError,
  };
};
