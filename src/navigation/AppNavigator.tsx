import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useUser } from '../context/UserContext';
import {
  LoginScreen,
  SignUpScreen,
  ResetPasswordScreen,
  EmailConfirmationScreen,
} from '../screens';
import BottomTabNavigator from './BottomTabNavigator';
import { colors } from '../styles/globalStyles';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ResetPassword: undefined;
  EmailConfirmation: undefined;
  MainTabs: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    'quinipolo://',
    'https://quinipolo.com',
    'https://www.quinipolo.com',
  ],
  config: {
    screens: {
      ResetPassword: 'reset-password',
      EmailConfirmation: 'email-confirmation',
      MainTabs: {
        screens: {
          LeaguesStack: {
            screens: {
              JoinLeague: 'join-league/:shareToken',
            },
          },
        },
      },
    },
  },
};

const AppNavigator: React.FC = () => {
  const { userData } = useUser();

  // Show loading screen while auth is initializing
  if (!userData.authInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer
      linking={linking}
      theme={{
        dark: false,
        colors: {
          primary: colors.primary,
          background: 'transparent',
          card: 'transparent',
          text: colors.text,
          border: colors.border,
          notification: colors.error,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
        }}
      >
        {userData.isAuthenticated ? (
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
            />
            <Stack.Screen
              name="EmailConfirmation"
              component={EmailConfirmationScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default AppNavigator;
