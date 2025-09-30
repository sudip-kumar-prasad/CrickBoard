import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native';
import { Text, Card, Button, Searchbar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { StorageService } from '../utils/storage';
// No type imports needed for JavaScript

export default function PlayersScreen({ navigation }) {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Advanced filtering removed for 50% completion

  useFocusEffect(
    useCallback(() => {
      loadPlayers();
    }, [])
  );

  const loadPlayers = async () => {
    try {
      const playersData = await StorageService.getPlayers();
      setPlayers(playersData);
      setFilteredPlayers(playersData);
    } catch (error) {
      console.error('Error loading players:', error);
      Alert.alert('Error', 'Failed to load players');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPlayers();
    setRefreshing(false);
  };

  const filterPlayers = () => {
    let filtered = players;

    // Simple search only (50% completion)
    if (searchQuery.trim()) {
      filtered = filtered.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPlayers(filtered);
  };

  useEffect(() => {
    filterPlayers();
  }, [searchQuery, players]);

  const handleDeletePlayer = (player) => {
    Alert.alert(
      'Delete Player',
      `Are you sure you want to delete ${player.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.deletePlayer(player.id);
              await loadPlayers();
              Alert.alert('Success', 'Player deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete player');
            }
          },
        },
      ]
    );
  };

  const renderPlayer = ({ item }) => (
    <Card style={styles.playerCard} mode="elevated" onPress={() => navigation.navigate('PlayerDetail', { player: item })}>
      <Card.Content>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{item.name}</Text>
          <Text style={styles.playerRole}>{item.role}</Text>
          {item.team && <Text style={styles.playerTeam}>{item.team}</Text>}
        </View>
        <View style={styles.playerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.stats.runs}</Text>
            <Text style={styles.statLabel}>Runs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.stats.wickets}</Text>
            <Text style={styles.statLabel}>Wickets</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.stats.matches}</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
        </View>
        <View style={styles.playerActions}>
          <Button mode="outlined" onPress={() => navigation.navigate('EditPlayer', { player: item })} style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button mode="contained" onPress={() => handleDeletePlayer(item)}>
            Delete
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  // Role filter removed for 50% completion

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search players or teams..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      <Card style={styles.header} mode="elevated">
        <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text variant="titleLarge" style={styles.headerText}>
            Players ({filteredPlayers.length})
          </Text>
          <Button mode="contained" onPress={() => navigation.navigate('AddPlayer')}>
            + Add Player
          </Button>
        </Card.Content>
      </Card>

      {filteredPlayers.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {players.length === 0
              ? 'No players added yet. Add your first player to get started!'
              : 'No players match your search criteria.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPlayers}
          renderItem={renderPlayer}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#1e3a8a',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  searchInput: {
    borderRadius: 12,
  },
  roleFilter: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  roleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 15,
    backgroundColor: '#334155',
  },
  selectedRoleButton: {
    backgroundColor: '#3b82f6',
  },
  roleButtonText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
  selectedRoleButtonText: {
    color: '#ffffff',
  },
  header: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  listContainer: {
    padding: 20,
  },
  playerCard: {
    marginBottom: 15,
    borderRadius: 16,
  },
  playerInfo: {
    marginBottom: 10,
  },
  playerName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 5,
  },
  playerRole: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 3,
    fontWeight: '600',
  },
  playerTeam: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  playerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e40af',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 3,
    fontWeight: '600',
  },
  playerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
  },
});
