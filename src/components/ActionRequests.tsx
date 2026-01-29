import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, DataTable } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { colors } from '../styles/globalStyles';

type ParticipantPetition = {
  userId: string;
  username: string;
  date: Date | string;
  _id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
};

interface ActionRequestsProps {
  leagueId: string;
  leagueData: {
    isPrivate: boolean;
  };
  participantPetitions: ParticipantPetition[];
  onPetitionAccept: (petitionId: string) => void;
  onPetitionReject: (petitionId: string) => void;
}

const ActionRequests: React.FC<ActionRequestsProps> = ({
  leagueId,
  leagueData,
  participantPetitions,
  onPetitionAccept,
  onPetitionReject,
}) => {
  const { t } = useTranslation();

  const { participantRequests } = useMemo(() => {
    const pendingParticipant =
      leagueData.isPrivate &&
      participantPetitions?.filter(petition => petition.status === 'pending');
    return {
      participantRequests: pendingParticipant || [],
    };
  }, [leagueData.isPrivate, participantPetitions]);

  const noActions = !participantRequests || participantRequests.length === 0;

  if (noActions) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {t('noActionsToHandle') || 'No actions to handle'}
        </Text>
      </View>
    );
  }

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      {leagueData.isPrivate &&
        participantRequests &&
        participantRequests.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>
                {t('pendingRequestsTitle') || 'Pending Requests'} (
                {participantRequests.length})
              </Text>
              <DataTable style={styles.table}>
                <DataTable.Header>
                  <DataTable.Title style={styles.userColumn}>
                    <Text style={styles.headerText}>{t('user') || 'User'}</Text>
                  </DataTable.Title>
                  <DataTable.Title style={styles.dateColumn}>
                    <Text style={styles.headerText}>
                      {t('requestDate') || 'Date'}
                    </Text>
                  </DataTable.Title>
                  <DataTable.Title style={styles.actionsColumn}>
                    <Text style={styles.headerText}>
                      {t('actionsHeader') || 'Actions'}
                    </Text>
                  </DataTable.Title>
                </DataTable.Header>

                {participantRequests.map(request => (
                  <DataTable.Row key={request._id}>
                    <DataTable.Cell style={styles.userColumn}>
                      <Text style={styles.cellText}>@{request.username}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.dateColumn}>
                      <Text style={styles.cellText}>
                        {formatDate(request.date)}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.actionsColumn}>
                      <View style={styles.actionsContainer}>
                        <Button
                          mode="contained"
                          onPress={() => onPetitionAccept(request._id)}
                          style={styles.acceptButton}
                          labelStyle={styles.buttonLabel}
                          icon="check"
                        >
                          {t('accept') || 'Accept'}
                        </Button>
                        <Button
                          mode="contained"
                          onPress={() => onPetitionReject(request._id)}
                          style={styles.rejectButton}
                          labelStyle={styles.buttonLabel}
                          buttonColor={colors.error}
                          icon="close"
                        >
                          {t('reject') || 'Reject'}
                        </Button>
                      </View>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </Card.Content>
          </Card>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  card: {
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  table: {
    marginTop: 8,
  },
  userColumn: {
    flex: 1.5,
  },
  dateColumn: {
    flex: 1,
  },
  actionsColumn: {
    flex: 2,
  },
  headerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
  },
  cellText: {
    fontSize: 14,
    color: colors.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  acceptButton: {
    flex: 1,
    minWidth: 80,
  },
  rejectButton: {
    flex: 1,
    minWidth: 80,
  },
  buttonLabel: {
    fontSize: 12,
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default ActionRequests;
