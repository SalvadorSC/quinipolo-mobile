import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Button as PaperButton,
  ActivityIndicator,
  IconButton,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Background, MatchAutoFillModal } from '../components';
import apiClient from '../services/api';
import { colors } from '../styles/globalStyles';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { useUser } from '../context/UserContext';
import type { ScraperMatch } from '../services/scraperTypes';

dayjs.extend(customParseFormat);

type GameType = 'waterpolo' | 'football' | 'basketball' | 'handball' | 'tennis';
type GoalRange = '-' | '11/12' | '+';

const GAME_TYPES: { value: GameType; label: string }[] = [
  { value: 'waterpolo', label: 'Waterpolo' },
  { value: 'football', label: 'Football' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'handball', label: 'Handball' },
  { value: 'tennis', label: 'Tennis' },
];

const GOAL_RANGES: { value: GoalRange; label: string }[] = [
  { value: '-', label: '<11' },
  { value: '11/12', label: '11/12' },
  { value: '+', label: '>12' },
];

const SPORT_ORDER: GameType[] = [
  'waterpolo',
  'football',
  'basketball',
  'handball',
  'tennis',
];

interface MatchItem {
  homeTeam: string;
  awayTeam: string;
  gameType: GameType;
  isGame15: boolean;
  leagueId?: string;
  leagueName?: string;
  goalsHomeTeam?: string;
  goalsAwayTeam?: string;
}

type CreateQuinipoloNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'CreateQuinipolo'
>;

type CreateQuinipoloRouteProp = RouteProp<HomeStackParamList, 'CreateQuinipolo'>;

function createInitialMatches(): MatchItem[] {
  return Array.from({ length: 15 }, (_, i) => ({
    homeTeam: '',
    awayTeam: '',
    gameType: 'football' as GameType,
    isGame15: i === 14,
    goalsHomeTeam: '',
    goalsAwayTeam: '',
  }));
}

export default function CreateQuinipoloScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<CreateQuinipoloNavigationProp>();
  const route = useRoute<CreateQuinipoloRouteProp>();
  const leagueId = route.params?.leagueId ?? '';
  const leagueName = route.params?.leagueName ?? '';

  const { userData } = useUser();
  const hasScraperAccess = userData.hasScraperAccess === true;

  const [matches, setMatches] = useState<MatchItem[]>(createInitialMatches);
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMatch15Locked, setIsMatch15Locked] = useState(true);
  const [autoFillVisible, setAutoFillVisible] = useState(false);

  const updateMatch = useCallback(
    (index: number, field: keyof MatchItem, value: string) => {
      setMatches((prev) => {
        const next = [...prev] as MatchItem[];
        const cur = next[index];
        if (!cur) return prev;
        next[index] = { ...cur, [field]: value } as MatchItem;
        return next;
      });
    },
    []
  );

  const handleGameTypeChange = useCallback(
    (index: number, gameType: GameType) => {
      setMatches((prev) => {
        const next = [...prev] as MatchItem[];
        const cur = next[index];
        if (!cur) return prev;
        next[index] = { ...cur, gameType } as MatchItem;
        return next;
      });
    },
    []
  );

  const handleGoalRangeChange = useCallback(
    (team: 'home' | 'away', range: GoalRange) => {
      setMatches((prev) => {
        const next = [...prev] as MatchItem[];
        const cur = next[14];
        if (!cur) return prev;
        const match15 = { ...cur } as MatchItem;
        if (team === 'home') {
          match15.goalsHomeTeam = range;
        } else {
          match15.goalsAwayTeam = range;
        }
        next[14] = match15;
        return next;
      });
    },
    []
  );

  const handleSortBySport = useCallback(() => {
    setMatches((prev) => {
      const nonGame15 = prev.slice(0, 14) as MatchItem[];
      const game15 = prev[14];
      if (!game15) return prev;
      const sorted = [...nonGame15].sort((a, b) => {
        return SPORT_ORDER.indexOf(a.gameType) - SPORT_ORDER.indexOf(b.gameType);
      });
      return [...sorted, game15];
    });
  }, []);

  const handleAutoFill = useCallback(
    ({ matches: scraperMatches, plenoMatchId }: { matches: ScraperMatch[]; plenoMatchId: string | null }) => {
      // Sort by startTime, pleno goes to index 14
      const nonPleno = scraperMatches.filter(m => m.matchId !== plenoMatchId);
      const pleno = scraperMatches.find(m => m.matchId === plenoMatchId) ?? null;
      const sorted = [...nonPleno].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      // Build 15 MatchItems
      const newMatches = createInitialMatches();
      sorted.forEach((m, i) => {
        if (i >= 14) return;
        newMatches[i] = {
          homeTeam: m.homeTeam,
          awayTeam: m.awayTeam,
          gameType: 'waterpolo',
          isGame15: false,
          leagueId: m.leagueId,
          leagueName: m.leagueName,
        } as MatchItem;
      });
      if (pleno) {
        newMatches[14] = {
          homeTeam: pleno.homeTeam,
          awayTeam: pleno.awayTeam,
          gameType: 'waterpolo',
          isGame15: true,
          leagueId: pleno.leagueId,
          leagueName: pleno.leagueName,
        } as MatchItem;
      } else if (sorted.length >= 15) {
        const last = sorted[14]!;
        newMatches[14] = {
          homeTeam: last.homeTeam,
          awayTeam: last.awayTeam,
          gameType: 'waterpolo',
          isGame15: true,
          leagueId: last.leagueId,
          leagueName: last.leagueName,
        } as MatchItem;
      }
      setMatches(newMatches);
    },
    []
  );

  const validate = (): string | null => {
    for (let i = 0; i < 15; i++) {
      const m = matches[i] as MatchItem | undefined;
      if (!m || !m.homeTeam.trim() || !m.awayTeam.trim()) {
        return `Match ${i + 1} requires both home and away team names`;
      }
    }

    if (!deadline.trim()) {
      return 'Deadline is required (DD/MM/YYYY HH:mm)';
    }

    const parsed = dayjs(deadline.trim(), 'DD/MM/YYYY HH:mm', true);
    if (!parsed.isValid()) {
      return 'Invalid deadline format. Use DD/MM/YYYY HH:mm';
    }
    if (!parsed.isAfter(dayjs())) {
      return 'Deadline must be in the future';
    }

    if (!isMatch15Locked) {
      const m15 = matches[14] as MatchItem | undefined;
      if (!m15 || !m15.goalsHomeTeam || !m15.goalsAwayTeam) {
        return 'Match 15 goal ranges must both be selected when unlocked';
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      Alert.alert(t('validationError') || 'Validation Error', err);
      return;
    }

    const parsedDeadline = dayjs(deadline.trim(), 'DD/MM/YYYY HH:mm', true);

    setLoading(true);
    try {
      const response = await apiClient.post('/api/quinipolos', {
        league_id: leagueId,
        quinipolo: matches,
        end_date: parsedDeadline.toISOString(),
        creation_date: new Date().toISOString(),
      });

      navigation.navigate('QuinipoloSuccess', { quinipolo: response.data });
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        'Failed to create quinipolo';
      Alert.alert(t('error') || 'Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const match15 = matches[14] as MatchItem;

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Header */}
          <Card style={styles.headerCard}>
            <Card.Content>
              <View style={styles.headerRow}>
                <IconButton
                  icon="arrow-left"
                  size={24}
                  onPress={() => navigation.goBack()}
                  style={styles.backButton}
                />
                <View style={styles.headerTextContainer}>
                  <Text style={styles.headerTitle}>
                    {t('createQuinipolo') || 'Create Quinipolo'}
                  </Text>
                  {leagueName ? (
                    <Text style={styles.headerSubtitle}>{leagueName}</Text>
                  ) : null}
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Deadline */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionLabel}>
                {t('deadline') || 'Deadline'}
              </Text>
              <TextInput
                style={styles.deadlineInput}
                value={deadline}
                onChangeText={setDeadline}
                placeholder="DD/MM/YYYY HH:mm"
                placeholderTextColor={colors.textSecondary}
                accessibilityLabel="Deadline date and time"
              />
            </Card.Content>
          </Card>

          {/* Sort Button */}
          <PaperButton
            mode="outlined"
            icon="sort"
            onPress={handleSortBySport}
            style={styles.sortButton}
          >
            {t('sortBySport') || 'Sort by sport'}
          </PaperButton>

          {hasScraperAccess && (
            <PaperButton
              mode="outlined"
              icon="auto-fix"
              onPress={() => setAutoFillVisible(true)}
              style={styles.sortButton}
            >
              {t('autoFillMatches') || 'Auto-fill'}
            </PaperButton>
          )}

          {/* Match rows 1-14 */}
          {matches.slice(0, 14).map((match, index) => (
            <Card key={index} style={styles.matchCard}>
              <Card.Content>
                <Text style={styles.matchNumber}>
                  {t('match') || 'Match'} {index + 1}
                </Text>

                <View style={styles.teamInputsRow}>
                  <TextInput
                    style={[styles.teamInput, styles.teamInputLeft]}
                    value={match.homeTeam}
                    onChangeText={(val) => updateMatch(index, 'homeTeam', val)}
                    placeholder={t('homeTeam') || 'Home team'}
                    placeholderTextColor={colors.textSecondary}
                    accessibilityLabel={`Match ${index + 1} home team`}
                  />
                  <Text style={styles.vsText}>vs</Text>
                  <TextInput
                    style={[styles.teamInput, styles.teamInputRight]}
                    value={match.awayTeam}
                    onChangeText={(val) => updateMatch(index, 'awayTeam', val)}
                    placeholder={t('awayTeam') || 'Away team'}
                    placeholderTextColor={colors.textSecondary}
                    accessibilityLabel={`Match ${index + 1} away team`}
                  />
                </View>

                {/* Game type picker */}
                <View style={styles.gameTypeRow}>
                  {GAME_TYPES.map((gt) => (
                    <TouchableOpacity
                      key={gt.value}
                      style={[
                        styles.gameTypeButton,
                        match.gameType === gt.value &&
                          styles.gameTypeButtonActive,
                      ]}
                      onPress={() => handleGameTypeChange(index, gt.value)}
                      accessibilityRole="radio"
                      accessibilityLabel={gt.label}
                    >
                      <Text
                        style={[
                          styles.gameTypeText,
                          match.gameType === gt.value &&
                            styles.gameTypeTextActive,
                        ]}
                        numberOfLines={1}
                      >
                        {gt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Card.Content>
            </Card>
          ))}

          {/* Match 15 */}
          <Card style={[styles.matchCard, styles.match15Card]}>
            <Card.Content>
              <View style={styles.match15Header}>
                <Text style={styles.matchNumber}>
                  {t('match') || 'Match'} 15
                </Text>
                <TouchableOpacity
                  style={[
                    styles.lockButton,
                    !isMatch15Locked && styles.lockButtonActive,
                  ]}
                  onPress={() => setIsMatch15Locked((v) => !v)}
                  accessibilityRole="button"
                  accessibilityLabel="Toggle match 15 goal ranges lock"
                >
                  <Text style={styles.lockButtonText}>
                    {isMatch15Locked ? 'Goals: locked' : 'Goals: custom'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.teamInputsRow}>
                <TextInput
                  style={[styles.teamInput, styles.teamInputLeft]}
                  value={match15.homeTeam}
                  onChangeText={(val) => updateMatch(14, 'homeTeam', val)}
                  placeholder={t('homeTeam') || 'Home team'}
                  placeholderTextColor={colors.textSecondary}
                  accessibilityLabel="Match 15 home team"
                />
                <Text style={styles.vsText}>vs</Text>
                <TextInput
                  style={[styles.teamInput, styles.teamInputRight]}
                  value={match15.awayTeam}
                  onChangeText={(val) => updateMatch(14, 'awayTeam', val)}
                  placeholder={t('awayTeam') || 'Away team'}
                  placeholderTextColor={colors.textSecondary}
                  accessibilityLabel="Match 15 away team"
                />
              </View>

              {/* Game type */}
              <View style={styles.gameTypeRow}>
                {GAME_TYPES.map((gt) => (
                  <TouchableOpacity
                    key={gt.value}
                    style={[
                      styles.gameTypeButton,
                      match15.gameType === gt.value &&
                        styles.gameTypeButtonActive,
                    ]}
                    onPress={() => handleGameTypeChange(14, gt.value)}
                    accessibilityRole="radio"
                    accessibilityLabel={gt.label}
                  >
                    <Text
                      style={[
                        styles.gameTypeText,
                        match15.gameType === gt.value &&
                          styles.gameTypeTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {gt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Goal range toggles (only when unlocked) */}
              {!isMatch15Locked && (
                <View style={styles.goalRangesContainer}>
                  <View style={styles.goalRangeRow}>
                    <Text style={styles.goalRangeLabel}>
                      {match15.homeTeam || 'Home'}
                    </Text>
                    <View style={styles.goalRangeButtons}>
                      {GOAL_RANGES.map((gr) => (
                        <TouchableOpacity
                          key={gr.value}
                          style={[
                            styles.goalRangeButton,
                            match15.goalsHomeTeam === gr.value &&
                              styles.goalRangeButtonActive,
                          ]}
                          onPress={() =>
                            handleGoalRangeChange('home', gr.value)
                          }
                          accessibilityRole="radio"
                          accessibilityLabel={`Home goals ${gr.label}`}
                        >
                          <Text
                            style={[
                              styles.goalRangeText,
                              match15.goalsHomeTeam === gr.value &&
                                styles.goalRangeTextActive,
                            ]}
                          >
                            {gr.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <View style={styles.goalRangeRow}>
                    <Text style={styles.goalRangeLabel}>
                      {match15.awayTeam || 'Away'}
                    </Text>
                    <View style={styles.goalRangeButtons}>
                      {GOAL_RANGES.map((gr) => (
                        <TouchableOpacity
                          key={gr.value}
                          style={[
                            styles.goalRangeButton,
                            match15.goalsAwayTeam === gr.value &&
                              styles.goalRangeButtonActive,
                          ]}
                          onPress={() =>
                            handleGoalRangeChange('away', gr.value)
                          }
                          accessibilityRole="radio"
                          accessibilityLabel={`Away goals ${gr.label}`}
                        >
                          <Text
                            style={[
                              styles.goalRangeText,
                              match15.goalsAwayTeam === gr.value &&
                                styles.goalRangeTextActive,
                            ]}
                          >
                            {gr.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </Card.Content>
          </Card>

          {/* Submit */}
          <PaperButton
            mode="contained"
            icon="send"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            {t('createQuinipolo') || 'Create Quinipolo'}
          </PaperButton>

          {loading && (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={styles.loader}
            />
          )}
        </View>
      </ScrollView>
      <MatchAutoFillModal
        visible={autoFillVisible}
        onClose={() => setAutoFillVisible(false)}
        onConfirm={handleAutoFill}
      />
    </Background>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 48,
  },
  container: {
    paddingHorizontal: 16,
  },
  headerCard: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    margin: 0,
    marginRight: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 1,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  deadlineInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  sortButton: {
    marginBottom: 16,
    borderRadius: 8,
  },
  matchCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
  },
  match15Card: {
    borderWidth: 2,
    borderColor: colors.primary + '40',
  },
  matchNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 10,
  },
  teamInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  teamInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.white,
  },
  teamInputLeft: {},
  teamInputRight: {},
  vsText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    paddingHorizontal: 2,
  },
  gameTypeRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  gameTypeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    minWidth: 52,
    alignItems: 'center',
  },
  gameTypeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  gameTypeText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  gameTypeTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  match15Header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  lockButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    backgroundColor: colors.background,
  },
  lockButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  lockButtonText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  goalRangesContainer: {
    marginTop: 12,
    gap: 10,
  },
  goalRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  goalRangeLabel: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
    numberOfLines: 1,
  } as any,
  goalRangeButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  goalRangeButton: {
    width: 52,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  goalRangeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  goalRangeText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  goalRangeTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 12,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  loader: {
    marginTop: 16,
  },
});
