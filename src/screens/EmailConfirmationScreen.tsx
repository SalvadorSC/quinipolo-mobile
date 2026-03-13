import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { Background, Button } from '../components';
import { globalStyles, colors } from '../styles/globalStyles';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'EmailConfirmation'>;

const EmailConfirmationScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <Background>
      <View style={[globalStyles.container, styles.container]}>
        <Card style={globalStyles.card}>
          <Card.Content style={globalStyles.cardContent}>
            <View style={styles.iconContainer}>
              <IconButton
                icon="email-check"
                size={64}
                iconColor={colors.primary}
              />
            </View>

            <Text style={styles.title}>
              {t('checkYourEmail') || 'Check Your Email'}
            </Text>

            <Text style={styles.body}>
              {t('emailConfirmationSent') || 'A confirmation email has been sent to your email address.'}
            </Text>

            <View style={styles.noteContainer}>
              <Text style={styles.note}>
                {t('emailConfirmationNote') || 'Please check your inbox and click the confirmation link to activate your account.'}
              </Text>
            </View>

            <Text style={styles.help}>
              {t('emailConfirmationHelp') || "If you don't see the email, check your spam folder or try signing up again."}
            </Text>

            <Button
              title={t('backToLogin') || 'Back to Login'}
              onPress={handleBackToLogin}
              mode="contained"
              style={styles.button}
            />
          </Card.Content>
        </Card>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
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
    marginBottom: 16,
  },
  body: {
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  noteContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  note: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 20,
  },
  help: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  button: {
    marginTop: 8,
  },
});

export default EmailConfirmationScreen;
