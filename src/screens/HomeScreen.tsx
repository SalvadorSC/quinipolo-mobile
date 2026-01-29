import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import {
  Background,
  PaginatedQuinipolosList,
  LeagueCard,
  SegmentedButtonGroup,
  LoadingCard,
  EmptyStateCard,
  SectionHeader,
} from '../components';
import { useUser } from '../context/UserContext';
import { useQuinipolos, useLeagues } from '../hooks/dashboard';
import { globalStyles, colors } from '../styles/globalStyles';

// Debug flag - set to true to see debug information
const DEBUG_MODE = false;

type TabValue = 'pending' | 'previous' | 'all';

const HomeScreen = () => {
  const { t } = useTranslation();
  const { userData } = useUser();
  const [activeTab, setActiveTab] = useState<TabValue>('pending');
  const navigation = useNavigation();

  // Fetch user's quinipolos
  const { quinipolos, loading, refetch } = useQuinipolos({
    userId: userData.userId,
    autoFetch: userData.isAuthenticated,
  });

  // userData.leagues is already an array of league ID strings
  const leagueIds = React.useMemo(() => {
    if (!userData.leagues || !Array.isArray(userData.leagues)) {
      return [];
    }
    return userData.leagues.filter(
      id => typeof id === 'string' && id.trim() !== ''
    );
  }, [userData.leagues]);

  // Fetch league details
  const { leagues, loading: leaguesLoading } = useLeagues({
    leagueIds,
    autoFetch: userData.isAuthenticated && leagueIds.length > 0,
  });

  const filterQuinipolos = (tab: TabValue) => {
    const now = new Date();

    switch (tab) {
      case 'pending':
        // Not answered and not expired
        return quinipolos.filter(q => {
          const deadline = new Date(q.end_date);
          const notExpired = deadline.getTime() > now.getTime();
          const notAnswered =
            !q.answered &&
            !q.participants_who_answered?.includes(userData.username);
          return notExpired && notAnswered && !q.is_deleted;
        });

      case 'previous':
        // Either answered or expired
        return quinipolos.filter(q => {
          const deadline = new Date(q.end_date);
          const expired = deadline.getTime() <= now.getTime();
          const answered =
            q.answered ||
            q.participants_who_answered?.includes(userData.username);
          return (expired || answered) && !q.is_deleted;
        });

      case 'all':
      default:
        return quinipolos.filter(q => !q.is_deleted);
    }
  };

  const filteredQuinipolos = filterQuinipolos(activeTab);

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'pending':
        return t('noPendingQuinipolos') || 'No pending quinipolos';
      case 'previous':
        return t('noPreviousQuinipolos') || 'No previous quinipolos';
      case 'all':
      default:
        return t('noQuinipolos') || 'No quinipolos found';
    }
  };

  return (
    <Background>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            colors={[colors.primary]}
          />
        }
      >
        <View style={[globalStyles.container, styles.container]}>
          {/* Header Card with Gradient */}
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
                    <View style={styles.iconContainer}>
                      <IconButton
                        icon="home"
                        size={32}
                        iconColor={colors.primary}
                        style={styles.iconButton}
                      />
                    </View>
                    <View style={styles.headerText}>
                      <Text style={styles.welcomeText}>
                        {t('welcome') || 'Welcome!'}
                      </Text>
                      <Text style={styles.usernameText}>
                        {userData.username || userData.emailAddress}
                      </Text>
                    </View>
                  </View>
                </View>
              </Card.Content>
            </LinearGradient>
          </Card>

          {/* Quinipolos Section */}
          <View style={styles.section}>
            <SectionHeader
              title={t('quinipolos') || 'Quinipolos'}
              accentColor={colors.primary}
            />

            {/* Debug Info */}
            {DEBUG_MODE && (
              <Text style={{ fontSize: 10, color: 'red', marginBottom: 8 }}>
                DEBUG: Username={userData.username}
                {'\n'}Total={quinipolos.length}, Filtered=
                {filteredQuinipolos.length}, Tab={activeTab}
                {quinipolos.length > 0 &&
                  (() => {
                    const now = new Date();

                    // Show ALL quinipolos status
                    const statusSummary = quinipolos
                      .slice(0, 3)
                      .map((q, i) => {
                        const deadline = new Date(q.end_date);
                        const isExpired = deadline.getTime() <= now.getTime();
                        const isAnswered =
                          q.answered ||
                          q.participants_who_answered?.includes(
                            userData.username
                          );
                        const isDeleted = q.is_deleted;
                        return `\n[${i + 1}] ${q.league_name?.substring(0, 15) || 'Unknown'}
  Deadline: ${deadline.toLocaleString()}
  Expired: ${isExpired}, Answered: ${isAnswered}, Deleted: ${isDeleted}
  Participants: ${q.participants_who_answered?.join(', ') || 'none'}
  Show in ${activeTab}: ${
    activeTab === 'pending'
      ? !isExpired && !isAnswered && !isDeleted
      : activeTab === 'previous'
        ? (isExpired || isAnswered) && !isDeleted
        : !isDeleted
  }`;
                      })
                      .join('');

                    return `\nNow: ${now.toLocaleString()}${statusSummary}`;
                  })()}
              </Text>
            )}

            {/* Tabs */}
            <SegmentedButtonGroup
              value={activeTab}
              onValueChange={(value: string) => setActiveTab(value as TabValue)}
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
              containerStyle={styles.segmentedButton}
            />

            {/* Quinipolos List */}
            {loading && quinipolos.length === 0 ? (
              <LoadingCard
                message={t('loadingQuinipolos') || 'Loading quinipolos...'}
                accentColor={colors.primary}
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
                description={getEmptyMessage()}
                accentColor={colors.primary}
              />
            )}
          </View>

          {/* My Leagues Section */}
          <View style={styles.section}>
            <SectionHeader
              title={t('myLeagues') || 'My Leagues'}
              accentColor={colors.primary}
            />

            {leaguesLoading && leagues.length === 0 ? (
              <LoadingCard
                message={t('loadingLeagues') || 'Loading leagues...'}
                accentColor={colors.primary}
              />
            ) : leagues.length > 0 ? (
              <View style={styles.leaguesList}>
                {leagues.slice(0, 3).map(league => (
                  <LeagueCard key={league.leagueId} league={league} />
                ))}
                {leagues.length > 3 && (
                  <Text
                    style={styles.viewAllText}
                    onPress={() => (navigation as any).navigate('Leagues')}
                  >
                    {t('viewAll') || 'View all'} ({leagues.length})
                  </Text>
                )}
              </View>
            ) : (
              <EmptyStateCard
                icon="trophy-outline"
                title={t('noLeagues') || 'No Leagues'}
                description={
                  t('noLeaguesDescription') ||
                  "You're not part of any leagues yet"
                }
                accentColor={colors.primary}
              />
            )}
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
  iconButton: {
    margin: 0,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.3,
  },
  usernameText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
    width: '100%',
  },
  segmentedButton: {
    marginBottom: 16,
    marginTop: 8,
  },
  leaguesList: {
    marginTop: 8,
    gap: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
});

export default HomeScreen;
