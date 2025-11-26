import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  IconButton,
  Divider,
} from 'react-native-paper';
import { StorageService } from '../utils/storage';

const defaultPerformance = (player) => ({
  playerId: player.id,
  playerName: player.name,
  runs: '0',
  balls: '0',
  fours: '0',
  sixes: '0',
  wickets: '0',
  overs: '0',
  runsConceded: '0',
  maidens: '0',
  catches: '0',
  stumpings: '0',
  runOuts: '0',
});

export default function RecordMatchScreen({ navigation }) {
  const [players, setPlayers] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [opponent, setOpponent] = useState('');
  const [venue, setVenue] = useState('');
  const [result, setResult] = useState('');
  const [notes, setNotes] = useState('');
  const [matchDate, setMatchDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      const data = await StorageService.getPlayers();
      setPlayers(data);
    };
    fetchPlayers();
  }, []);

  const addPlayerPerformance = (player) => {
    setPerformances((prev) => [...prev, defaultPerformance(player)]);
    setModalVisible(false);
  };

  const updatePerformance = (playerId, field, value) => {
    setPerformances((prev) =>
      prev.map((performance) =>
        performance.playerId === playerId
          ? { ...performance, [field]: value }
          : performance
      )
    );
  };

  const removePerformance = (playerId) => {
    setPerformances((prev) =>
      prev.filter((performance) => performance.playerId !== playerId)
    );
  };

  const handleSave = async () => {
    if (performances.length === 0) {
      Alert.alert('Missing data', 'Add at least one player performance.');
      return;
    }

    setSaving(true);

    const match = {
      id: Date.now().toString(),
      date: matchDate,
      opponent: opponent.trim() || 'Friendly Fixture',
      venue: venue.trim() || 'Home Ground',
      result: result.trim() || 'Win',
      notes: notes.trim(),
      performances: performances.map((performance) => ({
        ...performance,
        runs: Number(performance.runs) || 0,
        balls: Number(performance.balls) || 0,
        fours: Number(performance.fours) || 0,
        sixes: Number(performance.sixes) || 0,
        wickets: Number(performance.wickets) || 0,
        overs: Number(performance.overs) || 0,
        runsConceded: Number(performance.runsConceded) || 0,
        maidens: Number(performance.maidens) || 0,
        catches: Number(performance.catches) || 0,
        stumpings: Number(performance.stumpings) || 0,
        runOuts: Number(performance.runOuts) || 0,
      })),
      createdAt: new Date().toISOString(),
    };

    try {
      await StorageService.recordMatch(match);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to record match. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const renderPerformanceCard = (performance) => (
    <Card key={performance.playerId} style={styles.performanceCard} mode="elevated">
      <Card.Title
        title={performance.playerName}
        subtitle="Match contribution"
        right={(props) => (
          <IconButton
            {...props}
            icon="close"
            onPress={() => removePerformance(performance.playerId)}
          />
        )}
      />
      <Card.Content>
        <View style={styles.performanceRow}>
          <TextInput
            label="Runs"
            value={performance.runs}
            onChangeText={(value) =>
              updatePerformance(performance.playerId, 'runs', value)
            }
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Balls"
            value={performance.balls}
            onChangeText={(value) =>
              updatePerformance(performance.playerId, 'balls', value)
            }
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Fours"
            value={performance.fours}
            onChangeText={(value) =>
              updatePerformance(performance.playerId, 'fours', value)
            }
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Sixes"
            value={performance.sixes}
            onChangeText={(value) =>
              updatePerformance(performance.playerId, 'sixes', value)
            }
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <Divider style={styles.divider} />
        <View style={styles.performanceRow}>
          <TextInput
            label="Wickets"
            value={performance.wickets}
            onChangeText={(value) =>
              updatePerformance(performance.playerId, 'wickets', value)
            }
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Overs"
            value={performance.overs}
            onChangeText={(value) =>
              updatePerformance(performance.playerId, 'overs', value)
            }
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Runs Conceded"
            value={performance.runsConceded}
            onChangeText={(value) =>
              updatePerformance(performance.playerId, 'runsConceded', value)
            }
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Maidens"
            value={performance.maidens}
            onChangeText={(value) =>
              updatePerformance(performance.playerId, 'maidens', value)
            }
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
        <Divider style={styles.divider} />
        <View style={styles.performanceRow}>
          <TextInput
            label="Catches"
            value={performance.catches}
            onChangeText={(value) =>
              updatePerformance(performance.playerId, 'catches', value)
            }
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Stumpings"
            value={performance.stumpings}
            onChangeText={(value) =>
              updatePerformance(performance.playerId, 'stumpings', value)
            }
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            label="Run Outs"
            value={performance.runOuts}
            onChangeText={(value) =>
              updatePerformance(performance.playerId, 'runOuts', value)
            }
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
      </Card.Content>
    </Card>
  );

  const renderPlayerItem = ({ item }) => (
    <Card style={styles.playerCard} onPress={() => addPlayerPerformance(item)}>
      <Card.Content>
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={styles.playerRole}>{item.role}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Title title="Match Details" />
          <Card.Content>
            <TextInput
              label="Match Date (YYYY-MM-DD)"
              value={matchDate}
              onChangeText={setMatchDate}
              style={styles.fullWidthInput}
            />
            <TextInput
              label="Opponent"
              value={opponent}
              onChangeText={setOpponent}
              style={styles.fullWidthInput}
            />
            <TextInput
              label="Venue"
              value={venue}
              onChangeText={setVenue}
              style={styles.fullWidthInput}
            />
            <TextInput
              label="Result (Win/Loss/Draw)"
              value={result}
              onChangeText={setResult}
              style={styles.fullWidthInput}
            />
            <TextInput
              label="Notes"
              value={notes}
              onChangeText={setNotes}
              style={styles.fullWidthInput}
              multiline
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title
            title="Player Performances"
            right={(props) => (
              <IconButton
                {...props}
                icon="account-plus"
                onPress={() => setModalVisible(true)}
              />
            )}
          />
          <Card.Content>
            {performances.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  Add a player to start tracking the match.
                </Text>
                <Button mode="contained" onPress={() => setModalVisible(true)}>
                  Add Player Performance
                </Button>
              </View>
            ) : (
              performances.map(renderPerformanceCard)
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={saving}
          disabled={saving || performances.length === 0}
        >
          Save Match
        </Button>
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Player</Text>
            <IconButton icon="close" onPress={() => setModalVisible(false)} />
          </View>
          {players.length === 0 ? (
            <View style={styles.modalEmpty}>
              <Text style={styles.modalEmptyText}>
                Add players first to record a performance.
              </Text>
              <Button mode="contained" onPress={() => setModalVisible(false)}>
                Close
              </Button>
            </View>
          ) : (
            <FlatList
              data={players.filter(
                (player) =>
                  !performances.some((perf) => perf.playerId === player.id)
              )}
              keyExtractor={(item) => item.id}
              renderItem={renderPlayerItem}
              contentContainerStyle={styles.modalList}
              ListEmptyComponent={
                <View style={styles.modalEmpty}>
                  <Text style={styles.modalEmptyText}>
                    All players for this match already have stats.
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    borderRadius: 18,
  },
  fullWidthInput: {
    marginBottom: 12,
  },
  performanceCard: {
    marginBottom: 16,
    borderRadius: 14,
  },
  performanceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    minWidth: 120,
  },
  divider: {
    marginVertical: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    backgroundColor: '#0f172a',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#64748b',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalList: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  modalEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalEmptyText: {
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 16,
  },
  playerCard: {
    marginBottom: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  playerRole: {
    color: '#475569',
  },
});

