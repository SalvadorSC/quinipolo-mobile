import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { Background } from '../components';
import { globalStyles, colors } from '../styles/globalStyles';

interface PlaceholderScreenProps {
  title: string;
  message?: string;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({
  title,
  message = 'This feature is coming soon in a future release.',
}) => {
  return (
    <Background>
      <View style={[globalStyles.container, styles.container]}>
        <IconButton
          icon="construction"
          size={64}
          iconColor={colors.warning}
        />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.subtitle}>Stay tuned! 🚀</Text>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default PlaceholderScreen;
