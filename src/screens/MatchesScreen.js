import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  Card,
  Text,
  Button,
  Chip,
  Divider,
  IconButton,
} from 'react-native-paper';
import { StorageService } from '../utils/storage';

const RESULT_FILTERS = ['ALL', 'WIN', 'LOSS', 'DRAW'];

export default function MatchesScreen({ navigation }) {
  const [matches, setMatches] = useState([]);
  const [filter, setFilter] = useState('ALL');

  const loadMatches = async () => {
    const data = await StorageService.getMatches();
    setMatches(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadMatches();
    }, [])
  );

  const stats = useMemo(() => {
    if (matches.length === 0) {
      return {
        totalMatches: 0,
        totalRuns: 0,
        totalWickets: 0,
      };
    }

    return matches.reduce(
      (acc, match) => {
        const runs = match.performances?.reduce(
          (sum, perf) => sum + (Number(perf.runs) || 0),
          0
        );

        const wickets = match.performances?.reduce(
          (sum, perf) => sum + (Number(perf.wickets) || 0),
          0
        );

        return {
          totalMatches: acc.totalMatches + 1,
          totalRuns: acc.totalRuns + (runs || 0),
          totalWickets: acc.totalWickets + (wickets || 0),
        };
      },
      {
        totalMatches: 0,
        totalRuns: 0,
        totalWickets: 0,
      }
    );
  }, [matches]);

  const filteredMatches = matches.filter((match) => {
    if (filter === 'ALL') return true;
    if (!match.result) return false;
    return match.result.toLowerCase().includes(filter.toLowerCase());
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderPerformanceSummary = (performances = []) => {
    if (performances.length === 0) {
      return <Text style={styles.emptyPerformance}>No player stats recorded.</Text>;
    }

    return performances.slice(0, 3).map((performance) => (
      <View key={performance.playerId} style={styles.performanceRow}>
        <View>
          <Text style={styles.performanceName}>{performance.playerName}</Text>
          <Text style={styles.performanceStats}>
            {performance.runs || 0} runs • {performance.wickets || 0} wkts • {performance.catches || 0} catches
          </Text>
        </View>
      </View>
    ));
  };

  const renderMatch = ({ item }) => (
    <Card style={styles.matchCard} mode="elevated">
      <Card.Title
        title={`vs ${item.opponent || 'Opponent TBD'}`}
        subtitle={`${formatDate(item.date)} • ${item.venue || 'Venue TBD'}`}
        right={(props) =>
          item.result ? (
            <Chip {...props} style={styles.resultChip}>
              {item.result}
            </Chip>
          ) : null
        }
      />
      <Card.Content>
        {item.notes ? (
          <>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
            <Divider style={styles.divider} />
          </>
        ) : null}
        {renderPerformanceSummary(item.performances)}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Card style={styles.statsCard} mode="elevated">
        <Card.Content style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Matches</Text>
            <Text style={styles.statValue}>{stats.totalMatches}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Runs</Text>
            <Text style={styles.statValue}>{stats.totalRuns}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Wickets</Text>
            <Text style={styles.statValue}>{stats.totalWickets}</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.filterRow}>
        {RESULT_FILTERS.map((item) => (
          <Chip
            key={item}
            style={styles.filterChip}
            selected={filter === item}
            onPress={() => setFilter(item)}
          >
            {item}
          </Chip>
        ))}
        <IconButton
          icon="plus-circle"
          size={28}
          onPress={() => navigation.navigate('RecordMatch')}
        />
      </View>

      {filteredMatches.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No matches recorded</Text>
          <Text style={styles.emptySubtitle}>
            Start by recording a match to unlock insights and leaderboards.
          </Text>
          <Button mode="contained" onPress={() => navigation.navigate('RecordMatch')}>
            Record Match
          </Button>
        </View>
      ) : (
        <FlatList
          data={filteredMatches}
          keyExtractor={(item) => item.id}
          renderItem={renderMatch}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
  },
  statsCard: {
    marginBottom: 16,
    borderRadius: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#64748b',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  matchCard: {
    marginBottom: 16,
    borderRadius: 18,
  },
  resultChip: {
    marginRight: 12,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  performanceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  performanceStats: {
    color: '#475569',
    marginTop: 2,
  },
  notesLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 1,
  },
  notesText: {
    color: '#1f2937',
    marginBottom: 12,
  },
  divider: {
    marginVertical: 8,
  },
  emptyPerformance: {
    color: '#94a3b8',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  listContent: {
    paddingBottom: 40,
  },
});

