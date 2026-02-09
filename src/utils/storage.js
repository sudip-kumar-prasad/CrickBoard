import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  PLAYERS: 'crickboard_players',
  MATCHES: 'crickboard_matches',
  VICTORY_POSTS: 'crickboard_victory_posts',
  TOURNAMENTS: 'crickboard_tournaments',
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

  static async deleteMatch(matchId) {
    try {
      const matches = await this.getMatches();
      const filteredMatches = matches.filter(m => m.id !== matchId);
      await this.saveMatches(filteredMatches);
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  }

  // Victory Post management
  static async getVictoryPosts() {
    try {
      const postsJson = await AsyncStorage.getItem(STORAGE_KEYS.VICTORY_POSTS);
      return postsJson ? JSON.parse(postsJson) : [];
    } catch (error) {
      console.error('Error getting victory posts:', error);
      return [];
    }
  }

  static async saveVictoryPosts(posts) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VICTORY_POSTS, JSON.stringify(posts));
    } catch (error) {
      console.error('Error saving victory posts:', error);
    }
  }

  static async addVictoryPost(post) {
    try {
      const posts = await this.getVictoryPosts();
      // Remove any existing post for the same match ID to avoid duplicates
      const filteredPosts = posts.filter(p => p.matchId !== post.matchId);
      filteredPosts.unshift(post); // Newest first
      await this.saveVictoryPosts(filteredPosts);
    } catch (error) {
      console.error('Error adding victory post:', error);
    }
  }

  static async deleteVictoryPost(postId) {
    try {
      const posts = await this.getVictoryPosts();
      const filteredPosts = posts.filter(p => p.id !== postId);
      await this.saveVictoryPosts(filteredPosts);
    } catch (error) {
      console.error('Error deleting victory post:', error);
    }
  }

  // Tournament management
  static async getTournaments() {
    try {
      const tournamentsJson = await AsyncStorage.getItem(STORAGE_KEYS.TOURNAMENTS);
      return tournamentsJson ? JSON.parse(tournamentsJson) : [];
    } catch (error) {
      console.error('Error getting tournaments:', error);
      return [];
    }
  }

  static async saveTournaments(tournaments) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(tournaments));
    } catch (error) {
      console.error('Error saving tournaments:', error);
    }
  }

  static async addTournament(tournament) {
    try {
      const tournaments = await this.getTournaments();
      tournaments.unshift(tournament); // Newest first
      await this.saveTournaments(tournaments);
    } catch (error) {
      console.error('Error adding tournament:', error);
    }
  }

  static async recordMatch(match) {
    await this.addMatch(match);
  }

  // Utility functions
  static async clearAllData() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.PLAYERS,
        STORAGE_KEYS.MATCHES,
        STORAGE_KEYS.TOURNAMENTS
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}
