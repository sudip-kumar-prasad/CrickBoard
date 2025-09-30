import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput as PaperTextInput, Button, Chip, Card } from 'react-native-paper';
import { StorageService } from '../utils/storage';
import { createPlayer, createPlayerStats } from '../types';

export default function AddPlayerScreen({ navigation }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Batsman');
  const [team, setTeam] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter player name');
      return;
    }

    setLoading(true);

    try {
      const newPlayer = createPlayer(
        generateId(),
        name.trim(),
        role,
        team.trim() || undefined,
        createPlayerStats(),
        new Date(),
        new Date()
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.form}>
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

          <Card mode="elevated" style={styles.infoBox}>
            <Card.Content>
              <Text style={styles.infoTitle}>📊 Initial Stats</Text>
              <Text style={styles.infoText}>
                All statistics will start at 0. They will be updated automatically when you record match performances.
              </Text>
            </Card.Content>
          </Card>
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
  inputGroup: {
    marginBottom: 25,
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
    marginBottom: 20,
  },
  roleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  roleChip: {
    marginRight: 6,
  },
  infoBox: {
    borderRadius: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
    fontWeight: '500',
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
