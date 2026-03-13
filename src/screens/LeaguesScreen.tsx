import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Searchbar,
  DataTable,
  IconButton,
  Button,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import {
  Background,
  LoadingCard,
  EmptyStateCard,
  SectionHeader,
} from '../components';
import { useUser } from '../context/UserContext';
import { colors, tableStyles } from '../styles/globalStyles';
import apiClient from '../services/api';

type LeagueParticipant = {
  user_id: string;
  username: string;
  role: string;
};

type LeaguePetition = {
  userId: string;
  username: string;
  status: string;
  date: string;
};

type League = {
  id: string;
  league_name: string;
  is_private: boolean;
  participants: LeagueParticipant[];
  participantPetitions: LeaguePetition[];
  icon_style?: {
    icon?: string;
    icon_color?: string;
    accent_color?: string;
  };
};

const LeaguesScreen = () => {
  const { t } = useTranslation();
  const { userData } = useUser();
  const navigation = useNavigation();

  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingLeagueId, setProcessingLeagueId] = useState<string | null>(
    null
  );

  // Helper function to check if user is in a league
  const isUserInLeague = useCallback(
    (league: League) => {
      return league.participants.some(
        participant => participant.username === userData.username
      );
    },
    [userData.username]
  );

  // Helper function to check if user has a pending petition
  const hasPendingPetition = useCallback(
    (league: League) => {
      return league.participantPetitions?.some(
        petition =>
          petition.username === userData.username &&
          petition.status === 'pending'
      );
    },
    [userData.username]
  );

  // Fetch all leagues
  const fetchLeagues = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/leagues');
      setLeagues(response.data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
      Alert.alert(
        t('error') || 'Error',
        t('errorLoadingLeagues') || 'Error loading leagues'
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Handle join/navigate action
  const handleLeagueAction = async (league: League) => {
    // If already in league, navigate to dashboard
    if (isUserInLeague(league)) {
      (navigation as any).navigate('LeagueDashboard', { id: league.id });
      return;
    }

    // If has pending petition, do nothing
    if (hasPendingPetition(league)) {
      return;
    }

    setProcessingLeagueId(league.id);

    try {
      if (league.is_private) {
        // Request to join private league
        const response = await apiClient.post(
          `/api/leagues/${league.id}/request-participant`,
          {
            userId: userData.userId,
            username: userData.username,
          }
        );
        setLeagues(response.data);
        Alert.alert(
          t('success') || 'Success',
          t('requestSent') || 'Request sent successfully'
        );
      } else {
        // Join public league directly
        await apiClient.put(`/api/leagues/${league.id}/join`, {
          leagueId: league.id,
          username: userData.username,
        });

        // Update local state
        setLeagues(prevLeagues =>
          prevLeagues.map(l =>
            l.id === league.id
              ? {
                  ...l,
                  participants: [
                    ...l.participants,
                    {
                      user_id: userData.userId,
                      username: userData.username,
                      role: 'user',
                    },
                  ],
                }
              : l
          )
        );

        Alert.alert(
          t('success') || 'Success',
          t('joinedLeague') || 'Successfully joined league'
        );
      }
    } catch (error) {
      console.error('Error joining league:', error);
      Alert.alert(
        t('error') || 'Error',
        t('errorJoiningLeague') || 'Error joining league'
      );
    } finally {
      setProcessingLeagueId(null);
    }
  };

  // Filter and sort leagues
  const displayLeagues = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = leagues.filter(league => {
      if (!query) return true;
      return league.league_name?.toLowerCase().includes(query);
    });

    // Sort: user's leagues first, then by participant count
    return filtered.sort((a, b) => {
      const aIn = isUserInLeague(a) ? 1 : 0;
      const bIn = isUserInLeague(b) ? 1 : 0;
      if (aIn !== bIn) return bIn - aIn;

      const aCount = a.participants?.length ?? 0;
      const bCount = b.participants?.length ?? 0;
      return bCount - aCount;
    });
  }, [leagues, searchQuery, isUserInLeague]);

  // Get button text for action
  const getButtonText = (league: League) => {
    if (isUserInLeague(league)) {
      return t('go') || 'Go';
    }
    if (hasPendingPetition(league)) {
      return t('pending') || 'Pending';
    }
    return t('join') || 'Join';
  };

  useEffect(() => {
    fetchLeagues();
  }, [fetchLeagues]);

  return (
    <Background>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchLeagues}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.container}>
          {/* Leagues Section */}
          <View style={styles.section}>
            <SectionHeader
              title={t('allLeagues') || 'All Leagues'}
              accentColor={colors.primary}
              titleColor="#fff"
            />

            <Card style={styles.sectionCard}>
              <Card.Content>
                {/* Search Bar */}
                <Searchbar
                  placeholder={t('searchLeagues') || 'Search leagues...'}
                  onChangeText={setSearchQuery}
                  value={searchQuery}
                  style={styles.searchBar}
                  inputStyle={styles.searchInput}
                  iconColor={colors.primary}
                  theme={{
                    colors: {
                      primary: colors.primary,
                    },
                    roundness: 8,
                  }}
                />

                {/* Leagues Table */}
                {loading && leagues.length === 0 ? (
                  <LoadingCard
                    message={t('loadingLeagues') || 'Loading leagues...'}
                    accentColor={colors.primary}
                  />
                ) : displayLeagues.length > 0 ? (
                  <View style={styles.tableContainer}>
                    <ScrollView
                      showsVerticalScrollIndicator={true}
                      nestedScrollEnabled={true}
                    >
                      <DataTable style={styles.table}>
                        <DataTable.Header style={tableStyles.header}>
                          <DataTable.Title style={styles.nameColumn}>
                            <Text style={tableStyles.headerText}>
                              {t('name') || 'Name'}
                            </Text>
                          </DataTable.Title>
                          <DataTable.Title style={styles.peopleColumn}>
                            <IconButton
                              icon="account-group"
                              size={16}
                              iconColor={colors.text}
                              style={styles.headerIcon}
                            />
                          </DataTable.Title>
                          <DataTable.Title style={styles.visibilityColumn}>
                            <IconButton
                              icon="lock"
                              size={16}
                              iconColor={colors.text}
                              style={styles.headerIcon}
                            />
                          </DataTable.Title>
                          <DataTable.Title style={styles.actionColumn}>
                            <IconButton
                              icon="dots-horizontal"
                              size={16}
                              iconColor={colors.text}
                              style={styles.headerIcon}
                            />
                          </DataTable.Title>
                        </DataTable.Header>

                        {displayLeagues.map(league => (
                          <DataTable.Row
                            key={league.id}
                            style={[
                              tableStyles.row,
                              isUserInLeague(league) && styles.userLeagueRow,
                            ]}
                          >
                            <DataTable.Cell style={styles.nameColumn}>
                              <Text
                                style={[
                                  tableStyles.cellText,
                                  styles.leagueName,
                                  isUserInLeague(league) &&
                                    tableStyles.currentUserText,
                                ]}
                                numberOfLines={2}
                              >
                                {league.league_name}
                              </Text>
                            </DataTable.Cell>
                            <DataTable.Cell style={styles.peopleColumn}>
                              <Text style={tableStyles.cellText}>
                                {league.participants?.length || 0}
                              </Text>
                            </DataTable.Cell>
                            <DataTable.Cell style={styles.visibilityColumn}>
                              <Text
                                style={[
                                  tableStyles.cellText,
                                  styles.visibilityText,
                                ]}
                              >
                                {league.is_private
                                  ? t('private') || 'Private'
                                  : t('public') || 'Public'}
                              </Text>
                            </DataTable.Cell>
                            <DataTable.Cell style={styles.actionColumn}>
                              <Button
                                mode="contained"
                                onPress={() => handleLeagueAction(league)}
                                disabled={hasPendingPetition(league)}
                                loading={processingLeagueId === league.id}
                                style={[
                                  styles.actionButton,
                                  {
                                    backgroundColor: isUserInLeague(league)
                                      ? colors.primary
                                      : hasPendingPetition(league)
                                        ? colors.textSecondary
                                        : colors.success,
                                  },
                                ]}
                                labelStyle={styles.actionButtonLabel}
                                compact
                              >
                                {getButtonText(league)}
                              </Button>
                            </DataTable.Cell>
                          </DataTable.Row>
                        ))}
                      </DataTable>
                    </ScrollView>
                    <View style={styles.tableBottom} />
                  </View>
                ) : (
                  <EmptyStateCard
                    icon="trophy-outline"
                    title={
                      searchQuery
                        ? t('noLeaguesFound') || 'No Leagues Found'
                        : t('noLeagues') || 'No Leagues'
                    }
                    description={
                      searchQuery
                        ? t('tryDifferentSearch') || 'Try a different search term'
                        : t('noLeaguesYet') || 'No leagues available yet'
                    }
                    accentColor={colors.primary}
                  />
                )}
              </Card.Content>
            </Card>
          </View>
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
    paddingHorizontal: 16,
    width: '100%',
  },
  section: {
    marginBottom: 32,
    width: '100%',
  },
  sectionCard: {
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  searchBar: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    fontSize: 14,
  },
  tableContainer: {
    width: '100%',
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  table: {
    minWidth: 270,
    backgroundColor: colors.white,
    width: '100%',
  },
  headerIcon: {
    margin: 0,
    padding: 0,
  },
  nameColumn: {
    flex: 2,
    justifyContent: 'flex-start',
  },
  peopleColumn: {
    width: 50,
    justifyContent: 'center',
  },
  visibilityColumn: {
    width: 70,
    justifyContent: 'center',
  },
  actionColumn: {
    width: 80,
    justifyContent: 'center',
  },
  leagueName: {
    fontWeight: '600',
  },
  visibilityText: {
    fontSize: 12,
  },
  userLeagueRow: {
    backgroundColor: colors.primary + '08',
  },
  actionButton: {
    minWidth: 60,
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
  },
  actionButtonLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  tableBottom: {
    height: 12,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});

export default LeaguesScreen;
