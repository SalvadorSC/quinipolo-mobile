import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Background } from '../components';
import { globalStyles, colors } from '../styles/globalStyles';

const TermsScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[globalStyles.container, styles.container]}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.screenTitle}>
                {t('termsOfService') || 'Terms of Service'}
              </Text>

              <Divider style={styles.divider} />

              <Text style={styles.body}>
                {t('termsText') ||
                  `By using Quinipolo, you agree to the following terms and conditions.\n\n` +
                  `1. USE OF SERVICE\nQuinipolo is provided for personal, non-commercial entertainment use only. You agree not to misuse the service or help anyone else do so.\n\n` +
                  `2. ACCOUNT RESPONSIBILITY\nYou are responsible for maintaining the security of your account credentials. Notify us immediately of any unauthorized use.\n\n` +
                  `3. ACCEPTABLE USE\nYou agree not to use Quinipolo to harass others, spread misinformation, or engage in any activity that violates applicable laws.\n\n` +
                  `4. CONTENT\nYou retain ownership of any content you submit. By submitting content, you grant Quinipolo a license to use it within the service.\n\n` +
                  `5. MODIFICATIONS\nWe reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of any changes.\n\n` +
                  `6. TERMINATION\nWe reserve the right to suspend or terminate accounts that violate these terms.\n\n` +
                  `7. DISCLAIMER OF WARRANTIES\nThe service is provided "as is" without warranties of any kind, either express or implied.\n\n` +
                  `8. LIMITATION OF LIABILITY\nQuinipolo shall not be liable for any indirect, incidental, or consequential damages arising from use of the service.`
                }
              </Text>
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
  body: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});

export default TermsScreen;
