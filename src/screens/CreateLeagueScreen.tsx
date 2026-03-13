import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput as RNTextInput,
  Switch,
} from 'react-native';
import { Text, Card, ActivityIndicator, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Background, Button } from '../components';
import { useUser } from '../context/UserContext';
import { colors } from '../styles/globalStyles';
import apiClient from '../services/api';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';

type NavigationProp = StackNavigationProp<HomeStackParamList, 'CreateLeague'>;

interface Tier {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  features: string[];
}

const FALLBACK_TIER: Tier = {
  id: 'basic',
  name: 'Basic',
  description: '',
  amount: 2999,
  currency: 'eur',
  features: [],
};

const ICON_OPTIONS: string[] = [
  'water-polo',
  'soccer',
  'basketball',
  'handball',
  'tennis',
  'trophy',
  'account-group',
  'star',
  'heart',
  'fire',
  'earth',
  'shield',
];

const ACCENT_COLORS = ['#2273B9', '#1B3F7B', '#1F3057', '#1976d2'];
const ICON_COLORS = ['#ffffff', '#000000'];

export default function CreateLeagueScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { userData } = useUser();

  const [leagueName, setLeagueName] = useState('');
  const [leagueDescription, setLeagueDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [selectedIcon, setSelectedIcon] = useState('trophy');
  const [accentColor, setAccentColor] = useState('#2273B9');
  const [accentColorInput, setAccentColorInput] = useState('#2273B9');
  const [iconColor, setIconColor] = useState('#ffffff');

  const [tiers, setTiers] = useState<Tier[]>([FALLBACK_TIER]);
  const [selectedTierId, setSelectedTierId] = useState<string>(FALLBACK_TIER.id);
  const [tiersLoading, setTiersLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const response = await apiClient.get('/api/league-stripe/tiers');
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setTiers(response.data);
          setSelectedTierId(response.data[0].id);
        } else {
          setTiers([FALLBACK_TIER]);
          setSelectedTierId(FALLBACK_TIER.id);
        }
      } catch {
        setTiers([FALLBACK_TIER]);
        setSelectedTierId(FALLBACK_TIER.id);
      } finally {
        setTiersLoading(false);
      }
    };
    fetchTiers();
  }, []);

  const handleAccentColorInputChange = (value: string) => {
    setAccentColorInput(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setAccentColor(value);
    }
  };

  const handleAccentColorSwatch = (c: string) => {
    setAccentColor(c);
    setAccentColorInput(c);
  };

  const handleSubmit = async () => {
    if (!leagueName.trim()) {
      Alert.alert(
        t('validationError') || 'Validation Error',
        t('leagueNameRequired') || 'League name is required.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiClient.post('/api/leagues', {
        league_name: leagueName.trim(),
        description: leagueDescription.trim(),
        is_private: isPrivate,
        userId: userData.userId,
        icon_style: {
          icon: selectedIcon,
          accent_color: accentColor,
          icon_color: iconColor,
        },
      });

      navigation.navigate('LeagueSuccess', { league: response.data });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        (t('createLeagueError') || 'Failed to create league. Please try again.');
      Alert.alert(t('error') || 'Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    const symbol = currency.toLowerCase() === 'eur' ? '€' : '$';
    return `${symbol}${(amount / 100).toFixed(2)}`;
  };

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.headerRow}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
            iconColor={colors.text}
          />
          <Text style={styles.screenTitle}>
            {t('createLeague') || 'Create League'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          {/* Preview Badge */}
          <View style={styles.previewSection}>
            <View
              style={[
                styles.previewBadge,
                { backgroundColor: accentColor },
              ]}
            >
              <MaterialCommunityIcons
                name={selectedIcon as any}
                size={40}
                color={iconColor}
              />
            </View>
            <Text style={styles.previewLabel}>
              {t('preview') || 'Preview'}
            </Text>
          </View>

          {/* League Name */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>
                {t('leagueName') || 'League Name'} *
              </Text>
              <RNTextInput
                style={styles.textInput}
                value={leagueName}
                onChangeText={setLeagueName}
                placeholder={t('enterLeagueName') || 'Enter league name'}
                placeholderTextColor={colors.textSecondary}
                maxLength={80}
              />
            </Card.Content>
          </Card>

          {/* Description */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>
                {t('description') || 'Description'}
              </Text>
              <RNTextInput
                style={[styles.textInput, styles.textInputMultiline]}
                value={leagueDescription}
                onChangeText={setLeagueDescription}
                placeholder={t('enterDescription') || 'Enter description (optional)'}
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
                maxLength={500}
              />
            </Card.Content>
          </Card>

          {/* Privacy */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.switchRow}>
                <View>
                  <Text style={styles.sectionTitle}>
                    {t('privateLeague') || 'Private League'}
                  </Text>
                  <Text style={styles.switchSubtitle}>
                    {isPrivate
                      ? (t('privateLeagueHint') || 'Only invited members can join')
                      : (t('publicLeagueHint') || 'Anyone can discover and join')}
                  </Text>
                </View>
                <Switch
                  value={isPrivate}
                  onValueChange={setIsPrivate}
                  trackColor={{ false: colors.border, true: colors.primary + '60' }}
                  thumbColor={isPrivate ? colors.primary : colors.textSecondary}
                />
              </View>
            </Card.Content>
          </Card>

          {/* Tier Selection */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>
                {t('selectPlan') || 'Select Plan'}
              </Text>
              {tiersLoading ? (
                <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 16 }} />
              ) : (
                <View style={styles.tiersContainer}>
                  {tiers.map((tier) => {
                    const selected = tier.id === selectedTierId;
                    return (
                      <TouchableOpacity
                        key={tier.id}
                        style={[
                          styles.tierCard,
                          selected && styles.tierCardSelected,
                        ]}
                        onPress={() => setSelectedTierId(tier.id)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.tierHeader}>
                          <Text style={[styles.tierName, selected && styles.tierNameSelected]}>
                            {tier.name}
                          </Text>
                          <Text style={[styles.tierPrice, selected && styles.tierPriceSelected]}>
                            {formatPrice(tier.amount, tier.currency)}
                          </Text>
                        </View>
                        {tier.description ? (
                          <Text style={styles.tierDescription}>{tier.description}</Text>
                        ) : null}
                        {tier.features && tier.features.length > 0 ? (
                          <View style={styles.tierFeatures}>
                            {tier.features.map((f, i) => (
                              <Text key={i} style={styles.tierFeature}>
                                {'• '}{f}
                              </Text>
                            ))}
                          </View>
                        ) : null}
                        {selected && (
                          <MaterialCommunityIcons
                            name="check-circle"
                            size={20}
                            color={colors.primary}
                            style={styles.tierCheck}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </Card.Content>
          </Card>

          {/* Icon Selection */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>
                {t('selectIcon') || 'Select Icon'}
              </Text>
              <View style={styles.iconGrid}>
                {ICON_OPTIONS.map((icon) => {
                  const selected = icon === selectedIcon;
                  return (
                    <TouchableOpacity
                      key={icon}
                      style={[
                        styles.iconButton,
                        selected && styles.iconButtonSelected,
                      ]}
                      onPress={() => setSelectedIcon(icon)}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons
                        name={icon as any}
                        size={28}
                        color={selected ? colors.primary : colors.textSecondary}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Card.Content>
          </Card>

          {/* Accent Color */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>
                {t('accentColor') || 'Accent Color'}
              </Text>
              <View style={styles.swatchRow}>
                {ACCENT_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: c },
                      accentColor === c && styles.swatchSelected,
                    ]}
                    onPress={() => handleAccentColorSwatch(c)}
                    activeOpacity={0.8}
                  />
                ))}
              </View>
              <View style={styles.hexInputRow}>
                <Text style={styles.hexLabel}>Hex:</Text>
                <RNTextInput
                  style={styles.hexInput}
                  value={accentColorInput}
                  onChangeText={handleAccentColorInputChange}
                  placeholder="#2273B9"
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="characters"
                  maxLength={7}
                />
                <View style={[styles.hexPreview, { backgroundColor: accentColor }]} />
              </View>
            </Card.Content>
          </Card>

          {/* Icon Color */}
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>
                {t('iconColor') || 'Icon Color'}
              </Text>
              <View style={styles.swatchRow}>
                {ICON_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: c },
                      c === '#ffffff' && styles.swatchBordered,
                      iconColor === c && styles.swatchSelected,
                    ]}
                    onPress={() => setIconColor(c)}
                    activeOpacity={0.8}
                  />
                ))}
              </View>
            </Card.Content>
          </Card>

          {/* Submit */}
          <Button
            title={submitting ? (t('creating') || 'Creating…') : (t('createLeague') || 'Create League')}
            onPress={handleSubmit}
            mode="contained"
            style={styles.submitButton}
            disabled={submitting}
            {...(!submitting ? { icon: 'plus-circle' } : {})}
          />
        </View>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    paddingHorizontal: 16,
  },
  previewSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  previewLabel: {
    marginTop: 8,
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.97)',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    backgroundColor: '#fafafa',
  },
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    maxWidth: 220,
  },
  tiersContainer: {
    gap: 10,
  },
  tierCard: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fafafa',
    position: 'relative',
  },
  tierCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tierName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  tierNameSelected: {
    color: colors.primary,
  },
  tierPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tierPriceSelected: {
    color: colors.primary,
  },
  tierDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  tierFeatures: {
    marginTop: 4,
  },
  tierFeature: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  tierCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  iconButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  swatchBordered: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
  hexInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hexLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    width: 30,
  },
  hexInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.text,
    backgroundColor: '#fafafa',
  },
  hexPreview: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 12,
  },
});
