import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  TextInput as PaperTextInput,
  Button,
  Card,
  IconButton,
  Divider,
  Surface,
  Avatar,
  Chip
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../utils/storage';

/**
 * RecordMatchScreen Component - Premium Redesign (CrickHeroes Style)
 * 👨‍🏫 EXPLANATION FOR SIR:
 * "Sir, I have redesigned the match recording screen to feel like a professional 
 * 'Match Room'. I simplified the code by using a single list to track player 
 * performances. This makes it very easy to explain how we collect runs, wickets, 
 * and other match data for multiple players at once."
 */
export default function RecordMatchScreen({ navigation }) {
  // --- STATE ---
  const [players, setPlayers] = useState([]); // List of all players in squad
  const [performances, setPerformances] = useState([]); // Players playing in this match
  const [matchDetails, setMatchDetails] = useState({
    opponent: '',
    venue: '',
    result: 'Win', // Win, Loss, Draw
    date: new Date().toISOString().substring(0, 10),
    wides: '0',
    noBalls: '0',
    notes: ''
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  // --- DATA LOADING ---

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    const data = await StorageService.getPlayers() || [];
    setPlayers(data);
  };

  // --- LOGIC ---

  // Add a player to the match lineup
  const addPlayerToMatch = (player) => {
    // Check if player is already added
    const exists = performances.find(p => p.playerId === player.id);
    if (!exists) {
      const initialPerf = {
        playerId: player.id,
        playerName: player.name,
        runs: '0',
        balls: '0',
        wickets: '0',
        overs: '0',
        runsConceded: '0',
        catches: '0',
        fours: '0',
        sixes: '0',
        maidens: '0',
        stumpings: '0',
        runOuts: '0',
      };
      setPerformances([...performances, initialPerf]);
    }
    setModalVisible(false);
  };

  // 👨‍🏫 EXPLANATION: Simple function to update stats for a specific player
  const updatePlayerStat = (playerId, field, value) => {
    setPerformances(prev => prev.map(p =>
      p.playerId === playerId ? { ...p, [field]: value } : p
    ));
  };

  const removePlayerFromMatch = (playerId) => {
    setPerformances(prev => prev.filter(p => p.playerId !== playerId));
  };

  const handleSaveMatch = async () => {
    if (performances.length === 0) {
      Alert.alert('Selection Required', 'Please add at least one player to this match.');
      return;
    }

    setSaving(true);
    try {
      // 👨‍🏫 EXPLANATION: Convert string inputs to Numbers before saving
      const matchData = {
        id: Date.now().toString(),
        ...matchDetails,
        wides: Number(matchDetails.wides) || 0,
        noBalls: Number(matchDetails.noBalls) || 0,
        performances: performances.map(p => ({
          ...p,
          runs: Number(p.runs) || 0,
          balls: Number(p.balls) || 0,
          wickets: Number(p.wickets) || 0,
          overs: Number(p.overs) || 0,
          runsConceded: Number(p.runsConceded) || 0,
          catches: Number(p.catches) || 0,
          fours: Number(p.fours) || 0,
          sixes: Number(p.sixes) || 0,
          maidens: Number(p.maidens) || 0,
          stumpings: Number(p.stumpings) || 0,
          runOuts: Number(p.runOuts) || 0,
        })),
        createdAt: new Date().toISOString(),
      };

      await StorageService.recordMatch(matchData);
      Alert.alert('Success!', 'Match record saved in history.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.log("Error saving match:", error);
      Alert.alert('Error', 'Failed to save the match data.');
    } finally {
      setSaving(false);
    }
  };

  // --- UI COMPONENTS ---

  const renderPerformanceCard = (perf) => (
    <Surface key={perf.playerId} style={styles.perfCard} elevation={2}>
      <View style={styles.perfHeader}>
        <View style={styles.avatarMini}>
          <Avatar.Text size={30} label={perf.playerName.substring(0, 1).toUpperCase()} backgroundColor=theme.background labelStyle={{ fontSize: 12, color: theme.success }} />
          <Text style={styles.perfPlayerName}>{perf.playerName}</Text>
        </View>
        <TouchableOpacity onPress={() => removePlayerFromMatch(perf.playerId)}>
          <Ionicons name="trash-outline" size={18} color=theme.error />
        </TouchableOpacity>
      </View>

      <View style={styles.statGrid}>
        <View style={styles.statInputRow}>
          {renderStatInput(perf.playerId, 'runs', 'Runs', 'baseball')}
          {renderStatInput(perf.playerId, 'balls', 'Balls', 'radio-button-on')}
          {renderStatInput(perf.playerId, 'wickets', 'Wkts', 'disc')}
        </View>
        <View style={styles.statInputRow}>
          {renderStatInput(perf.playerId, 'overs', 'Overs', 'infinite')}
          {renderStatInput(perf.playerId, 'runsConceded', 'Conc', 'remove-circle')}
          {renderStatInput(perf.playerId, 'catches', 'Ctch', 'hand-left')}
        </View>
      </View>
    </Surface>
  );

  const renderStatInput = (playerId, field, label, icon) => (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}><Ionicons name={icon} size={10} /> {label}</Text>
      <PaperTextInput
        mode="flat"
        dense
        value={performances.find(p => p.playerId === playerId)[field]}
        onChangeText={(val) => updatePlayerStat(playerId, field, val)}
        keyboardType="numeric"
        style={styles.miniStatInput}
        textColor="#ffffff"
        activeUnderlineColor=theme.success
      />
    </View>
  );

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.border,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerAction: {
    color: theme.success,
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionCard: {
    backgroundColor: theme.border,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  mainInput: {
    flex: 1,
    backgroundColor: theme.background,
    height: 50,
  },
  miniInput: {
    backgroundColor: theme.background,
    height: 40,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  label: {
    color: theme.textSecondary,
    fontSize: 12,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  resultPicker: {
    flexDirection: 'row',
    backgroundColor: theme.background,
    borderRadius: 10,
    padding: 4,
  },
  resBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  resBtnActive: {
    backgroundColor: theme.success,
  },
  resText: {
    color: theme.textSecondary,
    fontSize: 12,
  },
  resTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  sectionHeaderLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  addPlayerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#60a5fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 5,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyLineup: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    paddingHorizontal: 40,
  },
  emptyNote: {
    color: theme.textTertiary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 18,
  },
  perfCard: {
    backgroundColor: theme.border,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
  },
  perfHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  perfPlayerName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statGrid: {
    gap: 12,
  },
  statInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '31%',
  },
  statLabel: {
    color: theme.textSecondary,
    fontSize: 9,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  miniStatInput: {
    backgroundColor: theme.background,
    height: 35,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.border,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  playerPickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.borderLight,
  },
  pickName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickRole: {
    color: theme.textSecondary,
    fontSize: 12,
  },
  emptyPickerNote: {
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 50,
  },
  absoluteSave: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  mainSaveBtn: {
    backgroundColor: theme.success,
    borderRadius: 18,
    elevation: 10,
  }
});

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Match Recording</Text>
            <TouchableOpacity onPress={handleSaveMatch} disabled={saving}>
              <Text style={[styles.headerAction, { opacity: saving ? 0.5 : 1 }]}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* 1. MATCH DETAILS SECTION */}
          <Surface style={styles.sectionCard} elevation={1}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle-outline" size={20} color=theme.success />
              <Text style={styles.sectionTitle}>Match Details</Text>
            </View>

            <View style={styles.detailRow}>
              <PaperTextInput
                label="Opponent Team"
                mode="outlined"
                value={matchDetails.opponent}
                onChangeText={(val) => setMatchDetails({ ...matchDetails, opponent: val })}
                style={styles.mainInput}
                outlineColor=theme.borderLight
                activeOutlineColor=theme.success
                textColor="#ffffff"
              />
              <PaperTextInput
                label="Venue"
                mode="outlined"
                value={matchDetails.venue}
                onChangeText={(val) => setMatchDetails({ ...matchDetails, venue: val })}
                style={styles.mainInput}
                outlineColor=theme.borderLight
                activeOutlineColor=theme.success
                textColor="#ffffff"
              />
            </View>

            <View style={styles.metaRow}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Result</Text>
                <View style={styles.resultPicker}>
                  {['Win', 'Loss', 'Draw'].map(res => (
                    <TouchableOpacity
                      key={res}
                      style={[styles.resBtn, matchDetails.result === res && styles.resBtnActive]}
                      onPress={() => setMatchDetails({ ...matchDetails, result: res })}
                    >
                      <Text style={[styles.resText, matchDetails.result === res && styles.resTextActive]}>{res}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Date</Text>
                <PaperTextInput
                  mode="outlined"
                  value={matchDetails.date}
                  onChangeText={(val) => setMatchDetails({ ...matchDetails, date: val })}
                  style={[styles.mainInput, { height: 40 }]}
                  outlineColor=theme.borderLight
                  activeOutlineColor="#60a5fa"
                  textColor="#ffffff"
                  dense
                />
              </View>
            </View>

            {/* NEW: EXTRAS SECTION */}
            <View style={[styles.metaRow, { marginTop: 20 }]}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Wides</Text>
                <PaperTextInput
                  mode="outlined"
                  value={matchDetails.wides}
                  onChangeText={(val) => setMatchDetails({ ...matchDetails, wides: val })}
                  keyboardType="numeric"
                  style={styles.miniInput}
                  outlineColor=theme.borderLight
                  activeOutlineColor=theme.success
                  textColor="#ffffff"
                  dense
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>No-Balls</Text>
                <PaperTextInput
                  mode="outlined"
                  value={matchDetails.noBalls}
                  onChangeText={(val) => setMatchDetails({ ...matchDetails, noBalls: val })}
                  keyboardType="numeric"
                  style={styles.miniInput}
                  outlineColor=theme.borderLight
                  activeOutlineColor=theme.success
                  textColor="#ffffff"
                  dense
                />
              </View>
            </View>
          </Surface>

          {/* 2. PLAYER LINEUP SECTION */}
          <View style={styles.sectionHeaderLine}>
            <Text style={styles.sectionTitle}>Player Performances</Text>
            <TouchableOpacity style={styles.addPlayerBtn} onPress={() => setModalVisible(true)}>
              <Ionicons name="person-add" size={16} color="#ffffff" />
              <Text style={styles.addBtnText}>Add Player</Text>
            </TouchableOpacity>
          </View>

          {performances.length === 0 ? (
            <View style={styles.emptyLineup}>
              <Ionicons name="people-outline" size={50} color=theme.border />
              <Text style={styles.emptyNote}>Add players to start recording their match performance</Text>
            </View>
          ) : (
            performances.map(renderPerformanceCard)
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* PLAYER SELECTION MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <Surface style={styles.modalContent} elevation={5}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Player</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={players.filter(p => !performances.some(perf => perf.playerId === p.id))}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.playerPickItem} onPress={() => addPlayerToMatch(item)}>
                  <Avatar.Text size={35} label={item.name.substring(0, 1).toUpperCase()} backgroundColor=theme.border labelStyle={{ color: theme.success }} />
                  <View style={{ marginLeft: 15 }}>
                    <Text style={styles.pickName}>{item.name}</Text>
                    <Text style={styles.pickRole}>{item.role}</Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.emptyPickerNote}>All squad members already added!</Text>}
              contentContainerStyle={{ padding: 20 }}
            />
          </Surface>
        </View>
      </Modal>

      {/* FLOAT SAVE BUTTON */}
      <View style={styles.absoluteSave}>
        <Button
          mode="contained"
          onPress={handleSaveMatch}
          loading={saving}
          disabled={saving || performances.length === 0}
          style={styles.mainSaveBtn}
          contentStyle={{ height: 55 }}
        >
          Finish & Record Match
        </Button>
      </View>
    </SafeAreaView>
  );
}


