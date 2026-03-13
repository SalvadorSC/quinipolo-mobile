import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Text, IconButton, Divider } from 'react-native-paper';
import dayjs from 'dayjs';
import { ScraperMatch } from '../services/scraperTypes';
import { fetchScraperDataV2 } from '../services/scraperService';
import { colors } from '../styles/globalStyles';

type DifficultyPreset = 'easy' | 'moderate' | 'hard' | 'custom';
type ModalStep = 'selection' | 'pleno';

const MAX_SELECTION = 15;
const LEAGUE_ORDER = ['CL', 'DHM', 'DHF', 'PDM', 'PDF', 'SDM', 'SEL. M', 'SEL. F'];

const difficultyColors: Record<string, string> = {
  easy: '#43a047',
  moderate: '#f9a825',
  hard: '#c62828',
  unknown: '#607d8b',
};

const presetColors: Record<string, string> = {
  easy: '#43a047',
  moderate: '#f9a825',
  hard: '#c62828',
};

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    matches: ScraperMatch[];
    plenoMatchId: string | null;
  }) => void;
}

export default function MatchAutoFillModal({ visible, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    matches: ScraperMatch[];
    presets: { easy: string[]; moderate: string[]; hard: string[] };
  } | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [plenoMatchId, setPlenoMatchId] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<DifficultyPreset>('custom');
  const [step, setStep] = useState<ModalStep>('selection');
  const [warning, setWarning] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    if (!visible || data) return;
    setLoading(true);
    setError(null);
    fetchScraperDataV2()
      .then((res) => {
        setData({ matches: res.matches, presets: res.presets });
        setSelectedIds([]);
        setPlenoMatchId(null);
        setActivePreset('custom');
        setStep('selection');
        setShowAll(true);
        setWarning(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [visible, data]);

  useEffect(() => {
    if (!visible) {
      setStep('selection');
      setShowAll(true);
      setWarning(null);
      setActivePreset('custom');
    }
  }, [visible]);

  useEffect(() => {
    if (!data) return;
    if (!plenoMatchId || !selectedIds.includes(plenoMatchId)) {
      setPlenoMatchId(selectedIds[selectedIds.length - 1] ?? null);
    }
  }, [selectedIds, data]);

  const matchMap = useMemo(() => {
    if (!data) return new Map<string, ScraperMatch>();
    return new Map(data.matches.map((m) => [m.matchId, m]));
  }, [data]);

  const displayedMatches = useMemo(() => {
    if (!data) return [];
    let list = showAll ? [...data.matches] : data.matches.filter((m) => selectedIds.includes(m.matchId));
    list.sort((a, b) => {
      const la = LEAGUE_ORDER.indexOf(a.leagueId);
      const lb = LEAGUE_ORDER.indexOf(b.leagueId);
      const leagueDiff = (la === -1 ? LEAGUE_ORDER.length : la) - (lb === -1 ? LEAGUE_ORDER.length : lb);
      if (leagueDiff !== 0) return leagueDiff;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
    return list;
  }, [data, showAll, selectedIds]);

  const selectedMatches = useMemo(
    () => selectedIds.map((id) => matchMap.get(id)).filter(Boolean) as ScraperMatch[],
    [selectedIds, matchMap]
  );

  const handlePreset = (preset: Exclude<DifficultyPreset, 'custom'>) => {
    if (!data) return;
    const ids = (data.presets[preset] ?? []).filter((id) => matchMap.has(id)).slice(0, 15);
    setSelectedIds(ids);
    setActivePreset(preset);
    setWarning(null);
    setShowAll(false);
  };

  const handleToggle = (matchId: string) => {
    setActivePreset('custom');
    setWarning(null);
    setSelectedIds((prev) => {
      if (prev.includes(matchId)) return prev.filter((id) => id !== matchId);
      if (prev.length >= MAX_SELECTION) {
        setWarning(`Maximum ${MAX_SELECTION} matches`);
        return prev;
      }
      return [...prev, matchId];
    });
  };

  const handleNext = () => {
    if (selectedIds.length === 0) {
      setWarning('Select at least one match');
      return;
    }
    setWarning(null);
    if (selectedIds.length < MAX_SELECTION) {
      doConfirm();
      return;
    }
    setStep('pleno');
    setPlenoMatchId(selectedIds[selectedIds.length - 1] ?? null);
  };

  const doConfirm = () => {
    const validPleno =
      plenoMatchId && selectedMatches.some((m) => m.matchId === plenoMatchId)
        ? plenoMatchId
        : null;
    onConfirm({ matches: selectedMatches, plenoMatchId: validPleno });
    onClose();
  };

  const renderDifficultyBadge = (difficulty: string) => (
    <View style={[styles.diffBadge, { backgroundColor: difficultyColors[difficulty] ?? '#607d8b' }]}>
      <Text style={styles.diffBadgeText}>{difficulty}</Text>
    </View>
  );

  const renderMatchRow = (
    match: ScraperMatch,
    isSelected: boolean,
    onPress: () => void,
    isRadio: boolean
  ) => (
    <TouchableOpacity
      key={match.matchId}
      style={[styles.matchRow, isSelected && styles.matchRowSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
        {isSelected && (
          <IconButton
            icon={isRadio ? 'radiobox-marked' : 'check'}
            size={14}
            iconColor="#fff"
            style={styles.checkIcon}
          />
        )}
      </View>
      <View style={styles.matchInfo}>
        <Text style={styles.matchTeams} numberOfLines={1}>
          {match.homeTeam} vs {match.awayTeam}
        </Text>
        <View style={styles.matchMeta}>
          <Text style={styles.matchLeague} numberOfLines={1}>{match.leagueName}</Text>
          <Text style={styles.matchDate}>{dayjs(match.startTime).format('DD/MM HH:mm')}</Text>
          {renderDifficultyBadge(match.difficulty)}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {step === 'selection' ? 'Auto-fill Matches' : 'Select Match 15 (Pleno)'}
          </Text>
          <IconButton icon="close" size={22} iconColor="#fff" onPress={onClose} style={styles.closeBtn} />
        </View>

        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading matches...</Text>
          </View>
        )}

        {!loading && error && (
          <View style={styles.centered}>
            <IconButton icon="alert-circle-outline" size={48} iconColor={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loading && !error && data && step === 'selection' && (
          <>
            <View style={styles.presetsRow}>
              {(['easy', 'moderate', 'hard'] as const).map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={[
                    styles.presetBtn,
                    { borderColor: presetColors[preset] },
                    activePreset === preset && { backgroundColor: presetColors[preset] },
                  ]}
                  onPress={() => handlePreset(preset)}
                >
                  <Text
                    style={[
                      styles.presetBtnText,
                      { color: activePreset === preset ? '#fff' : presetColors[preset] },
                    ]}
                  >
                    {preset.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.controlsRow}>
              <Text style={styles.countText}>
                {selectedIds.length}/{MAX_SELECTION} selected
              </Text>
              {selectedIds.length > 0 && (
                <TouchableOpacity onPress={() => setShowAll((v) => !v)}>
                  <Text style={styles.toggleText}>
                    {showAll ? 'Show selected only' : 'Show all'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {warning && (
              <View style={styles.warningRow}>
                <Text style={styles.warningText}>{warning}</Text>
              </View>
            )}

            <Divider />

            <ScrollView style={styles.list}>
              {displayedMatches.map((match) =>
                renderMatchRow(
                  match,
                  selectedIds.includes(match.matchId),
                  () => handleToggle(match.matchId),
                  false
                )
              )}
              {displayedMatches.length === 0 && (
                <Text style={styles.emptyText}>No matches available</Text>
              )}
            </ScrollView>
          </>
        )}

        {!loading && !error && data && step === 'pleno' && (
          <>
            <Text style={styles.plenoInstructions}>
              Select which match will be the Pleno (Match 15):
            </Text>
            <ScrollView style={styles.list}>
              {selectedMatches.map((match) =>
                renderMatchRow(
                  match,
                  plenoMatchId === match.matchId,
                  () => setPlenoMatchId(match.matchId),
                  true
                )
              )}
            </ScrollView>
          </>
        )}

        {!loading && !error && data && (
          <View style={styles.footer}>
            {step === 'selection' ? (
              <>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.nextBtn, selectedIds.length === 0 && styles.btnDisabled]}
                  onPress={handleNext}
                  disabled={selectedIds.length === 0}
                >
                  <Text style={styles.nextBtnText}>
                    {selectedIds.length > 0 && selectedIds.length < MAX_SELECTION ? 'Apply' : 'Next'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setStep('selection')}>
                  <Text style={styles.cancelBtnText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextBtn} onPress={doConfirm}>
                  <Text style={styles.nextBtnText}>Apply</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  closeBtn: { margin: 0 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingText: { marginTop: 16, fontSize: 15, color: colors.textSecondary },
  errorText: { fontSize: 14, color: colors.error, textAlign: 'center', marginTop: 8 },
  presetsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: '#fff',
  },
  presetBtn: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 999,
    paddingVertical: 8,
    alignItems: 'center',
  },
  presetBtnText: { fontSize: 12, fontWeight: '700' },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  countText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  toggleText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  warningRow: {
    backgroundColor: '#fff3cd',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  warningText: { fontSize: 13, color: '#856404' },
  list: { flex: 1 },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  matchRowSelected: { backgroundColor: colors.primary + '12' },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkIcon: { margin: 0, width: 20, height: 20 },
  matchInfo: { flex: 1 },
  matchTeams: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4 },
  matchMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  matchLeague: { fontSize: 11, color: colors.textSecondary, flex: 1 },
  matchDate: { fontSize: 11, color: colors.textSecondary },
  diffBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  diffBadgeText: { fontSize: 10, color: '#fff', fontWeight: '700' },
  plenoInstructions: {
    fontSize: 14,
    color: colors.text,
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  emptyText: { padding: 24, textAlign: 'center', color: colors.textSecondary },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: colors.text },
  nextBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  nextBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  btnDisabled: { opacity: 0.4 },
});
