import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton, Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import MatchWinnerButtons from './MatchWinnerButtons';
import GoalSelector from './GoalSelector';
import GoalsInputs from './GoalsInputs';
import { colors } from '../styles/globalStyles';
import type { AnswerType, Match } from '../hooks/answers';

interface MatchRowProps {
  match: Match;
  matchIndex: number;
  answer: AnswerType;
  onWinnerChange: (matchIndex: number, winner: string) => void;
  onGame15GoalChange: (team: 'home' | 'away', goals: string) => void;
  onCancelMatch?: (matchIndex: number) => void;
  disabled?: boolean;
  isMissing?: boolean;
  showCancelButton?: boolean;
  isCorrectionMode?: boolean;
  onGoalsChange?: (
    matchIndex: number,
    teamType: 'home' | 'away' | 'regularHome' | 'regularAway',
    value: string
  ) => void;
}

const MatchRow: React.FC<MatchRowProps> = ({
  match,
  matchIndex,
  answer,
  onWinnerChange,
  onGame15GoalChange,
  onCancelMatch,
  disabled = false,
  isMissing = false,
  showCancelButton = true,
  isCorrectionMode = false,
  onGoalsChange,
}) => {
  const { t } = useTranslation();
  const isGame15 = matchIndex === 14;
  const isCancelled = answer.cancelled || false;

  return (
    <Card
      style={[
        styles.card,
        isMissing && !isCancelled && styles.missingCard,
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
          </View>
          {showCancelButton && onCancelMatch && (
            <IconButton
              icon={isCancelled ? 'restore' : 'cancel'}
              size={20}
              iconColor={isCancelled ? colors.success : colors.textSecondary}
              onPress={() => onCancelMatch(matchIndex)}
              disabled={disabled}
            />
          )}
        </View>

        {/* Team Names */}
        <View style={styles.teamsContainer}>
          <Text style={styles.teamText}>{match.homeTeam}</Text>
          <Text style={styles.vsText}> vs </Text>
          <Text style={styles.teamText}>{match.awayTeam}</Text>
        </View>

        {/* Winner Selection */}
        {!isCancelled && (
          <View style={styles.answersContainer}>
            <MatchWinnerButtons
              match={match}
              matchIndex={matchIndex}
              selectedWinner={answer.chosenWinner}
              onWinnerChange={onWinnerChange}
              disabled={disabled}
            />

            {/* Goal Selection for Match 15 (answer mode) */}
            {isGame15 && answer.chosenWinner && !isCorrectionMode && (
              <View style={styles.goalSelectors}>
                <GoalSelector
                  team="home"
                  teamName={match.homeTeam}
                  selectedGoals={answer.goalsHomeTeam}
                  onGoalChange={onGame15GoalChange}
                  disabled={disabled}
                />
                <GoalSelector
                  team="away"
                  teamName={match.awayTeam}
                  selectedGoals={answer.goalsAwayTeam}
                  onGoalChange={onGame15GoalChange}
                  disabled={disabled}
                />
              </View>
            )}

            {/* Goals Inputs for correction mode */}
            {isCorrectionMode && onGoalsChange && answer.chosenWinner && (
              <GoalsInputs
                matchIndex={matchIndex}
                chosenWinner={answer.chosenWinner}
                goalsHomeTeam={answer.goalsHomeTeam}
                goalsAwayTeam={answer.goalsAwayTeam}
                regularGoalsHomeTeam={(answer as any).regularGoalsHomeTeam ?? ''}
                regularGoalsAwayTeam={(answer as any).regularGoalsAwayTeam ?? ''}
                homeTeam={match.homeTeam}
                awayTeam={match.awayTeam}
                onGoalsChange={onGoalsChange}
                disabled={disabled}
              />
            )}
          </View>
        )}

        {/* Missing Answer Warning */}
        {isMissing && !isCancelled && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              {isGame15
                ? t('pleaseSelectWinnerAndGoals') || 'Please select winner and goals'
                : t('pleaseSelectWinner') || 'Please select a winner'}
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
  missingCard: {
    borderWidth: 2,
    borderColor: colors.error,
    backgroundColor: colors.error + '10',
  },
  cancelledCard: {
    opacity: 0.6,
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
  },
  cancelledChipText: {
    fontSize: 12,
    color: colors.textSecondary,
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
  answersContainer: {
    marginTop: 8,
  },
  goalSelectors: {
    marginTop: 16,
    gap: 12,
  },
  warningContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: colors.error + '15',
    borderRadius: 8,
  },
  warningText: {
    fontSize: 12,
    color: colors.error,
    textAlign: 'center',
  },
});

export default MatchRow;
