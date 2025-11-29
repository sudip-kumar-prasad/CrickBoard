import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StorageService } from '../utils/storage';
import { StatsCalculator } from '../utils/calculations';
// No type imports needed for JavaScript

export default function PlayerDetailScreen({ navigation, route }) {
  const { player: initialPlayer } = route.params;
  const [player, setPlayer] = useState(initialPlayer);

  useEffect(() => {
    loadUpdatedPlayer();
  }, []);

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
