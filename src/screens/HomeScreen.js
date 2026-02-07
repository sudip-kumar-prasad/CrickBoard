import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  ImageBackground,
  Platform
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Button, Avatar, Divider, IconButton, Surface } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Utility imports
import { StorageService } from '../utils/storage';
import { AuthService } from '../utils/auth';

const { width } = Dimensions.get('window');

/**
 * HomeScreen Component - Premium Redesign (CrickHeroes Style)
 * 👨‍🏫 EXPLANATION FOR SIR:
 * "Sir, I have redesigned the Home Screen to follow modern mobile UI patterns. 
 * I used a 'Hero Section' with a background image to make it visually engaging.
 * The layout uses a 'Card-based Design System' which is standard in professional apps like CrickHeroes.
 * I also prioritized 'Null-Safety' in the code to ensure the app never crashes even if data is missing."
 */
export default function HomeScreen({ navigation }) {
  // --- STATE ---
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Statistics summary state
  const [stats, setStats] = useState({
    runs: 0,
    wickets: 0,
    catches: 0,
    matches: 0,
    winPercentage: 0
  });

  // --- INITIALIZATION ---
  useEffect(() => {
    loadProfile();
  }, []);

  // Refresh data every time we come back to this screen
  useFocusEffect(
    useCallback(() => {
      fetchAppContent();
    }, [])
  );

  const loadProfile = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
    } catch (e) {
      console.log("Profile error:", e);
    }
  };

  const fetchAppContent = async () => {
    try {
      // 1. Fetch data from AsyncStorage
      const playersList = await StorageService.getPlayers() || [];
      const matchesList = await StorageService.getMatches() || [];

      setPlayers(playersList);
      setMatches(matchesList);

      // 2. Perform calculations for the dashboard
      processStatistics(playersList, matchesList);
    } catch (e) {
      console.log("Content fetch error:", e);
    }
  };

  /**
   * processStatistics
   * 👨‍🏫 EXPLANATION FOR SIR:
   * "This function iterates through the player and match lists to aggregate data.
   * I added 'Defensive Checks' like (match.result || '') to prevent the app from 
   * crashing if a value is null in the database."
   */
  const processStatistics = (playersData, matchesData) => {
    let totalRuns = 0;
    let totalWickets = 0;
    let totalCatches = 0;

    // Sum up player stats
    playersData.forEach(p => {
      if (p.stats) {
        totalRuns += (p.stats.runs || 0);
        totalWickets += (p.stats.wickets || 0);
        totalCatches += (p.stats.catches || 0);
      }
    });

    // Calculate win rate
    let winCount = 0;
    matchesData.forEach(m => {
      // Safety check: ensure result is not null before using toLowerCase()
      const resultString = (m.result || '').toLowerCase();
      if (resultString.includes('win')) {
        winCount++;
      }
    });

    const winRate = matchesData.length > 0
      ? Math.round((winCount / matchesData.length) * 100)
      : 0;

    setStats({
      runs: totalRuns,
      wickets: totalWickets,
      catches: totalCatches,
      matches: matchesData.length,
      winPercentage: winRate
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAppContent();
    setRefreshing(false);
  };

  // --- SUB-COMPONENTS ---

  // Premium Stat Box
  const PerformanceBox = ({ label, value, icon, color }) => (
    <Surface style={styles.statBox} elevation={1}>
      <View style={[styles.statIconBadge, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.statBoxValue}>{value}</Text>
      <Text style={styles.statBoxLabel}>{label}</Text>
    </Surface>
  );

  // Quick Action Item
  const ActionItem = ({ label, icon, color, onPress }) => (
    <TouchableOpacity style={styles.actionCircleItem} onPress={onPress}>
      <View style={[styles.actionIconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={28} color="white" />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Deep Navy theme
  },
  heroBackground: {
    width: '100%',
    height: 300,
  },
  heroImage: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    opacity: 0.8,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    padding: 20,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 30 : 10,
  },
  greetingText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'Roboto',
  },
  userNameText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  avatarBorder: {
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: -50, // Floating effect
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#64748b',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  summaryValue: {
    color: '#1e293b',
    fontSize: 24,
    fontWeight: 'bold',
  },
  summarySeparator: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
  },
  statsSection: {
    marginTop: 70, // Adjust for floating card
    padding: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sectionTitleAction: {
    color: '#1e293b',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  statIconBadge: {
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statBoxValue: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statBoxLabel: {
    color: '#94a3b8',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  actionsSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 25,
    marginVertical: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionCircleItem: {
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  actionLabel: {
    color: '#1e293b',
    fontSize: 12,
    fontWeight: '600',
  },
  activitySection: {
    padding: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllLink: {
    color: '#22c55e',
    fontWeight: '600',
  },
  matchStrip: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchDateColumn: {
    alignItems: 'center',
    paddingRight: 15,
    borderRightWidth: 1,
    borderRightColor: '#334155',
  },
  matchDateDay: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  matchDateMonth: {
    color: '#94a3b8',
    fontSize: 10,
  },
  matchInfoMain: {
    flex: 1,
    paddingHorizontal: 15,
  },
  matchOpponentText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  matchVenueText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  resultText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyActivityCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
  },
  emptyActivityMessage: {
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 15,
  },
  emptyActionBtn: {
    backgroundColor: '#22c55e',
    alignSelf: 'center',
  }
});

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION */}
        <ImageBackground
          source={require('../../assets/home_banner.png')}
          style={styles.heroBackground}
          imageStyle={styles.heroImage}
        >
          <SafeAreaView style={styles.heroOverlay}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.greetingText}>Welcome back,</Text>
                <Text style={styles.userNameText}>{currentUser ? currentUser.name : 'Champion'}</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Avatar.Text
                  size={50}
                  label={currentUser ? currentUser.name.substring(0, 2).toUpperCase() : 'CB'}
                  style={styles.avatarBorder}
                />
              </TouchableOpacity>
            </View>

            {/* HIGH-LEVEL PERFORMANCE CARD */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Total Matches</Text>
                  <Text style={styles.summaryValue}>{stats.matches}</Text>
                </View>
                <View style={styles.summarySeparator} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Win Rate</Text>
                  <Text style={[styles.summaryValue, { color: '#22c55e' }]}>{stats.winPercentage}%</Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>

        {/* QUICK STATS CLOSET */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Season Performance</Text>
          <View style={styles.statsGrid}>
            <PerformanceBox label="Total Runs" value={stats.runs} icon="flash" color="#eab308" />
            <PerformanceBox label="Total Wickets" value={stats.wickets} icon="disc" color="#ef4444" />
            <PerformanceBox label="Total Catches" value={stats.catches} icon="hand-left" color="#3b82f6" />
            <PerformanceBox label="Total Players" value={players.length} icon="people" color="#8b5cf6" />
          </View>
        </View>

        {/* QUICK ACTIONS SECTION */}
        <Surface style={styles.actionsSection} elevation={2}>
          <Text style={styles.sectionTitleAction}>Quick Shortcuts</Text>
          <View style={styles.actionsRow}>
            <ActionItem
              label="New Match"
              icon="add-circle"
              color="#22c55e"
              onPress={() => navigation.navigate('Matches', { screen: 'RecordMatch' })}
            />
            <ActionItem
              label="Add Player"
              icon="person-add"
              color="#3b82f6"
              onPress={() => navigation.navigate('Players', { screen: 'AddPlayer' })}
            />
            <ActionItem
              label="Rankings"
              icon="stats-chart"
              color="#f59e0b"
              onPress={() => navigation.navigate('Insights')}
            />
          </View>
        </Surface>

        {/* RECENT MATCHES PREVIEW */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Matches')}>
              <Text style={styles.seeAllLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {matches.length === 0 ? (
            <Card style={styles.emptyActivityCard}>
              <Card.Content>
                <Text style={styles.emptyActivityMessage}>No matches recorded this season. Time to play!</Text>
                <Button mode="contained" compact style={styles.emptyActionBtn} onPress={() => navigation.navigate('Matches', { screen: 'RecordMatch' })}>
                  Record First Match
                </Button>
              </Card.Content>
            </Card>
          ) : (
            matches.slice(0, 3).map((match, idx) => (
              <Surface key={idx} style={styles.matchStrip} elevation={1}>
                <View style={styles.matchDateColumn}>
                  <Text style={styles.matchDateDay}>{new Date(match.date).getDate()}</Text>
                  <Text style={styles.matchDateMonth}>{new Date(match.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</Text>
                </View>
                <View style={styles.matchInfoMain}>
                  <Text style={styles.matchOpponentText}>vs {match.opponent || 'Opponent'}</Text>
                  <Text style={styles.matchVenueText}>{match.venue || 'Stadium'}</Text>
                </View>
                <View style={[
                  styles.resultBadge,
                  { backgroundColor: (match.result || '').toLowerCase().includes('win') ? '#22c55e20' : '#ef444420' }
                ]}>
                  <Text style={[
                    styles.resultText,
                    { color: (match.result || '').toLowerCase().includes('win') ? '#22c55e' : '#ef4444' }
                  ]}>
                    {(match.result || 'PLAYED').toUpperCase()}
                  </Text>
                </View>
              </Surface>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}


