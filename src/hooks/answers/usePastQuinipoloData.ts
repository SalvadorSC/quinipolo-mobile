import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../services/api';
import { QuinipoloData, AnswerType } from './types';

interface UsePastQuinipoloDataOptions {
  quinipoloId: string | null;
  autoFetch?: boolean;
}

interface UsePastQuinipoloDataResult {
  loading: boolean;
  quinipolo: QuinipoloData | null;
  userAnswers: AnswerType[];
  pointsEarned: number | null;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePastQuinipoloData = ({
  quinipoloId,
  autoFetch = true,
}: UsePastQuinipoloDataOptions): UsePastQuinipoloDataResult => {
  const [loading, setLoading] = useState(false);
  const [quinipolo, setQuinipolo] = useState<QuinipoloData | null>(null);
  const [userAnswers, setUserAnswers] = useState<AnswerType[]>([]);
  const [pointsEarned, setPointsEarned] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!quinipoloId) {
      setError('No quinipolo ID provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch quinipolo details with user's answers
      const response = await apiClient.get(
        `/api/quinipolos/quinipolo/${quinipoloId}/answers-see`
      );
      const data = response.data;

      setQuinipolo(data.quinipolo);
      setUserAnswers(data.answers || []);
      setPointsEarned(data.points_earned || null);
    } catch (err: any) {
      console.error('Error fetching past quinipolo data:', err);

      // If the error is because the user hasn't answered, try to fetch just the quinipolo
      if (err?.response?.status === 404 || err?.response?.data?.message?.includes('No answer found')) {
        try {
          const quinipoloResponse = await apiClient.get(
            `/api/quinipolos/quinipolo/${quinipoloId}`
          );
          setQuinipolo(quinipoloResponse.data);
          setUserAnswers([]);
          setPointsEarned(null);
          setError(null); // Clear error since we successfully got the quinipolo
        } catch (quinipoloErr: any) {
          console.error('Error fetching quinipolo:', quinipoloErr);
          setError(quinipoloErr?.response?.data?.message || 'Failed to fetch quinipolo data');
        }
      } else {
        setError(err?.response?.data?.message || 'Failed to fetch quinipolo data');
      }
    } finally {
      setLoading(false);
    }
  }, [quinipoloId]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (autoFetch && quinipoloId) {
      fetchData();
    }
  }, [autoFetch, quinipoloId, fetchData]);

  return {
    loading,
    quinipolo,
    userAnswers,
    pointsEarned,
    error,
    refetch,
  };
};
