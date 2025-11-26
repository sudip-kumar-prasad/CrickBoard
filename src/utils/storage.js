import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatsCalculator } from './calculations';

const STORAGE_KEYS = {
  PLAYERS: 'crickboard_players',
  MATCHES: 'crickboard_matches',
};

export class StorageService {
  // Player management
  static async getPlayers() {
    try {
      const playersJson = await AsyncStorage.getItem(STORAGE_KEYS.PLAYERS);
      return playersJson ? JSON.parse(playersJson) : [];
    } catch (error) {
      console.error('Error getting players:', error);
      return [];
    }
  }

  static async savePlayers(players) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    } catch (error) {
      console.error('Error saving players:', error);
    }
  }

  static async addPlayer(player) {
    try {
      const players = await this.getPlayers();
      players.push(player);
      await this.savePlayers(players);
    } catch (error) {
      console.error('Error adding player:', error);
    }
  }

  static async updatePlayer(updatedPlayer) {
    try {
      const players = await this.getPlayers();
      const index = players.findIndex(p => p.id === updatedPlayer.id);
      if (index !== -1) {
        players[index] = updatedPlayer;
        await this.savePlayers(players);
      }
    } catch (error) {
      console.error('Error updating player:', error);
    }
  }

  static async deletePlayer(playerId) {
    try {
      const players = await this.getPlayers();
      const filteredPlayers = players.filter(p => p.id !== playerId);
      await this.savePlayers(filteredPlayers);
    } catch (error) {
      console.error('Error deleting player:', error);
    }
  }

  // Match management
  static async getMatches() {
    try {
      const matchesJson = await AsyncStorage.getItem(STORAGE_KEYS.MATCHES);
      return matchesJson ? JSON.parse(matchesJson) : [];
    } catch (error) {
      console.error('Error getting matches:', error);
      return [];
    }
  }

  static async saveMatches(matches) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
    } catch (error) {
      console.error('Error saving matches:', error);
    }
  }

  static async addMatch(match) {
    try {
      const matches = await this.getMatches();
      matches.push(match);
      await this.saveMatches(matches);
    } catch (error) {
      console.error('Error adding match:', error);
    }
  }

  static async recordMatch(match) {
    try {
      const players = await this.getPlayers();
      const playerPerformances = new Map(
        (match.performances || []).map(perf => [perf.playerId, perf])
      );

      const updatedPlayers = players.map(player => {
        const performance = playerPerformances.get(player.id);
        if (!performance) {
          return player;
        }

        const matchStats = {
          batting: {
            runs: Number(performance.runs) || 0,
            balls: Number(performance.balls) || 0,
            fours: Number(performance.fours) || 0,
            sixes: Number(performance.sixes) || 0,
          },
          bowling: {
            wickets: Number(performance.wickets) || 0,
            overs: Number(performance.overs) || 0,
            runs: Number(performance.runsConceded) || 0,
            maidens: Number(performance.maidens) || 0,
          },
          fielding: {
            catches: Number(performance.catches) || 0,
            stumpings: Number(performance.stumpings) || 0,
            runOuts: Number(performance.runOuts) || 0,
          },
        };

        const updatedStats = StatsCalculator.updatePlayerStats(
          player.stats,
          matchStats
        );

        return {
          ...player,
          stats: updatedStats,
          updatedAt: new Date().toISOString(),
        };
      });

      await this.savePlayers(updatedPlayers);
      const matches = await this.getMatches();
      matches.unshift(match);
      await this.saveMatches(matches);
    } catch (error) {
      console.error('Error recording match:', error);
    }
  }

  // Utility functions
  static async clearAllData() {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.PLAYERS, STORAGE_KEYS.MATCHES]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}
