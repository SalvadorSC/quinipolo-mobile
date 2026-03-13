import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Modal as RNModal,
  TouchableOpacity,
} from 'react-native';
import { Text, Button, Divider } from 'react-native-paper';
import { colors } from '../styles/globalStyles';
import type { Match, AnswerType } from '../hooks/answers';

type GoalRange = '-' | '11/12' | '+';

interface MatchSlotState {
  homeScore: string;
  awayScore: string;
  outcome: 'home' | 'empat' | 'away' | '';
  cancelled: boolean;
}

interface AutoFillModalProps {
  visible: boolean;
  matches: Match[];
  onApply: (answers: Partial<AnswerType>[]) => void;
  onClose: () => void;
}

function scoreToGoalRange(score: string): GoalRange {
  const n = parseInt(score, 10);
  if (isNaN(n)) return '-';
  if (n < 11) return '-';
  if (n <= 12) return '11/12';
  return '+';
}

const OUTCOME_BUTTONS: { value: 'home' | 'empat' | 'away'; label: string }[] =
  [
    { value: 'home', label: 'Home' },
    { value: 'empat', label: 'Tie' },
    { value: 'away', label: 'Away' },
  ];

export default function AutoFillModal({
  visible,
  matches,
  onApply,
  onClose,
}: AutoFillModalProps) {
  const [slots, setSlots] = useState<MatchSlotState[]>(() =>
    (matches || []).map(() => ({
      homeScore: '',
      awayScore: '',
      outcome: '',
      cancelled: false,
    }))
  );

  React.useEffect(() => {
    if (visible) {
      setSlots(
        (matches || []).map(() => ({
          homeScore: '',
          awayScore: '',
          outcome: '',
          cancelled: false,
        }))
      );
    }
  }, [visible, matches]);

  const updateSlot = (
    index: number,
    field: keyof MatchSlotState,
    value: string | boolean
  ) => {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value } as MatchSlotState;
      return next;
    });
  };

  const handleApply = () => {
    const answers: Partial<AnswerType>[] = slots.map((slot, index) => {
      const isGame15 = index === 14;
      const chosenWinner = slot.cancelled ? '' : slot.outcome;

      if (isGame15) {
        return {
          matchNumber: index + 1,
          chosenWinner: chosenWinner || '',
          isGame15: true,
          goalsHomeTeam: scoreToGoalRange(slot.homeScore),
          goalsAwayTeam: scoreToGoalRange(slot.awayScore),
          cancelled: slot.cancelled,
        };
      }

      return {
        matchNumber: index + 1,
        chosenWinner: chosenWinner || '',
        isGame15: false,
        goalsHomeTeam: slot.homeScore,
        goalsAwayTeam: slot.awayScore,
        cancelled: slot.cancelled,
      };
    });

    onApply(answers);
  };

  return (
    <RNModal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Auto-fill Match Results</Text>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator>
            {(matches || []).map((match, index) => {
              const slot = slots[index] || {
                homeScore: '',
                awayScore: '',
                outcome: '',
                cancelled: false,
              };
              const isGame15 = index === 14;

              return (
                <View key={index} style={styles.matchSlot}>
                  <View style={styles.matchHeader}>
                    <Text style={styles.matchNumber}>
                      Match {index + 1}
                      {isGame15 ? ' (score → range)' : ''}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.cancelledToggle,
                        slot.cancelled && styles.cancelledToggleActive,
                      ]}
                      onPress={() =>
                        updateSlot(index, 'cancelled', !slot.cancelled)
                      }
                      accessibilityRole="checkbox"
                      accessibilityLabel={`Mark match ${index + 1} as cancelled`}
                    >
                      <Text
                        style={[
                          styles.cancelledToggleText,
                          slot.cancelled && styles.cancelledToggleTextActive,
                        ]}
                      >
                        Cancelled
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.teamsText}>
                    {match.homeTeam} vs {match.awayTeam}
                  </Text>

                  {!slot.cancelled && (
                    <>
                      <View style={styles.scoreRow}>
                        <TextInput
                          style={styles.scoreInput}
                          value={slot.homeScore}
                          onChangeText={(val) =>
                            updateSlot(index, 'homeScore', val)
                          }
                          keyboardType="numeric"
                          maxLength={2}
                          placeholder="0"
                          placeholderTextColor={colors.textSecondary}
                          accessibilityLabel={`Home score match ${index + 1}`}
                        />
                        <Text style={styles.scoreDash}>-</Text>
                        <TextInput
                          style={styles.scoreInput}
                          value={slot.awayScore}
                          onChangeText={(val) =>
                            updateSlot(index, 'awayScore', val)
                          }
                          keyboardType="numeric"
                          maxLength={2}
                          placeholder="0"
                          placeholderTextColor={colors.textSecondary}
                          accessibilityLabel={`Away score match ${index + 1}`}
                        />
                      </View>

                      <View style={styles.outcomeRow}>
                        {OUTCOME_BUTTONS.map((btn) => (
                          <TouchableOpacity
                            key={btn.value}
                            style={[
                              styles.outcomeButton,
                              slot.outcome === btn.value &&
                                styles.outcomeButtonActive,
                            ]}
                            onPress={() =>
                              updateSlot(index, 'outcome', btn.value)
                            }
                            accessibilityRole="radio"
                            accessibilityLabel={`Outcome ${btn.label}`}
                          >
                            <Text
                              style={[
                                styles.outcomeButtonText,
                                slot.outcome === btn.value &&
                                  styles.outcomeButtonTextActive,
                              ]}
                            >
                              {btn.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </>
                  )}

                  <Divider style={styles.divider} />
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <Button
              mode="outlined"
              onPress={onClose}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleApply}
              style={styles.applyButton}
            >
              Apply
            </Button>
          </View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  matchSlot: {
    paddingVertical: 12,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  matchNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  teamsText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  scoreInput: {
    width: 44,
    height: 36,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  scoreDash: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  outcomeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  outcomeButton: {
    flex: 1,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  outcomeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  outcomeButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  outcomeButtonTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  cancelledToggle: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
  },
  cancelledToggleActive: {
    borderColor: colors.error,
    backgroundColor: colors.error + '15',
  },
  cancelledToggleText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  cancelledToggleTextActive: {
    color: colors.error,
    fontWeight: '600',
  },
  divider: {
    marginTop: 8,
    backgroundColor: colors.border,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  applyButton: {
    flex: 1,
  },
});
