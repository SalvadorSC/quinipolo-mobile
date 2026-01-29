import { useState, useCallback, useEffect } from 'react';
import apiClient from '../../services/api';

interface LeagueDetails {
  id: string;
  league_name: string;
  description?: string;
  created_at?: string;
  created_by?: string;
  creator?: {
    username: string;
    full_name?: string;
  };
  icon_style?: {
    icon?: string;
    icon_color?: string;
    accent_color?: string;
  };
  participants: {
    user_id: string;
    username: string;
    role: string;
  }[];
  isPrivate: boolean;
}

interface UseLeagueDetailsOptions {
  leagueId: string | null;
  autoFetch?: boolean;
}

interface UseLeagueDetailsResult {
  leagueDetails: LeagueDetails | null;
  loading: boolean;
  error: string | null;
  fetchLeagueDetails: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useLeagueDetails = ({
  leagueId,
  autoFetch = true,
}: UseLeagueDetailsOptions): UseLeagueDetailsResult => {
  const [leagueDetails, setLeagueDetails] = useState<LeagueDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeagueDetails = useCallback(async () => {
    if (!leagueId) {
      setError('No league ID provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/api/leagues/${leagueId}`);
      const data = response.data;

      setLeagueDetails({
        id: data.id,
        league_name: data.league_name,
        description: data.description,
        created_at: data.created_at,
        created_by: data.created_by,
        creator: data.creator,
        icon_style: data.icon_style,
        participants: data.participants || [],
        isPrivate:
          data.isPrivate !== undefined
            ? data.isPrivate
            : data.is_private !== undefined
            ? data.is_private
            : false,
      });
    } catch (err: any) {
      console.error('Error fetching league details:', err);
      setError(err?.response?.data?.message || 'Failed to fetch league details');
    } finally {
      setLoading(false);
    }
  }, [leagueId]);

  const refetch = useCallback(async () => {
    await fetchLeagueDetails();
  }, [fetchLeagueDetails]);

  useEffect(() => {
    if (autoFetch && leagueId) {
      fetchLeagueDetails();
    }
  }, [autoFetch, leagueId, fetchLeagueDetails]);

  return {
    leagueDetails,
    loading,
    error,
    fetchLeagueDetails,
    refetch,
  };
};
