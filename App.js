import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';

// Import screens (simplified to 50%)
import HomeScreen from './src/screens/HomeScreen';
import PlayersScreen from './src/screens/PlayersScreen';
import AddPlayerScreen from './src/screens/AddPlayerScreen';
import EditPlayerScreen from './src/screens/EditPlayerScreen';
import PlayerDetailScreen from './src/screens/PlayerDetailScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import RecordMatchScreen from './src/screens/RecordMatchScreen';
import InsightsScreen from './src/screens/InsightsScreen';

const Tab = createBottomTabNavigator();
const PlayersStackNav = createStackNavigator();
const MatchesStackNav = createStackNavigator();

// Stack navigator for Players section
function PlayersStack() {
  return (
    <PlayersStackNav.Navigator>
      <PlayersStackNav.Screen 
        name="PlayersList" 
        component={PlayersScreen} 
        options={{ title: 'Players' }}
      />
      <PlayersStackNav.Screen 
        name="AddPlayer" 
        component={AddPlayerScreen} 
        options={{ title: 'Add Player' }}
      />
      <PlayersStackNav.Screen 
        name="EditPlayer" 
        component={EditPlayerScreen} 
        options={{ title: 'Edit Player' }}
      />
      <PlayersStackNav.Screen 
        name="PlayerDetail" 
        component={PlayerDetailScreen} 
        options={{ title: 'Player Details' }}
      />
    </PlayersStackNav.Navigator>
  );
}

function MatchesStack() {
  return (
    <MatchesStackNav.Navigator>
      <MatchesStackNav.Screen
        name="MatchesHome"
        component={MatchesScreen}
        options={{ title: 'Matches' }}
      />
      <MatchesStackNav.Screen
        name="RecordMatch"
        component={RecordMatchScreen}
        options={{ title: 'Record Match' }}
      />
    </MatchesStackNav.Navigator>
  );
}

// Matches section removed for 50% completion

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarActiveTintColor: '#1e40af',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 5,
        },
        headerStyle: {
          backgroundColor: '#1e3a8a',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Players" 
        component={PlayersStack}
        options={{ 
          headerShown: false,
          tabBarLabel: 'Players',
        }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchesStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Matches',
        }}
      />
      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        options={{
          title: 'Insights',
        }}
      />
    </Tab.Navigator>
  );
}

// Drawer removed per revert

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <NavigationContainer>
          <MainTabs />
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
});

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
