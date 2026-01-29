import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../styles/globalStyles';
import SegmentedButtonGroup from './SegmentedButtonGroup';

interface MatchWinnerButtonsProps {
  match: {
    homeTeam: string;
    awayTeam: string;
  };
  matchIndex: number;
  selectedWinner: string;
  onWinnerChange: (matchIndex: number, winner: string) => void;
  disabled?: boolean;
}

const MatchWinnerButtons: React.FC<MatchWinnerButtonsProps> = ({
  match,
  matchIndex,
  selectedWinner,
  onWinnerChange,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const handleValueChange = (value: string) => {
    onWinnerChange(matchIndex, value);
  };

  return (
    <View style={styles.container}>
      <SegmentedButtonGroup
        value={selectedWinner}
        onValueChange={handleValueChange}
        buttons={[
          {
            value: match.homeTeam,
            label: '1',
            disabled,
            style:
              selectedWinner === match.homeTeam
                ? styles.selectedButton
                : undefined,
          },
          {
            value: 'empat',
            label: 'X',
            disabled,
            style:
              selectedWinner === 'empat' ? styles.selectedButton : undefined,
          },
          {
            value: match.awayTeam,
            label: '2',
            disabled,
            style:
              selectedWinner === match.awayTeam
                ? styles.selectedButton
                : undefined,
          },
        ]}
        density="small"
        whiteBackground={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  selectedButton: {
    backgroundColor: colors.primary + '20',
  },
});

export default MatchWinnerButtons;
