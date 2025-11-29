import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StorageService } from '../utils/storage';
import { createPlayerStats } from '../types';

export default function EditPlayerScreen({ navigation, route }) {
  const { player } = route.params;
  const [name, setName] = useState(player.name);
  const [role, setRole] = useState(player.role);
  const [team, setTeam] = useState(player.team || '');
  const [loading, setLoading] = useState(false);

  // Initialize stats with current player stats or defaults
  const [stats, setStats] = useState(() => ({
    matches: player.stats?.matches || 0,
    runs: player.stats?.runs || 0,
    balls: player.stats?.balls || 0,
    fours: player.stats?.fours || 0,
    sixes: player.stats?.sixes || 0,
    wickets: player.stats?.wickets || 0,
    overs: player.stats?.overs || 0,
    runsConceded: player.stats?.runsConceded || 0,
    maidens: player.stats?.maidens || 0,
    catches: player.stats?.catches || 0,
    stumpings: player.stats?.stumpings || 0,
    runOuts: player.stats?.runOuts || 0,
  }));

  const roles = ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];

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
      const updatedPlayer = {
        ...player,
        name: name.trim(),
        role,
        team: team.trim() || undefined,
        stats: {
          ...stats,
        },
        updatedAt: new Date().toISOString(),
      };

      await StorageService.updatePlayer(updatedPlayer);
      Alert.alert('Success', 'Player updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error updating player:', error);
      Alert.alert('Error', 'Failed to update player');
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
          <TouchableOpacity
            key={roleOption}
            style={[
              styles.roleButton,
              role === roleOption && styles.selectedRoleButton,
            ]}
            onPress={() => setRole(roleOption)}
          >
            <Text
              style={[
                styles.roleButtonText,
                role === roleOption && styles.selectedRoleButtonText,
              ]}
            >
              {roleOption}
            </Text>
          </TouchableOpacity>
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
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter player name"
                placeholderTextColor="#94a3b8"
                autoCapitalize="words"
              />
            </View>

            {renderRoleSelector()}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Team (Optional)</Text>
              <TextInput
                style={styles.input}
                value={team}
                onChangeText={setTeam}
                placeholder="Enter team name"
                placeholderTextColor="#94a3b8"
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Batting Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏏 Batting Statistics</Text>
            <View style={styles.statsGrid}>
              {renderStatInput('Matches', 'matches')}
              {renderStatInput('Runs', 'runs')}
              {renderStatInput('Balls Faced', 'balls')}
              {renderStatInput('Fours', 'fours')}
              {renderStatInput('Sixes', 'sixes')}
            </View>
          </View>

          {/* Bowling Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Bowling Statistics</Text>
            <View style={styles.statsGrid}>
              {renderStatInput('Wickets', 'wickets')}
              {renderStatInput('Overs', 'overs')}
              {renderStatInput('Runs Conceded', 'runsConceded')}
              {renderStatInput('Maidens', 'maidens')}
            </View>
          </View>

          {/* Fielding Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✋ Fielding Statistics</Text>
            <View style={styles.statsGrid}>
              {renderStatInput('Catches', 'catches')}
              {renderStatInput('Stumpings', 'stumpings')}
              {renderStatInput('Run Outs', 'runOuts')}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetStats}
            >
              <Text style={styles.resetButtonText}>Reset All Statistics</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Updating...' : 'Update Player'}
          </Text>
        </TouchableOpacity>
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
    padding: 20,
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  roleContainer: {
    marginBottom: 16,
  },
  roleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  roleButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  selectedRoleButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  roleButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedRoleButtonText: {
    color: '#ffffff',
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
  actionSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#374151',
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    marginLeft: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#6b7280',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
