import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { StorageService } from '../utils/storage';
import { StatsCalculator } from '../utils/calculations';
// No type imports needed for JavaScript

export default function HomeScreen({ navigation }) {
  const [players, setPlayers] = useState([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [topBatsman, setTopBatsman] = useState(null);
  const [topBowler, setTopBowler] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const playersData = await StorageService.getPlayers();
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
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleQuickAddPlayer = () => {
    navigation.navigate('Players', { screen: 'AddPlayer' });
  };

  // Advanced features removed for 50% completion

  const handleViewPlayers = () => {
    navigation.navigate('Players');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>        
        <Text variant="headlineLarge" style={styles.title}>CrickBoard</Text>
        <Text variant="titleMedium" style={styles.subtitle}>Cricket Stats & Score Management</Text>
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
      </View>

      <View style={styles.quickActions}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Quick Actions</Text>
        <Button mode="contained" onPress={handleQuickAddPlayer} style={styles.actionButton}>
          + Add Player
        </Button>
        <Button mode="outlined" onPress={handleViewPlayers} style={styles.actionButton}>
          Manage Players
        </Button>
      </View>

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
  statsContainer: {
    flexDirection: 'row',
    padding: 25,
    justifyContent: 'space-around',
    marginTop: -15,
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 130,
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
});
