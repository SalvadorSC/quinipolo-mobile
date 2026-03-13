import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { Background, Button, Input, ErrorMessage } from '../components';
import { useResetPassword } from '../hooks/auth';
import { globalStyles, colors } from '../styles/globalStyles';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = StackScreenProps<RootStackParamList, 'ResetPassword'>;

const ResetPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { resetPassword, loading, error, success, isValidLink } = useResetPassword();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setValidationError(null);

    if (!newPassword) {
      setValidationError(t('newPasswordRequired') || 'New password is required');
      return;
    }

    if (newPassword.length < 6) {
      setValidationError(t('passwordMinLength') || 'Password must be at least 6 characters');
      return;
    }

    if (!confirmPassword) {
      setValidationError(t('confirmPasswordRequired') || 'Please confirm your password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError(t('passwordsDoNotMatch') || 'Passwords do not match');
      return;
    }

    await resetPassword(newPassword);
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  // Loading state - checking if link is valid
  if (isValidLink === null) {
    return (
      <Background>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{t('loading') || 'Loading...'}</Text>
        </View>
      </Background>
    );
  }

  // Invalid link state
  if (isValidLink === false) {
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
                {t('invalidResetLink') || 'Invalid Reset Link'}
              </Text>
              <Text style={styles.message}>
                {t('invalidResetLinkMessage') || 'This password reset link is invalid or has expired. Please request a new one.'}
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
  }

  // Success state
  if (success) {
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
                {t('passwordResetSuccess') || 'Password Reset Successful'}
              </Text>
              <Text style={styles.message}>
                {t('passwordResetSuccessMessage') || 'Your password has been reset successfully. You can now log in with your new password.'}
              </Text>
              <Button
                title={t('goToLogin') || 'Go to Login'}
                onPress={handleBackToLogin}
                mode="contained"
                style={styles.button}
              />
            </Card.Content>
          </Card>
        </View>
      </Background>
    );
  }

  // Form state
  return (
    <Background>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[globalStyles.container, styles.container]}>
          <Card style={globalStyles.card}>
            <Card.Content style={globalStyles.cardContent}>
              <View style={globalStyles.header}>
                <IconButton
                  icon="lock-reset"
                  size={48}
                  iconColor={colors.primary}
                />
                <Text style={globalStyles.title}>
                  {t('resetPassword') || 'Reset Password'}
                </Text>
                <Text style={styles.subtitle}>
                  {t('enterNewPassword') || 'Please enter your new password below.'}
                </Text>
              </View>

              {(error || validationError) && (
                <ErrorMessage message={error || validationError || ''} />
              )}

              <Input
                label={t('newPassword') || 'New Password'}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                autoComplete="password"
                error={!!validationError && !newPassword}
              />

              <Input
                label={t('confirmNewPassword') || 'Confirm New Password'}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="password"
                error={!!validationError && newPassword !== confirmPassword}
              />

              <Button
                title={t('resetPassword') || 'Reset Password'}
                onPress={handleSubmit}
                mode="contained"
                loading={loading}
                disabled={loading}
                style={styles.button}
              />

              <Button
                title={t('backToLogin') || 'Back to Login'}
                onPress={handleBackToLogin}
                mode="text"
                style={styles.linkButton}
              />
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
  },
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
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
    marginBottom: 8,
  },
  linkButton: {
    marginTop: 4,
  },
});

export default ResetPasswordScreen;
