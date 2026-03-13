import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import LeagueDashboardScreen from '../screens/LeagueDashboardScreen';
import ViewQuinipoloScreen from '../screens/ViewQuinipoloScreen';
import AboutScreen from '../screens/AboutScreen';
import TermsScreen from '../screens/TermsScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import AnswerQuinipoloScreen from '../screens/AnswerQuinipoloScreen';
import CreateQuinipoloScreen from '../screens/CreateQuinipoloScreen';
import QuinipoloSuccessScreen from '../screens/QuinipoloSuccessScreen';
import CorrectionSuccessScreen from '../screens/CorrectionSuccessScreen';
import LeagueSuccessScreen from '../screens/LeagueSuccessScreen';

export type ProfileStackParamList = {
  Profile: undefined;
  LeagueDashboard: { id: string };
  ViewQuinipolo: { quinipoloId: string };
  About: undefined;
  Terms: undefined;
  Privacy: undefined;
  AnswerQuinipolo: {
    quinipoloId: string;
    mode?: 'answer' | 'correct' | 'editCorrection';
  };
  CreateQuinipolo: { leagueId: string; leagueName?: string };
  QuinipoloSuccess: {
    quinipolo: { id: string; end_date: string; league_name?: string };
  };
  CorrectionSuccess: {
    quinipoloId: string;
    leagueId?: string;
    averagePoints?: number;
  };
  LeagueSuccess: { league: { id: string; league_name: string; tier?: string } };
};

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="LeagueDashboard" component={LeagueDashboardScreen} />
      <Stack.Screen name="ViewQuinipolo" component={ViewQuinipoloScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="AnswerQuinipolo" component={AnswerQuinipoloScreen} />
      <Stack.Screen name="CreateQuinipolo" component={CreateQuinipoloScreen} />
      <Stack.Screen
        name="QuinipoloSuccess"
        component={QuinipoloSuccessScreen}
      />
      <Stack.Screen
        name="CorrectionSuccess"
        component={CorrectionSuccessScreen}
      />
      <Stack.Screen name="LeagueSuccess" component={LeagueSuccessScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
