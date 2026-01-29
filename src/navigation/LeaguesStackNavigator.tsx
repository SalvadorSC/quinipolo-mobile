import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LeaguesScreen from '../screens/LeaguesScreen';
import LeagueDashboardScreen from '../screens/LeagueDashboardScreen';
import ViewQuinipoloScreen from '../screens/ViewQuinipoloScreen';
import JoinLeagueScreen from '../screens/JoinLeagueScreen';
import CreateLeagueScreen from '../screens/CreateLeagueScreen';

export type LeaguesStackParamList = {
  Leagues: undefined;
  LeagueDashboard: { id: string };
  ViewQuinipolo: { quinipoloId: string };
  JoinLeague: undefined;
  CreateLeague: undefined;
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
    </Stack.Navigator>
  );
};

export default LeaguesStackNavigator;





