import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
  Text,
  Card,
  Button as PaperButton,
  IconButton,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Background } from '../components';
import apiClient from '../services/api';
import { colors } from '../styles/globalStyles';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';

type CorrectionSuccessNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'CorrectionSuccess'
>;

type CorrectionSuccessRouteProp = RouteProp<
  HomeStackParamList,
  'CorrectionSuccess'
>;

interface LeaderboardEntry {
  username: string;
  pointsThisRound?: number;
  totalPoints?: number;
}

export default function CorrectionSuccessScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<CorrectionSuccessNavigationProp>();
  const route = useRoute<CorrectionSuccessRouteProp>();

  const { quinipoloId, leagueId, averagePoints } = route.params ?? {};

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!quinipoloId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await apiClient.get(
          `/api/quinipolos/quinipolo/${quinipoloId}/results`
        );
        const data = response.data;
        // Accept array directly or wrapped in a results/leaderboard key
        const entries: LeaderboardEntry[] = Array.isArray(data)
          ? data
          : data?.results ?? data?.leaderboard ?? [];
        setLeaderboard(entries);
      } catch (err: any) {
        console.error('Error fetching results:', err);
        setFetchError(
          err?.response?.data?.message || 'Failed to load results'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quinipoloId]);

  const handleGoToLeague = () => {
    if (leagueId) {
      navigation.navigate('LeagueDashboard', { id: leagueId });
    } else {
      navigation.navigate('Home');
    }
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const renderLeaderboardItem = ({
    item,
    index,
  }: {
    item: LeaderboardEntry;
    index: number;
  }) => (
    <View style={styles.leaderboardRow}>
      <Text style={styles.rankText}>{index + 1}</Text>
      <Text style={styles.usernameText} numberOfLines={1}>
        {item.username}
      </Text>
      {item.pointsThisRound !== undefined && (
        <Text style={styles.pointsThisRoundText}>
          +{item.pointsThisRound}
        </Text>
      )}
      {item.totalPoints !== undefined && (
        <Text style={styles.totalPointsText}>{item.totalPoints} pts</Text>
      )}
    </View>
  );

  return (
    <Background>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            {/* Success icon */}
            <IconButton
              icon="check-decagram"
              size={64}
              iconColor={colors.success}
            />

            <Text style={styles.title}>
              {t('correctionSubmittedSuccess') || 'Correction submitted!'}
            </Text>

            {/* Average points */}
            {averagePoints !== undefined && (
              <View style={styles.averageContainer}>
                <Text style={styles.averageLabel}>
                  {t('averagePoints') || 'Average points this round'}
                </Text>
                <Text style={styles.averageValue}>
                  {averagePoints.toFixed(1)}
                </Text>
              </View>
            )}

            {/* Leaderboard */}
            <View style={styles.leaderboardContainer}>
              <Text style={styles.leaderboardTitle}>
                {t('leaderboard') || 'Leaderboard'}
              </Text>
              <Divider style={styles.divider} />

              {loading ? (
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                  style={styles.loader}
                />
              ) : fetchError ? (
                <Text style={styles.errorText}>{fetchError}</Text>
              ) : leaderboard.length === 0 ? (
                <Text style={styles.emptyText}>No results yet</Text>
              ) : (
                <FlatList
                  data={leaderboard}
                  keyExtractor={(item, i) => `${item.username}-${i}`}
                  renderItem={renderLeaderboardItem}
                  scrollEnabled={false}
                  style={styles.leaderboardList}
                />
              )}
            </View>

            {/* Navigation buttons */}
            <View style={styles.buttonsContainer}>
              {leagueId && (
                <PaperButton
                  mode="contained"
                  icon="trophy"
                  onPress={handleGoToLeague}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  {t('goToLeague') || 'Go to League'}
                </PaperButton>
              )}
              <PaperButton
                mode="outlined"
                icon="home"
                onPress={handleGoHome}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                {t('goHome') || 'Go Home'}
              </PaperButton>
            </View>
          </Card.Content>
        </Card>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 20,
    elevation: 4,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  averageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.success + '15',
    borderRadius: 12,
    width: '100%',
  },
  averageLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  averageValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.success,
  },
  leaderboardContainer: {
    width: '100%',
    marginBottom: 24,
  },
  leaderboardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  divider: {
    marginBottom: 8,
    backgroundColor: colors.border,
  },
  loader: {
    marginVertical: 16,
  },
  errorText: {
    fontSize: 13,
    color: colors.error,
    textAlign: 'center',
    marginVertical: 8,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: 8,
  },
  leaderboardList: {
    maxHeight: 280,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  rankText: {
    width: 24,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  usernameText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  pointsThisRoundText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.success,
    minWidth: 36,
    textAlign: 'right',
  },
  totalPointsText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    minWidth: 52,
    textAlign: 'right',
  },
  buttonsContainer: {
    width: '100%',
    gap: 10,
  },
  button: {
    borderRadius: 10,
  },
  buttonContent: {
    paddingVertical: 6,
  },
});
