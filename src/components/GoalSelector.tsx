import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { colors } from '../styles/globalStyles';
import SegmentedButtonGroup from './SegmentedButtonGroup';

interface GoalSelectorProps {
  team: 'home' | 'away';
  teamName: string;
  selectedGoals: string;
  onGoalChange: (team: 'home' | 'away', goals: string) => void;
  disabled?: boolean;
}

const GoalSelector: React.FC<GoalSelectorProps> = ({
  team,
  teamName,
  selectedGoals,
  onGoalChange,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const handleValueChange = (value: string) => {
    onGoalChange(team, value);
  };

  const goalOptions = Array.from({ length: 31 }, (_, i) => ({
    value: i.toString(),
    label: i.toString(),
    disabled,
    style: selectedGoals === i.toString() ? styles.selectedButton : undefined,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {teamName} {t('goals') || 'Goals'}
      </Text>
      <SegmentedButtonGroup
        value={selectedGoals}
        onValueChange={handleValueChange}
        buttons={goalOptions.slice(0, 10)}
        density="small"
        whiteBackground={false}
      />
      {parseInt(selectedGoals) > 9 && (
        <View style={styles.additionalButtons}>
          <SegmentedButtonGroup
            value={selectedGoals}
            onValueChange={handleValueChange}
            buttons={goalOptions.slice(10, 20)}
            density="small"
            whiteBackground={false}
          />
        </View>
      )}
      {parseInt(selectedGoals) > 19 && (
        <View style={styles.additionalButtons}>
          <SegmentedButtonGroup
            value={selectedGoals}
            onValueChange={handleValueChange}
            buttons={goalOptions.slice(20, 31)}
            density="small"
            whiteBackground={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  selectedButton: {
    backgroundColor: colors.primary + '20',
  },
  additionalButtons: {
    marginTop: 8,
  },
});

export default GoalSelector;
