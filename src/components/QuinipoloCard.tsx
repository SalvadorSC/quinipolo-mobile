import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { colors } from '../styles/globalStyles';

interface QuinipoloCardProps {
  quinipolo: {
    id: string;
    league_id: string;
    league_name: string;
    end_date: string;
    has_been_corrected: boolean;
    participants_who_answered?: string[];
    answered?: boolean;
    is_deleted?: boolean;
  };
  username: string;
}

const QuinipoloCard: React.FC<QuinipoloCardProps> = ({
  quinipolo,
  username,
}) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const deadline = new Date(quinipolo.end_date);
  const now = new Date();
  const deadlineIsInPast = deadline.getTime() < now.getTime();
  const hasAnswered =
    quinipolo.answered ||
    quinipolo.participants_who_answered?.includes(username);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeRemaining = () => {
    const diff = deadline.getTime() - now.getTime();
    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusColor = () => {
    if (quinipolo.is_deleted) return colors.error;
    if (deadlineIsInPast) return colors.textSecondary;
    if (hasAnswered) return colors.success;
    return colors.warning;
  };

  const getStatusText = () => {
    if (quinipolo.is_deleted) return t('deleted') || 'Deleted';
    if (deadlineIsInPast && quinipolo.has_been_corrected)
      return t('corrected') || 'Corrected';
    if (deadlineIsInPast) return t('expired') || 'Expired';
    if (hasAnswered) return t('answered') || 'Answered';
    return t('notAnswered') || 'Pending';
  };

  const handlePress = () => {
    if (quinipolo.is_deleted) return;

    if (!deadlineIsInPast && !hasAnswered) {
      // Navigate to answer screen
      (navigation as any).navigate('AnswerQuinipolo', { quinipoloId: quinipolo.id });
    } else if (deadlineIsInPast) {
      // Navigate to view past quinipolo (with or without answers)
      (navigation as any).navigate('ViewQuinipolo', { quinipoloId: quinipolo.id });
    }
  };

  const timeRemaining = getTimeRemaining();

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={quinipolo.is_deleted}
      activeOpacity={0.7}
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.leagueName}>{quinipolo.league_name}</Text>
              <Text style={styles.deadline}>{formatDate(quinipolo.end_date)}</Text>
            </View>
            <View style={styles.headerRight}>
              <Chip
                mode="flat"
                style={[styles.statusChip, { backgroundColor: getStatusColor() + '20' }]}
                textStyle={[styles.statusText, { color: getStatusColor() }]}
              >
                {getStatusText()}
              </Chip>
            </View>
          </View>

          {timeRemaining && !hasAnswered && (
            <View style={styles.countdownContainer}>
              <IconButton
                icon="clock-outline"
                size={16}
                iconColor={colors.warning}
                style={styles.clockIcon}
              />
              <Text style={styles.countdown}>{timeRemaining} {t('remaining') || 'remaining'}</Text>
            </View>
          )}

          {hasAnswered && quinipolo.has_been_corrected && (
            <View style={styles.correctedContainer}>
              <IconButton
                icon="check-circle"
                size={16}
                iconColor={colors.success}
                style={styles.correctedIcon}
              />
              <Text style={styles.correctedText}>
                {t('correctedTapToView') || 'Corrected - Tap to view results'}
              </Text>
            </View>
          )}

          {hasAnswered && !quinipolo.has_been_corrected && deadlineIsInPast && (
            <View style={styles.pendingCorrectionContainer}>
              <IconButton
                icon="clock-check"
                size={16}
                iconColor={colors.primary}
                style={styles.pendingIcon}
              />
              <Text style={styles.pendingCorrectionText}>
                {t('pendingCorrection') || 'Answered - Pending correction'}
              </Text>
            </View>
          )}

          {!hasAnswered && deadlineIsInPast && (
            <View style={styles.notAnsweredContainer}>
              <IconButton
                icon="information"
                size={16}
                iconColor={colors.textSecondary}
                style={styles.notAnsweredIcon}
              />
              <Text style={styles.notAnsweredText}>
                {t('notAnsweredTapToView') || 'Not answered - Tap to view'}
              </Text>
            </View>
          )}

          {!quinipolo.is_deleted && (
            <View style={styles.actions}>
              {!deadlineIsInPast && !hasAnswered ? (
                <IconButton
                  icon="play-circle"
                  size={24}
                  iconColor={colors.primary}
                  onPress={handlePress}
                />
              ) : deadlineIsInPast ? (
                <IconButton
                  icon="eye"
                  size={24}
                  iconColor={colors.primary}
                  onPress={handlePress}
                />
              ) : null}
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 4,
    borderRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    marginLeft: 12,
  },
  leagueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  deadline: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusChip: {
    height: 28,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.warning + '10',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  clockIcon: {
    margin: 0,
    marginRight: -4,
  },
  countdown: {
    fontSize: 14,
    color: colors.warning,
    fontWeight: '600',
  },
  correctedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.success + '10',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  correctedIcon: {
    margin: 0,
    marginRight: -4,
  },
  correctedText: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '600',
  },
  pendingCorrectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  pendingIcon: {
    margin: 0,
    marginRight: -4,
  },
  pendingCorrectionText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  notAnsweredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.textSecondary + '10',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  notAnsweredIcon: {
    margin: 0,
    marginRight: -4,
  },
  notAnsweredText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginRight: -12,
  },
});

export default QuinipoloCard;
