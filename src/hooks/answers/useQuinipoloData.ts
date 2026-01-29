import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../services/api';
import { QuinipoloData, AnswerType } from './types';
import { createInitialAnswers } from './constants';

interface UseQuinipoloDataOptions {
  quinipoloId: string | null;
  autoFetch?: boolean;
}

interface UseQuinipoloDataResult {
  loading: boolean;
  quinipolo: QuinipoloData | null;
  answers: AnswerType[];
  setAnswers: React.Dispatch<React.SetStateAction<AnswerType[]>>;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useQuinipoloData = ({
  quinipoloId,
  autoFetch = true,
}: UseQuinipoloDataOptions): UseQuinipoloDataResult => {
  const [loading, setLoading] = useState(false);
  const [quinipolo, setQuinipolo] = useState<QuinipoloData | null>(null);
  const [answers, setAnswers] = useState<AnswerType[]>(createInitialAnswers());
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!quinipoloId) {
      setError('No quinipolo ID provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/api/quinipolos/quinipolo/${quinipoloId}`);
      const data = response.data;

      setQuinipolo(data);

      // Initialize empty answers
      setAnswers(createInitialAnswers());
    } catch (err: any) {
      console.error('Error fetching quinipolo data:', err);
      setError(err?.response?.data?.message || 'Failed to fetch quinipolo data');
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
    answers,
    setAnswers,
    error,
    refetch,
  };
};
