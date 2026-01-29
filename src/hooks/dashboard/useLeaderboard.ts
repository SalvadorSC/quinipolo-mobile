import { useState, useCallback, useEffect } from 'react';
import apiClient from '../../services/api';

export interface LeaderboardEntry {
  username: string;
  nQuinipolosParticipated: number;
  totalPoints: number;
  fullCorrectQuinipolos: number;
}

interface UseLeaderboardOptions {
  leagueId: string | null;
  autoFetch?: boolean;
}

interface UseLeaderboardResult {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  fetchLeaderboard: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useLeaderboard = ({
  leagueId,
  autoFetch = true,
}: UseLeaderboardOptions): UseLeaderboardResult => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    if (!leagueId) {
      setError('No league ID provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/api/leagues/${leagueId}/leaderboard`);
      const data = response.data;

      // Transform and sort leaderboard data
      const transformedData: LeaderboardEntry[] = data.participantsLeaderboard.map(
        (entry: any) => ({
          username: entry.username,
          nQuinipolosParticipated: entry.nQuinipolosParticipated,
          totalPoints: entry.points,
          fullCorrectQuinipolos: entry.fullCorrectQuinipolos,
        })
      );

      // Sort by total points (descending)
      const sortedData = transformedData.sort((a, b) => b.totalPoints - a.totalPoints);

      setLeaderboard(sortedData);
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err);
      setError(err?.response?.data?.message || 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  }, [leagueId]);

  const refetch = useCallback(async () => {
    await fetchLeaderboard();
  }, [fetchLeaderboard]);

  useEffect(() => {
    if (autoFetch && leagueId) {
      fetchLeaderboard();
    }
  }, [autoFetch, leagueId, fetchLeaderboard]);

  return {
    leaderboard,
    loading,
    error,
    fetchLeaderboard,
    refetch,
  };
};
