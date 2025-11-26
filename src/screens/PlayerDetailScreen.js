import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { StorageService } from '../utils/storage';
import { StatsCalculator } from '../utils/calculations';
// No type imports needed for JavaScript

export default function PlayerDetailScreen({ navigation, route }) {
  const { player: initialPlayer } = route.params;
  const [player, setPlayer] = useState(initialPlayer);
  const [matchHistory, setMatchHistory] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadUpdatedPlayer();
      loadMatchHistory();
    }, [initialPlayer.id])
  );

  const loadUpdatedPlayer = async () => {
    try {
      const players = await StorageService.getPlayers();
      const updatedPlayer = players.find(p => p.id === player.id);
      if (updatedPlayer) {
        setPlayer(updatedPlayer);
      }
    } catch (error) {
      console.error('Error loading player:', error);
    }
  };

  const loadMatchHistory = async () => {
    try {
      const matches = await StorageService.getMatches();
      const relatedMatches = matches
        .filter(match =>
          match.performances?.some(performance => performance.playerId === player.id)
        )
        .map(match => {
          const performance = match.performances.find(
            perf => perf.playerId === player.id
          );
          return {
            id: match.id,
            date: match.date,
            opponent: match.opponent,
            result: match.result,
            performance,
          };
        });
      setMatchHistory(relatedMatches);
    } catch (error) {
      console.error('Error loading match history:', error);
    }
  };

  const handleDeletePlayer = () => {
    Alert.alert(
      'Delete Player',
      `Are you sure you want to delete ${player.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.deletePlayer(player.id);
              Alert.alert('Success', 'Player deleted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete player');
            }
          },
        },
      ]
    );
  };

  const renderStatCard = (title, value, subtitle) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderBasicStats = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>📊 Basic Statistics</Text>
      <View style={styles.statsGrid}>
        {renderStatCard('Matches', player.stats.matches)}
        {renderStatCard('Runs', player.stats.runs)}
        {renderStatCard('Wickets', player.stats.wickets)}
        {renderStatCard('Catches', player.stats.catches)}
      </View>
    </View>
  );

  const strikeRate = StatsCalculator.calculateStrikeRate(player.stats.runs, player.stats.balls);
  const battingAverage = StatsCalculator.calculateBattingAverage(player.stats.runs, player.stats.matches);
  const bowlingAverage = StatsCalculator.calculateBowlingAverage(player.stats.runsConceded, player.stats.wickets);
  const economyRate = StatsCalculator.calculateEconomyRate(player.stats.runsConceded, player.stats.overs);

  const recentPerformances = matchHistory.slice(0, 5).reverse();
  const chartData = {
    labels: recentPerformances.map(match =>
      new Date(match.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        data: recentPerformances.map(match => match.performance?.runs || 0),
      },
    ],
  };

  const chartWidth = Dimensions.get('window').width - 40;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.playerRole}>{player.role}</Text>
          {player.team && <Text style={styles.playerTeam}>{player.team}</Text>}
        </View>
        <View style={styles.matchesInfo}>
          <Text style={styles.matchesText}>{player.stats.matches}</Text>
          <Text style={styles.matchesLabel}>Matches</Text>
        </View>
      </View>

      {renderBasicStats()}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advanced Metrics</Text>
        <View style={styles.advancedGrid}>
          {renderStatCard('Strike Rate', strikeRate)}
          {renderStatCard('Batting Avg', battingAverage)}
          {renderStatCard('Bowling Avg', bowlingAverage || '—')}
          {renderStatCard('Economy', economyRate || '—')}
        </View>
      </View>

      {recentPerformances.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Form</Text>
          <LineChart
            data={chartData}
            width={chartWidth}
            height={220}
            chartConfig={{
              backgroundGradientFrom: '#1e3a8a',
              backgroundGradientTo: '#1e40af',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            style={styles.chart}
          />
          {recentPerformances.map(match => (
            <View key={match.id} style={styles.matchRow}>
              <Text style={styles.matchOpponent}>vs {match.opponent}</Text>
              <Text style={styles.matchStats}>
                {match.performance?.runs} runs • {match.performance?.wickets} wkts • {match.performance?.catches} catches
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditPlayer', { player })}
        >
          <Text style={styles.editButtonText}>Edit Player</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeletePlayer}
        >
          <Text style={styles.deleteButtonText}>Delete Player</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Created: {new Date(player.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.footerText}>
          Last Updated: {new Date(player.updatedAt).toLocaleDateString()}
        </Text>
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
    backgroundColor: '#1e3a8a',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  playerRole: {
    fontSize: 16,
    color: '#60a5fa',
    marginBottom: 2,
  },
  playerTeam: {
    fontSize: 14,
    color: '#94a3b8',
  },
  matchesInfo: {
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 10,
  },
  matchesText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#60a5fa',
  },
  matchesLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  advancedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  chart: {
    borderRadius: 16,
    marginBottom: 16,
  },
  matchRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  matchOpponent: {
    color: '#ffffff',
    fontWeight: '600',
  },
  matchStats: {
    color: '#94a3b8',
  },
  actions: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    backgroundColor: '#1e293b',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
});
