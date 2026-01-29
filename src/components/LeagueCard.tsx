import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/globalStyles';

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
    // Navigate to league dashboard
    navigation.navigate('LeagueDashboard', { id: league.leagueId });
  };

  const getLeagueIcon = () => {
    // For MVP, use a simple trophy icon
    // In the future, implement custom league icons
    return 'trophy';
  };

  const getIconColor = () => {
    return league.icon_style?.icon_color || colors.primary;
  };

  const getAccentColor = () => {
    return league.icon_style?.accent_color || colors.primary;
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.iconContainer}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: getAccentColor() + '20' },
              ]}
            >
              <IconButton
                icon={getLeagueIcon()}
                size={32}
                iconColor={getIconColor()}
                style={styles.icon}
              />
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.leagueName} numberOfLines={1}>
              {league.leagueName}
            </Text>
            <Text style={styles.participants}>
              {league.participants.length}{' '}
              {league.participants.length === 1 ? 'participant' : 'participants'}
            </Text>
          </View>

          <IconButton
            icon="chevron-right"
            size={24}
            iconColor={colors.textSecondary}
            style={styles.chevron}
          />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 4,
    borderRadius: 12,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    marginRight: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    margin: 0,
  },
  infoContainer: {
    flex: 1,
  },
  leagueName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  participants: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  chevron: {
    margin: 0,
  },
});

export default LeagueCard;
