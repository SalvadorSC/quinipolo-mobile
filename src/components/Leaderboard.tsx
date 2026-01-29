import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, DataTable, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { colors, tableStyles } from '../styles/globalStyles';
import type { LeaderboardEntry } from '../hooks/dashboard';

interface LeaderboardProps {
  data: LeaderboardEntry[];
  currentUsername?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data, currentUsername }) => {
  const { t } = useTranslation();

  if (data.length === 0) {
    return (
      <View style={tableStyles.emptyContainer}>
        <IconButton icon="podium" size={48} iconColor={colors.textSecondary} />
        <Text style={tableStyles.emptyText}>
          {t('noLeaderboardData') || 'No leaderboard data yet'}
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
            <DataTable.Title numeric style={styles.pointsColumn}>
              <Text style={tableStyles.headerText}>{t('points') || 'Points'}</Text>
            </DataTable.Title>
          </DataTable.Header>

          {data.map((entry, index) => {
            const isCurrentUser = entry.username === currentUsername;
            const medal = getMedalIcon(index);

            return (
              <DataTable.Row
                key={entry.username}
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
                <DataTable.Cell numeric style={styles.pointsColumn}>
                  <Text
                    style={[
                      tableStyles.cellText,
                      styles.pointsText,
                      isCurrentUser && tableStyles.currentUserText,
                    ]}
                  >
                    {entry.totalPoints}
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
    minWidth: 270, // Total of all column widths (50+140+80)
    backgroundColor: colors.white,
    width: '100%',
  },
  playerColumn: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  pointsColumn: {
    width: 80,
    justifyContent: 'center',
  },
  pointsText: {
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

export default Leaderboard;
