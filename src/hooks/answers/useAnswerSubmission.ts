import { useState, useCallback } from 'react';
import apiClient from '../../services/api';
import { AnswerType, QuinipoloData, AnswerResponse } from './types';
import { findMissingAnswers, prepareAnswersForSubmission } from './constants';

interface UseAnswerSubmissionOptions {
  answers: AnswerType[];
  quinipolo: QuinipoloData | null;
  username: string;
  setMissingAnswerIndices: React.Dispatch<React.SetStateAction<number[]>>;
  setHasAttemptedSubmit: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UseAnswerSubmissionResult {
  submitAnswers: () => Promise<AnswerResponse | null>;
  loading: boolean;
  error: string | null;
}

export const useAnswerSubmission = ({
  answers,
  quinipolo,
  username,
  setMissingAnswerIndices,
  setHasAttemptedSubmit,
}: UseAnswerSubmissionOptions): UseAnswerSubmissionResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAnswers = useCallback(async (): Promise<AnswerResponse | null> => {
    if (!quinipolo) {
      setError('No quinipolo data available');
      return null;
    }

    // Validate answers
    const missing = findMissingAnswers(answers);

    if (missing.length > 0) {
      setHasAttemptedSubmit(true);
      setMissingAnswerIndices(missing);
      const matchNumbers = missing.map((i) => i + 1).join(', ');
      setError(`Missing answers for matches: ${matchNumbers}`);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        username,
        quinipoloId: quinipolo.id,
        answers: prepareAnswersForSubmission(answers),
      };

      const response = await apiClient.post<AnswerResponse>(
        '/api/quinipolos/quinipolo/answers',
        payload
      );

      return response.data;
    } catch (err: any) {
      console.error('Error submitting answers:', err);
      const errorMessage =
        err?.response?.data?.message || err?.response?.data || 'Failed to submit answers';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [answers, quinipolo, username, setMissingAnswerIndices, setHasAttemptedSubmit]);

  return {
    submitAnswers,
    loading,
    error,
  };
};
