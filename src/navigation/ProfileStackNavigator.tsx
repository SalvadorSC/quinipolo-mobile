import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen';
import LeagueDashboardScreen from '../screens/LeagueDashboardScreen';
import ViewQuinipoloScreen from '../screens/ViewQuinipoloScreen';

export type ProfileStackParamList = {
  Profile: undefined;
  LeagueDashboard: { id: string };
  ViewQuinipolo: { quinipoloId: string };
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
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;





