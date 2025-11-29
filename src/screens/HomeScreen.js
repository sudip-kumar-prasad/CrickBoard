import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Card, Button, Chip, IconButton, Divider } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { StorageService } from '../utils/storage';
import { StatsCalculator } from '../utils/calculations';
import { AuthService } from '../utils/auth';

export default function HomeScreen({ navigation }) {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [summary, setSummary] = useState({
    totalRuns: 0,
    totalWickets: 0,
    totalCatches: 0,
    strikeRate: 0,
    economy: 0,
    winRate: 0,
    avgRuns: 0,
    matchesPlayed: 0,
    totalPlayers: 0,
  });

  useEffect(() => {
    loadUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadUser = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadData = async () => {
    try {
      const [playersData, matchesData] = await Promise.all([
        StorageService.getPlayers(),
        StorageService.getMatches(),
      ]);

      const validPlayers = playersData.filter(p => p && p.stats);
      setPlayers(validPlayers);
      setMatches(matchesData);

      if (validPlayers.length > 0) {
        const totalRuns = validPlayers.reduce((sum, player) => sum + (player.stats?.runs || 0), 0);
        const totalWickets = validPlayers.reduce((sum, player) => sum + (player.stats?.wickets || 0), 0);
        const totalCatches = validPlayers.reduce((sum, player) => sum + (player.stats?.catches || 0), 0);
        const totalBalls = validPlayers.reduce((sum, player) => sum + (player.stats?.balls || 0), 0);
        const totalOvers = validPlayers.reduce((sum, player) => sum + (player.stats?.overs || 0), 0);
        const totalRunsConceded = validPlayers.reduce((sum, player) => sum + (player.stats?.runsConceded || 0), 0);

        const matchesPlayed = matchesData.length;
        const wins = matchesData.filter((match) =>
          (match.result || '').toLowerCase().includes('win')
        ).length;

        const avgMatches = validPlayers.length > 0
          ? Math.round(validPlayers.reduce((sum, player) => sum + (player.stats?.matches || 0), 0) / validPlayers.length)
          : 0;

        setSummary({
          totalRuns,
          totalWickets,
          totalCatches,
          strikeRate: StatsCalculator.calculateStrikeRate(totalRuns, totalBalls),
          economy: StatsCalculator.calculateEconomyRate(totalRunsConceded, totalOvers),
          winRate: matchesPlayed ? Math.round((wins / matchesPlayed) * 100) : 0,
          avgRuns: matchesPlayed ? Math.round(totalRuns / matchesPlayed) : 0,
          matchesPlayed,
          totalPlayers: validPlayers.length,
          avgMatches,
        });
      } else {
        setSummary({
          totalRuns: 0,
          totalWickets: 0,
          totalCatches: 0,
          strikeRate: 0,
          economy: 0,
          winRate: 0,
          avgRuns: 0,
          matchesPlayed: 0,
          totalPlayers: 0,
          avgMatches: 0,
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const handleQuickAddPlayer = useCallback(() => {
    navigation.navigate('Players', { screen: 'AddPlayer' });
  }, [navigation]);

  const handleViewPlayers = useCallback(() => {
    navigation.navigate('Players');
  }, [navigation]);

  const handleRecordMatch = useCallback(() => {
    navigation.navigate('Matches', { screen: 'RecordMatch' });
  }, [navigation]);

  const handleViewInsights = useCallback(() => {
    navigation.navigate('Insights');
  }, [navigation]);

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

  const recentMatches = useMemo(() => {
    return matches
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  }, [matches]);

  const recentPlayers = useMemo(() => {
    return players
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 3);
  }, [players]);

  const heroCTA = useMemo(
    () => [
      {
        label: 'Record Match',
        icon: 'cricket',
        action: handleRecordMatch,
        color: '#3b82f6',
      },
      {
        label: 'Add Player',
        icon: 'account-plus',
        action: handleQuickAddPlayer,
        color: '#10b981',
      },
      {
        label: 'View Insights',
        icon: 'chart-line',
        action: handleViewInsights,
        color: '#f59e0b',
      },
    ],
    [handleRecordMatch, handleQuickAddPlayer, handleViewInsights]
  );

  const quickStats = useMemo(() => [
    {
      label: 'Total Players',
      value: summary.totalPlayers,
      icon: '👥',
      color: '#3b82f6',
      onPress: handleViewPlayers,
    },
    {
      label: 'Matches Played',
      value: summary.matchesPlayed,
      icon: '🏏',
      color: '#10b981',
      onPress: () => navigation.navigate('Matches'),
    },
    {
      label: 'Total Runs',
      value: summary.totalRuns,
      icon: '⚡',
      color: '#f59e0b',
      onPress: handleViewInsights,
    },
    {
      label: 'Win Rate',
      value: `${summary.winRate}%`,
      icon: '🏆',
      color: '#ef4444',
      onPress: handleViewInsights,
    },
  ], [summary, handleViewPlayers, handleViewInsights, navigation]);

  const renderStatCard = (stat, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.statCard, { borderLeftColor: stat.color }]}
      onPress={stat.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.statCardContent}>
        <Text style={styles.statIcon}>{stat.icon}</Text>
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statLabel}>{stat.label}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTopPerformer = (performer, type, icon, color) => {
    if (!performer) return null;

    const getValue = () => {
      switch (type) {
        case 'batsman':
          return `${performer.stats?.runs || 0} runs`;
        case 'bowler':
          return `${performer.stats?.wickets || 0} wickets`;
        case 'fielder':
          return `${performer.stats?.catches || 0} catches`;
        default:
          return '';
      }
    };

    return (
      <TouchableOpacity
        style={[styles.performerCard, { borderLeftColor: color }]}
        onPress={() =>
          navigation.navigate('Players', {
            screen: 'PlayerDetail',
            params: { player: performer },
          })
        }
        activeOpacity={0.7}
      >
        <View style={styles.performerContent}>
          <Text style={styles.performerIcon}>{icon}</Text>
          <View style={styles.performerInfo}>
            <Text style={styles.performerName} numberOfLines={1}>
              {performer.name || 'Unknown'}
            </Text>
            <Text style={styles.performerRole}>{performer.role}</Text>
          </View>
          <View style={styles.performerValue}>
            <Text style={[styles.performerStat, { color }]}>{getValue()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMiniLeaderboard = () => {
    if (players.length === 0) return null;

    const topRuns = [...players]
      .filter(p => p && p.stats)
      .sort((a, b) => (b.stats?.runs || 0) - (a.stats?.runs || 0))
      .slice(0, 5);
    const topWickets = [...players]
      .filter(p => p && p.stats)
      .sort((a, b) => (b.stats?.wickets || 0) - (a.stats?.wickets || 0))
      .slice(0, 5);

    if (topRuns.length === 0 && topWickets.length === 0) return null;

    return (
      <Card style={styles.leaderboardCard} mode="elevated">
        <Card.Title
          title="🏅 Top Performers"
          titleStyle={styles.cardTitle}
          right={(props) => (
            <IconButton
              {...props}
              icon="chevron-right"
              onPress={handleViewInsights}
              iconColor="#60a5fa"
            />
          )}
        />
        <Card.Content>
          <View style={styles.leaderboardGrid}>
            <View style={styles.leaderboardColumn}>
              <Text style={styles.leaderboardHeader}>Top Scorers</Text>
              {topRuns.slice(0, 3).map((player, index) => (
                <TouchableOpacity
                  key={player.id}
                  style={styles.leaderboardItem}
                  onPress={() =>
                    navigation.navigate('Players', {
                      screen: 'PlayerDetail',
                      params: { player },
                    })
                  }
                >
                  <View style={styles.leaderboardRank}>
                    <Text style={styles.rankBadge}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </Text>
                  </View>
                  <View style={styles.leaderboardInfo}>
                    <Text style={styles.leaderboardName} numberOfLines={1}>
                      {player.name || 'Unknown'}
                    </Text>
                    <Text style={styles.leaderboardValue}>
                      {player.stats?.runs || 0} runs
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.leaderboardDivider} />
            <View style={styles.leaderboardColumn}>
              <Text style={styles.leaderboardHeader}>Wicket Takers</Text>
              {topWickets.slice(0, 3).map((player, index) => (
                <TouchableOpacity
                  key={player.id}
                  style={styles.leaderboardItem}
                  onPress={() =>
                    navigation.navigate('Players', {
                      screen: 'PlayerDetail',
                      params: { player },
                    })
                  }
                >
                  <View style={styles.leaderboardRank}>
                    <Text style={styles.rankBadge}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </Text>
                  </View>
                  <View style={styles.leaderboardInfo}>
                    <Text style={styles.leaderboardName} numberOfLines={1}>
                      {player.name || 'Unknown'}
                    </Text>
                    <Text style={styles.leaderboardValue}>
                      {player.stats?.wickets || 0} wkts
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text variant="headlineLarge" style={styles.title}>
            🏏 CrickBoard
          </Text>
          <Text variant="titleMedium" style={styles.subtitle}>
            Your Cricket Command Center
          </Text>
          {currentUser && (
            <Text style={styles.userGreeting}>
              Welcome, {currentUser.name}! 👋
            </Text>
          )}
        </View>
        <View style={styles.heroActions}>
          {heroCTA.map((cta) => (
            <TouchableOpacity
              key={cta.label}
              style={[styles.heroButton, { backgroundColor: cta.color }]}
              onPress={cta.action}
              activeOpacity={0.8}
            >
              <Text style={styles.heroButtonText}>{cta.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Stats Grid */}
      <View style={styles.quickStatsContainer}>
        {quickStats.map((stat, index) => renderStatCard(stat, index))}
      </View>

      {/* Top Performers Section */}
      {topPerformers && (
        <Card style={styles.sectionCard} mode="elevated">
          <Card.Title
            title="⭐ Star Performers"
            titleStyle={styles.cardTitle}
            right={(props) => (
              <IconButton
                {...props}
                icon="chevron-right"
                onPress={handleViewInsights}
                iconColor="#60a5fa"
              />
            )}
          />
          <Card.Content>
            {renderTopPerformer(topPerformers.topBatsman, 'batsman', '🏏', '#3b82f6')}
            {renderTopPerformer(topPerformers.topBowler, 'bowler', '🎯', '#10b981')}
            {renderTopPerformer(topPerformers.topFielder, 'fielder', '✋', '#f59e0b')}
          </Card.Content>
        </Card>
      )}

      {/* Performance Metrics */}
      <Card style={styles.sectionCard} mode="elevated">
        <Card.Title title="📊 Performance Metrics" titleStyle={styles.cardTitle} />
        <Card.Content>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Team Strike Rate</Text>
              <Text style={styles.metricValue}>{summary.strikeRate.toFixed(2)}</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Team Economy</Text>
              <Text style={styles.metricValue}>{summary.economy.toFixed(2)}</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Avg Runs/Match</Text>
              <Text style={styles.metricValue}>{summary.avgRuns}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Recent Matches */}
      {recentMatches.length > 0 && (
        <Card style={styles.sectionCard} mode="elevated">
          <Card.Title
            title="📅 Recent Matches"
            titleStyle={styles.cardTitle}
            right={(props) => (
              <IconButton
                {...props}
                icon="chevron-right"
                onPress={() => navigation.navigate('Matches')}
                iconColor="#60a5fa"
              />
            )}
          />
          <Card.Content>
            {recentMatches.map((match, index) => (
              <TouchableOpacity
                key={match.id || index}
                style={styles.matchItem}
                onPress={() => navigation.navigate('Matches')}
                activeOpacity={0.7}
              >
                <View style={styles.matchContent}>
                  <View style={styles.matchHeader}>
                    <Text style={styles.matchOpponent}>
                      vs {match.opponent || 'Opponent'}
                    </Text>
                    {match.result && (
                      <Chip
                        style={[
                          styles.matchResultChip,
                          match.result.toLowerCase().includes('win')
                            ? styles.winChip
                            : styles.lossChip,
                        ]}
                        textStyle={styles.matchResultText}
                      >
                        {match.result}
                      </Chip>
                    )}
                  </View>
                  <Text style={styles.matchDetails}>
                    {new Date(match.date).toLocaleDateString()} • {match.venue || 'Venue TBD'}
                  </Text>
                </View>
                {index < recentMatches.length - 1 && <Divider style={styles.itemDivider} />}
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Mini Leaderboard */}
      {renderMiniLeaderboard()}

      {/* Quick Actions */}
      <Card style={styles.sectionCard} mode="elevated">
        <Card.Title title="⚡ Quick Actions" titleStyle={styles.cardTitle} />
        <Card.Content>
          <Button
            mode="contained"
            onPress={handleQuickAddPlayer}
            style={styles.actionButton}
            icon="account-plus"
          >
            Add New Player
          </Button>
          <Button
            mode="outlined"
            onPress={handleRecordMatch}
            style={styles.actionButton}
            icon="cricket"
          >
            Record Match
          </Button>
          <Button
            mode="outlined"
            onPress={handleViewPlayers}
            style={styles.actionButton}
            icon="account-group"
          >
            Manage Squad
          </Button>
          <Button
            mode="outlined"
            onPress={handleViewInsights}
            style={styles.actionButton}
            icon="chart-line"
          >
            View Analytics
          </Button>
        </Card.Content>
      </Card>

      {/* Empty State */}
      {players.length === 0 && (
        <Card style={styles.emptyStateCard} mode="elevated">
          <Card.Content style={styles.emptyState}>
            <Text variant="headlineMedium" style={styles.emptyStateTitle}>
              🎉 Welcome to CrickBoard!
            </Text>
            <Text variant="bodyLarge" style={styles.emptyStateText}>
              Start tracking your cricket team's performance. Add players and record matches to unlock powerful insights.
            </Text>
            <View style={styles.emptyStateActions}>
              <Button
                mode="contained"
                onPress={handleQuickAddPlayer}
                style={styles.emptyStateButton}
                icon="account-plus"
              >
                Add Your First Player
              </Button>
              <Button
                mode="outlined"
                onPress={handleRecordMatch}
                style={styles.emptyStateButton}
                icon="cricket"
              >
                Record a Match
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 20,
    paddingTop: 24,
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 32,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
  },
  userGreeting: {
    color: '#60a5fa',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  heroButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  heroButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderLeftWidth: 4,
    padding: 16,
    minHeight: 120,
  },
  statCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#1e293b',
  },
  cardTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  performerCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  performerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  performerIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  performerRole: {
    fontSize: 12,
    color: '#94a3b8',
  },
  performerValue: {
    alignItems: 'flex-end',
  },
  performerStat: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#60a5fa',
  },
  metricDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#334155',
  },
  matchItem: {
    paddingVertical: 12,
  },
  matchContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  matchOpponent: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  matchResultChip: {
    height: 24,
  },
  winChip: {
    backgroundColor: '#10b981',
  },
  lossChip: {
    backgroundColor: '#ef4444',
  },
  matchResultText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  matchDetails: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  itemDivider: {
    backgroundColor: '#334155',
    marginTop: 12,
  },
  leaderboardCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#1e293b',
  },
  leaderboardGrid: {
    flexDirection: 'row',
  },
  leaderboardColumn: {
    flex: 1,
  },
  leaderboardDivider: {
    width: 1,
    backgroundColor: '#334155',
    marginHorizontal: 12,
  },
  leaderboardHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: 12,
    textAlign: 'center',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  leaderboardRank: {
    width: 32,
    alignItems: 'center',
  },
  rankBadge: {
    fontSize: 20,
  },
  leaderboardInfo: {
    flex: 1,
    marginLeft: 8,
  },
  leaderboardName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  leaderboardValue: {
    fontSize: 12,
    color: '#94a3b8',
  },
  actionButton: {
    marginBottom: 8,
  },
  emptyStateCard: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#1e293b',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyStateActions: {
    width: '100%',
    gap: 12,
  },
  emptyStateButton: {
    marginBottom: 8,
  },
});
