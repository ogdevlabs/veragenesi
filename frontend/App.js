import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';

import { AuthProvider, useAuth } from './src/state/AuthContext';
import { AppProvider } from './src/state/AppContext';

import WelcomeScreen from './src/screens/WelcomeScreen';
import { COLORS } from './src/config/designSystem';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const PlaceholderScreen = ({ name }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    {/* Add more auth screens here */}
  </Stack.Navigator>
);

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
      component={() => <PlaceholderScreen name="Home" />}
      options={{ title: 'Home' }}
    />
  </Stack.Navigator>
);

const AppStack = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.text_tertiary,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeStack}
      options={{
        title: 'Home',
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={() => <PlaceholderScreen name="Profile" />}
      options={{
        title: 'Profile',
      }}
    />
    <Tab.Screen
      name="Settings"
      component={() => <PlaceholderScreen name="Settings" />}
      options={{
        title: 'Settings',
      }}
    />
    <Tab.Screen
      name="Help"
      component={() => <PlaceholderScreen name="Help" />}
      options={{
        title: 'Help',
      }}
    />
  </Tab.Navigator>
);

const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <RootNavigator />
      </AppProvider>
    </AuthProvider>
  );
}
