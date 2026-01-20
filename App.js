import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PaperProvider, MD3DarkTheme, Text, Avatar, Divider, useTheme } from 'react-native-paper';

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

import { AuthService } from './src/utils/auth';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#22c55e', // Consistent Green
    secondary: '#10b981',
    background: '#0f172a',
    surface: '#1e293b',
    surfaceVariant: '#334155',
    outline: '#334155',
    onPrimary: '#ffffff',
    onSurface: '#e2e8f0',
  },
};

// --- STACK NAVIGATORS ---

function PlayersStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#1e293b' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' }
    }}>
      <Stack.Screen name="PlayersList" component={PlayersScreen} options={{ title: 'Squad Management' }} />
      <Stack.Screen name="AddPlayer" component={AddPlayerScreen} options={{ title: 'Add New Player' }} />
      <Stack.Screen name="EditPlayer" component={EditPlayerScreen} options={{ title: 'Update Player' }} />
      <Stack.Screen name="PlayerDetail" component={PlayerDetailScreen} options={{ title: 'Player Analytics' }} />
    </Stack.Navigator>
  );
}

function MatchesStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#1e293b' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' }
    }}>
      <Stack.Screen name="MatchesList" component={MatchesScreen} options={{ title: 'Match History' }} />
      <Stack.Screen name="RecordMatch" component={RecordMatchScreen} options={{ title: 'New Match Room' }} />
      <Stack.Screen name="MatchDetail" component={MatchDetailScreen} options={{ title: 'Performance Report' }} />
    </Stack.Navigator>
  );
}

// --- BOTTOM TAB NAVIGATOR ---

function MainTabs({ onLogout }) {
  const paperTheme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#1e293b' },
        headerTintColor: '#ffffff',
        tabBarStyle: {
          backgroundColor: '#1e293b',
          borderTopColor: '#334155',
          height: 60,
          paddingBottom: 8
        },
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarIcon: ({ color, size }) => {
          const map = {
            Home: 'home',
            VictoryWall: 'trophy',
            Profile: 'person-circle',
          };
          const name = map[route.name] || 'ellipse';
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="VictoryWall" component={VictoryFeedScreen} options={{ title: 'Victory Wall' }} />
      <Tab.Screen name="Profile" options={{ title: 'My Profile' }}>
        {props => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// --- CUSTOM DRAWER CONTENT ---

function CustomDrawerContent(props) {
  const { onLogout } = props;
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, backgroundColor: '#0f172a' }}>
      <View style={styles.drawerHeader}>
        <Avatar.Icon size={60} icon="cricket" backgroundColor="#22c55e" />
        <Text style={styles.drawerBrand}>CrickBoard</Text>
        <Text style={styles.drawerTagline}>Professional Scorer</Text>
      </View>
      <Divider style={{ backgroundColor: '#334155', marginVertical: 10 }} />

      <DrawerItemList {...props} />

      <View style={{ flex: 1 }} />

      <Divider style={{ backgroundColor: '#334155' }} />
      <DrawerItem
        label="Logout"
        labelStyle={{ color: '#ef4444', fontWeight: 'bold' }}
        onPress={() => {
          Alert.alert("Logout", "Are you sure you want to exit?", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", onPress: onLogout }
          ]);
        }}
        icon={({ color, size }) => <Ionicons name="log-out-outline" size={size} color="#ef4444" />}
      />
    </DrawerContentScrollView>
  );
}

// --- MAIN DRAWER NAVIGATOR ---

function MainDrawer({ onLogout }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} onLogout={onLogout} />}
      screenOptions={{
        headerShown: false, // Header is handled by stacks inside
        drawerStyle: { backgroundColor: '#1e293b', width: 280 },
        drawerActiveTintColor: '#22c55e',
        drawerInactiveTintColor: '#94a3b8',
        drawerLabelStyle: { fontWeight: '600' },
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        options={{
          drawerLabel: 'Home Dashboard',
          drawerIcon: ({ color, size }) => <Ionicons name="apps-outline" size={size} color={color} />
        }}
      >
        {props => <MainTabs {...props} onLogout={onLogout} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Matches"
        component={MatchesStack}
        options={{
          drawerLabel: 'Match History',
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="cricket" size={size} color={color} />
        }}
      />

      <Drawer.Screen
        name="Players"
        component={PlayersStack}
        options={{
          drawerLabel: 'Squad Management',
          drawerIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />
        }}
      />

      <Drawer.Screen
        name="Insights"
        component={InsightsScreen}
        options={{
          headerShown: true, // Insights is a single screen, needs a header
          headerStyle: { backgroundColor: '#1e293b' },
          headerTintColor: '#fff',
          drawerLabel: 'Performance Insights',
          drawerIcon: ({ color, size }) => <Ionicons name="analytics-outline" size={size} color={color} />
        }}
      />
    </Drawer.Navigator>
  );
}

// --- ROOT APP COMPONENT ---

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
          <ActivityIndicator size="large" color="#22c55e" />
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
            <MainDrawer onLogout={handleLogout} />
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
  drawerHeader: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  drawerBrand: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  drawerTagline: {
    color: '#22c55e',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
});
