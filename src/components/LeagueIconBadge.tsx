import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

export type LeagueIconBadgeProps = {
  icon?: string;
  sizePx?: number; // outer circle size
  marginLeftPx?: number;
  accentColor?: string; // background color for the badge
  iconColor?: string; // icon color
};

const getIconName = (icon?: string): string => {
  if (!icon) return 'trophy';

  // Map Material-UI icon names to Material Community Icons
  const iconMap: Record<string, string> = {
    sports_volleyball: 'volleyball',
    waves: 'waves',
    sports_bar: 'glass-cocktail',
    pool: 'pool',
    emoji_events: 'trophy',
    beach_access: 'beach',
    filter_vintage: 'flower',
    fitness_center: 'dumbbell',
    free_breakfast: 'coffee',
    group_work: 'account-group',
    golf_course: 'golf',
    grain: 'grain',
    language: 'web',
    linear_scale: 'scale-balance',
    looks: 'eye',
    mood: 'emoticon-happy',
    mood_bad: 'emoticon-sad',
    motorcycle: 'motorbike',
    public: 'earth',
    whatshot: 'fire',
    wb_sunny: 'weather-sunny',
    sports: 'sports',
    sports_football: 'football',
    sports_soccer: 'soccer',
    sports_tennis: 'tennis',
    sports_mma: 'karate',
    sports_motorsports: 'motorbike',
    sports_handball: 'handball',
    sports_basketball: 'basketball',
    sports_baseball: 'baseball',
    sports_cricket: 'cricket',
    sports_golf: 'golf',
    sports_hockey: 'hockey-sticks',
    sports_kabaddi: 'karate',
    sports_rugby: 'rugby',
    sports_esports: 'gamepad-variant',
  };

  return iconMap[icon] || 'trophy';
};

const LeagueIconBadge: React.FC<LeagueIconBadgeProps> = ({
  icon,
  sizePx = 40,
  marginLeftPx = 0,
  accentColor = '#ddd',
  iconColor = '#3f51b5',
}) => {
  const iconName = getIconName(icon);
  const iconSize = Math.floor(sizePx * 0.6); // Icon size is 60% of badge size

  return (
    <View
      style={[
        styles.badge,
        {
          width: sizePx,
          height: sizePx,
          borderRadius: sizePx / 2,
          backgroundColor: accentColor,
          marginLeft: marginLeftPx,
        },
      ]}
    >
      <IconButton
        icon={iconName}
        size={iconSize}
        iconColor={iconColor}
        style={styles.icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
    overflow: 'hidden', // Ensure icon doesn't overflow
  },
  icon: {
    margin: 0,
    padding: 0,
    width: '100%',
    height: '100%',
  },
});

export default LeagueIconBadge;
