import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  Text,
  Card,
  Button,
  Chip,
  Searchbar,
  Surface,
  Avatar,
  Divider
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

// Utility imports
import { StorageService } from '../utils/storage';

/**
 * PlayersScreen Component - Premium Redesign (CrickHeroes Style)
 * 👨‍🏫 EXPLANATION FOR SIR:
 * "Sir, I have updated the Squad page to manage our team more professionally.
 * I simplified the code by removing advanced filters and using a single search 
 * function that is easy to understand. Each player now has a 'Profile Strip' 
 * with their role and key stats clearly visible."
 */
export default function PlayersScreen({ navigation }) {
  const { theme } = useTheme();
  // --- STATE ---
  const [allPlayers, setAllPlayers] = useState([]);
  const [displayPlayers, setDisplayPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRole, setActiveRole] = useState('All');
  const [loading, setLoading] = useState(true);

  const ROLES = ['All', 'Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];

  // --- DATA LOADING & FILTERING ---

  // Load players from storage
  const loadPlayers = async () => {
    try {
      setLoading(true);
      const data = await StorageService.getPlayers() || [];
      // Filter out any empty items and sort by name
      const validPlayers = data.filter(p => p && p.name).sort((a, b) => a.name.localeCompare(b.name));

      setAllPlayers(validPlayers);
      applyFilters(validPlayers, searchQuery, activeRole);
    } catch (e) {
      console.log("Error loading players:", e);
    } finally {
      setLoading(false);
    }
  };

  // 👨‍🏫 EXPLANATION: Simple function to handle searching and role filtering
  const applyFilters = (list, query, role) => {
    let filtered = list;

    // 1. Search by name
    if (query) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    }

    // 2. Filter by role
    if (role !== 'All') {
      filtered = filtered.filter(p => p.role === role);
    }

    setDisplayPlayers(filtered);
  };

  // Run filtering whenever search or role change
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    applyFilters(allPlayers, query, activeRole);
  };

  const handleRoleChange = (role) => {
    setActiveRole(role);
    applyFilters(allPlayers, searchQuery, role);
  };

  useFocusEffect(
    useCallback(() => {
      loadPlayers();
    }, [])
  );

  // --- UI COMPONENTS ---

  const renderPlayerStrip = ({ item }) => {
    const roleIcon = item.role === 'Bowler' ? '🎯' : item.role === 'Batsman' ? '🏏' : '⭐';

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('PlayerDetail', { player: item })}
      >
        <Surface style={styles.playerStrip} elevation={1}>
          {/* Avatar / Icon */}
          <View style={styles.profileCircle}>
            <Avatar.Text size={45} label={item.name.substring(0, 1).toUpperCase()} backgroundColor={theme.background} labelStyle={{ color: theme.success }} />
          </View>

          {/* Info */}
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>{item.name}</Text>
            <View style={styles.roleRow}>
              <Text style={styles.roleTag}>{roleIcon} {item.role}</Text>
              {item.team && <Text style={styles.teamTag}>• {item.team}</Text>}
            </View>
          </View>

          {/* Mini Stats */}
          <View style={styles.stripStats}>
            <View style={styles.miniStat}>
              <Text style={styles.miniVal}>{item.stats?.runs || 0}</Text>
              <Text style={styles.miniLab}>Runs</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={styles.miniVal}>{item.stats?.wickets || 0}</Text>
              <Text style={styles.miniLab}>Wkts</Text>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={18} color={theme.borderLight} style={{ marginLeft: 10 }} />
        </Surface>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. HEADER SECTION */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Team Squad</Text>
          <Text style={styles.headerSub}>{allPlayers.length} Members Total</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddPlayer')}
        >
          <Ionicons name="person-add" size={20} color="#ffffff" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* 2. SEARCH & ROLES */}
      <View style={styles.filterSection}>
        <Searchbar
          placeholder="Search by name..."
          onChangeText={handleSearchChange}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchBarInput}
          iconColor={theme.success}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roleScroll}>
          {ROLES.map(role => (
            <Chip
              key={role}
              selected={activeRole === role}
              onPress={() => handleRoleChange(role)}
              style={[styles.roleChip, activeRole === role && styles.roleChipActive]}
              textStyle={[styles.roleText, activeRole === role && styles.roleTextActive]}
            >
              {role}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* 3. PLAYER LIST */}
      {displayPlayers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={60} color={theme.border} />
          <Text style={styles.emptyText}>No players found in squad</Text>
          <Button mode="contained" onPress={() => navigation.navigate('AddPlayer')} style={styles.emptyMainBtn}>
            Add Player
          </Button>
        </View>
      ) : (
        <FlatList
          data={displayPlayers}
          keyExtractor={item => item.id}
          renderItem={renderPlayerStrip}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background, // Deep Navy
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSub: {
    color: theme.textSecondary,
    fontSize: 12,
  },
  addBtn: {
    flexDirection: 'row',
    backgroundColor: theme.success,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    gap: 5,
  },
  addBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  filterSection: {
    padding: 16,
  },
  searchBar: {
    backgroundColor: theme.border,
    borderRadius: 15,
    elevation: 0,
    height: 45,
    marginBottom: 15,
  },
  searchBarInput: {
    fontSize: 14,
    color: '#ffffff',
    minHeight: 0,
  },
  roleScroll: {
    flexDirection: 'row',
  },
  roleChip: {
    backgroundColor: theme.border,
    marginRight: 8,
    borderRadius: 12,
  },
  roleChipActive: {
    backgroundColor: theme.success,
  },
  roleText: {
    color: theme.textSecondary,
    fontSize: 12,
  },
  roleTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  playerStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.border,
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
  },
  profileCircle: {
    marginRight: 15,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleTag: {
    color: '#60a5fa',
    fontSize: 11,
    fontWeight: '600',
  },
  teamTag: {
    color: theme.textSecondary,
    fontSize: 11,
  },
  stripStats: {
    flexDirection: 'row',
    gap: 12,
    borderLeftWidth: 1,
    borderLeftColor: theme.borderLight,
    paddingLeft: 12,
  },
  miniStat: {
    alignItems: 'center',
  },
  miniVal: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  miniLab: {
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
    marginTop: 15,
    fontSize: 14,
  },
  emptyMainBtn: {
    marginTop: 20,
    backgroundColor: theme.success,
  }
});
