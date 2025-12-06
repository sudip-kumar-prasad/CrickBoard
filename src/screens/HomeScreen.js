import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { Text, Card, Button, Avatar, Divider, IconButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// We import our own utility services to get data
import { StorageService } from '../utils/storage';
import { StatsCalculator } from '../utils/calculations';
import { AuthService } from '../utils/auth';

/**
 * HomeScreen Component
 * This is the main dashboard of the application.
 * It shows summary statistics and quick actions for the user.
 */
export default function HomeScreen({ navigation }) {
  // --- STATE VARIABLES ---
  // We use useState to store data that might change as we use the app
  const [players, setPlayers] = useState([]);      // List of all players
  const [matches, setMatches] = useState([]);      // List of all matches
  const [currentUser, setCurrentUser] = useState(null); // Current logged-in user
  const [refreshing, setRefreshing] = useState(false); // For "pull to refresh"

  // Summary object to store calculated totals
  const [summary, setSummary] = useState({
    totalRuns: 0,
    totalWickets: 0,
    matchesPlayed: 0,
    playerCount: 0,
    winRate: 0
  });

  // --- DATA LOADING ---

  // This runs once when the screen first loads
  useEffect(() => {
    loadUser();
  }, []);

  // This runs every time the screen comes into focus (like when coming back from another screen)
  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  // Function to get the logged-in user details
  const loadUser = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.log("Error loading user:", error);
    }
  };

  // Main function to fetch all data from storage
  const getData = async () => {
    try {
      // Fetch both players and matches at the same time
      const playersList = await StorageService.getPlayers();
      const matchesList = await StorageService.getMatches();

      setPlayers(playersList);
      setMatches(matchesList);

      // Now calculate the summary stats
      calculateSummary(playersList, matchesList);
    } catch (error) {
      console.log("Error getting data:", error);
    }
  };

  // Function to calculate summary stats from the lists
  const calculateSummary = (playerList, matchList) => {
    // 1. Total Runs and Wickets
    let runs = 0;
    let wickets = 0;
    playerList.forEach(player => {
      if (player.stats) {
        runs += (player.stats.runs || 0);
        wickets += (player.stats.wickets || 0);
      }
    });

    // 2. Win Rate
    let wins = 0;
    matchList.forEach(match => {
      if (match.result && match.result.toLowerCase().includes('win')) {
        wins++;
      }
    });

    let rate = matchList.length > 0 ? Math.round((wins / matchList.length) * 100) : 0;

    // Update the summary state
    setSummary({
      totalRuns: runs,
      totalWickets: wickets,
      matchesPlayed: matchList.length,
      playerCount: playerList.length,
      winRate: rate
    });
  };

  // Function for Pull-to-Refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  };

  // --- UI HELPER COMPONENTS ---

  // A small component for the stat cards on the dashboard
  const StatCard = ({ title, value, icon, color }) => (
    <Card style={[styles.statCard, { borderLeftColor: color }]}>
      <Card.Content style={styles.statContent}>
        <Avatar.Icon size={40} icon={icon} backgroundColor={color} color="white" />
        <View style={styles.statTextContainer}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  // --- MAIN RENDER ---
  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#3b82f6']} />
        }
      >
        {/* 1. Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Hello,</Text>
            <Text style={styles.nameText}>{currentUser ? currentUser.name : 'Cricketer'}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Avatar.Text
              size={50}
              label={currentUser ? currentUser.name.substring(0, 2).toUpperCase() : 'CB'}
              style={styles.profileIcon}
            />
          </TouchableOpacity>
        </View>

        {/* 2. Main Dashboard Card */}
        <Card style={styles.mainDashboard}>
          <Card.Content>
            <Text style={styles.dashboardTitle}>Team Performance</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Win Rate</Text>
                <Text style={styles.statMainValue}>{summary.winRate}%</Text>
              </View>
              <Divider style={styles.verticalDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Matches</Text>
                <Text style={styles.statMainValue}>{summary.matchesPlayed}</Text>
              </View>
              <Divider style={styles.verticalDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Players</Text>
                <Text style={styles.statMainValue}>{summary.playerCount}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* 3. Detailed Stats Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Key Stats</Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard title="Total Runs" value={summary.totalRuns} icon="thunderstorm-outline" color="#f59e0b" />
          <StatCard title="Wickets" value={summary.totalWickets} icon="target" color="#ef4444" />
        </View>

        {/* 4. Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Matches', { screen: 'RecordMatch' })}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#3b82f6' }]}>
              <Ionicons name="add-circle" size={30} color="white" />
            </View>
            <Text style={styles.actionText}>New Match</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Players', { screen: 'AddPlayer' })}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#10b981' }]}>
              <Ionicons name="person-add" size={30} color="white" />
            </View>
            <Text style={styles.actionText}>Add Player</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Insights')}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#8b5cf6' }]}>
              <Ionicons name="bar-chart" size={30} color="white" />
            </View>
            <Text style={styles.actionText}>Insights</Text>
          </TouchableOpacity>
        </View>

        {/* 5. Recent Activity Preview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Matches</Text>
          <Button onPress={() => navigation.navigate('Matches')}>View All</Button>
        </View>

        {matches.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No matches recorded yet. Start by adding one!</Text>
            </Card.Content>
          </Card>
        ) : (
          matches.slice(0, 3).map((match, index) => (
            <Card key={index} style={styles.matchCard}>
              <Card.Content style={styles.matchContent}>
                <View style={styles.matchInfo}>
                  <Text style={styles.matchOpponent}>vs {match.opponent}</Text>
                  <Text style={styles.matchDate}>{new Date(match.date).toDateString()}</Text>
                </View>
                <View style={styles.matchResultContainer}>
                  <Text style={[
                    styles.matchResult,
                    { color: match.result.toLowerCase().includes('win') ? '#10b981' : '#ef4444' }
                  ]}>
                    {match.result}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#0f172a', // Dark theme background
  },
  scrollView: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 25,
  },
  welcomeText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  nameText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileIcon: {
    backgroundColor: '#3b82f6',
  },
  mainDashboard: {
    backgroundColor: '#1e293b',
    borderRadius: 15,
    marginBottom: 20,
    elevation: 4,
  },
  dashboardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 5,
  },
  statMainValue: {
    color: '#3b82f6',
    fontSize: 20,
    fontWeight: 'bold',
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#334155',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statTextContainer: {
    marginLeft: 10,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statTitle: {
    color: '#94a3b8',
    fontSize: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    width: '30%',
    backgroundColor: '#1e293b',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  actionIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  matchCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginBottom: 10,
  },
  matchContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchInfo: {
    flex: 1,
  },
  matchOpponent: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  matchDate: {
    color: '#94a3b8',
    fontSize: 12,
  },
  matchResultContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#0f172a',
  },
  matchResult: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyCard: {
    backgroundColor: '#1e293b',
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    textAlign: 'center',
  },
  bottomSpace: {
    height: 30,
  }
});
