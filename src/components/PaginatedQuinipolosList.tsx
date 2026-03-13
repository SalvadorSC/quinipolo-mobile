import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { QuinipoloCard } from './index';
import { colors } from '../styles/globalStyles';

interface Quinipolo {
  id: string;
  league_id: string;
  league_name: string;
  end_date: string;
  has_been_corrected: boolean;
  participants_who_answered?: string[];
  answered?: boolean;
  is_deleted?: boolean;
}

interface PaginatedQuinipolosListProps {
  quinipolos: Quinipolo[];
  username: string;
  itemsPerPage?: number;
  userLeagues?: Array<{ league_id: string; role: string }>;
}

export const PaginatedQuinipolosList: React.FC<
  PaginatedQuinipolosListProps
> = ({ quinipolos, username, itemsPerPage = 2, userLeagues }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(quinipolos.length / itemsPerPage);
  const showPagination = totalPages > 1;

  const paginatedQuinipolos = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return quinipolos.slice(startIndex, endIndex);
  }, [quinipolos, currentPage, itemsPerPage]);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  // Reset to first page if quinipolos list changes and current page is out of bounds
  React.useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(0);
    }
  }, [totalPages, currentPage]);

  return (
    <View style={styles.container}>
      {/* Quinipolos List */}
      <View style={styles.quinipolosList}>
        {paginatedQuinipolos.map((quinipolo, index) => (
          <View
            key={quinipolo.id}
            style={index > 0 ? styles.quinipoloItem : undefined}
          >
            <QuinipoloCard quinipolo={quinipolo} username={username} userLeagues={userLeagues} />
          </View>
        ))}
      </View>

      {/* Pagination Controls */}
      {showPagination && (
        <View style={styles.paginationContainer}>
          <IconButton
            icon="chevron-left"
            size={24}
            disabled={currentPage === 0}
            onPress={handlePreviousPage}
            iconColor={
              currentPage === 0 ? colors.textSecondary : colors.primary
            }
            style={styles.paginationButton}
          />
          <Text style={styles.paginationText}>
            {currentPage + 1} / {totalPages}
          </Text>
          <IconButton
            icon="chevron-right"
            size={24}
            disabled={currentPage === totalPages - 1}
            onPress={handleNextPage}
            iconColor={
              currentPage === totalPages - 1
                ? colors.textSecondary
                : colors.primary
            }
            style={styles.paginationButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  quinipolosList: {
    // Container for quinipolos
  },

  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  paginationButton: {
    margin: 0,
  },
  paginationText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 16,
    minWidth: 60,
    textAlign: 'center',
  },
});
