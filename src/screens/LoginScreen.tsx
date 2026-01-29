import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Portal, Modal, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Input, Button, ErrorMessage, Background } from '../components';
import { useLogin, usePasswordReset } from '../hooks/auth';
import { useUser } from '../context/UserContext';
import { globalStyles, colors } from '../styles/globalStyles';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { userData } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    login,
    loginWithGoogle,
    loading: loginLoading,
    error: loginError,
  } = useLogin();

  const {
    requestPasswordReset,
    loading: resetLoading,
    showSuccessModal,
    closeSuccessModal,
    cooldownTimer,
    formatCooldownTime,
    canSendReset,
  } = usePasswordReset();

  // Navigate to home when authenticated
  useEffect(() => {
    if (userData.isAuthenticated && userData.authInitialized) {
      // UserContext handles auth state, navigation will happen automatically
      // via the AppNavigator's auth gate
    }
  }, [userData.isAuthenticated, userData.authInitialized]);

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }

    const result = await login({ email, password });

    // Navigation will happen automatically via UserContext auth state change
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    // Navigation will happen automatically via UserContext auth state change
  };

  const handleForgotPassword = async () => {
    if (!email) {
      return;
    }

    await requestPasswordReset(email);
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp' as never);
  };

  const loading = loginLoading || resetLoading;
  const error = loginError;

  return (
    <Background>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[globalStyles.container, styles.container]}>
            <View style={[globalStyles.card, globalStyles.cardContent]}>
              <View style={globalStyles.header}>
                <IconButton
                  icon="emoticon-happy"
                  size={36}
                  iconColor={colors.primary}
                />
                <Text style={globalStyles.title}>{t('signIn')} 🎉</Text>
              </View>

              {error && <ErrorMessage message={error} />}

              <Input
                label={t('email')}
                value={email}
                onChangeText={setEmail}
                placeholder={t('email')}
                keyboardType="email-address"
                autoComplete="email"
                disabled={loading}
                left={<IconButton icon="email" size={20} iconColor={colors.primary} />}
              />

              <Input
                label={t('password')}
                value={password}
                onChangeText={setPassword}
                placeholder={t('password')}
                secureTextEntry={!showPassword}
                autoComplete="password"
                disabled={loading}
                left={<IconButton icon="lock" size={20} iconColor={colors.primary} />}
                right={
                  <IconButton
                    icon={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <Button
                title={t('signIn')}
                onPress={handleLogin}
                loading={loginLoading}
                disabled={loading || !email || !password}
                style={globalStyles.primaryButton}
              />

              <Button
                title={`${t('signIn')} Google`}
                onPress={handleGoogleLogin}
                loading={false}
                disabled={loading}
                mode="outlined"
                icon="google"
                style={globalStyles.googleButton}
                color={colors.white}
                textColor={colors.secondary}
              />

              <View style={globalStyles.linksContainer}>
                <Button
                  title={t('noAccountSignUpHere') || 'No account? Sign up here.'}
                  onPress={navigateToSignUp}
                  mode="text"
                  disabled={loading}
                  style={globalStyles.linkButton}
                  textColor={colors.primary}
                />

                <Button
                  title={
                    !canSendReset
                      ? `${t('forgotPassword')} (${formatCooldownTime()})`
                      : t('forgotPassword')
                  }
                  onPress={handleForgotPassword}
                  mode="text"
                  disabled={!canSendReset || !email || resetLoading}
                  loading={resetLoading}
                  style={globalStyles.linkButton}
                  textColor={colors.textSecondary}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Password Reset Success Modal */}
      <Portal>
        <Modal
          visible={showSuccessModal}
          onDismiss={closeSuccessModal}
          contentContainerStyle={globalStyles.modalContainer}
        >
          <Text style={globalStyles.modalTitle}>
            {t('passwordResetEmailSent') || 'Password Reset Email Sent'}
          </Text>
          <Text style={globalStyles.modalText}>
            {t('passwordResetEmailSentMessage') ||
              'A password reset email has been sent to your email address.'}
          </Text>
          <Text style={globalStyles.modalText}>
            {t('checkYourInbox') ||
              'Please check your inbox and follow the instructions to reset your password.'}
          </Text>
          <Text style={globalStyles.modalWarning}>
            {t('cooldownMessage') ||
              "You won't be able to send another password reset email for 2 minutes."}
          </Text>
          <Button
            title={t('ok') || 'OK'}
            onPress={closeSuccessModal}
            style={globalStyles.modalButton}
          />
        </Modal>
      </Portal>
    </Background>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    paddingVertical: 40,
  },
});

export default LoginScreen;
