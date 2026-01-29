import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, IconButton, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Background, Button } from '../components';
import { useUser } from '../context/UserContext';
import { globalStyles, colors } from '../styles/globalStyles';

const ProfileScreen = () => {
  const { t } = useTranslation();
  const { userData, signOut } = useUser();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Background>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[globalStyles.container, styles.container]}>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.header}>
                <IconButton
                  icon="account-circle"
                  size={64}
                  iconColor={colors.primary}
                />
                <Text style={styles.title}>
                  {userData.username || t('profile')}
                </Text>
                <Text style={styles.subtitle}>
                  {userData.emailAddress}
                </Text>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>
                  {t('accountInformation') || 'Account Information'}
                </Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>User ID:</Text>
                  <Text style={styles.infoValue}>{userData.userId}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoValue}>{userData.emailAddress}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Username:</Text>
                  <Text style={styles.infoValue}>{userData.username}</Text>
                </View>

                {userData.role && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Role:</Text>
                    <Text style={styles.infoValue}>{userData.role}</Text>
                  </View>
                )}
              </View>

              <Divider style={styles.divider} />

              <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>
                  {t('statistics') || 'Statistics'}
                </Text>
                <Text style={styles.comingSoon}>
                  {t('comingSoon') || 'Coming soon...'}
                </Text>
              </View>

              <Button
                title={t('logout') || 'Logout'}
                onPress={handleLogout}
                mode="contained"
                style={styles.logoutButton}
                icon="logout"
              />
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </Background>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 40,
  },
  container: {
    paddingVertical: 20,
  },
  card: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
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
  divider: {
    marginVertical: 16,
  },
  infoSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
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
  statsSection: {
    marginBottom: 16,
  },
  comingSoon: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  logoutButton: {
    marginTop: 8,
  },
});

export default ProfileScreen;
