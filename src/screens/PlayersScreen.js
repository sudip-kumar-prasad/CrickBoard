import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, Alert, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Searchbar, Chip, IconButton, Divider } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { StorageService } from '../utils/storage';
import { StatsCalculator } from '../utils/calculations';

export default function PlayersScreen({ navigation }) {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [sortBy, setSortBy] = useState('name'); // name, runs, wickets, matches
  const [refreshing, setRefreshing] = useState(false);

  const roles = ['All', 'Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];

  useFocusEffect(
    useCallback(() => {
      loadPlayers();
    }, [])
  );

  const loadPlayers = async () => {
    try {
      const playersData = await StorageService.getPlayers();
      const validPlayers = playersData.filter(p => p && p.stats);
      setPlayers(validPlayers);
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

  // Filter and sort players
  const processedPlayers = useMemo(() => {
    let filtered = [...players];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (player.team && player.team.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by role
    if (selectedRole !== 'All') {
      filtered = filtered.filter(player => player.role === selectedRole);
    }

    // Sort players
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'runs':
          return (b.stats?.runs || 0) - (a.stats?.runs || 0);
        case 'wickets':
          return (b.stats?.wickets || 0) - (a.stats?.wickets || 0);
        case 'matches':
          return (b.stats?.matches || 0) - (a.stats?.matches || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [players, searchQuery, selectedRole, sortBy]);

  useEffect(() => {
    setFilteredPlayers(processedPlayers);
  }, [processedPlayers]);

  const handleDeletePlayer = (player) => {
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

  const getRoleIcon = (role) => {
    const icons = {
      'Batsman': '🏏',
      'Bowler': '🎯',
      'All-rounder': '⭐',
      'Wicket-keeper': '🧤',
    };
    return icons[role] || '👤';
  };

  const getRoleColor = (role) => {
    const colors = {
      'Batsman': '#3b82f6',
      'Bowler': '#10b981',
      'All-rounder': '#f59e0b',
      'Wicket-keeper': '#8b5cf6',
    };
    return colors[role] || '#94a3b8';
  };

  const renderPlayer = ({ item, index }) => {
    const roleColor = getRoleColor(item.role);
    const battingAvg = item.stats?.matches > 0
      ? StatsCalculator.calculateBattingAverage(item.stats?.runs || 0, item.stats?.matches || 0)
      : 0;
    const strikeRate = item.stats?.balls > 0
      ? StatsCalculator.calculateStrikeRate(item.stats?.runs || 0, item.stats?.balls || 0)
      : 0;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate('PlayerDetail', { player: item })}
      >
        <Card style={[styles.playerCard, { borderLeftColor: roleColor }]} mode="elevated">
          <Card.Content>
            <View style={styles.playerHeader}>
              <View style={styles.playerMainInfo}>
                <View style={styles.playerNameRow}>
                  <Text style={styles.playerName}>{item.name || 'Unknown'}</Text>
                  <Text style={styles.roleIcon}>{getRoleIcon(item.role)}</Text>
                </View>
                <View style={styles.playerMeta}>
                  <Chip
                    style={[styles.roleChip, { backgroundColor: `${roleColor}20` }]}
                    textStyle={[styles.roleChipText, { color: roleColor }]}
                  >
                    {item.role}
                  </Chip>
                  {item.team && (
                    <Text style={styles.playerTeam}>• {item.team}</Text>
                  )}
                </View>
              </View>
              <View style={styles.matchesBadge}>
                <Text style={styles.matchesBadgeText}>{item.stats?.matches || 0}</Text>
                <Text style={styles.matchesBadgeLabel}>Matches</Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{item.stats?.runs || 0}</Text>
                  <Text style={styles.statLabel}>Runs</Text>
                  {battingAvg > 0 && (
                    <Text style={styles.statSubtext}>Avg: {battingAvg.toFixed(1)}</Text>
                  )}
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{item.stats?.wickets || 0}</Text>
                  <Text style={styles.statLabel}>Wickets</Text>
                  {item.stats?.wickets > 0 && (
                    <Text style={styles.statSubtext}>
                      Avg: {StatsCalculator.calculateBowlingAverage(
                        item.stats?.runsConceded || 0,
                        item.stats?.wickets || 0
                      ).toFixed(1)}
                    </Text>
                  )}
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{item.stats?.catches || 0}</Text>
                  <Text style={styles.statLabel}>Catches</Text>
                </View>
                {strikeRate > 0 && (
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{strikeRate.toFixed(1)}</Text>
                    <Text style={styles.statLabel}>Strike Rate</Text>
                  </View>
                )}
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.playerActions}>
              <Button
                mode="outlined"
                onPress={(e) => {
                  e.stopPropagation();
                  navigation.navigate('EditPlayer', { player: item });
                }}
                style={styles.actionButton}
                icon="pencil"
              >
                Edit
              </Button>
              <Button
                mode="contained"
                onPress={(e) => {
                  e.stopPropagation();
                  handleDeletePlayer(item);
                }}
                style={[styles.actionButton, styles.deleteButton]}
                buttonColor="#ef4444"
                icon="delete"
              >
                Delete
              </Button>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const summaryStats = useMemo(() => {
    return {
      total: players.length,
      totalRuns: players.reduce((sum, p) => sum + (p.stats?.runs || 0), 0),
      totalWickets: players.reduce((sum, p) => sum + (p.stats?.wickets || 0), 0),
      totalMatches: players.reduce((sum, p) => sum + (p.stats?.matches || 0), 0),
    };
  }, [players]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search players or teams..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          iconColor="#60a5fa"
        />
      </View>

      {/* Summary Stats */}
      {players.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{summaryStats.total}</Text>
            <Text style={styles.summaryLabel}>Players</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{summaryStats.totalRuns}</Text>
            <Text style={styles.summaryLabel}>Total Runs</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{summaryStats.totalWickets}</Text>
            <Text style={styles.summaryLabel}>Total Wickets</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{summaryStats.totalMatches}</Text>
            <Text style={styles.summaryLabel}>Matches</Text>
          </View>
        </View>
      )}

      {/* Header with Filters */}
      <Card style={styles.headerCard} mode="elevated">
        <Card.Content>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text variant="titleLarge" style={styles.headerText}>
                Squad ({filteredPlayers.length})
              </Text>
              <Text style={styles.headerSubtext}>
                {players.length} total player{players.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('AddPlayer')}
              icon="account-plus"
              style={styles.addButton}
            >
              Add Player
            </Button>
          </View>

          {/* Role Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Filter by Role:</Text>
            <View style={styles.roleFilter}>
              {roles.map((role) => (
                <Chip
                  key={role}
                  selected={selectedRole === role}
                  onPress={() => setSelectedRole(role)}
                  style={[
                    styles.filterChip,
                    selectedRole === role && styles.selectedFilterChip,
                  ]}
                  textStyle={[
                    styles.filterChipText,
                    selectedRole === role && styles.selectedFilterChipText,
                  ]}
                >
                  {role}
                </Chip>
              ))}
            </View>
          </View>

          {/* Sort Options */}
          <View style={styles.sortSection}>
            <Text style={styles.filterLabel}>Sort by:</Text>
            <View style={styles.sortOptions}>
              {[
                { key: 'name', label: 'Name', icon: 'sort-alphabetical' },
                { key: 'runs', label: 'Runs', icon: 'trophy' },
                { key: 'wickets', label: 'Wickets', icon: 'target' },
                { key: 'matches', label: 'Matches', icon: 'calendar' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.sortButton,
                    sortBy === option.key && styles.activeSortButton,
                  ]}
                  onPress={() => setSortBy(option.key)}
                >
                  <Text
                    style={[
                      styles.sortButtonText,
                      sortBy === option.key && styles.activeSortButtonText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Players List */}
      {filteredPlayers.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>
            {players.length === 0 ? '👥' : '🔍'}
          </Text>
          <Text style={styles.emptyStateTitle}>
            {players.length === 0
              ? 'No Players Yet'
              : 'No Players Found'}
          </Text>
          <Text style={styles.emptyStateText}>
            {players.length === 0
              ? 'Add your first player to start tracking your cricket team!'
              : 'Try adjusting your search or filters to find players.'}
          </Text>
          {players.length === 0 && (
            <Button
              mode="contained"
              onPress={() => navigation.navigate('AddPlayer')}
              style={styles.emptyStateButton}
              icon="account-plus"
            >
              Add Your First Player
            </Button>
          )}
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
          showsVerticalScrollIndicator={false}
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
    padding: 16,
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  searchInput: {
    borderRadius: 12,
    backgroundColor: '#0f172a',
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#1e293b',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtext: {
    fontSize: 12,
    color: '#94a3b8',
  },
  addButton: {
    backgroundColor: '#3b82f6',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roleFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  selectedFilterChip: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterChipText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  selectedFilterChipText: {
    color: '#ffffff',
  },
  sortSection: {
    marginTop: 8,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeSortButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  sortButtonText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
  activeSortButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  playerCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    borderLeftWidth: 4,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  playerMainInfo: {
    flex: 1,
  },
  playerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  playerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  roleIcon: {
    fontSize: 20,
  },
  playerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleChip: {
    height: 24,
  },
  roleChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  playerTeam: {
    fontSize: 12,
    color: '#94a3b8',
  },
  matchesBadge: {
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 70,
  },
  matchesBadgeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#60a5fa',
  },
  matchesBadgeLabel: {
    fontSize: 10,
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  statsContainer: {
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
  divider: {
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  playerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#3b82f6',
  },
});
