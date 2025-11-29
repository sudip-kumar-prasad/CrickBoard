import React, { useCallback, useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  Card,
  Text,
  Button,
  List,
  Divider,
  IconButton,
  Chip,
} from 'react-native-paper';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { StorageService } from '../utils/storage';
import { StatsCalculator } from '../utils/calculations';

const chartConfig = {
  backgroundGradientFrom: '#0f172a',
  backgroundGradientTo: '#1e293b',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(226, 232, 240, ${opacity})`,
  fillShadowGradient: '#3b82f6',
  fillShadowGradientOpacity: 0.6,
  strokeWidth: 2,
  barPercentage: 0.7,
  propsForDots: {
    r: '5',
    strokeWidth: '2',
    stroke: '#60a5fa',
    fill: '#3b82f6',
  },
  propsForBackgroundLines: {
    strokeDasharray: '',
    stroke: '#334155',
    strokeWidth: 1,
  },
};

const MEDAL_COLORS = {
  gold: '#fbbf24',
  silver: '#94a3b8',
  bronze: '#d97706',
};

export default function InsightsScreen({ navigation }) {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [playersData, matchesData] = await Promise.all([
        StorageService.getPlayers(),
        StorageService.getMatches(),
      ]);
      setPlayers(playersData.filter(p => p && p.stats));
      setMatches(matchesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const leaderboards = useMemo(() => {
    const validPlayers = players.filter(p => p && p.stats);
    
    const byRuns = [...validPlayers]
      .sort((a, b) => (b.stats?.runs || 0) - (a.stats?.runs || 0))
      .slice(0, 10);
    
    const byWickets = [...validPlayers]
      .sort((a, b) => (b.stats?.wickets || 0) - (a.stats?.wickets || 0))
      .slice(0, 10);
    
    const byCatches = [...validPlayers]
      .sort((a, b) => (b.stats?.catches || 0) - (a.stats?.catches || 0))
      .slice(0, 10);

    const byBattingAvg = [...validPlayers]
      .filter(p => p.stats?.matches > 0)
      .map(p => ({
        ...p,
        avg: StatsCalculator.calculateBattingAverage(p.stats?.runs || 0, p.stats?.matches || 0),
      }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 5);

    const byBowlingAvg = [...validPlayers]
      .filter(p => p.stats?.wickets > 0)
      .map(p => ({
        ...p,
        avg: StatsCalculator.calculateBowlingAverage(
          p.stats?.runsConceded || 0,
          p.stats?.wickets || 0
        ),
      }))
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 5);

    const byStrikeRate = [...validPlayers]
      .filter(p => p.stats?.balls > 0)
      .map(p => ({
        ...p,
        sr: StatsCalculator.calculateStrikeRate(p.stats?.runs || 0, p.stats?.balls || 0),
      }))
      .sort((a, b) => b.sr - a.sr)
      .slice(0, 5);

    return { byRuns, byWickets, byCatches, byBattingAvg, byBowlingAvg, byStrikeRate };
  }, [players]);

  const trendData = useMemo(() => {
    if (matches.length === 0) {
      return {
        labels: [],
        datasets: [{ data: [] }],
      };
    }

    const sortedMatches = [...matches]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-6);
    
    const totals = sortedMatches.map((match) =>
      match.performances?.reduce(
        (sum, perf) => sum + (Number(perf.runs) || 0),
        0
      ) || 0
    );

    const wickets = sortedMatches.map((match) =>
      match.performances?.reduce(
        (sum, perf) => sum + (Number(perf.wickets) || 0),
        0
      ) || 0
    );

    return {
      labels: sortedMatches.map((match) =>
        new Date(match.date).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        })
      ),
      datasets: [
        { data: totals, color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})` },
        { data: wickets, color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})` },
      ],
    };
  }, [matches]);

  const overallSummary = useMemo(() => {
    if (players.length === 0) {
      return null;
    }

    const validPlayers = players.filter(p => p && p.stats);
    const totalRuns = validPlayers.reduce((sum, player) => sum + (player.stats?.runs || 0), 0);
    const totalWickets = validPlayers.reduce(
      (sum, player) => sum + (player.stats?.wickets || 0),
      0
    );
    const totalBalls = validPlayers.reduce((sum, player) => sum + (player.stats?.balls || 0), 0);
    const totalOvers = validPlayers.reduce((sum, player) => sum + (player.stats?.overs || 0), 0);
    const totalRunsConceded = validPlayers.reduce(
      (sum, player) => sum + (player.stats?.runsConceded || 0),
      0
    );
    const totalCatches = validPlayers.reduce(
      (sum, player) => sum + (player.stats?.catches || 0),
      0
    );
    const totalMatches = validPlayers.reduce(
      (sum, player) => sum + (player.stats?.matches || 0),
      0
    );

    const strikeRate = StatsCalculator.calculateStrikeRate(totalRuns, totalBalls);
    const economy = StatsCalculator.calculateEconomyRate(totalRunsConceded, totalOvers);
    const avgRunsPerMatch = matches.length > 0 ? Math.round(totalRuns / matches.length) : 0;
    const avgWicketsPerMatch = matches.length > 0 ? (totalWickets / matches.length).toFixed(1) : 0;

    return {
      totalRuns,
      totalWickets,
      totalCatches,
      totalMatches,
      strikeRate,
      economy,
      avgRunsPerMatch,
      avgWicketsPerMatch,
    };
  }, [players, matches]);

  const roleDistribution = useMemo(() => {
    const roles = {};
    players.forEach((player) => {
      const role = player.role || 'Unknown';
      roles[role] = (roles[role] || 0) + 1;
    });
    return roles;
  }, [players]);

  const topPerformers = useMemo(() => {
    if (players.length === 0) return null;

    const validPlayers = players.filter(p => p && p.stats);
    const topBatsman = [...validPlayers].sort(
      (a, b) => (b.stats?.runs || 0) - (a.stats?.runs || 0)
    )[0];
    const topBowler = [...validPlayers].sort(
      (a, b) => (b.stats?.wickets || 0) - (a.stats?.wickets || 0)
    )[0];
    const topFielder = [...validPlayers].sort(
      (a, b) => (b.stats?.catches || 0) - (a.stats?.catches || 0)
    )[0];

    return { topBatsman, topBowler, topFielder };
  }, [players]);

  const renderMedal = (position) => {
    if (position === 0) return '🥇';
    if (position === 1) return '🥈';
    if (position === 2) return '🥉';
    return `#${position + 1}`;
  };

  const renderLeaderboardItem = (player, index, metric, value, suffix = '') => (
    <TouchableOpacity
      key={player.id}
      onPress={() => navigation.navigate('Players', { screen: 'PlayerDetail', params: { player } })}
    >
      <View style={styles.leaderboardItem}>
        <View style={styles.leaderboardRank}>
          <Text style={styles.rankText}>{renderMedal(index)}</Text>
        </View>
        <View style={styles.leaderboardInfo}>
          <Text style={styles.leaderboardName}>{player.name}</Text>
          <Text style={styles.leaderboardRole}>{player.role}</Text>
        </View>
        <View style={styles.leaderboardValue}>
          <Text style={styles.leaderboardMetric}>{value}{suffix}</Text>
          <Text style={styles.leaderboardLabel}>{metric}</Text>
        </View>
      </View>
      {index < leaderboards.byRuns.length - 1 && <Divider style={styles.divider} />}
    </TouchableOpacity>
  );

  if (players.length === 0) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.emptyState}>
          <Text variant="headlineMedium" style={styles.emptyTitle}>
            📊 No Insights Yet
          </Text>
          <Text variant="bodyLarge" style={styles.emptySubtitle}>
            Add players and record matches to unlock powerful insights and analytics.
          </Text>
          <View style={styles.emptyActions}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Players', { screen: 'AddPlayer' })}
              style={styles.emptyButton}
            >
              Add Your First Player
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Matches', { screen: 'RecordMatch' })}
              style={styles.emptyButton}
            >
              Record a Match
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  }

  const chartWidth = Dimensions.get('window').width - 48;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          📈 Insights & Analytics
        </Text>
        <Text variant="bodyMedium" style={styles.headerSubtitle}>
          Comprehensive performance metrics and trends
        </Text>
      </View>

      {/* Overall Summary */}
      {overallSummary && (
        <Card style={styles.summaryCard} mode="elevated">
          <Card.Title
            title="Season Overview"
            titleStyle={styles.cardTitle}
            right={(props) => (
              <IconButton
                {...props}
                icon="refresh"
                onPress={loadData}
                iconColor="#60a5fa"
              />
            )}
          />
          <Card.Content>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryValue}>{overallSummary.totalRuns}</Text>
                <Text style={styles.summaryLabel}>Total Runs</Text>
                <Chip icon="run" style={styles.chip} textStyle={styles.chipText}>
                  {overallSummary.avgRunsPerMatch}/match
                </Chip>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryValue}>{overallSummary.totalWickets}</Text>
                <Text style={styles.summaryLabel}>Total Wickets</Text>
                <Chip icon="target" style={styles.chip} textStyle={styles.chipText}>
                  {overallSummary.avgWicketsPerMatch}/match
                </Chip>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryValue}>{overallSummary.totalCatches}</Text>
                <Text style={styles.summaryLabel}>Total Catches</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryValue}>{overallSummary.totalMatches}</Text>
                <Text style={styles.summaryLabel}>Total Matches</Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryMetric}>
                <Text style={styles.metricLabel}>Team Strike Rate</Text>
                <Text style={styles.metricValue}>{overallSummary.strikeRate}</Text>
              </View>
              <View style={styles.summaryMetric}>
                <Text style={styles.metricLabel}>Team Economy</Text>
                <Text style={styles.metricValue}>{overallSummary.economy}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Top Performers */}
      {topPerformers && (
        <Card style={styles.card} mode="elevated">
          <Card.Title title="🏆 Top Performers" titleStyle={styles.cardTitle} />
          <Card.Content>
            <View style={styles.topPerformersGrid}>
              <TouchableOpacity
                style={styles.topPerformerCard}
                onPress={() =>
                  navigation.navigate('Players', {
                    screen: 'PlayerDetail',
                    params: { player: topPerformers.topBatsman },
                  })
                }
              >
                <Text style={styles.topPerformerIcon}>🏏</Text>
                <Text style={styles.topPerformerName} numberOfLines={1}>
                  {topPerformers.topBatsman?.name || 'N/A'}
                </Text>
                <Text style={styles.topPerformerStat}>
                  {topPerformers.topBatsman?.stats?.runs || 0} runs
                </Text>
                <Text style={styles.topPerformerLabel}>Top Batsman</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.topPerformerCard}
                onPress={() =>
                  navigation.navigate('Players', {
                    screen: 'PlayerDetail',
                    params: { player: topPerformers.topBowler },
                  })
                }
              >
                <Text style={styles.topPerformerIcon}>🎯</Text>
                <Text style={styles.topPerformerName} numberOfLines={1}>
                  {topPerformers.topBowler?.name || 'N/A'}
                </Text>
                <Text style={styles.topPerformerStat}>
                  {topPerformers.topBowler?.stats?.wickets || 0} wickets
                </Text>
                <Text style={styles.topPerformerLabel}>Top Bowler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.topPerformerCard}
                onPress={() =>
                  navigation.navigate('Players', {
                    screen: 'PlayerDetail',
                    params: { player: topPerformers.topFielder },
                  })
                }
              >
                <Text style={styles.topPerformerIcon}>✋</Text>
                <Text style={styles.topPerformerName} numberOfLines={1}>
                  {topPerformers.topFielder?.name || 'N/A'}
                </Text>
                <Text style={styles.topPerformerStat}>
                  {topPerformers.topFielder?.stats?.catches || 0} catches
                </Text>
                <Text style={styles.topPerformerLabel}>Top Fielder</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Role Distribution */}
      {Object.keys(roleDistribution).length > 0 && (
        <Card style={styles.card} mode="elevated">
          <Card.Title title="👥 Squad Composition" titleStyle={styles.cardTitle} />
          <Card.Content>
            <View style={styles.roleDistribution}>
              {Object.entries(roleDistribution).map(([role, count]) => (
                <View key={role} style={styles.roleItem}>
                  <Chip style={styles.roleChip} textStyle={styles.roleChipText}>
                    {role}
                  </Chip>
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleBadgeText}>{count}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Charts */}
      {leaderboards.byRuns.length > 0 && (
        <Card style={styles.card} mode="elevated">
          <Card.Title title="📊 Top Run Scorers" titleStyle={styles.cardTitle} />
          <Card.Content>
            <BarChart
              data={{
                labels: leaderboards.byRuns
                  .slice(0, 5)
                  .map((player) => player.name.split(' ')[0]),
                datasets: [
                  {
                    data: leaderboards.byRuns.slice(0, 5).map((player) => player.stats?.runs || 0),
                  },
                ],
              }}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              showValuesOnTopOfBars
              fromZero
            />
          </Card.Content>
        </Card>
      )}

      {trendData.labels.length > 0 && (
        <Card style={styles.card} mode="elevated">
          <Card.Title title="📈 Performance Trends" titleStyle={styles.cardTitle} />
          <Card.Content>
            <LineChart
              data={trendData}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withInnerLines={false}
              withOuterLines={true}
            />
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
                <Text style={styles.legendText}>Runs</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
                <Text style={styles.legendText}>Wickets</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Detailed Leaderboards */}
      <Card style={styles.card} mode="elevated">
        <Card.Title title="🏅 Leaderboards" titleStyle={styles.cardTitle} />
        <Card.Content>
          <List.Section>
            <List.Subheader style={styles.subheader}>Top Run Scorers</List.Subheader>
            {leaderboards.byRuns.slice(0, 5).map((player, index) =>
              renderLeaderboardItem(
                player,
                index,
                'Runs',
                player.stats?.runs || 0,
                ''
              )
            )}
          </List.Section>
          <Divider style={styles.sectionDivider} />
          <List.Section>
            <List.Subheader style={styles.subheader}>Wicket Takers</List.Subheader>
            {leaderboards.byWickets.slice(0, 5).map((player, index) =>
              renderLeaderboardItem(
                player,
                index,
                'Wickets',
                player.stats?.wickets || 0,
                ''
              )
            )}
          </List.Section>
          <Divider style={styles.sectionDivider} />
          <List.Section>
            <List.Subheader style={styles.subheader}>Fielding Impact</List.Subheader>
            {leaderboards.byCatches.slice(0, 5).map((player, index) =>
              renderLeaderboardItem(
                player,
                index,
                'Catches',
                player.stats?.catches || 0,
                ''
              )
            )}
          </List.Section>
        </Card.Content>
      </Card>

      {/* Advanced Stats */}
      {leaderboards.byBattingAvg.length > 0 && (
        <Card style={styles.card} mode="elevated">
          <Card.Title title="⚡ Advanced Statistics" titleStyle={styles.cardTitle} />
          <Card.Content>
            <List.Section>
              <List.Subheader style={styles.subheader}>Best Batting Average</List.Subheader>
              {leaderboards.byBattingAvg.map((player, index) => (
                <List.Item
                  key={player.id}
                  title={player.name}
                  description={`${player.avg.toFixed(2)} avg • ${player.stats?.matches || 0} matches`}
                  left={() => <List.Icon icon="chart-line" color="#3b82f6" />}
                  right={() => (
                    <Text style={styles.advancedStatValue}>{player.avg.toFixed(2)}</Text>
                  )}
                  onPress={() =>
                    navigation.navigate('Players', {
                      screen: 'PlayerDetail',
                      params: { player },
                    })
                  }
                />
              ))}
            </List.Section>
            {leaderboards.byStrikeRate.length > 0 && (
              <>
                <Divider style={styles.sectionDivider} />
                <List.Section>
                  <List.Subheader style={styles.subheader}>Best Strike Rate</List.Subheader>
                  {leaderboards.byStrikeRate.map((player, index) => (
                    <List.Item
                      key={player.id}
                      title={player.name}
                      description={`${player.sr.toFixed(2)} SR • ${player.stats?.balls || 0} balls`}
                      left={() => <List.Icon icon="lightning-bolt" color="#fbbf24" />}
                      right={() => (
                        <Text style={styles.advancedStatValue}>{player.sr.toFixed(2)}</Text>
                      )}
                      onPress={() =>
                        navigation.navigate('Players', {
                          screen: 'PlayerDetail',
                          params: { player },
                        })
                      }
                    />
                  ))}
                </List.Section>
              </>
            )}
            {leaderboards.byBowlingAvg.length > 0 && (
              <>
                <Divider style={styles.sectionDivider} />
                <List.Section>
                  <List.Subheader style={styles.subheader}>Best Bowling Average</List.Subheader>
                  {leaderboards.byBowlingAvg.map((player, index) => (
                    <List.Item
                      key={player.id}
                      title={player.name}
                      description={`${player.avg.toFixed(2)} avg • ${player.stats?.wickets || 0} wickets`}
                      left={() => <List.Icon icon="target" color="#10b981" />}
                      right={() => (
                        <Text style={styles.advancedStatValue}>{player.avg.toFixed(2)}</Text>
                      )}
                      onPress={() =>
                        navigation.navigate('Players', {
                          screen: 'PlayerDetail',
                          params: { player },
                        })
                      }
                    />
                  ))}
                </List.Section>
              </>
            )}
          </Card.Content>
        </Card>
      )}

      {/* CTA */}
      <View style={styles.ctaSection}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Matches', { screen: 'RecordMatch' })}
          style={styles.ctaButton}
          icon="plus-circle"
        >
          Record Another Match
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Players')}
          style={styles.ctaButton}
          icon="account-group"
        >
          Manage Players
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
    paddingTop: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#94a3b8',
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#1e293b',
  },
  summaryCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#1e293b',
  },
  cardTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryBox: {
    width: '48%',
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#60a5fa',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: '#1e293b',
    height: 24,
  },
  chipText: {
    fontSize: 10,
    color: '#60a5fa',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  summaryMetric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10b981',
  },
  topPerformersGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topPerformerCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  topPerformerIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  topPerformerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  topPerformerStat: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginBottom: 2,
  },
  topPerformerLabel: {
    fontSize: 11,
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  roleDistribution: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  roleChip: {
    backgroundColor: '#0f172a',
    height: 32,
  },
  roleChipText: {
    color: '#ffffff',
    fontSize: 12,
  },
  roleBadge: {
    backgroundColor: '#3b82f6',
    marginLeft: 8,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  roleBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 12,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  subheader: {
    color: '#60a5fa',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionDivider: {
    marginVertical: 12,
    backgroundColor: '#334155',
  },
  divider: {
    backgroundColor: '#334155',
    marginVertical: 8,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  leaderboardRank: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#60a5fa',
  },
  leaderboardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  leaderboardRole: {
    fontSize: 12,
    color: '#94a3b8',
  },
  leaderboardValue: {
    alignItems: 'flex-end',
  },
  leaderboardMetric: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginBottom: 2,
  },
  leaderboardLabel: {
    fontSize: 11,
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  advancedStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  ctaSection: {
    marginTop: 8,
    gap: 12,
  },
  ctaButton: {
    marginBottom: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 400,
  },
  emptyTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  emptyActions: {
    width: '100%',
    gap: 12,
  },
  emptyButton: {
    marginBottom: 8,
  },
});
