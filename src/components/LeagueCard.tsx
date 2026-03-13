import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/globalStyles';
import { LeagueIconBadge } from './index';

interface LeagueCardProps {
  league: {
    leagueId: string;
    leagueName: string;
    participants: string[];
    icon_style?: {
      icon?: string;
      accent_color?: string;
      icon_color?: string;
    };
  };
}

const LeagueCard: React.FC<LeagueCardProps> = ({ league }) => {
  const navigation = useNavigation<any>();

  const handlePress = () => {
    navigation.navigate('LeagueDashboard', { id: league.leagueId });
  };

  const accentColor = league.icon_style?.accent_color || colors.primary;
  const iconColor = league.icon_style?.icon_color || '#ffffff';
  const icon = league.icon_style?.icon || 'volleyball';

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.75} style={[styles.pill, { backgroundColor: accentColor }]}>
      <LeagueIconBadge icon={icon} sizePx={40} marginLeftPx={0} accentColor={accentColor} iconColor={iconColor} />
      <Text style={styles.leagueName} numberOfLines={1}>
        {league.leagueName.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingRight: 16,
    paddingVertical: 4,
    minHeight: 52,
    gap: 12,
  },
  leagueName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});

export default LeagueCard;
