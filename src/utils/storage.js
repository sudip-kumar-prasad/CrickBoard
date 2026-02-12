import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Removed

const COLLECTIONS = {
  PLAYERS: 'players',
  MATCHES: 'matches',
  VICTORY_POSTS: 'victory_posts',
  TOURNAMENTS: 'tournaments',
};

export class StorageService {

  static getUserId() {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    return user.uid;
  }

  // Player management
  static async getPlayers() {
    try {
      const userId = this.getUserId();
      const q = query(collection(db, 'users', userId, COLLECTIONS.PLAYERS));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting players:', error);
      return [];
    }
  }

  static async savePlayers(players) {
    // No-op: Firestore saves individually. 
    // This method might need to be removed or adapted if the app calls it with a full list.
    // Checking usage: The original code had addPlayer calling savePlayers with the full list.
    // The new addPlayer will handle adding to Firestore directly.
    // We'll keep this as a no-op or log a warning to avoid breaking calls, 
    // but ideally we refactor the caller.
    console.warn("savePlayers is deprecated in favor of direct Firestore operations");
  }

  static async addPlayer(player) {
    try {
      const userId = this.getUserId();
      // Ensure player has an ID or let Firestore generate one. 
      // If the app generates IDs (e.g. Date.now()), we can use setDoc with that ID
      // or just addDoc and let Firestore key it.
      // If we use addDoc, the ID is in the doc ref.
      // Existing app likely generates an 'id' field in the 'player' object.

      const playerRef = player.id
        ? doc(db, 'users', userId, COLLECTIONS.PLAYERS, player.id.toString())
        : doc(collection(db, 'users', userId, COLLECTIONS.PLAYERS));

      await setDoc(playerRef, player);
    } catch (error) {
      console.error('Error adding player:', error);
    }
  }

  static async updatePlayer(updatedPlayer) {
    try {
      const userId = this.getUserId();
      if (!updatedPlayer.id) throw new Error("Player ID required for update");

      const playerRef = doc(db, 'users', userId, COLLECTIONS.PLAYERS, updatedPlayer.id.toString());
      await updateDoc(playerRef, updatedPlayer);
    } catch (error) {
      console.error('Error updating player:', error);
    }
  }

  static async deletePlayer(playerId) {
    try {
      const userId = this.getUserId();
      const playerRef = doc(db, 'users', userId, COLLECTIONS.PLAYERS, playerId.toString());
      await deleteDoc(playerRef);
    } catch (error) {
      console.error('Error deleting player:', error);
    }
  }

  // Match management
  static async getMatches() {
    try {
      const userId = this.getUserId();
      const q = query(collection(db, 'users', userId, COLLECTIONS.MATCHES), orderBy('date', 'desc')); // Assuming 'date' field exists, or sort client side
      // If no date field, remove orderBy
      const querySnapshot = await getDocs(q);
      const matches = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort client side just in case to match original behavior (newest first usually)
      return matches.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    } catch (error) {
      console.error('Error getting matches:', error);
      return [];
    }
  }

  static async saveMatches(matches) {
    console.warn("saveMatches is deprecated");
  }

  static async addMatch(match) {
    try {
      const userId = this.getUserId();
      const matchRef = match.id
        ? doc(db, 'users', userId, COLLECTIONS.MATCHES, match.id.toString())
        : doc(collection(db, 'users', userId, COLLECTIONS.MATCHES));

      await setDoc(matchRef, match);
    } catch (error) {
      console.error('Error adding match:', error);
    }
  }

  static async deleteMatch(matchId) {
    try {
      const userId = this.getUserId();
      const matchRef = doc(db, 'users', userId, COLLECTIONS.MATCHES, matchId.toString());
      await deleteDoc(matchRef);
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  }

  // Victory Post management - GLOBAL/SHARED
  static async getVictoryPosts() {
    try {
      const q = query(collection(db, COLLECTIONS.VICTORY_POSTS), orderBy('createdAt', 'desc')); // Assuming createdAt
      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Fallback sort if query index missing
      return posts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } catch (error) {
      console.error('Error getting victory posts:', error);
      return [];
    }
  }

  static async saveVictoryPosts(posts) {
    console.warn("saveVictoryPosts is deprecated");
  }

  static async addVictoryPost(post) {
    try {
      const userId = this.getUserId();
      // Add author info
      const enrichedPost = {
        ...post,
        authorId: userId,
        createdAt: new Date().toISOString()
      };

      const postRef = post.id
        ? doc(db, COLLECTIONS.VICTORY_POSTS, post.id.toString())
        : doc(collection(db, COLLECTIONS.VICTORY_POSTS));

      await setDoc(postRef, enrichedPost);
    } catch (error) {
      console.error('Error adding victory post:', error);
    }
  }

  static async deleteVictoryPost(postId) {
    try {
      const userId = this.getUserId();
      const postRef = doc(db, COLLECTIONS.VICTORY_POSTS, postId.toString());
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        const postData = postSnap.data();
        if (postData.authorId !== userId) {
          throw new Error("Cannot delete post owned by another user");
        }
        await deleteDoc(postRef);
      }
    } catch (error) {
      console.error('Error deleting victory post:', error);
    }
  }

  // Tournament management
  static async getTournaments() {
    try {
      const userId = this.getUserId();
      const q = query(collection(db, 'users', userId, COLLECTIONS.TOURNAMENTS));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting tournaments:', error);
      return [];
    }
  }

  static async saveTournaments(tournaments) {
    console.warn("saveTournaments is deprecated");
  }

  static async addTournament(tournament) {
    try {
      const userId = this.getUserId();
      const tourRef = tournament.id
        ? doc(db, 'users', userId, COLLECTIONS.TOURNAMENTS, tournament.id.toString())
        : doc(collection(db, 'users', userId, COLLECTIONS.TOURNAMENTS));

      await setDoc(tourRef, tournament);
    } catch (error) {
      console.error('Error adding tournament:', error);
    }
  }

  static async recordMatch(match) {
    await this.addMatch(match);
  }

  // Utility functions
  static async clearAllData() {
    // For Firestore, this is dangerous/expensive to implement as "delete everything".
    // We can just clear local auth storage which effectively "resets" the view for the user
    try {
      // await auth.signOut(); // Or logic to wipe collections (too risky for a simple utility)
      console.warn("clearAllData not fully implemented for Firestore");
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}
