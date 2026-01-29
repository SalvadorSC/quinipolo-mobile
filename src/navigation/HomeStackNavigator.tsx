import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LeagueDashboardScreen from '../screens/LeagueDashboardScreen';
import AnswerQuinipoloScreen from '../screens/AnswerQuinipoloScreen';
import ViewQuinipoloScreen from '../screens/ViewQuinipoloScreen';
import JoinLeagueScreen from '../screens/JoinLeagueScreen';
import CreateLeagueScreen from '../screens/CreateLeagueScreen';
import AdminScreen from '../screens/AdminScreen';

export type HomeStackParamList = {
  Home: undefined;
  LeagueDashboard: { id: string };
  AnswerQuinipolo: { quinipoloId: string };
  ViewQuinipolo: { quinipoloId: string };
  JoinLeague: undefined;
  CreateLeague: undefined;
  Admin: undefined;
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
      <Stack.Screen name="Admin" component={AdminScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;





