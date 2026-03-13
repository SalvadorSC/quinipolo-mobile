import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LeagueDashboardScreen from '../screens/LeagueDashboardScreen';
import AnswerQuinipoloScreen from '../screens/AnswerQuinipoloScreen';
import ViewQuinipoloScreen from '../screens/ViewQuinipoloScreen';
import JoinLeagueScreen from '../screens/JoinLeagueScreen';
import CreateLeagueScreen from '../screens/CreateLeagueScreen';
import LeagueSuccessScreen from '../screens/LeagueSuccessScreen';
import AdminScreen from '../screens/AdminScreen';
import CreateQuinipoloScreen from '../screens/CreateQuinipoloScreen';
import QuinipoloSuccessScreen from '../screens/QuinipoloSuccessScreen';
import CorrectionSuccessScreen from '../screens/CorrectionSuccessScreen';

export type HomeStackParamList = {
  Home: undefined;
  LeagueDashboard: { id: string };
  AnswerQuinipolo: {
    quinipoloId: string;
    mode?: 'answer' | 'correct' | 'editCorrection';
  };
  ViewQuinipolo: { quinipoloId: string };
  JoinLeague: undefined;
  CreateLeague: undefined;
  LeagueSuccess: { league: { id: string; league_name: string; tier?: string } };
  Admin: undefined;
  CreateQuinipolo: { leagueId: string; leagueName?: string };
  QuinipoloSuccess: {
    quinipolo: { id: string; end_date: string; league_name?: string };
  };
  CorrectionSuccess: {
    quinipoloId: string;
    leagueId?: string;
    averagePoints?: number;
  };
};

const Stack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="LeagueDashboard" component={LeagueDashboardScreen} />
      <Stack.Screen name="AnswerQuinipolo" component={AnswerQuinipoloScreen} />
      <Stack.Screen name="ViewQuinipolo" component={ViewQuinipoloScreen} />
      <Stack.Screen name="JoinLeague" component={JoinLeagueScreen} />
      <Stack.Screen name="CreateLeague" component={CreateLeagueScreen} />
      <Stack.Screen name="LeagueSuccess" component={LeagueSuccessScreen} />
      <Stack.Screen name="Admin" component={AdminScreen} />
      <Stack.Screen name="CreateQuinipolo" component={CreateQuinipoloScreen} />
      <Stack.Screen
        name="QuinipoloSuccess"
        component={QuinipoloSuccessScreen}
      />
      <Stack.Screen
        name="CorrectionSuccess"
        component={CorrectionSuccessScreen}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
