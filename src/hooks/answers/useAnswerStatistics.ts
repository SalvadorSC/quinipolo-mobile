import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../services/api';
import { AnswerStatistics } from './types';

export const useAnswerStatistics = (
  quinipoloId: string | null,
  endDate: string | undefined,
  enabled: boolean
) => {
  const [statistics, setStatistics] = useState<AnswerStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!quinipoloId || !endDate || !enabled) return;
    const deadlinePassed = new Date(endDate) < new Date();
    if (!deadlinePassed) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/api/answer-statistics/quinipolo/${quinipoloId}`);
      setStatistics(response.data?.statistics ?? null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  }, [quinipoloId, endDate, enabled]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { statistics, loading, error };
};
