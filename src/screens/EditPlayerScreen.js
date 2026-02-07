import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  TextInput as PaperTextInput,
  Button,
  Chip,
  Surface,
  Divider
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

// Utility imports
import { StorageService } from '../utils/storage';

/**
 * EditPlayerScreen Component - Premium Redesign (CrickHeroes Style)
 * 👨‍🏫 EXPLANATION FOR SIR:
 * "Sir, I have updated the Edit Player screen to maintain consistency with our 
 * premium design. The form is now organized into logical sections using 'Surfaces'.
 * I simplified the save logic to focus on merging the existing player data with 
 * the new updates, making it much easier to trace and explain during a demo."
 */
export default function EditPlayerScreen({ navigation, route }) {
  const { theme } = useTheme();
  // --- STATE ---
  const { player } = route.params;
  const [name, setName] = useState(player.name);
  const [role, setRole] = useState(player.role);
  const [team, setTeam] = useState(player.team || '');
  const [loading, setLoading] = useState(false);

  // Stats state - Initialized with current values
  const [stats, setStats] = useState({
    matches: player.stats?.matches || 0,
    runs: player.stats?.runs || 0,
    wickets: player.stats?.wickets || 0,
    balls: player.stats?.balls || 0,
    runsConceded: player.stats?.runsConceded || 0,
    overs: player.stats?.overs || 0,
    catches: player.stats?.catches || 0,
    fours: player.stats?.fours || 0,
    sixes: player.stats?.sixes || 0,
    maidens: player.stats?.maidens || 0,
    stumpings: player.stats?.stumpings || 0,
    runOuts: player.stats?.runOuts || 0
  });

  const roles = ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];

  // --- LOGIC ---

  const updateStat = (key, value) => {
    const numValue = value === '' ? 0 : parseInt(value, 10) || 0;
    setStats(prev => ({ ...prev, [key]: numValue }));
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Player name cannot be empty');
      return;
    }

    setLoading(true);

    try {
      // 👨‍🏫 EXPLANATION: Merging existing player data with updated fields
      const updatedPlayer = {
        ...player,
        name: name.trim(),
        role: role,
        team: team.trim() || 'Free Agent',
        stats: stats,
        updatedAt: new Date().toISOString()
      };

      await StorageService.updatePlayer(updatedPlayer);

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'Done', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.log('Error updating player:', error);
      Alert.alert('Error', 'Update failed. Check storage.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    Alert.alert('Confirm Reset', 'Clear all statistics for this player?', [
      { text: 'Cancel' },
      {
        text: 'Reset', onPress: () => setStats({
          matches: 0, runs: 0, wickets: 0, balls: 0, runsConceded: 0,
          overs: 0, catches: 0, fours: 0, sixes: 0, maidens: 0,
          stumpings: 0, runOuts: 0
        })
      }
    ]);
  };

  // --- UI COMPONENTS ---

  const renderStatInput = (label, key, icon) => (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}><Ionicons name={icon} size={12} /> {label}</Text>
      <PaperTextInput
        mode="flat"
        dense
        value={stats[key].toString()}
        onChangeText={(val) => updateStat(key, val)}
        keyboardType="numeric"
        style={styles.miniInput}
        textColor="#ffffff"
        activeUnderlineColor={theme.success}
      />
    </View>
  );

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
              <Ionicons name="close-circle" size={28} color={theme.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* BASIC INFO */}
          <Surface style={styles.sectionCard} elevation={2}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="create-outline" size={20} color={theme.success} />
              <Text style={styles.sectionTitle}>Profile Details</Text>
            </View>

            <PaperTextInput
              label="Name"
              mode="outlined"
              value={name}
              onChangeText={setName}
              style={styles.mainInput}
              outlineColor={theme.borderLight}
              activeOutlineColor={theme.success}
              textColor="#ffffff"
            />

            <PaperTextInput
              label="Team"
              mode="outlined"
              value={team}
              onChangeText={setTeam}
              style={styles.mainInput}
              outlineColor={theme.borderLight}
              activeOutlineColor={theme.success}
              textColor="#ffffff"
            />

            <Text style={styles.label}>Team Role</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roleRow}>
              {roles.map(r => (
                <Chip
                  key={r}
                  selected={role === r}
                  onPress={() => setRole(r)}
                  style={[styles.roleChip, role === r && styles.roleChipActive]}
                  textStyle={[styles.roleText, role === r && styles.roleTextActive]}
                >
                  {r}
                </Chip>
              ))}
            </ScrollView>
          </Surface>

          {/* PERFORMANCE STATS */}
          <Surface style={styles.sectionCard} elevation={2}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="trophy-outline" size={20} color="#60a5fa" />
              <Text style={styles.sectionTitle}>Performance Stats</Text>
              <TouchableOpacity onPress={handleReset} style={{ marginLeft: 'auto' }}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.gridRow}>
                {renderStatInput('Matches', 'matches', 'calendar')}
                {renderStatInput('Runs', 'runs', 'baseball')}
              </View>

              <View style={styles.gridRow}>
                {renderStatInput('Wickets', 'wickets', 'disc')}
                {renderStatInput('Catches', 'catches', 'hand-left')}
              </View>

              <View style={styles.gridRow}>
                {renderStatInput('4s', 'fours', 'flash')}
                {renderStatInput('6s', 'sixes', 'rocket')}
              </View>
            </View>
          </Surface>

          {/* SAVE ACTIONS */}
          <View style={styles.footer}>
            <Button
              mode="contained"
              onPress={handleUpdate}
              loading={loading}
              disabled={loading}
              style={styles.saveBtn}
              contentStyle={{ height: 50 }}
              labelStyle={{ fontWeight: 'bold', fontSize: 16 }}
            >
              Update Player Info
            </Button>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
    marginBottom: 10,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionCard: {
    backgroundColor: theme.border,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
  },
  sectionTitleRow: {
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
  resetText: {
    color: theme.error,
    fontSize: 12,
    fontWeight: 'bold',
  },
  mainInput: {
    backgroundColor: theme.background,
    marginBottom: 15,
  },
  label: {
    color: theme.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
    marginBottom: 12,
  },
  roleRow: {
    flexDirection: 'row',
  },
  roleChip: {
    backgroundColor: theme.background,
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
  statsGrid: {
    marginTop: 5,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statBox: {
    width: '48%',
  },
  statLabel: {
    color: theme.textSecondary,
    fontSize: 11,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  miniInput: {
    backgroundColor: theme.background,
    height: 40,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    marginTop: 10,
  },
  saveBtn: {
    backgroundColor: theme.success,
    borderRadius: 15,
  }
});
