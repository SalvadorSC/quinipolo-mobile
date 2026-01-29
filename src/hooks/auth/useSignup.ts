import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

interface SignupData {
  email: string;
  password: string;
  username: string;
  fullName: string;
  birthday: string;
  isUserOver18: boolean;
}

interface SignupResult {
  success: boolean;
  error?: string;
  needsEmailConfirmation?: boolean;
}

export const useSignup = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signup = async (data: SignupData): Promise<SignupResult> => {
    setLoading(true);
    setError(null);

    const { email, password, username, fullName, birthday, isUserOver18 } = data;

    try {
      // Sign up with Supabase auth first
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            fullName,
            birthday,
            isUserOver18,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return { success: false, error: authError.message };
      }

      // TODO: Call backend API to create profile and add to leagues
      // This will be implemented when we integrate with the backend API
      // For now, the profile will be created when user first accesses it

      setLoading(false);

      // Check if email confirmation is required
      const needsConfirmation = !authData.session && authData.user?.identities?.length === 0;

      return {
        success: true,
        needsEmailConfirmation: needsConfirmation
      };
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => setError(null);

  return {
    signup,
    loading,
    error,
    clearError,
  };
};
