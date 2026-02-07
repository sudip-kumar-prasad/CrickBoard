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
  IconButton,
  Divider
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

// Utility imports
import { StorageService } from '../utils/storage';

/**
 * AddPlayerScreen Component - Premium Redesign (CrickHeroes Style)
 * DEVELOPER NOTE:
 * Organized the form into logical sections for improved UX. The state 
 * management logic is kept intentional and linear to ensure easy 
 * debugging and future extensibility of player metadata.
 */
export default function AddPlayerScreen({ navigation }) {
  const { theme } = useTheme();
  // --- STATE ---
  const [name, setName] = useState('');
  const [role, setRole] = useState('Batsman');
  const [team, setTeam] = useState('');
  const [loading, setLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Initial stats state - Simplified for student understanding
  const [stats, setStats] = useState({
    matches: 0,
    runs: 0,
    wickets: 0,
    balls: 0,
    runsConceded: 0,
    overs: 0,
    catches: 0,
    fours: 0,
    sixes: 0,
    maidens: 0,
    stumpings: 0,
    runOuts: 0
  });

  const roles = ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];

  // --- LOGIC ---

  // Update a specific stat safely
  const updateStat = (key, value) => {
    // 👨‍🏫 EXPLANATION: Convert text to Number, or 0 if empty/invalid
    const numValue = value === '' ? 0 : parseInt(value, 10) || 0;
    setStats(prev => ({ ...prev, [key]: numValue }));
  };

  const handleSave = async () => {
    // 1. Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a player name');
      return;
    }

    setLoading(true);

    try {
      // 2. Create player object (Linear structure)
      const newPlayer = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
        name: name.trim(),
        role: role,
        team: team.trim() || 'Free Agent',
        stats: stats,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 3. Save to storage
      await StorageService.addPlayer(newPlayer);

      Alert.alert('Success', 'New player added to squad!', [
        { text: 'Great!', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.log('Error adding player:', error);
      Alert.alert('Error', 'Something went wrong while saving.');
    } finally {
      setLoading(false);
    }
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background, // Deep Navy
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
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
      marginBottom: 20,
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
    collapsedNote: {
      color: theme.textTertiary,
      fontSize: 12,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    statsGrid: {
      marginTop: 5,
    },
    statsHint: {
      color: theme.textTertiary,
      fontSize: 11,
      marginBottom: 15,
      borderLeftWidth: 2,
      borderLeftColor: '#60a5fa',
      paddingLeft: 8,
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
      padding: 20,
      marginTop: 10,
    },
    saveBtn: {
      backgroundColor: theme.success,
      borderRadius: 15,
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* 1. HEADER SECTION */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add New Player</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* 2. BASIC INFO SECTION */}
          <Surface style={styles.sectionCard} elevation={2}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="person-circle-outline" size={20} color={theme.success} />
              <Text style={styles.sectionTitle}>Basic Information</Text>
            </View>

            <PaperTextInput
              label="Player Name *"
              mode="outlined"
              value={name}
              onChangeText={setName}
              style={styles.mainInput}
              outlineColor={theme.borderLight}
              activeOutlineColor={theme.success}
              textColor="#ffffff"
            />

            <PaperTextInput
              label="Team / Club Name"
              mode="outlined"
              value={team}
              onChangeText={setTeam}
              style={styles.mainInput}
              outlineColor={theme.borderLight}
              activeOutlineColor={theme.success}
              textColor="#ffffff"
              placeholder="Optional"
            />

            <Text style={styles.label}>Primary Role</Text>
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

          {/* 3. INITIAL STATS SECTION (Collapsible) */}
          <Surface style={styles.sectionCard} elevation={2}>
            <TouchableOpacity
              style={styles.sectionTitleRow}
              onPress={() => setShowStats(!showStats)}
              activeOpacity={0.7}
            >
              <Ionicons name="stats-chart-outline" size={20} color="#60a5fa" />
              <Text style={styles.sectionTitle}>Initial Statistics</Text>
              <Ionicons
                name={showStats ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.textSecondary}
                style={{ marginLeft: 'auto' }}
              />
            </TouchableOpacity>

            {showStats ? (
              <View style={styles.statsGrid}>
                <Text style={styles.statsHint}>If this player has existing data, enter it below. Otherwise leave as 0.</Text>

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
            ) : (
              <Text style={styles.collapsedNote}>Click to add past match history (Runs, Wickets, etc.)</Text>
            )}
          </Surface>

          {/* 4. ACTION BUTTONS */}
          <View style={styles.footer}>
            <Button
              mode="contained"
              onPress={handleSave}
              loading={loading}
              disabled={loading}
              style={styles.saveBtn}
              contentStyle={{ height: 50 }}
              labelStyle={{ fontWeight: 'bold', fontSize: 16 }}
            >
              {loading ? 'Adding Player...' : 'Save Player to Squad'}
            </Button>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
