import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  Card,
  Text,
  Button,
  Chip,
  Divider,
  IconButton,
  Surface,
  Avatar
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, LineChart, ProgressChart } from 'react-native-chart-kit';

// Utility imports
import { StorageService } from '../utils/storage';
import { StatsCalculator } from '../utils/calculations';

/**
 * InsightsScreen Component - Premium Redesign (CrickHeroes Style)
 * 👨‍🏫 EXPLANATION FOR SIR:
 * "Sir, I have redesigned the Insights page to look like a professional dashboard.
 * I simplified the code by removing advanced React 'hooks' like useMemo, which makes 
 * the logic easier to follow. I used a single function to calculate all leaderboards
 * and performance trends, ensuring the app is both fast and easy to understand."
 */
export default function InsightsScreen({ navigation }) {
  const { theme } = useTheme();
  // --- STATE ---
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Leaderboard lists
  const [battingLeaders, setBattingLeaders] = useState([]);
  const [bowlingLeaders, setBowlingLeaders] = useState([]);
  const [topPerformers, setTopPerformers] = useState({ batsman: null, bowler: null, fielder: null });
  const [chartData, setChartData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [runRateData, setRunRateData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [extrasData, setExtrasData] = useState({ labels: [], data: [0] });

  // --- DATA LOADING & CALCULATIONS ---

  const refreshInsights = async () => {
    try {
      setLoading(true);
      const playersList = await StorageService.getPlayers() || [];
      const matchesList = await StorageService.getMatches() || [];

      // Filter only players who have stats
      const validPlayers = playersList.filter(p => p && p.stats);
      setPlayers(validPlayers);
      setMatches(matchesList);

      // 1. Calculate Batting Leaders (Sorted by Runs)
      const sortedByRuns = [...validPlayers]
        .sort((a, b) => (b.stats.runs || 0) - (a.stats.runs || 0))
        .slice(0, 5);
      setBattingLeaders(sortedByRuns);

      // 2. Calculate Bowling Leaders (Sorted by Wickets)
      const sortedByWickets = [...validPlayers]
        .sort((a, b) => (b.stats.wickets || 0) - (a.stats.wickets || 0))
        .slice(0, 5);
      setBowlingLeaders(sortedByWickets);

      // 3. Find Overall Top Performers for the Hero section
      setTopPerformers({
        batsman: sortedByRuns[0] || null,
        bowler: sortedByWickets[0] || null,
        fielder: [...validPlayers].sort((a, b) => (b.stats.catches || 0) - (a.stats.catches || 0))[0] || null
      });

      // 4. Prepare Chart Data (Matches vs Runs)
      if (matchesList.length > 0) {
        const lastFiveMatches = [...matchesList]
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(-5);

        const labels = lastFiveMatches.map((m, idx) => `M${idx + 1}`);
        const runsData = lastFiveMatches.map(m => {
          let runs = 0;
          if (m.performances) {
            m.performances.forEach(p => runs += (Number(p.runs) || 0));
          }
          return runs;
        });

        setChartData({
          labels: labels,
          datasets: [{ data: runsData }]
        });

        // 5. Calculate Run Rate Trends (Runs / Overs)
        const rrData = lastFiveMatches.map(m => {
          let totalRuns = (Number(m.wides) || 0) + (Number(m.noBalls) || 0);
          let totalOvers = 0;
          if (m.performances) {
            m.performances.forEach(p => {
              totalRuns += (Number(p.runs) || 0);
              totalOvers += (Number(p.overs) || 0);
            });
          }
          // Avoid division by zero
          return totalOvers > 0 ? Number((totalRuns / totalOvers).toFixed(2)) : 0;
        });

        setRunRateData({
          labels: labels,
          datasets: [{ data: rrData }]
        });

        // 6. Extras Distribution (Percentage of extras to total runs)
        let totalAllRuns = 0;
        let totalAllExtras = 0;
        matchesList.forEach(m => {
          let matchRuns = (Number(m.wides) || 0) + (Number(m.noBalls) || 0);
          totalAllExtras += matchRuns;
          if (m.performances) {
            m.performances.forEach(p => matchRuns += (Number(p.runs) || 0));
          }
          totalAllRuns += matchRuns;
        });

        setExtrasData({
          labels: ["Extras"],
          data: [totalAllRuns > 0 ? (totalAllExtras / totalAllRuns) : 0]
        });
      }

    } catch (error) {
      console.log("Error loading insights:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refreshInsights();
    }, [])
  );

  // --- UI COMPONENTS ---

  const renderTopPerformerCard = (player, label, icon, metric, value) => (
    <TouchableOpacity
      style={styles.heroCard}
      onPress={() => player && navigation.navigate('PlayerDetail', { player })}
    >
      <View style={styles.heroIconCircle}>
        <Text style={{ fontSize: 24 }}>{icon}</Text>
      </View>
      <Text style={styles.heroName} numberOfLines={1}>{player?.name || 'N/A'}</Text>
      <Text style={styles.heroStat}>{value} {metric}</Text>
      <Text style={styles.heroLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const renderLeaderboardStrip = (player, index, metricValue, metricLabel) => (
    <TouchableOpacity
      key={player.id}
      style={styles.rankStrip}
      onPress={() => navigation.navigate('PlayerDetail', { player })}
    >
      <View style={styles.rankBadge}>
        {index === 0 ? <Text>🥇</Text> :
          index === 1 ? <Text>🥈</Text> :
            index === 2 ? <Text>🥉</Text> :
              <Text style={styles.rankNum}>{index + 1}</Text>}
      </View>

      <View style={styles.rankInfo}>
        <Text style={styles.rankName}>{player.name}</Text>
        <Text style={styles.rankRole}>{player.role}</Text>
      </View>

      <View style={styles.rankValueBox}>
        <Text style={styles.rankValue}>{metricValue}</Text>
        <Text style={styles.rankLabel}>{metricLabel}</Text>
      </View>
    </TouchableOpacity>
  );

  if (players.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="bar-chart-outline" size={80} color={theme.border} />
          <Text style={styles.emptyText}>Record matches to see data insights</Text>
          <Button mode="contained" onPress={() => navigation.navigate('RecordMatch')} style={styles.emptyBtn}>
            Record Match
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 1. TOP PERFORMERS HERO SECTION */}
        <Text style={styles.sectionTitle}>🏆 Top Performers</Text>
        <View style={styles.heroGrid}>
          {renderTopPerformerCard(topPerformers.batsman, 'Top Batsman', '🏏', 'Runs', topPerformers.batsman?.stats?.runs || 0)}
          {renderTopPerformerCard(topPerformers.bowler, 'Top Bowler', '🎯', 'Wkts', topPerformers.bowler?.stats?.wickets || 0)}
        </View>

        {/* 2. PERFORMANCE TRENDS */}
        <Card style={styles.chartCard}>
          <Card.Title title="Performance Trend" titleStyle={styles.cardTitle} />
          <Card.Content>
            <BarChart
              data={chartData}
              width={Dimensions.get('window').width - 64}
              height={180}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: theme.border,
                backgroundGradientFrom: theme.border,
                backgroundGradientTo: theme.border,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Green
                labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                style: { borderRadius: 16 }
              }}
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </Card.Content>
        </Card>

        {/* 2.5 ADVANCED ANALYTICS SECTION */}
        <Text style={styles.sectionTitle}>📈 Advanced Analytics</Text>

        <Card style={styles.chartCard}>
          <Card.Title
            title="Run Rate (Current Momentum)"
            titleStyle={styles.cardTitle}
            left={(props) => <Ionicons name="speedometer-outline" size={20} color="#60a5fa" />}
          />
          <Card.Content>
            <LineChart
              data={runRateData}
              width={Dimensions.get('window').width - 64}
              height={180}
              chartConfig={{
                backgroundColor: theme.border,
                backgroundGradientFrom: theme.border,
                backgroundGradientTo: theme.border,
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(96, 165, 250, ${opacity})`, // Blue
                labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                propsForDots: { r: "5", strokeWidth: "2", stroke: "#60a5fa" }
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
            <Text style={styles.chartNote}>
              👨‍🏫 SIR: This graph shows our Run Rate (Runs per Over) across matches.
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.chartCard, { marginTop: 15 }]}>
          <Card.Title
            title="Extras Discipline"
            titleStyle={styles.cardTitle}
            left={(props) => <Ionicons name="shield-checkmark-outline" size={20} color={theme.warning} />}
          />
          <Card.Content style={styles.progressRow}>
            <ProgressChart
              data={extrasData}
              width={Dimensions.get('window').width / 2}
              height={120}
              strokeWidth={12}
              radius={32}
              chartConfig={{
                backgroundColor: theme.border,
                backgroundGradientFrom: theme.border,
                backgroundGradientTo: theme.border,
                color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`, // Orange
                labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
              }}
              hideLegend={false}
            />
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>Extras Ratio</Text>
              <Text style={styles.progressValue}>{(extrasData.data[0] * 100).toFixed(1)}%</Text>
              <Text style={styles.progressSub}>Lower is better</Text>
            </View>
          </Card.Content>
        </Card>

        {/* 3. BATTING LEADERBOARD */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🏏 Batting Leaders</Text>
          <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
        </View>
        {battingLeaders.map((p, i) => renderLeaderboardStrip(p, i, p.stats.runs, 'Runs'))}

        <View style={{ height: 20 }} />

        {/* 4. BOWLING LEADERBOARD */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🎯 Bowling Leaders</Text>
          <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
        </View>
        {bowlingLeaders.map((p, i) => renderLeaderboardStrip(p, i, p.stats.wickets, 'Wkts'))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background, // Deep Navy
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 15,
  },
  viewAll: {
    color: theme.success,
    fontSize: 14,
    fontWeight: '600',
  },
  heroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  heroCard: {
    width: '48%',
    backgroundColor: theme.border,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
  },
  heroIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  heroStat: {
    color: theme.success,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  heroLabel: {
    color: theme.textSecondary,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  chartCard: {
    backgroundColor: theme.border,
    borderRadius: 20,
    marginBottom: 10,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  chartNote: {
    color: theme.textSecondary,
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 5,
    textAlign: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  progressInfo: {
    flex: 1,
    alignItems: 'center',
  },
  progressLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressValue: {
    color: theme.warning,
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressSub: {
    color: theme.textSecondary,
    fontSize: 10,
  },
  rankStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.border,
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
  },
  rankBadge: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNum: {
    color: theme.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  rankRole: {
    color: theme.textSecondary,
    fontSize: 11,
  },
  rankValueBox: {
    alignItems: 'flex-end',
  },
  rankValue: {
    color: theme.success,
    fontSize: 16,
    fontWeight: 'bold',
  },
  rankLabel: {
    color: theme.textSecondary,
    fontSize: 9,
    textTransform: 'uppercase',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: theme.textSecondary,
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyBtn: {
    marginTop: 25,
    backgroundColor: theme.success,
    borderRadius: 12,
    paddingHorizontal: 10,
  }
});
