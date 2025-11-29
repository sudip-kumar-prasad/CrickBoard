import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput } from 'react-native';
import { Text, TextInput as PaperTextInput, Button, Chip, Card } from 'react-native-paper';
import { StorageService } from '../utils/storage';
import { createPlayer, createPlayerStats } from '../types';

export default function AddPlayerScreen({ navigation }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Batsman');
  const [team, setTeam] = useState('');
  const [loading, setLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Initialize stats with defaults
  const [stats, setStats] = useState(() => createPlayerStats());

  const roles = ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const updateStat = (key, value) => {
    const numValue = value === '' ? 0 : parseInt(value, 10) || 0;
    setStats((prev) => ({ ...prev, [key]: numValue }));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter player name');
      return;
    }

    // Validate numeric inputs
    const invalidFields = [];
    Object.entries(stats).forEach(([key, value]) => {
      if (isNaN(value) || value < 0) {
        invalidFields.push(key);
      }
    });

    if (invalidFields.length > 0) {
      Alert.alert('Error', 'Please enter valid numbers for all statistics');
      return;
    }

    setLoading(true);

    try {
      const newPlayer = createPlayer(
        generateId(),
        name.trim(),
        role,
        team.trim() || undefined,
        stats,
        new Date().toISOString(),
        new Date().toISOString()
      );

      await StorageService.addPlayer(newPlayer);
      Alert.alert('Success', 'Player added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error adding player:', error);
      Alert.alert('Error', 'Failed to add player');
    } finally {
      setLoading(false);
    }
  };

  const handleResetStats = () => {
    Alert.alert(
      'Reset Statistics',
      'Are you sure you want to reset all statistics to zero?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const defaultStats = createPlayerStats();
            setStats(defaultStats);
          },
        },
      ]
    );
  };

  const renderRoleSelector = () => (
    <View style={styles.roleContainer}>
      <Text style={styles.label}>Role</Text>
      <View style={styles.roleButtons}>
        {roles.map((roleOption) => (
          <Chip
            key={roleOption}
            selected={role === roleOption}
            onPress={() => setRole(roleOption)}
            style={styles.roleChip}
          >
            {roleOption}
          </Chip>
        ))}
      </View>
    </View>
  );

  const renderStatInput = (label, key, placeholder = '0') => (
    <View style={styles.statInputGroup}>
      <Text style={styles.statLabel}>{label}</Text>
      <TextInput
        style={styles.statInput}
        value={stats[key].toString()}
        onChangeText={(value) => updateStat(key, value)}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        keyboardType="numeric"
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.form}>
          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👤 Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Player Name *</Text>
              <PaperTextInput
                mode="outlined"
                value={name}
                onChangeText={setName}
                placeholder="Enter player name"
                autoCapitalize="words"
                style={styles.textInput}
              />
            </View>

            {renderRoleSelector()}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Team (Optional)</Text>
              <PaperTextInput
                mode="outlined"
                value={team}
                onChangeText={setTeam}
                placeholder="Enter team name"
                autoCapitalize="words"
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Statistics Section - Collapsible */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.statsToggle}
              onPress={() => setShowStats(!showStats)}
            >
              <Text style={styles.sectionTitle}>📊 Initial Statistics (Optional)</Text>
              <Text style={styles.toggleText}>
                {showStats ? 'Hide' : 'Show'} Statistics
              </Text>
            </TouchableOpacity>

            {showStats && (
              <>
                <Text style={styles.statsNote}>
                  Set initial statistics if the player has already played matches. Leave at 0 to start fresh.
                </Text>

                {/* Batting Statistics */}
                <View style={styles.statsSubsection}>
                  <Text style={styles.subsectionTitle}>🏏 Batting</Text>
                  <View style={styles.statsGrid}>
                    {renderStatInput('Matches', 'matches')}
                    {renderStatInput('Runs', 'runs')}
                    {renderStatInput('Balls Faced', 'balls')}
                    {renderStatInput('Fours', 'fours')}
                    {renderStatInput('Sixes', 'sixes')}
                  </View>
                </View>

                {/* Bowling Statistics */}
                <View style={styles.statsSubsection}>
                  <Text style={styles.subsectionTitle}>🎯 Bowling</Text>
                  <View style={styles.statsGrid}>
                    {renderStatInput('Wickets', 'wickets')}
                    {renderStatInput('Overs', 'overs')}
                    {renderStatInput('Runs Conceded', 'runsConceded')}
                    {renderStatInput('Maidens', 'maidens')}
                  </View>
                </View>

                {/* Fielding Statistics */}
                <View style={styles.statsSubsection}>
                  <Text style={styles.subsectionTitle}>✋ Fielding</Text>
                  <View style={styles.statsGrid}>
                    {renderStatInput('Catches', 'catches')}
                    {renderStatInput('Stumpings', 'stumpings')}
                    {renderStatInput('Run Outs', 'runOuts')}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleResetStats}
                >
                  <Text style={styles.resetButtonText}>Reset All to Zero</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button mode="outlined" style={styles.actionBtn} onPress={() => navigation.goBack()}>
          Cancel
        </Button>
        <Button
          mode="contained"
          style={styles.actionBtn}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Player'}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContainer: {
    flex: 1,
  },
  form: {
    padding: 25,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  statsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleText: {
    fontSize: 14,
    color: '#60a5fa',
    fontWeight: '600',
  },
  statsNote: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 16,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  statsSubsection: {
    marginBottom: 20,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: 'transparent',
  },
  roleContainer: {
    marginBottom: 16,
  },
  roleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  roleChip: {
    marginRight: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statInputGroup: {
    width: '48%',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94a3b8',
    marginBottom: 6,
  },
  statInput: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 25,
    backgroundColor: 'transparent',
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 6,
  },
});
