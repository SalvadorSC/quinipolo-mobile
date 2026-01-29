import { StyleSheet, Platform } from 'react-native';

// Global styles that mimic the original frontend
export const globalStyles = StyleSheet.create({
  // Background styles
  background: {
    flex: 1,
    // Only set background color for native platforms
    ...(Platform.OS !== 'web' && {
      backgroundColor: '#f5f5f5',
    }),
  },

  // Container styles
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // Card styles (mimicking the original login card)
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 8,
  },

  cardContent: {
    padding: 32,
  },

  // Header styles
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },

  // Input styles
  input: {
    marginBottom: 16,
  },

  // Button styles
  primaryButton: {
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 8,
    fontWeight: '600',
  },

  googleButton: {
    marginBottom: 20,
    borderRadius: 8,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },

  buttonContent: {
    paddingVertical: 8,
  },

  // Link styles
  linksContainer: {
    alignItems: 'center',
    marginTop: 20,
  },

  linkButton: {
    marginVertical: 4,
  },

  // Error styles
  errorText: {
    color: '#d32f2f',
    marginBottom: 16,
    textAlign: 'center',
  },

  // Modal styles
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },

  modalTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },

  modalText: {
    textAlign: 'center',
    marginBottom: 12,
  },

  modalWarning: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
  },

  modalButton: {
    marginTop: 8,
  },
});

// Color constants
export const colors = {
  primary: '#1890ff',
  primaryLight: '#e6f7ff',
  secondary: '#4285F4',
  success: '#52c41a',
  error: '#d32f2f',
  warning: '#faad14',
  info: '#1890ff',
  text: '#000000',
  textSecondary: '#666666',
  background: '#f5f5f5',
  white: '#ffffff',
  border: '#e0e0e0',
  borderLight: '#d9d9d9',
};

// Typography constants
export const typography = {
  fontFamily: {
    regular:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    medium:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    bold: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  fontSize: {
    small: 12,
    regular: 14,
    medium: 16,
    large: 18,
    xlarge: 20,
    xxlarge: 24,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Shared table styles for Leaderboard and Stats components
export const tableStyles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: 300,
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    backgroundColor: colors.primary + '10',
  },
  headerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  currentUserRow: {
    backgroundColor: colors.primary + '15',
  },
  firstPlaceRow: {
    backgroundColor: colors.warning + '10',
  },
  rankColumn: {
    width: 50,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 14,
    color: colors.text,
  },
  playerText: {
    fontWeight: '500',
  },
  currentUserText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
