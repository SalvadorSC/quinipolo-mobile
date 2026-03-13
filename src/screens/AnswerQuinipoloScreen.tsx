import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  Card,
  IconButton,
  ActivityIndicator,
  Button as PaperButton,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Background, MatchRow, ResultsAutoFillModal } from '../components';
import { useUser } from '../context/UserContext';
import type { MatchResult } from '../services/scraperTypes';
import {
  useQuinipoloData,
  useAnswerHandlers,
  useAnswerValidation,
  useAnswerSubmission,
} from '../hooks/answers';
import { globalStyles, colors } from '../styles/globalStyles';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';

type AnswerQuinipoloRouteProp = RouteProp<HomeStackParamList, 'AnswerQuinipolo'>;
type AnswerQuinipoloNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'AnswerQuinipolo'
>;

const AnswerQuinipoloScreen = () => {
  const { t } = useTranslation();
  const route = useRoute<AnswerQuinipoloRouteProp>();
  const navigation = useNavigation<AnswerQuinipoloNavigationProp>();
  const { userData } = useUser();
  const quinipoloId = route.params?.quinipoloId;
  const mode = route.params?.mode ?? 'answer';

  const isCorrectionMode = mode === 'correct' || mode === 'editCorrection';

  const hasScraperAccess = userData.hasScraperAccess === true;
  const [autoFillVisible, setAutoFillVisible] = useState(false);

  const [missingAnswerIndices, setMissingAnswerIndices] = useState<number[]>([]);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState<boolean>(false);

  // Fetch quinipolo data
  const {
    loading: dataLoading,
    quinipolo,
    answers,
    setAnswers,
  } = useQuinipoloData({
    quinipoloId,
    autoFetch: true,
  });

  // Pre-load correct_answers when editing an existing correction
  useEffect(() => {
    if (mode === 'editCorrection' && quinipolo?.correct_answers) {
      setAnswers(quinipolo.correct_answers);
    }
  }, [mode, quinipolo, setAnswers]);

  // Answer handlers
  const { handleWinnerChange, handleGame15GoalChange, handleCancelMatch } =
    useAnswerHandlers(answers, setAnswers, setMissingAnswerIndices);

  // Goals change handler for correction mode
  const handleGoalsChange = useCallback(
    (
      matchIndex: number,
      teamType: 'home' | 'away' | 'regularHome' | 'regularAway',
      value: string
    ) => {
      setAnswers((prev) => {
        const next = [...prev];
        const answer = { ...next[matchIndex] } as any;
        if (teamType === 'home') {
          answer.goalsHomeTeam = value;
        } else if (teamType === 'away') {
          answer.goalsAwayTeam = value;
        } else if (teamType === 'regularHome') {
          answer.regularGoalsHomeTeam = value;
        } else if (teamType === 'regularAway') {
          answer.regularGoalsAwayTeam = value;
        }
        next[matchIndex] = answer;
        return next;
      });
    },
    [setAnswers]
  );

  const handleResultsAutoFill = useCallback(
    (results: MatchResult[]) => {
      setAnswers(prev => {
        const next = [...prev];
        results.forEach(result => {
          const idx = result.matchNumber - 1;
          if (idx < 0 || idx >= 15) return;
          const existing = next[idx];
          if (!existing) return;

          let chosenWinner = '';
          const quinipoloMatch = quinipolo?.quinipolo[idx];
          if (result.outcome === 'Tie' || result.outcome === 'Tie (PEN)') {
            chosenWinner = 'empat';
          } else if (quinipoloMatch) {
            if (result.outcome === quinipoloMatch.homeTeam) chosenWinner = quinipoloMatch.homeTeam;
            else if (result.outcome === quinipoloMatch.awayTeam) chosenWinner = quinipoloMatch.awayTeam;
          }

          if (idx === 14) {
            // Match 15: convert score to goal range
            const isTiePen = result.outcome === 'Tie (PEN)';
            const hasReg = result.homeRegulationScore !== undefined && result.awayRegulationScore !== undefined;
            const rangeHome = isTiePen && hasReg ? result.homeRegulationScore! : result.homeScore;
            const rangeAway = isTiePen && hasReg ? result.awayRegulationScore! : result.awayScore;
            const toRange = (s: number) => s < 11 ? '-' : s <= 12 ? '11/12' : '+';
            next[idx] = { ...existing, chosenWinner, goalsHomeTeam: toRange(rangeHome), goalsAwayTeam: toRange(rangeAway) } as typeof existing;
          } else {
            next[idx] = {
              ...existing,
              chosenWinner,
              goalsHomeTeam: String(result.homeScore),
              goalsAwayTeam: String(result.awayScore),
            } as typeof existing;
          }
        });
        return next;
      });
    },
    [quinipolo, setAnswers]
  );

  // Answer validation (only in answer mode)
  useAnswerValidation(
    answers,
    quinipolo,
    hasAttemptedSubmit,
    setMissingAnswerIndices
  );

  // Answer submission
  const {
    submitAnswers,
    loading: submitLoading,
    error: submitError,
    correctionResult,
  } = useAnswerSubmission({
    answers,
    quinipolo,
    username: userData.username,
    setMissingAnswerIndices,
    setHasAttemptedSubmit,
    mode,
    quinipoloId,
  });

  const loading = dataLoading || submitLoading;

  const handleSubmit = async () => {
    const result = await submitAnswers();

    if (result) {
      if (isCorrectionMode) {
        const correctionParams: { quinipoloId: string; leagueId?: string; averagePoints?: number } = {
          quinipoloId: quinipoloId ?? '',
        };
        if (quinipolo?.league_id) correctionParams.leagueId = quinipolo.league_id;
        if (correctionResult?.averagePointsThisQuinipolo !== undefined) {
          correctionParams.averagePoints = correctionResult.averagePointsThisQuinipolo;
        }
        navigation.navigate('CorrectionSuccess', correctionParams);
      } else {
        Alert.alert(
          t('success') || 'Success',
          (result as any).message ||
            t('answersSubmittedSuccessfully') ||
            'Answers submitted successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } else if (submitError) {
      Alert.alert(t('error') || 'Error', submitError);
    }
  };

  if (dataLoading && !quinipolo) {
    return (
      <Background>
        <View style={[globalStyles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>
            {t('loadingQuinipolo') || 'Loading quinipolo...'}
          </Text>
        </View>
      </Background>
    );
  }

  if (!quinipolo) {
    return (
      <Background>
        <View style={[globalStyles.container, styles.errorContainer]}>
          <IconButton icon="alert-circle" size={48} iconColor={colors.error} />
          <Text style={styles.errorText}>
            {t('quinipoloNotFound') || 'Quinipolo not found'}
          </Text>
          <PaperButton mode="outlined" onPress={() => navigation.goBack()}>
            {t('goBack') || 'Go Back'}
          </PaperButton>
        </View>
      </Background>
    );
  }

  // For answer mode, check if deadline has passed
  const deadline = new Date(quinipolo.end_date);
  const now = new Date();
  const deadlineHasPassed = deadline.getTime() <= now.getTime();

  if (!isCorrectionMode && deadlineHasPassed) {
    return (
      <Background>
        <View style={[globalStyles.container, styles.errorContainer]}>
          <IconButton icon="clock-alert" size={48} iconColor={colors.warning} />
          <Text style={styles.errorText}>
            {t('quinipoloExpired') || 'This quinipolo has expired'}
          </Text>
          <Text style={styles.errorSubtext}>
            {t('deadlineWas') || 'Deadline was'}: {deadline.toLocaleString()}
          </Text>
          <PaperButton
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.button}
          >
            {t('goBack') || 'Go Back'}
          </PaperButton>
        </View>
      </Background>
    );
  }

  const headerTitle = isCorrectionMode
    ? t('correctResults') || 'Correct Results'
    : t('answerQuinipolo') || 'Answer';

  const instructionsText = isCorrectionMode
    ? t('correctionInstructions') ||
      'Enter the exact result for each match. For ties, provide regular time and penalty scores.'
    : t('answerInstructions') ||
      'Select the winner for each match. For match 15, also enter the final score.';

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[globalStyles.container, styles.container]}>
          {/* Header Card */}
          <Card style={styles.headerCard}>
            <Card.Content>
              <View style={styles.header}>
                <IconButton
                  icon={isCorrectionMode ? 'pencil-check' : 'clipboard-edit'}
                  size={32}
                  iconColor={colors.primary}
                />
                <View style={styles.headerText}>
                  <Text style={styles.leagueName}>{quinipolo.league_name}</Text>
                  <Text style={styles.modeLabel}>{headerTitle}</Text>
                  <Text style={styles.deadlineText}>
                    {t('deadline') || 'Deadline'}: {deadline.toLocaleString()}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Instructions */}
          <Card style={styles.instructionsCard}>
            <Card.Content>
              <Text style={styles.instructionsText}>{instructionsText}</Text>
            </Card.Content>
          </Card>

          {/* Match Rows */}
          <View style={styles.matchesContainer}>
            {quinipolo.quinipolo.map((match, index) => (
              <MatchRow
                key={`${match.homeTeam}-${match.awayTeam}-${index}`}
                match={match}
                matchIndex={index}
                answer={answers[index] as any}
                onWinnerChange={handleWinnerChange}
                onGame15GoalChange={handleGame15GoalChange}
                onCancelMatch={handleCancelMatch}
                disabled={loading}
                isMissing={missingAnswerIndices.includes(index)}
                showCancelButton={isCorrectionMode}
                isCorrectionMode={isCorrectionMode}
                {...(isCorrectionMode ? { onGoalsChange: handleGoalsChange } : {})}
              />
            ))}
          </View>

          {/* Auto-fill Button (correction mode only) */}
          {isCorrectionMode && hasScraperAccess && (
            <PaperButton
              mode="outlined"
              icon="auto-fix"
              onPress={() => setAutoFillVisible(true)}
              style={{ marginBottom: 12, borderRadius: 8 }}
            >
              {t('autoFillResults') || 'Auto-fill Results'}
            </PaperButton>
          )}

          {/* Submit Button */}
          <PaperButton
            mode="contained"
            onPress={handleSubmit}
            loading={submitLoading}
            disabled={loading}
            style={styles.submitButton}
            icon={isCorrectionMode ? 'check-bold' : 'send'}
          >
            {isCorrectionMode
              ? t('submitCorrection') || 'Submit Correction'
              : t('submitAnswers') || 'Submit Answers'}
          </PaperButton>
        </View>
      </ScrollView>
      <ResultsAutoFillModal
        visible={autoFillVisible}
        quinipoloId={quinipoloId ?? ''}
        onClose={() => setAutoFillVisible(false)}
        onConfirm={handleResultsAutoFill}
      />
    </Background>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 40,
  },
  container: {
    paddingVertical: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
  headerCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 8,
  },
  leagueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 2,
  },
  deadlineText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  instructionsCard: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: colors.primary + '10',
  },
  instructionsText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  matchesContainer: {
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 24,
  },
});

export default AnswerQuinipoloScreen;
