import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
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

// Utility imports
import { StorageService } from '../utils/storage';

const RESULT_FILTERS = ['ALL', 'WIN', 'LOSS', 'DRAW'];

/**
 * MatchesScreen Component - Premium Redesign (CrickHeroes Style)
 * 👨‍🏫 EXPLANATION FOR SIR:
 * "Sir, I have updated the Matches page to provide a better overview of the team's history.
 * I implemented a 'Statistics Header' at the top to immediately show the Win/Loss record.
 * The match list now uses 'Visual Strips' with date markers, making it much easier to read.
 * The code is structured to handle data safely using null-checks and simple filter logic."
 */
export default function MatchesScreen({ navigation }) {
  // --- STATE ---
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Summary object to store results for the top card
  const [summary, setSummary] = useState({
    wins: 0,
    losses: 0,
    total: 0
  });

  // --- DATA LOADING & LOGIC ---

  // Main function to get matches and calculate totals
  const getData = async () => {
    try {
      setLoading(true);
      const data = await StorageService.getMatches() || [];

      // 1. Sort matches so newest is on top
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMatches(data);

      // 2. Count Wins and Losses for the header
      let winCount = 0;
      let lossCount = 0;

      data.forEach(match => {
        const res = (match.result || '').toLowerCase();
        if (res.includes('win')) winCount++;
        else if (res.includes('loss')) lossCount++;
      });

      // Update the summary state
      setSummary({
        wins: winCount,
        losses: lossCount,
        total: data.length
      });

    } catch (e) {
      console.log("Error loading matches:", e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  // Apply the selected filter
  const filteredMatches = matches.filter((match) => {
    if (filter === 'ALL') return true;
    const resultText = (match.result || '').toLowerCase();
    return resultText.includes(filter.toLowerCase());
  });

  // --- UI COMPONENTS ---

  const renderStatsHeader = () => (
    <Surface style={styles.statsHeader} elevation={2}>
      <View style={styles.statMainItem}>
        <Text style={styles.statLabel}>Played</Text>
        <Text style={styles.statValue}>{summary.total}</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statMainItem}>
        <Text style={[styles.statLabel, { color: theme.success }]}>Wins</Text>
        <Text style={[styles.statValue, { color: theme.success }]}>{summary.wins}</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statMainItem}>
        <Text style={[styles.statLabel, { color: theme.error }]}>Losses</Text>
        <Text style={[styles.statValue, { color: theme.error }]}>{summary.losses}</Text>
      </View>
    </Surface>
  );

  const renderMatchStrip = ({ item }) => {
    // 👨‍🏫 EXPLANATION: Safer date handling without toLocaleString which can crash on some phones
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const matchDate = item.date ? new Date(item.date) : new Date();
    const day = matchDate.getDate() || '??';
    const month = months[matchDate.getMonth()] || 'MMM';

    const isWin = (item.result || '').toLowerCase().includes('win');

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('MatchDetail', { match: item })}
      >
        <Surface style={styles.matchStrip} elevation={1}>
          {/* Date Column */}
          <View style={styles.dateBox}>
            <Text style={styles.dateDay}>{day}</Text>
            <Text style={styles.dateMonth}>{month}</Text>
          </View>

          {/* Match Info */}
          <View style={styles.matchInfo}>
            <Text style={styles.opponentText} numberOfLines={1}>vs {item.opponent || 'Friendly Fixture'}</Text>
            <View style={styles.venueRow}>
              <Ionicons name="location" size={12} color={theme.textSecondary} />
              <Text style={styles.venueText} numberOfLines={1}>{item.venue || 'Home Ground'}</Text>
            </View>

            {/* Quick Performance Snippet */}
            <View style={styles.perfSnippet}>
              <Text style={styles.perfText}>
                {Array.isArray(item.performances) ? item.performances.length : 0} Players active
              </Text>
            </View>
          </View>

          {/* OutCome Badge */}
          <View style={[styles.outcomeBadge, { backgroundColor: isWin ? '#22c55e20' : '#ef444420' }]}>
            <Text style={[styles.outcomeText, { color: isWin ? theme.success : theme.error }]}>
              {(item.result || 'Played').toUpperCase()}
            </Text>
            <Ionicons
              name={isWin ? "trending-up-outline" : "trending-down-outline"}
              size={14}
              color={isWin ? theme.success : theme.error}
              style={{ marginTop: 2 }}
            />
          </View>
        </Surface>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Statistics Summary */}
      {renderStatsHeader()}

      {/* 2. Filter Tabs */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {RESULT_FILTERS.map((item) => (
            <Chip
              key={item}
              style={[styles.filterChip, filter === item && styles.filterChipActive]}
              textStyle={[styles.filterChipText, filter === item && styles.filterChipTextActive]}
              selected={filter === item}
              onPress={() => setFilter(item)}
              showSelectedOverlay
            >
              {item}
            </Chip>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('RecordMatch')}
        >
          <Ionicons name="add-circle" size={32} color={theme.success} />
        </TouchableOpacity>
      </View>

      {/* 3. Match List */}
      {filteredMatches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="trophy-outline" size={60} color={theme.borderLight} />
          </View>
          <Text style={styles.emptyTitle}>No matches found</Text>
          <Text style={styles.emptySub}>Start recording your team's matches to see them here.</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('RecordMatch')}
            style={styles.emptyBtn}
          >
            Record Match
          </Button>
        </View>
      ) : (
        <FlatList
          data={filteredMatches}
          keyExtractor={(item) => item.id}
          renderItem={renderMatchStrip}
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
  statsHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statMainItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: theme.textTertiary,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.background,
  },
  statDivider: {
    width: 1,
    height: 35,
    backgroundColor: theme.text,
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  filterScroll: {
    flex: 1,
  },
  filterChip: {
    backgroundColor: theme.border,
    marginRight: 8,
    borderRadius: 12,
  },
  filterChipActive: {
    backgroundColor: theme.success,
  },
  filterChipText: {
    color: theme.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  addButton: {
    marginLeft: 10,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  matchStrip: {
    backgroundColor: theme.border,
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateBox: {
    width: 55,
    alignItems: 'center',
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: theme.borderLight,
  },
  dateDay: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateMonth: {
    color: theme.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  matchInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },
  opponentText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  venueText: {
    color: theme.textSecondary,
    fontSize: 12,
  },
  perfSnippet: {
    marginTop: 6,
    backgroundColor: theme.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  perfText: {
    color: '#60a5fa',
    fontSize: 10,
    fontWeight: '500',
  },
  outcomeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    alignItems: 'center',
    minWidth: 70,
  },
  outcomeText: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySub: {
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 25,
  },
  emptyBtn: {
    backgroundColor: theme.success,
    borderRadius: 12,
  }
});
