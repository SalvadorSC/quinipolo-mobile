import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../services/api';

interface Quinipolo {
  id: string;
  league_id: string;
  league_name: string;
  end_date: string;
  has_been_corrected: boolean;
  participants_who_answered?: string[];
  answered?: boolean;
  is_deleted?: boolean;
}

interface UseQuinipolosOptions {
  userId?: string;
  leagueId?: string;
  autoFetch?: boolean;
}

interface UseQuinipolosResult {
  quinipolos: Quinipolo[];
  loading: boolean;
  error: string | null;
  fetchQuinipolos: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useQuinipolos = ({
  userId,
  leagueId,
  autoFetch = true,
}: UseQuinipolosOptions = {}): UseQuinipolosResult => {
  const [quinipolos, setQuinipolos] = useState<Quinipolo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuinipolos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (leagueId) {
        // Fetch quinipolos for a specific league
        response = await apiClient.get(`/api/leagues/league/${leagueId}/leagueQuinipolos`);
      } else {
        // Fetch quinipolos for the current user
        response = await apiClient.get('/api/users/me/quinipolos');
      }

      const data = response.data;

      // Sort by end_date (newest to oldest)
      const sortedData = Array.isArray(data)
        ? [...data].sort((a: Quinipolo, b: Quinipolo) => {
            const aTime = new Date(a.end_date).getTime();
            const bTime = new Date(b.end_date).getTime();
            return bTime - aTime;
          })
        : [];

      setQuinipolos(sortedData);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err.message || 'Failed to fetch quinipolos';
      setError(errorMessage);
      console.error('Error fetching quinipolos:', err);
    } finally {
      setLoading(false);
    }
  }, [leagueId]);

  useEffect(() => {
    if (autoFetch && (userId || leagueId)) {
      fetchQuinipolos();
    }
  }, [autoFetch, userId, leagueId, fetchQuinipolos]);

  const refetch = useCallback(async () => {
    await fetchQuinipolos();
  }, [fetchQuinipolos]);

  return {
    quinipolos,
    loading,
    error,
    fetchQuinipolos,
    refetch,
  };
};
