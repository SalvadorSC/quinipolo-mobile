import React from 'react';
import { TextInput as RNTextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { colors } from '../styles/globalStyles';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoComplete?: 'email' | 'password' | 'username' | 'name' | 'off';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: boolean;
  disabled?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  mode?: 'flat' | 'outlined';
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  autoComplete = 'off',
  keyboardType = 'default',
  error = false,
  disabled = false,
  left,
  right,
  mode = 'outlined',
}) => {
  return (
    <RNTextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      autoComplete={autoComplete}
      keyboardType={keyboardType}
      error={error}
      disabled={disabled}
      left={left}
      right={right}
      mode={mode}
      style={styles.input}
      theme={{
        colors: {
          primary: colors.primary,
          error: colors.error,
        },
      }}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 16,
    backgroundColor: colors.white,
  },
});

export default Input;
