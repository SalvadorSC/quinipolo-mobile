import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput as RNTextInput,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  IconButton,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { Background, Button, SectionHeader } from '../components';
import { useUser } from '../context/UserContext';
import { globalStyles, colors } from '../styles/globalStyles';
import { ProfileStackParamList } from '../navigation/ProfileStackNavigator';
import apiClient from '../services/api';
import i18n from '../utils/i18n';

type Props = StackScreenProps<ProfileStackParamList, 'Profile'>;

interface UserStats {
  nQuinipolosParticipated?: number;
  totalPoints?: number;
  avgPoints?: number;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'ca', label: 'Català' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
];

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { userData, signOut, updateUser } = useUser();

  // Stats state
  const [stats, setStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  // Language modal state
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [currentLangCode, setCurrentLangCode] = useState(i18n.language);

  // Username edit modal state
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [usernameInput, setUsernameInput] = useState(userData.username ?? '');
  const [usernameSaving, setUsernameSaving] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      setStatsError(false);
      try {
        const response = await apiClient.get('/api/users/me/stats');
        const data = response.data as UserStats;
        // Compute avgPoints if not present but the ingredients are there
        if (
          data.avgPoints === undefined &&
          data.totalPoints !== undefined &&
          data.nQuinipolosParticipated !== undefined &&
          data.nQuinipolosParticipated > 0
        ) {
          data.avgPoints = parseFloat(
            (data.totalPoints / data.nQuinipolosParticipated).toFixed(2)
          );
        }
        setStats(data);
      } catch (error: any) {
        const status = error?.response?.status;
        if (status === 404) {
          setStats(null);
          setStatsError(false);
        } else {
          setStatsError(true);
        }
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    await signOut();
  };

  const handleLanguageSelect = (code: string) => {
    i18n.changeLanguage(code);
    setCurrentLangCode(code);
    setLangModalVisible(false);
  };

  const getCurrentLangLabel = () => {
    const found = LANGUAGES.find(l => l.code === currentLangCode);
    return found ? found.label : currentLangCode;
  };

  const handleOpenUsernameModal = () => {
    setUsernameInput(userData.username ?? '');
    setUsernameModalVisible(true);
  };

  const handleSaveUsername = async () => {
    const trimmed = usernameInput.trim();
    if (!trimmed) {
      Alert.alert(
        t('validationError') || 'Validation Error',
        t('usernameRequired') || 'Username cannot be empty.'
      );
      return;
    }
    setUsernameSaving(true);
    try {
      await apiClient.patch('/api/users/me/profile', { username: trimmed });
      updateUser({ username: trimmed });
      setUsernameModalVisible(false);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        t('updateUsernameError') ||
        'Failed to update username.';
      Alert.alert(t('error') || 'Error', message);
    } finally {
      setUsernameSaving(false);
    }
  };

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[globalStyles.container, styles.container]}>

          {/* Profile Section */}
          <View style={styles.section}>
            <SectionHeader
              title={t('profile') || 'Profile'}
              accentColor={colors.primary}
              titleColor="#fff"
            />
            <Card style={styles.sectionCard}>
              <Card.Content>
                <View style={styles.profileHeader}>
                  <IconButton
                    icon="account-circle"
                    size={64}
                    iconColor={colors.primary}
                  />
                  <Text style={styles.title}>
                    {userData.username || t('profile')}
                  </Text>
                  <Text style={styles.subtitle}>{userData.emailAddress}</Text>
                </View>
              </Card.Content>
            </Card>
          </View>

          {/* Account Information Section */}
          <View style={styles.section}>
            <SectionHeader
              title={t('accountInformation') || 'Account Information'}
              accentColor={colors.primary}
              titleColor="#fff"
            />
            <Card style={styles.sectionCard}>
              <Card.Content>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>User ID:</Text>
                  <Text style={styles.infoValue}>{userData.userId}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoValue}>{userData.emailAddress}</Text>
                </View>

                {/* Username row with edit button */}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Username:</Text>
                  <View style={styles.usernameValueRow}>
                    <Text style={[styles.infoValue, styles.usernameText]}>
                      {userData.username}
                    </Text>
                    <IconButton
                      icon="pencil"
                      size={18}
                      iconColor={colors.primary}
                      style={styles.editIcon}
                      onPress={handleOpenUsernameModal}
                    />
                  </View>
                </View>

                {userData.role && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Role:</Text>
                    <Text style={styles.infoValue}>{userData.role}</Text>
                  </View>
                )}

                {userData.hasScraperAccess && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>
                      {t('scraperAccess') || 'Scraper Access'}:
                    </Text>
                    <View style={styles.scraperBadge}>
                      <IconButton
                        icon="auto-fix"
                        size={14}
                        iconColor="#fff"
                        style={styles.scraperBadgeIcon}
                      />
                      <Text style={styles.scraperBadgeText}>
                        {t('enabled') || 'Enabled'}
                      </Text>
                    </View>
                  </View>
                )}
              </Card.Content>
            </Card>
          </View>

          {/* Statistics Section */}
          <View style={styles.section}>
            <SectionHeader
              title={t('statistics') || 'Statistics'}
              accentColor={colors.primary}
              titleColor="#fff"
            />
            <Card style={styles.sectionCard}>
              <Card.Content>
                {statsLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.primary}
                    style={styles.statsLoader}
                  />
                ) : statsError ? (
                  <Text style={styles.statsNoData}>
                    {t('statsLoadError') || 'Could not load statistics.'}
                  </Text>
                ) : stats === null ? (
                  <Text style={styles.statsNoData}>
                    {t('noStatsYet') || 'No stats yet.'}
                  </Text>
                ) : (
                  <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {stats.nQuinipolosParticipated ?? 0}
                      </Text>
                      <Text style={styles.statLabel}>
                        {t('participated') || 'Participated'}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {stats.totalPoints ?? 0}
                      </Text>
                      <Text style={styles.statLabel}>
                        {t('totalPoints') || 'Total Points'}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {stats.avgPoints !== undefined
                          ? stats.avgPoints.toFixed(1)
                          : '–'}
                      </Text>
                      <Text style={styles.statLabel}>
                        {t('avgPoints') || 'Avg Points'}
                      </Text>
                    </View>
                  </View>
                )}
              </Card.Content>
            </Card>
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <SectionHeader
              title={t('preferences') || 'Preferences'}
              accentColor={colors.primary}
              titleColor="#fff"
            />
            <Card style={styles.sectionCard}>
              <Card.Content>
                <TouchableOpacity
                  style={styles.linkRow}
                  onPress={() => setLangModalVisible(true)}
                >
                  <IconButton
                    icon="translate"
                    size={20}
                    iconColor={colors.primary}
                    style={styles.linkIcon}
                  />
                  <Text style={styles.linkText}>
                    {t('language') || 'Language'}
                  </Text>
                  <Text style={styles.langValue}>{getCurrentLangLabel()}</Text>
                  <IconButton
                    icon="chevron-right"
                    size={20}
                    iconColor={colors.textSecondary}
                    style={styles.linkChevron}
                  />
                </TouchableOpacity>
              </Card.Content>
            </Card>
          </View>

          {/* App Info Section */}
          <View style={styles.section}>
            <SectionHeader
              title={t('appInfo') || 'App Info'}
              accentColor={colors.primary}
              titleColor="#fff"
            />
            <Card style={styles.sectionCard}>
              <Card.Content>
                <TouchableOpacity
                  style={styles.linkRow}
                  onPress={() => navigation.navigate('About')}
                >
                  <IconButton
                    icon="information-outline"
                    size={20}
                    iconColor={colors.primary}
                    style={styles.linkIcon}
                  />
                  <Text style={styles.linkText}>{t('about') || 'About'}</Text>
                  <IconButton
                    icon="chevron-right"
                    size={20}
                    iconColor={colors.textSecondary}
                    style={styles.linkChevron}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.linkRow}
                  onPress={() => navigation.navigate('Terms')}
                >
                  <IconButton
                    icon="file-document-outline"
                    size={20}
                    iconColor={colors.primary}
                    style={styles.linkIcon}
                  />
                  <Text style={styles.linkText}>
                    {t('termsOfService') || 'Terms of Service'}
                  </Text>
                  <IconButton
                    icon="chevron-right"
                    size={20}
                    iconColor={colors.textSecondary}
                    style={styles.linkChevron}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.linkRow}
                  onPress={() => navigation.navigate('Privacy')}
                >
                  <IconButton
                    icon="shield-lock-outline"
                    size={20}
                    iconColor={colors.primary}
                    style={styles.linkIcon}
                  />
                  <Text style={styles.linkText}>
                    {t('privacyPolicy') || 'Privacy Policy'}
                  </Text>
                  <IconButton
                    icon="chevron-right"
                    size={20}
                    iconColor={colors.textSecondary}
                    style={styles.linkChevron}
                  />
                </TouchableOpacity>
              </Card.Content>
            </Card>
          </View>

          {/* Logout Button */}
          <Button
            title={t('logout') || 'Logout'}
            onPress={handleLogout}
            mode="contained"
            style={styles.logoutButton}
            icon="logout"
          />

        </View>
      </ScrollView>

      {/* Language Picker Modal */}
      <Modal
        visible={langModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLangModalVisible(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>
              {t('selectLanguage') || 'Select Language'}
            </Text>
            <Divider style={styles.modalDivider} />
            {LANGUAGES.map(lang => {
              const isSelected = lang.code === currentLangCode;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.langRow, isSelected && styles.langRowSelected]}
                  onPress={() => handleLanguageSelect(lang.code)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.langRowText,
                      isSelected && styles.langRowTextSelected,
                    ]}
                  >
                    {lang.label}
                  </Text>
                  {isSelected && (
                    <IconButton
                      icon="check"
                      size={18}
                      iconColor={colors.primary}
                      style={styles.langCheck}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Username Edit Modal */}
      <Modal
        visible={usernameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setUsernameModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setUsernameModalVisible(false)}
        >
          <View style={styles.usernameModal}>
            <Text style={styles.modalTitle}>
              {t('editUsername') || 'Edit Username'}
            </Text>
            <Divider style={styles.modalDivider} />
            <RNTextInput
              style={styles.usernameInput}
              value={usernameInput}
              onChangeText={setUsernameInput}
              placeholder={t('enterUsername') || 'Enter username'}
              placeholderTextColor={colors.textSecondary}
              autoFocus
              maxLength={50}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.usernameModalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setUsernameModalVisible(false)}
              >
                <Text style={styles.modalBtnCancelText}>
                  {t('cancel') || 'Cancel'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  styles.modalBtnSave,
                  usernameSaving && styles.modalBtnDisabled,
                ]}
                onPress={handleSaveUsername}
                disabled={usernameSaving}
              >
                {usernameSaving ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.modalBtnSaveText}>
                    {t('save') || 'Save'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </Background>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 40,
  },
  container: {
    paddingVertical: 0,
    paddingHorizontal: 16,
    width: '100%',
  },
  section: {
    marginBottom: 32,
    width: '100%',
  },
  sectionCard: {
    borderRadius: 16,
    backgroundColor: colors.white,
    elevation: 3,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    textAlign: 'right',
  },
  usernameValueRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  usernameText: {
    flex: 1,
    textAlign: 'right',
  },
  editIcon: {
    margin: 0,
    marginLeft: 2,
  },
  statsLoader: {
    marginVertical: 16,
  },
  statsNoData: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  linkIcon: {
    margin: 0,
  },
  linkText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    marginLeft: 4,
  },
  langValue: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 2,
  },
  linkChevron: {
    margin: 0,
  },
  logoutButton: {
    marginTop: 8,
  },
  scraperBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7b1fa2',
    borderRadius: 12,
    paddingRight: 8,
    paddingVertical: 2,
  },
  scraperBadgeIcon: {
    margin: 0,
    padding: 0,
    width: 22,
    height: 22,
  },
  scraperBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  // Modal shared
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 36,
    paddingHorizontal: 24,
    maxHeight: '75%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalDivider: {
    marginBottom: 8,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  langRowSelected: {
    backgroundColor: `${colors.primary}15`,
  },
  langRowText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  langRowTextSelected: {
    fontWeight: '600',
    color: colors.primary,
  },
  langCheck: {
    margin: 0,
  },
  // Username modal
  usernameModal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 36,
    paddingHorizontal: 24,
  },
  usernameInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: '#fafafa',
    marginTop: 12,
    marginBottom: 20,
  },
  usernameModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnCancel: {
    backgroundColor: colors.border,
  },
  modalBtnSave: {
    backgroundColor: colors.primary,
  },
  modalBtnDisabled: {
    opacity: 0.6,
  },
  modalBtnCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  modalBtnSaveText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
});

export default ProfileScreen;
