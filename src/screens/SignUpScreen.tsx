import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Input, Button, ErrorMessage, Background } from '../components';
import { useSignup } from '../hooks/auth';
import { useUser } from '../context/UserContext';
import { globalStyles, colors } from '../styles/globalStyles';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { userData } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const { signup, loading, error } = useSignup();

  // Navigate when authenticated
  useEffect(() => {
    if (userData.isAuthenticated && userData.authInitialized) {
      // Navigation will happen automatically via AppNavigator's auth gate
    }
  }, [userData.isAuthenticated, userData.authInitialized]);

  // Check password match
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  }, [password, confirmPassword]);

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !username || !fullName || !birthday) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    const age = calculateAge(birthday);
    if (age < 18) {
      return;
    }

    const result = await signup({
      email,
      password,
      username,
      fullName,
      birthday,
      isUserOver18: age >= 18,
    });

    if (result.success && result.needsEmailConfirmation) {
      // Navigate to email confirmation screen (you can create this later)
      // For now, just show a success message
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login' as never);
  };

  const isFormValid = () => {
    if (!email || !password || !confirmPassword || !username || !fullName || !birthday) {
      return false;
    }
    if (password !== confirmPassword) {
      return false;
    }
    if (username.length < 3 || username.length > 15) {
      return false;
    }
    if (username.toLowerCase().includes('quinipolo')) {
      return false;
    }
    const age = calculateAge(birthday);
    if (age < 18) {
      return false;
    }
    return true;
  };

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
                <Text style={globalStyles.title}>{t('signUp')} 🎉</Text>
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
                label={t('username')}
                value={username}
                onChangeText={setUsername}
                placeholder={t('username')}
                autoComplete="username"
                disabled={loading}
                error={username.length > 0 && (username.length < 3 || username.length > 15 || username.toLowerCase().includes('quinipolo'))}
                left={<IconButton icon="account" size={20} iconColor={colors.primary} />}
              />

              <Input
                label={t('fullName')}
                value={fullName}
                onChangeText={setFullName}
                placeholder={t('fullName')}
                autoComplete="name"
                disabled={loading}
                left={<IconButton icon="card-account-details" size={20} iconColor={colors.primary} />}
              />

              <Input
                label={t('birthday') || 'Birthday (YYYY-MM-DD)'}
                value={birthday}
                onChangeText={setBirthday}
                placeholder="YYYY-MM-DD"
                disabled={loading}
                error={birthday.length > 0 && calculateAge(birthday) < 18}
                left={<IconButton icon="calendar" size={20} iconColor={colors.primary} />}
              />

              <Input
                label={t('password')}
                value={password}
                onChangeText={setPassword}
                placeholder={t('password')}
                secureTextEntry={!showPassword}
                autoComplete="password"
                disabled={loading}
                error={password.length > 0 && password.length < 6}
                left={<IconButton icon="lock" size={20} iconColor={colors.primary} />}
                right={
                  <IconButton
                    icon={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <Input
                label={t('confirmPassword') || 'Confirm Password'}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={t('confirmPassword') || 'Confirm Password'}
                secureTextEntry={!showConfirmPassword}
                autoComplete="password"
                disabled={loading}
                error={passwordMismatch}
                left={<IconButton icon="lock" size={20} iconColor={colors.primary} />}
                right={
                  <IconButton
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
              />

              {passwordMismatch && (
                <Text style={styles.errorHint}>
                  {t('passwordsDoNotMatch') || 'Passwords do not match'}
                </Text>
              )}

              {username.length > 0 && username.length < 3 && (
                <Text style={styles.errorHint}>
                  Username must be at least 3 characters long
                </Text>
              )}

              {username.length > 15 && (
                <Text style={styles.errorHint}>
                  Username cannot exceed 15 characters
                </Text>
              )}

              {username.toLowerCase().includes('quinipolo') && (
                <Text style={styles.errorHint}>
                  {t('usernameSecurityError') || 'Username cannot contain restricted words'}
                </Text>
              )}

              {birthday.length > 0 && calculateAge(birthday) < 18 && (
                <Text style={styles.errorHint}>
                  {t('mustBe18OrOlder') || 'You must be 18 or older to sign up'}
                </Text>
              )}

              <Button
                title={t('signUp')}
                onPress={handleSignUp}
                loading={loading}
                disabled={loading || !isFormValid()}
                style={globalStyles.primaryButton}
              />

              <View style={globalStyles.linksContainer}>
                <Button
                  title={t('alreadyHaveAccountLogin') || 'Already have an account? Log in here.'}
                  onPress={navigateToLogin}
                  mode="text"
                  disabled={loading}
                  style={globalStyles.linkButton}
                  textColor={colors.primary}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  errorHint: {
    color: colors.error,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
});

export default SignUpScreen;
