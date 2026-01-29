import { AnswerType } from './types';

export const createInitialAnswers = (): AnswerType[] => [
  ...Array(14)
    .fill(null)
    .map((_, index) => ({
      matchNumber: index + 1,
      chosenWinner: '',
      isGame15: false,
      goalsHomeTeam: '',
      goalsAwayTeam: '',
    })),
  {
    matchNumber: 15,
    chosenWinner: '',
    isGame15: true,
    goalsHomeTeam: '',
    goalsAwayTeam: '',
  },
];

export const findMissingAnswers = (answers: AnswerType[]): number[] => {
  const missing: number[] = [];
  answers.forEach((ans, idx) => {
    // Skip validation for cancelled matches
    if (ans.cancelled) {
      return;
    }
    if (idx === 14) {
      const isWinnerMissing = !ans.chosenWinner;
      const areGoalsMissing = !(ans.goalsHomeTeam && ans.goalsAwayTeam);
      if (isWinnerMissing || (!isWinnerMissing && areGoalsMissing)) {
        missing.push(idx);
      }
    } else {
      if (!ans.chosenWinner) {
        missing.push(idx);
      }
    }
  });
  return missing;
};

export const prepareAnswersForSubmission = (answers: AnswerType[]): AnswerType[] => {
  return answers.map((answer) => ({
    matchNumber: answer.matchNumber,
    chosenWinner: answer.chosenWinner,
    isGame15: answer.isGame15,
    goalsHomeTeam: answer.goalsHomeTeam,
    goalsAwayTeam: answer.goalsAwayTeam,
    cancelled: answer.cancelled || false,
  }));
};
