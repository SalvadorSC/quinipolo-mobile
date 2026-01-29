import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, IconButton, ActivityIndicator, Button as PaperButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Background, MatchRow } from '../components';
import { useUser } from '../context/UserContext';
import {
  useQuinipoloData,
  useAnswerHandlers,
  useAnswerValidation,
  useAnswerSubmission,
} from '../hooks/answers';
import { globalStyles, colors } from '../styles/globalStyles';

type RootStackParamList = {
  AnswerQuinipolo: { quinipoloId: string };
};

type AnswerQuinipoloRouteProp = RouteProp<RootStackParamList, 'AnswerQuinipolo'>;

const AnswerQuinipoloScreen = () => {
  const { t } = useTranslation();
  const route = useRoute<AnswerQuinipoloRouteProp>();
  const navigation = useNavigation();
  const { userData } = useUser();
  const quinipoloId = route.params?.quinipoloId;

  const [missingAnswerIndices, setMissingAnswerIndices] = useState<number[]>([]);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState<boolean>(false);

  // Fetch quinipolo data
  const { loading: dataLoading, quinipolo, answers, setAnswers } = useQuinipoloData({
    quinipoloId,
    autoFetch: true,
  });

  // Answer handlers
  const { handleWinnerChange, handleGame15GoalChange, handleCancelMatch } = useAnswerHandlers(
    answers,
    setAnswers,
    setMissingAnswerIndices
  );

  // Answer validation
  useAnswerValidation(answers, quinipolo, hasAttemptedSubmit, setMissingAnswerIndices);

  // Answer submission
  const { submitAnswers, loading: submitLoading, error: submitError } = useAnswerSubmission({
    answers,
    quinipolo,
    username: userData.username,
    setMissingAnswerIndices,
    setHasAttemptedSubmit,
  });

  const loading = dataLoading || submitLoading;

  const handleSubmit = async () => {
    const result = await submitAnswers();

    if (result) {
      Alert.alert(
        t('success') || 'Success',
        result.message || t('answersSubmittedSuccessfully') || 'Answers submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
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

  // Check if deadline has passed
  const deadline = new Date(quinipolo.end_date);
  const now = new Date();
  const deadlineHasPassed = deadline.getTime() <= now.getTime();

  if (deadlineHasPassed) {
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
          <PaperButton mode="outlined" onPress={() => navigation.goBack()} style={styles.button}>
            {t('goBack') || 'Go Back'}
          </PaperButton>
        </View>
      </Background>
    );
  }

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[globalStyles.container, styles.container]}>
          {/* Header Card */}
          <Card style={styles.headerCard}>
            <Card.Content>
              <View style={styles.header}>
                <IconButton icon="clipboard-edit" size={32} iconColor={colors.primary} />
                <View style={styles.headerText}>
                  <Text style={styles.leagueName}>{quinipolo.league_name}</Text>
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
              <Text style={styles.instructionsText}>
                {t('answerInstructions') ||
                  'Select the winner for each match. For match 15, also enter the final score.'}
              </Text>
            </Card.Content>
          </Card>

          {/* Match Rows */}
          <View style={styles.matchesContainer}>
            {quinipolo.quinipolo.map((match, index) => (
              <MatchRow
                key={`${match.homeTeam}-${match.awayTeam}-${index}`}
                match={match}
                matchIndex={index}
                answer={answers[index]}
                onWinnerChange={handleWinnerChange}
                onGame15GoalChange={handleGame15GoalChange}
                onCancelMatch={handleCancelMatch}
                disabled={loading}
                isMissing={missingAnswerIndices.includes(index)}
                showCancelButton={true}
              />
            ))}
          </View>

          {/* Submit Button */}
          <PaperButton
            mode="contained"
            onPress={handleSubmit}
            loading={submitLoading}
            disabled={loading}
            style={styles.submitButton}
            icon="send"
          >
            {t('submitAnswers') || 'Submit Answers'}
          </PaperButton>
        </View>
      </ScrollView>
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
