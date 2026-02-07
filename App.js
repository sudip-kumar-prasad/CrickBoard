import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import CustomDrawer from './src/components/CustomDrawer';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

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
    background: '#0f172a',
    surface: '#0b1223',
  },
};

// Matches Stack Navigator
function MatchesStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.backgroundCard },
        headerTintColor: theme.text,
      }}
    >
      <Stack.Screen name="MatchesList" component={MatchesScreen} options={{ title: 'Matches' }} />
      <Stack.Screen name="RecordMatch" component={RecordMatchScreen} options={{ title: 'Record Match' }} />
      <Stack.Screen name="MatchDetail" component={MatchDetailScreen} options={{ title: 'Match Details' }} />
    </Stack.Navigator>
  );
}

// Players Stack Navigator
function PlayersStack({ onOpenDrawer }) {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerLeft: () => onOpenDrawer ? (
          <TouchableOpacity onPress={onOpenDrawer} style={{ marginLeft: 16 }}>
            <Ionicons name="menu" size={28} color={theme.text} />
          </TouchableOpacity>
        ) : null,
        headerStyle: { backgroundColor: theme.backgroundCard },
        headerTintColor: theme.text,
      }}
    >
      <Stack.Screen name="PlayersList" component={PlayersScreen} options={{ title: 'Players' }} />
      <Stack.Screen name="AddPlayer" component={AddPlayerScreen} options={{ title: 'Add Player' }} />
      <Stack.Screen name="EditPlayer" component={EditPlayerScreen} options={{ title: 'Edit Player' }} />
      <Stack.Screen name="PlayerDetail" component={PlayerDetailScreen} options={{ title: 'Player Details' }} />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator
function MainTabs({ onLogout, onOpenDrawer }) {
  const { theme } = useTheme();
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
            <Ionicons name="menu" size={28} color={theme.text} />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: theme.backgroundCard,
        },
        headerTintColor: theme.text,
        tabBarStyle: {
          backgroundColor: theme.backgroundCard,
          borderTopColor: theme.border,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textTertiary,
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
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity onPress={onOpenDrawer} style={{ marginLeft: 16 }}>
            <Ionicons name="menu" size={28} color={theme.text} />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: theme.backgroundCard },
        headerTintColor: theme.text,
      }}
    >
      <Stack.Screen name="InsightsScreen" component={InsightsScreen} options={{ title: 'Insights' }} />
    </Stack.Navigator>
  );
}

function ProfileStack({ onOpenDrawer, onLogout }) {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity onPress={onOpenDrawer} style={{ marginLeft: 16 }}>
            <Ionicons name="menu" size={28} color={theme.text} />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: theme.backgroundCard },
        headerTintColor: theme.text,
      }}
    >
      <Stack.Screen name="ProfileScreen" options={{ title: 'Profile' }}>
        {props => <ProfileScreen {...props} onLogout={onLogout} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function SettingsStack({ onOpenDrawer }) {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity onPress={onOpenDrawer} style={{ marginLeft: 16 }}>
            <Ionicons name="menu" size={28} color={theme.text} />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: theme.backgroundCard },
        headerTintColor: theme.text,
      }}
    >
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Stack.Navigator>
  );
}

function TournamentStack({ onOpenDrawer }) {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity onPress={onOpenDrawer} style={{ marginLeft: 16 }}>
            <Ionicons name="menu" size={28} color={theme.text} />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: theme.backgroundCard },
        headerTintColor: theme.text,
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
  const { theme } = useTheme();

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
      console.error('Error logging out:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <PaperProvider theme={theme}>
        <View style={styles.container}>
          {isLoggedIn ? (
            <MainNavigator onLogout={handleLogout} />
          ) : (
            <NavigationContainer>
              <LoginScreen onLoginSuccess={handleLoginSuccess} />
            </NavigationContainer>
          )}
          <StatusBar style="auto" />
        </View>
      </PaperProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
});
