import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { colors } from '../styles/globalStyles';

interface LoadingCardProps {
  message: string;
  accentColor?: string;
  style?: object;
}

const LoadingCard: React.FC<LoadingCardProps> = ({
  message,
  accentColor = colors.primary,
  style,
}) => {
  return (
    <Card style={[styles.loadingCard, style]}>
      <Card.Content>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={accentColor} />
          <Text style={styles.loadingText}>{message}</Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  loadingCard: {
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

export default LoadingCard;
