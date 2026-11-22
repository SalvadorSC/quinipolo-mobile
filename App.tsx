import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { UserProvider } from './src/context/UserContext';
import AppNavigator from './src/navigation/AppNavigator';
import './src/utils/i18n';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const customTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: 'transparent',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={customTheme}>
        <UserProvider>
          <AppNavigator />
          <StatusBar style="light" translucent />
        </UserProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
