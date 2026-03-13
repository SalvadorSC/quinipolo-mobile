import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import {
  Text,
  Card,
  IconButton,
  Portal,
  Modal,
  Searchbar,
  Button,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import {
  Background,
  Leaderboard,
  PaginatedQuinipolosList,
  EmptyStateCard,
  LoadingCard,
  SectionHeader,
  ErrorBanner,
} from '../components';
import LeagueIconBadge from '../components/LeagueIconBadge';
import SegmentedButtonGroup from '../components/SegmentedButtonGroup';
import Stats from '../components/Stats';
import ActionRequests from '../components/ActionRequests';
import { useUser } from '../context/UserContext';
import {
  useLeagueDetails,
  useLeaderboard,
  useQuinipolos,
} from '../hooks/dashboard';
import { colors } from '../styles/globalStyles';
import { ProfileStackParamList } from '../navigation/ProfileStackNavigator';
import apiClient from '../services/api';

type LeagueDashboardRouteProp = RouteProp<
  ProfileStackParamList,
  'LeagueDashboard'
>;

type QuinipoloTabValue = 'pending' | 'previous' | 'all';
type LeaderboardTabValue = 'points' | 'statistics';

const LeagueDashboardScreen = () => {
  const { t } = useTranslation();
  const route = useRoute<LeagueDashboardRouteProp>();
  const navigation = useNavigation<any>();
  const { userData } = useUser();
  const leagueId = route.params?.id;

  const [quinipoloTab, setQuinipoloTab] =
    useState<QuinipoloTabValue>('pending');
  const [leaderboardTab, setLeaderboardTab] =
    useState<LeaderboardTabValue>('points');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [participantPetitions, setParticipantPetitions] = useState<any[]>([]);
  const [isProcessingPetition, setIsProcessingPetition] = useState(false);

  // Fetch league details
  const {
    leagueDetails,
    loading: leagueLoading,
    refetch: refetchLeague,
  } = useLeagueDetails({
    leagueId,
    autoFetch: true,
  });

  // Fetch participant petitions
  useEffect(() => {
    const fetchParticipantPetitions = async () => {
      if (!leagueId || !leagueDetails) return;
      try {
        const response = await apiClient.get(`/api/leagues/${leagueId}`);
        setParticipantPetitions(response.data.participantPetitions || []);
      } catch (error) {
        console.error('Error fetching participant petitions:', error);
      }
    };
    if (leagueDetails) {
      fetchParticipantPetitions();
    }
  }, [leagueId, leagueDetails]);

  // Fetch leaderboard
  const {
    leaderboard,
    loading: leaderboardLoading,
    error: leaderboardError,
    refetch: refetchLeaderboard,
  } = useLeaderboard({
    leagueId,
    autoFetch: true,
  });

  // Fetch league quinipolos
  const {
    quinipolos,
    loading: quinipolosLoading,
    refetch: refetchQuinipolos,
  } = useQuinipolos({
    leagueId,
    autoFetch: true,
  });

  const handleRefresh = async () => {
    await Promise.all([
      refetchLeague(),
      refetchLeaderboard(),
      refetchQuinipolos(),
    ]);
    // Refresh participant petitions
    if (leagueId) {
      try {
        const response = await apiClient.get(`/api/leagues/${leagueId}`);
        setParticipantPetitions(response.data.participantPetitions || []);
      } catch (error) {
        console.error('Error refreshing participant petitions:', error);
      }
    }
  };

  // Handle petition acceptance
  const handlePetitionAccept = async (petitionId: string) => {
    if (!leagueId) return;
    setIsProcessingPetition(true);
    try {
      const response = await apiClient.put(
        `/api/leagues/${leagueId}/participant-petitions/${petitionId}/accept`,
        {}
      );
      setParticipantPetitions(response.data.participantPetitions || []);
      // Refresh league data and leaderboard
      await Promise.all([refetchLeague(), refetchLeaderboard()]);
    } catch (error) {
      console.error('Error accepting petition:', error);
    } finally {
      setIsProcessingPetition(false);
    }
  };

  // Handle petition rejection
  const handlePetitionReject = async (petitionId: string) => {
    if (!leagueId) return;
    setIsProcessingPetition(true);
    try {
      const response = await apiClient.put(
        `/api/leagues/${leagueId}/participant-petitions/${petitionId}/reject`,
        {}
      );
      setParticipantPetitions(response.data.participantPetitions || []);
    } catch (error) {
      console.error('Error rejecting petition:', error);
    } finally {
      setIsProcessingPetition(false);
    }
  };

  const isLoading = leagueLoading || leaderboardLoading || quinipolosLoading;

  // Check if user is moderator in this league
  const isUserModerator = useMemo(() => {
    if (!leagueDetails) return false;
    const userParticipant = leagueDetails.participants.find(
      p => p.user_id === userData.userId || p.username === userData.username
    );
    return (
      userParticipant?.role?.toLowerCase() === 'moderator' ||
      userData.role === 'admin'
    );
  }, [leagueDetails, userData]);

  // Check if user is creator
  const isUserCreator = useMemo(() => {
    return leagueDetails?.created_by === userData.userId;
  }, [leagueDetails, userData]);

  // Filter quinipolos based on status tab
  const filteredQuinipolos = useMemo(() => {
    const now = new Date();
    const nonDeletedQuinipolos = quinipolos.filter(q => !q.is_deleted);

    switch (quinipoloTab) {
      case 'pending':
        return nonDeletedQuinipolos.filter(q => {
          const deadline = new Date(q.end_date);
          const notExpired = deadline.getTime() > now.getTime();
          const notAnswered =
            !q.answered &&
            !q.participants_who_answered?.includes(userData.username);
          return notExpired && notAnswered;
        });
      case 'previous':
        return nonDeletedQuinipolos.filter(q => {
          const deadline = new Date(q.end_date);
          const expired = deadline.getTime() <= now.getTime();
          const answered =
            q.answered ||
            q.participants_who_answered?.includes(userData.username);
          return expired || answered;
        });
      case 'all':
      default:
        return nonDeletedQuinipolos;
    }
  }, [quinipolos, quinipoloTab, userData.username]);

  // Filter leaderboard based on search
  const filteredLeaderboard = useMemo(() => {
    if (!searchQuery.trim()) return leaderboard;
    const query = searchQuery.toLowerCase();
    return leaderboard.filter(entry =>
      entry.username.toLowerCase().includes(query)
    );
  }, [leaderboard, searchQuery]);

  // Debug logging
  React.useEffect(() => {
    console.log('LeagueDashboard Debug:', {
      leagueId,
      leaderboardCount: leaderboard.length,
      leaderboardLoading,
      leaderboardError,
      quinipolosCount: quinipolos.length,
      filteredQuinipolosCount: filteredQuinipolos.length,
    });
  }, [
    leagueId,
    leaderboard,
    leaderboardLoading,
    leaderboardError,
    quinipolos,
    filteredQuinipolos,
  ]);

  const getIconColor = () => {
    return leagueDetails?.icon_style?.icon_color || colors.primary;
  };

  const getAccentColor = () => {
    return leagueDetails?.icon_style?.accent_color || colors.primary;
  };

  return (
    <Background>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.container}>
          {/* League Header Card with Gradient */}
          {leagueDetails && (
            <Card style={styles.headerCard}>
              <LinearGradient
                colors={[
                  getAccentColor() + '15',
                  getAccentColor() + '05',
                  '#FFFFFF',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
              >
                <Card.Content>
                  <View style={styles.header}>
                    <View style={styles.headerLeft}>
                      <View style={styles.iconContainer}>
                        <LeagueIconBadge
                          icon={leagueDetails.icon_style?.icon}
                          sizePx={56}
                          marginLeftPx={0}
                          accentColor={
                            leagueDetails.icon_style?.accent_color ||
                            colors.primary
                          }
                          iconColor={
                            leagueDetails.icon_style?.icon_color || '#ffffff'
                          }
                        />
                      </View>
                      <View style={styles.headerText}>
                        <Text style={styles.leagueName} numberOfLines={2}>
                          {leagueDetails.league_name}
                        </Text>
                        <View style={styles.participantRow}>
                          <IconButton
                            icon="account-group"
                            size={16}
                            iconColor={colors.textSecondary}
                            style={styles.participantIcon}
                          />
                          <Text style={styles.participantCount}>
                            {leagueDetails.participants.length}{' '}
                            {leagueDetails.participants.length === 1
                              ? t('participant') || 'participant'
                              : t('participants') || 'participants'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <IconButton
                      icon="information-outline"
                      size={26}
                      iconColor={getAccentColor()}
                      onPress={() => setShowInfoModal(true)}
                      style={styles.infoButton}
                    />
                  </View>
                  {/* {leagueDetails.description && (
                    <>
                      <Divider style={styles.headerDivider} />
                      <Text style={styles.description} numberOfLines={3}>
                        {leagueDetails.description}
                      </Text>
                    </>
                  )} */}
                </Card.Content>
              </LinearGradient>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && !leagueDetails ? (
            <LoadingCard
              message={t('loadingLeague') || 'Loading league details...'}
              accentColor={colors.primary}
            />
          ) : (
            <>
              {/* Quinipolos Section */}
              <View style={styles.section}>
                <SectionHeader
                  title={t('quinipolos') || 'Quinipolos'}
                  accentColor={getAccentColor()}
                />

                {/* Quinipolo Status Tabs */}
                <SegmentedButtonGroup
                  value={quinipoloTab}
                  onValueChange={value =>
                    setQuinipoloTab(value as QuinipoloTabValue)
                  }
                  buttons={[
                    {
                      value: 'pending',
                      label: t('pending') || 'Pending',
                      icon: 'clock-outline',
                    },
                    {
                      value: 'previous',
                      label: t('previous') || 'Previous',
                      icon: 'history',
                    },
                    {
                      value: 'all',
                      label: t('all') || 'All',
                      icon: 'view-list',
                    },
                  ]}
                  containerStyle={styles.secondarySegmentedButton}
                />

                {quinipolosLoading && filteredQuinipolos.length === 0 ? (
                  <LoadingCard
                    message={t('loadingQuinipolos') || 'Loading quinipolos...'}
                    accentColor={getAccentColor()}
                  />
                ) : filteredQuinipolos.length > 0 ? (
                  <PaginatedQuinipolosList
                    quinipolos={filteredQuinipolos}
                    username={userData.username}
                    itemsPerPage={2}
                  />
                ) : (
                  <EmptyStateCard
                    icon="clipboard-text-outline"
                    title={t('noQuinipolos') || 'No Quinipolos'}
                    description={
                      t('noQuinipolosInLeague') ||
                      'No quinipolos in this league yet'
                    }
                    accentColor={getAccentColor()}
                  />
                )}
              </View>

              {/* Leaderboard Section */}
              <View style={styles.section}>
                <SectionHeader
                  title={t('leaderboard') || 'Leaderboard'}
                  accentColor={getAccentColor()}
                />

                {/* Leaderboard Tabs */}
                <SegmentedButtonGroup
                  value={leaderboardTab}
                  onValueChange={value =>
                    setLeaderboardTab(value as LeaderboardTabValue)
                  }
                  buttons={[
                    {
                      value: 'points',
                      label: t('points') || 'Points',
                      icon: 'podium',
                    },
                    {
                      value: 'statistics',
                      label: t('stats') || 'Stats',
                      icon: 'chart-bar',
                    },
                  ]}
                  containerStyle={styles.secondarySegmentedButton}
                />

                {/* User Search */}
                <Searchbar
                  placeholder={t('searchUser') || 'Search user...'}
                  onChangeText={setSearchQuery}
                  value={searchQuery}
                  style={[
                    styles.searchBar,
                    {
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    },
                  ]}
                  inputStyle={styles.searchInput}
                  iconColor={getAccentColor()}
                  theme={{
                    colors: {
                      primary: getAccentColor(),
                    },
                    roundness: 0,
                  }}
                />

                {leaderboardError && <ErrorBanner message={leaderboardError} />}

                {leaderboardLoading && leaderboard.length === 0 ? (
                  <LoadingCard
                    message={
                      t('loadingLeaderboard') || 'Loading leaderboard...'
                    }
                    accentColor={getAccentColor()}
                  />
                ) : leaderboardTab === 'points' ? (
                  filteredLeaderboard.length > 0 ? (
                    <Leaderboard
                      data={filteredLeaderboard}
                      currentUsername={userData.username}
                    />
                  ) : (
                    <EmptyStateCard
                      icon="podium-outline"
                      title={
                        searchQuery
                          ? t('noUsersFound') || 'No Users Found'
                          : t('noLeaderboard') || 'No Leaderboard Yet'
                      }
                      description={
                        searchQuery
                          ? t('tryDifferentSearch') ||
                            'Try a different search term'
                          : t('noLeaderboardData') ||
                            'Start answering quinipolos to see rankings'
                      }
                      accentColor={getAccentColor()}
                    />
                  )
                ) : filteredLeaderboard.length > 0 ? (
                  <Stats
                    data={filteredLeaderboard}
                    currentUsername={userData.username}
                  />
                ) : (
                  <EmptyStateCard
                    icon="chart-bar"
                    title={
                      searchQuery
                        ? t('noUsersFound') || 'No Users Found'
                        : t('noStats') || 'No Statistics Yet'
                    }
                    description={
                      searchQuery
                        ? t('tryDifferentSearch') ||
                          'Try a different search term'
                        : t('noStatsData') ||
                          'Statistics will appear as players participate'
                    }
                    accentColor={getAccentColor()}
                  />
                )}
              </View>

              {/* Actions Section (Moderator Only) */}
              {isUserModerator && (
                <View style={styles.actionsSection}>
                  <SectionHeader
                    title={t('actions') || 'Actions'}
                    accentColor={getAccentColor()}
                  />

                  {/* Action Requests */}
                  {leagueDetails && (
                    <ActionRequests
                      leagueId={leagueId!}
                      leagueData={leagueDetails}
                      participantPetitions={participantPetitions}
                      onPetitionAccept={handlePetitionAccept}
                      onPetitionReject={handlePetitionReject}
                    />
                  )}

                  {/* Create Quinipolo Button */}
                  <Card style={styles.actionsCard}>
                    <Card.Content>
                      <Button
                        mode="contained"
                        icon="plus-circle"
                        onPress={() => {
                          navigation.navigate('CreateQuinipolo', {
                            leagueId,
                            leagueName: leagueDetails?.league_name,
                          });
                        }}
                        style={[
                          styles.createButton,
                          { backgroundColor: getAccentColor() },
                        ]}
                        contentStyle={styles.createButtonContent}
                        labelStyle={styles.createButtonLabel}
                      >
                        {t('createQuinipolo') || 'Create Quinipolo'}
                      </Button>
                      <Text style={styles.createButtonHint}>
                        {t('createQuinipoloHint') ||
                          'Create a new quinipolo for this league'}
                      </Text>
                    </Card.Content>
                  </Card>

                  {/* Correct Results Button */}
                  {(() => {
                    const now = new Date();
                    const uncorrected = quinipolos.find(
                      q =>
                        !q.is_deleted &&
                        !q.has_been_corrected &&
                        new Date(q.end_date).getTime() <= now.getTime()
                    );
                    if (!uncorrected) return null;
                    return (
                      <Card style={styles.actionsCard}>
                        <Card.Content>
                          <Button
                            mode="outlined"
                            icon="pencil-check"
                            onPress={() => {
                              navigation.navigate('AnswerQuinipolo', {
                                quinipoloId: uncorrected.id,
                                mode: 'correct',
                              });
                            }}
                            style={styles.createButton}
                            contentStyle={styles.createButtonContent}
                            labelStyle={styles.createButtonLabel}
                          >
                            {t('correctResults') || 'Correct Results'}
                          </Button>
                          <Text style={styles.createButtonHint}>
                            {t('correctResultsHint') ||
                              'Enter the correct results for the latest expired quinipolo'}
                          </Text>
                        </Card.Content>
                      </Card>
                    );
                  })()}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Info Modal */}
      <Portal>
        <Modal
          visible={showInfoModal}
          onDismiss={() => setShowInfoModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card style={styles.modalCard}>
            <LinearGradient
              colors={[
                getAccentColor() + '20',
                getAccentColor() + '05',
                '#FFFFFF',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.modalGradient}
            >
              <Card.Content>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <LeagueIconBadge
                      icon={leagueDetails?.icon_style?.icon}
                      sizePx={40}
                      marginLeftPx={0}
                      accentColor={
                        leagueDetails?.icon_style?.accent_color ||
                        colors.primary
                      }
                      iconColor={
                        leagueDetails?.icon_style?.icon_color || '#ffffff'
                      }
                    />
                    <Text style={styles.modalTitle}>
                      {leagueDetails?.league_name ||
                        t('leagueInfo') ||
                        'League Info'}
                    </Text>
                  </View>
                  <IconButton
                    icon="close"
                    size={24}
                    iconColor={colors.text}
                    onPress={() => setShowInfoModal(false)}
                    style={styles.modalCloseButton}
                  />
                </View>

                {leagueDetails && (
                  <View style={styles.modalBody}>
                    {leagueDetails.description && (
                      <View style={styles.modalSection}>
                        <View style={styles.modalSectionHeader}>
                          <IconButton
                            icon="text"
                            size={16}
                            iconColor={getAccentColor()}
                            style={styles.modalSectionIcon}
                          />
                          <Text style={styles.modalSectionTitle}>
                            {t('description') || 'Description'}
                          </Text>
                        </View>
                        <Text style={styles.modalSectionContent}>
                          {leagueDetails.description}
                        </Text>
                      </View>
                    )}

                    <View style={styles.modalSection}>
                      <View style={styles.modalSectionHeader}>
                        <IconButton
                          icon="account-group"
                          size={16}
                          iconColor={getAccentColor()}
                          style={styles.modalSectionIcon}
                        />
                        <Text style={styles.modalSectionTitle}>
                          {t('participants') || 'Participants'}
                        </Text>
                      </View>
                      <Text style={styles.modalSectionContent}>
                        {leagueDetails.participants.length}{' '}
                        {t('members') || 'members'}
                      </Text>
                    </View>

                    {leagueDetails.created_at && (
                      <View style={styles.modalSection}>
                        <View style={styles.modalSectionHeader}>
                          <IconButton
                            icon="calendar"
                            size={16}
                            iconColor={getAccentColor()}
                            style={styles.modalSectionIcon}
                          />
                          <Text style={styles.modalSectionTitle}>
                            {t('createdAt') || 'Created'}
                          </Text>
                        </View>
                        <Text style={styles.modalSectionContent}>
                          {new Date(
                            leagueDetails.created_at
                          ).toLocaleDateString()}
                        </Text>
                      </View>
                    )}

                    {leagueDetails.isPrivate !== undefined && (
                      <View style={styles.modalSection}>
                        <View style={styles.modalSectionHeader}>
                          <IconButton
                            icon={leagueDetails.isPrivate ? 'lock' : 'earth'}
                            size={16}
                            iconColor={getAccentColor()}
                            style={styles.modalSectionIcon}
                          />
                          <Text style={styles.modalSectionTitle}>
                            {t('visibility') || 'Visibility'}
                          </Text>
                        </View>
                        <Text style={styles.modalSectionContent}>
                          {leagueDetails.isPrivate
                            ? t('private') || 'Private'
                            : t('public') || 'Public'}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </Card.Content>
            </LinearGradient>
          </Card>
        </Modal>
      </Portal>
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
  headerCard: {
    marginBottom: 24,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  headerGradient: {
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  iconContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  infoButton: {
    margin: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  leagueName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.3,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
  },
  participantIcon: {
    margin: 0,
    padding: 0,
  },
  participantCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  headerDivider: {
    marginVertical: 12,
    backgroundColor: colors.border,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    opacity: 0.8,
  },
  secondarySegmentedButton: {
    marginBottom: 16,
    marginTop: 8,
  },
  searchBar: {
    marginTop: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    elevation: 1,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  searchInput: {
    fontSize: 14,
  },
  tabContent: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
    width: '100%',
  },
  quinipolosList: {
    marginTop: 8,
  },
  actionsSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  actionsCard: {
    borderRadius: 16,
    elevation: 2,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  actionsDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  createButton: {
    borderRadius: 12,
    marginTop: 8,
    elevation: 0,
  },
  createButtonContent: {
    paddingVertical: 10,
  },
  createButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  createButtonHint: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
  },
  modalContainer: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalCard: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  modalGradient: {
    borderRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '40',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    flex: 1,
    letterSpacing: 0.3,
  },
  modalCloseButton: {
    margin: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  modalBody: {
    paddingTop: 8,
    gap: 24,
  },
  modalSection: {
    gap: 8,
  },
  modalSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modalSectionIcon: {
    margin: 0,
    padding: 0,
  },
  modalSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modalSectionContent: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    fontWeight: '500',
    paddingLeft: 28,
  },
});

export default LeagueDashboardScreen;
