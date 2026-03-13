import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../styles/globalStyles';

interface OAuthProfileModalProps {
  visible: boolean;
  onComplete: (data: { username: string; birthday: string }) => void;
  onDismiss: () => void;
  loading: boolean;
  error: string | null;
}

const calculateAge = (birthdayStr: string): number => {
  const birthday = new Date(birthdayStr);
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  return age;
};

const OAuthProfileModal: React.FC<OAuthProfileModalProps> = ({
  visible,
  onComplete,
  onDismiss,
  loading,
  error,
}) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [birthday, setBirthday] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const validate = (): boolean => {
    setValidationError(null);

    if (!username) {
      setValidationError(`${t('username') || 'Username'} ${t('isRequired') || 'is required'}`);
      return false;
    }

    if (username.length < 3 || username.length > 15) {
      setValidationError(`${t('username') || 'Username'} ${t('isRequired') || 'must be between 3 and 15 characters'}`);
      return false;
    }

    if (username.toLowerCase().includes('quinipolo')) {
      setValidationError(t('usernameSecurityError') || 'Username cannot contain "quinipolo"');
      return false;
    }

    if (!birthday) {
      setValidationError(`${t('birthday') || 'Birthday'} ${t('isRequired') || 'is required'}`);
      return false;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birthday)) {
      setValidationError(`${t('birthday') || 'Birthday'} must be in YYYY-MM-DD format`);
      return false;
    }

    const age = calculateAge(birthday);
    if (age < 18) {
      setValidationError(t('mustBe18OrOlder') || 'You must be 18 or older to use this app');
      return false;
    }

    return true;
  };

  const handleComplete = () => {
    if (validate()) {
      onComplete({ username, birthday });
    }
  };

  const displayError = validationError || error;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.modal}>
              <Text style={styles.title}>
                {t('completeGoogleSignup') || 'Complete Your Profile'}
              </Text>

              <Text style={styles.message}>
                {t('completeProfileMessage') || 'Please complete your profile to finish signing up with Google.'}
              </Text>

              {displayError ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{displayError}</Text>
                </View>
              ) : null}

              <Text style={styles.label}>
                {t('username') || 'Username'}
              </Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="3–15 characters"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={15}
                editable={!loading}
              />

              <Text style={styles.label}>
                {t('birthday') || 'Birthday'}
              </Text>
              <TextInput
                style={styles.input}
                value={birthday}
                onChangeText={setBirthday}
                placeholder="YYYY-MM-DD"
                keyboardType="numeric"
                maxLength={10}
                editable={!loading}
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onDismiss}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>
                    {t('cancel') || 'Cancel'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.completeButton, loading && styles.disabledButton]}
                  onPress={handleComplete}
                  disabled={loading}
                >
                  <Text style={styles.completeButtonText}>
                    {loading ? '...' : (t('complete') || 'Complete')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    width: '88%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  errorContainer: {
    backgroundColor: '#fdecea',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.white,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  cancelButtonText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: colors.primary,
  },
  completeButtonText: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default OAuthProfileModal;
