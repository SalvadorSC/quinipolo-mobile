import { useCallback } from 'react';
import { AnswerType } from './types';

interface UseAnswerHandlersResult {
  handleWinnerChange: (matchIndex: number, winner: string) => void;
  handleGame15GoalChange: (team: 'home' | 'away', goals: string) => void;
  handleCancelMatch: (matchIndex: number) => void;
}

export const useAnswerHandlers = (
  answers: AnswerType[],
  setAnswers: React.Dispatch<React.SetStateAction<AnswerType[]>>,
  setMissingAnswerIndices: React.Dispatch<React.SetStateAction<number[]>>
): UseAnswerHandlersResult => {
  const handleWinnerChange = useCallback(
    (matchIndex: number, winner: string) => {
      setAnswers((prevAnswers) => {
        const updatedData = [...prevAnswers];
        updatedData[matchIndex] = {
          ...updatedData[matchIndex],
          matchNumber: matchIndex + 1,
          chosenWinner: winner,
        };
        return updatedData;
      });

      // Remove from missing indices
      if (matchIndex !== 14) {
        setMissingAnswerIndices((prev) => prev.filter((i) => i !== matchIndex));
      } else {
        const match15 = answers[14];
        const bothGoalsSelected = !!(match15?.goalsHomeTeam && match15?.goalsAwayTeam);
        if (bothGoalsSelected) {
          setMissingAnswerIndices((prev) => prev.filter((i) => i !== 14));
        }
      }
    },
    [answers, setAnswers, setMissingAnswerIndices]
  );

  const handleGame15GoalChange = useCallback(
    (team: 'home' | 'away', goals: string) => {
      setAnswers((prevAnswers) => {
        const updatedData = [...prevAnswers];
        if (team === 'home') {
          updatedData[14] = {
            ...updatedData[14],
            matchNumber: 15,
            goalsHomeTeam: goals,
          };
        } else {
          updatedData[14] = {
            ...updatedData[14],
            matchNumber: 15,
            goalsAwayTeam: goals,
          };
        }

        // Only clear the missing mark for match 15 when BOTH goals are set
        const bothGoalsSelected = !!(
          updatedData[14].goalsHomeTeam && updatedData[14].goalsAwayTeam
        );
        if (bothGoalsSelected) {
          setMissingAnswerIndices((prev) => prev.filter((i) => i !== 14));
        }

        return updatedData;
      });
    },
    [setAnswers, setMissingAnswerIndices]
  );

  const handleCancelMatch = useCallback(
    (matchIndex: number) => {
      setAnswers((prevAnswers) => {
        const updatedData = [...prevAnswers];
        const currentAnswer = updatedData[matchIndex];

        if (currentAnswer.cancelled) {
          // Uncancel: restore the match
          updatedData[matchIndex] = {
            ...currentAnswer,
            cancelled: false,
          };
        } else {
          // Cancel: mark as cancelled and clear answers
          updatedData[matchIndex] = {
            ...currentAnswer,
            cancelled: true,
            chosenWinner: '',
            goalsHomeTeam: '',
            goalsAwayTeam: '',
          };
        }

        // Remove from missing indices when cancelled
        if (updatedData[matchIndex].cancelled) {
          setMissingAnswerIndices((prev) => prev.filter((i) => i !== matchIndex));
        }

        return updatedData;
      });
    },
    [setAnswers, setMissingAnswerIndices]
  );

  return {
    handleWinnerChange,
    handleGame15GoalChange,
    handleCancelMatch,
  };
};
