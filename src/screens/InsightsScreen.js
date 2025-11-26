import React, { useCallback, useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  Card,
  Text,
  Button,
  List,
  Divider,
  IconButton,
} from 'react-native-paper';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { StorageService } from '../utils/storage';
import { StatsCalculator } from '../utils/calculations';

const chartConfig = {
  backgroundGradientFrom: '#0f172a',
  backgroundGradientTo: '#0f172a',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  fillShadowGradient: '#3b82f6',
  fillShadowGradientOpacity: 0.8,
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#38bdf8',
  },
};

export default function InsightsScreen({ navigation }) {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);

  const loadData = async () => {
    const [playersData, matchesData] = await Promise.all([
      StorageService.getPlayers(),
      StorageService.getMatches(),
    ]);
    setPlayers(playersData);
    setMatches(matchesData);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const leaderboards = useMemo(() => {
    const byRuns = [...players]
      .sort((a, b) => b.stats.runs - a.stats.runs)
      .slice(0, 5);
    const byWickets = [...players]
      .sort((a, b) => b.stats.wickets - a.stats.wickets)
      .slice(0, 5);
    const byCatches = [...players]
      .sort((a, b) => b.stats.catches - a.stats.catches)
      .slice(0, 5);

    return { byRuns, byWickets, byCatches };
  }, [players]);

  const trendData = useMemo(() => {
    if (matches.length === 0) {
      return {
        labels: [],
        datasets: [{ data: [] }],
      };
    }

    const latestMatches = matches.slice(0, 5).reverse();
    const totals = latestMatches.map((match) =>
      match.performances?.reduce(
        (sum, perf) => sum + (Number(perf.runs) || 0),
        0
      ) || 0
    );

    return {
      labels: latestMatches.map((match) =>
        new Date(match.date).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        })
      ),
      datasets: [{ data: totals }],
    };
  }, [matches]);

  const overallSummary = useMemo(() => {
    if (players.length === 0) {
      return null;
    }

    const totalRuns = players.reduce((sum, player) => sum + player.stats.runs, 0);
    const totalWickets = players.reduce(
      (sum, player) => sum + player.stats.wickets,
      0
    );
    const strikeRate = StatsCalculator.calculateStrikeRate(
      totalRuns,
      players.reduce((sum, player) => sum + player.stats.balls, 0)
    );

    const economy = StatsCalculator.calculateEconomyRate(
      players.reduce((sum, player) => sum + player.stats.runsConceded, 0),
      players.reduce((sum, player) => sum + player.stats.overs, 0)
    );

    return { totalRuns, totalWickets, strikeRate, economy };
  }, [players]);

  if (players.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No players yet</Text>
        <Text style={styles.emptySubtitle}>
          Add players and record matches to unlock insights.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Players', { screen: 'AddPlayer' })}
        >
          Add Player
        </Button>
      </View>
    );
  }

  const chartWidth = Dimensions.get('window').width - 32;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {overallSummary && (
        <Card style={styles.summaryCard} mode="elevated">
          <Card.Title
            title="Season Snapshot"
            right={(props) => (
              <IconButton
                {...props}
                icon="chart-areaspline"
                onPress={() => navigation.navigate('Matches')}
              />
            )}
          />
          <Card.Content style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Runs</Text>
              <Text style={styles.summaryValue}>{overallSummary.totalRuns}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Wickets</Text>
              <Text style={styles.summaryValue}>
                {overallSummary.totalWickets}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Strike Rate</Text>
              <Text style={styles.summaryValue}>
                {overallSummary.strikeRate}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Economy</Text>
              <Text style={styles.summaryValue}>{overallSummary.economy}</Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {leaderboards.byRuns.length > 0 && (
        <Card style={styles.card} mode="elevated">
          <Card.Title title="Top Run Scorers" />
          <Card.Content>
            <BarChart
              data={{
                labels: leaderboards.byRuns.map((player) => player.name.split(' ')[0]),
                datasets: [
                  {
                    data: leaderboards.byRuns.map((player) => player.stats.runs),
                  },
                ],
              }}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      )}

      {trendData.labels.length > 0 && (
        <Card style={styles.card} mode="elevated">
          <Card.Title title="Runs per Match (Last 5)" />
          <Card.Content>
            <LineChart
              data={trendData}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card} mode="elevated">
        <Card.Title title="Leaderboards" />
        <Card.Content>
          <List.Section>
            <List.Subheader>Wicket Machines</List.Subheader>
            {leaderboards.byWickets.map((player) => (
              <List.Item
                key={player.id}
                title={player.name}
                description={`${player.stats.wickets} wickets`}
                left={() => <List.Icon icon="target" />}
              />
            ))}
          </List.Section>
          <Divider />
          <List.Section>
            <List.Subheader>Fielding Impact</List.Subheader>
            {leaderboards.byCatches.map((player) => (
              <List.Item
                key={player.id}
                title={player.name}
                description={`${player.stats.catches} catches`}
                left={() => <List.Icon icon="baseball" />}
              />
            ))}
          </List.Section>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Matches', { screen: 'RecordMatch' })}
        style={styles.ctaButton}
      >
        Record Another Match
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  card: {
    marginBottom: 16,
    borderRadius: 18,
  },
  summaryCard: {
    marginBottom: 16,
    borderRadius: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  chart: {
    marginTop: 8,
    borderRadius: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#0f172a',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButton: {
    marginBottom: 32,
  },
});

