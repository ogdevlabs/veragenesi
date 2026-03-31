import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Text } from 'react-native';

import { AuthProvider, useAuth } from './src/state/AuthContext';
import { AppProvider, useApp } from './src/state/AppContext';

// Screen imports
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import ArchetypeQuizScreen from './src/screens/ArchetypeQuizScreen';
import EIAssessmentScreen from './src/screens/EIAssessmentScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import HomeScreen from './src/screens/HomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ToolDetailScreen from './src/screens/ToolDetailScreen';
import ToolExecutionScreen from './src/screens/ToolExecutionScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HelpScreen from './src/screens/HelpScreen';

import { COLORS } from './src/config/designSystem';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Onboarding Flow (Welcome -> Login/Signup -> Assessments -> Results)
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerBackTitle: 'Atrás',
      headerTintColor: COLORS.primary,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ title: 'Iniciar Sesión' }}
    />
    <Stack.Screen
      name="Signup"
      component={SignupScreen}
      options={{ title: 'Crear Cuenta' }}
    />
  </Stack.Navigator>
);

// Assessment Flow (after login — shows dashboard first, then quizzes)
const AssessmentStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerBackTitle: 'Atrás',
      headerTintColor: COLORS.primary,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{ title: 'Mi Progreso', headerLeft: () => null }}
    />
    <Stack.Screen
      name="ArchetypeQuiz"
      component={ArchetypeQuizScreen}
      options={{
        title: 'Tu Arquetipo',
        headerLeft: () => null,
      }}
    />
    <Stack.Screen
      name="EIAssessment"
      component={EIAssessmentScreen}
      options={{
        title: 'Evaluación de IE',
        headerLeft: () => null,
      }}
    />
    <Stack.Screen
      name="Results"
      component={ResultsScreen}
      options={{
        title: 'Tus Resultados',
        headerLeft: () => null,
      }}
    />
  </Stack.Navigator>
);

// Home Stack (main app with tool browsing)
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerBackTitle: 'Atrás',
      headerTintColor: COLORS.primary,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ headerShown: false, title: 'Casa' }}
    />
    <Stack.Screen
      name="ToolDetail"
      component={ToolDetailScreen}
      options={({ route }) => ({
        title: route.params?.tool?.name || 'Detalles de Herramienta',
      })}
    />
    <Stack.Screen
      name="ToolExecution"
      component={ToolExecutionScreen}
      options={({ route }) => ({
        title: route.params?.tool?.name || 'Herramienta',
        headerLeft: () => null,
      })}
    />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerBackTitle: 'Atrás',
      headerTintColor: COLORS.primary,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{ headerShown: false, title: 'Perfil' }}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ title: 'Configuración' }}
    />
  </Stack.Navigator>
);

// Main Tab Navigation (after onboarding)
const AppStack = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.text_tertiary,
      headerShown: false,
      tabBarStyle: {
        borderTopColor: COLORS.border,
        backgroundColor: COLORS.background,
        height: 58,
        paddingBottom: 8,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
      },
    }}
  >
    <Tab.Screen
      name="DashboardTab"
      component={DashboardScreen}
      options={{
        title: 'Inicio',
        tabBarLabel: 'Inicio',
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20 }}>{focused ? '🏠' : '🏡'}</Text>
        ),
      }}
    />
    <Tab.Screen
      name="HomeTab"
      component={HomeStack}
      options={{
        title: 'Herramientas',
        tabBarLabel: 'Herramientas',
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20 }}>{focused ? '🛠️' : '🔧'}</Text>
        ),
      }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileStack}
      options={{
        title: 'Perfil',
        tabBarLabel: 'Perfil',
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20 }}>{focused ? '👤' : '👥'}</Text>
        ),
      }}
    />
    <Tab.Screen
      name="HelpTab"
      component={HelpScreen}
      options={{
        title: 'Ayuda',
        tabBarLabel: 'Ayuda',
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20 }}>{focused ? '❓' : '💬'}</Text>
        ),
      }}
    />
  </Tab.Navigator>
);

// Main Navigator that shows Auth or OnboardingOrApp based on state
const MainNavigator = () => {
  const { user, isLoading, token } = useAuth();
  const { archetypeResults, eiResults } = useApp();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Not authenticated - show auth flow
  if (!token) {
    return <AuthStack />;
  }

  // Authenticated but not onboarded - show assessment flow
  if (!archetypeResults || !eiResults) {
    return <AssessmentStack />;
  }

  // Fully set up - show main app
  return <AppStack />;
};

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <MainNavigator />
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
