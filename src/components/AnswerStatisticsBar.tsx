import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { colors } from '../styles/globalStyles';
import type { MatchStatistics } from '../hooks/answers/types';

interface Props {
  homeTeam: string;
  awayTeam: string;
  statistics: MatchStatistics;
  totalResponses: number;
}

const AnswerStatisticsBar: React.FC<Props> = ({
  homeTeam,
  awayTeam,
  statistics,
  totalResponses,
}) => {
  const { t } = useTranslation();
  if (totalResponses === 0) return null;
  const { homeTeam: home, awayTeam: away, empat: draw } = statistics;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('answerStatisticsTitle') || '% of responses'}</Text>
      {/* Segmented bar */}
      <View style={styles.bar}>
        {home.percentage > 0 && (
          <View style={[styles.segment, styles.homeSegment, { flex: home.percentage }]}>
            {home.percentage > 10 && (
              <Text style={styles.segmentText}>{Math.round(home.percentage)}%</Text>
            )}
          </View>
        )}
        {draw.percentage > 0 && (
          <View style={[styles.segment, styles.drawSegment, { flex: draw.percentage }]}>
            {draw.percentage > 10 && (
              <Text style={styles.segmentText}>{Math.round(draw.percentage)}%</Text>
            )}
          </View>
        )}
        {away.percentage > 0 && (
          <View style={[styles.segment, styles.awaySegment, { flex: away.percentage }]}>
            {away.percentage > 10 && (
              <Text style={styles.segmentText}>{Math.round(away.percentage)}%</Text>
            )}
          </View>
        )}
      </View>
      {/* Labels */}
      <View style={styles.labels}>
        <View style={styles.labelItem}>
          <Text style={[styles.labelTeam]} numberOfLines={1}>{homeTeam}</Text>
          <Text style={[styles.labelPct, styles.homeColor]}>{home.percentage.toFixed(1)}%</Text>
          <Text style={styles.labelCount}>({home.count}/{totalResponses})</Text>
        </View>
        <View style={styles.labelItem}>
          <Text style={styles.labelTeam}>{t('tie') || 'Tie'}</Text>
          <Text style={[styles.labelPct, styles.drawColor]}>{draw.percentage.toFixed(1)}%</Text>
          <Text style={styles.labelCount}>({draw.count}/{totalResponses})</Text>
        </View>
        <View style={styles.labelItem}>
          <Text style={[styles.labelTeam]} numberOfLines={1}>{awayTeam}</Text>
          <Text style={[styles.labelPct, styles.awayColor]}>{away.percentage.toFixed(1)}%</Text>
          <Text style={styles.labelCount}>({away.count}/{totalResponses})</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  bar: {
    flexDirection: 'row',
    height: 22,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  segment: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeSegment: { backgroundColor: '#1976d2' },
  drawSegment: { backgroundColor: '#ed6c02' },
  awaySegment: { backgroundColor: '#2e7d32' },
  segmentText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  labelItem: {
    alignItems: 'center',
    flex: 1,
  },
  labelTeam: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  labelPct: {
    fontSize: 12,
    fontWeight: '700',
  },
  homeColor: { color: '#1976d2' },
  drawColor: { color: '#ed6c02' },
  awayColor: { color: '#2e7d32' },
  labelCount: {
    fontSize: 10,
    color: colors.textSecondary,
  },
});

export default AnswerStatisticsBar;
