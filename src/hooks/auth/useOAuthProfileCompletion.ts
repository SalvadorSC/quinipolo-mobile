import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../services/supabaseClient';
import apiClient from '../../services/api';

interface UseOAuthProfileCompletionReturn {
  showModal: boolean;
  completeProfile: (username: string, birthday: string) => Promise<void>;
  dismissModal: () => void;
  loading: boolean;
  error: string | null;
}

const isGoogleUser = (user: any): boolean => {
  if (!user) return false;
  const identities = user.identities || [];
  return identities.some(
    (identity: any) => identity.provider === 'google'
  );
};

export const useOAuthProfileCompletion = (): UseOAuthProfileCompletionReturn => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          return;
        }

        if (!isGoogleUser(user)) {
          return;
        }

        // Check if profile exists
        try {
          await apiClient.get('/api/users/me/profile');
          // Profile exists, no need to show modal
        } catch (err: any) {
          if (err?.response?.status === 404) {
            // Profile doesn't exist, show modal
            setShowModal(true);
          }
          // For other errors, silently fail to avoid breaking the app
        }
      } catch (err) {
        console.error('[useOAuthProfileCompletion] Error checking profile:', err);
      }
    };

    checkProfileCompletion();
  }, []);

  const completeProfile = useCallback(async (username: string, birthday: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setError('No authenticated user found');
        setLoading(false);
        return;
      }

      const fullName =
        user.user_metadata?.['full_name'] ||
        user.user_metadata?.['name'] ||
        '';

      await apiClient.post('/api/auth/google-signup', {
        userId: user.id,
        email: user.email,
        fullName,
        username,
        birthday,
        isUserOver18: true,
      });

      setShowModal(false);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to complete profile';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const dismissModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return {
    showModal,
    completeProfile,
    dismissModal,
    loading,
    error,
  };
};
