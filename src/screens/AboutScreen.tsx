import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Background } from '../components';
import { globalStyles, colors } from '../styles/globalStyles';

const AboutScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[globalStyles.container, styles.container]}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.screenTitle}>
                {t('about') || 'About Quinipolo'}
              </Text>

              <Divider style={styles.divider} />

              <View style={styles.section}>
                <Text style={styles.body}>
                  {t('aboutIntro') || 'Quinipolo is a sports prediction app that lets you create and join leagues with friends, predict match outcomes, and compete for the top spot on the leaderboard.'}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {t('howItWorks') || 'How It Works'}
                </Text>
                <Text style={styles.body}>
                  {t('howItWorksDescription') || 'Create a quinipolo (prediction sheet) for an upcoming round of matches. Select your predicted winner for each game, then submit before the deadline. Points are awarded for correct predictions, and the leaderboard updates after each round.'}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {t('disclaimer') || 'Disclaimer'}
                </Text>
                <Text style={styles.body}>
                  {t('disclaimerText') || 'Quinipolo is a free-to-play prediction game for entertainment purposes only. No real money is involved. Match data is provided for informational purposes and may be subject to change.'}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 40,
  },
  container: {
    paddingVertical: 20,
  },
  card: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  cardContent: {
    padding: 24,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});

export default AboutScreen;
