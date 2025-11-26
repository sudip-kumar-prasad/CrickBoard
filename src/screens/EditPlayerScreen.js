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

export default function EditPlayerScreen({ navigation, route }) {
  const { player } = route.params;
  const [name, setName] = useState(player.name);
  const [role, setRole] = useState(player.role);
  const [team, setTeam] = useState(player.team || '');
  const [loading, setLoading] = useState(false);

  const roles = ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter player name');
      return;
    }

    setLoading(true);

    try {
      const updatedPlayer = {
        ...player,
        name: name.trim(),
        role,
        team: team.trim() || undefined,
        updatedAt: new Date(),
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.form}>
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

          <View style={styles.statsInfo}>
            <Text style={styles.statsTitle}>📊 Current Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{player.stats.matches}</Text>
                <Text style={styles.statLabel}>Matches</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{player.stats.runs}</Text>
                <Text style={styles.statLabel}>Runs</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{player.stats.wickets}</Text>
                <Text style={styles.statLabel}>Wickets</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{player.stats.catches}</Text>
                <Text style={styles.statLabel}>Catches</Text>
              </View>
            </View>
            <Text style={styles.statsNote}>
              Statistics are automatically updated when you record match performances.
            </Text>
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  roleContainer: {
    marginBottom: 20,
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
    backgroundColor: '#1e293b',
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
  statsInfo: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#0f172a',
    borderRadius: 6,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#60a5fa',
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  statsNote: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
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
