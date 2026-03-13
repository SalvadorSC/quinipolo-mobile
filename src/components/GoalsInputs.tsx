import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/globalStyles';

interface GoalsInputsProps {
  matchIndex: number;
  chosenWinner: string;
  goalsHomeTeam: string;
  goalsAwayTeam: string;
  regularGoalsHomeTeam?: string;
  regularGoalsAwayTeam?: string;
  homeTeam: string;
  awayTeam: string;
  onGoalsChange: (
    matchIndex: number,
    teamType: 'home' | 'away' | 'regularHome' | 'regularAway',
    value: string
  ) => void;
  disabled?: boolean;
}

function GoalRow({
  label,
  homeValue,
  awayValue,
  onHomeChange,
  onAwayChange,
  disabled,
}: {
  label: string;
  homeValue: string;
  awayValue: string;
  onHomeChange: (val: string) => void;
  onAwayChange: (val: string) => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.rowContainer}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.inputsRow}>
        <TextInput
          style={[styles.goalInput, disabled && styles.goalInputDisabled]}
          value={homeValue}
          onChangeText={onHomeChange}
          keyboardType="numeric"
          maxLength={2}
          editable={!disabled}
          placeholder="0"
          placeholderTextColor={colors.textSecondary}
          accessibilityLabel={`${label} home goals`}
        />
        <Text style={styles.dash}>-</Text>
        <TextInput
          style={[styles.goalInput, disabled && styles.goalInputDisabled]}
          value={awayValue}
          onChangeText={onAwayChange}
          keyboardType="numeric"
          maxLength={2}
          editable={!disabled}
          placeholder="0"
          placeholderTextColor={colors.textSecondary}
          accessibilityLabel={`${label} away goals`}
        />
      </View>
    </View>
  );
}

function getGoalsError(
  chosenWinner: string,
  homeGoals: string,
  awayGoals: string
): string | null {
  const home = parseInt(homeGoals, 10);
  const away = parseInt(awayGoals, 10);

  if (isNaN(home) || isNaN(away)) return null;

  if (chosenWinner === 'home' && home < away) {
    return 'Home team won but home goals are less than away goals';
  }
  if (chosenWinner === 'away' && home > away) {
    return 'Away team won but away goals are less than home goals';
  }
  return null;
}

export default function GoalsInputs({
  matchIndex,
  chosenWinner,
  goalsHomeTeam,
  goalsAwayTeam,
  regularGoalsHomeTeam = '',
  regularGoalsAwayTeam = '',
  homeTeam,
  awayTeam,
  onGoalsChange,
  disabled = false,
}: GoalsInputsProps) {
  const isTie = chosenWinner === 'empat';

  const penaltiesError = isTie
    ? getGoalsError('empat', goalsHomeTeam, goalsAwayTeam)
    : getGoalsError(chosenWinner, goalsHomeTeam, goalsAwayTeam);

  return (
    <View style={styles.container}>
      <View style={styles.teamsHeader}>
        <Text style={styles.teamLabel} numberOfLines={1}>
          {homeTeam}
        </Text>
        <Text style={styles.teamLabelSpacer} />
        <Text style={styles.teamLabel} numberOfLines={1}>
          {awayTeam}
        </Text>
      </View>

      {isTie ? (
        <>
          <GoalRow
            label="Regular time"
            homeValue={regularGoalsHomeTeam}
            awayValue={regularGoalsAwayTeam}
            onHomeChange={(val) =>
              onGoalsChange(matchIndex, 'regularHome', val)
            }
            onAwayChange={(val) =>
              onGoalsChange(matchIndex, 'regularAway', val)
            }
            disabled={disabled}
          />
          <GoalRow
            label="After penalties"
            homeValue={goalsHomeTeam}
            awayValue={goalsAwayTeam}
            onHomeChange={(val) => onGoalsChange(matchIndex, 'home', val)}
            onAwayChange={(val) => onGoalsChange(matchIndex, 'away', val)}
            disabled={disabled}
          />
        </>
      ) : (
        <GoalRow
          label="Goals"
          homeValue={goalsHomeTeam}
          awayValue={goalsAwayTeam}
          onHomeChange={(val) => onGoalsChange(matchIndex, 'home', val)}
          onAwayChange={(val) => onGoalsChange(matchIndex, 'away', val)}
          disabled={disabled}
        />
      )}

      {penaltiesError && (
        <Text style={styles.errorText}>{penaltiesError}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    padding: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
  },
  teamsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  teamLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  teamLabelSpacer: {
    width: 24,
  },
  rowContainer: {
    marginVertical: 4,
  },
  rowLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  inputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  goalInput: {
    width: 48,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  goalInputDisabled: {
    backgroundColor: colors.background,
    color: colors.textSecondary,
  },
  dash: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 11,
    color: colors.error,
    textAlign: 'center',
    marginTop: 4,
  },
});
