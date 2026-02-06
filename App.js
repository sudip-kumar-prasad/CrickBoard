import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import CustomDrawer from './src/components/CustomDrawer';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import PlayersScreen from './src/screens/PlayersScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import InsightsScreen from './src/screens/InsightsScreen';
import AddPlayerScreen from './src/screens/AddPlayerScreen';
import EditPlayerScreen from './src/screens/EditPlayerScreen';
import PlayerDetailScreen from './src/screens/PlayerDetailScreen';
import RecordMatchScreen from './src/screens/RecordMatchScreen';
import MatchDetailScreen from './src/screens/MatchDetailScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import VictoryFeedScreen from './src/screens/VictoryFeedScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TournamentScreen from './src/screens/TournamentScreen';
import CreateTournamentScreen from './src/screens/CreateTournamentScreen';
import TournamentDetailScreen from './src/screens/TournamentDetailScreen';

import { AuthService } from './src/utils/auth';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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

function PlayersStack({ onOpenDrawer }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerLeft: () => onOpenDrawer ? (
          <TouchableOpacity onPress={onOpenDrawer} style={{ marginLeft: 16 }}>
            <Ionicons name="menu" size={28} color="#e2e8f0" />
          </TouchableOpacity>
        ) : null,
        headerStyle: { backgroundColor: '#0b1223' },
        headerTintColor: '#e2e8f0',
      }}
    >
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
      <Stack.Screen name="MatchDetail" component={MatchDetailScreen} options={{ title: 'Match Detail' }} />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator - Core features
function MainTabs({ onLogout, onOpenDrawer }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const map = {
            Home: 'home-outline',
            Matches: 'list-outline',
            Community: 'people-circle-outline',
          };
          const name = map[route.name] || 'ellipse-outline';
          return <Ionicons name={name} size={size} color={color} />;
        },
        headerLeft: () => (
          <TouchableOpacity onPress={onOpenDrawer} style={{ marginLeft: 16 }}>
            <Ionicons name="menu" size={28} color="#e2e8f0" />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: '#0b1223',
        },
        headerTintColor: '#e2e8f0',
        tabBarStyle: {
          backgroundColor: '#0b1223',
          borderTopColor: '#334155',
        },
        tabBarActiveTintColor: '#1e40af',
        tabBarInactiveTintColor: '#64748b',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Matches" component={MatchesStack} options={{ headerShown: false }} />
      <Tab.Screen name="Community" component={VictoryFeedScreen} />
    </Tab.Navigator>
  );
}

// Stack navigators for drawer items
function InsightsStack({ onOpenDrawer }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity onPress={onOpenDrawer} style={{ marginLeft: 16 }}>
            <Ionicons name="menu" size={28} color="#e2e8f0" />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: '#0b1223' },
        headerTintColor: '#e2e8f0',
      }}
    >
      <Stack.Screen name="InsightsScreen" component={InsightsScreen} options={{ title: 'Insights' }} />
    </Stack.Navigator>
  );
}

function ProfileStack({ onOpenDrawer, onLogout }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity onPress={onOpenDrawer} style={{ marginLeft: 16 }}>
            <Ionicons name="menu" size={28} color="#e2e8f0" />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: '#0b1223' },
        headerTintColor: '#e2e8f0',
      }}
    >
      <Stack.Screen name="ProfileScreen" options={{ title: 'Profile' }}>
        {props => <ProfileScreen {...props} onLogout={onLogout} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function SettingsStack({ onOpenDrawer }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity onPress={onOpenDrawer} style={{ marginLeft: 16 }}>
            <Ionicons name="menu" size={28} color="#e2e8f0" />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: '#0b1223' },
        headerTintColor: '#e2e8f0',
      }}
    >
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Stack.Navigator>
  );
}

function TournamentStack({ onOpenDrawer }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity onPress={onOpenDrawer} style={{ marginLeft: 16 }}>
            <Ionicons name="menu" size={28} color="#e2e8f0" />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: '#0b1223' },
        headerTintColor: '#e2e8f0',
      }}
    >
      <Stack.Screen name="TournamentScreen" component={TournamentScreen} options={{ title: 'Tournaments' }} />
      <Stack.Screen name="CreateTournament" component={CreateTournamentScreen} options={{ title: 'Create Tournament' }} />
      <Stack.Screen name="TournamentDetail" component={TournamentDetailScreen} options={{ title: 'Tournament Details' }} />
    </Stack.Navigator>
  );
}

function MainNavigator({ onLogout }) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const navigationRef = React.useRef(null);

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs">
            {props => <MainTabs {...props} onLogout={onLogout} onOpenDrawer={() => setDrawerVisible(true)} />}
          </Stack.Screen>
          <Stack.Screen name="Insights">
            {props => <InsightsStack {...props} onOpenDrawer={() => setDrawerVisible(true)} />}
          </Stack.Screen>
          <Stack.Screen name="Players">
            {props => <PlayersStack {...props} onOpenDrawer={() => setDrawerVisible(true)} />}
          </Stack.Screen>
          <Stack.Screen name="Settings">
            {props => <SettingsStack {...props} onOpenDrawer={() => setDrawerVisible(true)} />}
          </Stack.Screen>
          <Stack.Screen name="Tournament">
            {props => <TournamentStack {...props} onOpenDrawer={() => setDrawerVisible(true)} />}
          </Stack.Screen>
          <Stack.Screen name="Profile">
            {props => <ProfileStack {...props} onOpenDrawer={() => setDrawerVisible(true)} onLogout={onLogout} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <CustomDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        navigation={navigationRef.current}
        onLogout={onLogout}
      />
    </>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
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
        {isLoggedIn ? (
          <MainNavigator onLogout={handleLogout} />
        ) : (
          <NavigationContainer>
            <LoginScreen onLoginSuccess={handleLoginSuccess} />
          </NavigationContainer>
        )}
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
