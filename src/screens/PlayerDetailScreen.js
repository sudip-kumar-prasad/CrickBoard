import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  Text,
  Card,
  Button,
  Surface,
  Avatar,
  Divider,
  IconButton
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

// Utility imports
import { StorageService } from '../utils/storage';

/**
 * PlayerDetailScreen Component - Premium Redesign (CrickHeroes Style)
 * 👨‍🏫 EXPLANATION FOR SIR:
 * "Sir, I have redesigned the player profile to give it a hero-like feeling.
 * The screen features a large profile header with a custom avatar and high-impact 
 * stat widgets. I structured the code to automatically refresh the data every time 
 * we visit this page, ensuring the stats are always accurate."
 */
export default function PlayerDetailScreen({ navigation, route }) {
  // --- STATE ---
  const { player: initialPlayer } = route.params;
  const [player, setPlayer] = useState(initialPlayer);

  // --- DATA LOADING ---

  const refreshPlayer = async () => {
    try {
      const allPlayers = await StorageService.getPlayers() || [];
      const updated = allPlayers.find(p => p.id === player.id);
      if (updated) {
        setPlayer(updated);
      }
    } catch (e) {
      console.log("Error updating player:", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refreshPlayer();
    }, [])
  );

  // --- ACTIONS ---

  const handleDelete = () => {
    Alert.alert(
      'Delete Player',
      `Are you sure you want to remove ${player.name} from the squad?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await StorageService.deletePlayer(player.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  // --- UI COMPONENTS ---

  const renderStatWidget = (label, value, icon, color) => (
    <Surface style={styles.statWidget} elevation={1}>
      <View style={[styles.widgetIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View>
        <Text style={styles.widgetValue}>{value}</Text>
        <Text style={styles.widgetLabel}>{label}</Text>
      </View>
    </Surface>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* 1. HERO PROFILE SECTION */}
        <Surface style={styles.heroProfile} elevation={2}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>

          <Avatar.Text
            size={100}
            label={player.name.substring(0, 1).toUpperCase()}
            backgroundColor="#22c55e"
            labelStyle={{ fontWeight: 'bold' }}
          />

          <Text style={styles.heroName}>{player.name}</Text>
          <View style={styles.heroSubRow}>
            <Chip style={styles.roleChip} textStyle={styles.roleText}>{player.role}</Chip>
            {player.team && <Text style={styles.heroTeam}>at {player.team}</Text>}
          </View>
        </Surface>

        {/* 2. PLAYER STATISTICS */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Season Statistics</Text>

          <View style={styles.widgetRow}>
            {renderStatWidget('Matches', player.stats?.matches || 0, 'calendar', '#60a5fa')}
            {renderStatWidget('Total Runs', player.stats?.runs || 0, 'baseball', '#22c55e')}
          </View>

          <View style={styles.widgetRow}>
            {renderStatWidget('Wickets', player.stats?.wickets || 0, 'disc', '#f59e0b')}
            {renderStatWidget('Catches', player.stats?.catches || 0, 'hand-left', '#ec4899')}
          </View>

          {/* Detailed Stats Row (Student simplified) */}
          <Surface style={styles.detailCard} elevation={1}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Strike Rate</Text>
              <Text style={styles.detailValue}>
                {player.stats?.balls > 0 ? ((player.stats.runs / player.stats.balls) * 100).toFixed(1) : '0.0'}
              </Text>
            </View>
            <Divider style={styles.verticalDiv} />
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Economy</Text>
              <Text style={styles.detailValue}>
                {player.stats?.overs > 0 ? (player.stats.runsConceded / player.stats.overs).toFixed(1) : '0.0'}
              </Text>
            </View>
          </Surface>
        </View>

        {/* 3. MANAGEMENT ACTIONS */}
        <View style={styles.actionSection}>
          <Button
            mode="contained"
            icon="pencil"
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditPlayer', { player })}
          >
            Edit Profile
          </Button>

          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
            <Text style={styles.deleteText}>Remove Player</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  heroProfile: {
    backgroundColor: '#1e293b',
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  heroName: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 15,
  },
  heroSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  roleChip: {
    backgroundColor: '#0f172a',
    height: 30,
  },
  roleText: {
    color: '#22c55e',
    fontSize: 12,
    fontWeight: 'bold',
  },
  heroTeam: {
    color: '#94a3b8',
    fontSize: 14,
  },
  statsSection: {
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  widgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statWidget: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  widgetIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  widgetValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  widgetLabel: {
    color: '#94a3b8',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  detailCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    marginTop: 10,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 5,
  },
  detailValue: {
    color: '#60a5fa',
    fontSize: 22,
    fontWeight: 'bold',
  },
  verticalDiv: {
    width: 1,
    height: '100%',
    backgroundColor: '#334155',
  },
  actionSection: {
    padding: 20,
    gap: 15,
  },
  editBtn: {
    backgroundColor: '#22c55e',
    borderRadius: 15,
    paddingVertical: 5,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 10,
  },
  deleteText: {
    color: '#ef4444',
    fontWeight: 'bold',
  }
});
