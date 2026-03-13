import { useState, useCallback } from 'react';
import apiClient from '../../services/api';
import { AnswerType, QuinipoloData, AnswerResponse } from './types';
import { findMissingAnswers, prepareAnswersForSubmission } from './constants';

export interface CorrectionResult {
  averagePointsThisQuinipolo?: number;
  mostFailed?: string;
}

interface UseAnswerSubmissionOptions {
  answers: AnswerType[];
  quinipolo: QuinipoloData | null;
  username: string;
  setMissingAnswerIndices: React.Dispatch<React.SetStateAction<number[]>>;
  setHasAttemptedSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  mode?: 'answer' | 'correct' | 'editCorrection';
  quinipoloId?: string;
}

interface UseAnswerSubmissionResult {
  submitAnswers: () => Promise<AnswerResponse | null>;
  loading: boolean;
  error: string | null;
  correctionResult: CorrectionResult | null;
}

export const useAnswerSubmission = ({
  answers,
  quinipolo,
  username,
  setMissingAnswerIndices,
  setHasAttemptedSubmit,
  mode = 'answer',
  quinipoloId,
}: UseAnswerSubmissionOptions): UseAnswerSubmissionResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [correctionResult, setCorrectionResult] =
    useState<CorrectionResult | null>(null);

  const submitAnswers = useCallback(async (): Promise<AnswerResponse | null> => {
    if (!quinipolo) {
      setError('No quinipolo data available');
      return null;
    }

    const isCorrectionMode = mode === 'correct' || mode === 'editCorrection';

    if (!isCorrectionMode) {
      // Standard answer mode: validate all answers
      const missing = findMissingAnswers(answers);
      if (missing.length > 0) {
        setHasAttemptedSubmit(true);
        setMissingAnswerIndices(missing);
        const matchNumbers = missing.map((i) => i + 1).join(', ');
        setError(`Missing answers for matches: ${matchNumbers}`);
        return null;
      }
    }

    setLoading(true);
    setError(null);

    try {
      if (isCorrectionMode) {
        const resolvedId = quinipoloId || quinipolo.id;
        const payload = {
          corrections: answers,
          username,
        };

        const response = await apiClient.post(
          `/api/quinipolos/quinipolo/${resolvedId}/submit-correction`,
          payload
        );

        const data = response.data;
        setCorrectionResult({
          averagePointsThisQuinipolo: data?.averagePointsThisQuinipolo,
          mostFailed: data?.mostFailed,
        });

        return data as AnswerResponse;
      } else {
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
      }
    } catch (err: any) {
      console.error('Error submitting answers:', err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data ||
        'Failed to submit answers';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [
    answers,
    quinipolo,
    username,
    setMissingAnswerIndices,
    setHasAttemptedSubmit,
    mode,
    quinipoloId,
  ]);

  return {
    submitAnswers,
    loading,
    error,
    correctionResult,
  };
};
