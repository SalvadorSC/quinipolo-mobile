import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/globalStyles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
  icon?: string;
  style?: ViewStyle;
  color?: string;
  textColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  mode = 'contained',
  style,
  textColor,
}) => {
  const isDisabled = disabled || loading;

  if (mode === 'contained') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[styles.wrapper, isDisabled && styles.disabled, style]}
      >
        <LinearGradient
          colors={isDisabled ? ['#90caf9', '#90caf9'] : ['#1976d2', '#42a5f5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={[styles.label, textColor ? { color: textColor } : undefined]}>
              {title}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Fallback for other modes — keep using react-native-paper's Button
  const { Button: PaperButton } = require('react-native-paper');
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={isDisabled}
      style={[styles.wrapper, style]}
      textColor={textColor}
      contentStyle={styles.content}
      labelStyle={styles.label}
    >
      {title}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingVertical: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button;
