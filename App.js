import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import PlayersScreen from './src/screens/PlayersScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import InsightsScreen from './src/screens/InsightsScreen';
import AddPlayerScreen from './src/screens/AddPlayerScreen';
import EditPlayerScreen from './src/screens/EditPlayerScreen';
import PlayerDetailScreen from './src/screens/PlayerDetailScreen';
import RecordMatchScreen from './src/screens/RecordMatchScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { AuthService } from './src/utils/auth';

const Tab = createBottomTabNavigator();

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#1e40af',
    secondary: '#10b981',
    background: '#0f172a',
    surface: '#0b1223',
    surfaceVariant: '#132144',
    outline: '#334155',
    onPrimary: '#ffffff',
    onSurface: '#e2e8f0',
  },
};

const Stack = createStackNavigator();

function PlayersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PlayersList" component={PlayersScreen} options={{ title: 'Players' }} />
      <Stack.Screen name="AddPlayer" component={AddPlayerScreen} options={{ title: 'Add Player' }} />
      <Stack.Screen name="EditPlayer" component={EditPlayerScreen} options={{ title: 'Edit Player' }} />
      <Stack.Screen name="PlayerDetail" component={PlayerDetailScreen} options={{ title: 'Player Details' }} />
    </Stack.Navigator>
  );
}

function MatchesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MatchesList" component={MatchesScreen} options={{ title: 'Matches' }} />
      <Stack.Screen name="RecordMatch" component={RecordMatchScreen} options={{ title: 'Record Match' }} />
    </Stack.Navigator>
  );
}

function MainTabs({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const map = {
            Home: 'home-outline',
            Matches: 'list-outline',
            Insights: 'stats-chart-outline',
            Players: 'people-outline',
            Profile: 'person-outline',
          };
          const name = map[route.name] || 'ellipse-outline';
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Matches" component={MatchesStack} options={{ headerShown: false }} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Players" component={PlayersStack} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = checking, true/false = determined
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // 🐛 DEBUG: Clear login to see login page - REMOVE THIS LINE AFTER TESTING!
      await AuthService.clearAuthData();

      const loggedIn = await AuthService.isLoggedIn();
      setIsLoggedIn(loggedIn);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <PaperProvider theme={theme}>
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
        <StatusBar style="light" />
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <NavigationContainer>
          {isLoggedIn ? (
            <MainTabs onLogout={handleLogout} />
          ) : (
            <LoginScreen onLoginSuccess={handleLoginSuccess} />
          )}
        </NavigationContainer>
        <StatusBar style="light" />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
