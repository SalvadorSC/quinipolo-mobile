import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LeaguesScreen from '../screens/LeaguesScreen';
import LeagueDashboardScreen from '../screens/LeagueDashboardScreen';
import ViewQuinipoloScreen from '../screens/ViewQuinipoloScreen';
import JoinLeagueScreen from '../screens/JoinLeagueScreen';
import CreateLeagueScreen from '../screens/CreateLeagueScreen';
import AnswerQuinipoloScreen from '../screens/AnswerQuinipoloScreen';
import CreateQuinipoloScreen from '../screens/CreateQuinipoloScreen';
import QuinipoloSuccessScreen from '../screens/QuinipoloSuccessScreen';
import CorrectionSuccessScreen from '../screens/CorrectionSuccessScreen';

export type LeaguesStackParamList = {
  Leagues: undefined;
  LeagueDashboard: { id: string };
  ViewQuinipolo: { quinipoloId: string };
  JoinLeague: { shareToken?: string } | undefined;
  CreateLeague: undefined;
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
};

const Stack = createStackNavigator<LeaguesStackParamList>();

const LeaguesStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="Leagues" component={LeaguesScreen} />
      <Stack.Screen name="LeagueDashboard" component={LeagueDashboardScreen} />
      <Stack.Screen name="ViewQuinipolo" component={ViewQuinipoloScreen} />
      <Stack.Screen name="JoinLeague" component={JoinLeagueScreen} />
      <Stack.Screen name="CreateLeague" component={CreateLeagueScreen} />
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
    </Stack.Navigator>
  );
};

export default LeaguesStackNavigator;





