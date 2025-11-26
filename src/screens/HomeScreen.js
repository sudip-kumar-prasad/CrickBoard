import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { StorageService } from '../utils/storage';
import { StatsCalculator } from '../utils/calculations';

export default function HomeScreen({ navigation }) {
  const [players, setPlayers] = useState([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [topBatsman, setTopBatsman] = useState(null);
  const [topBowler, setTopBowler] = useState(null);
  const [recentMatch, setRecentMatch] = useState(null);
  const [summary, setSummary] = useState({
    totalRuns: 0,
    totalWickets: 0,
    strikeRate: 0,
    economy: 0,
    winRate: 0,
    avgRuns: 0,
    matchesPlayed: 0,
  });

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const [playersData, matchesData] = await Promise.all([
        StorageService.getPlayers(),
        StorageService.getMatches(),
      ]);

      setPlayers(playersData);
      const total = playersData.reduce((sum, player) => sum + player.stats.matches, 0);
      setTotalMatches(Math.floor(total / playersData.length) || 0);
      if (playersData.length > 0) {
        const topBatsmanData = playersData.reduce((prev, current) =>
          prev.stats.runs > current.stats.runs ? prev : current
        );
        setTopBatsman(topBatsmanData);
        const topBowlerData = playersData.reduce((prev, current) =>
          prev.stats.wickets > current.stats.wickets ? prev : current
        );
        setTopBowler(topBowlerData);
        const totalRuns = playersData.reduce((sum, player) => sum + player.stats.runs, 0);
        const totalWickets = playersData.reduce((sum, player) => sum + player.stats.wickets, 0);
        const totalBalls = playersData.reduce((sum, player) => sum + player.stats.balls, 0);
        const totalOvers = playersData.reduce((sum, player) => sum + player.stats.overs, 0);
        const totalRunsConceded = playersData.reduce((sum, player) => sum + player.stats.runsConceded, 0);

        const matchesPlayed = matchesData.length;
        const wins = matchesData.filter((match) =>
          (match.result || '').toLowerCase().includes('win')
        ).length;

        setSummary({
          totalRuns,
          totalWickets,
          strikeRate: StatsCalculator.calculateStrikeRate(totalRuns, totalBalls),
          economy: StatsCalculator.calculateEconomyRate(totalRunsConceded, totalOvers),
          winRate: matchesPlayed ? Math.round((wins / matchesPlayed) * 100) : 0,
          avgRuns: matchesPlayed ? Math.round(totalRuns / (matchesPlayed || 1)) : 0,
          matchesPlayed,
        });
      }

      setRecentMatch(matchesData[0] || null);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

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

  const heroCTA = useMemo(
    () => [
      {
        label: 'Record Match',
        icon: 'cricket',
        action: handleRecordMatch,
      },
      {
        label: 'Add Player',
        icon: 'account-plus',
        action: handleQuickAddPlayer,
      },
      {
        label: 'Insights',
        icon: 'chart-box',
        action: handleViewInsights,
      },
    ],
    [handleRecordMatch, handleQuickAddPlayer, handleViewInsights]
  );

  const quickLinks = [
    {
      title: 'Manage Squad',
      description: 'Edit roles, update teams & review stats.',
      actionLabel: 'Open Players',
      onPress: handleViewPlayers,
    },
    {
      title: 'Analytics Hub',
      description: 'Leaderboards, trends & performance charts.',
      actionLabel: 'Open Insights',
      onPress: handleViewInsights,
    },
  ];

  const renderMiniLeaderboard = () => {
    if (players.length === 0) return null;

    const topRuns = [...players]
      .sort((a, b) => b.stats.runs - a.stats.runs)
      .slice(0, 3);
    const topWickets = [...players]
      .sort((a, b) => b.stats.wickets - a.stats.wickets)
      .slice(0, 3);

    return (
      <View style={styles.leaderboardSection}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Leaderboard Highlights</Text>
        <View style={styles.leaderboardRow}>
          <Card style={[styles.leaderCard, { marginRight: 12 }]} mode="elevated">
            <Card.Title title="Top Scorers" />
            <Card.Content>
              {topRuns.map((player) => (
                <View key={player.id} style={styles.leaderRow}>
                  <Text style={styles.leaderName}>{player.name}</Text>
                  <Text style={styles.leaderValue}>{player.stats.runs} runs</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
          <Card style={styles.leaderCard} mode="elevated">
            <Card.Title title="Wicket Takers" />
            <Card.Content>
              {topWickets.map((player) => (
                <View key={player.id} style={styles.leaderRow}>
                  <Text style={styles.leaderName}>{player.name}</Text>
                  <Text style={styles.leaderValue}>{player.stats.wickets} wkts</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>CrickBoard HQ</Text>
        <Text variant="titleMedium" style={styles.subtitle}>Your cricket control center</Text>
        <View style={styles.heroActions}>
          {heroCTA.map((cta) => (
            <Chip
              key={cta.label}
              icon={cta.icon}
              style={styles.heroChip}
              textStyle={styles.heroChipText}
              onPress={cta.action}
            >
              {cta.label}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard} mode="elevated">
          <Card.Content>
            <Text variant="headlineMedium" style={styles.statNumber}>{players.length}</Text>
            <Text variant="labelLarge" style={styles.statLabel}>Total Players</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard} mode="elevated">
          <Card.Content>
            <Text variant="headlineMedium" style={styles.statNumber}>{totalMatches}</Text>
            <Text variant="labelLarge" style={styles.statLabel}>Avg Matches</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard} mode="elevated">
          <Card.Content>
            <Text variant="headlineMedium" style={styles.statNumber}>{summary.strikeRate || 0}</Text>
            <Text variant="labelLarge" style={styles.statLabel}>Team Strike Rate</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard} mode="elevated">
          <Card.Content>
            <Text variant="headlineMedium" style={styles.statNumber}>{summary.winRate}%</Text>
            <Text variant="labelLarge" style={styles.statLabel}>Win Rate</Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.quickActions}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Quick Actions</Text>
        <Button mode="contained" onPress={handleQuickAddPlayer} style={styles.actionButton}>
          + Add Player
        </Button>
        <Button mode="outlined" onPress={handleViewPlayers} style={styles.actionButton}>
          Manage Players
        </Button>
        <Button mode="outlined" onPress={handleRecordMatch} style={styles.actionButton}>
          Record Match
        </Button>
        <Button mode="outlined" onPress={handleViewInsights} style={styles.actionButton}>
          View Insights
        </Button>
      </View>

      <View style={styles.kpiRow}>
        <Card style={styles.kpiCard} mode="elevated">
          <Card.Content>
            <Text style={styles.kpiLabel}>Matches Logged</Text>
            <Text style={styles.kpiValue}>{summary.matchesPlayed}</Text>
            <Text style={styles.kpiSubtext}>Across all fixtures</Text>
          </Card.Content>
        </Card>
        <Card style={styles.kpiCard} mode="elevated">
          <Card.Content>
            <Text style={styles.kpiLabel}>Avg Runs / Match</Text>
            <Text style={styles.kpiValue}>{summary.avgRuns}</Text>
            <Text style={styles.kpiSubtext}>Team batting output</Text>
          </Card.Content>
        </Card>
      </View>

      {recentMatch && (
        <View style={styles.recentMatch}>
          <Text variant="titleLarge" style={styles.sectionTitle}>Recent Match</Text>
          <Card style={styles.recentCard} mode="elevated">
            <Card.Content>
              <Text style={styles.recentOpponent}>vs {recentMatch.opponent}</Text>
              <Text style={styles.recentMeta}>
                {new Date(recentMatch.date).toLocaleDateString()} • {recentMatch.venue}
              </Text>
              {recentMatch.result && (
                <Text style={styles.recentResult}>{recentMatch.result}</Text>
              )}
              {recentMatch.performances?.slice(0, 2).map((performance) => (
                <View key={performance.playerId} style={styles.recentPerformance}>
                  <Text style={styles.recentPlayer}>{performance.playerName}</Text>
                  <Text style={styles.recentStats}>
                    {performance.runs || 0} runs • {performance.wickets || 0} wkts • {performance.catches || 0} catches
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        </View>
      )}

      {renderMiniLeaderboard()}

      {players.length > 0 && (
        <View style={styles.topPerformers}>
          <Text variant="titleLarge" style={styles.sectionTitle}>Top Performers</Text>
          {topBatsman && (
            <Card style={styles.performerCard} mode="elevated">
              <Card.Content>
                <Text variant="titleMedium" style={styles.performerTitle}>🏏 Top Batsman</Text>
                <Text variant="titleLarge" style={styles.performerName}>{topBatsman.name}</Text>
                <Text variant="bodyMedium" style={styles.performerStats}>
                  {topBatsman.stats.runs} runs in {topBatsman.stats.matches} matches
                </Text>
              </Card.Content>
            </Card>
          )}
          {topBowler && (
            <Card style={styles.performerCard} mode="elevated">
              <Card.Content>
                <Text variant="titleMedium" style={styles.performerTitle}>🎯 Top Bowler</Text>
                <Text variant="titleLarge" style={styles.performerName}>{topBowler.name}</Text>
                <Text variant="bodyMedium" style={styles.performerStats}>
                  {topBowler.stats.wickets} wickets in {topBowler.stats.matches} matches
                </Text>
              </Card.Content>
            </Card>
          )}
        </View>
      )}

      {players.length === 0 && (
        <View style={styles.emptyState}>
          <Text variant="headlineSmall" style={styles.emptyStateTitle}>Welcome to CrickBoard!</Text>
          <Text variant="bodyMedium" style={styles.emptyStateText}>
            Start by adding your first player to begin tracking cricket statistics.
          </Text>
          <Button mode="contained" onPress={handleQuickAddPlayer} style={styles.primaryButton}>
            Add Your First Player
          </Button>
        </View>
      )}

      <View style={styles.quickLinkSection}>
        {quickLinks.map((link) => (
          <Card key={link.title} style={styles.quickLinkCard} mode="elevated">
            <Card.Content>
              <Text style={styles.quickLinkTitle}>{link.title}</Text>
              <Text style={styles.quickLinkText}>{link.description}</Text>
              <Button mode="text" onPress={link.onPress}>
                {link.actionLabel}
              </Button>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#1e3a8a',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    opacity: 0.9,
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
  },
  heroChip: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    margin: 6,
  },
  heroChipText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 25,
    justifyContent: 'space-around',
    marginTop: -15,
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 140,
    flexBasis: '46%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1e40af',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
  },
  recentMatch: {
    paddingHorizontal: 25,
    marginBottom: 10,
  },
  recentCard: {
    borderRadius: 16,
  },
  recentOpponent: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  recentMeta: {
    color: '#64748b',
    marginBottom: 6,
  },
  recentResult: {
    color: '#0f172a',
    fontWeight: '700',
    marginBottom: 10,
  },
  recentPerformance: {
    marginBottom: 8,
  },
  recentPlayer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  recentStats: {
    color: '#475569',
  },
  leaderboardSection: {
    paddingHorizontal: 25,
    marginBottom: 15,
  },
  leaderboardRow: {
    flexDirection: 'row',
  },
  leaderCard: {
    flex: 1,
    borderRadius: 18,
  },
  leaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leaderName: {
    color: '#0f172a',
    fontWeight: '600',
  },
  leaderValue: {
    color: '#475569',
    fontWeight: '700',
  },
  kpiRow: {
    flexDirection: 'row',
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 18,
  },
  kpiLabel: {
    color: '#475569',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  kpiSubtext: {
    color: '#94a3b8',
    marginTop: 4,
  },
  quickActions: {
    padding: 25,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionButtonText: {
    color: '#1e40af',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  topPerformers: {
    padding: 25,
  },
  performerCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  performerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 8,
  },
  performerName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
  },
  performerStats: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  emptyState: {
    padding: 50,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 35,
    lineHeight: 26,
    opacity: 0.9,
  },
  primaryButton: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 35,
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  quickLinkSection: {
    padding: 25,
    paddingTop: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quickLinkCard: {
    flex: 1,
    minWidth: 150,
    borderRadius: 16,
    marginRight: 12,
    marginBottom: 15,
  },
  quickLinkTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  quickLinkText: {
    color: '#475569',
    marginVertical: 8,
  },
});
