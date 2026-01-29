import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import HomeStackNavigator from './HomeStackNavigator';
import LeaguesStackNavigator from './LeaguesStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import { colors } from '../styles/globalStyles';

export type BottomTabParamList = {
  HomeStack: undefined;
  LeaguesStack: undefined;
  ProfileStack: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap;

          if (route.name === 'HomeStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'LeaguesStack') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'ProfileStack') {
            iconName = focused ? 'account' : 'account-outline';
          } else {
            iconName = 'home-outline';
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: t('home') || 'Home',
        }}
      />
      <Tab.Screen
        name="LeaguesStack"
        component={LeaguesStackNavigator}
        options={{
          tabBarLabel: t('leagues') || 'Leagues',
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: t('profile') || 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

