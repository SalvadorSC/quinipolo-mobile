import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../styles/globalStyles';

interface SectionHeaderProps {
  title: string;
  accentColor?: string;
  style?: object;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  accentColor = colors.primary,
  style,
}) => {
  return (
    <View style={[styles.sectionHeader, style]}>
      <View
        style={[styles.sectionTitleDecorator, { backgroundColor: accentColor }]}
      />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  sectionTitleDecorator: {
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.2,
  },
});

export default SectionHeader;
