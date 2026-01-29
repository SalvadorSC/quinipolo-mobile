import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { colors } from '../styles/globalStyles';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  style?: object;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onDismiss,
  style,
}) => {
  return (
    <View style={[styles.errorContainer, style]}>
      <View style={styles.errorContent}>
        <IconButton
          icon="alert-circle"
          size={20}
          iconColor={colors.error}
          style={styles.errorIcon}
        />
        <Text style={styles.errorText}>{message}</Text>
      </View>
      {onDismiss && (
        <IconButton
          icon="close"
          size={20}
          iconColor={colors.error}
          onPress={onDismiss}
          style={styles.dismissButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.error + '10',
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  errorIcon: {
    margin: 0,
    marginRight: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: colors.error,
    fontWeight: '500',
    lineHeight: 20,
  },
  dismissButton: {
    margin: 0,
    marginLeft: 8,
  },
});

export default ErrorBanner;
