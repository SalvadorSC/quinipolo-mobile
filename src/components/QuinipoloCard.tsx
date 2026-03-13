import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
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
  userLeagues?: Array<{ league_id: string; role: string }>;
}

const QuinipoloCard: React.FC<QuinipoloCardProps> = ({ quinipolo, username, userLeagues }) => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const deadline = new Date(quinipolo.end_date);
  const now = new Date();
  const deadlineIsInPast = deadline.getTime() < now.getTime();
  const hasAnswered =
    quinipolo.answered ||
    quinipolo.participants_who_answered?.includes(username);
  const isAdmin =
    userLeagues?.find(ul => ul.league_id === quinipolo.league_id)?.role === 'moderator';

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

  const getStatusText = () => {
    if (quinipolo.is_deleted) return t('deleted') || 'Deleted';
    if (deadlineIsInPast && quinipolo.has_been_corrected) return t('corrected') || 'Corrected';
    if (deadlineIsInPast && hasAnswered) return t('answered') || 'Answered';
    if (deadlineIsInPast) return t('notAnswered') || 'Not answered';
    if (hasAnswered) return t('answered') || 'Answered';
    return t('pending') || 'Pending';
  };

  const handleAnswer = () => {
    navigation.navigate('AnswerQuinipolo', { quinipoloId: quinipolo.id });
  };

  const handleView = () => {
    navigation.navigate('ViewQuinipolo', { quinipoloId: quinipolo.id });
  };

  const handleCorrect = () => {
    const mode = quinipolo.has_been_corrected ? 'editCorrection' : 'correct';
    navigation.navigate('AnswerQuinipolo', { quinipoloId: quinipolo.id, mode });
  };

  if (quinipolo.is_deleted) return null;

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.leagueName}>{quinipolo.league_name}</Text>
          <Text style={styles.deadline}>{formatDate(quinipolo.end_date)}</Text>
        </View>
        <Text style={styles.statusText}>{getStatusText()}</Text>
        <IconButton icon="dots-vertical" size={18} iconColor={colors.textSecondary} style={styles.menuBtn} onPress={() => {}} />
      </View>

      {/* Action buttons */}
      <View style={styles.buttons}>
        {isAdmin && deadlineIsInPast && (
          <TouchableOpacity onPress={handleCorrect} activeOpacity={0.8} style={styles.btnWrapper}>
            <LinearGradient colors={['#2e7d32', '#66bb6a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.correctBtn}>
              <Text style={styles.correctBtnText}>{(t('correct') || 'CORRECT').toUpperCase()}</Text>
              <IconButton icon="pencil" size={16} iconColor="#fff" style={styles.btnIcon} />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {deadlineIsInPast ? (
          <TouchableOpacity onPress={handleView} activeOpacity={0.8} style={styles.btnWrapper}>
            <LinearGradient colors={['#1976d2', '#42a5f5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.viewBtn}>
              <Text style={styles.viewBtnText}>
                {(hasAnswered ? (t('viewAnswers') || 'VIEW ANSWERS') : (t('viewQuinipolo') || 'VIEW QUINIPOLO')).toUpperCase()}
              </Text>
              <IconButton icon="eye" size={16} iconColor="#fff" style={styles.btnIcon} />
            </LinearGradient>
          </TouchableOpacity>
        ) : !hasAnswered ? (
          <TouchableOpacity onPress={handleAnswer} activeOpacity={0.8} style={styles.btnWrapper}>
            <LinearGradient colors={['#1976d2', '#42a5f5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.viewBtn}>
              <Text style={styles.viewBtnText}>{(t('answer') || 'ANSWER').toUpperCase()}</Text>
              <IconButton icon="pencil-outline" size={16} iconColor="#fff" style={styles.btnIcon} />
            </LinearGradient>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#dbeafe',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingLeft: 14,
    paddingRight: 4,
    paddingBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  leagueName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  deadline: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statusText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginRight: 4,
  },
  menuBtn: {
    margin: 0,
  },
  buttons: {
    paddingHorizontal: 10,
    paddingBottom: 12,
    gap: 8,
  },
  btnWrapper: {
    borderRadius: 6,
    overflow: 'hidden',
  },
  correctBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 6,
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
  },
  correctBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 6,
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
  },
  viewBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  btnIcon: {
    margin: 0,
  },
});

export default QuinipoloCard;
