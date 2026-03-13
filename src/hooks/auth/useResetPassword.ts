import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

interface UseResetPasswordReturn {
  resetPassword: (newPassword: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  isValidLink: boolean | null;
}

export const useResetPassword = (): UseResetPasswordReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidLink, setIsValidLink] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('[useResetPassword] Session error:', sessionError);
          setIsValidLink(false);
          return;
        }
        setIsValidLink(!!session);
      } catch (err) {
        console.error('[useResetPassword] Error checking session:', err);
        setIsValidLink(false);
      }
    };

    checkSession();
  }, []);

  const resetPassword = async (newPassword: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);

      // Sign out after successful password reset
      await supabase.auth.signOut();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    resetPassword,
    loading,
    error,
    success,
    isValidLink,
  };
};
