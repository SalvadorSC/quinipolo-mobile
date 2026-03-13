import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, IconButton, ActivityIndicator, Button as PaperButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Background, ViewMatchRow, AnswerStatisticsBar } from '../components';
import { usePastQuinipoloData, useAnswerStatistics } from '../hooks/answers';
import { globalStyles, colors } from '../styles/globalStyles';
import { useUser } from '../context/UserContext';

type RootStackParamList = {
  ViewQuinipolo: { quinipoloId: string };
};

type ViewQuinipoloRouteProp = RouteProp<RootStackParamList, 'ViewQuinipolo'>;

const ViewQuinipoloScreen = () => {
  const { t } = useTranslation();
  const route = useRoute<ViewQuinipoloRouteProp>();
  const navigation = useNavigation();
  const quinipoloId = route.params?.quinipoloId;

  // Fetch past quinipolo data
  const { loading, quinipolo, userAnswers, pointsEarned, error } = usePastQuinipoloData({
    quinipoloId,
    autoFetch: true,
  });

  const { userData } = useUser();
  const isAdmin = userData.role === 'systemAdmin';
  const [showStatistics, setShowStatistics] = useState(false);
  const { statistics } = useAnswerStatistics(
    quinipoloId ?? null,
    quinipolo?.end_date,
    isAdmin && showStatistics
  );

  if (loading && !quinipolo) {
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

  if (error || !quinipolo) {
    return (
      <Background>
        <View style={[globalStyles.container, styles.errorContainer]}>
          <IconButton icon="alert-circle" size={48} iconColor={colors.error} />
          <Text style={styles.errorText}>
            {error || t('quinipoloNotFound') || 'Quinipolo not found'}
          </Text>
          <PaperButton mode="outlined" onPress={() => navigation.goBack()}>
            {t('goBack') || 'Go Back'}
          </PaperButton>
        </View>
      </Background>
    );
  }

  const deadline = new Date(quinipolo.end_date);
  const hasCorrectAnswers = quinipolo.has_been_corrected && quinipolo.correct_answers;
  const hasUserAnswers = userAnswers && userAnswers.length > 0;

  // Calculate statistics (only if user has answers)
  const correctCount = hasUserAnswers ? userAnswers.reduce((count, userAnswer, index) => {
    const correctAnswer = quinipolo.correct_answers?.[index];
    if (!correctAnswer) return count;
    if (correctAnswer.cancelled) return count + 1;

    const isWinnerCorrect = userAnswer.chosenWinner === correctAnswer.chosenWinner;
    const isGoalsCorrect =
      index !== 14 ||
      (userAnswer.goalsHomeTeam === correctAnswer.goalsHomeTeam &&
       userAnswer.goalsAwayTeam === correctAnswer.goalsAwayTeam);

    return count + (isWinnerCorrect && isGoalsCorrect ? 1 : 0);
  }, 0) : 0;

  const totalMatches = quinipolo.quinipolo.length;

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[globalStyles.container, styles.container]}>
          {/* Header Card */}
          <Card style={styles.headerCard}>
            <LinearGradient
              colors={[colors.primary + '15', colors.primary + '05', '#FFFFFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <Card.Content>
                <View style={styles.header}>
                  <View style={styles.headerLeft}>
                    <IconButton
                      icon="file-document"
                      size={32}
                      iconColor={colors.primary}
                      style={styles.headerIcon}
                    />
                    <View style={styles.headerText}>
                      <Text style={styles.leagueName}>{quinipolo.league_name}</Text>
                      <Text style={styles.deadlineText}>
                        {t('deadline') || 'Deadline'}: {deadline.toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
                {isAdmin && new Date(quinipolo.end_date) < new Date() && (
                  <View style={styles.statsToggleRow}>
                    <PaperButton
                      mode={showStatistics ? 'contained' : 'outlined'}
                      onPress={() => setShowStatistics(s => !s)}
                      icon="chart-bar"
                      compact
                      style={styles.statsToggleButton}
                    >
                      {showStatistics
                        ? (t('hideStatistics') || 'Hide Statistics')
                        : (t('showStatistics') || 'Show Statistics')}
                    </PaperButton>
                  </View>
                )}
              </Card.Content>
            </LinearGradient>
          </Card>

          {/* Score Summary Card - Only show if user has answers and quinipolo has been corrected */}
          {hasUserAnswers && hasCorrectAnswers && (
            <Card style={styles.scoreCard} elevation={5}>
              <LinearGradient
                colors={[
                  colors.success + '25',
                  colors.success + '15',
                  colors.success + '08',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.scoreGradient}
              >
                <Card.Content style={styles.scoreCardContent}>
                  <View style={styles.scoreHeader}>
                    <View style={styles.scoreIconWrapper}>
                      <IconButton
                        icon="trophy"
                        size={48}
                        iconColor={colors.success}
                        style={styles.scoreIcon}
                      />
                    </View>
                    <View style={styles.scoreContent}>
                      <Text style={styles.scoreTitle}>
                        {t('yourScore') || 'Your Score'}
                      </Text>
                      <View style={styles.scoreValueContainer}>
                        <Text style={styles.scoreValue}>
                          {correctCount}
                        </Text>
                        <Text style={styles.scoreSlash}>/</Text>
                        <Text style={styles.scoreTotalMatches}>{totalMatches}</Text>
                      </View>
                      {pointsEarned !== null && (
                        <View style={styles.pointsBadge}>
                          <IconButton
                            icon="star"
                            size={16}
                            iconColor={colors.success}
                            style={styles.pointsIcon}
                          />
                          <Text style={styles.pointsText}>
                            {pointsEarned} {t('points') || 'points'}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </Card.Content>
              </LinearGradient>
            </Card>
          )}

          {/* Info Card */}
          <Card style={styles.infoCard} elevation={2}>
            <Card.Content style={styles.infoCardContent}>
              <View style={styles.infoIconContainer}>
                <IconButton
                  icon={!hasUserAnswers ? 'information' : hasCorrectAnswers ? 'check-circle' : 'clock-outline'}
                  size={20}
                  iconColor={!hasUserAnswers ? colors.textSecondary : hasCorrectAnswers ? colors.success : colors.primary}
                  style={styles.infoIcon}
                />
              </View>
              <Text style={styles.infoText}>
                {!hasUserAnswers
                  ? t('viewQuinipoloNoAnswersInfo') ||
                    'You did not answer this quinipolo. Below you can see the matches.'
                  : hasCorrectAnswers
                    ? t('viewResultsInfo') ||
                      'Below you can see your answers compared to the correct results'
                    : t('viewAnswersInfo') ||
                      'Below you can see your submitted answers. Results will be shown once corrected.'}
              </Text>
            </Card.Content>
          </Card>

          {/* Match Results */}
          <View style={styles.matchesContainer}>
            {quinipolo.quinipolo.map((match, index) => (
              <View key={`${match.homeTeam}-${match.awayTeam}-${index}`}>
                <ViewMatchRow
                  match={match}
                  matchIndex={index}
                  {...(userAnswers[index] !== undefined && { userAnswer: userAnswers[index] })}
                  {...(quinipolo.correct_answers?.[index] !== undefined && { correctAnswer: quinipolo.correct_answers[index] })}
                />
                {showStatistics && statistics && (() => {
                  const matchStats = statistics.matches.find(m => m.matchNumber === index + 1);
                  return matchStats ? (
                    <AnswerStatisticsBar
                      homeTeam={match.homeTeam}
                      awayTeam={match.awayTeam}
                      statistics={matchStats.statistics}
                      totalResponses={statistics.total_responses}
                    />
                  ) : null;
                })()}
              </View>
            ))}
          </View>

          {/* Back Button */}
          <PaperButton
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            icon="arrow-left"
          >
            {t('goBack') || 'Go Back'}
          </PaperButton>
        </View>
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 16,
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
    marginBottom: 24,
  },
  headerCard: {
    marginBottom: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  headerGradient: {
    borderRadius: 20,
  },
  header: {
    paddingVertical: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    margin: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  headerText: {
    flex: 1,
  },
  leagueName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  deadlineText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  scoreCard: {
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  scoreGradient: {
    borderRadius: 20,
  },
  scoreCardContent: {
    paddingVertical: 20,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  scoreIconWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    elevation: 4,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  scoreIcon: {
    margin: 0,
  },
  scoreContent: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scoreValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.success,
    letterSpacing: -1,
  },
  scoreSlash: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.success + '80',
    marginHorizontal: 4,
  },
  scoreTotalMatches: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.success + '80',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '20',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  pointsIcon: {
    margin: 0,
    marginRight: -8,
  },
  pointsText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.success,
  },
  infoCard: {
    marginBottom: 24,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border + '40',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  infoCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  infoIconContainer: {
    backgroundColor: colors.primary + '10',
    borderRadius: 20,
  },
  infoIcon: {
    margin: 0,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontWeight: '500',
  },
  matchesContainer: {
    marginBottom: 24,
  },
  backButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  statsToggleRow: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  statsToggleButton: {
    borderRadius: 8,
  },
});

export default ViewQuinipoloScreen;
