import React from 'react';
import { View, StyleSheet, Share } from 'react-native';
import { Text, Card, Button as PaperButton, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Background } from '../components';
import { colors } from '../styles/globalStyles';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';

dayjs.extend(customParseFormat);

type QuinipoloSuccessNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'QuinipoloSuccess'
>;

type QuinipoloSuccessRouteProp = RouteProp<
  HomeStackParamList,
  'QuinipoloSuccess'
>;

export default function QuinipoloSuccessScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<QuinipoloSuccessNavigationProp>();
  const route = useRoute<QuinipoloSuccessRouteProp>();

  const quinipolo = route.params?.quinipolo;
  const id = quinipolo?.id ?? '';
  const endDate = quinipolo?.end_date ?? '';
  const leagueName = quinipolo?.league_name ?? '';

  const formattedDeadline = endDate
    ? dayjs(endDate).format('DD/MM/YYYY HH:mm')
    : '';

  const shareMessage = `Quinipolo created! Join at quinipolo://join-league/${id}`;

  const handleShareMessage = async () => {
    try {
      await Share.share({
        message: shareMessage,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleReturnHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <Background>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            {/* Success Icon */}
            <View style={styles.iconContainer}>
              <IconButton
                icon="check-circle"
                size={72}
                iconColor={colors.success}
              />
            </View>

            {/* Title */}
            <Text style={styles.title}>
              {t('quinipoloCreatedSuccess') || 'Quinipolo created!'}
            </Text>

            {/* League name */}
            {leagueName ? (
              <Text style={styles.leagueText}>{leagueName}</Text>
            ) : null}

            {/* Deadline */}
            {formattedDeadline ? (
              <View style={styles.deadlineContainer}>
                <Text style={styles.deadlineLabel}>
                  {t('deadlineToAnswer') || 'Deadline to answer'}
                </Text>
                <Text style={styles.deadlineValue}>{formattedDeadline}</Text>
              </View>
            ) : null}

            {/* Share hint */}
            <Text style={styles.shareHint}>
              {t('shareQuinipoloWithFriends') ||
                'Share this quinipolo with your friends!'}
            </Text>

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
              <PaperButton
                mode="outlined"
                icon="content-copy"
                onPress={handleShareMessage}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                {t('copyMessage') || 'Copy message'}
              </PaperButton>

              <PaperButton
                mode="contained"
                icon="home"
                onPress={handleReturnHome}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                {t('returnToMainMenu') || 'Return to Home'}
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
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    elevation: 4,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  leagueText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  deadlineContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    width: '100%',
  },
  deadlineLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  deadlineValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  shareHint: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    borderRadius: 10,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
