import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { Background, Button } from '../components';
import { useUser } from '../context/UserContext';
import { globalStyles, colors } from '../styles/globalStyles';
import apiClient from '../services/api';
import { LeaguesStackParamList } from '../navigation/LeaguesStackNavigator';

type Props = StackScreenProps<LeaguesStackParamList, 'JoinLeague'>;

interface JoinLeagueResult {
  leagueId: string;
  leagueName: string;
}

const JoinLeagueScreen: React.FC<Props> = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { userData } = useUser();
  const shareToken = route.params?.shareToken;

  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [leagueResult, setLeagueResult] = useState<JoinLeagueResult | null>(null);

  useEffect(() => {
    if (userData.isAuthenticated && shareToken) {
      joinLeague();
    }
  }, [userData.isAuthenticated, shareToken]);

  const joinLeague = async () => {
    if (!shareToken) return;

    setJoining(true);
    setJoinError(null);

    try {
      const response = await apiClient.post(`/api/leagues/join-by-link/${shareToken}`, {});
      setLeagueResult({
        leagueId: response.data.leagueId || response.data.id,
        leagueName: response.data.leagueName || response.data.name || '',
      });
      setJoined(true);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        setJoinError(t('invalidShareLink') || 'This invitation link is invalid.');
      } else if (status === 410) {
        setJoinError(t('shareLinkExpired') || 'This invitation link has expired.');
      } else if (status === 400) {
        setJoinError(t('alreadyInLeague') || 'You are already a member of this league.');
      } else {
        setJoinError(t('errorJoiningLeague') || 'An error occurred while joining the league. Please try again.');
      }
    } finally {
      setJoining(false);
    }
  };

  const handleGoToLeague = () => {
    if (leagueResult) {
      navigation.navigate('LeagueDashboard', { id: leagueResult.leagueId });
    }
  };

  const handleGoHome = () => {
    navigation.navigate('Leagues');
  };

  const handleLogin = () => {
    // Navigate up to root and then to Login
    navigation.getParent()?.getParent()?.navigate('Login' as never);
  };

  // Not authenticated
  if (!userData.isAuthenticated) {
    return (
      <Background>
        <View style={[globalStyles.container, styles.container]}>
          <Card style={globalStyles.card}>
            <Card.Content style={globalStyles.cardContent}>
              <View style={styles.iconContainer}>
                <IconButton
                  icon="account-lock"
                  size={64}
                  iconColor={colors.warning}
                />
              </View>
              <Text style={styles.title}>
                {t('joinLeague') || 'Join League'}
              </Text>
              <Text style={styles.message}>
                {t('pleaseLoginToJoinLeague') || 'Please log in to join this league.'}
              </Text>
              <Button
                title={t('login') || 'Login'}
                onPress={handleLogin}
                mode="contained"
                style={styles.button}
              />
            </Card.Content>
          </Card>
        </View>
      </Background>
    );
  }

  // No share token
  if (!shareToken) {
    return (
      <Background>
        <View style={[globalStyles.container, styles.container]}>
          <Card style={globalStyles.card}>
            <Card.Content style={globalStyles.cardContent}>
              <View style={styles.iconContainer}>
                <IconButton
                  icon="link-off"
                  size={64}
                  iconColor={colors.error}
                />
              </View>
              <Text style={styles.title}>
                {t('invalidShareLink') || 'Invalid Link'}
              </Text>
              <Button
                title={t('goHome') || 'Go Home'}
                onPress={handleGoHome}
                mode="contained"
                style={styles.button}
              />
            </Card.Content>
          </Card>
        </View>
      </Background>
    );
  }

  // Loading / joining
  if (joining) {
    return (
      <Background>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>
            {t('joiningLeague') || 'Joining league...'}
          </Text>
        </View>
      </Background>
    );
  }

  // Error state
  if (joinError) {
    return (
      <Background>
        <View style={[globalStyles.container, styles.container]}>
          <Card style={globalStyles.card}>
            <Card.Content style={globalStyles.cardContent}>
              <View style={styles.iconContainer}>
                <IconButton
                  icon="alert-circle"
                  size={64}
                  iconColor={colors.error}
                />
              </View>
              <Text style={styles.title}>
                {t('error') || 'Error'}
              </Text>
              <Text style={styles.message}>{joinError}</Text>
              <Button
                title={t('goHome') || 'Go Home'}
                onPress={handleGoHome}
                mode="contained"
                style={styles.button}
              />
            </Card.Content>
          </Card>
        </View>
      </Background>
    );
  }

  // Success state
  if (joined && leagueResult) {
    return (
      <Background>
        <View style={[globalStyles.container, styles.container]}>
          <Card style={globalStyles.card}>
            <Card.Content style={globalStyles.cardContent}>
              <View style={styles.iconContainer}>
                <IconButton
                  icon="check-circle"
                  size={64}
                  iconColor={colors.success}
                />
              </View>
              <Text style={styles.title}>
                {t('successfullyJoinedLeague') || 'Successfully Joined!'}
              </Text>
              {leagueResult.leagueName ? (
                <Text style={styles.leagueName}>{leagueResult.leagueName}</Text>
              ) : null}
              <Button
                title={t('goToLeague') || 'Go to League'}
                onPress={handleGoToLeague}
                mode="contained"
                style={styles.button}
              />
              <Button
                title={t('goHome') || 'Go Home'}
                onPress={handleGoHome}
                mode="text"
                style={styles.linkButton}
              />
            </Card.Content>
          </Card>
        </View>
      </Background>
    );
  }

  // Default / initial state before effect fires
  return (
    <Background>
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>
          {t('joiningLeague') || 'Joining league...'}
        </Text>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  leagueName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop: 8,
    marginBottom: 8,
  },
  linkButton: {
    marginTop: 4,
  },
});

export default JoinLeagueScreen;
