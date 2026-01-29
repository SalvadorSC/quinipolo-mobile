import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { colors } from '../styles/globalStyles';
import type { AnswerType, Match } from '../hooks/answers';

interface ViewMatchRowProps {
  match: Match;
  matchIndex: number;
  userAnswer?: AnswerType;
  correctAnswer?: AnswerType;
}

const ViewMatchRow: React.FC<ViewMatchRowProps> = ({
  match,
  matchIndex,
  userAnswer,
  correctAnswer,
}) => {
  const { t } = useTranslation();
  const isGame15 = matchIndex === 14;
  const isCancelled = correctAnswer?.cancelled || false;
  const hasUserAnswer = userAnswer !== undefined;

  // Determine if the answer was correct (only if user has answered)
  const isWinnerCorrect = !hasUserAnswer || !correctAnswer || isCancelled ||
    userAnswer.chosenWinner === correctAnswer.chosenWinner;

  const isGoalsCorrect = !hasUserAnswer || !isGame15 || !correctAnswer || isCancelled ||
    (userAnswer.goalsHomeTeam === correctAnswer.goalsHomeTeam &&
     userAnswer.goalsAwayTeam === correctAnswer.goalsAwayTeam);

  const isFullyCorrect = isWinnerCorrect && isGoalsCorrect;

  const getAnswerText = (answer: AnswerType) => {
    if (answer.chosenWinner === 'empat') {
      return t('tie') || 'Tie';
    }
    return answer.chosenWinner;
  };

  const getGoalText = (goals: string) => {
    if (goals === '-') return '0-10';
    if (goals === '11/12') return '11/12';
    if (goals === '+') return '13+';
    return goals;
  };

  return (
    <Card
      style={[
        styles.card,
        hasUserAnswer && correctAnswer && (isFullyCorrect ? styles.correctCard : styles.incorrectCard),
        isCancelled && styles.cancelledCard,
      ]}
    >
      <Card.Content>
        {/* Match Header */}
        <View style={styles.header}>
          <View style={styles.matchInfo}>
            <Text style={styles.matchNumber}>
              {t('match') || 'Match'} {matchIndex + 1}
            </Text>
            {isCancelled && (
              <Chip
                mode="flat"
                style={styles.cancelledChip}
                textStyle={styles.cancelledChipText}
              >
                {t('cancelled') || 'Cancelled'}
              </Chip>
            )}
            {hasUserAnswer && correctAnswer && !isCancelled && (
              <IconButton
                icon={isFullyCorrect ? 'check-circle' : 'close-circle'}
                size={20}
                iconColor={isFullyCorrect ? colors.success : colors.error}
                style={styles.correctnessIcon}
              />
            )}
          </View>
        </View>

        {/* Team Names */}
        <View style={styles.teamsContainer}>
          <Text style={styles.teamText}>{match.homeTeam}</Text>
          <Text style={styles.vsText}> vs </Text>
          <Text style={styles.teamText}>{match.awayTeam}</Text>
        </View>

        {/* Winner Selection Display */}
        {!isCancelled && (
          <View style={styles.winnerSection}>
            <View style={styles.buttonGroup}>
              {/* Home Team Button */}
              <View
                style={[
                  styles.optionButton,
                  styles.leftButton,
                  // User selected this
                  hasUserAnswer && userAnswer.chosenWinner === match.homeTeam && !correctAnswer && styles.userSelected,
                  // This is correct (show green for both answered correctly and not answered)
                  correctAnswer && correctAnswer.chosenWinner === match.homeTeam && styles.correctAnswer,
                  // User selected this but it's wrong
                  hasUserAnswer && correctAnswer &&
                    userAnswer.chosenWinner === match.homeTeam &&
                    correctAnswer.chosenWinner !== match.homeTeam &&
                    styles.incorrectAnswer,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    // User selected - show in primary if not corrected
                    hasUserAnswer && userAnswer.chosenWinner === match.homeTeam && !correctAnswer && styles.userSelectedText,
                    // Correct answer - show in green (whether user answered or not)
                    correctAnswer && correctAnswer.chosenWinner === match.homeTeam && styles.correctAnswerText,
                    // User wrong - show in red
                    hasUserAnswer && correctAnswer &&
                      userAnswer.chosenWinner === match.homeTeam &&
                      correctAnswer.chosenWinner !== match.homeTeam &&
                      styles.incorrectAnswerText,
                  ]}
                  numberOfLines={1}
                >
                  {match.homeTeam}
                </Text>
              </View>

              {/* Tie Button */}
              <View
                style={[
                  styles.optionButton,
                  styles.middleButton,
                  // User selected this
                  hasUserAnswer && userAnswer.chosenWinner === 'empat' && !correctAnswer && styles.userSelected,
                  // This is correct
                  correctAnswer && correctAnswer.chosenWinner === 'empat' && styles.correctAnswer,
                  // User selected this but it's wrong
                  hasUserAnswer && correctAnswer &&
                    userAnswer.chosenWinner === 'empat' &&
                    correctAnswer.chosenWinner !== 'empat' &&
                    styles.incorrectAnswer,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    hasUserAnswer && userAnswer.chosenWinner === 'empat' && !correctAnswer && styles.userSelectedText,
                    correctAnswer && correctAnswer.chosenWinner === 'empat' && styles.correctAnswerText,
                    hasUserAnswer && correctAnswer &&
                      userAnswer.chosenWinner === 'empat' &&
                      correctAnswer.chosenWinner !== 'empat' &&
                      styles.incorrectAnswerText,
                  ]}
                >
                  {t('tie') || 'Tie'}
                </Text>
              </View>

              {/* Away Team Button */}
              <View
                style={[
                  styles.optionButton,
                  styles.rightButton,
                  // User selected this
                  hasUserAnswer && userAnswer.chosenWinner === match.awayTeam && !correctAnswer && styles.userSelected,
                  // This is correct
                  correctAnswer && correctAnswer.chosenWinner === match.awayTeam && styles.correctAnswer,
                  // User selected this but it's wrong
                  hasUserAnswer && correctAnswer &&
                    userAnswer.chosenWinner === match.awayTeam &&
                    correctAnswer.chosenWinner !== match.awayTeam &&
                    styles.incorrectAnswer,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    hasUserAnswer && userAnswer.chosenWinner === match.awayTeam && !correctAnswer && styles.userSelectedText,
                    correctAnswer && correctAnswer.chosenWinner === match.awayTeam && styles.correctAnswerText,
                    hasUserAnswer && correctAnswer &&
                      userAnswer.chosenWinner === match.awayTeam &&
                      correctAnswer.chosenWinner !== match.awayTeam &&
                      styles.incorrectAnswerText,
                  ]}
                  numberOfLines={1}
                >
                  {match.awayTeam}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Goal Selection for Match 15 */}
        {isGame15 && !isCancelled && (hasUserAnswer || correctAnswer) && (
          <View style={styles.goalsSection}>
            <View style={styles.goalRow}>
              <Text style={styles.goalTeamLabel}>{match.homeTeam}:</Text>
              <View style={styles.goalButtonGroup}>
                {['-', '11/12', '+'].map((option) => (
                  <View
                    key={`home-${option}`}
                    style={[
                      styles.goalButton,
                      option === '-' && styles.leftButton,
                      option === '+' && styles.rightButton,
                      hasUserAnswer && userAnswer.goalsHomeTeam === option && !correctAnswer && styles.userSelected,
                      correctAnswer && correctAnswer.goalsHomeTeam === option && styles.correctAnswer,
                      hasUserAnswer && correctAnswer &&
                        userAnswer.goalsHomeTeam === option &&
                        correctAnswer.goalsHomeTeam !== option &&
                        styles.incorrectAnswer,
                    ]}
                  >
                    <Text
                      style={[
                        styles.goalOptionText,
                        hasUserAnswer && userAnswer.goalsHomeTeam === option && !correctAnswer && styles.userSelectedText,
                        correctAnswer && correctAnswer.goalsHomeTeam === option && styles.correctAnswerText,
                        hasUserAnswer && correctAnswer &&
                          userAnswer.goalsHomeTeam === option &&
                          correctAnswer.goalsHomeTeam !== option &&
                          styles.incorrectAnswerText,
                      ]}
                    >
                      {getGoalText(option)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.goalRow}>
              <Text style={styles.goalTeamLabel}>{match.awayTeam}:</Text>
              <View style={styles.goalButtonGroup}>
                {['-', '11/12', '+'].map((option) => (
                  <View
                    key={`away-${option}`}
                    style={[
                      styles.goalButton,
                      option === '-' && styles.leftButton,
                      option === '+' && styles.rightButton,
                      hasUserAnswer && userAnswer.goalsAwayTeam === option && !correctAnswer && styles.userSelected,
                      correctAnswer && correctAnswer.goalsAwayTeam === option && styles.correctAnswer,
                      hasUserAnswer && correctAnswer &&
                        userAnswer.goalsAwayTeam === option &&
                        correctAnswer.goalsAwayTeam !== option &&
                        styles.incorrectAnswer,
                    ]}
                  >
                    <Text
                      style={[
                        styles.goalOptionText,
                        hasUserAnswer && userAnswer.goalsAwayTeam === option && !correctAnswer && styles.userSelectedText,
                        correctAnswer && correctAnswer.goalsAwayTeam === option && styles.correctAnswerText,
                        hasUserAnswer && correctAnswer &&
                          userAnswer.goalsAwayTeam === option &&
                          correctAnswer.goalsAwayTeam !== option &&
                          styles.incorrectAnswerText,
                      ]}
                    >
                      {getGoalText(option)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Cancelled Message */}
        {isCancelled && (
          <View style={styles.cancelledMessage}>
            <Text style={styles.cancelledMessageText}>
              {t('matchCancelledEverybodyCorrect') ||
               'This match was cancelled - counted as correct for everyone'}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 4,
    borderRadius: 12,
    elevation: 2,
  },
  correctCard: {
    borderWidth: 2,
    borderColor: colors.success,
    backgroundColor: colors.success + '08',
  },
  incorrectCard: {
    borderWidth: 2,
    borderColor: colors.error,
    backgroundColor: colors.error + '05',
  },
  cancelledCard: {
    backgroundColor: colors.textSecondary + '10',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  matchNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  cancelledChip: {
    backgroundColor: colors.textSecondary + '20',
    height: 24,
  },
  cancelledChipText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  correctnessIcon: {
    margin: 0,
    padding: 0,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  teamText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  vsText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    marginHorizontal: 8,
  },
  winnerSection: {
    marginTop: 16,
    paddingHorizontal: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButton: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  middleButton: {
    // No border radius for middle button
  },
  rightButton: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderRightWidth: 0,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  userSelected: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  userSelectedText: {
    color: colors.primary,
  },
  correctAnswer: {
    backgroundColor: colors.success + '20',
    borderColor: colors.success,
  },
  correctAnswerText: {
    color: colors.success,
  },
  incorrectAnswer: {
    backgroundColor: colors.error + '15',
    borderColor: colors.error,
  },
  incorrectAnswerText: {
    color: colors.error,
  },
  goalsSection: {
    marginTop: 16,
    gap: 12,
    paddingHorizontal: 8,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  goalTeamLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    width: 120,
  },
  goalButtonGroup: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  goalButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  cancelledMessage: {
    marginTop: 8,
    padding: 12,
    backgroundColor: colors.textSecondary + '15',
    borderRadius: 8,
  },
  cancelledMessageText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default ViewMatchRow;
