import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { colors } from '../styles/globalStyles';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <IconButton
          icon="alert-circle"
          size={20}
          iconColor={colors.error}
          style={styles.icon}
        />
        <Text style={styles.message}>{message}</Text>
      </View>
      {onDismiss && (
        <IconButton
          icon="close"
          size={20}
          iconColor={colors.error}
          onPress={onDismiss}
          style={styles.closeButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    margin: 0,
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: colors.error,
  },
  closeButton: {
    margin: 0,
  },
});

export default ErrorMessage;
