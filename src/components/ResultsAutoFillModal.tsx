import React, { useState, useEffect } from 'react';
import { Modal, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button as PaperButton, ActivityIndicator, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import apiClient from '../services/api';
import { colors } from '../styles/globalStyles';
import type { MatchResult } from '../services/scraperTypes';

const CONFIDENCE_HIGH = 0.7;

const confidenceColor = (c: number) => {
  if (c >= CONFIDENCE_HIGH) return '#4caf50';
  if (c >= 0.5) return '#ff9800';
  return '#f44336';
};

interface Props {
  visible: boolean;
  quinipoloId: string;
  onClose: () => void;
  onConfirm: (results: MatchResult[]) => void;
}

const ResultsAutoFillModal: React.FC<Props> = ({ visible, quinipoloId, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible || !quinipoloId) return;
    setLoading(true);
    setError(null);
    apiClient.get(`/api/scraper/results?quinipoloId=${quinipoloId}&days=7`)
      .then(res => {
        const data: MatchResult[] = res.data?.matches ?? [];
        setResults(data);
        // Auto-select high confidence
        setSelected(new Set(
          data.filter(m => m.confidence >= CONFIDENCE_HIGH).map(m => m.matchNumber)
        ));
      })
      .catch((err: any) => setError(err?.response?.data?.message || 'Failed to load results'))
      .finally(() => setLoading(false));
  }, [visible, quinipoloId]);

  const toggle = (matchNumber: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(matchNumber)) next.delete(matchNumber); else next.add(matchNumber);
      return next;
    });
  };

  const handleApply = () => {
    onConfirm(results.filter(r => selected.has(r.matchNumber)));
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton icon="close" onPress={onClose} style={styles.closeButton} />
          <Text style={styles.title}>{t('autoFillResults') || 'Auto-fill Results'}</Text>
          <Text style={styles.counter}>{selected.size} {t('selected') || 'selected'}</Text>
        </View>

        {loading && <View style={styles.centered}><ActivityIndicator size="large" color={colors.primary} /></View>}
        {error && <View style={styles.centered}><Text style={styles.errorText}>{error}</Text></View>}

        {!loading && !error && results.length === 0 && (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>{t('noResultsFound') || 'No results found for this quinipolo'}</Text>
          </View>
        )}

        {!loading && !error && results.length > 0 && (
          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            {results.map(result => {
              const isSelected = selected.has(result.matchNumber);
              return (
                <TouchableOpacity
                  key={result.matchNumber}
                  style={[styles.row, isSelected && styles.rowSelected]}
                  onPress={() => toggle(result.matchNumber)}
                  activeOpacity={0.7}
                >
                  <View style={styles.rowLeft}>
                    <Text style={styles.matchNum}>#{result.matchNumber}</Text>
                    <View style={styles.rowInfo}>
                      <Text style={styles.teams} numberOfLines={1}>
                        {result.homeTeam} vs {result.awayTeam}
                      </Text>
                      <Text style={styles.score}>
                        {result.homeScore}–{result.awayScore}
                        {result.wentToPenalties ? ' (PEN)' : ''}
                        {' · '}{result.outcome}
                      </Text>
                      <Text style={styles.league}>{result.leagueName}</Text>
                    </View>
                  </View>
                  <View style={[styles.confidenceBadge, { backgroundColor: confidenceColor(result.confidence) }]}>
                    <Text style={styles.confidenceText}>{Math.round(result.confidence * 100)}%</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        <View style={styles.footer}>
          <PaperButton mode="outlined" onPress={onClose} style={styles.footerBtn}>{t('cancel') || 'Cancel'}</PaperButton>
          <PaperButton mode="contained" onPress={handleApply} disabled={selected.size === 0} style={styles.footerBtn}>
            {t('apply') || 'Apply'} ({selected.size})
          </PaperButton>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8,
    paddingTop: 48, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  closeButton: { margin: 0 },
  title: { flex: 1, fontSize: 18, fontWeight: '700', color: colors.text, marginLeft: 4 },
  counter: { fontSize: 13, fontWeight: '600', color: colors.primary },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { fontSize: 14, color: colors.error, textAlign: 'center' },
  emptyText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 12 },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.border,
    marginBottom: 8, backgroundColor: '#fafafa',
  },
  rowSelected: { borderColor: colors.primary, backgroundColor: colors.primary + '0D' },
  rowLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  matchNum: { fontSize: 12, fontWeight: '700', color: colors.primary, minWidth: 24 },
  rowInfo: { flex: 1 },
  teams: { fontSize: 14, fontWeight: '600', color: colors.text },
  score: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  league: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  confidenceBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, marginLeft: 8 },
  confidenceText: { fontSize: 11, color: '#fff', fontWeight: '700' },
  footer: {
    flexDirection: 'row', gap: 12, padding: 16,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  footerBtn: { flex: 1, borderRadius: 8 },
});

export default ResultsAutoFillModal;
