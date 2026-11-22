import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { Text, Button as PaperButton } from 'react-native-paper';
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
  icon,
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
            <Text
              style={[
                styles.label,
                textColor ? { color: textColor } : undefined,
              ]}
            >
              {title}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Text and outlined buttons must not inherit the contained label color.
  // A white label on the white card made the Google button a blank box
  // and the login links unreadable.
  const resolvedTextColor = textColor || colors.primary;

  return (
    <PaperButton
      mode={mode}
      icon={icon}
      onPress={onPress}
      loading={loading}
      disabled={isDisabled}
      style={[styles.wrapper, style]}
      textColor={resolvedTextColor}
      contentStyle={styles.content}
      labelStyle={[styles.altLabel, { color: resolvedTextColor }]}
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
  altLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button;
