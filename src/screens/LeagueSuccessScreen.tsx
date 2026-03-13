import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button as PaperButton, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Background } from '../components';
import { colors } from '../styles/globalStyles';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';

type LeagueSuccessRouteProp = RouteProp<HomeStackParamList, 'LeagueSuccess'>;
type LeagueSuccessNavigationProp = StackNavigationProp<HomeStackParamList, 'LeagueSuccess'>;

export default function LeagueSuccessScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<LeagueSuccessNavigationProp>();
  const route = useRoute<LeagueSuccessRouteProp>();

  const league = route.params?.league;
  const leagueId = league?.id ?? '';
  const leagueName = league?.league_name ?? '';
  const tier = league?.tier;

  return (
    <Background>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              {/* Success Icon */}
              <View style={styles.iconContainer}>
                <IconButton
                  icon="check-circle"
                  size={64}
                  iconColor={colors.success}
                />
              </View>

              {/* Title */}
              <Text style={styles.title}>
                {t('leagueCreatedSuccess') || 'League Created!'}
              </Text>

              {/* League name */}
              {leagueName ? (
                <Text style={styles.leagueName}>{leagueName}</Text>
              ) : null}

              {/* Tier badge */}
              {tier ? (
                <View style={styles.tierBadge}>
                  <Text style={styles.tierBadgeText}>{tier}</Text>
                </View>
              ) : null}

              {/* Buttons */}
              <View style={styles.buttonsContainer}>
                <PaperButton
                  mode="contained"
                  icon="trophy"
                  onPress={() =>
                    navigation.navigate('LeagueDashboard', { id: leagueId })
                  }
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  {t('goToLeague') || 'Go to League'}
                </PaperButton>

                <PaperButton
                  mode="outlined"
                  icon="home"
                  onPress={() =>
                    navigation.getParent()?.navigate('Home' as any)
                  }
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                >
                  {t('goHome') || 'Go Home'}
                </PaperButton>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    elevation: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  leagueName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  tierBadge: {
    backgroundColor: colors.primary + '20',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 24,
  },
  tierBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  button: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
