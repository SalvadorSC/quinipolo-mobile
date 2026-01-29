import { useEffect } from 'react';
import { AnswerType, QuinipoloData } from './types';
import { findMissingAnswers } from './constants';

export const useAnswerValidation = (
  answers: AnswerType[],
  quinipolo: QuinipoloData | null,
  hasAttemptedSubmit: boolean,
  setMissingAnswerIndices: React.Dispatch<React.SetStateAction<number[]>>
) => {
  useEffect(() => {
    if (!hasAttemptedSubmit) return;
    if (!quinipolo?.quinipolo?.length) return;

    const missing = findMissingAnswers(answers);
    setMissingAnswerIndices(missing);
  }, [answers, quinipolo, hasAttemptedSubmit, setMissingAnswerIndices]);
};
