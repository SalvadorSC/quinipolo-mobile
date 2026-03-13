import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Background } from '../components';
import { globalStyles, colors } from '../styles/globalStyles';

const PrivacyScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[globalStyles.container, styles.container]}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Text style={styles.screenTitle}>
                {t('privacyPolicy') || 'Privacy Policy'}
              </Text>

              <Divider style={styles.divider} />

              <Text style={styles.body}>
                {t('privacyText') ||
                  `Your privacy is important to us. This policy explains how Quinipolo collects, uses, and protects your information.\n\n` +
                  `1. INFORMATION WE COLLECT\nWe collect information you provide when registering (email, username, date of birth) and usage data generated while using the app.\n\n` +
                  `2. HOW WE USE YOUR INFORMATION\nWe use your information to provide and improve the service, send notifications, and communicate with you about your account.\n\n` +
                  `3. INFORMATION SHARING\nWe do not sell or share your personal information with third parties, except as necessary to provide the service or as required by law.\n\n` +
                  `4. DATA SECURITY\nWe implement appropriate security measures to protect your personal information against unauthorized access or disclosure.\n\n` +
                  `5. DATA RETENTION\nWe retain your data for as long as your account is active or as needed to provide services. You may request deletion of your account data at any time.\n\n` +
                  `6. COOKIES AND TRACKING\nThe app may use local storage and similar technologies to improve your experience and maintain your session.\n\n` +
                  `7. CHILDREN'S PRIVACY\nQuinipolo is not intended for users under 18 years of age. We do not knowingly collect personal information from minors.\n\n` +
                  `8. CHANGES TO THIS POLICY\nWe may update this privacy policy from time to time. We will notify you of significant changes.\n\n` +
                  `9. CONTACT US\nIf you have questions about this privacy policy, please contact us through the app.`
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

export default PrivacyScreen;
