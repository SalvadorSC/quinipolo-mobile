import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, DataTable, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { colors, tableStyles } from '../styles/globalStyles';
import type { LeaderboardEntry } from '../hooks/dashboard';

interface StatsProps {
  data: LeaderboardEntry[];
  currentUsername?: string;
}

type StatsEntry = LeaderboardEntry & {
  averagePoints: number;
};

const Stats: React.FC<StatsProps> = ({ data, currentUsername }) => {
  const { t } = useTranslation();

  const statsData = useMemo(() => {
    return data
      .map(entry => ({
        ...entry,
        averagePoints: entry.nQuinipolosParticipated
          ? entry.totalPoints / entry.nQuinipolosParticipated
          : 0,
      }))
      .sort((a, b) => b.averagePoints - a.averagePoints);
  }, [data]);

  if (statsData.length === 0) {
    return (
      <View style={tableStyles.emptyContainer}>
        <IconButton
          icon="chart-bar"
          size={48}
          iconColor={colors.textSecondary}
        />
        <Text style={tableStyles.emptyText}>
          {t('noStatsData') || 'No statistics data yet'}
        </Text>
      </View>
    );
  }

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return null;
    }
  };

  return (
    <View style={tableStyles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={true}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        <DataTable style={styles.table}>
          <DataTable.Header style={tableStyles.header}>
            <DataTable.Title style={tableStyles.rankColumn}>
              <Text style={tableStyles.headerText}>#</Text>
            </DataTable.Title>
            <DataTable.Title style={styles.playerColumn}>
              <Text style={tableStyles.headerText}>{t('player') || 'Player'}</Text>
            </DataTable.Title>
            <DataTable.Title numeric style={styles.avgColumn}>
              <Text style={tableStyles.headerText}>
                {t('averageQuinis') || 'Avg (Quinis)'}
              </Text>
            </DataTable.Title>
          </DataTable.Header>

          {statsData.map((entry, index) => {
            const isCurrentUser = entry.username === currentUsername;
            const medal = getMedalIcon(index);

            return (
              <DataTable.Row
                key={`${entry.username}-${entry.averagePoints}`}
                style={[
                  tableStyles.row,
                  isCurrentUser && tableStyles.currentUserRow,
                  index === 0 && tableStyles.firstPlaceRow,
                ]}
              >
                <DataTable.Cell style={tableStyles.rankColumn}>
                  <Text
                    style={[
                      tableStyles.cellText,
                      isCurrentUser && tableStyles.currentUserText,
                    ]}
                  >
                    {medal || index + 1}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.playerColumn}>
                  <Text
                    style={[
                      tableStyles.cellText,
                      tableStyles.playerText,
                      isCurrentUser && tableStyles.currentUserText,
                    ]}
                    numberOfLines={1}
                  >
                    {entry.username}
                    {isCurrentUser && ' (You)'}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell numeric style={styles.avgColumn}>
                  <Text
                    style={[
                      tableStyles.cellText,
                      styles.avgText,
                      isCurrentUser && tableStyles.currentUserText,
                    ]}
                  >
                    {entry.averagePoints.toFixed(2)} ({entry.nQuinipolosParticipated})
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}
        </DataTable>
      </ScrollView>
      <View style={styles.tableBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    minWidth: 290, // Total of all column widths (50+140+100)
    backgroundColor: colors.white,
    width: '100%',
  },
  playerColumn: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  avgColumn: {
    width: 100,
    justifyContent: 'center',
  },
  avgText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  tableBottom: {
    height: 12,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});

export default Stats;
